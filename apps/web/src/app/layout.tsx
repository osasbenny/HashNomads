import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import "./globals.css";
export const metadata: Metadata = {
  title: {
    default: "HashNomads — Own the machine",
    template: "%s | HashNomads",
  },
  description:
    "An ownership-first Bitcoin mining infrastructure platform. Explore the clearly labelled sandbox. Customers control Bitcoin.",
  robots: { index: false, follow: false },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <div className="sandbox-bar">
          <span className="sandbox-dot" /> SANDBOX ENVIRONMENT{" "}
          <span className="bar-divider">/</span> Simulated infrastructure. No
          live purchases or mining.
        </div>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
