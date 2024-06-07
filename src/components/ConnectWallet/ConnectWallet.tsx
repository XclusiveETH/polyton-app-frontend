import React, { memo, useCallback, useMemo, useState } from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets'
import { AptosWalletName, FewchaWalletName, MartianWalletName, NightlyWalletName, PontemWalletName, RiseWalletName } from '@mov3r/aptos-wallet-adapter'
import { useNavigate } from 'react-router'
import { Button } from 'components/Button'
import { useAppSelector } from 'store/store'
import { useAptosWalletContext } from 'utils/useAptosWalletContext'

import './ConnectWallet.css'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { useDispatch } from 'react-redux'
import { setSelectedBlockchain, setSelectedToken } from 'store/actions/user'
import { AptosTokens, Blockhains, EthereumTokens } from 'types/enums'
import { iconFromNetwork } from 'constants/iconsMaps'
import { useTonWalletContext } from 'utils/useTonWalletContext'

const CnConnectWallet = cn('connectWallet')
const CnConnectWalletContent = cn('connectWalletContent')


const iconByAtposWalletName = {
    [PontemWalletName]: <Icons.Pontem />,
    [MartianWalletName]: <Icons.MartianAlt />,
    [FewchaWalletName]: <Icons.Fewcha />,
    [NightlyWalletName]: <Icons.Nightly />,
    [RiseWalletName]: <Icons.Rise />,
    [AptosWalletName]: <Icons.Petra />,
}

const iconByEthereumWalletName: Record<string, any> = {
    'coinbaseWallet': <Icons.Coinbase />,
    'metaMask': <Icons.Metamask />,
}

export const ConnectWallet: React.FC = memo(() => {
    const navigate = useNavigate();
    const aptosWalletContext = useAptosWalletContext()
    const ethereumWalletContext = useEthereumWalletContext()
    
    const isAptosConnected = useMemo(() => !!aptosWalletContext.address, [aptosWalletContext.address])
    const isEthereumConnected = useMemo(() => !!ethereumWalletContext.connected, [ethereumWalletContext.connected])

    const connectWalletClickHandler = useCallback(() => {
        navigate('?modal=connectWallet')
    }, [navigate])

    const WalletContent = useMemo(() => <div onClick={connectWalletClickHandler} className={CnConnectWallet({selected: true})}><div className={CnConnectWallet('title')}>Connect wallet</div></div>, [])

    return (
        <div className={CnConnectWallet('container')}>
            {
                isAptosConnected || isEthereumConnected ?
                <>
                    <EthereumDropdownContent />
                    <AptosDropdownContent />
                </>
                :
                WalletContent
            }
        </div>
    )
})

interface IDropdownContentProps {
}

const AptosDropdownContent: React.FC<IDropdownContentProps> = memo(() => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const aptosWalletContext = useAptosWalletContext()
    const tonWalletContext = useTonWalletContext()
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain)
    const isAptosSelected = useMemo(() => selectedBlockchain === 'aptos', [selectedBlockchain])
    const isAptosConnected = useMemo(() => !!tonWalletContext.address, [tonWalletContext.address])
    const [dropdownStyles, setDropdownStyles] = useState<any>({
        height: 0,
        padding: 0,
        overflow: 'hidden',
    });
    const balance = useAppSelector(store => store.user.aptosBalance)
    const aptosCurrentPrice = useAppSelector(store => Number(store.info.aptosCurrentPrice))
    const [isDropdownShow, setIsDropdownShow] = useState(false);

    const copyClickCallback = useCallback(() => {
        if (aptosWalletContext.address) {
            navigator.clipboard.writeText(aptosWalletContext.address)
        }
    }, [aptosWalletContext.address])

    const disconnectClickCallback = useCallback(async () => {
        setIsDropdownShow(false)
        setDropdownStyles({
            height: 0,
            padding: 0,
            overflow: 'hidden',
        })
        if (tonWalletContext.disconnect) {
            tonWalletContext.disconnect()
        }
    }, [tonWalletContext])

    const connectedWalletIcon = useMemo(() => {
        return <Icons.Aptos />;
    }, [])

    const isDropdownShowChangeCallback = useCallback(() => {
        if (isDropdownShow) {
            setTimeout(() => {
                setDropdownStyles({
                    height: 0,
                    padding: 0,
                    overflow: 'hidden',
                })
            }, 500)
        } else {
            setDropdownStyles({})
        }

        setIsDropdownShow((prev) => !prev);
    }, [isDropdownShow])

    const connectWalletClickHandler = useCallback(() => {
        if (!isAptosConnected) {
            navigate('?modal=connectWallet')
        } else {
            if (!isAptosSelected) {
                window.localStorage.setItem("blockchain", Blockhains.Aptos)

                dispatch(setSelectedBlockchain(Blockhains.Aptos))
                dispatch(setSelectedToken(AptosTokens.Apt))
            } else {
                isDropdownShowChangeCallback();
            }
        }
    }, [dispatch, isAptosSelected, navigate, isAptosConnected, isDropdownShowChangeCallback])

    const dropdownContent = useMemo(() => {
        const usdtBalance = (Number(balance) * Number(aptosCurrentPrice)).toFixed(4);

        return (
            <div style={dropdownStyles} className={CnConnectWallet('dropdown', { show: isDropdownShow })}>
                <div className={CnConnectWalletContent()}>
                    <div className={CnConnectWalletContent('top')}>
                        <div className={CnConnectWalletContent('header')}>
                            <div className={CnConnectWallet('left')}>
                                <div className={CnConnectWalletContent('status', { connected: !!tonWalletContext.address })}></div>

                                <div className={CnConnectWalletContent('address')}>
                                    {tonWalletContext.formattedAddress}
                                </div>
                            </div>

                            <div className={CnConnectWalletContent('actions')}>
                                <Button onClick={copyClickCallback} view="icon" text={
                                    <Icons.Copy />
                                } />
                                <Button onClick={disconnectClickCallback} view="icon" text={
                                    <Icons.TurnOff />
                                } />
                            </div>
                        </div>

                        <div className={CnConnectWalletContent('balance')}>
                            <div className={CnConnectWalletContent('apt')}>
                                {balance} TON
                            </div>
                            <div className={CnConnectWallet("usdc")}>
                                ${usdtBalance}
                            </div>
                        </div>
                    </div>
                    {/* <div className={CnConnectWalletContent('switch')}>
                        <Button view='default' text="Switch to Metamask"/>
                    </div> */}
                </div>
            </div>
        )
    }, [tonWalletContext, isDropdownShow, balance, copyClickCallback, disconnectClickCallback, aptosCurrentPrice, dropdownStyles])

    const walletContent = useMemo(() => {
        if (isAptosConnected || !isAptosSelected) {
            return (
                <>
                <div className={CnConnectWallet('left')}>
                    {connectedWalletIcon}
                    <div className={CnConnectWallet('title')}>
                        {
                            tonWalletContext.formattedAddress
                        }
                    </div>
                </div>

                <Icons.AngleDown className={CnConnectWallet('opener', { rotate: isDropdownShow })} />
                </>
            )
        }

        return <div className={CnConnectWallet('title')}>Connect wallet</div>
    }, [isAptosConnected, connectedWalletIcon, tonWalletContext.formattedAddress, isDropdownShow, isAptosSelected])
    
    return (
        <div className={CnConnectWallet('wrapper', { selected: isAptosSelected })}>
            <div onClick={connectWalletClickHandler} className={CnConnectWallet({ connected: isAptosConnected })}>
                {walletContent}
            </div>
            {dropdownContent}
        </div>
    ) 
})

const EthereumDropdownContent: React.FC<IDropdownContentProps> = memo(() => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const ethereumWalletContext = useEthereumWalletContext()
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain)
    const isEthereumSelected = useMemo(() => selectedBlockchain === 'ethereum', [selectedBlockchain])
    const isEthereumConnected = useMemo(() => !!ethereumWalletContext.address, [ethereumWalletContext.address])
    const [dropdownStyles, setDropdownStyles] = useState<any>({
        height: 0,
        padding: 0,
        overflow: 'hidden',
    });
    const ethereumBalance = useAppSelector(store => store.user.ethereumBalance)
    const selectedToken = useAppSelector(store => store.user.selectedToken)
    const balance = useMemo(() => ethereumBalance[selectedToken], [ethereumBalance, selectedToken])
    const [isDropdownShow, setIsDropdownShow] = useState(false);

    const copyClickCallback = useCallback(() => {
        if (ethereumWalletContext.address) {
            navigator.clipboard.writeText(ethereumWalletContext.address)
        }
    }, [ethereumWalletContext.address])

    const disconnectClickCallback = useCallback(async () => {
        setIsDropdownShow(false)
        setDropdownStyles({
            height: 0,
            padding: 0,
            overflow: 'hidden',
        })
        if (ethereumWalletContext.disconnect) {
            await ethereumWalletContext.disconnect()
        }
    }, [ethereumWalletContext])

    const connectedWalletIcon = useMemo(() => {
        if (!isEthereumSelected && !isEthereumConnected) {
            return <Icons.Metamask />
        }

        if (ethereumWalletContext?.connector?.id) {
            return iconByEthereumWalletName[ethereumWalletContext?.connector?.id]
        }

        return null;
    }, [isEthereumSelected, isEthereumConnected, ethereumWalletContext])

    const isDropdownShowChangeCallback = useCallback(() => {
        if (isDropdownShow) {
            setTimeout(() => {
                setDropdownStyles({
                    height: 0,
                    padding: 0,
                    overflow: 'hidden',
                })
            }, 500)
        } else {
            setDropdownStyles({})
        }

        setIsDropdownShow((prev) => !prev);
    }, [isDropdownShow])

    const connectWalletClickHandler = useCallback(() => {
        if (!isEthereumConnected) {
            navigate('?modal=connectWallet')
        } else {
            if (!isEthereumSelected) {
                window.localStorage.setItem("blockchain", Blockhains.Ethereum)

                dispatch(setSelectedBlockchain(Blockhains.Ethereum))
                dispatch(setSelectedToken(EthereumTokens.USDC))
            } else {
                isDropdownShowChangeCallback();
            }
        }
    }, [dispatch, isEthereumConnected, navigate, isEthereumSelected, isDropdownShowChangeCallback])

    const dropdownContent = useMemo(() => {
        const usdtBalance = Number(balance).toFixed(4);

        return (
            <div style={dropdownStyles} className={CnConnectWallet('dropdown', { show: isDropdownShow })}>
                <div className={CnConnectWalletContent()}>
                    <div className={CnConnectWalletContent('top')}>
                        <div className={CnConnectWalletContent('header')}>
                            <div className={CnConnectWallet('left')}>
                                <div className={CnConnectWalletContent('status', { connected: ethereumWalletContext.connected })}></div>

                                <div className={CnConnectWalletContent('address')}>
                                    {ethereumWalletContext.formattedAddress}
                                </div>
                            </div>

                            <div className={CnConnectWalletContent('actions')}>
                                <Button onClick={copyClickCallback} view="icon" text={
                                    <Icons.Copy />
                                } />
                                <Button onClick={disconnectClickCallback} view="icon" text={
                                    <Icons.TurnOff />
                                } />
                            </div>
                        </div>

                        <div className={CnConnectWalletContent('balance')}>
                            <div className={CnConnectWalletContent('apt')}>
                                {Number(balance).toFixed(4)} {selectedToken.toUpperCase()}
                            </div>
                            <div className={CnConnectWallet("usdc")}>
                                ${usdtBalance}
                            </div>
                        </div>
                    </div>
                    {/* <div className={CnConnectWalletContent('switch')}>
                        <Button view='default' text="Switch to Metamask"/>
                    </div> */}
                </div>
            </div>
        )
    }, [ethereumWalletContext, isDropdownShow, balance, copyClickCallback, disconnectClickCallback, dropdownStyles, selectedToken])

    const selectedNetwork = useAppSelector(store => store.user.selectedNetwork)

    const walletContent = useMemo(() => {
        if (isEthereumConnected || !isEthereumSelected) {
            return (
                <>
                <div className={CnConnectWallet('left')}>
                    <div className={CnConnectWallet('iconWrapper')}>
                        {connectedWalletIcon}
                        {ethereumWalletContext.address &&  <div className={CnConnectWallet('networkIcon')}>
                            {iconFromNetwork[selectedNetwork]}
                        </div> }
                    </div>
                    <div className={CnConnectWallet('title')}>
                        {
                            ethereumWalletContext.formattedAddress
                        }
                    </div>
                </div>

                <Icons.AngleDown className={CnConnectWallet('opener', { rotate: isDropdownShow })} />
                </>
            )
        }

        return <div className={CnConnectWallet('title')}>Connect wallet</div>
    }, [isEthereumConnected, connectedWalletIcon, ethereumWalletContext.formattedAddress, isDropdownShow, isEthereumSelected, selectedNetwork, ethereumWalletContext.address])
    
    return (
        <div className={CnConnectWallet('wrapper', { selected: isEthereumSelected })}>
            <div onClick={connectWalletClickHandler} className={CnConnectWallet({ connected: isEthereumSelected })}>
                {walletContent}
            </div>
            {dropdownContent}

            {/* <TonConnectButton /> */}
        </div>
    ) 
})