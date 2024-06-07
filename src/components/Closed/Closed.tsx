import { Box } from 'components/Box'
import React from 'react'

import './Closed.css'

export const Closed = () => {
    return (
        <Box>
            <div className="closed">
                <div className={'closed-background'}></div>

                <div className='closed-text'>
                    <b>Polyton IDO is closed!</b>
                    Congrats to everyone who became a part of the cross-chain future!
                </div>
            </div>
        </Box>
    )
}
