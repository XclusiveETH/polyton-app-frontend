import { cn } from '@bem-react/classname'
import { Button } from 'components/Button';
import React, { useCallback } from 'react'
import { useNavigate } from 'react-router';

import './TermsModal.css'

const CnTermsModal = cn('termsModal');

export const TermsModal: React.FC = () => {
    const navigate = useNavigate();

    const agreeClickCallback = useCallback(() => {
        localStorage.setItem('terms', 'true')
        navigate('/')
    }, [navigate])

    return (
        <div className={CnTermsModal()}>
            <div className={CnTermsModal('title')}>
                Terms of sale
            </div>
            <div className={CnTermsModal('text')}>
                I agree to the Terms of Sale as detailed here
                <br/>
                <br/>
                I am not a person located in or resident of the United States,
                North Korea, Iran, Venezuela, or any sanctioned countries as
                provided by OFAC
            </div>

            <div className={CnTermsModal('action')}>
                <Button onClick={agreeClickCallback} text='I agree' />
            </div>
        </div>
    )
}
