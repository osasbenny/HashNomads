import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Plus, ArrowRight } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { PortalLayout } from './PortalLayout';
import { ORDER_STATUSES, formatUsd, formatDate } from '@v2/lib/constants';
import type { Order } from '@v2/types';

export function PortalOrders() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_lines(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      setOrders((data as unknown as Order[]) || []);
      setLoading(false);
    })();
  }, [user]);

  if (loading) return <PortalLayout title="Orders"><div className="skeleton h-96" /></PortalLayout>;

  return (
    <PortalLayout title="Orders">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-300">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>
        <Link to="/purchase" className="clay-button-gold flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="clay-lg p-12 text-center">
          <ShoppingBag className="w-16 h-16 text-ink-600 mx-auto mb-6" />
          <h3 className="font-display font-semibold text-xl text-white mb-2">No orders yet</h3>
          <p className="text-ink-300 mb-6">Browse our ASIC marketplace to place your first order.</p>
          <Link to="/purchase" className="clay-button-gold inline-flex items-center gap-2">
            Browse Marketplace <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const status = ORDER_STATUSES[order.status];
            return (
              <div key={order.id} className="clay-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-white font-medium">{order.order_number}</span>
                      <span className={`text-xs font-mono px-2.5 py-1 rounded-full ${status.bg} ${status.color}`}>{status.label}</span>
                    </div>
                    <p className="text-xs text-ink-400">{formatDate(order.created_at)}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-display font-bold text-gold-400">{formatUsd(order.total_usd)}</div>
                    <div className="text-xs text-ink-400">{order.order_lines?.length || 0} item{(order.order_lines?.length || 0) !== 1 ? 's' : ''}</div>
                  </div>
                </div>

                {order.order_lines && order.order_lines.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-ink-700/30 space-y-2">
                    {order.order_lines.map(line => (
                      <div key={line.id} className="flex justify-between text-sm">
                        <span className="text-ink-200">{line.quantity}x ASIC Miner + Hosting Setup</span>
                        <span className="text-white font-mono">{formatUsd(line.line_total_usd)}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex gap-3">
                  <Link to={`/portal/payments`} className="text-sm text-gold-400 hover:underline">View Payment Details</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalLayout>
  );
}
