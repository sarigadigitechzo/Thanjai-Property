import { getActiveFrontEndPopups } from '../utils/popupsStore.js';
import { fetchFromAPI } from '../utils/api.js';

let activeQueue = [];
let currentQueueIndex = 0;
let isPopupOpen = false;

export function initPromotionalPopups() {
  // Check if modal container already exists in DOM
  let modalOverlay = document.getElementById('frontend-promo-popup-modal');
  if (!modalOverlay) {
    modalOverlay = document.createElement('div');
    modalOverlay.id = 'frontend-promo-popup-modal';
    modalOverlay.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: rgba(15, 23, 42, 0.75);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      padding: 16px;
      opacity: 0;
      transition: opacity 0.35s ease;
    `;
    modalOverlay.innerHTML = `
      <style>
        #promo-popup-card.layout-split {
          max-width: 680px !important;
          display: flex !important;
          flex-direction: row !important;
          align-items: stretch !important;
        }
        #promo-popup-card.layout-split #promo-popup-img-wrap {
          flex: 1 1 45% !important;
          min-width: 250px !important;
          max-width: 310px !important;
          min-height: 360px !important;
          max-height: 480px !important;
          height: auto !important;
          background: #0f172a !important;
        }
        #promo-popup-card.layout-split #promo-popup-img {
          width: 100% !important;
          height: 100% !important;
          max-height: 480px !important;
          object-fit: contain !important;
        }
        #promo-popup-card.layout-split #promo-popup-content-wrap {
          flex: 1.2 !important;
          padding: 26px 28px !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: center !important;
        }
        @media (max-width: 640px) {
          #promo-popup-card.layout-split {
            flex-direction: column !important;
            max-width: 440px !important;
            max-height: 90vh !important;
          }
          #promo-popup-card.layout-split #promo-popup-img-wrap {
            max-width: 100% !important;
            min-height: 220px !important;
            max-height: 320px !important;
          }
          #promo-popup-card.layout-split #promo-popup-content-wrap {
            padding: 18px 20px 22px 20px !important;
          }
        }
      </style>

      <div id="promo-popup-card" style="
        background: #ffffff;
        border-radius: 20px;
        max-width: 440px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
        transform: translateY(20px) scale(0.95);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.3s ease;
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
        display: flex;
        flex-direction: column;
      ">
        <!-- Close Button -->
        <button id="promo-popup-close-btn" style="
          position: absolute;
          top: 14px;
          right: 14px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.5);
          color: #ffffff;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          font-size: 1.1rem;
          transition: background 0.2s, transform 0.2s;
        ">
          ✕
        </button>

        <!-- Top Banner Image & Glowing Badge (Full Cover for Landscape) -->
        <div id="promo-popup-img-wrap" style="position: relative; width: 100%; min-height: 160px; max-height: 260px; background: #0f172a; overflow: hidden; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease;">
          <img id="promo-popup-img" src="" alt="Offer" style="width: 100%; height: 100%; max-height: 260px; object-fit: cover; background: #0f172a; display: block;" />
          
          <span id="promo-popup-badge" style="
            position: absolute;
            top: 14px;
            left: 14px;
            background: #eb5e28;
            color: #ffffff;
            font-size: 0.74rem;
            font-weight: 800;
            padding: 5px 14px;
            border-radius: 20px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            letter-spacing: 0.5px;
            text-transform: uppercase;
            z-index: 2;
          ">
            🎉 FESTIVE OFFER
          </span>
        </div>

        <!-- Popup Body with Warm Luxury Gradient and Refined Typography -->
        <div id="promo-popup-content-wrap" style="padding: 22px 24px 26px 24px; flex: 1; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(145deg, #ffffff 0%, #fffcf8 100%);">
          <!-- Campaign Category Tag -->
          <div id="promo-popup-type-tag" style="display: inline-flex; align-items: center; gap: 6px; background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; padding: 2px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase; margin-bottom: 8px; width: fit-content;">
            <i class="ri-sparkling-fill" style="font-size: 0.76rem;"></i> <span id="promo-popup-type-text">Festival & Seasonal</span>
          </div>

          <h2 id="promo-popup-title" style="
            color: #0f172a;
            font-size: 1.28rem;
            font-weight: 800;
            margin: 0 0 8px 0;
            line-height: 1.35;
            font-family: 'DM Serif Display', Georgia, serif;
          "></h2>

          <p id="promo-popup-subtitle" style="
            font-size: 0.88rem;
            color: #64748b;
            margin: 0 0 16px 0;
            line-height: 1.5;
          "></p>

          <div id="promo-popup-highlights" style="
            background: #f8fafc;
            border: 1px solid #f1f5f9;
            border-radius: 12px;
            padding: 12px 14px;
            margin-bottom: 18px;
            display: none;
            flex-direction: column;
            gap: 8px;
          "></div>

          <!-- CTA Button -->
          <button id="promo-popup-cta-btn" style="
            width: 100%;
            background: #eb5e28;
            color: #ffffff;
            border: none;
            padding: 12px 18px;
            border-radius: 12px;
            font-size: 0.92rem;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
            cursor: pointer;
            box-shadow: 0 8px 20px rgba(235,94,40,0.35);
            transition: transform 0.2s, background 0.2s;
          ">
            <i id="promo-popup-cta-icon" class="ri-whatsapp-fill" style="font-size: 1.1rem;"></i>
            <span id="promo-popup-cta-text">Claim Offer on WhatsApp</span>
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalOverlay);

    // Bind close events
    const closeBtn = document.getElementById('promo-popup-close-btn');
    closeBtn?.addEventListener('click', closeCurrentPopup);
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeCurrentPopup();
    });
  }

  // Load and queue all active popups
  loadAndStartQueue();

  // Listen for real-time updates from CRM
  window.addEventListener('popupsUpdated', () => {
    loadAndStartQueue();
  });
}

function loadAndStartQueue() {
  const activePopups = getActiveFrontEndPopups();
  if (!activePopups || activePopups.length === 0) return;

  // Filter popups based on configured frequency (every_load, once_session, once_day)
  activeQueue = activePopups.filter(p => {
    const freq = p.frequency || 'once_session';
    if (freq === 'every_load') {
      return true; // Always display on every single page load / refresh!
    } else if (freq === 'once_day') {
      const lastSeen = localStorage.getItem(`thanjai_popup_last_seen_${p.id}`);
      if (lastSeen) {
        const timeDiff = Date.now() - parseInt(lastSeen, 10);
        if (timeDiff < 24 * 60 * 60 * 1000) {
          return false; // Already seen within 24 hours
        }
      }
      return true;
    } else {
      // Default: once per browser session
      const dismissed = sessionStorage.getItem(`thanjai_dismissed_popup_${p.id}`);
      return !dismissed;
    }
  });

  if (activeQueue.length === 0) return;

  currentQueueIndex = 0;
  // Delay first popup opening based on configured delaySeconds
  const firstPopup = activeQueue[0];
  const delayMs = (firstPopup.delaySeconds || 3) * 1000;

  setTimeout(() => {
    if (!isPopupOpen) {
      showPopupAtIndex(0);
    }
  }, delayMs);
}

function showPopupAtIndex(index) {
  if (index >= activeQueue.length) return;

  const p = activeQueue[index];
  const modalOverlay = document.getElementById('frontend-promo-popup-modal');
  const card = document.getElementById('promo-popup-card');
  if (!modalOverlay || !card) return;

  const imgWrap = document.getElementById('promo-popup-img-wrap');
  const imgEl = document.getElementById('promo-popup-img');
  const badgeEl = document.getElementById('promo-popup-badge');
  const typeTagEl = document.getElementById('promo-popup-type-tag');
  const typeTextEl = document.getElementById('promo-popup-type-text');
  const titleEl = document.getElementById('promo-popup-title');
  const subtitleEl = document.getElementById('promo-popup-subtitle');
  const highlightsEl = document.getElementById('promo-popup-highlights');
  const ctaBtn = document.getElementById('promo-popup-cta-btn');
  const ctaText = document.getElementById('promo-popup-cta-text');
  const ctaIcon = document.getElementById('promo-popup-cta-icon');

  const applyFrontendLayout = (isSplit) => {
    if (isSplit) {
      card.classList.add('layout-split');
      if (imgEl) {
        imgEl.style.objectFit = 'contain';
        imgEl.style.width = '100%';
        imgEl.style.height = '100%';
      }
    } else {
      card.classList.remove('layout-split');
      if (imgEl) {
        imgEl.style.objectFit = 'cover';
        imgEl.style.width = '100%';
        imgEl.style.height = '100%';
      }
    }
  };

  const selectedLayout = p.layout || 'auto';
  if (selectedLayout === 'split') {
    applyFrontendLayout(true);
  } else if (selectedLayout === 'stacked') {
    applyFrontendLayout(false);
  } else {
    // Auto detect aspect ratio
    if (p.image && p.image.trim()) {
      const testImg = new Image();
      testImg.onload = () => {
        if (testImg.naturalHeight > testImg.naturalWidth * 1.05) {
          applyFrontendLayout(true);
        } else {
          applyFrontendLayout(false);
        }
      };
      testImg.onerror = () => applyFrontendLayout(false);
      testImg.src = p.image.trim();
    } else {
      applyFrontendLayout(false);
    }
  }

  if (p.image && p.image.trim()) {
    if (imgWrap) imgWrap.style.display = 'flex';
    if (imgEl) imgEl.src = p.image.trim();
  } else {
    if (imgWrap) imgWrap.style.display = 'none';
  }

  if (badgeEl) badgeEl.textContent = p.badge || 'PROMOTION';
  if (typeTagEl && typeTextEl) {
    if (p.type && p.type.trim()) {
      typeTextEl.textContent = p.type.trim();
      typeTagEl.style.display = 'inline-flex';
    } else {
      typeTagEl.style.display = 'none';
    }
  }
  if (titleEl) titleEl.textContent = p.title;
  if (subtitleEl) subtitleEl.textContent = p.subtitle || '';

  if (highlightsEl) {
    const highlights = Array.isArray(p.highlights) ? p.highlights.filter(h => h && h.trim()) : [];
    if (highlights.length > 0) {
      highlightsEl.style.display = 'flex';
      highlightsEl.innerHTML = highlights.map(h => `
        <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155;">
          <i class="ri-checkbox-circle-fill" style="color: #10b981; font-size: 0.95rem;"></i>
          <span style="line-height: 1.3;">${h}</span>
        </div>
      `).join('');
    } else {
      highlightsEl.style.display = 'none';
      highlightsEl.innerHTML = '';
    }
  }

  // Conditional CTA Button Rendering
  if (ctaBtn) {
    if (p.ctaType === 'none' || !p.ctaType) {
      ctaBtn.style.display = 'none';
    } else {
      ctaBtn.style.display = 'flex';
      if (ctaText) ctaText.textContent = p.ctaText || 'Claim Offer on WhatsApp';

      if (ctaIcon) {
        if (p.ctaType === 'whatsapp') ctaIcon.className = 'ri-whatsapp-fill';
        else if (p.ctaType === 'site_visit') ctaIcon.className = 'ri-calendar-check-fill';
        else if (p.ctaType === 'call') ctaIcon.className = 'ri-phone-fill';
        else ctaIcon.className = 'ri-arrow-right-up-line';
      }

      ctaBtn.onclick = () => {
        handleCTAClick(p);
        closeCurrentPopup();
      };
    }
  }

  // Smooth Slide-in Animation
  modalOverlay.style.display = 'flex';
  setTimeout(() => {
    modalOverlay.style.opacity = '1';
    card.style.transform = 'translateY(0) scale(1)';
    isPopupOpen = true;
  }, 30);
}

function handleCTAClick(p) {
  // Automatically record this engagement into the CRM Pipeline
  recordPopupLeadInCRM(p);

  if (p.ctaType === 'whatsapp') {
    const phone = (p.ctaValue || '+918489996852').replace(/[^0-9]/g, '');
    const text = encodeURIComponent(`Hello Thanjai Property, I am interested in your offer: "${p.title}". Please share complete project details and price.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  } else if (p.ctaType === 'call') {
    const phone = p.ctaValue || '+918489996852';
    window.location.href = `tel:${phone}`;
  } else if (p.ctaType === 'site_visit') {
    const svModal = document.getElementById('schedule-visit-modal');
    if (svModal) {
      svModal.classList.add('show');
      svModal.style.display = 'flex';
    } else {
      window.location.hash = '#contact';
    }
  } else if (p.ctaType === 'link') {
    const url = p.ctaValue || '#discover';
    if (url.startsWith('#') || url.startsWith('/')) {
      window.location.href = url;
    } else {
      window.open(url, '_blank');
    }
  }
}

async function recordPopupLeadInCRM(p) {
  try {
    const leadId = `L-POP-${Date.now()}`;
    const newLead = {
      id: leadId,
      name: `Website Visitor (${p.badge || 'Offer'})`,
      phone: p.ctaType === 'whatsapp' ? 'WhatsApp Lead' : (p.ctaType === 'call' ? 'Phone Inquiry' : 'Website Lead'),
      mobile: '',
      email: '',
      type: p.type || 'Promotional Offer',
      location: 'Thanjavur',
      budget: 'Campaign Inquiry',
      stage: 'New',
      source: `Website Popup (${p.title})`,
      date: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned',
      priority: 'High',
      notes: `Engaged with popup: "${p.title}" | CTA Action: ${p.ctaText}`,
      timeline: [
        {
          type: 'popup_click',
          date: new Date().toISOString(),
          message: `🎯 User clicked CTA "${p.ctaText}" on popup offer "${p.title}"`,
          note: `Campaign Type: ${p.type}`
        }
      ]
    };

    // Save to local storage
    const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    localLeads.unshift(newLead);
    localStorage.setItem('thanjai_leads', JSON.stringify(localLeads));
    window.dispatchEvent(new Event('storage'));

    // Sync to MySQL API
    await fetchFromAPI('/leads', {
      method: 'POST',
      body: JSON.stringify(newLead)
    });
  } catch (e) {
    console.warn('Could not record popup lead in CRM:', e);
  }
}

function closeCurrentPopup() {
  const modalOverlay = document.getElementById('frontend-promo-popup-modal');
  const card = document.getElementById('promo-popup-card');
  if (!modalOverlay || !card) return;

  const currentPopup = activeQueue[currentQueueIndex];
  if (currentPopup) {
    sessionStorage.setItem(`thanjai_dismissed_popup_${currentPopup.id}`, 'true');
    localStorage.setItem(`thanjai_popup_last_seen_${currentPopup.id}`, Date.now().toString());
  }

  modalOverlay.style.opacity = '0';
  card.style.transform = 'translateY(20px) scale(0.95)';

  setTimeout(() => {
    modalOverlay.style.display = 'none';
    isPopupOpen = false;

    // Check if next popup exists in queue
    currentQueueIndex++;
    if (currentQueueIndex < activeQueue.length) {
      // Graceful 1.5s pause before opening the next popup to prevent clashing!
      setTimeout(() => {
        showPopupAtIndex(currentQueueIndex);
      }, 1500);
    }
  }, 350);
}
