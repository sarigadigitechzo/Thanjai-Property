import { getSiteImage } from '../utils/siteImagesStore.js';

export function renderShowcaseBanner(featuredProperty, onPropertySelect) {
  const showcaseBg = getSiteImage('showcase_bg');
  const property = featuredProperty || {
    id: "TP-2006",
    title: "East Coast Oceanfront Contemporary Villa",
    location: "Chennai",
    priceFormatted: "₹ 4.80 Crore",
    categoryLabel: "Oceanfront Luxury Villa",
    image: showcaseBg
  };

  return `
    <section class="showcase-banner-section" id="showcase">
      <img src="${showcaseBg}" alt="Luxury Showcase" class="showcase-bg-img" />
      <div class="showcase-overlay-gradient"></div>

      <div class="container">
        <div class="showcase-content-box">
          <span class="eyebrow eyebrow-dark" style="margin-bottom: 20px;">
            <i class="ri-vip-crown-fill"></i> EXCLUSIVE ARCHITECTURAL SHOWCASE
          </span>

          <h2 class="heading-display-light" style="font-size: clamp(2.2rem, 4.5vw, 3.8rem); margin-bottom: 16px;">
            ${property.title}
          </h2>

          <div style="display: flex; align-items: center; justify-content: center; gap: 20px; margin-bottom: 28px; font-size: 1.125rem; flex-wrap: wrap;">
            <span style="font-family: var(--font-serif); font-size: 2.5rem; color: var(--color-orange); font-weight: 700;">
              ${property.priceFormatted}
            </span>
            <span style="width: 1px; height: 28px; background: rgba(255,255,255,0.3);"></span>
            <span style="color: rgba(255,255,255,0.9); font-weight: 600;">
              <i class="ri-map-pin-line" style="color: var(--color-orange);"></i> ${property.location}, Tamil Nadu
            </span>
          </div>

          <p style="color: rgba(255, 255, 255, 0.85); font-size: 1.1rem; max-width: 720px; margin: 0 auto 40px auto; line-height: 1.75; text-align: center;">
            Designed for those who view living as an art form. Features floor-to-ceiling double-glazed thermal glass, private infinity pool, VRV automation system, and lush landscaped outdoor courtyards.
          </p>

          <div style="display: flex; gap: 16px; flex-wrap: wrap; justify-content: center;">
            <button class="btn btn-primary showcase-details-btn" data-id="${property.id}">
              <span>View Property Details</span>
              <i class="ri-arrow-right-line"></i>
            </button>
            <button class="btn btn-outline-light" onclick="window.dispatchEvent(new CustomEvent('openScheduleModal', { detail: { propertyId: '${property.id}' } }))">
              <i class="ri-calendar-event-line"></i>
              <span>Schedule Private Tour</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initShowcaseListeners(onPropertySelect) {
  document.querySelectorAll('.showcase-details-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) onPropertySelect(id);
    });
  });
}
