import React, { useState, useEffect } from 'react';

const FeeForm = ({ show, onClose, onSave, initialData, students = [] }) => {
  const [formData, setFormData] = useState({
    studentId: '',
    amount: '',
    status: 'PENDING',
    paymentDate: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        studentId: initialData.student ? String(initialData.student.id) : '',
        amount: initialData.amount || '',
        status: initialData.status || 'PENDING',
        paymentDate: initialData.paymentDate || ''
      });
    } else {
      setFormData({
        studentId: '',
        amount: '',
        status: 'PENDING',
        paymentDate: ''
      });
    }
    setErrors({});
  }, [initialData, show]);

  if (!show) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // If status changed to PAID and no paymentDate set, set today's date
      ...(name === 'status' && value === 'PAID' && !prev.paymentDate ? { paymentDate: new Date().toISOString().split('T')[0] } : {})
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.studentId) newErrors.studentId = 'Please select a student';
    if (!formData.amount || isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid positive amount';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      studentId: parseInt(formData.studentId, 10),
      amount: parseFloat(formData.amount),
      status: formData.status,
      paymentDate: formData.status === 'PAID' ? (formData.paymentDate || new Date().toISOString().split('T')[0]) : null
    };
    onSave(payload);
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', zIndex: 1050 }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '12px' }}>
          <div className="modal-header border-bottom">
            <h5 className="modal-title fw-bold">
              {initialData ? 'Edit Fee Record' : 'Create New Fee Record'}
            </h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body p-4">
              <div className="mb-3">
                <label className="form-label fw-semibold">Select Student <span className="text-danger">*</span></label>
                <select
                  className={`form-select ${errors.studentId ? 'is-invalid' : ''}`}
                  name="studentId"
                  value={formData.studentId || ''}
                  onChange={handleChange}
                >
                  <option value="">-- Choose Student --</option>
                  {students.map(s => (
                    <option key={s.id} value={String(s.id)}>
                      {s.name} ({s.schoolClass ? `Class ${s.schoolClass.className}-${s.schoolClass.section}` : 'No Class'})
                    </option>
                  ))}
                </select>
                {errors.studentId && <div className="invalid-feedback">{errors.studentId}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Fee Amount (₹) <span className="text-danger">*</span></label>
                <input
                  type="number"
                  step="0.01"
                  className={`form-control ${errors.amount ? 'is-invalid' : ''}`}
                  placeholder="e.g. 1200.00"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                />
                {errors.amount && <div className="invalid-feedback">{errors.amount}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Payment Status <span className="text-danger">*</span></label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="PENDING">PENDING</option>
                  <option value="PAID">PAID</option>
                </select>
              </div>

              {formData.status === 'PAID' && (
                <div className="mb-3">
                  <label className="form-label fw-semibold">Payment Date</label>
                  <input
                    type="date"
                    className="form-control"
                    name="paymentDate"
                    value={formData.paymentDate}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>

            <div className="modal-footer border-top bg-light" style={{ borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary px-4">
                {initialData ? 'Update Record' : 'Save Fee Record'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FeeForm;
