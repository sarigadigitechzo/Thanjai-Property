import { LOCATIONS } from '../data/locations.js';

let leafletExplorerMap = null;
let leafletExplorerMarkers = [];
let activeLocationId = 'medical_college_road';

export function renderLocationExplorer() {
  const activeLoc = LOCATIONS.find(l => l.id === activeLocationId) || LOCATIONS[0];

  return `
    <section class="locations-section" id="locations" style="padding: 50px 0 60px; background: #faf8f5;">
      <div class="container">
        
        <!-- Section Header -->
        <div style="margin-bottom: 22px;">
          <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; font-size: 0.8rem; letter-spacing: 0.12em; text-transform: uppercase;">
            EXPLORE PRIME LOCATIONS
          </span>
          <h2 class="heading-section" style="margin-top: 4px; font-size: clamp(1.8rem, 3vw, 2.4rem); color: #1a1a1a; font-family: var(--font-serif);">
            Find Properties in <span style="color: #eb5e28;">Thanjavur</span>
          </h2>
          <p style="font-size: 0.92rem; color: #5a6578; margin-top: 4px; max-width: 650px;">
            Explore the most sought-after locations in and around Thanjavur.
          </p>
        </div>

        <!-- Category Filter Pills -->
        <div style="display: flex; gap: 10px; overflow-x: auto; padding-bottom: 6px; margin-bottom: 20px; scrollbar-width: none;" id="corridor-filter-pills">
          <button class="corridor-pill-btn active" data-category="all" style="
            background: #eb5e28; color: #ffffff; border: 1px solid #eb5e28; padding: 8px 18px; border-radius: 30px;
            font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.25s ease; box-shadow: 0 4px 12px rgba(235,94,40,0.25);
          ">All Locations</button>

          <button class="corridor-pill-btn" data-category="Arterial" style="
            background: #ffffff; color: #4a5568; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 30px;
            font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.25s ease;
          ">Arterial Roads</button>

          <button class="corridor-pill-btn" data-category="Residential" style="
            background: #ffffff; color: #4a5568; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 30px;
            font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.25s ease;
          ">Residential Roads</button>

          <button class="corridor-pill-btn" data-category="Bypass" style="
            background: #ffffff; color: #4a5568; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 30px;
            font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.25s ease;
          ">Bypass Roads</button>

          <button class="corridor-pill-btn" data-category="Suburban" style="
            background: #ffffff; color: #4a5568; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 30px;
            font-size: 0.85rem; font-weight: 700; cursor: pointer; white-space: nowrap; transition: all 0.25s ease;
          ">Heritage & Suburban</button>
        </div>

        <!-- Main Explorer Split Layout (Exact Same Height) -->
        <div class="location-explorer-layout" style="display: flex; gap: 24px; flex-wrap: wrap; align-items: stretch;">
          
          <!-- LEFT: REAL LEAFLET MAP -->
          <div class="location-map-card" style="flex: 1 1 480px; height: 550px; background: #e2e8f0; border-radius: 22px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.06); position: relative; box-sizing: border-box;">
            <div id="thanjavur-explorer-map" style="width: 100%; height: 100%; z-index: 1;"></div>
            
            <!-- Re-center Control Button -->
            <button id="explorer-recenter-btn" style="
              position: absolute; bottom: 18px; left: 18px; z-index: 400;
              background: #ffffff; color: #1a1a1a; border: 1px solid #cbd5e0;
              padding: 8px 15px; border-radius: 24px; font-size: 0.82rem; font-weight: 700;
              cursor: pointer; box-shadow: 0 4px 14px rgba(0,0,0,0.12);
              display: inline-flex; align-items: center; gap: 6px; transition: all 0.25s ease;
            ">
              <i class="ri-focus-3-line" style="color: #eb5e28; font-size: 1rem;"></i>
              <span>Re-center</span>
            </button>
          </div>

          <!-- RIGHT: SELECTED LOCATION INFORMATION PANEL -->
          <div class="location-panel-card" style="flex: 1 1 440px; height: 550px; max-height: 550px; background: #ffffff; border-radius: 22px; padding: 22px 24px; border: 1px solid #e2e8f0; box-shadow: 0 10px 30px rgba(0,0,0,0.06); display: flex; flex-direction: column; justify-content: space-between; box-sizing: border-box; overflow-y: auto;" id="selected-location-panel">
            ${renderLocationPanelContent(activeLoc)}
          </div>

        </div>

      </div>
    </section>
  `;
}

function renderLocationPanelContent(loc) {
  if (!loc) return '';
  const matchProps = loc.matchingProperties || [];
  const hasProps = matchProps.length > 0;
  const activeListingsCount = matchProps.length;

  return `
    <div class="panel-fade-in" style="display: flex; flex-direction: column; justify-content: space-between; height: 100%; gap: 12px;">
      
      <!-- Top Badges Row -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 6px;">
        <div style="display: flex; align-items: center; gap: 6px;">
          <span style="background: rgba(235,94,40,0.12); color: #eb5e28; font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.04em;">
            ${loc.zone} ROAD
          </span>
          <span style="background: #f7fafc; color: #4a5568; border: 1px solid #e2e8f0; font-size: 0.72rem; font-weight: 800; padding: 3px 8px; border-radius: 20px;">
            PIN #${loc.markerId}
          </span>
        </div>
        <span style="font-size: 0.78rem; font-weight: 700; color: ${hasProps ? '#2f855a' : '#718096'}; display: inline-flex; align-items: center; gap: 5px;">
          <span style="width: 7px; height: 7px; border-radius: 50%; background: ${hasProps ? '#38a169' : '#a0aec0'}; display: inline-block;"></span>
          ${hasProps ? `${activeListingsCount} Active Listings` : 'Upcoming Corridor'}
        </span>
      </div>

      <!-- Real Location Photograph Banner (Large 220px) -->
      <div style="width: 100%; height: 210px; border-radius: 16px; overflow: hidden; position: relative; background: #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.06); flex-shrink: 0;">
        <img 
          src="${loc.image}" 
          alt="${loc.imageAlt || loc.name}" 
          class="location-hero-photo"
          style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;"
          onerror="this.src='https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80';"
        />
      </div>

      <!-- Location Heading & Subtitle (Clean without description/metrics) -->
      <div>
        <h3 style="font-family: var(--font-serif); font-size: 1.55rem; font-weight: 700; color: #1a1a1a; margin: 0 0 3px 0; line-height: 1.2;">
          ${loc.name}
        </h3>
        <div style="font-size: 0.85rem; font-weight: 600; color: #718096; display: flex; align-items: center; gap: 4px;">
          <i class="ri-map-pin-line" style="color: #eb5e28;"></i>
          <span>${loc.districtLabel || 'Thanjavur'}, Tamil Nadu</span>
        </div>
      </div>

      <!-- Available Listings or Clean No-Properties State -->
      <div>
        ${hasProps ? `
          <!-- REAL AVAILABLE PROPERTIES -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span style="font-size: 0.7rem; font-weight: 800; color: #718096; text-transform: uppercase; letter-spacing: 0.04em;">AVAILABLE LISTINGS PREVIEW</span>
            <a href="javascript:void(0)" class="explorer-view-all-link" data-location="${loc.name}" style="font-size: 0.76rem; font-weight: 800; color: #eb5e28; text-decoration: none;">
              View All (${activeListingsCount})
            </a>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(85px, 1fr)); gap: 8px; margin-bottom: 12px;">
            ${matchProps.slice(0, 4).map(p => `
              <div class="explorer-prop-thumb-card" data-prop-id="${p.id}" data-location="${loc.name}" style="
                background: #ffffff; border-radius: 8px; overflow: hidden; border: 1px solid #e2e8f0; cursor: pointer;
                transition: all 0.2s ease; box-shadow: 0 2px 5px rgba(0,0,0,0.03);
              " title="${p.title}">
                <div style="width: 100%; height: 46px; overflow: hidden;">
                  <img src="${p.images[0]}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                </div>
                <div style="padding: 4px 6px;">
                  <div style="font-size: 0.65rem; font-weight: 700; color: #2d3748; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.title}</div>
                  <div style="font-size: 0.65rem; font-weight: 800; color: #eb5e28; margin-top: 1px;">${p.priceFormatted}</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button class="btn btn-primary explorer-view-props-btn" data-location="${loc.name}" style="
              flex: 2 1 180px; padding: 11px 16px; border-radius: 10px; font-size: 0.88rem; font-weight: 700;
              display: inline-flex; align-items: center; justify-content: center; gap: 6px;
              background: #eb5e28; color: #ffffff; border: none; cursor: pointer; box-shadow: 0 4px 12px rgba(235,94,40,0.22);
            ">
              <span>View Properties in ${loc.name}</span>
              <i class="ri-arrow-right-line"></i>
            </button>

            <button class="explorer-directions-btn" data-lat="${loc.latitude}" data-lng="${loc.longitude}" style="
              flex: 1 1 120px; padding: 11px 14px; border-radius: 10px; font-size: 0.88rem; font-weight: 700;
              display: inline-flex; align-items: center; justify-content: center; gap: 5px;
              background: #ffffff; color: #2d3748; border: 1px solid #cbd5e0; cursor: pointer; transition: all 0.2s ease;
            ">
              <i class="ri-navigation-line" style="color: #eb5e28;"></i>
              <span>Get Directions</span>
            </button>
          </div>
        ` : `
          <!-- ACCURATE NO PROPERTY STATE -->
          <div style="background: #faf8f5; border-radius: 14px; padding: 16px 14px; border: 1px dashed #cbd5e0; text-align: center;">
            <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(235,94,40,0.1); color: #eb5e28; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; margin: 0 auto 6px auto;">
              <i class="ri-map-pin-time-line"></i>
            </div>
            <h4 style="font-size: 0.95rem; font-weight: 800; color: #1a1a1a; margin: 0 0 3px 0;">No Active Properties Right Now</h4>
            <p style="font-size: 0.78rem; color: #666; line-height: 1.4; margin: 0 0 12px 0;">
              We are currently preparing new verified Patta layouts in <strong>${loc.name}</strong>. Want to be notified when listings go live?
            </p>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="explorer-notify-btn" data-location="${loc.name}" style="flex: 1; background: #eb5e28; color: #ffffff; border: none; padding: 9px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px; box-shadow: 0 4px 10px rgba(235,94,40,0.2);">
                <i class="ri-notification-3-line"></i> Notify Me
              </button>
              <button class="explorer-talk-btn" data-location="${loc.name}" style="flex: 1; background: #ffffff; color: #2d3748; border: 1px solid #cbd5e0; padding: 9px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px;">
                <i class="ri-customer-service-2-line"></i> Talk to Us
              </button>
              <button class="explorer-directions-btn" data-lat="${loc.latitude}" data-lng="${loc.longitude}" style="flex: 1; background: #ffffff; color: #2d3748; border: 1px solid #cbd5e0; padding: 9px 10px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 5px;">
                <i class="ri-navigation-line" style="color: #eb5e28;"></i> Directions
              </button>
            </div>
          </div>
        `}
      </div>

    </div>
  `;
}

export function initLocationExplorerListeners(onLocationSelect) {
  initLeafletMap(onLocationSelect);

  // Filter Pill Listeners
  const pills = document.querySelectorAll('.corridor-pill-btn');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => {
        p.style.background = '#ffffff';
        p.style.color = '#4a5568';
        p.style.border = '1px solid #e2e8f0';
        p.style.boxShadow = 'none';
        p.classList.remove('active');
      });
      pill.style.background = '#eb5e28';
      pill.style.color = '#ffffff';
      pill.style.border = '1px solid #eb5e28';
      pill.style.boxShadow = '0 4px 12px rgba(235,94,40,0.25)';
      pill.classList.add('active');
      filterMapMarkers(pill.dataset.category, onLocationSelect);
    });
  });

  // Re-center button listener
  document.getElementById('explorer-recenter-btn')?.addEventListener('click', () => {
    recenterToThanjavurCity();
  });

  // Re-render panel if image updated in admin dashboard
  window.addEventListener('siteImagesUpdated', () => {
    const loc = LOCATIONS.find(l => l.id === activeLocationId);
    const panel = document.getElementById('selected-location-panel');
    if (panel && loc) {
      panel.innerHTML = renderLocationPanelContent(loc);
      attachPanelActionListeners(onLocationSelect);
    }
  });

  attachPanelActionListeners(onLocationSelect);
}

function initLeafletMap(onLocationSelect) {
  const mapContainer = document.getElementById('thanjavur-explorer-map');
  if (!mapContainer || typeof L === 'undefined') return;

  if (leafletExplorerMap) {
    leafletExplorerMap.remove();
    leafletExplorerMap = null;
  }
  leafletExplorerMarkers = [];

  // Initialize centered on Thanjavur city
  leafletExplorerMap = L.map('thanjavur-explorer-map', {
    zoomControl: true,
    scrollWheelZoom: false,
    center: [10.765, 79.13],
    zoom: 13
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  }).addTo(leafletExplorerMap);

  LOCATIONS.forEach(loc => {
    const isSelected = loc.id === activeLocationId;

    const customIcon = L.divIcon({
      className: 'custom-map-pin-wrapper',
      html: `
        <div class="clean-map-marker ${isSelected ? 'active-marker' : ''}" data-id="${loc.id}" style="
          display: inline-flex; align-items: center; gap: 5px;
          background: ${isSelected ? '#eb5e28' : '#ffffff'};
          color: ${isSelected ? '#ffffff' : '#1a1a1a'};
          padding: 3px 8px 3px 5px; border-radius: 20px;
          border: 1px solid ${isSelected ? '#eb5e28' : '#d2d6dc'};
          box-shadow: ${isSelected ? '0 6px 16px rgba(235,94,40,0.45)' : '0 2px 6px rgba(0,0,0,0.14)'};
          cursor: pointer; transition: all 0.25s ease; white-space: nowrap; font-family: var(--font-sans, sans-serif);
        ">
          <span style="
            width: 20px; height: 20px; border-radius: 50%;
            background: ${isSelected ? '#ffffff' : '#e53e3e'};
            color: ${isSelected ? '#eb5e28' : '#ffffff'};
            font-size: 0.7rem; font-weight: 800; display: inline-flex;
            align-items: center; justify-content: center; flex-shrink: 0;
          ">${loc.markerId}</span>
          <span style="font-size: 0.72rem; font-weight: 700; letter-spacing: -0.01em;">${loc.name}</span>
        </div>
      `,
      iconSize: [110, 28],
      iconAnchor: [55, 14]
    });

    const marker = L.marker([loc.latitude, loc.longitude], { icon: customIcon, zIndexOffset: isSelected ? 1000 : 100 }).addTo(leafletExplorerMap);
    
    marker.on('click', () => selectLocation(loc.id, onLocationSelect));
    leafletExplorerMarkers.push({ id: loc.id, category: loc.category, marker, loc });
  });

  // Initial focus: fit only the primary 9 Thanjavur city locations with generous padding to prevent text clipping
  recenterToThanjavurCity();
}

function recenterToThanjavurCity() {
  if (!leafletExplorerMap) return;
  const primaryMarkers = leafletExplorerMarkers
    .filter(m => !m.loc.isOuterLocation)
    .map(m => m.marker);

  if (primaryMarkers.length > 0) {
    const group = L.featureGroup(primaryMarkers);
    leafletExplorerMap.fitBounds(group.getBounds(), { padding: [70, 70], maxZoom: 14, animate: true, duration: 1.0 });
  } else {
    leafletExplorerMap.setView([10.765, 79.13], 13);
  }
}

function selectLocation(locId, onLocationSelect) {
  activeLocationId = locId;
  const loc = LOCATIONS.find(l => l.id === locId);
  if (!loc) return;

  // Smoothly glide map to selected location
  if (leafletExplorerMap) {
    leafletExplorerMap.flyTo([loc.latitude, loc.longitude], loc.zoom || 14, {
      animate: true,
      duration: 1.2
    });
  }

  // Update Right Panel Content
  const panel = document.getElementById('selected-location-panel');
  if (panel) {
    panel.innerHTML = renderLocationPanelContent(loc);
    attachPanelActionListeners(onLocationSelect);
  }

  // Update Pin Highlighting
  leafletExplorerMarkers.forEach(m => {
    const isSel = m.id === locId;
    m.marker.setZIndexOffset(isSel ? 1000 : 100);

    const el = document.querySelector(`.clean-map-marker[data-id="${m.id}"]`);
    if (el) {
      el.style.background = isSel ? '#eb5e28' : '#ffffff';
      el.style.color = isSel ? '#ffffff' : '#1a1a1a';
      el.style.borderColor = isSel ? '#eb5e28' : '#d2d6dc';
      el.style.boxShadow = isSel ? '0 6px 16px rgba(235,94,40,0.45)' : '0 2px 6px rgba(0,0,0,0.14)';
      
      const badge = el.querySelector('span:first-child');
      if (badge) {
        badge.style.background = isSel ? '#ffffff' : '#e53e3e';
        badge.style.color = isSel ? '#eb5e28' : '#ffffff';
      }
    }
  });
}

function filterMapMarkers(category, onLocationSelect) {
  let visibleMarkers = [];
  let currentActiveStillVisible = false;
  let firstMatch = null;

  leafletExplorerMarkers.forEach(m => {
    const matches =
      category === 'all' ||
      m.category === category ||
      (category === 'Suburban' && (m.category === 'Suburban' || m.loc.zone === 'Heritage' || m.loc.category === 'Heritage'));

    if (matches) {
      if (!leafletExplorerMap.hasLayer(m.marker)) m.marker.addTo(leafletExplorerMap);
      visibleMarkers.push(m);
      if (m.id === activeLocationId) {
        currentActiveStillVisible = true;
      }
      if (!firstMatch) firstMatch = m.loc;
    } else {
      if (leafletExplorerMap.hasLayer(m.marker)) leafletExplorerMap.removeLayer(m.marker);
    }
  });

  if (leafletExplorerMap && visibleMarkers.length > 0) {
    if (category === 'all') {
      recenterToThanjavurCity();
    } else {
      const group = L.featureGroup(visibleMarkers.map(v => v.marker));
      leafletExplorerMap.fitBounds(group.getBounds(), { padding: [60, 60], maxZoom: 14, animate: true, duration: 1.0 });
    }
  }

  // If a specific category filter is clicked and active location is not in it, switch to first item in category
  if (category !== 'all') {
    if (!currentActiveStillVisible && firstMatch) {
      selectLocation(firstMatch.id, onLocationSelect);
    }
  }
}

function attachPanelActionListeners(onLocationSelect) {
  const panel = document.getElementById('selected-location-panel');
  if (!panel) return;

  // View Properties Button
  panel.querySelectorAll('.explorer-view-props-btn, .explorer-view-all-link').forEach(btn => {
    btn.addEventListener('click', e => {
      const locationName = e.currentTarget.dataset.location;
      if (locationName && onLocationSelect) {
        onLocationSelect(locationName);
        document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Get Directions Button
  panel.querySelectorAll('.explorer-directions-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      const lat = e.currentTarget.dataset.lat;
      const lng = e.currentTarget.dataset.lng;
      if (lat && lng) {
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
      }
    });
  });

  // Notify Me Button
  panel.querySelector('.explorer-notify-btn')?.addEventListener('click', e => {
    const locName = e.currentTarget.dataset.location;
    window.dispatchEvent(new CustomEvent('openScheduleModal', { detail: { location: locName, note: `Notify me when properties go live in ${locName}` } }));
  });

  // Talk to Us Button
  panel.querySelector('.explorer-talk-btn')?.addEventListener('click', () => {
    window.location.href = '#contact-us';
  });

  // Thumbnail cards click
  panel.querySelectorAll('.explorer-prop-thumb-card').forEach(card => {
    card.addEventListener('click', e => {
      const locName = e.currentTarget.dataset.location;
      if (onLocationSelect) {
        onLocationSelect(locName || 'Thanjavur');
        document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
