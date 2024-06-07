import React from 'react'
import Lottie from 'lottie-react';
import { loaderData } from './LoaderModal.constants';
import { cn } from '@bem-react/classname';

import './LoaderModal.css'

const CnLoaderModal = cn('loaderModal')

export const LoaderModal: React.FC = () => {
    return (
        <div className={"modal modal_show"}>
            <div className={"modal-content"}>
                <div className={CnLoaderModal()}>
                    <div className={CnLoaderModal('icon')}>
                        <Lottie 
                            className={CnLoaderModal('animation')} 
                            animationData={loaderData} 
                            loop={true}
                        />
                    </div>
                    <div className={CnLoaderModal('title')}>Transaction in progress</div>
                </div>
            </div>
        </div>
        
    )
}
