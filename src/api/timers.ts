import axios from 'axios'
import { host } from 'config/host'

export const fetchTimersRequest = async () => {
    return axios.get(host).then(res => res.data.timers)
}