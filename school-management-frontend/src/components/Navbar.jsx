import React from 'react';

const Navbar = () => {
  return (
    <header className="top-navbar">
      <div className="brand-title">
        <i className="bi bi-mortarboard-fill"></i>
        <span>School Management System</span>
      </div>

      <div className="admin-profile">
        <div className="admin-avatar">
          AD
        </div>
        <div>
          <div style={{ fontWeight: 600, fontSize: '0.9rem', lineHeight: '1.2' }}>Admin Portal</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Administrator</div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
