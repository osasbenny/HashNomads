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
    await supabase.from('support_cases').insert({
      user_id: user.id,
      subject: subject.trim(),
      message: message.trim(),
      category,
      priority: 'normal',
      status: 'open',
    });
    setSubject(''); setMessage(''); setShowForm(false); setSuccess(true);
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
                <span className="text-success-400 text-xs">Set</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-300">Session</span>
                <span className="text-success-400 text-xs flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Active</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-ink-300">2FA</span>
                <span className="text-ink-400 text-xs">Not enabled</span>
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
  const docs = [
    { name: 'ASIC Purchase Agreement', type: 'PDF', date: '2026-10-01', icon: FileCheck },
    { name: 'Hosting Service Terms', type: 'PDF', date: '2026-10-01', icon: FileText },
    { name: 'KYC Verification Record', type: 'PDF', date: '2026-10-02', icon: Shield },
    { name: 'Risk Disclosure Statement', type: 'PDF', date: '2026-10-01', icon: AlertCircle },
  ];

  return (
    <PortalLayout title="Documents">
      <div className="clay-lg p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Your Documents</h3>
        {docs.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-ink-600 mx-auto mb-4" />
            <p className="text-ink-300">No documents available yet</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {docs.map((doc, i) => (
              <div key={i} className="clay-sm p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg clay-inset flex items-center justify-center">
                    <doc.icon className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">{doc.name}</div>
                    <div className="text-xs text-ink-400">{doc.type} — {doc.date}</div>
                  </div>
                </div>
                <button className="text-gold-400 hover:text-gold-300">
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </PortalLayout>
  );
}

// ===================== NOTIFICATIONS =====================
export function PortalNotifications() {
  const notifications = [
    { id: 1, title: 'Welcome to HashNomads', body: 'Your account has been created. Complete KYC to start mining.', time: '2 hours ago', read: false, icon: BellRing },
    { id: 2, title: 'System Maintenance', body: 'Scheduled maintenance on Oct 10, 2026 from 02:00-04:00 UTC.', time: '1 day ago', read: false, icon: AlertCircle },
    { id: 3, title: 'New ASIC Available', body: 'Bitmain Antminer S21 Pro is now available in the marketplace.', time: '3 days ago', read: true, icon: MessageSquare },
  ];

  return (
    <PortalLayout title="Notifications">
      <div className="space-y-3">
        {notifications.map(n => (
          <div key={n.id} className={`clay-lg p-5 ${!n.read ? 'border-gradient' : ''}`}>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl clay-sm flex items-center justify-center shrink-0">
                <n.icon className="w-5 h-5 text-gold-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-white">{n.title}</h4>
                  {!n.read && <span className="w-2 h-2 rounded-full bg-gold-400" />}
                </div>
                <p className="text-sm text-ink-300 mb-2">{n.body}</p>
                <span className="text-xs text-ink-400">{n.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </PortalLayout>
  );
}
