"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
export default function Page() {
  const [token, setToken] = useState(""),
    [busy, setBusy] = useState(false),
    [done, setDone] = useState(false),
    [message, setMessage] = useState("");
  useEffect(() => {
    if (window.location.hash) setToken(window.location.hash.slice(1));
    history.replaceState(null, "", window.location.pathname);
  }, []);
  return (
    <div className="container page editorial">
      <span className="eyebrow">PRIVATE ADMINISTRATOR SETUP</span>
      <h1>Welcome to your inbox.</h1>
      <p className="page-intro">
        Set the password for admin@hashnomads.com. The private setup link can be
        used once and expires after 24 hours.
      </p>
      {done ? (
        <div className="panel">
          <p role="status">{message}</p>
          <Link className="button primary" href="/account">
            Sign in to your account
          </Link>
        </div>
      ) : (
        <form
          method="post"
          className="panel"
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setMessage("");
            const d = new FormData(e.currentTarget);
            const password = String(d.get("password"));
            if (password !== d.get("confirm")) {
              setMessage("The passwords do not match.");
              setBusy(false);
              return;
            }
            try {
              const r = await fetch("/api/v1/admin-setup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, password }),
              });
              const body = await r.json();
              setMessage(body.message);
              if (r.ok) {
                setDone(true);
                setToken("");
              }
            } catch {
              setMessage("Please try again shortly.");
            } finally {
              setBusy(false);
            }
          }}
        >
          <label>
            New administrator password
            <input
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
            />
          </label>
          <label>
            Confirm password
            <input
              name="confirm"
              type="password"
              autoComplete="new-password"
              required
              minLength={12}
              maxLength={128}
            />
          </label>
          <button className="button primary" disabled={!token || busy}>
            {busy ? "Setting up…" : "Set administrator password"}
          </button>
          <p className="error-message" role="alert">
            {message ||
              (!token
                ? "Open the private setup link provided by the deployment owner."
                : "")}
          </p>
        </form>
      )}
    </div>
  );
}
