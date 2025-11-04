import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Settings as SettingsIcon, Save } from 'lucide-react';
import { mockSettings } from '../../lib/mockData';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const [settings, setSettings] = useState(mockSettings);

  const handleSave = () => {
    toast.success('Settings Saved', {
      description: 'All settings have been updated successfully'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Settings</h1>
          <p className="text-gray-500 mt-1">Configure application settings and preferences</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs defaultValue="app">
        <TabsList>
          <TabsTrigger value="app">App Info</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
          <TabsTrigger value="commission">Commission</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="app">
          <Card>
            <CardHeader>
              <CardTitle>Application Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>App Name</Label>
                  <Input
                    value={settings.appName}
                    onChange={(e) => setSettings({ ...settings, appName: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Current Version</Label>
                  <Input
                    value={settings.appVersion}
                    onChange={(e) => setSettings({ ...settings, appVersion: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Force Update Version</Label>
                  <Input
                    value={settings.forceUpdateVersion}
                    onChange={(e) => setSettings({ ...settings, forceUpdateVersion: e.target.value })}
                  />
                </div>
                <div>
                  <Label>Message Retention (Days)</Label>
                  <Input
                    type="number"
                    value={settings.messageRetentionDays}
                    onChange={(e) => setSettings({ ...settings, messageRetentionDays: parseInt(e.target.value) })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payment">
          <Card>
            <CardHeader>
              <CardTitle>Razorpay Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Razorpay Key ID</Label>
                <Input
                  value={settings.razorpayKeyId}
                  onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                  placeholder="rzp_live_XXXXXXXXXXXXXXX"
                />
              </div>
              <div>
                <Label>Razorpay Key Secret</Label>
                <Input
                  type="password"
                  value={settings.razorpayKeySecret}
                  onChange={(e) => setSettings({ ...settings, razorpayKeySecret: e.target.value })}
                  placeholder="Enter secret key"
                />
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  ⚠️ Keep these credentials secure. Never share them publicly.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commission">
          <Card>
            <CardHeader>
              <CardTitle>Commission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default Commission Rate (%)</Label>
                <Input
                  type="number"
                  value={settings.commissionRate}
                  onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
                  step="0.5"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This is the default platform commission rate for new listeners
                </p>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  Current rate: {settings.commissionRate}%. Listeners keep {100 - settings.commissionRate}% of earnings.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Legal Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Terms and Conditions</Label>
                <Textarea
                  value={settings.termsAndConditions}
                  onChange={(e) => setSettings({ ...settings, termsAndConditions: e.target.value })}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <Label>Privacy Policy</Label>
                <Textarea
                  value={settings.privacyPolicy}
                  onChange={(e) => setSettings({ ...settings, privacyPolicy: e.target.value })}
                  rows={6}
                  className="font-mono text-xs"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
