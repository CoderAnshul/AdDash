import React, { useState } from 'react';
import { mockUsers, User } from '../lib/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Search, Download, Eye, Ban, Trash2, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [walletAdjustOpen, setWalletAdjustOpen] = useState(false);
  const [walletAmount, setWalletAmount] = useState('');
  const [walletType, setWalletType] = useState<'credit' | 'debit'>('credit');

  const itemsPerPage = 10;

  // Filter users
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.alias.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleBlockUnblock = (user: User) => {
    const newStatus = user.status === 'blocked' ? 'active' : 'blocked';
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    toast.success(`User ${newStatus === 'blocked' ? 'blocked' : 'unblocked'} successfully`);
  };

  const handleSoftDelete = (user: User) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === user.id ? { ...u, status: 'deleted' } : u))
    );
    toast.success('User soft deleted successfully');
  };

  const handleWalletAdjust = () => {
    if (!selectedUser || !walletAmount) return;

    const amount = parseFloat(walletAmount);
    setUsers((prev) =>
      prev.map((u) =>
        u.id === selectedUser.id
          ? { ...u, wallet: walletType === 'credit' ? u.wallet + amount : u.wallet - amount }
          : u
      )
    );
    toast.success(`Wallet ${walletType === 'credit' ? 'credited' : 'debited'} successfully`);
    setWalletAdjustOpen(false);
    setWalletAmount('');
  };

  const handleExportCSV = () => {
    const csv = [
      ['User ID', 'Alias', 'Email', 'Phone', 'Status', 'Wallet', 'Reg Date', 'Last Active'].join(','),
      ...filteredUsers.map((u) =>
        [u.id, u.alias, u.email, u.phone, u.status, u.wallet, u.regDate.toISOString(), u.lastActive.toISOString()].join(',')
      ),
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString()}.csv`;
    a.click();
    toast.success('CSV exported successfully');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, view profiles, and handle wallet transactions</p>
        </div>
        <Button onClick={handleExportCSV} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by alias, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="deleted">Deleted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User ID</TableHead>
                <TableHead>Alias</TableHead>
                <TableHead>Email / Phone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Wallet</TableHead>
                <TableHead>Reg Date</TableHead>
                <TableHead>Last Active</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-gray-600">{user.id}</TableCell>
                  <TableCell>{user.alias}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div className="text-gray-900">{user.email}</div>
                      <div className="text-gray-500">{user.phone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.status === 'active' ? 'default' : 'destructive'}
                      className={
                        user.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : user.status === 'blocked'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-gray-100 text-gray-800'
                      }
                    >
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>₹{user.wallet.toLocaleString()}</TableCell>
                  <TableCell className="text-gray-600">{user.regDate.toLocaleDateString()}</TableCell>
                  <TableCell className="text-gray-600">{user.lastActive.toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setViewProfileOpen(true);
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBlockUnblock(user)}
                        disabled={user.status === 'deleted'}
                      >
                        <Ban className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedUser(user);
                          setWalletAdjustOpen(true);
                        }}
                        disabled={user.status === 'deleted'}
                      >
                        <Wallet className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSoftDelete(user)}
                        disabled={user.status === 'deleted'}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-4 pt-4 border-t">
            <p className="text-sm text-gray-600">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* View Profile Modal */}
      <Dialog open={viewProfileOpen} onOpenChange={setViewProfileOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Profile</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>User ID</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.id}</p>
                </div>
                <div>
                  <Label>Alias</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.alias}</p>
                </div>
                <div>
                  <Label>Email</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.email}</p>
                </div>
                <div>
                  <Label>Phone</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label>Status</Label>
                  <Badge className="mt-1">{selectedUser.status}</Badge>
                </div>
                <div>
                  <Label>Wallet Balance</Label>
                  <p className="text-sm text-gray-900 mt-1">₹{selectedUser.wallet.toLocaleString()}</p>
                </div>
                <div>
                  <Label>Registration Date</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.regDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <Label>Last Active</Label>
                  <p className="text-sm text-gray-900 mt-1">{selectedUser.lastActive.toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Wallet Adjust Modal */}
      <Dialog open={walletAdjustOpen} onOpenChange={setWalletAdjustOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manual Wallet Adjustment</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>User: {selectedUser.alias}</Label>
                <p className="text-sm text-gray-600 mt-1">Current Balance: ₹{selectedUser.wallet.toLocaleString()}</p>
              </div>
              <div>
                <Label>Transaction Type</Label>
                <Select value={walletType} onValueChange={(v) => setWalletType(v as 'credit' | 'debit')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="credit">Credit (Add)</SelectItem>
                    <SelectItem value="debit">Debit (Subtract)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Amount</Label>
                <Input
                  type="number"
                  placeholder="Enter amount"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setWalletAdjustOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleWalletAdjust}>Adjust Wallet</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
