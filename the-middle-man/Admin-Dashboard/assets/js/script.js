// ============================================
// DASHBOARD INITIALIZATION
// ============================================

// DOM Elements
const dashboardSidebar = document.getElementById("dashboardSidebar");
const userMenu = document.getElementById("userMenu");
const userMenuTrigger = document.getElementById("user-menu-trigger");
const userMenuDropdown = document.querySelector(".user-menu-dropdown");
const themeToggle = document.getElementById("theme-toggle");
const dashboardViews = document.querySelectorAll(".dashboard-view");
const dashboardNavItems = document.querySelectorAll(".dashboard-nav-item");
const dashboardTitle = document.getElementById("dashboardTitle");
const dashboardSidebarOverlay = document.getElementById("dashboardSidebarOverlay");
const searchContainer = document.getElementById("searchContainer");
const searchInput = document.getElementById("searchInput");
const searchClose = document.getElementById("searchClose");
const mobileSearchBtn = document.getElementById("mobileSearchBtn");

// State
let sidebarCollapsed = false;
let currentView = "dashboard";
let mockDatabase = null;

// ===================================
// INITIALIZATION
// ===================================
document.addEventListener("DOMContentLoaded", function () {
  // Initialize database
  mockDatabase = new MockDatabase();
  
  initTheme();
  initThemeToggle();
  initSidebar();
  initUserMenu();
  initNavigation();
  initSearch();
  initCharts();
  initAdminModules();
});

// ===================================
// ADMIN MODULES INITIALIZATION
// ===================================
function initAdminModules() {
  if (window.UsersModule) window.UsersModule.init(mockDatabase);
  if (window.VehiclesModule) window.VehiclesModule.init(mockDatabase);
  if (window.BookingsModule) window.BookingsModule.init(mockDatabase);
  if (window.PaymentsModule) window.PaymentsModule.init(mockDatabase);
  if (window.MerchantsModule) window.MerchantsModule.init(mockDatabase);
  if (window.ReviewsModule) window.ReviewsModule.init(mockDatabase);
  if (window.ContentModule) window.ContentModule.init(mockDatabase);
  if (window.ReportsModule) window.ReportsModule.init(mockDatabase);
  if (window.SettingsModule) window.SettingsModule.init(mockDatabase);
  if (window.SecurityModule) window.SecurityModule.init(mockDatabase);
  if (window.AdminsModule) window.AdminsModule.init(mockDatabase);
}

// ===================================
// SIDEBAR FUNCTIONALITY
// ===================================
function initSidebar() {
  // Load saved sidebar state
  sidebarCollapsed = localStorage.getItem("dashboard-sidebar-collapsed") === "true";
  dashboardSidebar.classList.toggle("collapsed", sidebarCollapsed);
  
  // Sidebar toggle functionality
  document.querySelectorAll(".dashboard-sidebar-toggle").forEach((toggle) => {
    toggle.addEventListener("click", toggleSidebar);
  });
  
  // Sidebar overlay functionality
  dashboardSidebarOverlay?.addEventListener("click", closeSidebar);
}

function toggleSidebar() {
  sidebarCollapsed = !sidebarCollapsed;
  const isMobile = window.innerWidth <= 1024;
  if (isMobile) {
    // Mobile behavior - toggle sidebar and overlay together
    const isOpen = dashboardSidebar.classList.contains("collapsed");
    dashboardSidebar.classList.toggle("collapsed", !isOpen);
    dashboardSidebarOverlay?.classList.toggle("active", !isOpen);
  } else {
    // Desktop behavior
    dashboardSidebar.classList.toggle("collapsed", sidebarCollapsed);
  }
  localStorage.setItem("dashboard-sidebar-collapsed", sidebarCollapsed.toString());
}

function closeSidebar() {
  if (window.innerWidth <= 1024) {
    dashboardSidebar.classList.remove("collapsed");
    dashboardSidebarOverlay?.classList.remove("active");
  }
}

// ===================================
// USER MENU FUNCTIONALITY
// ===================================
function initUserMenu() {
  if (!userMenuTrigger || !userMenu) return;
  
  userMenuTrigger.addEventListener("click", (e) => {
    e.stopPropagation();
    userMenu.classList.toggle("active");
  });
  
  // Close menu when clicking outside or pressing escape
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      userMenu.classList.remove("active");
    }
  });
  
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && userMenu.classList.contains("active")) {
      userMenu.classList.remove("active");
    }
  });
}

// ===================================
// NAVIGATION FUNCTIONALITY
// ===================================
function initNavigation() {
  dashboardNavItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault();
      const viewId = item.getAttribute("data-view");
      if (viewId) switchView(viewId);
    });
  });
}

function switchView(viewId) {
  // Update active nav item
  dashboardNavItems.forEach((item) => {
    item.classList.toggle("active", item.getAttribute("data-view") === viewId);
  });
  
  // Hide all views and show selected one
  dashboardViews.forEach((view) => view.classList.remove("active"));
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.add("active");
    currentView = viewId;
    updatePageTitle(viewId);
    
    // Reinitialize modules when switching views
    reinitializeModuleForView(viewId);
  }
  
  // Close sidebar on mobile after navigation
  if (window.innerWidth <= 1024) closeSidebar();
}

function reinitializeModuleForView(viewId) {
  // Reinitialize the module data when switching to that view
  switch(viewId) {
    case 'users':
      if (window.UsersModule) window.UsersModule.loadUsers();
      break;
    case 'vehicles':
      if (window.VehiclesModule) window.VehiclesModule.loadVehicles();
      break;
    case 'bookings':
      if (window.BookingsModule) window.BookingsModule.loadBookings();
      break;
    case 'payments':
      if (window.PaymentsModule) window.PaymentsModule.loadPayments();
      break;
    case 'merchants':
      if (window.MerchantsModule) window.MerchantsModule.loadMerchants();
      break;
    case 'reviews':
      if (window.ReviewsModule) window.ReviewsModule.loadReviews();
      break;
    case 'security':
      if (window.SecurityModule) window.SecurityModule.loadLogs();
      break;
    case 'admins':
      if (window.AdminsModule) window.AdminsModule.loadAdmins();
      break;
  }
}

function updatePageTitle(viewId) {
  const titles = {
    dashboard: "Dashboard",
    users: "Users",
    vehicles: "Vehicles",
    bookings: "Bookings",
    payments: "Payments",
    merchants: "Merchants",
    reviews: "Reviews",
    content: "Content",
    reports: "Reports",
    settings: "Settings",
    security: "Security",
    admins: "Admins"
  };
  
  if (dashboardTitle) {
    dashboardTitle.textContent = titles[viewId] || "Dashboard";
  }
}

// ===================================
// THEME FUNCTIONALITY
// ===================================
function initTheme() {
  // Load saved theme
  const savedTheme = localStorage.getItem("dashboard-theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  
  // Update theme toggle UI
  updateThemeToggleUI(savedTheme);
}

function initThemeToggle() {
  if (!themeToggle) return;
  
  themeToggle.querySelectorAll(".theme-option").forEach((option) => {
    option.addEventListener("click", (e) => {
      e.stopPropagation();
      setTheme(option.getAttribute("data-theme"));
    });
  });
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("dashboard-theme", theme);
  updateThemeToggleUI(theme);
}

function updateThemeToggleUI(theme) {
  if (!themeToggle) return;
  
  themeToggle.querySelectorAll(".theme-option").forEach((option) => {
    option.classList.toggle("active", option.getAttribute("data-theme") === theme);
  });
}

// ===================================
// SEARCH FUNCTIONALITY
// ===================================
function initSearch() {
  mobileSearchBtn?.addEventListener("click", () => {
    searchContainer.classList.add("mobile-active");
    searchInput.focus();
  });
  
  searchClose?.addEventListener("click", () => {
    searchContainer.classList.remove("mobile-active");
    searchInput.value = "";
  });
  
  // Global search functionality
  searchInput?.addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    if (query.length > 0) {
      performGlobalSearch(query);
    }
  });
}

function performGlobalSearch(query) {
  if (!mockDatabase) return;
  
  const results = {
    users: mockDatabase.getAll('users').filter(u => 
      u.name.toLowerCase().includes(query) || u.email.toLowerCase().includes(query)
    ),
    vehicles: mockDatabase.getAll('vehicles').filter(v => 
      v.brand.toLowerCase().includes(query) || v.model.toLowerCase().includes(query)
    ),
    bookings: mockDatabase.getAll('bookings').filter(b => 
      b.id.toLowerCase().includes(query)
    ),
    merchants: mockDatabase.getAll('merchants').filter(m => 
      m.name.toLowerCase().includes(query) || m.email.toLowerCase().includes(query)
    )
  };
  
  console.log('Search results:', results);
}

// ===================================
// CHART INITIALIZATION
// ===================================
function initCharts() {
  initProgressChart();
  initCategoryChart();
}

function initProgressChart() {
  const ctx = document.getElementById("progressChart");
  if (!ctx) return;
  
  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7", "Week 8"],
      datasets: [
        {
          label: "Bookings",
          data: [120, 150, 180, 200, 220, 250, 280, 310],
          borderColor: "#8b5cf6",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: (value) => value }
        },
      },
    },
  });
}

function initCategoryChart() {
  const ctx = document.getElementById("categoryChart");
  if (!ctx) return;
  
  new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Sedan", "SUV", "Van", "Truck", "Coupe"],
      datasets: [
        {
          data: [120, 180, 90, 60, 45],
          backgroundColor: ["#8b5cf6", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
          borderWidth: 0,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            usePointStyle: true,
          },
        },
      },
    },
  });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================
window.getDatabase = function() {
  return mockDatabase;
};
