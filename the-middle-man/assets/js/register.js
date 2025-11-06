// Registration flow implementation (mock-mode)
(function(){
  const STORAGE_DATA = 'tmm.register.data';
  const STORAGE_STEP = 'tmm.register.step';
  const SESSION_ADMIN = 'tmm.session.admin';

  function qs(sel, ctx=document){ return ctx.querySelector(sel); }
  function qsa(sel, ctx=document){ return Array.from(ctx.querySelectorAll(sel)); }

  function updateProgressBar(current, total){
    const el = document.getElementById('progressBar');
    if (!el) return;
    const pct = Math.round((current/total)*100);
    el.style.width = pct + '%';
    el.parentElement?.setAttribute('aria-valuenow', String(pct));
  }

  function saveStepData(step, data){
    const curr = JSON.parse(sessionStorage.getItem(STORAGE_DATA) || '{}');
    curr['step' + step] = { ...(curr['step' + step]||{}), ...data };
    sessionStorage.setItem(STORAGE_DATA, JSON.stringify(curr));
  }

  function loadData(){ return JSON.parse(sessionStorage.getItem(STORAGE_DATA) || '{}'); }

  function goToStep(step){
    const steps = qsa('.step');
    steps.forEach(s => s.classList.toggle('step--active', s.getAttribute('data-step') === String(step)));
    sessionStorage.setItem(STORAGE_STEP, String(step));
    updateProgressBar(Number(step), steps.length);
  }

  function isValidEmail(email){ return /.+@.+\..+/.test(email); }
  function isValidPhone(phone){ return /^\+63\s?\d{2}\s?\d{3}\s?\d{4}$/.test(phone.trim()); }
  function meetsPasswordRequirements(password){
    return {
      length: password.length >= 8,
      upper: /[A-Z]/.test(password),
      lower: /[a-z]/.test(password),
      digit: /\d/.test(password)
    };
  }
  function validatePassword(password){
    const reqs = meetsPasswordRequirements(password);
    const score = Object.values(reqs).filter(Boolean).length;
    const meter = document.getElementById('passwordStrength');
    if (meter) meter.style.width = (score/4*100) + '%';
    const list = document.getElementById('passwordReqs');
    if (list) list.innerHTML = `
      <li class="${reqs.length?'ok':'ng'}">At least 8 characters</li>
      <li class="${reqs.upper?'ok':'ng'}">Contains uppercase</li>
      <li class="${reqs.lower?'ok':'ng'}">Contains lowercase</li>
      <li class="${reqs.digit?'ok':'ng'}">Contains a number</li>`;
    return score === 4;
  }

  function validateField(field){
    if (!field) return true;
    const id = field.id;
    let valid = true; let message = '';
    switch(id){
      case 'fullName': valid = field.value.trim().split(' ').length >= 2; if(!valid) message='Enter full name (min 2 words)'; break;
      case 'email': valid = isValidEmail(field.value); if(!valid) message='Enter a valid email'; break;
      case 'phone': valid = isValidPhone(field.value); if(!valid) message='Use +63 XXX XXX XXXX'; break;
      case 'password': valid = validatePassword(field.value); if(!valid) message='Password does not meet requirements'; break;
      case 'confirmPassword': valid = field.value === qs('#password').value; if(!valid) message='Passwords do not match'; break;
      case 'dob': valid = !!field.value && calcAge(field.value) >= 18; if(!valid) message='Must be 18+'; break;
      default: if (field.hasAttribute('required')) { valid = !!field.value; if(!valid) message='This field is required'; }
    }
    if (!valid) window.showError(field, message); else window.clearError(field);
    return valid;
  }

  function calcAge(date){ const d=new Date(date); const diff=Date.now()-d.getTime(); return Math.abs(new Date(diff).getUTCFullYear()-1970); }

  function autoSaveProgress(){ setInterval(()=>{ const step = sessionStorage.getItem(STORAGE_STEP)||'1'; saveStep(step); }, 30000); }

  function saveStep(step){
    const container = qs(`.step[data-step='${step}']`);
    if (!container) return;
    const inputs = qsa('input, select, textarea', container);
    const data = {};
    inputs.forEach(inp => { if (inp.type === 'checkbox' || inp.type === 'radio') { if (inp.checked) { (data[inp.name] = data[inp.name] || []).push(inp.value||true); } } else { data[inp.id||inp.name] = inp.value; } });
    saveStepData(step, data);
  }

  function handleFileUpload(input){
    const maxMB = 2;
    const file = input.files && input.files[0]; if (!file) return;
    if (!file.type.startsWith('image/')) { showNotification('Only image files are allowed','warning'); input.value=''; return; }
    if (file.size > maxMB*1024*1024) { showNotification('Max 2MB file size','warning'); input.value=''; return; }
    const reader = new FileReader();
    reader.onload = () => {
      const preview = document.querySelector(`[data-preview='${input.dataset.upload}']`);
      if (preview) preview.style.backgroundImage = `url(${reader.result})`;
      saveStepData(sessionStorage.getItem(STORAGE_STEP)||'1', { [input.dataset.upload]: reader.result });
    };
    reader.readAsDataURL(file);
  }

  function submitRegistration(e){
    e.preventDefault();
    const steps = qsa('.step');
    // validate minimal required fields
    const requiredIds = ['fullName','email','phone','password','confirmPassword','dob'];
    const ok = requiredIds.every(id => validateField(qs('#'+id)));
    if (!ok) { showNotification('Fix highlighted errors','error'); return; }
    const data = loadData();
    // mock create user
    const db = new window.MockDatabase();
    const id = 'U' + (db.getAll('users').length + 1).toString().padStart(4,'0');
    db.add('users', { id, type:'renter', name: qs('#fullName').value, email: qs('#email').value, phone: qs('#phone').value, status:'pending', verified:false, joinDate:new Date().toISOString(), rating:'0.0', counts:{bookings:0,vehicles:0} });
    // send verification mock
    sendVerificationEmail();
    openModal('regSuccess', `<h2 id='regSuccess-title'>Account created</h2><p>We sent a verification link to ${qs('#email').value}.</p>`);
    setTimeout(() => { window.location.href = './verify-email.html'; }, 1200);
  }

  function sendVerificationEmail(){
    const token = Math.random().toString(36).slice(2);
    sessionStorage.setItem('tmm.email.verify.token', token);
  }
  function resendVerificationEmail(){
    sendVerificationEmail();
    showNotification('Verification email resent','success');
  }

  function formatPhoneNumber(value){
    const digits = value.replace(/\D/g,'');
    if (digits.startsWith('63')) return `+${digits.slice(0,2)} ${digits.slice(2,4)} ${digits.slice(4,7)} ${digits.slice(7,11)}`.trim();
    if (digits.startsWith('9')) return `+63 ${digits.slice(0,2)} ${digits.slice(2,5)} ${digits.slice(5,9)}`.trim();
    return '+63 ' + digits;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registrationForm');
    if (!form) return;

    // resume
    const step = sessionStorage.getItem(STORAGE_STEP) || '1';
    goToStep(step);

    // listeners
    form.addEventListener('input', (e) => {
      const t = e.target;
      if (t.id === 'password') validatePassword(t.value);
      if (t.id === 'phone') t.value = formatPhoneNumber(t.value);
      if (t.matches('input, select, textarea')) validateField(t);
    });

    form.addEventListener('change', (e) => {
      const t = e.target;
      if (t.type === 'file' && t.dataset.upload) handleFileUpload(t);
    });

    form.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]'); if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'continue') {
        const next = btn.getAttribute('data-next');
        saveStep(sessionStorage.getItem(STORAGE_STEP)||'1');
        goToStep(next);
      } else if (action === 'back') {
        const prev = btn.getAttribute('data-prev');
        goToStep(prev);
      }
    });

    form.addEventListener('submit', submitRegistration);

    const resendBtn = document.getElementById('resendEmailBtn');
    if (resendBtn) {
      let cooldown = 0; let timer;
      const cdEl = document.getElementById('resendCountdown');
      const tick = () => { cooldown -= 1; if (cdEl) cdEl.textContent = cooldown>0 ? `(${cooldown}s)` : ''; if (cooldown<=0){ clearInterval(timer); resendBtn.disabled=false; } };
      resendBtn.addEventListener('click', () => { if (cooldown>0) return; resendVerificationEmail(); cooldown=60; resendBtn.disabled=true; tick(); timer=setInterval(tick,1000); });
    }

    autoSaveProgress();
  });

  // expose some utilities globally
  window.updateProgressBar = updateProgressBar;
  window.goToStep = goToStep;
})();
