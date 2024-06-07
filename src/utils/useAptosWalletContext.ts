import { AptosWalletContext } from "contexts/AptosWalletProvider";
import { IAptosWalletContext } from "contexts/AptosWalletProvider.types";
import { useContext } from "react";

export const useAptosWalletContext = () => useContext<IAptosWalletContext>(AptosWalletContext);