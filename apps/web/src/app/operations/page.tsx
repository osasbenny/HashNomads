import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@hashnomads/db";
import { getAuth } from "@/lib/auth";
import Link from "next/link";
import { EnquiryStatus } from "@/components/enquiry-status";
export const metadata = {
  title: "Enquiry inbox",
  robots: { index: false, follow: false },
};
export default async function Page() {
  const session = await getAuth().api.getSession({ headers: await headers() });
  if (!session) redirect("/account");
  if (session.user.role !== "admin")
    return (
      <div className="container page">
        <h1>Access restricted.</h1>
        <p>This inbox is available to HashNomads administrators.</p>
      </div>
    );
  if (!session.user.twoFactorEnabled)
    return (
      <div className="container page">
        <h1>Secure your administrator account.</h1>
        <p className="page-intro">
          Enable two-factor authentication before opening customer enquiries.
        </p>
        <Link className="button primary" href="/account">
          Open account security settings
        </Link>
      </div>
    );
  const [enquiries, subscriptions] = await Promise.all([
    db.siteEnquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    db.newsletterSubscription.count({ where: { unsubscribedAt: null } }),
  ]);
  return (
    <div className="container page">
      <span className="eyebrow">HASHNOMADS OPERATIONS</span>
      <h1>Customer enquiries.</h1>
      <p className="page-intro">
        {subscriptions} active newsletter subscriptions. Most recent 100
        enquiries.
      </p>
      <div className="enquiry-inbox">
        <a className="button secondary" href="/api/v1/operations/subscriptions">
          Export active subscriber list
        </a>
        {enquiries.length ? (
          enquiries.map((e) => (
            <article className="panel" key={e.id}>
              <span className="eyebrow">
                {e.topic} · {e.createdAt.toISOString().slice(0, 10)}
              </span>
              <h2>{e.name}</h2>
              <a className="text-link" href={`mailto:${e.email}`}>
                {e.email}
              </a>
              <p className="enquiry-message">{e.message}</p>
              <EnquiryStatus id={e.id} status={e.status} />
            </article>
          ))
        ) : (
          <p>No enquiries received yet.</p>
        )}
      </div>
    </div>
  );
}
