import axios from 'axios'
import { host } from 'config/host'

export const fetchTokenInfoRequest = async () => {
    return axios.get(host).then(res => ({
        cohorts_info: res.data.cohorts_info,
        market_metrics: res.data.market_metrics
    }))
}