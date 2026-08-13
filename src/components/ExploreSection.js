export function renderExploreSection(properties, onPropertySelect) {
  const spotlight = properties.find(p => p.heroFeatured) || properties[0];
  const stacked = properties.filter(p => p.editorialFeatured && p.id !== spotlight.id).slice(0, 2);

  return `
    <section class="editorial-section" id="explore">
      <div class="container">
        <!-- Section Header -->
        <div class="editorial-header">
          <div class="editorial-header-text">
            <span class="eyebrow">CURATED EDITORIAL SHOWCASE</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              Find the Property<br>That Fits Your Life.
            </h2>
          </div>
          <p style="max-width: 420px; color: var(--color-text-muted); font-size: 0.9375rem;">
            Explore handpicked architectural homes and prime investments curated by Tamil Nadu’s trusted real estate advisors.
          </p>
        </div>

        <!-- Asymmetrical Asymmetric Grid Layout -->
        <div class="asymmetric-grid">
          <!-- Left: Large Featured Property Card -->
          <div class="editorial-large-card" data-id="${spotlight.id}">
            <img src="${spotlight.images[0]}" alt="${spotlight.title}" class="editorial-card-bg" />
            <div class="editorial-card-gradient"></div>

            <div class="editorial-card-content">
              <span class="badge badge-orange" style="margin-bottom: 16px;">
                <i class="ri-fire-fill"></i> ${spotlight.tag}
              </span>
              
              <div class="font-serif" style="font-size: 2.25rem; color: var(--color-orange); margin-bottom: 8px;">
                ${spotlight.priceFormatted}
              </div>

              <h3 style="font-size: 1.65rem; font-weight: 800; line-height: 1.25; margin-bottom: 12px; color: var(--color-white);">
                ${spotlight.title}
              </h3>

              <div style="display: flex; align-items: center; gap: 16px; color: rgba(255, 255, 255, 0.85); font-size: 0.9375rem; margin-bottom: 24px;">
                <span><i class="ri-map-pin-line" style="color: var(--color-orange);"></i> ${spotlight.area}</span>
                <span>•</span>
                <span><i class="ri-ruler-line" style="color: var(--color-orange);"></i> ${spotlight.size}</span>
              </div>

              <button class="btn btn-primary open-details-btn" data-id="${spotlight.id}">
                <span>View Full Property</span>
                <i class="ri-arrow-right-line"></i>
              </button>
            </div>
          </div>

          <!-- Right: Stacked Horizontal Cards -->
          <div class="editorial-stacked-cards">
            ${stacked.map(prop => `
              <div class="horizontal-editorial-card" data-id="${prop.id}">
                <div class="horizontal-card-img-wrap">
                  <img src="${prop.images[0]}" alt="${prop.title}" class="horizontal-card-img" />
                  <div style="position: absolute; top: 12px; left: 12px;">
                    <span class="badge badge-dark">${prop.categoryLabel}</span>
                  </div>
                </div>

                <div class="horizontal-card-body">
                  <div class="font-serif" style="font-size: 1.35rem; color: var(--color-brown); font-weight: 700; margin-bottom: 4px;">
                    ${prop.priceFormatted}
                  </div>
                  
                  <h4 style="font-size: 1rem; font-weight: 700; color: var(--color-text-main); margin-bottom: 8px; line-height: 1.3;">
                    ${prop.title}
                  </h4>

                  <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 16px;">
                    <i class="ri-map-pin-line" style="color: var(--color-orange);"></i> ${prop.location}, Tamil Nadu
                  </div>

                  <button class="btn btn-outline-dark open-details-btn" data-id="${prop.id}" style="padding: 8px 18px; font-size: 0.8125rem;">
                    <span>View Property</span>
                    <i class="ri-arrow-right-line"></i>
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initExploreSectionListeners(onPropertySelect) {
  document.querySelectorAll('.open-details-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = btn.dataset.id;
      if (id) onPropertySelect(id);
    });
  });

  document.querySelectorAll('.editorial-large-card, .horizontal-editorial-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id) onPropertySelect(id);
    });
  });
}
