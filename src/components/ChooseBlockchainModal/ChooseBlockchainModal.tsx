import React, { memo, useCallback, useMemo } from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets'
import { useNavigate } from 'react-router'

import './ChooseBlockchainModal.css'

const CnChooseBlockchainModal = cn('chooseBlockchainModal');

const blockchains = [
    {
        icon: <Icons.Ethereum />,
        name: "Ethereum",
        path: "connectEthereumWallet"
    },
    {
        icon: <Icons.Aptos />,
        name: "Aptos",
        path: "connectAptosWallet"
    }
]

export const ChooseBlockchainModal: React.FC = memo(() => {
    const navigate = useNavigate()

    const blockchainClickCallback = useCallback((name: string) => {
        return () => {
           navigate(`?modal=${name}`)
        }
    }, [navigate])

    const walletsContent = useMemo(() => blockchains.map((blockchain) => (
        <div onClick={blockchainClickCallback(blockchain.path)} key={blockchain.name} className={CnChooseBlockchainModal('wallet')}>
            <div className={CnChooseBlockchainModal('wallet-icon')}>
                {blockchain.icon}
            </div>
            <div className={CnChooseBlockchainModal('wallet-title')}>
                {blockchain.name}
            </div>
        </div>
    )) , [blockchainClickCallback])

    return (
        <div className={CnChooseBlockchainModal()}>
            <div className={CnChooseBlockchainModal('title')}>
                Connect wallet
            </div>

            <div className={CnChooseBlockchainModal('wallets')}>
                {walletsContent}
            </div>
        </div>
    )
})