// System Settings Module
window.SettingsModule = (function() {
  'use strict';

  const Settings = {
    db: null,
    defaultSettings: {
      siteName: 'The Middle Man',
      siteEmail: 'admin@themiddleman.ph',
      timezone: 'UTC+8',
      currency: 'PHP',
      defaultTheme: 'light'
    },

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadSettings();
    },

    setupEventListeners() {
      const saveBtn = document.querySelector('[data-action="save-settings"]');
      if (saveBtn) {
        saveBtn.addEventListener('click', () => this.saveSettings());
      }

      const resetBtn = document.querySelector('[data-action="reset-settings"]');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => this.resetSettings());
      }
    },

    loadSettings() {
      const settings = this.getSettings();

      document.getElementById('siteName').value = settings.siteName;
      document.getElementById('siteEmail').value = settings.siteEmail;
      document.getElementById('timezone').value = settings.timezone;
      document.getElementById('currency').value = settings.currency;
      document.getElementById('defaultTheme').value = settings.defaultTheme;
    },

    getSettings() {
      const saved = localStorage.getItem('tmm.settings');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return this.defaultSettings;
        }
      }
      return this.defaultSettings;
    },

    saveSettings() {
      const settings = {
        siteName: document.getElementById('siteName').value,
        siteEmail: document.getElementById('siteEmail').value,
        timezone: document.getElementById('timezone').value,
        currency: document.getElementById('currency').value,
        defaultTheme: document.getElementById('defaultTheme').value
      };

      // Validate
      if (!settings.siteName || !settings.siteEmail) {
        window.showToast('Please fill in all required fields', 'error');
        return;
      }

      // Save to localStorage
      localStorage.setItem('tmm.settings', JSON.stringify(settings));

      window.showToast('Settings saved successfully', 'success');
    },

    resetSettings() {
      window.showConfirmation(
        'Reset Settings',
        'Are you sure you want to reset all settings to default values?',
        () => {
          localStorage.removeItem('tmm.settings');
          this.loadSettings();
          window.showToast('Settings reset to default', 'success');
        }
      );
    }
  };

  return Settings;
})();
