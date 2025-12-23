const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to handle API responses
const handleResponse = async (response) => {
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
    }

    return data;
};

// Notice API endpoints
export const noticeAPI = {
    // Get all notices with filters and pagination
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/notices${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        return handleResponse(response);
    },

    // Get single notice by ID
    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/notices/${id}`);
        return handleResponse(response);
    },

    // Create new notice
    create: async (noticeData) => {
        const response = await fetch(`${API_BASE_URL}/notices`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noticeData),
        });
        return handleResponse(response);
    },

    // Update notice
    update: async (id, noticeData) => {
        const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(noticeData),
        });
        return handleResponse(response);
    },

    // Delete notice
    delete: async (id) => {
        const response = await fetch(`${API_BASE_URL}/notices/${id}`, {
            method: 'DELETE',
        });
        return handleResponse(response);
    },

    // Upload files
    uploadFiles: async (files) => {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        const response = await fetch(`${API_BASE_URL}/notices/upload`, {
            method: 'POST',
            body: formData,
        });
        return handleResponse(response);
    },
};

// Department API endpoints
export const departmentAPI = {
    getAll: async () => {
        const response = await fetch(`${API_BASE_URL}/departments`);
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/departments/${id}`);
        return handleResponse(response);
    },
};

// Employee API endpoints
export const employeeAPI = {
    getAll: async (params = {}) => {
        const queryString = new URLSearchParams(params).toString();
        const url = `${API_BASE_URL}/employees${queryString ? `?${queryString}` : ''}`;

        const response = await fetch(url);
        return handleResponse(response);
    },

    getById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/employees/${id}`);
        return handleResponse(response);
    },
};
