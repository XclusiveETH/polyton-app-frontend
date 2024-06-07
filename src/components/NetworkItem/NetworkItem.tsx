import React, { useCallback, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { setSelectedNetwork, setSelectedToken } from 'store/actions/user'
import { Chains, EthereumNetworks, EthereumTokens } from 'types/enums'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { cn } from '@bem-react/classname'

import './NetworkItem.css'

const CnNetworkItem = cn("networkItem")

export const NetworkItem: React.FC<{ icon: any, name: string, selected?: boolean, network: EthereumNetworks, chainId: number }> = ({ icon, name, chainId, network }) => {
    const dispatch = useDispatch()
    const { switchNetwork, chainId: currChainId } = useEthereumWalletContext()
    const selected = useMemo(() => chainId === currChainId, [chainId, currChainId])

    const networkClickCallback = useCallback(async () => {
        if (currChainId === Chains.Bsc) {
            dispatch(setSelectedToken(EthereumTokens.USDC))
        }
        
        if (switchNetwork) {
            await switchNetwork(chainId)
            dispatch(setSelectedNetwork(network))
        }
    }, [switchNetwork, chainId, network, dispatch, currChainId])

    return (
        <div onClick={networkClickCallback} className={CnNetworkItem({ selected })}>
            <div className={CnNetworkItem('icon')}>
                {icon}
            </div>

            <div className={CnNetworkItem('text')}>
                {name}
            </div>
        </div>
    )
}