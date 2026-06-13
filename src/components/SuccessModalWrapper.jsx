import React, { useState, useEffect } from 'react'
import { CButton } from '@coreui/react'
import ReusableModal2 from '../views/modal/ReusableModal'

export default function SuccessModalWrapper() {
  const [success, setSuccess] = useState(null)

  useEffect(() => {
    const handler = (e) => setSuccess(e.detail)
    window.addEventListener('apiSuccess', handler)
    return () => window.removeEventListener('apiSuccess', handler)
  }, [])

  return (
    <ReusableModal2
      isOpen={!!success}
      onClose={() => setSuccess(null)}
      title="Success"
      footerContent={
        <CButton color="secondary" onClick={() => setSuccess(null)}>
          Close
        </CButton>
      }
    >
      {success && (
        <>
          <p>{success.message}</p>
          <small>
            {success.statusCode ? `Status: ${success.statusCode} ` : ''}
            {success.timestamp ? `| Time: ${success.timestamp}` : ''}
          </small>
        </>
      )}
    </ReusableModal2>
  )
}
