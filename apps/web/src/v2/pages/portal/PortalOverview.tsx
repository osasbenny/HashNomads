import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu, TrendingUp, Bitcoin, Wallet, Activity, ArrowUpRight, ArrowRight,
  Server, Zap, Gauge, AlertCircle, CheckCircle2, ShoppingBag,
} from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { HashrateVisualization } from '@v2/components/Asic3D';
import { formatUsd, formatBtc, timeAgo } from '@v2/lib/constants';
import type { OwnershipAssignment, RewardEntry, Order, HostingInvoice } from '@v2/types';

export function PortalOverview() {
  const { user, profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [miners, setMiners] = useState<OwnershipAssignment[]>([]);
  const [rewards, setRewards] = useState<RewardEntry[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [invoices, setInvoices] = useState<HostingInvoice[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [minersRes, rewardsRes, ordersRes, invoicesRes] = await Promise.all([
        supabase.from('ownership_assignments').select('*, asic_unit:asic_units(*, asic_model:asic_models(*), facility:facilities(*)), order:orders(*)').eq('user_id', user.id),
        supabase.from('reward_entries').select('*, asic_unit:asic_units(*, asic_model:asic_models(*))').eq('user_id', user.id).order('recorded_at', { ascending: false }).limit(10),
        supabase.from('orders').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
        supabase.from('hosting_invoices').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
      ]);
      setMiners((minersRes.data as unknown as OwnershipAssignment[]) || []);
      setRewards((rewardsRes.data as unknown as RewardEntry[]) || []);
      setOrders((ordersRes.data as unknown as Order[]) || []);
      setInvoices((invoicesRes.data as unknown as HostingInvoice[]) || []);
      setLoading(false);
    })();
  }, [user]);

  const onlineCount = miners.filter(m => m.asic_unit?.state === 'online').length;
  const totalHashrate = miners.reduce((sum, m) => sum + (m.asic_unit?.asic_model?.hashrate_th || 0), 0);
  const totalRewardsSat = rewards.reduce((sum, r) => sum + r.amount_sat, 0);
  const activeOrders = orders.filter(o => o.status === 'quoted' || o.status === 'payment_pending').length;

  if (loading) {
    return <PortalLayout title="Overview"><div className="space-y-4">{Array.from({length: 4}).map((_,i)=><div key={i} className="skeleton h-32" />)}</div></PortalLayout>;
  }

  return (
    <PortalLayout title="Overview">
      {/* Welcome banner */}
      <div className="clay-lg p-6 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-radial opacity-20" />
        <div className="relative flex items-center justify-between flex-wrap gap-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-1">
              Welcome back, {profile?.full_name?.split(' ')[0] || 'Miner'}
            </h2>
            <p className="text-sm text-ink-300">
              {miners.length === 0
                ? "You don't have any miners yet. Browse our ASIC marketplace to get started."
                : `You have ${miners.length} miner${miners.length !== 1 ? 's' : ''} — ${onlineCount} online, generating ${totalHashrate} TH/s.`}
            </p>
          </div>
          {profile?.kyc_status !== 'verified' && (
            <div className="clay-sm p-3 flex items-center gap-3 border border-warning-500/30">
              <AlertCircle className="w-5 h-5 text-warning-500 shrink-0" />
              <div>
                <div className="text-sm font-medium text-white">KYC Verification Required</div>
                <div className="text-xs text-ink-400">Complete identity verification to purchase miners</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Cpu} label="Active Miners" value={String(miners.length)} sub={`${onlineCount} online`} color="gold" />
        <StatCard icon={Activity} label="Total Hashrate" value={`${totalHashrate} TH/s`} sub={onlineCount > 0 ? 'Generating rewards' : 'No active miners'} color="success" />
        <StatCard icon={Bitcoin} label="Total Rewards" value={formatBtc(totalRewardsSat)} sub={`${rewards.length} entries`} color="orange" />
        <StatCard icon={ShoppingBag} label="Active Orders" value={String(activeOrders)} sub={`${orders.length} total orders`} color="accent" />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* My Miners summary */}
        <div className="lg:col-span-2 clay-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-white">Your Mining Fleet</h3>
            <Link to="/portal/miners" className="text-sm text-gold-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {miners.length === 0 ? (
            <div className="text-center py-12">
              <Server className="w-12 h-12 text-ink-600 mx-auto mb-4" />
              <p className="text-ink-300 mb-4">No miners deployed yet</p>
              <Link to="/#miners" className="clay-button-gold inline-flex items-center gap-2">
                Browse ASIC Marketplace <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {miners.slice(0, 4).map(m => (
                <div key={m.id} className="clay-sm p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg clay-inset flex items-center justify-center">
                      <Cpu className="w-5 h-5 text-gold-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium text-white">{m.asic_unit?.asic_model?.manufacturer} {m.asic_unit?.asic_model?.model}</div>
                      <div className="text-xs text-ink-400 font-mono">{m.asic_unit?.serial_number}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-mono text-white">{m.asic_unit?.asic_model?.hashrate_th} TH/s</div>
                      <div className="text-xs text-ink-400">{m.asic_unit?.facility?.name || 'Unassigned'}</div>
                    </div>
                    <div className={`status-dot ${
                      m.asic_unit?.state === 'online' ? 'status-online' :
                      m.asic_unit?.state === 'degraded' ? 'status-degraded' :
                      m.asic_unit?.state === 'offline' ? 'status-offline' : 'status-pending'
                    }`} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live hashrate */}
        <div className="clay-lg p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Live Hashrate</h3>
          <HashrateVisualization className="mb-4" />
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-ink-400">Pool</span><span className="text-white font-mono">HashNomads Pool</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Workers</span><span className="text-success-400 font-mono">{onlineCount} active</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Uptime (24h)</span><span className="text-white font-mono">99.7%</span></div>
            <div className="flex justify-between"><span className="text-ink-400">Last share</span><span className="text-white font-mono">12s ago</span></div>
          </div>
        </div>

        {/* Recent rewards */}
        <div className="lg:col-span-2 clay-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-white">Recent Mining Rewards</h3>
            <Link to="/portal/earnings" className="text-sm text-gold-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {rewards.length === 0 ? (
            <div className="text-center py-8">
              <Bitcoin className="w-8 h-8 text-ink-600 mx-auto mb-3" />
              <p className="text-sm text-ink-400">No rewards recorded yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {rewards.slice(0, 5).map(r => (
                <div key={r.id} className="flex items-center justify-between py-2 border-b border-ink-800/40 last:border-0">
                  <div className="flex items-center gap-3">
                    <Bitcoin className="w-4 h-4 text-orange-400" />
                    <div>
                      <div className="text-sm font-mono text-white">{formatBtc(r.amount_sat)}</div>
                      <div className="text-xs text-ink-400">{r.asic_unit?.asic_model?.model} — {timeAgo(r.recorded_at)}</div>
                    </div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                    r.status === 'paid' ? 'bg-success-500/10 text-success-400' :
                    r.status === 'processing' ? 'bg-warning-500/10 text-warning-500' :
                    'bg-ink-700 text-ink-300'
                  }`}>{r.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent invoices */}
        <div className="clay-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-semibold text-lg text-white">Recent Invoices</h3>
            <Link to="/portal/billing" className="text-sm text-gold-400 hover:underline flex items-center gap-1">
              View all <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Wallet className="w-8 h-8 text-ink-600 mx-auto mb-3" />
              <p className="text-sm text-ink-400">No invoices yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {invoices.slice(0, 4).map(inv => (
                <div key={inv.id} className="flex items-center justify-between py-2 border-b border-ink-800/40 last:border-0">
                  <div>
                    <div className="text-sm font-mono text-white">{inv.invoice_number}</div>
                    <div className="text-xs text-ink-400">{formatUsd(inv.total_usd)}</div>
                  </div>
                  <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                    inv.status === 'paid' ? 'bg-success-500/10 text-success-400' :
                    inv.status === 'overdue' ? 'bg-error-500/10 text-error-400' :
                    'bg-gold-400/10 text-gold-400'
                  }`}>{inv.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

function StatCard({ icon: Icon, label, value, sub, color }: { icon: React.ElementType; label: string; value: string; sub: string; color: string }) {
  const colorMap: Record<string, string> = {
    gold: 'text-gold-400', success: 'text-success-400', orange: 'text-orange-400', accent: 'text-accent-400',
  };
  return (
    <div className="clay-lg p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="w-10 h-10 rounded-xl clay-sm flex items-center justify-center">
          <Icon className={`w-5 h-5 ${colorMap[color]}`} />
        </div>
      </div>
      <div className="text-2xl font-display font-bold text-white mb-1">{value}</div>
      <div className="text-xs font-mono text-ink-400 uppercase tracking-wider">{label}</div>
      <div className="text-xs text-ink-300 mt-1">{sub}</div>
    </div>
  );
}

