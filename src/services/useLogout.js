import {logout} from './auth';
import {useNavigate} from 'react-router-dom';

export function useLogout() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
    await logout();
    alert('You have been logged out successfully.');
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
    navigate('/login', { replace: true }) 
  }
  return { handleLogout };  
}