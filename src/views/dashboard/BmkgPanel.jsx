// views/dashboard/BmkgPanel.jsx
import { useEffect, useState } from 'react'
import { CCard, CCardBody, CCardHeader } from '@coreui/react'
import { Chart } from 'chart.js/auto'
import { getBmkgWeather, getBmkgEarthquake } from '../../services/apiServices'
import { startBmkgHub, stopBmkgHub } from '../../services/signalRServices'

function BmkgPanel() {
  const [weather, setWeather] = useState(null)
  const [quakeRest, setQuakeRest] = useState(null)
  const [quakeLive, setQuakeLive] = useState(null)
  const [status, setStatus] = useState(null)

  const canvasRef = useState(null)

  useEffect(() => {
    const sessionId = localStorage.getItem('session')

    getBmkgWeather(sessionId).then(setWeather).catch(console.error)
    getBmkgEarthquake().then(setQuakeRest).catch(console.error)

    startBmkgHub(
      () => {}, // ignore welcome message
      (liveQuake) => setQuakeLive(liveQuake),
    )

    return () => stopBmkgHub()
  }, [])

  useEffect(() => {
    if (!canvasRef.current || !weather) return

    const chart = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels: ['08:00', '12:00', '16:00', '20:00'], // replace with history labels
        datasets: [
          {
            label: `${weather.location} Temperature`,
            data: [28.5, 29.0, 29.5, 29.2], // replace with history values
            borderColor: '#007bff',
            tension: 0.3,
          },
        ],
      },
      options: { responsive: true, plugins: { legend: { display: false } } },
    })

    return () => chart.destroy()
  }, [weather])

  return (
    <CCard className="mb-4">
      <CCardHeader>BMKG Weather & Earthquakes</CCardHeader>
      <CCardBody>
        {status && <small className="text-muted">{status}</small>}

        {weather && (
          <div className="mb-3">
            <h6>{weather.location} Temperature</h6>
            <h3 className="text-primary fw-bold">{weather.value}°C</h3>
            <canvas ref={canvasRef}></canvas>
            <small>Updated: {new Date(weather.timestamp).toLocaleString()}</small>
          </div>
        )}

        {quakeRest && (
          <div className="mt-3 p-2 border rounded bg-light">
            <strong>Earthquake (REST)</strong>
            <p>
              Magnitude {quakeRest.value} {quakeRest.unit} in {quakeRest.location}
            </p>
            <small>Time: {new Date(quakeRest.timestamp).toLocaleString()}</small>
          </div>
        )}

        {quakeLive && (
          <div className="mt-3 p-2 border rounded bg-danger text-white">
            <strong>Earthquake (SignalR LIVE)</strong>
            <p>
              Magnitude {quakeLive.value} {quakeLive.unit} in {quakeLive.location}
            </p>
            <small>Time: {new Date(quakeLive.timestamp).toLocaleString()}</small>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default BmkgPanel
