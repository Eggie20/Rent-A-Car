// Toast notifications
(function () {
  const containerId = 'toastContainer';
  function ensureContainer() {
    let el = document.getElementById(containerId);
    if (!el) {
      el = document.createElement('div');
      el.id = containerId;
      el.className = 'toast-container';
      document.body.appendChild(el);
    }
    return el;
  }

  function showNotification(message, type = 'info', timeout = 3000) {
    const container = ensureContainer();
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'status');
    toast.setAttribute('aria-live', 'polite');
    toast.innerHTML = `<span>${message}</span><button class="toast-close" aria-label="Close">×</button>`;
    container.appendChild(toast);
    const remove = () => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 200);
    };
    toast.querySelector('button').addEventListener('click', remove);
    if (timeout) setTimeout(remove, timeout);
  }

  window.showNotification = showNotification;
  window.showToast = function(message, type = 'info', timeout = 3000) {
    const container = ensureContainer();
    const toast = document.createElement('div');
    toast.className = 'toast animate-slideInRight';
    
    let icon = 'fa-info-circle';
    if (type === 'success') icon = 'fa-check-circle';
    if (type === 'error') icon = 'fa-exclamation-circle';
    
    toast.innerHTML = `
      <i class="fas ${icon} toast-icon ${type}"></i>
      <span>${message}</span>
      <button class="toast-close" aria-label="Close notification">
        <i class="fas fa-times"></i>
      </button>
    `;
    
    container.appendChild(toast);
    
    const remove = () => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 300);
    };
    
    toast.querySelector('.toast-close').addEventListener('click', remove);
    if (timeout) setTimeout(remove, timeout);
  };
})();
