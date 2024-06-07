import { Icons } from "assets";
import { EthereumNetworks } from "types/enums";

export const iconFromNetwork = {
    [EthereumNetworks.Bsc]: <Icons.Bsc />,
    [EthereumNetworks.Arbitrum]: <Icons.Arbitrum />,
    [EthereumNetworks.Ethereum]: <Icons.Ethereum />,
    [EthereumNetworks.Polygon]: <Icons.Polygon />,
}