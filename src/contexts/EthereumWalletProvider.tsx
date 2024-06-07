import React, { useCallback, useEffect, useMemo } from 'react'

import {
    createClient,
    configureChains,
    useAccount,
    WagmiConfig,
    useConnect,
    Connector,
    useBalance,
    useDisconnect,
    useContractWrite,
    useContractRead,
    useSwitchNetwork,
    useNetwork,
    Chain
} from 'wagmi'

import { bscTestnet, polygonMumbai, goerli, arbitrumGoerli } from 'wagmi/chains'

import { infuraProvider } from 'wagmi/providers/infura'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'

import { IEthereumWalletContext } from './EthereumWalletProvider.types'
import { useNavigate } from 'react-router'

import idoConfig from 'config/ido.json'
import { fetchUser, setApprovedTokens, setEthereumBalance, setEthereumBuyTransactionData, setSelectedBlockchain, setSelectedNetwork, setTransactionDetails, setTransactionFetchStatus } from 'store/actions/user'
import { useAppDispatch, useAppSelector } from 'store/store'
import { fetchEthereumBuyRequest as fetchBuyRequest } from 'api/buy'
import { Allowance, AptosTokens, Blockhains, Chains, EthereumNetworks } from 'types/enums'
import { supportedNetworks } from 'constants/supportedNetworks'
import toast from 'react-hot-toast'
import { fetchApp } from 'store/actions/app'
import { FetchStatus } from 'types/api'
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { BigNumber } from 'ethers'

var ethereumPoolInterval: null | NodeJS.Timer = null;
var moverEthereumPoolInterval: null | NodeJS.Timer = null;

export const EthereumWalletContext = React.createContext<IEthereumWalletContext>({
    address: null,
    connectors: [],
    connect: null,
    connector: null,
    formattedAddress: '',
    connected: false,
    disconnect: null,
    buy: null,
    approveToken: null,
    switchNetwork: null,
    chainId: null,
    writeBuyContract: null,
})

const { chains, provider, webSocketProvider } = configureChains([bscTestnet, polygonMumbai, goerli, arbitrumGoerli], [
    jsonRpcProvider({
        rpc: (chain: Chain) => {
            if (chain.id === Chains.Bsc) {
                return {
                    http: "https://bsc-testnet.public.blastapi.io"
                }
            }
            
            return null;
        }
    }),
    infuraProvider({
        apiKey: 'b9328e69231b48d695ae7912c2704d38'
    }),
])

export const ethereumClient = createClient({
    autoConnect: true,
    connectors: [
        new MetaMaskConnector({ chains }),
        new CoinbaseWalletConnector({
            chains,
            options: {
                appName: 'mov3r',
            },
        })
    ],
    provider,
    webSocketProvider,
})

const calcIsTokenAllowed = (num: any): boolean => {
    const allowance = BigNumber.from(num).toBigInt()
    const zero = BigNumber.from(0).toBigInt()

    return allowance > zero
}

const networkFromChainId = {
    [Chains.Bsc]: 'bsc',
    [Chains.Ethereum]: 'ethereum',
    [Chains.Polygon]: 'polygon',
    [Chains.Arbitrum]: 'arbitrum'
}

const backendChainFromId = {
    [Chains.Polygon]: 'polygon',
    [Chains.Arbitrum]: 'arbitrum',
    [Chains.Ethereum]: 'eth',
    [Chains.Bsc]: 'bsc'
}

interface IEthereumWalletProvider {
    children: React.ReactNode;
}

const EthereumWalletProviderContext: React.FC<IEthereumWalletProvider> = ({ children }) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const account = useAccount()
    const { switchNetworkAsync } = useSwitchNetwork()
    const { chain } = useNetwork()
    const {connectAsync, connectors} = useConnect()
    const {disconnectAsync} = useDisconnect()
    const address = useMemo(() => account.address, [account.address]) as string
    const chainId = useMemo(() => chain ? chain.id : null, [chain])
    const selectedToken = useAppSelector(store => store.user.selectedToken)
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain)
    const selectedNetwork = useAppSelector(store => store.user.selectedNetwork)
    const currConfig = useMemo(() => selectedBlockchain === Blockhains.Ethereum && supportedNetworks.includes(chainId as Chains) ? (idoConfig as any)[selectedNetwork][selectedToken] : null, [selectedNetwork, selectedToken, selectedBlockchain, chainId])
    const moverPriceMap = useAppSelector((store) => store.info.moverPrice)
    const { executeRecaptcha } = useGoogleReCaptcha()

    const moverPrice = useMemo(() => {
        if (!moverPriceMap) {
            return 0
        }

        return Number(moverPriceMap[selectedToken])
    }, [selectedToken, moverPriceMap])

    const formattedAddress = useMemo(() => {
        if (address) {
            return `${address.slice(0, 9)}...${address.slice(address.length - 4)}`
        }

        return ''
    }, [address])

    const approveContract = useContractWrite({
		abi: currConfig?.abi,
		address: currConfig?.address,
		mode: 'recklesslyUnprepared',
		functionName: 'approve'
	})

    const approveToken = useCallback(async () => {
        try {
            if (approveContract.writeAsync) {
                dispatch(setTransactionFetchStatus(FetchStatus.FETCHING))
                const contractResult = await approveContract.writeAsync
                    ({
                        recklesslySetUnpreparedArgs: [
                            currConfig?.contract,
                            '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
                            {from: address}
                        ]
                    })
                const waitedApproveResponse = await contractResult.wait()
                
                const allowance = waitedApproveResponse.logs.pop() as any
                
                const isAllowed = calcIsTokenAllowed(allowance.data)

                dispatch(setApprovedTokens({
                    [`${address}${selectedToken}${selectedNetwork}`]: isAllowed ? Allowance.Allowed : Allowance.NotAllowed
                }))
            }
        } catch {
            toast.error('Approve failed')
        } finally {
            dispatch(setTransactionFetchStatus(FetchStatus.FETCHED))
        }
    }, [address, dispatch, currConfig, selectedToken, approveContract, selectedNetwork])

    const checkTokenAllowance = useContractRead({
		abi: currConfig?.abi,
		address: currConfig?.address,
		functionName: 'allowance',
		args: [address, currConfig?.contract],
		enabled: false,
	})

    const approvedTokens = useAppSelector(store => store.user.approvedTokens)

    const fetchAllowance = useCallback(async (ethWallet: any) => {
		if (!ethWallet) return;
        await checkTokenAllowance.refetch().then(response => {
            const isAllowed = Number(response.data) > 0;
            if (!approvedTokens[`${address}${selectedToken}${selectedNetwork}`]) {
                dispatch(setApprovedTokens({
                    [selectedToken]: isAllowed ? Allowance.Allowed : Allowance.NotAllowed
                }))
            }
        })
	}, [approvedTokens, selectedToken, checkTokenAllowance, dispatch])

    useEffect(() => {
        if (address && selectedBlockchain === Blockhains.Ethereum && selectedToken !== AptosTokens.Apt) {
            if (!approvedTokens[`${address}${selectedToken}${selectedNetwork}`]) {
                checkTokenAllowance.refetch()
            }
        }
    }, [address, selectedNetwork, selectedToken])

    useEffect(() => {
        if (checkTokenAllowance.fetchStatus === 'idle' && !approvedTokens[`${address}${selectedToken}${selectedNetwork}`]) {
            const isAllowed = checkTokenAllowance.data ? calcIsTokenAllowed((checkTokenAllowance.data as any)?._hex) : false;
            dispatch(setApprovedTokens({
                [`${address}${selectedToken}${selectedNetwork}`]: isAllowed ? Allowance.Allowed : Allowance.NotAllowed
            }))
        }
    }, [checkTokenAllowance])

    useEffect(() => {
        if (chainId) {
            if (supportedNetworks.includes(chainId) && selectedNetwork !== networkFromChainId[chainId as Chains]) {
                dispatch(setSelectedNetwork(networkFromChainId[chainId as Chains] as EthereumNetworks))
            }
        }
    }, [chainId])

    const balance = useBalance({
        address: address as `0x${string}`,
        chainId: currConfig?.chainId,
        token: currConfig?.address ?? undefined
    })

    const poolAptosBalance = useCallback(() => {
        if (ethereumPoolInterval) {
            clearInterval(ethereumPoolInterval)
        }

        if (moverEthereumPoolInterval) {
            clearInterval(moverEthereumPoolInterval)
        }

        let iEth = 0;
        let iMov = 0;


        ethereumPoolInterval = setInterval(async () => {
            await balance.refetch().then((balance) => {
                if (balance.status === 'success') {
                    dispatch(setEthereumBalance({
                        token: selectedToken as string,
                        balance: balance.data?.formatted as string
                    }))
                }
        
                if (!balance.data) {
                    dispatch(setEthereumBalance({
                        token: selectedToken as string,
                        balance: '0.00'
                    }))
                }
            })
            
            if (iEth === 10) {
                if (ethereumPoolInterval) {
                    clearInterval(ethereumPoolInterval)
                }
            }

            iEth = iEth + 1;
        }, 3000)

        moverEthereumPoolInterval = setInterval(async () => {
            dispatch(fetchUser(address))

            if (iMov === 10) {
                if (ethereumPoolInterval) {
                    clearInterval(ethereumPoolInterval)
                }
            }

            iMov = iMov + 1;
        }, 3000)
    }, [selectedToken, address, balance])

    const ethereumBalance = useAppSelector(store => store.user.ethereumBalance)

    useEffect(() => {
        if (ethereumPoolInterval) {
            clearInterval(ethereumPoolInterval)
        }
    }, [ethereumBalance])

    const moverBalance = useAppSelector(store => store?.user?.user?.mover_balance)

    useEffect(() => {
        if (moverEthereumPoolInterval) {
            clearInterval(moverEthereumPoolInterval)

            setTimeout(() => {
                dispatch(fetchApp())
            }, 1000)
        }
    }, [moverBalance])

    useEffect(() => {
        try {
            if (balance.status === 'success' && balance.fetchStatus === 'idle') {
                dispatch(setEthereumBalance({
                    token: selectedToken as string,
                    balance: balance.data?.formatted as string
                }))
            }
    
            if (!balance.data) {
                dispatch(setEthereumBalance({
                    token: selectedToken as string,
                    balance: '0.00'
                }))
            }
        } catch (err) {}
    }, [balance, selectedToken, selectedNetwork, address])

    useEffect(() => {
        if (selectedBlockchain === Blockhains.Ethereum && chainId && !supportedNetworks.includes(chainId)) {
            navigate('?modal=changeEvmNetwork')
        }
    }, [selectedBlockchain, chainId])

    const buyContract = useContractWrite({
		address: currConfig?.contract,
        abi: currConfig?.buyAbi,
		functionName: 'buy',
		mode: 'recklesslyUnprepared',
	})

    const writeBuyContract = useCallback(async (payload: any, isFromModal = false) => {
        if (buyContract.writeAsync) {
            await buyContract.writeAsync({
                recklesslySetUnpreparedArgs: payload,
            })

            if (isFromModal) {
                poolAptosBalance()
                navigate("?modal=transactionSuccess")
            }
        }
    }, [buyContract, navigate, poolAptosBalance])

    const buy = useCallback(async (amount: number, tokensCount: number) => {
        try {
            let token: string = ''
            if (executeRecaptcha) {
                token = await executeRecaptcha('buyAction')
            }

            dispatch(setTransactionFetchStatus(FetchStatus.FETCHING))

            const {
                amount_in,
                amount_out,
                cohort,
                price,
                valid_before,
                nonce,
                signature,
                price_acceptable,
                valid_price
            } = await fetchBuyRequest({
                wallet: address,
                amount,
                usd_mover_last: moverPrice,
                chain: backendChainFromId[chainId as Chains],
                currency_token: currConfig?.address,
                captcha: token
            })

            dispatch(setEthereumBuyTransactionData({
                amount_in,
                amount_out,
                cohort,
                price,
                valid_before,
                nonce,
                signature,
                price_acceptable,
                valid_price,
                address,
                configAddress: currConfig.address,
                tokensCount
            }))

            dispatch(setTransactionDetails({ moverCount: tokensCount }))

            if (price_acceptable) {
                const payload = [
                    address,
                    currConfig?.address,
                    amount_in,
                    amount_out,
                    cohort,
                    price,
                    valid_before,
                    nonce,
                    ...signature
                ]

                await writeBuyContract(payload)
    
                poolAptosBalance()
                navigate("?modal=transactionSuccess")
            } else {
                navigate("?modal=diffPriceModal")
            }
        } catch (err) {
            toast.error('Transaction failed')
            throw err;
        } finally {
            dispatch(setTransactionFetchStatus(FetchStatus.FETCHED))
        }
    }, [address, moverPrice, currConfig?.address, chainId, poolAptosBalance, dispatch, navigate, writeBuyContract, executeRecaptcha])
    
    const switchNetwork = useCallback(async (chainId: number) => {
        if (switchNetworkAsync) {
            await switchNetworkAsync(chainId)
        }
    }, [switchNetworkAsync])

    const connect = useCallback(async (connector: Connector) => {
        try {
            await connectAsync({connector});
            window.localStorage.setItem("blockchain", Blockhains.Ethereum)
            dispatch(setSelectedBlockchain(Blockhains.Ethereum))
            navigate('/')
        } catch (err: any) {
            if (err?.name && err?.name?.includes('ConnectorNotFoundError')) {
                window.open("https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn", "_blank")
            }
        }
    }, [dispatch, navigate, connectAsync])

    const disconnect = useCallback(async () => {
        await disconnectAsync();
        navigate('/')
    }, [navigate, disconnectAsync])
    
    return (
        <EthereumWalletContext.Provider value={{
            address,
            connectors,
            connect,
            connector: account.connector as Connector<any, any, any>,
            formattedAddress,
            connected: account.isConnected,
            disconnect,
            buy,
            approveToken,
            switchNetwork,
            chainId,
            writeBuyContract
        }}>
            {children}
        </EthereumWalletContext.Provider>
    )
}

export const EthereumWalletProvider: React.FC<IEthereumWalletProvider> = ({ children }) => {
    return (
        <WagmiConfig client={ethereumClient}>
            <EthereumWalletProviderContext>
                {children}
            </EthereumWalletProviderContext>
        </WagmiConfig>
    )
}