import { CATEGORIES } from '../data/categories.js';

export function renderCategoryCarousel() {
  // Duplicate categories to create an infinite seamless marquee loop
  const marqueeItems = [...CATEGORIES, ...CATEGORIES, ...CATEGORIES];

  return `
    <section class="categories-section" id="categories">
      <div class="container">
        <!-- Section Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 36px; flex-wrap: wrap; gap: 20px;">
          <div style="max-width: 720px;">
            <span class="eyebrow">DISCOVER BY NEED</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              Discover Properties Based on What You Actually Need
            </h2>
            <p style="color: var(--color-text-muted, #666); font-size: 0.95rem; margin-top: 8px; line-height: 1.6;">
              <strong>Search by Location. Choose by Property Type. Decide With Confidence.</strong> Every property requirement is different—whether you are a homebuyer, plot seeker, agricultural investor, or business owner.
            </p>
          </div>

          <!-- Left & Right Arrow Buttons -->
          <div style="display: flex; gap: 12px;">
            <button class="view-btn" id="cat-scroll-left" title="Scroll Left" style="width: 44px; height: 44px; border-radius: 50%; box-shadow: var(--shadow-sm); cursor: pointer;">
              <i class="ri-arrow-left-line" style="font-size: 1.25rem;"></i>
            </button>
            <button class="view-btn" id="cat-scroll-right" title="Scroll Right" style="width: 44px; height: 44px; border-radius: 50%; box-shadow: var(--shadow-sm); cursor: pointer;">
              <i class="ri-arrow-right-line" style="font-size: 1.25rem;"></i>
            </button>
          </div>
        </div>

        <!-- Marquee Carousel Wrapper (Scrollbar Hidden) -->
        <div class="categories-marquee-wrapper" id="categories-marquee-wrapper">
          <div class="categories-track-marquee" id="categories-marquee-track">
            ${marqueeItems.map((cat) => `
              <div class="category-visual-tile" data-category="${cat.id}">
                <img src="${cat.image}" alt="${cat.name}" class="category-tile-img" />
                <div class="category-tile-content">
                  <span class="badge badge-orange" style="width: fit-content; margin-bottom: 8px;">
                    ${cat.count}
                  </span>
                  <h3 class="font-serif" style="font-size: 1.5rem; color: var(--color-white); margin-bottom: 4px;">
                    ${cat.name}
                  </h3>
                  <p style="font-size: 0.8125rem; color: rgba(255, 255, 255, 0.75);">
                    ${cat.description}
                  </p>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initCategoryCarouselListeners(onCategorySelect) {
  const wrapper = document.getElementById('categories-marquee-wrapper');
  let isHovered = false;
  let isButtonInteracting = false;
  const speed = 0.8; // Smooth marquee speed in pixels per frame

  // 60fps Continuous Marquee Loop Animation
  function stepMarquee() {
    if (wrapper && !isHovered && !isButtonInteracting) {
      wrapper.scrollLeft += speed;

      // Infinite loop reset point (1/3 of the triplicated track)
      const loopWidth = (wrapper.scrollWidth / 3);
      if (wrapper.scrollLeft >= loopWidth * 2) {
        wrapper.scrollLeft -= loopWidth;
      } else if (wrapper.scrollLeft <= 0) {
        wrapper.scrollLeft += loopWidth;
      }
    }
    requestAnimationFrame(stepMarquee);
  }

  // Start marquee loop
  requestAnimationFrame(stepMarquee);

  // Pause on hover
  wrapper?.addEventListener('mouseenter', () => { isHovered = true; });
  wrapper?.addEventListener('mouseleave', () => { isHovered = false; });

  // Left Arrow Button Click - 100% Reliable!
  document.getElementById('cat-scroll-left')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (wrapper) {
      isButtonInteracting = true;
      wrapper.scrollBy({ left: -340, behavior: 'smooth' });
      setTimeout(() => { isButtonInteracting = false; }, 1500);
    }
  });

  // Right Arrow Button Click - 100% Reliable!
  document.getElementById('cat-scroll-right')?.addEventListener('click', (e) => {
    e.preventDefault();
    if (wrapper) {
      isButtonInteracting = true;
      wrapper.scrollBy({ left: 340, behavior: 'smooth' });
      setTimeout(() => { isButtonInteracting = false; }, 1500);
    }
  });

  // Category Tile Click Handler
  document.querySelectorAll('.category-visual-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const catId = tile.dataset.category;
      if (catId) {
        onCategorySelect(catId);
        document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
