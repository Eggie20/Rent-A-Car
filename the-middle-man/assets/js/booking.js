// Booking form logic
(function(){
  let currentVehicle = null;
  let pickupDate = null;
  let returnDate = null;

  document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(location.search);
    const vehicleId = params.get('id');
    pickupDate = params.get('pickup');
    returnDate = params.get('return');

    if(!vehicleId){
      location.href = './vehicles.html';
      return;
    }

    currentVehicle = TMM.data.vehicles.find(v => v.id === vehicleId);
    if(!currentVehicle){
      location.href = './vehicles.html';
      return;
    }

    renderSummary();
    bindFormHandlers();
    bindFileUploads();
  });

  function renderSummary(){
    const v = currentVehicle;
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const days = Math.max(1, TMM.daysBetween(pickup, returnD));
    const subtotal = v.pricePerDay * days;
    const platformFee = Math.round(subtotal * 0.1);
    const total = subtotal + platformFee;

    document.getElementById('vehicleImage').innerHTML = `<img src="${v.images[0]}" alt="${v.name}" />`;
    document.getElementById('vehicleName').textContent = v.name;
    document.getElementById('merchantName').textContent = v.merchantName;
    document.getElementById('pickupDate').textContent = pickup.toLocaleString();
    document.getElementById('returnDate').textContent = returnD.toLocaleString();
    document.getElementById('duration').textContent = `${days} day${days > 1 ? 's' : ''}`;
    document.getElementById('dailyRate').textContent = TMM.money(v.pricePerDay);
    document.getElementById('subtotal').textContent = TMM.money(subtotal);
    document.getElementById('platformFee').textContent = TMM.money(platformFee);
    document.getElementById('totalAmount').textContent = TMM.money(total);
  }

  function bindFormHandlers(){
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if(validateForm()){
        submitBooking();
      }
    });
  }

  function validateForm(){
    const form = document.getElementById('bookingForm');
    const fields = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;

    fields.forEach(field => {
      const errorMsg = field.parentElement.querySelector('.error-msg');
      if(!field.value.trim()){
        if(errorMsg) errorMsg.textContent = 'This field is required';
        field.classList.add('error');
        isValid = false;
      } else {
        if(errorMsg) errorMsg.textContent = '';
        field.classList.remove('error');
      }
    });

    // Email validation
    const email = document.getElementById('email');
    if(email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)){
      email.parentElement.querySelector('.error-msg').textContent = 'Invalid email';
      email.classList.add('error');
      isValid = false;
    }

    // Phone validation
    const phone = document.getElementById('phone');
    if(phone.value && !/^\+?63\s?\d{3}\s?\d{3}\s?\d{4}$/.test(phone.value.replace(/\s/g, ''))){
      phone.parentElement.querySelector('.error-msg').textContent = 'Invalid phone format';
      phone.classList.add('error');
      isValid = false;
    }

    // Terms checkbox
    const termsAgree = document.getElementById('termsAgree');
    if(!termsAgree.checked){
      document.getElementById('termsError').textContent = 'You must agree to the terms';
      isValid = false;
    } else {
      document.getElementById('termsError').textContent = '';
    }

    return isValid;
  }

  function bindFileUploads(){
    const fileInputs = [
      { input: 'idFront', name: 'idFrontName' },
      { input: 'license', name: 'licenseName' }
    ];

    fileInputs.forEach(({ input, name }) => {
      const fileInput = document.getElementById(input);
      const fileNameSpan = document.getElementById(name);
      const uploadArea = fileInput.parentElement;

      fileInput.addEventListener('change', (e) => {
        if(e.target.files.length > 0){
          fileNameSpan.textContent = e.target.files[0].name;
          uploadArea.classList.add('uploaded');
        }
      });

      uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
      });

      uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('dragover');
      });

      uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        if(e.dataTransfer.files.length > 0){
          fileInput.files = e.dataTransfer.files;
          fileNameSpan.textContent = e.dataTransfer.files[0].name;
          uploadArea.classList.add('uploaded');
        }
      });
    });
  }

  function submitBooking(){
    const formData = new FormData(document.getElementById('bookingForm'));
    const bookingData = {
      id: 'BK-' + Date.now(),
      vehicleId: currentVehicle.id,
      vehicleName: currentVehicle.name,
      merchantId: currentVehicle.merchantId,
      merchantName: currentVehicle.merchantName,
      renterName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      emergencyContact: formData.get('emergencyContact'),
      pickupDate,
      returnDate,
      specialRequests: formData.get('specialRequests'),
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save booking
    let bookings = TMM.load('bookings', []);
    bookings.push(bookingData);
    TMM.save('bookings', bookings);

    // Show success and redirect
    TMM.toast('Booking request submitted successfully!', 'success');
    setTimeout(() => {
      location.href = `./booking-status.html?id=${bookingData.id}`;
    }, 1500);
  }
})();
