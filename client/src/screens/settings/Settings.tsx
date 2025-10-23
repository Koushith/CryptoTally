import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { User, Building2, Globe, Bell, Shield, Palette, Users } from 'lucide-react';

type SettingModal = 'profile' | 'workspace' | 'team' | 'preferences' | 'notifications' | 'security' | 'appearance' | null;

export const SettingsPage = () => {
  const [openModal, setOpenModal] = useState<SettingModal>(null);

  const settingsCategories = [
    {
      category: 'Account',
      description: 'Manage your personal account and workspace',
      items: [
        {
          id: 'profile' as const,
          icon: User,
          title: 'Profile',
          description: 'Manage your personal information and account details',
        },
        {
          id: 'workspace' as const,
          icon: Building2,
          title: 'Workspace',
          description: 'Configure organization settings and preferences',
        },
        {
          id: 'team' as const,
          icon: Users,
          title: 'Team',
          description: 'Invite and manage team members and permissions',
        },
      ],
    },
    {
      category: 'Preferences',
      description: 'Customize your experience and settings',
      items: [
        {
          id: 'preferences' as const,
          icon: Globe,
          title: 'Regional Settings',
          description: 'Set your currency, timezone, and date format',
        },
        {
          id: 'notifications' as const,
          icon: Bell,
          title: 'Notifications',
          description: 'Control email notifications and alerts',
        },
        {
          id: 'appearance' as const,
          icon: Palette,
          title: 'Appearance',
          description: 'Customize theme and display settings',
        },
      ],
    },
    {
      category: 'Security',
      description: 'Keep your account safe and secure',
      items: [
        {
          id: 'security' as const,
          icon: Shield,
          title: 'Security',
          description: 'Update password and two-factor authentication',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="mb-5 md:mb-12">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Settings</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your account and workspace preferences</p>
        </div>

        {/* Settings Categories */}
        <div className="space-y-5 md:space-y-8">
          {settingsCategories.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              {/* Category Header */}
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">{categoryGroup.category}</h2>
                <p className="text-sm text-gray-500 mt-1">{categoryGroup.description}</p>
              </div>

              {/* Settings Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                {categoryGroup.items.map((card) => {
                  const Icon = card.icon;
                  return (
                    <button
                      key={card.id}
                      onClick={() => setOpenModal(card.id)}
                      className="flex items-center gap-4 p-4 md:p-5 border border-gray-200 rounded-2xl md:rounded-xl md:hover:shadow-md bg-white shadow-sm md:shadow-none active:scale-[0.98] md:active:scale-100 transition-all text-left group"
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center">
                        <Icon className="h-5 w-5 text-white" />
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-gray-800">{card.title}</h3>
                          <svg
                            className="h-4 w-4 text-gray-400 group-hover:text-gray-600 group-hover:translate-x-0.5 transition-all flex-shrink-0"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        <p className="text-sm text-gray-500 leading-snug">{card.description}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Profile Sheet */}
        <Sheet open={openModal === 'profile'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Profile</SheetTitle>
                </div>
              </div>
              <SheetDescription>Manage your personal information and account details</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue="Koushith"
                    className="border-gray-200 focus:border-gray-900 focus:ring-0"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue="Amin"
                    className="border-gray-200 focus:border-gray-900 focus:ring-0"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="koushith@def.com"
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-sm font-medium text-gray-700">Company/Organization</Label>
                <Input
                  id="company"
                  placeholder="Optional"
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpenModal(null)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Workspace Modal */}
        <Sheet open={openModal === 'workspace'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Workspace</SheetTitle>
                </div>
              </div>
              <SheetDescription>Configure organization settings and preferences</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="workspace" className="text-sm font-medium text-gray-700">Workspace Name</Label>
                <Input
                  id="workspace"
                  defaultValue="Personal Workspace"
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workspaceType" className="text-sm font-medium text-gray-700">Workspace Type</Label>
                <select
                  id="workspaceType"
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                >
                  <option>Personal</option>
                  <option>Organization</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpenModal(null)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Team Modal */}
        <Sheet open={openModal === 'team'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto sm:max-w-2xl">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Team</SheetTitle>
                </div>
              </div>
              <SheetDescription>Invite and manage team members and permissions</SheetDescription>
            </SheetHeader>
            <div className="mt-4">
              <div className="border border-gray-200 rounded-lg p-5 mb-6">
                <h3 className="text-sm font-medium text-gray-800 mb-4">Invite Team Member</h3>
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Input
                      type="email"
                      placeholder="Enter email address"
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>
                  <select className="text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none">
                    <option>Admin</option>
                    <option>Contributor</option>
                    <option>Viewer</option>
                  </select>
                  <Button>Send Invite</Button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  The invited member will receive an email to join your workspace.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-800">Current Members (3)</h3>
                {[
                  { name: 'Koushith Amin', email: 'koushith@def.com', role: 'Admin', status: 'Active' },
                  { name: 'Sarah Johnson', email: 'sarah@def.com', role: 'Contributor', status: 'Active' },
                  { name: 'Mike Chen', email: 'mike@def.com', role: 'Viewer', status: 'Pending' },
                ].map((member, idx) => (
                  <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-800">{member.name}</div>
                        <div className="text-xs text-gray-500">{member.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          member.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {member.status}
                        </span>
                        <select
                          className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white"
                          defaultValue={member.role}
                        >
                          <option>Admin</option>
                          <option>Contributor</option>
                          <option>Viewer</option>
                        </select>
                      </div>
                      {idx !== 0 && (
                        <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 p-5 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-800 mb-3">Role Permissions</h3>
                <div className="space-y-2 text-xs text-gray-600">
                  <div><span className="font-medium text-gray-800">Admin:</span> Full access to all settings, can manage team members and billing</div>
                  <div><span className="font-medium text-gray-800">Contributor:</span> Can add/edit wallets, tag transactions, and generate reports</div>
                  <div><span className="font-medium text-gray-800">Viewer:</span> Read-only access to view transactions and reports</div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Preferences Modal */}
        <Sheet open={openModal === 'preferences'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Preferences</SheetTitle>
                </div>
              </div>
              <SheetDescription>Set your currency, timezone, and date format</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium text-gray-700">Default Currency</Label>
                <select
                  id="currency"
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                >
                  <option>USD ($)</option>
                  <option>EUR (€)</option>
                  <option>GBP (£)</option>
                  <option>INR (₹)</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="timezone" className="text-sm font-medium text-gray-700">Timezone</Label>
                <select
                  id="timezone"
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                >
                  <option>UTC</option>
                  <option>America/New_York</option>
                  <option>America/Los_Angeles</option>
                  <option>Europe/London</option>
                  <option>Asia/Kolkata</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFormat" className="text-sm font-medium text-gray-700">Date Format</Label>
                <select
                  id="dateFormat"
                  className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                >
                  <option>MM/DD/YYYY</option>
                  <option>DD/MM/YYYY</option>
                  <option>YYYY-MM-DD</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpenModal(null)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Notifications Modal */}
        <Sheet open={openModal === 'notifications'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Notifications</SheetTitle>
                </div>
              </div>
              <SheetDescription>Control email notifications and alerts</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 mt-4">
              {[
                { label: 'New transactions detected', description: 'Get notified when new transactions are synced' },
                { label: 'Weekly summary reports', description: 'Receive a weekly email with transaction summaries' },
                { label: 'Large transactions', description: 'Alert me for transactions above a certain threshold' },
                { label: 'Wallet balance changes', description: 'Notify when wallet balances change significantly' },
              ].map((item, idx) => (
                <label key={idx} className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" defaultChecked={idx < 2} />
                  <div>
                    <div className="text-sm font-medium text-gray-800">{item.label}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                  </div>
                </label>
              ))}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpenModal(null)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Security Modal */}
        <Sheet open={openModal === 'security'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Security</SheetTitle>
                </div>
              </div>
              <SheetDescription>Update password and two-factor authentication</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              </div>
              <div className="pt-4 border-t border-gray-200">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" />
                  <div>
                    <div className="text-sm font-medium text-gray-800">Enable Two-Factor Authentication</div>
                    <div className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</div>
                  </div>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpenModal(null)}>Cancel</Button>
                <Button>Update Password</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>

        {/* Appearance Modal */}
        <Sheet open={openModal === 'appearance'} onOpenChange={() => setOpenModal(null)}>
          <SheetContent className="overflow-y-auto">
            <SheetHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center">
                  <Palette className="h-5 w-5 text-white" />
                </div>
                <div>
                  <SheetTitle>Appearance</SheetTitle>
                </div>
              </div>
              <SheetDescription>Customize theme and display settings</SheetDescription>
            </SheetHeader>
            <div className="space-y-5 mt-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Theme</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['Light', 'Dark', 'System'].map((theme) => (
                    <button
                      key={theme}
                      className={`px-4 py-3 border rounded-lg text-sm font-medium transition-colors ${
                        theme === 'Light'
                          ? 'border-gray-900 bg-gray-900 text-white'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {theme}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Compact Mode</Label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="rounded border-gray-300" />
                  <span className="text-sm text-gray-600">Use compact table rows and smaller spacing</span>
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setOpenModal(null)}>Cancel</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};
