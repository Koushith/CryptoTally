import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Building2, Globe, Bell, Shield, Palette, Users } from 'lucide-react';

type SettingSection = 'profile' | 'workspace' | 'team' | 'preferences' | 'notifications' | 'security' | 'appearance';

export const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState<SettingSection>('profile');

  const sections = [
    { id: 'profile' as SettingSection, icon: User, label: 'Profile', description: 'Personal information' },
    { id: 'workspace' as SettingSection, icon: Building2, label: 'Workspace', description: 'Organization settings' },
    { id: 'team' as SettingSection, icon: Users, label: 'Team', description: 'Invite & manage members' },
    { id: 'preferences' as SettingSection, icon: Globe, label: 'Preferences', description: 'Currency & timezone' },
    { id: 'notifications' as SettingSection, icon: Bell, label: 'Notifications', description: 'Email & alerts' },
    { id: 'security' as SettingSection, icon: Shield, label: 'Security', description: 'Password & 2FA' },
    { id: 'appearance' as SettingSection, icon: Palette, label: 'Appearance', description: 'Theme & display' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="w-full">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-[32px] font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-2">Manage your account and workspace preferences.</p>
        </div>

        <div className="flex gap-8">
          {/* Left Sidebar - Settings Navigation */}
          <div className="w-64 flex-shrink-0">
            <div className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      isActive
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                        {section.label}
                      </div>
                      <div className={`text-xs ${isActive ? 'text-gray-300' : 'text-gray-500'}`}>
                        {section.description}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 max-w-2xl">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Profile Information</h2>
                  <p className="text-sm text-gray-500 mt-1">Update your personal details and contact information.</p>
                </div>
                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName" className="text-sm text-gray-700">First Name</Label>
                      <Input
                        id="firstName"
                        defaultValue="Koushith"
                        className="border-gray-200 focus:border-gray-900 focus:ring-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName" className="text-sm text-gray-700">Last Name</Label>
                      <Input
                        id="lastName"
                        defaultValue="Amin"
                        className="border-gray-200 focus:border-gray-900 focus:ring-0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm text-gray-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      defaultValue="koushith@def.com"
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm text-gray-700">Company/Organization</Label>
                    <Input
                      id="company"
                      placeholder="Optional"
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Workspace Section */}
            {activeSection === 'workspace' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Workspace Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your workspace and organization details.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="workspace" className="text-sm text-gray-700">Workspace Name</Label>
                    <Input
                      id="workspace"
                      defaultValue="Personal Workspace"
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="workspaceType" className="text-sm text-gray-700">Workspace Type</Label>
                    <select
                      id="workspaceType"
                      className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                    >
                      <option>Personal</option>
                      <option>Organization</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Team Section */}
            {activeSection === 'team' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Team Members</h2>
                  <p className="text-sm text-gray-500 mt-1">Invite team members and manage access to your workspace.</p>
                </div>

                {/* Invite Form */}
                <div className="border border-gray-200 rounded-lg p-5 mb-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Invite Team Member</h3>
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

                {/* Team Members List */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-gray-900">Current Members (3)</h3>
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
                          <div className="text-sm font-medium text-gray-900">{member.name}</div>
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

                {/* Role Descriptions */}
                <div className="mt-8 p-5 bg-gray-50 rounded-lg">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Role Permissions</h3>
                  <div className="space-y-2 text-xs text-gray-600">
                    <div><span className="font-medium text-gray-900">Admin:</span> Full access to all settings, can manage team members and billing</div>
                    <div><span className="font-medium text-gray-900">Contributor:</span> Can add/edit wallets, tag transactions, and generate reports</div>
                    <div><span className="font-medium text-gray-900">Viewer:</span> Read-only access to view transactions and reports</div>
                  </div>
                </div>
              </div>
            )}

            {/* Preferences Section */}
            {activeSection === 'preferences' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Preferences</h2>
                  <p className="text-sm text-gray-500 mt-1">Customize your currency, timezone, and regional settings.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currency" className="text-sm text-gray-700">Default Currency</Label>
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
                    <Label htmlFor="timezone" className="text-sm text-gray-700">Timezone</Label>
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
                    <Label htmlFor="dateFormat" className="text-sm text-gray-700">Date Format</Label>
                    <select
                      id="dateFormat"
                      className="w-full text-sm border border-gray-200 rounded-md px-3 py-2 bg-white focus:border-gray-900 focus:ring-0 focus:outline-none"
                    >
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Notification Preferences</h2>
                  <p className="text-sm text-gray-500 mt-1">Choose how you want to be notified about updates and activities.</p>
                </div>
                <div className="space-y-5">
                  {[
                    { label: 'New transactions detected', description: 'Get notified when new transactions are synced' },
                    { label: 'Weekly summary reports', description: 'Receive a weekly email with transaction summaries' },
                    { label: 'Large transactions', description: 'Alert me for transactions above a certain threshold' },
                    { label: 'Wallet balance changes', description: 'Notify when wallet balances change significantly' },
                  ].map((item, idx) => (
                    <label key={idx} className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" className="mt-1 rounded border-gray-300" defaultChecked={idx < 2} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{item.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Security Settings</h2>
                  <p className="text-sm text-gray-500 mt-1">Manage your password and security preferences.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm text-gray-700">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Enter current password"
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm text-gray-700">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Enter new password"
                      className="border-gray-200 focus:border-gray-900 focus:ring-0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm text-gray-700">Confirm New Password</Label>
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
                        <div className="text-sm font-medium text-gray-900">Enable Two-Factor Authentication</div>
                        <div className="text-xs text-gray-500 mt-0.5">Add an extra layer of security to your account</div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                  <Button variant="outline">Cancel</Button>
                  <Button>Update Password</Button>
                </div>
              </div>
            )}

            {/* Appearance Section */}
            {activeSection === 'appearance' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-[17px] font-medium text-gray-900">Appearance</h2>
                  <p className="text-sm text-gray-500 mt-1">Customize how CryptoTally looks and feels.</p>
                </div>
                <div className="space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm text-gray-700">Theme</Label>
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
                    <Label className="text-sm text-gray-700">Compact Mode</Label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="rounded border-gray-300" />
                      <span className="text-sm text-gray-600">Use compact table rows and smaller spacing</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 mt-8 border-t border-gray-200">
                  <Button variant="outline">Cancel</Button>
                  <Button>Save Changes</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
