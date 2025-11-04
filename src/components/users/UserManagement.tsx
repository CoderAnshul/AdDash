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
import { Search, MoreVertical, Eye, Ban, Trash2, DollarSign, Download, Filter } from 'lucide-react';
import { mockUsers } from '../../lib/mockData';
import { formatCurrency, formatDate, formatRelativeTime, getStatusColor, exportToCSV } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import type { User } from '../../lib/types';

export function UserManagement() {
  const [users, setUsers] = useState(mockUsers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletAction, setWalletAction] = useState<'credit' | 'debit'>('credit');

  const filteredUsers = users.filter(user =>
    user.alias.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.phone.includes(searchQuery)
  );

  const handleBlockUser = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: u.status === 'blocked' ? 'active' : 'blocked' } : u
    ));
    const user = users.find(u => u.id === userId);
    toast.success(user?.status === 'blocked' ? 'User Unblocked' : 'User Blocked', {
      description: `User ${user?.alias} has been ${user?.status === 'blocked' ? 'unblocked' : 'blocked'}`
    });
  };

  const handleSoftDelete = (userId: string) => {
    setUsers(users.map(u =>
      u.id === userId ? { ...u, status: 'deleted' } : u
    ));
    toast.success('User Deleted', {
      description: 'User has been soft deleted'
    });
  };

  const handleWalletAdjust = () => {
    if (!selectedUser || !walletAmount) return;

    const amount = parseFloat(walletAmount);
    const newBalance = walletAction === 'credit'
      ? selectedUser.wallet + amount
      : selectedUser.wallet - amount;

    setUsers(users.map(u =>
      u.id === selectedUser.id ? { ...u, wallet: newBalance } : u
    ));

    toast.success('Wallet Adjusted', {
      description: `${walletAction === 'credit' ? 'Added' : 'Deducted'} ${formatCurrency(amount)} ${walletAction === 'credit' ? 'to' : 'from'} ${selectedUser.alias}'s wallet`
    });

    setShowWalletDialog(false);
    setWalletAmount('');
  };

  const handleExportCSV = () => {
    const exportData = filteredUsers.map(user => ({
      'User ID': user.id,
      'Alias': user.alias,
      'Email': user.email,
      'Phone': user.phone,
      'Status': user.status,
      'Wallet Balance': user.wallet,
      'Registration Date': formatDate(user.registrationDate),
      'Last Active': formatDate(user.lastActive),
      'Total Sessions': user.totalSessions,
      'Total Spent': user.totalSpent
    }));
    exportToCSV(exportData, 'users');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>User Management</h1>
          <p className="text-gray-500 mt-1">Manage and monitor all registered users</p>
        </div>
        <Button onClick={handleExportCSV}>
          <Download className="h-4 w-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users ({filteredUsers.length})</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Registered</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Sessions</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-mono text-xs">{user.id}</TableCell>
                  <TableCell>{user.alias}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{user.email}</div>
                      <div className="text-gray-500">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatCurrency(user.wallet)}</TableCell>
                  <TableCell>{formatDate(user.registrationDate)}</TableCell>
                  <TableCell>{formatRelativeTime(user.lastActive)}</TableCell>
                  <TableCell>{user.totalSessions}</TableCell>
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
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setShowViewDialog(true);
                        }}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleBlockUser(user.id)}>
                          <Ban className="mr-2 h-4 w-4" />
                          {user.status === 'blocked' ? 'Unblock' : 'Block'} User
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => {
                          setSelectedUser(user);
                          setShowWalletDialog(true);
                        }}>
                          <DollarSign className="mr-2 h-4 w-4" />
                          Adjust Wallet
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleSoftDelete(user.id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Soft Delete
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

      {/* View Profile Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
            <DialogDescription>Detailed information about {selectedUser?.alias}</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm font-mono mt-1">{selectedUser.id}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="mt-1">
                    <Badge className={getStatusColor(selectedUser.status)}>
                      {selectedUser.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label>Alias</Label>
                  <p className="text-sm mt-1">{selectedUser.alias}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm mt-1">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label>Wallet Balance</Label>
                  <p className="text-sm mt-1">{formatCurrency(selectedUser.wallet)}</p>
                </div>
                <div>
                  <Label>Registration Date</Label>
                  <p className="text-sm mt-1">{formatDate(selectedUser.registrationDate)}</p>
                </div>
                <div>
                  <Label>Last Active</Label>
                  <p className="text-sm mt-1">{formatRelativeTime(selectedUser.lastActive)}</p>
                </div>
                <div>
                  <Label>Total Sessions</Label>
                  <p className="text-sm mt-1">{selectedUser.totalSessions}</p>
                </div>
                <div>
                  <Label>Total Spent</Label>
                  <p className="text-sm mt-1">{formatCurrency(selectedUser.totalSpent)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Wallet Adjustment Dialog */}
      <Dialog open={showWalletDialog} onOpenChange={setShowWalletDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adjust Wallet Balance</DialogTitle>
            <DialogDescription>
              Manually credit or debit wallet for {selectedUser?.alias}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Current Balance</Label>
              <p className="text-sm mt-1">{selectedUser && formatCurrency(selectedUser.wallet)}</p>
            </div>
            <div>
              <Label>Action</Label>
              <div className="flex space-x-2 mt-2">
                <Button
                  variant={walletAction === 'credit' ? 'default' : 'outline'}
                  onClick={() => setWalletAction('credit')}
                  className="flex-1"
                >
                  Credit
                </Button>
                <Button
                  variant={walletAction === 'debit' ? 'default' : 'outline'}
                  onClick={() => setWalletAction('debit')}
                  className="flex-1"
                >
                  Debit
                </Button>
              </div>
            </div>
            <div>
              <Label>Amount</Label>
              <Input
                type="number"
                placeholder="Enter amount"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
                step="0.01"
                min="0"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowWalletDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleWalletAdjust}>
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
