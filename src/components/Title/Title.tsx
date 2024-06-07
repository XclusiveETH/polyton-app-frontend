import React, { memo } from 'react'
import { cn } from '@bem-react/classname'

import './Title.css'

const CnTitle = cn('title')

export const Title: React.FC = memo(() => {
  return (
    <div className={CnTitle()}>Innovation start here</div>
  )
})
