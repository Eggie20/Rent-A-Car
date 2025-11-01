// Utilities, storage, formatting, and mock API
(function(){
  const STORAGE_KEY = 'tmm';

  function save(key, value){
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    state[key] = value;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
  function load(key, fallback){
    const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return key in state ? state[key] : fallback;
  }

  function toast(message, type='info'){
    const el = document.getElementById('toast');
    if(!el) return;
    el.textContent = message;
    el.className = `toast show ${type}`;
    el.hidden = false;
    setTimeout(()=>{ el.classList.remove('show'); el.hidden = true; }, 2500);
  }

  function daysBetween(start, end){
    const s = new Date(start); const e = new Date(end);
    const ms = Math.max(0, e - s);
    return Math.max(1, Math.ceil(ms / (1000*60*60*24)));
  }

  function money(n){ return `₱${Number(n).toLocaleString('en-PH', {maximumFractionDigits:0})}`; }

  // Mock data
  const merchants = [
    { id:'m1', name:'Bukidnon Wheels', verified:true, rating:4.7, reviews:122 },
    { id:'m2', name:'CDO Prime Rentals', verified:true, rating:4.6, reviews:98 },
    { id:'m3', name:'Manolo Motor Hub', verified:true, rating:4.5, reviews:74 },
    { id:'m4', name:'Pineapple City Drives', verified:true, rating:4.8, reviews:180 },
    { id:'m5', name:'Highland Vans & Tours', verified:true, rating:4.4, reviews:51 },
  ];

  const types = ['5-Seater','6-Seater','7-Seater','8-Seater','Van'];
  const transmissions = ['Automatic','Manual'];
  const fuels = ['Gasoline','Diesel'];

  const vehicles = Array.from({length:20}).map((_,i)=>{
    const type = types[i%types.length];
    const merchant = merchants[i%merchants.length];
    const transmission = transmissions[i%transmissions.length];
    const fuel = fuels[i%fuels.length];
    const seats = [5,6,7,8,12][i%5];
    return {
      id:`v${i+1}`,
      name:`${type} Model ${2020 + (i%5)}`,
      year: 2020 + (i%5),
      merchantId: merchant.id,
      merchantName: merchant.name,
      verified: merchant.verified,
      pricePerDay: 1800 + (i%6)*200,
      rating: 3.8 + (i%12)/10,
      reviews: 20 + i,
      type,
      seats,
      transmission,
      fuel,
      featured: i % 3 === 0,
      premium: i % 5 === 0,
      destinations: ['Manolo Fortich','Cagayan de Oro City','Bukidnon Province'].slice(0,(i%3)+1),
      images: [
        `https://picsum.photos/seed/tmm-${i}/800/450`,
        `https://picsum.photos/seed/tmm-${i}-b/800/450`,
        `https://picsum.photos/seed/tmm-${i}-c/800/450`,
      ],
      features: ['AC','Bluetooth','USB','GPS','Backup Camera'].slice(0,(i%5)+1)
    };
  });

  // Expose globally
  window.TMM = {
    save, load, toast, daysBetween, money, data:{merchants, vehicles}
  };
})();
