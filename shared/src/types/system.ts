export type EventType = 
  | 'user_registered'
  | 'user_verified'
  | 'post_created'
  | 'emergency_triggered'
  | 'credential_minted'
  | 'data_shared'
  | 'metric_recorded'
  | 'achievement_unlocked'
  | 'session_completed';

export interface SystemEvent {
  id: string;
  type: EventType;
  userId?: string;
  data: any;
  metadata?: any;
  createdAt: Date;
}

export interface APIError {
  error: string;
  message?: string;
  details?: any;
  statusCode: number;
  timestamp: Date;
}

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  timestamp: Date;
}
