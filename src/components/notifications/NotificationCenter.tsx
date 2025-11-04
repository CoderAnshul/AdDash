import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Label } from '../ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Bell, Send, Users, Headphones, Calendar } from 'lucide-react';
import { mockNotifications } from '../../lib/mockData';
import { formatDateTime, getStatusColor } from '../../lib/utils';
import { toast } from 'sonner@2.0.3';

export function NotificationCenter() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [target, setTarget] = useState<'all_users' | 'all_listeners' | 'specific'>('all_users');

  const handleSendNotification = () => {
    const newNotif = {
      id: `notif-${Date.now()}`,
      title,
      body,
      target,
      status: 'sent' as const,
      createdAt: new Date().toISOString(),
      sentCount: target === 'all_users' ? 12847 : 234
    };

    setNotifications([newNotif, ...notifications]);
    toast.success('Notification Sent', {
      description: `Sent to ${newNotif.sentCount} recipients`
    });

    setShowCreateDialog(false);
    setTitle('');
    setBody('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Notifications</h1>
          <p className="text-gray-500 mt-1">Send push notifications and emails to users</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Send className="h-4 w-4 mr-2" />
          Create Notification
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Sent</p>
                <h3 className="mt-2">{notifications.filter(n => n.status === 'sent').length}</h3>
              </div>
              <Bell className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Scheduled</p>
                <h3 className="mt-2">{notifications.filter(n => n.status === 'scheduled').length}</h3>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Draft</p>
                <h3 className="mt-2">{notifications.filter(n => n.status === 'draft').length}</h3>
              </div>
              <Bell className="h-8 w-8 text-gray-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Notification History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {notifications.map((notif) => (
              <div key={notif.id} className="p-4 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-sm">{notif.title}</h4>
                      <Badge className={getStatusColor(notif.status)}>
                        {notif.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{notif.body}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Target: {notif.target.replace('_', ' ')}</span>
                      <span>Sent: {formatDateTime(notif.createdAt)}</span>
                      {notif.sentCount && <span>Recipients: {notif.sentCount}</span>}
                    </div>
                  </div>
                  {notif.target === 'all_users' && <Users className="h-5 w-5 text-blue-600" />}
                  {notif.target === 'all_listeners' && <Headphones className="h-5 w-5 text-purple-600" />}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Notification</DialogTitle>
            <DialogDescription>Send a push notification to users or listeners</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input
                placeholder="Notification title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div>
              <Label>Message</Label>
              <Textarea
                placeholder="Notification message"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={3}
              />
            </div>
            <div>
              <Label>Target Audience</Label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 mt-1"
                value={target}
                onChange={(e) => setTarget(e.target.value as any)}
              >
                <option value="all_users">All Users</option>
                <option value="all_listeners">All Listeners</option>
                <option value="specific">Specific IDs</option>
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendNotification} disabled={!title || !body}>
              <Send className="h-4 w-4 mr-2" />
              Send Now
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
