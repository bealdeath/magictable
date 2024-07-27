import React, { useState, useEffect } from 'react';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
import EmailVerification from './components/EmailVerification';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/login'; // Ensure consistent casing
import PasswordRecovery from './components/PasswordRecovery';
import PasswordReset from './components/PasswordReset';
import Register from './components/Register';
import '../styles.css'; // Ensure the path is correct

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    } else {
      if (location.pathname !== '/login' && location.pathname !== '/register') {
        navigate('/login');
      }
    }
  }, [navigate, location.pathname]);

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/recover-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? <Dashboard userRole={userRole} /> : <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
          }
        />
        <Route
          path="/add-record"
          element={
            isAuthenticated ? <AddRecord /> : <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
          }
        />
        <Route
          path="/edit-record/:id"
          element={
            isAuthenticated ? <EditRecord /> : <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
          }
        />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
