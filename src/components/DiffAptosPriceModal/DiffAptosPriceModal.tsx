import React, { useCallback } from 'react'
import { cn } from '@bem-react/classname'
import { useAppDispatch, useAppSelector } from 'store/store'
import { Button } from 'components/Button'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { setTransactionDetails, setTransactionFetchStatus } from 'store/actions/user'
import { FetchStatus } from 'types/api'
import toast from 'react-hot-toast'
import { useAptosWalletContext } from 'utils/useAptosWalletContext'

import './DiffAptosPriceModal.css'

const CnDiffPriceModal = cn('diffPriceModal')

export const DiffPriceModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const selectedToken = useAppSelector(store => store.user.selectedToken)
    const transactionData = useAppSelector(store => store.user.aptosBuyTransactionData)
    const { signTransaction, adapter } = useAptosWalletContext()

    const buttonClickCallback = useCallback(
        async () => {
            try {
                dispatch(setTransactionFetchStatus(FetchStatus.FETCHING))
                
                if (signTransaction) {
                    await signTransaction(transactionData.signData, true)
                }
            } catch (err: any) {
                if (typeof err === 'string' && err.includes('Rejected')) {
                    toast('Transaction rejected')
                } else if (err.code === 1002) {
                    toast('Transaction rejected')
                } else if (err.code === 4001) {
                    toast('Transaction rejected')
                } else if (adapter?.name === 'Martian' && String(err).includes('failure')) {
                    toast.error("Martian can't connect, please try again")
                } else {
                    toast.error('Transaction failed')
                }
            } finally {
                dispatch(setTransactionFetchStatus(FetchStatus.FETCHED))
            }
        },
        [signTransaction, transactionData, dispatch, adapter],
    )

    return (
        <div className={CnDiffPriceModal()}>
            <div className={CnDiffPriceModal('title')}>
                Price has changed
            </div>

            <div className={CnDiffPriceModal('text')}>
                New $POLYTON price is <b>{transactionData?.valid_price && transactionData.valid_price[selectedToken].toString().slice(0, 7)} {selectedToken.toUpperCase()}</b>
                <br/>
                Continue? 
            </div>

            <div className={CnDiffPriceModal('action')}>
                <Button onClick={buttonClickCallback} text="Buy" view="default" />
            </div>
        </div>
    )
}
