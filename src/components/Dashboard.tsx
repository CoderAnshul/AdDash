import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { mockKPIs, mockActivityFeed, mockDAUMAU, mockRevenueTrend, mockListenerApprovals } from '../lib/mockData';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Headphones, Radio, DollarSign, CreditCard, TicketIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { Badge } from './ui/badge';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B'];

export const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState(mockKPIs);
  const [activityFeed, setActivityFeed] = useState(mockActivityFeed);

  // Simulate real-time updates via WebSocket
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly update KPIs
      setKpis((prev) => ({
        ...prev,
        liveSessions: Math.max(0, prev.liveSessions + (Math.random() > 0.5 ? 1 : -1)),
        openTickets: Math.max(0, prev.openTickets + (Math.random() > 0.6 ? 1 : -1)),
      }));

      // Add new activity occasionally
      if (Math.random() > 0.7) {
        const activities = [
          { type: 'signup', message: `New user registered: User${Math.floor(Math.random() * 1000)}` },
          { type: 'payment', message: `Payment received: ₹${Math.floor(Math.random() * 1000)} from User${Math.floor(Math.random() * 100)}` },
          { type: 'ticket', message: `New ticket opened: Issue #${Math.floor(Math.random() * 100)}` },
        ];
        const newActivity = activities[Math.floor(Math.random() * activities.length)];
        setActivityFeed((prev) => [
          { id: Date.now(), ...newActivity, timestamp: new Date() },
          ...prev.slice(0, 4),
        ]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const kpiCards = [
    { title: 'Total Users', value: kpis.totalUsers.toLocaleString(), icon: Users, color: 'text-blue-600', bg: 'bg-blue-50', change: '+12.5%' },
    { title: 'Active Listeners', value: kpis.activeListeners.toLocaleString(), icon: Headphones, color: 'text-green-600', bg: 'bg-green-50', change: '+8.3%' },
    { title: 'Live Sessions', value: kpis.liveSessions.toLocaleString(), icon: Radio, color: 'text-purple-600', bg: 'bg-purple-50', change: '', realtime: true },
    { title: 'Monthly Revenue', value: `₹${(kpis.monthlyRevenue / 100000).toFixed(2)}L`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', change: '+15.2%' },
    { title: 'Pending Withdrawals', value: kpis.pendingWithdrawals.toLocaleString(), icon: CreditCard, color: 'text-orange-600', bg: 'bg-orange-50', change: '-5.1%' },
    { title: 'Open Tickets', value: kpis.openTickets.toLocaleString(), icon: TicketIcon, color: 'text-red-600', bg: 'bg-red-50', change: '', realtime: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor key metrics and system activity in real-time</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiCards.map((kpi) => {
          const Icon = kpi.icon;
          const isPositive = kpi.change.startsWith('+');
          return (
            <Card key={kpi.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`${kpi.bg} p-3 rounded-lg`}>
                    <Icon className={`w-6 h-6 ${kpi.color}`} />
                  </div>
                  {kpi.realtime && (
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                      Live
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">{kpi.title}</p>
                  <div className="flex items-end justify-between">
                    <h2 className="text-gray-900">{kpi.value}</h2>
                    {kpi.change && (
                      <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                        {isPositive ? <TrendingUp className="w-4 h-4 mr-1" /> : <TrendingDown className="w-4 h-4 mr-1" />}
                        {kpi.change}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DAU/MAU Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Daily & Monthly Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockDAUMAU}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="dau" stroke="#4F46E5" strokeWidth={2} name="Daily Active Users" />
                <Line type="monotone" dataKey="mau" stroke="#10B981" strokeWidth={2} name="Monthly Active Users" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trend (Last 6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockRevenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => `₹${value}`} />
                <Legend />
                <Bar dataKey="revenue" fill="#4F46E5" name="Revenue (₹)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Listener Approvals */}
        <Card>
          <CardHeader>
            <CardTitle>Listener Verification Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={mockListenerApprovals}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => `${entry.status}: ${entry.count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {mockListenerApprovals.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Activity Feed */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activityFeed.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'signup' ? 'bg-blue-500' :
                    activity.type === 'payment' ? 'bg-green-500' :
                    'bg-orange-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
