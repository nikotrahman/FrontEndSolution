import * as signalR from '@microsoft/signalr'

let connection = null

export const createSignalRConnection = () => {
  const token = localStorage.getItem('token') // 👈 use the same variable name

  const apiBase = import.meta.env.VITE_API_URL
  const hubUrl = apiBase.replace('/api', '') + '/chatHub'

  connection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token, // 👈 now matches
      transport: signalR.HttpTransportType.WebSockets, // force WebSockets
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  return connection
}

export const getConnection = () => connection

export const stopConnection = async () => {
  if (connection) {
    await connection.stop()
    connection = null
  }
}
