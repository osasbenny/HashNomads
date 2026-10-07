"use client";
import { usePathname } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/site-shell";
import { ContactWidget } from "@/components/contact-widget";
export function DesignAwareChrome({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // Never overlay V1 chrome on the user-approved V2 design.
  const v2 = path === "/" || /^\/(login|signup|purchase|portal|admin)(\/|$)/.test(path);
  if (v2) return <>{children}</>;
  return <><a className="skip-link" href="#main">Skip to content</a><SiteHeader /><main id="main">{children}</main><SiteFooter /><ContactWidget /></>;
}
