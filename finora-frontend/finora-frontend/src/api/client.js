import axios from 'axios'

const client = axios.create({
  baseURL: 'http://localhost:8080',
})

// Attach the token from localStorage to every outgoing request, if present.
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('finora_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// If the backend ever says the token is invalid/expired (401), log the user out
// client-side so they land back on the login screen instead of seeing broken data.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('finora_token')
      localStorage.removeItem('finora_user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
