import * as signalR from '@microsoft/signalr'

let chatConnection = null
let bmkgConnection = null
let stockConnection = null

// === ChatHub Connection ===
export const createChatConnection = () => {
  const token = localStorage.getItem('token')
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
    console.log('[ChatHub] Connection stopped')
  }
}

// === BMKG Hub Connection ===
export const startBmkgHub = async (onConnected, onEarthquake) => {
  const apiBase = import.meta.env.VITE_API_URL
  const hubUrl = apiBase.replace('/api', '') + '/bmkgHub'

  bmkgConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, { transport: signalR.HttpTransportType.WebSockets })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  bmkgConnection.on('Connected', (msg) => {
    if (onConnected) onConnected(msg)
    console.log('[BMKG Hub] Connected:', msg)
  })

  bmkgConnection.on('ReceiveEarthquake', (quake) => {
    if (onEarthquake) onEarthquake(quake)
    console.log('[BMKG Hub] Earthquake:', quake)
  })

  try {
    await bmkgConnection.start()
    console.log('[BMKG Hub] Connection started')
  } catch (err) {
    console.error('[BMKG Hub] Error starting connection:', err)
  }
}

export const stopBmkgHub = async () => {
  if (bmkgConnection) {
    await bmkgConnection.stop()
    bmkgConnection = null
    console.log('[BMKG Hub] Connection stopped')
  }
}

// === StockHub Connection ===
export const startStockHub = async (onStockData) => {
  const apiBase = import.meta.env.VITE_API_URL
  const hubUrl = apiBase.replace('/api', '') + '/stockHub'

  stockConnection = new signalR.HubConnectionBuilder()
    .withUrl(hubUrl, { transport: signalR.HttpTransportType.WebSockets })
    .withAutomaticReconnect()
    .configureLogging(signalR.LogLevel.Information)
    .build()

  stockConnection.on('ReceiveStockData', (data) => {
    if (onStockData) onStockData(data)
    console.log('[StockHub] Data received:', data)
  })

  try {
    await stockConnection.start()
    console.log('[StockHub] Connection started')
  } catch (err) {
    console.error('[StockHub] Error starting connection:', err)
  }

  return stockConnection
}

export const getStockConnection = () => stockConnection

export const stopStockHub = async () => {
  if (stockConnection) {
    await stockConnection.stop()
    stockConnection = null
    console.log('[StockHub] Connection stopped')
  }
}

// === Helper: Request stock data ===
export const invokeRequestStock = async (symbol) => {
  if (stockConnection) {
    try {
      await stockConnection.invoke('RequestStock', symbol)
      console.log(`[StockHub] Requested stock: ${symbol}`)
    } catch (err) {
      console.error('[StockHub] Error requesting stock:', err)
    }
  }
}
