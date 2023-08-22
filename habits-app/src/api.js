import axios from 'axios'

const api = axios.create({
    baseURL: 'https://www.leoapi.xyz',
});

export default api