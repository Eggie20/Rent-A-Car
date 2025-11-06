// Content Management Module
window.ContentModule = (function() {
  'use strict';

  const Content = {
    db: null,
    currentTab: 'policy',
    contentData: {
      policy: 'Car Rental Policy\n\nWelcome to The Middle Man car rental service. Please read our policies carefully...',
      faq: 'Frequently Asked Questions\n\nQ: How do I book a car?\nA: Simply browse our vehicles and select your preferred dates...',
      about: 'About The Middle Man\n\nThe Middle Man is a leading car rental platform...',
      terms: 'Terms of Service\n\nBy using our service, you agree to these terms...'
    },

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadContent();
    },

    setupEventListeners() {
      // Tab buttons
      document.querySelectorAll('.content-tabs .tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const tab = btn.dataset.tab;
          this.switchTab(tab);
        });
      });

      // Save button
      const saveBtn = document.querySelector('[data-action="save-content"]');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveContent());
      }

      // Cancel button
      const cancelBtn = document.querySelector('[data-action="cancel-content"]');
      if (cancelBtn) {
        cancelBtn.addEventListener('click', () => this.loadContent());
      }
    },

    switchTab(tab) {
      this.currentTab = tab;

      // Update active tab button
      document.querySelectorAll('.content-tabs .tab-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      document.querySelector(`[data-tab="${tab}"]`).classList.add('active');

      // Load content
      this.loadContent();
    },

    loadContent() {
      const editor = document.getElementById('contentEditor');
      if (editor) {
        editor.value = this.contentData[this.currentTab] || '';
      }
    },

    saveContent() {
      const editor = document.getElementById('contentEditor');
      if (!editor) return;

      const content = editor.value;
      this.contentData[this.currentTab] = content;

      // Save to localStorage
      localStorage.setItem(`tmm.content.${this.currentTab}`, content);

      window.showToast('Content saved successfully', 'success');
    }
  };

  return Content;
})();
