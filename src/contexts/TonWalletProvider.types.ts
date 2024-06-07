import { WalletInfo } from "@tonconnect/sdk";

export interface ITonWalletContext {
    address: null | string;
    connect: null | ((wallet: WalletInfo) => void);
    wallets: null | WalletInfo[];
    formattedAddress: null | string;
    disconnect: null | (() => void);
    buy: null | (() => Promise<void>)
}