import React from 'react';

const FeeReceiptModal = ({ show, onClose, fee }) => {
  if (!show || !fee) return null;

  const student = fee.student || {};
  const schoolClass = student.schoolClass || null;
  const receiptNo = `REC-${new Date().getFullYear()}-${String(fee.id).padStart(5, '0')}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(15, 23, 42, 0.65)', zIndex: 1060 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content shadow-lg border-0" style={{ borderRadius: '16px', overflow: 'hidden' }}>
          {/* Action Header */}
          <div className="modal-header border-bottom bg-light py-2 px-4 d-print-none">
            <span className="fw-semibold text-muted small">
              <i className="bi bi-receipt me-1 text-primary"></i> Fee Payment Receipt
            </span>
            <div className="d-flex gap-2">
              <button type="button" className="btn btn-sm btn-primary px-3" onClick={handlePrint}>
                <i className="bi bi-printer-fill me-1"></i> Print / Save PDF
              </button>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
          </div>

          {/* Printable Receipt Body */}
          <div className="modal-body p-4 p-md-5 bg-white" id="printable-receipt">
            {/* School Header */}
            <div className="border-bottom pb-4 mb-4 text-center position-relative">
              <div className="d-flex align-items-center justify-content-center gap-2 mb-1">
                <i className="bi bi-mortarboard-fill text-primary fs-2"></i>
                <h3 className="fw-bold mb-0 text-dark">EDUCORE PUBLIC SCHOOL</h3>
              </div>
              <p className="text-muted small mb-1">
                Affiliated to State Academic Board • Affiliation No. 2026/ED/894
              </p>
              <p className="text-muted small mb-0">
                124 Knowledge Campus, Education City, New Delhi - 110001 • Phone: +91 11-2345-6789
              </p>

              {/* Status Watermark / Stamp */}
              {fee.status === 'PAID' ? (
                <div
                  className="position-absolute end-0 top-0 d-none d-md-block px-3 py-1 border border-2 border-success text-success fw-bold text-uppercase rounded"
                  style={{ transform: 'rotate(12deg)', letterSpacing: '2px', opacity: 0.85 }}
                >
                  <i className="bi bi-check-circle-fill me-1"></i> PAID
                </div>
              ) : (
                <div
                  className="position-absolute end-0 top-0 d-none d-md-block px-3 py-1 border border-2 border-warning text-warning fw-bold text-uppercase rounded"
                  style={{ transform: 'rotate(12deg)', letterSpacing: '2px', opacity: 0.85 }}
                >
                  <i className="bi bi-clock-fill me-1"></i> PENDING
                </div>
              )}
            </div>

            {/* Receipt Subtitle */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-2">
              <div>
                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-1.5 fs-6">
                  OFFICIAL FEE RECEIPT
                </span>
              </div>
              <div className="text-end">
                <div className="fw-bold text-dark">Receipt No: <span className="text-primary">{receiptNo}</span></div>
                <div className="text-muted small">Date: {fee.paymentDate || currentDate}</div>
              </div>
            </div>

            {/* Student & Payment Info Card */}
            <div className="bg-light p-3 rounded-3 mb-4 border">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="text-muted small text-uppercase fw-semibold">Student Details</div>
                  <div className="fw-bold text-dark fs-5">{student.name || 'N/A'}</div>
                  <div className="small text-muted">Student ID: #{student.id || 'N/A'}</div>
                  <div className="small text-muted">
                    Class: {schoolClass ? `Class ${schoolClass.className}-${schoolClass.section} (Room ${schoolClass.roomNumber})` : 'Unassigned'}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div className="text-muted small text-uppercase fw-semibold">Payment Summary</div>
                  <div className="small text-muted">Contact: {student.phone || 'N/A'}</div>
                  <div className="small text-muted">Email: {student.email || 'N/A'}</div>
                  <div className="small text-muted">
                    Payment Status:{' '}
                    <span className={`fw-bold ${fee.status === 'PAID' ? 'text-success' : 'text-warning'}`}>
                      {fee.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Fee Itemization Table */}
            <table className="table table-bordered mb-4">
              <thead className="table-light">
                <tr>
                  <th style={{ width: '60px' }} className="text-center">#</th>
                  <th>Fee Description</th>
                  <th>Term / Academic Session</th>
                  <th className="text-end" style={{ width: '180px' }}>Amount (₹)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="text-center">1</td>
                  <td>
                    <div className="fw-semibold">Tuition & Academic Composite Fee</div>
                    <small className="text-muted">Includes classroom instruction, laboratory, library, and sports dues</small>
                  </td>
                  <td>2026 - 2027</td>
                  <td className="text-end fw-bold">₹{Number(fee.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="table-light">
                  <th colSpan="3" className="text-end fs-6">Total Amount Payable:</th>
                  <th className="text-end fs-5 text-primary">₹{Number(fee.amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</th>
                </tr>
              </tfoot>
            </table>

            {/* Signatures & Footer Note */}
            <div className="row mt-5 pt-3 align-items-end">
              <div className="col-7">
                <p className="text-muted small mb-0">
                  <em>* This is a computer-generated fee receipt. No physical signature is required.</em>
                </p>
                <p className="text-muted small mb-0">
                  For fee inquiries, contact: accounts@educore.edu.in
                </p>
              </div>
              <div className="col-5 text-center">
                <div className="border-top pt-2">
                  <div className="fw-bold text-dark small">Accounts Officer / Cashier</div>
                  <div className="text-muted" style={{ fontSize: '0.75rem' }}>EduCore Public School</div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="modal-footer border-top bg-light d-print-none py-2 px-4">
            <button type="button" className="btn btn-secondary px-4" onClick={onClose}>
              Close
            </button>
            <button type="button" className="btn btn-primary px-4" onClick={handlePrint}>
              <i className="bi bi-printer-fill me-1"></i> Print Receipt
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeeReceiptModal;
