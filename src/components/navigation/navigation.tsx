import React, { FC, useEffect } from "react";
import { BrowserProvider, ethers } from "ethers";
import Box from "@mui/material/Box";
import { navigations } from "./navigation.data";
import { Button, Link } from "@mui/material";
import { useLocation } from "react-router-dom";
import { setAddress, setBalance, setIsWalletInstalled, setSigner } from "../../store/wallet";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { Toast } from "../../utils/toastNotofications";

type NavigationData = {
  path: string;
  label: string;
};

const Navigation: FC = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const dispatch = useAppDispatch();
  const { address, balance, isWalletInstalled, signer } = useAppSelector(state => state.wallet);

  const updateState = async (provider: BrowserProvider) => {
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const balance = await provider.getBalance(address);
    dispatch(setAddress(address));
    dispatch(setSigner(signer));
    dispatch(setBalance(Number(balance)));
  }

  const connectWallet = async () => {
    if (!isWalletInstalled) {
      Toast.error('Please install a wallet to connect')
    }
    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x1" }],
      });
      const provider = new ethers.BrowserProvider(window.ethereum);
      await updateState(provider);
    } catch (error) {
      console.error("Error connecting wallet:", error);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
    Toast.success('Copied!')
  }

  useEffect(() => {
    dispatch(setIsWalletInstalled(!!window.ethereum));

    if (window.ethereum) {
      (async () => {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_accounts", []);

          if (accounts.length > 0) {
            await updateState(provider);
          }
        } catch (error: any) { }
      })()
    };
  }, [window]);

  return (
    <Box
      sx={{
        display: "flex",
        flexFlow: "wrap",
        justifyContent: "end",
        flexDirection: { xs: "column", lg: "row" }
      }}
    >
      {navigations.map(({ path: destination, label }: NavigationData) =>
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
            ...destination === "/" && { color: "primary.main" },
            "& > div": { display: "none" },
            "&.current>div": { display: "block" },
            "&:hover": {
              color: "text.disabled"
            }
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              transform: "rotate(3deg)",
              "& img": { width: 44, height: "auto" }
            }}
          >
            {/* eslint-disable-next-line */}
            <img src="/images/headline-curve.svg" alt="Headline curve" />
          </Box>
          {label}
        </Box>
      )}
      {signer ?
        <Button
          sx={{
            color: 'white',
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 600,
            fontSize: "24px",
            lineHeight: "6px",
            marginLeft: "60px",
            cursor: "copy"
          }}
          onClick={copyAddress}
        >
          {`${address.slice(0, 4)}...${address.slice(-4)} | `}
          {`${+balance.toFixed(4)} ETH`}
        </Button>
        :
        <Button
          sx={{
            position: "relative",
            color: "white",
            cursor: isWalletInstalled ? "pointer" : "not-allowed",
            textDecoration: "none",
            textTransform: "uppercase",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            px: { xs: 0, lg: 3 },
            mb: { xs: 3, lg: 0 },
            fontSize: "24px",
            lineHeight: "6px",
            width: "324px",
            height: "45px",
            borderRadius: "6px",
            backgroundColor: "#00dbe3"
          }}
          onClick={connectWallet}
        >
          Connect Wallet
        </Button>
      }
    </Box>
  );
};

export default Navigation;
