import { Link } from 'react-router-dom';
import { Cpu, Mail } from 'lucide-react';
import { Twitter, Github, Linkedin } from '@v2/components/brand-icons';

export function Footer() {
  const cols = [
    {
      title: 'Platform',
      links: [
        { label: 'ASIC Marketplace', href: '/marketplace' },
        { label: 'Hosting Facilities', href: '/facilities' },
        { label: 'Profitability Calculator', href: '/calculator' },
        { label: 'Customer Portal', href: '/portal' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About HashNomads', href: '/about' },
        { label: 'Security & Compliance', href: '/security' },
        { label: 'How It Works', href: '/how-it-works' },
        { label: 'Roadmap', href: '/roadmap' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Documentation', href: '/documentation' },
        { label: 'Support Center', href: '/support' },
        { label: 'API Reference', href: '/api-reference' },
        { label: 'Status Page', href: '/status' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Risk Disclosure', href: '/risk-disclosure' },
        { label: 'KYC Requirements', href: '/kyc-requirements' },
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
            Public platform — Mining integrations in progress.
          </p>
          <div className="text-xs text-ink-400 font-mono text-center md:text-right">
            <p className="text-ink-400">Copyright © {new Date().getFullYear()} HashNomads. All Rights Reserved.</p>
            <p className="mt-1 text-ink-400">
              Designed &amp; Developed By{' '}
              <a
                href="https://cactusdigitalmedia.ng"
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-400 hover:text-gold-400 transition-colors"
              >
                Cactus Digital Media
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
