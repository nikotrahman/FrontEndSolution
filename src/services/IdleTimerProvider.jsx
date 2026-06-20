import React, {useEffect, useRef} from 'react';
import { useNavigate } from 'react-router-dom';
import {IdleTimerProvider} from 'react-idle-timer';
import {api} from "./apiServices";
import {logout} from "./auth"

const IdleSessionTimeout = ({ children }) => {
  const navigate = useNavigate()
  const startTimeRef = useRef(Date.now()) // record login start time

  // Set idle timeout to 15 minutes (900,000 milliseconds)
  const timeout = 15 * 60 * 1000 // 900000 ms
  const channel=new BroadcastChannel('user-activity') //shared channel
  
  const onIdle = async () => {
    const elapsedMs = Date.now() - startTimeRef.current
    const elapsedMinutes = Math.floor(elapsedMs / 60000)
    const elapsedSeconds = Math.floor((elapsedMs % 60000) / 1000)

    console.log('IdleTimerProvider mounted, timeout set to', timeout)
    console.log(`Elapsed: ${elapsedMinutes}m ${elapsedSeconds}s`)

    await logout()
    navigate('/login', { replace: true })

    const message = 'You have been logged out due to inactivity.'
    window.dispatchEvent(
      new CustomEvent('apiSuccess', {
        detail: {
          message,
          statusCode: 200,
          timestamp: new Date().toISOString(),
        },
      }),
    )
  }

  //Broadcast activity to other tabs
  const onActive=()=>{
    channel.postMessage({type:'activity', timestamp: Date.now()})
  }

  useEffect(()=>{
    // Listen for activity messages from other tabs
    channel.onmessage=(event)=>{
      if (event.data.type==='activity'){
        console.log('Activity recevied from another tab')
        startTimeRef.current=Date.now() //reset timer
      }
    }
    return ()=>channel.close()
  },[])

  return (
    <IdleTimerProvider timeout={timeout} onIdle={onIdle} debounce={500}>
      {children}
    </IdleTimerProvider>
  )
};

export default IdleSessionTimeout;  