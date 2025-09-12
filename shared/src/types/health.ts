export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
  medicalInfo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyAlert {
  id: string;
  userId: string;
  location: Location;
  message?: string;
  status: 'active' | 'resolved' | 'false_alarm';
  severity: 'low' | 'medium' | 'high' | 'critical';
  contactsNotified: string[];
  responseReceived: boolean;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'medication' | 'condition' | 'allergy' | 'procedure' | 'note';
  title: string;
  description?: string;
  data?: any;
  isPrivate: boolean;
  ipfsHash?: string;
  encryptionKey?: string;
  sharedWith?: string[];
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WellnessMetric {
  id: string;
  userId: string;
  type: 'mood' | 'pain' | 'energy' | 'sleep' | 'steps' | 'heart_rate' | 'blood_pressure' | 'weight' | 'temperature';
  value: number;
  unit?: string;
  notes?: string;
  tags?: string[];
  source?: 'manual' | 'device' | 'app';
  recordedAt: Date;
  createdAt: Date;
}

export interface RehabSession {
  id: string;
  userId: string;
  gameType: 'memory' | 'coordination' | 'strength' | 'balance' | 'cognitive';
  difficulty: 1 | 2 | 3 | 4 | 5;
  score: number;
  duration: number;
  completed: boolean;
  achievements?: Achievement[];
  progressNotes?: string;
  aiRecommendations?: string[];
  createdAt: Date;
}

export interface Achievement {
  id: string;
  type: 'milestone' | 'streak' | 'improvement' | 'completion';
  title: string;
  description: string;
  points: number;
  badge?: string;
  unlockedAt: Date;
}

export interface TelehealthSession {
  id: string;
  patientId: string;
  providerId: string;
  scheduledAt: Date;
  duration: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  accessibilityNeeds?: string[];
  notes?: string;
  prescription?: string;
  followUpRequired?: boolean;
  createdAt: Date;
}
