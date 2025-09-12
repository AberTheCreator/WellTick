import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const runCommand = (command: string, cwd?: string) => {
  try {
    console.log(`🔧 Running: ${command}`);
    execSync(command, { 
      stdio: 'inherit', 
      cwd: cwd || process.cwd() 
    });
    console.log(`✅ Completed: ${command}`);
  } catch (error) {
    console.error(`❌ Failed: ${command}`);
    throw error;
  }
};

const createEnvFile = (filePath: string, content: string) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`✅ Created: ${filePath}`);
  } else {
    console.log(`⚠️  Exists: ${filePath}`);
  }
};

async function setupProject() {
  console.log("🚀 Setting up Welltick development environment...\n");

  const dirs = [
    'backend/logs',
    'backend/uploads/images',
    'backend/uploads/audio',
    'backend/uploads/videos',
    'backend/data',
    'shared/dist',
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  });

  console.log("\n📦 Installing dependencies...");
  runCommand('npm install');
  runCommand('npm install', 'frontend');
  runCommand('npm install', 'backend');
  runCommand('npm install', 'contracts');
  runCommand('npm install', 'shared');

  
  console.log("\n🔨 Building shared types...");
  runCommand('npm run build', 'shared');

  
  console.log("\n📄 Creating environment files...");

  const backendEnv = `# Backend Environment Variables
PORT=5000
NODE_ENV=development
JWT_SECRET=your_super_secure_jwt_secret_here_change_in_production
DATABASE_URL=sqlite:./data/welltick.db

# AI Configuration
AI_API_KEY=your_openai_api_key_here
AI_API_URL=https://api.openai.com/v1/chat/completions

# Frontend URL
FRONTEND_URL=http://localhost:3000

# Web3 Configuration
PRIVATE_KEY=your_wallet_private_key_here
CONTRACT_ADDRESS=deployed_contract_address_here
ETH_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_alchemy_key

# IPFS Configuration
INFURA_IPFS_PROJECT_ID=your_infura_ipfs_project_id
INFURA_IPFS_SECRET=your_infura_ipfs_secret

# External Services
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=your_twilio_phone_number

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_email_app_password

# Google Maps API
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
`;

  const contractsEnv = `# Contracts Environment Variables
PRIVATE_KEY=your_wallet_private_key_here
ETH_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_alchemy_key
ETHERSCAN_API_KEY=your_etherscan_api_key_for_verification
`;

  const frontendEnv = `# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=http://localhost:5000
REACT_APP_CONTRACT_ADDRESS=deployed_contract_address_here
REACT_APP_CHAIN_ID=80001
REACT_APP_INFURA_PROJECT_ID=your_infura_project_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_APP_VERSION=1.0.0
`;

  createEnvFile('backend/.env', backendEnv);
  createEnvFile('contracts/.env', contractsEnv);
  createEnvFile('frontend/.env', frontendEnv);

  console.log("\n🗄️  Setting up database...");
  try {
    runCommand('npm run build', 'backend');
    console.log("✅ Backend built successfully");
  } catch (error) {
    console.log("⚠️  Backend build failed, but continuing...");
  }

  console.log("\n🎉 Setup completed!");
  console.log("\n📋 Next steps:");
  console.log("1. Update .env files with your actual API keys");
  console.log("2. Get test tokens from Mumbai faucet");
  console.log("3. Deploy smart contracts: npm run deploy:contracts");
  console.log("4. Start development: npm run dev");
  console.log("\n📚 Required API Keys:");
  console.log("- OpenAI API key for AI features");
  console.log("- Alchemy or Infura for blockchain connection");
  console.log("- Google Maps API key for location features");
  console.log("- Twilio for SMS notifications (optional)");
  console.log("- Email SMTP credentials for notifications");
}

setupProject().catch(console.error);
