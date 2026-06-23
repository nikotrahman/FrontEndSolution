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
      } else if (!url.includes('/Chat') && methodMessageMap[method]) {
        // exclude AI/chat endpoint from success modal
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
      const statusCode = error.response?.status
      const requestUrl = error.config?.url

      //Handle inactive/expired session
      if (statusCode === 401) {
        if (requestUrl?.includes('/login')) {
          const payload = {
            statusCode,
            message: backendData?.message || 'Invalid username or password',
            details: backendData?.details || null,
          }
          window.dispatchEvent(new CustomEvent('apiError', { detail: payload }))
        } else {
          // Expired session -> redirect
          localStorage.removeItem('token')
          localStorage.removeItem('refreshToken')
          window.location.href = '/login'
        }
      } else {
        // Other errors
        const payload = {
          statusCode,
          message: backendData?.message || error.message || 'Unexpected error',
          details: backendData?.details || null,
        }
        window.dispatchEvent(new CustomEvent('apiError', { detail: payload }))
      }
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

// Chat Endpoints
export const sendChatMessage = async (message) => {
  try {
    const id = localStorage.getItem('id')

    const payload = {
      userId: String(id), // 👈 ensure string
      message: message,
    }

    console.log('Payload:', payload)

    const response = await api.post('/Chat/send', payload)
    return response.data.content
  } catch (error) {
    throw error
  }
}

export const getHistory = async (Id) => {
  try {
    const response = await api.get(`/Chat/history/${Id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

//for bmkg data

// Weather by sessionId
export const getBmkgWeather = async (sessionId) => {
  try {
    const response = await api.get(`/bmkg/weather?sessionId=${sessionId}`)
    return response.data
  } catch (error) {
    console.error('Error fetching BMKG weather:', error)
    throw error
  }
}

// Latest earthquake
export const getBmkgEarthquake = async () => {
  try {
    const response = await api.get(`/bmkg/earthquake`)
    return response.data
  } catch (error) {
    console.error('Error fetching BMKG earthquake:', error)
    throw error
  }
}

// Weather history (for charts)
export const getBmkgWeatherHistory = async (location) => {
  try {
    const response = await api.get(`/bmkg/weather/history`, {
      params: { location },
    })
    return response.data
  } catch (error) {
    console.error('Error fetching BMKG weather history:', error)
    throw error
  }
}

// Earthquake history (for lists or charts)
export const getBmkgEarthquakeHistory = async () => {
  try {
    const response = await api.get(`/bmkg/earthquake/history`)
    return response.data
  } catch (error) {
    console.error('Error fetching BMKG earthquake history:', error)
    throw error
  }
}