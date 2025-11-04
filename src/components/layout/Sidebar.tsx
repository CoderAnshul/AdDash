import { cn } from '../../lib/utils';
import { useAuth } from '../../lib/auth';
import { 
  LayoutDashboard, Users, Headphones, MessageSquare, Wallet, 
  Ticket, Bell, BarChart3, Settings, Shield, Activity, 
  FileText, UserCog, Lock, ShieldCheck
} from 'lucide-react';
import { Badge } from '../ui/badge';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  permission?: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: 'dashboard' },
  { label: 'Users', icon: Users, path: 'users', permission: 'users' },
  { label: 'Listeners', icon: Headphones, path: 'listeners', permission: 'users' },
  { label: 'Sessions', icon: MessageSquare, path: 'sessions', permission: 'sessions' },
  { label: 'Compliance', icon: Lock, path: 'compliance', permission: 'compliance' },
  { label: 'Wallet & Payments', icon: Wallet, path: 'wallet', permission: 'wallet' },
  { label: 'Support Tickets', icon: Ticket, path: 'tickets', permission: 'tickets', badge: 12 },
  { label: 'Notifications', icon: Bell, path: 'notifications', permission: 'users' },
  { label: 'Reports', icon: BarChart3, path: 'reports', permission: 'reports' },
  { label: 'Settings', icon: Settings, path: 'settings', permission: 'users' },
  { label: 'Admin Management', icon: UserCog, path: 'admin', permission: '*' },
  { label: 'Roles & Permissions', icon: ShieldCheck, path: 'roles', permission: '*' },
  { label: 'System Health', icon: Activity, path: 'system', permission: '*' }
];

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
}

export function Sidebar({ currentView, onNavigate }: SidebarProps) {
  const { admin, hasPermission } = useAuth();

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg">ListenNow</h1>
            <p className="text-xs text-gray-500">Admin Panel</p>
          </div>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            // Check permissions
            if (item.permission && item.permission !== '*' && !hasPermission(item.permission)) {
              return null;
            }
            if (item.permission === '*' && !hasPermission('*')) {
              return null;
            }

            const Icon = item.icon;
            const isActive = currentView === item.path;

            return (
              <button
                key={item.path}
                onClick={() => onNavigate(item.path)}
                className={cn(
                  'w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-50'
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </div>
                {item.badge && (
                  <Badge variant="secondary" className="ml-auto">
                    {item.badge}
                  </Badge>
                )}
              </button>
            );
          })}
        </nav>

        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="px-3 py-2 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white text-sm">
                {admin?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{admin?.name}</p>
                <p className="text-xs text-gray-500">{admin?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
