import React, { memo } from 'react'
import { cn } from '@bem-react/classname'
import { Balance, ConnectWallet, Logo } from 'components'

import './Header.css';

const CnHeader = cn('header')

export const Header: React.FC = memo(() => {
    return (
        <div className={CnHeader()}>
            <Logo />

            <div className={CnHeader('actions')}>
                <Balance />
				<ConnectWallet />
			</div>
        </div>
    )
}
)