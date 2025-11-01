// Merchant authentication logic
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    bindLoginForm();
    bindPasswordToggle();
    bindRegistrationModal();
  });

  function bindLoginForm(){
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const remember = document.querySelector('input[name="remember"]').checked;

      // Demo credentials
      if(email === 'merchant@test.com' && password === 'merchant123'){
        TMM.save('merchantAuth', { email, businessName: 'Demo Merchant' });
        if(remember) TMM.save('merchantEmail', email);
        TMM.toast('Login successful!', 'success');
        setTimeout(() => location.href = './merchant-dashboard.html', 1500);
      } else {
        document.querySelector('.error-msg').textContent = 'Invalid email or password';
        TMM.toast('Invalid credentials', 'danger');
      }
    });
  }

  function bindPasswordToggle(){
    const toggleBtn = document.getElementById('togglePassword');
    const passwordInput = document.getElementById('loginPassword');
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.type === 'password' ? 'text' : 'password';
      passwordInput.type = type;
      toggleBtn.innerHTML = type === 'password' 
        ? '<i class="fa-solid fa-eye"></i>'
        : '<i class="fa-solid fa-eye-slash"></i>';
    });
  }

  function bindRegistrationModal(){
    const modal = document.getElementById('registrationModal');
    const registerBtn = document.getElementById('registerBtn');
    const closeBtn = document.getElementById('closeRegisterModal');
    const form = document.getElementById('registrationForm');

    registerBtn.addEventListener('click', () => {
      // show with fade-in
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('show'));
    });

    closeBtn.addEventListener('click', () => {
      // fade-out then hide
      modal.classList.remove('show');
      setTimeout(() => modal.hidden = true, 200);
    });
      e.preventDefault();
      if(validateRegistrationForm()){
        const formData = new FormData(form);
        const merchantData = {
          id: 'MER-' + Date.now(),
          businessName: formData.get('businessName'),
          ownerName: formData.get('ownerName'),
          email: formData.get('email'),
          phone: formData.get('phone'),
          address: formData.get('address'),
          yearsOperation: formData.get('yearsOperation'),
          fleetSize: formData.get('fleetSize'),
          description: formData.get('description'),
          status: 'pending_approval',
          createdAt: new Date().toISOString()
        };

        let merchants = TMM.load('merchantApplications', []);
        merchants.push(merchantData);
        TMM.save('merchantApplications', merchants);

        TMM.toast('Application submitted! We\'ll review it within 2-3 business days.', 'success');
        modal.hidden = true;
        form.reset();
        setTimeout(() => location.href = './index.html', 2000);
      }
    });
  }

  function validateRegistrationForm(){
    const form = document.getElementById('registrationForm');
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    fields.forEach(field => {
      const errorMsg = field.parentElement.querySelector('.error-msg');
      if(!field.value.trim()){
        if(errorMsg) errorMsg.textContent = 'This field is required';
        isValid = false;
      } else {
        if(errorMsg) errorMsg.textContent = '';
      }
    });

    const termsCheckbox = document.querySelector('input[name="termsAgree"]');
    if(!termsCheckbox.checked){
      document.getElementById('termsError').textContent = 'You must agree to the terms';
      isValid = false;
    } else {
      document.getElementById('termsError').textContent = '';
    }

    return isValid;
  }
})();
