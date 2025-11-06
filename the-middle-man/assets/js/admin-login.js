// Admin login with rate limiting and CAPTCHA trigger (mock)
(function(){
  const KEY_ATTEMPTS = 'tmm.security.loginAttempts';
  const KEY_SESSION = 'tmm.session.admin';

  function getAttempts(){ return JSON.parse(localStorage.getItem(KEY_ATTEMPTS) || '[]'); }
  function setAttempts(a){ localStorage.setItem(KEY_ATTEMPTS, JSON.stringify(a)); }

  function pruneAttempts(){
    const now = Date.now();
    const a = getAttempts().filter(ts => now - ts < 5*60*1000); // keep last 5 minutes
    setAttempts(a);
    return a;
  }

  function lockoutActive(){
    const a = JSON.parse(localStorage.getItem(KEY_ATTEMPTS + '.lock') || '0');
    return a && a > Date.now();
  }
  function setLockout(minutes){ localStorage.setItem(KEY_ATTEMPTS + '.lock', String(Date.now() + minutes*60*1000)); }

  function showCaptchaIfNeeded(fails){
    const captcha = document.getElementById('captchaContainer');
    if (!captcha) return;
    if (fails >= 2) captcha.classList.remove('hidden'); else captcha.classList.add('hidden');
  }

  function adminLogin(email, password, twofa){
    const fails = pruneAttempts().length;
    if (lockoutActive()) { window.showNotification('Account locked. Try again later', 'error'); return false; }
    showCaptchaIfNeeded(fails);

    // demo credentials
    const ok = email === 'admin@themiddleman.ph' && password === 'admin123456';

    if (!ok) {
      const a = pruneAttempts(); a.push(Date.now()); setAttempts(a);
      if (a.length >= 5) { setLockout(15); window.showNotification('Too many attempts. Locked for 15 minutes', 'warning'); }
      else window.showNotification('Invalid credentials', 'error');
      return false;
    }

    const session = { email, role: 'super_admin', expiresAt: Date.now() + 30*60*1000 };
    sessionStorage.setItem(KEY_SESSION, JSON.stringify(session));
    window.location.href = './admin-dashboard.html';
    return true;
  }

  window.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('adminLoginForm');
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('adminEmail').value.trim();
      const pwd = document.getElementById('adminPassword').value;
      const twofa = document.getElementById('admin2fa').value.trim();
      adminLogin(email, pwd, twofa);
    });
  });
})();
