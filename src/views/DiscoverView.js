import { getProperties, getPublicProperties } from '../utils/propertiesStore.js';

function formatSizeDisplay(size) {
  if (!size) return '2,400 Sq.Ft';
  const str = String(size).trim();
  if (/^\d+$/.test(str)) {
    return `${parseInt(str, 10).toLocaleString('en-IN')} Sq.Ft`;
  }
  return str;
}

export function renderDiscoverView(discoverState, onPropertySelect, onNavigateToContact) {
  const allProperties = getPublicProperties();
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
            FIND YOUR PROPERTY
          </span>
          <h1 class="heading-display-light" style="font-size: clamp(2.2rem, 4.5vw, 3.8rem); color: #ffffff; margin-bottom: 12px;">
            Find Your Next Property in Tamil Nadu
          </h1>
          <div style="font-size: 1.05rem; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 14px;">Search Houses, Plots, Agricultural Land & Commercial Spaces</div>
          <p style="font-size: 1.02rem; color: rgba(255, 255, 255, 0.85); line-height: 1.65; max-width: 720px; margin: 0 auto;">
            Explore real estate listings across Tamil Nadu. Use location, budget, and property type filters to narrow your search and find properties that match your requirements.
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
                <label style="font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: #555; display: block; margin-bottom: 6px; letter-spacing: 0.05em;">Max Budget</label>
                <select id="filter-budget" style="width: 100%; padding: 12px 14px; font-size: 0.9rem; border-radius: 10px; border: 1px solid #cbd5e0; background: #fff; outline: none;">
                  <option value="all" ${discoverState.budget === 'all' ? 'selected' : ''}>Any Price</option>
                  <option value="5000000" ${discoverState.budget === '5000000' ? 'selected' : ''}>Upto ₹ 50 Lakhs</option>
                  <option value="15000000" ${discoverState.budget === '15000000' ? 'selected' : ''}>Upto ₹ 1.5 Cr</option>
                  <option value="30000000" ${discoverState.budget === '30000000' ? 'selected' : ''}>Upto ₹ 3.0 Cr</option>
                  <option value="50000000" ${discoverState.budget === '50000000' ? 'selected' : ''}>Upto ₹ 5.0 Cr</option>
                  ${(discoverState.budget !== 'all' && !['5000000', '15000000', '30000000', '50000000'].includes(String(discoverState.budget))) 
                    ? `<option value="${discoverState.budget}" selected>Upto ₹ ${(Number(discoverState.budget)/10000000).toFixed(1)} Cr</option>` 
                    : ''}
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

let activeDetailPhotoIndex = 0;

// Render dynamic Property Detail Page
function renderPropertyDetailView(property, onNavigateToContact) {
  const rawImgs = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
  const uniqueImgs = [...new Set(rawImgs)];
  const images = uniqueImgs.length > 0 ? uniqueImgs : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];

  if (activeDetailPhotoIndex >= images.length) activeDetailPhotoIndex = 0;
  const mainImage = images[activeDetailPhotoIndex] || images[0];

  return `
    <div class="page-view view-enter property-detail-page" style="padding-top: 110px; padding-bottom: 90px; background: #faf8f5;">
      <div class="container" style="max-width: 1140px;">
        
        <!-- Back Navigation & Action Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <button class="os-btn-secondary" id="back-to-discover-btn" style="font-size: 0.9rem; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: #ffffff; border: 1px solid #E2E8F0; color: #4A5568; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <i class="ri-arrow-left-line" style="color: #eb5e28;"></i> Back to Find Your Property
          </button>

          <div style="display: flex; gap: 10px; align-items: center;">
            <span style="background: #E6FFFA; color: #234E52; font-weight: 800; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #B2F5EA;">
              <i class="ri-checkbox-circle-fill" style="color: #38A169;"></i> ${property.approval || 'DTCP & RERA Approved'}
            </span>
          </div>
        </div>

        <!-- MAIN LUXURY CARD CONTAINER -->
        <div style="background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 16px 48px rgba(0,0,0,0.06);">
          
          <!-- STATE-OF-THE-ART HERO MEDIA VIEWPORT (500px) WITH CAROUSEL ARROWS -->
          <div style="width: 100%; position: relative;">
            <div style="width: 100%; height: 500px; background: #0f172a; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;">
              <img id="detail-hero-img" src="${mainImage}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" />

              <!-- Top Left Counter Badge -->
              <div style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.82rem; font-weight: 700; padding: 6px 16px; border-radius: 20px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 6px; z-index: 10;">
                <i class="ri-image-line" style="color: #eb5e28;"></i>
                <span id="detail-photo-counter">Photo ${activeDetailPhotoIndex + 1} of ${images.length}</span>
              </div>

              <!-- Top Right Status Badge -->
              <span style="position: absolute; top: 20px; right: 20px; background: #eb5e28; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 6px 16px; border-radius: 20px; z-index: 10; box-shadow: 0 4px 14px rgba(0,0,0,0.25); letter-spacing: 0.05em; text-transform: uppercase;">
                ${property.purpose === 'rent' ? 'FOR RENT' : 'FOR SALE'}
              </span>

              <!-- Left/Right Carousel Swipe Arrows -->
              ${images.length > 1 ? `
                <button id="detail-prev-photo-btn" title="Previous photo" style="
                  position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.5rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px);
                  box-shadow: 0 4px 16px rgba(0,0,0,0.4); z-index: 10; transition: all 0.2s ease;
                ">
                  <i class="ri-arrow-left-s-line"></i>
                </button>

                <button id="detail-next-photo-btn" title="Next photo" style="
                  position: absolute; right: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.5rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px);
                  box-shadow: 0 4px 16px rgba(0,0,0,0.4); z-index: 10; transition: all 0.2s ease;
                ">
                  <i class="ri-arrow-right-s-line"></i>
                </button>
              ` : ''}
            </div>

            <!-- Thumbnail Selector Bar Below Hero Image -->
            ${images.length > 1 ? `
              <div style="display: flex; gap: 12px; overflow-x: auto; padding: 16px 20px; background: #1A202C; scrollbar-width: thin; scrollbar-color: #eb5e28 #2D3748;">
                ${images.map((img, idx) => `
                  <div class="detail-thumb-item" data-index="${idx}" style="
                    width: 96px; height: 68px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer;
                    border: 2px solid ${idx === activeDetailPhotoIndex ? '#eb5e28' : 'transparent'};
                    opacity: ${idx === activeDetailPhotoIndex ? '1' : '0.6'}; transition: all 0.2s ease;
                  ">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- MAIN PROPERTY DETAILS BODY CONTENT -->
          <div style="padding: 40px;">
            
            <!-- Title & Price Header Row -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 24px; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 1px solid #EDF2F7;">
              <div style="flex: 1; min-width: 280px;">
                <span class="badge badge-orange" style="font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 12px; display: inline-block;">
                  ${property.categoryLabel || property.type || 'Property'}
                </span>
                <h1 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; color: #1A202C; margin-bottom: 10px; line-height: 1.25;">
                  ${property.title}
                </h1>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 1.05rem; color: #4A5568; font-weight: 600;">
                  <i class="ri-map-pin-2-fill" style="color: #eb5e28; font-size: 1.2rem;"></i>
                  <span>${property.location}, ${property.district}, Tamil Nadu</span>
                </div>
              </div>

              <div style="background: #FFF5F2; padding: 20px 28px; border-radius: 16px; border: 1px solid #FFD0C2; text-align: right; min-width: 220px;">
                <span style="font-size: 0.8rem; color: #718096; text-transform: uppercase; font-weight: 800; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Asking Price</span>
                <div style="font-family: var(--font-serif); font-size: 2.5rem; font-weight: 800; color: #eb5e28; line-height: 1;">
                  ${property.priceFormatted || '₹ ' + property.price}
                </div>
                <span style="font-size: 0.78rem; color: #4A5568; font-weight: 700; display: block; margin-top: 6px;">
                  100% Verified Ownership & Clear Patta Title
                </span>
              </div>
            </div>

            <!-- KEY SPECIFICATIONS GRID -->
            <div style="
              display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 16px;
              padding: 24px; background: #F8FAFC; border-radius: 16px; border: 1px solid #E2E8F0; margin-bottom: 36px;
            ">
              <div>
                <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Total Area</span>
                <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-ruler-2-line" style="color: #eb5e28;"></i> ${formatSizeDisplay(property.size)}</strong>
              </div>

              ${property.bedrooms ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Bedrooms</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-hotel-bed-line" style="color: #eb5e28;"></i> ${property.bedrooms} BHK</strong>
                </div>
              ` : ''}

              ${property.bathrooms ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Bathrooms</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-drop-line" style="color: #eb5e28;"></i> ${property.bathrooms} Baths</strong>
                </div>
              ` : ''}

              <div>
                <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Furnishing</span>
                <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-armchair-line" style="color: #eb5e28;"></i> ${property.furnishing || 'Not specified'}</strong>
              </div>
            </div>

            <!-- POSTER / OWNER INFORMATION CARD -->
            ${(() => {
              const isPaidAd = String(property.adType || property.ad_type || property.adTier || property.listingPlan || '').toLowerCase().trim() === 'paid';
              const ownerDisplayName = isPaidAd ? (property.ownerName || 'Verified Owner') : 'Thanjai Property';
              const ownerDisplayPhone = isPaidAd ? (property.ownerPhone || '8489996852') : '8489996852';
              const formattedOwnerPhone = ownerDisplayPhone.startsWith('+91') ? ownerDisplayPhone : `+91 ${ownerDisplayPhone}`;
              const rawOwnerPhoneClean = ownerDisplayPhone.replace(/[^0-9]/g, '');
              const ownerWaNumber = rawOwnerPhoneClean.startsWith('91') && rawOwnerPhoneClean.length === 12 ? rawOwnerPhoneClean : (rawOwnerPhoneClean.length === 10 ? `91${rawOwnerPhoneClean}` : '918489996852');

              return `
                <div style="background: #FAF8F5; padding: 20px 24px; border-radius: 16px; border: 1px solid #E7E0D8; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                  <div>
                    <span style="font-size: 0.78rem; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Verified Property Seller / Specialist:</span>
                    <strong style="font-size: 1.1rem; color: #1A202C;">${ownerDisplayName}</strong>
                    <div style="font-size: 0.75rem; font-weight: 700; color: ${isPaidAd ? '#38A169' : '#eb5e28'}; margin-top: 2px;">
                      ${isPaidAd ? '👑 Direct Owner Listing • 0% Brokerage' : '🛡️ Executive Real Estate Advisory Desk'}
                    </div>
                  </div>

                  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <a href="tel:${formattedOwnerPhone}" style="background: #ffffff; border: 1px solid #CBD5E0; color: #2D3748; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                      <i class="ri-phone-line" style="color: #eb5e28;"></i> ${isPaidAd ? `Call Owner (${ownerDisplayPhone})` : 'Call Seller (+91 84899 96852)'}
                    </a>
                    <a href="${isPaidAd ? `https://wa.me/${ownerWaNumber}?text=Hi%20${encodeURIComponent(ownerDisplayName)},%20I%20am%20interested%20in%20your%20property%20${encodeURIComponent(property.title)}` : `https://wa.me/918489996852?text=Hello%20Thanjai%20Property,%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}`}" target="_blank" style="background: #25D366; color: #ffffff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(37,211,102,0.25);">
                      <i class="ri-whatsapp-line"></i> ${isPaidAd ? 'WhatsApp Owner' : 'WhatsApp Chat'}
                    </a>
                    <a href="mailto:vijayaraghavan@thanjaiproperty.com?subject=Inquiry%20for%20${encodeURIComponent(property.title)}" style="background: #1a1a1a; color: #ffffff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                      <i class="ri-mail-line" style="color: #eb5e28;"></i> Email Us
                    </a>
                  </div>
                </div>
              `;
            })()}

            <!-- DESCRIPTION OVERVIEW -->
            <div style="margin-bottom: 40px;">
              <h3 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; margin-bottom: 14px; color: #1A202C;">Property Overview</h3>
              <p style="font-size: 1.05rem; color: #4A5568; line-height: 1.7; margin: 0;">
                ${property.description || 'Luxury property in prime growth corridor with clear Patta title and excellent connectivity.'}
              </p>
            </div>

            <!-- KEY FEATURES & AMENITIES GRID -->
            ${property.features && property.features.length > 0 ? `
              <div style="margin-bottom: 40px;">
                <h3 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; margin-bottom: 18px; color: #1A202C;">Key Highlights & Amenities</h3>
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px;">
                  ${property.features.map(f => `
                    <div style="display: flex; align-items: center; gap: 10px; font-size: 0.95rem; font-weight: 700; color: #2D3748; background: #FAF8F5; padding: 14px 18px; border-radius: 12px; border: 1px solid #E7E0D8;">
                      <i class="ri-checkbox-circle-fill" style="color: #38A169; font-size: 1.2rem;"></i>
                      <span>${f}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

            <!-- LUXURY ADVISORY & SITE VISIT CTA BANNER -->
            <div style="
              padding: 36px; background: linear-gradient(135deg, #1C1007 0%, #2A1808 100%); color: #ffffff; border-radius: 20px;
              display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; box-shadow: 0 12px 30px rgba(0,0,0,0.15);
            ">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.75rem; color: #ffffff; margin-bottom: 6px; font-weight: 800;">
                  Interested in visiting this property?
                </h3>
                <p style="color: rgba(255,255,255,0.85); font-size: 0.98rem; margin: 0;">
                  Schedule a private site tour or connect directly with our senior property advisory desk.
                </p>
              </div>

              <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                <button class="btn btn-primary" id="detail-enquire-btn" style="padding: 14px 32px; font-size: 1rem; border-radius: 12px; font-weight: 800;">
                  <i class="ri-mail-send-line"></i> Enquire Now
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  `;
}

function filterProperties(state) {
  const allProperties = getPublicProperties();
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

    // Budget filter (Max Budget logic)
    if (state.budget && state.budget !== 'all') {
      const p = prop.price || 0;
      let maxBudget = Number(state.budget);
      if (isNaN(maxBudget)) {
        // Legacy support
        if (state.budget === 'under-50l') maxBudget = 5000000;
        else if (state.budget === '50l-1.5cr') maxBudget = 15000000;
        else if (state.budget === '1.5cr-3cr') maxBudget = 30000000;
        else if (state.budget === 'above-3cr') maxBudget = 9999000000;
      }
      if (maxBudget > 0 && p > maxBudget) return false;
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
      activeDetailPhotoIndex = 0;
      onPropertySelect(null);
    });
  }

  const enquireBtn = document.getElementById('detail-enquire-btn');
  if (enquireBtn) {
    enquireBtn.addEventListener('click', () => {
      onNavigateToContact();
    });
  }

  // Detail Hero Carousel Prev/Next & Thumbnails
  const selectedProp = discoverState.selectedPropertyId ? getPublicProperties().find(p => p.id === discoverState.selectedPropertyId) : null;
  const propImages = selectedProp && Array.isArray(selectedProp.images) ? selectedProp.images.filter(Boolean) : [];

  document.getElementById('detail-prev-photo-btn')?.addEventListener('click', () => {
    if (propImages.length > 0) {
      activeDetailPhotoIndex = (activeDetailPhotoIndex - 1 + propImages.length) % propImages.length;
      onStateUpdate(discoverState);
    }
  });

  document.getElementById('detail-next-photo-btn')?.addEventListener('click', () => {
    if (propImages.length > 0) {
      activeDetailPhotoIndex = (activeDetailPhotoIndex + 1) % propImages.length;
      onStateUpdate(discoverState);
    }
  });

  document.querySelectorAll('.detail-thumb-item').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.dataset.index, 10);
      if (!isNaN(idx)) {
        activeDetailPhotoIndex = idx;
        onStateUpdate(discoverState);
      }
    });
  });

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
        activeDetailPhotoIndex = 0;
        onPropertySelect(id);
      }
    });
  });
}
