import axios from 'axios'

const BASE_URL = 'http://localhost:5148'
// const BASE_URL = 'http://localhost:5000'
// const BASE_URL = 'https://morrapi20231205153355.azurewebsites.net'

const getCategories = () => {
  const config = {
    headers: {
      Authorization: storedAuthToken?.token
        ? `Bearer ${storedAuthToken?.token}`
        : null,
    },
  }
  let url = '/api/MasterData/getCategoryMasterData'

  return axios
    .get(BASE_URL + url, config)
    .then((response) => {
      return response
    })
    .catch((error) => {
      throw new Error('Request failed: ' + error.message)
    })
}

export { getCategories }
