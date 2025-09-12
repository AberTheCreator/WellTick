export interface UserPreferences {
  colorInversion?: boolean;
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast?: boolean;
  voiceSpeed?: number;
  notifications?: NotificationPreferences;
  language?: string;
  emergencyContacts?: string[];
}

export interface NotificationPreferences {
  push?: boolean;
  email?: boolean;
  sms?: boolean;
  emergencyAlerts?: boolean;
  communityUpdates?: boolean;
  wellnessReminders?: boolean;
}
