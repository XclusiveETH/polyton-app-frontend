import React, { memo, useCallback, useMemo } from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets'
import { useLocation, useNavigate } from 'react-router'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { Connector } from 'wagmi'

import './ConnectEthereumWalletModal.css'
import { useDispatch } from 'react-redux'
import { setSelectedBlockchain, setSelectedToken } from 'store/actions/user'
import { Blockhains, EthereumTokens } from 'types/enums'

const iconFromWalletId: Record<string, any> = {
    metaMask: <Icons.Metamask />,
    coinbaseWallet: <Icons.Coinbase />
}

const CnConnectEthereumWalletModal = cn('connectEthereumWalletModal');

export const ConnectEthereumWalletModal: React.FC = memo(() => {
    const dispatch = useDispatch()
    const { connect, connectors } = useEthereumWalletContext()
    const { search } = useLocation()
    const isShow = useMemo(() => search.includes('connectEthereumWallet'), [search])
    const navigate = useNavigate()

    const connectClickCallback = useCallback((connector: Connector) => {
        return async () => {
            try {
                if (connect) {
                    await connect(connector)
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
    }, [connect, navigate, dispatch])

    const walletsContent = useMemo(() => connectors.map((connector) => (
        <div onClick={connectClickCallback(connector)} key={connector.id} className={CnConnectEthereumWalletModal('wallet')}>
            <div className={CnConnectEthereumWalletModal('wallet-icon')}>
                {iconFromWalletId[connector.id]}
            </div>
            <div className={CnConnectEthereumWalletModal('wallet-title')}>
                {connector.name}
            </div>
        </div>
    )) , [connectors, connectClickCallback])

    return (
        <div className={CnConnectEthereumWalletModal()}>
            <div className={CnConnectEthereumWalletModal('title')}>
                Connect wallet
            </div>

            <div className={CnConnectEthereumWalletModal('wallets')}>
                {
                    isShow && walletsContent
                }
            </div>
        </div>
    )
})