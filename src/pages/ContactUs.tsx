
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { registerForNotifications } from "@/utils/api";

const ContactUs = () => {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [notifyEmail, setNotifyEmail] = useState(true);
  const [notifySMS, setNotifySMS] = useState(false);
  const [notifyPush, setNotifyPush] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    document.title = "Protex - Contact Us";
  }, []);
  
  const handleSaveNotifications = async () => {
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await registerForNotifications(email, {
        email: notifyEmail,
        sms: notifySMS,
        pushNotification: notifyPush
      });
      
      if (result) {
        toast.success("Notification preferences saved successfully");
      } else {
        toast.error("Failed to save notification preferences");
      }
    } catch (error) {
      console.error('Error saving notification preferences:', error);
      toast.error("An error occurred while saving preferences");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Contact Us</h1>
        
        <Tabs defaultValue="notifications">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="api">API Access</TabsTrigger>
          </TabsList>
          
          <TabsContent value="notifications" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Configure how you want to receive flood alerts and warnings
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="your@email.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number (for SMS)</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        placeholder="+1 (234) 567-8900" 
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Your Location</Label>
                    <Input 
                      id="location" 
                      placeholder="City, State" 
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <h3 className="font-medium">Alert Methods</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="email-alerts">Email Alerts</Label>
                      <p className="text-sm text-gray-400">Receive alerts via email</p>
                    </div>
                    <Switch 
                      id="email-alerts" 
                      checked={notifyEmail}
                      onCheckedChange={setNotifyEmail}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="sms-alerts">SMS Alerts</Label>
                      <p className="text-sm text-gray-400">Get text messages for critical alerts</p>
                    </div>
                    <Switch 
                      id="sms-alerts" 
                      checked={notifySMS}
                      onCheckedChange={setNotifySMS}
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="push-alerts">Push Notifications</Label>
                      <p className="text-sm text-gray-400">Receive browser notifications</p>
                    </div>
                    <Switch 
                      id="push-alerts" 
                      checked={notifyPush}
                      onCheckedChange={setNotifyPush}
                    />
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t border-gray-700">
                  <h3 className="font-medium">Alert Thresholds</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between border border-gray-700 p-3 rounded-md">
                      <div>
                        <p className="font-medium">Medium Risk</p>
                        <p className="text-sm text-gray-400">Potential flood conditions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border border-gray-700 p-3 rounded-md">
                      <div>
                        <p className="font-medium">High Risk</p>
                        <p className="text-sm text-gray-400">Significant flood risk</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border border-gray-700 p-3 rounded-md">
                      <div>
                        <p className="font-medium">Critical Risk</p>
                        <p className="text-sm text-gray-400">Imminent flooding</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    
                    <div className="flex items-center justify-between border border-gray-700 p-3 rounded-md">
                      <div>
                        <p className="font-medium">All Clear</p>
                        <p className="text-sm text-gray-400">When risk subsides</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full md:w-auto"
                  onClick={handleSaveNotifications}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Notification Settings'}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="account" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your user account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input id="name" placeholder="John Doe" />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email-account">Email Address</Label>
                      <Input id="email-account" type="email" placeholder="your@email.com" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" placeholder="••••••••" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input id="confirm-password" type="password" placeholder="••••••••" />
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <Button className="w-full md:w-auto">
                    Update Account Information
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="api" className="pt-4">
            <Card>
              <CardHeader>
                <CardTitle>API Settings</CardTitle>
                <CardDescription>
                  Manage API keys and access for external integrations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="border border-gray-700 p-4 rounded-lg bg-muted">
                  <h3 className="font-medium mb-2">API Keys</h3>
                  <div className="flex items-center space-x-3">
                    <Input 
                      type="password" 
                      value="••••••••••••••••••••••••••••••"
                      readOnly
                    />
                    <Button variant="outline">
                      Generate New Key
                    </Button>
                  </div>
                  <p className="text-xs text-gray-400 mt-2">
                    Your API key provides access to the Protex API. Keep it secure.
                  </p>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">External Integrations</h3>
                  
                  <div className="border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Weather API</p>
                        <p className="text-sm text-gray-400">Integrates with OpenWeatherMap</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Gemini AI</p>
                        <p className="text-sm text-gray-400">For advanced flood predictions</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                  
                  <div className="border border-gray-700 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-gray-400">Through Twilio API</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t border-gray-700">
                  <Button className="w-full md:w-auto">
                    Save API Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default ContactUs;
