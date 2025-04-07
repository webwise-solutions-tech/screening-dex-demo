import React, { FC, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { navigations } from "./navigation.data";
import { Link } from "@mui/material";
import { useLocation } from "react-router-dom";
import Web3 from "web3";

// Define the shape of our navigation items
type NavigationData = {
  path: string;  // The URL path for the navigation item
  label: string; // The text displayed for the navigation item
};

// Function to get the network name based on its ID
const getNetworkName = (networkId: number): string => {
  switch (networkId) {
    case 1:
      return "Mainnet";
    case 5:
      return "Goerli";
    case 11155111:
      return "Sepolia";
    default:
      return `Network ID: ${networkId}`; // For unknown networks, just display the ID
  }
};

const Navigation: FC = () => {
  const location = useLocation(); // Hook to get the current route location
  const currentPath = location.pathname; // Extract the current path from the location

  // State variables to store wallet information
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [network, setNetwork] = useState<string | null>(null);

  // Function to connect to the user's Ethereum wallet
  const connectWallet = async () => {
    // Check if MetaMask (or any Ethereum provider) is installed
    if (!window.ethereum) {
      alert("Please install MetaMask to continue.");
      return;
    }

    try {
      const web3 = new Web3(window.ethereum);

      // Request access to the user's Ethereum accounts
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Get the list of accounts and select the first one
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      // Retrieve the account's balance in Wei and convert it to Ether
      const bal = await web3.eth.getBalance(account);
      const ethBalance = web3.utils.fromWei(bal, "ether");

      // Determine the network ID and get its name
      const netId = await web3.eth.net.getId();
      const netName = getNetworkName(Number(netId));

      // Update state with the retrieved wallet information
      setWalletAddress(account);
      setBalance(parseFloat(ethBalance).toFixed(4));
      setNetwork(netName);

      // Reload the page if the user switches accounts or networks
      window.ethereum.on("accountsChanged", () => window.location.reload());
      window.ethereum.on("chainChanged", () => window.location.reload());
    } catch (error) {
      console.error("Wallet connection failed:", error);
    }
  };

  // Function to disconnect the wallet
  const disconnectWallet = () => {
    // Reset wallet-related state variables
    setWalletAddress(null);
    setBalance(null);
    setNetwork(null);
    // Optionally, you can also remove any stored wallet information from local storage or cookies here
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "end",
        flexDirection: { xs: "column", lg: "row" },
        alignItems: "center",
        gap: 2,
      }}
    >
      {/* Render navigation links */}
      {navigations.map(({ path: destination, label }: NavigationData) => (
        <Box
          key={label}
          component={Link}
          href={destination}
          sx={{
            display: "inline-flex",
            position: "relative",
            color: currentPath === destination ? "" : "white",
            lineHeight: "30px",
            letterSpacing: "3px",
            cursor: "pointer",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 700,
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "20px",
            ...(destination === "/" && { color: "primary.main" }),
            "& > div": { display: "none" },
            "&.current>div": { display: "block" },
            "&:hover": {
              color: "text.disabled",
            },
          }}
        >
          {/* Decorative element for the navigation item */}
          <Box
            sx={{
              position: "absolute",
              top: 12,
              transform: "rotate(3deg)",
              "& img": { width: 44, height: "auto" },
            }}
          >
            <img src="/images/headline-curve.svg" alt="Headline curve" />
          </Box>
          {label}
        </Box>
      ))}

      {/* Display wallet information if connected */}
      {walletAddress && (
        <Box
          sx={{
            color: "white",
            textAlign: "right",
            mr: { xs: 0, lg: 3 },
            mb: { xs: 2, lg: 0 },
            fontSize: "14px",
            lineHeight: 1.2,
          }}
        >
          <div>
            <strong>{network}</strong>
          </div>
          <div>{walletAddress}</div>
          <div>{balance} ETH</div>
        </Box>
      )}

      {/* Button to connect or disconnect the wallet */}
      <Box
        onClick={!walletAddress ? connectWallet : disconnectWallet}
        sx={{
          position: "relative",
          color: "white",
          cursor: "pointer",
          textDecoration: "none",
          textTransform: "uppercase",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          px: { xs: 0, lg: 3 },
          mb: { xs: 3, lg: 0 },
          fontSize: "16px",
          lineHeight: "20px",
          width: "auto",
          minWidth: "200px",
          height: "45px",
          borderRadius: "6px",
          backgroundColor: "#00dbe3",
          "&:hover": {
            backgroundColor: walletAddress ? "#ff4d4d" : "#00c0c6",
          },
        }}
      >
        {walletAddress ? "Disconnect Wallet" : "Connect Wallet"}
      </Box>
    </Box>
  );
};

export default Navigation;
