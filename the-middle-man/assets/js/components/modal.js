// Modal Component
(function() {
  'use strict';

  const Modal = {
    currentCallback: null,

    init() {
      this.setupEventListeners();
    },

    setupEventListeners() {
      const overlay = document.getElementById('modalOverlay');
      const modal = document.getElementById('confirmModal');
      const closeBtn = modal.querySelector('.modal-close');

      // Close button
      if (closeBtn) {
        closeBtn.addEventListener('click', () => this.closeModal());
      }

      // Overlay click
      if (overlay) {
        overlay.addEventListener('click', () => this.closeModal());
      }

      // Modal buttons
      const cancelBtn = modal.querySelector('[data-action="cancel"]');
      const confirmBtn = modal.querySelector('[data-action="confirm"]');

      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => this.closeModal());
      }

      if (confirmBtn) {
        confirmBtn.addEventListener('click', () => {
          if (this.currentCallback) {
            this.currentCallback();
          }
          this.closeModal();
        });
      }

      // Escape key
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.closeModal();
        }
      });
    },

    showModal(modalEl) {
      const overlay = document.getElementById('modalOverlay');
      if (overlay) {
        overlay.classList.remove('hidden');
      }
      if (modalEl) {
        modalEl.classList.remove('hidden');
      }
    },

    closeModal() {
      const overlay = document.getElementById('modalOverlay');
      const modal = document.getElementById('confirmModal');

      if (overlay) {
        overlay.classList.add('hidden');
      }
      if (modal) {
        modal.classList.add('hidden');
      }

      this.currentCallback = null;
    },

    showConfirmation(title, message, callback) {
      const modal = document.getElementById('confirmModal');
      const titleEl = modal.querySelector('#confirmTitle');
      const messageEl = modal.querySelector('#confirmMessage');

      titleEl.textContent = title;
      messageEl.textContent = message;

      this.currentCallback = callback;
      this.showModal(modal);
    }
  };

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', () => {
    Modal.init();
  });

  // Export to window
  window.showModal = (modalEl) => Modal.showModal(modalEl);
  window.closeModal = () => Modal.closeModal();
  window.showConfirmation = (title, message, callback) => Modal.showConfirmation(title, message, callback);
})();
