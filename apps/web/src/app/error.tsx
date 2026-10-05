"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="container page">
      <span className="eyebrow">TEMPORARILY UNAVAILABLE</span>
      <h1>We couldn’t load this page.</h1>
      <p className="page-intro">
        Your persisted records are unaffected. Try loading the page again.
      </p>
      <button className="button primary" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
