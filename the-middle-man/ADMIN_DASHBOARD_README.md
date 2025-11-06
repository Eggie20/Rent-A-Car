# Admin Dashboard System - The Middle Man

A comprehensive, modern, and fully responsive admin dashboard system for managing the car rental platform.

## 🎯 Overview

The Admin Dashboard provides complete management capabilities for:
- Users Management
- Vehicles Management
- Bookings Management
- Payments & Transactions
- Merchants Management
- Reviews & Ratings
- Content Management
- Reports & Analytics
- System Settings
- Security & Logs
- Admin Management

## 📁 Project Structure

```
the-middle-man/
├── pages/
│   ├── admin-dashboard.html          # Main dashboard page
│   └── admin-login.html              # Admin login page
├── assets/
│   ├── css/
│   │   ├── main.css                  # Base styles & theme variables
│   │   ├── admin-dashboard.css       # Dashboard-specific styles
│   │   ├── animations.css            # Animation utilities
│   │   └── [other page styles]
│   └── js/
│       ├── admin/
│       │   ├── dashboard.js          # Main dashboard module
│       ���   ├── users.js              # Users management
│       │   ├── vehicles.js           # Vehicles management
│       │   ├── bookings.js           # Bookings management
│       │   ├── payments.js           # Payments management
│       │   ├── merchants.js          # Merchants management
│       │   ├── reviews.js            # Reviews management
│       │   ├── content.js            # Content management
│       │   ├── reports.js            # Reports & analytics
│       │   ├── settings.js           # System settings
│       │   ├── security.js           # Security & logs
│       │   └── admins.js             # Admin management
│       ├── components/
│       │   ├── charts.js             # Chart.js integration
│       │   ├── modal.js              # Modal component
│       │   ├── notifications.js      # Toast notifications
│       │   └── tables.js             # Table utilities
│       ├── mockdb.js                 # Mock database
│       ├── utils.js                  # Utility functions
│       └── [other scripts]
└── components/
    ├── header.html
    └── footer.html
```

## 🎨 Design Features

### Color Scheme
- **Primary**: Deep Blue (#1E40AF)
- **Secondary**: Amber (#F59E0B)
- **Success**: Green (#10B981)
- **Danger**: Red (#EF4444)
- **Info**: Light Blue (#3B82F6)

### Typography
- **Font Family**: Inter (body), Montserrat (headings)
- **Font Weights**: 400, 500, 600, 700, 800

### Responsive Breakpoints
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: Below 768px
- **Small Mobile**: Below 480px

## 🚀 Features

### Dashboard Overview
- Key Performance Indicators (KPIs)
- Revenue trend chart
- Booking status distribution
- User growth analytics
- Popular vehicles chart
- Recent activity feed

### Users Management
- View all users with detailed information
- Search and filter by status
- Add/Edit/Delete users
- User profile details
- Status tracking (Active, Inactive, Pending)

### Vehicles Management
- Grid view of all vehicles
- Search and filter by type
- Vehicle details (brand, model, license plate, price)
- Availability status
- Add/Edit/Delete vehicles
- Photo upload preview

### Bookings Management
- Complete booking list with filters
- Search by booking ID, user, or vehicle
- Filter by date range and status
- Booking details view
- Edit/Cancel functionality

### Payments Management
- Payment summary cards
- Transaction history
- Search and filter capabilities
- Export to CSV
- Payment status tracking

### Merchants Management
- Merchant list with performance metrics
- Search and filter by status
- Merchant approval/rejection
- Suspension options
- Performance summary

### Reviews & Ratings
- Display all customer reviews
- Filter by rating
- Approve/Reject reviews
- Moderation capabilities
- Star rating display

### Content Management
- Manage multiple content sections
- Policy, FAQ, About Us, Terms of Service
- Rich text editor
- Dynamic content updates
- No page refresh required

### Reports & Analytics
- Visual reports with metrics
- Date range selection
- Export to PDF/CSV
- Dynamic loading with indicators
- Comprehensive data analysis

### System Settings
- Site configuration
- Theme preferences
- Timezone settings
- Currency selection
- Save confirmation feedback

### Security & Logs
- Login logs display
- Activity tracking
- IP address tracking
- Timestamp recording
- Export logs functionality
- Clear logs option

### Admin Management
- Administrator account management
- Role-based access control (Super Admin, Editor, Viewer)
- Two-factor authentication status
- Last login tracking
- Add/Edit/Remove admins

## 🔐 Authentication

### Login Flow
1. Navigate to `admin-login.html`
2. Enter credentials (Demo: admin@themiddleman.ph / admin123456)
3. Optional 2FA code entry
4. Session stored in sessionStorage
5. Auto-redirect to dashboard on successful login

### Session Management
- Session stored in `tmm.session.admin`
- Expiration time tracking
- Auto-logout on expiration
- Protected page access

## 🎯 Module System

Each module is self-contained and follows this pattern:

```javascript
window.ModuleName = (function() {
  const Module = {
    db: null,
    
    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadData();
    },
    
    setupEventListeners() {
      // Event binding
    },
    
    loadData() {
      // Data loading
    }
  };
  
  return Module;
})();
```

## 🎨 Dark/Light Mode

- Toggle button in topbar
- Persisted in localStorage (`tmm.theme`)
- CSS variables automatically adjust
- Smooth transitions between modes

## 📱 Responsive Design

### Desktop (1024px+)
- Full sidebar navigation
- Multi-column layouts
- All features visible

### Tablet (768px - 1023px)
- Collapsible sidebar
- 2-column grid layouts
- Optimized spacing

### Mobile (Below 768px)
- Hamburger menu
- Single column layouts
- Touch-friendly buttons
- Optimized font sizes

## 🔧 Customization

### Adding a New Module

1. Create module file: `assets/js/admin/newmodule.js`
2. Add module container in HTML
3. Add navigation link in sidebar
4. Initialize in dashboard.js

### Changing Colors

Edit CSS variables in `assets/css/main.css`:

```css
:root {
  --primary: #1e40af;
  --secondary: #f59e0b;
  /* ... */
}
```

### Adding Charts

Use Chart.js integration in `components/charts.js`:

```javascript
window.initCharts(ctx, 'line', data, options);
```

## 📊 Data Management

### Mock Database
- In-memory data storage
- CRUD operations
- Query capabilities
- Located in `assets/js/mockdb.js`

### Collections
- users
- vehicles
- bookings
- payments
- merchants
- reviews
- logs
- admins

## 🎯 Keyboard Shortcuts

- `Escape`: Close modals
- `Ctrl+K`: Global search (future)
- `Ctrl+/`: Help menu (future)

## 🔔 Notifications

Toast notifications for user feedback:

```javascript
window.showToast('Message', 'success'); // success, error, info
```

## 📈 Performance Optimizations

- Lazy loading for images
- Skeleton loaders for data
- Debounced search
- Efficient DOM updates
- CSS animations with GPU acceleration
- Minified assets

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🔐 Security Features

- Session-based authentication
- XSS protection (HTML escaping)
- CSRF token support (ready)
- Input validation
- Secure password handling
- Activity logging

## 📝 Usage Examples

### Switching Modules
```javascript
ModuleManager.switchModule('users');
```

### Showing Toast
```javascript
window.showToast('User created successfully', 'success');
```

### Showing Confirmation
```javascript
window.showConfirmation(
  'Delete User',
  'Are you sure?',
  () => { /* callback */ }
);
```

## 🚀 Getting Started

1. Open `pages/admin-dashboard.html` in browser
2. Login with demo credentials
3. Navigate using sidebar
4. Explore different modules

## 📚 Dependencies

- Chart.js 4.4.1 (CDN)
- Font Awesome 6.5.0 (CDN)
- Google Fonts (Inter, Montserrat)

## 🎓 Best Practices

1. **Semantic HTML**: Use proper HTML5 elements
2. **Accessibility**: ARIA labels and roles
3. **Responsive**: Mobile-first approach
4. **Performance**: Optimize images and scripts
5. **Security**: Validate and sanitize inputs
6. **Maintainability**: Modular code structure

## 🐛 Troubleshooting

### Dashboard not loading
- Check browser console for errors
- Verify all script files are loaded
- Clear browser cache

### Modules not working
- Ensure MockDatabase is initialized
- Check module initialization order
- Verify event listeners are attached

### Styling issues
- Clear CSS cache
- Check CSS variable definitions
- Verify responsive breakpoints

## 📞 Support

For issues or questions, refer to the main project documentation or contact the development team.

## 📄 License

Part of The Middle Man car rental platform.

---

**Last Updated**: 2024
**Version**: 1.0.0
