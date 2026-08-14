import { getProperties } from '../utils/propertiesStore.js';

export function renderDiscoverView(discoverState, onPropertySelect, onNavigateToContact) {
  const allProperties = getProperties();
  // If a property detail is selected, render the detail page
  if (discoverState.selectedPropertyId) {
    const property = allProperties.find(p => p.id === discoverState.selectedPropertyId);
    if (property) {
      return renderPropertyDetailView(property, onNavigateToContact);
    }
  }

  // Otherwise render the property search & discovery page
  const filteredProps = filterProperties(discoverState);

  return `
    <div class="page-view view-enter discover-page">
      
      <!-- HERO -->
      <section style="
        padding: 120px 0 60px 0;
        background: linear-gradient(135deg, #1c1007 0%, #2a1808 60%, #150b04 100%);
        color: #ffffff; text-align: center; position: relative; overflow: hidden;
      ">
        <div class="container" style="max-width: 800px; position: relative; z-index: 2;">
          <span class="badge badge-orange" style="font-weight: 800; letter-spacing: 0.12em; margin-bottom: 16px;">
            THANJAI DISCOVERY ENGINE
          </span>
          <h1 class="heading-display-light" style="font-size: clamp(2.2rem, 4.5vw, 3.8rem); color: #ffffff; margin-bottom: 16px;">
            Find a Place Worth Owning
          </h1>
          <p style="font-size: 1.1rem; color: rgba(255, 255, 255, 0.85); line-height: 1.6; max-width: 680px; margin: 0 auto;">
            Explore our curated collection of verified luxury villas, independent homes, DTCP layout plots, and Kaveri farm estates.
          </p>
        </div>
      </section>

      <!-- SEARCH & MULTI-FILTER BAR -->
      <section style="padding: 40px 0; background: #faf8f5; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <div class="container">
          
          <div class="discover-filter-card" style="
            background: #ffffff; padding: 24px; border-radius: 20px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08);
            display: flex; flex-direction: column; gap: 20px;
          ">
            <!-- Row 1: Keyword Search -->
            <div style="position: relative; width: 100%;">
              <i class="ri-search-2-line" style="position: absolute; left: 18px; top: 50%; transform: translateY(-50%); color: var(--color-orange, #eb5e28); font-size: 1.25rem;"></i>
              <input 
                type="text" 
                id="discover-search-input" 
                value="${discoverState.keyword || ''}" 
                placeholder="Search by property title, location, district, or keyword (e.g. Villa, Thanjavur, Plot)..." 
                style="
                  width: 100%; padding: 16px 20px 16px 52px; font-size: 1rem; border-radius: 12px;
                  border: 1px solid #cbd5e0; background: #fdfbf7; outline: none; transition: border-color 0.2s;
                "
              />
            </div>

            <!-- Row 2: Select Filter Dropdowns -->
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 14px;">
              
              <!-- Property Type -->
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #555; display: block; margin-bottom: 6px; letter-spacing: 0.05em;">Property Type</label>
                <select id="filter-type" style="width: 100%; padding: 12px 14px; font-size: 0.9rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; outline: none;">
                  <option value="all" ${discoverState.type === 'all' ? 'selected' : ''}>All Property Types</option>
                  <option value="villas" ${discoverState.type === 'villas' ? 'selected' : ''}>Luxury Villas</option>
                  <option value="houses" ${discoverState.type === 'houses' ? 'selected' : ''}>Independent Houses</option>
                  <option value="apartments" ${discoverState.type === 'apartments' ? 'selected' : ''}>Modern Apartments</option>
                  <option value="plots" ${discoverState.type === 'plots' ? 'selected' : ''}>Residential Plots</option>
                  <option value="agricultural" ${discoverState.type === 'agricultural' ? 'selected' : ''}>Agricultural Farmland</option>
                  <option value="commercial" ${discoverState.type === 'commercial' ? 'selected' : ''}>Commercial Spaces</option>
                </select>
              </div>

              <!-- Location -->
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #555; display: block; margin-bottom: 6px; letter-spacing: 0.05em;">Location</label>
                <select id="filter-location" style="width: 100%; padding: 12px 14px; font-size: 0.9rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; outline: none;">
                  <option value="all" ${discoverState.location === 'all' ? 'selected' : ''}>All Tamil Nadu Locations</option>
                  <option value="Thanjavur" ${discoverState.location === 'Thanjavur' ? 'selected' : ''}>Thanjavur</option>
                  <option value="Trichy" ${discoverState.location === 'Trichy' ? 'selected' : ''}>Trichy</option>
                  <option value="Madurai" ${discoverState.location === 'Madurai' ? 'selected' : ''}>Madurai</option>
                  <option value="Chennai" ${discoverState.location === 'Chennai' ? 'selected' : ''}>Chennai</option>
                  <option value="Coimbatore" ${discoverState.location === 'Coimbatore' ? 'selected' : ''}>Coimbatore</option>
                  <option value="Kumbakonam" ${discoverState.location === 'Kumbakonam' ? 'selected' : ''}>Kumbakonam</option>
                </select>
              </div>

              <!-- Purpose (Buy / Rent) -->
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #555; display: block; margin-bottom: 6px; letter-spacing: 0.05em;">Purpose</label>
                <select id="filter-purpose" style="width: 100%; padding: 12px 14px; font-size: 0.9rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; outline: none;">
                  <option value="all" ${discoverState.purpose === 'all' ? 'selected' : ''}>Buy & Rent</option>
                  <option value="buy" ${discoverState.purpose === 'buy' ? 'selected' : ''}>Buy Only</option>
                  <option value="rent" ${discoverState.purpose === 'rent' ? 'selected' : ''}>Rent Only</option>
                </select>
              </div>

              <!-- Budget Range -->
              <div>
                <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #555; display: block; margin-bottom: 6px; letter-spacing: 0.05em;">Budget Range</label>
                <select id="filter-budget" style="width: 100%; padding: 12px 14px; font-size: 0.9rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; outline: none;">
                  <option value="all" ${discoverState.budget === 'all' ? 'selected' : ''}>Any Price</option>
                  <option value="under-50l" ${discoverState.budget === 'under-50l' ? 'selected' : ''}>Under ₹ 50 Lakhs</option>
                  <option value="50l-1.5cr" ${discoverState.budget === '50l-1.5cr' ? 'selected' : ''}>₹ 50 Lakhs – ₹ 1.5 Cr</option>
                  <option value="1.5cr-3cr" ${discoverState.budget === '1.5cr-3cr' ? 'selected' : ''}>₹ 1.5 Cr – ₹ 3.0 Cr</option>
                  <option value="above-3cr" ${discoverState.budget === 'above-3cr' ? 'selected' : ''}>Above ₹ 3.0 Cr</option>
                </select>
              </div>

            </div>
          </div>

        </div>
      </section>

      <!-- PROPERTY RESULTS SECTION -->
      <section style="padding: 60px 0 90px 0; background: #ffffff;">
        <div class="container">
          
          <!-- Results Count & Active Filters Indicator -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
            <div style="font-size: 1.1rem; font-weight: 700; color: #1a1a1a;">
              Showing <span style="color: var(--color-orange, #eb5e28);">${filteredProps.length}</span> ${filteredProps.length === 1 ? 'property' : 'properties'}
            </div>

            ${hasActiveFilters(discoverState) ? `
              <button class="os-btn-secondary" id="clear-all-filters-btn" style="font-size: 0.85rem; padding: 6px 16px; border-radius: 20px; color: #e53e3e;">
                <i class="ri-close-circle-line"></i> Clear Filters
              </button>
            ` : ''}
          </div>

          <!-- Cards Grid or Empty State -->
          ${filteredProps.length > 0 ? `
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 32px;">
              ${filteredProps.map(prop => `
                <div class="discover-prop-card hover-lift" data-id="${prop.id}" style="
                  background: #ffffff; border-radius: 20px; overflow: hidden;
                  border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 18px rgba(0,0,0,0.04);
                  display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease;
                ">
                  <div style="position: relative; width: 100%; height: 240px; overflow: hidden; background: #111;">
                    <img src="${prop.images[0]}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                    
                    <span class="badge badge-orange" style="position: absolute; top: 16px; left: 16px; font-weight: 700;">
                      ${prop.categoryLabel}
                    </span>

                    <span class="badge badge-dark" style="position: absolute; top: 16px; right: 16px; text-transform: uppercase;">
                      ${prop.purpose === 'rent' ? 'For Rent' : 'For Sale'}
                    </span>
                  </div>

                  <div style="padding: 24px; display: flex; flex-direction: column; flex: 1;">
                    <div style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 700; color: var(--color-orange, #eb5e28); margin-bottom: 6px;">
                      ${prop.priceFormatted}
                    </div>

                    <h3 style="font-family: var(--font-serif); font-size: 1.2rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
                      ${prop.title}
                    </h3>

                    <div style="display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #666; margin-bottom: 16px;">
                      <i class="ri-map-pin-2-line" style="color: var(--color-orange, #eb5e28);"></i>
                      <span>${prop.location}, ${prop.district}</span>
                    </div>

                    <p style="font-size: 0.88rem; color: #666; line-height: 1.5; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                      ${prop.description}
                    </p>

                    <div style="display: flex; gap: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 0.85rem; color: #555; margin-top: auto;">
                      <span><i class="ri-ruler-2-line"></i> ${prop.size}</span>
                      ${prop.bedrooms ? `<span><i class="ri-hotel-bed-line"></i> ${prop.bedrooms} BHK</span>` : `<span><i class="ri-shield-check-line"></i> ${prop.approval}</span>`}
                    </div>

                    <button class="btn btn-outline-dark" style="margin-top: 20px; width: 100%; border-radius: 10px; font-size: 0.9rem;">
                      <span>View Property Details</span>
                      <i class="ri-arrow-right-line"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          ` : `
            <!-- Empty State -->
            <div style="
              text-align: center; padding: 80px 20px; background: #faf8f5; border-radius: 24px;
              border: 1px dashed #cbd5e0; max-width: 580px; margin: 0 auto;
            ">
              <i class="ri-search-eye-line" style="font-size: 3.5rem; color: #a0aec0; margin-bottom: 16px; display: block;"></i>
              <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: #2d3748; margin-bottom: 10px;">
                No properties found
              </h3>
              <p style="color: #718096; font-size: 0.95rem; margin-bottom: 24px; line-height: 1.6;">
                We couldn't find any properties matching your current filter selections. Try adjusting your search query or location filters.
              </p>
              <button class="btn btn-primary" id="empty-clear-filters-btn" style="padding: 12px 28px; border-radius: 10px;">
                <i class="ri-refresh-line"></i> Clear All Filters
              </button>
            </div>
          `}

        </div>
      </section>

    </div>
  `;
}

// Render dynamic Property Detail Page
function renderPropertyDetailView(property, onNavigateToContact) {
  return `
    <div class="page-view view-enter property-detail-page" style="padding-top: 100px; padding-bottom: 90px; background: #faf8f5;">
      <div class="container">
        
        <!-- Back Link -->
        <button class="os-btn-secondary" id="back-to-discover-btn" style="margin-bottom: 24px; font-size: 0.9rem;">
          <i class="ri-arrow-left-line"></i> Back to Discover Properties
        </button>

        <div style="background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 40px rgba(0,0,0,0.06);">
          
          <!-- Image Gallery Grid -->
          <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 8px; height: 440px; background: #111;" class="detail-gallery-grid">
            <img src="${property.images[0]}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="display: flex; flex-direction: column; gap: 8px; height: 100%;">
              ${property.images[1] ? `<img src="${property.images[1]}" style="width: 100%; height: 50%; object-fit: cover;" />` : ''}
              ${property.images[2] ? `<img src="${property.images[2]}" style="width: 100%; height: 50%; object-fit: cover;" />` : ''}
            </div>
          </div>

          <!-- Main Info Content -->
          <div style="padding: 40px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 20px; margin-bottom: 24px;">
              <div>
                <span class="badge badge-orange" style="font-size: 0.8rem; margin-bottom: 10px; display: inline-block;">
                  ${property.categoryLabel}
                </span>
                <h1 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
                  ${property.title}
                </h1>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 1.05rem; color: #555;">
                  <i class="ri-map-pin-2-fill" style="color: var(--color-orange, #eb5e28);"></i>
                  <span>${property.location}, ${property.district}, Tamil Nadu</span>
                </div>
              </div>

              <div style="text-align: right;">
                <div style="font-size: 0.85rem; color: #777; text-transform: uppercase; font-weight: 700;">Asking Price</div>
                <div style="font-family: var(--font-serif); font-size: 2.4rem; font-weight: 700; color: var(--color-orange, #eb5e28);">
                  ${property.priceFormatted}
                </div>
              </div>
            </div>

            <!-- Specs Bar -->
            <div style="
              display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px;
              padding: 20px 24px; background: #fdfbf7; border-radius: 16px; border: 1px solid rgba(0,0,0,0.06); margin-bottom: 32px;
            ">
              <div>
                <span style="font-size: 0.75rem; color: #777; text-transform: uppercase; display: block;">Total Area</span>
                <strong style="font-size: 1rem; color: #1a1a1a;"><i class="ri-ruler-2-line"></i> ${property.size}</strong>
              </div>
              ${property.bedrooms ? `
                <div>
                  <span style="font-size: 0.75rem; color: #777; text-transform: uppercase; display: block;">Bedrooms</span>
                  <strong style="font-size: 1rem; color: #1a1a1a;"><i class="ri-hotel-bed-line"></i> ${property.bedrooms} BHK</strong>
                </div>
              ` : ''}
              <div>
                <span style="font-size: 0.75rem; color: #777; text-transform: uppercase; display: block;">Legal Status</span>
                <strong style="font-size: 1rem; color: #1a1a1a;"><i class="ri-shield-check-line"></i> ${property.approval}</strong>
              </div>
              <div>
                <span style="font-size: 0.75rem; color: #777; text-transform: uppercase; display: block;">Facing</span>
                <strong style="font-size: 1rem; color: #1a1a1a;"><i class="ri-compass-3-line"></i> ${property.facing || 'East Facing'}</strong>
              </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 36px;">
              <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 12px; color: #1a1a1a;">Property Overview</h3>
              <p style="font-size: 1.05rem; color: #4a5568; line-height: 1.7;">
                ${property.description}
              </p>
            </div>

            <!-- Key Features & Highlights -->
            ${property.features ? `
              <div style="margin-bottom: 40px;">
                <h3 style="font-family: var(--font-serif); font-size: 1.35rem; margin-bottom: 16px; color: #1a1a1a;">Key Highlights & Amenities</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
                  ${property.features.map(f => `
                    <div style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; color: #2d3748; background: #faf8f5; padding: 12px 16px; border-radius: 10px;">
                      <i class="ri-checkbox-circle-fill" style="color: var(--color-orange, #eb5e28); font-size: 1.15rem;"></i>
                      <span>${f}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- CTA Box -->
            <div style="
              padding: 32px; background: #2A1808; color: #ffffff; border-radius: 20px;
              display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;
            ">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.6rem; color: #ffffff; margin-bottom: 6px;">
                  Interested in this property?
                </h3>
                <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; margin: 0;">
                  Schedule a private site tour or connect directly with our property advisory team.
                </p>
              </div>

              <button class="btn btn-primary" id="detail-enquire-btn" style="padding: 14px 32px; font-size: 1rem; border-radius: 10px;">
                <i class="ri-mail-send-line"></i> Enquire Now
              </button>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}

function filterProperties(state) {
  const allProperties = getProperties();
  return allProperties.filter(prop => {
    if (!prop) return false;
    const title = (prop.title || '').toLowerCase();
    const loc = (prop.location || '').toLowerCase();
    const dist = (prop.district || '').toLowerCase();
    const catLabel = (prop.categoryLabel || '').toLowerCase();
    const type = (prop.type || '').toLowerCase();
    const cat = (prop.category || '').toLowerCase();

    // Keyword search
    if (state.keyword && state.keyword.trim() !== '') {
      const q = state.keyword.toLowerCase().trim();
      const matchTitle = title.includes(q);
      const matchLoc = loc.includes(q);
      const matchDist = dist.includes(q);
      const matchCategory = catLabel.includes(q) || cat.includes(q) || type.includes(q);
      if (!matchTitle && !matchLoc && !matchDist && !matchCategory) return false;
    }

    // Type filter
    if (state.type && state.type !== 'all') {
      const targetType = state.type.toLowerCase();
      const isTypeMatch = cat === targetType || type.includes(targetType) || catLabel.includes(targetType);
      if (!isTypeMatch) return false;
    }

    // Location filter
    if (state.location && state.location !== 'all') {
      const targetLoc = state.location.toLowerCase();
      const isLocMatch = loc.includes(targetLoc) || dist.includes(targetLoc);
      if (!isLocMatch) return false;
    }

    // Purpose filter
    if (state.purpose && state.purpose !== 'all') {
      if (prop.purpose !== state.purpose) return false;
    }

    // Budget filter
    if (state.budget && state.budget !== 'all') {
      const p = prop.price || 0;
      if (state.budget === 'under-50l' && p >= 5000000) return false;
      if (state.budget === '50l-1.5cr' && (p < 5000000 || p > 15000000)) return false;
      if (state.budget === '1.5cr-3cr' && (p < 15000000 || p > 30000000)) return false;
      if (state.budget === 'above-3cr' && p <= 30000000) return false;
    }

    return true;
  });
}

function hasActiveFilters(state) {
  return Boolean(
    (state.keyword && state.keyword.trim() !== '') ||
    (state.type && state.type !== 'all') ||
    (state.location && state.location !== 'all') ||
    (state.purpose && state.purpose !== 'all') ||
    (state.budget && state.budget !== 'all')
  );
}

export function initDiscoverListeners(discoverState, onStateUpdate, onPropertySelect, onNavigateToContact) {
  // Detail Page Listeners
  const backBtn = document.getElementById('back-to-discover-btn');
  if (backBtn) {
    backBtn.addEventListener('click', () => {
      onPropertySelect(null);
    });
  }

  const enquireBtn = document.getElementById('detail-enquire-btn');
  if (enquireBtn) {
    enquireBtn.addEventListener('click', () => {
      onNavigateToContact();
    });
  }

  // Filter Bar Listeners
  const searchInput = document.getElementById('discover-search-input');
  searchInput?.addEventListener('input', (e) => {
    discoverState.keyword = e.target.value;
    onStateUpdate(discoverState);
  });

  const selectType = document.getElementById('filter-type');
  selectType?.addEventListener('change', (e) => {
    discoverState.type = e.target.value;
    onStateUpdate(discoverState);
  });

  const selectLocation = document.getElementById('filter-location');
  selectLocation?.addEventListener('change', (e) => {
    discoverState.location = e.target.value;
    onStateUpdate(discoverState);
  });

  const selectPurpose = document.getElementById('filter-purpose');
  selectPurpose?.addEventListener('change', (e) => {
    discoverState.purpose = e.target.value;
    onStateUpdate(discoverState);
  });

  const selectBudget = document.getElementById('filter-budget');
  selectBudget?.addEventListener('change', (e) => {
    discoverState.budget = e.target.value;
    onStateUpdate(discoverState);
  });

  // Clear Filters
  const clearBtns = [
    document.getElementById('clear-all-filters-btn'),
    document.getElementById('empty-clear-filters-btn')
  ];

  clearBtns.forEach(btn => {
    btn?.addEventListener('click', () => {
      discoverState.keyword = '';
      discoverState.type = 'all';
      discoverState.location = 'all';
      discoverState.purpose = 'all';
      discoverState.budget = 'all';
      onStateUpdate(discoverState);
    });
  });

  // Property Cards Click
  document.querySelectorAll('.discover-prop-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id && onPropertySelect) {
        onPropertySelect(id);
      }
    });
  });
}
