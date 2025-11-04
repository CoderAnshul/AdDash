import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
import { Search, DollarSign, TrendingUp, TrendingDown, CheckCircle, XCircle } from 'lucide-react';
import { mockTransactions, mockListeners } from '../../lib/mockData';
import { formatCurrency, formatDateTime, getStatusColor } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import type { Transaction } from '../../lib/types';

export function WalletPayments() {
  const [transactions, setTransactions] = useState(mockTransactions);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);

  const pendingWithdrawals = transactions.filter(t => t.type === 'withdrawal' && t.status === 'pending');

  const filteredTransactions = transactions.filter(txn =>
    txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    txn.razorpayId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleApproveWithdrawal = () => {
    if (!selectedTransaction) return;

    setTransactions(transactions.map(t =>
      t.id === selectedTransaction.id ? { ...t, status: 'completed' } : t
    ));

    toast.success('Withdrawal Approved', {
      description: `${formatCurrency(selectedTransaction.amount)} has been approved for payout`
    });

    setShowApprovalDialog(false);
  };

  const handleRejectWithdrawal = () => {
    if (!selectedTransaction) return;

    setTransactions(transactions.map(t =>
      t.id === selectedTransaction.id ? { ...t, status: 'failed' } : t
    ));

    toast.error('Withdrawal Rejected', {
      description: 'Withdrawal request has been rejected'
    });

    setShowApprovalDialog(false);
  };

  const totalDeposits = transactions
    .filter(t => t.type === 'deposit' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalWithdrawals = transactions
    .filter(t => t.type === 'withdrawal' && t.status === 'completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = pendingWithdrawals.reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1>Wallet & Payments</h1>
        <p className="text-gray-500 mt-1">Manage transactions, withdrawals, and payment processing</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Deposits</p>
                <h3 className="mt-2">{formatCurrency(totalDeposits)}</h3>
                <div className="flex items-center mt-2 text-green-600 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  <span>Revenue</span>
                </div>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Withdrawals</p>
                <h3 className="mt-2">{formatCurrency(totalWithdrawals)}</h3>
                <div className="flex items-center mt-2 text-red-600 text-sm">
                  <TrendingDown className="h-4 w-4 mr-1" />
                  <span>Paid Out</span>
                </div>
              </div>
              <div className="bg-red-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Pending Withdrawals</p>
                <h3 className="mt-2">{formatCurrency(pendingAmount)}</h3>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">
                  {pendingWithdrawals.length} Requests
                </Badge>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Net Balance</p>
                <h3 className="mt-2">{formatCurrency(totalDeposits - totalWithdrawals)}</h3>
                <p className="text-xs text-gray-500 mt-2">Platform balance</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions">
        <TabsList>
          <TabsTrigger value="transactions">All Transactions</TabsTrigger>
          <TabsTrigger value="withdrawals">
            Withdrawal Queue ({pendingWithdrawals.length})
          </TabsTrigger>
          <TabsTrigger value="razorpay">Razorpay Integration</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Transaction History</CardTitle>
                <div className="relative w-64">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
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
                    <TableHead>Transaction ID</TableHead>
                    <TableHead>User/Listener</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Razorpay ID</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((txn) => (
                    <TableRow key={txn.id}>
                      <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                      <TableCell>{txn.userName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {txn.type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{txn.method}</TableCell>
                      <TableCell className={
                        txn.type === 'deposit' || txn.type === 'manual_credit' 
                          ? 'text-green-600' 
                          : 'text-red-600'
                      }>
                        {txn.type === 'deposit' || txn.type === 'manual_credit' ? '+' : '-'}
                        {formatCurrency(txn.amount)}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(txn.status)}>
                          {txn.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDateTime(txn.timestamp)}</TableCell>
                      <TableCell className="font-mono text-xs">
                        {txn.razorpayId || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Pending Withdrawal Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {pendingWithdrawals.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No pending withdrawal requests
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request ID</TableHead>
                      <TableHead>Listener</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Requested</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingWithdrawals.map((txn) => (
                      <TableRow key={txn.id}>
                        <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                        <TableCell>{txn.userName}</TableCell>
                        <TableCell>{formatCurrency(txn.amount)}</TableCell>
                        <TableCell>{txn.method}</TableCell>
                        <TableCell>{formatDateTime(txn.timestamp)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              onClick={() => {
                                setSelectedTransaction(txn);
                                setShowApprovalDialog(true);
                              }}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Review
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="razorpay">
          <Card>
            <CardHeader>
              <CardTitle>Razorpay Integration</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Razorpay is integrated for payment processing. All payments are verified through Razorpay APIs.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm">Key ID</label>
                    <Input value="rzp_test_XXXXXXXXXXXXXXX" disabled className="mt-2" />
                  </div>
                  <div>
                    <label className="text-sm">Key Secret</label>
                    <Input type="password" value="••••••••••••••••" disabled className="mt-2" />
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="mb-2">Recent Razorpay Transactions</h4>
                  <div className="space-y-2">
                    {transactions
                      .filter(t => t.razorpayId)
                      .slice(0, 5)
                      .map((txn) => (
                        <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm font-mono">{txn.razorpayId}</p>
                            <p className="text-xs text-gray-500">{txn.userName}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{formatCurrency(txn.amount)}</p>
                            <Badge className={getStatusColor(txn.status)}>
                              {txn.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Approval Dialog */}
      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Withdrawal Request</DialogTitle>
            <DialogDescription>
              Review and approve/reject this withdrawal request
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Transaction ID:</span>
                  <span className="text-sm font-mono">{selectedTransaction.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Listener:</span>
                  <span className="text-sm">{selectedTransaction.userName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="text-sm">{formatCurrency(selectedTransaction.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Method:</span>
                  <span className="text-sm">{selectedTransaction.method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Requested:</span>
                  <span className="text-sm">{formatDateTime(selectedTransaction.timestamp)}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={handleRejectWithdrawal}>
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button onClick={handleApproveWithdrawal}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve Payout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
