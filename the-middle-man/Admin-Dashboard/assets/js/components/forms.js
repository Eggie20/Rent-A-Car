// Form helpers and validation utilities
(function () {
  function showError(field, message) {
    const errorEl = document.getElementById(field.id + 'Error');
    field.classList.add('input-error');
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) errorEl.textContent = message || '';
  }
  function clearError(field) {
    const errorEl = document.getElementById(field.id + 'Error');
    field.classList.remove('input-error');
    field.removeAttribute('aria-invalid');
    if (errorEl) errorEl.textContent = '';
  }
  function showSuccess(field) {
    field.classList.add('input-valid');
    setTimeout(() => field.classList.remove('input-valid'), 1000);
  }

  window.showError = showError;
  window.clearError = clearError;
  window.showSuccess = showSuccess;
})();
