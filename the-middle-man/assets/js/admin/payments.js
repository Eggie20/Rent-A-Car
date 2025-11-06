// Payments Management Module
window.PaymentsModule = (function() {
  'use strict';

  const Payments = {
    db: null,
    currentPayments: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadPayments();
      this.updateSummary();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#paymentsModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterPayments(e.target.value));
      }

      const exportBtn = document.querySelector('[data-action="export-payments"]');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportPaymentsCSV());
      }
    },

    loadPayments() {
      this.currentPayments = this.db.getAll('payments');
      this.renderPaymentsTable();
    },

    updateSummary() {
      const payments = this.db.getAll('payments');
      const totalIncome = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const pending = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
      const completed = payments.filter(p => p.status === 'completed').length;

      document.getElementById('totalIncome').textContent = '₱' + totalIncome.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      document.getElementById('pendingPayments').textContent = '₱' + pending.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
      document.getElementById('completedTransactions').textContent = completed;
    },

    renderPaymentsTable() {
      const tbody = document.getElementById('paymentsTableBody');
      if (!tbody) return;

      if (!this.currentPayments.length) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center text-muted">No payments found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentPayments.forEach(payment => {
        const user = this.db.getById('users', payment.userId);
        
        const tr = document.createElement('tr');
        tr.className = 'animate-fadeInUp';
        tr.innerHTML = `
          <td><strong>#${payment.id.substring(0, 8)}</strong></td>
          <td>${user ? this.escapeHtml(user.name) : 'Unknown'}</td>
          <td>₱${payment.amount.toLocaleString()}</td>
          <td>${this.capitalizeFirst(payment.method)}</td>
          <td>
            <span class="status-badge ${payment.status}">
              <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
              ${this.capitalizeFirst(payment.status)}
            </span>
          </td>
          <td>${new Date(payment.date).toLocaleString()}</td>
          <td>
            <button class="btn btn-sm btn-outline" data-action="view-payment" data-id="${payment.id}" title="View">
              <i class="fas fa-eye"></i>
            </button>
          </td>
        `;

        tr.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const paymentId = btn.dataset.id;
            this.handlePaymentAction(action, paymentId);
          });
        });

        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterPayments(query) {
      const lowerQuery = query.toLowerCase();
      this.currentPayments = this.db.getAll('payments').filter(payment => {
        const user = this.db.getById('users', payment.userId);
        return payment.id.includes(query) ||
               (user && user.name.toLowerCase().includes(lowerQuery)) ||
               payment.method.toLowerCase().includes(lowerQuery);
      });
      this.renderPaymentsTable();
    },

    handlePaymentAction(action, paymentId) {
      const payment = this.db.getById('payments', paymentId);
      if (!payment) {
        window.showToast('Payment not found', 'error');
        return;
      }

      if (action === 'view-payment') {
        this.showPaymentDetails(payment);
      }
    },

    showPaymentDetails(payment) {
      const user = this.db.getById('users', payment.userId);
      
      const modal = document.getElementById('confirmModal');
      const title = modal.querySelector('#confirmTitle');
      const message = modal.querySelector('#confirmMessage');

      title.textContent = 'Payment Details';
      message.innerHTML = `
        <div style="display: grid; gap: 1rem;">
          <div>
            <label style="font-weight: 600; color: var(--muted);">Transaction ID</label>
            <p style="margin: 0.5rem 0 0;">#${payment.id}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">User</label>
            <p style="margin: 0.5rem 0 0;">${user ? this.escapeHtml(user.name) : 'Unknown'}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Amount</label>
            <p style="margin: 0.5rem 0 0;">₱${payment.amount.toLocaleString()}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Method</label>
            <p style="margin: 0.5rem 0 0;">${this.capitalizeFirst(payment.method)}</p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Status</label>
            <p style="margin: 0.5rem 0 0;">
              <span class="status-badge ${payment.status}">
                ${this.capitalizeFirst(payment.status)}
              </span>
            </p>
          </div>
          <div>
            <label style="font-weight: 600; color: var(--muted);">Date</label>
            <p style="margin: 0.5rem 0 0;">${new Date(payment.date).toLocaleString()}</p>
          </div>
        </div>
      `;

      window.showModal(modal);
    },

    exportPaymentsCSV() {
      const payments = this.db.getAll('payments');
      let csv = 'Transaction ID,User,Amount,Method,Status,Date\n';
      
      payments.forEach(payment => {
        const user = this.db.getById('users', payment.userId);
        csv += `${payment.id},"${user ? user.name : 'Unknown'}",${payment.amount},${payment.method},${payment.status},"${new Date(payment.date).toLocaleString()}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      window.showToast('Payments exported successfully', 'success');
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

  return Payments;
})();
