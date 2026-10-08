import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PortalLayout } from './PortalLayout';
import { supabase } from '@v2/lib/supabase';
import { useAuth } from '@v2/contexts/AuthContext';
import {
  LifeBuoy, Send, Shield, FileText, Bell, User, Mail, Phone, Globe,
  CheckCircle2, AlertCircle, MessageSquare, Download, FileCheck, BellRing,
} from 'lucide-react';
import type { SupportCase } from '@v2/types';

// ===================== SUPPORT =====================
export function PortalSupport() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [cases, setCases] = useState<SupportCase[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase.from('support_cases').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setCases((data as unknown as SupportCase[]) || []);
      setLoading(false);
    })();
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !subject.trim() || !message.trim()) return;
    const result = await supabase.from('support_cases').insert({
      user_id: user.id,
      subject: subject.trim(),
      message: message.trim(),
      category,
      priority: 'normal',
      status: 'open',
    });
    if (result.error) { setSubmitError(result.error.message); return; }
    setSubmitError(null); setSubject(''); setMessage(''); setShowForm(false); setSuccess(true);
    const { data } = await supabase.from('support_cases').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
    setCases((data as unknown as SupportCase[]) || []);
  }

  if (loading) return <PortalLayout title="Support"><div className="skeleton h-96" /></PortalLayout>;

  return (
    <PortalLayout title="Support">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-ink-300">{cases.length} support case{cases.length !== 1 ? 's' : ''}</p>
        <button onClick={() => setShowForm(!showForm)} className="clay-button-gold flex items-center gap-2 text-sm">
          <Send className="w-4 h-4" /> New Case
        </button>
      </div>

      {submitError && <p role="alert" className="text-error-400 mb-4">{submitError}</p>}
      {success && (
        <div className="clay-sm p-4 mb-4 flex items-center gap-3 border border-success-500/30">
          <CheckCircle2 className="w-5 h-5 text-success-400" />
          <span className="text-sm text-success-400">Support case created. Our team will respond shortly.</span>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleSubmit} className="clay-lg p-6 mb-6 animate-scale-in">
          <h3 className="font-display font-semibold text-lg text-white mb-4">Create Support Case</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-ink-200 mb-2">Subject</label>
              <input type="text" value={subject} onChange={e => setSubject(e.target.value)} required
                className="w-full px-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50"
                placeholder="Describe your issue briefly" />
            </div>
            <div>
              <label className="block text-sm text-ink-200 mb-2">Category</label>
              <select value={category} onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-3 rounded-xl clay-inset text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50">
                <option value="general">General Inquiry</option>
                <option value="billing">Billing & Payments</option>
                <option value="technical">Technical Issue</option>
                <option value="mining">Mining & Telemetry</option>
                <option value="wallet">Wallet & Payouts</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-ink-200 mb-2">Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} required rows={4}
                className="w-full px-4 py-3 rounded-xl clay-inset text-white placeholder-ink-400 focus:outline-none focus:ring-2 focus:ring-gold-400/50 resize-none"
                placeholder="Provide details about your issue..." />
            </div>
            <button type="submit" className="clay-button-gold">Submit Case</button>
          </div>
        </form>
      )}

      {cases.length === 0 && !showForm ? (
        <div className="clay-lg p-12 text-center">
          <LifeBuoy className="w-16 h-16 text-ink-600 mx-auto mb-6" />
          <h3 className="font-display font-semibold text-xl text-white mb-2">No support cases</h3>
          <p className="text-ink-300 mb-6">Need help? Create a support case and our team will assist you.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {cases.map(c => (
            <div key={c.id} className="clay-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-white">{c.subject}</h4>
                <span className={`text-xs font-mono px-2 py-1 rounded-full ${
                  c.status === 'resolved' || c.status === 'closed' ? 'bg-success-500/10 text-success-400' :
                  c.status === 'in_progress' ? 'bg-warning-500/10 text-warning-500' :
                  'bg-gold-400/10 text-gold-400'
                }`}>{c.status}</span>
              </div>
              <p className="text-sm text-ink-300 mb-2">{c.message}</p>
              <div className="flex items-center gap-3 text-xs text-ink-400">
                <span className="capitalize">{c.category}</span>
                <span>—</span>
                <span>{new Date(c.created_at).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </PortalLayout>
  );
}

// ===================== PROFILE / SECURITY =====================
export function PortalProfile() {
  const { user, profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [company, setCompany] = useState(profile?.company || '');
  const [country, setCountry] = useState(profile?.country || 'US');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  useEffect(() => {
    if (!profile) return;
    setFullName(profile.full_name || '');
    setPhone(profile.phone || '');
    setCompany(profile.company || '');
    setCountry(profile.country || 'US');
  }, [profile]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setSaveError(null);
    const result = await supabase.from('profiles').update({
      full_name: fullName, phone, company, country, updated_at: new Date().toISOString(),
    }).eq('id', user.id);
    if (result.error) {
      setSaveError(result.error.message);
      setSaving(false);
      return;
    }
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <PortalLayout title="Security / Profile">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 clay-lg p-6">
          <h3 className="font-display font-semibold text-lg text-white mb-6">Profile Information</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-ink-200 mb-2">Full Name</label>
                <input type="text" value={fullName} onChange={e => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl clay-inset text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50" />
              </div>
              <div>
                <label className="block text-sm text-ink-200 mb-2">Email (read-only)</label>
                <input type="email" value={user?.email || ''} disabled
                  className="w-full px-4 py-3 rounded-xl clay-inset text-ink-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-sm text-ink-200 mb-2">Phone</label>
                <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl clay-inset text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50" />
              </div>
              <div>
                <label className="block text-sm text-ink-200 mb-2">Company</label>
                <input type="text" value={company} onChange={e => setCompany(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl clay-inset text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50" />
              </div>
              <div>
                <label className="block text-sm text-ink-200 mb-2">Country</label>
                <select value={country} onChange={e => setCountry(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl clay-inset text-white focus:outline-none focus:ring-2 focus:ring-gold-400/50">
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-ink-200 mb-2">Role</label>
                <input type="text" value={profile?.role || 'customer'} disabled
                  className="w-full px-4 py-3 rounded-xl clay-inset text-ink-400 cursor-not-allowed capitalize" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button type="submit" disabled={saving} className="clay-button-gold">
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              {saved && <span className="text-sm text-success-400 flex items-center gap-1"><CheckCircle2 className="w-4 h-4" /> Saved</span>}
              {saveError && <span role="alert" className="text-sm text-error-400">{saveError}</span>}
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <div className="clay-lg p-6">
            <h3 className="font-display font-semibold text-base text-white mb-4">KYC Status</h3>
            <div className={`clay-sm p-4 mb-4 ${profile?.kyc_status === 'verified' ? 'border border-success-500/30' : 'border border-warning-500/30'}`}>
              <div className="flex items-center gap-3">
                {profile?.kyc_status === 'verified' ?
                  <CheckCircle2 className="w-6 h-6 text-success-400" /> :
                  <AlertCircle className="w-6 h-6 text-warning-500" />}
                <div>
                  <div className="text-sm font-medium text-white capitalize">{profile?.kyc_status}</div>
                  <div className="text-xs text-ink-400">
                    {profile?.kyc_status === 'verified' ? 'Identity confirmed' : 'Verification required to purchase miners'}
                  </div>
                </div>
              </div>
            </div>
            {profile?.kyc_status !== 'verified' && (
              <Link className="clay-button-gold w-full text-sm block text-center" to="/kyc-requirements">
                <Shield className="w-4 h-4 inline mr-2" /> KYC Requirements
              </Link>
            )}
          </div>

          <div className="clay-lg p-6">
            <h3 className="font-display font-semibold text-base text-white mb-4">Security</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-ink-300">Password</span>
                <Link to="/account" className="text-success-400 text-xs">Manage</Link>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-300">Session</span>
                <span className="text-success-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-300">2FA</span>
                <span className="text-ink-400 text-xs">{profile ? profile.two_factor_enabled === true ? 'Enabled' : 'Not enabled' : 'Unavailable'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

// ===================== DOCUMENTS =====================
export function PortalDocuments() {


  return (
    <PortalLayout title="Documents">
      <div className="clay-lg p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Your Documents</h3>
        <div className="text-center py-12"><FileText className="w-12 h-12 text-ink-600 mx-auto mb-4" /><p className="text-ink-300">Documents will appear here when issued to your account.</p></div>
      </div>
    </PortalLayout>
  );
}

// ===================== NOTIFICATIONS =====================
export function PortalNotifications() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<{id:string;kind:string;message:string;is_read:boolean;created_at:string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => { if (!user) return; let active=true;
    supabase.from('notifications').select('*').order('created_at', {ascending:false}).then(result=>{
      if (!active) return; setError(Boolean(result.error)); setNotifications(result.data || []); setLoading(false);
    });return()=>{active=false}; }, [user]);

  return (
    <PortalLayout title="Notifications">
      <div className="space-y-3">
        {loading ? <div className="skeleton h-48" /> : error ? <p role="alert" className="text-ink-300">Unable to load notifications. Please try again.</p> : notifications.length===0 ? <div className="clay-lg p-12 text-center"><Bell className="w-12 h-12 text-ink-600 mx-auto mb-4" /><p className="text-ink-300">No notifications yet.</p></div> : null}
        {notifications.map(n => (
          <div key={n.id} className={`clay-lg p-5 ${!n.is_read ? 'border-gradient' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl clay-sm flex items-center justify-center shrink-0">
                <Bell className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white">{n.kind.replace(/_/g, ' ')}</h4>
                  {!n.is_read && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                </div>
                <p className="text-sm text-ink-300 mb-2">{n.message}</p>
                <span className="text-xs text-ink-400">{new Date(n.created_at).toLocaleString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
