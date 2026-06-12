import { useEffect } from 'react'
import { useLoading } from '../context/LoadingContext'
import { setupInterceptors } from './apiServices'

export default function InterceptorInitializer() {
  const { setLoading } = useLoading()

  useEffect(() => {
    setupInterceptors(setLoading)
  }, [setLoading])

  return null // nothing to render, just sets up interceptors
}
