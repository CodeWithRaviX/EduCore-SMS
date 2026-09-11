import React, { useState, useEffect } from 'react';
import teacherService from '../services/teacherService';
import classService from '../services/classService';
import TeacherForm from '../components/TeacherForm';
import ConfirmDialog from '../components/ConfirmDialog';
import { useAuth } from '../context/AuthContext';

const Teachers = () => {
  const { isPrincipal } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);

  // Delete Confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Notifications
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [teachersRes, classesRes] = await Promise.all([
        teacherService.getAllTeachers(),
        classService.getAllClasses()
      ]);
      setTeachers(teachersRes.data);
      setClasses(classesRes.data);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load teacher records.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingTeacher) {
        await teacherService.updateTeacher(editingTeacher.id, formData);
        showToast('success', `Teacher "${formData.name}" updated successfully.`);
      } else {
        await teacherService.createTeacher(formData);
        showToast('success', `Teacher "${formData.name}" added successfully.`);
      }
      setShowFormModal(false);
      setEditingTeacher(null);
      loadData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save teacher record. (Requires Principal permission)';
      showToast('danger', msg);
    }
  };

  const handleDelete = async () => {
    if (!teacherToDelete) return;
    try {
      await teacherService.deleteTeacher(teacherToDelete.id);
      showToast('success', `Teacher "${teacherToDelete.name}" deleted successfully.`);
      setShowConfirm(false);
      setTeacherToDelete(null);
      loadData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to delete teacher. (Requires Principal permission)';
      showToast('danger', msg);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Faculty & Teachers</h1>
          <p className="page-subtitle">Manage teaching staff, departmental subjects, and assigned classroom duties.</p>
        </div>
        {isPrincipal ? (
          <button
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={() => {
              setEditingTeacher(null);
              setShowFormModal(true);
            }}
          >
            <i className="bi bi-person-plus-fill"></i> Add Teacher
          </button>
        ) : (
          <span className="badge bg-secondary-subtle text-secondary border px-3 py-2 d-inline-flex align-items-center gap-1 shadow-sm">
            <i className="bi bi-shield-lock-fill"></i> Read-Only (Only Principal can add/edit teachers)
          </span>
        )}
      </div>

      {notification.message && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Teachers Table */}
      <div className="custom-card">
        <div className="custom-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status"></div>
              <span>Loading faculty list...</span>
            </div>
          ) : teachers.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-person-badge"></i>
              <h5>No Teachers Registered</h5>
              <p className="text-muted">
                {isPrincipal ? 'Click "Add Teacher" above to register faculty members.' : 'No faculty records found.'}
              </p>
            </div>
          ) : (
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Faculty Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Subject</th>
                  <th>Assigned Class</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teachers.map((teacher) => (
                  <tr key={teacher.id}>
                    <td className="text-muted fw-semibold">#{teacher.id}</td>
                    <td>
                      <div className="fw-semibold text-slate-800">{teacher.name}</div>
                    </td>
                    <td>{teacher.email}</td>
                    <td>{teacher.phone}</td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis border px-2.5 py-1">
                        {teacher.subject}
                      </span>
                    </td>
                    <td>
                      {teacher.schoolClass ? (
                        <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-2.5 py-1">
                          Class {teacher.schoolClass.className}-{teacher.schoolClass.section}
                        </span>
                      ) : (
                        <span className="text-muted fst-italic">None</span>
                      )}
                    </td>
                    <td className="text-end">
                      {isPrincipal ? (
                        <div className="d-inline-flex gap-1">
                          <button
                            className="action-btn edit"
                            title="Edit Teacher"
                            onClick={() => {
                              setEditingTeacher(teacher);
                              setShowFormModal(true);
                            }}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            className="action-btn delete"
                            title="Delete Teacher"
                            onClick={() => {
                              setTeacherToDelete(teacher);
                              setShowConfirm(true);
                            }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      ) : (
                        <span className="badge bg-light text-muted border px-2 py-1" style={{ fontSize: '0.75rem' }}>
                          <i className="bi bi-lock me-1"></i> Read Only
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* Add / Edit Form Modal */}
      <TeacherForm
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingTeacher(null);
        }}
        onSave={handleCreateOrUpdate}
        initialData={editingTeacher}
        classes={classes}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showConfirm}
        title="Confirm Teacher Deletion"
        message={`Are you sure you want to delete teacher "${teacherToDelete?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setTeacherToDelete(null);
        }}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Teachers;
