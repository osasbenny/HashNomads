export type AsicState =
  | 'inventory'
  | 'assigned'
  | 'deployment_pending'
  | 'deploying'
  | 'online'
  | 'degraded'
  | 'offline'
  | 'maintenance'
  | 'retired';

export type OrderStatus =
  | 'draft'
  | 'quoted'
  | 'payment_pending'
  | 'paid'
  | 'fulfilled'
  | 'cancelled'
  | 'expired';

export type KycStatus = 'pending' | 'submitted' | 'verified' | 'rejected';

export type PaymentProvider = 'btcpay' | 'cryptomus' | 'bitpay';
export type PaymentIntentStatus = 'pending' | 'processing' | 'confirmed' | 'failed' | 'expired' | 'refunded';
export type CryptoInvoiceStatus = 'new' | 'paid' | 'confirmed' | 'expired' | 'underpaid' | 'overpaid' | 'cancelled';

export type DeploymentStatus =
  | 'scheduled'
  | 'in_transit'
  | 'arrived'
  | 'racking'
  | 'configuring'
  | 'online'
  | 'failed'
  | 'decommissioned';

export type HostingInvoiceStatus = 'draft' | 'issued' | 'paid' | 'overdue' | 'cancelled';
export type SupportCaseStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type WalletStatus = 'active' | 'inactive' | 'pending';

export type UserRole = 'customer' | 'support' | 'operations' | 'finance' | 'admin';

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  company: string | null;
  country: string | null;
  phone: string | null;
  role: UserRole;
  kyc_status: KycStatus;
  created_at: string;
  updated_at: string;
}

export interface AsicModel {
  id: string;
  manufacturer: string;
  model: string;
  hashrate_th: number;
  power_w: number;
  efficiency_j_th: number;
  algorithm: string;
  price_usd: number;
  description: string | null;
  image_url: string | null;
  specs: Record<string, string>;
  is_active: boolean;
  sort_order: number;
}

export interface Facility {
  id: string;
  name: string;
  location: string;
  country: string;
  latitude: number | null;
  longitude: number | null;
  total_capacity: number;
  available_capacity: number;
  energy_source: string;
  power_cost_kwh: number;
  climate: string | null;
  image_url: string | null;
  description: string | null;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export interface HostingPlan {
  id: string;
  facility_id: string;
  name: string;
  setup_fee_usd: number;
  monthly_fee_usd: number;
  electricity_rate_kwh: number;
  description: string | null;
  is_active: boolean;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: OrderStatus;
  subtotal_usd: number;
  hosting_setup_usd: number;
  total_usd: number;
  payment_method: string | null;
  payment_provider: string | null;
  expires_at: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  order_lines?: OrderLine[];
}

export interface OrderLine {
  id: string;
  order_id: string;
  asic_model_id: string | null;
  facility_id: string | null;
  hosting_plan_id: string | null;
  quantity: number;
  unit_price_usd: number;
  hosting_setup_usd: number;
  line_total_usd: number;
  asic_model?: AsicModel;
  facility?: Facility;
}

export interface AsicUnit {
  id: string;
  model_id: string;
  serial_number: string;
  state: AsicState;
  facility_id: string | null;
  deployed_at: string | null;
  created_at: string;
  updated_at: string;
  asic_model?: AsicModel;
  facility?: Facility;
}

export interface OwnershipAssignment {
  id: string;
  user_id: string;
  asic_unit_id: string;
  order_id: string | null;
  assigned_at: string;
  asic_unit?: AsicUnit;
}

export interface PaymentIntent {
  id: string;
  order_id: string;
  user_id: string;
  amount_usd: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentIntentStatus;
  created_at: string;
  updated_at: string;
}

export interface CryptoInvoice {
  id: string;
  payment_intent_id: string;
  invoice_id: string;
  receiving_address: string;
  amount_crypto: number;
  crypto_currency: string;
  exchange_rate: number;
  network: string;
  expires_at: string;
  status: CryptoInvoiceStatus;
}

export interface WalletDestination {
  id: string;
  user_id: string;
  label: string;
  btc_address: string;
  network: string;
  is_active: boolean;
  is_verified: boolean;
  activated_at: string | null;
  deactivated_at: string | null;
  created_at: string;
}

export interface RewardEntry {
  id: string;
  user_id: string;
  asic_unit_id: string;
  amount_sat: number;
  pool_name: string | null;
  block_height: number | null;
  payout_tx_hash: string | null;
  status: 'accrued' | 'paid' | 'processing';
  recorded_at: string;
  asic_unit?: AsicUnit;
}

export interface Telemetry {
  id: string;
  asic_unit_id: string;
  hashrate_th: number | null;
  uptime_pct: number | null;
  worker_status: 'active' | 'idle' | 'offline' | 'error' | null;
  shares_accepted: number;
  shares_rejected: number;
  pool_reported_earnings_sat: number;
  recorded_at: string;
}

export interface HostingInvoice {
  id: string;
  user_id: string;
  invoice_number: string;
  period_start: string;
  period_end: string;
  subtotal_usd: number;
  total_usd: number;
  status: HostingInvoiceStatus;
  paid_at: string | null;
  due_at: string | null;
  created_at: string;
  invoice_lines?: InvoiceLine[];
}

export interface InvoiceLine {
  id: string;
  hosting_invoice_id: string;
  description: string;
  quantity: number;
  unit_price_usd: number;
  line_total_usd: number;
}

export interface SupportCase {
  id: string;
  user_id: string;
  subject: string;
  category: string | null;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  status: SupportCaseStatus;
  message: string | null;
  created_at: string;
  updated_at: string;
}

export interface Incident {
  id: string;
  asic_unit_id: string | null;
  facility_id: string | null;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  title: string;
  description: string | null;
  resolved_at: string | null;
  created_at: string;
}
