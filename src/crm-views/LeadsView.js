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
                <div class="os-custom-select modal-select" id="lead-source-select">
                  <div class="select-value">Manual</div>
                  <i class="ri-arrow-down-s-line"></i>
                  <div class="select-dropdown">
                    <div class="select-option">Visa Form</div>
                    <div class="select-option">Website Form</div>
                    <div class="select-option selected">Manual</div>
                    <div class="select-option">Referral</div>
                    <div class="select-option">Whatsapp</div>
                    <div class="select-option">Import</div>
                    <div class="select-option">Partner</div>
                    <div class="select-option">Meta Ads</div>
                  </div>
                </div>
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
let cachedLeads = [];

// Data Store Initializer
export async function initLeadsView() {
  try {
    const data = await fetchFromAPI('/leads');
    if (data && Array.isArray(data)) {
      cachedLeads = data.map(l => {
        let mobile = l.phone;
        let budgetMax = l.budget;
        let type = l.propertyType;
        
        return {
          id: l.id || 'L-' + Date.now(),
          name: l.name,
          mobile: mobile,
          whatsapp: mobile,
          email: l.email,
          country: 'India',
          city: 'Thanjavur',
          area: '',
          budgetMin: '',
          budgetMax: budgetMax,
          bedrooms: '',
          notes: l.notes || '',
          type: type,
          source: l.source,
          assignTo: l.assignedTo,
          status: l.status,
          followup: l.timeline || '—',
          createdAt: l.createdAt ? new Date(l.createdAt).getTime() : Date.now(),
          timeline: []
        };
      });
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
  // Fallback save just in case
  localStorage.setItem('thanjai_leads', JSON.stringify(leads));
}

function formatCurrency(val) {
  if (!val) return '—';
  let num = parseInt(val.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '—';
  return '₹' + num.toLocaleString('en-IN');
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
        // In a local demo, just showing items with a follow-up date assigned if 'Due' is checked
      }
      
      return true;
    });
  }

  tbody.innerHTML = leads.map(lead => {
    
    let requirementHtml = `<div style="font-weight: 500; color: var(--os-gray-600);">${lead.type !== 'Any' ? lead.type : '—'}</div>`;
    if (lead.area) {
      requirementHtml += `<div style="font-size: 0.85rem; color: var(--os-gray-400);">${lead.area}</div>`;
    }

    let budgetStr = '—';
    if (lead.budgetMax) {
      budgetStr = formatCurrency(lead.budgetMax);
    } else if (lead.budgetMin) {
      budgetStr = `Min ${formatCurrency(lead.budgetMin)}`;
    }

    let statusColor = 'badge-gray';
    let statusTxt = lead.status ? lead.status.toUpperCase() : 'NEW';
    if (statusTxt.includes('CONTACTED')) statusColor = 'badge-cyan';
    else if (statusTxt.includes('FOLLOW UP')) statusColor = 'badge-yellow';
    else if (statusTxt.includes('NEGOTIATION')) statusColor = 'badge-orange';
    else if (statusTxt.includes('CONVERTED')) statusColor = 'badge-cyan'; // would be green ideally
    
    let sourceTxt = lead.source ? lead.source.toUpperCase() : 'MANUAL';

    let assignedHtml = `<td style="color: var(--os-gray-400);">—</td>`;
    if (lead.assignTo && lead.assignTo !== 'Unassigned') {
       let names = lead.assignTo.split(' ');
       assignedHtml = `<td>
         <div style="font-weight: 500; color: var(--os-gray-600);">${names[0]}</div>
         <div style="font-size: 0.85rem; color: var(--os-gray-400);">${names[1] || ''}</div>
       </td>`;
    }

    return `
      <tr data-id="${lead.id}">
        <td>
          <div class="action-view" style="font-weight: 600; color: var(--os-luxury-orange); cursor: pointer;">${lead.name}</div>
          <div style="font-size: 0.85rem; color: var(--os-gray-400);">${lead.mobile}</div>
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
          renderTable();
        }
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('open'));
  });

  // Attach search and due checkbox event listeners
  const searchInput = document.getElementById('filter-search');
  if (searchInput) searchInput.addEventListener('input', renderTable);
  
  const dueCheckbox = document.getElementById('filter-due');
  if (dueCheckbox) dueCheckbox.addEventListener('change', renderTable);

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
        alert('Name and Mobile are required!');
        return;
      }

      const idField = document.getElementById('lead-id').value;
      const type = document.getElementById('lead-type-select').querySelector('.select-value').textContent;
      const source = document.getElementById('lead-source-select').querySelector('.select-value').textContent;
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

      const leadData = {
        id: idField ? idField : 'L-' + Math.floor(1000 + Math.random() * 9000),
        name: name,
        phone: mobile,
        email: document.getElementById('lead-email').value,
        source: source,
        status: idField ? undefined : 'New Lead',
        budget: budgetStr,
        requirement: requirementStr,
        location: locationStr,
        timeline: document.getElementById('lead-followup').value || '—',
        assignedTo: assignTo,
        notes: document.getElementById('lead-notes').value,
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
        followup: document.getElementById('lead-followup').value || '—',
        createdAt: Date.now()
      };

      try {
        const url = idField ? '/leads/' + idField : '/leads';
        await fetchFromAPI(url, { 
          method: idField ? 'PUT' : 'POST', 
          body: JSON.stringify(leadData) 
        });
        
        // Refresh local cache
        const data = await fetchFromAPI('/leads');
        saveLeads(data);
        renderTable();
        closeModal();
      } catch (e) {
        console.error(e);
      }
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

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      const text = evt.target.result;
      const rows = text.split('\n');
      if (rows.length < 2) {
        alert('CSV seems empty or invalid');
        return;
      }
      
      const newLeads = [];
      // Assuming headers: Name,Mobile,Email,PropertyType,BudgetMax,Source,Status
      for (let i = 1; i < rows.length; i++) {
        // basic csv split handling quotes is complex, doing simple split
        const rowText = rows[i].trim();
        if(!rowText) continue;
        const row = rowText.split(',');
        if (row.length >= 2 && row[0].trim() !== '') {
          newLeads.push({
            id: Date.now() + i,
            name: row[0].trim(),
            mobile: row[1].trim(),
            email: row[2] ? row[2].trim() : '',
            type: row[3] ? row[3].trim() : 'Any',
            budgetMax: row[4] ? row[4].trim() : '',
            source: row[5] ? row[5].trim() : 'Import',
            status: row[6] ? row[6].trim() : 'New',
            assignTo: 'Unassigned',
            followup: '—'
          });
        }
      }
      
      if (newLeads.length > 0) {
        const leads = getLeads();
        const updatedLeads = [...newLeads, ...leads];
        saveLeads(updatedLeads);
        renderTable();
        alert(newLeads.length + ' leads imported successfully!');
      } else {
        alert('No valid leads found in CSV.');
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  });

  if (sampleBtn) {
    sampleBtn.addEventListener('click', () => {
      const csvContent = "Name,Mobile,Email,PropertyType,BudgetMax,Source,Status\nJohn Doe,9876543210,john@example.com,Apartment,5000000,Import,New\nJane Smith,9123456789,jane@example.com,Villa,15000000,Import,New";
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", "sample_leads.csv");
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
        alert('No leads to export!');
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
         document.getElementById('lead-notes').value = lead.notes || '';
         document.getElementById('lead-followup').value = (lead.followup && lead.followup !== '—') ? lead.followup : '';
         
         // Set selects visually
         const typeSel = document.getElementById('lead-type-select');
         if(typeSel) typeSel.querySelector('.select-value').textContent = lead.type || 'Any';
         
         const srcSel = document.getElementById('lead-source-select');
         if(srcSel) srcSel.querySelector('.select-value').textContent = lead.source || 'Manual';

         const asnSel = document.getElementById('lead-assign-select');
         if(asnSel) asnSel.querySelector('.select-value').textContent = lead.assignTo || 'Unassigned';

      } else if (e.target.closest('.action-delete')) {
        if (confirm('Are you sure you want to delete ' + lead.name + '?')) {
          fetchFromAPI('/leads/' + id, { method: 'DELETE' })
            .then(async () => {
              // Refresh local cache from server
              const data = await fetchFromAPI('/leads');
              saveLeads(data);
              renderTable();
              const { showToast } = await import('../utils/toast.js');
              showToast('Lead deleted successfully', 'success');
            })
            .catch(err => {
              console.error(err);
              // Fallback to local deletion
              const newLeads = leads.filter(l => String(l.id) !== String(id));
              saveLeads(newLeads);
              renderTable();
            });
        }
      }
    });
  }
}
