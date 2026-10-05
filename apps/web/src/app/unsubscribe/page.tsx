"use client";
import { useEffect, useState } from "react";
export default function Page() {
  const [token, setToken] = useState(""),
    [message, setMessage] = useState(""),
    [busy, setBusy] = useState(false);
  useEffect(
    () =>
      setToken(new URLSearchParams(window.location.search).get("token") ?? ""),
    [],
  );
  return (
    <div className="container page editorial">
      <span className="eyebrow">YOUR EMAIL PREFERENCES</span>
      <h1>Manage your subscription.</h1>
      <p className="page-intro">
        Unsubscribe from HashNomads email updates using your subscription link.
      </p>
      <button
        className="button primary"
        disabled={!token || busy || message === "You have been unsubscribed."}
        onClick={async () => {
          setBusy(true);
          try {
            const r = await fetch("/api/v1/newsletter", {
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ token }),
            });
            const body = await r.json();
            setMessage(body.message);
          } catch {
            setMessage("Please try again shortly.");
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Updating…" : "Unsubscribe"}
      </button>
      <p role="status">{message}</p>
    </div>
  );
}
