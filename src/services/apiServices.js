import axios from 'axios'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // ✅ Vite style
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

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
