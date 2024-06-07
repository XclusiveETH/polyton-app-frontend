import React from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets'
import { useAppSelector } from 'store/store'

import './SuccessfullyModal.css'

const CnSuccessfullyModal = cn("successfullyModal")

export const SuccessfullyModal: React.FC = () => {
    const transactionData = useAppSelector(store => store.user.transactionData)
    
    return (
        <div className={CnSuccessfullyModal()}>
            <Icons.Success className={CnSuccessfullyModal('icon')} />

            <div className={CnSuccessfullyModal('title')}>
                Success!
            </div>

            <div className={CnSuccessfullyModal('text')}>
                You successfully purchased {transactionData?.moverCount.slice(0, 7)} POLYTON.<br/> 
                It might take up to 5 minutes to update your balance.
            </div>
        </div>
    )
}
