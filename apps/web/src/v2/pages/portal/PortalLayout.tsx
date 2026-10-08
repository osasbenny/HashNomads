import { Link, useLocation } from 'react-router-dom';
import { type ReactNode, useState } from 'react';
import {
  LayoutDashboard, Cpu, TrendingUp, Wallet, ShoppingBag, CreditCard,
  Building2, FileText, Bell, LifeBuoy, Shield, Menu, X, Cpu as Logo,
} from 'lucide-react';
import { useAuth } from '@v2/contexts/AuthContext';

const navItems = [
  { label: 'Overview', href: '/portal', icon: LayoutDashboard },
  { label: 'My Miners', href: '/portal/miners', icon: Cpu },
  { label: 'Earnings', href: '/portal/earnings', icon: TrendingUp },
  { label: 'Orders', href: '/portal/orders', icon: ShoppingBag },
  { label: 'Payments', href: '/portal/payments', icon: CreditCard },
  { label: 'Wallets', href: '/portal/wallets', icon: Wallet },
  { label: 'Hosting & Billing', href: '/portal/billing', icon: Building2 },
  { label: 'Documents', href: '/portal/documents', icon: FileText },
  { label: 'Notifications', href: '/portal/notifications', icon: Bell },
  { label: 'Support', href: '/portal/support', icon: LifeBuoy },
  { label: 'Security / Profile', href: '/portal/profile', icon: Shield },
];

export function PortalLayout({ children, title }: { children: ReactNode; title: string }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950 flex">
      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-900 border-r border-ink-800/50 flex flex-col z-40 transition-transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-ink-800/50">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg clay-gold flex items-center justify-center">
              <Logo className="w-4.5 h-4.5 text-ink-950" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">HashNomads</div>
              <div className="text-2xs font-mono text-gold-400/60">CUSTOMER PORTAL</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {navItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'clay-sm text-gold-400 font-medium' : 'text-ink-300 hover:text-white hover:bg-ink-800/40'}`}
              >
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-ink-800/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-xl clay-inset">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-ink-950 font-bold text-xs shrink-0">
              {(profile?.full_name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">{profile?.full_name || 'User'}</div>
              <div className="text-2xs text-ink-400 truncate">KYC: {profile?.kyc_status || 'pending'}</div>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 bg-ink-950/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 glass-nav border-b border-ink-800/50 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden w-9 h-9 rounded-lg clay-button-dark flex items-center justify-center">
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <h1 className="font-display font-semibold text-lg text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-ink-400">
              <span className="status-online" /> PLATFORM ONLINE
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
