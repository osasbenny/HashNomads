import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Menu, X, Cpu, LayoutDashboard, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '@v2/contexts/AuthContext';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => { setMobileOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  const navLinks = [
    { label: 'Platform', href: '/#platform' },
    { label: 'Miners', href: '/#miners' },
    { label: 'Facilities', href: '/#facilities' },
    { label: 'Profitability', href: '/#profitability' },
    { label: 'Security', href: '/#security' },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-nav border-b border-ink-800/50 py-2.5' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl clay-gold flex items-center justify-center group-hover:scale-105 transition-transform">
              <Cpu className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-lg text-white leading-none tracking-tight">HashNomads</span>
              <span className="text-2xs font-mono text-gold-400/70 leading-none mt-0.5">BTC MINING INFRASTRUCTURE</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-ink-200 hover:text-white transition-colors rounded-lg hover:bg-ink-800/40"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl clay-button-dark text-sm"
                >
                  <div className="w-7 h-7 rounded-lg bg-gold-gradient flex items-center justify-center text-ink-950 font-bold text-xs">
                    {(profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="text-ink-100 max-w-32 truncate">{profile?.full_name || user.email}</span>
                  <ChevronDown className="w-4 h-4 text-ink-300" />
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 clay-lg p-2 animate-scale-in origin-top-right">
                    <Link to="/portal" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-800/50 transition-colors text-sm text-ink-100">
                      <LayoutDashboard className="w-4 h-4 text-gold-400" />
                      Dashboard
                    </Link>
                    {profile?.role === 'admin' && (
                      <Link to="/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-800/50 transition-colors text-sm text-ink-100">
                        <LayoutDashboard className="w-4 h-4 text-error-400" />
                        Admin Console
                      </Link>
                    )}
                    <div className="h-px bg-ink-700/50 my-1" />
                    <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-ink-800/50 transition-colors text-sm text-error-400">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="px-4 py-2 text-sm font-medium text-ink-200 hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link to="/signup" className="clay-button-gold text-sm">
                  Get Started
                </Link>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 rounded-xl clay-button-dark flex items-center justify-center">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-ink-950/95 backdrop-blur-xl pt-20 px-6 animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map(link => (
              <a key={link.href} href={link.href} className="px-4 py-3 text-lg font-medium text-ink-100 hover:text-gold-400 transition-colors border-b border-ink-800/50">
                {link.label}
              </a>
            ))}
            <div className="mt-4 flex flex-col gap-3">
              {user ? (
                <>
                  <Link to="/portal" className="clay-button-gold text-center">Dashboard</Link>
                  <button onClick={handleSignOut} className="clay-button-dark text-center text-error-400">Sign Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="clay-button-dark text-center">Sign In</Link>
                  <Link to="/signup" className="clay-button-gold text-center">Get Started</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
