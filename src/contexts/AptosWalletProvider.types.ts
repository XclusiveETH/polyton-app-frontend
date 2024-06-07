import { NetworkInfo, WalletAdapter, WalletName } from "@mov3r/aptos-wallet-adapter";

export interface IAptosWalletContext {
    connect: null | ((walletName: WalletName<string>) => Promise<void>);
    disconnect: null | (() => Promise<void>);
    address: null | string;
    network: NetworkInfo | null;
    formattedAddress: string;
    adapter?: WalletAdapter<string> | null;
    connected: boolean;
    buy: null | ((amount: number, tokensCount: number) => Promise<void>);
    signTransaction: null | ((payload: any, isFromModal?: boolean) => Promise<void>);
}