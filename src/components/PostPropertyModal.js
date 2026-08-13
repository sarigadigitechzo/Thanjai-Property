import { showToast } from '../utils/toast.js';

export function renderPostPropertyModal() {
  return `
    <div class="modal-overlay active" id="post-property-modal-overlay">
      <div class="property-modal-card" style="max-width: 680px; padding: 40px;">
        <button class="modal-close-btn" id="close-post-modal-btn">
          <i class="ri-close-line"></i>
        </button>

        <div style="margin-bottom: 24px;">
          <span class="eyebrow">SUBMIT YOUR PROPERTY</span>
          <h2 class="font-serif" style="font-size: 2rem; color: var(--color-brown); margin-top: 6px;">
            List Your Property on Thanjai Property
          </h2>
          <p style="font-size: 0.875rem; color: var(--color-text-muted);">
            Reach verified buyers and high-net-worth investors across Tamil Nadu.
          </p>
        </div>

        <form id="post-property-form" onsubmit="return false;">
          <div style="display: flex; flex-direction: column; gap: 20px;">
            <div class="search-field-group">
              <label class="search-field-label"><i class="ri-pencil-line"></i> Property Title</label>
              <input type="text" id="post-title" required placeholder="e.g. 3BHK Luxury Villa with Garden" class="search-input" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-price-tag-3-line"></i> Purpose</label>
                <select id="post-purpose" class="search-select">
                  <option value="buy">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>

              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-building-line"></i> Category</label>
                <select id="post-category" class="search-select">
                  <option value="villas">Luxury Villa</option>
                  <option value="houses">Independent House</option>
                  <option value="apartments">Apartment / Flat</option>
                  <option value="plots">Residential Plot</option>
                  <option value="agricultural">Agricultural Farmland</option>
                  <option value="commercial">Commercial Space</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-map-pin-line"></i> City / District</label>
                <select id="post-city" class="search-select">
                  <option value="Thanjavur">Thanjavur</option>
                  <option value="Trichy">Trichy</option>
                  <option value="Madurai">Madurai</option>
                  <option value="Chennai">Chennai</option>
                  <option value="Coimbatore">Coimbatore</option>
                  <option value="Kumbakonam">Kumbakonam</option>
                </select>
              </div>

              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-money-rupee-circle-line"></i> Expected Price (₹)</label>
                <input type="text" id="post-price" required placeholder="e.g. 75,000,000" class="search-input" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-user-3-line"></i> Owner Full Name</label>
                <input type="text" id="post-owner-name" required placeholder="Your Name" class="search-input" />
              </div>

              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-phone-line"></i> Mobile Phone (+91)</label>
                <input type="tel" id="post-owner-phone" required placeholder="10-digit number" class="search-input" />
              </div>
            </div>

            <!-- Upload Area Simulation -->
            <div style="border: 2px dashed var(--color-border); border-radius: var(--radius-md); padding: 24px; text-align: center; background: var(--color-cream-light);">
              <i class="ri-image-add-line" style="font-size: 2.25rem; color: var(--color-orange);"></i>
              <div style="font-size: 0.875rem; font-weight: 700; color: var(--color-brown); margin-top: 8px;">Upload Property Photos</div>
              <div style="font-size: 0.75rem; color: var(--color-text-muted);">PNG, JPG up to 10MB per file</div>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 16px; font-size: 1rem; width: 100%;">
              <i class="ri-send-plane-fill"></i> SUBMIT PROPERTY LISTING
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initPostPropertyModalListeners(onClose) {
  const overlay = document.getElementById('post-property-modal-overlay');
  const closeBtn = document.getElementById('close-post-modal-btn');

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

  document.getElementById('post-property-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Success! Your property listing has been submitted for review.', 'ri-checkbox-circle-fill');
    overlay?.classList.remove('active');
    setTimeout(onClose, 300);
  });
}
