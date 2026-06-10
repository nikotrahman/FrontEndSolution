import React from 'react';
import { useNavigate } from 'react-router-dom';
import {IdleTimerProvider} from 'react-idle-timer';

const IdleSessionTimeout = ({ children }) => {
  const navigate = useNavigate();   

  // Set idle timeout to 15 minutes (900,000 milliseconds)
  const timeout = 15 * 60 * 1000;

  const onIdle = () => {
    // Clear user session data (e.g., tokens, user info)
    localStorage.removeItem('userToken');
    //redirect to login page
    navigate('/login', { replace: true }); 
    alert('You have been logged out due to inactivity.');
  };   

    return (
        <IdleTimerProvider timeout={timeout} onIdle={onIdle} debounce={500}>
            {children}
        </IdleTimerProvider>
    );  
};

export default IdleSessionTimeout;  