import { formatPropertySize, formatLocationDisplay } from '../utils/propertiesStore.js';

function formatSizeDisplay(size) {
  return formatPropertySize(size);
}

export function renderHomePropertyShowcase(properties, onSelectProperty, onNavigateToDiscover) {
  // Select top 4 featured properties for editorial presentation
  const featured = properties.slice(0, 4);

  return `
    <section class="home-property-showcase-section" style="padding: 90px 0; background: #ffffff;">
      <div class="container">
        
        <!-- Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; flex-wrap: wrap; gap: 20px;">
          <div>
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">FEATURED & LATEST OPPORTUNITIES</span>
            <h2 class="heading-section" style="margin-top: 10px;">
              Featured Properties
            </h2>
            <div style="font-size: 1rem; font-weight: 700; color: #4a5568; margin-top: 4px;">Explore Property Opportunities Worth Your Attention</div>
          </div>
          <p style="max-width: 520px; color: var(--color-text-muted, #666); font-size: 0.95rem; line-height: 1.6;">
            Explore handpicked properties across Tamil Nadu. Find houses, villas, plots, farmlands, and commercial spaces with verified prices, clear sizes, and exact locations.
          </p>
        </div>

        <!-- Asymmetric Editorial Showcase Grid (4 Properties) -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px; margin-bottom: 50px;">
          ${featured.map((prop, idx) => `
            <div class="editorial-prop-card hover-lift" data-id="${prop.id}" style="
              background: #ffffff;
              border-radius: 20px;
              overflow: hidden;
              border: 1px solid rgba(0,0,0,0.08);
              box-shadow: 0 6px 20px rgba(0,0,0,0.04);
              display: flex;
              flex-direction: column;
              cursor: pointer;
            ">
              <div style="position: relative; width: 100%; height: 260px; overflow: hidden; background: #111;">
                <img src="${prop.images[0]}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" />
                <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.65) 100%);"></div>
                
                <span class="badge badge-orange" style="position: absolute; top: 18px; left: 18px; font-weight: 700;">
                  ${prop.categoryLabel}
                </span>

                <div style="position: absolute; top: 18px; right: 18px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 12px; backdrop-filter: blur(4px); letter-spacing: 0.05em;">
                  ID: ${prop.id}
                </div>

                <div style="position: absolute; bottom: 18px; left: 18px; right: 18px; color: #ffffff;">
                  <div style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: #ffffff;">
                    ${prop.priceFormatted}
                  </div>
                </div>
              </div>

              <div style="padding: 24px; display: flex; flex-direction: column; flex: 1;">
                <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
                  ${prop.title}
                </h3>

                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.88rem; color: #666; margin-bottom: 16px;">
                  <i class="ri-map-pin-2-line" style="color: var(--color-orange, #eb5e28);"></i>
                  <span>${formatLocationDisplay(prop.location, prop.district)}</span>
                </div>

                <div style="display: flex; gap: 14px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); font-size: 0.85rem; color: #555; margin-top: auto; flex-wrap: wrap;">
                  ${prop.size ? `<span><i class="ri-ruler-2-line"></i> ${formatSizeDisplay(prop.size)}</span>` : ''}
                  ${prop.facing ? `<span><i class="ri-compass-3-line"></i> ${prop.facing}</span>` : ''}
                  ${prop.bedrooms ? `<span><i class="ri-hotel-bed-line"></i> ${prop.bedrooms} BHK</span>` : (prop.approval ? `<span><i class="ri-shield-check-line"></i> ${prop.approval}</span>` : '')}
                </div>

                <button class="btn btn-outline-dark" style="margin-top: 20px; width: 100%; border-radius: 10px; font-size: 0.9rem;">
                  <span>Explore Property</span>
                  <i class="ri-arrow-right-line"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>

        <!-- Big CTA Button to Discover -->
        <div style="text-align: center;">
          <button class="btn btn-primary" id="showcase-discover-all-btn" style="padding: 16px 40px; font-size: 1.05rem; border-radius: 12px;">
            <i class="ri-compass-3-line" style="font-size: 1.25rem;"></i>
            <span>View More Properties</span>
          </button>
        </div>

      </div>
    </section>
  `;
}

export function initHomePropertyShowcaseListeners(onSelectProperty, onNavigateToDiscover) {
  const discoverBtn = document.getElementById('showcase-discover-all-btn');
  if (discoverBtn) {
    discoverBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (onNavigateToDiscover) onNavigateToDiscover();
    });
  }

  document.querySelectorAll('.editorial-prop-card').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const id = card.dataset.id;
      if (id && onSelectProperty) {
        onSelectProperty(id);
      }
    });
  });
}
