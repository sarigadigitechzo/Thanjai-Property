import { CATEGORIES } from '../data/categories.js';

export function renderCategoryCarousel() {
  return `
    <section class="categories-section" id="categories">
      <div class="container">
        <!-- Section Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; flex-wrap: wrap; gap: 20px;">
          <div>
            <span class="eyebrow">PROPERTY ASSET CLASSES</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              Curated Property Types
            </h2>
          </div>
          <div style="display: flex; gap: 12px;">
            <button class="view-btn" id="cat-scroll-left" title="Scroll Left"><i class="ri-arrow-left-line"></i></button>
            <button class="view-btn" id="cat-scroll-right" title="Scroll Right"><i class="ri-arrow-right-line"></i></button>
          </div>
        </div>

        <!-- Horizontal Scrollable Track -->
        <div class="categories-track" id="categories-scroll-track">
          ${CATEGORIES.map(cat => `
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
    </section>
  `;
}

export function initCategoryCarouselListeners(onCategorySelect) {
  const track = document.getElementById('categories-scroll-track');
  
  document.getElementById('cat-scroll-left')?.addEventListener('click', () => {
    track?.scrollBy({ left: -320, behavior: 'smooth' });
  });

  document.getElementById('cat-scroll-right')?.addEventListener('click', () => {
    track?.scrollBy({ left: 320, behavior: 'smooth' });
  });

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
