import { showToast } from '../utils/toast.js';

export function renderScheduleVisitModal(detail = {}) {
  const propertyTitle = detail.propertyTitle || 'Luxury Property Visit';

  return `
    <div class="modal-overlay active" id="schedule-visit-modal-overlay">
      <div class="property-modal-card" style="max-width: 540px; padding: 40px;">
        <button class="modal-close-btn" id="close-schedule-modal-btn">
          <i class="ri-close-line"></i>
        </button>

        <div style="margin-bottom: 24px;">
          <span class="eyebrow">PRIVATE SITE TOUR</span>
          <h2 class="font-serif" style="font-size: 1.85rem; color: var(--color-brown); margin-top: 6px;">
            Schedule a Private Visit
          </h2>
          <p style="font-size: 0.875rem; color: var(--color-orange); font-weight: 700;">
            ${propertyTitle}
          </p>
        </div>

        <form id="schedule-visit-form" onsubmit="return false;">
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="search-field-group">
              <label class="search-field-label"><i class="ri-user-line"></i> Your Full Name</label>
              <input type="text" required placeholder="Enter name" class="search-input" />
            </div>

            <div class="search-field-group">
              <label class="search-field-label"><i class="ri-phone-line"></i> Phone Number</label>
              <input type="tel" required placeholder="10-digit number" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="search-input" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-calendar-line"></i> Preferred Date</label>
                <input type="date" required class="search-input" />
              </div>

              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-time-line"></i> Time Slot</label>
                <select class="search-select">
                  <option value="morning">Morning (10 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 6 PM)</option>
                </select>
              </div>
            </div>

            <button type="submit" class="btn btn-brown" style="padding: 14px; font-size: 1rem; width: 100%; margin-top: 8px;">
              <i class="ri-calendar-check-line"></i> CONFIRM VISIT SCHEDULE
            </button>
          </div>
        </form>
      </div>
    </div>
  `;
}

export function initScheduleVisitModalListeners(onClose) {
  const overlay = document.getElementById('schedule-visit-modal-overlay');
  const closeBtn = document.getElementById('close-schedule-modal-btn');

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

  document.getElementById('schedule-visit-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Tour Scheduled! Our site executive will send you direction coordinates.', 'ri-calendar-check-line');
    overlay?.classList.remove('active');
    setTimeout(onClose, 300);
  });
}
