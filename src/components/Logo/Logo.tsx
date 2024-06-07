import React, { memo } from 'react'
import { cn } from '@bem-react/classname'
import { Icons } from 'assets';

import './Logo.css'

const CnLogo = cn('logo');

export const Logo: React.FC = memo(() => {
    return (
        <div className={CnLogo()}>
            <Icons.Logo />

            Polyton
        </div>
    )
})
