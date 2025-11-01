// Booking status page logic
(function(){
  let currentBooking = null;

  document.addEventListener('DOMContentLoaded', () => {
    const bookingId = new URLSearchParams(location.search).get('id');
    if(!bookingId){
      location.href = './vehicles.html';
      return;
    }

    const bookings = TMM.load('bookings', []);
    currentBooking = bookings.find(b => b.id === bookingId);
    if(!currentBooking){
      location.href = './vehicles.html';
      return;
    }

    renderBookingStatus();
    simulateApproval();
    bindCancelButton();
  });

  function renderBookingStatus(){
    const b = currentBooking;
    const vehicle = TMM.data.vehicles.find(v => v.id === b.vehicleId);

    // Header
    document.getElementById('bookingRef').textContent = `Reference: ${b.id}`;
    document.getElementById('submittedTime').textContent = new Date(b.createdAt).toLocaleString();

    // Details
    document.getElementById('detailVehicle').textContent = b.vehicleName;
    document.getElementById('detailMerchant').textContent = b.merchantName;
    document.getElementById('detailPickup').textContent = new Date(b.pickupDate).toLocaleString();
    document.getElementById('detailReturn').textContent = new Date(b.returnDate).toLocaleString();

    const pickup = new Date(b.pickupDate);
    const returnDate = new Date(b.returnDate);
    const days = Math.max(1, TMM.daysBetween(pickup, returnDate));
    const subtotal = vehicle.pricePerDay * days;
    const platformFee = Math.round(subtotal * 0.1);
    const total = subtotal + platformFee;
    document.getElementById('detailTotal').textContent = TMM.money(total);

    // Status badge
    const statusBadge = document.getElementById('detailStatus');
    statusBadge.textContent = b.status.charAt(0).toUpperCase() + b.status.slice(1);
    statusBadge.className = `badge ${getStatusClass(b.status)}`;

    // Notifications
    renderNotifications();
  }

  function getStatusClass(status){
    switch(status){
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      case 'paid': return 'success';
      default: return 'info';
    }
  }

  function renderNotifications(){
    const notifications = [
      { time: new Date(currentBooking.createdAt).toLocaleString(), message: 'Booking request submitted', icon: 'fa-check' }
    ];

    if(currentBooking.status === 'approved'){
      notifications.push({
        time: new Date(Date.now() - 5*60000).toLocaleString(),
        message: 'Merchant approved your request',
        icon: 'fa-thumbs-up'
      });
    }

    const list = document.getElementById('notificationsList');
    list.innerHTML = notifications.map(n => `
      <div class="notification-item">
        <div class="notification-icon">
          <i class="fa-solid ${n.icon}"></i>
        </div>
        <div class="notification-content">
          <p>${n.message}</p>
          <span class="time">${n.time}</span>
        </div>
      </div>
    `).join('');
  }

  function simulateApproval(){
    // Simulate merchant approval after 5 seconds
    setTimeout(() => {
      if(currentBooking.status === 'pending'){
        currentBooking.status = 'approved';
        const bookings = TMM.load('bookings', []);
        const index = bookings.findIndex(b => b.id === currentBooking.id);
        if(index >= 0){
          bookings[index] = currentBooking;
          TMM.save('bookings', bookings);
        }

        // Update UI
        document.getElementById('approvalItem').classList.add('completed');
        document.getElementById('approvalItem').querySelector('.timeline-marker i').className = 'fa-solid fa-check';
        document.getElementById('paymentItem').classList.add('active');
        document.getElementById('detailStatus').textContent = 'Approved';
        document.getElementById('detailStatus').className = 'badge success';

        renderNotifications();
        TMM.toast('Merchant approved your booking request!', 'success');
      }
    }, 5000);
  }

  function bindCancelButton(){
    document.getElementById('cancelBtn').addEventListener('click', () => {
      if(confirm('Are you sure you want to cancel this booking request?')){
        const bookings = TMM.load('bookings', []);
        const index = bookings.findIndex(b => b.id === currentBooking.id);
        if(index >= 0){
          bookings.splice(index, 1);
          TMM.save('bookings', bookings);
        }
        TMM.toast('Booking request cancelled', 'info');
        setTimeout(() => location.href = './vehicles.html', 1500);
      }
    });
  }
})();
