import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout, isPrincipal } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <header className="top-navbar d-flex align-items-center justify-content-between px-3 px-md-4 py-2 border-bottom bg-white shadow-sm">
      <div className="brand-title d-flex align-items-center gap-2 fw-bold text-primary fs-5">
        <i className="bi bi-mortarboard-fill fs-4"></i>
        <span>EduCore SMS</span>
      </div>

      <div className="d-flex align-items-center gap-3">
        {user && (
          <div className="d-flex align-items-center gap-2">
            <div
              className={`rounded-circle text-white d-flex align-items-center justify-content-center fw-bold shadow-sm ${
                isPrincipal ? 'bg-primary' : 'bg-success'
              }`}
              style={{ width: '38px', height: '38px', fontSize: '0.85rem' }}
            >
              {getInitials(user.fullName)}
            </div>
            <div className="d-none d-sm-block text-start">
              <div style={{ fontWeight: 600, fontSize: '0.88rem', lineHeight: '1.2' }}>
                {user.fullName || user.email}
              </div>
              <div className="d-flex align-items-center gap-1">
                <span
                  className={`badge px-2 py-0 ${
                    isPrincipal ? 'bg-primary-subtle text-primary border border-primary-subtle' : 'bg-success-subtle text-success border border-success-subtle'
                  }`}
                  style={{ fontSize: '0.72rem' }}
                >
                  {isPrincipal ? '👑 Principal' : '👨‍🏫 Teacher'}
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="btn btn-outline-danger btn-sm d-flex align-items-center gap-1 shadow-sm"
          title="Sign Out"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="d-none d-md-inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
