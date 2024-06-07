import { Connector } from 'wagmi'

export interface IEthereumWalletContext {
    address: null | string;
    connectors: Connector<any, any, any>[];
    connect: null | ((connector: Connector) => Promise<void>);
    connector: null | Connector<any, any, any>;
    formattedAddress: string;
    connected: boolean;
    disconnect: null | (() => Promise<void>);
    buy: null | ((amount: number, tokensCound: number) => Promise<void>);
    approveToken: null | (() => Promise<void>);
    switchNetwork: null | ((chainId: number) => Promise<void>)
    chainId: null | number;
    writeBuyContract: null | ((payload: any, isFromModal?: boolean) => Promise<void>)
}