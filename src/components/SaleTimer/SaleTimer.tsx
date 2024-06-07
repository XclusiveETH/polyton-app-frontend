import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@bem-react/classname'
import { Box } from 'components'
import { useAppSelector } from 'store/store'
import { timerFromTimestamp } from 'utils/timer'
import moment from 'moment'
import Skeleton from 'react-loading-skeleton'

import './SaleTimer.css'

const CnSaleTimer = cn('saleTimer')

var interval: NodeJS.Timer;

export const SaleTimer: React.FC = memo(() => {
    const cohortsInfo = useAppSelector(store => store?.info?.info?.cohorts_info);
    const userCohortList = useAppSelector(store => store.user?.user?.cohort_list)

    const getCurrCohort = useCallback(() => {
        if (cohortsInfo) {
            
            const newCurrCohort = cohortsInfo.find((item: any) => {
                const now = moment()
                const isEnd = moment(item.time_end).isAfter(now)
                // userCohortList
                if (!userCohortList) {
                    return isEnd;
                }
                
                return isEnd && userCohortList && userCohortList.includes(item.number)
            })

            return newCurrCohort
        }
    }, [cohortsInfo, userCohortList])
    const [currCohort, setCurrCohort] = useState<any>(getCurrCohort())
    const [isCohortStarted, setIsCohortStarted] = useState(false)

    useEffect(() => {
        if (interval) {
            clearInterval(interval)
        }

        interval = setInterval(() => {
            const newCurrCohort = getCurrCohort()
            const newCurrCohortStarted = moment(newCurrCohort?.time_start).isBefore(moment())

            if (isCohortStarted !== newCurrCohortStarted) {
                setIsCohortStarted(newCurrCohortStarted)
            }

            if (newCurrCohort?.number !== currCohort?.number) {
                setCurrCohort(newCurrCohort)
            }
        }, 1000)

        return () => {
            clearInterval(interval)
        }
    }, [getCurrCohort, currCohort, isCohortStarted])

    const currCohortStartTimer = useMemo(() => currCohort && new Date(currCohort?.time_start).getTime(), [currCohort])
    const currCohortEndTimer = useMemo(() => currCohort && new Date(currCohort?.time_end).getTime(), [currCohort])

    const currTimer = useMemo(() => isCohortStarted ? currCohortEndTimer : currCohortStartTimer, [isCohortStarted, currCohortStartTimer, currCohortEndTimer])

    const title = useMemo(() => "IDO Stage", [])

    const timerLabel = useMemo(() => {
        if (isCohortStarted) {
            return `Tier ${currCohort?.number} Sale is active! Time left:`
        }
        return `Tier ${currCohort?.number} Sale starts ${moment(currCohort?.time_start).format('DD MMM')} at ${moment(currCohort?.time_start).format('HH:mm')}`
    }, [currCohort, isCohortStarted])

    return (
        <Box title={title}>
            <div className={CnSaleTimer('content')}>
                {
                    currCohort ?
                    <div className={CnSaleTimer('timerLabel')}>
                        {timerLabel}
                    </div>
                    :
                    <Skeleton height={28} width={250} />
                }
                <Timer currTimer={currTimer}/>
            </div>
        </Box>
    )
})

const CnTimer = cn('timer')

const Timer: React.FC<{ currTimer: number }> = memo(({ currTimer }) => {
    const [timer, setTimer] = useState<any>(null);

    useEffect(() => {
        if (currTimer) {
            const interval = setInterval(() => {
                const { d, h, m, s } = timerFromTimestamp(currTimer);

                setTimer({
                    d: d < 10 ? '0'+d : `${d}`,
                    h: h < 10 ? '0'+h : h === 60 ? '00' : `${h}`,
                    m: s === 60 ? m === 60 ? '00' : m < 10 ? '0'+(m+1) : (m+1) : m < 10 ? '0'+m : m === 60 ? '00' : `${m}`,
                    s: s < 10 ? '0'+s : s === 60 ? '00' : `${s}`
                })
            }, 1000)
    
            return () => {
                clearInterval(interval);
            }  
        }      
    }, [currTimer])
    
    if (!timer) {
        return <Skeleton width={250} height={105} />
    }

    return (
        <div className={CnTimer()}>
            {
                Number(timer.d) !== 0
                &&
                <TimerItem value={timer.d} label={'Days'} />
            }
            <TimerItem value={timer.h} label={'Hours'} />
            <TimerItem value={timer.m} label={'Minutes'} />
            <TimerItem value={timer.s} label={'Seconds'} />
        </div>
    )
})

const TimerItem: React.FC<{ value: string, label: string }> = memo(({ value, label }) => {
    return (
        <div className={CnTimer('item')}>
            <div className={CnTimer('value')}>
                {value}
            </div>

            <div className={CnTimer('label')}>
                {label}
            </div>
        </div>
    )
})