import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Dashboard from './components/Dashboard';
import AddRecord from './components/AddRecord';
import EditRecord from './components/EditRecord';
import EmailVerification from './components/EmailVerification';
import ErrorBoundary from './components/ErrorBoundary';
import Login from './components/login';
import PasswordRecovery from './components/PasswordRecovery';
import PasswordReset from './components/PasswordReset';
import Register from './components/Register';
import GridView from './components/GridView';
import { Column } from 'react-table';

interface Data {
  firstName: string;
  lastName: string;
  email: string;
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [userRole, setUserRole] = useState<string>('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Check localStorage for theme preference on initial load
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setIsDarkMode(true);
    }
  }, []);

  // Toggle dark mode and save preference to localStorage
  const toggleDarkMode = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  // Apply the theme to the body element
  useEffect(() => {
    const bodyClass = document.body.classList;
    if (isDarkMode) {
      bodyClass.add('dark-mode');
    } else {
      bodyClass.remove('dark-mode');
    }
  }, [isDarkMode]);

  const columns: Column<Data>[] = [
    {
      Header: 'First Name',
      accessor: 'firstName' as keyof Data,
    },
    {
      Header: 'Last Name',
      accessor: 'lastName' as keyof Data,
    },
    {
      Header: 'Email',
      accessor: 'email' as keyof Data,
    },
  ];

  const data: Data[] = [
    { firstName: 'Andy', lastName: 'King', email: 'andy.king@example.com' },
    { firstName: 'John', lastName: 'Doe', email: 'john.doe@example.com' },
  ];

  const updateMyData = (rowIndex: number, columnId: string, value: string) => {
    // Implement update logic
  };

  return (
    <ErrorBoundary>
      <DndProvider backend={HTML5Backend}>
        <div style={{ padding: '10px' }}>
          <button onClick={toggleDarkMode} style={{ marginBottom: '20px' }}>
            {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          </button>
        </div>
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
          <Route
            path="/grid-view"
            element={
              isAuthenticated ? (
                <GridView columns={columns} data={data} updateMyData={updateMyData} />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} setUserRole={setUserRole} />
              )
            }
          />
        </Routes>
      </DndProvider>
    </ErrorBoundary>
  );
};

export default App;
