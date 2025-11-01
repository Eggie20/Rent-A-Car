// App shell: load header/footer, theme toggle, mobile nav, common listeners
(function(){
  async function include(selector, url){
    const host = document.querySelector(selector);
    if(!host) return;
    const res = await fetch(url);
    host.innerHTML = await res.text();
  }

  // Initialize app shell
  document.addEventListener('DOMContentLoaded', async () => {
    // Load shared components
    const base = location.pathname.includes('/pages/') ? '..' : '.';
    await include('#app-header', `${base}/components/header.html`);
    await include('#app-footer', `${base}/components/footer.html`);

    // Bind after injection
    bindShellInteractions();

    // Newsletter demo
    const newsletter = document.getElementById('newsletterForm');
    if(newsletter){
      newsletter.addEventListener('submit', (e)=>{
        e.preventDefault();
        const email = document.getElementById('newsletterEmail').value.trim();
        if(!email || !/^[^@]+@[^@]+\.[^@]+$/.test(email)){
          window.TMM.toast('Enter a valid email','danger');
          return;
        }
        TMM.save('newsletter', email);
        window.TMM.toast('Subscribed successfully','success');
      });
    }
  });

  function bindShellInteractions(){
    const themeToggle = document.getElementById('themeToggle');
    const root = document.documentElement;
    const savedTheme = TMM.load('theme','light');
    if(savedTheme==='dark') root.classList.add('dark');

    themeToggle && themeToggle.addEventListener('click', () => {
      root.classList.toggle('dark');
      const mode = root.classList.contains('dark') ? 'dark' : 'light';
      TMM.save('theme', mode);
      window.TMM.toast(`${mode==='dark'?'Dark':'Light'} mode enabled`, 'info');
    });

    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('navMenu');
    hamburger && hamburger.addEventListener('click', () => {
      const open = nav.style.display === 'flex';
      nav.style.display = open ? 'none' : 'flex';
      hamburger.setAttribute('aria-expanded', String(!open));
    });
  }
})();
