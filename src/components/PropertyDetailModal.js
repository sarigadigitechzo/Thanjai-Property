import { isFavorite, toggleFavorite } from '../utils/favorites.js';
import { showToast } from '../utils/toast.js';
import { fetchFromAPI } from '../utils/api.js';
import { sendWhatsAppMessage } from '../utils/whatsapp.js';
import { formatPropertySize, formatLocationDisplay, getPropertyById, incrementPropertyInquiryCount } from '../utils/propertiesStore.js';

export function renderPropertyDetailModal(property) {
  if (!property) return '';

  const saved = isFavorite(property.id);
  const formattedSize = formatPropertySize(property.size);

  // Assemble dynamic technical specs
  const specsList = Array.isArray(property.specs) && property.specs.length > 0 ? [...property.specs] : [];
  if (!specsList.some(s => s.label.toLowerCase() === 'area') && formattedSize) {
    specsList.unshift({ label: 'Plot / Land Area', value: formattedSize });
  }
  if (property.builtUpArea) {
    specsList.push({ label: 'Built-up Area', value: property.builtUpArea });
  }
  if (!specsList.some(s => s.label.toLowerCase() === 'facing') && (property.facing || property.address)) {
    specsList.push({ label: 'Facing', value: property.facing || property.address });
  }
  if (property.approval) {
    specsList.push({ label: 'Approval Status', value: property.approval });
  }
  if (property.road && property.road !== 'Other / Outside Road') {
    specsList.push({ label: 'Road Corridor', value: property.road });
  }
  if (property.taluk) {
    specsList.push({ label: 'Taluk', value: property.taluk });
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

  let allVideos = [];
  const rawVid = property.videoUrl || property.videos;
  if (Array.isArray(rawVid)) allVideos = rawVid.filter(Boolean);
  else if (typeof rawVid === 'string' && rawVid.trim()) {
    if (rawVid.trim().startsWith('[') && rawVid.trim().endsWith(']')) {
      try { const p = JSON.parse(rawVid); if (Array.isArray(p)) allVideos = p; } catch(e) { allVideos = rawVid.split(/[\n,]+/); }
    } else {
      allVideos = rawVid.split(/[\n,]+/);
    }
  }
  allVideos = allVideos.map(v => typeof v === 'string' ? v.trim() : '').filter(Boolean);

  const isPaidAd = String(property.adType || property.ad_type || '').toLowerCase() === 'paid';
  const specialistDisplayName = isPaidAd ? (property.ownerName || 'Verified Owner') : 'Thanjai Property';
  const publicPhone = isPaidAd ? (property.ownerPhone || '8489996852') : '8489996852';
  const cleanPhone = String(publicPhone).replace(/[^0-9]/g, '');
  const waNumber = cleanPhone.length === 10 ? `91${cleanPhone}` : (cleanPhone.startsWith('91') ? cleanPhone : '918489996852');

  return `
    <div class="modal-overlay active" id="property-details-modal-overlay" style="position: fixed; inset: 0; z-index: 9999999; background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px); display: flex; align-items: center; justify-content: center; padding: 20px; opacity: 1; visibility: visible; transition: all 0.3s ease;">
      <div class="property-modal-card" style="background: #ffffff; width: 100%; max-width: 1040px; max-height: 90vh; border-radius: 20px; overflow-y: auto; position: relative; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.4); font-family: 'Manrope', 'Plus Jakarta Sans', sans-serif;">
        
        <!-- Close Button -->
        <button class="modal-close-btn" id="close-prop-modal-btn" title="Close Modal" style="position: absolute; top: 16px; right: 16px; z-index: 100; background: #ffffff; border: 1px solid #e2e8f0; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; color: #1e293b; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          <i class="ri-close-line"></i>
        </button>

        <!-- Gallery Section -->
        <div style="display: grid; grid-template-columns: 1fr 140px; gap: 12px; padding: 24px 24px 0 24px; max-height: 280px; box-sizing: border-box;">
          <div id="modal-gallery-media-viewport" style="position: relative; height: 256px; border-radius: 14px; overflow: hidden; background: #0f172a;">
            <img src="${images[0]}" alt="${property.title}" id="modal-main-gallery-img" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            <div style="position: absolute; bottom: 12px; left: 12px; display: flex; gap: 8px; z-index: 5;">
              <span style="background: rgba(15,23,42,0.85); color: #ffffff; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; display: inline-flex; align-items: center; gap: 5px;">
                <i class="ri-image-line"></i> ${images.length} High-Res Photos
              </span>
              <span style="background: #ea580c; color: #ffffff; padding: 4px 12px; border-radius: 8px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.04em;">${property.tag || property.categoryLabel || property.type || 'Property'}</span>
            </div>

            <div style="position: absolute; top: 12px; right: 12px; display: flex; gap: 6px; z-index: 5;">
              <button class="card-favorite-btn ${saved ? 'saved' : ''}" id="modal-save-fav-btn" title="Bookmark Property" style="width: 34px; height: 34px; border-radius: 50%; background: #ffffff; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 1.05rem; color: #ea580c; box-shadow: 0 2px 8px rgba(0,0,0,0.15);">
                <i class="${saved ? 'ri-heart-fill' : 'ri-heart-line'}"></i>
              </button>
            </div>
          </div>

          <div style="display: flex; flex-direction: column; gap: 8px; max-height: 256px; overflow-y: auto;">
            ${images.slice(0, 4).map((img, i) => `
              <img src="${img}" alt="Thumbnail ${i+1}" class="modal-thumb" data-type="image" data-src="${img}" style="width: 100%; height: 58px; object-fit: cover; border-radius: 8px; cursor: pointer; display: block; border: 1px solid #e2e8f0;" />
            `).join('')}
            ${allVideos.map((vUrl, vIdx) => `
              <div class="modal-thumb" data-type="video" data-src="${vUrl}" style="width: 100%; height: 58px; display: flex; flex-direction: column; align-items: center; justify-content: center; background: #0f172a; color: #fff; cursor: pointer; border-radius: 8px;">
                <i class="ri-play-circle-fill" style="color: #ea580c; font-size: 1.2rem;"></i>
                <span style="font-size: 0.58rem; font-weight: 800;">VIDEO ${allVideos.length > 1 ? (vIdx + 1) : ''}</span>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Property Detail Main Content -->
        <div style="padding: 24px 28px 28px 28px;">
          
          <!-- Category Badge & ID Line -->
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px; flex-wrap: wrap;">
            <span style="background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; padding: 4px 12px; border-radius: 6px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em;">
              ${property.type || property.categoryLabel || 'PROPERTY'}
            </span>
            <span style="font-size: 0.8rem; font-weight: 800; color: #64748b; letter-spacing: 0.05em;">
              # ID: ${property.id}
            </span>
          </div>

          <!-- Title & Asking Price Header Box (Matching Website Detail Page) -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 24px; flex-wrap: wrap; margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #f1f5f9;">
            
            <!-- Left: Title & Location -->
            <div style="flex: 1; min-width: 280px;">
              <h1 class="font-serif" style="font-size: 2rem; color: #0f172a; line-height: 1.25; margin: 0 0 10px 0; font-weight: 800;">
                ${property.title}
              </h1>
              <div style="display: flex; align-items: center; gap: 8px; font-size: 0.95rem; color: #64748b;">
                <a href="${property.latitude && property.longitude ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(property.latitude)},${encodeURIComponent(property.longitude)}` : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([property.location, property.district, 'Tamil Nadu'].filter(Boolean).join(', '))}`}" target="_blank" rel="noopener noreferrer" style="color: #ea580c; text-decoration: none; display: inline-flex; align-items: center; gap: 6px; font-weight: 600;" title="Open Location on Google Maps">
                  <i class="ri-map-pin-2-fill"></i>
                  <span>${formatLocationDisplay(property.location, property.district)}</span>
                  <i class="ri-external-link-line" style="font-size: 0.85rem;"></i>
                </a>
              </div>
            </div>

            <!-- Right: Website Asking Price Card -->
            <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 16px; padding: 16px 24px; text-align: center; min-width: 240px; box-shadow: 0 4px 12px rgba(234,88,12,0.06);">
              <div style="font-size: 0.725rem; font-weight: 800; color: #9a3412; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 2px;">
                ASKING PRICE
              </div>
              <div class="font-serif" style="font-size: 2.25rem; color: #ea580c; font-weight: 800; line-height: 1.1;">
                ${property.priceFormatted || `₹ ${property.price}`}
              </div>
              <div style="font-size: 0.725rem; color: #166534; font-weight: 700; margin-top: 4px; display: inline-flex; align-items: center; gap: 4px;">
                <i class="ri-shield-check-fill"></i> 100% Verified Ownership & Clear Patta Title
              </div>
            </div>
          </div>

          <!-- Editorial Property Facts Cards Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 14px; margin-bottom: 28px;">
            ${formattedSize ? `
              <div style="background: #fff7ed; border: 1px solid #ffedd5; padding: 14px; border-radius: 12px; text-align: center;">
                <div style="font-size: 1.15rem; font-weight: 800; color: #ea580c;">${formattedSize}</div>
                <div style="font-size: 0.7rem; font-weight: 800; color: #9a3412; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">TOTAL AREA</div>
              </div>
            ` : ''}
            ${(property.facing || property.address) ? `
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 12px; text-align: center;">
                <div style="font-size: 1.15rem; font-weight: 800; color: #0f172a;">${property.facing || property.address}</div>
                <div style="font-size: 0.7rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">FACING / LOCATION</div>
              </div>
            ` : ''}
            ${property.approval ? `
              <div style="background: #f0fdf4; border: 1px solid #dcfce7; padding: 14px; border-radius: 12px; text-align: center;">
                <div style="font-size: 1.15rem; font-weight: 800; color: #166534;">${property.approval}</div>
                <div style="font-size: 0.7rem; font-weight: 800; color: #15803d; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">APPROVAL</div>
              </div>
            ` : ''}
            ${property.bedrooms ? `
              <div style="background: #eff6ff; border: 1px solid #dbeafe; padding: 14px; border-radius: 12px; text-align: center;">
                <div style="font-size: 1.15rem; font-weight: 800; color: #1e40af;">${property.bedrooms} BHK</div>
                <div style="font-size: 0.7rem; font-weight: 800; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">BEDROOMS</div>
              </div>
            ` : ''}
            ${property.bathrooms ? `
              <div style="background: #faf5ff; border: 1px solid #f3e8ff; padding: 14px; border-radius: 12px; text-align: center;">
                <div style="font-size: 1.15rem; font-weight: 800; color: #6b21a8;">${property.bathrooms}</div>
                <div style="font-size: 0.7rem; font-weight: 800; color: #7e22ce; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">BATHROOMS</div>
              </div>
            ` : ''}
          </div>

          <!-- Description / Overview -->
          ${property.description ? `
            <div style="margin-bottom: 28px;">
              <h3 class="font-serif" style="font-size: 1.35rem; color: #0f172a; margin-bottom: 12px; border-bottom: 2px solid #ffedd5; padding-bottom: 6px; font-weight: 800;">Property Overview</h3>
              <p style="color: #334155; font-size: 0.98rem; line-height: 1.7; white-space: pre-line; margin: 0;">
                ${property.description}
              </p>
            </div>
          ` : ''}

          <!-- Key Technical Specifications Grid -->
          ${specsList.length > 0 ? `
            <div style="margin-bottom: 28px;">
              <h3 class="font-serif" style="font-size: 1.35rem; color: #0f172a; margin-bottom: 14px; border-bottom: 2px solid #ffedd5; padding-bottom: 6px; font-weight: 800;">Key Technical Specifications</h3>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; background: #f8fafc; padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0;">
                ${specsList.map(s => `
                  <div style="display: flex; flex-direction: column;">
                    <span style="font-size: 0.725rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">${s.label}</span>
                    <span style="font-size: 0.95rem; font-weight: 700; color: #0f172a; margin-top: 2px;">${s.value}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Verified Seller Desk Card (Matching Website Detail Page) -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 20px 24px; display: flex; justify-content: space-between; align-items: center; gap: 20px; flex-wrap: wrap;">
            <div>
              <div style="font-size: 0.725rem; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 4px;">
                VERIFIED PROPERTY SELLER / SPECIALIST
              </div>
              <h4 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 2px 0;">
                ${specialistDisplayName}
              </h4>
              <div style="font-size: 0.8rem; color: ${isPaidAd ? '#166534' : '#ea580c'}; font-weight: 700;">
                ${isPaidAd ? '👑 Direct Owner Listing • 0% Brokerage' : '🛡️ Executive Real Estate Advisory Desk'}
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
              <a href="tel:${publicPhone}" style="background: #0f172a; color: #ffffff; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-size: 0.88rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                <i class="ri-phone-fill"></i> Call Seller (${publicPhone})
              </a>
              <a href="https://wa.me/${waNumber}?text=Hi%20${encodeURIComponent(specialistDisplayName)},%20I%20am%20interested%20in%20property%20${encodeURIComponent(property.title)}%20(ID:%20${property.id})" target="_blank" style="background: #25D366; color: #ffffff; padding: 10px 18px; border-radius: 10px; text-decoration: none; font-size: 0.88rem; font-weight: 700; display: inline-flex; align-items: center; gap: 6px;">
                <i class="ri-whatsapp-line" style="font-size: 1.1rem;"></i> WhatsApp Chat
              </a>
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
      source: 'Property Inquiry',
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

    // Increment property inquiry counter in CRM
    try {
      incrementPropertyInquiryCount(property.id);
    } catch(err) {}

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

export function openPropertyInquiryFormModal(property) {
  if (!property) return;

  let modalContainer = document.getElementById('global-inquiry-form-modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'global-inquiry-form-modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = `
    <div class="modal-overlay active" id="direct-prop-inquiry-modal-overlay" style="position: fixed; inset: 0; background: rgba(0,0,0,0.65); backdrop-filter: blur(5px); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px;">
      <div style="width: 100%; max-width: 500px; padding: 36px; border-radius: 20px; background: #ffffff; box-shadow: 0 20px 40px rgba(0,0,0,0.25); position: relative; animation: pageFadeIn 0.3s ease;">
        <button id="close-direct-inquiry-modal-btn" style="position: absolute; top: 18px; right: 18px; background: #f1f5f9; border: none; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.3rem; color: #475569; cursor: pointer;">
          <i class="ri-close-line"></i>
        </button>

        <div style="margin-bottom: 20px;">
          <span style="font-size: 0.75rem; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: 0.08em; background: #fff7ed; padding: 4px 10px; border-radius: 8px; border: 1px solid #ffedd5;">PROPERTY INQUIRY FORM</span>
          <h2 class="font-serif" style="font-size: 1.5rem; color: #1e293b; margin-top: 10px; margin-bottom: 4px;">
            Inquire About Property
          </h2>
          <p style="font-size: 0.9rem; color: #ea580c; font-weight: 700; margin: 0; display: flex; align-items: center; gap: 6px;">
            <i class="ri-building-line"></i> ${property.title} (ID: ${property.id})
          </p>
        </div>

        <form id="direct-property-inquiry-form">
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;"><i class="ri-user-line" style="color: #ea580c;"></i> Full Name *</label>
              <input type="text" id="dpi-name" required placeholder="Enter your name" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; outline: none;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;"><i class="ri-phone-line" style="color: #ea580c;"></i> Mobile Number *</label>
              <input type="tel" id="dpi-phone" required placeholder="10-digit mobile number" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; outline: none;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;"><i class="ri-mail-line" style="color: #ea580c;"></i> Email Address (Optional)</label>
              <input type="email" id="dpi-email" placeholder="name@example.com" style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; outline: none;" />
            </div>

            <div>
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #334155; margin-bottom: 6px;"><i class="ri-chat-3-line" style="color: #ea580c;"></i> Requirement / Question (Optional)</label>
              <textarea id="dpi-message" rows="3" placeholder="Tell us your preferences..." style="width: 100%; padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; font-size: 0.95rem; outline: none; resize: vertical;"></textarea>
            </div>

            <button type="submit" id="dpi-submit-btn" style="padding: 14px; font-size: 1rem; font-weight: 800; width: 100%; margin-top: 6px; background: #ea580c; color: #ffffff; border: none; border-radius: 10px; cursor: pointer; box-shadow: 0 4px 12px rgba(234,88,12,0.3);">
              <i class="ri-send-plane-fill"></i> SUBMIT PROPERTY INQUIRY
            </button>
          </div>
        </form>
      </div>
    </div>
  `;

  const closeBtn = document.getElementById('close-direct-inquiry-modal-btn');
  const overlay = document.getElementById('direct-prop-inquiry-modal-overlay');
  const form = document.getElementById('direct-property-inquiry-form');

  const closeModal = () => {
    if (modalContainer) modalContainer.innerHTML = '';
  };

  closeBtn?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('dpi-name')?.value.trim();
    const phone = document.getElementById('dpi-phone')?.value.trim();
    const email = document.getElementById('dpi-email')?.value.trim() || '';
    const message = document.getElementById('dpi-message')?.value.trim() || '';
    const submitBtn = document.getElementById('dpi-submit-btn');

    if (!name || !phone) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Submitting...';
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
    const leadId = `L-${Date.now()}`;
    const inquiryMsg = `Property Inquiry for "${property.title}" (ID: ${property.id}) - Price: ${property.priceFormatted || '₹' + property.price}. Note: ${message || 'No additional note'}`;

    const newLead = {
      id: leadId,
      name: name,
      phone: formattedPhone,
      mobile: formattedPhone,
      email: email,
      type: property.categoryLabel || property.type || 'Residential',
      location: property.location || property.district || 'Thanjavur',
      budget: property.priceFormatted || String(property.price),
      stage: 'New Lead',
      source: 'Property Inquiry',
      date: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned',
      priority: 'High',
      propertyId: property.id,
      propertyMatch: property.id,
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

    // 1. Increment Property Inquiry Count (+1)
    try {
      incrementPropertyInquiryCount(property.id);
    } catch(err) {}

    // 2. Save Lead to localStorage
    try {
      const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      localLeads.unshift(newLead);
      localStorage.setItem('thanjai_leads', JSON.stringify(localLeads));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    // 3. Save Lead to MySQL backend
    try {
      await fetchFromAPI('/leads', {
        method: 'POST',
        body: JSON.stringify(newLead)
      });
    } catch (err) {}

    // 4. Send WhatsApp Notification
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
        media: { url: propImgUrl, filename: 'property.jpg' }
      });
    } catch (err) {}

    showToast(`Inquiry received for Property ${property.id}! WhatsApp confirmation sent.`, 'ri-checkbox-circle-fill');
    closeModal();
  });
}

export function openPropertyModalById(propId) {
  if (!propId) return;
  let prop = getPropertyById(propId);

  if (!prop) {
    const allProps = getProperties();
    prop = allProps.find(p => p.title && p.title.toLowerCase().includes(String(propId).toLowerCase())) || allProps[0];
  }

  if (!prop) {
    prop = {
      id: propId,
      title: `Inquired Property Portfolio (${propId})`,
      type: 'Residential Plot',
      category: 'plots',
      categoryLabel: 'Residential Property',
      priceFormatted: 'Contact Advisory Desk',
      location: 'Thanjavur',
      district: 'Thanjavur',
      description: `Customer submitted an inquiry for Property ID ${propId}. Connect directly with client for details.`,
      features: ['Verified Listing Inquiry', 'Prime Location', 'Advisory Desk Assistance'],
      images: ['https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80']
    };
  }

  let modalContainer = document.getElementById('global-property-modal-container');
  if (!modalContainer) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'global-property-modal-container';
    document.body.appendChild(modalContainer);
  }

  modalContainer.innerHTML = renderPropertyDetailModal(prop);
  initPropertyDetailModalListeners(prop, () => {
    modalContainer.innerHTML = '';
  });
}

// Global capture-phase click listener for Property ID badges across CRM
document.addEventListener('click', (e) => {
  const badge = e.target.closest('.prop-id-badge');
  if (badge) {
    e.stopPropagation();
    e.preventDefault();
    const propId = badge.getAttribute('data-propid');
    if (propId) {
      openPropertyModalById(propId);
    }
  }
}, true);
