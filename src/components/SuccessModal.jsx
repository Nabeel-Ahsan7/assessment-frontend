import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import './SuccessModal.css';

const SuccessModal = ({ noticeTitle, onViewNotice, onCreateAnother, onClose }) => {
    return (
        <div className="success-modal-overlay">
            <div className="success-modal">
                <div className="success-icon">
                    <CheckCircle2 size={96} strokeWidth={2} fill="#10B981" color="white" />
                </div>

                <h2 className="success-title">Notice Published Successfully</h2>
                <p className="success-message">
                    Your notice <strong>{noticeTitle}</strong> has been published and is now visible to all selected departments.
                </p>

                <div className="success-actions">
                    <button className="success-btn view-btn" onClick={onViewNotice}>
                        View Notice
                    </button>
                    <button className="success-btn create-btn" onClick={onCreateAnother}>
                        + Create Another
                    </button>
                    <button className="success-btn close-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SuccessModal;
