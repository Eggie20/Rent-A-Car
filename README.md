# 🚗 The Middle Man - Car Rental Marketplace Frontend

A complete, modern, responsive web-based car rental marketplace frontend system for Manolo Fortich. This is a B2B2C platform connecting renters with local rental merchants.

## 📋 Project Overview

**The Middle Man** is a fully functional car rental aggregator platform built with vanilla JavaScript, semantic HTML, and CSS. It features:

- ✅ Complete renter booking flow
- ✅ Merchant registration and dashboard
- ✅ Advanced search and filtering
- ✅ Vehicle comparison tool
- ✅ Booking status tracking
- ✅ Dark mode support
- ✅ Fully responsive design
- ✅ LocalStorage persistence
- ✅ Mock data with 20+ vehicles and 5 merchants

## 🗂️ Project Structure

```
the-middle-man/
├── pages/
│   ├── index.html                 # Home page
│   ├── vehicles.html              # Vehicle search & listing
│   ├── vehicle-detail.html        # Vehicle details with booking widget
│   ├── booking.html               # Booking form (multi-step)
│   ├── booking-status.html        # Booking status tracking
│   ├── merchant-login.html        # Merchant auth (login/register)
│   ├── merchant-dashboard.html    # Merchant dashboard
│   ├── add-vehicle.html           # Add/edit vehicle form
│   ├── about.html                 # About us page
│   ├── contact.html               # Contact form & info
│   ├── faq.html                   # FAQ with search
│   ├── terms.html                 # Terms & conditions
│   └── privacy.html               # Privacy policy
├── components/
│   ├── header.html                # Navigation bar
│   └── footer.html                # Footer
├── assets/
│   ├── css/
│   │   ├── main.css               # Base styles & design system
│   │   ├── responsive.css         # Mobile/tablet/desktop breakpoints
│   │   ├── animations.css         # Transitions & animations
│   │   ├── vehicles.css           # Vehicle listing page styles
│   │   ├── detail.css             # Vehicle detail page styles
│   │   ├── booking.css            # Booking form styles
│   │   ├── status.css             # Booking status styles
│   │   ├── auth.css               # Authentication styles
│   │   └── dashboard.css          # Merchant dashboard styles
│   └── js/
│       ├── utils.js               # Utilities, storage, mock data
│       ├── app.js                 # App shell, theme toggle, nav
│       ├── home.js                # Home page logic
│       ├── search.js              # Search, filter, sort, compare
│       ├── vehicle-detail.js      # Vehicle detail & booking widget
│       ├── booking.js             # Booking form submission
│       ├── booking-status.js      # Booking status tracking
│       ├── merchant-auth.js       # Merchant login/register
│       └── merchant-dashboard.js  # Merchant dashboard logic
└── README.md
```

## 🚀 Quick Start

### Opening the Project

1. **Open in Browser**: Double-click `pages/index.html` or use:
   ```bash
   start "" "d:\JESSEL\Client-3\the-middle-man\pages\index.html"
   ```

2. **Using a Local Server** (recommended):
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js (with http-server)
   npx http-server
   ```
   Then visit: `http://localhost:8000/the-middle-man/pages/index.html`

## 📱 Pages & Features

### For Renters

#### 1. **Home Page** (`index.html`)
- Hero section with search widget
- Featured vehicles carousel
- Why Choose Us section
- How It Works (3-step process)
- Merchant spotlight
- Customer testimonials
- Call-to-action buttons

#### 2. **Vehicle Search** (`vehicles.html`)
- **Advanced Filters**:
  - Price range slider
  - Vehicle type checkboxes
  - Transmission, seating, fuel type
  - Merchant rating filter
  - Features checklist
- **Sorting Options**:
  - Recommended, Price (low/high), Top Rated, Most Reviewed
- **View Modes**: Grid and List view
- **Comparison Tool**: Select up to 3 vehicles to compare
- **Pagination**: 12 items per page
- **Favorites**: Heart icon to save vehicles

#### 3. **Vehicle Details** (`vehicle-detail.html`)
- Image gallery with thumbnails
- Vehicle specifications
- Merchant information
- Customer reviews with ratings
- **Sticky Booking Widget**:
  - Date/time pickers
  - Automatic price calculation
  - Total cost breakdown
  - "Send Booking Request" button
- Similar vehicles carousel

#### 4. **Booking Form** (`booking.html`)
- **Multi-step Progress Indicator** (5 steps)
- **Personal Information**:
  - Full name, email, phone, address
  - Emergency contact
- **Document Upload**:
  - Valid ID upload
  - Driver's license upload
  - Drag & drop support
- **Special Requests** textarea
- **Sticky Summary Sidebar**:
  - Vehicle details
  - Dates and duration
  - Price breakdown
  - Total amount
- Form validation with error messages

#### 5. **Booking Status** (`booking-status.html`)
- **Status Timeline**:
  - Request Submitted ✓
  - Awaiting Merchant Approval (auto-simulates after 5 seconds)
  - Payment Pending
  - Booking Confirmed
- **Booking Details Card**
- **Activity Timeline** with notifications
- **Action Buttons**: Continue Shopping, Cancel, Contact Support

### For Merchants

#### 6. **Merchant Login** (`merchant-login.html`)
- **Login Form**:
  - Email/password fields
  - Remember me checkbox
  - Forgot password link
  - Demo credentials: `merchant@test.com` / `merchant123`
- **Registration Section**:
  - Benefits list
  - Registration modal with multi-step form
  - Document upload (Business Permit, DTI/SEC)
  - Business information form

#### 7. **Merchant Dashboard** (`merchant-dashboard.html`)
- **Sidebar Navigation** with collapsible menu
- **Overview Tab**:
  - Stats cards (vehicles, requests, rentals, revenue, rating)
  - Recent bookings list
  - Quick action buttons
- **Pending Requests Tab**:
  - Renter information
  - Booking details
  - Approve/Reject buttons
  - Contact renter options
- **My Fleet Tab**:
  - Vehicle grid with edit/delete options
  - Add new vehicle button
  - Status toggle (Active/Inactive)
- **Active Rentals Tab**: Current ongoing rentals
- **Booking History Tab**: Completed rentals
- **Revenue Tab**: Revenue charts and reports
- **Reviews Tab**: Customer reviews and ratings
- **Settings Tab**: Profile, payment, notifications

#### 8. **Add Vehicle** (`add-vehicle.html`)
- **Vehicle Information**:
  - Name, brand, model, year
  - Seating, transmission, fuel type
  - Plate number
- **Pricing**:
  - Daily, weekly, monthly rates
  - Security deposit
- **Features Checklist**: AC, Bluetooth, GPS, etc.
- **Rental Terms**:
  - Allowed destinations
  - Minimum rental period
  - Mileage limits
- **Photo Upload**: Drag & drop multiple images
- **Form Validation** with error messages

### Information Pages

#### 9. **About Us** (`about.html`)
- Mission & Vision statements
- Company values
- Statistics (vehicles, merchants, customers, rating)
- Benefits for renters and merchants

#### 10. **Contact Us** (`contact.html`)
- Contact information cards (phone, email, address)
- Contact form with validation
- FAQ section
- Business hours display

#### 11. **FAQ** (`faq.html`)
- Searchable FAQ items
- Category filters (All, Renters, Merchants, Payment, Booking)
- Expandable accordion items
- Contact support CTA

#### 12. **Terms & Conditions** (`terms.html`)
- Platform usage terms
- User responsibilities
- Payment terms
- Cancellation policy
- Liability limitations
- Dispute resolution

#### 13. **Privacy Policy** (`privacy.html`)
- Data collection statement
- How data is used
- Security measures
- User rights
- Contact for privacy concerns

## 🎨 Design System

### Color Palette
```css
Primary: #1e40af (Deep Blue)
Secondary: #f59e0b (Amber/Gold)
Success: #10b981 (Green)
Danger: #ef4444 (Red)
Info: #3b82f6 (Light Blue)
```

### Typography
- **Headings**: Montserrat (Bold, 800)
- **Body**: Inter (Regular, 400)
- **Font Sizes**: 12px, 14px, 16px, 18px, 24px, 32px, 48px

### Spacing System
- Base unit: 4px
- Scale: 4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px

### Border Radius
- Small: 4px
- Medium: 8px
- Large: 12px
- Full: 9999px

## 🔧 Key Features

### 1. **Search & Filter System**
- Real-time filtering with instant results
- Price range slider
- Multiple checkbox filters
- Radio button selections
- Filter counter badges
- "Clear All Filters" button

### 2. **Booking Flow**
- Multi-step form with progress indicator
- Form validation with error messages
- File upload with drag & drop
- Automatic price calculation
- Booking reference number generation
- Status tracking with timeline

### 3. **Merchant Dashboard**
- Pending requests management
- Fleet management
- Revenue tracking
- Customer reviews
- Settings management
- Responsive sidebar navigation

### 4. **Dark Mode**
- Toggle button in navigation
- Persistent preference (localStorage)
- Smooth transitions
- WCAG compliant contrast ratios

### 5. **Responsive Design**
- Mobile: 320px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px - 1279px
- Large Desktop: 1280px+

### 6. **Accessibility**
- Semantic HTML structure
- ARIA labels and roles
- Keyboard navigation support
- Focus indicators
- Alt text on images
- Color contrast compliance

### 7. **Performance**
- Lazy loading for images
- Minified CSS and JS
- Efficient DOM manipulation
- LocalStorage caching
- Smooth animations

## 💾 Data Persistence

All data is stored in **localStorage** under the key `tmm`:

```javascript
// Bookings
TMM.load('bookings', [])

// Favorites/Wishlist
TMM.load('favorites', [])

// Merchant authentication
TMM.load('merchantAuth', null)

// User preferences
TMM.load('theme', 'light')
TMM.load('viewMode', 'grid')
```

## 🧪 Demo Credentials

### Merchant Login
- **Email**: `merchant@test.com`
- **Password**: `merchant123`

### Mock Data
- **20 Vehicles** with full details (images, specs, pricing)
- **5 Merchants** with ratings and verification status
- **Sample Bookings** for testing status tracking
- **Sample Reviews** for testimonials

## 🎯 Testing Checklist

- ✅ All navigation links functional
- ✅ Search and filters work correctly
- ✅ Booking flow completes successfully
- ✅ Merchant login/registration works
- ✅ Dashboard displays correctly
- ✅ Dark mode toggles properly
- ✅ Mobile responsive on all pages
- ✅ No console errors
- ✅ Images load properly
- ✅ Forms validate correctly
- ✅ LocalStorage persistence works
- ✅ Keyboard navigation functional

## 📦 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile Safari (iOS 13+)
- Chrome Mobile (Android 8+)

## 🚀 Future Enhancements

- [ ] Backend API integration
- [ ] Real payment processing (GCash)
- [ ] Email notifications
- [ ] SMS notifications
- [ ] Real-time chat support
- [ ] Advanced analytics
- [ ] Multi-language support (i18n)
- [ ] PWA capabilities
- [ ] Service worker for offline support
- [ ] Advanced vehicle comparison
- [ ] Booking calendar
- [ ] Driver service option
- [ ] Insurance options
- [ ] Vehicle tracking (GPS)

## 📝 Notes

- This is a **frontend prototype** with mock data
- No backend server required
- All data is stored locally in the browser
- Perfect for demonstrations and prototyping
- Ready for backend integration

## 📞 Support

For questions or issues, contact: support@themiddleman.ph

---

**Built with ❤️ for The Middle Man Car Rental Marketplace**
