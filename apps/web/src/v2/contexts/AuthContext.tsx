import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { authClient } from "@/lib/auth-client";
import type { Profile } from "@v2/types";
type Viewer = { id: string; email: string };
type Session = { user: Viewer };
interface AuthContextValue {
  session: Session | null; user: Viewer | null; profile: Profile | null; loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}
const AuthContext = createContext<AuthContextValue | undefined>(undefined);
export function AuthProvider({children}: {children:ReactNode}) {
  const [session,setSession]=useState<Session|null>(null);
  const [user,setUser]=useState<Viewer|null>(null);
  const [profile,setProfile]=useState<Profile|null>(null);
  const [loading,setLoading]=useState(true);
  const reload=async()=>{
    // A direct, uncached read avoids stale client session state immediately
    // after the Better Auth sign-up and sign-in responses set cookies.
    const response=await fetch("/api/auth/get-session",{credentials:"same-origin",cache:"no-store"});
    if(!response.ok)throw new Error("Unable to confirm the current session");
    const result=await response.json() as {user?:Viewer|null};
    const current=result.user;
    if (!current) {setSession(null);setUser(null);setProfile(null);return;}
    const viewer={id:current.id,email:current.email};
    setUser(viewer);setSession({user:viewer});
    const response=await fetch("/api/v2/profile",{cache:"no-store",credentials:"same-origin"});
    if(response.ok) setProfile((await response.json()).profile as Profile);
    else setProfile(null);
  };
  useEffect(()=>{let live=true;reload().catch(()=>{}).finally(()=>{if(live)setLoading(false)});return()=>{live=false}},[]);
  const signIn=async(email:string,password:string)=>{
    const r=await authClient.signIn.email({email,password});
    if(r.error)return{error:r.error.message||"Unable to sign in"};
    await reload();return{error:null};
  };
  const signUp=async(email:string,password:string,fullName:string)=>{
    const r=await authClient.signUp.email({email,password,name:fullName});
    if(r.error)return{error:r.error.message||"Unable to create account"};
    await reload();return{error:null};
  };
  const signOut=async()=>{await authClient.signOut();setSession(null);setUser(null);setProfile(null)};
  return <AuthContext.Provider value={{session,user,profile,loading,signIn,signUp,signOut,refreshProfile:reload}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error("useAuth must be used within AuthProvider");return ctx;}
