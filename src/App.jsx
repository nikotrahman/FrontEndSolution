import React from 'react'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom'
import './scss/style.scss'
import ProtectedRoute from '../src/services/routeGuards'
import IdleSessionTimeout from './services/IdleTimerProvider'

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Register = React.lazy(() => import('./views/pages/register/Register'))


function App() {
  return (
    <BrowserRouter>
      <IdleSessionTimeout>
        <Routes>
          {/* Change the root path to navigate or render the Login page directly */}
          {/* <Route exact path="/" element={<Navigate to="/login" replace />} /> */}
          
          {/* Ensure your Login route exists */}
          {/* <Route exact path="/login" name="Login Page" element={<Login />} /> */}
          
          {/* Your main dashboard layout route */}
          {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route element={<ProtectedRoute />}>
            <Route path="*" element={<DefaultLayout />} />
          </Route>
        </Routes>
      </IdleSessionTimeout>
    </BrowserRouter>
  )
}


export default App