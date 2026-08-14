import { isFavorite, toggleFavorite } from '../utils/favorites.js';
import { showToast } from '../utils/toast.js';

export function renderPropertyGrid(properties, activeFilter = 'all') {

  return `
    <section class="discovery-section" id="discovery">
      <div class="container" style="position: relative; z-index: 2;">
        
        <!-- 1 & 2. Editorial Section Header (2-Column Composition) -->
        <div class="portfolio-header-grid">
          <div class="portfolio-title-col">
            <div class="editorial-eyebrow-wrap">
              <span class="editorial-vertical-line"></span>
              <span class="eyebrow" style="color: var(--color-orange); font-weight: 800; letter-spacing: 0.12em;">PORTFOLIO DISCOVERY</span>
            </div>
            
            <h2 class="heading-display-light portfolio-main-title">
              Curated Property<br>Collection.
            </h2>
          </div>

          <div class="portfolio-stats-col">
            <p class="portfolio-desc-text">
              Explore handpicked properties across Tamil Nadu curated for discerning investors and homeowners.
            </p>

            <div class="portfolio-compact-stats">
              <div class="p-stat-box">
                <span class="p-stat-val">${properties.length}+</span>
                <span class="p-stat-lbl">Properties</span>
              </div>
              <div class="p-stat-sep"></div>
              <div class="p-stat-box">
                <span class="p-stat-val">18+</span>
                <span class="p-stat-lbl">Locations</span>
              </div>
              <div class="p-stat-sep"></div>
              <div class="p-stat-box">
                <span class="p-stat-val">6</span>
                <span class="p-stat-lbl">Categories</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 4. Clean Minimal Category Filter Nav (Underline Animation, No Box) -->
        <div class="clean-category-nav-bar" id="grid-filter-pills">
          <button class="clean-nav-item ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">ALL</button>
          <button class="clean-nav-item ${activeFilter === 'villas' ? 'active' : ''}" data-filter="villas">VILLAS</button>
          <button class="clean-nav-item ${activeFilter === 'apartments' ? 'active' : ''}" data-filter="apartments">APARTMENTS</button>
          <button class="clean-nav-item ${activeFilter === 'plots' ? 'active' : ''}" data-filter="plots">PLOTS</button>
          <button class="clean-nav-item ${activeFilter === 'agricultural' ? 'active' : ''}" data-filter="agricultural">FARMLAND</button>
          <button class="clean-nav-item ${activeFilter === 'commercial' ? 'active' : ''}" data-filter="commercial">COMMERCIAL</button>
        </div>

        <!-- Uniform 3 Cards Per Row Grid Container -->
        <div class="portfolio-3col-grid" id="properties-cards-container">
          ${properties.length === 0 ? `
            <div class="empty-state-box" style="grid-column: span 3;">
              <i class="ri-search-line" style="font-size: 3rem; color: var(--color-orange); margin-bottom: 16px;"></i>
              <h3 class="font-serif" style="font-size: 1.75rem; color: var(--color-brown);">No Matching Properties Found</h3>
              <p style="color: var(--color-text-muted); margin-top: 8px;">Try selecting another category or resetting your filter criteria.</p>
              <button class="btn btn-brown" id="reset-filters-btn" style="margin-top: 24px;">Reset Filters</button>
            </div>
          ` : properties.map((prop) => {
            const saved = isFavorite(prop.id);

            return `
              <div class="portfolio-standard-card open-prop-details-btn tilt-card" data-id="${prop.id}">
                <div class="standard-card-media">
                  <img src="${prop.images[0]}" alt="${prop.title}" class="standard-card-img" />
                  <span class="badge badge-dark standard-badge">${prop.categoryLabel}</span>
                  
                  <button class="card-favorite-btn ${saved ? 'saved' : ''}" data-id="${prop.id}" title="Save Property">
                    <i class="${saved ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
                  </button>
                </div>

                <div class="standard-card-body">
                  <div class="standard-price">${prop.priceFormatted}</div>
                  <h4 class="standard-title">${prop.title}</h4>
                  
                  <div class="standard-location">
                    <i class="ri-map-pin-line" style="color: var(--color-orange);"></i> ${prop.location}, ${prop.district}
                  </div>

                  <div class="standard-card-footer">
                    <div class="standard-specs">
                      <span><i class="ri-ruler-2-line"></i> ${prop.size}</span>
                      ${prop.bedrooms ? `<span>• ${prop.bedrooms} BHK</span>` : ''}
                    </div>

                    <span class="editorial-cta-btn">
                      <span>Explore</span>
                      <i class="ri-arrow-right-line cta-arrow"></i>
                    </span>
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>

        <!-- 18. View All Properties Editorial CTA Link -->
        <div style="display: flex; justify-content: flex-end; margin-top: 32px; margin-bottom: 60px;">
          <button class="editorial-cta-btn" id="view-all-props-link" style="font-size: 0.95rem;">
            <span>VIEW ALL PROPERTIES</span>
            <i class="ri-arrow-right-line cta-arrow" style="font-size: 1.1rem;"></i>
          </button>
        </div>


      </div>
    </section>
  `;
}

export function initPropertyGridListeners(onFilterChange, onPropertySelect) {
  // 4. Clean category nav filter click
  document.querySelectorAll('#grid-filter-pills .clean-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#grid-filter-pills .clean-nav-item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'all';
      onFilterChange(filter);
    });
  });

  // 10. Subtle 3D Tilt Mouse Movement on Desktop Cards
  if (window.innerWidth > 900) {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        const tiltX = (y / (rect.height / 2)) * -2.5; // Max 2.5deg
        const tiltY = (x / (rect.width / 2)) * 2.5;
        card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-4px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
      });
    });
  }

  // 16. Favorite heart click with pulse effect
  document.querySelectorAll('.card-favorite-btn').forEach(favBtn => {
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = favBtn.dataset.id;
      if (id) {
        favBtn.style.transform = 'scale(1.3)';
        setTimeout(() => { favBtn.style.transform = ''; }, 200);

        const isNowSaved = toggleFavorite(id);
        if (isNowSaved) {
          favBtn.classList.add('saved');
          favBtn.querySelector('i').className = 'ri-heart-fill';
          showToast('Property saved to collection!', 'ri-heart-fill');
        } else {
          favBtn.classList.remove('saved');
          favBtn.querySelector('i').className = 'ri-heart-line';
          showToast('Property removed from collection', 'ri-heart-line');
        }
      }
    });
  });

  // Open property details
  document.querySelectorAll('.open-prop-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (id) onPropertySelect(id);
    });
  });

  document.getElementById('view-all-props-link')?.addEventListener('click', () => {
    onFilterChange('all');
    showToast('Showing all property listings');
  });

  document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
    onFilterChange('all');
  });


}
