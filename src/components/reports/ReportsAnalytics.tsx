import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, Calendar, TrendingUp } from 'lucide-react';
import { dailyActiveUsersData, revenueData, mockUsers, mockSessions, mockListeners } from '../../lib/mockData';
import { formatCurrency, exportToCSV } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

export function ReportsAnalytics() {
  const [dateRange, setDateRange] = useState('last_30_days');

  const userGrowthData = [
    { month: 'May', users: 8500 },
    { month: 'Jun', users: 9800 },
    { month: 'Jul', users: 10500 },
    { month: 'Aug', users: 11200 },
    { month: 'Sep', users: 12000 },
    { month: 'Oct', users: 12847 }
  ];

  const sessionEngagementData = [
    { day: 'Mon', sessions: 145 },
    { day: 'Tue', sessions: 168 },
    { day: 'Wed', sessions: 152 },
    { day: 'Thu', sessions: 189 },
    { day: 'Fri', sessions: 176 },
    { day: 'Sat', sessions: 198 },
    { day: 'Sun', sessions: 165 }
  ];

  const handleExportReport = (reportName: string) => {
    toast.success('Exporting Report', {
      description: `${reportName} is being generated...`
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Reports & Analytics</h1>
          <p className="text-gray-500 mt-1">View detailed analytics and export reports</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="last_7_days">Last 7 Days</option>
            <option value="last_30_days">Last 30 Days</option>
            <option value="last_90_days">Last 90 Days</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>
      </div>

      <Tabs defaultValue="users">
        <TabsList>
          <TabsTrigger value="users">User Growth</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="sessions">Session Engagement</TabsTrigger>
          <TabsTrigger value="listeners">Listener Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>User Growth Report</CardTitle>
                <Button onClick={() => handleExportReport('User Growth')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={userGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} name="Total Users" />
                </LineChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <h3 className="mt-1">{mockUsers.length}</h3>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Active Users</p>
                  <h3 className="mt-1">{mockUsers.filter(u => u.status === 'active').length}</h3>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-sm text-gray-600">Blocked Users</p>
                  <h3 className="mt-1">{mockUsers.filter(u => u.status === 'blocked').length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Revenue Report</CardTitle>
                <Button onClick={() => handleExportReport('Revenue')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => formatCurrency(value as number)} />
                  <Bar dataKey="revenue" fill="#10b981" name="Revenue" />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <h3 className="mt-1">{formatCurrency(revenueData.reduce((s, d) => s + d.revenue, 0))}</h3>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Avg Monthly</p>
                  <h3 className="mt-1">{formatCurrency(revenueData.reduce((s, d) => s + d.revenue, 0) / revenueData.length)}</h3>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <div className="flex items-center mt-1">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-1" />
                    <h3>12.5%</h3>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Session Engagement Report</CardTitle>
                <Button onClick={() => handleExportReport('Session Engagement')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sessionEngagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sessions" fill="#8b5cf6" name="Sessions" />
                </BarChart>
              </ResponsiveContainer>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">Total Sessions</p>
                  <h3 className="mt-1">{mockSessions.length}</h3>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600">Chat Sessions</p>
                  <h3 className="mt-1">{mockSessions.filter(s => s.type === 'chat').length}</h3>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Audio Sessions</p>
                  <h3 className="mt-1">{mockSessions.filter(s => s.type === 'audio').length}</h3>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Video Sessions</p>
                  <h3 className="mt-1">{mockSessions.filter(s => s.type === 'video').length}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="listeners">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Listener Performance Report</CardTitle>
                <Button onClick={() => handleExportReport('Listener Performance')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockListeners.map((listener) => (
                  <div key={listener.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm">{listener.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {listener.totalSessions} sessions • Rating: {listener.rating}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">{formatCurrency(listener.earnings)}</p>
                        <p className="text-xs text-gray-500 mt-1">Total Earnings</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
