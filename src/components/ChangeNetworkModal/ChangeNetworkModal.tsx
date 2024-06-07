import React, { useEffect } from 'react'
import { cn } from '@bem-react/classname'

import './ChangeNetworkModal.css'
import { compareNetwork } from 'utils/networkCompare';
import { useNavigate } from 'react-router';
import { useAptosWalletContext } from 'utils/useAptosWalletContext';
import { useAppSelector } from 'store/store';
import { Blockhains } from 'types/enums';

const CnChangeNetworkModal = cn('changeNetworkModal');

export const ChangeNetworkModal: React.FC = () => {
    const { network } = useAptosWalletContext();
    const navigate = useNavigate();
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain)
    
    useEffect(() => {
        if (selectedBlockchain === Blockhains.Ethereum){
            navigate('/')
        }
        
        if (network && network.chainId) {
            const isNeededNetwork = compareNetwork(network.chainId)

            if (isNeededNetwork) {
                navigate('/')
            }
        }
    }, [network, navigate, selectedBlockchain])
    
    return (
        <div className={CnChangeNetworkModal()}>
            <div className={CnChangeNetworkModal('title')}>
                Change Network to Aptos Mainnet
            </div>

            <div className={CnChangeNetworkModal('text')}>
                Right now we only support the Mainnet network of the Aptos blockchain. Please change it using your wallet and refresh page.
            </div>
        </div>
    )
}
