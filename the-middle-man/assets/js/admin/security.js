// Security & Logs Module
window.SecurityModule = (function() {
  'use strict';

  const Security = {
    db: null,
    currentLogs: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadLogs();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#securityModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterLogs(e.target.value));
      }

      const exportBtn = document.querySelector('[data-action="export-logs"]');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportLogs());
      }

      const clearBtn = document.querySelector('[data-action="clear-logs"]');
      if (clearBtn) {
        clearBtn.addEventListener('click', () => this.clearLogs());
      }
    },

    loadLogs() {
      this.currentLogs = this.db.getAll('logs');
      this.renderLogsTable();
    },

    renderLogsTable() {
      const tbody = document.getElementById('securityLogsBody');
      if (!tbody) return;

      if (!this.currentLogs.length) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-muted">No logs found</td></tr>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentLogs.slice(-50).reverse().forEach(log => {
        const tr = document.createElement('tr');
        tr.className = 'animate-fadeInUp';
        tr.innerHTML = `
          <td>${log.admin || 'System'}</td>
          <td>${this.escapeHtml(log.msg)}</td>
          <td>${log.ip || 'N/A'}</td>
          <td>
            <span class="status-badge ${log.status === 'success' ? 'active' : 'cancelled'}">
              <i class="fas fa-circle" style="font-size: 0.5rem;"></i>
              ${this.capitalizeFirst(log.status || 'unknown')}
            </span>
          </td>
          <td>${new Date(log.ts).toLocaleString()}</td>
        `;
        frag.appendChild(tr);
      });

      tbody.replaceChildren(frag);
    },

    filterLogs(query) {
      const lowerQuery = query.toLowerCase();
      this.currentLogs = this.db.getAll('logs').filter(log =>
        (log.admin && log.admin.toLowerCase().includes(lowerQuery)) ||
        log.msg.toLowerCase().includes(lowerQuery) ||
        (log.ip && log.ip.includes(query))
      );
      this.renderLogsTable();
    },

    exportLogs() {
      const logs = this.db.getAll('logs');
      let csv = 'Admin,Action,IP Address,Status,Timestamp\n';

      logs.forEach(log => {
        csv += `"${log.admin || 'System'}","${log.msg}","${log.ip || 'N/A'}","${log.status || 'unknown'}","${new Date(log.ts).toLocaleString()}"\n`;
      });

      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `security_logs_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);

      window.showToast('Logs exported successfully', 'success');
    },

    clearLogs() {
      window.showConfirmation(
        'Clear Logs',
        'Are you sure you want to clear all security logs? This action cannot be undone.',
        () => {
          const logs = this.db.getAll('logs');
          logs.forEach(log => this.db.delete('logs', log.id));
          this.loadLogs();
          window.showToast('All logs cleared', 'success');
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

  return Security;
})();
