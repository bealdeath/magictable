import React, { useState } from 'react';
import { Route, Routes } from 'react-router-dom';
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

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<EmailVerification />} />
        <Route path="/recover-password" element={<PasswordRecovery />} />
        <Route path="/reset-password" element={<PasswordReset />} />
        <Route path="/dashboard" element={<Dashboard userRole={userRole} />} />
        <Route path="/add-record" element={<AddRecord />} />
        <Route path="/edit-record/:id" element={<EditRecord />} />
      </Routes>
    </ErrorBoundary>
  );
};

export default App;
