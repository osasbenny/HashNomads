import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@v2/contexts/AuthContext';
import { Navbar } from '@v2/components/Navbar';
import { Footer } from '@v2/components/Footer';
import { LandingPage } from '@v2/pages/LandingPage';
import { AuthPage } from '@v2/pages/AuthPage';
import { PurchasePage } from '@v2/pages/PurchasePage';
import { PortalLayout } from '@v2/pages/portal/PortalLayout';
import { PortalOverview } from '@v2/pages/portal/PortalOverview';
import { PortalMiners } from '@v2/pages/portal/PortalMiners';
import { PortalEarnings } from '@v2/pages/portal/PortalEarnings';
import { PortalOrders } from '@v2/pages/portal/PortalOrders';
import { PortalPayments } from '@v2/pages/portal/PortalPayments';
import { PortalWallets } from '@v2/pages/portal/PortalWallets';
import { PortalBilling } from '@v2/pages/portal/PortalBilling';
import { PortalSupport, PortalProfile, PortalDocuments, PortalNotifications } from '@v2/pages/portal/PortalMisc';
import { AdminDashboard, AdminCustomers, AdminInventory, AdminPlaceholder } from '@v2/pages/admin/AdminPages';
import type { ReactNode } from 'react';

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="min-h-screen bg-ink-950 flex items-center justify-center"><div className="w-10 h-10 rounded-full clay-gold animate-spin-slow" /></div>;
  if (!user) return <Navigate to="/login" state={{ from: '/portal' }} replace />;
  return <>{children}</>;
}

function PublicPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar />
      {children}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<PublicPage><LandingPage /></PublicPage>} />
          <Route path="/login" element={<AuthPage mode="login" />} />
          <Route path="/signup" element={<AuthPage mode="signup" />} />
          <Route path="/purchase" element={<PurchasePage />} />

          {/* Customer Portal */}
          <Route path="/portal" element={<ProtectedRoute><PortalLayout title="Overview"><PortalOverview /></PortalLayout></ProtectedRoute>} />
          <Route path="/portal/miners" element={<ProtectedRoute><PortalMiners /></ProtectedRoute>} />
          <Route path="/portal/earnings" element={<ProtectedRoute><PortalEarnings /></ProtectedRoute>} />
          <Route path="/portal/orders" element={<ProtectedRoute><PortalOrders /></ProtectedRoute>} />
          <Route path="/portal/payments" element={<ProtectedRoute><PortalPayments /></ProtectedRoute>} />
          <Route path="/portal/wallets" element={<ProtectedRoute><PortalWallets /></ProtectedRoute>} />
          <Route path="/portal/billing" element={<ProtectedRoute><PortalBilling /></ProtectedRoute>} />
          <Route path="/portal/support" element={<ProtectedRoute><PortalSupport /></ProtectedRoute>} />
          <Route path="/portal/profile" element={<ProtectedRoute><PortalProfile /></ProtectedRoute>} />
          <Route path="/portal/documents" element={<ProtectedRoute><PortalDocuments /></ProtectedRoute>} />
          <Route path="/portal/notifications" element={<ProtectedRoute><PortalNotifications /></ProtectedRoute>} />

          {/* Admin Console */}
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/customers" element={<ProtectedRoute><AdminCustomers /></ProtectedRoute>} />
          <Route path="/admin/inventory" element={<ProtectedRoute><AdminInventory /></ProtectedRoute>} />
          <Route path="/admin/orders" element={<ProtectedRoute><AdminPlaceholder title="Orders" /></ProtectedRoute>} />
          <Route path="/admin/fleet" element={<ProtectedRoute><AdminPlaceholder title="Mining Fleet" /></ProtectedRoute>} />
          <Route path="/admin/facilities" element={<ProtectedRoute><AdminPlaceholder title="Facilities" /></ProtectedRoute>} />
          <Route path="/admin/incidents" element={<ProtectedRoute><AdminPlaceholder title="Incidents" /></ProtectedRoute>} />
          <Route path="/admin/support" element={<ProtectedRoute><AdminPlaceholder title="Support" /></ProtectedRoute>} />
          <Route path="/admin/audit" element={<ProtectedRoute><AdminPlaceholder title="Audit Log" /></ProtectedRoute>} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
