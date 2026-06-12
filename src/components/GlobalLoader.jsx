import { CSpinner } from '@coreui/react'
import { useLoading } from '../context/LoadingContext'

const GlobalLoader = () => {
  const { loading } = useLoading()
  if (!loading) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,0.7)',
        zIndex: 9999,
      }}
    >
      <CSpinner color="primary" size="lg" />
    </div>
  )
}

export default GlobalLoader
