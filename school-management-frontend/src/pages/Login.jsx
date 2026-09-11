import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    const result = await login(email, password);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    const result = await login(demoEmail, demoPassword);
    if (result.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-5 px-3">
      <div className="card border-0 shadow-lg" style={{ maxWidth: '460px', width: '100%', borderRadius: '1rem' }}>
        <div className="card-body p-4 p-md-5">
          {/* Brand Header */}
          <div className="text-center mb-4">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary text-white rounded-circle shadow-sm mb-3"
              style={{ width: '64px', height: '64px', fontSize: '1.8rem' }}
            >
              <i className="bi bi-mortarboard-fill"></i>
            </div>
            <h3 className="fw-bold text-dark mb-1">EduCore SMS</h3>
            <p className="text-muted small mb-0">Sign in to access school administration</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert alert-danger py-2 px-3 small d-flex align-items-center mb-3" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2 flex-shrink-0"></i>
              <div>{error}</div>
            </div>
          )}

          {/* Quick Demo Login Cards */}
          <div className="bg-light p-3 rounded-3 mb-4 border">
            <div className="text-muted small fw-semibold text-uppercase mb-2 text-center" style={{ fontSize: '0.72rem', letterSpacing: '0.5px' }}>
              ⚡ 1-Click Quick Demo Login
            </div>
            <div className="d-grid gap-2">
              <button
                type="button"
                className="btn btn-outline-primary btn-sm text-start d-flex align-items-center justify-content-between py-2"
                onClick={() => handleQuickLogin('principal@school.com', 'admin123')}
                disabled={loading}
              >
                <span>
                  <strong>👑 Principal / Admin</strong>
                  <span className="text-muted d-block small" style={{ fontSize: '0.75rem' }}>Full management access</span>
                </span>
                <span className="badge bg-primary">Auto-fill & Login</span>
              </button>

              <button
                type="button"
                className="btn btn-outline-success btn-sm text-start d-flex align-items-center justify-content-between py-2"
                onClick={() => handleQuickLogin('teacher@school.com', 'teacher123')}
                disabled={loading}
              >
                <span>
                  <strong>👨‍🏫 Lead Teacher</strong>
                  <span className="text-muted d-block small" style={{ fontSize: '0.75rem' }}>Attendance & student view</span>
                </span>
                <span className="badge bg-success">Auto-fill & Login</span>
              </button>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-semibold text-secondary">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  type="email"
                  className="form-control"
                  placeholder="e.g. principal@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-semibold text-secondary">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-white text-muted">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary w-100 py-2 fw-semibold shadow-sm"
              disabled={loading}
            >
              {loading ? (
                <span>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Signing In...
                </span>
              ) : (
                <span>Sign In to Dashboard <i className="bi bi-arrow-right ms-1"></i></span>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
