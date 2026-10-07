import { Link } from 'react-router-dom';
import { Cpu, Mail } from 'lucide-react';
import { Twitter, Github, Linkedin } from '@v2/components/brand-icons';

export function Footer() {
  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'ASIC Marketplace', href: '/#miners' },
        { label: 'Hosting Facilities', href: '/#facilities' },
        { label: 'Profitability Calculator', href: '/#profitability' },
        { label: 'Customer Portal', href: '/portal' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About HashNomads', href: '/#about' },
        { label: 'Security & Compliance', href: '/#security' },
        { label: 'How It Works', href: '/#how-it-works' },
        { label: 'Roadmap', href: '/#roadmap' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/#faq' },
        { label: 'Support Center', href: '/portal/support' },
        { label: 'API Reference', href: '/#faq' },
        { label: 'Status Page', href: '/#platform' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/#faq' },
        { label: 'Privacy Policy', href: '/#faq' },
        { label: 'Risk Disclosure', href: '/#faq' },
        { label: 'KYC Requirements', href: '/#faq' },
      ],
    },
  ];

  return (
    <footer className="relative bg-ink-950 border-t border-ink-800/50 mt-20">
      <div className="absolute inset-0 bg-hero-radial opacity-30" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl clay-gold flex items-center justify-center">
                <Cpu className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-lg text-white">HashNomads</span>
            </Link>
            <p className="text-sm text-ink-300 max-w-xs leading-relaxed mb-6">
              Global Bitcoin mining infrastructure. We manage the hardware. You control the Bitcoin.
            </p>
            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin, Mail].map((Icon, i) => (
                <a key={i} href="/#" className="w-9 h-9 rounded-lg clay-sm flex items-center justify-center text-ink-300 hover:text-gold-400 transition-colors">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <h4 className="text-xs font-mono uppercase tracking-wider text-gold-400 mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(link => (
                  <li key={link.label}>
                    <Link to={link.href} className="text-sm text-ink-300 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-ink-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-ink-400 font-mono">
            Production Network — Live Bitcoin mining infrastructure.
          </p>
          <p className="text-xs text-ink-400">
            © 2027 HashNomads. All rights reserved. Production Network.
          </p>
        </div>
      </div>
    </footer>
  );
}
