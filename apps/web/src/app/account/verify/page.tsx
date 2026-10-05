"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export default function Page() {
  const [backup, setBackup] = useState(false),
    [busy, setBusy] = useState(false),
    [message, setMessage] = useState("");
  return (
    <div className="container page editorial">
      <span className="eyebrow">ACCOUNT SECURITY</span>
      <h1>Verify your sign-in.</h1>
      <form
        className="panel"
        onSubmit={async (e) => {
          e.preventDefault();
          setBusy(true);
          setMessage("");
          const code = String(new FormData(e.currentTarget).get("code"));
          try {
            const r = backup
              ? await authClient.twoFactor.verifyBackupCode({ code })
              : await authClient.twoFactor.verifyTotp({ code });
            if (r.error)
              setMessage(r.error.message ?? "Check your code and try again.");
            else window.location.assign("/account");
          } catch {
            setMessage("Please try again shortly.");
          } finally {
            setBusy(false);
          }
        }}
      >
        <label>
          {backup ? "Recovery code" : "Authenticator code"}
          <input
            name="code"
            autoComplete="one-time-code"
            required
            maxLength={30}
          />
        </label>
        <button className="button primary" disabled={busy}>
          {busy ? "Verifying…" : "Verify sign-in"}
        </button>
        <button
          className="text-button"
          type="button"
          onClick={() => setBackup(!backup)}
        >
          {backup ? "Use an authenticator code" : "Use a recovery code"}
        </button>
        {message && (
          <p role="alert" className="error-message">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
