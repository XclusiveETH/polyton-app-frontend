import { TonConnectUIProvider, Wallet, WalletInfo } from "@tonconnect/ui-react"
import { TonConnect } from "@tonconnect/ui-react"
import React, { useMemo } from "react"
import { FC, PropsWithChildren, useCallback, useEffect, useState } from "react"
import { ITonWalletContext } from "./TonWalletProvider.types"

export const TonWalletContext = React.createContext<ITonWalletContext>({
    address: null,
    connect: null,
    wallets: [],
    formattedAddress: null,
    disconnect: null,
    buy: null
})

export const TonWalletProvider: FC<PropsWithChildren> = ({ children}) => {
    const [tonConnect] = useState(new TonConnect({
        manifestUrl: 'http://localhost:3000/manifest.ton.json'
    }))
    const [address, setAddress] = useState<string | null>(null)
    const [wallets, setWallets] = useState<null | WalletInfo[]>(null)

    const formattedAddress = useMemo(() => {
        if (address) {
            return `${address.slice(0, 9)}...${address.slice(address.length - 4)}`
        }

        return ''
    }, [address])

    useEffect(() => {
        tonConnect.restoreConnection()

        if (tonConnect.wallet) {
            setAddress(tonConnect.wallet.account?.address)
        }
    }, [tonConnect])

    useEffect(() => {
        tonConnect.getWallets().then(setWallets)
    }, [tonConnect])

    const connect = useCallback((wallet: WalletInfo) => {
        try {
            if (tonConnect) {
                tonConnect.connect(wallet);

                if (tonConnect.wallet) {
                    const address = tonConnect.wallet.account.address;

                    setAddress(address);
                }
            }
        } catch {}
    }, [tonConnect])

    const disconnect = useCallback(async () => {
        try {
            if (tonConnect) {
                await tonConnect.disconnect();

                setAddress(null)
            }
        } catch {}
    }, [tonConnect])

    const buy = useCallback(async () => {}, [])

    return (
        <TonWalletContext.Provider value={{
            address,
            wallets,
            formattedAddress,
            connect,
            disconnect,
            buy
        }}>
            {children}
        </TonWalletContext.Provider>
        // <TonConnectUIProvider manifestUrl="/manifest.ton.json"></TonConnectUIProvider>
    )
}