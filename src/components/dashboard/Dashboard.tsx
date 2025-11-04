import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Headphones, Video, DollarSign, ArrowUpCircle, Ticket, TrendingUp, TrendingDown } from 'lucide-react';
import { mockKPIData, mockActivityFeed, dailyActiveUsersData, revenueData, listenerApprovalData } from '../../lib/mockData';
import { formatCurrency, formatRelativeTime } from '../../lib/utils';
import { Badge } from '../ui/badge';

const COLORS = ['#3b82f6', '#f59e0b', '#ef4444', '#f97316'];

export function Dashboard() {
  const [kpiData, setKpiData] = useState(mockKPIData);
  const [activityFeed, setActivityFeed] = useState(mockActivityFeed);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update KPIs slightly
      setKpiData(prev => ({
        ...prev,
        liveSessions: Math.max(0, prev.liveSessions + Math.floor(Math.random() * 5) - 2),
        monthlyRevenue: prev.monthlyRevenue + Math.random() * 100
      }));

      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const activities = [
          { type: 'signup', message: 'New user registered', icon: 'UserPlus' },
          { type: 'payment', message: 'Payment received', icon: 'DollarSign' },
          { type: 'session', message: 'New session started', icon: 'Video' }
        ];
        const activity = activities[Math.floor(Math.random() * activities.length)];
        
        setActivityFeed(prev => [
          {
            id: `activity-${Date.now()}`,
            ...activity,
            timestamp: new Date().toISOString()
          } as any,
          ...prev.slice(0, 9)
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1>Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's an overview of your platform.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Users</p>
                <h3 className="mt-2">{kpiData.totalUsers.toLocaleString()}</h3>
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>12.5%</span>
                </div>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Active Listeners</p>
                <h3 className="mt-2">{kpiData.activeListeners}</h3>
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>8.2%</span>
                </div>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <Headphones className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Live Sessions</p>
                <h3 className="mt-2">{kpiData.liveSessions}</h3>
                <Badge className="mt-2 bg-green-100 text-green-800">Active</Badge>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Video className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Monthly Revenue</p>
                <h3 className="mt-2">{formatCurrency(kpiData.monthlyRevenue)}</h3>
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>15.3%</span>
                </div>
              </div>
              <div className="bg-emerald-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Withdrawals</p>
                <h3 className="mt-2">{formatCurrency(kpiData.pendingWithdrawals)}</h3>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">23 Pending</Badge>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <ArrowUpCircle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open Tickets</p>
                <h3 className="mt-2">{kpiData.openTickets}</h3>
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>3.8%</span>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <Ticket className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Active Users */}
        <Card>
          <CardHeader>
            <CardTitle>Daily Active Users & Listeners</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyActiveUsersData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Users" />
                <Line type="monotone" dataKey="listeners" stroke="#8b5cf6" strokeWidth={2} name="Listeners" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value as number)} />
                <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Listener Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Listener Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={listenerApprovalData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count }) => `${name}: ${count}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {listenerApprovalData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[250px] overflow-y-auto">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-3 border-b last:border-0">
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'signup' ? 'bg-blue-100' :
                    activity.type === 'payment' ? 'bg-green-100' :
                    activity.type === 'ticket' ? 'bg-orange-100' :
                    'bg-purple-100'
                  }`}>
                    {activity.type === 'signup' && <Users className="h-4 w-4 text-blue-600" />}
                    {activity.type === 'payment' && <DollarSign className="h-4 w-4 text-green-600" />}
                    {activity.type === 'ticket' && <Ticket className="h-4 w-4 text-orange-600" />}
                    {activity.type === 'session' && <Video className="h-4 w-4 text-purple-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatRelativeTime(activity.timestamp)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
