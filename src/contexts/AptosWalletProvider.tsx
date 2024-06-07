import React, { createContext, memo, useCallback, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router';
import { fetchAptosBalance, fetchUser, setAptosBuyTransactionData, setTransactionDetails, setTransactionFetchStatus } from 'store/actions/user';
import { useAppDispatch, useAppSelector } from 'store/store';
import { compareNetwork } from 'utils/networkCompare';
import { useWallet, WalletName } from '@mov3r/aptos-wallet-adapter';
import { IAptosWalletContext } from './AptosWalletProvider.types';
import { fetchAptosBuyRequest as fetchBuyRequest } from 'api/buy';
import idoConfig from 'config/ido.json';
import { hexToBytes } from 'utils/hextToBytes';
import toast from 'react-hot-toast';
import { fetchApp } from 'store/actions/app';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3'
import { FetchStatus } from 'types/api';
import { Blockhains } from 'types/enums';

var aptosPoolInterval: null | NodeJS.Timer = null;
var moverAptosPoolInterval: null | NodeJS.Timer = null;

export const AptosWalletContext = createContext<IAptosWalletContext>({
    connect: null,
    address: null,
    disconnect: null,
    network: null,
    formattedAddress: '',
    adapter: null,
    connected: false,
    buy: null,
    signTransaction: null,
});

interface IAptosWalletProviderProps {
    children: React.ReactNode;
}

export const AptosWalletProvider: React.FC<IAptosWalletProviderProps> = memo(({ children }) => {
    const wallet = useWallet()
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const address = useMemo(() => wallet.account?.address as string, [wallet.account])
    const aptosCurrentPrice = useAppSelector((store) => store.info.aptosCurrentPrice)
    const aptosBalance = useAppSelector(store => store.user.aptosBalance);
    const moverPrice = useAppSelector((store) => (store.info.moverPrice as any)?.apt)
    const { executeRecaptcha } = useGoogleReCaptcha()

    const formattedAddress = useMemo(() => {
        if (address) {
            return `${address.slice(0, 9)}...${address.slice(address.length - 4)}`
        }

        return ''
    }, [address])

    const connect = useCallback(async (walletName: WalletName<string>) => {
        await wallet.connect(walletName)
    }, [wallet])

    const disconnect = useCallback(async () => {
       await wallet.disconnect()
    }, [wallet])

    useEffect(() => {
        if (aptosPoolInterval) {
            clearInterval(aptosPoolInterval)
        }
    }, [aptosBalance])

    const moverBalance = useAppSelector(store => store?.user?.user?.mover_balance)

    useEffect(() => {
        if (moverAptosPoolInterval) {
            clearInterval(moverAptosPoolInterval)
            setTimeout(() => {
                dispatch(fetchApp())
            }, 1000)
        }
    }, [moverBalance])

    const poolAptosBalance = useCallback(() => {
        if (aptosPoolInterval) {
            clearInterval(aptosPoolInterval)
        }

        if (moverAptosPoolInterval) {
            clearInterval(moverAptosPoolInterval)
        }

        let iApt = 0

        aptosPoolInterval = setInterval(() => {
            dispatch(fetchAptosBalance(address))

            if (iApt === 10) {
                clearInterval(aptosPoolInterval as NodeJS.Timer)
            }

            iApt = iApt + 1
        }, 3000)

        let iMov = 0

        moverAptosPoolInterval = setInterval(() => {
            dispatch(fetchUser(address))

            if (iMov === 10) {
                clearInterval(moverAptosPoolInterval as NodeJS.Timer)
            }

            iMov = iMov + 1
        }, 3000)
    }, [dispatch, address])

    const signTransaction = useCallback(async (payload: any, isFromModal = false) => {
        await wallet.signAndSubmitTransaction(payload)

        if (isFromModal) {
            poolAptosBalance()
            navigate("?modal=transactionSuccess")
        }
    }, [wallet, navigate, poolAptosBalance])

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
                valid_price,
                price_acceptable
            } = await fetchBuyRequest({
                wallet: address,
                amount,
                apt_mover_last: moverPrice,
                usd_apt_last: aptosCurrentPrice,
                captcha: token
            })

            const payload = {
                function: idoConfig.apt.functName,
                type_arguments: [],
                arguments: [
                    amount_in,
                    amount_out,
                    cohort,
                    price,
                    valid_before,
                    nonce,
                    hexToBytes(signature)
                ],
                type: "entry_function_payload"
            } as any;

            dispatch(setTransactionDetails({ moverCount: tokensCount }))

            if (price_acceptable) {
                await signTransaction(payload)
                navigate("?modal=transactionSuccess")
                poolAptosBalance()
            } else {
                dispatch(setAptosBuyTransactionData({
                    signData: payload,
                    valid_price,
                }))
                navigate("?modal=diffAptosPriceModal")
            }
        } catch (err: any) {
            if (typeof err === 'string' && err.includes('Rejected')) {
				toast('Transaction rejected')
			} else if (err.code === 1002) {
				toast('Transaction rejected')
			} else if (err.code === 4001) {
				toast('Transaction rejected')
			} else if (wallet?.wallet?.adapter?.name === 'Martian' && String(err).includes('failure')) {
				toast.error("Martian can't connect, please try again")
			} else {
				toast.error('Transaction failed')
			}

            throw JSON.stringify(err);
        } finally {
            dispatch(setTransactionFetchStatus(FetchStatus.FETCHED))
        }
    }, [dispatch, aptosCurrentPrice, address, moverPrice, wallet, poolAptosBalance, navigate, executeRecaptcha, signTransaction])

    useEffect(() => {
        if (address) {
            dispatch(fetchAptosBalance(address))
        }
    }, [dispatch, address])

    const selectedNetwork = useAppSelector(store => store.user.selectedBlockchain)

    useEffect(() => {
        if (wallet?.network?.chainId && selectedNetwork === Blockhains.Aptos) {
            const isNeededNetwork = compareNetwork(wallet.network.chainId)

            if (!isNeededNetwork) {
                navigate('?modal=changeNetwork')
            }
        }
    }, [wallet.network, navigate, selectedNetwork])

    return (
        <AptosWalletContext.Provider value={{
            connect,
            address,
            disconnect,
            network: wallet.network,
            formattedAddress,
            adapter: wallet.wallet?.adapter,
            connected: wallet.connected,
            buy,
            signTransaction
        }}>
            {children}
        </AptosWalletContext.Provider>
    )
})