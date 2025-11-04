import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Search, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockChatMessages, mockSessions } from '../../lib/mockData';
import { formatDateTime } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';
import type { ChatMessage } from '../../lib/types';

export function ComplianceViewer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSessionId, setSelectedSessionId] = useState('');
  const [messages, setMessages] = useState(mockChatMessages);
  const [flaggedMessages, setFlaggedMessages] = useState<ChatMessage[]>([]);

  const activeSessions = mockSessions.filter(s => s.type === 'chat' || s.type === 'audio' || s.type === 'video');

  const filteredMessages = selectedSessionId
    ? messages.filter(m => m.sessionId === selectedSessionId)
    : messages;

  const handleFlagMessage = (messageId: string) => {
    const message = messages.find(m => m.id === messageId);
    if (!message) return;

    setMessages(messages.map(m =>
      m.id === messageId ? { ...m, flagged: !m.flagged } : m
    ));

    if (!message.flagged) {
      setFlaggedMessages([...flaggedMessages, { ...message, flagged: true }]);
      toast.warning('Message Flagged', {
        description: 'Message has been flagged for review'
      });
    } else {
      setFlaggedMessages(flaggedMessages.filter(m => m.id !== messageId));
      toast.success('Flag Removed', {
        description: 'Message flag has been removed'
      });
    }

    // Log audit trail
    console.log('Compliance action:', {
      action: message.flagged ? 'UNFLAG_MESSAGE' : 'FLAG_MESSAGE',
      messageId,
      timestamp: new Date().toISOString()
    });
  };

  const handleMarkReviewed = (messageId: string) => {
    toast.success('Marked as Reviewed', {
      description: 'Message has been marked as reviewed'
    });
    // Log audit trail
    console.log('Compliance action:', {
      action: 'MARK_REVIEWED',
      messageId,
      timestamp: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1>Chat & Call Compliance</h1>
        <p className="text-gray-500 mt-1">Review session content and manage compliance</p>
        <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800">
                <strong>Restricted Access:</strong> All access to this module is logged for audit purposes.
                Messages are retained for 7 days only.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sessions</p>
                <h3 className="mt-2">{activeSessions.length}</h3>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Logged</Badge>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Flagged Messages</p>
                <h3 className="mt-2">{flaggedMessages.length}</h3>
              </div>
              <Flag className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Retention</p>
                <h3 className="mt-2">7 Days</h3>
              </div>
              <Badge className="bg-gray-100 text-gray-800">Auto-delete</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="chat">
        <TabsList>
          <TabsTrigger value="chat">Chat Messages</TabsTrigger>
          <TabsTrigger value="call">Call Logs</TabsTrigger>
          <TabsTrigger value="flagged">Flagged Content</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Chat Message Viewer</CardTitle>
                <div className="flex items-center space-x-2">
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search messages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm"
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                  >
                    <option value="">All Sessions</option>
                    {activeSessions.map(session => (
                      <option key={session.id} value={session.id}>
                        {session.id} - {session.userAlias}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredMessages.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    No messages found
                  </div>
                ) : (
                  filteredMessages.map((message) => (
                    <div
                      key={message.id}
                      className={`p-4 rounded-lg border ${
                        message.flagged ? 'bg-red-50 border-red-200' : 'bg-gray-50 border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm">{message.senderName}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.sessionId}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(message.timestamp)}
                            </span>
                            {message.flagged && (
                              <Badge className="bg-red-100 text-red-800 text-xs">
                                <Flag className="h-3 w-3 mr-1" />
                                Flagged
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <Button
                            size="sm"
                            variant={message.flagged ? "destructive" : "outline"}
                            onClick={() => handleFlagMessage(message.id)}
                          >
                            <Flag className="h-3 w-3 mr-1" />
                            {message.flagged ? 'Unflag' : 'Flag'}
                          </Button>
                          {message.flagged && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleMarkReviewed(message.id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Reviewed
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="call" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Call Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSessions.filter(s => s.type === 'audio' || s.type === 'video').map((session) => (
                  <div key={session.id} className="p-4 rounded-lg border bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="text-sm font-mono">{session.id}</span>
                          <Badge className="capitalize">{session.type}</Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {session.userAlias} ↔ {session.listenerName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDateTime(session.startTime)} • {session.duration} minutes
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="flagged" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Flagged Content ({flaggedMessages.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {flaggedMessages.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No flagged content
                </div>
              ) : (
                <div className="space-y-4">
                  {flaggedMessages.map((message) => (
                    <div key={message.id} className="p-4 rounded-lg border bg-red-50 border-red-200">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-sm">{message.senderName}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.sessionId}
                            </Badge>
                            <span className="text-xs text-gray-500">
                              {formatDateTime(message.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm">{message.content}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkReviewed(message.id)}
                        >
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Mark Reviewed
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
