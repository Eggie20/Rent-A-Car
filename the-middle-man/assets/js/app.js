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
      nav.classList.toggle('open', !open);
      hamburger.setAttribute('aria-expanded', String(!open));
    });

    // Dropdown: hover on desktop, click/toggle on mobile
    const dropdown = document.querySelector('.nav-dropdown');
    const toggle = dropdown?.querySelector('.dropdown-toggle');
    const menu = dropdown?.querySelector('.dropdown-menu');

    if(dropdown && toggle && menu){
      // accessibility
      toggle.setAttribute('aria-haspopup', 'true');
      toggle.setAttribute('aria-expanded', 'false');

      // Desktop hover
      let hoverIntent;
      dropdown.addEventListener('mouseenter', () => {
        if(window.innerWidth >= 768){
          clearTimeout(hoverIntent);
          dropdown.classList.add('open');
          toggle.setAttribute('aria-expanded','true');
        }
      });
      dropdown.addEventListener('mouseleave', () => {
        if(window.innerWidth >= 768){
          hoverIntent = setTimeout(() => {
            dropdown.classList.remove('open');
            toggle.setAttribute('aria-expanded','false');
          }, 100);
        }
      });

      // Click toggle (mobile and desktop)
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = dropdown.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });

      // Close on outside click
      document.addEventListener('click', (e) => {
        if(!dropdown.contains(e.target)){
          dropdown.classList.remove('open');
          toggle.setAttribute('aria-expanded','false');
        }
      });
    }
  }
})();
