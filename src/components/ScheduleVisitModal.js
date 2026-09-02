import { showToast } from '../utils/toast.js';
import { fetchFromAPI } from '../utils/api.js';

export function renderScheduleVisitModal(detail = {}) {
  const propertyTitle = detail.propertyTitle || 'Luxury Property Visit';
  const propertyId = detail.propertyId || '';

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

        <form id="schedule-visit-form">
          <input type="hidden" id="sv-prop-title" value="${propertyTitle}" />
          <input type="hidden" id="sv-prop-id" value="${propertyId}" />
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div class="search-field-group">
              <label class="search-field-label"><i class="ri-user-line"></i> Your Full Name</label>
              <input type="text" id="sv-name" required placeholder="Enter name" class="search-input" />
            </div>

            <div class="search-field-group">
              <label class="search-field-label"><i class="ri-phone-line"></i> Phone Number</label>
              <input type="tel" id="sv-phone" required placeholder="10-digit number" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" class="search-input" />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-calendar-line"></i> Preferred Date</label>
                <input type="date" id="sv-date" required class="search-input" />
              </div>

              <div class="search-field-group">
                <label class="search-field-label"><i class="ri-time-line"></i> Time Slot</label>
                <select id="sv-slot" class="search-select">
                  <option value="10:00 AM - 12:00 PM">Morning (10 AM - 12 PM)</option>
                  <option value="02:00 PM - 04:00 PM">Afternoon (2 PM - 4 PM)</option>
                  <option value="04:00 PM - 06:00 PM">Evening (4 PM - 6 PM)</option>
                </select>
              </div>
            </div>

            <button type="submit" id="sv-submit-btn" class="btn btn-brown" style="padding: 14px; font-size: 1rem; width: 100%; margin-top: 8px;">
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

  document.getElementById('schedule-visit-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('sv-name')?.value.trim();
    const phone = document.getElementById('sv-phone')?.value.trim();
    const visitDate = document.getElementById('sv-date')?.value;
    const timeSlot = document.getElementById('sv-slot')?.value;
    const propTitle = document.getElementById('sv-prop-title')?.value || 'Luxury Property';
    const propId = document.getElementById('sv-prop-id')?.value || '';
    const submitBtn = document.getElementById('sv-submit-btn');

    if (!name || !phone || !visitDate) return;

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Scheduling...';
    }

    const cleanDigits = phone.replace(/\D/g, '');
    const formattedPhone = cleanDigits.length === 10 ? `+91${cleanDigits}` : `+${cleanDigits}`;
    const leadId = `L-${Date.now()}`;
    const visitId = `SV-${Date.now()}`;

    // 1. Create and Save Lead in CRM Pipeline
    const newLead = {
      id: leadId,
      name: name,
      phone: formattedPhone,
      mobile: formattedPhone,
      email: '',
      type: 'Site Visit',
      location: 'Thanjavur',
      budget: 'Site Tour Requested',
      stage: 'Site Visit Scheduled',
      source: 'Property Inquiry',
      date: new Date().toISOString().split('T')[0],
      assignedTo: 'Unassigned',
      priority: 'High',
      propertyId: propId,
      timeline: [
        {
          type: 'whatsapp_incoming',
          date: new Date().toISOString(),
          message: `📅 Site visit booked for "${propTitle}" on ${visitDate} (${timeSlot})`,
          note: `Site Visit: ${visitDate} ${timeSlot}`
        },
        {
          type: 'whatsapp',
          date: new Date().toISOString(),
          message: `🤖 Auto-sent WhatsApp Visit Confirmation to ${name} (${formattedPhone})`,
          note: 'Campaign: stage_site_visit_scheduled'
        }
      ]
    };

    try {
      const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      localLeads.unshift(newLead);
      localStorage.setItem('thanjai_leads', JSON.stringify(localLeads));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {}

    try {
      await fetchFromAPI('/leads', {
        method: 'POST',
        body: JSON.stringify(newLead)
      });
    } catch (err) {}

    // 2. Save Site Visit Record
    try {
      await fetchFromAPI('/site_visits', {
        method: 'POST',
        body: JSON.stringify({
          id: visitId,
          leadId: leadId,
          clientName: name,
          clientPhone: formattedPhone,
          propertyName: propTitle,
          propertyId: propId,
          visitDate: visitDate,
          visitTime: timeSlot,
          status: 'Scheduled',
          notes: `Booked via website schedule visit modal`
        })
      });
    } catch (err) {}

    // 3. Log to WhatsApp Logs
    const visitMsg = `Hello ${name}, Your site visit for "${propTitle}" has been scheduled for ${visitDate} (${timeSlot}). Our field manager will assist you with plot boundaries, layout review, and Patta verification. Official Desk: +91 84899 96852.`;
    try {
      await fetchFromAPI('/whatsapp_logs', {
        method: 'POST',
        body: JSON.stringify({
          id: `WA-${Date.now()}`,
          leadId: leadId,
          phone: formattedPhone,
          sender: 'Super Admin',
          recipientName: name,
          message: visitMsg,
          type: 'outbound'
        })
      });
    } catch (err) {}

    // 4. Dispatch Official SmartPing Site Visit Template
    try {
      await fetchFromAPI('/send_whatsapp', {
        method: 'POST',
        body: JSON.stringify({
          campaignName: 'stage_site_visit_scheduled',
          destination: formattedPhone,
          userName: name,
          leadId: leadId,
          templateParams: [name, propTitle, `${visitDate} (${timeSlot})`, 'our Location Manager at +91 84899 96852']
        })
      });
    } catch (err) {}

    showToast(`Tour Scheduled! We've sent WhatsApp confirmation to ${formattedPhone}.`, 'ri-calendar-check-line');
    overlay?.classList.remove('active');
    setTimeout(onClose, 300);
  });
}
