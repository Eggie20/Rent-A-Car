// FAQ page functionality
(function(){
  document.addEventListener('DOMContentLoaded', () => {
    bindSearchFunctionality();
    bindCategoryFilters();
  });

  function bindSearchFunctionality(){
    const searchInput = document.getElementById('faqSearch');
    if(!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase();
      document.querySelectorAll('.faq-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(query) ? 'block' : 'none';
      });
    });
  }

  function bindCategoryFilters(){
    document.querySelectorAll('.faq-category-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.faq-category-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const category = btn.dataset.category;
        document.querySelectorAll('.faq-item').forEach(item => {
          if(category === 'all' || item.dataset.category === category){
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  }
})();
