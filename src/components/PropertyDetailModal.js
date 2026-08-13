import { isFavorite, toggleFavorite } from '../utils/favorites.js';
import { showToast } from '../utils/toast.js';

export function renderPropertyDetailModal(property) {
  if (!property) return '';

  const saved = isFavorite(property.id);

  return `
    <div class="modal-overlay active" id="property-details-modal-overlay">
      <div class="property-modal-card">
        <!-- Close Button -->
        <button class="modal-close-btn" id="close-prop-modal-btn" title="Close Modal">
          <i class="ri-close-line"></i>
        </button>

        <!-- Cinematic Gallery -->
        <div class="modal-gallery-container">
          <div class="gallery-main-img-wrap">
            <img src="${property.images[0]}" alt="${property.title}" class="gallery-main-img" id="modal-main-gallery-img" />
            <div style="position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px;">
              <span class="badge badge-dark">
                <i class="ri-image-line"></i> ${property.images.length} High-Res Photos
              </span>
              <span class="badge badge-orange">${property.tag}</span>
            </div>

            <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px;">
              <button class="card-favorite-btn ${saved ? 'saved' : ''}" id="modal-save-fav-btn" title="Bookmark Property">
                <i class="${saved ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
              </button>
              <button class="card-favorite-btn" id="modal-share-btn" title="Share Property">
                <i class="ri-share-line"></i>
              </button>
            </div>
          </div>

          <div class="gallery-thumbs-col">
            ${property.images.slice(1, 3).map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i+1}" class="gallery-thumb-img modal-thumb" data-src="${img}" />
            `).join('')}
          </div>
        </div>

        <!-- Modal Content Layout -->
        <div class="modal-body-layout">
          <!-- Main Left Details -->
          <div>
            <!-- Title & Price Header -->
            <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; flex-wrap: wrap;">
              <div>
                <div style="font-size: 0.8125rem; font-weight: 800; letter-spacing: 0.1em; text-transform: uppercase; color: var(--color-orange); margin-bottom: 4px;">
                  PROPERTY ID: ${property.id} • ${property.categoryLabel}
                </div>
                <h2 class="font-serif" style="font-size: 2.25rem; color: var(--color-brown); line-height: 1.2;">
                  ${property.title}
                </h2>
                <div style="display: flex; align-items: center; gap: 8px; font-size: 0.9375rem; color: var(--color-text-muted); margin-top: 8px;">
                  <i class="ri-map-pin-2-line" style="color: var(--color-orange);"></i>
                  <span>${property.area}, Tamil Nadu</span>
                </div>
              </div>

              <div style="text-align: right;">
                <div class="font-serif" style="font-size: 2.5rem; color: var(--color-brown); font-weight: 700;">
                  ${property.priceFormatted}
                </div>
                <div style="font-size: 0.8125rem; color: var(--color-text-muted);">${property.priceSqft}</div>
              </div>
            </div>

            <!-- Section 14: Editorial Property Facts -->
            <div class="facts-editorial-grid">
              <div class="fact-block">
                <div class="fact-value">${property.size}</div>
                <div class="fact-label">BUILT-UP AREA</div>
              </div>
              <div class="fact-block">
                <div class="fact-value">${property.bedrooms || '—'}</div>
                <div class="fact-label">BEDROOMS</div>
              </div>
              <div class="fact-block">
                <div class="fact-value">${property.bathrooms || '—'}</div>
                <div class="fact-label">BATHROOMS</div>
              </div>
              <div class="fact-block">
                <div class="fact-value">${property.facing}</div>
                <div class="fact-label">FACING</div>
              </div>
            </div>

            <!-- Description -->
            <div style="margin-bottom: 40px;">
              <h3 class="font-serif" style="font-size: 1.5rem; color: var(--color-brown); margin-bottom: 12px;">Property Overview</h3>
              <p style="color: var(--color-text-main); font-size: 1rem; line-height: 1.7; white-space: pre-line;">
                ${property.description}
              </p>
            </div>

            <!-- Key Specifications Table -->
            <div style="margin-bottom: 40px;">
              <h3 class="font-serif" style="font-size: 1.5rem; color: var(--color-brown); margin-bottom: 16px;">Key Technical Specifications</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; background: var(--color-cream-light); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                ${property.specs.map(s => `
                  <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">${s.label}</span>
                    <span style="font-size: 0.9375rem; font-weight: 700; color: var(--color-brown);">${s.value}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Floor Plan Section -->
            <div style="margin-bottom: 32px;">
              <h3 class="font-serif" style="font-size: 1.5rem; color: var(--color-brown); margin-bottom: 16px;">Architectural Layout</h3>
              <div style="border-radius: var(--radius-md); overflow: hidden; border: 1px solid var(--color-border);">
                <img src="${property.floorPlan}" alt="Floor Plan" style="width: 100%; height: 260px; object-fit: cover;" />
              </div>
            </div>
          </div>

          <!-- Right Sticky Enquiry Panel (Section 15) -->
          <div>
            <div class="sticky-enquiry-card">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--color-border);">
                <img src="${property.agent.image}" alt="${property.agent.name}" style="width: 54px; height: 54px; border-radius: 50%; object-fit: cover;" />
                <div>
                  <h4 style="font-size: 1rem; font-weight: 800; color: var(--color-brown);">${property.agent.name}</h4>
                  <div style="font-size: 0.75rem; color: var(--color-orange); font-weight: 700;">${property.agent.title}</div>
                </div>
              </div>

              <h4 style="font-size: 1.125rem; font-weight: 800; color: var(--color-brown); margin-bottom: 16px;">Interested in this Property?</h4>

              <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                <a href="tel:${property.agent.phone}" class="btn btn-brown" style="width: 100%;">
                  <i class="ri-phone-fill"></i> CALL AGENT NOW
                </a>
                <a href="https://wa.me/${property.agent.whatsapp}?text=Hi%20${encodeURIComponent(property.agent.name)},%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(ID:%20${property.id})" target="_blank" class="btn btn-primary" style="width: 100%;">
                  <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i> WHATSAPP CHAT
                </a>
                <button class="btn btn-outline-dark" id="modal-schedule-btn" style="width: 100%;">
                  <i class="ri-calendar-line"></i> SCHEDULE VISIT
                </button>
              </div>

              <!-- Instant Direct Enquiry Form -->
              <form id="modal-enquiry-form" onsubmit="return false;" style="display: flex; flex-direction: column; gap: 12px; padding-top: 20px; border-top: 1px dashed var(--color-border);">
                <span style="font-size: 0.8125rem; font-weight: 800; color: var(--color-brown);">SEND QUICK INQUIRY</span>
                <input type="text" placeholder="Your Full Name" required class="search-input" style="background: var(--color-white); padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);" />
                <input type="tel" placeholder="Phone Number (+91)" required class="search-input" style="background: var(--color-white); padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);" />
                <button type="submit" class="btn btn-brown" style="padding: 10px; font-size: 0.875rem;">Submit Enquiry</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

export function initPropertyDetailModalListeners(property, onClose) {
  const overlay = document.getElementById('property-details-modal-overlay');
  const closeBtn = document.getElementById('close-prop-modal-btn');
  
  closeBtn?.addEventListener('click', () => {
    overlay?.classList.remove('active');
    setTimeout(onClose, 300);
  });

  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      setTimeout(onClose, 300);
    }
  });

  // Thumbnail Click to switch main gallery image
  document.querySelectorAll('.modal-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const mainImg = document.getElementById('modal-main-gallery-img');
      if (mainImg) mainImg.src = thumb.dataset.src;
    });
  });

  // Bookmark button
  document.getElementById('modal-save-fav-btn')?.addEventListener('click', () => {
    const isNowSaved = toggleFavorite(property.id);
    showToast(isNowSaved ? 'Property saved to collection!' : 'Property removed from collection', 'ri-heart-fill');
  });

  // Share button
  document.getElementById('modal-share-btn')?.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Property link copied to clipboard!', 'ri-file-copy-line');
    }
  });

  // Schedule button
  document.getElementById('modal-schedule-btn')?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('openScheduleModal', { detail: { propertyId: property.id, propertyTitle: property.title } }));
  });

  // Quick enquiry submit
  document.getElementById('modal-enquiry-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Enquiry received! Our advisor will call you within 15 minutes.', 'ri-checkbox-circle-fill');
    overlay?.classList.remove('active');
    setTimeout(onClose, 300);
  });
}
