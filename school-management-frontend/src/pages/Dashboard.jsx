import React, { useState, useEffect } from 'react';
import dashboardService from '../services/dashboardService';
import studentService from '../services/studentService';
import feeService from '../services/feeService';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalClasses: 0,
    totalPresentToday: 0,
    totalAbsentToday: 0,
    totalPendingFees: 0
  });
  const [recentStudents, setRecentStudents] = useState([]);
  const [pendingFees, setPendingFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [statsRes, studentsRes, feesRes] = await Promise.all([
        dashboardService.getStats(),
        studentService.getAllStudents(),
        feeService.getPendingFees()
      ]);

      setStats(statsRes.data);
      setRecentStudents(studentsRes.data.slice(-5).reverse());
      setPendingFees(feesRes.data.slice(0, 5));
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Unable to load dashboard data. Ensure the Spring Boot backend is running on http://localhost:8080.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-border text-primary" role="status"></div>
        <span>Loading dashboard metrics...</span>
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Executive Dashboard</h1>
          <p className="page-subtitle">Overview of school operations, student enrollment, attendance, and fee collections.</p>
        </div>
        <button className="btn btn-outline-primary btn-sm d-flex align-items-center gap-2" onClick={fetchDashboardData}>
          <i className="bi bi-arrow-clockwise"></i> Refresh Data
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center mb-4" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2 fs-5"></i>
          <div>{error}</div>
        </div>
      )}

      {/* KPI Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="custom-card stat-card">
            <div className="stat-icon students">
              <i className="bi bi-people-fill"></i>
            </div>
            <div>
              <div className="stat-val">{stats.totalStudents}</div>
              <div className="stat-label">Total Enrolled Students</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="custom-card stat-card">
            <div className="stat-icon teachers">
              <i className="bi bi-person-badge-fill"></i>
            </div>
            <div>
              <div className="stat-val">{stats.totalTeachers}</div>
              <div className="stat-label">Total Faculty Teachers</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="custom-card stat-card">
            <div className="stat-icon classes">
              <i className="bi bi-building-fill"></i>
            </div>
            <div>
              <div className="stat-val">{stats.totalClasses}</div>
              <div className="stat-label">Total Active Classes</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="custom-card stat-card">
            <div className="stat-icon present">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <div>
              <div className="stat-val text-success">{stats.totalPresentToday}</div>
              <div className="stat-label">Students Present Today</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="custom-card stat-card">
            <div className="stat-icon absent">
              <i className="bi bi-x-circle-fill"></i>
            </div>
            <div>
              <div className="stat-val text-danger">{stats.totalAbsentToday}</div>
              <div className="stat-label">Students Absent Today</div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="custom-card stat-card">
            <div className="stat-icon fees">
              <i className="bi bi-cash-stack"></i>
            </div>
            <div>
              <div className="stat-val text-warning">
                ₹{Number(stats.totalPendingFees).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
              <div className="stat-label">Total Outstanding Fees (₹)</div>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Recent Activities */}
      <div className="row g-4">
        {/* Recent Students */}
        <div className="col-12 col-lg-6">
          <div className="custom-card h-100">
            <div className="custom-card-header">
              <span><i className="bi bi-person-plus-fill me-2 text-primary"></i>Recent Student Enrollments</span>
              <Link to="/students" className="btn btn-sm btn-link text-decoration-none">View All</Link>
            </div>
            <div className="custom-table-container">
              {recentStudents.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-people"></i>
                  <p>No students enrolled yet.</p>
                </div>
              ) : (
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Class</th>
                      <th>Phone</th>
                      <th>Gender</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentStudents.map((s) => (
                      <tr key={s.id}>
                        <td className="fw-semibold">{s.name}</td>
                        <td>
                          {s.schoolClass ? (
                            <span className="badge bg-light text-dark border">
                              Class {s.schoolClass.className}-{s.schoolClass.section}
                            </span>
                          ) : (
                            <span className="text-muted">Unassigned</span>
                          )}
                        </td>
                        <td>{s.phone}</td>
                        <td>{s.gender}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Pending Fees */}
        <div className="col-12 col-lg-6">
          <div className="custom-card h-100">
            <div className="custom-card-header">
              <span><i className="bi bi-exclamation-circle-fill me-2 text-warning"></i>Urgent Pending Fees (₹)</span>
              <Link to="/fees" className="btn btn-sm btn-link text-decoration-none">Manage Fees</Link>
            </div>
            <div className="custom-table-container">
              {pendingFees.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-check2-circle text-success"></i>
                  <p>All fees are cleared! No pending dues.</p>
                </div>
              ) : (
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Student</th>
                      <th>Class</th>
                      <th>Amount (₹)</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingFees.map((f) => (
                      <tr key={f.id}>
                        <td className="fw-semibold">{f.student ? f.student.name : 'Unknown'}</td>
                        <td>
                          {f.student && f.student.schoolClass ? (
                            <span className="badge bg-light text-dark border">
                              {f.student.schoolClass.className}-{f.student.schoolClass.section}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td className="fw-bold text-slate-700">₹{f.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                        <td>
                          <span className="badge-status badge-pending">
                            <i className="bi bi-clock-fill"></i> PENDING
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
