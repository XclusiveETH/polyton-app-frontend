import { EthereumWalletContext } from "contexts/EthereumWalletProvider";
import { IEthereumWalletContext } from "contexts/EthereumWalletProvider.types";
import { useContext } from "react";

export const useEthereumWalletContext = () => useContext<IEthereumWalletContext>(EthereumWalletContext);