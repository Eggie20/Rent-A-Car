// Reports & Analytics Module
window.ReportsModule = (function() {
  'use strict';

  const Reports = {
    db: null,

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.generateReport();
    },

    setupEventListeners() {
      const generateBtn = document.querySelector('[data-action="generate-report"]');
      if (generateBtn) {
        generateBtn.addEventListener('click', () => this.generateReport());
      }

      const exportBtn = document.querySelector('[data-action="export-report"]');
      if (exportBtn) {
        exportBtn.addEventListener('click', () => this.exportReportPDF());
      }
    },

    generateReport() {
      const bookings = this.db.getAll('bookings');
      const payments = this.db.getAll('payments');
      const reviews = this.db.getAll('reviews');
      const users = this.db.getAll('users');

      const totalBookings = bookings.length;
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
      const newUsers = users.filter(u => {
        const createdDate = new Date(u.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate > thirtyDaysAgo;
      }).length;

      this.updateReportCards(totalBookings, totalRevenue, avgRating, newUsers);
    },

    updateReportCards(bookings, revenue, rating, users) {
      const cards = document.querySelectorAll('.report-card');
      if (cards.length >= 4) {
        cards[0].querySelector('.report-value').textContent = bookings;
        cards[1].querySelector('.report-value').textContent = '₱' + revenue.toLocaleString('en-PH', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
        cards[2].querySelector('.report-value').textContent = rating;
        cards[3].querySelector('.report-value').textContent = users;
      }
    },

    exportReportPDF() {
      const bookings = this.db.getAll('bookings');
      const payments = this.db.getAll('payments');
      const reviews = this.db.getAll('reviews');
      const users = this.db.getAll('users');

      const totalBookings = bookings.length;
      const totalRevenue = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
      const avgRating = reviews.length > 0 
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
        : 0;
      const newUsers = users.filter(u => {
        const createdDate = new Date(u.createdAt);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        return createdDate > thirtyDaysAgo;
      }).length;

      // Create a simple text-based report
      let reportContent = `
ADMIN DASHBOARD REPORT
Generated: ${new Date().toLocaleString()}

SUMMARY METRICS
===============
Total Bookings: ${totalBookings}
Total Revenue: ₱${totalRevenue.toLocaleString('en-PH', { minimumFractionDigits: 2 })}
Average Rating: ${avgRating} / 5.0
New Users (30 days): ${newUsers}

BOOKING BREAKDOWN
=================
`;

      const bookingsByStatus = {};
      bookings.forEach(b => {
        bookingsByStatus[b.status] = (bookingsByStatus[b.status] || 0) + 1;
      });

      Object.entries(bookingsByStatus).forEach(([status, count]) => {
        reportContent += `${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}\n`;
      });

      reportContent += `
PAYMENT BREAKDOWN
=================
`;

      const paymentsByStatus = {};
      payments.forEach(p => {
        paymentsByStatus[p.status] = (paymentsByStatus[p.status] || 0) + 1;
      });

      Object.entries(paymentsByStatus).forEach(([status, count]) => {
        reportContent += `${status.charAt(0).toUpperCase() + status.slice(1)}: ${count}\n`;
      });

      // Create and download file
      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report_${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      window.URL.revokeObjectURL(url);

      window.showToast('Report exported successfully', 'success');
    }
  };

  return Reports;
})();
