import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Calendar, Upload, X } from 'lucide-react';
import './CreateNotice.css';
import { noticeAPI, departmentAPI, employeeAPI } from '../services/api';

const CreateNotice = ({ onBack }) => {
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
        attachments: []
    });
    const [isNoticeTypeOpen, setIsNoticeTypeOpen] = useState(false);
    const multiSelectRef = useRef(null);

    // Data states
    const [departments, setDepartments] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const noticeTypeOptions = [
        'Warning / Disciplinary',
        'Performance Improvement',
        'Appreciation / Recognition',
        'Attendance / Leave Issue',
        'Payroll / Compensation',
        'Contract / Role Update',
        'Advisory / Personal Reminder'
    ];

    // Fetch departments and employees on mount
    useEffect(() => {
        fetchDepartments();
        fetchEmployees();
    }, []);

    // Fetch departments
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

    // Fetch employees
    const fetchEmployees = async (departmentId = null) => {
        try {
            const params = departmentId ? { department_id: departmentId } : {};
            const response = await employeeAPI.getAll(params);
            if (response.success) {
                setEmployees(response.data);
            }
        } catch (err) {
            console.error('Error fetching employees:', err);
        }
    };

    // Handle employee selection and auto-fill
    const handleEmployeeSelect = async (employeeId) => {
        handleInputChange('employeeId', employeeId);

        if (employeeId) {
            const selectedEmployee = employees.find(emp => emp._id === employeeId);
            if (selectedEmployee) {
                handleInputChange('employeeName', selectedEmployee.name);
                handleInputChange('position', selectedEmployee.department_id?._id || '');
            }
        } else {
            handleInputChange('employeeName', '');
            handleInputChange('position', '');
        }
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (multiSelectRef.current && !multiSelectRef.current.contains(event.target)) {
                setIsNoticeTypeOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

    const handleDrop = (e) => {
        e.preventDefault();
        const files = Array.from(e.dataTransfer.files);
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

    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleCancel = () => {
        if (onBack) onBack();
    };

    const handleSaveDraft = async () => {
        await handleSubmit(0); // 0 = Draft
    };

    const handlePublish = async () => {
        await handleSubmit(1); // 1 = Published
    };

    const handleSubmit = async (status) => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Validate required fields
            if (!formData.noticeTitle || formData.noticeTitle.trim() === '') {
                setError('Notice title is required');
                return;
            }

            if (formData.noticeTypes.length === 0) {
                setError('Please select at least one notice type');
                return;
            }

            if (!formData.noticeBody || formData.noticeBody.trim() === '') {
                setError('Notice body is required');
                return;
            }

            if (!formData.target) {
                setError('Please select target (Individual or Department)');
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

            // Upload attachments first if any
            let attachmentUrls = [];
            if (formData.attachments.length > 0) {
                const files = formData.attachments.map(att => att.file);
                const uploadResponse = await noticeAPI.uploadFiles(files);
                if (uploadResponse.success) {
                    attachmentUrls = uploadResponse.data;
                }
            }

            // Prepare notice data for API
            const noticeData = {
                title: formData.noticeTitle,
                type: formData.noticeTypes,
                notice_body: formData.noticeBody,
                target: formData.target === 'individual' ? 0 : 1,
                status: status,
                attachments: attachmentUrls
            };

            // Add publish date if provided, otherwise use current date for published notices
            if (formData.publishDate) {
                noticeData.published_date = formData.publishDate;
            } else if (status === 1) {
                // If publishing without a date, use today's date
                noticeData.published_date = new Date().toISOString().split('T')[0];
            }

            // Add employee or department
            if (formData.target === 'individual') {
                noticeData.employee_id = formData.employeeId;
            } else {
                noticeData.department_id = formData.department;
            }

            // Create notice
            const response = await noticeAPI.create(noticeData);

            if (response.success) {
                setSuccess(status === 1 ? 'Notice published successfully!' : 'Notice saved as draft!');

                // Reset form after 2 seconds
                setTimeout(() => {
                    if (onBack) onBack();
                }, 2000);
            }
        } catch (err) {
            console.error('Error creating notice:', err);
            setError(err.message || 'Failed to create notice');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-notice-page">
            {/* Page Header */}
            <div className="page-header">
                <button className="back-button" onClick={handleCancel}>
                    <ArrowLeft size={20} />
                </button>
                <h1 className="page-title">Create a Notice</h1>
            </div>

            {/* Error and Success Messages */}
            {error && (
                <div style={{
                    padding: '12px',
                    background: '#fee',
                    color: '#c00',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #fcc'
                }}>
                    {error}
                </div>
            )}

            {success && (
                <div style={{
                    padding: '12px',
                    background: '#efe',
                    color: '#070',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    border: '1px solid #cfc'
                }}>
                    {success}
                </div>
            )}

            {/* Main Form Card */}
            <div className="form-card">
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

                {/* Department Selection - Conditional */}
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

                {/* Employee Information - Conditional 3-Column Grid */}
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
                                    placeholder="Employee name"
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
                                    <option value="">Employee department</option>
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

                {/* Notice Meta - 2-Column Grid */}
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
                                    style={{ colorScheme: 'light' }}
                                />
                                {!formData.publishDate && (
                                    <span className="date-placeholder">Select Publishing Date</span>
                                )}
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
                    />
                </div>

                {/* Attachment Upload */}
                <div className="form-section">
                    <label className="form-label">Attachment</label>
                    <div
                        className="upload-zone"
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={() => document.getElementById('file-input').click()}
                    >
                        <Upload size={40} className="upload-icon" />
                        <div className="upload-text">
                            <p className="upload-main-text">Upload nominee profile image or drag and drop</p>
                            <p className="upload-sub-text">Accepted File Type: jpg, png, pdf</p>
                        </div>
                        <input
                            id="file-input"
                            type="file"
                            multiple
                            accept=".jpg,.png,.pdf"
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                        />
                    </div>

                    {/* Uploaded Files */}
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

                {/* Footer Actions */}
                <div className="form-footer">
                    <button className="btn-cancel" onClick={handleCancel} disabled={loading}>
                        Cancel
                    </button>
                    <button className="btn-draft" onClick={handleSaveDraft} disabled={loading}>
                        {loading ? 'Saving...' : 'Save as Draft'}
                    </button>
                    <button className="btn-publish" onClick={handlePublish} disabled={loading}>
                        {loading ? 'Publishing...' : 'Publish Notice'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateNotice;
