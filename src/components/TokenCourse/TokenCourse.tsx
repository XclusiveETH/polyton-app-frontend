import React, { memo, useMemo } from 'react'
import { cn } from '@bem-react/classname'
import { useAppSelector } from 'store/store'

import './TokenCourse.css'

const CnTokenCourse = cn('tokenCourse')

export const TokenCourse: React.FC = memo(() => {
    const { user } = useAppSelector(store => store.user);

    const userCohort = useMemo(() => user?.cohort?.number, [user?.cohort?.number])

    return (
        <div className={CnTokenCourse()}>
            <div className={CnTokenCourse('cohort')}>
                You in {userCohort} cohort
            </div>
            <div className={CnTokenCourse('course')}>
                <div className={CnTokenCourse('text')}>
                    1 POLYTON
                </div>
                <div className={CnTokenCourse('text')}>
                    =
                </div>
                <div className={CnTokenCourse('text')}>
                    {user?.mover_price} TON
                </div>
            </div>
        </div>
    )
})
