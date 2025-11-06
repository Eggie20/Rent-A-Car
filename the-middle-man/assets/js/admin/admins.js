// Admin Management Module
window.AdminsModule = (function() {
  'use strict';

  const Admins = {
    db: null,
    currentAdmins: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadAdmins();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#adminsModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterAdmins(e.target.value));
      }

      const roleSelect = document.querySelector('#adminsModule .toolbar-actions select');
      if (roleSelect) {
        roleSelect.addEventListener('change', (e) => this.filterByRole(e.target.value));
      }

      const addBtn = document.querySelector('[data-action="add-admin"]');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.showAddAdminModal());
      }
    },

    loadAdmins() {
      this.currentAdmins = this.db.getAll('admins');
      this.renderAdminsTable();
    },

    renderAdminsTable() {
      const tbody = document.getElementById('adminsTableBody');
      if (!tbody) return;

      if (!this.currentAdmins.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No admins found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentAdmins.forEach(admin => {
        const tr = document.createElement('tr');
        tr.className = 'animate-fadeInUp';
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(admin.name)}</strong></td>
          <td>${this.escapeHtml(admin.email)}</td>
          <td>
            <span class="status-badge active">
              ${this.capitalizeFirst(admin.role)}
            </span>
          </td>
          <td>
            <span class="status-badge ${admin.status === 'active' ? 'active' : 'inactive'}">
              <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
              ${this.capitalizeFirst(admin.status)}
            </span>
          </td>
          <td>
            <i class="fas fa-${admin.twoFactorEnabled ? 'check' : 'times'}" style="color: ${admin.twoFactorEnabled ? '#10b981' : '#ef4444'};"></i>
          </td>
          <td>${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}</td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-outline" data-action="view-admin" data-id="${admin.id}" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="edit-admin" data-id="${admin.id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              ${admin.role !== 'super' ? `
                <button class="btn btn-sm btn-outline" data-action="delete-admin" data-id="${admin.id}" title="Delete">
                  <i class="fas fa-trash"></i>
                </button>
              ` : ''}
            </div>
          </td>
        `;

        tr.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const adminId = btn.dataset.id;
            this.handleAdminAction(action, adminId);
          });
        });

        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterAdmins(query) {
      const lowerQuery = query.toLowerCase();
      this.currentAdmins = this.db.getAll('admins').filter(admin =>
        admin.name.toLowerCase().includes(lowerQuery) ||
        admin.email.toLowerCase().includes(lowerQuery)
      );
      this.renderAdminsTable();
    },

    filterByRole(role) {
      if (!role) {
        this.currentAdmins = this.db.getAll('admins');
      } else {
        this.currentAdmins = this.db.getAll('admins').filter(a => a.role === role);
      }
      this.renderAdminsTable();
    },

    handleAdminAction(action, adminId) {
      const admin = this.db.getById('admins', adminId);
      if (!admin) {
        window.showToast('Admin not found', 'error');
        return;
      }

      switch (action) {
        case 'view-admin':
          this.showAdminDetails(admin);
          break;
        case 'edit-admin':
          window.showToast('Edit admin feature coming soon', 'info');
          break;
        case 'delete-admin':
          this.showDeleteConfirmation(admin);
          break;
      }
    },

    showAdminDetails(admin) {
      const modal = document.getElementById('confirmModal');
      const title = modal.querySelector('#confirmTitle');
      const message = modal.querySelector('#confirmMessage');

      title.textContent = 'Admin Details';
      message.innerHTML = `
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="font-weight: 600; color: var(--muted);">Name</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(admin.name)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Email</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(admin.email)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Role</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge active">
                ${this.capitalizeFirst(admin.role)}
              </span>
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Status</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge ${admin.status === 'active' ? 'active' : 'inactive'}">
                ${this.capitalizeFirst(admin.status)}
              </span>
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Two-Factor Authentication</label>
            <p style="margin: 0.5rem 0 0;">
              ${admin.twoFactorEnabled ? '<i class="fas fa-check" style="color: #10b981;"></i> Enabled' : '<i class="fas fa-times" style="color: #ef4444;"></i> Disabled'}
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Last Login</label>
            <p style="margin: 0.5rem 0 0;">${admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}</p>
          </div>
        </div>
      `;

      window.showModal(modal);
    },

    showAddAdminModal() {
      window.showToast('Add admin feature coming soon', 'info');
    },

    showDeleteConfirmation(admin) {
      window.showConfirmation(
        'Delete Admin',
        `Are you sure you want to delete ${this.escapeHtml(admin.name)}? This action cannot be undone.`,
        () => {
          this.db.delete('admins', admin.id);
          this.loadAdmins();
          window.showToast('Admin deleted successfully', 'success');
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

  return Admins;
})();
