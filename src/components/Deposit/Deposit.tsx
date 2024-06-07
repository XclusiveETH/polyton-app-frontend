import React, { memo, useCallback, useDeferredValue, useEffect, useMemo, useState } from 'react'
import { cn } from '@bem-react/classname'
import { Button, Input, Select, Tooltip } from 'components'
import { Icons } from 'assets'
import { convertFromAptosToMover } from 'utils/convert'
import { useAppSelector } from 'store/store'
import { useNavigate } from 'react-router'
import moment from 'moment'
import { useAptosWalletContext } from 'utils/useAptosWalletContext'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { Allowance, Blockhains } from 'types/enums'

import './Deposit.css'
import { useTonWalletContext } from 'utils/useTonWalletContext'

var saleInterval: any = null;
var currCohortPool: any = null;

const iconFromEthereumToken = {
    "usdt": <Icons.Usdt />,
    "usdc": <Icons.Usdc />,
    'busd': <Icons.Bsc />
}

const CnDeposit = cn('deposit')

const whiteListContent = <div className={CnDeposit('info-wrapper')}>
    <div className={CnDeposit('info')}>
        <div className={CnDeposit('info-text')}>
            Learn more about Polyton <a target="_blank" href="https://moverxyz.medium.com/how-to-complete-mover-ido-whitelisting-30a8d33fdcc3" rel="noreferrer">IDO Whitelists</a><br/>
            If you have Galxe Keypass NFT <a target="_blank" href="https://wl.mov3r.xyz/" rel="noreferrer">register your wallet</a>.
        </div>
    </div>
</div>

// TODO: hardcoded gas fees
const gas_fees = 0.002;

export const Deposit: React.FC = memo(() => {
    const navigate = useNavigate();
    const user = useAppSelector(store => store.user.user);
    const fetchStatus = useAppSelector(store => store.user.fetchStatus);
    const selectedToken = useAppSelector(store => store.user.selectedToken);
    const approvedTokens = useAppSelector(store => store.user.approvedTokens);
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain);
    const aptosBalance = useAppSelector(store => store.user.aptosBalance);
    const ethereumBalance = useAppSelector(store => store.user.ethereumBalance);

    const balance = useMemo(() => {
        if (selectedBlockchain === 'aptos') {
            return aptosBalance
        }

        return ethereumBalance[selectedToken] ? Number(ethereumBalance[selectedToken]).toFixed(4) : '0.0'
    }, [selectedBlockchain, selectedToken, aptosBalance, ethereumBalance])

    const aptosWalletContext = useAptosWalletContext();
    const tonWalletContext = useTonWalletContext();
    const ethereumWalletContext = useEthereumWalletContext();

    const { address, buy } = useMemo(() => {
        if (selectedBlockchain === 'aptos') {
            return tonWalletContext
        } else {
            return ethereumWalletContext
        }
    }, [tonWalletContext, ethereumWalletContext, selectedBlockchain])

    const cohortsInfo = useAppSelector(store => store.info.info?.cohorts_info);
    const moverPriceMap = useAppSelector(store => store.info.moverPrice);
    const moverPrice = useMemo(() => {
        if (!moverPriceMap) {
            return 0
        }

        return Number(moverPriceMap[selectedToken])
    }, [moverPriceMap, selectedToken]);

    const userCohorts = useMemo(() => user?.cohort_list, [user?.cohort_list])
    const [currCohort, setCurrCohort] = useState(null)

    useEffect(() => {
        if (cohortsInfo && userCohorts) {
            if (currCohortPool) {
                clearInterval(currCohortPool)
            }

            currCohortPool = setInterval(() => {
                const currCohort = cohortsInfo.find((item: any) => {
                    const now = moment()
                    const isStart = moment(item.time_start).isBefore(now)
                    const isEnd = moment(item.time_end).isBefore(now)
                    return isStart && !isEnd && userCohorts && userCohorts.includes(item.number)
                });
    
                setCurrCohort(currCohort)
            }, 1000)

            return () => {
                clearInterval(currCohortPool)
            }
        }
    }, [cohortsInfo, userCohorts])

    const [yourSaleStarted, setYourSaleStarted] = useState(false)

    useEffect(() => {
        if (cohortsInfo && userCohorts) {
            if (saleInterval) {
                clearInterval(saleInterval)
            }

            saleInterval = setInterval(() => {
                const isSaleStarted = cohortsInfo.find((cohort: any) => {
                    const now = moment()
                    const isStart = moment(cohort.time_start).isBefore(now)
                    
                    return isStart && userCohorts && userCohorts?.includes(cohort.number)
                })
    
                setYourSaleStarted(isSaleStarted)
            }, 1000)

            return () => {
                clearInterval(saleInterval)
            }
        }
    }, [cohortsInfo, userCohorts])

    const allocation = useMemo(() => user ? user.remaining_limit[selectedToken] : null, [user, selectedToken])
    const [depositCount, setDepositCount] = useState<string | number>('')
    const [selectedTooltip, setSelectedTooltip] = useState<null | number>(null);
    const isInWhiteList = useMemo(() => !address || fetchStatus === 'FETCHING' || !user ? true : !!currCohort, [address, currCohort, fetchStatus, user]);
    const isBalanceInvalid = useMemo(() => Number(depositCount) > Number(balance), [depositCount, balance]);
    const isFeesInvalid = useMemo(() =>  selectedBlockchain === Blockhains.Aptos ? !isBalanceInvalid && balance && selectedTooltip !== 1 && Number(depositCount) > Number(balance) - gas_fees : false ,[depositCount, balance, isBalanceInvalid, selectedTooltip, selectedBlockchain])
    const moverCount = useDeferredValue(convertFromAptosToMover(Number(depositCount), moverPrice))
    const isAllocationInvalid = useMemo(() => Number(allocation) < Number(depositCount) || Number(allocation) == 0, [allocation, depositCount])
    const isBuyValid = useMemo(() => !Number(depositCount), [depositCount])

    const depositCountChangeCallback = useCallback(({ target: { value }}: React.ChangeEvent<HTMLInputElement>) => {
        if (!isNaN(Number(value))) {
            const splitted = value.split('.');

            if (Number(value) === 0 && value.length >= 2 && !value.includes('.')) {
                return;
            }

            if (splitted.length > 1) {
                const decimals = splitted.pop();

                if (decimals && decimals?.length >= 8) {
                    return
                }
            }
            setSelectedTooltip(null);
            setDepositCount(value)
        }
    }, [])

    const tooltipClickCallback = useCallback((value: number) => {
        const nBalance = Number(balance)
        const nAllocation = Number(allocation)

        if (nAllocation >= nBalance) {
            setDepositCount(String((nBalance * value)).slice(0, 6))
        } else {
            setDepositCount(String((nAllocation * value)).slice(0, 6))
        }
        setSelectedTooltip(value);
    }, [balance, allocation])

    const tooltips = useMemo(() => {
        if (balance) {
            if (selectedTooltip) {
                return [
                    <Tooltip isSelected={selectedTooltip === 1} dropdown='Minus gas commissions' onClick={tooltipClickCallback} value={1} title='MAX'/>,
                    <Tooltip isSelected={selectedTooltip === .5} onClick={tooltipClickCallback} value={.5} title='50%'/>,
                    <Tooltip isSelected={selectedTooltip === .25} onClick={tooltipClickCallback} value={.25} title='25%'/>
                ]
            }

            if (Number(depositCount)) {
                return [
                    <Tooltip dropdown='Minus gas commissions' onClick={tooltipClickCallback} value={1} title='MAX'/>,
                ]
            }

            return [
                <Tooltip dropdown='Minus gas commissions' onClick={tooltipClickCallback} value={1} title='MAX'/>,
                <Tooltip onClick={tooltipClickCallback} value={.5} title='50%'/>,
                <Tooltip onClick={tooltipClickCallback} value={.25} title='25%'/>
            ]
        } else {
            return []
        }
    }, [balance, tooltipClickCallback, depositCount, selectedTooltip])


    const aptosInputLeftContent = useMemo(() => (
        <Select 
            disabled={selectedBlockchain === 'ton' || !ethereumWalletContext.address} 
            items={
                [
                    selectedBlockchain === 'ton' ? 
                    {
                        icon: <Icons.Aptos />,
                        title: 'Ton',
                        value: 'ton'
                    }
                    :
                    {
                        icon: iconFromEthereumToken[selectedToken as 'usdc' | 'usdt'],
                        title: selectedToken.toUpperCase(),
                        value: selectedToken
                    }
                ]
            } 
        />
    ), [selectedBlockchain, selectedToken, ethereumWalletContext])

    const moverInputLeftContent = useMemo(() => (
        <Select items={
            [{
                icon: <Icons.Polyton />,
                title: 'Polyton',
                value: 'mov'
            }]
        } disabled/>
    ), [])

    const connectWalletCallback = useCallback(() => {
        navigate('?modal=connectWallet')
    }, [navigate])

    const buyClickCallback = useCallback(async () => {
        if (isAllocationInvalid) {
            navigate('?modal=allocation')
        } else {
            if (buy) {
                buy(selectedBlockchain === Blockhains.Aptos ? selectedTooltip === 1 ? Number(depositCount) - gas_fees : Number(depositCount) : Number(depositCount), moverCount as unknown as number).then(() => {
                    setDepositCount("")
                })
            }
        }
        
    }, [buy, depositCount, isAllocationInvalid, navigate, selectedBlockchain, selectedTooltip, moverCount])

    const selectedNetwork = useAppSelector(store => store.user.selectedNetwork)

    const depositActionContent = useMemo(() => {
        if (!address) {
            return (
                <div onClick={connectWalletCallback} className={CnDeposit('action')}>
                    <Button text="Connect wallet" />
                </div>
            )
        }

        if (!yourSaleStarted) {
            return (
                <div className={CnDeposit('action')}>
                    <Button disabled text="Your sale hasn't started yet" />
                </div>
            )
        }

        if (!isInWhiteList) {
            return (
                <div className={CnDeposit('action')}>
                    <Button disabled text="Only whitelisted wallets can buy" />
                </div>
            )
        }

        if (isBalanceInvalid) {
            return (
                <div className={CnDeposit('action')}>
                    <Button disabled text="Insufficient balance" />
                </div>
            )
        }

        if (isFeesInvalid) {
            return (
                <div className={CnDeposit('action')}>
                    <Button disabled text="Insufficient balance for gas fees" />
                </div>
            )
        }

        const approve = approvedTokens[`${address}${selectedToken}${selectedNetwork}`]

        if (selectedBlockchain === 'ethereum' && approve === Allowance.NotAllowed) {
            return (
                <div className={CnDeposit('action')}>
                    <Button onClick={ethereumWalletContext.approveToken ?? undefined} text={`Approve ${selectedToken.toUpperCase()}`} />
                </div>
            )
        }

        return (
            <div className={CnDeposit('action')}>
                <Button disabled={isBuyValid} onClick={buyClickCallback} text={!depositCount ? "Enter amount" : "Buy"} />
            </div>
        )
    }, [address, connectWalletCallback, isBalanceInvalid, isFeesInvalid, isInWhiteList, buyClickCallback, isBuyValid, selectedToken, selectedBlockchain, approvedTokens, ethereumWalletContext.approveToken, depositCount, selectedNetwork, yourSaleStarted])

    const aptosInputContent = useMemo(() => {
        const maxAllocation = Number(allocation).toFixed(2);
        return (
            <div className={CnDeposit('input')}>
                <Input 
                    placeholder='0.0' 
                    token={selectedToken.toUpperCase()} 
                    id="depositInput"
                    isInvalid={isBalanceInvalid}
                    leftContent={aptosInputLeftContent}
                    disabled={!address}
                    value={depositCount}
                    onChange={depositCountChangeCallback}
                    tooltips={tooltips}
                />
                <div className={CnDeposit('allocation', { show: !isNaN(maxAllocation as unknown as number) })}>Max allocation: {maxAllocation} {selectedToken.toUpperCase()}</div> 
            </div>
        )
    }, [depositCount, depositCountChangeCallback, aptosInputLeftContent, tooltips, isBalanceInvalid, address, allocation, selectedToken])

    const moverPriceContent = useMemo(() => {
        if (!moverPrice) {
            return null
        }
        
        return (
            <div className={CnDeposit('moverPrice')}>
                1 POLYTON = {moverPrice.toFixed(8)} {selectedToken.toUpperCase()}
            </div>
        )
    }, [moverPrice, selectedToken])

    const depositTitleContent = useMemo(() => (
        <div className={CnDeposit('label')}>
            Deposit <span>your</span> {(selectedToken).toUpperCase()}
        </div>
    ), [selectedToken])

    const balanceContent = useMemo(() => {
        if (balance) {
            return (
                <div className={CnDeposit('label')}>
                    <span>Balance: </span>{balance} {selectedToken.toUpperCase()}
                </div>
            )
        }

        return null
    }, [balance, selectedToken])

    return (
        <div className={CnDeposit()}>
            <div className={CnDeposit('background')}></div>
            <div className={CnDeposit('content')}>
                <div className={CnDeposit('header')}>
                    {depositTitleContent}

                    {balanceContent}                    
                </div>

                {aptosInputContent}

                <div className={CnDeposit('header')}>
                    <div className={CnDeposit('label')}>
                        Get POLYTON
                    </div>
                </div>

                <div>
                    <Input 
                        placeholder='0.0' 
                        token='POLYTON' 
                        disabled
                        value={moverCount}
                        leftContent={moverInputLeftContent} 
                    />
                </div>
                {moverPriceContent}

                {
                    depositActionContent
                }

                {
                    !isInWhiteList && yourSaleStarted && whiteListContent
                }
            </div>
        </div>
    )
})
