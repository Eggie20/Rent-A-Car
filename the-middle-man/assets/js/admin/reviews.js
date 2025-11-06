// Reviews & Ratings Module
window.ReviewsModule = (function() {
  'use strict';

  const Reviews = {
    db: null,
    currentReviews: [],

    init(database) {
      this.db = database;
      this.setupEventListeners();
      this.loadReviews();
    },

    setupEventListeners() {
      const searchInput = document.querySelector('#reviewsModule .search-box .input');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => this.filterReviews(e.target.value));
      }

      const ratingSelect = document.querySelector('#reviewsModule .toolbar-actions select');
      if (ratingSelect) {
        ratingSelect.addEventListener('change', (e) => this.filterByRating(e.target.value));
      }
    },

    loadReviews() {
      this.currentReviews = this.db.getAll('reviews');
      this.renderReviewsList();
    },

    renderReviewsList() {
      const list = document.getElementById('reviewsList');
      if (!list) return;

      if (!this.currentReviews.length) {
        list.innerHTML = '<p class="text-muted text-center">No reviews found</p>';
        return;
      }

      const frag = document.createDocumentFragment();
      this.currentReviews.forEach(review => {
        const user = this.db.getById('users', review.userId);
        const vehicle = this.db.getById('vehicles', review.vehicleId);
        
        const div = document.createElement('div');
        div.className = 'review-item animate-fadeInUp';
        
        let stars = '';
        for (let i = 0; i < 5; i++) {
        stars += `<i class="fas fa-star ${i < review.rating ? 'star-filled' : 'star-empty'}"></i>`;
        }
        
        div.innerHTML = `
        <div class="review-header">
        <div>
        <strong>${user ? this.escapeHtml(user.name) : 'Anonymous'}</strong>
        <p class="review-vehicle">
        ${vehicle ? this.escapeHtml(vehicle.brand) + ' ' + this.escapeHtml(vehicle.model) : 'Unknown Vehicle'}
        </p>
        </div>
        <div class="review-rating-section">
        <div class="review-stars">
        ${stars}
        </div>
        <span class="text-muted review-date">${new Date(review.date).toLocaleDateString()}</span>
        </div>
        </div>
        <p class="review-text">${this.escapeHtml(review.comment)}</p>
        <div class="review-actions">
        <button class="btn btn-sm btn-outline" data-action="approve-review" data-id="${review.id}" title="Approve">
        <i class="fas fa-check"></i> Approve
        </button>
        <button class="btn btn-sm btn-outline" data-action="reject-review" data-id="${review.id}" title="Reject">
        <i class="fas fa-times"></i> Reject
        </button>
        </div>
        `;

        div.querySelectorAll('[data-action]').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            const action = btn.dataset.action;
            const reviewId = btn.dataset.id;
            this.handleReviewAction(action, reviewId);
          });
        });

        frag.appendChild(div);
      });

      list.replaceChildren(frag);
    },

    filterReviews(query) {
      const lowerQuery = query.toLowerCase();
      this.currentReviews = this.db.getAll('reviews').filter(review => {
        const user = this.db.getById('users', review.userId);
        return (user && user.name.toLowerCase().includes(lowerQuery)) ||
               review.comment.toLowerCase().includes(lowerQuery);
      });
      this.renderReviewsList();
    },

    filterByRating(rating) {
      if (!rating) {
        this.currentReviews = this.db.getAll('reviews');
      } else {
        this.currentReviews = this.db.getAll('reviews').filter(r => r.rating === parseInt(rating));
      }
      this.renderReviewsList();
    },

    handleReviewAction(action, reviewId) {
      const review = this.db.getById('reviews', reviewId);
      if (!review) {
        window.showToast('Review not found', 'error');
        return;
      }

      switch (action) {
        case 'approve-review':
          this.db.update('reviews', reviewId, { status: 'approved' });
          this.loadReviews();
          window.showToast('Review approved', 'success');
          break;
        case 'reject-review':
          this.db.delete('reviews', reviewId);
          this.loadReviews();
          window.showToast('Review rejected and removed', 'success');
          break;
      }
    },

    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  };

  return Reviews;
})();
