import React, { useCallback, useEffect } from 'react'
import { cn } from '@bem-react/classname'
import { ethereumNetworks } from 'constants/ethereumNetworks'
import { NetworkItem } from 'components'

import './ChangeEvmNetworkModal.css'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { useNavigate } from 'react-router'
import { supportedNetworks } from 'constants/supportedNetworks'
import { useAppSelector } from 'store/store'
import { AptosTokens, Blockhains } from 'types/enums'
import { Icons } from 'assets'
import { useDispatch } from 'react-redux'
import { setSelectedBlockchain, setSelectedToken } from 'store/actions/user'
import { useAptosWalletContext } from 'utils/useAptosWalletContext'

const CnChangeEvmNetworkModal = cn('changeEvmNetworkModal')

export const ChangeEvmNetworkModal = () => {
    const dispatch = useDispatch()
    const {chainId, address: ethAddress} = useEthereumWalletContext();
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain);
    const navigate = useNavigate();
    const { address } = useAptosWalletContext()

    useEffect(() => {
        if (selectedBlockchain === Blockhains.Aptos || (chainId && supportedNetworks.includes(chainId)) || !ethAddress) {
            navigate("/")
        }
    }, [chainId, selectedBlockchain, ethAddress])

    const aptosClickCallback = useCallback(() => {
        if (!address) {
            window.localStorage.setItem("blockchain", Blockhains.Aptos)
            navigate('?modal=connectWallet')
        }

        if (address) {
            window.localStorage.setItem("blockchain", Blockhains.Aptos)
            dispatch(setSelectedBlockchain(Blockhains.Aptos))
            dispatch(setSelectedToken(AptosTokens.Apt))
        }
    }, [dispatch, address, navigate])

    return (
        <div className={CnChangeEvmNetworkModal()}>
            <div className={CnChangeEvmNetworkModal('title')}>
                Change Network
            </div>

            <div className={CnChangeEvmNetworkModal('text')}>
                Right now we only support Ethereum, Bsc, Polygon and Arbitrum networks. Please change it and refresh page.
            </div>

            <div className={CnChangeEvmNetworkModal('networks')}>
                <div onClick={aptosClickCallback} className={"networkItem"}>
                    <div className={"networkItem-icon"}>
                        <Icons.Aptos />
                    </div>

                    <div className={"networkItem-text"}>
                        Aptos
                    </div>
                </div>

                {ethereumNetworks.map((network) => (
                    <NetworkItem key={network.chainId} {...network} />
                ))}
            </div>
        </div>
    )
}
