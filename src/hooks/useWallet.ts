import { useEffect, useMemo, useState } from "react";
import { ethers } from "ethers";

type WalletState = {
  hasProvider: boolean;
  connecting: boolean;
  error?: string;
  address?: string;
  chainId?: string;
  networkName?: string;
  balanceEth?: string;
};

const CHAIN_NAMES: Record<string, string> = {
  "0x1": "mainnet",
  "0x5": "goerli",
  "0xaa36a7": "sepolia",
};

export function useWallet() {
  const [state, setState] = useState<WalletState>({
    hasProvider: typeof window !== "undefined" && !!(window as any).ethereum,
    connecting: false,
  });

  const provider = useMemo(() => {
    if (!state.hasProvider) return undefined;
    return new ethers.BrowserProvider((window as any).ethereum);
  }, [state.hasProvider]);

  const connect = async () => {
    if (!provider) {
      setState(s => ({ ...s, error: "Please install MetaMask to continue." }));
      return;
    }
    try {
      setState(s => ({ ...s, connecting: true, error: undefined }));
      await (window as any).ethereum.request({ method: "eth_requestAccounts" });

      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const chainId: string = await (window as any).ethereum.request({ method: "eth_chainId" });
      const networkName = CHAIN_NAMES[chainId] ?? chainId;

      const balWei = await provider.getBalance(address);
      const balanceEth = ethers.formatEther(balWei);

      setState(s => ({
        ...s,
        connecting: false,
        address,
        chainId,
        networkName,
        balanceEth,
        error: undefined,
      }));
    } catch (e: any) {
      setState(s => ({ ...s, connecting: false, error: e?.message || "Connection failed" }));
    }
  };

  // react to wallet events
  useEffect(() => {
    const eth = (window as any).ethereum;
    if (!eth) return;

    const onAccountsChanged = (accounts: string[]) => {
      if (!accounts?.length) {
        setState(s => ({ ...s, address: undefined, balanceEth: undefined }));
        return;
      }
      connect();
    };
    const onChainChanged = (_chainId: string) => connect();
    const onDisconnect = () => setState(s => ({ ...s, address: undefined }));

    eth.on?.("accountsChanged", onAccountsChanged);
    eth.on?.("chainChanged", onChainChanged);
    eth.on?.("disconnect", onDisconnect);
    return () => {
      eth.removeListener?.("accountsChanged", onAccountsChanged);
      eth.removeListener?.("chainChanged", onChainChanged);
      eth.removeListener?.("disconnect", onDisconnect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provider]);

  return { ...state, connect };
}
