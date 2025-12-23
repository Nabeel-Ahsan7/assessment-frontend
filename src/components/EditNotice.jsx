import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Upload } from 'lucide-react';
import './EditNotice.css';
import { noticeAPI, departmentAPI, employeeAPI } from '../services/api';

const EditNotice = ({ noticeId, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        target: '',
        department: '',
        noticeTitle: '',
        employeeId: '',
        employeeName: '',
        position: '',
        noticeTypes: [],
        publishDate: '',
        noticeBody: '',
        attachments: [],
        existingAttachments: []
    });

    const [isNoticeTypeOpen, setIsNoticeTypeOpen] = useState(false);
    const multiSelectRef = useRef(null);

    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);

    const noticeTypeOptions = [
        'Warning / Disciplinary',
        'Performance Improvement',
        'Appreciation / Recognition',
        'Attendance / Leave Issue',
        'Payroll / Compensation',
        'Contract / Role Update',
        'Advisory / Personal Reminder'
    ];

    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
        fetchNotice();
    }, [noticeId]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (multiSelectRef.current && !multiSelectRef.current.contains(event.target)) {
                setIsNoticeTypeOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const fetchNotice = async () => {
        try {
            setLoading(true);
            const response = await noticeAPI.getById(noticeId);
            if (response.success) {
                const notice = response.data;
                setFormData({
                    target: notice.target === 0 ? 'individual' : 'department',
                    department: notice.department_id?._id || '',
                    noticeTitle: notice.title,
                    employeeId: notice.employee_id?._id || '',
                    employeeName: notice.employee_id?.name || '',
                    position: notice.employee_id?.department_id || '',
                    noticeTypes: notice.type || [],
                    publishDate: notice.published_date ? notice.published_date.split('T')[0] : '',
                    noticeBody: notice.notice_body,
                    attachments: [],
                    existingAttachments: notice.attachments || []
                });
            }
        } catch (err) {
            console.error('Error fetching notice:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await departmentAPI.getAll();
            if (response.success) {
                setDepartments(response.data);
            }
        } catch (err) {
            console.error('Error fetching departments:', err);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await employeeAPI.getAll();
            if (response.success) {
                setEmployees(response.data);
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleEmployeeSelect = (employeeId) => {
        handleInputChange('employeeId', employeeId);
        if (employeeId) {
            const selectedEmployee = employees.find(emp => emp._id === employeeId);
            if (selectedEmployee) {
                handleInputChange('employeeName', selectedEmployee.name);
                handleInputChange('position', selectedEmployee.department_id?._id || '');
            }
        }
    };

    const toggleNoticeType = (type) => {
        setFormData(prev => ({
            ...prev,
            noticeTypes: prev.noticeTypes.includes(type)
                ? prev.noticeTypes.filter(t => t !== type)
                : [...prev.noticeTypes, type]
        }));
    };

    const handleFileUpload = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map(file => ({
            id: Date.now() + Math.random(),
            name: file.name,
            file: file
        }));
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...newFiles]
        }));
    };

    const removeAttachment = (id) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter(att => att.id !== id)
        }));
    };

    const removeExistingAttachment = (url) => {
        setFormData(prev => ({
            ...prev,
            existingAttachments: prev.existingAttachments.filter(att => att !== url)
        }));
    };

    const handleSubmit = async (status) => {
        try {
            setSaving(true);
            setError(null);

            // Validation
            if (!formData.noticeTitle.trim()) {
                setError('Notice title is required');
                return;
            }
            if (formData.noticeTypes.length === 0) {
                setError('Please select at least one notice type');
                return;
            }
            if (!formData.noticeBody.trim()) {
                setError('Notice body is required');
                return;
            }
            if (!formData.target) {
                setError('Please select target');
                return;
            }
            if (formData.target === 'individual' && !formData.employeeId) {
                setError('Please select an employee');
                return;
            }
            if (formData.target === 'department' && !formData.department) {
                setError('Please select a department');
                return;
            }

            // Upload new attachments
            let newAttachmentUrls = [];
            if (formData.attachments.length > 0) {
                const files = formData.attachments.map(att => att.file);
                const uploadResponse = await noticeAPI.uploadFiles(files);
                if (uploadResponse.success) {
                    newAttachmentUrls = uploadResponse.data;
                }
            }

            // Combine existing and new attachments
            const allAttachments = [...formData.existingAttachments, ...newAttachmentUrls];

            // Prepare update data
            const updateData = {
                title: formData.noticeTitle,
                type: formData.noticeTypes,
                notice_body: formData.noticeBody,
                target: formData.target === 'individual' ? 0 : 1,
                status: status,
                attachments: allAttachments
            };

            if (formData.publishDate) {
                updateData.published_date = formData.publishDate;
            }

            if (formData.target === 'individual') {
                updateData.employee_id = formData.employeeId;
            } else {
                updateData.department_id = formData.department;
            }

            const response = await noticeAPI.update(noticeId, updateData);

            if (response.success) {
                if (onSuccess) onSuccess();
                onClose();
            }
        } catch (err) {
            console.error('Error updating notice:', err);
            setError(err.message || 'Failed to update notice');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="edit-notice-modal">
                    <div style={{ padding: '40px', textAlign: 'center' }}>
                        Loading notice...
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="edit-notice-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <h2 className="modal-title">Edit Notice</h2>
                    <button className="btn-close" onClick={onClose}>
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="modal-content">
                    {error && (
                        <div className="error-message">
                            {error}
                        </div>
                    )}

                    {/* Target Selection */}
                    <div className="form-section">
                        <label className="form-label">Target Department(s) or Individual *</label>
                        <select
                            className="form-select"
                            value={formData.target}
                            onChange={(e) => handleInputChange('target', e.target.value)}
                        >
                            <option value="">Select target</option>
                            <option value="individual">Individual</option>
                            <option value="department">Department</option>
                        </select>
                    </div>

                    {/* Department Selection */}
                    {formData.target === 'department' && (
                        <div className="form-section">
                            <label className="form-label">Select Department *</label>
                            <select
                                className="form-select"
                                value={formData.department}
                                onChange={(e) => handleInputChange('department', e.target.value)}
                            >
                                <option value="">Select department</option>
                                {departments.map((dept) => (
                                    <option key={dept._id} value={dept._id}>
                                        {dept.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Notice Title */}
                    <div className="form-section">
                        <label className="form-label">Notice Title *</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Write the Title of Notice"
                            value={formData.noticeTitle}
                            onChange={(e) => handleInputChange('noticeTitle', e.target.value)}
                        />
                    </div>

                    {/* Employee Information */}
                    {formData.target === 'individual' && (
                        <div className="form-section">
                            <div className="grid-3-columns">
                                <div className="form-field">
                                    <label className="form-label">Employee ID</label>
                                    <select
                                        className="form-select"
                                        value={formData.employeeId}
                                        onChange={(e) => handleEmployeeSelect(e.target.value)}
                                    >
                                        <option value="">Select employee ID</option>
                                        {employees.map((emp) => (
                                            <option key={emp._id} value={emp._id}>
                                                {emp.employee_code}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Employee Name</label>
                                    <input
                                        type="text"
                                        className="form-input"
                                        value={formData.employeeName}
                                        readOnly
                                    />
                                </div>
                                <div className="form-field">
                                    <label className="form-label">Department</label>
                                    <select
                                        className="form-select"
                                        value={formData.position}
                                        disabled
                                    >
                                        <option value="">Department</option>
                                        {departments.map((dept) => (
                                            <option key={dept._id} value={dept._id}>
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notice Type and Date */}
                    <div className="form-section">
                        <div className="grid-2-columns">
                            <div className="form-field">
                                <label className="form-label">Notice Type</label>
                                <div className="multi-select-container" ref={multiSelectRef}>
                                    <button
                                        type="button"
                                        className="multi-select-trigger"
                                        onClick={() => setIsNoticeTypeOpen(!isNoticeTypeOpen)}
                                    >
                                        <span className="multi-select-placeholder">
                                            {formData.noticeTypes.length > 0
                                                ? `${formData.noticeTypes.length} selected`
                                                : 'Select notice type'}
                                        </span>
                                        <svg
                                            className={`multi-select-arrow ${isNoticeTypeOpen ? 'open' : ''}`}
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                        >
                                            <path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    {isNoticeTypeOpen && (
                                        <div className="multi-select-dropdown">
                                            {noticeTypeOptions.map((option) => (
                                                <label key={option} className="multi-select-option">
                                                    <input
                                                        type="checkbox"
                                                        className="multi-select-checkbox"
                                                        checked={formData.noticeTypes.includes(option)}
                                                        onChange={() => toggleNoticeType(option)}
                                                    />
                                                    <span className="multi-select-label">{option}</span>
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="form-field">
                                <label className="form-label">Publish Date</label>
                                <div className="date-input-wrapper">
                                    <input
                                        type="date"
                                        className="form-input date-input"
                                        value={formData.publishDate}
                                        onChange={(e) => handleInputChange('publishDate', e.target.value)}
                                    />
                                    <Calendar size={18} className="calendar-icon-input" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notice Body */}
                    <div className="form-section">
                        <label className="form-label">Notice Body</label>
                        <textarea
                            className="form-textarea"
                            placeholder="Write the details about notice"
                            value={formData.noticeBody}
                            onChange={(e) => handleInputChange('noticeBody', e.target.value)}
                            rows="6"
                        />
                    </div>

                    {/* Existing Attachments */}
                    {formData.existingAttachments.length > 0 && (
                        <div className="form-section">
                            <label className="form-label">Current Attachments</label>
                            <div className="uploaded-files">
                                {formData.existingAttachments.map((url, index) => (
                                    <div key={index} className="file-chip">
                                        <span className="file-name">Attachment {index + 1}</span>
                                        <button
                                            className="remove-file-btn"
                                            onClick={() => removeExistingAttachment(url)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* New Attachments */}
                    <div className="form-section">
                        <label className="form-label">Add New Attachments</label>
                        <div className="upload-zone-small">
                            <Upload size={20} />
                            <span>Upload files</span>
                            <input
                                id="file-input-edit"
                                type="file"
                                multiple
                                accept=".jpg,.png,.pdf"
                                onChange={handleFileUpload}
                                style={{ display: 'none' }}
                            />
                        </div>
                        <button
                            type="button"
                            className="btn-upload"
                            onClick={() => document.getElementById('file-input-edit').click()}
                        >
                            Choose Files
                        </button>

                        {formData.attachments.length > 0 && (
                            <div className="uploaded-files">
                                {formData.attachments.map((attachment) => (
                                    <div key={attachment.id} className="file-chip">
                                        <span className="file-name">{attachment.name}</span>
                                        <button
                                            className="remove-file-btn"
                                            onClick={() => removeAttachment(attachment.id)}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose} disabled={saving}>
                        Cancel
                    </button>
                    <button className="btn-draft" onClick={() => handleSubmit(0)} disabled={saving}>
                        {saving ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button className="btn-publish" onClick={() => handleSubmit(1)} disabled={saving}>
                        {saving ? 'Updating...' : 'Update & Publish'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EditNotice;
