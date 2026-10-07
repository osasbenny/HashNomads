import { useEffect, useState } from 'react';
import { Building2, Zap, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { formatUsd, formatDate } from '@v2/lib/constants';
import type { HostingInvoice } from '@v2/types';

export function PortalBilling() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<HostingInvoice[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('hosting_invoices')
        .select('*, invoice_lines(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setInvoices((data as unknown as HostingInvoice[]) || []);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <PortalLayout title="Hosting & Billing"><div className="skeleton h-96" /></PortalLayout>;

  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_usd, 0);
  const totalDue = invoices.filter(i => i.status === 'issued' || i.status === 'overdue').reduce((s, i) => s + i.total_usd, 0);

  return (
    <PortalLayout title="Hosting & Billing">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        <div className="clay-lg p-5">
          <Zap className="w-5 h-5 text-gold-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{formatUsd(totalPaid)}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Total Paid</div>
        </div>
        <div className="clay-lg p-5">
          <Clock className="w-5 h-5 text-warning-500 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{formatUsd(totalDue)}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Outstanding</div>
        </div>
        <div className="clay-lg p-5">
          <FileText className="w-5 h-5 text-accent-400 mb-2" />
          <div className="text-2xl font-display font-bold text-white">{invoices.length}</div>
          <div className="text-xs text-ink-400 font-mono uppercase">Total Invoices</div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="clay-lg p-12 text-center">
          <Building2 className="w-16 h-16 text-ink-600 mx-auto mb-6" />
          <h3 className="font-display font-semibold text-xl text-white mb-2">No hosting invoices yet</h3>
          <p className="text-ink-300">Monthly hosting invoices will appear here once you have active miners deployed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {invoices.map(inv => (
            <div key={inv.id} className="clay-lg p-6">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-mono text-white font-medium">{inv.invoice_number}</span>
                    <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${
                      inv.status === 'paid' ? 'bg-success-500/10 text-success-400' :
                      inv.status === 'overdue' ? 'bg-error-500/10 text-error-400' :
                      inv.status === 'issued' ? 'bg-gold-400/10 text-gold-400' :
                      'bg-ink-700 text-ink-300'
                    }`}>{inv.status}</span>
                  </div>
                  <p className="text-xs text-ink-400">{formatDate(inv.period_start)} — {formatDate(inv.period_end)}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-display font-bold text-gold-400">{formatUsd(inv.total_usd)}</div>
                  {inv.due_at && <p className="text-xs text-ink-400">Due: {formatDate(inv.due_at)}</p>}
                </div>
              </div>

              {inv.invoice_lines && inv.invoice_lines.length > 0 && (
                <div className="pt-4 border-t border-ink-700/30 space-y-2">
                  {inv.invoice_lines.map(line => (
                    <div key={line.id} className="flex justify-between text-sm">
                      <span className="text-ink-200">{line.description}</span>
                      <span className="text-white font-mono">{formatUsd(line.line_total_usd)}</span>
                    </div>
                  ))}
                </div>
              )}

              {(inv.status === 'issued' || inv.status === 'overdue') && (
                <div className="mt-4 pt-4 border-t border-ink-700/30">
                  <button className="clay-button-gold text-sm flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" /> Pay with Crypto
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}
