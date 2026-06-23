import {api} from "./apiServices";

export async function login(username, password) {
  const response = await api.post('/login', { username, password })
  const { token, refreshToken, id, username:name, session } = response.data

  localStorage.setItem('token', token)
  localStorage.setItem('refreshToken', refreshToken)
  localStorage.setItem('id', id) // 👈 store userId
  localStorage.setItem('username', name) // optional
  localStorage.setItem('session', session) 

  return response.data
}

export async function logout() {
  await api.post('/logout')
  localStorage.removeItem('token')
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('id', id) 
  localStorage.removeItem('username', name) 
  localStorage.setItem('sessionId', sessionId) 
}