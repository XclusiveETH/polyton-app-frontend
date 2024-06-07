import React, { useCallback, useMemo } from 'react'
import { cn } from '@bem-react/classname';

import './Tooltip.css'

const CnTooltip = cn('tooltip')

interface ITooltipProps {
    title: string;
    value: number;
    onClick?: (value: number) => void;
    isSelected?: boolean;
    dropdown?: string;
}

export const Tooltip: React.FC<ITooltipProps> = ({ title, onClick, value, isSelected = false, dropdown = '' }) => {

    const clickCallback = useCallback(() => {
        if (onClick) {
          onClick(value)
        }
    }, [value, onClick])

    const dropdownContent = useMemo(() => {
        if (dropdown) {
            return <div className={CnTooltip('dropdown')}>
                {
                    dropdown
                }
            </div>
        }

        return null;
    }, [dropdown])

    return (
        <div className={CnTooltip({ selected: isSelected })} onClick={clickCallback}>
            {dropdownContent}
            {title}
        </div>
    )
}
