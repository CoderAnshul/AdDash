import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Ticket as TicketIcon, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { mockTickets, mockAdmins } from '../../lib/mockData';
import { formatDateTime, formatRelativeTime, getStatusColor } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import type { Ticket, TicketReply } from '../../lib/types';

export function TicketManagement() {
  const [tickets, setTickets] = useState(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showTicketDialog, setShowTicketDialog] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [isInternal, setIsInternal] = useState(false);

  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress');
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed');

  const handleAssignToMe = (ticketId: string) => {
    setTickets(tickets.map(t =>
      t.id === ticketId 
        ? { ...t, assignedTo: 'admin-1', status: 'in_progress' as const }
        : t
    ));
    toast.success('Ticket Assigned', {
      description: 'Ticket has been assigned to you'
    });
  };

  const handleResolve = (ticketId: string) => {
    setTickets(tickets.map(t =>
      t.id === ticketId 
        ? { ...t, status: 'resolved' as const, updatedAt: new Date().toISOString() }
        : t
    ));
    toast.success('Ticket Resolved', {
      description: 'Ticket has been marked as resolved'
    });
    setShowTicketDialog(false);
  };

  const handleReply = () => {
    if (!selectedTicket || !replyText.trim()) return;

    const newReply: TicketReply = {
      id: `reply-${Date.now()}`,
      ticketId: selectedTicket.id,
      authorId: 'admin-1',
      authorName: 'Admin User',
      content: replyText,
      isInternal: isInternal,
      timestamp: new Date().toISOString()
    };

    setTickets(tickets.map(t =>
      t.id === selectedTicket.id
        ? { ...t, replies: [...t.replies, newReply], updatedAt: new Date().toISOString() }
        : t
    ));

    setSelectedTicket({
      ...selectedTicket,
      replies: [...selectedTicket.replies, newReply]
    });

    toast.success('Reply Added', {
      description: isInternal ? 'Internal note added' : 'Reply sent to user'
    });

    setReplyText('');
    setIsInternal(false);
  };

  const avgResolutionTime = '2.5 hours'; // Mock calculation

  return (
    <div className="space-y-6">
      <div>
        <h1>Support Tickets</h1>
        <p className="text-gray-500 mt-1">Manage and respond to user support requests</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Tickets</p>
                <h3 className="mt-2">{tickets.length}</h3>
              </div>
              <TicketIcon className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Open/In Progress</p>
                <h3 className="mt-2">{openTickets.length}</h3>
                <Badge className="mt-2 bg-yellow-100 text-yellow-800">Active</Badge>
              </div>
              <MessageSquare className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Resolved</p>
                <h3 className="mt-2">{resolvedTickets.length}</h3>
                <Badge className="mt-2 bg-green-100 text-green-800">Done</Badge>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Avg Resolution</p>
                <h3 className="mt-2">{avgResolutionTime}</h3>
                <Badge className="mt-2 bg-blue-100 text-blue-800">SLA Met</Badge>
              </div>
              <Clock className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="open">
        <TabsList>
          <TabsTrigger value="open">Open & In Progress ({openTickets.length})</TabsTrigger>
          <TabsTrigger value="resolved">Resolved ({resolvedTickets.length})</TabsTrigger>
          <TabsTrigger value="all">All Tickets</TabsTrigger>
        </TabsList>

        {['open', 'resolved', 'all'].map((tab) => {
          const tabTickets = tab === 'open' ? openTickets : tab === 'resolved' ? resolvedTickets : tickets;
          
          return (
            <TabsContent key={tab} value={tab}>
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {tabTickets.map((ticket) => (
                      <div
                        key={ticket.id}
                        className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setShowTicketDialog(true);
                        }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h4 className="text-sm">{ticket.subject}</h4>
                              <Badge className={getStatusColor(ticket.status)}>
                                {ticket.status}
                              </Badge>
                              <Badge className={getStatusColor(ticket.priority)}>
                                {ticket.priority}
                              </Badge>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <span className="font-mono">{ticket.id}</span>
                              <span>From: {ticket.creatorName}</span>
                              <span>Category: {ticket.category}</span>
                              {ticket.assignedTo && (
                                <span>
                                  Assigned to: {mockAdmins.find(a => a.id === ticket.assignedTo)?.name}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-gray-500 mt-2">
                              <span>Created: {formatRelativeTime(ticket.createdAt)}</span>
                              <span>Updated: {formatRelativeTime(ticket.updatedAt)}</span>
                              <span>{ticket.replies.length} replies</span>
                            </div>
                          </div>
                          {!ticket.assignedTo && ticket.status === 'open' && (
                            <Button
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignToMe(ticket.id);
                              }}
                            >
                              Assign to Me
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>

      {/* Ticket Detail Dialog */}
      <Dialog open={showTicketDialog} onOpenChange={setShowTicketDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
            <DialogDescription>
              {selectedTicket?.id} • {selectedTicket?.category}
            </DialogDescription>
          </DialogHeader>

          {selectedTicket && (
            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="text-sm mb-1">{selectedTicket.subject}</h3>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(selectedTicket.status)}>
                      {selectedTicket.status}
                    </Badge>
                    <Badge className={getStatusColor(selectedTicket.priority)}>
                      {selectedTicket.priority}
                    </Badge>
                  </div>
                </div>
                {(selectedTicket.status === 'in_progress' || selectedTicket.status === 'open') && (
                  <Button onClick={() => handleResolve(selectedTicket.id)}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Mark Resolved
                  </Button>
                )}
              </div>

              <div className="space-y-4">
                {selectedTicket.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-4 rounded-lg ${
                      reply.isInternal 
                        ? 'bg-yellow-50 border border-yellow-200' 
                        : 'bg-white border'
                    }`}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm">{reply.authorName}</span>
                      {reply.isInternal && (
                        <Badge className="bg-yellow-100 text-yellow-800 text-xs">
                          Internal Note
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">
                        {formatRelativeTime(reply.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-4 border-t">
                <Label>Add Reply</Label>
                <Textarea
                  placeholder="Type your reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="internal"
                      checked={isInternal}
                      onChange={(e) => setIsInternal(e.target.checked)}
                      className="rounded"
                    />
                    <label htmlFor="internal" className="text-sm">
                      Internal note (not visible to user)
                    </label>
                  </div>
                  <Button onClick={handleReply} disabled={!replyText.trim()}>
                    Send Reply
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
