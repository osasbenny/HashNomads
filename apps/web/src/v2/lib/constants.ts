export const BTC_PRICE_USD = 67000;
export const NETWORK_DIFFICULTY = 8.4e13;
export const BLOCK_REWARD_SAT = 312500000;
export const BLOCKS_PER_DAY = 144;

export const ENERGY_SOURCES: Record<string, { label: string; icon: string; color: string }> = {
  hydro: { label: 'Hydroelectric', icon: 'Waves', color: '#3b82f6' },
  wind_solar: { label: 'Wind & Solar', icon: 'Wind', color: '#10b981' },
  hydro_natural_gas: { label: 'Hydro + Natural Gas', icon: 'Flame', color: '#f59e0b' },
  mixed: { label: 'Mixed Renewables', icon: 'Leaf', color: '#34d399' },
};

export const ASIC_STATES: Record<string, { label: string; color: string; dotClass: string }> = {
  inventory: { label: 'Inventory', color: 'text-ink-300', dotClass: 'status-pending' },
  assigned: { label: 'Assigned', color: 'text-gold-400', dotClass: 'status-pending' },
  deployment_pending: { label: 'Deployment Pending', color: 'text-warning-500', dotClass: 'status-degraded' },
  deploying: { label: 'Deploying', color: 'text-warning-500', dotClass: 'status-degraded' },
  online: { label: 'Online', color: 'text-success-500', dotClass: 'status-online' },
  degraded: { label: 'Degraded', color: 'text-warning-500', dotClass: 'status-degraded' },
  offline: { label: 'Offline', color: 'text-error-500', dotClass: 'status-offline' },
  maintenance: { label: 'Maintenance', color: 'text-accent-400', dotClass: 'status-pending' },
  retired: { label: 'Retired', color: 'text-ink-400', dotClass: 'status-offline' },
};

export const ORDER_STATUSES: Record<string, { label: string; color: string; bg: string }> = {
  draft: { label: 'Draft', color: 'text-ink-300', bg: 'bg-ink-700' },
  quoted: { label: 'Quoted', color: 'text-gold-400', bg: 'bg-gold-400/10' },
  payment_pending: { label: 'Payment Pending', color: 'text-warning-500', bg: 'bg-warning-500/10' },
  paid: { label: 'Paid', color: 'text-success-500', bg: 'bg-success-500/10' },
  fulfilled: { label: 'Fulfilled', color: 'text-success-500', bg: 'bg-success-500/10' },
  cancelled: { label: 'Cancelled', color: 'text-error-500', bg: 'bg-error-500/10' },
  expired: { label: 'Expired', color: 'text-ink-400', bg: 'bg-ink-700' },
};

export const PAYMENT_PROVIDERS = {
  btcpay: { label: 'BTCPay Server', description: 'Native Bitcoin on-chain', currency: 'BTC' },
  cryptomus: { label: 'Cryptomus', description: 'BTC, USDT, USDC', currency: 'BTC' },
  bitpay: { label: 'BitPay', description: 'Bitcoin, Bitcoin Cash', currency: 'BTC' },
};

export function formatUsd(cents: number): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(cents);
}

export function formatBtc(satoshis: number): string {
  return (satoshis / 100000000).toFixed(8) + ' BTC';
}

export function formatSat(satoshis: number): string {
  return new Intl.NumberFormat('en-US').format(satoshis) + ' sat';
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US').format(n);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatDateTime(date: string): string {
  return new Date(date).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export function timeAgo(date: string): string {
  const diff = Date.now() - new Date(date).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(date);
}
