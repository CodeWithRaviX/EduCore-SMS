import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: 'bi-grid-1x2-fill' },
    { to: '/students', label: 'Students', icon: 'bi-people-fill' },
    { to: '/teachers', label: 'Teachers', icon: 'bi-person-badge-fill' },
    { to: '/classes', label: 'Classes', icon: 'bi-building-fill' },
    { to: '/attendance', label: 'Attendance', icon: 'bi-calendar-check-fill' },
    { to: '/fees', label: 'Fees', icon: 'bi-cash-coin' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <i className="bi bi-mortarboard fs-4 text-primary"></i>
        <span>EduCore SMS</span>
      </div>

      <ul className="sidebar-nav">
        {navItems.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `nav-link-custom ${isActive ? 'active' : ''}`
              }
            >
              <i className={`bi ${item.icon}`}></i>
              <span>{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
