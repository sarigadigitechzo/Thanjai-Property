import { addReview } from '../utils/reviewsStore.js';
import { showToast } from '../utils/toast.js';

export function renderWriteReviewModal() {
  return `
    <div id="write-review-modal" class="modal-overlay" style="
      position: fixed; inset: 0; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(8px);
      z-index: 99999; display: none; align-items: center; justify-content: center; padding: 20px;
    ">
      <div class="modal-card" style="
        background: #ffffff; border-radius: 24px; max-width: 580px; width: 100%; max-height: 90vh;
        overflow-y: auto; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25); border: 1px solid #e2e8f0;
        position: relative; animation: modalPop 0.3s ease-out;
      ">
        
        <!-- Modal Header -->
        <div style="padding: 28px 32px 20px 32px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: flex-start; justify-content: space-between;">
          <div>
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="display: inline-flex; align-items: center; justify-content: center; width: 28px; height: 28px; border-radius: 8px; background: rgba(235,94,40,0.12); color: #eb5e28; font-size: 1rem;">
                <i class="ri-star-smile-fill"></i>
              </span>
              <span style="font-size: 0.78rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #eb5e28;">
                CLIENT EXPERIENCE
              </span>
            </div>
            <h3 style="font-size: 1.45rem; font-weight: 700; color: #1a202c; margin: 0;">
              Share Your Review & Experience
            </h3>
            <p style="font-size: 0.88rem; color: #64748b; margin: 4px 0 0 0;">
              Your feedback helps other home buyers and investors make informed property decisions.
            </p>
          </div>

          <button id="close-write-review-modal-btn" style="
            background: #f8fafc; border: 1px solid #e2e8f0; width: 36px; height: 36px; border-radius: 50%;
            display: flex; align-items: center; justify-content: center; color: #64748b; font-size: 1.2rem;
            cursor: pointer; transition: all 0.2s;
          " onmouseover="this.style.background='#fee2e2'; this.style.color='#ef4444';" onmouseout="this.style.background='#f8fafc'; this.style.color='#64748b';">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Form Body -->
        <form id="write-review-form" style="padding: 28px 32px; display: flex; flex-direction: column; gap: 20px;">
          
          <!-- Rating Stars Picker -->
          <div style="background: #fafaf9; padding: 18px; border-radius: 16px; border: 1px dashed #e2e8f0; text-align: center;">
            <label style="font-size: 0.84rem; font-weight: 700; color: #334155; display: block; margin-bottom: 8px;">Overall Rating *</label>
            <div id="star-rating-picker" style="display: inline-flex; gap: 8px; font-size: 2rem; color: #cbd5e1; cursor: pointer;">
              <i class="ri-star-fill star-item" data-value="1" style="color: #f59e0b;"></i>
              <i class="ri-star-fill star-item" data-value="2" style="color: #f59e0b;"></i>
              <i class="ri-star-fill star-item" data-value="3" style="color: #f59e0b;"></i>
              <i class="ri-star-fill star-item" data-value="4" style="color: #f59e0b;"></i>
              <i class="ri-star-fill star-item" data-value="5" style="color: #f59e0b;"></i>
            </div>
            <input type="hidden" id="review-form-rating" value="5" />
            <div id="star-rating-label" style="font-size: 0.82rem; font-weight: 700; color: #f59e0b; margin-top: 4px;">
              5.0 — Excellent (Highly Recommended)
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <!-- Name -->
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Your Name *</label>
              <input type="text" id="review-form-name" required placeholder="e.g. Dr. K. Senthil Kumar" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box;" />
            </div>

            <!-- City / Location -->
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Your City / Location</label>
              <input type="text" id="review-form-location" placeholder="e.g. Thanjavur or Singapore" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
            <!-- Property / Service Type -->
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Property / Service Taken</label>
              <select id="review-form-property-type" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; box-sizing: border-box;">
                <option value="Luxury Villa Purchase" selected>Luxury Villa Purchase</option>
                <option value="Independent House">Independent House</option>
                <option value="Residential DTCP Plot">Residential DTCP Plot</option>
                <option value="Farmland & Farmhouse">Farmland & Farmhouse</option>
                <option value="Commercial Space / Building">Commercial Space / Building</option>
                <option value="Rental / Lease">Rental / Lease</option>
                <option value="Patta Legal Title Verification">Patta Legal Title Verification</option>
              </select>
            </div>

            <!-- Phone / Email (Private) -->
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Phone / WhatsApp <span style="color: #94a3b8; font-weight: 400;">(Private)</span></label>
              <input type="tel" id="review-form-phone" placeholder="e.g. 9840123456" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box;" />
            </div>
          </div>

          <!-- Review Text -->
          <div>
            <label style="font-size: 0.82rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Your Review & Experience *</label>
            <textarea id="review-form-text" required rows="4" placeholder="Describe your experience with Thanjai Property, our property verification, and registration guidance..." style="width: 100%; padding: 12px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box; resize: vertical;"></textarea>
          </div>

          <!-- Submit Button -->
          <div style="display: flex; align-items: center; justify-content: flex-end; gap: 12px; margin-top: 10px;">
            <button type="button" id="cancel-write-review-btn" style="
              padding: 11px 20px; border-radius: 10px; background: #f1f5f9; border: 1px solid #cbd5e1;
              color: #475569; font-weight: 600; font-size: 0.9rem; cursor: pointer;
            ">
              Cancel
            </button>
            <button type="submit" style="
              display: inline-flex; align-items: center; gap: 8px; padding: 11px 26px; border-radius: 10px;
              background: var(--color-orange, #eb5e28); color: #ffffff; border: none; font-weight: 700;
              font-size: 0.92rem; cursor: pointer; box-shadow: 0 4px 14px rgba(235,94,40,0.3);
            ">
              <i class="ri-send-plane-fill"></i>
              <span>Submit Review</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  `;
}

export function initWriteReviewModalListeners() {
  const modal = document.getElementById('write-review-modal');
  const openBtn = document.getElementById('open-write-review-modal-btn');
  const closeBtn = document.getElementById('close-write-review-modal-btn');
  const cancelBtn = document.getElementById('cancel-write-review-btn');
  const form = document.getElementById('write-review-form');

  const ratingPicker = document.getElementById('star-rating-picker');
  const ratingInput = document.getElementById('review-form-rating');
  const ratingLabel = document.getElementById('star-rating-label');

  const labels = {
    1: '1.0 — Poor',
    2: '2.0 — Fair',
    3: '3.0 — Good',
    4: '4.0 — Very Good',
    5: '5.0 — Excellent (Highly Recommended)'
  };

  // Open & Close handlers
  const openModal = () => {
    if (modal) {
      modal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = () => {
    if (modal) {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      if (form) form.reset();
      updateStars(5);
    }
  };

  openBtn?.addEventListener('click', openModal);
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  // Close on backdrop click
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Interactive Star Selector
  function updateStars(val) {
    if (!ratingPicker) return;
    const stars = ratingPicker.querySelectorAll('.star-item');
    stars.forEach(star => {
      const starVal = parseInt(star.dataset.value, 10);
      if (starVal <= val) {
        star.style.color = '#f59e0b';
      } else {
        star.style.color = '#cbd5e1';
      }
    });
    if (ratingInput) ratingInput.value = val;
    if (ratingLabel) ratingLabel.textContent = labels[val] || `${val}.0 Rating`;
  }

  ratingPicker?.querySelectorAll('.star-item').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value, 10);
      updateStars(val);
    });
  });

  // Form Submit Handler
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('review-form-name')?.value.trim();
    const rating = parseInt(document.getElementById('review-form-rating')?.value, 10) || 5;
    const location = document.getElementById('review-form-location')?.value.trim() || 'Thanjavur';
    const propertyType = document.getElementById('review-form-property-type')?.value;
    const phone = document.getElementById('review-form-phone')?.value.trim();
    const reviewText = document.getElementById('review-form-text')?.value.trim();

    if (!name || !reviewText) {
      showToast('Please fill in your name and review message', 'ri-error-warning-line');
      return;
    }

    addReview({
      name,
      rating,
      source: 'Website',
      location,
      propertyType,
      phone,
      reviewText,
      status: 'Approved'
    });

    closeModal();
    showToast('Thank you! Your review has been submitted and added to testimonials.', 'ri-checkbox-circle-fill');
  });
}
