import axios from 'axios'

// const BASE_URL = 'http://localhost:5000'
const BASE_URL = 'http://localhost:5148'
// const BASE_URL = 'https://morrapi20231205153355.azurewebsites.net'

const getItems = (payload) => {
  const formattedReq = {
    searchText: payload.searchText,
    categoryId: payload.categoryId,
  }

  const config = {
    headers: {
      Authorization: payload?.token ? `Bearer ${payload?.token}` : null,
    },
  }
  let url = '/api/Client/getProductsByFilter'

  return axios
    .post(BASE_URL + url, formattedReq, config)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error('Request failed: ' + error.message)
    })
}

const getProductById = (id, payload) => {
  const config = {
    headers: {
      Authorization: payload?.token ? `Bearer ${payload?.token}` : null,
    },
  }
  let url = `/api/Product/getProductById/${id}`

  return axios
    .get(BASE_URL + url, config)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error('Request failed: ' + error.message)
    })
}

export { getItems, getProductById }
