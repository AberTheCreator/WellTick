export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  type?: 'text' | 'audio' | 'image';
  metadata?: {
    emotion?: string;
    confidence?: number;
    language?: string;
    audioUrl?: string;
    imageUrl?: string;
  };
  timestamp: Date;
}

export interface AIAnalysis {
  emotion: string;
  confidence: number;
  recommendations: string[];
  supportiveMessage: string;
  riskLevel?: 'low' | 'medium' | 'high';
  suggestedActions?: string[];
}
