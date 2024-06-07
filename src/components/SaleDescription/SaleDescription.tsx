import React, { memo, useEffect, useMemo, useState } from 'react'
import { cn } from '@bem-react/classname'

import './SaleDescription.css';
import { timerFromTimestamp } from 'utils/timer';
import { useAppSelector } from 'store/store';

const CnSaleDescription = cn('saleDescription')

export const SaleDescription: React.FC = memo(() => {
    const {timers} = useAppSelector(store => store.timers);
    const {info} = useAppSelector(store => store.info);
    const { user } = useAppSelector(store => store.user);

    const currentCohortId = useMemo(() => user?.cohort?.number, [user?.cohort.number]) 

    const timersContent = useMemo(() => {
        if (timers) {
            return (
                <div>
                    <div className={CnSaleDescription('title')}>
                        Time
                    </div>
                    {
                        timers.filter((timer: any) => timer.type !== "PRIMARY").map((timer: any) => (
                            <SaleDescriptionTimer key={timer.caption} label={timer.caption} secondsLeft={timer.remaining_seconds} />
                        )) 
                    }
                </div>
            )
        } else {
            return null
        }
    }, [timers])

    const cohortContent = useMemo(() => {
        if (!info?.cohorts_info) {
            return null
        } else {
            return (
                <>
                    <div style={{ marginTop: 16 }} className={CnSaleDescription('title')}>
                        Cohorts
                    </div>
                    {
                        info.cohorts_info.map((cohort: any) => (
                            <SaleDescriptionItem isSelected={cohort.number === currentCohortId} key={cohort.number} label={cohort.title} value={""} />
                        ))
                    }
                </>
            )
        }
    }, [info?.cohorts_info, currentCohortId]) 

    const marketContent = useMemo(() => {
        if (!info?.market_metrics) {
            return null
        } else {
            return (
                <>
                    <div style={{ marginTop: 16 }} className={CnSaleDescription('title')}>
                        Market
                    </div>
                    {
                        info.market_metrics.map((metric: any) => (
                            <SaleDescriptionItem key={metric.caption} label={metric.caption} value={metric.value} />
                        ))
                    }
                </>
            )
        }
    }, [info?.market_metrics]) 

    if (!timersContent && !marketContent && !cohortContent) {
        return null
    }

    return (
        <div className={CnSaleDescription()}>
            {timersContent}
            {marketContent}
            {cohortContent}
        </div>
    )
})

const SaleDescriptionTimer: React.FC<{label: string, secondsLeft: number}> = memo(({ label, secondsLeft }) => {
    const [timer, setTimer] = useState(`${23}:${59}:${59}`);

    useEffect(() => {
        const milisecondsLeft = secondsLeft * 1000;
        const deadline = new Date().getTime() + milisecondsLeft;

        const interval = setInterval(() => {
            const { h, m, s } = timerFromTimestamp(deadline);
            setTimer(`${h < 10 ? '0'+h : h}:${m < 10 ? '0'+ m : m}:${s < 10 ? '0'+s : s}`)
        }, 1000)

        return () => {
            clearInterval(interval);
        }        
    }, [secondsLeft])
    
    return (
        <SaleDescriptionItem label={label} value={timer} />
    )
})

const CnSaleDescriptionItem = cn('saleDescriptionItem')

export const SaleDescriptionItem: React.FC<{ label: string, value: string, isSelected?: boolean }> = memo(({ label, value, isSelected = false }) => {
    return (
        <div className={CnSaleDescriptionItem({ selected: isSelected })}>
            <div className={CnSaleDescriptionItem('label')}>
                {label}
            </div>
            <div className={CnSaleDescriptionItem('item')}>
                {value}
            </div>
        </div>
    )
})
  