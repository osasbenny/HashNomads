import type { MetadataRoute } from "next";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    "",
    "/marketplace",
    "/marketplace/s21-pro",
    "/facilities",
    "/calculator",
    "/how-it-works",
    "/about",
    "/faq",
    "/transparency",
    "/legal",
    "/contact",
    "/resources",
    "/security",
    "/roadmap",
    "/documentation",
    "/support",
    "/api-reference",
    "/status",
    "/terms",
    "/privacy",
    "/risk-disclosure",
    "/kyc-requirements",
  ].map((path) => ({ url: `https://hashnomads.vercel.app${path}` }));
}
