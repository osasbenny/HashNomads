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
  ].map((path) => ({ url: `https://hashnomads.vercel.app${path}` }));
}
