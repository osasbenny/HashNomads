import { EnquiryForm } from "@/components/site-forms";
import { commercial } from "@/lib/commercial";
import { ArrowUpRight } from "lucide-react";
export const metadata = { title: "Talk to a mining advisor" };
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;
  return (
    <div className="container page contact-grid">
      <div>
        <span className="eyebrow">LET’S TALK BITCOIN MINING</span>
        <h1>
          Your questions.
          <br />
          <span className="text-accent">Our next conversation.</span>
        </h1>
        <p className="page-intro">
          Tell us about your plans and we’ll help you work through the hardware,
          hosting and economics.
        </p>
        <a className="contact-email" href="mailto:info@hashnomads.com">
          info@hashnomads.com <ArrowUpRight size={18} />
        </a>
        <div className="contact-booking">
          <span className="eyebrow">PREFER TO BOOK A CALL?</span>
          <h3>Choose a time with an advisor.</h3>
          <p>
            Appointments are handled through the Sazmining advisor booking
            service.
          </p>
          <a
            className="button secondary"
            href={commercial.advisor}
            target="_blank"
            rel="noreferrer"
          >
            Book a consultation <ArrowUpRight size={18} />
          </a>
        </div>
      </div>
      <EnquiryForm topic={topic} />
    </div>
  );
}
