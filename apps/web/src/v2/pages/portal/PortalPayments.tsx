import { useEffect, useState } from 'react';
import { CreditCard, Bitcoin, CheckCircle2, Clock, XCircle, ExternalLink } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { formatUsd, formatDateTime } from '@v2/lib/constants';
import type { PaymentIntent, CryptoInvoice } from '@v2/types';

export function PortalPayments() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [intents, setIntents] = useState<PaymentIntent[]>([]);
  const [invoices, setInvoices] = useState<CryptoInvoice[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [intentsRes, invoicesRes] = await Promise.all([
        supabase.from('payment_intents').select('*').eq('user_id', user.id).order('created_at', { ascending: false }),
        supabase.from('crypto_invoices').select('*, payment_intent:payment_intents(*)').order('created_at', { ascending: false }),
      ]);
      setIntents((intentsRes.data as unknown as PaymentIntent[]) || []);
      const userInvoices = (invoicesRes.data as unknown as (CryptoInvoice & { payment_intent?: PaymentIntent })[])?.filter(
        inv => inv.payment_intent?.user_id === user.id
      ) || [];
      setInvoices(userInvoices);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <PortalLayout title="Payments"><div className="skeleton h-96" /></PortalLayout>;

  return (
    <PortalLayout title="Payments">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="clay-lg p-5">
          <CreditCard className="w-5 h-5 text-gold-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{intents.length}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Total Payments</div>
        </div>
        <div className="clay-lg p-5">
          <CheckCircle2 className="w-5 h-5 text-success-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{intents.filter(i => i.status === 'confirmed').length}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Confirmed</div>
        </div>
        <div className="clay-lg p-5">
          <Clock className="w-5 h-5 text-warning-500 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{intents.filter(i => i.status === 'pending' || i.status === 'processing').length}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Pending</div>
        </div>
        <div className="clay-lg p-5">
          <XCircle className="w-5 h-5 text-error-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{intents.filter(i => i.status === 'failed' || i.status === 'expired').length}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Failed / Expired</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Payment intents */}
        <div className="clay-lg p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Payment History</h3>
          {intents.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-10 h-10 text-ink-600 mx-auto mb-3" />
              <p className="text-sm text-ink-400">No payments yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {intents.map(intent => (
                <div key={intent.id} className="clay-sm p-4 flex items-center justify-between">
                  <div>
                    <div className="text-sm font-mono text-white">{formatUsd(intent.amount_usd)}</div>
                    <div className="text-xs text-ink-400">{intent.provider} — {formatDateTime(intent.created_at)}</div>
                  </div>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${
                    intent.status === 'confirmed' ? 'bg-success-500/10 text-success-400' :
                    intent.status === 'pending' || intent.status === 'processing' ? 'bg-warning-500/10 text-warning-500' :
                    intent.status === 'failed' || intent.status === 'expired' ? 'bg-error-500/10 text-error-400' :
                    'bg-ink-700 text-ink-300'
                  }`}>{intent.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Crypto invoices */}
        <div className="clay-lg p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Crypto Invoices</h3>
          {invoices.length === 0 ? (
            <div className="text-center py-8">
              <Bitcoin className="w-10 h-10 text-ink-600 mx-auto mb-3" />
              <p className="text-sm text-ink-400">No crypto invoices yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {invoices.map(inv => (
                <div key={inv.id} className="clay-sm p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-ink-400">{inv.invoice_id}</span>
                    <span className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      inv.status === 'confirmed' ? 'bg-success-500/10 text-success-400' :
                      inv.status === 'paid' ? 'bg-gold-400/10 text-gold-400' :
                      inv.status === 'expired' ? 'bg-error-500/10 text-error-400' :
                      'bg-ink-700 text-ink-300'
                    }`}>{inv.status}</span>
                  </div>
                  <div className="text-sm text-white font-mono">{inv.receiving_address.substring(0, 20)}...</div>
                  <div className="flex items-center justify-between mt-2 text-xs">
                    <span className="text-gold-400">{(inv.amount_crypto / 100000000).toFixed(8)} {inv.crypto_currency}</span>
                    <button className="text-accent-400 hover:underline flex items-center gap-1">
                      View <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}
