// Merchants Management Module
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
      const searchInput = document.querySelector('#merchantsModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterMerchants(e.target.value));
      }

      const statusSelect = document.querySelector('#merchantsModule .toolbar-actions select');
      if (statusSelect) {
        statusSelect.addEventListener('change', (e) => this.filterByStatus(e.target.value));
      }
    },

    loadMerchants() {
      this.currentMerchants = this.db.getAll('merchants');
      this.renderMerchantsTable();
    },

    renderMerchantsTable() {
      const tbody = document.getElementById('merchantsTableBody');
      if (!tbody) return;

      if (!this.currentMerchants.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No merchants found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentMerchants.forEach(merchant => {
        const vehicles = this.db.query('vehicles', [{ field: 'merchantId', op: 'eq', value: merchant.id }]);
        
        const tr = document.createElement('tr');
        tr.className = 'animate-fadeInUp';
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(merchant.name)}</strong></td>
          <td>${this.escapeHtml(merchant.email)}</td>
          <td>${vehicles.length}</td>
          <td>
            <span class="status-badge ${merchant.status}">
              <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
              ${this.capitalizeFirst(merchant.status)}
            </span>
          </td>
          <td>
            <div style="display: flex; align-items: center; gap: 0.25rem;">
              <i class="fas fa-star" style="color: #f59e0b;"></i>
              ${merchant.rating.toFixed(1)}
            </div>
          </td>
          <td>${new Date(merchant.createdAt).toLocaleDateString()}</td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-outline" data-action="view-merchant" data-id="${merchant.id}" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="edit-merchant" data-id="${merchant.id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
            </div>
          </td>
        `;

        tr.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const merchantId = btn.dataset.id;
            this.handleMerchantAction(action, merchantId);
          });
        });

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

    filterByStatus(status) {
      if (!status) {
        this.currentMerchants = this.db.getAll('merchants');
      } else {
        this.currentMerchants = this.db.getAll('merchants').filter(m => m.status === status);
      }
      this.renderMerchantsTable();
    },

    handleMerchantAction(action, merchantId) {
      const merchant = this.db.getById('merchants', merchantId);
      if (!merchant) {
        window.showToast('Merchant not found', 'error');
        return;
      }

      switch (action) {
        case 'view-merchant':
          this.showMerchantDetails(merchant);
          break;
        case 'edit-merchant':
          window.showToast('Edit merchant feature coming soon', 'info');
          break;
      }
    },

    showMerchantDetails(merchant) {
      const vehicles = this.db.query('vehicles', [{ field: 'merchantId', op: 'eq', value: merchant.id }]);
      
      const modal = document.getElementById('confirmModal');
      const title = modal.querySelector('#confirmTitle');
      const message = modal.querySelector('#confirmMessage');

      title.textContent = 'Merchant Details';
      message.innerHTML = `
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="font-weight: 600; color: var(--muted);">Name</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(merchant.name)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Email</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(merchant.email)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Phone</label>
            <p style="margin: 0.5rem 0 0;">${merchant.phone || 'N/A'}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Vehicles</label>
            <p style="margin: 0.5rem 0 0;">${vehicles.length}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Rating</label>
            <p style="margin: 0.5rem 0 0;">
              <i class="fas fa-star" style="color: #f59e0b;"></i>
              ${merchant.rating.toFixed(1)} / 5.0
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Status</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge ${merchant.status}">
                ${this.capitalizeFirst(merchant.status)}
              </span>
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Joined</label>
            <p style="margin: 0.5rem 0 0;">${new Date(merchant.createdAt).toLocaleString()}</p>
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

  return Merchants;
})();
