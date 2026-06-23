import * as signalR from '@microsoft/signalr'

let chatConnection = null
let bmkgConnection = null

// === ChatHub Connection ===
export const createChatConnection = () => {
  const token = localStorage.getItem('token') // 👈 JWT for auth
  const apiBase = import.meta.env.VITE_API_URL
  const hubUrl = apiBase.replace('/api', '') + '/chatHub'

  chatConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      accessTokenFactory: () => token,
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  return chatConnection
}

export const getChatConnection = () => chatConnection

export const stopChatConnection = async () => {
  if (chatConnection) {
    await chatConnection.stop()
    chatConnection = null
  }
}

// === BMKG Hub Connection ===
export const startBmkgHub = (onConnected, onEarthquake) => {
  const apiBase = import.meta.env.VITE_API_URL
  const hubUrl = apiBase.replace('/api', '') + '/bmkgHub' // 👈 same pattern as chatHub

  bmkgConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, {
      transport: signalR.HttpTransportType.WebSockets,
    })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  // Handle welcome message from OnConnectedAsync
  bmkgConnection.on('Connected', (msg) => {
    if (onConnected) onConnected(msg)
    {
    console.log('BMKG Hub connected:', msg)
    }
  })

  // Handle earthquake broadcast
  bmkgConnection.on('ReceiveEarthquake', (quake) => {
    if (onEarthquake) onEarthquake(quake)
    {
    console.log('Earthquake received:', quake)
    }
  })

  bmkgConnection.start().catch((err) => console.error('BMKG hub error:', err))
}

export const stopBmkgHub = async () => {
  if (bmkgConnection) {
    await bmkgConnection.stop()
    bmkgConnection = null
  }
}
