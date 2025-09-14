#!/bin/bash

echo "🚀 Restructuring Welltick Project for Yarn Workspaces..."

echo "🧹 Cleaning existing setup..."
rm -rf node_modules
rm -rf */node_modules
rm -f package-lock.json
rm -f */package-lock.json
rm -f yarn.lock


echo "📁 Creating new workspace structure..."
mkdir -p packages/frontend
mkdir -p packages/backend
mkdir -p packages/contracts
mkdir -p packages/shared

echo "📦 Moving existing packages..."
if [ -d "frontend" ]; then
    cp -r frontend/* packages/frontend/
    cp frontend/.* packages/frontend/ 2>/dev/null || true
fi

if [ -d "backend" ]; then
    cp -r backend/* packages/backend/
    cp backend/.* packages/backend/ 2>/dev/null || true
fi

if [ -d "contracts" ]; then
    cp -r contracts/* packages/contracts/
    cp contracts/.* packages/contracts/ 2>/dev/null || true
fi

if [ -d "shared" ]; then
    cp -r shared/* packages/shared/
    cp shared/.* packages/shared/ 2>/dev/null || true
fi

echo "🗑️ Removing old structure..."
rm -rf frontend backend contracts shared scripts

echo "📝 Creating shared types..."
mkdir -p packages/shared/src/types

cat > packages/shared/src/types/index.ts << 'EOF'
export * from './user';
export * from './community';
export * from './health';
export * from './web3';
export * from './ai';

export interface APIResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
EOF

cat > packages/shared/src/types/user.ts << 'EOF'
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

export interface UserPreferences {
  colorInversion?: boolean;
  fontSize?: 'small' | 'medium' | 'large' | 'extra-large';
  highContrast?: boolean;
  voiceSpeed?: number;
  notifications?: {
    push?: boolean;
    email?: boolean;
    sms?: boolean;
  };
}
EOF

cat > packages/shared/src/types/community.ts << 'EOF'
export interface CommunityPost {
  id: string;
  userId: string;
  user?: { name: string; avatar?: string };
  content: string;
  type: 'tip' | 'question' | 'story' | 'alert';
  tags: string[];
  likes: number;
  comments: Comment[];
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  userId: string;
  content: string;
  likes: number;
  createdAt: Date;
}
EOF

cat > packages/shared/src/types/health.ts << 'EOF'
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  phone: string;
  email?: string;
  relationship: string;
  isPrimary: boolean;
}

export interface HealthRecord {
  id: string;
  userId: string;
  type: 'medication' | 'condition' | 'allergy' | 'procedure' | 'note';
  title: string;
  description?: string;
  isPrivate: boolean;
  createdAt: Date;
}
EOF

cat > packages/shared/src/types/web3.ts << 'EOF'
export interface Web3Config {
  contractAddress: string;
  rpcUrl: string;
  chainId: number;
  chainName: string;
  explorerUrl: string;
}

export interface AccessibilityCredential {
  id: string;
  userId: string;
  tokenId: number;
  metadataURI: string;
  credentialType: 'mobility' | 'visual' | 'hearing' | 'cognitive' | 'general';
}
EOF

cat > packages/shared/src/types/ai.ts << 'EOF'
export interface AIMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  recommendations: string[];
  supportive_message: string;
}
EOF

cat > packages/shared/src/index.ts << 'EOF'
export * from './types';
EOF

cat > packages/shared/tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF

echo "🔧 Fixing frontend imports..."
if [ -f "packages/frontend/src/utils/web3.ts" ]; then
    cat > packages/frontend/src/utils/web3.ts << 'EOF'
import type { Web3Config } from '@welltick/shared';

export const NETWORKS = {
  amoy: {
    chainId: 80002,
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/']
  }
};

export const WEB3_CONFIG: Web3Config = {
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  rpcUrl: process.env.REACT_APP_WEB3_PROVIDER_URL || NETWORKS.amoy.rpcUrls[0],
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID || '80002'),
  chainName: 'Polygon Amoy Testnet',
  explorerUrl: 'https://amoy.polygonscan.com/'
};

export const connectWallet = async (): Promise<string | null> => {
  if (!window.ethereum) {
    alert('Please install MetaMask');
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });
    return accounts[0] || null;
  } catch (error) {
    console.error('Wallet connection failed:', error);
    return null;
  }
};

export const getBalance = async (address: string): Promise<string> => {
  if (!window.ethereum) return '0';
  
  try {
    const balance = await window.ethereum.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    return (parseInt(balance, 16) / Math.pow(10, 18)).toFixed(4);
  } catch {
    return '0';
  }
};

// Add other utility functions as needed
export const isMetaMaskInstalled = () => !!window.ethereum;
export const getCurrentNetwork = async () => {
  if (!window.ethereum) return null;
  const chainId = await window.ethereum.request({ method: 'eth_chainId' });
  return parseInt(chainId, 16);
};
EOF
fi


echo "⚙️ Setting up Yarn configuration..."
cat > .yarnrc.yml << 'EOF'
nodeLinker: node-modules
enableGlobalCache: true
compressionLevel: mixed
EOF

echo "📦 Setting up Yarn..."
if command -v corepack &> /dev/null; then
    corepack enable
    corepack prepare yarn@3.6.4 --activate
else
    echo "⚠️ Corepack not found. Installing Yarn globally..."
    npm install -g yarn
fi

echo "📥 Installing dependencies..."
yarn install


echo "🔨 Building shared package..."
yarn workspace @welltick/shared build

echo ""
echo "✅ Project restructured successfully!"
echo ""
echo "📋 Next steps:"
echo "1. yarn dev              # Start development"
echo "2. yarn build:frontend   # Build frontend for deployment"
echo "3. yarn test            # Run tests"
echo ""
echo "🚀 For deployment:"
echo "1. cd packages/frontend"
echo "2. yarn build"
echo "3. Deploy the build/ folder"
echo ""
