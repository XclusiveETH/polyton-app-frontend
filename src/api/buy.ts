import axios, { AxiosResponse } from "axios"
import { host } from "config/host"

interface FetchAptosBuyResponse {
    amount_in: string
    amount_out: string
    cohort: string
    signature: string
    nonce: string
    price: string
    price_acceptable: boolean
    valid_before: string
    valid_price?: {
        apt: any;
        busd: any;
        usdc: any;
        usdt: any;
    }
}

export const fetchAptosBuyRequest: any = async (payload: any) => 
    await axios.get<Promise<FetchAptosBuyResponse>, AxiosResponse<FetchAptosBuyResponse>>
        (`${host}/ido/sign_order_from_aptos`, {
            params: payload
        }).then(res => res.data)


interface FetchEthereumBuyResponse {
    amount_in: string
    amount_out: string
    cohort: string
    signature: string[]
    nonce: string
    price: string
    price_acceptable: boolean
    valid_before: string
    valid_price?: {
        apt: any;
        busd: any;
        usdc: any;
        usdt: any;
    }
} 

export const fetchEthereumBuyRequest = async (payload: any) => 
    await axios.get<Promise<FetchEthereumBuyResponse>, AxiosResponse<FetchEthereumBuyResponse>>
        (`${host}/ido/sign_order_from_evm`, {
            params: payload
        }).then(res => res.data)