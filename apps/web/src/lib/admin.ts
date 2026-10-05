import "server-only";
import { getAuth } from "@/lib/auth";
export async function isAdministrator(headers: Headers) {
  const session = await getAuth().api.getSession({ headers });
  return (
    session?.user.role === "admin" && session.user.twoFactorEnabled === true
  );
}
