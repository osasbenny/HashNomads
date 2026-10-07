import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Server, Activity, Bitcoin, Zap, Gauge, MapPin, Calendar, ArrowLeft } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { HashrateVisualization } from '@v2/components/Asic3D';
import { ASIC_STATES, formatNumber, timeAgo } from '@v2/lib/constants';
import type { OwnershipAssignment, Telemetry } from '@v2/types';

export function PortalMiners() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [miners, setMiners] = useState<OwnershipAssignment[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('ownership_assignments')
        .select('*, asic_unit:asic_units(*, asic_model:asic_models(*), facility:facilities(*))')
        .eq('user_id', user.id);
      setMiners((data as unknown as OwnershipAssignment[]) || []);
      setLoading(false);
    })();
  }, [user]);

  if (loading) {
    return <PortalLayout title="My Miners"><div className="space-y-4">{Array.from({length: 3}).map((_,i)=><div key={i} className="skeleton h-40" />)}</div></PortalLayout>;
  }

  const selectedMiner = miners.find(m => m.id === selected);
  const selectedTelemetry: Telemetry[] = selectedMiner ? [
    { id: '1', asic_unit_id: selectedMiner.asic_unit_id, hashrate_th: selectedMiner.asic_unit?.asic_model?.hashrate_th || 0, uptime_pct: 99.7, worker_status: 'active', shares_accepted: 1245832, shares_rejected: 892, pool_reported_earnings_sat: 240000, recorded_at: new Date().toISOString() },
  ] : [];

  return (
    <PortalLayout title="My Miners">
      {selectedMiner ? (
        <MinerDetail miner={selectedMiner} telemetry={selectedTelemetry} onBack={() => setSelected(null)} />
      ) : (
        <>
          {miners.length === 0 ? (
            <div className="clay-lg p-12 text-center">
              <Server className="w-16 h-16 text-ink-600 mx-auto mb-6" />
              <h3 className="font-display font-semibold text-xl text-white mb-2">No miners deployed yet</h3>
              <p className="text-ink-300 mb-6 max-w-md mx-auto">Browse our ASIC marketplace, choose a miner and facility, and start mining in minutes.</p>
              <Link to="/#miners" className="clay-button-gold inline-flex items-center gap-2">Browse Marketplace</Link>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {miners.map(m => {
                const state = ASIC_STATES[m.asic_unit?.state || 'inventory'];
                return (
                  <button key={m.id} onClick={() => setSelected(m.id)} className="clay-lg p-6 text-left hover:scale-[1.02] transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl clay-gold flex items-center justify-center">
                        <Cpu className="w-6 h-6 text-ink-950" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={state.dotClass} />
                        <span className={`text-xs font-mono ${state.color}`}>{state.label}</span>
                      </div>
                    </div>
                    <h3 className="font-display font-semibold text-lg text-white mb-1">{m.asic_unit?.asic_model?.model}</h3>
                    <p className="text-xs text-ink-400 font-mono mb-4">{m.asic_unit?.serial_number}</p>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div className="clay-inset p-2.5">
                        <div className="text-2xs font-mono text-ink-400 uppercase">Hashrate</div>
                        <div className="text-sm font-bold text-gold-400">{m.asic_unit?.asic_model?.hashrate_th} TH/s</div>
                      </div>
                      <div className="clay-inset p-2.5">
                        <div className="text-2xs font-mono text-ink-400 uppercase">Power</div>
                        <div className="text-sm font-bold text-white">{m.asic_unit?.asic_model?.power_w}W</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-ink-400">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{m.asic_unit?.facility?.name || 'Unassigned'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </>
      )}
    </PortalLayout>
  );
}

function MinerDetail({ miner, telemetry, onBack }: { miner: OwnershipAssignment; telemetry: Telemetry[]; onBack: () => void }) {
  const unit = miner.asic_unit;
  const model = unit?.asic_model;
  const facility = unit?.facility;
  const state = ASIC_STATES[unit?.state || 'inventory'];
  const latest = telemetry[0];

  return (
    <div>
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-4 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Back to miners
      </button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          <div className="clay-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl clay-gold flex items-center justify-center">
                  <Cpu className="w-7 h-7 text-ink-950" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-xl text-white">{model?.manufacturer} {model?.model}</h2>
                  <p className="text-xs text-ink-400 font-mono">{unit?.serial_number}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={state.dotClass} />
                <span className={`text-sm font-mono ${state.color}`}>{state.label}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="clay-sm p-3">
                <div className="text-2xs font-mono text-ink-400 uppercase">Hashrate</div>
                <div className="text-lg font-bold text-gold-400">{model?.hashrate_th} TH/s</div>
              </div>
              <div className="clay-sm p-3">
                <div className="text-2xs font-mono text-ink-400 uppercase">Power</div>
                <div className="text-lg font-bold text-white">{model?.power_w}W</div>
              </div>
              <div className="clay-sm p-3">
                <div className="text-2xs font-mono text-ink-400 uppercase">Efficiency</div>
                <div className="text-lg font-bold text-success-400">{model?.efficiency_j_th} J/TH</div>
              </div>
              <div className="clay-sm p-3">
                <div className="text-2xs font-mono text-ink-400 uppercase">Algorithm</div>
                <div className="text-lg font-bold text-white">{model?.algorithm}</div>
              </div>
            </div>
          </div>

          {/* Live telemetry */}
          <div className="clay-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-semibold text-lg text-white">Live Telemetry</h3>
              <span className="flex items-center gap-1.5 text-xs font-mono text-success-400">
                <span className="status-online" /> LIVE
              </span>
            </div>
            <HashrateVisualization className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="clay-inset p-3">
                <Activity className="w-4 h-4 text-gold-400 mb-1" />
                <div className="text-sm font-mono text-white">{latest?.hashrate_th || 0} TH/s</div>
                <div className="text-2xs text-ink-400">Current Hashrate</div>
              </div>
              <div className="clay-inset p-3">
                <Gauge className="w-4 h-4 text-success-400 mb-1" />
                <div className="text-sm font-mono text-white">{latest?.uptime_pct || 0}%</div>
                <div className="text-2xs text-ink-400">Uptime</div>
              </div>
              <div className="clay-inset p-3">
                <Zap className="w-4 h-4 text-orange-400 mb-1" />
                <div className="text-sm font-mono text-white">{formatNumber(latest?.shares_accepted || 0)}</div>
                <div className="text-2xs text-ink-400">Shares Accepted</div>
              </div>
              <div className="clay-inset p-3">
                <Bitcoin className="w-4 h-4 text-orange-400 mb-1" />
                <div className="text-sm font-mono text-white">{formatNumber(latest?.pool_reported_earnings_sat || 0)} sat</div>
                <div className="text-2xs text-ink-400">Pool Earnings</div>
              </div>
            </div>
          </div>

          {/* Deployment timeline */}
          <div className="clay-lg p-6">
            <h3 className="font-display font-semibold text-lg text-white mb-4">Deployment Timeline</h3>
            <div className="space-y-4">
              {[
                { label: 'Order Placed', date: miner.assigned_at, done: true },
                { label: 'ASIC Assigned', date: miner.assigned_at, done: true },
                { label: 'Deployment Scheduled', date: unit?.deployed_at, done: !!unit?.deployed_at },
                { label: 'Racked & Configured', date: unit?.deployed_at, done: unit?.state === 'online' || unit?.state === 'degraded' },
                { label: 'Connected to Pool', date: unit?.deployed_at, done: unit?.state === 'online' },
                { label: 'Mining Online', date: unit?.deployed_at, done: unit?.state === 'online' },
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${step.done ? 'bg-success-500' : 'bg-ink-600'}`} style={step.done ? { boxShadow: '0 0 8px #10b981' } : {}} />
                  <div className="flex-1 flex items-center justify-between">
                    <span className={`text-sm ${step.done ? 'text-white' : 'text-ink-400'}`}>{step.label}</span>
                    {step.date && <span className="text-xs text-ink-400 font-mono">{timeAgo(step.date)}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="clay-lg p-6">
            <h3 className="font-display font-semibold text-base text-white mb-4">Hosting Location</h3>
            {facility ? (
              <div className="space-y-3">
                <div className="clay-sm p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gold-400" />
                    <span className="font-display font-semibold text-white">{facility.name}</span>
                  </div>
                  <p className="text-xs text-ink-400">{facility.location}</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-ink-400">Energy</span><span className="text-white capitalize">{facility.energy_source.replace(/_/g, ' ')}</span></div>
                  <div className="flex justify-between"><span className="text-ink-400">Rate</span><span className="text-gold-400 font-mono">${facility.power_cost_kwh}/kWh</span></div>
                  <div className="flex justify-between"><span className="text-ink-400">Climate</span><span className="text-white capitalize">{facility.climate}</span></div>
                </div>
              </div>
            ) : <p className="text-sm text-ink-400">Not yet assigned to a facility</p>}
          </div>

          <div className="clay-lg p-6">
            <h3 className="font-display font-semibold text-base text-white mb-4">Worker Status</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-ink-400">Worker ID</span><span className="text-white font-mono">{unit?.serial_number}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Pool</span><span className="text-white">HashNomads Pool</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Status</span><span className="text-success-400">{latest?.worker_status || 'active'}</span></div>
              <div className="flex justify-between"><span className="text-ink-400">Rejected</span><span className="text-white">{formatNumber(latest?.shares_rejected || 0)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
