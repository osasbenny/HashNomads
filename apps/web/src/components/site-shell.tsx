"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, Hexagon } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
export function Brand() {
  return (
    <Link className="brand" href="/" aria-label="HashNomads home">
      <span className="brand-mark">
        <Hexagon size={30} strokeWidth={1.5} />
        <b>H</b>
      </span>
      HashNomads<span className="brand-period">.</span>
    </Link>
  );
}
const navigation = [
  { href: "/marketplace", label: "Hardware" },
  { href: "/facilities", label: "Infrastructure" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/calculator", label: "Calculator" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Talk to an advisor" },
];
export function SiteHeader() {
  const pathname = usePathname(),
    [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [pathname]);
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand />
        <nav
          className={open ? "site-nav open" : "site-nav"}
          aria-label="Main navigation"
        >
          {navigation.map((item) => (
            <Link
              key={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              href={item.href}
            >
              {item.label}
            </Link>
          ))}
          <Link className="mobile-account" href="/account">
            Your account
          </Link>
        </nav>
        <Link className="button small header-account" href="/account">
          Your account
        </Link>
        <ThemeToggle />
        <button
          className="menu-toggle"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
    </header>
  );
}
export function SiteFooter() {
  const [year, setYear] = useState(new Date().getUTCFullYear());
  useEffect(() => {
    const id = setInterval(() => setYear(new Date().getUTCFullYear()), 60000);
    return () => clearInterval(id);
  }, []);
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-top">
          <div>
            <Brand />
            <p>
              Own the machine.
              <br />
              We run the infrastructure.
            </p>
          </div>
          <div>
            <span className="eyebrow">Explore</span>
            <Link href="/marketplace">Hardware</Link>
            <Link href="/facilities">Infrastructure</Link>
            <Link href="/calculator">Mining calculator</Link>
            <Link href="/resources">Mining resources</Link>
          </div>
          <div>
            <span className="eyebrow">Company</span>
            <Link href="/transparency">Transparency & risk</Link>
            <Link href="/about">About HashNomads</Link>
            <Link href="/faq">Frequently asked questions</Link>
            <Link href="/contact">Contact HashNomads</Link>
            <a href="mailto:info@hashnomads.com">info@hashnomads.com</a>
          </div>
          <div>
            <span className="eyebrow">Your Bitcoin. Your control.</span>
            <p>
              We never need your private keys
              <br />
              or recovery phrase.
            </p>
            <Link href="/legal">Legal & privacy</Link>
            <Link href="/account">Your account</Link>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {year} HashNomads. All rights reserved.</span>
          <span>Design & Developed By Cactus Digital Media</span>
        </div>
      </div>
    </footer>
  );
}
