import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Building2, FileText, Download } from 'lucide-react';
import './ViewNotice.css';
import { noticeAPI } from '../services/api';

const IMG_BASE_URL = import.meta.env.VITE_IMG_BASE_URL || 'http://localhost:5000';

const ViewNotice = ({ noticeId, onClose }) => {
    const [notice, setNotice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotice();
    }, [noticeId]);

    const fetchNotice = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await noticeAPI.getById(noticeId);
            if (response.success) {
                setNotice(response.data);
            }
        } catch (err) {
            console.error('Error fetching notice:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (date) => {
        if (!date) return 'Not set';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getStatusText = (status, publishedDate) => {
        if (status === 0) return 'Draft';
        if (publishedDate) {
            const publishDate = new Date(publishedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            publishDate.setHours(0, 0, 0, 0);
            if (publishDate > today) return 'Unpublished';
        }
        return 'Published';
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="view-notice-modal">
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        Loading notice...
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="modal-overlay">
                <div className="view-notice-modal">
                    <div style={{ padding: '40px', textAlign: 'center', color: '#c00' }}>
                        Error: {error}
                    </div>
                    <button onClick={onClose} className="btn-close-modal">Close</button>
                </div>
            </div>
        );
    }

    if (!notice) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="view-notice-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Notice Details</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    {/* Status Badge */}
                    <div className="notice-status-section">
                        <span className={`status-badge-large status-${getStatusText(notice.status, notice.published_date).toLowerCase()}`}>
                            {getStatusText(notice.status, notice.published_date)}
                        </span>
                    </div>

                    {/* Title */}
                    <div className="detail-section">
                        <h3 className="detail-title">Title</h3>
                        <p className="detail-content">{notice.title}</p>
                    </div>

                    {/* Meta Info Grid */}
                    <div className="meta-grid">
                        <div className="meta-item">
                            <div className="meta-label">
                                <Calendar size={16} />
                                <span>Published Date</span>
                            </div>
                            <div className="meta-value">{formatDate(notice.published_date)}</div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">
                                <FileText size={16} />
                                <span>Notice Type</span>
                            </div>
                            <div className="meta-value">
                                {notice.type && notice.type.length > 0 ? notice.type.join(', ') : 'Not specified'}
                            </div>
                        </div>

                        <div className="meta-item">
                            <div className="meta-label">
                                {notice.target === 0 ? <User size={16} /> : <Building2 size={16} />}
                                <span>Target</span>
                            </div>
                            <div className="meta-value">
                                {notice.target === 0 ? (
                                    notice.employee_id ? (
                                        <span>
                                            {notice.employee_id.name} ({notice.employee_id.employee_code})
                                        </span>
                                    ) : 'Individual'
                                ) : (
                                    notice.department_id ? notice.department_id.name : 'Department'
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Notice Body */}
                    <div className="detail-section">
                        <h3 className="detail-title">Notice Body</h3>
                        <div className="detail-content notice-body">
                            {notice.notice_body}
                        </div>
                    </div>

                    {/* Attachments */}
                    {notice.attachments && notice.attachments.length > 0 && (
                        <div className="detail-section">
                            <h3 className="detail-title">Attachments</h3>
                            <div className="attachments-list">
                                {notice.attachments.map((attachment, index) => (
                                    <a
                                        key={index}
                                        href={`${IMG_BASE_URL}${attachment}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="attachment-item"
                                    >
                                        <Download size={16} />
                                        <span>Attachment {index + 1}</span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-close-modal" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewNotice;
