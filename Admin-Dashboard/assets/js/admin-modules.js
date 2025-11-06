// ============================================
// UTILITY FUNCTIONS
// ============================================
window.showToast = function(message, type = 'info') {
  console.log(`[${type.toUpperCase()}] ${message}`);
  // You can implement a toast UI here
};

window.showModal = function(modal) {
  if (modal) modal.style.display = 'block';
};

window.hideModal = function(modal) {
  if (modal) modal.style.display = 'none';
};

window.showConfirmation = function(title, message, onConfirm) {
  if (confirm(message)) {
    onConfirm();
  }
};

// ============================================
// USERS MODULE
// ============================================
window.UsersModule = (function() {
  'use strict';

  const Users = {
    db: null,
    currentUsers: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadUsers();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#users .search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterUsers(e.target.value));
      }
    },

    loadUsers() {
      this.currentUsers = this.db.getAll('users');
      this.renderUsersTable();
    },

    renderUsersTable() {
      const tbody = document.querySelector('#users table tbody');
      if (!tbody) return;

      if (!this.currentUsers.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No users found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentUsers.slice(0, 10).forEach(user => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(user.name)}</strong></td>
          <td>${this.escapeHtml(user.email)}</td>
          <td>${user.phone || 'N/A'}</td>
          <td><span class="status-badge ${user.status}">${this.capitalizeFirst(user.status)}</span></td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
          <td>
            <button class="btn btn-sm" onclick="UsersModule.showUserDetails('${user.id}')">View</button>
            <button class="btn btn-sm" onclick="UsersModule.deleteUser('${user.id}')">Delete</button>
          </td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterUsers(query) {
      const lowerQuery = query.toLowerCase();
      this.currentUsers = this.db.getAll('users').filter(user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery)
      );
      this.renderUsersTable();
    },

    showUserDetails(userId) {
      const user = this.db.getById('users', userId);
      if (!user) {
        window.showToast('User not found', 'error');
        return;
      }
      window.showToast(`User: ${user.name} - ${user.email}`, 'info');
    },

    deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.db.delete('users', userId);
        this.loadUsers();
        window.showToast('User deleted successfully', 'success');
      }
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Users;
})();

// ============================================
// VEHICLES MODULE
// ============================================
window.VehiclesModule = (function() {
  'use strict';

  const Vehicles = {
    db: null,
    currentVehicles: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadVehicles();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#vehicles .search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterVehicles(e.target.value));
      }
    },

    loadVehicles() {
      this.currentVehicles = this.db.getAll('vehicles');
      this.renderVehiclesTable();
    },

    renderVehiclesTable() {
      const tbody = document.querySelector('#vehicles table tbody');
      if (!tbody) return;

      if (!this.currentVehicles.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No vehicles found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentVehicles.slice(0, 10).forEach(vehicle => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(vehicle.brand)} ${this.escapeHtml(vehicle.model)}</strong></td>
          <td>${vehicle.licensePlate}</td>
          <td>${vehicle.year}</td>
          <td>${this.capitalizeFirst(vehicle.type)}</td>
          <td>₱${vehicle.pricePerDay.toLocaleString()}</td>
          <td><span class="status-badge ${vehicle.available ? 'success' : 'warning'}">${vehicle.available ? 'Available' : 'Unavailable'}</span></td>
          <td>
            <button class="btn btn-sm" onclick="VehiclesModule.showVehicleDetails('${vehicle.id}')">View</button>
            <button class="btn btn-sm" onclick="VehiclesModule.deleteVehicle('${vehicle.id}')">Delete</button>
          </td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterVehicles(query) {
      const lowerQuery = query.toLowerCase();
      this.currentVehicles = this.db.getAll('vehicles').filter(vehicle =>
        vehicle.brand.toLowerCase().includes(lowerQuery) ||
        vehicle.model.toLowerCase().includes(lowerQuery) ||
        vehicle.licensePlate.toLowerCase().includes(lowerQuery)
      );
      this.renderVehiclesTable();
    },

    showVehicleDetails(vehicleId) {
      const vehicle = this.db.getById('vehicles', vehicleId);
      if (!vehicle) {
        window.showToast('Vehicle not found', 'error');
        return;
      }
      window.showToast(`Vehicle: ${vehicle.brand} ${vehicle.model} - ₱${vehicle.pricePerDay}/day`, 'info');
    },

    deleteVehicle(vehicleId) {
      if (confirm('Are you sure you want to delete this vehicle?')) {
        this.db.delete('vehicles', vehicleId);
        this.loadVehicles();
        window.showToast('Vehicle deleted successfully', 'success');
      }
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Vehicles;
})();

// ============================================
// BOOKINGS MODULE
// ============================================
window.BookingsModule = (function() {
  'use strict';

  const Bookings = {
    db: null,
    currentBookings: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadBookings();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#bookings .search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterBookings(e.target.value));
      }
    },

    loadBookings() {
      this.currentBookings = this.db.getAll('bookings');
      this.renderBookingsTable();
    },

    renderBookingsTable() {
      const tbody = document.querySelector('#bookings table tbody');
      if (!tbody) return;

      if (!this.currentBookings.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No bookings found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentBookings.slice(0, 10).forEach(booking => {
        const user = this.db.getById('users', booking.userId);
        const vehicle = this.db.getById('vehicles', booking.vehicleId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${booking.id}</strong></td>
          <td>${user ? user.name : 'Unknown'}</td>
          <td>${vehicle ? vehicle.brand + ' ' + vehicle.model : 'Unknown'}</td>
          <td><span class="status-badge ${booking.status}">${this.capitalizeFirst(booking.status)}</span></td>
          <td>₱${booking.totalPrice.toLocaleString()}</td>
          <td>
            <button class="btn btn-sm" onclick="BookingsModule.showBookingDetails('${booking.id}')">View</button>
          </td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterBookings(query) {
      const lowerQuery = query.toLowerCase();
      this.currentBookings = this.db.getAll('bookings').filter(booking =>
        booking.id.toLowerCase().includes(lowerQuery)
      );
      this.renderBookingsTable();
    },

    showBookingDetails(bookingId) {
      const booking = this.db.getById('bookings', bookingId);
      if (!booking) {
        window.showToast('Booking not found', 'error');
        return;
      }
      window.showToast(`Booking: ${booking.id} - Status: ${booking.status}`, 'info');
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Bookings;
})();

// ============================================
// PAYMENTS MODULE
// ============================================
window.PaymentsModule = (function() {
  'use strict';

  const Payments = {
    db: null,
    currentPayments: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadPayments();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#payments .search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterPayments(e.target.value));
      }
    },

    loadPayments() {
      this.currentPayments = this.db.getAll('payments');
      this.renderPaymentsTable();
    },

    renderPaymentsTable() {
      const tbody = document.querySelector('#payments table tbody');
      if (!tbody) return;

      if (!this.currentPayments.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No payments found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentPayments.slice(0, 10).forEach(payment => {
        const user = this.db.getById('users', payment.userId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${payment.id}</strong></td>
          <td>${user ? user.name : 'Unknown'}</td>
          <td>₱${payment.amount.toLocaleString()}</td>
          <td>${this.capitalizeFirst(payment.method.replace('_', ' '))}</td>
          <td><span class="status-badge ${payment.status}">${this.capitalizeFirst(payment.status)}</span></td>
          <td>${new Date(payment.date).toLocaleDateString()}</td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterPayments(query) {
      const lowerQuery = query.toLowerCase();
      this.currentPayments = this.db.getAll('payments').filter(payment =>
        payment.id.toLowerCase().includes(lowerQuery)
      );
      this.renderPaymentsTable();
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Payments;
})();

// ============================================
// MERCHANTS MODULE
// ============================================
window.MerchantsModule = (function() {
  'use strict';

  const Merchants = {
    db: null,
    currentMerchants: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadMerchants();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#merchants .search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterMerchants(e.target.value));
      }
    },

    loadMerchants() {
      this.currentMerchants = this.db.getAll('merchants');
      this.renderMerchantsTable();
    },

    renderMerchantsTable() {
      const tbody = document.querySelector('#merchants table tbody');
      if (!tbody) return;

      if (!this.currentMerchants.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No merchants found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentMerchants.slice(0, 10).forEach(merchant => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(merchant.name)}</strong></td>
          <td>${this.escapeHtml(merchant.email)}</td>
          <td>${merchant.phone}</td>
          <td>⭐ ${merchant.rating}</td>
          <td><span class="status-badge ${merchant.status}">${this.capitalizeFirst(merchant.status)}</span></td>
          <td>
            <button class="btn btn-sm" onclick="MerchantsModule.showMerchantDetails('${merchant.id}')">View</button>
            <button class="btn btn-sm" onclick="MerchantsModule.deleteMerchant('${merchant.id}')">Delete</button>
          </td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterMerchants(query) {
      const lowerQuery = query.toLowerCase();
      this.currentMerchants = this.db.getAll('merchants').filter(merchant =>
        merchant.name.toLowerCase().includes(lowerQuery) ||
        merchant.email.toLowerCase().includes(lowerQuery)
      );
      this.renderMerchantsTable();
    },

    showMerchantDetails(merchantId) {
      const merchant = this.db.getById('merchants', merchantId);
      if (!merchant) {
        window.showToast('Merchant not found', 'error');
        return;
      }
      window.showToast(`Merchant: ${merchant.name} - Status: ${merchant.status}`, 'info');
    },

    deleteMerchant(merchantId) {
      if (confirm('Are you sure you want to delete this merchant?')) {
        this.db.delete('merchants', merchantId);
        this.loadMerchants();
        window.showToast('Merchant deleted successfully', 'success');
      }
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Merchants;
})();

// ============================================
// REVIEWS MODULE
// ============================================
window.ReviewsModule = (function() {
  'use strict';

  const Reviews = {
    db: null,
    currentReviews: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadReviews();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#reviews .search-input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterReviews(e.target.value));
      }
    },

    loadReviews() {
      this.currentReviews = this.db.getAll('reviews');
      this.renderReviewsTable();
    },

    renderReviewsTable() {
      const tbody = document.querySelector('#reviews table tbody');
      if (!tbody) return;

      if (!this.currentReviews.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No reviews found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentReviews.slice(0, 10).forEach(review => {
        const user = this.db.getById('users', review.userId);
        const vehicle = this.db.getById('vehicles', review.vehicleId);
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${user ? user.name : 'Unknown'}</td>
          <td>${vehicle ? vehicle.brand + ' ' + vehicle.model : 'Unknown'}</td>
          <td>⭐ ${review.rating}/5</td>
          <td>${review.comment.substring(0, 50)}...</td>
          <td><span class="status-badge ${review.status}">${this.capitalizeFirst(review.status)}</span></td>
          <td>
            <button class="btn btn-sm" onclick="ReviewsModule.approveReview('${review.id}')">Approve</button>
            <button class="btn btn-sm" onclick="ReviewsModule.rejectReview('${review.id}')">Reject</button>
          </td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterReviews(query) {
      const lowerQuery = query.toLowerCase();
      this.currentReviews = this.db.getAll('reviews').filter(review =>
        review.comment.toLowerCase().includes(lowerQuery)
      );
      this.renderReviewsTable();
    },

    approveReview(reviewId) {
      this.db.update('reviews', reviewId, { status: 'approved' });
      this.loadReviews();
      window.showToast('Review approved', 'success');
    },

    rejectReview(reviewId) {
      this.db.update('reviews', reviewId, { status: 'rejected' });
      this.loadReviews();
      window.showToast('Review rejected', 'success');
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Reviews;
})();

// ============================================
// CONTENT MODULE
// ============================================
window.ContentModule = (function() {
  'use strict';

  const Content = {
    db: null,

    init(database) {
      this.db = database;
      window.showToast('Content management module loaded', 'info');
    }
  };

  return Content;
})();

// ============================================
// REPORTS MODULE
// ============================================
window.ReportsModule = (function() {
  'use strict';

  const Reports = {
    db: null,

    init(database) {
      this.db = database;
      this.generateReports();
    },

    generateReports() {
      const users = this.db.getAll('users');
      const bookings = this.db.getAll('bookings');
      const payments = this.db.getAll('payments');
      
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const completedBookings = bookings.filter(b => b.status === 'completed').length;
      
      window.showToast(`Reports: ${users.length} users, ${bookings.length} bookings, ₱${totalRevenue.toLocaleString()} revenue`, 'info');
    }
  };

  return Reports;
})();

// ============================================
// SETTINGS MODULE
// ============================================
window.SettingsModule = (function() {
  'use strict';

  const Settings = {
    db: null,

    init(database) {
      this.db = database;
      window.showToast('Settings module loaded', 'info');
    }
  };

  return Settings;
})();

// ============================================
// SECURITY MODULE
// ============================================
window.SecurityModule = (function() {
  'use strict';

  const Security = {
    db: null,
    currentLogs: [],

    init(database) {
      this.db = database;
      this.loadLogs();
    },

    loadLogs() {
      this.currentLogs = this.db.getAll('logs');
      this.renderLogsTable();
    },

    renderLogsTable() {
      const tbody = document.querySelector('#security table tbody');
      if (!tbody) return;

      if (!this.currentLogs.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">No logs found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentLogs.slice(0, 10).forEach(log => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${log.admin}</td>
          <td>${log.msg}</td>
          <td>${log.ip}</td>
          <td><span class="status-badge ${log.status}">${this.capitalizeFirst(log.status)}</span></td>
          <td>${new Date(log.ts).toLocaleString()}</td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Security;
})();

// ============================================
// ADMINS MODULE
// ============================================
window.AdminsModule = (function() {
  'use strict';

  const Admins = {
    db: null,
    currentAdmins: [],

    init(database) {
      this.db = database;
      this.loadAdmins();
    },

    loadAdmins() {
      this.currentAdmins = this.db.getAll('admins');
      this.renderAdminsTable();
    },

    renderAdminsTable() {
      const tbody = document.querySelector('#admins table tbody');
      if (!tbody) return;

      if (!this.currentAdmins.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center">No admins found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentAdmins.forEach(admin => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(admin.name)}</strong></td>
          <td>${this.escapeHtml(admin.email)}</td>
          <td>${this.capitalizeFirst(admin.role)}</td>
          <td><span class="status-badge ${admin.status}">${this.capitalizeFirst(admin.status)}</span></td>
          <td>${admin.twoFactorEnabled ? '✓ Enabled' : '✗ Disabled'}</td>
          <td>${new Date(admin.lastLogin).toLocaleDateString()}</td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    },

    capitalizeFirst(str) {
      return str.charAt(0).toUpperCase() + str.slice(1);
    }
  };

  return Admins;
})();
