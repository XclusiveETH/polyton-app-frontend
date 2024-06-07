import React, { useCallback, useMemo, useState } from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets';
import { useDispatch } from 'react-redux';
import { setSelectedNetwork, setSelectedToken } from 'store/actions/user'

import './Select.css'
import { ethereumNetworks } from 'constants/ethereumNetworks';
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext';
import { Chains, EthereumNetworks, EthereumTokens } from 'types/enums';
import { NetworkItem } from 'components';
import { iconFromNetwork } from 'constants/iconsMaps';
import { useAppSelector } from 'store/store';

const CnSelect = cn('select')

interface ISelectProps {
    items: {
        value: string;
        icon: JSX.Element;
        title: string;
    }[];
    disabled?: boolean;
}

export const Select: React.FC<ISelectProps> = ({ items, disabled = false }) => {
    const [isDropdownShow, setIsDropdownShow] = useState(false)
    const selectedNetwork = useAppSelector(store => store.user.selectedNetwork)

    const isDropdownShowChangeCallback = useCallback(() => {
        setIsDropdownShow(prev => !prev)
    }, [])

    const itemsContent = useMemo(() => {
        return items.map((item) => (
            <div key={item.value} className={CnSelect('item')}>
                <div className={CnSelect('item-icon')}>
                    {item.icon}
                    {!disabled && <div className={CnSelect('networkIcon')}>
                        {iconFromNetwork[selectedNetwork]}
                    </div>}
                </div>
                <div className={CnSelect('item-title')}>
                    {item.title}
                </div>
            </div>
        ))
    }, [selectedNetwork, items, disabled])

    return (
        <div className={CnSelect()}>
            <div onClick={isDropdownShowChangeCallback} className={CnSelect('content')}>
            {
                itemsContent
            }
            </div>

            <div onClick={isDropdownShowChangeCallback} className={CnSelect('angle', { rotate: isDropdownShow })}>
                {
                    !disabled && <Icons.AngleDown />
                }
            </div>

            {
                !disabled && isDropdownShow && <SelectDropdown isDropdownShowChangeCallback={isDropdownShowChangeCallback} />
            }
        </div>
    )
}

const CnSelectDropdown = cn('selectDropdown')

const availableEthereumTokens = [
    {
        icon: <Icons.Usdt />,
        token: EthereumTokens.USDT,
        blockchain: 'Ethereum',
        supportedChains: [Chains.Bsc, Chains.Ethereum, Chains.Polygon, Chains.Arbitrum]

    },
    {
        icon: <Icons.Usdc />,
        token: EthereumTokens.USDC,
        blockchain: 'Ethereum',
        supportedChains: [Chains.Bsc, Chains.Ethereum, Chains.Polygon, Chains.Arbitrum]

    },
    {
        icon: <Icons.Bsc />,
        token: EthereumTokens.BUSD,
        blockchain: 'Bsc',
        supportedChains: [Chains.Bsc]

    }
]

const blockchainFromChainId = {
    [Chains.Bsc]: "Bsc",
    [Chains.Ethereum]: "Ethereum",
    [Chains.Polygon]: "Polygon",
    [Chains.Arbitrum]: 'Arbitrum'
}

const SelectDropdown: React.FC<any> = ({ isDropdownShowChangeCallback }) => {
    const { chainId } = useEthereumWalletContext()

    const tokensContent = useMemo(() => availableEthereumTokens.map((tokenData) => {
        if (chainId && !tokenData.supportedChains.includes(chainId)) {
            return null
        }

        return (
            <TokenItem 
                isDropdownShowChangeCallback={isDropdownShowChangeCallback} 
                key={`${tokenData.blockchain}${tokenData.token}`}
                chainId={chainId}
                {...tokenData}
            />
        )
    }), [isDropdownShowChangeCallback, chainId])

    return (
        <div className={CnSelectDropdown()}>
            <div onClick={isDropdownShowChangeCallback} className={CnSelectDropdown('close')}>
                <Icons.CloseBlack />
            </div>
            <div className={CnSelectDropdown('title')}>
                Select network and token
            </div>

            <div className={CnSelectDropdown('networks')}>
                <div className={CnSelectDropdown('subtitle')}>
                    Network
                </div>

                <div className={CnSelectDropdown('networks-list')}>
                    {
                        ethereumNetworks.map((network) => (
                            <NetworkItem key={network.chainId} {...network} />
                        ))
                    }
                </div>
            </div>

            <div className={CnSelectDropdown('tokens')}>
                <div className={CnSelectDropdown('subtitle')}>
                    Token
                </div>

                <div className={CnSelectDropdown('tokens-list')}>
                    {tokensContent}
                </div>
            </div>
        </div>
    )
}

const CnSelectDropdownTokenItem = cn("selectDropdownTokenItem")

const TokenItem: React.FC<{ icon: any, token: EthereumTokens, blockchain: string, isDropdownShowChangeCallback: any, chainId: any }> = ({ icon, token, isDropdownShowChangeCallback, chainId }) => {
    const dispatch = useDispatch()

    const tokenItemClickCallback = useCallback(() => {
        isDropdownShowChangeCallback()
        dispatch(setSelectedToken(token))
    }, [dispatch, token, isDropdownShowChangeCallback])

    return (
        <div onClick={tokenItemClickCallback} className={CnSelectDropdownTokenItem()}>
            <div className={CnSelectDropdownTokenItem('token')}>
                <div className={CnSelectDropdownTokenItem('icon')}>
                    {icon}
                </div>

                <div className={CnSelectDropdownTokenItem('description')}>
                    <div className={CnSelectDropdownTokenItem('title')}>
                        {token.toUpperCase()}
                    </div>

                    <div className={CnSelectDropdownTokenItem('subtitle')}>
                        on {blockchainFromChainId[chainId as Chains]}
                    </div>
                </div>
            </div>

            <div className={CnSelectDropdownTokenItem('balance')}>
            </div>
        </div>
    )
}