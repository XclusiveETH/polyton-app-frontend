import React, { memo, useEffect, useMemo, } from 'react';
import { cn } from '@bem-react/classname';
import { Chart, Cohorts, Deposit, Header, HotToast, LoaderModal, Market, SaleTimer, Title } from 'components';
import { useNavigate } from 'react-router';
import { fetchApp } from 'store/actions/app';
import { useAppDispatch, useAppSelector } from 'store/store';
import { isTermsAgreed } from 'utils/terms';
import { useAptosWalletContext } from 'utils/useAptosWalletContext';
import { useEthereumWalletContext } from 'utils/useEthereumWalletContext';
import { fetchUser } from 'store/actions/user';
import { Blockhains } from 'types/enums';
import { FetchStatus } from 'types/api';
import { Closed } from 'components/Closed';

import './App.css';

const CnApp = cn('app');

export const App: React.FC = memo(() => {
	const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const aptosWallet = useAptosWalletContext()
    const ethereumWallet = useEthereumWalletContext()
    const selectedBlockchain = useAppSelector(store => store.user.selectedBlockchain)
    const transactionFetchStatus = useAppSelector(store => store.user.transactionFetchStatus)

    useEffect(() => {
        if (selectedBlockchain === Blockhains.Aptos && aptosWallet.address) {
		    dispatch(fetchUser(aptosWallet.address as string ?? ''))
        } else if (selectedBlockchain === Blockhains.Ethereum && ethereumWallet.address){
            dispatch(fetchUser(ethereumWallet.address as string ?? ''))
        }
	}, [ethereumWallet.address, aptosWallet.address, selectedBlockchain])

    useEffect(() => {
        dispatch(fetchApp())
        const poolApp = setInterval(() => {
            dispatch(fetchApp())
        }, 60000)

        return () => {
            clearInterval(poolApp)
        }
    }, [])

    useEffect(() => {
        if (!isTermsAgreed) {
            navigate('?modal=termsModal')
        }
    }, [navigate])

    const loaderContent = useMemo(() => {
        if (transactionFetchStatus === FetchStatus.FETCHING) {
            return (
                <LoaderModal />
            )
        }

        return null
    }, [transactionFetchStatus])

    return (
        <div className={CnApp()}>
            <Header />
            {loaderContent}
            <div className={CnApp('container')}>
                <div className={CnApp('col', { deposit: true })}>
                    <Deposit />
                </div>

                <div className={CnApp('col', { info: true })}>
                    <Chart />
                    <Cohorts />
                    <Market />
                </div>

                {/* <Closed /> */}
            </div>
            
            <HotToast />
        </div>
    );
})
