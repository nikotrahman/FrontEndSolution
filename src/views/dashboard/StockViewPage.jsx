import React, { useEffect, useState } from 'react'
import { Line } from 'react-chartjs-2'
import 'chart.js/auto'
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CFormSelect,
  CRow,
  CCol,
  CSpinner,
  CBadge,
} from '@coreui/react'
import { startStockHub, stopStockHub, invokeRequestStock } from '../../services/signalRServices'

export default function StockViewPage() {
  const [stockData, setStockData] = useState(null)
  const [symbol, setSymbol] = useState('AAPL')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      await startStockHub((data) => {
        setStockData(data)
        setLoading(false)
      })
      await invokeRequestStock(symbol)
    }
    init()
    return () => stopStockHub()
  }, [])

  const handleSymbolChange = async (newSymbol) => {
    setSymbol(newSymbol)
    setLoading(true)
    await invokeRequestStock(newSymbol)
  }

  const chartData = stockData
    ? {
        labels: stockData.history.map((h) => h.time),
        datasets: [
          {
            label: `${stockData.symbol} Price (USD)`,
            data: stockData.history.map((h) => h.price),
            borderColor: stockData.change >= 0 ? '#4CAF50' : '#F44336',
            backgroundColor: 'rgba(76,175,80,0.2)',
            tension: 0.3,
          },
        ],
      }
    : null

  return (
    <CRow className="mt-4">
      <CCol xs={12}>
        <CCard>
          <CCardHeader className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">📈 Stock Market Dashboard</h5>
            <CFormSelect
              value={symbol}
              onChange={(e) => handleSymbolChange(e.target.value)}
              style={{ width: '150px' }}
            >
              <option value="AAPL">AAPL</option>
              <option value="MSFT">MSFT</option>
              <option value="GOOG">GOOG</option>
              <option value="AMZN">AMZN</option>
            </CFormSelect>
          </CCardHeader>
          <CCardBody>
            {loading || !chartData ? (
              <div className="text-center py-4">
                <CSpinner color="primary" />
                <p className="mt-2">Loading chart data...</p>
              </div>
            ) : (
              <Line data={chartData} />
            )}
          </CCardBody>
          <CCardFooter className="d-flex justify-content-between align-items-center">
            {stockData && (
              <div>
                <strong>{stockData.symbol}</strong> Latest:{' '}
                <CBadge color={stockData.change >= 0 ? 'success' : 'danger'} className="ms-1">
                  {stockData.latestPrice}
                </CBadge>{' '}
                <span className={stockData.change >= 0 ? 'text-success' : 'text-danger'}>
                  ({stockData.change})
                </span>
              </div>
            )}
            <small className="text-muted">Data updates via SignalR</small>
          </CCardFooter>
        </CCard>
      </CCol>
    </CRow>
  )
}
