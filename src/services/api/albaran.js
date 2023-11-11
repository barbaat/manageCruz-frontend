import { axiosWithToken } from "../utils/axios"

const baseUrl = 'http://localhost:8080/api/albaran'

const getAlbaran = async (id) => {
    const { data } = await axiosWithToken(baseUrl).get(baseUrl + `/get/${id}`)
    return data
}

const getAllAlbaran = async () => {
    const { data } = await axiosWithToken(baseUrl).get(baseUrl + `/get-all`)
    return data
}


export default { getAlbaran, getAllAlbaran }
