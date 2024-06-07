import React from 'react'
import { cn } from '@bem-react/classname'

import './AllocationModal.css'

const CnAllocationModal = cn('allocation');

export const AllocationModal: React.FC = () => {
    return (
        <div className={CnAllocationModal()}>
            <div className={CnAllocationModal('title')}>
                Allocation Limit
            </div>

            <div className={CnAllocationModal('text')}>
                You have reached your allocation limit for the current Tier. Please wait for the next tier to be able to buy more.
            </div>
        </div>
    )
}
