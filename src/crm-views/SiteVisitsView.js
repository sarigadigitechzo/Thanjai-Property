import { getAdminUsers } from '../utils/adminUsersStore.js';
import { fetchFromAPI } from '../utils/api.js';
import { showToast, showAlertModal } from '../utils/toast.js';
import { addAuditLog } from '../utils/siteImagesStore.js';

export function renderSiteVisitsView() {
  const adminStaff = getAdminUsers().filter(u => u.status === 'Active' || !u.status);
  let adminOptions = '';
  if (adminStaff.length > 0) {
    adminStaff.forEach(u => {
      adminOptions += `<option value="${u.fullName} (${u.role || 'Staff'})">${u.fullName} (${u.role || 'Staff'})</option>`;
    });
  } else {
    adminOptions = `
      <option value="Vijayaraghavan (Super Admin)">Vijayaraghavan (Super Admin)</option>
      <option value="Aishwarya R. (Super Admin)">Aishwarya R. (Super Admin)</option>
      <option value="Sales Manager">Sales Manager</option>
    `;
  }

  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Site Visits Planner</h1>
          <p class="view-subtitle">Coordinate property tours and client meetings.</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary" id="btn-open-schedule-visit"><i class="ri-add-line"></i> Schedule Visit</button>
        </div>
      </div>

      <div class="visits-layout">
        <!-- Calendar Side -->
        <div class="calendar-side">
          <div class="cal-card">
            <div class="cal-header">
              <button class="cal-nav" id="cal-prev-btn"><i class="ri-arrow-left-s-line"></i></button>
              <div class="cal-month" id="cal-month-display">August 2026</div>
              <button class="cal-nav" id="cal-next-btn"><i class="ri-arrow-right-s-line"></i></button>
            </div>
            <div class="cal-grid" id="cal-grid-container">
              <!-- Rendered by JS -->
            </div>
          </div>
        </div>

        <!-- Agenda Side -->
        <div class="agenda-side" id="agenda-side-container">
          <!-- Dynamic Content -->
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div class="os-modal-overlay" id="site-visits-schedule-modal">
      <div class="os-modal-card" style="max-width: 480px;">
        <div class="os-modal-header">
          <h2>Schedule site visit</h2>
          <button class="os-modal-close" id="close-sv-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Client name / Lead *</label>
            <input type="text" id="sv-client-name" class="os-input" placeholder="Search or enter client name..." style="width: 100%;" required />
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Property *</label>
            <input type="text" id="sv-property" class="os-input" placeholder="e.g. Premium Villa, Anna Nagar" style="width: 100%;" required />
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Visit date & time *</label>
            <input type="datetime-local" id="sv-datetime" class="os-input" style="width: 100%;" required />
          </div>
          <div class="form-group" style="margin-bottom: 16px;">
            <label>Assign to Admin Staff *</label>
            <select id="sv-assigned-to" class="os-input" style="width: 100%; background: #ffffff; cursor: pointer; padding: 10px 14px; border: 1px solid var(--os-border-color, #cbd5e1); border-radius: 8px;">
              ${adminOptions}
            </select>
          </div>
          <p style="font-size: 0.85rem; color: var(--os-gray-500); margin-top: 12px;">The assigned admin staff will receive the visit reminder in their dashboard schedule.</p>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-sv-modal">Cancel</button>
          <button class="os-btn-primary" id="confirm-sv-modal" style="background: #eb5e28; border-color: #eb5e28; color: #fff;">Confirm & Schedule</button>
        </div>
      </div>
    </div>
    </div>
  `;
}

export async function initSiteVisitsView() {
  // --- Storage & Dynamic Rendering ---
  let visits = [];
  try {
    const data = await fetchFromAPI('/site_visits');
    if (data && Array.isArray(data)) {
      visits = data.map(v => {
        const vd = new Date(v.visitDate);
        const hours = vd.getHours();
        const mins = vd.getMinutes().toString().padStart(2, '0');
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const h12 = hours % 12 || 12;
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        let clientName = v.leadId;
        let property = v.propertyId;
        let assignedTo = v.assignedTo || 'Vijayaraghavan';
        try { 
          if(v.notes) { 
            const n = JSON.parse(v.notes); 
            clientName = n.clientName || clientName; 
            property = n.property || property; 
            assignedTo = n.assignedTo || assignedTo;
          } 
        } catch(e){}

        return {
          id: v.id,
          date: vd.getDate().toString(),
          month: monthNames[vd.getMonth()],
          hours: h12.toString().padStart(2, '0'),
          mins: mins,
          ampm: ampm,
          clientName: clientName,
          phone: 'Site Visit',
          property: property,
          assignedTo: assignedTo,
          status: v.status
        };
      });
    }
  } catch (error) {
    console.error('API Error:', error);
    visits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
  }



  const today = new Date();
  let currentMonth = today.getMonth(); // 0-indexed
  let currentYear = today.getFullYear();
  let selectedDay = today.getDate();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fullMonthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const renderCalendar = () => {
    const monthDisplay = document.getElementById('cal-month-display');
    const grid = document.getElementById('cal-grid-container');
    if (!monthDisplay || !grid) return;

    monthDisplay.textContent = `${fullMonthNames[currentMonth]} ${currentYear}`;

    let html = `
      <div class="cal-day-name">Su</div><div class="cal-day-name">Mo</div><div class="cal-day-name">Tu</div>
      <div class="cal-day-name">We</div><div class="cal-day-name">Th</div><div class="cal-day-name">Fr</div><div class="cal-day-name">Sa</div>
    `;

    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

    for (let i = firstDay - 1; i >= 0; i--) {
      html += `<div class="cal-day muted">${prevMonthDays - i}</div>`;
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isActive = i === selectedDay ? 'active' : '';
      html += `<div class="cal-day ${isActive}" data-day="${i}">${i}</div>`;
    }

    const totalCells = firstDay + daysInMonth;
    const nextDays = 42 - totalCells; // 6 rows
    for (let i = 1; i <= nextDays; i++) {
      html += `<div class="cal-day muted">${i}</div>`;
    }

    grid.innerHTML = html;

    grid.querySelectorAll('.cal-day:not(.muted)').forEach(day => {
      day.addEventListener('click', () => {
        grid.querySelectorAll('.cal-day').forEach(d => d.classList.remove('active'));
        day.classList.add('active');
        selectedDay = parseInt(day.dataset.day);
        renderAgenda(selectedDay.toString());
      });
    });

    updateCalendarDots();
  };

  const prevBtn = document.getElementById('cal-prev-btn');
  const nextBtn = document.getElementById('cal-next-btn');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      currentMonth--;
      if (currentMonth < 0) { currentMonth = 11; currentYear--; }
      renderCalendar();
      renderAgenda(selectedDay.toString());
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentMonth++;
      if (currentMonth > 11) { currentMonth = 0; currentYear++; }
      renderCalendar();
      renderAgenda(selectedDay.toString());
    });
  }

  const agendaContainer = document.getElementById('agenda-side-container');

  const updateCalendarDots = () => {
    const days = document.querySelectorAll('.cal-day:not(.muted)');
    days.forEach(day => {
      const dayNum = day.dataset.day;
      const monthStr = monthNames[currentMonth];
      // Only show dots for the current month and year
      const hasVisit = visits.some(v => parseInt(v.date) === parseInt(dayNum) && v.month === monthStr);
      if (hasVisit) {
        day.classList.add('has-event');
      } else {
        day.classList.remove('has-event');
      }
    });
  };

  const renderAgenda = async (day) => {
    if (!agendaContainer) return;
    const monthStr = monthNames[currentMonth];
    
    // Use the initialized visits, wait for it if needed (assuming visits is global inside initSiteVisitsView)
    // No need to fetch from localStorage since we fetched from API on init.
    
    const dayVisits = visits.filter(v => parseInt(v.date) === parseInt(day) && v.month === monthStr);
    
    let html = `<h2 class="agenda-title">Visits for <span>${day} ${monthStr}</span></h2>`;
    
    if (dayVisits.length === 0) {
      html += `<p style="color: var(--os-gray-500); padding: 20px 0;">No visits scheduled for this date.</p>`;
    } else {
      // sort by AM/PM then hour (rough)
      dayVisits.forEach(v => {
        html += `
          <div class="visit-card hover-lift" style="border-left: 4px solid #eb5e28;">
            <div class="v-time">
              <div class="v-hour">${v.hours}:${v.mins}</div>
              <div class="v-ampm">${v.ampm}</div>
            </div>
            <div class="v-details">
              <div class="v-client">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(v.clientName)}&background=eb5e28&color=fff" class="v-avatar" />
                <div>
                  <div class="v-name">${v.clientName}</div>
                  <div class="v-phone">${v.phone || 'Site Visit'}</div>
                </div>
              </div>
              <div class="v-prop">
                <i class="ri-building-4-line"></i> ${v.property}
              </div>
              <div style="margin-top: 6px; font-size: 0.78rem; display: flex; align-items: center; gap: 6px;">
                <span style="background: #FFF5EB; color: #eb5e28; font-weight: 700; padding: 2px 8px; border-radius: 6px; border: 1px solid #FEEBC8;">
                  <i class="ri-user-star-line"></i> Assigned to: ${v.assignedTo || 'Vijayaraghavan (Super Admin)'}
                </span>
              </div>
            </div>
            <div class="v-actions">
              <button class="v-btn whatsapp"><i class="ri-whatsapp-line"></i> Message</button>
              <button class="v-btn map"><i class="ri-map-pin-line"></i> Directions</button>
              <button class="v-btn delete-btn" data-id="${v.id}" style="color: var(--os-error); border-color: #fee2e2; background: #fef2f2;"><i class="ri-delete-bin-line"></i> Delete</button>
            </div>
          </div>
        `;
      });
    }

    agendaContainer.innerHTML = html;

    // Rebind action buttons
    agendaContainer.querySelectorAll('.v-btn.whatsapp').forEach(btn => {
      btn.addEventListener('click', () => alert('Opening WhatsApp...'));
    });
    agendaContainer.querySelectorAll('.v-btn.map').forEach(btn => {
      btn.addEventListener('click', () => window.open('https://maps.google.com', '_blank'));
    });
    agendaContainer.querySelectorAll('.v-btn.delete-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        if (confirm('Are you sure you want to delete this site visit?')) {
          try {
            await fetchFromAPI('/site_visits/' + id, { method: 'DELETE' });
            // Refresh visits list
            visits = visits.filter(v => v.id != id);
            // Re-render calendar dots and current day agenda
            updateCalendarDots();
            renderAgenda(day);
          } catch (err) {
            console.error('Failed to delete visit', err);
            alert('Failed to delete visit');
          }
        }
      });
    });
  };

  // initial render
  renderCalendar();
  renderAgenda(selectedDay.toString());

  // Schedule Visit Modal Logic
  const scheduleBtn = document.getElementById('btn-open-schedule-visit') || document.querySelector('.view-header-flex .os-btn-primary');
  const svModal = document.getElementById('site-visits-schedule-modal');
  const closeSvBtn = document.getElementById('close-sv-modal');
  const cancelSvBtn = document.getElementById('cancel-sv-modal');
  const confirmSvBtn = document.getElementById('confirm-sv-modal');

  if (scheduleBtn && svModal) {
    scheduleBtn.addEventListener('click', () => {
      svModal.classList.add('show');
    });
  }

  const closeSvModal = () => { if (svModal) svModal.classList.remove('show'); };
  
  if (closeSvBtn) closeSvBtn.addEventListener('click', closeSvModal);
  if (cancelSvBtn) cancelSvBtn.addEventListener('click', closeSvModal);
  if (confirmSvBtn) {
    confirmSvBtn.addEventListener('click', () => {
      const clientName = document.getElementById('sv-client-name').value.trim();
      const property = document.getElementById('sv-property').value.trim();
      const datetime = document.getElementById('sv-datetime').value;
      const assignedTo = document.getElementById('sv-assigned-to')?.value || 'Vijayaraghavan (Super Admin)';

      if (!clientName || !datetime) {
        showAlertModal({
          title: 'Missing Details',
          message: 'Please enter both the <strong>Client Name</strong> and the <strong>Visit Date & Time</strong>.',
          type: 'warning'
        });
        return;
      }

      const dateObj = new Date(datetime);
      const day = dateObj.getDate().toString();
      let hours = dateObj.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mins = dateObj.getMinutes().toString().padStart(2, '0');

      // Save to API
      const newVisit = {
        id: `SV-${Date.now()}`,
        leadId: clientName,
        propertyId: property || 'TBD',
        visitDate: datetime.replace('T', ' ') + ':00',
        status: 'Scheduled',
        assignedTo: assignedTo,
        notes: JSON.stringify({ clientName, property, assignedTo })
      };

      fetchFromAPI('/site_visits', {
        method: 'POST',
        body: JSON.stringify(newVisit)
      }).catch(e => {
        console.error("API Error", e);
        showToast('Saved locally (network offline)', 'ri-information-line');
      });

      visits.push({
        id: newVisit.id,
        date: day,
        month: monthNames[dateObj.getMonth()],
        hours: hours.toString(),
        mins: mins,
        ampm: ampm,
        clientName: clientName,
        phone: 'Site Visit',
        property: property || 'TBD',
        assignedTo: assignedTo,
        isNew: true
      });

      addAuditLog({
        action: `Scheduled Site Visit (${clientName})`,
        module: 'Site Visits',
        details: `Scheduled property tour for ${clientName} at ${property || 'Property'} assigned to ${assignedTo} on ${day} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} at ${hours}:${mins} ${ampm}.`
      });

      showToast(`Site visit scheduled & assigned to ${assignedTo}!`, 'ri-checkbox-circle-fill');

      // clear inputs
      document.getElementById('sv-client-name').value = '';
      document.getElementById('sv-property').value = '';
      document.getElementById('sv-datetime').value = '';

      closeSvModal();
      
      // Auto-select the day we just scheduled for
      selectedDay = parseInt(day);
      currentMonth = dateObj.getMonth();
      currentYear = dateObj.getFullYear();
      
      renderCalendar();
      renderAgenda(selectedDay.toString());
    });
  }

  window.addEventListener('click', (e) => {
    if (e.target === svModal) closeSvModal();
  });
}
