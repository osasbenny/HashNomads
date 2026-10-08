import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Cpu, Zap, Shield, TrendingUp, Globe, Server, Wind, Waves, Leaf, Flame,
  ArrowRight, Check, Bitcoin, Wallet, Activity, Lock, Eye, BarChart3,
  HardHat, Factory, Radio, Gauge, Network, Building2, ChevronDown,
  Sparkles, CircuitBoard, Boxes, Rocket, ArrowUpRight, Quote,
} from 'lucide-react';
import { Asic3DMiner, OrbitingMiners, HashrateVisualization } from '@v2/components/Asic3D';
import { IMAGES } from '@v2/lib/images';
import { useAuth } from '@v2/contexts/AuthContext';

// ===================== HERO =====================
function Hero() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background layers */}
      <div className="absolute inset-0 bg-ink-950" />
      <div className="absolute inset-0 bg-hero-radial" />
      <div className="absolute inset-0 bg-grid-pattern bg-grid-lg opacity-40" />
      <div className="absolute inset-0 bg-noise opacity-30" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl animate-float-slow" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-orange-400/8 blur-3xl animate-float-slow" style={{ animationDelay: '3s' }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="text-center lg:text-left">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full clay-sm mb-6 ${mounted ? 'animate-fade-in-down' : 'opacity-0'}`}>
              <span className="status-online" />
              <span className="text-xs font-mono text-ink-200 tracking-wider">PUBLIC PLATFORM — INTEGRATIONS IN PROGRESS</span>
              <span className="text-gold-400 text-xs font-mono">US & CA</span>
            </div>

            <h1 className={`font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
              We Manage the <span className="text-gradient-gold">Hardware</span>.
              <br />
              You Control the <span className="text-gradient-gold">Bitcoin</span>.
            </h1>

            <p className={`text-lg text-ink-200 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.15s' }}>
              Explore enterprise-grade Bitcoin mining hardware, hosting scenarios, and the HashNomads customer dashboard. Live checkout, facility contracts, and mining telemetry are being connected.
            </p>

            <div className={`flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
              <Link to={user ? "/portal" : "/signup"} className="clay-button-gold text-base px-7 py-4 flex items-center gap-2 group">
                {user ? 'Go to Dashboard' : 'Start Mining'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#miners" className="clay-button-dark text-base px-7 py-4 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-gold-400" />
                Browse Miners
              </a>
            </div>

            {/* Stats ticker */}
            <div className={`grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`} style={{ animationDelay: '0.45s' }}>
              {[
                { label: 'Pool Hashrate', value: '—' },
                { label: 'Active Fleet', value: '—' },
                { label: 'Energy Mix', value: '—' },
              ].map(stat => (
                <div key={stat.label} className="clay-sm p-3 text-center">
                  <div className="text-lg font-display font-bold text-gradient-gold">{stat.value}</div>
                  <div className="text-2xs font-mono text-ink-400 uppercase tracking-wider mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: 3D ASIC + orbiting */}
          <div className={`relative flex items-center justify-center ${mounted ? 'animate-scale-in' : 'opacity-0'}`} style={{ animationDelay: '0.3s' }}>
            <div className="relative w-full max-w-lg aspect-square">
              {/* Orbiting miners background */}
              <OrbitingMiners className="absolute inset-0" />

              {/* Center 3D ASIC */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Asic3DMiner size={240} />
              </div>

              {/* Floating data labels */}
              <div className="absolute top-8 right-4 clay-sm px-3 py-2 animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-success-400" />
                  <div>
                    <div className="text-2xs font-mono text-ink-400">HASHRATE</div>
                    <div className="text-sm font-mono font-bold text-success-400">234 TH/s</div>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-12 left-4 clay-sm px-3 py-2 animate-float" style={{ animationDelay: '1.2s' }}>
                <div className="flex items-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-gold-400" />
                  <div>
                    <div className="text-2xs font-mono text-ink-400">EFFICIENCY</div>
                    <div className="text-sm font-mono font-bold text-gold-400">15 J/TH</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 left-0 clay-sm px-3 py-2 animate-float" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2">
                  <Bitcoin className="w-3.5 h-3.5 text-orange-400" />
                  <div>
                    <div className="text-2xs font-mono text-ink-400">POOL REWARDS</div>
                    <div className="text-sm font-mono font-bold text-orange-400">Awaiting feed</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span className="text-2xs font-mono text-ink-400 uppercase tracking-wider">Scroll</span>
        <ChevronDown className="w-4 h-4 text-ink-400" />
      </div>
    </section>
  );
}

// ===================== LIVE TICKER =====================
function LiveTicker() {
  const items = [
    { label: 'BTC/USD', value: 'Awaiting source', change: '', up: null },
    { label: 'Difficulty', value: 'Awaiting source', change: '', up: null },
    { label: 'Block Reward', value: '3.125 BTC', change: '', up: null },
    { label: 'Pool Hashrate', value: 'Awaiting feed', change: '', up: null },
    { label: 'Workers', value: 'Awaiting feed', change: '', up: null },
    { label: 'Hosting Rates', value: 'Request quote', change: '', up: null },
  ];

  return (
    <div className="relative overflow-hidden bg-ink-900/60 border-y border-ink-800/50 py-3">
      <div className="flex gap-8 animate-marquee whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs font-mono text-ink-400 uppercase tracking-wider">{item.label}</span>
            <span className="text-sm font-mono font-semibold text-white">{item.value}</span>
            {item.change && (
              <span className={`text-xs font-mono ${item.up === true ? 'text-success-400' : item.up === false ? 'text-error-400' : 'text-ink-400'}`}>
                {item.change}
              </span>
            )}
            <div className="w-1 h-1 rounded-full bg-ink-600" />
          </div>
        ))}
      </div>
    </div>
  );
}

// ===================== HOW IT WORKS =====================
export function HowItWorks() {
  const steps = [
    { icon: Building2, num: '01', title: 'Create Account', desc: 'Sign up and complete identity verification (KYC). Your account is ready in minutes.' },
    { icon: Cpu, num: '02', title: 'Choose Your ASIC', desc: 'Browse enterprise-grade miners from Bitmain, MicroBT, and Canaan. Compare specs and pricing.' },
    { icon: Globe, num: '03', title: 'Select a Facility', desc: 'Compare hosting requirements. Operators, capacity, rates and contracts require confirmation.' },
    { icon: Bitcoin, num: '04', title: 'Pay with Crypto', desc: 'A future verified BTCPay or Cryptomus invoice will be issued only when an approved live payment integration is active.' },
    { icon: HardHat, num: '05', title: 'We Deploy', desc: 'Your ASIC is assigned, deployed, and connected to our mining pool. Track the deployment timeline.' },
    { icon: Wallet, num: '06', title: 'Earn Bitcoin', desc: 'Mining rewards flow to your Bitcoin wallet. You control the payout destination — not us.' },
  ];

  return (
    <section id="how-it-works" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern bg-grid-lg opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><Sparkles className="w-3 h-3" /> The Process</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            From Account to <span className="text-gradient-gold">Bitcoin</span> in Six Steps
          </h2>
          <p className="text-lg text-ink-300 max-w-2xl mx-auto">
            A complete digital lifecycle. No hardware to store, no noise to tolerate, no electrician to hire.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.num}
              className="clay-lg p-6 group hover:scale-[1.02] transition-all duration-500 cursor-default"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl clay-gold flex items-center justify-center group-hover:rotate-6 transition-transform">
                  <step.icon className="w-6 h-6 text-ink-950" strokeWidth={2} />
                </div>
                <span className="font-display font-bold text-3xl text-ink-700 group-hover:text-gold-400/30 transition-colors">{step.num}</span>
              </div>
              <h3 className="font-display font-semibold text-xl text-white mb-2">{step.title}</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== PLATFORM FEATURES =====================
function PlatformFeatures() {
  const features = [
    { icon: Activity, title: 'Real-Time Telemetry', desc: 'Designed to monitor verified hashrate, worker status and pool-reported earnings when live provider feeds are connected.' },
    { icon: Bitcoin, title: 'Crypto-Native Payments', desc: 'Planned BTCPay and Cryptomus checkout with server-verified invoices, network confirmations and reconciled settlement.' },
    { icon: Wallet, title: 'Self-Custody Wallets', desc: 'Register your Bitcoin payout address. We never custody your mined Bitcoin. You hold the keys, always.' },
    { icon: Shield, title: 'Enterprise Security', desc: 'Row-level database isolation, RBAC, audit trails, webhook signature verification, and session security.' },
    { icon: BarChart3, title: 'Profitability Engine', desc: 'Explore hypothetical mining scenarios using editable network, energy, hardware and BTC price assumptions.' },
    { icon: Globe, title: 'Global Infrastructure', desc: 'North American facility scenarios showing how energy source, climate, power pricing and operations affect hosting.' },
    { icon: Factory, title: 'Managed Deployments', desc: 'From inventory to online — we handle racking, configuration, pool connection, and ongoing maintenance.' },
    { icon: Gauge, title: 'Hosting Billing', desc: 'Transparent monthly invoices for electricity and hosting. Pay with crypto. See exactly what you are paying for.' },
  ];

  return (
    <section id="platform" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><Server className="w-3 h-3" /> Platform</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Everything You Need to <span className="text-gradient-gold">Mine Bitcoin</span>
          </h2>
          <p className="text-lg text-ink-300 max-w-2xl mx-auto">
            A complete infrastructure platform — from hardware procurement to mining rewards — built for 2027.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <div key={i} className="clay p-6 group hover:border-gradient transition-all duration-300">
              <div className="w-11 h-11 rounded-xl clay-sm flex items-center justify-center mb-4 group-hover:clay-gold transition-all">
                <f.icon className="w-5 h-5 text-gold-400 group-hover:text-ink-950 transition-colors" />
              </div>
              <h3 className="font-display font-semibold text-base text-white mb-2">{f.title}</h3>
              <p className="text-sm text-ink-300 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== ASIC MARKETPLACE =====================
export function AsicMarketplace() {
  const [selected, setSelected] = useState(0);

  const miners = [
    { manufacturer: 'Bitmain', model: 'Antminer S21 Pro', hashrate: '234 TH/s', power: '3510W', efficiency: '15 J/TH', price: 'Request quote', color: 'gold', specs: { algorithm: 'SHA-256', condition: 'Confirm in quote', cooling: 'Confirm specifications', warranty: 'Confirm supplier terms', delivery: 'Confirm in quote' } },
    { manufacturer: 'Bitmain', model: 'Antminer S21 Hydro', hashrate: '335 TH/s', power: '5360W', efficiency: '16 J/TH', price: 'Request quote', color: 'gold', specs: { algorithm: 'SHA-256', condition: 'Confirm in quote', cooling: 'Confirm specifications', warranty: 'Confirm supplier terms', delivery: 'Confirm in quote' } },
    { manufacturer: 'MicroBT', model: 'WhatsMiner M60S', hashrate: '190 TH/s', power: '3472W', efficiency: '18.3 J/TH', price: 'Request quote', color: 'blue', specs: { algorithm: 'SHA-256', condition: 'Confirm in quote', cooling: 'Confirm specifications', warranty: 'Confirm supplier terms', delivery: 'Confirm in quote' } },
    { manufacturer: 'MicroBT', model: 'WhatsMiner M63S', hashrate: '360 TH/s', power: '7215W', efficiency: '20 J/TH', price: 'Request quote', color: 'blue', specs: { algorithm: 'SHA-256', condition: 'Confirm in quote', cooling: 'Confirm specifications', warranty: 'Confirm supplier terms', delivery: 'Confirm in quote' } },
    { manufacturer: 'Canaan', model: 'Avalon A1466', hashrate: '150 TH/s', power: '3230W', efficiency: '21.5 J/TH', price: 'Request quote', color: 'green', specs: { algorithm: 'SHA-256', condition: 'Confirm in quote', cooling: 'Confirm specifications', warranty: 'Confirm supplier terms', delivery: 'Confirm in quote' } },
    { manufacturer: 'Bitmain', model: 'Antminer S21+', hashrate: '216 TH/s', power: '3510W', efficiency: '16.2 J/TH', price: 'Request quote', color: 'gold', specs: { algorithm: 'SHA-256', condition: 'Confirm in quote', cooling: 'Confirm specifications', warranty: 'Confirm supplier terms', delivery: 'Confirm in quote' } },
  ];

  const active = miners[selected];

  return (
    <section id="miners" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><Cpu className="w-3 h-3" /> ASIC Marketplace</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Enterprise-Grade <span className="text-gradient-gold">Mining Hardware</span>
          </h2>
          <p className="text-lg text-ink-300 max-w-2xl mx-auto">
            Compare mining hardware and request confirmed specifications, pricing and availability before purchasing.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Miner selector list */}
          <div className="lg:col-span-1 space-y-3">
            {miners.map((m, i) => (
              <button
                key={m.model}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-4 rounded-2xl transition-all duration-300 ${selected === i ? 'clay-lg border-gradient' : 'clay hover:clay-lg'}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-ink-400 uppercase">{m.manufacturer}</span>
                  <span className={`text-xs font-mono font-bold ${m.color === 'gold' ? 'text-gold-400' : m.color === 'blue' ? 'text-accent-400' : 'text-success-400'}`}>{m.efficiency}</span>
                </div>
                <h3 className={`font-display font-semibold text-lg ${selected === i ? 'text-white' : 'text-ink-100'}`}>{m.model}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-mono text-ink-300">{m.hashrate}</span>
                  <span className="text-sm font-bold text-gold-400">{m.price}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Active miner detail */}
          <div className="lg:col-span-2">
            <div className="clay-lg p-8 h-full">
              <div className="grid md:grid-cols-2 gap-8 h-full">
                {/* Visual */}
                <div className="flex flex-col items-center justify-center">
                  <div className="relative w-full aspect-square max-w-xs flex items-center justify-center">
                    <Asic3DMiner size={220} />
                  </div>
                  <div className="mt-6 w-full">
                    <HashrateVisualization className="clay-inset p-3" />
                    <div className="flex justify-between mt-2 text-2xs font-mono text-ink-400">
                      <span>HASHRATE FEED</span>
                      <span className="text-success-400">AWAITING DATA</span>
                    </div>
                  </div>
                </div>

                {/* Specs */}
                <div className="flex flex-col">
                  <div className="mb-4">
                    <span className="text-xs font-mono text-ink-400 uppercase tracking-wider">{active.manufacturer}</span>
                    <h3 className="font-display font-bold text-2xl text-white">{active.model}</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="clay-sm p-3">
                      <div className="text-2xs font-mono text-ink-400 uppercase">Hashrate</div>
                      <div className="text-lg font-display font-bold text-gold-400">{active.hashrate}</div>
                    </div>
                    <div className="clay-sm p-3">
                      <div className="text-2xs font-mono text-ink-400 uppercase">Power</div>
                      <div className="text-lg font-display font-bold text-white">{active.power}</div>
                    </div>
                    <div className="clay-sm p-3">
                      <div className="text-2xs font-mono text-ink-400 uppercase">Efficiency</div>
                      <div className="text-lg font-display font-bold text-success-400">{active.efficiency}</div>
                    </div>
                    <div className="clay-sm p-3">
                      <div className="text-2xs font-mono text-ink-400 uppercase">Price</div>
                      <div className="text-lg font-display font-bold text-gold-400">{active.price}</div>
                    </div>
                  </div>

                  <div className="space-y-2 mb-6">
                    {Object.entries(active.specs).map(([k, v]) => (
                      <div key={k} className="flex justify-between text-sm">
                        <span className="text-ink-400 capitalize">{k}</span>
                        <span className="text-ink-100 font-medium">{v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-auto">
                    <Link to="/contact?topic=hardware" className="clay-button-gold w-full text-center flex items-center justify-center gap-2 group">
                      Request a quote
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== FACILITIES =====================
export function Facilities() {
  const facilities = [
    {
      name: 'Texas', location: 'Location subject to signed agreement', capacity: 'Not confirmed', available: 'Request quote',
      energy: 'Confirm in agreement', rate: 'Request quote', img: IMAGES.energy.windFarm, icon: Wind, color: 'success',
      features: ['Confirm capacity', 'Confirm custody', 'Confirm maintenance', 'Confirm tariffs'],
    },
    {
      name: 'Canada', location: 'Location subject to signed agreement', capacity: 'Not confirmed', available: 'Request quote',
      energy: 'Confirm in agreement', rate: 'Request quote', img: IMAGES.energy.hydro, icon: Waves, color: 'accent',
      features: ['Confirm capacity', 'Confirm custody', 'Confirm maintenance', 'Confirm tariffs'],
    },
    {
      name: 'Washington', location: 'Location subject to signed agreement', capacity: 'Not confirmed', available: 'Request quote',
      energy: 'Confirm in agreement', rate: 'Request quote', img: IMAGES.energy.hydroValley, icon: Flame, color: 'gold',
      features: ['Confirm capacity', 'Confirm custody', 'Confirm maintenance', 'Confirm tariffs'],
    },
  ];

  return (
    <section id="facilities" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><Globe className="w-3 h-3" /> Hosting Facilities</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Professional <span className="text-gradient-gold">Data Centers</span>
          </h2>
          <p className="text-lg text-ink-300 max-w-2xl mx-auto">
            Discuss hosting locations and requirements with HashNomads. Capacity, energy charges and service terms must be confirmed by a signed agreement.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {facilities.map((f, i) => (
            <div key={i} className="clay-lg overflow-hidden group hover:scale-[1.02] transition-all duration-500">
              {/* Image */}
              <div className="relative h-52 overflow-hidden">
                <img src={f.img} alt={f.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/40 to-transparent" />
                <div className="absolute top-4 left-4 clay-sm px-3 py-1.5">
                  <span className="text-xs font-mono text-gold-400">{f.rate}</span>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center gap-2 mb-1">
                    <f.icon className="w-4 h-4 text-gold-400" />
                    <span className="text-xs font-mono text-ink-200 uppercase tracking-wider">{f.energy}</span>
                  </div>
                  <h3 className="font-display font-bold text-xl text-white">{f.name}</h3>
                  <p className="text-sm text-ink-300">{f.location}</p>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="clay-inset p-3 text-center">
                    <div className="text-lg font-display font-bold text-white">{f.capacity}</div>
                    <div className="text-2xs font-mono text-ink-400 uppercase">Capacity</div>
                  </div>
                  <div className="clay-inset p-3 text-center">
                    <div className="text-lg font-display font-bold text-success-400">{f.available}</div>
                    <div className="text-2xs font-mono text-ink-400 uppercase">Available</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {f.features.map(feat => (
                    <span key={feat} className="text-2xs font-mono px-2.5 py-1 rounded-full bg-ink-800/60 text-ink-200 border border-ink-700/50">
                      {feat}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Map visualization */}
        <div className="mt-8 clay-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-semibold text-lg text-white">North American Footprint</h3>
              <p className="text-sm text-ink-400">Regional hosting enquiries — locations and capacity require confirmation</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="status-online" />
              <span className="text-xs font-mono text-ink-300">HOSTING PARTNERS NOT YET CONFIRMED</span>
            </div>
          </div>
          <div className="relative h-64 rounded-2xl clay-inset overflow-hidden bg-grid-pattern bg-grid-lg">
            {/* Simplified map of North America */}
            <svg viewBox="0 0 800 300" className="w-full h-full opacity-40">
              <path d="M50,80 Q100,60 200,70 L300,65 Q400,60 500,70 L600,75 Q700,80 750,90 L750,200 Q700,220 600,210 L500,215 Q400,220 300,210 L200,200 Q100,210 50,190 Z"
                fill="#161a23" stroke="#2d3548" strokeWidth="1" />
            </svg>

            {/* Facility markers */}
            {[
              { x: '28%', y: '45%', name: 'Texas', bg: 'bg-success-400', glow: '#34d399' },
              { x: '22%', y: '25%', name: 'Canada', bg: 'bg-accent-400', glow: '#60a5fa' },
              { x: '15%', y: '30%', name: 'Washington', bg: 'bg-gold-400', glow: '#f7b32b' },
            ].map(fac => (
              <div key={fac.name} className="absolute flex flex-col items-center" style={{ left: fac.x, top: fac.y }}>
                <div className={`w-3 h-3 rounded-full ${fac.bg} animate-ping absolute`} />
                <div className={`w-3 h-3 rounded-full ${fac.bg}`} style={{ boxShadow: `0 0 12px ${fac.glow}` }} />
                <span className="mt-2 text-2xs font-mono text-ink-200 whitespace-nowrap">{fac.name}</span>
              </div>
            ))}

            {/* Animated connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              <line x1="28%" y1="45%" x2="22%" y2="25%" stroke="rgba(247,179,43,0.15)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1s" repeatCount="indefinite" />
              </line>
              <line x1="22%" y1="25%" x2="15%" y2="30%" stroke="rgba(247,179,43,0.15)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.2s" repeatCount="indefinite" />
              </line>
              <line x1="15%" y1="30%" x2="28%" y2="45%" stroke="rgba(247,179,43,0.15)" strokeWidth="1" strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="0" to="-16" dur="1.5s" repeatCount="indefinite" />
              </line>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== PROFITABILITY CALCULATOR =====================
export function ProfitabilityCalculator() {
  const [hashrate, setHashrate] = useState(234);
  const [power, setPower] = useState(3510);
  const [energyRate, setEnergyRate] = useState(0.042);
  const [btcPrice, setBtcPrice] = useState(67000);
  const [poolFee, setPoolFee] = useState(1.5);

  const dailyEnergyCost = (power * 24 * energyRate) / 1000;
  const networkHashrate = 650 * 1e15; // 650 EH/s approx
  const minerHashrate = hashrate * 1e12;
  const dailyBtc = (minerHashrate / networkHashrate) * 144 * 3.125 * (1 - poolFee / 100);
  const dailyRevenueUsd = dailyBtc * btcPrice;
  const dailyProfit = dailyRevenueUsd - dailyEnergyCost;
  const monthlyProfit = dailyProfit * 30;
  const yearlyProfit = dailyProfit * 365;

  const fmtUsd = (n: number) => {
    const sign = n < 0 ? '-' : '';
    return sign + '$' + Math.abs(n).toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  return (
    <section id="profitability" className="relative py-24 lg:py-32 overflow-hidden">
      <div className="absolute inset-0 bg-hero-radial opacity-20" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><TrendingUp className="w-3 h-3" /> Profitability Engine</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Model Your <span className="text-gradient-gold">Mining Revenue</span>
          </h2>
          <p className="text-lg text-ink-300 max-w-2xl mx-auto">
            Explore illustrative profitability scenarios. Inputs are assumptions, not live BTC price or network-difficulty feeds.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="clay-lg p-8">
            <h3 className="font-display font-semibold text-lg text-white mb-6">Configuration</h3>

            <div className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-ink-200">Hashrate (TH/s)</label>
                  <span className="text-sm font-mono font-bold text-gold-400">{hashrate} TH/s</span>
                </div>
                <input aria-label="Hashrate (TH/s)" type="range" min="50" max="500" value={hashrate} onChange={e => setHashrate(+e.target.value)}
                  className="w-full accent-gold-400" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-ink-200">Power Consumption (W)</label>
                  <span className="text-sm font-mono font-bold text-white">{power}W</span>
                </div>
                <input aria-label="Power Consumption (W)" type="range" min="1000" max="8000" step="10" value={power} onChange={e => setPower(+e.target.value)}
                  className="w-full accent-gold-400" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-ink-200">Energy Rate ($/kWh)</label>
                  <span className="text-sm font-mono font-bold text-gold-400">${energyRate.toFixed(3)}/kWh</span>
                </div>
                <input aria-label="Energy Rate ($/kWh)" type="range" min="0.02" max="0.12" step="0.001" value={energyRate} onChange={e => setEnergyRate(+e.target.value)}
                  className="w-full accent-gold-400" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-ink-200">BTC Price (USD)</label>
                  <span className="text-sm font-mono font-bold text-gold-400">${btcPrice.toLocaleString()}</span>
                </div>
                <input aria-label="BTC Price (USD)" type="range" min="30000" max="150000" step="1000" value={btcPrice} onChange={e => setBtcPrice(+e.target.value)}
                  className="w-full accent-gold-400" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm text-ink-200">Pool Fee (%)</label>
                  <span className="text-sm font-mono font-bold text-white">{poolFee}%</span>
                </div>
                <input aria-label="Pool Fee (%)" type="range" min="0" max="3" step="0.1" value={poolFee} onChange={e => setPoolFee(+e.target.value)}
                  className="w-full accent-gold-400" />
              </div>
            </div>

            <div className="mt-6 p-4 clay-inset rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <CircuitBoard className="w-4 h-4 text-gold-400" />
                <span className="text-xs font-mono text-ink-400 uppercase tracking-wider">Network Context</span>
              </div>
              <div className="grid grid-cols-3 gap-3 text-sm">
                <div><span className="text-ink-400">Difficulty:</span> <span className="text-white font-mono">84.12 T</span></div>
                <div><span className="text-ink-400">Block Reward:</span> <span className="text-white font-mono">3.125 BTC</span></div>
                <div><span className="text-ink-400">Blocks/day:</span> <span className="text-white font-mono">144</span></div>
              </div>
            </div>
          </div>

          {/* Results */}
          <div className="clay-lg p-8">
            <h3 className="font-display font-semibold text-lg text-white mb-6">Projections</h3>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="clay-sm p-4">
                <div className="text-2xs font-mono text-ink-400 uppercase">Daily BTC</div>
                <div className="text-xl font-display font-bold text-orange-400">{dailyBtc.toFixed(6)}</div>
                <div className="text-xs text-ink-400">BTC mined / day</div>
              </div>
              <div className="clay-sm p-4">
                <div className="text-2xs font-mono text-ink-400 uppercase">Energy Cost</div>
                <div className="text-xl font-display font-bold text-error-400">{fmtUsd(dailyEnergyCost)}</div>
                <div className="text-xs text-ink-400">per day</div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="clay-sm p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-ink-300">Daily Profit</div>
                  <div className="text-xs text-ink-400">Revenue minus energy</div>
                </div>
                <div className={`text-2xl font-display font-bold ${dailyProfit >= 0 ? 'text-success-400' : 'text-error-400'}`}>{fmtUsd(dailyProfit)}</div>
              </div>
              <div className="clay-sm p-4 flex items-center justify-between">
                <div>
                  <div className="text-sm text-ink-300">Monthly Profit</div>
                  <div className="text-xs text-ink-400">30-day projection</div>
                </div>
                <div className={`text-2xl font-display font-bold ${monthlyProfit >= 0 ? 'text-success-400' : 'text-error-400'}`}>{fmtUsd(monthlyProfit)}</div>
              </div>
              <div className={`p-4 rounded-xl border-gradient ${dailyProfit >= 0 ? 'clay-sm' : 'clay-inset'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white font-medium">Yearly Profit</div>
                    <div className="text-xs text-ink-400">365-day projection</div>
                  </div>
                  <div className={`text-3xl font-display font-bold ${yearlyProfit >= 0 ? 'text-gradient-gold' : 'text-error-400'}`}>{fmtUsd(yearlyProfit)}</div>
                </div>
              </div>
            </div>

            <div className="clay-inset p-4 rounded-xl">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono text-ink-400 uppercase">Breakdown</span>
                <span className="text-xs font-mono text-gold-400">DAILY</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-ink-300">Gross Revenue</span>
                  <span className="text-success-400 font-mono">{fmtUsd(dailyRevenueUsd)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-300">Pool Fee ({poolFee}%)</span>
                  <span className="text-error-400 font-mono">-{fmtUsd(dailyRevenueUsd * poolFee / 100)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-ink-300">Energy Cost</span>
                  <span className="text-error-400 font-mono">-{fmtUsd(dailyEnergyCost)}</span>
                </div>
                <div className="h-px bg-ink-700/50" />
                <div className="flex justify-between">
                  <span className="text-white font-medium">Net Profit</span>
                  <span className={`font-mono font-bold ${dailyProfit >= 0 ? 'text-success-400' : 'text-error-400'}`}>{fmtUsd(dailyProfit)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== SECURITY =====================
export function SecuritySection() {
  const items = [
    { icon: Lock, title: 'Non-Custodial', desc: 'We never hold your Bitcoin. Mining rewards go directly to your wallet.' },
    { icon: Shield, title: 'Row-Level Security', desc: 'Database-level isolation ensures customers can only access their own data.' },
    { icon: Eye, title: 'Audit Trail', desc: 'Every sensitive action is logged with user, timestamp, and metadata.' },
    { icon: Bitcoin, title: 'BTC Payment Native', desc: 'BTCPay Server integration with on-chain invoice verification.' },
    { icon: Network, title: 'Webhook Verification', desc: 'Payment webhooks are signature-verified to prevent replay attacks.' },
    { icon: Boxes, title: 'RBAC', desc: 'Role-based access control with distinct customer, support, and admin roles.' },
  ];

  return (
    <section id="security" className="relative py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><Shield className="w-3 h-3" /> Security & Compliance</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Built Like a <span className="text-gradient-gold">Financial Institution</span>
          </h2>
          <p className="text-lg text-ink-300 max-w-2xl mx-auto">
            HashNomads manages miners. Customers control Bitcoin. Two financial flows, never combined.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-12">
          {items.map((item, i) => (
            <div key={i} className="clay p-6">
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl clay-sm flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-gold-400" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-ink-300 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Financial separation diagram */}
        <div className="clay-lg p-8">
          <h3 className="font-display font-semibold text-lg text-white mb-2 text-center">Financial Flow Separation</h3>
          <p className="text-sm text-ink-400 text-center mb-8">Two distinct ledgers. Never combined.</p>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="clay-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building2 className="w-5 h-5 text-gold-400" />
                <span className="font-display font-semibold text-white">Commerce Flow</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-ink-200">
                  <span className="w-2 h-2 rounded-full bg-gold-400" /> Customer pays HashNomads
                </div>
                <ArrowRight className="w-4 h-4 text-ink-500 ml-2" />
                <div className="flex items-center gap-2 text-ink-200">
                  <span className="w-2 h-2 rounded-full bg-gold-400" /> Payment via BTCPay / Cryptomus
                </div>
                <ArrowRight className="w-4 h-4 text-ink-500 ml-2" />
                <div className="flex items-center gap-2 text-ink-200">
                  <span className="w-2 h-2 rounded-full bg-gold-400" /> HashNomads treasury
                </div>
                <p className="text-xs text-ink-400 mt-3 pt-3 border-t border-ink-700/40">
                  Covers: ASIC hardware, deployment, hosting, electricity, maintenance, platform fees
                </p>
              </div>
            </div>

            <div className="clay-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Bitcoin className="w-5 h-5 text-orange-400" />
                <span className="font-display font-semibold text-white">Mining Rewards Flow</span>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-2 text-ink-200">
                  <span className="w-2 h-2 rounded-full bg-orange-400" /> ASIC mines blocks
                </div>
                <ArrowRight className="w-4 h-4 text-ink-500 ml-2" />
                <div className="flex items-center gap-2 text-ink-200">
                  <span className="w-2 h-2 rounded-full bg-orange-400" /> Mining pool distributes rewards
                </div>
                <ArrowRight className="w-4 h-4 text-ink-500 ml-2" />
                <div className="flex items-center gap-2 text-ink-200">
                  <span className="w-2 h-2 rounded-full bg-orange-400" /> Customer's Bitcoin wallet
                </div>
                <p className="text-xs text-ink-400 mt-3 pt-3 border-t border-ink-700/40">
                  HashNomads does not custody mined Bitcoin. Customers control the payout destination.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== STATS BANNER =====================
function StatsBanner() {
  const stats = [
    { value: '—', suffix: '', label: 'Pool Hashrate' },
    { value: '—', suffix: '', label: 'Active Fleet' },
    { value: '—', suffix: '', label: 'Energy Mix' },
    { value: 'Quote', suffix: '', label: 'Energy Rate' },
    { value: '—', suffix: '', label: 'Verified Uptime' },
    { value: '6', suffix: '', label: 'Catalogue Models' },
  ];

  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="clay-lg p-10">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl lg:text-4xl font-display font-bold text-gradient-gold mb-1">
                  {s.value}<span className="text-xl">{s.suffix}</span>
                </div>
                <div className="text-xs font-mono text-ink-400 uppercase tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== TESTIMONIALS =====================
function Testimonials() {
  const testimonials = [
    { quote: "Confirm the hardware specification, serial-number assignment and written hosting terms before committing to a purchase.", author: 'Hardware ownership', role: 'Equipment', location: 'Written agreements' },
    { quote: "Payment settlement must be verified by the payment provider before an order can advance to physical miner assignment.", author: 'Verified settlement', role: 'Payments', location: 'Provider verification' },
    { quote: "Mining rewards are intended to go directly from the pool to your verified public wallet address. Never share private keys or recovery phrases.", author: 'Your Bitcoin wallet', role: 'Rewards', location: 'Customer control' },
  ];

  return (
    <section className="py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><Quote className="w-3 h-3" /> Ownership Principles</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Built Around <span className="text-gradient-gold">Your Ownership</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div key={i} className="clay-lg p-8">
              <Quote className="w-8 h-8 text-gold-400/30 mb-4" />
              <p className="text-ink-100 leading-relaxed mb-6">{t.quote}</p>
              <div className="flex items-center gap-3 pt-4 border-t border-ink-700/40">
                <div className="w-10 h-10 rounded-xl bg-gold-gradient flex items-center justify-center text-ink-950 font-bold">
                  {t.author.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{t.author}</div>
                  <div className="text-xs text-ink-400">{t.role} — {t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== FAQ =====================
function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  const faqs = [
    { q: 'Does HashNomads custody my Bitcoin?', a: 'The intended model is pool-to-customer wallet payments without HashNomads custody of mining rewards. The pool payout integration is not yet live; never share private keys or recovery phrases.' },
    { q: 'What payment methods do you accept?', a: 'Live crypto checkout is not enabled yet. BTCPay Server and Cryptomus are planned after merchant approval, signed webhook verification, settlement testing and confirmed inventory.' },
    { q: 'Where are the mining facilities located?', a: 'Contact info@hashnomads.com for regional hosting enquiries. Facility availability, operator identity, custody responsibilities and energy tariffs require confirmation in your hosting agreement.' },
    { q: 'Is this a real production platform?', a: 'The public website and account platform can run in production. Live inventory, paid ASIC orders, hosting assignments, pool telemetry and Bitcoin rewards remain integration and verification milestones.' },
    { q: 'What happens after I purchase an ASIC?', a: 'After confirmed inventory and contract terms, a verified crypto settlement can authorize a serial-numbered ASIC assignment, hosting deployment and pool-linked customer telemetry. That workflow is not yet live.' },
    { q: 'How are hosting fees billed?', a: 'The planned service will issue itemized hosting invoices for contracted facilities, backed by metered energy and verified payment records. This billing service is not yet active.' },
  ];

  return (
    <section id="faq" className="py-24 lg:py-32">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="section-label mb-4"><ChevronDown className="w-3 h-3" /> FAQ</span>
          <h2 className="font-display font-bold text-4xl lg:text-5xl text-white mb-4">
            Questions & <span className="text-gradient-gold">Answers</span>
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className={`clay overflow-hidden transition-all ${open === i ? 'clay-lg' : ''}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <span className="font-display font-medium text-white">{faq.q}</span>
                <ChevronDown className={`w-5 h-5 text-gold-400 transition-transform shrink-0 ml-4 ${open === i ? 'rotate-180' : ''}`} />
              </button>
              {open === i && (
                <div className="px-5 pb-5 text-sm text-ink-300 leading-relaxed animate-fade-in">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ===================== CTA =====================
function CTASection() {
  const { user } = useAuth();
  return (
    <section id="roadmap" className="py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative clay-lg p-12 lg:p-16 text-center overflow-hidden">
          <div className="absolute inset-0 bg-hero-radial opacity-40" />
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-gold-400/10 blur-3xl" />
          <div className="relative">
            <Rocket className="w-12 h-12 text-gold-400 mx-auto mb-6" />
            <h2 className="font-display font-bold text-3xl lg:text-5xl text-white mb-4">
              Ready to Start <span className="text-gradient-gold">Mining Bitcoin?</span>
            </h2>
            <p className="text-lg text-ink-300 max-w-xl mx-auto mb-8">
              Create your account and discuss hardware and hosting with HashNomads. Deployment timelines and service terms are confirmed in your agreement.
            </p>
            <Link to={user ? "/portal" : "/signup"} className="clay-button-gold text-lg px-8 py-4 inline-flex items-center gap-2 group">
              {user ? 'Go to Dashboard' : 'Create Your Account'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-mono text-ink-400">
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success-400" /> No hardware to store</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success-400" /> Crypto-native payments</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success-400" /> Self-custody rewards</span>
              <span className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-success-400" /> Enterprise security</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ===================== MAIN PAGE =====================
export function LandingPage() {
  return (
    <div className="relative">
      <Hero />
      <LiveTicker />
      <HowItWorks />
      <PlatformFeatures />
      <AsicMarketplace />
      <Facilities />
      <ProfitabilityCalculator />
      <StatsBanner />
      <SecuritySection />
      <Testimonials />
      <FAQ />
      <CTASection />
    </div>
  );
}
