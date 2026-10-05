import { Account } from "@/components/account";
export const metadata = {
  title: "Your account",
  robots: { index: false, follow: false },
};
export default function Page() {
  return (
    <div className="container page account-page">
      <div>
        <span className="eyebrow">YOUR HASHNOMADS ACCOUNT</span>
        <h1>
          Your infrastructure.
          <br />
          <span className="text-muted">One secure entry.</span>
        </h1>
        <p className="page-intro">Sign in or create your HashNomads account.</p>
      </div>
      <Account />
    </div>
  );
}
