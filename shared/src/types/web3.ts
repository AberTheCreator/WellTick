export interface AccessibilityCredential {
  id: string;
  userId: string;
  tokenId: number;
  metadataURI: string;
  issuedBy: string;
  validUntil?: Date;
  credentialType: 'mobility' | 'visual' | 'hearing' | 'cognitive' | 'general';
  verificationLevel: 'self_reported' | 'professional' | 'medical';
  blockchainTxHash: string;
  createdAt: Date;
}

export interface TokenReward {
  id: string;
  userId: string;
  amount: number;
  activityType: 'post' | 'reply' | 'review' | 'data_contribution' | 'rehab_progress' | 'daily_bonus';
  activityId: string;
  description: string;
  blockchainTxHash?: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

export interface Web3Config {
  contractAddress: string;
  rpcUrl: string;
  chainId: number;
  chainName: string;
  explorerUrl: string;
}

export interface IPFSConfig {
  host: string;
  port: number;
  protocol: 'http' | 'https';
  projectId?: string;
  projectSecret?: string;
}
