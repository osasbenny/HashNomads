import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Cpu, Mail, Lock, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@v2/contexts/AuthContext';
import { Asic3DMiner } from '@v2/components/Asic3D';

export function AuthPage({ mode }: { mode: 'login' | 'signup' }) {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isSignup = mode === 'signup';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [country, setCountry] = useState('US');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (isSignup && password.length < 12) {
      setError('Password must be at least 12 characters');
      setLoading(false);
      return;
    }

    try {
      const result = isSignup
        ? await signUp(email, password, fullName)
        : await signIn(email, password);

      if (result.error) {
        setError(result.error);
      } else {
        if (isSignup) {
          // Country is the only extra profile field supported by the current production schema.
          await fetch('/api/v2/data', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              table: 'profiles', operation: 'update', filters: [],
              payload: { full_name: fullName, country, phone: '', company: '' },
            }),
          }).catch(() => null);
        }
        const from = (location.state as { from?: string })?.from || '/portal';
        navigate(from);
      }
    } catch {
      setError(isSignup
        ? 'Unable to complete registration. If you already have an account, try signing in.'
        : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden bg-ink-950">
        <div className="absolute inset-0 bg-hero-radial" />
        <div className="absolute inset-0 bg-grid-pattern bg-grid-lg opacity-30" />
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-gold-400/10 blur-3xl animate-float-slow" />

        <div className="relative z-10 text-center p-12">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-12">
            <div className="w-12 h-12 rounded-xl clay-gold flex items-center justify-center">
              <Cpu className="w-6 h-6 text-ink-950" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col items-start">
              <span className="font-display font-bold text-xl text-white">HashNomads</span>
              <span className="text-2xs font-mono text-gold-400/70">BTC MINING INFRASTRUCTURE</span>
            </div>
          </Link>

          <Asic3DMiner size={260} className="mx-auto mb-8" />

          <h2 className="font-display font-bold text-3xl text-white mb-3">
            We Manage the Hardware.
            <br />
            <span className="text-gradient-gold">You Control the Bitcoin.</span>
          </h2>
          <p className="text-ink-300 max-w-md mx-auto">
            Enterprise-grade ASIC mining infrastructure. Crypto-native payments. Self-custody rewards.
          </p>

          <div className="mt-8 flex justify-center gap-6 text-xs font-mono text-ink-400">
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-success-400" /> US & Canada</span>
            <span className="flex items-center gap-1.5"><Check className="w-3 h-3 text-success-400" /> Self-custody rewards</span>
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 bg-ink-900">
        <div className="w-full max-w-md">
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-10 h-10 rounded-xl clay-gold flex items-center justify-center">
              <Cpu className="w-5 h-5 text-ink-950" strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-lg text-white">HashNomads</span>
          </Link>

          <h1 className="font-display font-bold text-3xl text-white mb-2">
            {isSignup ? 'Create Your Account' : 'Welcome Back'}
          </h1>
          <p className="text-ink-300 mb-8">
            {isSignup ? 'Start mining Bitcoin in minutes.' : 'Sign in to your mining dashboard.'}
          </p>

          {error && (
            <div className="clay-sm p-4 mb-6 flex items-center gap-3 border border-error-500/30">
              <AlertCircle className="w-5 h-5 text-error-400 shrink-0" />
              <span className="text-sm text-error-400">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignup && (
              <div>
                <label className="block text-sm text-ink-200 mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all"
                  placeholder="John Doe"
                />
              </div>
            )}

            <div>
              <label className="block text-sm text-ink-200 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-ink-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {isSignup && (
              <div>
                <label className="block text-sm text-ink-200 mb-2">Country</label>
                <select
                  value={country}
                  onChange={e => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl clay-inset text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50 transition-all"
                >
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full clay-button-gold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Please wait...' : (isSignup ? 'Create Account' : 'Sign In')}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-300">
            {isSignup ? (
              <>Already have an account? <Link to="/login" className="text-gold-400 hover:underline font-medium">Sign in</Link></>
            ) : (
              <>Don't have an account? <Link to="/signup" className="text-gold-400 hover:underline font-medium">Create one</Link></>
            )}
          </p>

          <p className="mt-6 text-center text-xs text-ink-500 font-mono">
            Public platform — Mining integrations in progress.
          </p>
        </div>
      </div>
    </div>
  );
}
