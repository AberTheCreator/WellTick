import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  connectWallet,
  getCurrentNetwork,
  getBalance,
  onAccountsChanged,
  onChainChanged,
  removeAllListeners,
  NETWORKS
} from '../utils/web3';

interface Web3ContextType {
  account: string | null;
  balance: string;
  chainId: number | null;
  isConnected: boolean;
  isCorrectNetwork: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string>('0');
  const [chainId, setChainId] = useState<number | null>(null);
  const [connecting, setConnecting] = useState(false);

  const isConnected = !!account;
  const isCorrectNetwork = chainId === NETWORKS.amoy.chainId;

  useEffect(() => {
    checkConnection();
    setupListeners();

    return () => {
      removeAllListeners();
    };
  }, []);

  const checkConnection = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          updateBalance(accounts[0]);
        }
        
        const currentChainId = await getCurrentNetwork();
        setChainId(currentChainId);
      }
    } catch (error) {
      console.error('Error checking connection:', error);
    }
  };

  const setupListeners = () => {
    onAccountsChanged((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        updateBalance(accounts[0]);
      } else {
        setAccount(null);
        setBalance('0');
      }
    });

    onChainChanged((chainId) => {
      const newChainId = parseInt(chainId, 16);
      setChainId(newChainId);
    });
  };

  const updateBalance = async (address: string) => {
    try {
      const newBalance = await getBalance(address);
      setBalance(newBalance);
    } catch (error) {
      console.error('Error updating balance:', error);
    }
  };

  const connect = async () => {
    setConnecting(true);
    try {
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        setAccount(connectedAccount);
        updateBalance(connectedAccount);
      }
    } catch (error) {
      console.error('Connection failed:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setBalance('0');
    setChainId(null);
  };

  const value = {
    account,
    balance,
    chainId,
    isConnected,
    isCorrectNetwork,
    connecting,
    connect,
    disconnect
  };

  return (
    <Web3Context.Provider value={value}>
      {children}
    </Web3Context.Provider>
  );
};

export const useWeb3 = (): Web3ContextType => {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
};
