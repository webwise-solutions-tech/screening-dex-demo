import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { Signer } from 'ethers';


export interface WalletState {
    signer: Signer | null;
    address: string;
    isWalletInstalled: boolean;
    balance: number;
};

const initialState: WalletState = {
    signer: null,
    address: '',
    isWalletInstalled: true,
    balance: 0,
};

const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        setBalance(state, action: PayloadAction<number>) {
            state.balance = action.payload;
        },
        setSigner(state, action: PayloadAction<Signer>) {
            state.signer = action.payload;
        },
        setAddress(state, action: PayloadAction<string>) {
            state.address = action.payload;
        },
        setIsWalletInstalled(state, action: PayloadAction<boolean>) {
            state.isWalletInstalled = action.payload;
        },
    },
});

export const { setAddress, setBalance, setSigner, setIsWalletInstalled } = walletSlice.actions;

export default walletSlice.reducer;
