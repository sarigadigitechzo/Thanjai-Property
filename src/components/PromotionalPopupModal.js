import { getActiveFrontEndPopups } from '../utils/popupsStore.js';

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
      <div id="promo-popup-card" style="
        background: #ffffff;
        border-radius: 20px;
        max-width: 440px;
        width: 100%;
        overflow: hidden;
        box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35);
        transform: translateY(20px) scale(0.95);
        transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        position: relative;
        border: 1px solid rgba(255, 255, 255, 0.2);
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

        <!-- Top Banner Image & Glowing Badge -->
        <div style="position: relative; height: 180px; background: #0f172a; overflow: hidden;">
          <img id="promo-popup-img" src="" alt="Offer" style="width: 100%; height: 100%; object-fit: cover;" />
          
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
          ">
            🎉 FESTIVE OFFER
          </span>
        </div>

        <!-- Popup Body -->
        <div style="padding: 20px 22px 24px 22px;">
          <h2 id="promo-popup-title" style="
            color: #0f172a;
            font-size: 1.25rem;
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
            display: flex;
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

  // Filter popups not already dismissed in this session
  activeQueue = activePopups.filter(p => {
    if (p.frequency === 'once_session') {
      const dismissed = sessionStorage.getItem(`thanjai_dismissed_popup_${p.id}`);
      return !dismissed;
    }
    return true;
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

  const imgEl = document.getElementById('promo-popup-img');
  const badgeEl = document.getElementById('promo-popup-badge');
  const titleEl = document.getElementById('promo-popup-title');
  const subtitleEl = document.getElementById('promo-popup-subtitle');
  const highlightsEl = document.getElementById('promo-popup-highlights');
  const ctaBtn = document.getElementById('promo-popup-cta-btn');
  const ctaText = document.getElementById('promo-popup-cta-text');
  const ctaIcon = document.getElementById('promo-popup-cta-icon');

  if (imgEl) imgEl.src = p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
  if (badgeEl) badgeEl.textContent = p.badge || 'PROMOTION';
  if (titleEl) titleEl.textContent = p.title;
  if (subtitleEl) subtitleEl.textContent = p.subtitle || '';

  if (highlightsEl) {
    const highlights = Array.isArray(p.highlights) ? p.highlights : [];
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
    }
  }

  if (ctaText) ctaText.textContent = p.ctaText || 'Claim Offer on WhatsApp';

  if (ctaIcon) {
    if (p.ctaType === 'whatsapp') ctaIcon.className = 'ri-whatsapp-fill';
    else if (p.ctaType === 'site_visit') ctaIcon.className = 'ri-calendar-check-fill';
    else if (p.ctaType === 'call') ctaIcon.className = 'ri-phone-fill';
    else ctaIcon.className = 'ri-arrow-right-up-line';
  }

  // CTA Click Action
  if (ctaBtn) {
    ctaBtn.onclick = () => {
      handleCTAClick(p);
      closeCurrentPopup();
    };
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

function closeCurrentPopup() {
  const modalOverlay = document.getElementById('frontend-promo-popup-modal');
  const card = document.getElementById('promo-popup-card');
  if (!modalOverlay || !card) return;

  const currentPopup = activeQueue[currentQueueIndex];
  if (currentPopup) {
    sessionStorage.setItem(`thanjai_dismissed_popup_${currentPopup.id}`, 'true');
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
