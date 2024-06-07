import React, { useCallback } from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets'

import './Balance.css'
import { useAppSelector } from 'store/store'

const CnBalance = cn('balance')

export const Balance: React.FC = () => {
	const { user } = useAppSelector(store => store.user);

	if (!user) {
		return null
	}

	return (
		<div className={CnBalance('border')}>
			<div className={CnBalance()}>
				<div className={CnBalance('left')}>
					<div className={CnBalance('content')}>
						{user?.mover_balance?.slice(0, 6)} POLYTON
					</div>
				</div>
			</div>
		</div>
	)
}
