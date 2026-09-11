import React, { useState, useEffect } from 'react';
import classService from '../services/classService';
import ClassForm from '../components/ClassForm';
import ConfirmDialog from '../components/ConfirmDialog';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingClass, setEditingClass] = useState(null);

  // Delete Confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);

  // Notifications
  const [notification, setNotification] = useState({ type: '', message: '' });

  useEffect(() => {
    loadClasses();
  }, []);

  const showToast = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => {
      setNotification({ type: '', message: '' });
    }, 4000);
  };

  const loadClasses = async () => {
    try {
      setLoading(true);
      const res = await classService.getAllClassesWithCount();
      setClasses(res.data);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load classes.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingClass) {
        await classService.updateClass(editingClass.id, formData);
        showToast('success', `Class ${formData.className}-${formData.section} updated successfully.`);
      } else {
        await classService.createClass(formData);
        showToast('success', `Class ${formData.className}-${formData.section} created successfully.`);
      }
      setShowFormModal(false);
      setEditingClass(null);
      loadClasses();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save class.';
      showToast('danger', msg);
    }
  };

  const handleDelete = async () => {
    if (!classToDelete) return;
    try {
      await classService.deleteClass(classToDelete.id);
      showToast('success', `Class deleted successfully.`);
      setShowConfirm(false);
      setClassToDelete(null);
      loadClasses();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Cannot delete class. Make sure to reassign students first.';
      showToast('danger', msg);
      setShowConfirm(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Classes & Sections</h1>
          <p className="page-subtitle">Configure academic grades, sections, room allocations, and student rosters.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setEditingClass(null);
            setShowFormModal(true);
          }}
        >
          <i className="bi bi-plus-circle-fill"></i> Add Class
        </button>
      </div>

      {notification.message && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Classes Table */}
      <div className="custom-card">
        <div className="custom-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status"></div>
              <span>Loading classes...</span>
            </div>
          ) : classes.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-building"></i>
              <h5>No Classes Configured</h5>
              <p className="text-muted">Click "Add Class" above to set up grade classrooms.</p>
            </div>
          ) : (
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Class / Grade</th>
                  <th>Section</th>
                  <th>Room Number</th>
                  <th>Enrolled Students</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((cls) => (
                  <tr key={cls.id}>
                    <td className="text-muted fw-semibold">#{cls.id}</td>
                    <td>
                      <div className="fw-bold text-slate-800 fs-6">Class {cls.className}</div>
                    </td>
                    <td>
                      <span className="badge bg-secondary-subtle text-secondary-emphasis border px-2.5 py-1">
                        Section {cls.section}
                      </span>
                    </td>
                    <td>
                      <i className="bi bi-geo-alt text-muted me-1"></i> {cls.roomNumber}
                    </td>
                    <td>
                      <span className="badge bg-info-subtle text-info-emphasis border px-2.5 py-1">
                        <i className="bi bi-people me-1"></i> {cls.studentCount || 0} Students
                      </span>
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1">
                        <button
                          className="action-btn edit"
                          title="Edit Class"
                          onClick={() => {
                            setEditingClass(cls);
                            setShowFormModal(true);
                          }}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete Class"
                          onClick={() => {
                            setClassToDelete(cls);
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

      {/* Add / Edit Form Modal */}
      <ClassForm
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingClass(null);
        }}
        onSave={handleCreateOrUpdate}
        initialData={editingClass}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showConfirm}
        title="Confirm Class Deletion"
        message={`Are you sure you want to delete Class ${classToDelete?.className}-${classToDelete?.section}?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setClassToDelete(null);
        }}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Classes;
