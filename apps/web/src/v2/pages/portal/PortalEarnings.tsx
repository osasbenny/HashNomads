import { useEffect, useState } from 'react';
import { Bitcoin, TrendingUp, Download, Calendar } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { formatBtc, formatDate, formatSat } from '@v2/lib/constants';
import type { RewardEntry } from '@v2/types';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export function PortalEarnings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [rewards, setRewards] = useState<RewardEntry[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('reward_entries')
        .select('*, asic_unit:asic_units(*, asic_model:asic_models(*))')
        .eq('user_id', user.id)
        .order('recorded_at', { ascending: false });
      setRewards((data as unknown as RewardEntry[]) || []);
      setLoading(false);
    })();
  }, [user]);

  const totalSat = rewards.reduce((s, r) => s + r.amount_sat, 0);
  const totalBtc = totalSat / 100000000;

  // Build chart data - last 30 entries reversed
  const chartData = [...rewards].reverse().slice(-30).map((r, i) => ({
    day: `Day ${i + 1}`,
    sats: r.amount_sat,
    cumulative: rewards.slice(0, i + 1).reduce((s, r2) => s + r2.amount_sat, 0),
  }));

  if (loading) return <PortalLayout title="Earnings"><div className="skeleton h-96" /></PortalLayout>;

  return (
    <PortalLayout title="Earnings">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="clay-lg p-5">
          <Bitcoin className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{totalBtc.toFixed(8)}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Total BTC Earned</div>
        </div>
        <div className="clay-lg p-5">
          <Bitcoin className="w-5 h-5 text-gold-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{formatSat(totalSat)}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Total Satoshis</div>
        </div>
        <div className="clay-lg p-5">
          <TrendingUp className="w-5 h-5 text-success-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{rewards.length}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Reward Entries</div>
        </div>
        <div className="clay-lg p-5">
          <Calendar className="w-5 h-5 text-accent-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{formatSat(rewards.length > 0 ? Math.round(totalSat / rewards.length) : 0)}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Avg per Entry</div>
        </div>
      </div>

      {chartData.length > 0 && (
        <div className="clay-lg p-6 mb-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Cumulative Earnings</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1c2130" />
              <XAxis dataKey="day" stroke="#4a5470" fontSize={11} />
              <YAxis stroke="#4a5470" fontSize={11} />
              <Tooltip contentStyle={{ background: '#161a23', border: '1px solid #2d3548', borderRadius: '12px' }} labelStyle={{ color: '#c8cfe0' }} />
              <Line type="monotone" dataKey="cumulative" stroke="#f7b32b" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      <div className="clay-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-semibold text-lg text-white">Reward History</h3>
          <button className="text-sm text-gold-400 hover:underline flex items-center gap-1">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
        </div>
        {rewards.length === 0 ? (
          <div className="text-center py-12">
            <Bitcoin className="w-12 h-12 text-ink-600 mx-auto mb-4" />
            <p className="text-ink-300">No mining rewards recorded yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-ink-700/50">
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Date</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Miner</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Amount</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Pool</th>
                  <th className="pb-3 text-xs font-mono text-ink-400 uppercase">Status</th>
                </tr>
              </thead>
              <tbody>
                {rewards.map(r => (
                  <tr key={r.id} className="border-b border-ink-800/30 last:border-0">
                    <td className="py-3 text-ink-300">{formatDate(r.recorded_at)}</td>
                    <td className="py-3 text-white">{r.asic_unit?.asic_model?.model || 'Unknown'}</td>
                    <td className="py-3 text-gold-400 font-mono">{formatBtc(r.amount_sat)}</td>
                    <td className="py-3 text-ink-300">{r.pool_name || 'HashNomads Pool'}</td>
                    <td className="py-3">
                      <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                        r.status === 'paid' ? 'bg-success-500/10 text-success-400' :
                        r.status === 'processing' ? 'bg-warning-500/10 text-warning-500' :
                        'bg-ink-700 text-ink-300'
                      }`}>{r.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PortalLayout>
  );
}
