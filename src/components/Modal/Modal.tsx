import React, { memo, useCallback, useEffect, useMemo } from 'react'
import { cn } from '@bem-react/classname'

import './Modal.css'
import { Icons } from 'assets'
import { useLocation, useNavigate } from 'react-router'
import { modalTypes } from './Modal.constands'

const CnModal = cn('modal')

const closableModals = ['chooseBlockchain', 'connectEthereumWallet', 'connectAptosWallet', 'allocation', 'diffPriceModal', 'connectWallet', 'transactionSuccess', 'diffAptosPriceModal'];

export const Modal: React.FC = memo(() => {
    const { search } = useLocation();
    const navigate = useNavigate();

    const { isModalShow, content, modalType }: { isModalShow: boolean; content: JSX.Element | null, modalType: string | null } = useMemo(() => {
        const params = new URLSearchParams(search);

        const modalType = params.get('modal');

        const content = modalTypes[String(modalType)] ?? null;

        const isModalShow = Boolean(content);

        return {
            isModalShow,
            content,
            modalType
        };
    }, [search]);
    
    useEffect(() => {
        if (isModalShow) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
    }, [isModalShow])

    const closeModal = useCallback(() => {
        navigate('/')
    }, [navigate])

    const closeModalContent = useMemo(() => {
        if (closableModals.includes(modalType as string)) {
            return (
                <div onClick={closeModal} className={CnModal('close')}><Icons.Close /></div>
            )
        }

        return null
    }, [modalType, closeModal])

    return (
        <div className={CnModal({ show: isModalShow })}>
            <div className={CnModal('content')}>
                {closeModalContent}
                {content}
            </div>
        </div>
    )
})