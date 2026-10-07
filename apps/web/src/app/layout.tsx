import type { Metadata } from "next";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { ContactWidget } from "@/components/contact-widget";
import "./globals.css";
import { DesignAwareChrome } from "@/components/v2-chrome";
export const metadata: Metadata = {
  title: {
    default: "HashNomads — Own the machine",
    template: "%s | HashNomads",
  },
  description:
    "An ownership-first Bitcoin mining infrastructure platform. Identifiable hardware, transparent infrastructure, and customer-controlled Bitcoin.",
  metadataBase: new URL("https://hashnomads.vercel.app"),
  robots: { index: true, follow: true },
  openGraph: {
    title: "HashNomads — Own your Bitcoin mining",
    description:
      "Explore mining hardware, hosting locations, and the economics of Bitcoin ownership.",
    type: "website",
    images: [
      { url: "/images/mining-infrastructure.webp", width: 830, height: 1080 },
    ],
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem('hashnomads-theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){}`,
          }}
        />
      </head>
      <body><DesignAwareChrome>{children}</DesignAwareChrome></body>
    </html>
  );
}
