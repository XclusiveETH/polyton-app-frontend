import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchAptosBalanceRequest, fetchUserRequest } from "api/user";
import { FetchStatus } from "types/api";
import { Allowance, AptosTokens, Blockhains, EthereumNetworks, EthereumTokens } from "types/enums";


export const fetchUser = createAsyncThunk("@user/fetch", async (walletAddress: string) => {
    return await fetchUserRequest(walletAddress)
})

export const fetchAptosBalance = createAsyncThunk("@user/fetchAptosBalance", async (address: string) => {
    return await fetchAptosBalanceRequest(address)
})

export const logout = createAction("@user/logout")

export const setSelectedToken = createAction<AptosTokens | EthereumTokens>("@user/setSelectedToken")

export const setSelectedBlockchain = createAction<Blockhains>("@user/setSelectedBlockchain")

export const setEthereumBalance = createAction<{
    token: string,
    balance: string,
}>('@user/setEthereumBalance')

export const setSelectedNetwork = createAction<EthereumNetworks>("@user/setSelectedNetwork")

export const setApprovedTokens = createAction<Record<string, Allowance>>("@user/setApprovedTokens")

export const setTransactionFetchStatus = createAction<FetchStatus>("@user/setTransactionFetchStatus")

export const setTransactionDetails = createAction<any>("@user/setTransactionDetails")

export const setEthereumBuyTransactionData = createAction<any>("@user/setBuyTransactionData")

export const setAptosBuyTransactionData = createAction<any>("@user/setAptosBuyTransactionData")