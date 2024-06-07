import React from 'react'
import { ChangeNetworkModal } from 'components/ChangeNetworkModal';
import { ConnectAptosWalletModal } from 'components/ConnectAptosWalletModal';
import { TermsModal } from 'components/TermsModal';
import { ConnectEthereumWalletModal } from 'components/ConnectEthereumWalletModal';
import { ChooseBlockchainModal } from 'components/ChooseBlockchainModal';
import { AllocationModal } from 'components/AllocationModal';
import { ChangeEvmNetworkModal } from 'components/ChangeEvmNetworkModal';
import { DiffPriceModal } from 'components/DiffPriceModal/DiffPriceModal';
import { ConnectWalletModal } from 'components/ConnectWalletModal';
import { SuccessfullyModal } from 'components/SuccessfullyModal';
import { DiffAptosPriceModal } from 'components/DiffAptosPriceModal';

export const modalTypes: Record<string, JSX.Element> = {
    'connectAptosWallet': <ConnectAptosWalletModal />,
    'connectEthereumWallet': <ConnectEthereumWalletModal />,
    'changeNetwork': <ChangeNetworkModal />,
    'termsModal': <TermsModal />,
    'chooseBlockchain': <ChooseBlockchainModal />,
    'allocation': <AllocationModal />,
    'changeEvmNetwork': <ChangeEvmNetworkModal />,
    'diffPriceModal': <DiffPriceModal />,
    'connectWallet': <ConnectWalletModal />,
    'transactionSuccess': <SuccessfullyModal />,
    'diffAptosPriceModal': <DiffAptosPriceModal />
}
