import { isFavorite, toggleFavorite } from '../utils/favorites.js';
import { showToast } from '../utils/toast.js';
import { fetchFromAPI } from '../utils/api.js';
import { sendWhatsAppMessage } from '../utils/whatsapp.js';
import { formatPropertySize, formatLocationDisplay, parsePropertyVideos } from '../utils/propertiesStore.js';

export function renderPropertyDetailModal(property) {
  if (!property) return '';

  const saved = isFavorite(property.id);
  const formattedSize = formatPropertySize(property.size);

  // Assemble dynamic technical specs
  const specsList = Array.isArray(property.specs) && property.specs.length > 0 ? [...property.specs] : [];
  if (!specsList.some(s => s.label.toLowerCase() === 'area') && formattedSize) {
    specsList.unshift({ label: 'Area', value: formattedSize });
  }
  if (!specsList.some(s => s.label.toLowerCase() === 'facing') && property.facing) {
    specsList.push({ label: 'Facing', value: property.facing });
  }
  if (property.furnishing && property.furnishing !== 'Not specified') {
    specsList.push({ label: 'Furnishing', value: property.furnishing });
  }
  if (property.floor) {
    specsList.push({ label: 'Floor', value: property.floor });
  }
  if (property.district) {
    specsList.push({ label: 'District', value: property.district });
  }

  const rawImgs = Array.isArray(property.images) ? property.images.filter(Boolean) : [];
  const uniqueImgs = [...new Set(rawImgs)];
  const images = uniqueImgs.length > 0 ? uniqueImgs : ['/default-property.jpg'];
  const videoList = parsePropertyVideos(property.videoUrl);

  return `
    <div class="modal-overlay active" id="property-details-modal-overlay">
      <div class="property-modal-card">
        <!-- Close Button -->
        <button class="modal-close-btn" id="close-prop-modal-btn" title="Close Modal">
          <i class="ri-close-line"></i>
        </button>

        <!-- Cinematic Gallery -->
        <div class="modal-gallery-container">
          <div class="gallery-main-img-wrap" id="modal-gallery-media-viewport" style="position: relative;">
            <img src="${images[0]}" alt="${property.title}" class="gallery-main-img" id="modal-main-gallery-img" />
            <div style="position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px;">
              <span class="badge badge-dark">
                <i class="ri-image-line"></i> ${images.length} High-Res Photos
              </span>
              <span class="badge badge-orange">${property.tag || property.categoryLabel}</span>
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
            ${images.slice(0, 4).map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i+1}" class="gallery-thumb-img modal-thumb" data-type="image" data-src="${img}" />
            `).join('')}
            ${videoList.map((vUrl, vIdx) => `
              <div class="gallery-thumb-img modal-thumb" data-type="video" data-src="${vUrl}" style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: #1a202c; color: #fff; cursor: pointer; border-radius: 8px;">
                <i class="ri-play-circle-fill" style="color: #eb5e28; font-size: 1.5rem;"></i>
                <span style="font-size: 0.65rem; font-weight: 800;">${videoList.length > 1 ? `VIDEO ${vIdx + 1}` : 'VIDEO'}</span>
              </div>
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
                  <a href="${property.latitude && property.longitude ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.latitude)},${encodeURIComponent(property.longitude)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([property.location, property.district, 'Tamil Nadu'].filter(Boolean).join(', '))}`}" target="_blank" rel="noopener noreferrer" style="color: var(--color-text-muted); text-decoration: none; display: inline-flex; align-items: center; gap: 6px; transition: color 0.2s ease;" onmouseover="this.style.color='var(--color-orange)'" onmouseout="this.style.color='var(--color-text-muted)'" title="Open Location on Google Maps">
                    <i class="ri-map-pin-2-line" style="color: var(--color-orange);"></i>
                    <span>${formatLocationDisplay(property.location, property.district)}</span>
                    <i class="ri-external-link-line" style="font-size: 0.85rem; color: #a0aec0;"></i>
                  </a>
                </div>
              </div>

              <div style="text-align: right;">
                <div class="font-serif" style="font-size: 2.5rem; color: var(--color-brown); font-weight: 700;">
                  ${property.priceFormatted}
                </div>
                ${property.priceSqft ? `<div style="font-size: 0.8125rem; color: var(--color-text-muted);">${property.priceSqft}</div>` : ''}
              </div>
            </div>

            <!-- Section 14: Editorial Property Facts -->
            <div class="facts-editorial-grid">
              ${formattedSize ? `
                <div class="fact-block">
                  <div class="fact-value">${formattedSize}</div>
                  <div class="fact-label">BUILT-UP AREA</div>
                </div>
              ` : ''}
              ${property.facing ? `
                <div class="fact-block">
                  <div class="fact-value">${property.facing}</div>
                  <div class="fact-label">FACING</div>
                </div>
              ` : ''}
              ${property.bedrooms ? `
                <div class="fact-block">
                  <div class="fact-value">${property.bedrooms} BHK</div>
                  <div class="fact-label">BEDROOMS</div>
                </div>
              ` : ''}
              ${property.bathrooms ? `
                <div class="fact-block">
                  <div class="fact-value">${property.bathrooms}</div>
                  <div class="fact-label">BATHROOMS</div>
                </div>
              ` : ''}
            </div>

            <!-- Description -->
            ${property.description ? `
              <div style="margin-bottom: 40px;">
                <h3 class="font-serif" style="font-size: 1.5rem; color: var(--color-brown); margin-bottom: 12px;">Property Overview</h3>
                <p style="color: var(--color-text-main); font-size: 1rem; line-height: 1.7; white-space: pre-line;">
                  ${property.description}
                </p>
              </div>
            ` : ''}

            <!-- Key Specifications Table -->
            ${specsList.length > 0 ? `
              <div style="margin-bottom: 40px;">
                <h3 class="font-serif" style="font-size: 1.5rem; color: var(--color-brown); margin-bottom: 16px;">Key Technical Specifications</h3>
                <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; background: var(--color-cream-light); padding: 24px; border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                  ${specsList.map(s => `
                    <div style="display: flex; flex-direction: column;">
                      <span style="font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase;">${s.label}</span>
                      <span style="font-size: 0.9375rem; font-weight: 700; color: var(--color-brown);">${s.value}</span>
                    </div>
                  `).join('')}
                </div>
              </div>
            ` : ''}

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
              <form id="modal-enquiry-form" style="display: flex; flex-direction: column; gap: 12px; padding-top: 20px; border-top: 1px dashed var(--color-border);">
                <span style="font-size: 0.8125rem; font-weight: 800; color: var(--color-brown);">SEND QUICK INQUIRY</span>
                <input type="text" id="modal-enquiry-name" placeholder="Your Full Name" required class="search-input" style="background: var(--color-white); padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);" />
                <input type="tel" id="modal-enquiry-phone" placeholder="Phone Number (+91)" required maxlength="15" class="search-input" style="background: var(--color-white); padding: 10px 14px; border: 1px solid var(--color-border); border-radius: var(--radius-sm);" />
                <button type="submit" id="modal-enquiry-submit-btn" class="btn btn-brown" style="padding: 10px; font-size: 0.875rem;">Submit Enquiry</button>
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

  function getEmbedUrl(url) {
    if (!url) return '';
    const clean = url.trim();
    const ytMatch = clean.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i);
    if (ytMatch && ytMatch[1]) {
      return { type: 'iframe', url: `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0` };
    }
    if (/facebook\.com|fb\.watch|fb\.com/i.test(clean)) {
      return { type: 'iframe', url: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(clean)}&show_text=0&width=560&autoplay=1` };
    }
    if (/\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(clean) || clean.startsWith('data:video/')) {
      return { type: 'video', url: clean };
    }
    return { type: 'iframe', url: clean };
  }

  // Thumbnail Click to switch main gallery image / video
  document.querySelectorAll('.modal-thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const viewport = document.getElementById('modal-gallery-media-viewport');
      if (!viewport) return;
      const type = thumb.dataset.type || 'image';
      const src = thumb.dataset.src;

      if (type === 'image') {
        viewport.innerHTML = `
          <img src="${src}" alt="${property.title}" class="gallery-main-img" id="modal-main-gallery-img" style="width:100%; height:100%; object-fit:cover;" />
          <div style="position: absolute; bottom: 16px; left: 16px; display: flex; gap: 8px;">
            <span class="badge badge-dark">
              <i class="ri-image-line"></i> ${images.length} High-Res Photos
            </span>
            <span class="badge badge-orange">${property.tag || property.categoryLabel}</span>
          </div>
          <div style="position: absolute; top: 16px; right: 16px; display: flex; gap: 8px;">
            <button class="card-favorite-btn ${saved ? 'saved' : ''}" id="modal-save-fav-btn" title="Bookmark Property">
              <i class="${saved ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
            </button>
            <button class="card-favorite-btn" id="modal-share-btn" title="Share Property">
              <i class="ri-share-line"></i>
            </button>
          </div>
        `;
      } else {
        const vInfo = getEmbedUrl(src);
        viewport.innerHTML = `
          <div style="width:100%; height:100%; background:#000; display:flex; align-items:center; justify-content:center;">
            ${vInfo.type === 'video' ? `
              <video src="${vInfo.url}" controls autoplay style="width:100%; height:100%; object-fit:contain;"></video>
            ` : `
              <iframe src="${vInfo.url}" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen style="width:100%; height:100%; border:0;"></iframe>
            `}
          </div>
          <div style="position: absolute; top: 16px; left: 16px;">
            <span class="badge badge-orange"><i class="ri-play-circle-fill"></i> Property Video Tour</span>
          </div>
        `;
      }
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

  // Quick enquiry submit with CRM & WhatsApp logging
  document.getElementById('modal-enquiry-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = document.getElementById('modal-enquiry-name');
    const phoneInput = document.getElementById('modal-enquiry-phone');
    const submitBtn = document.getElementById('modal-enquiry-submit-btn');

    const name = nameInput?.value.trim();
    const phone = phoneInput?.value.trim();

    if (!name || !phone) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Submitting...';
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : (phone.startsWith('+') ? phone : `+${cleanDigits}`);
    const leadId = `L-${Date.now()}`;
    const inquiryMsg = `Customer inquiry for property "${property.title}" (ID: ${property.id}) - Price: ${property.priceFormatted || '₹' + property.price}, Location: ${property.location || 'Thanjavur'}`;

    const newLead = {
      id: leadId,
      name: name,
      phone: formattedPhone,
      mobile: formattedPhone,
      email: '',
      type: property.categoryLabel || property.type || 'Residential',
      location: property.location || property.district || 'Thanjavur',
      budget: property.priceFormatted || String(property.price),
      stage: 'New Lead',
      source: 'Website Property Inquiry',
      date: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned',
      priority: 'High',
      propertyId: property.id,
      timeline: [
        {
          type: 'whatsapp_incoming',
          date: new Date().toISOString(),
          message: `📩 ${inquiryMsg}`,
          note: inquiryMsg
        },
        {
          type: 'whatsapp',
          date: new Date().toISOString(),
          message: `🤖 Auto-sent WhatsApp Welcome Intro to ${name} (${formattedPhone})`,
          note: 'Campaign: initial_contact_intro'
        }
      ]
    };

    // 1. Save to localStorage
    try {
      const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      localLeads.unshift(newLead);
      localStorage.setItem('thanjai_leads', JSON.stringify(localLeads));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    // 2. Save Lead to MySQL backend
    try {
      await fetchFromAPI('/leads', {
        method: 'POST',
        body: JSON.stringify(newLead)
      });
    } catch (err) {}

    // 3. Log into WhatsApp Logs & Incoming tables
    try {
      await fetchFromAPI('/whatsapp_incoming', {
        method: 'POST',
        body: JSON.stringify({
          from_phone: formattedPhone,
          from_name: name,
          message: `[Property Inquiry] ${property.title} (ID: ${property.id}) | Location: ${property.location || property.district || 'Thanjavur'} | Price: ${property.priceFormatted || '₹' + property.price}`,
          message_type: 'text'
        })
      });

      await fetchFromAPI('/whatsapp_logs', {
        method: 'POST',
        body: JSON.stringify({
          id: `WA-${Date.now()}`,
          leadId: leadId,
          phone: formattedPhone,
          sender: 'Super Admin',
          recipientName: name,
          message: `Hello ${name}, Thank you for your interest in Thanjai Property! We have received your inquiry for "${property.title}". Our property advisors will assist you shortly. Official Desk: +91 84899 96852.`,
          type: 'outbound'
        })
      });
    } catch (err) {}

    // 4. Dispatch Official AiSensy Welcome Template with Property Image Header
    try {
      const propImgUrl = (property.images && property.images.length > 0 && property.images[0].startsWith('http'))
        ? property.images[0]
        : 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80';

      await sendWhatsAppMessage({
        campaignName: 'initial_contact_intro',
        destination: formattedPhone,
        userName: name,
        leadId: leadId,
        templateParams: [name, property.location || property.district || 'Thanjavur', property.title, '+91 84899 96852'],
        media: {
          url: propImgUrl,
          filename: 'property.jpg'
        }
      });
    } catch (err) {}

    showToast(`Enquiry received! We've sent a WhatsApp confirmation to ${formattedPhone}.`, 'ri-checkbox-circle-fill');
    overlay?.classList.remove('active');
    setTimeout(onClose, 300);
  });
}
