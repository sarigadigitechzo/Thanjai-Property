export function renderLeadsView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex" style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; background: rgba(247,147,26,0.1); border-radius: var(--os-radius-md); display: flex; align-items: center; justify-content: center; color: var(--os-luxury-orange); font-size: 1.5rem;">
            <i class="ri-team-line"></i>
          </div>
          <div>
            <h1 class="view-title">CRM Pipeline</h1>
            <p class="view-subtitle">Track leads from first contact through to conversion</p>
          </div>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-secondary" id="btn-import-csv"><i class="ri-upload-cloud-2-line"></i> Import CSV</button>
          <button class="os-btn-secondary" id="btn-sample-csv" style="border: none; background: transparent;"><i class="ri-download-line"></i> Sample CSV</button>
          <button class="os-btn-secondary" id="btn-export-csv"><i class="ri-download-cloud-2-line"></i> Export CSV</button>
          <button class="os-btn-primary" id="open-new-lead-btn" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);"><i class="ri-add-line"></i> New lead</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="os-filter-bar" style="background: transparent; padding: 0; box-shadow: none; border: none; margin-bottom: 24px; display: flex; gap: 16px; flex-wrap: nowrap;">
        <div class="search-box" style="flex: 1; max-width: 300px; background: var(--os-white); border: var(--os-border-thin); border-radius: var(--os-radius-sm);">
          <i class="ri-search-line"></i>
          <input type="text" id="filter-search" placeholder="Search name / phone / email..." style="background: transparent;" />
        </div>
        
        <!-- Custom Selects -->
        <div class="os-custom-select" id="filter-status">
          <div class="select-value">All statuses</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
            <div class="select-option selected">All statuses</div>
            <div class="select-option">New</div>
            <div class="select-option">Contacted</div>
            <div class="select-option">Property Shared</div>
            <div class="select-option">Follow Up</div>
            <div class="select-option">Interested</div>
            <div class="select-option">Negotiation</div>
            <div class="select-option">Converted</div>
          </div>
        </div>

        <div class="os-custom-select" id="filter-source">
          <div class="select-value">All sources</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
            <div class="select-option selected">All sources</div>
            <div class="select-option">Visa Form</div>
            <div class="select-option">Website Form</div>
            <div class="select-option">Manual</div>
            <div class="select-option">Referral</div>
            <div class="select-option">Whatsapp</div>
            <div class="select-option">Import</div>
            <div class="select-option">Partner</div>
            <div class="select-option">Meta Ads</div>
          </div>
        </div>

        <div class="os-custom-select" id="filter-type">
          <div class="select-value">All property types</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
            <div class="select-option selected">All property types</div>
            <div class="select-option">Apartment</div>
            <div class="select-option">Villa</div>
            <div class="select-option">Townhouse</div>
            <div class="select-option">Penthouse</div>
            <div class="select-option">Studio</div>
            <div class="select-option">Plot</div>
            <div class="select-option">Office</div>
            <div class="select-option">Retail</div>
            <div class="select-option">Warehouse</div>
            <div class="select-option">Other</div>
          </div>
        </div>

        <div class="os-custom-select" id="filter-staff">
          <div class="select-value">All staff</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
            <div class="select-option selected">All staff</div>
${(() => {
              const adminUsers = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
              let html = '';
              if (adminUsers.length > 0) {
                adminUsers.filter(u => u.status === 'Active').forEach(u => {
                  html += `<div class="select-option">${u.fullName}</div>`;
                });
              } else {
                html += `<div class="select-option" style="color:var(--os-gray-400);">No staff found</div>`;
              }
              return html;
            })()}
          </div>
        </div>

        <label class="filter-toggle" style="background: var(--os-white); border: var(--os-border-thin); padding: 0 16px; border-radius: var(--os-radius-sm); height: 42px; display: flex; align-items: center; cursor: pointer;">
          <input type="checkbox" id="filter-due" style="accent-color: var(--os-luxury-orange);" /> <span style="margin-left: 8px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-600);">Due</span>
        </label>
      </div>

      <!-- Table View -->
      <div class="os-table-container" style="background: var(--os-white); border: var(--os-border-thin); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft); overflow-x: auto;">
        <table class="os-table" style="width: 100%; border-collapse: collapse; min-width: 900px;">
          <thead>
            <tr>
              <th>LEAD</th>
              <th>REQUIREMENT</th>
              <th>BUDGET</th>
              <th>SOURCE</th>
              <th>STATUS</th>
              <th>ASSIGNED</th>
              <th>FOLLOW-UP</th>
              <th style="text-align: right;">ACTIONS</th>
            </tr>
          </thead>
          <tbody id="leads-table-body">
            <!-- Dynamic Content -->
          </tbody>
        </table>
      </div>

      <!-- Pagination Footer -->
      <div class="os-pagination-bar" style="display: flex; align-items: center; justify-content: space-between; margin-top: 16px; padding: 12px 20px; background: var(--os-white); border: var(--os-border-thin); border-radius: var(--os-radius-lg); font-size: 0.9rem; color: var(--os-gray-600); flex-wrap: wrap; gap: 12px;">
        <div id="leads-pagination-info" style="font-weight: 500;">Showing 0 of 0 leads</div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <button id="leads-prev-btn" class="os-btn-secondary" style="padding: 6px 14px; font-size: 0.85rem; cursor: pointer;"><i class="ri-arrow-left-s-line"></i> Prev</button>
          <span id="leads-page-indicator" style="font-weight: 600; padding: 0 4px;">Page 1 of 1</span>
          <button id="leads-next-btn" class="os-btn-secondary" style="padding: 6px 14px; font-size: 0.85rem; cursor: pointer;">Next <i class="ri-arrow-right-s-line"></i></button>
          <select id="leads-page-size" style="margin-left: 8px; padding: 6px 10px; border: var(--os-border-thin); border-radius: var(--os-radius-sm); background: var(--os-white); font-family: inherit; font-size: 0.85rem; color: var(--os-gray-600); cursor: pointer;">
            <option value="25" selected>25 / page</option>
            <option value="50">50 / page</option>
            <option value="100">100 / page</option>
            <option value="500">500 / page</option>
          </select>
        </div>
      </div>

    </div>
    
    <!-- New Lead / Edit Lead Modal -->
    <div class="os-modal-overlay" id="new-lead-modal">
      <div class="os-modal-card">
        <div class="os-modal-header">
          <h2 id="modal-title">New lead</h2>
          <button class="os-modal-close" id="close-new-lead-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <form id="new-lead-form">
            <input type="hidden" id="lead-id" />
            <!-- CONTACT -->
            <div class="form-section-title">CONTACT</div>
            <div class="form-row">
              <div class="form-group">
                <label>Full name *</label>
                <input type="text" id="lead-name" required />
              </div>
              <div class="form-group">
                <label>Mobile *</label>
                <input type="text" id="lead-mobile" placeholder="10-digit number" required maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>WhatsApp number</label>
                <input type="text" id="lead-whatsapp" placeholder="defaults to mobile" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="lead-email" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Country</label>
                <input type="text" id="lead-country" />
              </div>
              <div class="form-group">
                <label>City</label>
                <input type="text" id="lead-city" />
              </div>
            </div>

            <!-- REQUIREMENT -->
            <div class="form-section-title">REQUIREMENT</div>
            <div class="form-row">
              <div class="form-group">
                <label>Preferred area</label>
                <input type="text" id="lead-area" />
              </div>
              <div class="form-group">
                <label>Property type</label>
                <div class="os-custom-select modal-select" id="lead-type-select">
                  <div class="select-value">Any</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option selected">Any</div>
                    <div class="select-option">Apartment</div>
                    <div class="select-option">Villa</div>
                    <div class="select-option">Townhouse</div>
                    <div class="select-option">Penthouse</div>
                    <div class="select-option">Studio</div>
                    <div class="select-option">Plot</div>
                    <div class="select-option">Office</div>
                    <div class="select-option">Retail</div>
                    <div class="select-option">Warehouse</div>
                    <div class="select-option">Other</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Budget min</label>
                <input type="text" id="lead-budget-min" />
              </div>
              <div class="form-group">
                <label>Budget max</label>
                <input type="text" id="lead-budget-max" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Currency</label>
                <div class="os-custom-select modal-select" id="lead-currency-select">
                  <div class="select-value">INR</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option selected">INR</div>
                    <div class="select-option">USD</div>
                    <div class="select-option">EUR</div>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Bedrooms</label>
                <input type="text" id="lead-bedrooms" />
              </div>
            </div>

            <!-- TRACKING -->
            <div class="form-section-title">TRACKING</div>
            <div class="form-row">
              <div class="form-group">
                <label>Source</label>
                <input type="text" id="lead-source" placeholder="e.g. Manual, Walk-in, Referral, Instagram, Meta Ads..." value="Manual" />
              </div>
              <div class="form-group">
                <label>Priority</label>
                <div class="os-custom-select modal-select" id="lead-priority-select">
                  <div class="select-value">Medium</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option">High</div>
                    <div class="select-option selected">Medium</div>
                    <div class="select-option">Low</div>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Assign to</label>
                <div class="os-custom-select modal-select" id="lead-assign-select">
                  <div class="select-value">Unassigned</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option selected">Unassigned</div>
${(() => {
              const adminUsers = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
              let html = '';
              if (adminUsers.length > 0) {
                adminUsers.filter(u => u.status === 'Active').forEach(u => {
                  html += `<div class="select-option">${u.fullName}</div>`;
                });
              } else {
                html += `<div class="select-option" style="color:var(--os-gray-400);">No staff found</div>`;
              }
              return html;
            })()}
                  </div>
                </div>
              </div>
              <div class="form-group">
                <label>Follow-up Date</label>
                <input type="date" id="lead-followup" style="color: var(--os-gray-600);" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" style="width: 100%;">
                <label>Requirement notes</label>
                <textarea id="lead-notes" rows="3" style="width: 100%; border: var(--os-border-thin); border-radius: var(--os-radius-sm); padding: 12px; font-family: inherit; resize: vertical;"></textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-new-lead-btn">Cancel</button>
          <button class="os-btn-primary" id="btn-save-lead" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);">Create lead</button>
        </div>
        </div>
      </div>
    </div>
  `;
}

import { fetchFromAPI } from '../utils/api.js';
import { showToast, showConfirmModal, showAlertModal } from '../utils/toast.js';
import { addAuditLog } from '../utils/siteImagesStore.js';
let cachedLeads = [];
let currentPage = 1;
let pageSize = 25;

// Reusable mapping function: converts raw DB row → rich lead object
function mapLeadFromAPI(l) {
  let mobile = l.phone || l.mobile || '';
  let budget = l.budget || l.budgetMax || '';
  let type = l.requirement || l.propertyType || l.type || 'Residential Plot';
  let loc = l.location || l.city || 'Thanjavur';
  const locParts = loc.split(',').map(s => s.trim());

  let extractedPropId = l.propertyId || l.propertyMatch || '';
  if (!extractedPropId) {
    const rawTimelineStr = typeof l.timeline === 'string' ? l.timeline : JSON.stringify(l.timeline || []);
    const rawNotesStr = typeof l.notes === 'string' ? l.notes : JSON.stringify(l.notes || []);
    const match = rawTimelineStr.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/i) || rawNotesStr.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/i);
    if (match) extractedPropId = match[1].toUpperCase();
  }

  let detectedSource = l.source || 'Contact Enquiry';
  if (extractedPropId) {
    detectedSource = 'Property Inquiry';
  }

  return {
    id: l.id,
    name: l.name || 'Unnamed Lead',
    phone: mobile,
    mobile: mobile,
    whatsapp: l.whatsapp || mobile,
    email: l.email || '',
    country: l.country || (locParts.length >= 3 ? locParts[locParts.length - 1] : 'India'),
    city: locParts.length >= 2 ? locParts[locParts.length - 2] : (locParts[0] || l.city || 'Thanjavur'),
    area: locParts[0] || loc,
    location: loc,
    budgetMin: l.budgetMin || '',
    budgetMax: budget,
    budget: budget,
    bedrooms: l.bedrooms || '',
    notes: l.notes ? (typeof l.notes === 'string' && l.notes.startsWith('[') ? (tryParseJSON(l.notes) || l.notes) : l.notes) : '',
    type: type,
    propertyType: type,
    requirement: type,
    source: detectedSource,
    assignTo: l.assignedTo || l.assignTo || 'Unassigned',
    assignedTo: l.assignedTo || l.assignTo || 'Unassigned',
    status: l.status || 'New Lead',
    followup: l.followup || '—',
    propertyId: extractedPropId,
    propertyMatch: extractedPropId,
    createdAt: (() => {
      const rawD = l.createdAt || l.created_at || l.created || l.date || l.timestamp;
      if (!rawD) return Date.now();
      if (typeof rawD === 'number') return rawD;
      const parsedNum = Number(rawD);
      if (!isNaN(parsedNum) && parsedNum > 1000000) return parsedNum;
      const parsedD = new Date(String(rawD)).getTime();
      return !isNaN(parsedD) ? parsedD : Date.now();
    })(),
    timeline: l.timeline
      ? (typeof l.timeline === 'string' && l.timeline.startsWith('[') ? (tryParseJSON(l.timeline) || []) : (Array.isArray(l.timeline) ? l.timeline : []))
      : []
  };
}

function tryParseJSON(str) {
  try { return JSON.parse(str); } catch (e) { return null; }
}

// Data Store Initializer
export async function initLeadsView() {
  try {
    const data = await fetchFromAPI('/leads');
    if (data && Array.isArray(data)) {
      cachedLeads = data.map(mapLeadFromAPI);
      saveLeads(cachedLeads);
    }
  } catch (err) {
    console.error('API Error:', err);
    cachedLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  }
  
  // Call init logic that binds events
  bindLeadEvents();
  renderTable();
}

function getLeads() {
  return cachedLeads;
}

function saveLeads(leads) {
  cachedLeads = leads;
  try {
    localStorage.setItem('thanjai_leads', JSON.stringify(leads.slice(0, 100)));
  } catch (err) {
    console.warn('LocalStorage quota notice:', err);
  }
}

function formatCurrency(val) {
  if (!val) return '—';
  if (typeof val === 'string' && (val.includes('Lakh') || val.includes('Crore') || val.includes('-') || val.includes('₹'))) {
    return val.startsWith('₹') ? val : '₹ ' + val;
  }
  let num = parseFloat(String(val).replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return typeof val === 'string' && val.trim() ? val : '—';
  if (num >= 10000000) {
    return '₹ ' + (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Crore';
  }
  if (num >= 100000) {
    return '₹ ' + (num / 100000).toFixed(2).replace(/\.00$/, '') + ' Lakhs';
  }
  return '₹ ' + num.toLocaleString('en-IN');
}

function renderTable() {
  const tbody = document.getElementById('leads-table-body');
  if (!tbody) return;
  let leads = getLeads();
  
  // Apply filters
  const searchEl = document.getElementById('filter-search');
  const statusEl = document.getElementById('filter-status');
  const sourceEl = document.getElementById('filter-source');
  const typeEl = document.getElementById('filter-type');
  const staffEl = document.getElementById('filter-staff');
  const dueEl = document.getElementById('filter-due');

  if (searchEl && statusEl) {
    const q = searchEl.value.toLowerCase();
    const fStatus = statusEl.querySelector('.select-value').textContent;
    const fSource = sourceEl.querySelector('.select-value').textContent;
    const fType = typeEl.querySelector('.select-value').textContent;
    const fStaff = staffEl.querySelector('.select-value').textContent;
    const fDue = dueEl.checked;

    leads = leads.filter(lead => {
      // Search
      if (q) {
        const str = `${lead.name || ''} ${lead.mobile || ''} ${lead.email || ''} ${lead.type || ''} ${lead.area || ''} ${lead.source || ''} ${lead.status || ''} ${lead.assignTo || ''}`.toLowerCase();
        if (!str.includes(q)) return false;
      }
      // Dropdowns
      if (fStatus !== 'All statuses' && lead.status !== fStatus) return false;
      if (fSource !== 'All sources' && lead.source !== fSource) return false;
      if (fType !== 'All property types' && lead.type !== fType) return false;
      if (fStaff !== 'All staff' && lead.assignTo !== fStaff) return false;
      
      // Due Checkbox
      if (fDue) {
        if (!lead.followup || lead.followup === '—') return false;
      }
      
      return true;
    });
  }

  const totalLeads = leads.length;
  const totalPages = Math.max(1, Math.ceil(totalLeads / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  if (currentPage < 1) currentPage = 1;

  const startIdx = (currentPage - 1) * pageSize;
  const endIdx = Math.min(startIdx + pageSize, totalLeads);
  const pagedLeads = leads.slice(startIdx, endIdx);

  // Pagination UI Update
  const infoEl = document.getElementById('leads-pagination-info');
  const pageIndEl = document.getElementById('leads-page-indicator');
  const prevBtn = document.getElementById('leads-prev-btn');
  const nextBtn = document.getElementById('leads-next-btn');

  if (infoEl) {
    infoEl.innerHTML = totalLeads > 0 
      ? `Showing <strong>${startIdx + 1}</strong> - <strong>${endIdx}</strong> of <strong>${totalLeads.toLocaleString()}</strong> leads`
      : 'No leads found';
  }
  if (pageIndEl) pageIndEl.textContent = `Page ${currentPage} of ${totalPages.toLocaleString()}`;
  if (prevBtn) prevBtn.disabled = currentPage <= 1;
  if (nextBtn) nextBtn.disabled = currentPage >= totalPages;

  if (pagedLeads.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; padding: 40px; color: var(--os-gray-400);">No matching leads found</td></tr>`;
    return;
  }

  tbody.innerHTML = pagedLeads.map(lead => {
    let reqVal = lead.type || lead.propertyType || lead.requirement || '—';
    if (reqVal === 'undefined' || reqVal === 'null') reqVal = '—';
    let requirementHtml = `<div style="font-weight: 500; color: var(--os-gray-600);">${reqVal !== 'Any' ? reqVal : '—'}</div>`;
    if (lead.area || lead.location) {
      requirementHtml += `<div style="font-size: 0.85rem; color: var(--os-gray-400);">${lead.area || lead.location}</div>`;
    }

    let budgetStr = '—';
    if (lead.budgetMax || lead.budget) {
      budgetStr = formatCurrency(lead.budgetMax || lead.budget);
    } else if (lead.budgetMin) {
      budgetStr = `Min ${formatCurrency(lead.budgetMin)}`;
    }

    let statusColor = 'badge-gray';
    let statusTxt = lead.status ? lead.status.toUpperCase() : 'NEW';
    if (statusTxt.includes('CONTACTED')) statusColor = 'badge-cyan';
    else if (statusTxt.includes('FOLLOW UP')) statusColor = 'badge-yellow';
    else if (statusTxt.includes('NEGOTIATION')) statusColor = 'badge-orange';
    else if (statusTxt.includes('CONVERTED')) statusColor = 'badge-cyan';
    
    const propId = lead.propertyId || lead.propertyMatch;
    let rawSource = (lead.source || 'MANUAL').toUpperCase();
    let sourceTxt = 'CONTACT ENQUIRY';
    if (propId || rawSource.includes('PROPERTY') || rawSource.includes('VISIT')) {
      sourceTxt = 'PROPERTY INQUIRY';
    } else {
      sourceTxt = 'CONTACT ENQUIRY';
    }
    let propBadgeHtml = '';
    if (propId) {
      propBadgeHtml = `
        <div style="margin-top: 4px;">
          <span class="prop-id-badge" data-propid="${propId}" style="background: #ea580c; color: #ffffff; padding: 3px 8px; border-radius: 4px; font-size: 0.72rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.15);" title="Click to view Property ${propId}">
            <i class="ri-building-fill"></i> Property ${propId}
          </span>
        </div>
      `;
    }

    let assignedHtml = `<td style="color: var(--os-gray-400);">—</td>`;
    if (lead.assignTo && lead.assignTo !== 'Unassigned') {
       let names = lead.assignTo.split(' ');
       assignedHtml = `<td>
         <div style="font-weight: 500; color: var(--os-gray-600);">${names[0]}</div>
         <div style="font-size: 0.85rem; color: var(--os-gray-400);">${names[1] || ''}</div>
       </td>`;
    }

    let createdDateStr = '—';
    const rawCd = lead.createdAt || lead.created_at || lead.created || lead.date;
    if (rawCd) {
      try {
        const cd = typeof rawCd === 'number' ? new Date(rawCd) : (isNaN(Number(rawCd)) ? new Date(String(rawCd)) : new Date(Number(rawCd)));
        if (!isNaN(cd.getTime())) {
          createdDateStr = cd.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } else {
          createdDateStr = String(rawCd);
        }
      } catch(e) {
        createdDateStr = String(rawCd);
      }
    }

    return `
      <tr data-id="${lead.id}">
        <td>
          <div class="action-view" style="font-weight: 600; color: var(--os-luxury-orange); cursor: pointer;">${lead.name}</div>
          <div style="font-size: 0.85rem; color: var(--os-gray-400);">${lead.mobile || lead.phone || '—'}</div>
          ${propBadgeHtml}
          <div style="font-size: 0.78rem; color: #ea580c; font-weight: 600; margin-top: 2px; display: inline-flex; align-items: center; gap: 4px;" title="Enquiry Date">
            <i class="ri-calendar-event-line" style="font-size: 0.75rem;"></i> ${createdDateStr}
          </div>
        </td>
        <td>
          ${requirementHtml}
        </td>
        <td style="color: var(--os-gray-600); font-weight: 500;">${budgetStr}</td>
        <td><span class="os-badge badge-gray">${sourceTxt}</span></td>
        <td><span class="os-badge ${statusColor}">${statusTxt}</span></td>
        ${assignedHtml}
        <td style="color: var(--os-gray-400);">${lead.followup || '—'}</td>
        <td style="text-align: right;">
          <div class="action-icons">
            <i class="ri-eye-line action-view"></i>
            <i class="ri-pencil-line action-edit"></i>
            <i class="ri-delete-bin-line action-delete"></i>
          </div>
        </td>
        </tr>
    `;
  }).join('');
}

function bindLeadEvents() {
  // Initialize Custom Selects
  const customSelects = document.querySelectorAll('.os-custom-select');
  
  customSelects.forEach(select => {
    select.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close others
      customSelects.forEach(other => {
        if (other !== select) other.classList.remove('open');
      });
      select.classList.toggle('open');
    });

    const options = select.querySelectorAll('.select-option');
    const valueDisplay = select.querySelector('.select-value');

    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        valueDisplay.textContent = option.textContent;
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        select.classList.remove('open');
        // Trigger table re-render if a filter dropdown changes
        if (select.id && select.id.startsWith('filter-')) {
          currentPage = 1;
          renderTable();
        }
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('open'));
  });

  // Attach search, due checkbox and pagination event listeners
  const searchInput = document.getElementById('filter-search');
  if (searchInput) searchInput.addEventListener('input', () => { currentPage = 1; renderTable(); });
  
  const dueCheckbox = document.getElementById('filter-due');
  if (dueCheckbox) dueCheckbox.addEventListener('change', () => { currentPage = 1; renderTable(); });

  const prevBtn = document.getElementById('leads-prev-btn');
  const nextBtn = document.getElementById('leads-next-btn');
  const pageSizeSelect = document.getElementById('leads-page-size');

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentPage++;
      renderTable();
    });
  }

  if (pageSizeSelect) {
    pageSizeSelect.addEventListener('change', (e) => {
      pageSize = parseInt(e.target.value) || 25;
      currentPage = 1;
      renderTable();
    });
  }

  // Modal Logic
  const modal = document.getElementById('new-lead-modal');
  const openBtn = document.getElementById('open-new-lead-btn');
  const closeBtn = document.getElementById('close-new-lead-modal');
  const cancelBtn = document.getElementById('cancel-new-lead-btn');
  const saveBtn = document.getElementById('btn-save-lead');
  const form = document.getElementById('new-lead-form');
  const modalTitle = document.getElementById('modal-title');

  function openModal(isEdit = false) {
    if (!isEdit) {
      form.reset();
      document.getElementById('lead-id').value = '';
      document.getElementById('lead-followup').value = '';
      const srcInput = document.getElementById('lead-source');
      if (srcInput) srcInput.value = 'Manual';
      modalTitle.textContent = 'New lead';
      saveBtn.textContent = 'Create lead';
      // reset custom selects visually
      document.querySelectorAll('.modal-select').forEach(sel => {
         const firstOpt = sel.querySelector('.select-option');
         sel.querySelector('.select-value').textContent = firstOpt.textContent;
         sel.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
         firstOpt.classList.add('selected');
      });
    }
    modal.classList.add('show');
  }

  const closeModal = () => modal.classList.remove('show');

  if (openBtn) openBtn.addEventListener('click', () => openModal(false));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  // Save / Update Lead Logic
  if (saveBtn) {
    saveBtn.addEventListener('click', async () => {
      const name = document.getElementById('lead-name').value.trim();
      const mobile = document.getElementById('lead-mobile').value.trim();
      
      if (!name || !mobile) {
        showAlertModal({
          title: 'Missing Required Fields',
          message: 'Please enter both the <strong>Lead Name</strong> and <strong>Mobile Phone Number</strong> to proceed.',
          type: 'warning'
        });
        return;
      }

      const idField = document.getElementById('lead-id').value;
      const leads = getLeads();
      const leadToUpdate = idField ? leads.find(l => l.id == idField) : null;
      const type = document.getElementById('lead-type-select').querySelector('.select-value').textContent;
      const srcInput = document.getElementById('lead-source');
      const source = (srcInput ? srcInput.value.trim() : '') || 'Manual';
      const assignTo = document.getElementById('lead-assign-select').querySelector('.select-value').textContent;

      const area = document.getElementById('lead-area').value;
      const city = document.getElementById('lead-city').value;
      const country = document.getElementById('lead-country').value;
      const locationStr = [area, city, country].filter(Boolean).join(', ');

      const beds = document.getElementById('lead-bedrooms').value;
      const requirementStr = beds ? `${type} - ${beds} Beds` : type;

      const bMin = document.getElementById('lead-budget-min').value;
      const bMax = document.getElementById('lead-budget-max').value;
      const budgetStr = bMin && bMax ? `${bMin} - ${bMax}` : (bMax || bMin || '');

      const timeline_author = (() => {
        try {
          const u = JSON.parse(localStorage.getItem('thanjai_active_user') || '{}');
          return u.fullName || u.name || 'System';
        } catch(e) { return 'System'; }
      })();

      const leadData = {
        id: idField ? idField : 'L-' + Math.floor(1000 + Math.random() * 9000),
        name: name,
        phone: mobile,
        email: document.getElementById('lead-email').value,
        source: source,
        status: idField ? (leadToUpdate ? leadToUpdate.status : 'New Lead') : 'New Lead',
        budget: budgetStr,
        requirement: requirementStr,
        location: locationStr,
        timeline: idField ? (leadToUpdate ? (typeof leadToUpdate.timeline === 'string' ? leadToUpdate.timeline : JSON.stringify(leadToUpdate.timeline || [])) : '[]') : JSON.stringify([{ type: 'pipeline', message: 'Lead created', author: timeline_author, date: new Date().toISOString() }]),
        followup: document.getElementById('lead-followup').value || '—',
        assignedTo: assignTo,
        notes: idField ? (leadToUpdate ? (typeof leadToUpdate.notes === 'string' ? leadToUpdate.notes : JSON.stringify(leadToUpdate.notes || [])) : '[]') : document.getElementById('lead-notes').value,
        // Keep original fields for local app usage if needed
        mobile: mobile,
        whatsapp: document.getElementById('lead-whatsapp').value,
        country: country,
        city: city,
        area: area,
        budgetMin: bMin,
        budgetMax: bMax,
        bedrooms: beds,
        type: type,
        assignTo: assignTo,
        createdAt: idField ? (leadToUpdate ? leadToUpdate.createdAt : Date.now()) : Date.now()
      };

      // Always save to localStorage first so UI updates immediately
      const existingLeads = getLeads();
      if (idField) {
        const idx = existingLeads.findIndex(l => String(l.id) === String(idField));
        if (idx !== -1) existingLeads[idx] = { ...existingLeads[idx], ...leadData };
      } else {
        existingLeads.unshift(leadData);
      }
      saveLeads(existingLeads);

      addAuditLog({
        action: idField ? `Updated Lead (${name})` : `Added New Lead (${name})`,
        module: 'CRM Pipeline',
        details: idField 
          ? `Updated lead requirements for ${name} (${mobile}) to ${requirementStr} in ${locationStr}.` 
          : `Created new lead ${name} (${mobile}) with requirement ${requirementStr} in ${locationStr}.`
      });

      renderTable();
      closeModal();
      showToast(idField ? `Lead "${name}" updated!` : `New lead "${name}" added!`, 'ri-checkbox-circle-fill');

      // Then sync to DB in background
      const url = idField ? '/leads/' + idField : '/leads';
      fetchFromAPI(url, {
        method: idField ? 'PUT' : 'POST',
        body: JSON.stringify(leadData)
      }).then(async () => {
        const fresh = await fetchFromAPI('/leads');
        if (fresh && Array.isArray(fresh)) saveLeads(fresh.map(mapLeadFromAPI));
      }).catch(err => {
        console.warn('DB sync failed, saved locally only:', err);
      });
    });
  }

  // Local CSV Import/Export Logic
  const importBtn = document.getElementById('btn-import-csv');
  const sampleBtn = document.getElementById('btn-sample-csv');
  const exportBtn = document.getElementById('btn-export-csv');

  // Hidden file input for importing
  let fileInput = document.getElementById('csv-file-input');
  if (!fileInput) {
    fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.id = 'csv-file-input';
    fileInput.accept = '.csv';
    fileInput.style.display = 'none';
    document.body.appendChild(fileInput);
  }

  if (importBtn) {
    importBtn.addEventListener('click', () => {
      fileInput.click();
    });
  }

  fileInput.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async function(evt) {
      const text = evt.target.result;
      const rows = text.split('\n').map(r => r.trim()).filter(Boolean);
      if (rows.length < 2) {
        showAlertModal({
          title: 'Empty or Invalid CSV',
          message: 'The selected CSV file appears to be empty or missing property data rows.',
          type: 'error'
        });
        return;
      }
      
      const headerCols = rows[0].split(',').map(c => c.replace(/^["']|["']$/g, '').trim().toLowerCase());
      const getColIdx = (names) => {
        for (let name of names) {
          const idx = headerCols.findIndex(h => h.includes(name));
          if (idx !== -1) return idx;
        }
        return -1;
      };

      const nameIdx = getColIdx(['name', 'lead', 'client']);
      const mobIdx = getColIdx(['mobile', 'phone', 'contact', 'whatsapp']);
      const emailIdx = getColIdx(['email', 'mail']);
      const typeIdx = getColIdx(['propertytype', 'type', 'requirement', 'property']);
      const budgetIdx = getColIdx(['budget', 'budgetmax', 'amount', 'price']);
      const locIdx = getColIdx(['location', 'area', 'city']);
      const sourceIdx = getColIdx(['source', 'lead source']);
      const statusIdx = getColIdx(['status']);
      const notesIdx = getColIdx(['notes', 'note', 'desc', 'remarks']);

      const newLeads = [];
      for (let i = 1; i < rows.length; i++) {
        const match = rows[i].match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
        const cols = match 
          ? match.map(c => c.replace(/^"|"$/g, '').trim())
          : rows[i].split(',').map(c => c.replace(/^"|"$/g, '').trim());

        const val = (idx, fallback = '') => (idx !== -1 && cols[idx] !== undefined ? cols[idx] : fallback);

        const name = val(nameIdx !== -1 ? nameIdx : 0);
        if (name && name.toLowerCase() !== 'name') {
          const mobile = val(mobIdx !== -1 ? mobIdx : 1, '9585777772');
          const email = val(emailIdx !== -1 ? emailIdx : 2, '');
          const propType = val(typeIdx !== -1 ? typeIdx : 3, 'Residential Plot');
          const budget = val(budgetIdx !== -1 ? budgetIdx : 4, '₹ 25 - 50 Lakhs');
          const location = val(locIdx !== -1 ? locIdx : 5, 'Thanjavur');
          const source = val(sourceIdx !== -1 ? sourceIdx : 6, 'Website Form');
          const status = val(statusIdx !== -1 ? statusIdx : 7, 'New Lead');
          const notes = val(notesIdx !== -1 ? notesIdx : 8, 'Imported from CSV template.');

          const leadObj = {
            id: `L-${Date.now()}-${i}`,
            name: name,
            mobile: mobile,
            phone: mobile,
            whatsapp: mobile,
            email: email,
            country: 'India',
            city: 'Thanjavur',
            area: location,
            location: location,
            budgetMin: '',
            budgetMax: budget,
            budget: budget,
            bedrooms: '',
            notes: notes,
            type: propType,
            propertyType: propType,
            requirement: propType,
            source: source,
            assignTo: 'Unassigned',
            status: status,
            followup: '—',
            createdAt: Date.now(),
            timeline: [{ action: 'Imported from CSV file', date: new Date().toLocaleDateString('en-IN'), by: 'System' }]
          };

          newLeads.push(leadObj);

          // Sync to backend API if available
          try {
            fetchFromAPI('/leads', {
              method: 'POST',
              body: JSON.stringify(leadObj)
            }).catch(e => console.warn(e));
          } catch (err) {}
        }
      }
      
      if (newLeads.length > 0) {
        const leads = getLeads();
        const updatedLeads = [...newLeads, ...leads];
        saveLeads(updatedLeads);
        renderTable();
        addAuditLog({
          action: `Bulk Imported Leads (${newLeads.length})`,
          module: 'CRM Pipeline',
          details: `Imported ${newLeads.length} new leads via CSV batch upload.`
        });
        showToast(`${newLeads.length} leads imported successfully into CRM!`, 'ri-checkbox-circle-fill');
      } else {
        showAlertModal({
          title: 'No Valid Records',
          message: 'No valid lead rows could be extracted from the uploaded CSV.',
          type: 'warning'
        });
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  });

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const csvContent = 'Name,Mobile,Email,PropertyType,Budget,Location,Source,Status,Notes\n"Arun Kumar","9842154321","arun.kumar@gmail.com","Luxury Villa","12500000","Medical College Road, Thanjavur","Website Form","New Lead","Looking for 3 or 4 BHK independent luxury villa near Medical College Road with car parking."\n"Priya Raman","9443219876","priya.raman@yahoo.com","Residential Plot","3500000","Trichy Road, Thanjavur","Phone Call","Contacted","Interested in DTCP approved East-facing corner plot near New Bus Stand bypass."';
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "Thanjai_CRM_Leads_Sample_Template.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const leads = getLeads();
      if (leads.length === 0) {
        showAlertModal({
          title: 'Export Notice',
          message: 'There are currently no active leads available to export.',
          type: 'info'
        });
        return;
      }
      let csvContent = "Name,Mobile,Email,PropertyType,BudgetMax,Source,Status,AssignedTo\n";
      leads.forEach(l => {
        csvContent += `${l.name || ''},${l.mobile || ''},${l.email || ''},${l.type || ''},${l.budgetMax || ''},${l.source || ''},${l.status || ''},${l.assignTo || ''}\n`;
      });
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "exported_leads.csv");
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
  }

  // Table Event Delegation (Edit, Delete, View)
  const tableContainer = document.querySelector('.os-table-container');
  if (tableContainer) {
    tableContainer.addEventListener('click', (e) => {
      const tr = e.target.closest('tr');
      if (!tr) return;
      const id = tr.getAttribute('data-id');
      const leads = getLeads();
      const lead = leads.find(l => l.id == id);
      if (!lead) return;

      if (e.target.closest('.action-view')) {
         window.location.hash = 'lead/' + id;
      } else if (e.target.closest('.action-edit')) {
         const notesField = document.getElementById('lead-notes');
         if (notesField) {
           notesField.value = '';
           notesField.disabled = false;
         }
         openModal(true);
         modalTitle.textContent = 'Edit lead';
         saveBtn.textContent = 'Save Changes';
         
         document.getElementById('lead-id').value = lead.id;
         document.getElementById('lead-name').value = lead.name || '';
         document.getElementById('lead-mobile').value = lead.mobile || '';
         document.getElementById('lead-whatsapp').value = lead.whatsapp || '';
         document.getElementById('lead-email').value = lead.email || '';
         document.getElementById('lead-country').value = lead.country || '';
         document.getElementById('lead-city').value = lead.city || '';
         document.getElementById('lead-area').value = lead.area || '';
         document.getElementById('lead-budget-min').value = lead.budgetMin || '';
         document.getElementById('lead-budget-max').value = lead.budgetMax || '';
         document.getElementById('lead-bedrooms').value = lead.bedrooms || '';
         if (notesField) {
           notesField.value = 'Notes are managed in the Lead Details page.';
           notesField.disabled = true;
         }
         document.getElementById('lead-followup').value = (lead.followup && lead.followup !== '—') ? lead.followup : '';
         
         // Set selects visually
         const typeSel = document.getElementById('lead-type-select');
         if(typeSel) typeSel.querySelector('.select-value').textContent = lead.type || 'Any';
         
         const srcInput = document.getElementById('lead-source');
         if(srcInput) srcInput.value = lead.source || 'Manual';

         const asnSel = document.getElementById('lead-assign-select');
         if(asnSel) asnSel.querySelector('.select-value').textContent = lead.assignTo || 'Unassigned';

      } else if (e.target.closest('.action-delete')) {
        showConfirmModal({
          title: 'Delete Lead',
          message: `Are you sure you want to permanently delete lead <strong>${lead.name}</strong> from the CRM Pipeline? This will remove all linked timeline and notes.`,
          confirmText: 'Delete Lead',
          cancelText: 'Keep Lead',
          confirmIcon: 'ri-delete-bin-line',
          isDanger: true,
          onConfirm: () => {
            // Always delete locally first so UI responds immediately
            const newLeads = leads.filter(l => String(l.id) !== String(id));
            saveLeads(newLeads);
            renderTable();

            addAuditLog({
              action: `Deleted Lead (${lead.name})`,
              module: 'CRM Pipeline',
              details: `Permanently removed lead record ${lead.name} (${lead.phone || lead.mobile || 'No Phone'}) from CRM pipeline.`
            });

            showToast(`Lead "${lead.name}" deleted`, 'ri-checkbox-circle-fill');

            // Then sync delete to DB in background
            fetchFromAPI('/leads/' + id, { method: 'DELETE' })
              .catch(err => console.warn('DB delete sync failed:', err));
          }
        });
      }
    });
  }
}
