import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Search, Video, MessageSquare, Phone, Square, RotateCcw, Download } from 'lucide-react';
import { mockSessions } from '../../lib/mockData';
import { formatCurrency, formatDateTime, getStatusColor } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import type { Session } from '../../lib/types';

export function SessionManagement() {
  const [sessions, setSessions] = useState(mockSessions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showRefundDialog, setShowRefundDialog] = useState(false);

  const filteredSessions = sessions.filter(session =>
    session.userAlias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.listenerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    session.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleForceEnd = (sessionId: string) => {
    setSessions(sessions.map(s =>
      s.id === sessionId ? { ...s, status: 'completed', endTime: new Date().toISOString() } : s
    ));
    toast.success('Session Ended', {
      description: 'Session has been force ended'
    });
  };

  const handleRefund = () => {
    if (!selectedSession) return;

    setSessions(sessions.map(s =>
      s.id === selectedSession.id ? { ...s, paymentStatus: 'refunded' } : s
    ));

    toast.success('Refund Issued', {
      description: `Refund of ${formatCurrency(selectedSession.amount)} has been processed`
    });

    setShowRefundDialog(false);
  };

  const handleDownloadReport = (session: Session) => {
    toast.success('Report Generated', {
      description: `Session report for ${session.id} is being downloaded`
    });
    // In production, this would generate and download a PDF report
  };

  const getSessionIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video className="h-4 w-4" />;
      case 'audio':
        return <Phone className="h-4 w-4" />;
      case 'chat':
        return <MessageSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Session Management</h1>
        <p className="text-gray-500 mt-1">Monitor and manage all user-listener sessions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <h3 className="mt-2">{sessions.length}</h3>
              </div>
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Ongoing</p>
                <h3 className="mt-2">{sessions.filter(s => s.status === 'ongoing').length}</h3>
              </div>
              <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Completed</p>
                <h3 className="mt-2">{sessions.filter(s => s.status === 'completed').length}</h3>
              </div>
              <Badge className="bg-green-100 text-green-800">Done</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Cancelled</p>
                <h3 className="mt-2">{sessions.filter(s => s.status === 'cancelled').length}</h3>
              </div>
              <Badge className="bg-gray-100 text-gray-800">N/A</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Sessions</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search sessions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Session ID</TableHead>
                <TableHead>User</TableHead>
                <TableHead>Listener</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSessions.map((session) => (
                <TableRow key={session.id}>
                  <TableCell className="font-mono text-xs">{session.id}</TableCell>
                  <TableCell>{session.userAlias}</TableCell>
                  <TableCell>{session.listenerName}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {getSessionIcon(session.type)}
                      <span className="capitalize">{session.type}</span>
                    </div>
                  </TableCell>
                  <TableCell>{formatDateTime(session.startTime)}</TableCell>
                  <TableCell>{session.duration} min</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.status)}>
                      {session.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(session.paymentStatus)}>
                      {session.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(session.amount)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {session.status === 'ongoing' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleForceEnd(session.id)}
                        >
                          <Square className="h-3 w-3 mr-1" />
                          End
                        </Button>
                      )}
                      {session.paymentStatus === 'completed' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedSession(session);
                            setShowRefundDialog(true);
                          }}
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Refund
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDownloadReport(session)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Report
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Refund Dialog */}
      <Dialog open={showRefundDialog} onOpenChange={setShowRefundDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Issue Refund</DialogTitle>
            <DialogDescription>
              Are you sure you want to refund this session?
            </DialogDescription>
          </DialogHeader>
          {selectedSession && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Session ID:</span>
                  <span className="text-sm font-mono">{selectedSession.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">User:</span>
                  <span className="text-sm">{selectedSession.userAlias}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Listener:</span>
                  <span className="text-sm">{selectedSession.listenerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm">{formatCurrency(selectedSession.amount)}</span>
                </div>
              </div>
              <p className="text-sm text-gray-600">
                This action will refund {formatCurrency(selectedSession.amount)} to the user's wallet
                and deduct the amount from the listener's pending earnings.
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRefundDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleRefund} variant="destructive">
              Issue Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
