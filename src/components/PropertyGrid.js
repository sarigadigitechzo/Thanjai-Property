import { isFavorite, toggleFavorite } from '../utils/favorites.js';
import { showToast } from '../utils/toast.js';

export function renderPropertyGrid(properties, activeFilter = 'all', searchQuery = '') {
  return `
    <section class="discovery-section" id="discovery">
      <div class="container">
        <!-- Section Title -->
        <div style="text-align: center; max-width: 700px; margin: 0 auto 48px;">
          <span class="eyebrow">EXPLORE CATALOG</span>
          <h2 class="heading-section" style="margin-top: 12px;">
            Tamil Nadu Property Discovery
          </h2>
          <p style="color: var(--color-text-muted); margin-top: 8px;">
            Filter through our curated database of verified residential, commercial, and agricultural properties.
          </p>
        </div>

        <!-- Discovery Filter Pills Bar -->
        <div class="discovery-filter-bar">
          <div class="filter-pills-group" id="grid-filter-pills">
            <button class="filter-pill ${activeFilter === 'all' ? 'active' : ''}" data-filter="all">All Properties</button>
            <button class="filter-pill ${activeFilter === 'buy' ? 'active' : ''}" data-filter="buy">For Sale</button>
            <button class="filter-pill ${activeFilter === 'rent' ? 'active' : ''}" data-filter="rent">For Rent</button>
            <button class="filter-pill ${activeFilter === 'villas' ? 'active' : ''}" data-filter="villas">Villas</button>
            <button class="filter-pill ${activeFilter === 'apartments' ? 'active' : ''}" data-filter="apartments">Apartments</button>
            <button class="filter-pill ${activeFilter === 'plots' ? 'active' : ''}" data-filter="plots">Plots & Sites</button>
            <button class="filter-pill ${activeFilter === 'agricultural' ? 'active' : ''}" data-filter="agricultural">Agricultural</button>
            <button class="filter-pill ${activeFilter === 'commercial' ? 'active' : ''}" data-filter="commercial">Commercial</button>
          </div>

          <div class="view-options-group">
            <span style="font-size: 0.875rem; font-weight: 700; color: var(--color-text-muted);">
              ${properties.length} Properties Found
            </span>
          </div>
        </div>

        <!-- Property Grid Container -->
        <div class="properties-grid" id="properties-cards-container">
          ${properties.length === 0 ? `
            <div style="grid-column: 1 / -1; text-align: center; padding: 80px 20px; background: var(--color-white); border-radius: var(--radius-lg); border: 1px dashed var(--color-border);">
              <i class="ri-search-line" style="font-size: 3rem; color: var(--color-orange); margin-bottom: 16px;"></i>
              <h3 class="font-serif" style="font-size: 1.75rem; color: var(--color-brown);">No Matching Properties Found</h3>
              <p style="color: var(--color-text-muted); margin-top: 8px;">Try adjusting your search criteria or resetting filters.</p>
              <button class="btn btn-brown" id="reset-filters-btn" style="margin-top: 24px;">Reset Filters</button>
            </div>
          ` : properties.map((prop, idx) => {
            const saved = isFavorite(prop.id);
            const isWide = idx === 3; // Make 4th card wide landscape style for rhythm

            if (isWide) {
              return `
                <div class="property-card property-card-wide" data-id="${prop.id}">
                  <div class="card-media">
                    <img src="${prop.images[0]}" alt="${prop.title}" class="card-media-img" />
                    <div class="card-badge-top">
                      <span class="badge badge-orange">${prop.tag}</span>
                    </div>
                    <button class="card-favorite-btn ${saved ? 'saved' : ''}" data-id="${prop.id}" title="Save Property">
                      <i class="${saved ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
                    </button>
                  </div>

                  <div class="card-body">
                    <div class="card-type-label">${prop.categoryLabel} • ${prop.district}</div>
                    <div class="card-price-tag">${prop.priceFormatted}</div>
                    <h3 class="card-title">${prop.title}</h3>
                    
                    <div class="card-location">
                      <i class="ri-map-pin-2-line" style="color: var(--color-orange);"></i>
                      <span>${prop.area}</span>
                    </div>

                    <p style="font-size: 0.875rem; color: var(--color-text-muted); margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${prop.description}
                    </p>

                    <div class="card-specs-bar">
                      <div class="card-spec-item"><i class="ri-ruler-2-line"></i> ${prop.size}</div>
                      ${prop.bedrooms ? `<div class="card-spec-item"><i class="ri-hotel-bed-line"></i> ${prop.bedrooms} BHK</div>` : ''}
                      <div class="card-spec-item"><i class="ri-compass-3-line"></i> ${prop.facing}</div>
                    </div>

                    <button class="card-cta-btn open-prop-details-btn" data-id="${prop.id}">
                      <span>View Details & Specs</span>
                      <i class="ri-arrow-right-line"></i>
                    </button>
                  </div>
                </div>
              `;
            }

            return `
              <div class="property-card" data-id="${prop.id}">
                <div class="card-media">
                  <img src="${prop.images[0]}" alt="${prop.title}" class="card-media-img" />
                  <div class="card-badge-top">
                    <span class="badge badge-dark">${prop.categoryLabel}</span>
                  </div>
                  <button class="card-favorite-btn ${saved ? 'saved' : ''}" data-id="${prop.id}" title="Save Property">
                    <i class="${saved ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
                  </button>
                </div>

                <div class="card-body">
                  <div class="card-price-tag">${prop.priceFormatted}</div>
                  <div class="card-type-label">${prop.purpose.toUpperCase()} • ${prop.district}</div>
                  <h3 class="card-title">${prop.title}</h3>

                  <div class="card-location">
                    <i class="ri-map-pin-2-line" style="color: var(--color-orange);"></i>
                    <span>${prop.location}, Tamil Nadu</span>
                  </div>

                  <div class="card-specs-bar">
                    <div class="card-spec-item"><i class="ri-ruler-2-line"></i> ${prop.size}</div>
                    ${prop.bedrooms ? `<div class="card-spec-item"><i class="ri-hotel-bed-line"></i> ${prop.bedrooms} BHK</div>` : `<div class="card-spec-item"><i class="ri-shield-check-line"></i> Approved</div>`}
                  </div>

                  <button class="card-cta-btn open-prop-details-btn" data-id="${prop.id}">
                    <span>View Property</span>
                    <i class="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initPropertyGridListeners(onFilterChange, onPropertySelect) {
  // Filter pills event listeners
  document.querySelectorAll('#grid-filter-pills .filter-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#grid-filter-pills .filter-pill').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter || 'all';
      onFilterChange(filter);
    });
  });

  // Favorite hearts click
  document.querySelectorAll('.card-favorite-btn').forEach(favBtn => {
    favBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = favBtn.dataset.id;
      if (id) {
        const isNowSaved = toggleFavorite(id);
        if (isNowSaved) {
          favBtn.classList.add('saved');
          favBtn.querySelector('i').className = 'ri-heart-fill';
          showToast('Property saved to your collection!', 'ri-heart-fill');
        } else {
          favBtn.classList.remove('saved');
          favBtn.querySelector('i').className = 'ri-heart-line';
          showToast('Property removed from collection', 'ri-heart-line');
        }
      }
    });
  });

  // Card click triggers modal details
  document.querySelectorAll('.open-prop-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (id) onPropertySelect(id);
    });
  });

  document.querySelectorAll('.property-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id) onPropertySelect(id);
    });
  });

  document.getElementById('reset-filters-btn')?.addEventListener('click', () => {
    onFilterChange('all');
  });
}
