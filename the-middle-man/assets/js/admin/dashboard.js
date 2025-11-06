// Admin Dashboard Main Module
(function() {
  'use strict';

  // ============================================
  // Authentication Check
  // ============================================
  function isAdminLoggedIn() {
    const raw = sessionStorage.getItem('tmm.session.admin');
    if (!raw) return false;
    try {
      const session = JSON.parse(raw);
      return session.expiresAt > Date.now();
    } catch {
      return false;
    }
  }

  function protectPage() {
    if (!isAdminLoggedIn()) {
      window.location.href = './admin-login.html';
    }
  }

  // ============================================
  // Module Management
  // ============================================
  const ModuleManager = {
    currentModule: 'dashboard',
    modules: [
      'dashboard', 'users', 'vehicles', 'bookings', 'payments',
      'merchants', 'reviews', 'content', 'reports', 'settings',
      'security', 'admins'
    ],

    init() {
      this.setupNavigation();
      this.setupThemeToggle();
      this.setupProfileMenu();
      this.setupSidebarToggle();
      this.setupGlobalSearch();
      this.setupNotifications();
    },

    setupNavigation() {
      const navLinks = document.querySelectorAll('[data-module]');
      navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          const module = link.dataset.module;
          this.switchModule(module);
        });
      });
    },

    switchModule(moduleName) {
      if (!this.modules.includes(moduleName)) return;

      // Hide all modules
      this.modules.forEach(mod => {
        const el = document.getElementById(`${mod}Module`);
        if (el) el.classList.add('hidden');
      });

      // Show selected module
      const moduleEl = document.getElementById(`${moduleName}Module`);
      if (moduleEl) {
        moduleEl.classList.remove('hidden');
        moduleEl.classList.add('animate-fadeIn');
      }

      // Update active nav link
      document.querySelectorAll('[data-module]').forEach(link => {
        link.classList.remove('active');
      });
      document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');

      // Close sidebar on mobile
      const sidebar = document.getElementById('adminSidebar');
      if (sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }

      this.currentModule = moduleName;
    },

    setupThemeToggle() {
      const themeToggle = document.getElementById('themeToggle');
      const html = document.documentElement;

      // Load saved theme
      const savedTheme = localStorage.getItem('tmm.theme') || 'light';
      if (savedTheme === 'dark') {
        html.classList.add('dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      }

      themeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        localStorage.setItem('tmm.theme', isDark ? 'dark' : 'light');
        themeToggle.innerHTML = isDark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
      });
    },

    setupProfileMenu() {
      const profileBtn = document.getElementById('adminProfileBtn');
      const dropdown = document.getElementById('profileDropdown');

      profileBtn.addEventListener('click', () => {
        const isOpen = dropdown.classList.contains('hidden');
        dropdown.classList.toggle('hidden');
        profileBtn.setAttribute('aria-expanded', isOpen);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!profileBtn.contains(e.target) && !dropdown.contains(e.target)) {
          dropdown.classList.add('hidden');
          profileBtn.setAttribute('aria-expanded', 'false');
        }
      });

      // Handle dropdown actions
      dropdown.querySelectorAll('[data-action]').forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const action = item.dataset.action;
          this.handleProfileAction(action);
        });
      });
    },

    handleProfileAction(action) {
      switch (action) {
        case 'profile':
          window.showToast('Profile page coming soon', 'info');
          break;
        case 'settings':
          this.switchModule('settings');
          break;
        case 'activity':
          this.switchModule('security');
          break;
        case 'logout':
          this.logout();
          break;
      }
    },

    logout() {
      if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('tmm.session.admin');
        window.location.href = './admin-login.html';
      }
    },

    setupSidebarToggle() {
      const toggle = document.getElementById('sidebarToggle');
      const sidebar = document.getElementById('adminSidebar');

      toggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        toggle.setAttribute('aria-expanded', sidebar.classList.contains('open'));
      });
    },

    setupGlobalSearch() {
      const searchInput = document.getElementById('globalSearch');
      let searchTimeout;

      searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        const query = e.target.value.toLowerCase();

        searchTimeout = setTimeout(() => {
          if (query.length > 0) {
            this.performGlobalSearch(query);
          }
        }, 300);
      });
    },

    performGlobalSearch(query) {
      window.showToast(`Searching for: "${query}"`, 'info');
      // Implement actual search logic here
    },

    setupNotifications() {
      const notifBell = document.getElementById('notificationBell');
      const badge = document.getElementById('notifBadge');

      // Simulate notifications
      const notificationCount = Math.floor(Math.random() * 5);
      if (notificationCount > 0) {
        badge.textContent = notificationCount;
      }

      notifBell.addEventListener('click', () => {
        window.showToast('You have ' + notificationCount + ' new notifications', 'info');
      });
    }
  };

  // ============================================
  // Dashboard Overview
  // ============================================
  const DashboardOverview = {
    init(db) {
      this.initKpis(db);
      this.initCharts(db);
      this.initActivityFeed(db);
    },

    initKpis(db) {
      const users = db.getAll('users');
      const bookings = db.getAll('bookings');
      const payments = db.getAll('payments');

      document.getElementById('kpiUsers').textContent = users.length.toLocaleString();
      document.getElementById('kpiActiveRentals').textContent = bookings.filter(b => b.status === 'active').length;
      
      const revenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      document.getElementById('kpiRevenue').textContent = '₱' + revenue.toLocaleString('en-PH', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      document.getElementById('kpiPending').textContent = users.filter(u => u.status === 'pending').length;
    },

    initCharts(db) {
      this.createRevenueChart();
      this.createBookingStatusChart();
      this.createUserGrowthChart();
      this.createPopularVehiclesChart();
    },

    createRevenueChart() {
      const ctx = document.getElementById('revenueChart');
      if (!ctx) return;

      window.initCharts(ctx, 'line', {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
          label: 'Revenue (₱)',
          data: [12000, 15000, 9000, 20000, 18000, 22000, 25000],
          borderColor: '#1E40AF',
          backgroundColor: 'rgba(30, 64, 175, 0.1)',
          borderWidth: 2,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: '#1E40AF',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'top' }
        }
      });
    },

    createBookingStatusChart() {
      const ctx = document.getElementById('bookingStatusChart');
      if (!ctx) return;

      window.initCharts(ctx, 'doughnut', {
        labels: ['Pending', 'Confirmed', 'Active', 'Completed', 'Cancelled', 'Disputed'],
        datasets: [{
          data: [10, 20, 15, 30, 5, 2],
          backgroundColor: [
            '#F59E0B', '#10B981', '#1E40AF', '#6B7280', '#EF4444', '#8B5CF6'
          ],
          borderColor: 'var(--card-bg)',
          borderWidth: 2
        }]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true, position: 'right' }
        }
      });
    },

    createUserGrowthChart() {
      const ctx = document.getElementById('userGrowthChart');
      if (!ctx) return;

      window.initCharts(ctx, 'bar', {
        labels: ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [{
          label: 'New Users',
          data: [40, 55, 60, 70, 85, 90, 110],
          backgroundColor: '#10B981',
          borderRadius: 4,
          borderSkipped: false
        }]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true }
        }
      });
    },

    createPopularVehiclesChart() {
      const ctx = document.getElementById('popularVehiclesChart');
      if (!ctx) return;

      window.initCharts(ctx, 'bar', {
        labels: ['Sedan', 'SUV', 'Van', 'Truck', 'Coupe'],
        datasets: [{
          label: 'Bookings',
          data: [120, 180, 90, 60, 45],
          backgroundColor: '#1E40AF',
          borderRadius: 4,
          borderSkipped: false
        }]
      }, {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: true }
        }
      });
    },

    initActivityFeed(db) {
      const feedEl = document.getElementById('activityFeed');
      const logs = db.getAll('logs').slice(-15).reverse();

      if (!logs.length) {
        feedEl.innerHTML = '<p class="text-muted text-center">No recent activity</p>';
        return;
      }

      const frag = document.createDocumentFragment();
      logs.forEach(log => {
        const div = document.createElement('div');
        div.className = 'activity-item animate-fadeInUp';
        const time = new Date(log.ts).toLocaleString();
        div.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>${log.msg}</span>
            <span class="text-muted" style="font-size: 0.8rem;">${time}</span>
          </div>
        `;
        frag.appendChild(div);
      });

      feedEl.replaceChildren(frag);
    }
  };

  // ============================================
  // Initialization
  // ============================================
  window.addEventListener('DOMContentLoaded', () => {
    protectPage();

    // Initialize module manager
    ModuleManager.init();

    // Initialize database
    const db = new window.MockDatabase();

    // Initialize dashboard overview
    DashboardOverview.init(db);

    // Initialize other modules
    if (window.UsersModule) window.UsersModule.init(db);
    if (window.VehiclesModule) window.VehiclesModule.init(db);
    if (window.BookingsModule) window.BookingsModule.init(db);
    if (window.PaymentsModule) window.PaymentsModule.init(db);
    if (window.MerchantsModule) window.MerchantsModule.init(db);
    if (window.ReviewsModule) window.ReviewsModule.init(db);
    if (window.ContentModule) window.ContentModule.init(db);
    if (window.ReportsModule) window.ReportsModule.init(db);
    if (window.SettingsModule) window.SettingsModule.init(db);
    if (window.SecurityModule) window.SecurityModule.init(db);
    if (window.AdminsModule) window.AdminsModule.init(db);

    // Log initialization
    console.log('Admin Dashboard initialized successfully');
  });

  // Export for testing
  window.ModuleManager = ModuleManager;
  window.DashboardOverview = DashboardOverview;
})();
