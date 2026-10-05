import { Account } from "@/components/account";
export const metadata = { title: "Your account" };
export default function Page() {
  return (
    <div className="container page account-page">
      <div>
        <span className="eyebrow">YOUR ACCOUNT / SANDBOX</span>
        <h1>
          Your infrastructure.
          <br />
          <span className="text-muted">One secure entry.</span>
        </h1>
        <p className="page-intro">
          Sign in or create an evaluation account. No live mining services are
          available.
        </p>
      </div>
      <Account />
    </div>
  );
}
