// Home page dynamic population
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    renderFeatured();
    renderMerchants();
    renderTestimonials();
    bindSearch();
  });

  function renderFeatured(){
    const el = document.getElementById('featuredGrid');
    if(!el) return;
    const featured = TMM.data.vehicles.filter(v=>v.featured).slice(0,6);
    el.innerHTML = featured.map(v => vehicleCard(v)).join('');
    el.querySelectorAll('.btn-request').forEach(btn=>btn.addEventListener('click',()=>{
      TMM.toast('Booking request flow starts on details page');
      location.href = './vehicle-detail.html?id=' + btn.dataset.id;
    }));
  }

  function vehicleCard(v){
    return `
    <article class="vehicle-card fade-in">
      <div class="thumb" aria-label="${v.name}">
        <img src="${v.images[0]}" alt="${v.name}" loading="lazy" />
        ${v.premium?'<span class="badge">Premium</span>':''}
      </div>
      <div class="content">
        <div class="title">${v.name}<span>${TMM.money(v.pricePerDay)}/day</span></div>
        <div class="meta">
          <span>${v.merchantName} ${v.verified?'✔️':''}</span>
          <span>★ ${v.rating.toFixed(1)} (${v.reviews})</span>
        </div>
        <div class="specs">
          <span><i class="fa-solid fa-user-group"></i> ${v.seats}</span>
          <span><i class="fa-solid fa-gears"></i> ${v.transmission}</span>
          <span><i class="fa-solid fa-gas-pump"></i> ${v.fuel}</span>
        </div>
        <div class="actions">
          <a class="btn btn-outline" href="./vehicle-detail.html?id=${v.id}">View Details</a>
          <button class="btn btn-primary btn-request" data-id="${v.id}">Request Booking</button>
        </div>
      </div>
    </article>`;
  }

  function renderMerchants(){
    const el = document.getElementById('merchantCarousel');
    if(!el) return;
    el.innerHTML = TMM.data.merchants.map(m=>`
      <div class="card" style="min-width:260px">
        <div style="display:flex;align-items:center;gap:.5rem">
          <div style="width:44px;height:44px;border-radius:50%;background:var(--secondary);display:flex;align-items:center;justify-content:center;color:#111827;font-weight:800">${m.name.split(' ').map(x=>x[0]).join('').slice(0,2)}</div>
          <div>
            <div style="font-weight:700">${m.name} ${m.verified?'✔️':''}</div>
            <div style="color:var(--muted)">★ ${m.rating} (${m.reviews})</div>
          </div>
        </div>
        <p style="margin:.5rem 0 0">Trusted local partner</p>
      </div>
    `).join('');
  }

  function renderTestimonials(){
    const el = document.getElementById('testimonialSlider');
    if(!el) return;
    const reviews = [
      {name:'Ana', rating:5, text:'Smooth booking and clean vehicle!'},
      {name:'Marco', rating:5, text:'Quick approval and friendly merchant.'},
      {name:'Leah', rating:4, text:'Great pricing for weekend trip.'},
    ];
    el.innerHTML = reviews.map(r=>`
      <div class="card" style="min-width:260px">
        <div style="font-weight:700">${r.name}</div>
        <div>★ ${r.rating}</div>
        <p style="margin:.5rem 0 0">${r.text}</p>
      </div>
    `).join('');
  }

  function bindSearch(){
    const form = document.getElementById('searchForm');
    if(!form) return;
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const params = new URLSearchParams(new FormData(form)).toString();
      console.log('Search', Object.fromEntries(new FormData(form).entries()));
      location.href = `./vehicles.html?${params}`;
    });
  }
})();
