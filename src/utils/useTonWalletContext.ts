import { TonWalletContext } from "contexts/TonWalletProvider";
import { ITonWalletContext } from "contexts/TonWalletProvider.types";
import { useContext } from "react";

export const useTonWalletContext = () => useContext<ITonWalletContext>(TonWalletContext);