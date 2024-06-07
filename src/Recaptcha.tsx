import React from 'react'
import { GoogleReCaptchaProvider } from 'react-google-recaptcha-v3'

interface IRecaptchaProps {
    children: React.ReactNode;
}

export const Recaptcha: React.FC<IRecaptchaProps> = ({ children }) => {
    return (
        <GoogleReCaptchaProvider reCaptchaKey='6Ld0_3sjAAAAAPJ3lfwv6KBspl9zRo1E8aJtQzSW'>
            {children}
        </GoogleReCaptchaProvider>
    )
}
