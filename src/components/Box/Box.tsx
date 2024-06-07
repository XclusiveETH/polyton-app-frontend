import React from 'react'
import { cn } from '@bem-react/classname'

import './Box.css'

const CnBox = cn('box')

interface IBoxProps {
    title?: string;
    children?: React.ReactNode;
}

export const Box: React.FC<IBoxProps> = ({ children, title }) => {
    return (
        <div className={CnBox()}>
            {
                title && 
                <div className={CnBox('header')}>
                    {title}
                </div>
            }

            <div className={CnBox('content')}>
                {children}
            </div>
        </div>
    )
}
