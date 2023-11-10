import { axiosWithToken } from "../utils/axios"
import axios from "axios"

const baseUrl = 'http://localhost:8080/api/users'

const newUser = async user => {
  const { data } = await axiosWithToken(baseUrl).post(baseUrl + "/new", user)
  return data
}

const getUser = async (username) => {
  const { data } = await axiosWithToken(baseUrl).get(baseUrl + `/get/${username}`)
  return data
}

const getUserLogeado = async () => {
  try {
    const tokenData = localStorage.getItem('tokenLoggedUser');
    const token = tokenData;

    const config = {
      headers: { Authorization: `Bearer ${token}` }
    };

    const response = await axios.get(baseUrl + "/logged", config);

    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const cities = async () => {
  const { data } = await axiosWithToken(baseUrl).get(baseUrl + "/cities")
  return data
}

const roles = async () => {
  const { data } = await axiosWithToken(baseUrl).get(baseUrl + "/roles")
  return data
}

const gender = async () => {
  const { data } = await axiosWithToken(baseUrl).get(baseUrl + "/gender")
  return data
}

const allUsers = async () => {
  const { data } = await axiosWithToken(baseUrl).get(baseUrl + "/get-all")
  return data
}

const deleteUser = async (id) => {
  const { data } = await axiosWithToken(baseUrl).delete(baseUrl + `/delete/${id}`)
  return data
}

const updateUser = async (id, user) => {
  const { data } = await axiosWithToken(baseUrl).put(baseUrl + `/edit/${id}`, user)
  return data
}

export default { newUser, cities, roles, gender, allUsers, getUser, getUserLogeado, deleteUser, updateUser }
