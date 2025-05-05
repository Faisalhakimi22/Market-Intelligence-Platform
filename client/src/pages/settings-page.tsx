import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layouts/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SettingsIcon, BellRing, Globe, User, Lock, Bell } from "lucide-react";

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Settings</h2>
          <p className="text-gray-500 dark:text-gray-400">Manage your account and application preferences</p>
        </div>
        
        <Tabs defaultValue="account">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-64 flex-shrink-0">
              <div className="sticky top-20">
                <TabsList className="flex flex-col h-auto items-stretch">
                  <TabsTrigger value="account" className="justify-start text-left px-3 py-2 h-auto mb-1">
                    <User className="mr-2 h-4 w-4" />
                    Account
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start text-left px-3 py-2 h-auto mb-1">
                    <Bell className="mr-2 h-4 w-4" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="justify-start text-left px-3 py-2 h-auto mb-1">
                    <Globe className="mr-2 h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start text-left px-3 py-2 h-auto mb-1">
                    <Lock className="mr-2 h-4 w-4" />
                    Security
                  </TabsTrigger>
                </TabsList>
              </div>
            </div>
            
            <div className="flex-1">
              <TabsContent value="account" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" defaultValue="Faisal Hakimi" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="Faisalh5556@gmail.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Role</Label>
                        <Input id="role" defaultValue="Enterprise Analyst" disabled />
                        <p className="text-sm text-muted-foreground">Contact an administrator to change your role</p>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts and updates via email</p>
                        </div>
                        <Switch id="email-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="platform-notifications">Platform Notifications</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts within the platform</p>
                        </div>
                        <Switch id="platform-notifications" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="regulatory-alerts">Regulatory Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts about regulatory changes</p>
                        </div>
                        <Switch id="regulatory-alerts" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="competitor-alerts">Competitor Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts about competitor activities</p>
                        </div>
                        <Switch id="competitor-alerts" defaultChecked />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="market-alerts">Market Opportunity Alerts</Label>
                          <p className="text-sm text-muted-foreground">Receive alerts about new market opportunities</p>
                        </div>
                        <Switch id="market-alerts" defaultChecked />
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Theme</Label>
                        <div className="grid grid-cols-3 gap-3">
                          <Button variant="outline" className="justify-start text-left px-3 py-5">
                            <div className="flex flex-col items-center justify-center">
                              <div className="h-8 w-8 rounded-full bg-white border border-gray-200 mb-2"></div>
                              <span>Light</span>
                            </div>
                          </Button>
                          <Button variant="outline" className="justify-start text-left px-3 py-5">
                            <div className="flex flex-col items-center justify-center">
                              <div className="h-8 w-8 rounded-full bg-gray-900 border border-gray-700 mb-2"></div>
                              <span>Dark</span>
                            </div>
                          </Button>
                          <Button variant="outline" className="justify-start text-left px-3 py-5">
                            <div className="flex flex-col items-center justify-center">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-gray-200 to-gray-900 mb-2"></div>
                              <span>System</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Dashboard Layout</Label>
                        <div className="grid grid-cols-2 gap-3">
                          <Button variant="outline" className="justify-start text-left px-3 py-4 h-auto">
                            <div className="flex flex-col items-center justify-center w-full">
                              <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex mb-2">
                                <div className="w-1/4 h-full bg-gray-200 dark:bg-gray-700 rounded-l-md"></div>
                                <div className="w-3/4 h-full p-2">
                                  <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-sm mb-1"></div>
                                  <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                                </div>
                              </div>
                              <span>Default</span>
                            </div>
                          </Button>
                          <Button variant="outline" className="justify-start text-left px-3 py-4 h-auto">
                            <div className="flex flex-col items-center justify-center w-full">
                              <div className="h-16 w-full bg-gray-100 dark:bg-gray-800 rounded-md flex flex-col mb-2">
                                <div className="h-1/3 w-full bg-gray-200 dark:bg-gray-700 rounded-t-md"></div>
                                <div className="h-2/3 w-full p-2">
                                  <div className="h-3 w-3/4 bg-gray-300 dark:bg-gray-600 rounded-sm mb-1"></div>
                                  <div className="h-3 w-1/2 bg-gray-300 dark:bg-gray-600 rounded-sm"></div>
                                </div>
                              </div>
                              <span>Compact</span>
                            </div>
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                        <Button className="mt-2">Update Password</Button>
                      </div>
                      
                      <div className="pt-6 border-t dark:border-gray-700">
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="tfa">Enable Two-Factor Authentication</Label>
                            <p className="text-sm text-muted-foreground">Adds an extra layer of security to your account</p>
                          </div>
                          <Switch id="tfa" />
                        </div>
                      </div>
                      
                      <div className="pt-6 border-t dark:border-gray-700">
                        <h3 className="text-lg font-medium mb-4">Sessions</h3>
                        <p className="text-sm text-muted-foreground mb-4">These are the devices that are currently logged in to your account.</p>
                        
                        <div className="space-y-4">
                          <div className="p-3 border rounded-md dark:border-gray-700">
                            <div className="flex justify-between items-start">
                              <div>
                                <p className="font-medium">Current Session</p>
                                <p className="text-sm text-muted-foreground">Chrome on Windows • New York, USA</p>
                              </div>
                              <Button variant="ghost" size="sm" className="text-red-500">Revoke</Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}