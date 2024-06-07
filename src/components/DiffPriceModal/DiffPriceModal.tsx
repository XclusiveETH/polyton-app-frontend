import React, { useCallback } from 'react'
import { cn } from '@bem-react/classname'
import { useAppDispatch, useAppSelector } from 'store/store'
import { Button } from 'components/Button'

import './DiffPriceModal.css'
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext'
import { setTransactionDetails, setTransactionFetchStatus } from 'store/actions/user'
import { FetchStatus } from 'types/api'
import toast from 'react-hot-toast'

const CnDiffPriceModal = cn('diffPriceModal')

export const DiffPriceModal: React.FC = () => {
    const dispatch = useAppDispatch()
    const selectedToken = useAppSelector(store => store.user.selectedToken)
    const transactionData = useAppSelector(store => store.user.buyTransactionData)
    const { writeBuyContract } = useEthereumWalletContext()

    const buttonClickCallback = useCallback(
        async () => {
            try {
                dispatch(setTransactionFetchStatus(FetchStatus.FETCHING))
                const {
                    amount_in,
                    amount_out,
                    cohort,
                    price,
                    valid_before,
                    nonce,
                    signature,
                    address,
                    configAddress,
                } = transactionData;

                const payload = [
                    address,
                    configAddress,
                    amount_in,
                    amount_out,
                    cohort,
                    price,
                    valid_before,
                    nonce,
                    ...signature
                ]

                if (writeBuyContract) {
                    await writeBuyContract(payload, true)
                }
            } catch (err) {
                toast.error('Transaction failed')
            } finally {
                dispatch(setTransactionFetchStatus(FetchStatus.FETCHED))
            }
        },
        [writeBuyContract, transactionData, dispatch],
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
