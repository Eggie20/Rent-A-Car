// Bookings Management Module
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
      const searchInput = document.querySelector('#bookingsModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterBookings(e.target.value));
      }

      const statusSelect = document.querySelector('#bookingsModule .toolbar-actions select');
      if (statusSelect) {
        statusSelect.addEventListener('change', (e) => this.filterByStatus(e.target.value));
      }
    },

    loadBookings() {
      this.currentBookings = this.db.getAll('bookings');
      this.renderBookingsTable();
    },

    renderBookingsTable() {
      const tbody = document.getElementById('bookingsTableBody');
      if (!tbody) return;

      if (!this.currentBookings.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No bookings found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentBookings.forEach(booking => {
        const user = this.db.getById('users', booking.userId);
        const vehicle = this.db.getById('vehicles', booking.vehicleId);
        
        const tr = document.createElement('tr');
        tr.className = 'animate-fadeInUp';
        tr.innerHTML = `
          <td><strong>#${booking.id.substring(0, 8)}</strong></td>
          <td>${user ? this.escapeHtml(user.name) : 'Unknown'}</td>
          <td>${vehicle ? this.escapeHtml(vehicle.brand) + ' ' + this.escapeHtml(vehicle.model) : 'Unknown'}</td>
          <td>${new Date(booking.startDate).toLocaleDateString()} - ${new Date(booking.endDate).toLocaleDateString()}</td>
          <td>
            <span class="status-badge ${booking.status}">
              <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
              ${this.capitalizeFirst(booking.status)}
            </span>
          </td>
          <td>₱${booking.totalPrice.toLocaleString()}</td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-outline" data-action="view-booking" data-id="${booking.id}" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="edit-booking" data-id="${booking.id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
        `;

        tr.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const bookingId = btn.dataset.id;
            this.handleBookingAction(action, bookingId);
          });
        });

        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterBookings(query) {
      const lowerQuery = query.toLowerCase();
      this.currentBookings = this.db.getAll('bookings').filter(booking => {
        const user = this.db.getById('users', booking.userId);
        const vehicle = this.db.getById('vehicles', booking.vehicleId);
        return booking.id.includes(query) ||
               (user && user.name.toLowerCase().includes(lowerQuery)) ||
               (vehicle && (vehicle.brand.toLowerCase().includes(lowerQuery) || vehicle.model.toLowerCase().includes(lowerQuery)));
      });
      this.renderBookingsTable();
    },

    filterByStatus(status) {
      if (!status) {
        this.currentBookings = this.db.getAll('bookings');
      } else {
        this.currentBookings = this.db.getAll('bookings').filter(b => b.status === status);
      }
      this.renderBookingsTable();
    },

    handleBookingAction(action, bookingId) {
      const booking = this.db.getById('bookings', bookingId);
      if (!booking) {
        window.showToast('Booking not found', 'error');
        return;
      }

      switch (action) {
        case 'view-booking':
          this.showBookingDetails(booking);
          break;
        case 'edit-booking':
          window.showToast('Edit booking feature coming soon', 'info');
          break;
      }
    },

    showBookingDetails(booking) {
      const user = this.db.getById('users', booking.userId);
      const vehicle = this.db.getById('vehicles', booking.vehicleId);
      
      const modal = document.getElementById('confirmModal');
      const title = modal.querySelector('#confirmTitle');
      const message = modal.querySelector('#confirmMessage');

      title.textContent = 'Booking Details';
      message.innerHTML = `
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="font-weight: 600; color: var(--muted);">Booking ID</label>
            <p style="margin: 0.5rem 0 0;">#${booking.id}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">User</label>
            <p style="margin: 0.5rem 0 0;">${user ? this.escapeHtml(user.name) : 'Unknown'}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Vehicle</label>
            <p style="margin: 0.5rem 0 0;">${vehicle ? this.escapeHtml(vehicle.brand) + ' ' + this.escapeHtml(vehicle.model) : 'Unknown'}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Date Range</label>
            <p style="margin: 0.5rem 0 0;">${new Date(booking.startDate).toLocaleString()} - ${new Date(booking.endDate).toLocaleString()}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Total Price</label>
            <p style="margin: 0.5rem 0 0;">₱${booking.totalPrice.toLocaleString()}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Status</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge ${booking.status}">
                ${this.capitalizeFirst(booking.status)}
              </span>
            </p>
          </div>
        </div>
      `;

      window.showModal(modal);
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

  return Bookings;
})();
