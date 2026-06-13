import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import ReusableModal2 from '../views/modal/ReusableModal'

export default function ErrorModalWrapper() {
  const [error, setError] = useState(null)

  useEffect(() => {
    const handler = (e) => setError(e.detail)
    window.addEventListener('apiError', handler)
    return () => window.removeEventListener('apiError', handler)
  }, [])

  return (
    <ReusableModal2
      isOpen={!!error}
      onClose={() => setError(null)}
      title="Error"
      footerContent={
        <CButton color="secondary" onClick={() => setError(null)}>
          Close
        </CButton>
      }
    >
      {error && (
        <>
          {error.details && <p>{error.details}</p>}
          <small>
            {error.statusCode ? `Status: ${error.statusCode} ` : ''}
            {error.timestamp ? `| Time: ${error.timestamp}` : ''}
          </small>
        </>
      )}
    </ReusableModal2>
  )
}
