import { cn } from '@bem-react/classname';
import { Icons } from 'assets';
import { Box } from 'components';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { calculateChart } from 'utils/chartFunction';
import Skeleton from 'react-loading-skeleton'
import { useAppSelector } from 'store/store';

import './Chart.css'

const CnChart = cn('chart')

export const Chart: React.FC = () => {
    const moverPrice = useAppSelector(store => (store.info.moverPrice as any)?.apt)
    const moverSold = useAppSelector(store => store.info.moverSold)
    const aptosCurrentPrice = useAppSelector(store => store.info.aptosCurrentPrice)
    const chartParams = useAppSelector(store => store.info.chartParams)
    const startAptosPrice = useMemo(() => aptosCurrentPrice && 0.35 / aptosCurrentPrice, [aptosCurrentPrice])
    const endAptosPrice = useMemo(() => aptosCurrentPrice && 0.05 / aptosCurrentPrice, [aptosCurrentPrice])
    const [delay, setDelay] = useState(true)

    const xAxisTickFormatterCallback = useCallback((value: number) => {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M'
        }

        if (value >= 1000) {
            return (value / 1000).toFixed(0) + 'K'
        }
        
        return value.toFixed(0).toString();
    }, [])

    const yAxisTickFormatterCallback = useCallback((value: number) => {
        return value.toFixed(3).toString();
    }, [])

    const data = useMemo(() => {
        const nMoverPrice = Number(moverPrice);
        if (!chartParams || !nMoverPrice || !startAptosPrice) {
            return [];
        }

        const {
            start_value,
            curve_factor,
            end_factor,
            log_base
        } = chartParams;

        const startValue = Number(start_value);
        const curveFactor = Number(curve_factor);
        const endFactor = Number(end_factor);
        const logBase = Number(log_base);

        const data = new Array(100).fill(0).map((_, index) => {
            const calculatedChartValue = calculateChart((index) * 25000, startValue, curveFactor, endFactor, logBase)
            return {
                tokens: index * 25000,
                price:  calculatedChartValue / Number(aptosCurrentPrice)
            }
        })

        data.push({
            tokens: Number(moverSold),
            price: nMoverPrice
        })
        
        data.sort((a,b) => a.price - b.price)
    
        return data;
    }, [chartParams, moverPrice, moverSold, startAptosPrice, aptosCurrentPrice])
    console.log(data)
    const chartLinesContent = useMemo(() => {
        const currPriceIndex = data.findIndex(({ price }) => price === Number(moverPrice))

        const firstLineData = data.slice(0, currPriceIndex + 1);
        const secondLineData = data.slice(currPriceIndex + 1);

        if (!moverPrice) {
            return null
        }

        return (
            <>
                <Line name={'firstLine'} key={'fistLine'} data={firstLineData} dot={<Dot />} activeDot={<ActiveDot />} className={CnChart('firstLine')} type="monotone" dataKey="price" />

                <Line name={'secondLine'} key={'secondLine'} data={secondLineData} dot={<Dot />} activeDot={<ActiveDot />} className={CnChart('secondLine')} type="monotone" dataKey="price" />
            </>
        )
    }, [data, moverPrice])

    useEffect(() => {
        if (startAptosPrice && endAptosPrice && moverSold && chartParams && chartLinesContent) {
            setTimeout(() => {
                setDelay(false)
            }, 1500)
        }
    }, [startAptosPrice, endAptosPrice, moverSold, chartParams, chartLinesContent])

    const axisContent = useMemo(() => {
        if (!startAptosPrice || !endAptosPrice) return null

        return (
            <>
                <XAxis allowDuplicatedCategory={false} minTickGap={25} padding={{ left: 32 }} mirror dataKey={'tokens'} tickFormatter={xAxisTickFormatterCallback} />
                <YAxis domain={[startAptosPrice, endAptosPrice + .083]} type='number' startOffset={.3} markerStart={'.3'} padding={{ bottom: 39 }} minTickGap={1.5} tickCount={20} mirror dataKey={'price'} tickFormatter={yAxisTickFormatterCallback} />
            </>
        )
    }, [startAptosPrice, endAptosPrice, yAxisTickFormatterCallback, xAxisTickFormatterCallback])

    return (
        <Box title="Price now">
            <div className={CnChart('content')}>
                {
                    !startAptosPrice || !endAptosPrice || !moverSold || !chartParams || !chartLinesContent ? 
                    <div className={CnChart('delay')}>
                        <Skeleton height={'100%'} width={'100%'} /> 
                    </div>
                    :
                    <>
                    {
                        delay ?
                        <div className={CnChart('delay')}>
                            <Skeleton height={'100%'} width={'100%'} /> 
                        </div>
                        :
                        null
                    }
                    <ResponsiveContainer width="100%" height="100%">
                        
                        <LineChart
                            width={500}
                            height={300}
                            margin={{ top: 24, bottom: 24, left: 24, right: 24 }}
                        >
                            <CartesianGrid stroke="#2B2B2B" vertical={false} horizontal={true} />
                            
                            {axisContent}
                            
                            <Tooltip />
                            
                            {chartLinesContent}
                        </LineChart>
                    </ResponsiveContainer>
                    </>
                }
            </div>
        </Box>
    );
}

const ActiveDot: React.FC = memo((props: any) => {
    const { cx, cy, payload } = props;
    const x = useMemo(() => cx - 22, [cx])
    const y = useMemo(() => cy - 21, [cy])
    const tooltipX = useMemo(() => cx - 33.5, [cx])
    const tooltipY = useMemo(() => cy - 50, [cy])

    return (
        <>
            <svg x={tooltipX} y={tooltipY} width="66" height="40" viewBox="0 0 66 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10C0 4.47715 4.47715 0 10 0H56C61.5228 0 66 4.47715 66 10V22C66 27.5228 61.5228 32 56 32H10C4.47715 32 0 27.5228 0 22V10Z" fill="url(#paint0_linear_line1)"/>
                <path d="M32.1338 39.5C32.5187 40.1667 33.481 40.1667 33.8659 39.5L38.196 32H27.8037L32.1338 39.5Z" fill="url(#paint1_linear_line1)"/>
                <text className={CnChart('currPriceText')} x="33" y="20" orientation="bottom" type="category" stroke="none" fill="#000" textAnchor="middle">
                    <tspan>{payload.price.toFixed(3)} TON</tspan>
                </text>
                <defs>
                    <linearGradient id="paint0_linear_line1" x1="1.53668e-07" y1="20" x2="66" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9A9A9A"/>
                        <stop offset="1" stopColor="#9A9A9A"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_line1" x1="1.53668e-07" y1="20" x2="66" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#9A9A9A"/>
                        <stop offset="1" stopColor="#9A9A9A"/>
                    </linearGradient>
                </defs>
            </svg>
            <svg x={x} y={y} width="44" height="44" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g filter="url(#filter0_d_1987_5036)">
                    <circle cx="22" cy="21" r="8" fill="#9A9A9A"/>
                </g>
                    <circle cx="22" cy="21" r="4" fill="white"/>
                <defs>
                <filter id="filter0_d_1987_5036" x="0" y="0" width="44" height="44" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                    <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                    <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
                    <feMorphology radius="4" operator="dilate" in="SourceAlpha" result="effect1_dropShadow_1987_5036"/>
                    <feOffset dy="1"/>
                    <feGaussianBlur stdDeviation="5"/>
                    <feComposite in2="hardAlpha" operator="out"/>
                    <feColorMatrix type="matrix" values="0 0 0 0 0.101961 0 0 0 0 0.537255 0 0 0 0 0.780392 0 0 0 0.25 0"/>
                    <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1987_5036"/>
                    <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_1987_5036" result="shape"/>
                </filter>
                </defs>
            </svg>
        </>
    )
})

const Dot: React.FC = memo((props: any) => {
    const { cx, cy, payload } = props;
    const moverPrice = useAppSelector(store => Number((store.info.moverPrice as any)?.apt))
    const isDotShow = useMemo(() => payload.price === moverPrice, [payload, moverPrice])
    const x = useMemo(() => cx - 22, [cx])
    const y = useMemo(() => cy - 21, [cy])
    const tooltipX = useMemo(() => cx - 33.5, [cx])
    const tooltipY = useMemo(() => cy - 50, [cy])

    if (!isDotShow) {
        return null;
    }

    return (
        <>
            <svg x={tooltipX} y={tooltipY} width="66" height="40" viewBox="0 0 66 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 10C0 4.47715 4.47715 0 10 0H56C61.5228 0 66 4.47715 66 10V22C66 27.5228 61.5228 32 56 32H10C4.47715 32 0 27.5228 0 22V10Z" fill="url(#paint0_linear_1897_5692)"/>
                <path d="M32.1338 39.5C32.5187 40.1667 33.481 40.1667 33.8659 39.5L38.196 32H27.8037L32.1338 39.5Z" fill="url(#paint1_linear_1897_5692)"/>
                <text className={CnChart('currPriceText')} x="33" y="20" orientation="bottom" type="category" stroke="none" fill="#000" textAnchor="middle">
                    <tspan>{payload.price.toFixed(3)} TON</tspan>
                </text>
                <defs>
                    <linearGradient id="paint0_linear_1897_5692" x1="1.53668e-07" y1="20" x2="66" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#59FFEB"/>
                        <stop offset="1" stopColor="#14C7FF"/>
                        </linearGradient>
                        <linearGradient id="paint1_linear_1897_5692" x1="1.53668e-07" y1="20" x2="66" y2="20" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#59FFEB"/>
                        <stop offset="1" stopColor="#14C7FF"/>
                    </linearGradient>
                </defs>
            </svg>

            <Icons.ChartDot className={CnChart('dot')} x={x} y={y} />
        </>
    )
})