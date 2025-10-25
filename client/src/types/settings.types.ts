export type SettingModal =
  | 'profile'
  | 'workspace'
  | 'team'
  | 'preferences'
  | 'notifications'
  | 'security'
  | 'appearance'
  | null;

export interface SettingsItem {
  id: SettingModal;
  icon: any; // LucideIcon type
  title: string;
  description: string;
}

export interface SettingsCategory {
  category: string;
  description: string;
  items: Omit<SettingsItem, 'id'>[];
}
