import { createSlice, SliceCaseReducers } from '@reduxjs/toolkit';
import { fetchApp } from 'store/actions/app';
import { fetchAptosBalance, fetchUser, logout, setApprovedTokens, setEthereumBuyTransactionData, setAptosBuyTransactionData, setEthereumBalance, setSelectedBlockchain, setSelectedNetwork, setSelectedToken, setTransactionDetails, setTransactionFetchStatus } from 'store/actions/user';
import { FetchStatus } from 'types/api';
import { Allowance, AptosTokens, Blockhains, EthereumNetworks, EthereumTokens } from 'types/enums';

export interface UserState {
    fetchStatus: FetchStatus;
    error: unknown;
    user: null | any;
    aptosBalance: string | null;
    ethereumBalance: Record<string, string>;
    selectedToken: EthereumTokens | AptosTokens;
    selectedBlockchain: 'aptos' | 'ethereum' | 'ton';
    selectedNetwork: EthereumNetworks;
    approvedTokens: Record<string, Allowance>;
    transactionFetchStatus: FetchStatus;
    transactionData: any;
    buyTransactionData: any;
    aptosBuyTransactionData: any;
}

const initialState: UserState = {
    fetchStatus: FetchStatus.INITIAL,
    error: null,
    user: null,
    aptosBalance: null,
    selectedToken: window.localStorage.getItem('blockchain') === Blockhains.Aptos ? AptosTokens.Apt : EthereumTokens.USDC,
    selectedBlockchain: window.localStorage.getItem('blockchain') as Blockhains ?? Blockhains.Aptos,
    ethereumBalance: {},
    approvedTokens: {},
    selectedNetwork: EthereumNetworks.Ethereum,
    transactionFetchStatus: FetchStatus.INITIAL,
    transactionData: {},
    buyTransactionData: {},
    aptosBuyTransactionData: {}
};

export const userSlice = createSlice<UserState, SliceCaseReducers<UserState>>({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchUser.pending, (state) => {
            state.fetchStatus = FetchStatus.FETCHING;
            state.error = null;
        });

        builder.addCase(fetchUser.fulfilled, (state, { payload }) => {
            state.fetchStatus = FetchStatus.FETCHED;
            state.error = null;

            if (payload) {
                state.user = payload;
            }
        });

        builder.addCase(fetchUser.rejected, (state, { payload }) => {
            state.fetchStatus = FetchStatus.ERROR;
            state.error = payload;
        });

        builder.addCase(fetchAptosBalance.fulfilled, (state, { payload }) => {
            state.aptosBalance = payload;
        });

        builder.addCase(logout, (state) => {
            state.user = null;
        })

        builder.addCase(setSelectedBlockchain, (state, { payload }) => {
            state.selectedBlockchain = payload;
        })

        builder.addCase(setSelectedToken, (state, { payload }) => {
            state.selectedToken = payload;
        })

        builder.addCase(setEthereumBalance, (state, { payload }) => {
            state.ethereumBalance[payload.token] = payload.balance;
        })

        builder.addCase(setApprovedTokens, (state, { payload }) => {
            state.approvedTokens = {
                ...state.approvedTokens,
                ...payload
            }
        })

        builder.addCase(setSelectedNetwork, (state, { payload }) => {
            state.selectedNetwork = payload;
        })

        builder.addCase(setTransactionFetchStatus, (state, { payload }) => {
            state.transactionFetchStatus = payload;
        })

        builder.addCase(setTransactionDetails, (state, { payload }) => {
            state.transactionData = payload;
        })

        builder.addCase(setEthereumBuyTransactionData, (state, { payload }) => {
            state.buyTransactionData = payload;
        })

        builder.addCase(setAptosBuyTransactionData, (state, { payload }) => {
            state.aptosBuyTransactionData = payload;
        })
    },
});

export const userReducer = userSlice.reducer;
