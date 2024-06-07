import React, { memo, useMemo } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from 'store/store';
import { AptosWalletProvider, EthereumWalletProvider } from 'contexts';
import { AptosWalletAdapter, FewchaWalletAdapter, MartianWalletAdapter, NightlyWalletAdapter, PontemWalletAdapter, RiseWalletAdapter, WalletProvider } from '@mov3r/aptos-wallet-adapter'
import { Recaptcha } from 'Recaptcha';
import { TonWalletProvider } from 'contexts/TonWalletProvider';

interface IProvidersProps {
    children: any;
}

export const Providers:React.FC<IProvidersProps> = memo(({ children }) => {
    const wallets = useMemo(() => [
        new MartianWalletAdapter(),
        new PontemWalletAdapter(),
        new FewchaWalletAdapter(),
        new RiseWalletAdapter(),
        new NightlyWalletAdapter(),
        new AptosWalletAdapter(),
    ], [])

    return (
        <Recaptcha>
            <WalletProvider
                wallets={wallets}
                autoConnect
                onError={(error: Error) => {
                    let text = 'Unknow error';
                    if (error.name === 'WalletNotReadyError') {
                        text = 'Wallet not ready';
                    }
                }}
            >
                <Provider store={store}>
                    <BrowserRouter>
                        <TonWalletProvider>
                            <AptosWalletProvider>
                                <EthereumWalletProvider>
                                    {children}
                                </EthereumWalletProvider>
                            </AptosWalletProvider>
                        </TonWalletProvider>
                    </BrowserRouter>
                </Provider>
            </WalletProvider>
        </Recaptcha>
    )
})
