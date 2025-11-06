// Users Management Module
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
      // Search functionality
      const searchInput = document.querySelector('#usersModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterUsers(e.target.value));
      }

      // Status filter
      const statusSelect = document.querySelector('#usersModule .toolbar-actions select');
      if (statusSelect) {
        statusSelect.addEventListener('change', (e) => this.filterByStatus(e.target.value));
      }

      // Add user button
      const addBtn = document.querySelector('[data-action="add-user"]');
      if (addBtn) {
        addBtn.addEventListener('click', () => this.showAddUserModal());
      }
    },

    loadUsers() {
      this.currentUsers = this.db.getAll('users');
      this.renderUsersTable();
    },

    renderUsersTable() {
      const tbody = document.getElementById('usersTableBody');
      if (!tbody) return;

      if (!this.currentUsers.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center text-muted">No users found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentUsers.forEach(user => {
        const tr = document.createElement('tr');
        tr.className = 'animate-fadeInUp';
        tr.innerHTML = `
          <td><strong>${this.escapeHtml(user.name)}</strong></td>
          <td>${this.escapeHtml(user.email)}</td>
          <td>${user.phone || 'N/A'}</td>
          <td>
            <span class="status-badge ${user.status}">
              <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
              ${this.capitalizeFirst(user.status)}
            </span>
          </td>
          <td>${new Date(user.createdAt).toLocaleDateString()}</td>
          <td>
            <div style="display: flex; gap: 0.5rem;">
              <button class="btn btn-sm btn-outline" data-action="view-user" data-id="${user.id}" title="View">
                <i class="fas fa-eye"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="edit-user" data-id="${user.id}" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="btn btn-sm btn-outline" data-action="delete-user" data-id="${user.id}" title="Delete">
                <i class="fas fa-trash"></i>
              </button>
            </div>
          </td>
        `;

        // Add event listeners to action buttons
        tr.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const userId = btn.dataset.id;
            this.handleUserAction(action, userId);
          });
        });

        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterUsers(query) {
      const lowerQuery = query.toLowerCase();
      this.currentUsers = this.db.getAll('users').filter(user =>
        user.name.toLowerCase().includes(lowerQuery) ||
        user.email.toLowerCase().includes(lowerQuery) ||
        (user.phone && user.phone.includes(query))
      );
      this.renderUsersTable();
    },

    filterByStatus(status) {
      if (!status) {
        this.currentUsers = this.db.getAll('users');
      } else {
        this.currentUsers = this.db.getAll('users').filter(u => u.status === status);
      }
      this.renderUsersTable();
    },

    handleUserAction(action, userId) {
      const user = this.db.getById('users', userId);
      if (!user) {
        window.showToast('User not found', 'error');
        return;
      }

      switch (action) {
        case 'view-user':
          this.showUserDetails(user);
          break;
        case 'edit-user':
          this.showEditUserModal(user);
          break;
        case 'delete-user':
          this.showDeleteConfirmation(user);
          break;
      }
    },

    showUserDetails(user) {
      const modal = document.getElementById('confirmModal');
      const title = modal.querySelector('#confirmTitle');
      const message = modal.querySelector('#confirmMessage');

      title.textContent = 'User Details';
      message.innerHTML = `
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="font-weight: 600; color: var(--muted);">Name</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(user.name)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Email</label>
            <p style="margin: 0.5rem 0 0;">${this.escapeHtml(user.email)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Phone</label>
            <p style="margin: 0.5rem 0 0;">${user.phone || 'N/A'}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Status</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge ${user.status}">
                ${this.capitalizeFirst(user.status)}
              </span>
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Joined</label>
            <p style="margin: 0.5rem 0 0;">${new Date(user.createdAt).toLocaleString()}</p>
          </div>
        </div>
      `;

      window.showModal(modal);
    },

    showEditUserModal(user) {
      window.showToast('Edit user feature coming soon', 'info');
    },

    showAddUserModal() {
      window.showToast('Add user feature coming soon', 'info');
    },

    showDeleteConfirmation(user) {
      window.showConfirmation(
        'Delete User',
        `Are you sure you want to delete ${this.escapeHtml(user.name)}? This action cannot be undone.`,
        () => {
          this.db.delete('users', user.id);
          this.loadUsers();
          window.showToast('User deleted successfully', 'success');
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

  return Users;
})();
