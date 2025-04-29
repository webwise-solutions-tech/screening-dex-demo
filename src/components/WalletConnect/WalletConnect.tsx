import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Button, Typography, Box, Chip, Tooltip } from '@mui/material';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import NetworkCheckIcon from '@mui/icons-material/NetworkCheck';

interface NetworkInfo {
  [key: string]: string;
}

const NETWORKS: NetworkInfo = {
  '1': 'Ethereum Mainnet',
  'aa36a7': 'Sepolia Testnet',
  '89': 'Polygon Mainnet',
  '13881': 'Mumbai Testnet',
  '56': 'Binance Smart Chain Mainnet',
  '97': 'Binance Smart Chain Testnet',
  '1284': 'Moonbeam Mainnet',
  '1287': 'Moonbeam Testnet',
  '1285': 'Moonriver Mainnet',
  '1286': 'Moonriver Testnet',
  '128': 'Moonbeam Mainnet',
  '129': 'Moonbeam Testnet',    
  '137': 'Polygon Mainnet',
  '80001': 'Polygon Mumbai Testnet',
  '42161': 'Arbitrum One Mainnet',
  '421611': 'Arbitrum One Testnet',
  '10': 'Optimism Mainnet',
  '420': 'Optimism Testnet',
  '1329': 'Fantom Opera Mainnet',
  '4002': 'Fantom Testnet',
  '250': 'Fantom Mainnet',
  '9712': 'Fantom Testnet',
  '1328': 'Fantom Mainnet',
  '9711': 'Fantom Testnet'
};

const WalletConnect: React.FC = () => {
  const [account, setAccount] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [network, setNetwork] = useState<string>('');
  const [balance, setBalance] = useState<string>('');

  const updateBalance = async (provider: ethers.BrowserProvider, address: string) => {
    try {
      const balance = await provider.getBalance(address);
      setBalance(ethers.formatEther(balance).substring(0, 6));
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance('');
    }
  };

  const updateNetwork = async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork();
      console.log("network: ", network.chainId.toString(16));
      setNetwork(NETWORKS[network.chainId.toString(16)] || 'Unknown Network');
    } catch (error) {
      console.error('Error fetching network:', error);
      setNetwork('Unknown Network');
    }
  };

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (typeof (window as any).ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        const displayAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        setAccount(displayAddress);
        await updateNetwork(provider);
        await updateBalance(provider, accounts[0]);
      } else {
        alert('Please install MetaMask or another Web3 wallet!');
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      setAccount('');
      setNetwork('');
      setBalance('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleAccountsChanged = async (accounts: string[]) => {
      if (accounts.length === 0) {
        // User disconnected
        setAccount('');
        setBalance('');
      } else {
        const displayAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
        setAccount(displayAddress);
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        await updateBalance(provider, accounts[0]);
      }
    };

    const handleChainChanged = async () => {
      const provider = new ethers.BrowserProvider((window as any).ethereum);
      await updateNetwork(provider);
      if (account) {
        const accounts = await provider.send("eth_accounts", []);
        if (accounts.length > 0) {
          await updateBalance(provider, accounts[0]);
        }
      }
    };

    const checkConnection = async () => {
      if (typeof (window as any).ethereum !== 'undefined') {
        const provider = new ethers.BrowserProvider((window as any).ethereum);
        try {
          const accounts = await provider.send("eth_accounts", []);
          if (accounts.length > 0) {
            const displayAddress = `${accounts[0].substring(0, 6)}...${accounts[0].substring(38)}`;
            setAccount(displayAddress);
            await updateNetwork(provider);
            await updateBalance(provider, accounts[0]);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };

    checkConnection();

    if (typeof (window as any).ethereum !== 'undefined') {
      (window as any).ethereum.on('accountsChanged', handleAccountsChanged);
      (window as any).ethereum.on('chainChanged', handleChainChanged);

      return () => {
        (window as any).ethereum.removeListener('accountsChanged', handleAccountsChanged);
        (window as any).ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, [account]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
        {network && account && (
        <Tooltip title="Current Network">
          <Chip
            icon={<NetworkCheckIcon />}
            label={network}
            sx={{
              backgroundColor: '#173039',
              color: '#00dbe3',
              border: '1px solid #00dbe3',
              '& .MuiChip-icon': {
                color: '#00dbe3',
              },
            }}
          />
        </Tooltip>
      )}
        <Button
            variant="contained"
            onClick={connectWallet}
            disabled={loading}
            startIcon={<AccountBalanceWalletIcon />}
            sx={{
            backgroundColor: '#00dbe3',
            '&:hover': {
                backgroundColor: '#00b2b8',
            },
            color: '#173039',
            textTransform: 'none',
            fontSize: { xs: '14px', sm: '16px' },
            fontWeight: 'bold',
            '&.Mui-disabled': {
                backgroundColor: '#A5D6A7',
                color: '#ffffff',
                opacity: 1,
            },
            }}
        >
            {loading ? 'Connecting...' : account ? `${account} (${balance} ETH)` : 'Connect Wallet'}
        </Button>
    </Box>
  );
};

export default WalletConnect; 