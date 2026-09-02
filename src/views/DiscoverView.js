import { getProperties, getPublicProperties, formatPropertySize, formatLocationDisplay } from '../utils/propertiesStore.js';
import { openPropertyModalById } from '../components/PropertyDetailModal.js';

function formatSizeDisplay(size) {
  return formatPropertySize(size);
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
                      <span>${formatLocationDisplay(prop.location, prop.district)}</span>
                    </div>

                    ${prop.description ? `
                      <p style="font-size: 0.88rem; color: #666; line-height: 1.5; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${prop.description}
                      </p>
                    ` : ''}

                    <div style="display: flex; gap: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 0.85rem; color: #555; margin-top: auto; flex-wrap: wrap;">
                      ${prop.size ? `<span><i class="ri-ruler-2-line"></i> ${formatSizeDisplay(prop.size)}</span>` : ''}
                      ${prop.facing ? `<span><i class="ri-compass-3-line"></i> ${prop.facing}</span>` : ''}
                      ${prop.bedrooms ? `<span><i class="ri-hotel-bed-line"></i> ${prop.bedrooms} BHK</span>` : (prop.approval ? `<span><i class="ri-shield-check-line"></i> ${prop.approval}</span>` : '')}
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

function extractAllVideos(videoData) {
  if (!videoData) return [];
  let list = [];
  if (Array.isArray(videoData)) {
    list = videoData;
  } else if (typeof videoData === 'string') {
    const trimmed = videoData.trim();
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) list = parsed;
        else list = [trimmed];
      } catch (e) {
        list = trimmed.split(/[\n,]+/);
      }
    } else {
      list = trimmed.split(/[\n,]+/);
    }
  }
  return list.map(v => (typeof v === 'string' ? v.trim() : '')).filter(Boolean);
}

function extractVideoInfo(url) {
  if (!url || typeof url !== 'string') return null;
  const clean = url.trim();
  if (!clean) return null;

  // YouTube match
  const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return {
      type: 'youtube',
      embedUrl: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`
    };
  }

  // Facebook Video match
  if (/facebook\.com|fb\.watch|fb\.com/i.test(clean)) {
    return {
      type: 'facebook',
      embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=0&width=560&autoplay=1`
    };
  }

  // Direct video file or base64
  if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(clean) || clean.startsWith('data:video/')) {
    return {
      type: 'file',
      url: clean
    };
  }

  return {
    type: 'iframe',
    url: clean
  };
}

// Render dynamic Property Detail Page
function renderPropertyDetailView(property, onNavigateToContact) {
  const rawImgs = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
  const uniqueImgs = [...new Set(rawImgs)];
  const images = uniqueImgs.length > 0 ? uniqueImgs : ['/default-property.jpg'];

  const allVideos = extractAllVideos(property.videoUrl || property.videos);
  const mediaItems = images.map((img, i) => ({ type: 'image', url: img, index: i + 1, total: images.length }));
  allVideos.forEach((vUrl, vIdx) => {
    mediaItems.push({ type: 'video', url: vUrl, index: vIdx + 1, total: allVideos.length });
  });

  if (activeDetailPhotoIndex >= mediaItems.length) activeDetailPhotoIndex = 0;
  const currentMedia = mediaItems[activeDetailPhotoIndex] || mediaItems[0];
  const isVideo = currentMedia.type === 'video';
  const videoInfo = isVideo ? extractVideoInfo(currentMedia.url) : null;

  return `
    <div class="page-view view-enter property-detail-page" style="padding-top: 110px; padding-bottom: 90px; background: #faf8f5;">
      <div class="container" style="max-width: 1140px;">
        
        <!-- Back Navigation & Action Header -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
          <button class="os-btn-secondary" id="back-to-discover-btn" style="font-size: 0.9rem; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: #ffffff; border: 1px solid #E2E8F0; color: #4A5568; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
            <i class="ri-arrow-left-line" style="color: #eb5e28;"></i> Back to Find Your Property
          </button>

          <div style="display: flex; gap: 10px; align-items: center;">
            ${property.approval ? `
              <span style="background: #E6FFFA; color: #234E52; font-weight: 800; padding: 6px 14px; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 6px; border: 1px solid #B2F5EA;">
                <i class="ri-checkbox-circle-fill" style="color: #38A169;"></i> ${property.approval}
              </span>
            ` : ''}
          </div>
        </div>

        <!-- MAIN LUXURY CARD CONTAINER -->
        <div style="background: #ffffff; border-radius: 24px; overflow: hidden; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 16px 48px rgba(0,0,0,0.06);">
          
          <!-- STATE-OF-THE-ART HERO MEDIA VIEWPORT (500px) WITH CAROUSEL ARROWS -->
          <div style="width: 100%; position: relative;">
            <div style="width: 100%; height: 500px; background: #0f172a; overflow: hidden; position: relative; display: flex; align-items: center; justify-content: center;">
              ${!isVideo ? `
                <img id="detail-hero-img" src="${currentMedia.url}" alt="${property.title}" style="width: 100%; height: 100%; object-fit: cover; transition: opacity 0.3s ease;" />
              ` : `
                ${videoInfo?.type === 'youtube' || videoInfo?.type === 'facebook' || videoInfo?.type === 'iframe' ? `
                  <iframe src="${videoInfo.embedUrl || videoInfo.url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width: 100%; height: 100%; border: 0; background: #000;"></iframe>
                ` : `
                  <video src="${videoInfo?.url || currentMedia.url}" controls autoplay style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>
                `}
              `}

              <!-- Top Left Counter Badge -->
              <div style="position: absolute; top: 20px; left: 20px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.82rem; font-weight: 700; padding: 6px 16px; border-radius: 20px; backdrop-filter: blur(6px); display: flex; align-items: center; gap: 6px; z-index: 10;">
                <i class="${isVideo ? 'ri-movie-line' : 'ri-image-line'}" style="color: #eb5e28;"></i>
                <span id="detail-photo-counter">${isVideo ? (allVideos.length > 1 ? `Property Video ${currentMedia.index} of ${allVideos.length}` : 'Property Video Tour') : `Photo ${activeDetailPhotoIndex + 1} of ${images.length}`}</span>
              </div>

              <!-- Top Right Status Badge -->
              <span style="position: absolute; top: 20px; right: 20px; background: #eb5e28; color: #ffffff; font-size: 0.8rem; font-weight: 800; padding: 6px 16px; border-radius: 20px; z-index: 10; box-shadow: 0 4px 14px rgba(0,0,0,0.25); letter-spacing: 0.05em; text-transform: uppercase;">
                ${property.purpose === 'rent' ? 'FOR RENT' : 'FOR SALE'}
              </span>

              <!-- Left/Right Carousel Swipe Arrows -->
              ${mediaItems.length > 1 ? `
                <button id="detail-prev-photo-btn" title="Previous media" style="
                  position: absolute; left: 20px; top: 50%; transform: translateY(-50%); width: 48px; height: 48px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.5rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(8px);
                  box-shadow: 0 4px 16px rgba(0,0,0,0.4); z-index: 10; transition: all 0.2s ease;
                ">
                  <i class="ri-arrow-left-s-line"></i>
                </button>

                <button id="detail-next-photo-btn" title="Next media" style="
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
            ${mediaItems.length > 1 ? `
              <div style="display: flex; gap: 12px; overflow-x: auto; padding: 16px 20px; background: #1A202C; scrollbar-width: thin; scrollbar-color: #eb5e28 #2D3748;">
                ${mediaItems.map((item, idx) => `
                  <div class="detail-thumb-item" data-index="${idx}" style="
                    width: 96px; height: 68px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer;
                    border: 2px solid ${idx === activeDetailPhotoIndex ? '#eb5e28' : 'transparent'};
                    opacity: ${idx === activeDetailPhotoIndex ? '1' : '0.6'}; transition: all 0.2s ease;
                    position: relative; background: #111;
                  ">
                    ${item.type === 'image' ? `
                      <img src="${item.url}" style="width: 100%; height: 100%; object-fit: cover;" />
                    ` : `
                      <div style="width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%); color: #ffffff;">
                        <i class="ri-play-circle-fill" style="font-size: 1.8rem; color: #eb5e28;"></i>
                        <span style="font-size: 0.65rem; font-weight: 800; letter-spacing: 0.05em; margin-top: 2px;">VIDEO ${allVideos.length > 1 ? item.index : ''}</span>
                      </div>
                    `}
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
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px; flex-wrap: wrap;">
                  <span class="badge badge-orange" style="font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; display: inline-block;">
                    ${property.categoryLabel || property.type || 'Property'}
                  </span>
                  <span style="font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; color: #718096; background: #EDF2F7; padding: 4px 10px; border-radius: 8px; display: inline-flex; align-items: center; gap: 4px; border: 1px solid #E2E8F0;">
                    <i class="ri-hashtag" style="color: #eb5e28; font-size: 0.9rem;"></i> ID: ${property.id}
                  </span>
                </div>
                <h1 style="font-family: var(--font-serif); font-size: clamp(1.8rem, 3.5vw, 2.6rem); font-weight: 800; color: #1A202C; margin-bottom: 10px; line-height: 1.25;">
                  ${property.title}
                </h1>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 1.05rem; color: #4A5568; font-weight: 600;">
                  <a href="${property.latitude && property.longitude ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.latitude)},${encodeURIComponent(property.longitude)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([property.location, property.district, 'Tamil Nadu'].filter(Boolean).join(', '))}`}" target="_blank" rel="noopener noreferrer" style="color: #4A5568; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: color 0.2s ease;" onmouseover="this.style.color='#eb5e28'" onmouseout="this.style.color='#4A5568'" title="Open Location on Google Maps">
                    <i class="ri-map-pin-2-fill" style="color: #eb5e28; font-size: 1.2rem;"></i>
                    <span>${formatLocationDisplay(property.location, property.district)}</span>
                    <i class="ri-external-link-line" style="font-size: 0.85rem; color: #a0aec0;"></i>
                  </a>
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
              ${property.size ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Total Area</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-ruler-2-line" style="color: #eb5e28;"></i> ${formatSizeDisplay(property.size)}</strong>
                </div>
              ` : ''}

              ${(property.facing || property.address) ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Facing</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-compass-3-line" style="color: #eb5e28;"></i> ${property.facing || property.address}</strong>
                </div>
              ` : ''}

              ${property.approval ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Approval Status</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-shield-check-line" style="color: #38A169;"></i> ${property.approval}</strong>
                </div>
              ` : ''}

              ${property.road && property.road !== 'Other / Outside Road' ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Road Corridor</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-road-map-line" style="color: #eb5e28;"></i> ${property.road}</strong>
                </div>
              ` : ''}

              ${property.taluk ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Taluk</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-government-line" style="color: #eb5e28;"></i> ${property.taluk}</strong>
                </div>
              ` : ''}

              ${property.district ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">District</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-map-pin-line" style="color: #eb5e28;"></i> ${property.district}</strong>
                </div>
              ` : ''}

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

              ${property.furnishing && property.furnishing !== 'Not specified' ? `
                <div>
                  <span style="font-size: 0.75rem; color: #718096; text-transform: uppercase; font-weight: 800; display: block; margin-bottom: 4px;">Furnishing</span>
                  <strong style="font-size: 1.05rem; color: #1A202C;"><i class="ri-armchair-line" style="color: #eb5e28;"></i> ${property.furnishing}</strong>
                </div>
              ` : ''}
            </div>

            <!-- POSTER / OWNER INFORMATION CARD -->
            ${(() => {
              const isPaidAd = String(property.adType || property.ad_type || property.adTier || property.listingPlan || '').toLowerCase().trim() === 'paid';
              const specialistDisplayName = isPaidAd ? (property.ownerName || 'Verified Owner') : 'Thanjai Property';
              const publicPhone = isPaidAd ? (property.ownerPhone || property.inquiryPhone || '8489996852') : (property.inquiryPhone || '8489996852');
              const cleanPublicPhone = String(publicPhone).replace(/[^0-9]/g, '');
              const formattedPhone = cleanPublicPhone.length === 10 ? `+91 ${cleanPublicPhone}` : (cleanPublicPhone.startsWith('91') && cleanPublicPhone.length === 12 ? `+${cleanPublicPhone}` : `+91 ${publicPhone}`);
              const waNumber = cleanPublicPhone.startsWith('91') && cleanPublicPhone.length === 12 ? cleanPublicPhone : (cleanPublicPhone.length === 10 ? `91${cleanPublicPhone}` : '918489996852');

              return `
                <div style="background: #FAF8F5; padding: 20px 24px; border-radius: 16px; border: 1px solid #E7E0D8; margin-bottom: 36px; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
                  <div>
                    <span style="font-size: 0.78rem; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px;">Verified Property Seller / Specialist:</span>
                    <strong style="font-size: 1.1rem; color: #1A202C;">${specialistDisplayName}</strong>
                    <div style="font-size: 0.75rem; font-weight: 700; color: ${isPaidAd ? '#38A169' : '#eb5e28'}; margin-top: 2px;">
                      ${isPaidAd ? '👑 Direct Owner Listing • 0% Brokerage' : '🛡️ Executive Real Estate Advisory Desk'}
                    </div>
                  </div>

                  <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <a href="tel:${formattedPhone.replace(/\s+/g, '')}" style="background: #ffffff; border: 1px solid #CBD5E0; color: #2D3748; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px;">
                      <i class="ri-phone-line" style="color: #eb5e28;"></i> ${isPaidAd ? `Call Owner (${formattedPhone})` : `Call Seller (${formattedPhone})`}
                    </a>
                    <a href="${isPaidAd ? `https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(specialistDisplayName)},%20I%20am%20interested%20in%20your%20property%20${encodeURIComponent(property.title)}%20(ID:%20${encodeURIComponent(property.id)})` : `https://wa.me/${waNumber}?text=Hello%20Thanjai%20Property,%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(ID:%20${encodeURIComponent(property.id)})`}" target="_blank" style="background: #25D366; color: #ffffff; border: none; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 12px rgba(37,211,102,0.25);">
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
            ${property.description ? `
              <div style="margin-bottom: 40px;">
                <h3 style="font-family: var(--font-serif); font-size: 1.4rem; font-weight: 800; margin-bottom: 14px; color: #1A202C;">Property Overview</h3>
                <p style="font-size: 1.05rem; color: #4A5568; line-height: 1.7; margin: 0; white-space: pre-line;">
                  ${property.description}
                </p>
              </div>
            ` : ''}

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

            <!-- RELATED / SIMILAR PROPERTIES SECTION -->
            ${(() => {
              const currId = String(property.id || '').trim().toLowerCase();
              const currTitle = String(property.title || '').trim().toLowerCase();
              const allProps = getPublicProperties();
              
              const otherProps = allProps.filter(p => {
                if (!p) return false;
                const pId = String(p.id || '').trim().toLowerCase();
                const pTitle = String(p.title || '').trim().toLowerCase();
                return pId !== currId && pTitle !== currTitle;
              });

              // Extract search words from current property title, description, category, and location
              const stopWords = new Set(['for', 'sale', 'in', 'near', 'the', 'a', 'an', 'and', 'at', 'with', 'to', 'of', 'on', 'is', 'new', 'tp']);
              const currWords = (property.title + ' ' + (property.description || '') + ' ' + (property.category || '') + ' ' + (property.type || '') + ' ' + (property.road || '') + ' ' + (property.taluk || '') + ' ' + (property.area || ''))
                .toLowerCase()
                .replace(/[^a-z0-9\s]/g, ' ')
                .split(/\s+/)
                .filter(w => w.length > 2 && !stopWords.has(w));
              const currWordSet = new Set(currWords);

              // Calculate relevance score for each candidate property
              const scoredProps = otherProps.map(p => {
                let score = 0;
                const pTitleLower = (p.title || '').toLowerCase();
                const pDescLower = (p.description || '').toLowerCase();
                const pCombined = (pTitleLower + ' ' + pDescLower + ' ' + (p.category || '') + ' ' + (p.type || '') + ' ' + (p.road || '') + ' ' + (p.taluk || '') + ' ' + (p.area || '')).toLowerCase();

                // 1. Same Road Corridor match
                if (property.road && property.road !== 'Other / Outside Road' && p.road && p.road === property.road) {
                  score += 35;
                }

                // 2. Same Category / Property Type match
                if (property.category && p.category && property.category.toLowerCase() === p.category.toLowerCase()) {
                  score += 30;
                }
                if (property.type && p.type && property.type.toLowerCase() === p.type.toLowerCase()) {
                  score += 25;
                }

                // 3. Keyword matches in Title & Description
                currWordSet.forEach(w => {
                  if (pTitleLower.includes(w)) {
                    score += 15;
                  } else if (pCombined.includes(w)) {
                    score += 8;
                  }
                });

                // 4. Same Taluk / Locality match
                if (property.taluk && p.taluk && property.taluk.toLowerCase() === p.taluk.toLowerCase()) {
                  score += 20;
                }
                if (property.area && p.area && (property.area.toLowerCase().includes(p.area.toLowerCase()) || p.area.toLowerCase().includes(property.area.toLowerCase()))) {
                  score += 20;
                }

                // 5. Same District match
                if (property.district && p.district && property.district.toLowerCase() === p.district.toLowerCase()) {
                  score += 10;
                }

                return { property: p, score };
              });

              // Sort by highest relevance score
              scoredProps.sort((a, b) => b.score - a.score);

              // Deduplicate and take top 6 properties
              const seenKeys = new Set();
              const relatedList = [];
              for (const item of scoredProps) {
                const p = item.property;
                const pId = String(p.id || '').trim().toLowerCase();
                const pTitle = String(p.title || '').trim().toLowerCase();
                if (pId === currId || pTitle === currTitle) continue;
                if (!seenKeys.has(pId) && !seenKeys.has(pTitle)) {
                  seenKeys.add(pId);
                  seenKeys.add(pTitle);
                  relatedList.push(p);
                }
                if (relatedList.length >= 3) break;
              }

              if (relatedList.length === 0) return '';

              return `
                <div style="margin-top: 50px;">
                  <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 12px;">
                    <div>
                      <span style="font-size: 0.8rem; font-weight: 800; color: #eb5e28; text-transform: uppercase; letter-spacing: 0.08em; display: block; margin-bottom: 4px;">EXPLORE MORE OPTIONS</span>
                      <h3 style="font-family: var(--font-serif); font-size: 1.8rem; font-weight: 800; color: #1A202C; margin: 0;">
                        Similar Properties in this Location & Category
                      </h3>
                    </div>
                    <button id="view-all-similar-btn" style="background: none; border: none; padding: 0; color: #eb5e28; font-weight: 700; font-size: 0.92rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                      View All Listings <i class="ri-arrow-right-line"></i>
                    </button>
                  </div>

                  <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px;">
                    ${relatedList.map(rel => {
                      const relImg = rel.images && rel.images[0] ? rel.images[0] : '/default-property.jpg';
                      const relLoc = rel.area || rel.location || rel.district || 'Thanjavur';
                      return `
                        <div class="property-card discover-prop-card related-prop-card" data-id="${rel.id}" style="background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.04); display: flex; flex-direction: column; transition: transform 0.2s ease, box-shadow 0.2s ease; cursor: pointer;">
                          <div style="height: 180px; position: relative; overflow: hidden;">
                            <img src="${relImg}" alt="${rel.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                            <span style="position: absolute; top: 12px; left: 12px; background: rgba(0,0,0,0.7); color: #fff; padding: 4px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
                              ${rel.categoryLabel || rel.type || 'Property'}
                            </span>
                            ${rel.road && rel.road !== 'Other / Outside Road' ? `
                              <span style="position: absolute; bottom: 10px; left: 12px; background: #eb5e28; color: #fff; padding: 3px 8px; border-radius: 4px; font-size: 0.68rem; font-weight: 700;">
                                <i class="ri-road-map-line"></i> ${rel.road}
                              </span>
                            ` : ''}
                          </div>
                          <div style="padding: 16px 18px; display: flex; flex-direction: column; flex: 1;">
                            <div style="font-size: 1.15rem; font-weight: 800; color: #eb5e28; margin-bottom: 4px;">
                              ${rel.priceFormatted || '₹ ' + (rel.price || 0).toLocaleString('en-IN')}
                            </div>
                            <h4 style="font-size: 0.98rem; font-weight: 700; color: #1A202C; margin: 0 0 6px 0; line-height: 1.35; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                              ${rel.title}
                            </h4>
                            <p style="font-size: 0.8rem; color: #718096; margin: 0 0 12px 0; display: flex; align-items: center; gap: 4px;">
                              <i class="ri-map-pin-line" style="color: #eb5e28;"></i> ${relLoc}
                            </p>
                            <div style="margin-top: auto; padding-top: 10px; border-top: 1px solid #EDF2F7; display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #4A5568; font-weight: 700;">
                              <span>${rel.size ? formatSizeDisplay(rel.size) : 'Prime Plot'}</span>
                              <span style="color: #eb5e28; display: inline-flex; align-items: center; gap: 2px;">
                                Details <i class="ri-arrow-right-s-line"></i>
                              </span>
                            </div>
                          </div>
                        </div>
                      `;
                    }).join('')}
                  </div>
                </div>
              `;
            })()}

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

  const selectedProp = discoverState.selectedPropertyId ? getPublicProperties().find(p => p.id === discoverState.selectedPropertyId) : null;

  const enquireBtn = document.getElementById('detail-enquire-btn');
  if (enquireBtn && selectedProp) {
    enquireBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPropertyModalById(selectedProp.id);
    });
  }

  // Detail Hero Carousel Prev/Next & Thumbnails
  const propImages = selectedProp && Array.isArray(selectedProp.images) ? selectedProp.images.filter(Boolean) : [];
  const propVideos = selectedProp ? extractAllVideos(selectedProp.videoUrl || selectedProp.videos) : [];
  const totalMediaCount = Math.max(1, propImages.length + propVideos.length);

  document.getElementById('detail-prev-photo-btn')?.addEventListener('click', () => {
    if (totalMediaCount > 1) {
      activeDetailPhotoIndex = (activeDetailPhotoIndex - 1 + totalMediaCount) % totalMediaCount;
      onStateUpdate(discoverState);
    }
  });

  document.getElementById('detail-next-photo-btn')?.addEventListener('click', () => {
    if (totalMediaCount > 1) {
      activeDetailPhotoIndex = (activeDetailPhotoIndex + 1) % totalMediaCount;
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

  // View All Listings in Similar Section
  document.getElementById('view-all-similar-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (onPropertySelect) {
      activeDetailPhotoIndex = 0;
      window.scrollTo({ top: 0, behavior: 'smooth' });
      onPropertySelect(null);
    }
  });

  // Property Cards & Related Property Cards Click
  document.querySelectorAll('.discover-prop-card, .related-prop-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const id = card.dataset.id;
      if (id && onPropertySelect) {
        activeDetailPhotoIndex = 0;
        window.scrollTo({ top: 0, behavior: 'smooth' });
        onPropertySelect(id);
      }
    });
  });
}
