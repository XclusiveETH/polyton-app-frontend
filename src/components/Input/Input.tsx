import React, { memo, useMemo } from 'react'
import { cn } from '@bem-react/classname'

import './Input.css'

const CnInput = cn('input')

interface IInputProps extends React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
    leftContent?: JSX.Element;
    tooltips?: JSX.Element[];
    token?: string;
    isInvalid?: boolean;
}

export const Input: React.FC<IInputProps> = memo(({ leftContent = null, token = null, tooltips = [], isInvalid, ...props}) => {

    const tooltipsContnet = useMemo(() => {
        if (tooltips.length) {
            return (
                <div className={CnInput('tooltips')}>
                    {
                        tooltips.map((tooltip, index) => <React.Fragment key={index}>{tooltip}</React.Fragment>)
                    }
                </div>
            )
        } else {
            return null;
        }
    }, [tooltips])

    return (
        <div className={CnInput()}>
            {
                leftContent && <div className={CnInput('left')}>{leftContent}</div>
            }
            <div className={CnInput('content')}>
                {tooltipsContnet}
                <div className={CnInput('right')}>
                    <input className={CnInput('field', { error: isInvalid })} {...props} />
                    { 
                        token && 
                        <div className={CnInput('token')}>
                            {token}
                        </div>
                    }
                </div>
            </div>
        </div>
    )
})
