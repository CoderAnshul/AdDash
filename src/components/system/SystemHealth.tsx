import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Activity, AlertTriangle, CheckCircle, Database, Server, Zap } from 'lucide-react';

export function SystemHealth() {
  const crashReports = [
    { id: 1, error: 'NullPointerException in SessionService', count: 3, lastSeen: '2 hours ago' },
    { id: 2, error: 'Database connection timeout', count: 1, lastSeen: '5 hours ago' }
  ];

  const apiErrors = [
    { endpoint: '/api/sessions/create', status: 500, count: 5, lastSeen: '1 hour ago' },
    { endpoint: '/api/payments/verify', status: 503, count: 2, lastSeen: '3 hours ago' }
  ];

  const serverMetrics = [
    { metric: 'CPU Usage', value: '45%', status: 'normal' },
    { metric: 'Memory Usage', value: '62%', status: 'normal' },
    { metric: 'Disk Usage', value: '38%', status: 'normal' },
    { metric: 'Network Latency', value: '23ms', status: 'normal' },
    { metric: 'Database Connections', value: '45/100', status: 'normal' },
    { metric: 'Active Sessions', value: '234', status: 'normal' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1>System Health & Logs</h1>
        <p className="text-gray-500 mt-1">Monitor system performance and error logs</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">System Status</p>
                <h3 className="mt-2">Healthy</h3>
                <Badge className="mt-2 bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  All Systems Operational
                </Badge>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Uptime</p>
                <h3 className="mt-2">99.98%</h3>
                <p className="text-xs text-gray-500 mt-2">Last 30 days</p>
              </div>
              <Server className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Response Time</p>
                <h3 className="mt-2">145ms</h3>
                <p className="text-xs text-gray-500 mt-2">Average</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="metrics">
        <TabsList>
          <TabsTrigger value="metrics">Server Metrics</TabsTrigger>
          <TabsTrigger value="crashes">Crash Reports ({crashReports.length})</TabsTrigger>
          <TabsTrigger value="api">API Errors ({apiErrors.length})</TabsTrigger>
          <TabsTrigger value="backup">Backup & Restore</TabsTrigger>
        </TabsList>

        <TabsContent value="metrics">
          <Card>
            <CardHeader>
              <CardTitle>Server Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {serverMetrics.map((metric, idx) => (
                  <div key={idx} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">{metric.metric}</p>
                        <h3 className="mt-1">{metric.value}</h3>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Normal
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crashes">
          <Card>
            <CardHeader>
              <CardTitle>Recent Crash Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {crashReports.map((crash) => (
                  <div key={crash.id} className="p-4 border rounded-lg bg-red-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <span className="text-sm font-mono">{crash.error}</span>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-2">
                          <span>Occurrences: {crash.count}</span>
                          <span>Last seen: {crash.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>API Error Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {apiErrors.map((error, idx) => (
                  <div key={idx} className="p-4 border rounded-lg bg-orange-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-mono">{error.endpoint}</span>
                          <Badge className="bg-red-100 text-red-800">{error.status}</Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-600 mt-2">
                          <span>Count: {error.count}</span>
                          <span>Last seen: {error.lastSeen}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="backup">
          <Card>
            <CardHeader>
              <CardTitle>Backup & Restore</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Database className="h-5 w-5 text-blue-600" />
                    <h4 className="text-sm">Automated Backups</h4>
                  </div>
                  <p className="text-sm text-blue-800">
                    Daily backups are running at 2:00 AM UTC
                  </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm">Recent Backups</h4>
                  {['2025-10-26 02:00', '2025-10-25 02:00', '2025-10-24 02:00'].map((date, idx) => (
                    <div key={idx} className="p-3 border rounded-lg flex items-center justify-between">
                      <div>
                        <p className="text-sm font-mono">{date}</p>
                        <p className="text-xs text-gray-500">Size: 2.4 GB</p>
                      </div>
                      <Badge className="bg-green-100 text-green-800">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Success
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
