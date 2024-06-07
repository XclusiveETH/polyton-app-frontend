import { Icons } from "assets";
import { Chains, EthereumNetworks } from "types/enums";

export const ethereumNetworks = [
    {
        chainId: Chains.Ethereum,
        name: "Ethereum",
        network: EthereumNetworks.Ethereum,
        icon: <Icons.Ethereum />,
    },
    {
        chainId: Chains.Polygon,
        name: 'Polygon',
        network: EthereumNetworks.Polygon,
        icon: <Icons.Polygon />,
    },
    {
        chainId: Chains.Arbitrum,
        name: "Arbitrum",
        network: EthereumNetworks.Arbitrum,
        icon: <Icons.Arbitrum />,
    },
    {
        chainId: Chains.Bsc,
        name: "Binance Smart Chain",
        network: EthereumNetworks.Bsc,
        icon: <Icons.Bsc />,
    }
]