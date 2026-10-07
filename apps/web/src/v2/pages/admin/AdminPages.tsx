import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, Cpu, Server, CreditCard, Activity, Building2,
  AlertTriangle, LifeBuoy, FileText, Shield, Menu, X, Cpu as Logo,
} from 'lucide-react';
import { useAuth } from '@v2/contexts/AuthContext';
import { supabase } from '@v2/lib/supabase';

const adminNav = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Customers', href: '/admin/customers', icon: Users },
  { label: 'ASIC Inventory', href: '/admin/inventory', icon: Cpu },
  { label: 'Orders', href: '/admin/orders', icon: CreditCard },
  { label: 'Mining Fleet', href: '/admin/fleet', icon: Server },
  { label: 'Facilities', href: '/admin/facilities', icon: Building2 },
  { label: 'Incidents', href: '/admin/incidents', icon: AlertTriangle },
  { label: 'Support', href: '/admin/support', icon: LifeBuoy },
  { label: 'Audit Log', href: '/admin/audit', icon: FileText },
];

export function AdminLayout({ children, title }: { children: ReactNode; title: string }) {
  const { profile, signOut } = useAuth();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (profile && profile.role !== 'admin') {
    return (
      <div className="min-h-screen bg-ink-950 flex items-center justify-center p-6">
        <div className="clay-lg p-8 text-center max-w-md">
          <Shield className="w-12 h-12 text-error-400 mx-auto mb-4" />
          <h1 className="font-display font-bold text-xl text-white mb-2">Access Denied</h1>
          <p className="text-ink-300 mb-6">You need administrator privileges to access this console.</p>
          <Link to="/portal" className="clay-button-gold inline-flex">Go to Customer Portal</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950 flex">
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-ink-900 border-r border-ink-800/50 flex flex-col z-40 transition-transform ${open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-5 border-b border-ink-800/50">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-error-500/20 border border-error-500/30 flex items-center justify-center">
              <Logo className="w-4.5 h-4.5 text-error-400" strokeWidth={2.5} />
            </div>
            <div>
              <div className="font-display font-bold text-sm text-white">HashNomads</div>
              <div className="text-2xs font-mono text-error-400/80">ADMIN CONSOLE</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {adminNav.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${active ? 'clay-sm text-error-400 font-medium' : 'text-ink-300 hover:text-white hover:bg-ink-800/40'}`}>
                <item.icon className="w-4.5 h-4.5 shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-ink-800/50">
          <Link to="/portal" className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-ink-400 hover:text-white">
            <LayoutDashboard className="w-4 h-4" /> Customer Portal
          </Link>
        </div>
      </aside>

      {open && <div className="fixed inset-0 bg-ink-950/60 z-30 lg:hidden" onClick={() => setOpen(false)} />}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 glass-nav border-b border-ink-800/50 px-4 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setOpen(!open)} className="lg:hidden w-9 h-9 rounded-lg clay-button-dark flex items-center justify-center">
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
            <h1 className="font-display font-semibold text-lg text-white">{title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-error-400/70">
              <span className="w-2 h-2 rounded-full bg-error-500" /> ADMIN MODE
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}

// ===================== ADMIN DASHBOARD =====================
export function AdminDashboard() {
  const [stats, setStats] = useState({
    customers: 0, asicUnits: 0, orders: 0, onlineMiners: 0, totalHashrate: 0, revenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [customers, units, orders, onlineUnits] = await Promise.all([
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('asic_units').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('asic_units').select('*').eq('state', 'online'),
      ]);
      setStats({
        customers: customers.count || 0,
        asicUnits: units.count || 0,
        orders: orders.count || 0,
        onlineMiners: (onlineUnits.data as any[])?.length || 0,
        totalHashrate: 0,
        revenue: 0,
      });
      setLoading(false);
    })();
  }, []);

  if (loading) return <AdminLayout title="Dashboard"><div className="skeleton h-96" /></AdminLayout>;

  return (
    <AdminLayout title="Operations Dashboard">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <AdminStatCard label="Total Customers" value={String(stats.customers)} icon={Users} color="gold" />
        <AdminStatCard label="ASIC Units" value={String(stats.asicUnits)} icon={Cpu} color="accent" />
        <AdminStatCard label="Total Orders" value={String(stats.orders)} icon={CreditCard} color="orange" />
        <AdminStatCard label="Online Miners" value={String(stats.onlineMiners)} icon={Activity} color="success" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="clay-lg p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">System Status</h3>
          <div className="space-y-3">
            {[
              { name: 'Database', status: 'operational', color: 'success' },
              { name: 'Auth Service', status: 'operational', color: 'success' },
              { name: 'BTCPay Server', status: 'operational', color: 'success' },
              { name: 'Mining Pool', status: 'operational', color: 'success' },
              { name: 'Telemetry Service', status: 'operational', color: 'success' },
            ].map(s => (
              <div key={s.name} className="flex items-center justify-between py-2 border-b border-ink-800/30 last:border-0">
                <span className="text-sm text-ink-200">{s.name}</span>
                <div className="flex items-center gap-2">
                  <span className={`status-dot ${s.color === 'success' ? 'status-online' : 'status-pending'}`} />
                  <span className={`text-xs font-mono ${s.color === 'success' ? 'text-success-400' : 'text-gold-400'}`}>{s.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="clay-lg p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <ActivityItem text="New customer registration" time="2m ago" />
            <ActivityItem text="Order HN-XK392F placed" time="15m ago" />
            <ActivityItem text="ASIC unit deployed to Texas Thunder" time="1h ago" />
            <ActivityItem text="Crypto invoice confirmed" time="2h ago" />
            <ActivityItem text="KYC verification completed" time="3h ago" />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

function AdminStatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: import("lucide-react").LucideIcon; color: string }) {
  const colors: Record<string, string> = { gold: 'text-gold-400', accent: 'text-accent-400', orange: 'text-orange-400', success: 'text-success-400' };
  return (
    <div className="clay-lg p-5">
      <Icon className={`w-5 h-5 ${colors[color]} mb-3`} />
      <div className="text-3xl font-display font-bold text-white">{value}</div>
      <div className="text-xs text-ink-400 font-mono uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function ActivityItem({ text, time }: { text: string; time: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-ink-800/30 last:border-0">
      <span className="text-sm text-ink-200">{text}</span>
      <span className="text-xs text-ink-400">{time}</span>
    </div>
  );
}

// ===================== ADMIN CUSTOMERS =====================
export function AdminCustomers() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
      setCustomers(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <AdminLayout title="Customers"><div className="skeleton h-96" /></AdminLayout>;

  return (
    <AdminLayout title="Customers">
      <div className="clay-lg p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">All Customers</h3>
        {customers.length === 0 ? (
          <p className="text-ink-300 text-center py-8">No customers registered yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-700/50">
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Name</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Email</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Role</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">KYC</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Country</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Joined</th>
                </tr>
              </thead>
              <tbody>
                {customers.map(c => (
                  <tr key={c.id} className="border-b border-ink-800/30 last:border-0">
                    <td className="py-3 text-white">{c.full_name || '—'}</td>
                    <td className="py-3 text-ink-200">{c.email}</td>
                    <td className="py-3"><span className="text-xs font-mono capitalize text-ink-300">{c.role}</span></td>
                    <td className="py-3"><span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      c.kyc_status === 'verified' ? 'bg-success-500/10 text-success-400' :
                      c.kyc_status === 'rejected' ? 'bg-error-500/10 text-error-400' :
                      'bg-gold-400/10 text-gold-400'
                    }`}>{c.kyc_status}</span></td>
                    <td className="py-3 text-ink-300">{c.country}</td>
                    <td className="py-3 text-ink-400">{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ===================== ADMIN INVENTORY =====================
export function AdminInventory() {
  const [units, setUnits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('asic_units').select('*, asic_model:asic_models(*), facility:facilities(*)').order('created_at', { ascending: false });
      setUnits(data || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <AdminLayout title="ASIC Inventory"><div className="skeleton h-96" /></AdminLayout>;

  return (
    <AdminLayout title="ASIC Inventory">
      <div className="clay-lg p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">All ASIC Units ({units.length})</h3>
        {units.length === 0 ? (
          <p className="text-ink-300 text-center py-8">No ASIC units in inventory.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-700/50">
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Serial</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Model</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">State</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Facility</th>
                </tr>
              </thead>
              <tbody>
                {units.map(u => (
                  <tr key={u.id} className="border-b border-ink-800/30 last:border-0">
                    <td className="py-3 text-white font-mono text-xs">{u.serial_number}</td>
                    <td className="py-3 text-ink-200">{u.asic_model?.model || '—'}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-2">
                        <span className={`status-dot ${
                          u.state === 'online' ? 'status-online' :
                          u.state === 'degraded' ? 'status-degraded' :
                          u.state === 'offline' ? 'status-offline' : 'status-pending'
                        }`} />
                        <span className="text-ink-300 capitalize">{u.state.replace(/_/g, ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3 text-ink-300">{u.facility?.name || 'Unassigned'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

// ===================== ADMIN PLACEHOLDER PAGES =====================
export function AdminPlaceholder({ title }: { title: string }) {
  return (
    <AdminLayout title={title}>
      <div className="clay-lg p-12 text-center">
        <Server className="w-16 h-16 text-ink-600 mx-auto mb-6" />
        <h3 className="font-display font-semibold text-xl text-white mb-2">{title}</h3>
        <p className="text-ink-300">This section is part of the admin console.</p>
      </div>
    </AdminLayout>
  );
}
