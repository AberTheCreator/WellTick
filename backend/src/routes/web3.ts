import express from 'express';
import { ethers } from 'ethers';
import { create as createIPFS } from 'ipfs-http-client';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User, HealthRecord } from '../database/init';

const router = express.Router();

const provider = new ethers.JsonRpcProvider(process.env.ETH_RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY || '', provider);

const contractABI = [
  'function mintCredential(address to, string memory metadataURI) public',
  'function getMetadataURI(address user) public view returns (string memory)',
  'function balanceOf(address owner) public view returns (uint256)',
  'function tokenOfOwnerByIndex(address owner, uint256 index) public view returns (uint256)'
];

const contract = new ethers.Contract(
  process.env.CONTRACT_ADDRESS || '',
  contractABI,
  wallet
);

let ipfs: any = null;
try {
  ipfs = createIPFS({ 
    host: 'ipfs.infura.io', 
    port: 5001, 
    protocol: 'https',
    headers: {
      authorization: process.env.INFURA_IPFS_PROJECT_ID ? 
        `Basic ${Buffer.from(`${process.env.INFURA_IPFS_PROJECT_ID}:${process.env.INFURA_IPFS_SECRET}`).toString('base64')}` : 
        ''
    }
  });
} catch (error) {
  console.warn('IPFS initialization failed:', error);
}

router.post('/connect-wallet', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const { walletAddress, signature } = req.body;
    
    if (!walletAddress || !signature) {
      return res.status(400).json({ error: 'Wallet address and signature required' });
    }

    const message = `Connect wallet to Welltick: ${Date.now()}`;
    const recoveredAddress = ethers.verifyMessage(message, signature);
    
    if (recoveredAddress.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    await User.update(
      { walletAddress: walletAddress.toLowerCase() },
      { where: { id: req.userId } }
    );

    res.json({ 
      success: true, 
      walletAddress: walletAddress.toLowerCase(),
      message: 'Wallet connected successfully'
    });
  } catch (error) {
    console.error('Connect wallet error:', error);
    res.status(500).json({ error: 'Failed to connect wallet' });
  }
});

router.post('/mint-credential', authMiddleware, async (req: AuthRequest, res) => {
  try {
    const user = await User.findByPk(req.userId);
    
    if (!user || !user.get('walletAddress')) {
      return res.status(400).json({ error: 'Wallet not connected' });
    }

    const walletAddress = user.get('walletAddress') as string;
    const accessibilityNeeds = user.get('accessibilityNeeds') as string[];
    
    const metadata = {
      name: 'Welltick Accessibility Credential',
      description: 'Verified accessibility and wellness credential',
      image: 'https://welltick.com/credential-badge.png',
      attributes: [
        {
          trait_type: 'Accessibility Needs',
          value: accessibilityNeeds.join(', ')
        },
        {
          trait_type: 'Verified',
          value: user.get('isVerified')
        },
        {
          trait_type: 'Issue Date',
          value: new Date().toISOString()
        }
      ]
    };

    let metadataURI = '';
    
    if (ipfs) {
      try {
        const result = await ipfs.add(JSON.stringify(metadata));
        metadataURI = `ipfs://${result.path}`;
      } catch (ipfsError) {
        console.warn('IPFS upload failed:', ipfsError);
        metadataURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
      }
    } else {
      metadataURI = `data:application/json,${encodeURIComponent(JSON.stringify(metadata))}`;
    }

    if (process.env.CONTRACT_ADDRESS && process.env.PRIVATE_KEY) {
      const tx = await contract.mintCredential(walletAddress, metadataURI);
      await tx.wait();

      res.json({
        success: true,
        transactionHash: tx.hash,
        metadataURI,
        message: 'Accessibility credential minted successfully'
      });
    } else {
      res.json({
        success: true,
        metadataURI,
        message: 'Credential created (contracts not deployed)',
        mockMode: true
      });
    }
  } catch (error) {
    console.error('Mint credential error:', error);
    res.status(500).json({ error: 'Failed to mint credential' });
  }
});

router.get('/credentials/:address', async (req, res) => {
  try {
    const { address } = req.params;
    
    if (!process.env.CONTRACT_ADDRESS) {
      return res.json({
        success: true,
        credentials: [],
        message: 'Contracts not deployed'
      });
    }

    const balance = await contract.balanceOf(address);
    const credentials = [];

    for (let i = 0; i < balance; i++) {
      const tokenId = await contract.tokenOfOwnerByIndex(address, i);
      const metadataURI = await contract.getMetadataURI(address);
      credentials.push({
        tokenId: tokenId.toString(),
        metadataURI
      });
    }

    res.json({
      success: true,
      credentials
    });
  } catch (error) {
    console.error('Get credentials error:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
});

export default router;