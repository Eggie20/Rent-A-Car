// Vehicle search, filter, sort, and comparison logic
(function(){
  let allVehicles = [...TMM.data.vehicles];
  let filteredVehicles = [...allVehicles];
  let currentPage = 1;
  const itemsPerPage = 12;
  let viewMode = TMM.load('viewMode', 'grid');
  let selectedForComparison = [];

  const state = {
    filters: {
      priceMax: 5000,
      types: [],
      transmission: '',
      seats: [],
      fuel: [],
      rating: '',
      features: []
    },
    sort: 'recommended'
  };

  document.addEventListener('DOMContentLoaded', () => {
    loadSearchParams();
    applyFilters();
    renderVehicles();
    bindFilterListeners();
    bindSortListener();
    bindViewToggle();
    bindPaginationListeners();
    bindComparisonListeners();
    bindEditSearchModal();
  });

  function loadSearchParams(){
    const params = new URLSearchParams(location.search);
    const location = params.get('location') || 'Manolo Fortich';
    const pickup = params.get('pickup') || '';
    const returnDate = params.get('return') || '';
    const type = params.get('type') || '';

    document.getElementById('criteriaLocation').textContent = location;
    if(pickup && returnDate){
      const p = new Date(pickup).toLocaleDateString();
      const r = new Date(returnDate).toLocaleDateString();
      document.getElementById('criteriaDates').textContent = `${p} to ${r}`;
    }
    document.getElementById('criteriaType').textContent = type || 'All';

    document.getElementById('editLocation').value = location;
    document.getElementById('editPickup').value = pickup;
    document.getElementById('editReturn').value = returnDate;
    document.getElementById('editType').value = type;

    if(type) state.filters.types = [type];
  }

  function bindFilterListeners(){
    // Price slider
    document.getElementById('priceSlider').addEventListener('input', (e) => {
      state.filters.priceMax = parseInt(e.target.value);
      document.getElementById('priceDisplay').textContent = state.filters.priceMax;
      applyFilters();
      renderVehicles();
    });

    // Type checkboxes
    document.querySelectorAll('input[name="type"]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.types = Array.from(document.querySelectorAll('input[name="type"]:checked')).map(c => c.value);
        applyFilters();
        renderVehicles();
      });
    });

    // Transmission radio
    document.querySelectorAll('input[name="transmission"]').forEach(rb => {
      rb.addEventListener('change', () => {
        state.filters.transmission = rb.value;
        applyFilters();
        renderVehicles();
      });
    });

    // Seats checkboxes
    document.querySelectorAll('input[name="seats"]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.seats = Array.from(document.querySelectorAll('input[name="seats"]:checked')).map(c => parseInt(c.value));
        applyFilters();
        renderVehicles();
      });
    });

    // Fuel checkboxes
    document.querySelectorAll('input[name="fuel"]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.fuel = Array.from(document.querySelectorAll('input[name="fuel"]:checked')).map(c => c.value);
        applyFilters();
        renderVehicles();
      });
    });

    // Rating radio
    document.querySelectorAll('input[name="rating"]').forEach(rb => {
      rb.addEventListener('change', () => {
        state.filters.rating = rb.value;
        applyFilters();
        renderVehicles();
      });
    });

    // Features checkboxes
    document.querySelectorAll('input[name="features"]').forEach(cb => {
      cb.addEventListener('change', () => {
        state.filters.features = Array.from(document.querySelectorAll('input[name="features"]:checked')).map(c => c.value);
        applyFilters();
        renderVehicles();
      });
    });

    // Clear filters
    document.getElementById('clearFiltersBtn').addEventListener('click', () => {
      state.filters = {priceMax: 5000, types: [], transmission: '', seats: [], fuel: [], rating: '', features: []};
      document.querySelectorAll('input[type="checkbox"], input[type="radio"]').forEach(el => el.checked = false);
      document.querySelector('input[name="transmission"]').checked = true;
      document.querySelector('input[name="rating"]').checked = true;
      document.getElementById('priceSlider').value = 5000;
      document.getElementById('priceDisplay').textContent = '5000';
      applyFilters();
      renderVehicles();
      TMM.toast('Filters cleared', 'info');
    });
  }

  function applyFilters(){
    filteredVehicles = allVehicles.filter(v => {
      if(v.pricePerDay > state.filters.priceMax) return false;
      if(state.filters.types.length > 0 && !state.filters.types.includes(v.type)) return false;
      if(state.filters.transmission && v.transmission !== state.filters.transmission) return false;
      if(state.filters.seats.length > 0 && !state.filters.seats.includes(v.seats)) return false;
      if(state.filters.fuel.length > 0 && !state.filters.fuel.includes(v.fuel)) return false;
      if(state.filters.rating && v.rating < parseFloat(state.filters.rating)) return false;
      if(state.filters.features.length > 0){
        const hasAll = state.filters.features.every(f => v.features.includes(f));
        if(!hasAll) return false;
      }
      return true;
    });

    applySorting();
    currentPage = 1;
    updateResultsCount();
  }

  function bindSortListener(){
    document.getElementById('sortSelect').addEventListener('change', (e) => {
      state.sort = e.target.value;
      applySorting();
      renderVehicles();
    });
  }

  function applySorting(){
    switch(state.sort){
      case 'price-low':
        filteredVehicles.sort((a, b) => a.pricePerDay - b.pricePerDay);
        break;
      case 'price-high':
        filteredVehicles.sort((a, b) => b.pricePerDay - a.pricePerDay);
        break;
      case 'rating':
        filteredVehicles.sort((a, b) => b.rating - a.rating);
        break;
      case 'reviews':
        filteredVehicles.sort((a, b) => b.reviews - a.reviews);
        break;
      case 'recommended':
      default:
        filteredVehicles.sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0) || b.rating - a.rating);
    }
  }

  function bindViewToggle(){
    document.querySelectorAll('.view-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        viewMode = btn.dataset.view;
        TMM.save('viewMode', viewMode);
        renderVehicles();
      });
    });
    document.querySelector(`[data-view="${viewMode}"]`)?.classList.add('active');
  }

  function renderVehicles(){
    const container = document.getElementById('vehiclesContainer');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageVehicles = filteredVehicles.slice(start, end);

    if(pageVehicles.length === 0){
      container.innerHTML = `
        <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 2rem;">
          <i class="fa-solid fa-car" style="font-size: 48px; color: var(--gray-200); margin-bottom: 1rem;"></i>
          <h3>No vehicles match your criteria</h3>
          <p>Try adjusting your filters or search parameters</p>
          <button class="btn btn-primary" onclick="document.getElementById('clearFiltersBtn').click()">Clear Filters</button>
        </div>`;
      return;
    }

    container.className = `vehicles-${viewMode}`;
    container.innerHTML = pageVehicles.map(v => vehicleCardHTML(v)).join('');

    // Bind card interactions
    container.querySelectorAll('.vehicle-card').forEach(card => {
      const vehicleId = card.dataset.id;
      card.querySelector('.favorite-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        toggleFavorite(vehicleId, card);
      });
      card.querySelector('.quick-view-btn')?.addEventListener('click', (e) => {
        e.preventDefault();
        showQuickView(vehicleId);
      });
      card.querySelector('.compare-checkbox')?.addEventListener('change', (e) => {
        toggleComparison(vehicleId, e.target.checked);
      });
    });

    updatePagination();
  }

  function vehicleCardHTML(v){
    const isFavorited = TMM.load('favorites', []).includes(v.id);
    const isCompared = selectedForComparison.includes(v.id);
    return `
    <article class="vehicle-card fade-in" data-id="${v.id}">
      <div class="thumb">
        <img src="${v.images[0]}" alt="${v.name}" loading="lazy" />
        ${v.premium ? '<span class="badge">Premium</span>' : ''}
        <button class="favorite-btn" title="Add to favorites">
          <i class="fa-${isFavorited ? 'solid' : 'regular'} fa-heart"></i>
        </button>
        <label class="compare-checkbox" title="Compare">
          <input type="checkbox" ${isCompared ? 'checked' : ''} />
          <span>Compare</span>
        </label>
      </div>
      <div class="content">
        <div class="title">${v.name}<span>${TMM.money(v.pricePerDay)}/day</span></div>
        <div class="meta">
          <span>${v.merchantName} ${v.verified ? '✔️' : ''}</span>
          <span>★ ${v.rating.toFixed(1)} (${v.reviews})</span>
        </div>
        <div class="specs">
          <span><i class="fa-solid fa-user-group"></i> ${v.seats}</span>
          <span><i class="fa-solid fa-gears"></i> ${v.transmission}</span>
          <span><i class="fa-solid fa-gas-pump"></i> ${v.fuel}</span>
        </div>
        <div class="actions">
          <button class="btn btn-outline btn-sm quick-view-btn">Quick View</button>
          <a class="btn btn-primary btn-sm" href="./vehicle-detail.html?id=${v.id}">Details</a>
        </div>
      </div>
    </article>`;
  }

  function toggleFavorite(vehicleId, card){
    let favorites = TMM.load('favorites', []);
    if(favorites.includes(vehicleId)){
      favorites = favorites.filter(id => id !== vehicleId);
      TMM.toast('Removed from favorites', 'info');
    } else {
      favorites.push(vehicleId);
      TMM.toast('Added to favorites', 'success');
    }
    TMM.save('favorites', favorites);
    const btn = card.querySelector('.favorite-btn i');
    btn.className = favorites.includes(vehicleId) ? 'fa-solid fa-heart' : 'fa-regular fa-heart';
  }

  function showQuickView(vehicleId){
    const v = allVehicles.find(x => x.id === vehicleId);
    if(!v) return;
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    content.innerHTML = `
      <div class="quick-view-content">
        <div class="qv-image">
          <img src="${v.images[0]}" alt="${v.name}" />
        </div>
        <div class="qv-info">
          <h3>${v.name}</h3>
          <p class="merchant">${v.merchantName} ${v.verified ? '✔️' : ''}</p>
          <div class="rating">★ ${v.rating.toFixed(1)} (${v.reviews} reviews)</div>
          <div class="price" style="font-size: 1.5rem; font-weight: 700; color: var(--primary); margin: 1rem 0;">
            ${TMM.money(v.pricePerDay)}/day
          </div>
          <div class="specs-grid">
            <div><strong>Seats:</strong> ${v.seats}</div>
            <div><strong>Transmission:</strong> ${v.transmission}</div>
            <div><strong>Fuel:</strong> ${v.fuel}</div>
            <div><strong>Year:</strong> ${v.year}</div>
          </div>
          <div class="features" style="margin-top: 1rem;">
            <strong>Features:</strong>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.5rem;">
              ${v.features.map(f => `<span class="badge info">${f}</span>`).join('')}
            </div>
          </div>
          <div style="display: flex; gap: 0.5rem; margin-top: 1.5rem;">
            <a href="./vehicle-detail.html?id=${v.id}" class="btn btn-primary">Full Details</a>
            <a href="./booking.html?id=${v.id}" class="btn btn-secondary">Book Now</a>
          </div>
        </div>
      </div>`;
    modal.hidden = false;
  }

  function bindComparisonListeners(){
    document.getElementById('closeCompare').addEventListener('click', () => {
      document.getElementById('compareModal').hidden = true;
    });
    document.getElementById('compareButton').addEventListener('click', () => {
      showComparison();
    });
  }

  function toggleComparison(vehicleId, checked){
    if(checked){
      if(selectedForComparison.length >= 3){
        TMM.toast('You can compare up to 3 vehicles', 'warning');
        return;
      }
      selectedForComparison.push(vehicleId);
    } else {
      selectedForComparison = selectedForComparison.filter(id => id !== vehicleId);
    }
    updateCompareButton();
  }

  function updateCompareButton(){
    const btn = document.getElementById('compareButton');
    const count = selectedForComparison.length;
    document.getElementById('compareCount').textContent = count;
    if(count >= 2){
      btn.hidden = false;
    } else {
      btn.hidden = true;
    }
  }

  function showComparison(){
    const vehicles = selectedForComparison.map(id => allVehicles.find(v => v.id === id)).filter(Boolean);
    const modal = document.getElementById('compareModal');
    const content = document.getElementById('compareContent');

    const rows = [
      { label: 'Image', key: 'image' },
      { label: 'Name', key: 'name' },
      { label: 'Price/Day', key: 'price' },
      { label: 'Seats', key: 'seats' },
      { label: 'Transmission', key: 'transmission' },
      { label: 'Fuel', key: 'fuel' },
      { label: 'Year', key: 'year' },
      { label: 'Rating', key: 'rating' },
      { label: 'Merchant', key: 'merchant' },
      { label: 'Action', key: 'action' }
    ];

    let html = '<table class="compare-table"><tbody>';
    rows.forEach(row => {
      html += '<tr>';
      html += `<td class="label">${row.label}</td>`;
      vehicles.forEach(v => {
        let cell = '';
        switch(row.key){
          case 'image':
            cell = `<img src="${v.images[0]}" alt="${v.name}" style="width: 100%; height: auto;" />`;
            break;
          case 'name':
            cell = v.name;
            break;
          case 'price':
            cell = TMM.money(v.pricePerDay);
            break;
          case 'seats':
            cell = v.seats;
            break;
          case 'transmission':
            cell = v.transmission;
            break;
          case 'fuel':
            cell = v.fuel;
            break;
          case 'year':
            cell = v.year;
            break;
          case 'rating':
            cell = `★ ${v.rating.toFixed(1)}`;
            break;
          case 'merchant':
            cell = v.merchantName;
            break;
          case 'action':
            cell = `<a href="./booking.html?id=${v.id}" class="btn btn-primary btn-sm">Book</a>`;
            break;
        }
        html += `<td>${cell}</td>`;
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    content.innerHTML = html;
    modal.hidden = false;
  }

  function bindPaginationListeners(){
    document.getElementById('prevPage').addEventListener('click', () => {
      if(currentPage > 1){
        currentPage--;
        renderVehicles();
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });
    document.getElementById('nextPage').addEventListener('click', () => {
      const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
      if(currentPage < totalPages){
        currentPage++;
        renderVehicles();
        window.scrollTo({top: 0, behavior: 'smooth'});
      }
    });
  }

  function updatePagination(){
    const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
    document.getElementById('currentPage').textContent = currentPage;
    document.getElementById('totalPages').textContent = totalPages;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === totalPages;
  }

  function updateResultsCount(){
    document.getElementById('resultsCount').textContent = `${filteredVehicles.length} vehicles found`;
  }

  function bindEditSearchModal(){
    const modal = document.getElementById('editSearchModal');
    document.getElementById('editSearchBtn').addEventListener('click', () => {
      modal.hidden = false;
      requestAnimationFrame(() => modal.classList.add('show'));
    });
-------
    document.getElementById('closeEditModal').addEventListener('click', () => {
      modal.classList.remove('show');
      setTimeout(() => modal.hidden = true, 200);
    });
-------
    document.getElementById('editSearchForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const params = new URLSearchParams(new FormData(e.target)).toString();
      location.href = `./vehicles.html?${params}`;
    });
  }
})();
