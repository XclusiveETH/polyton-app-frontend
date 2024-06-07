import { cn } from '@bem-react/classname'
import { Box } from 'components/Box'
import React, { useMemo } from 'react'
import Skeleton from 'react-loading-skeleton'
import { useAppSelector } from 'store/store'

import './Market.css'

const CnMarket = cn('market')

const truncateNumbers = (str: string) => {
    const decimals = str.split('.').pop()
    const base = str.split('.').shift()?.split('').reverse()
    if (!base) {
        return str
    }

    const truncatedResult = base.reduce((acc: any, el) => {
        if (acc.counter === 3) {
            acc.arr = [...acc.arr, ',', el]
            acc.counter = 1
        } else {
            acc.arr.push(el)
            acc.counter = acc.counter + 1
        }

        return acc;
    }, {
        counter: 0,
        arr: []
    })

    return truncatedResult.arr.reverse().join('') + '.' + decimals
}

const tokenFromMarketCode: Record<any, string> = {
    apt_contributed: "TON",
    mover_sold: "POLYTON",
    mover_remaining: "POLYTON"
}

export const Market:React.FC = () => {
    const info = useAppSelector(store => store.info.info);
    const marketMetrics = useMemo(() => info && info.market_metrics, [info])

    return null

    return (
        <Box title='IDO Stats'>
            <div className={CnMarket('content')}>
                {
                    marketMetrics ? marketMetrics.map((metric: any) => (
                        <div key={metric.code} className={CnMarket('item')}>
                            <div>
                                {
                                    metric.caption === 'APT Contributed' ? "TON Contributed" : metric.caption
                                }
                            </div>

                            <div>
                                {
                                    truncateNumbers(Number(metric.value).toFixed(2)) + " " + tokenFromMarketCode[metric.code]
                                }
                            </div>
                        </div>
                    ))
                    :
                    <div style={{ margin: -14 }}>
                        <Skeleton width={'100%'} height={100} />
                    </div>
                }
            </div>
        </Box>
    )
}
