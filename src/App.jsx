import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import ProtectedRoute from '../src/services/routeGuards'
import IdleSessionTimeout from './services/IdleTimerProvider'
import { useEffect } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import GlobalLoader from './components/GlobalLoader'
import { api, setupInterceptors } from './services/apiServices'
import InterceptorInitializer from './services/InterceptorInitializer'


const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))


function App() {
  return (
    <LoadingProvider>
      <GlobalLoader />
      <InterceptorInitializer />
      <BrowserRouter>
        <IdleSessionTimeout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<ProtectedRoute />}>
              <Route path="*" element={<DefaultLayout />} />
            </Route>
          </Routes>
        </IdleSessionTimeout>
      </BrowserRouter>
    </LoadingProvider>
  )
}


export default App