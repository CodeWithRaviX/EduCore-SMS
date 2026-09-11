import React, { useState, useEffect } from 'react';

const TeacherForm = ({ show, onClose, onSave, initialData, classes = [] }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    classId: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        email: initialData.email || '',
        phone: initialData.phone || '',
        subject: initialData.subject || '',
        classId: initialData.schoolClass ? String(initialData.schoolClass.id) : ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        classId: ''
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
    if (!formData.name.trim()) newErrors.name = 'Full Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      ...formData,
      classId: formData.classId && formData.classId !== '' ? parseInt(formData.classId, 10) : null
    };
    onSave(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px' }}>
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">
              {initialData ? 'Edit Teacher' : 'Add New Teacher'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Teacher Name <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  placeholder="e.g. Robert Miller"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Email Address <span className="text-danger">*</span></label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  placeholder="e.g. robert.miller@school.edu"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Phone Number <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  placeholder="e.g. 555-0101"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
                {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Subject <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className={`form-control ${errors.subject ? 'is-invalid' : ''}`}
                  placeholder="e.g. Mathematics"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                />
                {errors.subject && <div className="invalid-feedback">{errors.subject}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Assigned Class (Optional)</label>
                <select
                  className="form-select"
                  name="classId"
                  value={formData.classId || ''}
                  onChange={handleChange}
                >
                  <option value="">-- None / General Subject Teacher --</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={String(cls.id)}>
                      Class {cls.className}-{cls.section} ({cls.roomNumber})
                    </option>
                  ))}
                </select>
                {classes.length === 0 && (
                  <div className="alert alert-warning py-1 px-2 mt-2 mb-0 small d-flex align-items-center gap-1">
                    <i className="bi bi-exclamation-triangle-fill text-warning"></i>
                    <span>No classes created yet. Create a class in the <strong>Classes</strong> tab first.</span>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer border-top bg-light" style={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                {initialData ? 'Update Teacher' : 'Create Teacher'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeacherForm;
