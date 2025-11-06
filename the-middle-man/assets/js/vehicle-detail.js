// Vehicle detail page logic
(function(){
  let currentVehicle = null;
  let currentImageIndex = 0;

  document.addEventListener('DOMContentLoaded', () => {
    const vehicleId = new URLSearchParams(location.search).get('id');
    if(!vehicleId){
      location.href = './vehicles.html';
      return;
    }

    currentVehicle = TMM.data.vehicles.find(v => v.id === vehicleId);
    if(!currentVehicle){
      location.href = './vehicles.html';
      return;
    }

    renderVehicleDetails();
    bindGalleryControls();
    bindTabControls();
    bindBookingWidget();
    renderSimilarVehicles();
  });

  function renderVehicleDetails(){
    const v = currentVehicle;

    // Breadcrumb
    document.getElementById('breadcrumbTitle').textContent = v.name;

    // Gallery
    const mainImage = document.getElementById('mainImage');
    mainImage.src = v.images[0];
    document.getElementById('totalImages').textContent = v.images.length;

    const thumbnailStrip = document.getElementById('thumbnailStrip');
    thumbnailStrip.innerHTML = v.images.map((img, i) => `
      <img src="${img}" alt="Thumbnail ${i+1}" class="thumbnail ${i === 0 ? 'active' : ''}" data-index="${i}" />
    `).join('');
    thumbnailStrip.querySelectorAll('.thumbnail').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        currentImageIndex = parseInt(e.target.dataset.index);
        updateGallery();
      });
    });

    // Vehicle Info
    document.getElementById('vehicleName').textContent = v.name;
    document.getElementById('merchantName').textContent = v.merchantName;
    if(v.verified) document.getElementById('verifiedBadge').hidden = false;

    // Rating
    const stars = '★'.repeat(Math.floor(v.rating)) + '☆'.repeat(5 - Math.floor(v.rating));
    document.getElementById('ratingStars').innerHTML = `<span style="color: var(--secondary);">${stars}</span>`;
    document.getElementById('reviewCount').textContent = `${v.rating.toFixed(1)} (${v.reviews} reviews)`;
    document.getElementById('ratingLarge').textContent = v.rating.toFixed(1);

    // Price
    const dailyRate = TMM.money(v.pricePerDay);
    const weeklyRate = TMM.money(v.pricePerDay * 7 * 0.9);
    const monthlyRate = TMM.money(v.pricePerDay * 30 * 0.8);

    document.getElementById('priceDisplay').innerHTML = `<div style="font-size: 2rem; font-weight: 800; color: var(--primary);">${dailyRate}</div><div style="color: var(--muted);">per day</div>`;
    document.getElementById('dailyRate').textContent = dailyRate;
    document.getElementById('weeklyRate').textContent = weeklyRate;
    document.getElementById('monthlyRate').textContent = monthlyRate;
    document.getElementById('dailyRateWidget').textContent = dailyRate;

    // Specs
    document.getElementById('specYear').textContent = v.year;
    document.getElementById('specSeats').textContent = `${v.seats} seats`;
    document.getElementById('specTransmission').textContent = v.transmission;
    document.getElementById('specFuel').textContent = v.fuel;

    // Features
    const featuresList = document.getElementById('featuresList');
    featuresList.innerHTML = v.features.map(f => `
      <div class="feature-item">
        <i class="fa-solid fa-check" style="color: var(--success);"></i>
        <span>${f}</span>
      </div>
    `).join('');

    // Destinations
    const destinations = document.getElementById('destinations');
    destinations.innerHTML = v.destinations.map(d => `<span class="badge info">${d}</span>`).join('');

    // Merchant Info
    document.getElementById('merchantNameDetail').textContent = v.merchantName;
    document.getElementById('merchantRating').textContent = `${v.rating.toFixed(1)} ★`;

    // Reviews (mock)
    const reviews = [
      { name: 'John Doe', rating: 5, text: 'Excellent vehicle and smooth booking process!', date: '2 weeks ago' },
      { name: 'Maria Santos', rating: 4, text: 'Good condition, friendly merchant.', date: '1 month ago' },
      { name: 'Carlos Reyes', rating: 5, text: 'Perfect for our family trip!', date: '1 month ago' }
    ];
    const reviewsList = document.getElementById('reviewsList');
    reviewsList.innerHTML = reviews.map(r => `
      <div class="review-card">
        <div class="review-header">
          <strong>${r.name}</strong>
          <span class="review-date">${r.date}</span>
        </div>
        <div class="review-rating">★ ${r.rating}</div>
        <p>${r.text}</p>
        <div class="review-actions">
          <button class="btn btn-sm btn-outline">Helpful</button>
        </div>
      </div>
    `).join('');
  }

  function bindGalleryControls(){
    document.getElementById('prevImage').addEventListener('click', () => {
      currentImageIndex = (currentImageIndex - 1 + currentVehicle.images.length) % currentVehicle.images.length;
      updateGallery();
    });
    document.getElementById('nextImage').addEventListener('click', () => {
      currentImageIndex = (currentImageIndex + 1) % currentVehicle.images.length;
      updateGallery();
    });
  }

  function updateGallery(){
    document.getElementById('mainImage').src = currentVehicle.images[currentImageIndex];
    document.getElementById('currentImageIndex').textContent = currentImageIndex + 1;
    document.querySelectorAll('.thumbnail').forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentImageIndex);
    });
  }

  function bindTabControls(){
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const tabName = btn.dataset.tab;
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(tabName).classList.add('active');
      });
    });
  }

  function bindBookingWidget(){
    const pickupInput = document.getElementById('pickupWidget');
    const returnInput = document.getElementById('returnWidget');

    // Set default dates (tomorrow and day after)
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    pickupInput.value = tomorrow.toISOString().slice(0, 16);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);
    returnInput.value = dayAfter.toISOString().slice(0, 16);

    const updatePricing = () => {
      const pickup = new Date(pickupInput.value);
      const returnDate = new Date(returnInput.value);
      const days = Math.max(1, TMM.daysBetween(pickup, returnDate));
      const subtotal = currentVehicle.pricePerDay * days;
      const platformFee = Math.round(subtotal * 0.1);
      const total = subtotal + platformFee;

      document.getElementById('daysCount').textContent = days;
      document.getElementById('subtotal').textContent = TMM.money(subtotal);
      document.getElementById('platformFee').textContent = TMM.money(platformFee);
      document.getElementById('totalPrice').textContent = TMM.money(total);
    };

    pickupInput.addEventListener('change', updatePricing);
    returnInput.addEventListener('change', updatePricing);
    updatePricing();

    document.getElementById('bookNowBtn').addEventListener('click', () => {
      const pickup = pickupInput.value;
      const returnDate = returnInput.value;
      if(!pickup || !returnDate){
        TMM.toast('Please select dates', 'warning');
        return;
      }
      const params = new URLSearchParams({
        id: currentVehicle.id,
        pickup,
        return: returnDate
      }).toString();
      location.href = `./booking.html?${params}`;
    });

    document.getElementById('addToCompareBtn').addEventListener('click', () => {
      let favorites = TMM.load('favorites', []);
      if(favorites.includes(currentVehicle.id)){
        favorites = favorites.filter(id => id !== currentVehicle.id);
        TMM.toast('Removed from favorites', 'info');
      } else {
        favorites.push(currentVehicle.id);
        TMM.toast('Added to favorites', 'success');
      }
      TMM.save('favorites', favorites);
      const btn = document.getElementById('addToCompareBtn');
      btn.innerHTML = favorites.includes(currentVehicle.id) 
        ? '<i class="fa-solid fa-heart"></i> Remove from Favorites'
        : '<i class="fa-regular fa-heart"></i> Add to Favorites';
    });
  }

  function renderSimilarVehicles(){
    const similar = TMM.data.vehicles
      .filter(v => v.type === currentVehicle.type && v.id !== currentVehicle.id)
      .slice(0, 3);

    const container = document.getElementById('similarVehicles');
    container.innerHTML = similar.map(v => `
      <article class="vehicle-card fade-in">
        <div class="thumb">
          <img src="${v.images[0]}" alt="${v.name}" loading="lazy" />
          ${v.premium ? '<span class="badge">Premium</span>' : ''}
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
            <a class="btn btn-outline btn-sm" href="./vehicle-detail.html?id=${v.id}">View</a>
            <a class="btn btn-primary btn-sm" href="./booking.html?id=${v.id}">Book</a>
          </div>
        </div>
      </article>
    `).join('');
  }
})();
