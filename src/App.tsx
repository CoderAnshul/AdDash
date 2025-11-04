/**
 * Admin Panel for ListenNow Platform
 * 
 * Demo Credentials:
 * - SuperAdmin: superadmin@example.com / admin123 (2FA: 123456)
 * - Support: support@example.com / admin123
 * - Finance: finance@example.com / admin123 (2FA: 123456)
 * - Compliance: compliance@example.com / admin123 (2FA: 123456)
 * 
 * Features:
 * - Role-based access control with 4 admin roles + custom roles
 * - JWT authentication with refresh tokens and session timeout
 * - Dashboard with real-time KPIs and activity feed
 * - User & Listener management with CRUD operations
 * - Session monitoring and management
 * - Compliance viewer with 7-day message retention
 * - Wallet & payment processing with Razorpay integration
 * - Support ticketing system with threaded replies
 * - Push notification center
 * - Analytics and reporting with CSV export
 * - Roles & Permissions management with granular controls
 * - System health monitoring
 * - Audit logging for compliance
 */

import { useState } from 'react';
import { AuthProvider, useAuth } from './lib/auth';
import { LoginPage } from './components/auth/LoginPage';
import { Sidebar } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { Dashboard } from './components/dashboard/Dashboard';
import { UserManagement } from './components/users/UserManagement';
import { ListenerManagement } from './components/listeners/ListenerManagement';
import { SessionManagement } from './components/sessions/SessionManagement';
import { ComplianceViewer } from './components/compliance/ComplianceViewer';
import { WalletPayments } from './components/wallet/WalletPayments';
import { TicketManagement } from './components/tickets/TicketManagement';
import { NotificationCenter } from './components/notifications/NotificationCenter';
import { ReportsAnalytics } from './components/reports/ReportsAnalytics';
import { Settings } from './components/settings/Settings';
import { AdminManagement } from './components/admin/AdminManagement';
import { RolesPermissions } from './components/roles/RolesPermissions';
import { SystemHealth } from './components/system/SystemHealth';
import { Toaster } from './components/ui/sonner';

function AdminPanel() {
  const { admin } = useAuth();
  const [currentView, setCurrentView] = useState('dashboard');

  if (!admin) {
    return <LoginPage />;
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'listeners':
        return <ListenerManagement />;
      case 'sessions':
        return <SessionManagement />;
      case 'compliance':
        return <ComplianceViewer />;
      case 'wallet':
        return <WalletPayments />;
      case 'tickets':
        return <TicketManagement />;
      case 'notifications':
        return <NotificationCenter />;
      case 'reports':
        return <ReportsAnalytics />;
      case 'settings':
        return <Settings />;
      case 'admin':
        return <AdminManagement />;
      case 'roles':
        return <RolesPermissions />;
      case 'system':
        return <SystemHealth />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6">
          {renderView()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AdminPanel />
      <Toaster position="top-right" />
    </AuthProvider>
  );
}
