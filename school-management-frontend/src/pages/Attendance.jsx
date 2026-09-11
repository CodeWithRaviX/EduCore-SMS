import React, { useState, useEffect } from 'react';
import attendanceService from '../services/attendanceService';
import classService from '../services/classService';
import studentService from '../services/studentService';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('mark'); // 'mark' | 'view'
  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // For marking attendance
  const [classStudents, setClassStudents] = useState([]);
  const [attendanceMap, setAttendanceMap] = useState({}); // { [studentId]: 'PRESENT' | 'ABSENT' }
  const [savingAttendance, setSavingAttendance] = useState(false);

  // For viewing records by date
  const [recordsDate, setRecordsDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);

  // Notifications
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadClasses();
    loadRecordsByDate(recordsDate);
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      loadStudentsForClass(selectedClassId, selectedDate);
    } else {
      setClassStudents([]);
      setAttendanceMap({});
    }
  }, [selectedClassId, selectedDate]);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4000);
  };

  const loadClasses = async () => {
    try {
      const res = await classService.getAllClasses();
      setClasses(res.data);
      if (res.data.length > 0) {
        setSelectedClassId(res.data[0].id.toString());
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load classes.');
    }
  };

  const loadStudentsForClass = async (classId, date) => {
    try {
      const [studentsRes, existingAttendanceRes] = await Promise.all([
        studentService.getStudentsByClass(classId),
        attendanceService.getAttendanceByClassAndDate(classId, date)
      ]);

      setClassStudents(studentsRes.data);

      // Map existing records if already marked for this date
      const initialStatus = {};
      const existingMap = {};
      existingAttendanceRes.data.forEach(att => {
        existingMap[att.student.id] = att.status;
      });

      studentsRes.data.forEach(s => {
        initialStatus[s.id] = existingMap[s.id] || 'PRESENT'; // default to PRESENT
      });

      setAttendanceMap(initialStatus);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load class roster or attendance.');
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceMap(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const markAll = (status) => {
    const updated = {};
    classStudents.forEach(s => {
      updated[s.id] = status;
    });
    setAttendanceMap(updated);
  };

  const handleSaveAttendance = async () => {
    if (classStudents.length === 0) return;
    try {
      setSavingAttendance(true);
      const requests = classStudents.map(s => ({
        studentId: s.id,
        date: selectedDate,
        status: attendanceMap[s.id] || 'PRESENT'
      }));

      await attendanceService.markBatchAttendance(requests);
      showToast('success', `Attendance successfully saved for ${classStudents.length} students on ${selectedDate}.`);
      if (recordsDate === selectedDate) {
        loadRecordsByDate(selectedDate);
      }
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to save attendance records.');
    } finally {
      setSavingAttendance(false);
    }
  };

  const loadRecordsByDate = async (date) => {
    try {
      setLoadingRecords(true);
      const res = await attendanceService.getAttendanceByDate(date);
      setAttendanceRecords(res.data);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load attendance logs.');
    } finally {
      setLoadingRecords(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Attendance Management</h1>
          <p className="page-subtitle">Track daily classroom student attendance and review historical logs.</p>
        </div>
      </div>

      {notification.message && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 border-bottom pb-3">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'mark' ? 'active bg-primary' : 'text-dark'}`}
            onClick={() => setActiveTab('mark')}
          >
            <i className="bi bi-pencil-square me-2"></i> Mark Attendance Roster
          </button>
        </li>
        <li className="nav-item ms-2">
          <button
            className={`nav-link ${activeTab === 'view' ? 'active bg-primary' : 'text-dark'}`}
            onClick={() => setActiveTab('view')}
          >
            <i className="bi bi-calendar-event me-2"></i> View Records By Date
          </button>
        </li>
      </ul>

      {/* TAB 1: Mark Attendance */}
      {activeTab === 'mark' && (
        <div>
          {/* Filter Bar */}
          <div className="custom-card p-3 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small text-muted">Select Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small text-muted">Select Class</label>
                <select
                  className="form-select"
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                >
                  <option value="">-- Choose Class --</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      Class {cls.className}-{cls.section} (Room {cls.roomNumber})
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-12 col-md-4 d-flex align-items-end justify-content-md-end gap-2 pt-2 pt-md-0">
                <button
                  type="button"
                  className="btn btn-outline-success btn-sm"
                  onClick={() => markAll('PRESENT')}
                  disabled={classStudents.length === 0}
                >
                  <i className="bi bi-check-all"></i> All Present
                </button>
                <button
                  type="button"
                  className="btn btn-outline-danger btn-sm"
                  onClick={() => markAll('ABSENT')}
                  disabled={classStudents.length === 0}
                >
                  <i className="bi bi-x"></i> All Absent
                </button>
              </div>
            </div>
          </div>

          {/* Student Roster Table */}
          <div className="custom-card">
            <div className="custom-card-header">
              <span>
                <i className="bi bi-person-lines-fill me-2 text-primary"></i>
                Class Roster ({classStudents.length} Students)
              </span>
              <button
                className="btn btn-success px-4"
                onClick={handleSaveAttendance}
                disabled={classStudents.length === 0 || savingAttendance}
              >
                {savingAttendance ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Saving...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-arrow-up-fill me-1"></i> Save Attendance
                  </>
                )}
              </button>
            </div>
            <div className="custom-table-container">
              {classStudents.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-people"></i>
                  <h5>No Students in Selected Class</h5>
                  <p className="text-muted">Select a class or assign students to this class in the Students tab.</p>
                </div>
              ) : (
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Roll #</th>
                      <th>Student Name</th>
                      <th>Email</th>
                      <th>Gender</th>
                      <th className="text-center">Attendance Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classStudents.map((student, idx) => {
                      const currentStatus = attendanceMap[student.id] || 'PRESENT';
                      return (
                        <tr key={student.id}>
                          <td className="fw-semibold text-muted">#{idx + 1}</td>
                          <td className="fw-bold text-slate-800">{student.name}</td>
                          <td>{student.email}</td>
                          <td>{student.gender}</td>
                          <td className="text-center">
                            <div className="btn-group" role="group">
                              <input
                                type="radio"
                                className="btn-check"
                                name={`status-${student.id}`}
                                id={`present-${student.id}`}
                                checked={currentStatus === 'PRESENT'}
                                onChange={() => handleStatusChange(student.id, 'PRESENT')}
                              />
                              <label
                                className={`btn btn-sm ${currentStatus === 'PRESENT' ? 'btn-success' : 'btn-outline-success'}`}
                                htmlFor={`present-${student.id}`}
                              >
                                <i className="bi bi-check-lg me-1"></i> Present
                              </label>

                              <input
                                type="radio"
                                className="btn-check"
                                name={`status-${student.id}`}
                                id={`absent-${student.id}`}
                                checked={currentStatus === 'ABSENT'}
                                onChange={() => handleStatusChange(student.id, 'ABSENT')}
                              />
                              <label
                                className={`btn btn-sm ${currentStatus === 'ABSENT' ? 'btn-danger' : 'btn-outline-danger'}`}
                                htmlFor={`absent-${student.id}`}
                              >
                                <i className="bi bi-x-lg me-1"></i> Absent
                              </label>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: View Records By Date */}
      {activeTab === 'view' && (
        <div>
          <div className="custom-card p-3 mb-4">
            <div className="row g-3 align-items-center">
              <div className="col-12 col-md-4">
                <label className="form-label fw-semibold small text-muted">Filter By Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={recordsDate}
                  onChange={(e) => {
                    setRecordsDate(e.target.value);
                    loadRecordsByDate(e.target.value);
                  }}
                />
              </div>
              <div className="col-auto ms-auto text-muted small">
                Records Found: <strong>{attendanceRecords.length}</strong>
              </div>
            </div>
          </div>

          <div className="custom-card">
            <div className="custom-table-container">
              {loadingRecords ? (
                <div className="loading-container">
                  <div className="spinner-border text-primary" role="status"></div>
                  <span>Loading records...</span>
                </div>
              ) : attendanceRecords.length === 0 ? (
                <div className="empty-state">
                  <i className="bi bi-calendar-x"></i>
                  <h5>No Attendance Logged for {recordsDate}</h5>
                  <p className="text-muted">No attendance entries have been submitted on this date.</p>
                </div>
              ) : (
                <table className="table table-custom">
                  <thead>
                    <tr>
                      <th>Record ID</th>
                      <th>Student Name</th>
                      <th>Class</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceRecords.map((att) => (
                      <tr key={att.id}>
                        <td className="text-muted fw-semibold">#{att.id}</td>
                        <td className="fw-bold">{att.student ? att.student.name : 'Unknown'}</td>
                        <td>
                          {att.student && att.student.schoolClass ? (
                            <span className="badge bg-light text-dark border">
                              Class {att.student.schoolClass.className}-{att.student.schoolClass.section}
                            </span>
                          ) : (
                            <span className="text-muted">-</span>
                          )}
                        </td>
                        <td>{att.date}</td>
                        <td>
                          <span className={`badge-status ${att.status === 'PRESENT' ? 'badge-present' : 'badge-absent'}`}>
                            <i className={`bi ${att.status === 'PRESENT' ? 'bi-check-circle-fill' : 'bi-x-circle-fill'}`}></i>
                            {att.status}
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
      )}
    </div>
  );
};

export default Attendance;
