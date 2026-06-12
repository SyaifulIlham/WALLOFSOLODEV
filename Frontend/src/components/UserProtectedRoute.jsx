import { Navigate } from 'react-router-dom';

const UserProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  // Only allow user role, block admin
  if (!token || role !== 'user') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default UserProtectedRoute;