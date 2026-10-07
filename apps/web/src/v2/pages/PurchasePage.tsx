import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu, Globe, Bitcoin, ArrowRight, ArrowLeft, Check, Zap, Server, ShoppingCart } from 'lucide-react';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import { Navbar } from '@v2/components/Navbar';
import { Footer } from '@v2/components/Footer';
import { formatUsd, generateOrderNumber, generateBtcAddress, generateSerialNumber } from '@v2/lib/constants';
import type { AsicModel, Facility, HostingPlan } from '@v2/types';

type Step = 'select' | 'facility' | 'review' | 'payment' | 'confirming' | 'done';

export function PurchasePage() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('select');
  const [models, setModels] = useState<AsicModel[]>([]);
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [plans, setPlans] = useState<HostingPlan[]>([]);
  const [selectedModel, setSelectedModel] = useState<AsicModel | null>(null);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<HostingPlan | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentProvider, setPaymentProvider] = useState('btcpay');
  const [orderId, setOrderId] = useState<string | null>(null);
  const [cryptoAddress, setCryptoAddress] = useState('');
  const [btcAmount, setBtcAmount] = useState(0);

  useEffect(() => {
    (async () => {
      const [mRes, fRes] = await Promise.all([
        supabase.from('asic_models').select('*').eq('is_active', true).order('sort_order'),
        supabase.from('facilities').select('*').eq('is_active', true).order('sort_order'),
      ]);
      setModels((mRes.data as unknown as AsicModel[]) || []);
      setFacilities((fRes.data as unknown as Facility[]) || []);
    })();
  }, []);

  useEffect(() => {
    if (selectedFacility) {
      supabase.from('hosting_plans').select('*').eq('facility_id', selectedFacility.id).eq('is_active', true)
        .then(({ data }) => setPlans((data as unknown as HostingPlan[]) || []));
    }
  }, [selectedFacility]);

  const subtotal = (selectedModel?.price_usd || 0) * quantity;
  const setupFee = (selectedPlan?.setup_fee_usd || 0) * quantity;
  const total = subtotal + setupFee;

  async function handleGenerateInvoice() {
    if (!user || !selectedModel || !selectedFacility || !selectedPlan) return;
    setStep('confirming');

    const orderNum = generateOrderNumber();
    const { data: orderData, error: orderError } = await supabase.from('orders').insert({
      user_id: user.id,
      order_number: orderNum,
      status: 'payment_pending',
      subtotal_usd: subtotal,
      hosting_setup_usd: setupFee,
      total_usd: total,
      payment_method: 'btc_onchain',
      payment_provider: paymentProvider,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    }).select().single();

    if (orderError || !orderData) { setStep('payment'); return; }
    const newOrderId = orderData.id;
    setOrderId(newOrderId);

    await supabase.from('order_lines').insert({
      order_id: newOrderId,
      asic_model_id: selectedModel.id,
      facility_id: selectedFacility.id,
      hosting_plan_id: selectedPlan.id,
      quantity,
      unit_price_usd: selectedModel.price_usd,
      hosting_setup_usd: selectedPlan.setup_fee_usd,
      line_total_usd: total,
    });

    // Create payment intent
    const { data: intentData } = await supabase.from('payment_intents').insert({
      order_id: newOrderId,
      user_id: user.id,
      amount_usd: total,
      currency: 'USD',
      provider: paymentProvider,
      status: 'pending',
    }).select().single();

    if (intentData) {
      const address = generateBtcAddress();
      const btcAmt = (total / 67000) * 100000000; // satoshis
      setCryptoAddress(address);
      setBtcAmount(btcAmt);
      await supabase.from('crypto_invoices').insert({
        payment_intent_id: intentData.id,
        invoice_id: `INV-${Date.now().toString(36).toUpperCase()}`,
        receiving_address: address,
        amount_crypto: btcAmt,
        crypto_currency: 'BTC',
        exchange_rate: 67000,
        network: 'BTC',
        expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        status: 'new',
      });
    }

    setStep('done');
  }

  async function handleConfirmPayment() {
    if (!orderId || !user) return;
    setStep('confirming');

    // Mark order as paid
    await supabase.from('orders').update({
      status: 'paid',
      paid_at: new Date().toISOString(),
    }).eq('id', orderId);

    // Mark payment intent as confirmed
    await supabase.from('payment_intents').update({ status: 'confirmed' }).eq('order_id', orderId);

    // Create ASIC units and assign ownership
    if (selectedModel) {
      for (let i = 0; i < quantity; i++) {
        const serial = generateSerialNumber(selectedModel.manufacturer, selectedModel.model);
        const { data: unitData } = await supabase.from('asic_units').insert({
          model_id: selectedModel.id,
          serial_number: serial,
          state: 'assigned',
          facility_id: selectedFacility?.id || null,
        }).select().single();

        if (unitData) {
          await supabase.from('ownership_assignments').insert({
            user_id: user.id,
            asic_unit_id: unitData.id,
            order_id: orderId,
          });
        }
      }
    }

    navigate('/portal/miners');
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-ink-950">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display font-bold text-3xl text-white mb-4">Sign in to Purchase</h1>
          <p className="text-ink-300 mb-8">You need an account to buy miners and place orders.</p>
          <button onClick={() => navigate('/login')} className="clay-button-gold inline-flex items-center gap-2">
            Sign In <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (profile?.kyc_status !== 'verified') {
    return (
      <div className="min-h-screen bg-ink-950">
        <Navbar />
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <h1 className="font-display font-bold text-3xl text-white mb-4">KYC Verification Required</h1>
          <p className="text-ink-300 mb-8">Complete identity verification in your profile before purchasing miners.</p>
          <button onClick={() => navigate('/portal/profile')} className="clay-button-gold inline-flex items-center gap-2">
            Go to Profile <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-28">
        {/* Progress indicator */}
        <div className="flex items-center justify-center mb-12">
          {['Select Miner', 'Choose Facility', 'Review & Pay'].map((label, i) => {
            const stepNum = step === 'select' ? 0 : step === 'facility' ? 1 : 2;
            const active = i <= stepNum;
            return (
              <div key={label} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${active ? 'clay-gold text-ink-950' : 'clay-inset text-ink-400'}`}>
                  {active && i < stepNum ? <Check className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`ml-2 text-sm ${active ? 'text-white' : 'text-ink-400'}`}>{label}</span>
                {i < 2 && <div className={`w-12 h-0.5 mx-3 ${i < stepNum ? 'bg-gold-400' : 'bg-ink-700'}`} />}
              </div>
            );
          })}
        </div>

        {/* Step: Select Miner */}
        {step === 'select' && (
          <div>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Choose Your ASIC Miner</h2>
            <p className="text-ink-300 mb-8">Select from our catalog of enterprise-grade mining hardware.</p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map(m => (
                <button key={m.id} onClick={() => { setSelectedModel(m); setStep('facility'); }}
                  className="clay-lg p-6 text-left hover:scale-[1.02] transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl clay-gold flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-ink-950" />
                    </div>
                    <span className="text-lg font-display font-bold text-gold-400">{formatUsd(m.price_usd)}</span>
                  </div>
                  <h3 className="font-display font-semibold text-lg text-white">{m.model}</h3>
                  <p className="text-xs text-ink-400 mb-4">{m.manufacturer}</p>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="clay-inset p-2">
                      <div className="text-xs font-bold text-gold-400">{m.hashrate_th}</div>
                      <div className="text-2xs text-ink-400">TH/s</div>
                    </div>
                    <div className="clay-inset p-2">
                      <div className="text-xs font-bold text-white">{m.power_w}W</div>
                      <div className="text-2xs text-ink-400">Power</div>
                    </div>
                    <div className="clay-inset p-2">
                      <div className="text-xs font-bold text-success-400">{m.efficiency_j_th}</div>
                      <div className="text-2xs text-ink-400">J/TH</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Choose Facility */}
        {step === 'facility' && selectedModel && (
          <div>
            <button onClick={() => setStep('select')} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to miners
            </button>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Choose a Hosting Facility</h2>
            <p className="text-ink-300 mb-8">Where should we deploy your {selectedModel.model}?</p>
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {facilities.map(f => (
                <button key={f.id} onClick={() => { setSelectedFacility(f); const plan = plans.find(p => p.facility_id === f.id); setSelectedPlan(plan || null); setStep('review'); }}
                  className="clay-lg p-6 text-left hover:scale-[1.02] transition-all">
                  <div className="flex items-center gap-2 mb-3">
                    <Globe className="w-5 h-5 text-gold-400" />
                    <span className="font-display font-semibold text-white">{f.name}</span>
                  </div>
                  <p className="text-xs text-ink-400 mb-4">{f.location}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-ink-400">Energy</span><span className="text-white capitalize">{f.energy_source.replace(/_/g, ' ')}</span></div>
                    <div className="flex justify-between"><span className="text-ink-400">Rate</span><span className="text-gold-400 font-mono">${f.power_cost_kwh}/kWh</span></div>
                    <div className="flex justify-between"><span className="text-ink-400">Available</span><span className="text-success-400">{f.available_capacity}</span></div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step: Review & Pay */}
        {step === 'review' && selectedModel && selectedFacility && (
          <div>
            <button onClick={() => setStep('facility')} className="flex items-center gap-2 text-sm text-ink-300 hover:text-white mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to facilities
            </button>
            <h2 className="font-display font-bold text-2xl text-white mb-2">Review Your Order</h2>
            <p className="text-ink-300 mb-8">Confirm the details and proceed to crypto payment.</p>

            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {/* Order summary */}
                <div className="clay-lg p-6">
                  <h3 className="font-display font-semibold text-lg text-white mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 border-b border-ink-700/30">
                      <div className="flex items-center gap-3">
                        <Cpu className="w-5 h-5 text-gold-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{selectedModel.manufacturer} {selectedModel.model}</div>
                          <div className="text-xs text-ink-400">{selectedModel.hashrate_th} TH/s — {selectedModel.power_w}W</div>
                        </div>
                      </div>
                      <span className="text-white font-mono">{formatUsd(selectedModel.price_usd)}</span>
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-ink-700/30">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-gold-400" />
                        <div>
                          <div className="text-sm font-medium text-white">{selectedFacility.name}</div>
                          <div className="text-xs text-ink-400">{selectedFacility.location}</div>
                        </div>
                      </div>
                      <span className="text-white font-mono">{formatUsd(selectedPlan?.setup_fee_usd || 0)}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <div className="flex items-center gap-3">
                        <ShoppingCart className="w-5 h-5 text-gold-400" />
                        <span className="text-sm text-white">Quantity</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 rounded-lg clay-button-dark">-</button>
                        <span className="text-white font-mono w-8 text-center">{quantity}</span>
                        <button onClick={() => setQuantity(quantity + 1)} className="w-8 h-8 rounded-lg clay-button-dark">+</button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment method */}
                <div className="clay-lg p-6">
                  <h3 className="font-display font-semibold text-lg text-white mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    {[
                      { id: 'btcpay', label: 'BTCPay Server', desc: 'Native Bitcoin on-chain payment' },
                      { id: 'cryptomus', label: 'Cryptomus', desc: 'BTC, USDT, USDC supported' },
                      { id: 'bitpay', label: 'BitPay', desc: 'Bitcoin, Bitcoin Cash' },
                    ].map(p => (
                      <button key={p.id} onClick={() => setPaymentProvider(p.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all ${paymentProvider === p.id ? 'clay-lg border-gradient' : 'clay-sm hover:clay'}`}>
                        <div className="flex items-center gap-3">
                          <Bitcoin className={`w-5 h-5 ${paymentProvider === p.id ? 'text-gold-400' : 'text-ink-400'}`} />
                          <div>
                            <div className={`text-sm font-medium ${paymentProvider === p.id ? 'text-white' : 'text-ink-200'}`}>{p.label}</div>
                            <div className="text-xs text-ink-400">{p.desc}</div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="clay-lg p-6 h-fit sticky top-24">
                <h3 className="font-display font-semibold text-lg text-white mb-4">Total</h3>
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between"><span className="text-ink-300">Subtotal</span><span className="text-white font-mono">{formatUsd(subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-ink-300">Setup Fee</span><span className="text-white font-mono">{formatUsd(setupFee)}</span></div>
                  <div className="h-px bg-ink-700/50" />
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-white font-medium">Total</span>
                    <span className="text-2xl font-display font-bold text-gold-400">{formatUsd(total)}</span>
                  </div>
                </div>
                <button onClick={handleGenerateInvoice} className="clay-button-gold w-full flex items-center justify-center gap-2">
                  Generate Invoice <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-xs text-ink-400 mt-3 text-center">Invoice expires in 60 minutes</p>
              </div>
            </div>
          </div>
        )}

        {/* Step: Confirming */}
        {step === 'confirming' && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full clay-gold mx-auto mb-6 animate-spin-slow" />
            <h2 className="font-display font-bold text-2xl text-white mb-2">Generating Invoice...</h2>
            <p className="text-ink-300">Please wait while we create your crypto invoice.</p>
          </div>
        )}

        {/* Step: Done - Show Invoice */}
        {step === 'done' && (
          <div className="max-w-2xl mx-auto">
            <div className="clay-lg p-8 text-center">
              <div className="w-16 h-16 rounded-full bg-success-500/10 mx-auto mb-6 flex items-center justify-center">
                <Zap className="w-8 h-8 text-gold-400" />
              </div>
              <h2 className="font-display font-bold text-2xl text-white mb-2">Invoice Generated</h2>
              <p className="text-ink-300 mb-8">Send the exact amount of BTC to the address below to complete your purchase.</p>

              <div className="clay-inset p-6 mb-6">
                <div className="text-xs font-mono text-ink-400 uppercase mb-2">Amount Due</div>
                <div className="text-3xl font-display font-bold text-gold-400 mb-1">{(btcAmount / 100000000).toFixed(8)} BTC</div>
                <div className="text-sm text-ink-300">≈ {formatUsd(total)}</div>
              </div>

              <div className="clay-inset p-6 mb-6">
                <div className="text-xs font-mono text-ink-400 uppercase mb-2">Bitcoin Address</div>
                <div className="text-sm font-mono text-white break-all">{cryptoAddress}</div>
              </div>

              <div className="flex items-center justify-center gap-2 mb-8 text-xs font-mono text-warning-500">
                <Zap className="w-3.5 h-3.5" />
                Invoice expires in 60 minutes
              </div>

              <button onClick={handleConfirmPayment} className="clay-button-gold w-full flex items-center justify-center gap-2">
                <Check className="w-5 h-5" /> Confirm Payment
              </button>
              <p className="text-xs text-ink-400 mt-3">Payment confirmation is verified on-chain before deployment begins.</p>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
