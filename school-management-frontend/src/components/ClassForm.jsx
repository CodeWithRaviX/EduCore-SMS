import React, { useState, useEffect } from 'react';

const ClassForm = ({ show, onClose, onSave, initialData }) => {
  const [formData, setFormData] = useState({
    className: '',
    section: '',
    roomNumber: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        className: initialData.className || '',
        section: initialData.section || '',
        roomNumber: initialData.roomNumber || ''
      });
    } else {
      setFormData({
        className: '',
        section: '',
        roomNumber: ''
      });
    }
    setErrors({});
  }, [initialData, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.className.trim()) newErrors.className = 'Class Name is required (e.g. 10, 9)';
    if (!formData.section.trim()) newErrors.section = 'Section is required (e.g. A, B)';
    if (!formData.roomNumber.trim()) newErrors.roomNumber = 'Room Number is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(formData);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px' }}>
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">
              {initialData ? 'Edit Class' : 'Add New Class'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Class Name / Grade <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.className ? 'is-invalid' : ''}`}
                  placeholder="e.g. 10, 9, 8"
                  name="className"
                  value={formData.className}
                  onChange={handleChange}
                />
                {errors.className && <div className="invalid-feedback">{errors.className}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Section <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.section ? 'is-invalid' : ''}`}
                  placeholder="e.g. A, B, C"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                />
                {errors.section && <div className="invalid-feedback">{errors.section}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Room Number <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.roomNumber ? 'is-invalid' : ''}`}
                  placeholder="e.g. Room 101"
                  name="roomNumber"
                  value={formData.roomNumber}
                  onChange={handleChange}
                />
                {errors.roomNumber && <div className="invalid-feedback">{errors.roomNumber}</div>}
              </div>
            </div>

            <div className="modal-footer border-top bg-light" style={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                {initialData ? 'Update Class' : 'Create Class'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClassForm;
