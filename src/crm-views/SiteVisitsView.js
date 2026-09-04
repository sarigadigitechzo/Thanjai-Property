import { getAdminUsers, getActiveAdminUser, canViewAllLeads } from '../utils/adminUsersStore.js';
import { fetchFromAPI } from '../utils/api.js';
import { showToast, showAlertModal } from '../utils/toast.js';
import { addAuditLog } from '../utils/siteImagesStore.js';
import { getProperties } from '../utils/propertiesStore.js';

function filterVisitsForActiveUser(visits = []) {
  if (!Array.isArray(visits)) return [];
  const active = getActiveAdminUser();
  if (!active || canViewAllLeads(active)) return visits;

  const activeName = (active.fullName || active.name || '').trim().toLowerCase();
  const activeFirstName = activeName.split(' ')[0];

  return visits.filter(v => {
    if (!v) return false;
    const assigned = (v.assignedTo || '').trim().toLowerCase();
    if (!assigned || assigned === '—' || assigned === '-' || assigned === 'unassigned' || assigned === 'none') return false;
    if (assigned === activeName || assigned === activeFirstName) return true;
    if (activeName && (assigned.includes(activeName) || activeName.includes(assigned))) return true;
    if (activeFirstName && activeFirstName.length >= 3 && (assigned.includes(activeFirstName) || activeFirstName.includes(assigned))) return true;
    return false;
  });
}

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

  // Generate initial client name options from local storage / cache
  let localLeads = [];
  try { localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || []; } catch(e) {}
  let clientOptionsHtml = '';
  if (localLeads.length > 0) {
    localLeads.forEach((l, idx) => {
      const cName = l.name || l.title;
      const lId = l.id || `LEAD-${1000 + idx}`;
      if (cName) {
        clientOptionsHtml += `<option value="[ID: ${lId}] ${cName} (${l.phone || l.mobile || 'CRM Lead'})"></option>`;
      }
    });
  } else {
    clientOptionsHtml += `
      <option value="[ID: LEAD-1001] Senthil Kumar (+91 98424 12345)"></option>
      <option value="[ID: LEAD-1002] Kavitha R. (+91 97890 23456)"></option>
      <option value="[ID: LEAD-1003] Ramesh Raja (+91 94431 34567)"></option>
      <option value="[ID: LEAD-1004] Priya Dharshini (+91 96290 45678)"></option>
      <option value="[ID: LEAD-1005] Maheshwari (+91 95000 56789)"></option>
    `;
  }

  // Generate initial property options from propertiesStore
  const localProps = getProperties() || [];
  let propertyOptionsHtml = '';
  if (localProps.length > 0) {
    localProps.forEach(p => {
      const pId = p.id || 'TP-2001';
      propertyOptionsHtml += `<option value="[ID: ${pId}] ${p.title} (${p.location || p.district || 'Thanjavur'})"></option>`;
    });
  } else {
    propertyOptionsHtml += `
      <option value="[ID: TP-2001] Plot in Thanjavur (Thanjavur)"></option>
      <option value="[ID: TP-2002] Villa in Thanjavur (Thanjavur)"></option>
      <option value="[ID: TP-2003] Apartment in Thoothukudi (Thoothukudi)"></option>
      <option value="[ID: TP-2004] Agricultural Farmland (Kumbakonam)"></option>
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
    <div class="os-modal-overlay" id="site-visits-schedule-modal" style="overflow-y: auto;">
      <div class="os-modal-card" style="max-width: 480px; margin: 40px auto;">
        <div class="os-modal-header">
          <h2>Schedule site visit</h2>
          <button class="os-modal-close" id="close-sv-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group" style="margin-bottom: 16px; position: relative;">
            <label>Client name / Lead *</label>
            <input type="text" id="sv-client-name" list="client-datalist" class="os-input" placeholder="Type or select client name / ID..." style="width: 100%; background: #ffffff; padding: 10px 14px; border: 1px solid var(--os-border-color, #cbd5e1); border-radius: 8px;" required />
            <datalist id="client-datalist">
              ${clientOptionsHtml}
            </datalist>
          </div>
          <div class="form-group" style="margin-bottom: 16px; position: relative;">
            <label>Property *</label>
            <input type="text" id="sv-property" list="property-datalist" class="os-input" placeholder="Type or select property title / ID..." style="width: 100%; background: #ffffff; padding: 10px 14px; border: 1px solid var(--os-border-color, #cbd5e1); border-radius: 8px;" required />
            <datalist id="property-datalist">
              ${propertyOptionsHtml}
            </datalist>
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
  // Populate dynamic Admin Staff in dropdown
  const assignedSelect = document.getElementById('sv-assigned-to');
  if (assignedSelect) {
    const activeUsers = getAdminUsers().filter(u => u.status === 'Active' || !u.status);
    if (activeUsers.length > 0) {
      assignedSelect.innerHTML = activeUsers.map(u => 
        `<option value="${u.fullName} (${u.role || 'Staff'})">${u.fullName} (${u.role || 'Staff'})</option>`
      ).join('');
    }
  }

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
            const n = typeof v.notes === 'string' ? JSON.parse(v.notes) : v.notes; 
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

  // Populate dynamic DB Leads in Client datalist
  fetchFromAPI('/leads')
    .then(leads => {
      const clientDatalist = document.getElementById('client-datalist');
      if (clientDatalist && Array.isArray(leads) && leads.length > 0) {
        let opts = '';
        leads.slice(0, 250).forEach((l, idx) => {
          const cName = l.name || l.title;
          const lId = l.id || `LEAD-${1000 + idx}`;
          if (cName) {
            opts += `<option value="[ID: ${lId}] ${cName} (${l.phone || l.mobile || 'DB Lead'})"></option>`;
          }
        });
        clientDatalist.innerHTML = opts;
      }
    }).catch(e => {});

  // Populate dynamic DB Properties in Property datalist
  fetchFromAPI('/properties')
    .then(props => {
      const propDatalist = document.getElementById('property-datalist');
      if (propDatalist && Array.isArray(props) && props.length > 0) {
        let opts = '';
        props.forEach(p => {
          const pId = p.id || 'TP-2001';
          opts += `<option value="[ID: ${pId}] ${p.title} (${p.location || p.district || 'Thanjavur'})"></option>`;
        });
        propDatalist.innerHTML = opts;
      }
    }).catch(e => {});



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
    const visibleVisits = filterVisitsForActiveUser(visits);
    const days = document.querySelectorAll('.cal-day:not(.muted)');
    days.forEach(day => {
      const dayNum = day.dataset.day;
      const monthStr = monthNames[currentMonth];
      // Only show dots for the current month and year
      const hasVisit = visibleVisits.some(v => parseInt(v.date) === parseInt(dayNum) && v.month === monthStr);
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
    
    const visibleVisits = filterVisitsForActiveUser(visits);
    const dayVisits = visibleVisits.filter(v => parseInt(v.date) === parseInt(day) && v.month === monthStr);
    
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
      // Auto-prefill the visit datetime with currently selected date & default 10:00 AM
      const dtInput = document.getElementById('sv-datetime');
      if (dtInput) {
        const selD = new Date(currentYear, currentMonth, selectedDay, 10, 0, 0);
        const yyyy = selD.getFullYear();
        const mm = String(selD.getMonth() + 1).padStart(2, '0');
        const dd = String(selD.getDate()).padStart(2, '0');
        const hh = String(selD.getHours()).padStart(2, '0');
        const min = String(selD.getMinutes()).padStart(2, '0');
        dtInput.value = `${yyyy}-${mm}-${dd}T${hh}:${min}`;
      }
      svModal.classList.add('show');
    });
  }

  const closeSvModal = () => { if (svModal) svModal.classList.remove('show'); };
  
  if (closeSvBtn) closeSvBtn.addEventListener('click', closeSvModal);
  if (cancelSvBtn) cancelSvBtn.addEventListener('click', closeSvModal);
  if (confirmSvBtn) {
    confirmSvBtn.addEventListener('click', () => {
      let rawClient = document.getElementById('sv-client-name').value.trim();
      let rawProp = document.getElementById('sv-property').value.trim();
      let datetime = document.getElementById('sv-datetime').value;
      const assignedTo = document.getElementById('sv-assigned-to')?.value || 'Vijayaraghavan (Super Admin)';

      if (!rawClient) {
        showAlertModal({
          title: 'Client Name Required',
          message: 'Please enter or select a <strong>Client Name / Lead</strong> for the site visit.',
          type: 'warning'
        });
        return;
      }

      // If datetime was omitted, fallback to currently selected date at 10:00 AM
      if (!datetime) {
        const selD = new Date(currentYear, currentMonth, selectedDay, 10, 0, 0);
        const yyyy = selD.getFullYear();
        const mm = String(selD.getMonth() + 1).padStart(2, '0');
        const dd = String(selD.getDate()).padStart(2, '0');
        datetime = `${yyyy}-${mm}-${dd}T10:00`;
      }

      // Clean client name and phone from datalist format "[ID: LEAD-1001] Client Name (+91 98424 12345)"
      let cleanClientName = rawClient;
      let clientPhone = 'Site Visit';
      if (rawClient.includes('[ID:') || rawClient.includes(']')) {
        const afterBracket = rawClient.split(']')[1] || rawClient;
        const phoneMatch = afterBracket.match(/\(([^)]+)\)/);
        if (phoneMatch) {
          clientPhone = phoneMatch[1].trim();
          cleanClientName = afterBracket.replace(/\([^)]+\)/, '').trim();
        } else {
          cleanClientName = afterBracket.trim();
        }
      }

      // Clean property from datalist format "[ID: TP-2001] Title (Location)"
      let cleanProperty = rawProp || 'Thanjavur Verified Property';
      if (rawProp.includes('[ID:') || rawProp.includes(']')) {
        cleanProperty = (rawProp.split(']')[1] || rawProp).trim();
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
        leadId: cleanClientName,
        propertyId: cleanProperty,
        visitDate: datetime.replace('T', ' ') + ':00',
        status: 'Scheduled',
        assignedTo: assignedTo,
        notes: JSON.stringify({ clientName: cleanClientName, phone: clientPhone, property: cleanProperty, assignedTo })
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
        hours: hours.toString().padStart(2, '0'),
        mins: mins,
        ampm: ampm,
        clientName: cleanClientName,
        phone: clientPhone,
        property: cleanProperty,
        assignedTo: assignedTo,
        isNew: true
      });

      try {
        localStorage.setItem('thanjai_visits', JSON.stringify(visits));
      } catch (e) {}

      addAuditLog({
        action: `Scheduled Site Visit (${cleanClientName})`,
        module: 'Site Visits',
        details: `Scheduled property tour for ${cleanClientName} at ${cleanProperty} assigned to ${assignedTo} on ${day} ${monthNames[dateObj.getMonth()]} ${dateObj.getFullYear()} at ${hours}:${mins} ${ampm}.`
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
