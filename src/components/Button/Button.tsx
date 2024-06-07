import React, { memo } from 'react'
import { cn } from '@bem-react/classname'

import './Button.css'

const CnButton = cn('button')

interface IButtonProps extends React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> {
  text: any;
  view?: 'default' | 'icon';
}

export const Button: React.FC<IButtonProps> = memo(({ text, view = 'default', ...props }) => {
  return (
    <button className={CnButton({ view })} {...props}>{text}</button>
  )
})
