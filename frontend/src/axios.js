import axios from 'axios'

const API_ROOT = "https://54.64.18.97"

const instance = axios.create({
    baseURL: API_ROOT,
})

export default instance;