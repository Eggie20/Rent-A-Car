# Quick Start Guide

## Installation

1. **Copy all files to your project folder:**
   - `index.html`
   - `style.css` (existing)
   - `script.js`
   - `mockdb.js`
   - `admin-modules.js`

2. **Open in browser:**
   ```
   Open index.html in any modern web browser
   ```

3. **That's it!** The dashboard is ready to use.

## What You Get

### 12 Dashboard Sections:
1. **Dashboard** - Overview with KPIs and charts
2. **Users** - 200+ users with search and management
3. **Vehicles** - 80 vehicles with inventory management
4. **Bookings** - 300 bookings with status tracking
5. **Payments** - 250 transactions with payment methods
6. **Merchants** - 20 merchants with approval system
7. **Reviews** - 150 reviews with moderation
8. **Content** - CMS placeholder
9. **Reports** - Analytics placeholder
10. **Settings** - Configuration placeholder
11. **Security** - 100 audit logs
12. **Admins** - 5 admin accounts

## Key Features

### Navigation
- Click sidebar items to switch views
- Mobile-responsive menu
- Smooth transitions

### Search
- Real-time search in each module
- Filters data as you type
- Works across all tables

### Theme
- Light/Dark mode toggle
- Click user profile → select theme
- Preference saved automatically

### Data Management
- View details of any record
- Delete records with confirmation
- Approve/reject reviews
- Real-time updates

## Common Tasks

### Search for a User
1. Click "Users" in sidebar
2. Type in search box
3. Results filter automatically

### View Vehicle Details
1. Click "Vehicles" in sidebar
2. Click "View" button on any vehicle
3. See full details in toast notification

### Approve a Review
1. Click "Reviews" in sidebar
2. Click "Approve" or "Reject" button
3. Status updates immediately

### Delete a Merchant
1. Click "Merchants" in sidebar
2. Click "Delete" button
3. Confirm deletion
4. Record removed from table

### Check Security Logs
1. Click "Security" in sidebar
2. View all admin actions
3. See IP addresses and timestamps

## Data Examples

### Sample User
```
Name: Juan Dela Cruz 1
Email: user1@example.com
Phone: +63 912 345 6789
Status: Active
Joined: Jan 15, 2024
```

### Sample Vehicle
```
Brand: Toyota Camry
License Plate: ABC1234
Year: 2024
Type: Sedan
Price: ₱2,500/day
Status: Available
```

### Sample Booking
```
ID: B00001
User: Maria Santos
Vehicle: Honda Civic
Status: Confirmed
Total: ₱15,000
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Esc` | Close user menu |
| `Tab` | Navigate elements |
| `Enter` | Confirm actions |

## Tips & Tricks

1. **Refresh Data**: Reload page to reset all data
2. **Clear Storage**: Open DevTools → Application → Clear localStorage
3. **Export Data**: Use browser's print function (Ctrl+P)
4. **Mobile View**: Resize browser to test responsive design
5. **Dark Mode**: Better for night viewing

## Troubleshooting

### Data Not Showing?
- Check browser console for errors
- Ensure all 3 JS files are loaded
- Clear browser cache and reload

### Search Not Working?
- Make sure you're typing in the search box
- Check that data exists in the table
- Try refreshing the page

### Theme Not Saving?
- Check if localStorage is enabled
- Try a different browser
- Clear browser cookies

### Charts Not Displaying?
- Ensure Chart.js CDN is loaded
- Check browser console for errors
- Try refreshing the page

## File Sizes

| File | Size | Purpose |
|------|------|---------|
| index.html | ~20KB | Main structure |
| script.js | ~15KB | Logic & interactions |
| admin-modules.js | ~25KB | Module functionality |
| mockdb.js | ~8KB | Database |
| style.css | ~30KB | Styling (existing) |

## Browser Compatibility

✅ Chrome 90+
✅ Firefox 88+
✅ Safari 14+
✅ Edge 90+
✅ Mobile browsers

## Next Steps

1. **Customize**: Edit colors, fonts, and layout in style.css
2. **Add Data**: Modify mockdb.js seeding functions
3. **Extend**: Create new modules following the pattern
4. **Integrate**: Connect to real API endpoints
5. **Deploy**: Upload to your server

## Support Resources

- Check README.md for detailed documentation
- Review admin-modules.js for code examples
- Inspect HTML structure in browser DevTools
- Check browser console for error messages

## Quick Links

- **Dashboard**: Click logo or "Dashboard" in sidebar
- **Search**: Use search box in header
- **Theme**: Click user avatar → select theme
- **Menu**: Click hamburger icon on mobile

---

**Happy Dashboard Building! 🚀**
