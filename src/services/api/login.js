import axios from 'axios'

const baseUrl = 'http://localhost:8080/api/'

const token = async credentials => {
  try {
    const { data } = await axios.post(baseUrl + "token", credentials)
    return data
  } catch (error) {
    console.log(error)
  }
}

const login = async credentials => {
  try {
  const { data } = await axios.post(baseUrl + "signin", credentials)
  return data
  } catch (error) {
    console.log(error)
  }
}

export default { token, login }
