"use client";
import { createAuthClient } from "better-auth/react";
import { useState } from "react";
import { ShieldCheck } from "lucide-react";
const authClient = createAuthClient();
export function Account() {
  const { data: session, isPending } = authClient.useSession();
  const [mode, setMode] = useState<"signin" | "signup">("signin"),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    const data = new FormData(event.currentTarget),
      email = String(data.get("email")),
      password = String(data.get("password"));
    try {
      const result =
        mode === "signup"
          ? await authClient.signUp.email({
              name: String(data.get("name")),
              email,
              password,
            })
          : await authClient.signIn.email({ email, password });
      if (result.error)
        setMessage(
          result.error.message ?? "Unable to authenticate. Try again.",
        );
    } catch {
      setMessage("Account service is unavailable. Please try again shortly.");
    } finally {
      setBusy(false);
    }
  }
  if (isPending)
    return (
      <div className="panel" aria-busy="true">
        Loading your session…
      </div>
    );
  if (session)
    return (
      <div className="panel account-panel">
        <ShieldCheck className="text-accent" size={32} />
        <h2>Welcome, {session.user.name}.</h2>
        <p>You’re signed in to the HashNomads sandbox.</p>
        <dl className="spec-list">
          <div>
            <dt>Email</dt>
            <dd>{session.user.email}</dd>
          </div>
          <div>
            <dt>Environment</dt>
            <dd>Sandbox</dd>
          </div>
        </dl>
        <div className="callout">
          Account authentication is available. Profile/KYC, orders, wallets, and
          the customer portal are still under implementation. No live services
          are available.
        </div>
        <button
          className="button secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            await authClient.signOut();
            setBusy(false);
          }}
        >
          Sign out
        </button>
      </div>
    );
  return (
    <div className="panel account-panel">
      <div className="account-tabs">
        <button
          aria-pressed={mode === "signin"}
          onClick={() => {
            setMode("signin");
            setMessage("");
          }}
        >
          Sign in
        </button>
        <button
          aria-pressed={mode === "signup"}
          onClick={() => {
            setMode("signup");
            setMessage("");
          }}
        >
          Create account
        </button>
      </div>
      <h2>
        {mode === "signin"
          ? "Back to your infrastructure."
          : "Start your sandbox journey."}
      </h2>
      <form onSubmit={submit}>
        {mode === "signup" && (
          <label>
            Name
            <input name="name" autoComplete="name" required maxLength={100} />
          </label>
        )}
        <label>
          Email address
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            maxLength={254}
          />
        </label>
        <label>
          Password
          <input
            name="password"
            type="password"
            autoComplete={
              mode === "signup" ? "new-password" : "current-password"
            }
            required
            minLength={12}
            maxLength={128}
          />
        </label>
        <p className="form-note">
          At least 12 characters. Use synthetic details for sandbox testing.
        </p>
        {mode === "signup" && (
          <label className="checkbox-label">
            <input type="checkbox" required />I understand this is a sandbox and
            have read the <a href="/legal">development disclosures</a>.
          </label>
        )}
        <button className="button primary full" disabled={busy}>
          {busy
            ? "Please wait…"
            : mode === "signin"
              ? "Sign in"
              : "Create sandbox account"}
        </button>
        {message && (
          <p className="error-message" role="alert">
            {message}
          </p>
        )}
      </form>
      <p className="form-note">
        Never share a Bitcoin private key or recovery phrase. Production email
        verification, recovery, and MFA are not yet enabled.
      </p>
    </div>
  );
}
