import axios from "axios";

export const MAINNET_NODE_URL = 'https://fullnode.testnet.aptoslabs.com/v1';

export const getMyAccountResources = async (address: string) => {
  return await axios.get(`${MAINNET_NODE_URL}/accounts/${address}/resources`).then(response => response.data)
}
