import axios from 'axios'
import { host } from 'config/host'

export const fetchAppRequest = async () => {
    return axios.get(`${host}/ido/`).then(res => res.data)
}