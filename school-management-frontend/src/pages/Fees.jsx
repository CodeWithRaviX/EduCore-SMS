import React, { useState, useEffect } from 'react';
import feeService from '../services/feeService';
import studentService from '../services/studentService';
import FeeForm from '../components/FeeForm';
import FeeReceiptModal from '../components/FeeReceiptModal';
import ConfirmDialog from '../components/ConfirmDialog';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL'); // 'ALL' | 'PAID' | 'PENDING'

  // Modals
  const [showFormModal, setShowFormModal] = useState(false);
  const [editingFee, setEditingFee] = useState(null);

  // Receipt Modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [selectedFeeForReceipt, setSelectedFeeForReceipt] = useState(null);

  // Delete Confirm
  const [showConfirm, setShowConfirm] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);

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
      const [feesRes, studentsRes] = await Promise.all([
        feeService.getAllFees(),
        studentService.getAllStudents()
      ]);
      setFees(feesRes.data);
      setStudents(studentsRes.data);
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to load fee ledger.');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrUpdate = async (formData) => {
    try {
      if (editingFee) {
        await feeService.updateFee(editingFee.id, formData);
        showToast('success', 'Fee record updated successfully.');
      } else {
        await feeService.createFee(formData);
        showToast('success', 'Fee record created successfully.');
      }
      setShowFormModal(false);
      setEditingFee(null);
      loadData();
    } catch (err) {
      console.error(err);
      const msg = err.response?.data?.message || 'Failed to save fee record.';
      showToast('danger', msg);
    }
  };

  const handleDelete = async () => {
    if (!feeToDelete) return;
    try {
      await feeService.deleteFee(feeToDelete.id);
      showToast('success', 'Fee record removed successfully.');
      setShowConfirm(false);
      setFeeToDelete(null);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to delete fee record.');
      setShowConfirm(false);
    }
  };

  const handleMarkAsPaid = async (fee) => {
    try {
      const updated = {
        studentId: fee.student.id,
        amount: fee.amount,
        status: 'PAID',
        paymentDate: new Date().toISOString().split('T')[0]
      };
      await feeService.updateFee(fee.id, updated);
      showToast('success', `Fee for ${fee.student.name} marked as PAID.`);
      loadData();
    } catch (err) {
      console.error(err);
      showToast('danger', 'Failed to update payment status.');
    }
  };

  const handleOpenReceipt = (fee) => {
    setSelectedFeeForReceipt(fee);
    setShowReceiptModal(true);
  };

  const filteredFees = fees.filter(f => {
    if (filterStatus === 'ALL') return true;
    return f.status === filterStatus;
  });

  const totalCollected = fees
    .filter(f => f.status === 'PAID')
    .reduce((sum, f) => sum + f.amount, 0);

  const totalPending = fees
    .filter(f => f.status === 'PENDING')
    .reduce((sum, f) => sum + f.amount, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Fee Management</h1>
          <p className="page-subtitle">Track tuition invoices, payments, generate receipts in ₹, and review collections.</p>
        </div>
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={() => {
            setEditingFee(null);
            setShowFormModal(true);
          }}
        >
          <i className="bi bi-plus-circle-fill"></i> Add Fee Invoice
        </button>
      </div>

      {notification.message && (
        <div className={`alert alert-${notification.type} alert-dismissible fade show mb-4`} role="alert">
          {notification.message}
          <button type="button" className="btn-close" onClick={() => setNotification({ type: '', message: '' })}></button>
        </div>
      )}

      {/* Financial Overview Cards */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-6">
          <div className="custom-card p-3 border-start border-success border-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small fw-semibold">TOTAL COLLECTED (PAID)</div>
                <div className="fs-3 fw-bold text-success">
                  ₹{totalCollected.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="stat-icon present">
                <i className="bi bi-wallet2"></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-6">
          <div className="custom-card p-3 border-start border-warning border-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small fw-semibold">TOTAL OUTSTANDING (PENDING)</div>
                <div className="fs-3 fw-bold text-warning">
                  ₹{totalPending.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
              </div>
              <div className="stat-icon fees">
                <i className="bi bi-hourglass-split"></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="btn-group" role="group">
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'ALL' ? 'btn-dark' : 'btn-outline-secondary'}`}
            onClick={() => setFilterStatus('ALL')}
          >
            All Invoices ({fees.length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'PAID' ? 'btn-success' : 'btn-outline-success'}`}
            onClick={() => setFilterStatus('PAID')}
          >
            Paid ({fees.filter(f => f.status === 'PAID').length})
          </button>
          <button
            type="button"
            className={`btn btn-sm ${filterStatus === 'PENDING' ? 'btn-warning' : 'btn-outline-warning'}`}
            onClick={() => setFilterStatus('PENDING')}
          >
            Pending Dues ({fees.filter(f => f.status === 'PENDING').length})
          </button>
        </div>
      </div>

      {/* Fees Table */}
      <div className="custom-card">
        <div className="custom-table-container">
          {loading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status"></div>
              <span>Loading fee records...</span>
            </div>
          ) : filteredFees.length === 0 ? (
            <div className="empty-state">
              <i className="bi bi-receipt"></i>
              <h5>No Fee Records Found</h5>
              <p className="text-muted">No fee records match the current filter selection.</p>
            </div>
          ) : (
            <table className="table table-custom">
              <thead>
                <tr>
                  <th>Invoice ID</th>
                  <th>Student Name</th>
                  <th>Class</th>
                  <th>Amount (₹)</th>
                  <th>Status</th>
                  <th>Payment Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFees.map((fee) => (
                  <tr key={fee.id}>
                    <td className="text-muted fw-semibold">#{fee.id}</td>
                    <td>
                      <div className="fw-bold text-slate-800">{fee.student ? fee.student.name : 'Unknown'}</div>
                      <small className="text-muted">{fee.student ? fee.student.email : ''}</small>
                    </td>
                    <td>
                      {fee.student && fee.student.schoolClass ? (
                        <span className="badge bg-light text-dark border">
                          Class {fee.student.schoolClass.className}-{fee.student.schoolClass.section}
                        </span>
                      ) : (
                        <span className="text-muted">-</span>
                      )}
                    </td>
                    <td>
                      <div className="fw-bold text-slate-900 fs-6">
                        ₹{Number(fee.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>
                    <td>
                      <span className={`badge-status ${fee.status === 'PAID' ? 'badge-paid' : 'badge-pending'}`}>
                        <i className={`bi ${fee.status === 'PAID' ? 'bi-check-circle-fill' : 'bi-clock-fill'}`}></i>
                        {fee.status}
                      </span>
                    </td>
                    <td>
                      {fee.paymentDate ? (
                        <span className="text-slate-700">{fee.paymentDate}</span>
                      ) : (
                        <span className="text-muted fst-italic">Pending</span>
                      )}
                    </td>
                    <td className="text-end">
                      <div className="d-inline-flex gap-1 align-items-center">
                        {/* Receipt Button */}
                        <button
                          className="action-btn view"
                          title="Generate & Print Fee Receipt (₹)"
                          onClick={() => handleOpenReceipt(fee)}
                        >
                          <i className="bi bi-receipt"></i>
                        </button>

                        {fee.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-outline-success py-1 px-2 me-1"
                            title="Mark as Paid Today"
                            onClick={() => handleMarkAsPaid(fee)}
                          >
                            <i className="bi bi-check-circle"></i> Pay
                          </button>
                        )}
                        <button
                          className="action-btn edit"
                          title="Edit Fee"
                          onClick={() => {
                            setEditingFee(fee);
                            setShowFormModal(true);
                          }}
                        >
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="action-btn delete"
                          title="Delete Fee"
                          onClick={() => {
                            setFeeToDelete(fee);
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

      {/* Add / Edit Modal */}
      <FeeForm
        show={showFormModal}
        onClose={() => {
          setShowFormModal(false);
          setEditingFee(null);
        }}
        onSave={handleCreateOrUpdate}
        initialData={editingFee}
        students={students}
      />

      {/* Fee Receipt Printable Modal */}
      <FeeReceiptModal
        show={showReceiptModal}
        onClose={() => {
          setShowReceiptModal(false);
          setSelectedFeeForReceipt(null);
        }}
        fee={selectedFeeForReceipt}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        show={showConfirm}
        title="Confirm Fee Record Deletion"
        message={`Are you sure you want to delete Invoice #${feeToDelete?.id} for ₹${feeToDelete?.amount}?`}
        onConfirm={handleDelete}
        onCancel={() => {
          setShowConfirm(false);
          setFeeToDelete(null);
        }}
        confirmText="Yes, Delete"
        confirmVariant="danger"
      />
    </div>
  );
};

export default Fees;
