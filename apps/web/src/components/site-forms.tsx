"use client";
import Link from "next/link";
import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";
type Result = { message?: string; unsubscribeToken?: string };
export function EnquiryForm({ topic = "general" }: { topic?: string }) {
  const ready = useHydrated();
  const [busy, setBusy] = useState(false),
    [result, setResult] = useState<Result>(),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/v1/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          topic: data.get("topic"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
      });
      const body = await r.json();
      if (!r.ok)
        throw new Error(
          body.message ?? "Your request could not be saved. Please try again.",
        );
      setResult(body);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again shortly.");
    } finally {
      setBusy(false);
    }
  }
  if (result)
    return (
      <div className="panel form-success" role="status">
        <span className="eyebrow">REQUEST RECEIVED</span>
        <h2>Thank you for reaching out.</h2>
        <p>{result.message}</p>
        <Link className="button secondary" href="/marketplace">
          Explore hardware
        </Link>
      </div>
    );
  return (
    <form method="post" className="panel enquiry-form" onSubmit={submit}>
      <h2>Tell us what you have in mind.</h2>
      <div className="form-grid">
        <label>
          Name
          <input name="name" autoComplete="name" required maxLength={100} />
        </label>
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
      </div>
      <label>
        What can we help with?
        <select
          name="topic"
          defaultValue={
            ["hardware", "hosting", "support", "privacy"].includes(topic)
              ? topic
              : "general"
          }
        >
          <option value="general">Getting started</option>
          <option value="hardware">Hardware pricing</option>
          <option value="hosting">Hosting locations</option>
          <option value="support">Account support</option>
          <option value="privacy">Privacy request</option>
        </select>
      </label>
      <label>
        Your requirements
        <textarea
          name="message"
          required
          minLength={10}
          maxLength={2000}
          rows={5}
          placeholder="Tell us about your budget, equipment or preferred hosting location."
        />
      </label>
      <label className="form-trap" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox-label">
        <input name="consent" type="checkbox" required />I agree that HashNomads
        can use my details to handle this enquiry.{" "}
        <Link href="/legal">Privacy information</Link>
      </label>
      <button className="button primary" disabled={!ready || busy}>
        {busy ? "Sending…" : "Send enquiry"}
      </button>
      <p className="form-note">
        Please leave out wallet keys, recovery phrases and payment credentials.
      </p>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
export function Newsletter() {
  const ready = useHydrated();
  const [busy, setBusy] = useState(false),
    [result, setResult] = useState<Result>(),
    [error, setError] = useState("");
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    setBusy(true);
    setError("");
    try {
      const r = await fetch("/api/v1/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
        }),
      });
      const body = await r.json();
      if (!r.ok) throw new Error(body.message ?? "Please try again.");
      setResult(body);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  if (result)
    return (
      <div className="newsletter-form" role="status">
        <h3>Subscription saved.</h3>
        <p>You’re on the HashNomads update list.</p>
        <Link
          className="text-link"
          href={`/unsubscribe?token=${encodeURIComponent(result.unsubscribeToken ?? "")}`}
        >
          Manage your subscription
        </Link>
      </div>
    );
  return (
    <form method="post" className="newsletter-form" onSubmit={submit}>
      <label>
        Email address
        <input
          name="email"
          type="email"
          required
          maxLength={254}
          autoComplete="email"
          placeholder="you@example.com"
        />
      </label>
      <label className="form-trap" aria-hidden="true">
        Website
        <input name="website" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="checkbox-label">
        <input name="consent" type="checkbox" required />
        I’d like to receive HashNomads news by email.{" "}
        <Link href="/legal">Privacy information</Link>
      </label>
      <button className="button primary" disabled={!ready || busy}>
        {busy ? "Saving…" : "Subscribe"}
      </button>
      {error && (
        <p className="error-message" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
