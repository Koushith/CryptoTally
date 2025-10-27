import { useState } from 'react';
import { User, Building2, Globe, Bell, Shield, Palette, Users } from 'lucide-react';
import { PageHeader } from '@/components/shared/PageHeader';
import { SettingsCard } from '@/components/settings/SettingsCard';
import { ProfileModal } from '@/components/settings/modals/ProfileModal';
import { SecurityModal } from '@/components/settings/modals/SecurityModal';
import { SettingModal } from '@/types/settings.types';

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
          description: 'Manage passkeys, password, and authentication',
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen">
      <div className="w-full max-w-6xl">
        <PageHeader
          title="Settings"
          description="Manage your account and workspace preferences"
        />

        {/* Settings Categories */}
        <div className="space-y-5 md:space-y-8">
          {settingsCategories.map((categoryGroup) => (
            <div key={categoryGroup.category}>
              {/* Category Header */}
              <div className="mb-4 pb-3 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  {categoryGroup.category}
                </h2>
                <p className="text-sm text-gray-500 mt-1">{categoryGroup.description}</p>
              </div>

              {/* Settings Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {categoryGroup.items.map((item) => (
                  <SettingsCard
                    key={item.id}
                    icon={item.icon}
                    title={item.title}
                    description={item.description}
                    onClick={() => setOpenModal(item.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Modals */}
        <ProfileModal
          isOpen={openModal === 'profile'}
          onClose={() => setOpenModal(null)}
        />
        <SecurityModal
          isOpen={openModal === 'security'}
          onClose={() => setOpenModal(null)}
        />
        {/* Add other modals as needed */}
      </div>
    </div>
  );
};
