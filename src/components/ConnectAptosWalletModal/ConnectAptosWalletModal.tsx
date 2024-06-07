import React, { memo, useCallback, useMemo } from 'react'
import { AptosWalletName, FewchaWalletName, MartianWalletName, NightlyWalletName, PontemWalletName, RiseWalletName, WalletName } from '@mov3r/aptos-wallet-adapter'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets'
import { useLocation, useNavigate } from 'react-router'
import { useAptosWalletContext } from 'utils/useAptosWalletContext'

import './ConnectAptosWalletModal.css'
import { useDispatch } from 'react-redux'
import { setSelectedBlockchain, setSelectedToken } from 'store/actions/user'
import { AptosTokens, Blockhains } from 'types/enums'

const CnConnectAptosWalletModal = cn('connectAptosWalletModal');

const wallets = [
    {
        icon: <Icons.Martian />,
        title: 'Martian Wallet',
        name: MartianWalletName
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
    {
        icon: <Icons.Aptos />,
        title: 'Petra Wallet',
        name: AptosWalletName
    }
]

export const ConnectAptosWalletModal: React.FC = memo(() => {
    const dispatch = useDispatch()
    const { connect } = useAptosWalletContext()
    const { search } = useLocation()
    const isShow = useMemo(() => search.includes('connectAptosWallet'), [search]);
    const navigate = useNavigate()

    const connectClickCallback = useCallback((walletName: WalletName<string>) => {
        return async () => {
            try {
                if (connect) {
                    await connect(walletName)
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
    }, [connect, navigate, dispatch])

    const walletsContent = useMemo(() => wallets.map((wallet) => (
        <div onClick={connectClickCallback(wallet.name)} key={wallet.name} className={CnConnectAptosWalletModal('wallet')}>
            <div className={CnConnectAptosWalletModal('wallet-icon')}>
                {wallet.icon}
            </div>
            <div className={CnConnectAptosWalletModal('wallet-title')}>
                {wallet.title}
            </div>
        </div>
    )) , [connectClickCallback])

    return (
        <div className={CnConnectAptosWalletModal()}>
            <div className={CnConnectAptosWalletModal('title')}>
                Connect wallet
            </div>

            <div className={CnConnectAptosWalletModal('wallets')}>
                {
                    isShow && walletsContent
                }
            </div>
        </div>
    )
})