# Multi-Branch Academic Calendar Harmonizer

A production-ready React application for managing academic calendars across multiple branches with intelligent conflict detection and resolution.

## 🚀 Features

### Core Functionality
- **JWT Authentication** with automatic token management
- **Role-Based Access Control** (ADMIN/REVIEWER)
- **Interactive Calendar** with FullCalendar integration
- **Conflict Detection** with real-time alerts
- **Branch Management** with status controls
- **Responsive Design** for all devices

### UI/UX Excellence
- **Modern Design** with Tailwind CSS
- **Smooth Animations** with Framer Motion
- **Professional Color Palette** (Slate/Indigo)
- **Toast Notifications** for user feedback
- **Loading States** and error handling
- **Accessibility** compliant components

## 🛠 Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Calendar**: FullCalendar
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Notifications**: React Hot Toast
- **Icons**: Lucide React

## 📦 Installation

1. **Clone and navigate to the project:**
```bash
cd academic-calendar-pro
```

2. **Install dependencies:**
```bash
npm install
```

3. **Start development server:**
```bash
npm run dev
```

4. **Build for production:**
```bash
npm run build
```

## 🏗 Architecture

### API Integration
- Centralized Axios instance with JWT interceptor
- Automatic token attachment to all requests
- 401/403 error handling with auto-redirect
- Request/response interceptors for error management

### Authentication Flow
- Split-screen login/register page
- JWT token storage in localStorage
- Context-based user state management
- Protected route guards

### Component Structure
```
src/
├── components/
│   ├── Layout.jsx              # Main layout wrapper
│   ├── Sidebar.jsx             # Collapsible navigation
│   ├── TopBar.jsx              # User info and logout
│   ├── ProtectedRoute.jsx      # Route authentication
│   ├── ClashNotificationCenter.jsx  # Conflict alerts
│   └── EventModal.jsx          # Event creation/editing
├── pages/
│   ├── AuthPage.jsx            # Login/Register
│   ├── Dashboard.jsx           # Main calendar view
│   └── BranchManagement.jsx    # Admin branch controls
├── context/
│   └── AuthContext.jsx         # Authentication state
└── utils/
    └── api.js                  # Axios configuration
```

## 🎨 Design System

### Color Palette
- **Primary**: Indigo (500-700)
- **Neutral**: Slate (50-900)
- **Success**: Green (500-600)
- **Warning**: Orange (500-600)
- **Error**: Red (500-600)

### Shadows
- **Soft**: Subtle depth for cards
- **Medium**: Enhanced elevation for modals

### Typography
- **Headings**: Bold, hierarchical sizing
- **Body**: Readable, accessible contrast
- **Labels**: Medium weight, proper spacing

## 🔐 Security Features

- JWT token automatic attachment
- Role-based component rendering
- Protected route authentication
- Secure token storage
- Session expiry handling

## 📱 Responsive Design

- **Mobile First**: Optimized for mobile devices
- **Collapsible Sidebar**: Space-efficient navigation
- **Touch Friendly**: Proper touch targets
- **Adaptive Layout**: Flexible grid system

## 🎯 Key Components

### Dashboard
- FullCalendar integration with multiple views
- Color-coded events by branch
- Click-to-create events (Admin only)
- Event editing and deletion
- Branch legend display

### Clash Detection
- Real-time conflict alerts
- Severity-based color coding
- Dismissible notifications
- One-click resolution

### Branch Management
- Data table with status toggles
- Inline editing capabilities
- Soft delete functionality
- Activity tracking

## 🚦 Usage

### For Administrators
1. Login with admin credentials
2. Create/edit events via calendar clicks
3. Manage branch status in Branch Management
4. Resolve conflicts in Clash Alerts
5. Monitor system activity

### For Reviewers
1. Login with reviewer credentials
2. View calendar events (read-only)
3. Check conflict notifications
4. Access profile settings

## 🔧 Configuration

### Backend Integration
Ensure your Spring Boot backend is running on `http://localhost:8080` with the following endpoints:

- `POST /auth/login` - Authentication
- `POST /auth/register` - User registration
- `GET /api/events` - Fetch events
- `POST /api/events` - Create event
- `PUT /api/events/{id}` - Update event
- `DELETE /api/events/{id}` - Delete event
- `GET /api/branches` - Fetch branches
- `PUT /api/branches/{id}/status` - Update branch status
- `GET /api/clashes/unresolved` - Fetch conflicts
- `PUT /api/clashes/{id}/resolve` - Resolve conflict

### Environment Variables
Create a `.env` file for custom configuration:
```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Academic Calendar Harmonizer
```

## 🎭 Animations

- **Page Transitions**: Smooth enter/exit animations
- **Loading States**: Rotating spinners
- **Button Interactions**: Scale on hover/tap
- **Modal Animations**: Scale and fade effects
- **List Animations**: Staggered item reveals

## 📊 Performance

- **Code Splitting**: Route-based lazy loading
- **Optimized Builds**: Vite's fast bundling
- **Efficient Rendering**: React best practices
- **Minimal Bundle**: Tree-shaking enabled

## 🧪 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Guidelines
- Follow React best practices
- Use TypeScript for type safety
- Implement proper error boundaries
- Write accessible components
- Optimize for performance

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

---

**Built with ❤️ for Academic Excellence**