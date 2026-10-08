import { useEffect, useState } from 'react';
import { Wallet, Plus, Check, AlertCircle, Bitcoin, Shield, Trash2, Power } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { formatDate } from '@v2/lib/constants';
import type { WalletDestination } from '@v2/types';

export function PortalWallets() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [wallets, setWallets] = useState<WalletDestination[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [label, setLabel] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function loadWallets() {
    if (!user) return;
    const { data } = await supabase
      .from('wallet_destinations')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setWallets((data as unknown as WalletDestination[]) || []);
    setLoading(false);
  }

  useEffect(() => { loadWallets(); }, [user]);

  function handleAdd(e: React.FormEvent) { e.preventDefault(); setError('Wallet changes require a secure verification workflow. Contact support for assistance.'); }
  function setActive(_walletId: string) { setError('Wallet activation requires verified authorization. Contact support for assistance.'); }
  function deleteWallet(_walletId: string) { setError('Wallet changes require verified authorization. Contact support for assistance.'); }

  if (loading) return <PortalLayout title="Wallets"><div className="skeleton h-96" /></PortalLayout>;

  return (
    <PortalLayout title="Wallets">
      {/* Security notice */}
      <div className="clay-sm p-4 mb-6 flex items-start gap-3 border border-gold-400/20">
        <Shield className="w-5 h-5 text-gold-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm text-white font-medium">HashNomads manages miners. You control Bitcoin.</p>
          <p className="text-xs text-ink-300 mt-1">
            We never ask for or store private keys, seed phrases, or recovery phrases. Mining rewards are sent directly to your Bitcoin wallet address.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-300">{wallets.length} wallet destination{wallets.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowAdd(!showAdd)} className="clay-button-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> Add Wallet
        </button>
      </div>

      {error && (
        <div className="clay-sm p-4 mb-4 flex items-center gap-3 border border-error-500/30">
          <AlertCircle className="w-5 h-5 text-error-400 shrink-0" />
          <span className="text-sm text-error-400">{error}</span>
        </div>
      )}
      {success && (
        <div className="clay-sm p-4 mb-4 flex items-center gap-3 border border-success-500/30">
          <Check className="w-5 h-5 text-success-400 shrink-0" />
          <span className="text-sm text-success-400">{success}</span>
        </div>
      )}

      {showAdd && (
        <form onSubmit={handleAdd} className="clay-lg p-6 mb-6 animate-scale-in">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Add Bitcoin Payout Address</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink-200 mb-2">Label</label>
              <input
                type="text"
                value={label}
                onChange={e => setLabel(e.target.value)}
                className="w-full px-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
                placeholder="My Hardware Wallet"
              />
            </div>
            <div>
              <label className="block text-sm text-ink-200 mb-2">Bitcoin Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 font-mono text-sm"
                placeholder="bc1q..."
              />
              <p className="text-xs text-ink-400 mt-2">Enter a valid BTC address (Bech32, P2PKH, or P2SH)</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" className="clay-button-gold">Add Wallet</button>
              <button type="button" onClick={() => setShowAdd(false)} className="clay-button-dark">Cancel</button>
            </div>
          </div>
        </form>
      )}

      {wallets.length === 0 && !showAdd ? (
        <div className="clay-lg p-12 text-center">
          <Wallet className="w-16 h-16 text-ink-600 mx-auto mb-6" />
          <h3 className="font-display font-semibold text-xl text-white mb-2">No wallet destinations yet</h3>
          <p className="text-ink-300 mb-6">Add a Bitcoin payout address to receive your mining rewards.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {wallets.map(w => (
            <div key={w.id} className={`clay-lg p-6 ${w.is_active ? 'border-gradient' : ''}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl clay-sm flex items-center justify-center">
                    <Bitcoin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{w.label}</div>
                    <div className="text-xs text-ink-400">{w.network}</div>
                  </div>
                </div>
                {w.is_active && (
                  <span className="text-xs font-mono px-2 py-1 rounded-full bg-success-500/10 text-success-400 flex items-center gap-1">
                    <span className="status-online" /> ACTIVE
                  </span>
                )}
              </div>

              <div className="clay-inset p-3 mb-4">
                <div className="text-xs font-mono text-ink-400 mb-1">BTC ADDRESS</div>
                <div className="text-sm font-mono text-white break-all">{w.btc_address}</div>
              </div>

              <div className="flex items-center justify-between text-xs text-ink-400 mb-4">
                <span>Added: {formatDate(w.created_at)}</span>
                <span className="flex items-center gap-1 text-success-400">
                  <Check className="w-3 h-3" /> Verified
                </span>
              </div>

              <div className="flex gap-2">
                {!w.is_active && (
                  <button onClick={() => setActive(w.id)} className="clay-button-dark text-sm flex items-center gap-2 flex-1 justify-center">
                    <Power className="w-4 h-4 text-success-400" /> Set Active
                  </button>
                )}
                <button onClick={() => deleteWallet(w.id)} className="px-3 py-2 rounded-xl clay-button-dark text-error-400 hover:bg-error-500/10">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
