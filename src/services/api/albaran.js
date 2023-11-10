import { axiosWithToken } from "../utils/axios"
import axios from "axios"

const baseUrl = 'http://localhost:8080/api/albaran'

const getAlbaran = async (id) => {
    const { data } = await axiosWithToken(baseUrl).get(baseUrl + `/get/${id}`)
    return data
}

export default { getAlbaran }
