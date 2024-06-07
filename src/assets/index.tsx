import { ReactComponent as LogoFullIcon } from './logo.svg';
import { ReactComponent as LogoIcon } from './logo-icon.svg';
import { ReactComponent as AptosIcon } from './aptos.svg';
import { ReactComponent as LogoutIcon } from './logout.svg';
import { ReactComponent as PlusIcon } from './plus.svg';
import { ReactComponent as AngleDownIcon } from './angle-down.svg';
import { ReactComponent as AngleRightIcon } from './angle-right.svg';
import { ReactComponent as MoverIcon } from './mover.svg';
import { ReactComponent as CloseIcon } from './close.svg';
import { ReactComponent as FewchaIcon } from './fewcha.svg';
import { ReactComponent as MartianIcon } from './martian.svg';
import { ReactComponent as MartianAltIcon } from './martian-alt.svg';
import { ReactComponent as NightlyIcon } from './nightly.svg';
import { ReactComponent as PontemIcon } from './pontem.svg';
import { ReactComponent as RiseIcon } from './rise.svg';
import { ReactComponent as InfoIcon } from './info.svg';
import { ReactComponent as CopyIcon } from './copy.svg';
import { ReactComponent as TurnOffIcon } from './turn-off.svg';
import { ReactComponent as ChartDotIcon } from './chart-dot.svg';
import { ReactComponent as WarningIcon } from './warning.svg';
import { ReactComponent as ErrorIcon } from './error.svg';
import { ReactComponent as CheckIcon } from './check.svg';
import { ReactComponent as CloseBlackIcon } from './close-black.svg';
import { ReactComponent as MetamaskIcon } from './metamask.svg';
import { ReactComponent as CoinbaseIcon } from './coinbase.svg';
import { ReactComponent as EthereumIcon } from './ethereum.svg';

import { ReactComponent as UsdcTokenIcon } from './tokens/usdc.svg';
import { ReactComponent as UsdtTokenIcon } from './tokens/usdt.svg';

import { ReactComponent as ActiveCohortIcon } from './active-cohort.svg';

import { ReactComponent as PolygonIcon } from './networks/polygon.svg';
import { ReactComponent as BscIcon } from './networks/bsc.svg';
import { ReactComponent as ZkSyncIcon } from './networks/zksync.svg';

import { ReactComponent as SuccessIcon } from './success.svg';

import { ReactComponent as AccessTextIcon } from './have-access.svg';


import petraImage from './petra.png';
import arbitrumImage from './networks/arbitrum.png';

const PetraIcon = () => {
    return (
        <img alt="Arbitrum" src={petraImage} />
    )
}

const ArbitrumIcon = () => {
    return (
        <img alt="Arbitrum" src={arbitrumImage} />
    )
}

export const Icons = {
    LogoFull: LogoFullIcon,
    Logo: LogoIcon,
    Aptos: AptosIcon,
    Logout: LogoutIcon,
    Plus: PlusIcon,
    AngleDown: AngleDownIcon,
    Polyton: MoverIcon,
    Close: CloseIcon,
    Fewcha: FewchaIcon,
    Martian: MartianIcon,
    Nightly: NightlyIcon,
    Pontem: PontemIcon,
    Rise: RiseIcon,
    Info: InfoIcon,
    Copy: CopyIcon,
    TurnOff: TurnOffIcon,
    MartianAlt: MartianAltIcon,
    AngleRight: AngleRightIcon,
    ChartDot: ChartDotIcon,
    CloseBlack: CloseBlackIcon,
    Warning: WarningIcon,
    Check: CheckIcon,
    Error: ErrorIcon,
    Metamask: MetamaskIcon,
    Coinbase: CoinbaseIcon,
    Ethereum: EthereumIcon,
    Usdt: UsdtTokenIcon,
    Usdc: UsdcTokenIcon,
    ActiveCohort: ActiveCohortIcon,
    Polygon: PolygonIcon,
    Bsc: BscIcon,
    ZkSync: ZkSyncIcon,
    Arbitrum: ArbitrumIcon,
    Petra: PetraIcon,
    Success: SuccessIcon,
    AccessText: AccessTextIcon
}