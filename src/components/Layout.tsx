import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../lib/permissions';
import {
  LayoutDashboard,
  Users,
  Headphones,
  MessageSquare,
  Wallet,
  LifeBuoy,
  Bell,
  BarChart3,
  Settings,
  ShieldCheck,
  Activity,
  LogOut,
  Search,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  onNavigate: (view: string) => void;
}

const navigationItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, permission: 'dashboard' as const },
  { id: 'users', label: 'User Management', icon: Users, permission: 'userManagement' as const },
  { id: 'listeners', label: 'Listener Management', icon: Headphones, permission: 'listenerManagement' as const },
  { id: 'sessions', label: 'Session Management', icon: MessageSquare, permission: 'sessionManagement' as const },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck, permission: 'compliance' as const },
  { id: 'wallet', label: 'Wallet & Payments', icon: Wallet, permission: 'walletPayments' as const },
  { id: 'support', label: 'Support Ticketing', icon: LifeBuoy, permission: 'supportTicketing' as const },
  { id: 'notifications', label: 'Notifications', icon: Bell, permission: 'notifications' as const },
  { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, permission: 'reports' as const },
  { id: 'settings', label: 'Settings', icon: Settings, permission: 'settings' as const },
  { id: 'admin', label: 'Admin Management', icon: ShieldCheck, permission: 'adminManagement' as const },
  { id: 'system', label: 'System Health', icon: Activity, permission: 'systemHealth' as const },
];

export const Layout: React.FC<LayoutProps> = ({ children, currentView, onNavigate }) => {
  const { adminName, role, logout, sessionTimeout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const filteredNav = navigationItems.filter((item) => role && hasPermission(role, item.permission));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-0'
        } bg-gray-900 text-white transition-all duration-300 overflow-hidden flex flex-col`}
      >
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-white">Admin Portal</h2>
              <Badge variant="outline" className="mt-2 bg-indigo-600 text-white border-indigo-500">
                {role}
              </Badge>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {filteredNav.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  currentView === item.id
                    ? 'bg-indigo-600 text-white'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span className="text-sm">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center text-sm text-gray-400 mb-3">
            <Clock className="w-4 h-4 mr-2" />
            Session: {formatTime(sessionTimeout)}
          </div>
          <Button
            onClick={logout}
            variant="outline"
            className="w-full bg-gray-800 border-gray-700 text-white hover:bg-gray-700"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-10 w-80"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="w-5 h-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white">
                  3
                </Badge>
              </Button>
              <div className="text-right">
                <p className="text-sm text-gray-900">{adminName}</p>
                <p className="text-xs text-gray-500">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};
