import axios from 'axios'

const bearerToken = window.localStorage.getItem('tokenLoggedUser')

export const axiosWithToken =  (baseUrl) => {
    let res = axios.create(
        {
            baseURL: baseUrl
        }
    )
    res.defaults.headers.common['Authorization'] = `Bearer ${bearerToken}`;
    return res
}

export const axiosWithTokenWelcome =  (baseUrl,token) => {
    let res = axios.create(
        {
            baseURL: baseUrl
        }
    )
    res.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    return res
}
