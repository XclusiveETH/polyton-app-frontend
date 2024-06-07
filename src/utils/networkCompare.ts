export const neededNetwork = "testnet";

const networksMap: Record<string, string> = {
    '2': 'testnet',
    '1': 'mainnet',
    '35': 'devnet',
}

export const compareNetwork = (currNetwork: string) => networksMap[currNetwork] === neededNetwork;