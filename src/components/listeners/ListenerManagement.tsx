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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Search, MoreVertical, CheckCircle, XCircle, Ban, DollarSign, Star } from 'lucide-react';
import { mockListeners } from '../../lib/mockData';
import { formatCurrency, formatDate, getStatusColor } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import type { Listener } from '../../lib/types';

export function ListenerManagement() {
  const [listeners, setListeners] = useState(mockListeners);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListener, setSelectedListener] = useState<Listener | null>(null);
  const [showCommissionDialog, setShowCommissionDialog] = useState(false);
  const [newCommission, setNewCommission] = useState('');

  const filteredListeners = listeners.filter(listener =>
    listener.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listener.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listener.expertiseTags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleApprove = (listenerId: string) => {
    setListeners(listeners.map(l =>
      l.id === listenerId ? { ...l, verificationStatus: 'approved' } : l
    ));
    toast.success('Listener Approved', {
      description: 'Listener verification has been approved'
    });
  };

  const handleReject = (listenerId: string) => {
    setListeners(listeners.map(l =>
      l.id === listenerId ? { ...l, verificationStatus: 'rejected' } : l
    ));
    toast.success('Listener Rejected', {
      description: 'Listener verification has been rejected'
    });
  };

  const handleSuspend = (listenerId: string) => {
    const listener = listeners.find(l => l.id === listenerId);
    setListeners(listeners.map(l =>
      l.id === listenerId 
        ? { ...l, verificationStatus: l.verificationStatus === 'suspended' ? 'approved' : 'suspended' }
        : l
    ));
    toast.success(
      listener?.verificationStatus === 'suspended' ? 'Listener Reactivated' : 'Listener Suspended',
      {
        description: listener?.verificationStatus === 'suspended' 
          ? 'Listener has been reactivated' 
          : 'Listener has been suspended'
      }
    );
  };

  const handleCommissionUpdate = () => {
    if (!selectedListener || !newCommission) return;

    setListeners(listeners.map(l =>
      l.id === selectedListener.id ? { ...l, commission: parseFloat(newCommission) } : l
    ));

    toast.success('Commission Updated', {
      description: `Commission rate set to ${newCommission}% for ${selectedListener.name}`
    });

    setShowCommissionDialog(false);
    setNewCommission('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Listener Management</h1>
        <p className="text-gray-500 mt-1">Manage listener verifications, profiles, and payouts</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Listeners ({filteredListeners.length})</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search listeners..."
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
                <TableHead>Listener ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Expertise</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Earnings</TableHead>
                <TableHead>Commission</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListeners.map((listener) => (
                <TableRow key={listener.id}>
                  <TableCell className="font-mono text-xs">{listener.id}</TableCell>
                  <TableCell>
                    <div>
                      <div>{listener.name}</div>
                      <div className="text-xs text-gray-500">{listener.email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {listener.expertiseTags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {listener.expertiseTags.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{listener.expertiseTags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{listener.experience} years</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-500 mr-1" />
                      <span>{listener.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(listener.verificationStatus)}>
                      {listener.verificationStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(listener.earnings)}</TableCell>
                  <TableCell>{listener.commission}%</TableCell>
                  <TableCell>{listener.totalSessions}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {listener.verificationStatus === 'pending' && (
                          <>
                            <DropdownMenuItem onClick={() => handleApprove(listener.id)}>
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              Approve
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleReject(listener.id)}>
                              <XCircle className="mr-2 h-4 w-4 text-red-600" />
                              Reject
                            </DropdownMenuItem>
                          </>
                        )}
                        <DropdownMenuItem onClick={() => handleSuspend(listener.id)}>
                          <Ban className="mr-2 h-4 w-4" />
                          {listener.verificationStatus === 'suspended' ? 'Reactivate' : 'Suspend'}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedListener(listener);
                          setNewCommission(listener.commission.toString());
                          setShowCommissionDialog(true);
                        }}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Manage Commission
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Commission Dialog */}
      <Dialog open={showCommissionDialog} onOpenChange={setShowCommissionDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Commission Rate</DialogTitle>
            <DialogDescription>
              Set commission rate for {selectedListener?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Commission Rate</Label>
              <p className="text-sm mt-1">{selectedListener?.commission}%</p>
            </div>
            <div>
              <Label>New Commission Rate (%)</Label>
              <Input
                type="number"
                placeholder="Enter percentage"
                value={newCommission}
                onChange={(e) => setNewCommission(e.target.value)}
                step="0.5"
                min="0"
                max="100"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCommissionDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleCommissionUpdate}>
              Update Commission
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
