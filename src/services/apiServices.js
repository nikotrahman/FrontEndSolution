import axios from 'axios'
import { useLoading } from '../context/LoadingContext'
import { methodMessageMap } from '../config/messageMap'


export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const setupInterceptors = (setLoading) => {
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      setLoading(true)
      return config
    },
    (error) => {
      setLoading(false)
      return Promise.reject(error)
    },
  )

  api.interceptors.response.use(
    (response) => {
      setLoading(false)

      const url = response.config.url
      const method = response.config.method?.toUpperCase()

      let message = null

      if (url.includes('/login')) {
        message = 'Successful Login'
      } else if (url.includes('/logout')) {
        message = 'Successful Logout'
      } else if (methodMessageMap[method]) {
        message = methodMessageMap[method]
      }

      if (message) {
        window.dispatchEvent(
          new CustomEvent('apiSuccess', {
            detail: {
              message,
              statusCode: response.status,
              timestamp: new Date().toISOString(),
            },
          }),
        )
      }
      return response
    },
    (error) => {
      setLoading(false)
      const backendData = error.response?.data
      const statusCode= error.response?.status;

      //Handle inactive/expired session
      if (statusCode===401){
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href='/login';
      }

      const payload = {
        statusCode: error.response?.status,
        details:
          typeof backendData === 'string'
            ? backendData
            : backendData?.message || error.message || 'Unexpected error',
        timestamp: backendData?.timestamp || new Date().toISOString(),
      }
      window.dispatchEvent(new CustomEvent('apiError', { detail: payload }))
      return Promise.reject(error)
    },
  )
}
// CRUD functions
export const getUsers = async () => {
  try {
    const response = await api.get('/Biodata')
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/Biodata/${id}`)
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}

export const createUser = async (data) => {
  try {
    const response = await api.post('/Biodata', data)
    return response.data
  } catch (error) {
    console.error('Error creating user:', error)
    throw error
  }
}

export const updateUser = async (id, data) => {
  try {
    const response = await api.put(`/Biodata/${id}`, data)
    return response.data
  } catch (error) {
    console.error('Error updating user:', error)
    throw error
  }
}

export const deleteUser = async (id) => {
  try {
    const response = await api.delete(`/Biodata/${id}`)
    return response.data
  } catch (error) {
    console.error('Error deleting user:', error)
    throw error
  }
}
