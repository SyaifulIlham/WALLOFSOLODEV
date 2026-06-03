import { useNavigate } from 'react-router-dom';

/**
 * Logout utility function
 * Clears all auth-related data from sessionStorage
 */
export const logout = () => {
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('role');
  sessionStorage.removeItem('user');
  sessionStorage.removeItem('admin');
};

/**
 * Custom hook for logout with navigation
 * Usage: const handleLogout = useLogout();
 */
export const useLogout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return handleLogout;
};
