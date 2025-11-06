// Auth pages utilities: login helpers and registration modal handlers
(function(){
  function setupModal(){
    const modal = document.getElementById('registrationModal');
    const openBtn = document.getElementById('registerBtn');
    const closeBtn = document.getElementById('closeRegisterModal');
    const cancelBtn = document.getElementById('cancelRegistration');
    
    if(!modal || !openBtn) return;

    const open = (e) => {
      e?.preventDefault();
      modal.removeAttribute('hidden');
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };
    
    const close = (e) => {
      e?.preventDefault();
      modal.setAttribute('hidden', '');
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    // Open modal on register button click
    openBtn.addEventListener('click', open);
    
    // Close modal on close button click
    closeBtn && closeBtn.addEventListener('click', close);
    
    // Close modal on cancel button click
    cancelBtn && cancelBtn.addEventListener('click', close);

    // Close modal on backdrop click or data-close elements
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-backdrop') || e.target.hasAttribute('data-close')) {
        close();
      }
    });

    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !modal.hasAttribute('hidden')) {
        close();
      }
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', setupModal);
  } else {
    setupModal();
  }
})();
