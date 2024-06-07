

export const convertFromAptosToMover = (tokensCount: number, moverPrice: number) => moverPrice && tokensCount ? (tokensCount / moverPrice).toFixed(8) : ''