import axios from 'axios'
import { host } from 'config/host'
import { getMyAccountResources } from 'utils/getAptosBalance'
import contract from 'config/ido.json'

export const fetchUserRequest = async (address: string) => {
    return axios.get(`${host}/ido/users`, {
        params: {
            address
        }
    }).then(res => res.data)
}

export const fetchAptosBalanceRequest = async (address: string) => {
    return await getMyAccountResources(address as string).then(response => {
        const aptosTokenData = response.find((item: { type: string }) => item.type.includes(contract.apt.coin))
        return String(Number(aptosTokenData.data.coin.value) / Math.pow(10, contract.apt.decimals))
    }).catch(err => {
        return "0"
    })
}