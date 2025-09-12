# Welltick - AI-Powered Accessibility & Wellness Platform

**Empowering Accessibility, One Tap at a Time**

Welltick is a cutting-edge, hackathon-winning web and mobile platform that combines advanced AI, blockchain technology, and decentralized Web3 features to create an inclusive accessibility and wellness ecosystem for people with disabilities.

##  Key Features

### AI-Powered Communication
- **Voice-to-text & text-to-speech** with multiple language support
- **Sign language recognition** using computer vision
- **Image-to-text conversion** for visual accessibility
- **Emotional state detection** with personalized wellness recommendations
- **Multimodal AI assistant** powered by OpenAI GPT-4

###  Smart Location Services
- **Accessibility-mapped locations** with community ratings
- **Wheelchair accessibility data** for public spaces
- **Real-time accessibility updates** verified on blockchain
- **Crowdsourced reviews** with tokenized incentives

###  Decentralized Data Ownership
- **Privacy-first health records** stored on IPFS
- **Blockchain-verified credentials** as NFTs
- **Selective data sharing** with encrypted permissions
- **User-controlled medical data vault**

###  Gamified Rehabilitation
- **AI-guided therapy games** tracking progress on blockchain
- **Personalized exercise routines** with achievement systems
- **Progress analytics** and milestone rewards
- **Community challenges** and peer support

###  Emergency Features
- **One-tap emergency alerts** with location sharing
- **Automated contact notifications** via SMS/email
- **Medical information sharing** for first responders
- **Real-time emergency broadcasting** to community

###  Token Economy
- **WELL token rewards** for community contributions
- **Decentralized governance** for platform decisions
- **Staking mechanisms** for premium features
- **NFT accessibility badges** for verification

## 🏗️ Architecture

```
welltick/
├── frontend/         # React.js Progressive Web App
├── backend/          # Node.js/Express REST API
├── contracts/        # Solidity Smart Contracts
├── shared/           # TypeScript Type Definitions
├── scripts/          # Deployment & Setup Scripts
└── docs/            # Documentation
```

### Tech Stack

**Frontend:**
- React.js 18 with TypeScript
- Material-UI for accessible components
- Web3.js for blockchain interaction
- PWA support for mobile experience

**Backend:**
- Node.js with Express framework
- SQLite/PostgreSQL database
- Socket.io for real-time communication
- JWT authentication with Web3 integration

**Blockchain:**
- Ethereum/Polygon smart contracts
- Solidity 0.8.20 with OpenZeppelin
- IPFS for decentralized storage
- Hardhat development framework

**AI/ML:**
- Gemini AI for conversational AI
- TensorFlow.js for client-side ML
- Speech recognition & synthesis APIs
- Computer vision for accessibility features

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Git
- A Web3 wallet (MetaMask recommended)
- API keys for external services

### 1. Initial Setup

```bash
# Clone the repository
git clone https://github.com/yourusername/welltick.git
cd welltick

# Run automated setup
npm run setup
```

This will:
- Install all dependencies across workspaces
- Create necessary directories
- Generate environment file templates
- Build shared TypeScript types

### 2. Configure Environment Variables

Update the generated `.env` files with your API keys:

**backend/.env:**
```env
# Required API Keys
AI_API_KEY=your_gemini_api_key
ETH_RPC_URL=https://polygon-mumbai.g.alchemy.com/v2/your_key
GOOGLE_MAPS_API_KEY=your_google_maps_key

# Optional Services
TWILIO_ACCOUNT_SID=your_twilio_sid
INFURA_IPFS_PROJECT_ID=your_infura_project_id
```

**frontend/.env:**
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
REACT_APP_CHAIN_ID=80001
```

### 3. Deploy Smart Contracts

```bash
# Get testnet tokens from Mumbai faucet
# https://faucet.polygon.technology/

# Deploy contracts to Mumbai testnet
npm run deploy:contracts

# Update .env files with deployed contract addresses
```

### 4. Start Development

```bash
# Start all services
npm run dev

# Or start individually
npm run dev:backend   # Backend API on :5000
npm run dev:frontend  # Frontend app on :3000
```

##  Required API Keys & Services

### Essential Services

1. **Gemini API** - AI assistant and language processing
   - Get key: https://platform.openai.com/api-keys
   - Used for: Chat, emotion analysis, text processing

2. **Alchemy/Infura** - Blockchain RPC provider
   - Get key: https://www.alchemy.com/ or https://infura.io/
   - Used for: Smart contract interaction, Web3 connectivity

3. **Google Maps API** - Location services
   - Get key: https://developers.google.com/maps/documentation/javascript/get-api-key
   - Used for: Accessibility mapping, location search

### Optional Services

4. **Twilio** - SMS notifications (optional)
   - Setup: https://www.twilio.com/
   - Used for: Emergency alerts, verification

5. **IPFS/Pinata** - Decentralized storage (optional)
   - Setup: https://pinata.cloud/
   - Used for: Health record storage, metadata

## 🧪 Testing & Development

### Run Tests

```bash
# Test all components
npm test

# Test individually
npm run test:frontend
npm run test:backend  
npm run test:contracts
```

### Smart Contract Testing

```bash
cd contracts
npx hardhat test
npx hardhat coverage
```

### Local Blockchain

```bash
# Start local Hardhat node
cd contracts
npx hardhat node

# Deploy to local network
npx hardhat run scripts/deploy.ts --network localhost
```

##  Production Deployment

### Build for Production

```bash
# Build all components
npm run build

# Creates optimized builds in:
# - frontend/build/
# - backend/dist/
# - contracts/artifacts/
```

### Deploy to Cloud Platforms

**Frontend (Vercel/Netlify):**
```bash
cd frontend
npm run build
# Deploy build/ folder
```

**Backend (Railway/Render/Heroku):**
```bash
cd backend
npm run build
npm start
# Set environment variables in platform
```

**Database Migration:**
```bash
cd backend
npm run migrate
```

### Smart Contract Verification

```bash
cd contracts
npx hardhat verify --network polygon DEPLOYED_CONTRACT_ADDRESS
```

## 🔧 Configuration

### Accessibility Features

The app includes comprehensive accessibility features:

- **Visual:** High contrast mode, font scaling, screen reader support
- **Motor:** Voice navigation, gesture controls, switch support  
- **Cognitive:** Simple mode, reading assistance, memory aids
- **Hearing:** Visual alerts, captions, sign language support

### Web3 Integration

Smart contracts handle:
- **Identity:** Decentralized credentials as NFTs
- **Data:** Encrypted health records on IPFS
- **Rewards:** WELL token distribution for contributions
- **Governance:** Community voting on platform features

##  Features Breakdown

### AI Assistant Capabilities

```javascript
// Example AI interaction
const response = await fetch('/api/ai/chat', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'Help me find accessible restaurants nearby' }
    ],
    type: 'location-assistance'
  })
});
```

### Emergency Alert System

```javascript
// Trigger emergency alert
const alert = await emergencyService.sendAlert({
  location: { lat: 40.7128, lng: -74.0060 },
  severity: 'high',
  message: 'Medical emergency - diabetes',
  contacts: ['primary', 'medical']
});
```

### Health Data Management

```javascript
// Store encrypted health record
const record = await healthService.createRecord({
  type: 'medication',
  title: 'Daily Insulin',
  data: { dosage: '10 units', frequency: 'daily' },
  isPrivate: true,
  encryptionLevel: 'high'
});
```

## Hackathon Features

This project is designed to excel in hackathons with:

### Innovation Score
- **AI Integration:** Advanced multimodal AI for accessibility
- **Web3 Innovation:** Decentralized health records and credentials
- **Social Impact:** Addressing real accessibility challenges
- **Technical Complexity:** Full-stack with blockchain integration

### Demo-Ready Features
- **Live AI Assistant:** Working voice and text interactions
- **Real-Time Emergency:** Functional alert system
- **Blockchain Integration:** Smart contracts with live transactions
- **Responsive Design:** Works on mobile and desktop

### Scalability & Impact
- **Market Size:** 1+ billion people with disabilities globally
- **Business Model:** Token economy with B2B2C opportunities
- **Technical Scalability:** Microservices architecture ready
- **Community Focus:** Built for and by the accessibility community

## Security & Privacy

### Data Protection
- **Encryption:** AES-256 for sensitive data
- **Blockchain Privacy:** Zero-knowledge proofs for verification
- **Access Control:** Granular permissions with time limits
- **Compliance:** HIPAA-ready architecture for health data

### Security Measures
- **Smart Contract Audits:** OpenZeppelin security patterns
- **API Security:** Rate limiting, CORS, helmet.js
- **Authentication:** JWT with Web3 signature verification
- **Input Validation:** Zod schemas for type safety

## 🤝 Contributing

We welcome contributions from the accessibility and Web3 communities!

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following our coding standards
4. Add tests for new functionality
5. Submit a pull request with detailed description

### Coding Standards
- **TypeScript:** Strict mode enabled
- **ESLint + Prettier:** Automated formatting
- **Accessibility:** WCAG 2.1 AA compliance
- **Testing:** Unit tests for business logic

## 📈 Roadmap

### Phase 1 - Core Platform (Current)
- ✅ AI assistant with accessibility features
- ✅ Location-based accessibility mapping
- ✅ Emergency alert system
- ✅ Basic tokenomics

### Phase 2 - Advanced Features
- 🔄 Telehealth integration
- 🔄 Advanced ML models for prediction
- 🔄 Mobile app (React Native)
- 🔄 Wearable device integration

### Phase 3 - Ecosystem Growth
- ⏳ API marketplace for developers
- ⏳ Government partnership program
- ⏳ Research collaboration platform
- ⏳ Global accessibility database

## 📞 Support

- **GitHub Issues:** Report bugs and feature requests


### Documentation
- **API Docs:** `/docs/api.md`
- **Smart Contract Docs:** `/docs/contracts.md`
- **Accessibility Guide:** `/docs/accessibility.md`

### Getting Help
- Check existing GitHub issues
- Join our Discord for real-time help
- Email: support@welltick.io

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **OpenZeppelin** for secure smart contract libraries
- **OpenAI** for advanced AI capabilities
- **Accessibility community** for feedback and testing
- **Web3 developers** for decentralized infrastructure
- **All contributors** making this platform possible

---

**Built with ❤️ for accessibility and powered by AI + Web3**

*Welltick - Where technology meets compassion to break down barriers and build an inclusive digital future.*