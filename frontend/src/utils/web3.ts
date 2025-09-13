import { Web3Config } from '../../../shared/src/types/web3';

export const NETWORKS = {
  amoy: {
    chainId: 80002,
    chainName: 'Polygon Amoy Testnet',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18
    },
    rpcUrls: ['https://rpc-amoy.polygon.technology/'],
    blockExplorerUrls: ['https://amoy.polygonscan.com/']
  },
  polygon: {
    chainId: 137,
    chainName: 'Polygon Mainnet',
    nativeCurrency: {
      name: 'POL',
      symbol: 'POL',
      decimals: 18
    },
    rpcUrls: ['https://polygon-rpc.com/'],
    blockExplorerUrls: ['https://polygonscan.com/']
  }
};

export const WEB3_CONFIG: Web3Config = {
  contractAddress: process.env.REACT_APP_CONTRACT_ADDRESS || '',
  rpcUrl: process.env.REACT_APP_WEB3_PROVIDER_URL || NETWORKS.amoy.rpcUrls[0],
  chainId: parseInt(process.env.REACT_APP_CHAIN_ID || '80002'),
  chainName: 'Polygon Amoy Testnet',
  explorerUrl: 'https://amoy.polygonscan.com/'
};

export const toHex = (num: number): string => {
  return `0x${num.toString(16)}`;
};

export const fromHex = (hex: string): number => {
  return parseInt(hex, 16);
};

export const isMetaMaskInstalled = (): boolean => {
  return typeof window !== 'undefined' && typeof window.ethereum !== 'undefined';
};

export const getCurrentNetwork = async (): Promise<number | null> => {
  if (!isMetaMaskInstalled()) return null;
  
  try {
    const chainId = await window.ethereum!.request({ method: 'eth_chainId' });
    return fromHex(chainId);
  } catch (error) {
    console.error('Error getting current network:', error);
    return null;
  }
};

export const switchToAmoy = async (): Promise<boolean> => {
  if (!isMetaMaskInstalled()) {
    alert('Please install MetaMask to use Web3 features');
    return false;
  }

  try {
    await window.ethereum!.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: toHex(NETWORKS.amoy.chainId) }],
    });
    return true;
  } catch (switchError: any) {
    if (switchError.code === 4902) {
      try {
        await window.ethereum!.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: toHex(NETWORKS.amoy.chainId),
            chainName: NETWORKS.amoy.chainName,
            nativeCurrency: NETWORKS.amoy.nativeCurrency,
            rpcUrls: NETWORKS.amoy.rpcUrls,
            blockExplorerUrls: NETWORKS.amoy.blockExplorerUrls
          }]
        });
        return true;
      } catch (addError) {
        console.error('Failed to add Amoy network:', addError);
        return false;
      }
    }
    console.error('Failed to switch to Amoy network:', switchError);
    return false;
  }
};

export const connectWallet = async (): Promise<string | null> => {
  if (!isMetaMaskInstalled()) {
    alert('Please install MetaMask to connect your wallet');
    return null;
  }

  try {
    const accounts = await window.ethereum!.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length > 0) {
      const currentChainId = await getCurrentNetwork();
      
      if (currentChainId !== NETWORKS.amoy.chainId) {
        const switched = await switchToAmoy();
        if (!switched) {
          throw new Error('Please switch to Polygon Amoy Testnet');
        }
      }

      return accounts[0];
    }
    
    return null;
  } catch (error: any) {
    console.error('Error connecting wallet:', error);
    
    if (error.code === 4001) {
      alert('Please connect your wallet to continue');
    } else if (error.message.includes('switch')) {
      alert(error.message);
    } else {
      alert('Failed to connect wallet. Please try again.');
    }
    
    return null;
  }
};

export const getBalance = async (address: string): Promise<string> => {
  if (!isMetaMaskInstalled()) return '0';

  try {
    const balance = await window.ethereum!.request({
      method: 'eth_getBalance',
      params: [address, 'latest'],
    });
    
    const balanceInPOL = parseInt(balance, 16) / Math.pow(10, 18);
    return balanceInPOL.toFixed(4);
  } catch (error) {
    console.error('Error getting balance:', error);
    return '0';
  }
};

export const onAccountsChanged = (callback: (accounts: string[]) => void) => {
  if (isMetaMaskInstalled()) {
    window.ethereum!.on('accountsChanged', callback);
  }
};

export const onChainChanged = (callback: (chainId: string) => void) => {
  if (isMetaMaskInstalled()) {
    window.ethereum!.on('chainChanged', callback);
  }
};

export const removeAllListeners = () => {
  if (isMetaMaskInstalled()) {
    window.ethereum!.removeAllListeners();
  }
};

export const formatAddress = (address: string): string => {
  if (!address) return '';
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const isValidAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

export const getNetworkName = (chainId: number): string => {
  switch (chainId) {
    case 80002:
      return 'Polygon Amoy Testnet';
    case 137:
      return 'Polygon Mainnet';
    case 1:
      return 'Ethereum Mainnet';
    default:
      return 'Unknown Network';
  }
};
