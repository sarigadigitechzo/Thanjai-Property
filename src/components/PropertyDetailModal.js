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
              ${(() => {
                const isPaidAd = String(property.adType || property.ad_type || property.adTier || property.listingPlan || '').toLowerCase().trim() === 'paid';
                const ownerDisplayName = isPaidAd ? (property.ownerName || 'Verified Owner') : 'Thanjai Property';
                const ownerDisplayPhone = isPaidAd ? (property.ownerPhone || '8489996852') : '8489996852';
                const formattedOwnerPhone = ownerDisplayPhone.startsWith('+91') ? ownerDisplayPhone : `+91 ${ownerDisplayPhone}`;
                const rawOwnerPhoneClean = ownerDisplayPhone.replace(/[^0-9]/g, '');
                const ownerWaNumber = rawOwnerPhoneClean.startsWith('91') && rawOwnerPhoneClean.length === 12 ? rawOwnerPhoneClean : (rawOwnerPhoneClean.length === 10 ? `91${rawOwnerPhoneClean}` : '918489996852');

                if (isPaidAd) {
                  return `
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--color-border);">
                      <div style="width: 54px; height: 54px; border-radius: 50%; background: #EBF8FF; color: #3182CE; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; border: 2px solid #3182CE; flex-shrink: 0;">
                        <i class="ri-user-star-fill"></i>
                      </div>
                      <div>
                        <h4 style="font-size: 1rem; font-weight: 800; color: var(--color-brown);">${ownerDisplayName}</h4>
                        <div style="font-size: 0.75rem; color: #38A169; font-weight: 700;">👑 Direct Owner Listing • 0% Brokerage</div>
                      </div>
                    </div>

                    <h4 style="font-size: 1.125rem; font-weight: 800; color: var(--color-brown); margin-bottom: 16px;">Contact Direct Owner</h4>

                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
                      <a href="tel:${formattedOwnerPhone}" class="btn btn-brown" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="ri-phone-fill"></i> CALL OWNER (${ownerDisplayPhone})
                      </a>
                      <a href="https://wa.me/${ownerWaNumber}?text=Hi%20${encodeURIComponent(ownerDisplayName)},%20I%20am%20interested%20in%20your%20property%20${encodeURIComponent(property.title)}%20(ID:%20${property.id})" target="_blank" class="btn btn-primary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px; background: #25D366; border-color: #25D366;">
                        <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i> WHATSAPP OWNER
                      </a>
                      <button class="btn btn-outline-dark" id="modal-schedule-btn" style="width: 100%;">
                        <i class="ri-calendar-line"></i> SCHEDULE SITE VISIT
                      </button>
                    </div>
                  `;
                } else {
                  return `
                    <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid var(--color-border);">
                      <div style="width: 54px; height: 54px; border-radius: 50%; background: #2A1808; color: #eb5e28; display: flex; align-items: center; justify-content: center; font-size: 1.5rem; font-weight: 800; border: 2px solid #eb5e28; flex-shrink: 0;">
                        TP
                      </div>
                      <div>
                        <h4 style="font-size: 1rem; font-weight: 800; color: var(--color-brown);">Thanjai Property</h4>
                        <div style="font-size: 0.75rem; color: var(--color-orange); font-weight: 700;">Executive Real Estate Advisory</div>
                      </div>
                    </div>

                    <h4 style="font-size: 1.125rem; font-weight: 800; color: var(--color-brown); margin-bottom: 16px;">Interested in this Property?</h4>

                    <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 24px;">
                      <a href="tel:+918489996852" class="btn btn-brown" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="ri-phone-fill"></i> CALL DESK (+91 84899 96852)
                      </a>
                      <a href="https://wa.me/918489996852?text=Hi%20Thanjai%20Property,%20I%20am%20interested%20in%20${encodeURIComponent(property.title)}%20(ID:%20${property.id})" target="_blank" class="btn btn-primary" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i> WHATSAPP CHAT
                      </a>
                      <a href="mailto:vijayaraghavan@thanjaiproperty.com?subject=Inquiry%20for%20${encodeURIComponent(property.title)}" class="btn btn-outline-dark" style="width: 100%; display: inline-flex; align-items: center; justify-content: center; gap: 8px;">
                        <i class="ri-mail-line" style="color: #eb5e28;"></i> EMAIL ADVISORY DESK
                      </a>
                      <button class="btn btn-outline-dark" id="modal-schedule-btn" style="width: 100%;">
                        <i class="ri-calendar-line"></i> SCHEDULE SITE VISIT
                      </button>
                    </div>
                  `;
                }
              })()}

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
