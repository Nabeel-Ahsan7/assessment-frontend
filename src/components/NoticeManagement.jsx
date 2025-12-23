import React, { useState, useEffect } from 'react';
import { FileText, Calendar, Eye, Edit, MoreVertical, ChevronLeft, ChevronRight } from 'lucide-react';
import './NoticeManagement.css';
import { noticeAPI, departmentAPI, employeeAPI } from '../services/api';
import ViewNotice from './ViewNotice';
import EditNotice from './EditNotice';

const NoticeManagement = ({ onCreateNotice }) => {
    const [activeNotices, setActiveNotices] = useState(0);
    const [draftNotices, setDraftNotices] = useState(0);

    // Filter states
    const [filterType, setFilterType] = useState('');
    const [filterSearch, setFilterSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDate, setFilterDate] = useState('');
    const [selectedNotices, setSelectedNotices] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Data states
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedNoticeId, setSelectedNoticeId] = useState(null);

    // Fetch notices from API
    useEffect(() => {
        fetchNotices();
    }, [currentPage, filterType, filterSearch, filterStatus, filterDate]);

    const fetchNotices = async () => {
        try {
            setLoading(true);
            setError(null);

            // Build query parameters
            const params = {
                page: currentPage,
                limit: 10
            };

            // Add filters
            if (filterType === 'department') {
                params.target = 1;
            } else if (filterType === 'individual') {
                params.target = 0;
            }

            if (filterStatus === 'publish') {
                params.status = 1;
                params.publishStatus = 'published'; // Only published (past/today dates)
            } else if (filterStatus === 'unpublished') {
                params.status = 1;
                params.publishStatus = 'unpublished'; // Only unpublished (future dates)
            } else if (filterStatus === 'draft') {
                params.status = 0;
            }

            if (filterDate) {
                params.published_date = filterDate;
            }

            if (filterSearch) {
                params.search = filterSearch;
            }

            const response = await noticeAPI.getAll(params);

            if (response.success) {
                setNotices(response.data);
                setTotalPages(response.pagination.totalPages);

                // Calculate stats - active means published and date is today or past
                const today = new Date();
                today.setHours(0, 0, 0, 0);

                const active = response.data.filter(n => {
                    if (n.status === 0) return false;
                    if (!n.published_date) return true;
                    const publishDate = new Date(n.published_date);
                    publishDate.setHours(0, 0, 0, 0);
                    return publishDate <= today;
                }).length;

                const draft = response.data.filter(n => n.status === 0).length;
                setActiveNotices(active);
                setDraftNotices(draft);
            }
        } catch (err) {
            console.error('Error fetching notices:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Sample data - only used as fallback
    const sampleNotices = [
        {
            id: 1,
            title: 'Annual Company Meeting 2024',
            noticeType: 'General',
            target: 'All Employees',
            publishedOn: '2024-01-15',
            status: 'Published'
        },
        {
            id: 2,
            title: 'IT Department System Maintenance',
            noticeType: 'Department',
            target: 'IT Department',
            publishedOn: '2024-01-20',
            status: 'Published'
        },
        {
            id: 3,
            title: 'New Policy Update - Remote Work',
            noticeType: 'Policy',
            target: 'All Employees',
            publishedOn: '',
            status: 'Draft'
        },
        {
            id: 4,
            title: 'HR Benefits Program 2024',
            noticeType: 'HR',
            target: 'All Employees',
            publishedOn: '2024-01-10',
            status: 'Unpublished'
        },
        {
            id: 5,
            title: 'Team Building Event Notice',
            noticeType: 'Event',
            target: 'Marketing Department',
            publishedOn: '2024-01-25',
            status: 'Published'
        },
        {
            id: 6,
            title: 'Security Protocol Update',
            noticeType: 'Security',
            target: 'All Employees',
            publishedOn: '2024-01-18',
            status: 'Published'
        },
        {
            id: 7,
            title: 'Quarterly Performance Review',
            noticeType: 'HR',
            target: 'Sales Department',
            publishedOn: '',
            status: 'Draft'
        },
        {
            id: 8,
            title: 'Holiday Schedule 2024',
            noticeType: 'General',
            target: 'All Employees',
            publishedOn: '2024-01-12',
            status: 'Unpublished'
        }
    ];

    const handleResetFilters = () => {
        setFilterType('');
        setFilterSearch('');
        setFilterStatus('');
        setFilterDate('');
        setCurrentPage(1);
    };

    const handleSelectAll = (e) => {
        if (e.target.checked) {
            setSelectedNotices(notices.map(n => n._id));
        } else {
            setSelectedNotices([]);
        }
    };

    const handleSelectNotice = (id) => {
        if (selectedNotices.includes(id)) {
            setSelectedNotices(selectedNotices.filter(nId => nId !== id));
        } else {
            setSelectedNotices([...selectedNotices, id]);
        }
    };

    // Helper function to format notice type
    const formatNoticeType = (types) => {
        if (!types || types.length === 0) return '-';
        const fullText = types.join(', ');
        if (fullText.length > 30) {
            return fullText.substring(0, 30) + '...';
        }
        return fullText;
    };

    // Helper function to get full notice type for tooltip
    const getFullNoticeType = (types) => {
        if (!types || types.length === 0) return '-';
        return types.join(', ');
    };

    // Helper function to format target
    const formatTarget = (notice) => {
        if (notice.target === 0) {
            return notice.employee_id ? `${notice.employee_id.name} (${notice.employee_id.employee_code})` : 'Individual';
        } else {
            return notice.department_id ? notice.department_id.name : 'Department';
        }
    };

    // Helper function to format date
    const formatDate = (date) => {
        if (!date) return '-';
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    };

    // Helper function to get status text
    const getStatusText = (status, publishedDate) => {
        if (status === 0) {
            return 'Draft';
        }

        // Check if published_date is in the future
        if (publishedDate) {
            const publishDate = new Date(publishedDate);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            publishDate.setHours(0, 0, 0, 0);

            if (publishDate > today) {
                return 'Unpublished';
            }
        }

        return 'Published';
    };

    // Handle view notice
    const handleViewNotice = (noticeId) => {
        setSelectedNoticeId(noticeId);
        setViewModalOpen(true);
    };

    // Handle edit notice
    const handleEditNotice = (noticeId) => {
        setSelectedNoticeId(noticeId);
        setEditModalOpen(true);
    };

    // Handle close modals
    const handleCloseModals = () => {
        setViewModalOpen(false);
        setEditModalOpen(false);
        setSelectedNoticeId(null);
    };

    // Handle successful edit
    const handleEditSuccess = () => {
        fetchNotices();
    };

    return (
        <div className="notice-management-wrapper">
            {error && (
                <div style={{
                    padding: '10px',
                    background: '#fee',
                    color: '#c00',
                    borderRadius: '4px',
                    marginBottom: '20px'
                }}>
                    Error: {error}
                </div>
            )}

            <div className="notice-management">
                {/* Left Side - Title and Stats */}
                <div className="notice-left">
                    <h1 className="notice-title">Notice Management</h1>
                    <div className="notice-stats">
                        <span className="stat-item stat-active">
                            Active Notices : <span className="stat-value">{activeNotices}</span>
                        </span>
                        <span className="stat-separator">|</span>
                        <span className="stat-item stat-draft">
                            Draft Notice : <span className="stat-value">{String(draftNotices).padStart(2, '0')}</span>
                        </span>
                    </div>
                </div>

                {/* Right Side - Action Buttons */}
                <div className="notice-right">
                    <button className="btn-create-notice" onClick={onCreateNotice}>
                        <span className="btn-icon">+</span>
                        Create Notice
                    </button>
                    <button className="btn-draft-notice">
                        <FileText size={20} className="draft-icon" />
                        All Draft Notice
                    </button>
                </div>
            </div>

            {/* Filter Section */}
            <div className="notice-filter">
                <span className="filter-label">Filter By:</span>
                <div className="filter-controls">
                    <select
                        className="filter-dropdown filter-type"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <option value="">Department or Individual</option>
                        <option value="department">Department</option>
                        <option value="individual">Individual</option>
                    </select>

                    <input
                        type="text"
                        className="filter-textbox"
                        placeholder="Employee ID or Name"
                        value={filterSearch}
                        onChange={(e) => setFilterSearch(e.target.value)}
                    />

                    <select
                        className="filter-dropdown filter-status"
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                    >
                        <option value="">Status</option>
                        <option value="publish">Published</option>
                        <option value="unpublished">Unpublished</option>
                        <option value="draft">Draft</option>
                    </select>

                    <div className="filter-date-wrapper">
                        <span className="filter-date-label">Published On</span>
                        <Calendar size={16} className="calendar-icon" />
                        <input
                            type="date"
                            className="filter-date"
                            value={filterDate}
                            onChange={(e) => setFilterDate(e.target.value)}
                        />
                    </div>

                    <button
                        className="btn-reset-filter"
                        onClick={handleResetFilters}
                    >
                        Reset Filters
                    </button>
                </div>
            </div>

            {/* Employee List Table */}
            <div className="employee-list-container">
                <div className="employee-list-table">
                    {/* Table Header */}
                    <div className="table-header">
                        <div className="table-cell cell-checkbox">
                            <input
                                type="checkbox"
                                className="table-checkbox"
                                checked={selectedNotices.length === notices.length}
                                onChange={handleSelectAll}
                            />
                        </div>
                        <div className="table-cell cell-title">Title</div>
                        <div className="table-cell cell-notice-type">Notice Type</div>
                        <div className="table-cell cell-target">Departments/Individual</div>
                        <div className="table-cell cell-published">Published On</div>
                        <div className="table-cell cell-status">Status</div>
                        <div className="table-cell cell-actions">Actions</div>
                    </div>

                    {/* Table Body */}
                    <div className="table-body">
                        {loading ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                Loading notices...
                            </div>
                        ) : notices.length === 0 ? (
                            <div style={{ padding: '20px', textAlign: 'center' }}>
                                No notices found
                            </div>
                        ) : (
                            notices.map((notice) => (
                                <div key={notice._id} className="table-row">
                                    <div className="table-cell cell-checkbox">
                                        <input
                                            type="checkbox"
                                            className="table-checkbox"
                                            checked={selectedNotices.includes(notice._id)}
                                            onChange={() => handleSelectNotice(notice._id)}
                                        />
                                    </div>
                                    <div className="table-cell cell-title">{notice.title}</div>
                                    <div className="table-cell cell-notice-type" title={getFullNoticeType(notice.type)}>
                                        {formatNoticeType(notice.type)}
                                    </div>
                                    <div className="table-cell cell-target">{formatTarget(notice)}</div>
                                    <div className="table-cell cell-published">
                                        {formatDate(notice.published_date)}
                                    </div>
                                    <div className="table-cell cell-status">
                                        <span className={`status-badge status-${getStatusText(notice.status, notice.published_date).toLowerCase()}`}>
                                            {getStatusText(notice.status, notice.published_date)}
                                        </span>
                                    </div>
                                    <div className="table-cell cell-actions">
                                        <button
                                            className="action-btn btn-view"
                                            title="View"
                                            onClick={() => handleViewNotice(notice._id)}
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            className="action-btn btn-edit"
                                            title="Edit"
                                            onClick={() => handleEditNotice(notice._id)}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button className="action-btn btn-more" title="More options">
                                            <MoreVertical size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Pagination */}
                <div className="pagination">
                    <button
                        className="pagination-arrow"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft size={16} />
                    </button>

                    {[...Array(totalPages)].map((_, index) => (
                        <button
                            key={index + 1}
                            className={`pagination-number ${currentPage === index + 1 ? 'active' : ''}`}
                            onClick={() => setCurrentPage(index + 1)}
                        >
                            {index + 1}
                        </button>
                    ))}

                    <button
                        className="pagination-arrow"
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                    >
                        <ChevronRight size={16} />
                    </button>
                </div>
            </div>

            {/* Modals */}
            {viewModalOpen && selectedNoticeId && (
                <ViewNotice
                    noticeId={selectedNoticeId}
                    onClose={handleCloseModals}
                />
            )}

            {editModalOpen && selectedNoticeId && (
                <EditNotice
                    noticeId={selectedNoticeId}
                    onClose={handleCloseModals}
                    onSuccess={handleEditSuccess}
                />
            )}
        </div>
    );
};

export default NoticeManagement;
