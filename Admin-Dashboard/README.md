# Admin Dashboard - Sample Integration

## Overview
This is a fully functional admin dashboard with integrated admin modules from the-middle-man project. The dashboard includes 12 main sections with data management capabilities.

## Files Created/Modified

### 1. **index.html** (Updated)
- Complete dashboard structure with 12 navigation items
- Dashboard overview with KPIs and charts
- Data tables for each module (Users, Vehicles, Bookings, Payments, Merchants, Reviews, Security, Admins)
- Responsive design with sidebar and header
- Theme toggle (Light/Dark mode)

### 2. **mockdb.js** (New)
- Mock database implementation using localStorage
- Generates 200+ users, 80 vehicles, 300 bookings, 250 payments, 150 reviews
- Provides CRUD operations (Create, Read, Update, Delete)
- Query functionality with filters
- Auto-seeding on first load

### 3. **admin-modules.js** (New)
- 11 admin modules:
  - **UsersModule** - User management (view, edit, delete)
  - **VehiclesModule** - Vehicle inventory management
  - **BookingsModule** - Booking management
  - **PaymentsModule** - Payment tracking
  - **MerchantsModule** - Merchant management
  - **ReviewsModule** - Review moderation
  - **ContentModule** - CMS placeholder
  - **ReportsModule** - Analytics
  - **SettingsModule** - Configuration
  - **SecurityModule** - Audit logs
  - **AdminsModule** - Admin account management

### 4. **script.js** (Updated)
- Integrated all admin modules
- View switching functionality
- Theme management
- Search functionality
- Chart initialization
- Module reinitialization on view change

### 5. **style.css** (Existing)
- No changes needed - uses existing styles

## Features

### Dashboard Overview
- **KPI Cards**: Total Users, Vehicles, Bookings, Revenue
- **Charts**: Bookings trend (line chart), Revenue by category (doughnut chart)
- **Recent Bookings Table**: Quick view of latest bookings

### Users Module
- View all users with search
- Filter by status
- View user details
- Delete users
- Real-time data from mock database

### Vehicles Module
- Browse vehicle inventory
- Search by brand, model, or license plate
- Filter by type
- View vehicle details
- Manage availability status

### Bookings Module
- View all bookings
- Search by booking ID
- See user and vehicle details
- Track booking status
- View total price

### Payments Module
- Transaction history
- Search payments
- Filter by status
- View payment methods
- Track amounts

### Merchants Module
- Merchant list with ratings
- Search functionality
- Status tracking (approved, pending, suspended)
- View merchant details
- Delete merchants

### Reviews Module
- Review moderation interface
- Approve/reject reviews
- View ratings and comments
- Filter by status
- Search reviews

### Security Module
- Audit logs display
- Admin actions tracking
- IP address logging
- Status indicators
- Timestamp tracking

### Admins Module
- Administrator list
- Role-based display (super, editor, viewer)
- 2FA status
- Last login tracking
- Status indicators

## How to Use

### 1. Open the Dashboard
```
Open index.html in a web browser
```

### 2. Navigate Between Sections
- Click on sidebar menu items to switch views
- Each section loads relevant data from mock database
- Search boxes filter data in real-time

### 3. Perform Actions
- **View Details**: Click "View" button to see full information
- **Delete**: Click "Delete" button to remove items
- **Approve/Reject**: For reviews, use action buttons
- **Search**: Use search inputs to filter data

### 4. Theme Toggle
- Click on user profile menu
- Select Light or Dark theme
- Theme preference is saved to localStorage

## Data Structure

### Users
```javascript
{
  id: "U0001",
  name: "Juan Dela Cruz",
  email: "user@example.com",
  phone: "+63 9XX XXX XXXX",
  status: "active|inactive|pending",
  verified: true,
  createdAt: "2024-01-01T00:00:00Z",
  rating: 4.5
}
```

### Vehicles
```javascript
{
  id: "V0001",
  brand: "Toyota",
  model: "Camry",
  year: 2024,
  licensePlate: "ABC1234",
  type: "sedan|suv|van",
  pricePerDay: 2500,
  available: true,
  status: "active|pending|suspended"
}
```

### Bookings
```javascript
{
  id: "B00001",
  userId: "U0001",
  vehicleId: "V0001",
  status: "pending|confirmed|active|completed|cancelled|disputed",
  startDate: "2024-01-01T00:00:00Z",
  endDate: "2024-01-07T00:00:00Z",
  totalPrice: 15000
}
```

## API Methods

### MockDatabase
```javascript
const db = new MockDatabase();

// Get all records
db.getAll('users');

// Get by ID
db.getById('users', 'U0001');

// Add new record
db.add('users', { name: 'John', email: 'john@example.com' });

// Update record
db.update('users', 'U0001', { status: 'active' });

// Delete record
db.delete('users', 'U0001');

// Query with filters
db.query('users', [
  { field: 'status', op: 'eq', value: 'active' }
]);
```

## Module Methods

### UsersModule
```javascript
UsersModule.init(database);
UsersModule.loadUsers();
UsersModule.filterUsers(query);
UsersModule.showUserDetails(userId);
UsersModule.deleteUser(userId);
```

### VehiclesModule
```javascript
VehiclesModule.init(database);
VehiclesModule.loadVehicles();
VehiclesModule.filterVehicles(query);
VehiclesModule.showVehicleDetails(vehicleId);
VehiclesModule.deleteVehicle(vehicleId);
```

### Similar methods available for all other modules

## Customization

### Add New Module
1. Create new module in `admin-modules.js`:
```javascript
window.NewModule = (function() {
  const Module = {
    db: null,
    init(database) {
      this.db = database;
      // Initialize
    }
  };
  return Module;
})();
```

2. Add view in `index.html`:
```html
<div class="dashboard-view" id="newmodule">
  <!-- Content -->
</div>
```

3. Add navigation item:
```html
<a href="#" class="dashboard-nav-item" data-view="newmodule">
  <span class="nav-icon material-symbols-rounded">icon_name</span>
  <span class="nav-label">New Module</span>
</a>
```

### Modify Data
Edit `mockdb.js` seeding functions to change:
- Number of records
- Data values
- Field names
- Relationships

## Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance Notes
- Mock database uses localStorage (5-10MB limit)
- Displays 10 records per table (pagination can be added)
- Charts render on dashboard load
- Search is real-time with 300ms debounce

## Future Enhancements
- [ ] Pagination for large datasets
- [ ] Advanced filtering options
- [ ] Export to CSV/PDF
- [ ] Real API integration
- [ ] User authentication
- [ ] Role-based access control
- [ ] Real-time notifications
- [ ] Data validation forms
- [ ] Bulk operations
- [ ] Activity logging

## License
MIT

## Support
For issues or questions, refer to the-middle-man project documentation.
