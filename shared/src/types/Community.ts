import { User } from "./user";

export interface CommunityPost {
  id: string;
  userId: string;
  user?: User;
  content: string;
  type: 'tip' | 'question' | 'story' | 'alert';
  tags: string[];
  likes: number;
  comments: Comment[];
  isPublic: boolean;
  location?: Location;
  attachments?: Attachment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  user?: User;
  content: string;
  likes: number;
  replies?: Comment[];
  createdAt: Date;
}

export interface Attachment {
  id: string;
  type: 'image' | 'audio' | 'video' | 'document';
  url: string;
  filename: string;
  size: number;
  description?: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  address?: string;
  city?: string;
  country?: string;
}

export interface Place {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  type: 'restaurant' | 'hospital' | 'pharmacy' | 'park' | 'museum' | 'transport' | 'other';
  accessible: boolean;
  accessibilityFeatures: AccessibilityFeature[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  blockchainHash?: string;
  distance?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AccessibilityFeature {
  type: 'wheelchair_accessible' | 'hearing_loop' | 'braille' | 'elevator' | 'accessible_parking' | 'accessible_restroom' | 'visual_aids' | 'other';
  available: boolean;
  notes?: string;
  verifiedBy?: string;
  verificationDate?: Date;
}
