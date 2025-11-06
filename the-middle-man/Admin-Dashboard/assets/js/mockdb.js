// MockDatabase stored in localStorage with seeders
(function () {
  const KEY = 'tmm.mockdb';
  const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
  const pick = (arr) => arr[rand(0, arr.length - 1)];
  const names = ['Juan Dela Cruz', 'Maria Santos', 'Jose Rizal', 'Ana Mendoza', 'Mark Bautista', 'Liza Reyes', 'Carlo Garcia', 'Ivy Flores'];
  const cities = ['Quezon City', 'Manila', 'Makati', 'Taguig', 'Pasig', 'Cebu City', 'Davao City'];

  function load() {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  }
  function save(db) { localStorage.setItem(KEY, JSON.stringify(db)); }

  function ensureSeed() {
    let db = load();
    if (db) return db;
    db = { users: [], merchants: [], vehicles: [], bookings: [], payments: [], reviews: [], announcements: [], logs: [], admins: [] };
    
    // seed users
    for (let i = 0; i < 200; i++) {
      const id = 'U' + (i + 1).toString().padStart(4, '0');
      db.users.push({
        id,
        type: 'renter',
        name: pick(names) + ' ' + (i + 1),
        email: `user${i + 1}@example.com`,
        phone: `+63 9${rand(10,99)} ${rand(100,999)} ${rand(1000,9999)}`,
        status: pick(['active', 'inactive', 'pending']),
        verified: Math.random() > 0.3,
        createdAt: new Date(Date.now() - rand(0, 365) * 86400000).toISOString(),
        rating: (Math.random() * 5).toFixed(1),
        counts: { bookings: rand(0, 20), vehicles: 0 },
        address: { city: pick(cities) }
      });
    }
    
    // seed merchants
    for (let i = 0; i < 20; i++) {
      const id = 'M' + (i + 1).toString().padStart(4, '0');
      db.merchants.push({
        id,
        name: 'Merchant ' + (i + 1),
        email: `merchant${i + 1}@example.com`,
        phone: `+63 9${rand(10,99)} ${rand(100,999)} ${rand(1000,9999)}`,
        status: pick(['approved', 'pending', 'suspended']),
        rating: (3 + Math.random() * 2).toFixed(1),
        createdAt: new Date(Date.now() - rand(0, 365) * 86400000).toISOString()
      });
    }
    
    // seed vehicles
    for (let i = 0; i < 80; i++) {
      const id = 'V' + (i + 1).toString().padStart(4, '0');
      const merchant = pick(db.merchants);
      db.vehicles.push({
        id,
        brand: pick(['Toyota', 'Honda', 'Nissan', 'Hyundai', 'Kia']),
        model: 'Model ' + (i + 1),
        year: 2020 + rand(0, 4),
        licensePlate: 'ABC' + rand(1000, 9999),
        type: pick(['sedan', 'suv', 'van']),
        merchantId: merchant.id,
        status: pick(['active', 'pending', 'suspended']),
        available: Math.random() > 0.3,
        pricePerDay: rand(1500, 5000),
        specs: { seats: pick([4, 5, 7]), transmission: pick(['AT', 'MT']), fuel: pick(['gas', 'diesel']) },
        images: [],
        rating: (Math.random() * 5).toFixed(1),
        bookingsCount: rand(0, 200),
        verified: Math.random() > 0.5,
        featured: Math.random() > 0.8
      });
    }
    
    // seed bookings
    for (let i = 0; i < 300; i++) {
      const id = 'B' + (i + 1).toString().padStart(5, '0');
      const startDate = new Date(Date.now() - rand(0, 90) * 86400000);
      const endDate = new Date(startDate.getTime() + rand(1, 7) * 86400000);
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      db.bookings.push({
        id,
        userId: pick(db.users).id,
        vehicleId: pick(db.vehicles).id,
        status: pick(['pending', 'confirmed', 'active', 'completed', 'cancelled', 'disputed']),
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalPrice: days * rand(1500, 5000),
        payments: [],
        messages: [],
        issues: []
      });
    }
    
    // seed payments
    for (let i = 0; i < 250; i++) {
      const id = 'P' + (i + 1).toString().padStart(5, '0');
      db.payments.push({
        id,
        userId: pick(db.users).id,
        amount: rand(1000, 50000),
        method: pick(['credit_card', 'debit_card', 'gcash', 'bank_transfer']),
        status: pick(['pending', 'completed', 'failed']),
        date: new Date(Date.now() - rand(0, 90) * 86400000).toISOString()
      });
    }
    
    // seed reviews
    for (let i = 0; i < 150; i++) {
      const id = 'R' + (i + 1).toString().padStart(4, '0');
      db.reviews.push({
        id,
        userId: pick(db.users).id,
        vehicleId: pick(db.vehicles).id,
        rating: rand(1, 5),
        comment: 'Great experience! ' + (i + 1),
        status: pick(['approved', 'pending', 'rejected']),
        date: new Date(Date.now() - rand(0, 90) * 86400000).toISOString()
      });
    }
    
    // seed logs
    for (let i = 0; i < 100; i++) {
      const id = 'L' + (i + 1).toString().padStart(4, '0');
      db.logs.push({
        id,
        admin: 'Admin User',
        msg: pick(['User created', 'Vehicle updated', 'Booking confirmed', 'Payment processed', 'Review approved']),
        ip: `192.168.${rand(0, 255)}.${rand(0, 255)}`,
        status: pick(['success', 'failed']),
        ts: new Date(Date.now() - rand(0, 30) * 86400000).toISOString()
      });
    }
    
    // seed admins
    db.admins.push({
      id: 'A0001',
      name: 'Super Admin',
      email: 'admin@themiddleman.ph',
      role: 'super',
      status: 'active',
      twoFactorEnabled: true,
      lastLogin: new Date().toISOString()
    });
    for (let i = 1; i < 5; i++) {
      db.admins.push({
        id: 'A' + (i + 1).toString().padStart(4, '0'),
        name: 'Admin ' + i,
        email: `admin${i}@themiddleman.ph`,
        role: pick(['editor', 'viewer']),
        status: pick(['active', 'inactive']),
        twoFactorEnabled: Math.random() > 0.5,
        lastLogin: new Date(Date.now() - rand(0, 30) * 86400000).toISOString()
      });
    }
    
    save(db);
    return db;
  }

  class MockDatabase {
    constructor() { this.db = ensureSeed(); }
    persist() { save(this.db); }
    getAll(col) { return this.db[col] ? this.db[col].slice() : []; }
    getById(col, id) { return this.db[col]?.find(i => i.id === id) || null; }
    add(col, data) { this.db[col].push(data); this.persist(); return data; }
    update(col, id, data) { const i = this.db[col].findIndex(x => x.id === id); if (i>-1){ this.db[col][i] = { ...this.db[col][i], ...data }; this.persist(); return this.db[col][i]; } return null; }
    delete(col, id) { const i = this.db[col].findIndex(x => x.id === id); if (i>-1){ const r=this.db[col].splice(i,1)[0]; this.persist(); return r; } return null; }
    query(col, filters = []) {
      const rows = this.getAll(col);
      return rows.filter(row => filters.every(f => {
        const v = row[f.field];
        const val = f.value;
        switch (f.op) {
          case '>': return v > val;
          case '<': return v < val;
          case '>=': return v >= val;
          case '<=': return v <= val;
          case 'contains': return String(v).toLowerCase().includes(String(val).toLowerCase());
          case 'startsWith': return String(v).startsWith(String(val));
          case 'eq': default: return v === val;
        }
      }));
    }
  }

  window.MockDatabase = MockDatabase;
})();
