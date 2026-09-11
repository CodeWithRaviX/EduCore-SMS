import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Teachers from './pages/Teachers';
import Classes from './pages/Classes';
import Attendance from './pages/Attendance';
import Fees from './pages/Fees';
import './App.css';

const AuthenticatedLayout = ({ children }) => {
  return (
    <ProtectedRoute>
      <div className="app-container">
        <Sidebar />
        <div className="main-wrapper">
          <Navbar />
          <main className="content-area">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Login Route */}
          <Route path="/login" element={<Login />} />

          {/* Protected Application Routes */}
          <Route
            path="/"
            element={
              <AuthenticatedLayout>
                <Navigate to="/dashboard" replace />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/dashboard"
            element={
              <AuthenticatedLayout>
                <Dashboard />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/students"
            element={
              <AuthenticatedLayout>
                <Students />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/teachers"
            element={
              <AuthenticatedLayout>
                <Teachers />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/classes"
            element={
              <AuthenticatedLayout>
                <Classes />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/attendance"
            element={
              <AuthenticatedLayout>
                <Attendance />
              </AuthenticatedLayout>
            }
          />
          <Route
            path="/fees"
            element={
              <AuthenticatedLayout>
                <Fees />
              </AuthenticatedLayout>
            }
          />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
