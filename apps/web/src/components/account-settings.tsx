"use client";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
export function AccountSettings({
  name,
  twoFactorEnabled,
}: {
  name: string;
  twoFactorEnabled: boolean;
}) {
  const [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false),
    [setup, setSetup] = useState<{
      totpURI: string;
      backupCodes: string[];
    } | null>(null);
  async function run(
    action: () => Promise<{ error?: { message?: string } | null }>,
  ) {
    setBusy(true);
    setMessage("");
    try {
      const result = await action();
      setMessage(result.error?.message ?? "Your account has been updated.");
    } catch {
      setMessage("We couldn’t update your account. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="account-settings">
      <details>
        <summary>Profile & password</summary>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            void run(() =>
              authClient.updateUser({ name: String(d.get("name")) }),
            );
          }}
        >
          <label>
            Your name
            <input name="name" required maxLength={100} defaultValue={name} />
          </label>
          <button className="button secondary" disabled={busy}>
            Save name
          </button>
        </form>
        <form
          method="post"
          onSubmit={(e) => {
            e.preventDefault();
            const d = new FormData(e.currentTarget);
            void run(() =>
              authClient.changePassword({
                currentPassword: String(d.get("currentPassword")),
                newPassword: String(d.get("newPassword")),
                revokeOtherSessions: true,
              }),
            );
          }}
        >
          <label>
            Current password
            <input
              name="currentPassword"
              type="password"
              required
              autoComplete="current-password"
            />
          </label>
          <label>
            New password
            <input
              name="newPassword"
              type="password"
              minLength={12}
              maxLength={128}
              required
              autoComplete="new-password"
            />
          </label>
          <button className="button secondary" disabled={busy}>
            Change password
          </button>
        </form>
      </details>
      <details>
        <summary>
          Two-factor authentication ·{" "}
          {twoFactorEnabled ? "Enabled" : "Not enabled"}
        </summary>
        <p>Add an authenticator app to protect sign-in with a second factor.</p>
        {!setup && (
          <form
            method="post"
            onSubmit={async (e) => {
              e.preventDefault();
              const password = String(
                new FormData(e.currentTarget).get("password"),
              );
              await run(async () => {
                if (twoFactorEnabled)
                  return authClient.twoFactor.disable({ password });
                const result = await authClient.twoFactor.enable({ password });
                if (result.data?.method === "totp") setSetup(result.data);
                return result;
              });
            }}
          >
            <label>
              Confirm your password
              <input
                name="password"
                type="password"
                required
                autoComplete="current-password"
              />
            </label>
            <button className="button secondary" disabled={busy}>
              {twoFactorEnabled
                ? "Disable two-factor authentication"
                : "Set up authenticator"}
            </button>
          </form>
        )}
        {setup && (
          <div className="mfa-setup">
            <p>
              Add the following setup key to your authenticator app. Keep it
              private.
            </p>
            <code>{new URL(setup.totpURI).searchParams.get("secret")}</code>
            <a className="text-link" href={setup.totpURI}>
              Open in an authenticator app
            </a>
            <form
              method="post"
              onSubmit={(e) => {
                e.preventDefault();
                const code = String(new FormData(e.currentTarget).get("code"));
                void run(() => authClient.twoFactor.verifyTotp({ code }));
              }}
            >
              <label>
                Authenticator code
                <input
                  name="code"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  autoComplete="one-time-code"
                  required
                />
              </label>
              <button className="button primary" disabled={busy}>
                Confirm authenticator
              </button>
            </form>
            <p>
              Save these recovery codes securely. Each code can be used once.
            </p>
            <div className="backup-codes">
              {setup.backupCodes.map((code) => (
                <code key={code}>{code}</code>
              ))}
            </div>
            <button className="text-button" onClick={() => setSetup(null)}>
              I’ve saved my recovery codes
            </button>
          </div>
        )}
      </details>
      <p role="status">{message}</p>
    </div>
  );
}
