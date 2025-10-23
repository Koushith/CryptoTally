import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Camera, Mail, Building2, Calendar, Shield, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: 'Koushith',
    lastName: 'Amin',
    email: 'koushith@def.com',
    company: 'CryptoTally',
    role: 'Founder',
    bio: 'Building tools for crypto accounting and finance management.',
  });

  const handleSave = () => {
    console.log('Saving profile:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data if needed
  };

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Profile</h1>
          <p className="text-gray-500 text-sm mt-1 md:mt-2">Manage your personal information and account settings</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-5 md:p-8 mb-6">
          {/* Header with Avatar and Actions */}
          <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-16 w-16 md:h-20 md:w-20">
                  <AvatarImage src="https://pbs.twimg.com/profile_images/1733931010977640448/KTlA02mC_400x400.jpg" />
                  <AvatarFallback className="text-lg md:text-xl bg-gray-100 text-gray-700 font-semibold">
                    {formData.firstName[0]}{formData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <button className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-colors border border-gray-200">
                  <Camera className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Name and Title */}
              <div>
                <h2 className="text-lg md:text-xl font-bold text-gray-900">
                  {formData.firstName} {formData.lastName}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{formData.role} at {formData.company}</p>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex-shrink-0">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)} size="sm">
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCancel} size="sm">
                    Cancel
                  </Button>
                  <Button onClick={handleSave} size="sm">
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Bio Section */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">About</h3>
            {isEditing ? (
              <textarea
                id="bio"
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-gray-300 focus:border-gray-300 resize-none"
                placeholder="Tell us about yourself..."
              />
            ) : (
              <p className="text-sm text-gray-600 leading-relaxed">{formData.bio}</p>
            )}
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">4</div>
              <div className="text-xs text-gray-500">Wallets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">1,247</div>
              <div className="text-xs text-gray-500">Transactions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">89</div>
              <div className="text-xs text-gray-500">Days Active</div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-5 md:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-5">Personal Information</h3>
          <div className="space-y-4">
            {/* First Name & Last Name Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="firstName" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">First Name</Label>
                {isEditing ? (
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="border-gray-200 focus:border-gray-900 focus:ring-0"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{formData.firstName}</div>
                )}
              </div>

              <div>
                <Label htmlFor="lastName" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Last Name</Label>
                {isEditing ? (
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="border-gray-200 focus:border-gray-900 focus:ring-0"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{formData.lastName}</div>
                )}
              </div>
            </div>

            <div className="border-t border-gray-100" />

            {/* Email Row */}
            <div>
              <Label htmlFor="email" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="border-gray-200 focus:border-gray-900 focus:ring-0"
                />
              ) : (
                <div className="text-sm font-medium text-gray-900">{formData.email}</div>
              )}
            </div>

            <div className="border-t border-gray-100" />

            {/* Company & Role Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <Label htmlFor="company" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Company</Label>
                {isEditing ? (
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="border-gray-200 focus:border-gray-900 focus:ring-0"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{formData.company}</div>
                )}
              </div>

              <div>
                <Label htmlFor="role" className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2 block">Role</Label>
                {isEditing ? (
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="border-gray-200 focus:border-gray-900 focus:ring-0"
                  />
                ) : (
                  <div className="text-sm font-medium text-gray-900">{formData.role}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Account Details */}
        <div className="bg-white border border-gray-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-5 md:p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Details</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Mail className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Email Verified</div>
                  <div className="text-xs text-gray-500">Your email is verified and secure</div>
                </div>
              </div>
              <div className="text-xs text-green-600 font-medium">Verified</div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Two-Factor Authentication</div>
                  <div className="text-xs text-gray-500">Add extra security to your account</div>
                </div>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Workspace</div>
                  <div className="text-xs text-gray-500">Personal Workspace</div>
                </div>
              </div>
              <Button variant="ghost" size="sm">Change</Button>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-gray-600" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-800">Member Since</div>
                  <div className="text-xs text-gray-500">January 15, 2024</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="bg-white border border-red-200 rounded-2xl md:rounded-xl shadow-sm md:shadow-none p-5 md:p-6">
          <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-4 border-b border-red-100">
              <div>
                <div className="text-sm font-semibold text-gray-800">Sign Out</div>
                <div className="text-xs text-gray-500">Sign out from this device</div>
              </div>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                <LogOut className="h-4 w-4 mr-1.5" />
                Sign Out
              </Button>
            </div>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-800">Delete Account</div>
                <div className="text-xs text-gray-500">Permanently delete your account and all data</div>
              </div>
              <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700">
                Delete Account
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
