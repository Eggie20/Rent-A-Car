// Merchant dashboard logic
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    checkMerchantAuth();
    bindTabNavigation();
    renderDashboardContent();
    bindAddVehicleButtons();
  });

  function checkMerchantAuth(){
    const auth = TMM.load('merchantAuth', null);
    if(!auth){
      location.href = './merchant-login.html';
      return;
    }
    document.getElementById('merchantName').textContent = auth.businessName || 'Merchant';
  }

  function bindTabNavigation(){
    document.querySelectorAll('.nav-item').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = item.dataset.tab;
        
        document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));
        document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
        
        item.classList.add('active');
        document.getElementById(tabName).classList.add('active');
      });
    });
  }

  function renderDashboardContent(){
    renderRecentBookings();
    renderPendingRequests();
    renderFleet();
    renderActiveRentals();
    renderReviews();
  }

  function renderRecentBookings(){
    const bookings = TMM.load('bookings', []).slice(-3);
    const container = document.getElementById('recentBookings');
    container.innerHTML = bookings.map(b => `
      <div class="booking-item">
        <div class="booking-info">
          <strong>${b.renterName}</strong>
          <span class="date">${new Date(b.createdAt).toLocaleDateString()}</span>
        </div>
        <div class="booking-status">
          <span class="badge ${b.status === 'pending' ? 'warning' : 'success'}">${b.status}</span>
        </div>
      </div>
    `).join('');
  }

  function renderPendingRequests(){
    const bookings = TMM.load('bookings', []).filter(b => b.status === 'pending');
    const container = document.getElementById('requestsList');
    
    if(bookings.length === 0){
      container.innerHTML = '<p style="text-align: center; color: var(--muted);">No pending requests</p>';
      return;
    }

    container.innerHTML = bookings.map(b => {
      const vehicle = TMM.data.vehicles.find(v => v.id === b.vehicleId);
      return `
        <div class="request-card">
          <div class="request-header">
            <h3>${b.renterName}</h3>
            <span class="date">${new Date(b.createdAt).toLocaleString()}</span>
          </div>
          <div class="request-details">
            <p><strong>Vehicle:</strong> ${b.vehicleName}</p>
            <p><strong>Dates:</strong> ${new Date(b.pickupDate).toLocaleDateString()} - ${new Date(b.returnDate).toLocaleDateString()}</p>
            <p><strong>Contact:</strong> ${b.phone} | ${b.email}</p>
          </div>
          <div class="request-actions">
            <button class="btn btn-success btn-sm" onclick="approveRequest('${b.id}')">
              <i class="fa-solid fa-check"></i> Approve
            </button>
            <button class="btn btn-danger btn-sm" onclick="rejectRequest('${b.id}')">
              <i class="fa-solid fa-times"></i> Reject
            </button>
          </div>
        </div>
      `;
    }).join('');
  }

  function renderFleet(){
    const vehicles = TMM.data.vehicles.slice(0, 6);
    const container = document.getElementById('fleetGrid');
    container.innerHTML = vehicles.map(v => `
      <div class="vehicle-card">
        <div class="thumb">
          <img src="${v.images[0]}" alt="${v.name}" />
        </div>
        <div class="content">
          <h4>${v.name}</h4>
          <p class="meta">${v.pricePerDay} per day</p>
          <div class="fleet-actions">
            <button class="btn btn-sm btn-outline">Edit</button>
            <button class="btn btn-sm btn-outline">Delete</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  function renderActiveRentals(){
    const bookings = TMM.load('bookings', []).filter(b => b.status === 'approved');
    const container = document.getElementById('activeRentalsList');
    
    if(bookings.length === 0){
      container.innerHTML = '<p style="text-align: center; color: var(--muted);">No active rentals</p>';
      return;
    }

    container.innerHTML = bookings.map(b => `
      <div class="rental-card">
        <div class="rental-header">
          <h3>${b.renterName}</h3>
          <span class="badge success">Active</span>
        </div>
        <div class="rental-details">
          <p><strong>Vehicle:</strong> ${b.vehicleName}</p>
          <p><strong>Return Date:</strong> ${new Date(b.returnDate).toLocaleDateString()}</p>
          <p><strong>Contact:</strong> ${b.phone}</p>
        </div>
      </div>
    `).join('');
  }

  function renderReviews(){
    const reviews = [
      { name: 'John Doe', rating: 5, text: 'Excellent service and clean vehicles!' },
      { name: 'Maria Santos', rating: 4, text: 'Good experience, very professional.' },
      { name: 'Carlos Reyes', rating: 5, text: 'Highly recommended!' }
    ];
    const container = document.getElementById('reviewsList');
    container.innerHTML = reviews.map(r => `
      <div class="review-item">
        <div class="review-header">
          <strong>${r.name}</strong>
          <span class="rating">★ ${r.rating}</span>
        </div>
        <p>${r.text}</p>
      </div>
    `).join('');
  }

  function bindAddVehicleButtons(){
    document.getElementById('addVehicleBtn').addEventListener('click', () => {
      location.href = './add-vehicle.html';
    });
    document.getElementById('addVehicleBtn2').addEventListener('click', () => {
      location.href = './add-vehicle.html';
    });
  }

  // Global functions for request actions
  window.approveRequest = function(bookingId){
    const bookings = TMM.load('bookings', []);
    const booking = bookings.find(b => b.id === bookingId);
    if(booking){
      booking.status = 'approved';
      TMM.save('bookings', bookings);
      TMM.toast('Booking approved!', 'success');
      renderPendingRequests();
    }
  };

  window.rejectRequest = function(bookingId){
    if(confirm('Are you sure you want to reject this request?')){
      const bookings = TMM.load('bookings', []);
      const index = bookings.findIndex(b => b.id === bookingId);
      if(index >= 0){
        bookings[index].status = 'rejected';
        TMM.save('bookings', bookings);
        TMM.toast('Booking rejected', 'info');
        renderPendingRequests();
      }
    }
  };
})();
