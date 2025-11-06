// Vehicles Management Module
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
      // Search functionality
      const searchInput = document.querySelector('#vehiclesModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterVehicles(e.target.value));
      }

      // Type filter
      const typeSelect = document.querySelector('#vehiclesModule .toolbar-actions select');
      if (typeSelect) {
        typeSelect.addEventListener('change', (e) => this.filterByType(e.target.value));
      }

      // Add vehicle button
      const addBtn = document.querySelector('[data-action="add-vehicle"]');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.showAddVehicleModal());
      }
    },

    loadVehicles() {
      this.currentVehicles = this.db.getAll('vehicles');
      this.renderVehiclesGrid();
    },

    renderVehiclesGrid() {
      const grid = document.getElementById('vehiclesGrid');
      if (!grid) return;

      if (!this.currentVehicles.length) {
        grid.innerHTML = '<p class="text-muted no-vehicles-message">No vehicles found</p>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentVehicles.forEach(vehicle => {
        const card = document.createElement('div');
        card.className = 'vehicle-card animate-fadeInUp';
        card.innerHTML = `
          <div class="vehicle-card-image">
            <i class="fas fa-car"></i>
            <span class="vehicle-card-badge">${vehicle.type}</span>
          </div>
          <div class="vehicle-card-content">
            <h3 class="vehicle-card-title">${this.escapeHtml(vehicle.brand)} ${this.escapeHtml(vehicle.model)}</h3>
            <div class="vehicle-card-meta">
              <span><i class="fas fa-id-card"></i> ${vehicle.licensePlate}</span>
              <span><i class="fas fa-calendar"></i> ${vehicle.year}</span>
            </div>
            <div class="vehicle-card-meta">
              <span>
                <i class="fas fa-circle" style="font-size: 0.5rem; color: ${vehicle.available ? '#10b981' : '#ef4444'};"></i>
                ${vehicle.available ? 'Available' : 'Unavailable'}
              </span>
              <span><i class="fas fa-tag"></i> ₱${vehicle.pricePerDay}/day</span>
            </div>
            <div class="vehicle-card-actions">
              <button class="btn btn-sm btn-outline" data-action="view-vehicle" data-id="${vehicle.id}" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="edit-vehicle" data-id="${vehicle.id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="delete-vehicle" data-id="${vehicle.id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </div>
        `;

        // Add event listeners
        card.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const vehicleId = btn.dataset.id;
            this.handleVehicleAction(action, vehicleId);
          });
        });

        frag.appendChild(card);
      });

      grid.replaceChildren(frag);
    },

    filterVehicles(query) {
      const lowerQuery = query.toLowerCase();
      this.currentVehicles = this.db.getAll('vehicles').filter(vehicle =>
        vehicle.brand.toLowerCase().includes(lowerQuery) ||
        vehicle.model.toLowerCase().includes(lowerQuery) ||
        vehicle.licensePlate.toLowerCase().includes(lowerQuery)
      );
      this.renderVehiclesGrid();
    },

    filterByType(type) {
      if (!type) {
        this.currentVehicles = this.db.getAll('vehicles');
      } else {
        this.currentVehicles = this.db.getAll('vehicles').filter(v => v.type === type);
      }
      this.renderVehiclesGrid();
    },

    handleVehicleAction(action, vehicleId) {
      const vehicle = this.db.getById('vehicles', vehicleId);
      if (!vehicle) {
        window.showToast('Vehicle not found', 'error');
        return;
      }

      switch (action) {
        case 'view-vehicle':
          this.showVehicleDetails(vehicle);
          break;
        case 'edit-vehicle':
          this.showEditVehicleModal(vehicle);
          break;
        case 'delete-vehicle':
          this.showDeleteConfirmation(vehicle);
          break;
      }
    },

    showVehicleDetails(vehicle) {
      const modal = document.getElementById('confirmModal');
      const title = modal.querySelector('#confirmTitle');
      const message = modal.querySelector('#confirmMessage');

      title.textContent = 'Vehicle Details';
      message.innerHTML = `
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="font-weight: 600; color: var(--muted);">Brand & Model</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(vehicle.brand)} ${this.escapeHtml(vehicle.model)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">License Plate</label>
            <p style="margin: 0.5rem 0 0;">${vehicle.licensePlate}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Type</label>
            <p style="margin: 0.5rem 0 0;">${this.capitalizeFirst(vehicle.type)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Year</label>
            <p style="margin: 0.5rem 0 0;">${vehicle.year}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Price Per Day</label>
            <p style="margin: 0.5rem 0 0;">₱${vehicle.pricePerDay.toLocaleString()}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Status</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge ${vehicle.available ? 'active' : 'inactive'}">
                ${vehicle.available ? 'Available' : 'Unavailable'}
              </span>
            </p>
          </div>
        </div>
      `;

      window.showModal(modal);
    },

    showEditVehicleModal(vehicle) {
      window.showToast('Edit vehicle feature coming soon', 'info');
    },

    showAddVehicleModal() {
      window.showToast('Add vehicle feature coming soon', 'info');
    },

    showDeleteConfirmation(vehicle) {
      window.showConfirmation(
        'Delete Vehicle',
        `Are you sure you want to delete ${this.escapeHtml(vehicle.brand)} ${this.escapeHtml(vehicle.model)}? This action cannot be undone.`,
        () => {
          this.db.delete('vehicles', vehicle.id);
          this.loadVehicles();
          window.showToast('Vehicle deleted successfully', 'success');
        }
      );
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
