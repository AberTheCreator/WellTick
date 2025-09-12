export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  accessibilityNeeds: string[];
  preferences: UserPreferences;
  isVerified: boolean;
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}
