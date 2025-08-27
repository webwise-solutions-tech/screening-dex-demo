import * as React from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Chip,
  Divider,
  Stack,
  Tooltip,
  IconButton,
  Alert,
  CircularProgress
} from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LinkIcon from "@mui/icons-material/Link";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import LanIcon from "@mui/icons-material/Lan";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import { useWallet } from "../../hooks/useWallet";

const shorten = (a?: string) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "");

const PrettyRow: React.FC<{ label: React.ReactNode; value: React.ReactNode; icon?: React.ReactNode }> = ({
  label,
  value,
  icon
}) => (
  <Stack
    direction="row"
    alignItems="center"
    spacing={2}
    sx={{ py: 1.25, px: { xs: 1, md: 2 } }}
  >
    <Box sx={{ width: 28, display: "flex", justifyContent: "center" }}>{icon}</Box>
    <Typography variant="body2" sx={{ color: "text.secondary", minWidth: 90 }}>
      {label}
    </Typography>
    <Divider flexItem orientation="vertical" sx={{ mx: 1, opacity: 0.15 }} />
    <Typography variant="body1" sx={{ fontWeight: 600, wordBreak: "break-all" }}>
      {value}
    </Typography>
  </Stack>
);

const ConnectWalletPage: React.FC = () => {
  const {
    hasProvider,
    connect,
    connecting,
    address,
    networkName,
    balanceEth,
    error
  } = useWallet();

  const [copied, setCopied] = React.useState(false);
  const handleCopy = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch { }
  };

  return (
    <Box
      component="main"
      sx={{
        maxWidth: 1000,
        flex: 1,
        minHeight: "calc(100vh - 200px)",
        mx: "auto",
        px: { xs: 2, md: 3 },
        py: { xs: 3, md: 6 }
      }}
    >
      {/* Page header */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          mb: 3,
          borderRadius: 2,
          background:
            "linear-gradient(135deg, rgba(0,219,227,0.18) 0%, rgba(0,0,0,0) 60%)",
          border: theme => `1px solid ${theme.palette.divider}`
        }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800 }}>
              Connect Wallet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Link your EVM wallet (e.g. MetaMask) to view your address, network and ETH balance.
            </Typography>
          </Box>
          <Chip
            color={address ? "success" : "default"}
            icon={address ? <CheckCircleIcon /> : <WarningAmberIcon />}
            label={address ? "Connected" : "Not connected"}
            variant={address ? "filled" : "outlined"}
            sx={{ fontWeight: 700 }}
          />
        </Stack>
      </Paper>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, md: 3 },
          borderRadius: 2,
          border: theme => `1px solid ${theme.palette.divider}`,
          backdropFilter: "blur(2px)"
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          sx={{ mb: 2 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <AccountBalanceWalletIcon sx={{ opacity: 0.7 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Wallet
            </Typography>
          </Stack>

          {!hasProvider ? (
            <Button
              variant="contained"
              color="info"
              endIcon={<LinkIcon />}
              href="https://metamask.io/download/"
              target="_blank"
              rel="noreferrer"
            >
              Install MetaMask
            </Button>
          ) : !address ? (
            <Button
              onClick={connect}
              disabled={connecting}
              variant="contained"
              color="primary"
              sx={{ minWidth: 180, fontWeight: 800 }}
            >
              {connecting ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={18} />
                  <span>Connecting…</span>
                </Stack>
              ) : (
                "Connect Wallet"
              )}
            </Button>
          ) : (
            <Stack direction="row" spacing={1}>
              <Chip
                size="small"
                color="primary"
                variant="outlined"
                label={networkName ?? "Unknown network"}
                icon={<LanIcon />}
                sx={{ fontWeight: 700 }}
              />
              {balanceEth && (
                <Chip
                  size="small"
                  color="secondary"
                  variant="outlined"
                  label={`${Number(balanceEth).toFixed(4)} ETH`}
                  icon={<CurrencyBitcoinIcon />}
                  sx={{ fontWeight: 700 }}
                />
              )}
            </Stack>
          )}
        </Stack>
        {!!error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {hasProvider && address && (
          <>
            <Divider sx={{ my: 1.5 }} />
            <PrettyRow
              label="Address"
              icon={<AccountBalanceWalletIcon fontSize="small" />}
              value={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{address}</span>
                  <Tooltip title={copied ? "Copied!" : "Copy"}>
                    <IconButton size="small" onClick={handleCopy}>
                      <ContentCopyIcon fontSize="inherit" />
                    </IconButton>
                  </Tooltip>
                  <Chip size="small" label={shorten(address)} sx={{ ml: 0.5 }} />
                </Stack>
              }
            />
            <PrettyRow
              label="Network"
              icon={<LanIcon fontSize="small" />}
              value={<Chip size="small" color="primary" label={networkName ?? "Unknown"} />}
            />
            {balanceEth && (
              <PrettyRow
                label="Balance"
                icon={<CurrencyBitcoinIcon fontSize="small" />}
                value={`${Number(balanceEth).toFixed(6)} ETH`}
              />
            )}
          </>
        )}

        {!hasProvider && (
          <Alert severity="info" sx={{ mt: 2 }}>
            No wallet detected. Install MetaMask and refresh this page.
          </Alert>
        )}

        {hasProvider && !address && !connecting && (
          <Alert severity="warning" sx={{ mt: 2 }}>
            Wallet is available but not connected. Click <strong>Connect Wallet</strong> to proceed.
          </Alert>
        )}
      </Paper>
    </Box>
  );
};

export default ConnectWalletPage;
