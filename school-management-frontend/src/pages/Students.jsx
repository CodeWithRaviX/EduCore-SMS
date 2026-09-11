import React, { useState, useEffect } from 'react';
import studentService from '../services/studentService';
import classService from '../services/classService';
import attendanceService from '../services/attendanceService';
import StudentForm from '../components/StudentForm';
import ConfirmDialog from '../components/ConfirmDialog';

const Students = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  
  // Delete confirm states
  const [showConfirm, setShowConfirm] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // View Details / Attendance Stats Modal
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedStudentStats, setSelectedStudentStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(false);

  // Notifications
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadInitialData();
  }, []);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4000);
  };

  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [studentsRes, classesRes] = await Promise.all([
        studentService.getAllStudents(),
        classService.getAllClasses()
      ]);
      setStudents(studentsRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load student data.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (searchTerm.trim() === '') {
        const res = await studentService.getAllStudents();
        setStudents(res.data);
      } else {
        const res = await studentService.searchStudents(searchTerm.trim());
        setStudents(res.data);
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'Error executing student search.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingStudent) {
        await studentService.updateStudent(editingStudent.id, formData);
        showToast('success', `Student "${formData.name}" updated successfully.`);
      } else {
        await studentService.createStudent(formData);
        showToast('success', `Student "${formData.name}" added successfully.`);
      }
      setShowFormModal(false);
      setEditingStudent(null);
      loadInitialData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save student record.';
      showToast('danger', msg);
    }
  };

  const handleDelete = async () => {
    if (!studentToDelete) return;
    try {
      await studentService.deleteStudent(studentToDelete.id);
      showToast('success', `Student "${studentToDelete.name}" deleted successfully.`);
      setShowConfirm(false);
      setStudentToDelete(null);
      loadInitialData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to delete student.';
      showToast('danger', msg);
      setShowConfirm(false);
    }
  };

  const handleViewAttendance = async (student) => {
    try {
      setSelectedStudentStats(null);
      setLoadingStats(true);
      setShowStatsModal(true);
      const res = await attendanceService.getAttendancePercentage(student.id);
      setSelectedStudentStats({ ...res.data, student });
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to fetch attendance stats.');
      setShowStatsModal(false);
    } finally {
      setLoadingStats(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Student Directory</h1>
          <p className="page-subtitle">Manage student enrollment, personal details, assigned classes, and performance.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setEditingStudent(null);
            setShowFormModal(true);
          }}
        >
          <i className="bi bi-person-plus-fill"></i> Add Student
        </button>
      </div>

      {notification.message && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Search and Filters */}
      <div className="custom-card p-3 mb-4">
        <form onSubmit={handleSearch} className="row g-2 align-items-center">
          <div className="col-12 col-md-6 col-lg-4">
            <div className="input-group">
              <span className="input-group-text bg-white text-muted border-end-0">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control border-start-0 ps-0"
                placeholder="Search student by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-primary px-3">
              Search
            </button>
          </div>
          {searchTerm && (
            <div className="col-auto">
              <button
                type="button"
                className="btn btn-outline-secondary px-3"
                onClick={() => {
                  setSearchTerm('');
                  studentService.getAllStudents().then(res => setStudents(res.data));
                }}
              >
                Clear
              </button>
            </div>
          )}
          <div className="col-auto ms-auto text-muted small">
            Total Results: <strong>{students.length}</strong>
          </div>
        </form>
      </div>

      {/* Students Table */}
      <div className="custom-card">
        <div className="custom-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status"></div>
              <span>Fetching student records...</span>
            </div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-people"></i>
              <h5>No Students Found</h5>
              <p className="text-muted">No students matching your search criteria were found.</p>
            </div>
          ) : (
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Class</th>
                  <th>Gender</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="text-muted fw-semibold">#{student.id}</td>
                    <td>
                      <div className="fw-semibold text-slate-800">{student.name}</div>
                      <small className="text-muted">{student.address}</small>
                    </td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    <td>
                      {student.schoolClass ? (
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1">
                          Class {student.schoolClass.className}-{student.schoolClass.section}
                        </span>
                      ) : (
                        <span className="text-muted fst-italic">Unassigned</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${student.gender === 'MALE' ? 'bg-info-subtle text-info-emphasis' : student.gender === 'FEMALE' ? 'bg-pink-subtle text-danger' : 'bg-secondary-subtle text-secondary'}`}>
                        {student.gender}
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="action-btn view"
                          title="View Attendance & Details"
                          onClick={() => handleViewAttendance(student)}
                        >
                          <i className="bi bi-graph-up-arrow"></i>
                        </button>
                        <button
                          className="action-btn edit"
                          title="Edit Student"
                          onClick={() => {
                            setEditingStudent(student);
                            setShowFormModal(true);
                          }}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete Student"
                          onClick={() => {
                            setStudentToDelete(student);
                            setShowConfirm(true);
                          }}
                        >
                          <i className="bi bi-trash-fill"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      <StudentForm
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingStudent(null);
        }}
        onSave={handleCreateOrUpdate}
        initialData={editingStudent}
        classes={classes}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showConfirm}
        title="Confirm Student Deletion"
        message={`Are you sure you want to delete student "${studentToDelete?.name}"? All associated attendance and fee records will be affected.`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setStudentToDelete(null);
        }}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      />

      {/* Attendance & Performance Modal */}
      {showStatsModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px' }}>
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Student Attendance Overview</h5>
                <button type="button" className="btn-close" onClick={() => setShowStatsModal(false)}></button>
              </div>
              <div className="modal-body p-4">
                {loadingStats ? (
                  <div className="text-center py-4">
                    <div className="spinner-border text-primary" role="status"></div>
                    <p className="mt-2 text-muted">Calculating attendance metrics...</p>
                  </div>
                ) : selectedStudentStats ? (
                  <div>
                    <div className="d-flex align-items-center gap-3 mb-4 pb-3 border-bottom">
                      <div className="admin-avatar" style={{ width: '48px', height: '48px', fontSize: '1.2rem' }}>
                        {selectedStudentStats.studentName.charAt(0)}
                      </div>
                      <div>
                        <h5 className="mb-0 fw-bold">{selectedStudentStats.studentName}</h5>
                        <small className="text-muted">Student ID: #{selectedStudentStats.studentId}</small>
                      </div>
                    </div>

                    <div className="text-center p-3 mb-3 bg-light rounded-3">
                      <div className="text-muted small fw-semibold uppercase">Overall Attendance Rate</div>
                      <div className={`display-5 fw-bold ${selectedStudentStats.percentage >= 75 ? 'text-success' : selectedStudentStats.percentage >= 50 ? 'text-warning' : 'text-danger'}`}>
                        {selectedStudentStats.percentage}%
                      </div>
                      <div className="progress mt-2" style={{ height: '8px' }}>
                        <div
                          className={`progress-bar ${selectedStudentStats.percentage >= 75 ? 'bg-success' : selectedStudentStats.percentage >= 50 ? 'bg-warning' : 'bg-danger'}`}
                          style={{ width: `${selectedStudentStats.percentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="row g-2 text-center">
                      <div className="col-4">
                        <div className="p-2 border rounded">
                          <div className="text-muted small">Total Days</div>
                          <div className="fw-bold fs-5">{selectedStudentStats.totalDays}</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 border rounded bg-success-subtle text-success-emphasis">
                          <div className="small">Present</div>
                          <div className="fw-bold fs-5">{selectedStudentStats.presentDays}</div>
                        </div>
                      </div>
                      <div className="col-4">
                        <div className="p-2 border rounded bg-danger-subtle text-danger-emphasis">
                          <div className="small">Absent</div>
                          <div className="fw-bold fs-5">{selectedStudentStats.absentDays}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-muted">No attendance data available.</p>
                )}
              </div>
              <div className="modal-footer border-top bg-light">
                <button type="button" className="btn btn-secondary px-4" onClick={() => setShowStatsModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Students;
