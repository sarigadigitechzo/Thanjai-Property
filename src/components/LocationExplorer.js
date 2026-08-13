import { LOCATIONS } from '../data/locations.js';

export function renderLocationExplorer() {
  return `
    <section class="locations-section" id="locations">
      <div class="container">
        <!-- Section Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 20px;">
          <div>
            <span class="eyebrow">REGIONAL DESTINATIONS</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              Explore Tamil Nadu
            </h2>
          </div>
          <p style="max-width: 480px; color: var(--color-text-muted);">
            From the royal heritage streets of Thanjavur to the coastal luxury of Chennai, find premier real estate in key Tamil Nadu growth centers.
          </p>
        </div>

        <!-- Location Visual Tiles Grid -->
        <div class="locations-grid">
          ${LOCATIONS.map(loc => `
            <div class="location-tile" data-location="${loc.name}">
              <img src="${loc.image}" alt="${loc.name}" class="location-tile-img" />
              <div class="location-tile-gradient"></div>

              <div class="location-tile-content">
                <div style="margin-bottom: auto; display: flex; justify-content: space-between; align-items: flex-start;">
                  <span class="badge badge-dark">${loc.propertiesCount} Properties</span>
                  <div style="width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.2); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; color: var(--color-white);">
                    <i class="ri-arrow-right-up-line" style="font-size: 1.2rem;"></i>
                  </div>
                </div>

                <h3 class="location-name">${loc.name}</h3>
                <p style="font-size: 0.875rem; color: rgba(255, 255, 255, 0.8); margin-top: 4px;">
                  ${loc.tagline}
                </p>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    </section>
  `;
}

export function initLocationExplorerListeners(onLocationSelect) {
  document.querySelectorAll('.location-tile').forEach(tile => {
    tile.addEventListener('click', () => {
      const locationName = tile.dataset.location;
      if (locationName) {
        onLocationSelect(locationName);
        document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}
