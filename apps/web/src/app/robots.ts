import type { MetadataRoute } from "next";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/account",
        "/operations",
        "/api/",
        "/unsubscribe",
        "/admin-setup",
      ],
    },
    sitemap: "https://hashnomads.vercel.app/sitemap.xml",
  };
}
