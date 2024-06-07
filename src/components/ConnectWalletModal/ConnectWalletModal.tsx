import React, { useCallback, useMemo } from 'react'
import { cn } from '@bem-react/classname'
import { useDispatch } from 'react-redux'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { useLocation, useNavigate } from 'react-router'
import { Connector } from 'wagmi'
import { AptosTokens, Blockhains, EthereumTokens, TonTokens } from 'types/enums'
import { setSelectedBlockchain, setSelectedToken } from 'store/actions/user'
import { Icons } from 'assets'
import { useAptosWalletContext } from 'utils/useAptosWalletContext'
import { AptosWalletName, FewchaWalletName, MartianWalletName, NightlyWalletName, PontemWalletName, RiseWalletName, WalletName } from '@mov3r/aptos-wallet-adapter'

import './ConnectWalletModal.css'
import { useTonWalletContext } from 'utils/useTonWalletContext'
import { WalletInfo } from '@tonconnect/sdk'

const iconFromWalletId: Record<string, any> = {
    metaMask: <Icons.Metamask />,
    coinbaseWallet: <Icons.Coinbase />
}

const aptosWallets = [
    {
        icon: <Icons.Martian />,
        title: 'Martian Wallet',
        name: MartianWalletName
    },
    {
        icon: <Icons.Petra />,
        title: 'Petra Wallet',
        name: AptosWalletName
    },
    {
        icon: <Icons.Pontem />,
        title: 'Pontem Wallet',
        name: PontemWalletName
    },
    {
        icon: <Icons.Fewcha />,
        title: 'Fewcha Wallet',
        name: FewchaWalletName
    },
    {
        icon: <Icons.Nightly />,
        title: 'Nightly Wallet',
        name: NightlyWalletName
    },
    {
        icon: <Icons.Rise />,
        title: 'Rise Wallet',
        name: RiseWalletName
    },
]

const CnConnectWalletModal = cn('connectWalletModal')

export const ConnectWalletModal = () => {
    const dispatch = useDispatch()
    const ethereumWalletContext = useEthereumWalletContext()
    const { search } = useLocation()
    const isShow = useMemo(() => search.includes('connectWallet'), [search])
    const navigate = useNavigate()

    const connectEvmWalletClickCallback = useCallback((connector: Connector) => {
        return async () => {
            try {
                if (ethereumWalletContext.connect) {
                    await ethereumWalletContext.connect(connector)
                    window.localStorage.setItem("blockchain", Blockhains.Ethereum)

                    dispatch(setSelectedBlockchain(Blockhains.Ethereum))
                    dispatch(setSelectedToken(EthereumTokens.USDC))
                }
            } catch (err) {
                console.log("ERROR WHILE CONNECTING", err)
            } finally {
                navigate('/')
            }
        }
    }, [ethereumWalletContext, navigate, dispatch])

    const evmWalletsContent = useMemo(() => ethereumWalletContext.connectors.map((connector) => (
        <div onClick={connectEvmWalletClickCallback(connector)} key={connector.id} className={CnConnectWalletModal('wallet')}>
            <div className={CnConnectWalletModal('wallet-icon')}>
                {iconFromWalletId[connector.id]}
            </div>
            <div className={CnConnectWalletModal('wallet-title')}>
                {connector.name}
            </div>
        </div>
    )) , [ethereumWalletContext, connectEvmWalletClickCallback])
    
    const aptosWalletContext = useAptosWalletContext()

    const connectClickCallback = useCallback((walletName: WalletName<string>) => {
        return async () => {
            try {
                if (aptosWalletContext.connect) {
                    await aptosWalletContext.connect(walletName)
                    window.localStorage.setItem("blockchain", Blockhains.Aptos)
                    dispatch(setSelectedBlockchain(Blockhains.Aptos))
                    dispatch(setSelectedToken(AptosTokens.Apt))
                }
            } catch (err) {
                console.log("ERROR WHILE CONNECTING", err)
            } finally {
                navigate('/')
            }
        }
    }, [aptosWalletContext, navigate, dispatch])

    const aptosWalletsContent = useMemo(() => aptosWallets.map((wallet) => (
        <div onClick={connectClickCallback(wallet.name)} key={wallet.name} className={CnConnectWalletModal('wallet')}>
            <div className={CnConnectWalletModal('wallet-icon')}>
                {wallet.icon}
            </div>
            <div className={CnConnectWalletModal('wallet-title')}>
                {wallet.title}
            </div>
        </div>
    )) , [connectClickCallback])

    const tonWalletContext = useTonWalletContext()

    const connectTonWalletClickCallback = useCallback((wallet: WalletInfo) => {
        return async () => {
            try {
                if (tonWalletContext.connect) {
                    await tonWalletContext.connect(wallet)
                    window.localStorage.setItem("blockchain", Blockhains.Ton)
                    dispatch(setSelectedBlockchain(Blockhains.Ton))
                }
            } catch (err) {
                console.log("ERROR WHILE CONNECTING", err)
            } finally {
                navigate('/')
            }
        }
    }, [tonWalletContext, navigate, dispatch])

    const tonWalletsContent = useMemo(() => {
        if (tonWalletContext.wallets) {
            return tonWalletContext.wallets.map((wallet) => (
                <div onClick={connectTonWalletClickCallback(wallet)} key={wallet.name} className={CnConnectWalletModal('wallet')}>
                    <div className={CnConnectWalletModal('wallet-icon')}>
                        <img src={wallet.imageUrl} alt={wallet.name} />
                    </div>
                    <div className={CnConnectWalletModal('wallet-title')}>
                        {wallet.name}
                    </div>
                </div>
            ))
        } else {
            return []
        }
    }, [tonWalletContext, connectTonWalletClickCallback])


    return (
        <div className={CnConnectWalletModal()}>
            <div className={CnConnectWalletModal('title')}>
                Connect wallet
            </div>
            {
                isShow ?
                <div className={CnConnectWalletModal('wallets')}>
                    <div className={CnConnectWalletModal('subtitle')}>
                        Ton
                    </div>
                    {tonWalletsContent}
                    <div className={CnConnectWalletModal('subtitle')}>
                        EVM
                    </div>
                    {evmWalletsContent}
                    {/* <div className={CnConnectWalletModal('subtitle')}>
                        Aptos
                    </div>
                    {aptosWalletsContent} */}
                </div>
                :
                null
            }
        </div>
    )
}
