import { Icons } from 'assets';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { toast, Toaster, ToastBar } from 'react-hot-toast';

import './HotToast.css'

const toastStyles = {
	background: '#232530',
	color: '#fff',
	border: '1px solid #2F343E',
	borderRadius: '10px',
	padding: '15px',
}

const HotToastIcon: React.FC<{ type: string }> = memo((props) => {
	switch (props.type) {
		case 'success':
			return <Icons.Check />
		case 'error':
			return <Icons.Error />
		default:
			return <Icons.Warning />
	}
})

export const HotToast: React.FC = memo(() => {
	const isMobile = useMemo(() => window.screen.width <= 500, [])
	const [isHeaderScrolled, setHeaderScrolled] = useState<boolean>(false)
	
	const handleScroll = useCallback(() => {
		setHeaderScrolled(window.scrollY > 40)
	}, [])

	useEffect(() => {
		window.addEventListener('scroll', handleScroll)

		return () => window.removeEventListener('scroll', handleScroll)
	}, [handleScroll]);

	return (
		<Toaster
			containerClassName="HotToast"
			containerStyle={{ top: isHeaderScrolled ? 6 : 94, right: 24, bottom: 109 }}
			toastOptions={{
				position: isMobile ? "bottom-center" : "top-right",
				style: {
					...toastStyles,
					minWidth: isMobile ? '100%' : 260
				},
			}}
		>
			{(t) => (
				<ToastBar toast={t}>
					{({ message }) => (
						<div className="content">
							<HotToastIcon type={t.type} />
							{message}
							{t.type !== 'loading' && (
								<div className="close" style={{cursor: 'pointer'}} onClick={() => toast.dismiss(t.id)}>
									<Icons.CloseBlack />
								</div>
							)}
						</div>
					)}
				</ToastBar>
			)}
		</Toaster>
	)
})