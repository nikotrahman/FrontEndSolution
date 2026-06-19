import {api} from "./apiServices";

export async function login(username, password) {
  const response = await api.post('/login', { username, password })
  const { token, refreshToken, id, username:name } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('id', id) // 👈 store userId
  localStorage.setItem('username', name) // optional

  return response.data
}

export async function logout() {
  await api.post('/logout')
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('id', id) 
  localStorage.removeItem('username', name) 
}