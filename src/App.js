import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';

import './App.css';

// ✅ Pages & Components
import Login from './Pages/Login';
import Dashboard from './components/Dashboard';
import DailyCheckin from './Pages/Dailycheckin';
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// 🔐 Protect private routes
const PrivateRoute = ({ children, isLoggedIn }) => {
  return isLoggedIn ? children : <Navigate to="/login" replace />;
};

// 🧩 Layout wrapper
const Layout = ({ children, isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const hideLayoutRoutes = ["/login"];
  const shouldShowLayout = isLoggedIn && !hideLayoutRoutes.includes(location.pathname);

  return (
    <>
      {shouldShowLayout && (
        <Header
          toggleSidebar={() => setSidebarVisible((prev) => !prev)}
          sidebarVisible={sidebarVisible}
        />
      )}

      <div className="main-area-layout">
        {shouldShowLayout && (
          <Sidebar isVisible={sidebarVisible} handleLogout={handleLogout} />
        )}
        <div className="content-area">{children}</div>
      </div>
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout}>
        <Routes>
          <Route
            path="/"
            element={<Navigate to={isLoggedIn ? '/dashboard' : '/login'} replace />}
          />

          <Route
            path="/login"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />

          {/* ✅ Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/daily-check-in"
            element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <DailyCheckin />
              </PrivateRoute>
            }
          />

          <Route
            path="*"
            element={
              <div style={{ padding: '2rem' }}>
                <h2>404 - Page Not Found</h2>
              </div>
            }
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
