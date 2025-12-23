# NebsIT Assessment - Frontend

A modern, responsive React application for managing employee notices, departments, and employee information. Built with React 19, Vite, and a clean component architecture.

![React](https://img.shields.io/badge/React-19.2.0-blue)
![Vite](https://img.shields.io/badge/Vite-7.2.4-purple)
![License](https://img.shields.io/badge/License-MIT-green)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Components](#components)
- [API Integration](#api-integration)
- [Development Guidelines](#development-guidelines)
- [Build for Production](#build-for-production)
- [Troubleshooting](#troubleshooting)

## ✨ Features

### Notice Management
- ✅ **Create Notices** - Create notices for individuals or departments
- ✅ **View Notices** - View detailed notice information in a modal
- ✅ **Edit Notices** - Update existing notices with full editing capabilities
- ✅ **Delete Notices** - Remove notices (future implementation)
- ✅ **Draft System** - Save notices as drafts before publishing
- ✅ **Smart Status** - Draft, Published, and Unpublished status based on publish date
- ✅ **File Attachments** - Upload and manage multiple file attachments
- ✅ **Multi-select Notice Types** - Select multiple notice categories

### Advanced Filtering & Search
- 🔍 **Full-text Search** - Search by title, content, employee name, or employee ID
- 🎯 **Filter by Target** - Filter by department or individual
- 📊 **Filter by Status** - Filter by Draft, Published, or Unpublished
- 📅 **Date Filtering** - Filter by published date
- 🔄 **Reset Filters** - Clear all filters with one click

### Employee & Department Management
- 👥 **Employee Integration** - Auto-fill employee details when selected
- 🏢 **Department Integration** - Manage department-wide notices
- 📋 **Real-time Data** - Live data fetching from backend API

### UI/UX Features
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, professional interface
- ⚡ **Fast Performance** - Optimized with React 19 and Vite
- 🔄 **Pagination** - Efficient data loading with pagination
- 💾 **Auto-save** - Preserve form state during editing
- 🎯 **Validation** - Client-side validation with error messages

## 🛠 Tech Stack

### Core
- **React** 19.2.0 - UI library
- **Vite** 7.2.4 - Build tool and dev server
- **JavaScript (ES6+)** - Programming language

### UI Components
- **Lucide React** - Icon library
- **Custom CSS** - Styled components

### Development Tools
- **ESLint** - Code linting
- **Hot Module Replacement (HMR)** - Fast refresh during development

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn** (v1.22.0 or higher)
- **Backend API** running on `http://localhost:5000`

Check your versions:
```bash
node --version
npm --version
```

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "NebsIT Assessment/frontend/nebsit-assessment"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Verify installation**
   ```bash
   npm list --depth=0
   ```

## ⚙️ Configuration

### API Configuration

The frontend connects to the backend API. Configure the API base URL in:

**File:** `src/services/api.js`

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

**Production Configuration:**
```javascript
const API_BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';
```

### Environment Variables (Optional)

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=NebsIT Notice Management
```

## 🏃 Running the Application

### Development Mode

Start the development server with hot reload:

```bash
npm run dev
```

The application will be available at:
- **Local:** http://localhost:5173
- **Network:** Use `--host` flag to expose

### Preview Production Build

Build and preview the production version:

```bash
npm run build
npm run preview
```

### Linting

Check code quality:

```bash
npm run lint
```

## 📁 Project Structure

```
nebsit-assessment/
├── public/                  # Static files
├── src/
│   ├── assets/             # Images, fonts, static assets
│   ├── components/         # React components
│   │   ├── CreateNotice.jsx       # Create notice form
│   │   ├── CreateNotice.css
│   │   ├── EditNotice.jsx         # Edit notice modal
│   │   ├── EditNotice.css
│   │   ├── ViewNotice.jsx         # View notice modal
│   │   ├── ViewNotice.css
│   │   ├── NoticeManagement.jsx   # Main notice list
│   │   ├── NoticeManagement.css
│   │   ├── Header.jsx             # App header
│   │   ├── Header.css
│   │   ├── Sidebar.jsx            # Navigation sidebar
│   │   └── Sidebar.css
│   ├── services/           # API integration
│   │   └── api.js                 # API service layer
│   ├── App.jsx             # Main App component
│   ├── App.css             # App styles
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── index.html              # HTML template
├── package.json            # Dependencies
├── vite.config.js          # Vite configuration
├── eslint.config.js        # ESLint configuration
└── README.md               # This file
```

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint to check code quality |

## 🧩 Components

### Core Components

#### **NoticeManagement**
Main component for displaying and managing notices.

**Features:**
- Paginated notice list
- Advanced filtering (status, target, date, search)
- Bulk selection
- View/Edit/Delete actions
- Real-time stats (active notices, drafts)

**Props:**
```javascript
<NoticeManagement onCreateNotice={handleCreateNotice} />
```

#### **CreateNotice**
Form component for creating new notices.

**Features:**
- Target selection (Individual/Department)
- Multi-select notice types
- Date picker for publish date
- Rich text editor for notice body
- File upload with drag & drop
- Draft or Publish options

**Props:**
```javascript
<CreateNotice onBack={handleBack} />
```

#### **EditNotice**
Modal component for editing existing notices.

**Features:**
- Pre-filled form data
- Update all notice fields
- Manage existing attachments
- Add new attachments
- Save as draft or publish

**Props:**
```javascript
<EditNotice 
  noticeId={selectedId} 
  onClose={handleClose}
  onSuccess={handleSuccess}
/>
```

#### **ViewNotice**
Modal component for viewing notice details.

**Features:**
- Display all notice information
- Status badge (Draft/Published/Unpublished)
- Download attachments
- Formatted dates
- Employee/Department info

**Props:**
```javascript
<ViewNotice 
  noticeId={selectedId} 
  onClose={handleClose}
/>
```

#### **Header**
Application header with branding and navigation.

#### **Sidebar**
Navigation sidebar for different sections.

### Component Communication

```
App.jsx
  ├── Header
  ├── Sidebar
  └── NoticeManagement
        ├── ViewNotice (Modal)
        └── EditNotice (Modal)
        
CreateNotice (Separate View)
```

## 🔌 API Integration

### API Service Layer

All API calls are centralized in `src/services/api.js`.

**Available APIs:**

```javascript
// Notices
noticeAPI.getAll(params)        // Get all notices with filters
noticeAPI.getById(id)           // Get single notice
noticeAPI.create(data)          // Create new notice
noticeAPI.update(id, data)      // Update notice
noticeAPI.delete(id)            // Delete notice
noticeAPI.uploadFiles(files)    // Upload attachments

// Departments
departmentAPI.getAll()          // Get all departments
departmentAPI.getById(id)       // Get single department

// Employees
employeeAPI.getAll(params)      // Get all employees
employeeAPI.getById(id)         // Get single employee
```

**Example Usage:**

```javascript
import { noticeAPI } from '../services/api';

// Fetch notices with filters
const fetchNotices = async () => {
  const params = {
    page: 1,
    limit: 10,
    status: 1,
    search: 'meeting'
  };
  
  const response = await noticeAPI.getAll(params);
  if (response.success) {
    console.log(response.data);
  }
};
```

### API Response Format

**Success Response:**
```javascript
{
  success: true,
  data: { ... },
  pagination: {
    total: 50,
    page: 1,
    limit: 10,
    totalPages: 5
  }
}
```

**Error Response:**
```javascript
{
  success: false,
  message: "Error description",
  errors: ["Validation error 1", ...]
}
```

## 👨‍💻 Development Guidelines

### Code Style

1. **Component Structure:**
   ```javascript
   // Imports
   import React, { useState } from 'react';
   
   // Component
   const MyComponent = ({ prop1, prop2 }) => {
     // State
     const [state, setState] = useState();
     
     // Effects
     useEffect(() => {}, []);
     
     // Handlers
     const handleClick = () => {};
     
     // Render
     return <div>...</div>;
   };
   
   export default MyComponent;
   ```

2. **Naming Conventions:**
   - Components: PascalCase (`NoticeManagement.jsx`)
   - Functions: camelCase (`handleSubmit`)
   - Constants: UPPER_CASE (`API_BASE_URL`)
   - CSS classes: kebab-case (`notice-management`)

3. **File Organization:**
   - One component per file
   - Co-locate CSS files with components
   - Separate business logic into services

### State Management

The application uses React's built-in state management:

- **useState** - Component-level state
- **useEffect** - Side effects and data fetching
- **Props** - Parent-to-child communication
- **Callbacks** - Child-to-parent communication

### Error Handling

```javascript
try {
  const response = await noticeAPI.getAll();
  if (response.success) {
    setData(response.data);
  }
} catch (error) {
  console.error('Error:', error);
  setError(error.message);
}
```

### Best Practices

- ✅ Use functional components with hooks
- ✅ Implement proper error boundaries
- ✅ Add loading states for async operations
- ✅ Validate user inputs
- ✅ Handle edge cases (empty states, errors)
- ✅ Use semantic HTML
- ✅ Ensure accessibility (ARIA labels)
- ✅ Optimize re-renders with useMemo/useCallback when needed

## 🏗 Build for Production

### Build the Application

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### Build Output

```
dist/
├── assets/
│   ├── index-[hash].js      # Bundled JavaScript
│   └── index-[hash].css     # Bundled CSS
└── index.html               # Entry HTML
```

### Deployment

#### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

#### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

#### Deploy to Custom Server

1. Build the application:
   ```bash
   npm run build
   ```

2. Copy `dist/` folder to your web server

3. Configure your web server to:
   - Serve `index.html` for all routes (SPA routing)
   - Enable gzip compression
   - Set proper cache headers

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name yourdomain.com;
    root /path/to/dist;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /assets {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

## 🐛 Troubleshooting

### Common Issues

#### 1. **Port Already in Use**

```bash
Error: Port 5173 is already in use
```

**Solution:**
- Vite automatically tries another port (5174, 5175, etc.)
- Or kill the process using the port:
  ```bash
  # Linux/Mac
  lsof -ti:5173 | xargs kill -9
  
  # Windows
  netstat -ano | findstr :5173
  taskkill /PID <PID> /F
  ```

#### 2. **API Connection Errors**

```
Error: Failed to fetch notices
```

**Solution:**
- Ensure backend is running on `http://localhost:5000`
- Check API_BASE_URL in `src/services/api.js`
- Verify CORS is enabled on backend
- Check browser console for detailed errors

#### 3. **Module Not Found**

```bash
Error: Cannot find module 'lucide-react'
```

**Solution:**
```bash
npm install lucide-react
# or
npm install
```

#### 4. **Build Errors**

```bash
npm run build
# Error: ...
```

**Solution:**
- Clear node_modules and reinstall:
  ```bash
  rm -rf node_modules package-lock.json
  npm install
  ```
- Update dependencies:
  ```bash
  npm update
  ```

#### 5. **Hot Reload Not Working**

**Solution:**
- Restart dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache
- Check file watchers limit (Linux):
  ```bash
  echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
  sudo sysctl -p
  ```

### Getting Help

If you encounter issues:

1. Check the browser console for errors
2. Check the terminal for server errors
3. Verify backend API is running
4. Review the [Backend API Documentation](../../backend/API_DOCUMENTATION.md)

## 📝 Key Features Explained

### Status Logic

The application implements intelligent status handling:

- **Draft** - `status = 0`
- **Published** - `status = 1` AND `published_date <= today`
- **Unpublished** - `status = 1` AND `published_date > today`

This allows scheduling notices for future publication.

### Filter System

Filters are combined using query parameters:

```javascript
// Example: Get published notices for IT department
const params = {
  status: 1,
  publishStatus: 'published',
  target: 1,
  department_id: 'xxx'
};
```

### Search Functionality

Search works across multiple fields:
- Notice title
- Notice body
- Employee name
- Employee code

Backend performs the search and returns matching results.

## 🚀 Performance Optimization

- **Code Splitting** - Vite automatically splits code
- **Lazy Loading** - Components loaded on demand
- **Memoization** - Prevent unnecessary re-renders
- **Pagination** - Load data in chunks
- **Debouncing** - Delay search API calls

## 🔒 Security Considerations

- Input validation on client and server
- XSS prevention through React's built-in escaping
- File upload validation (type, size)
- No sensitive data in client-side code
- HTTPS recommended for production

## 📄 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support or questions:
- Email: nabeelahsanofficial@gmail.com
- Documentation: [Backend API Docs](../../backend/API_DOCUMENTATION.md)

---

**Built with ❤️ using React and Vite**

Last Updated: December 23, 2025  
Version: 1.0.0
