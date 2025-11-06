// Admin Login JavaScript

// DOM Elements
const themeToggle = document.getElementById('themeToggle');
const body = document.body;
const form = document.getElementById('adminLoginForm');
const alertsContainer = document.getElementById('loginAlerts');
const emailInput = document.getElementById('adminEmail');
const passwordInput = document.getElementById('adminPassword');

// Theme Toggle Functionality
function initThemeToggle() {
  const icon = themeToggle.querySelector('i');
  
  // Check for saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    body.classList.add('dark-mode');
    icon.classList.remove('fa-moon');
    icon.classList.add('fa-sun');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
      localStorage.setItem('theme', 'dark');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
      localStorage.setItem('theme', 'light');
    }
  });
}

// Alert Notification System
function showAlert(message, type = 'error') {
  // Clear existing alerts
  alertsContainer.innerHTML = '';
  
  // Create new alert
  const alert = document.createElement('div');
  alert.className = `alert ${type}`;
  
  const iconClass = type === 'error' ? 'exclamation-circle' : 
                    type === 'success' ? 'check-circle' : 
                    'info-circle';
  
  alert.innerHTML = `
    <i class="fas fa-${iconClass}"></i>
    <span>${message}</span>
  `;
  
  alertsContainer.appendChild(alert);
  
  // Auto-remove alert after 5 seconds
  setTimeout(() => {
    alert.style.animation = 'fadeOut 0.3s ease';
    setTimeout(() => {
      if (alert.parentElement) {
        alert.remove();
      }
    }, 300);
  }, 5000);
}

// Form Validation
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePassword(password) {
  return password.length >= 6;
}

// Form Submission Handler
function handleFormSubmit(e) {
  e.preventDefault();
  
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const rememberMe = document.getElementById('rememberMe').checked;
  
  // Client-side validation
  if (!email) {
    showAlert('Please enter your email address.', 'error');
    emailInput.focus();
    return;
  }
  
  if (!validateEmail(email)) {
    showAlert('Please enter a valid email address.', 'error');
    emailInput.focus();
    return;
  }
  
  if (!password) {
    showAlert('Please enter your password.', 'error');
    passwordInput.focus();
    return;
  }
  
  if (!validatePassword(password)) {
    showAlert('Password must be at least 6 characters long.', 'error');
    passwordInput.focus();
    return;
  }
  
  // Disable submit button during processing
  const submitButton = form.querySelector('.login-button');
  submitButton.disabled = true;
  submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Signing In...';
  
  // Demo authentication (replace with actual API call)
  setTimeout(() => {
    if (email === 'admin@themiddleman.ph' && password === 'admin123456') {
      // Success
      showAlert('Login successful! Redirecting to dashboard...', 'success');
      
      // Store remember me preference
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
        localStorage.setItem('adminEmail', email);
      } else {
        localStorage.removeItem('rememberMe');
        localStorage.removeItem('adminEmail');
      }

      // Create admin session expected by dashboard protector
      const session = {
        email,
        createdAt: Date.now(),
        // 24-hour session expiry
        expiresAt: Date.now() + 24 * 60 * 60 * 1000
      };
      sessionStorage.setItem('tmm.session.admin', JSON.stringify(session));
      
      // Redirect to dashboard after 1.5 seconds
      setTimeout(() => {
        // Use relative path consistent with dashboard.js redirects
        window.location.href = './admin-dashboard.html';
      }, 1500);
    } else {
      // Failure
      showAlert('Invalid email or password. Please try again.', 'error');
      submitButton.disabled = false;
      submitButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
      passwordInput.value = '';
      passwordInput.focus();
    }
  }, 1000); // Simulate network delay
}

// Input Focus Effects
function initInputEffects() {
  const inputs = document.querySelectorAll('.form-group input');
  
  inputs.forEach(input => {
    input.addEventListener('focus', () => {
      input.parentElement.classList.add('focused');
    });
    
    input.addEventListener('blur', () => {
      input.parentElement.classList.remove('focused');
    });
  });
}

// Load Saved Email (if remember me was checked)
function loadSavedCredentials() {
  const rememberMe = localStorage.getItem('rememberMe');
  const savedEmail = localStorage.getItem('adminEmail');
  
  if (rememberMe === 'true' && savedEmail) {
    emailInput.value = savedEmail;
    document.getElementById('rememberMe').checked = true;
  }
}

// Keyboard Navigation
function initKeyboardNavigation() {
  // Allow Enter key to submit from any input
  emailInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      passwordInput.focus();
      e.preventDefault();
    }
  });
  
  passwordInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      form.dispatchEvent(new Event('submit'));
    }
  });
}

// Security: Prevent multiple rapid submissions
let isSubmitting = false;
function preventDoubleSubmit(e) {
  if (isSubmitting) {
    e.preventDefault();
    return false;
  }
  isSubmitting = true;
  setTimeout(() => {
    isSubmitting = false;
  }, 2000);
}

// Initialize All Features
function init() {
  // Initialize theme toggle
  initThemeToggle();
  
  // Load saved credentials
  loadSavedCredentials();
  
  // Initialize input effects
  initInputEffects();
  
  // Initialize keyboard navigation
  initKeyboardNavigation();
  
  // Add form submit handler
  form.addEventListener('submit', (e) => {
    preventDoubleSubmit(e);
    handleFormSubmit(e);
  });
  
  // Add input validation on blur
  emailInput.addEventListener('blur', () => {
    const email = emailInput.value.trim();
    if (email && !validateEmail(email)) {
      emailInput.classList.add('input-error');
    } else {
      emailInput.classList.remove('input-error');
    }
  });
  
  // Clear error styling on input
  emailInput.addEventListener('input', () => {
    emailInput.classList.remove('input-error');
  });
  
  passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('input-error');
  });
  
  console.log('Admin Login initialized');
}

// Run initialization when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}