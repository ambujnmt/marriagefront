import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

import "./App.css";

// ✅ Pages & Components
import Login from "./Pages/Login";
import Dashboard from "./components/Dashboard";
import DailyCheckin from "./Pages/Dailycheckin";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Profile from "./Pages/Profile";
import Partner from "./Pages/Partner";
import Answer from "./Pages/Dailycheckin/Answer";

const PrivateRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
};

// 🧩 Layout wrapper (Sidebar + Header)
const Layout = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();
  const [sidebarVisible, setSidebarVisible] = useState(true);

  const hideLayoutRoutes = ["/login"];
  const shouldShowLayout =
    isLoggedIn && !hideLayoutRoutes.includes(location.pathname);

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
        <div className="content-area">
          <Outlet /> {/* ✅ Nested routes render here */}
        </div>
      </div>
    </>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);
  }, []);

  const handleLogin = () => {
    localStorage.setItem("isLoggedIn", "true");
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <Routes>
        {/* Root redirect */}
        <Route
          path="/"
          element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} replace />}
        />

        {/* Public login route */}
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

        {/* Protected routes */}
        <Route element={<Layout isLoggedIn={isLoggedIn} handleLogout={handleLogout} />}>
          <Route element={<PrivateRoute isLoggedIn={isLoggedIn} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/daily-check-in" element={<DailyCheckin />} />
            <Route path="/settings/profile" element={<Profile />} />
            <Route path="/partner-list" element={<Partner />} />
            <Route path="/dealy-check-in-answer" element={<Answer />} />

          </Route>
        </Route>

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div style={{ padding: "2rem" }}>
              <h2>404 - Page Not Found</h2>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
