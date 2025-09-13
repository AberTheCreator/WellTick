#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Welltick development environment...\n');

const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
if (majorVersion < 18) {
  console.error('❌ Node.js 18 or higher is required. Current version:', nodeVersion);
  process.exit(1);
}

console.log('✅ Node.js version check passed:', nodeVersion);

const runCommand = (command, cwd = process.cwd()) => {
  try {
    console.log(`🔧 Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      cwd,
      env: { ...process.env, FORCE_COLOR: '1' }
    });
    console.log('✅ Command completed successfully\n');
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    console.error('Error:', error.message);
    throw error;
  }
};

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Created directory: ${dirPath}`);
  }
};

const createFile = (filePath, content) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`📄 Created file: ${filePath}`);
  } else {
    console.log(`⚠️  File exists: ${filePath}`);
  }
};

try {
  console.log('📁 Creating directory structure...');
  const dirs = [
    'backend/logs',
    'backend/uploads/images',
    'backend/uploads/audio',
    'backend/uploads/videos',
    'backend/data',
    'shared/dist',
    'frontend/public/assets/icons'
  ];

  dirs.forEach(ensureDir);

  console.log('🎨 Creating missing SVG icons...');
  
  const svgIcons = {
    'frontend/public/assets/icons/notification.svg': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-5-5V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v7l-5 5h5m7 0v1a3 3 0 11-6 0v-1m6 0H9" />
</svg>`,
    'frontend/public/assets/icons/settings.svg': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>`,
    'frontend/public/assets/icons/hamburger.svg': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
</svg>`,
    'frontend/src/assets/icons/places.svg': `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
</svg>`
  };

  Object.entries(svgIcons).forEach(([filePath, content]) => {
    ensureDir(path.dirname(filePath));
    createFile(filePath, content);
  });

  console.log('📄 Creating missing pages...');
  
  const placesPage = `import React, { useState, useEffect } from 'react';

const Places: React.FC = () => {
  const [places, setPlaces] = useState<any[]>([]);
  
  useEffect(() => {
    // Mock data for now
    setPlaces([
      {
        id: 1,
        name: 'Accessible Coffee Shop',
        address: '123 Main St',
        accessible: true,
        rating: 4.5,
        features: ['Wheelchair Access', 'Audio Menus']
      }
    ]);
  }, []);

  return (
    <div style={{ padding: '16px', minHeight: '100vh', paddingBottom: '80px' }}>
      <h1>Accessible Places</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '16px' }}>
        {places.map((place) => (
          <div
            key={place.id}
            style={{
              padding: '16px',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            <h3>{place.name}</h3>
            <p>{place.address}</p>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
              {place.features.map((feature: string, index: number) => (
                <span
                  key={index}
                  style={{
                    padding: '4px 8px',
                    background: '#007ACC',
                    color: 'white',
                    borderRadius: '12px',
                    fontSize: '12px'
                  }}
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Places;`;

  createFile('frontend/src/pages/Places.tsx', placesPage);

  console.log('🧹 Cleaning existing installations...');
  const cleanPaths = [
    'node_modules',
    'package-lock.json',
    'frontend/node_modules',
    'frontend/package-lock.json',
    'backend/node_modules',
    'backend/package-lock.json',
    'contracts/node_modules',
    'contracts/package-lock.json',
    'shared/node_modules',
    'shared/package-lock.json'
  ];

  cleanPaths.forEach(cleanPath => {
    if (fs.existsSync(cleanPath)) {
      if (fs.lstatSync(cleanPath).isDirectory()) {
        fs.rmSync(cleanPath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(cleanPath);
      }
      console.log(`🗑️  Removed: ${cleanPath}`);
    }
  });

  console.log('📦 Installing dependencies...');
  runCommand('npm install --legacy-peer-deps');

  console.log('🔨 Building shared types...');
  runCommand('npm run build', 'shared');

  console.log('⚙️ Creating environment files...');
  
  const backendEnv = `PORT=5000
NODE_ENV=development
JWT_SECRET=welltick_dev_secret_change_in_production
DATABASE_URL=sqlite:./data/welltick.db

# AI Configuration (Add your actual API key)
AI_API_KEY=your_gemini_api_key_here
AI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Web3 Configuration (Add your actual keys)
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
ETH_RPC_URL=https://rpc-amoy.polygon.technology/

# External Services (Optional)
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
`;

  const frontendEnv = `REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=your_deployed_contract_address_here
REACT_APP_CHAIN_ID=80002
REACT_APP_WEB3_PROVIDER_URL=https://rpc-amoy.polygon.technology/
REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_APP_VERSION=1.0.0
REACT_APP_ENVIRONMENT=development
REACT_APP_IPFS_GATEWAY=https://ipfs.infura.io/ipfs/
`;

  const contractsEnv = `PRIVATE_KEY=your_wallet_private_key_here
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology/
CHAIN_ID=80002
ETHERSCAN_API_KEY=your_etherscan_api_key_for_verification
`;

  createFile('backend/.env', backendEnv);
  createFile('frontend/.env', frontendEnv);
  createFile('contracts/.env', contractsEnv);

  console.log('\n🎉 Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Update .env files with your actual API keys');
  console.log('2. Start development: npm run dev');
  console.log('3. Deploy contracts: npm run deploy:contracts');
  console.log('\n📚 Required API Keys:');
  console.log('- Gemini API key for AI features');
  console.log('- Wallet private key for blockchain');
  console.log('- Google Maps API key (optional)');
  console.log('- Twilio credentials (optional)');
  
} catch (error) {
  console.error('\n❌ Setup failed:', error.message);
  console.log('\n🛠️  Try running individual commands:');
  console.log('1. npm install --legacy-peer-deps');
  console.log('2. cd shared && npm run build');
  console.log('3. npm run dev');
  process.exit(1);
  }
