import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@bem-react/classname'
import { Box } from 'components/Box'
import { useAppSelector } from 'store/store'
import moment from 'moment'
import { timerFromTimestamp } from 'utils/timer'
import Skeleton from 'react-loading-skeleton'

import './Cohorts.css'
import { Icons } from 'assets'

const CnCohort = cn('cohort')

const interval: Record<string, NodeJS.Timer | null> = {};

export const Cohorts:React.FC = () => {
    const cohorts = useAppSelector(store => store.info?.info?.cohorts_info)
    const userCohorts = useAppSelector(store => store.user.user?.cohort_list)

    const cohortsContent = useMemo(() => {
        if (!cohorts) {
            return null
        }
        const arr =  [...cohorts]

        const sorted = arr.sort((a: any, b: any) => a.number - b.number)

        return arr && sorted.map((cohort: any) => {
            return (
                <CohortItem userCohorts={userCohorts} cohort={cohort} key={cohort.number} />
            )
        })
    }, [cohorts, userCohorts])

    if (!cohorts || !cohortsContent) {
        return null;
    }

    return (
        <Box title={"IDO Tiers"}>
            <table className={CnCohort('content')}>
                <thead>
                    <tr>
                        <th>Tier:</th>
                        <th>Max:</th>
                        <th>Time:</th>
                        <th></th>
                    </tr>
                </thead>

                <tbody>
                    {cohortsContent}
                </tbody>
            </table>
        </Box>
    )
}

export const CohortItem: React.FC<any> = memo(({ cohort, userCohorts }) => {
    const [timer, setTimer] = useState<any>(null)
    const user = useAppSelector(store => store.user)
    const cohortsInfo = useAppSelector(store => store.info?.info?.cohorts_info)
    const isCohortAvailable = useMemo(() => user && userCohorts ? userCohorts.includes(cohort.number) : true, [cohort, userCohorts, user])
    const [isAccessShow, setIsAccessShow] = useState(false)
    const [isExpired, setIsExpired] = useState<any>(moment(cohort.time_end).isBefore(moment()))
    const [isStarted, setIsStarted] = useState(moment(cohort.time_start).isBefore(moment()))

    const calcFirst = useCallback(() => {
        if (cohortsInfo && userCohorts) {
            const arr = [...cohortsInfo]
            const sorted = arr.sort((a: any, b: any) => a.number - b.number)

            const fisrtAccessibleCohort = sorted.find((cohort: any) => {
                const isCohortInUser = userCohorts && userCohorts.includes(cohort.number)
                const isEx = moment(cohort.time_end).isBefore(moment())
        
                return isCohortInUser && !isEx
            })

            if (fisrtAccessibleCohort && fisrtAccessibleCohort.number === cohort.number) {
                return true
            }
        }

        return false
    }, [cohortsInfo, userCohorts, cohort])

    const currAccessShowCohort = useMemo(() => {
        return calcFirst()
    }, [calcFirst])

    useEffect(() => {
        if (!isExpired) {
            const deadline = isStarted ? new Date(cohort.time_end).getTime() : new Date(cohort.time_start).getTime();
            
            if (interval[cohort.number]) {
                clearInterval(interval[cohort.number] as unknown as number)
                interval[cohort.number] = null
            }

            const newInterval = setInterval(() => {
                const { d, h, m, s } = timerFromTimestamp(deadline);
                const isExpired = moment(cohort.time_end).isBefore(moment());
                const isStarted = moment(cohort.time_start).isBefore(moment());

                if (isExpired) {
                    setIsExpired(isExpired)
                    interval[cohort.number] = null
                    clearInterval(newInterval);
                }

                if (isStarted) {
                    setIsStarted(isStarted)
                }

                const accessibleShow = calcFirst()

                if (!isExpired && isCohortAvailable && !isAccessShow && accessibleShow) {
                    setIsAccessShow(true)
                }

                const dLabel = d < 10 ? '0'+d : `${d}`;
                const hLabel = h < 10 ? '0'+h : h === 60 ? '00' : `${h}`;
                const mLabel = m < 10 ? '0'+m : m === 60 ? '00' : `${m}`;
                const sLabel = s < 10 ? '0'+s : s === 60 ? '00' : `${s}`;

                setTimer(
                    isStarted ? 
                    m >= 1 || h >= 1 || d >= 1 ?
                    <>{hLabel} h {mLabel} min till end</> 
                    :
                    <>{mLabel} m {sLabel} sec till end</> 
                    : 
                    d > 0 ? 
                    <>{dLabel} d {hLabel} h {mLabel} min before start</> 
                    : 
                    m >= 1 || h >= 1 || d >= 1 ?
                    <>{hLabel} h {mLabel} min before start</> 
                    :
                    <>{mLabel} m {sLabel} sec before start</> 
                )
            }, 1000)
            
            interval[cohort.number] = newInterval;

            return () => {
                interval[cohort.number] = null
                clearInterval(newInterval);
            }  
        }
    }, [isExpired, isStarted, cohort, isAccessShow, isCohortAvailable, currAccessShowCohort, calcFirst])

    return (
        <>
            {
                isStarted && !isExpired ?
                <tr style={{ opacity: 0, height: 1 }} className={CnCohort('field', { activeBorder: true })}/>
                :
                null
            }
            <tr className={CnCohort('field', { expired: isExpired, active: isStarted && !isExpired, notAvailable: !isCohortAvailable })}>
                <td>
                    {cohort.number}
                </td>

                <td>
                    <div className={CnCohort('item')}>
                        {`$${Number(cohort.max_amount_per_user.usdt).toFixed(0)}`}
                    </div>
                </td>

                <td colSpan={3} className={CnCohort('last')} style={{ position: 'relative' }}>
                    <div className={CnCohort('last-row')}>
                        { 
                            isExpired ? 
                                "Finished" : 
                                !!timer ? 
                                    isCohortAvailable ?
                                    <div>
                                        {
                                            timer
                                        }
                                    </div> 
                                    :
                                    <div>
                                        <span>
                                            Not available as you don't<br/> have the Pass
                                        </span>
                                    </div>
                                    :
                                    <Skeleton width={100} height={30} />
                        }
                        {user.user && isAccessShow && isCohortAvailable && !isExpired && timer ? <Icons.AccessText /> : null}
                    </div>
                </td>

                <td style={{ position: 'relative' }}>
                    {
                        !isExpired &&
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div className={CnCohort('active', { active: isStarted })}>
                                <Icons.ActiveCohort />
                            </div>
                        </div>
                    }
                </td>
            </tr>
        </>
    )
})