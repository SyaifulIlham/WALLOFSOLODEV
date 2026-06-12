import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = sessionStorage.getItem('token');
  const role = sessionStorage.getItem('role');

  // Only allow admin role
  if (!token || role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
