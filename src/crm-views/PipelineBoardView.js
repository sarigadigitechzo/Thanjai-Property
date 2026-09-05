import { getPropertyById, getProperties } from '../utils/propertiesStore.js';
import { sendWhatsAppMessage } from '../utils/whatsapp.js';
import { showToast } from '../utils/toast.js';
import { filterLeadsForActiveUser } from '../utils/adminUsersStore.js';
import { mapLeadFromAPI } from './LeadsView.js';

export function renderPipelineBoardView() {
  return `
    <div class="view-enter" style="height: 100%; display: flex; flex-direction: column;">
      <div class="view-header-flex" style="margin-bottom: 24px;">
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; background: rgba(247,147,26,0.1); border-radius: var(--os-radius-md); display: flex; align-items: center; justify-content: center; color: var(--os-luxury-orange); font-size: 1.5rem;">
            <i class="ri-kanban-view"></i>
          </div>
          <div>
            <h1 class="view-title">Pipeline Board</h1>
            <p class="view-subtitle">Drag cards between stages — some stages (marked <i class="ri-mail-line"></i> in the mobile select) send an automated WhatsApp to the client</p>
          </div>
        </div>
      </div>

      <div class="pipeline-board-container" id="pipeline-board">
        <!-- Columns rendered by JS -->
      </div>
    </div>
  `;
}

const STAGES = [
  { id: 'New Lead', name: 'NEW LEAD', emailIcon: false },
  { id: 'Initial Contact', name: 'INITIAL CONTACT', emailIcon: true },
  { id: 'Requirement Analysis', name: 'REQUIREMENT ANALYSIS', emailIcon: false },
  { id: 'Property Matching', name: 'PROPERTY MATCHING', emailIcon: false },
  { id: 'Shared To Partner (use Share to partner)', name: 'SHARED TO PARTNER', emailIcon: false },
  { id: 'Property Shared', name: 'PROPERTY SHARED', emailIcon: false },
  { id: 'Follow Up Pending', name: 'FOLLOW UP PENDING', emailIcon: true },
  { id: 'Site Visit Scheduled', name: 'SITE VISIT SCHEDULED', emailIcon: true },
  { id: 'Site Visit Completed', name: 'SITE VISIT COMPLETED', emailIcon: true },
  { id: 'Negotiation', name: 'NEGOTIATION', emailIcon: true },
  { id: 'Bank Loan', name: 'BANK LOAN', emailIcon: true },
  { id: 'Registration', name: 'REGISTRATION', emailIcon: true },
  { id: 'Lost Closed', name: 'LOST CLOSED', emailIcon: false }
];

function getLeads() {
  return JSON.parse(localStorage.getItem('thanjai_leads')) || [];
}

function saveLeads(leads) {
  localStorage.setItem('thanjai_leads', JSON.stringify(leads));
}

function formatCurrency(val, propId = null) {
  if (propId) {
    const prop = getPropertyById(propId);
    if (prop) {
      if (prop.priceFormatted) return prop.priceFormatted;
      if (prop.price) val = prop.price;
    }
  }

  if (!val) return '—';
  const str = String(val).trim();
  if (str.includes('Lakh') || str.includes('Crore') || str.includes('Cr') || str.includes('L')) {
    return str.startsWith('₹') ? str : `₹ ${str}`;
  }

  let num = parseFloat(str.replace(/[^0-9.]/g, ''));
  if (isNaN(num) || num <= 0) return typeof val === 'string' && val.trim() ? val : '—';

  if (num > 0 && num < 100) {
    return '₹ ' + num.toFixed(2).replace(/\.00$/, '') + ' Lakhs';
  }
  if (num >= 10000000) {
    return '₹ ' + (num / 10000000).toFixed(2).replace(/\.00$/, '') + ' Crore';
  }
  if (num >= 100000) {
    return '₹ ' + (num / 100000).toFixed(2).replace(/\.00$/, '') + ' Lakhs';
  }
  return '₹ ' + num.toLocaleString('en-IN');
}

export function initPipelineBoardView() {
  const board = document.getElementById('pipeline-board');
  if (!board) return;

  let leads = getLeads();

  // Async load fresh leads from live PHP API backend while preserving local status updates
  try {
    fetchFromAPI('/leads').then(apiLeads => {
      if (apiLeads && Array.isArray(apiLeads) && apiLeads.length > 0) {
        const localLeads = getLeads();
        const mapped = apiLeads.map(mapLeadFromAPI);
        mapped.forEach(apiL => {
          const matchingLocal = localLeads.find(locL => 
            (locL.id && String(locL.id) === String(apiL.id)) ||
            (locL.phone && String(locL.phone).replace(/\D/g, '') === String(apiL.phone).replace(/\D/g, '')) ||
            (locL.name && String(locL.name).trim().toLowerCase() === String(apiL.name).trim().toLowerCase())
          );
          if (matchingLocal) {
            if (matchingLocal.status) apiL.status = matchingLocal.status;
            if (matchingLocal.assignTo && matchingLocal.assignTo !== 'Unassigned') {
              apiL.assignTo = matchingLocal.assignTo;
              apiL.assignedTo = matchingLocal.assignTo;
            }
          }
        });
        let deletedList = [];
        try { deletedList = JSON.parse(localStorage.getItem('thanjai_deleted_leads')) || []; } catch(e) {}
        const deletedIds = new Set(deletedList.map(d => String(d.id || d.leadId)));
        const deletedPhones = new Set(deletedList.map(d => String(d.phone || '')).filter(Boolean));
        const deletedNames = new Set(deletedList.map(d => String(d.name || '').trim().toLowerCase()).filter(Boolean));

        const filteredMapped = mapped.filter(apiL => {
          if (!apiL) return false;
          const lIdStr = String(apiL.id);
          const cleanPhone = String(apiL.phone || apiL.mobile || '').replace(/\D/g, '');
          const cleanName = String(apiL.name || '').trim().toLowerCase();
          if (deletedIds.has(lIdStr)) return false;
          if (cleanPhone && deletedPhones.has(cleanPhone)) return false;
          if (cleanName && deletedNames.has(cleanName)) return false;
          return true;
        });

        saveLeads(filteredMapped);
        leads.length = 0;
        leads.push(...filteredMapped);
        renderBoard();
      }
    }).catch(e => {});
  } catch (err) {}

  // Normalize old statuses to new pipeline stages if needed
  leads.forEach(lead => {
    if (!STAGES.find(s => s.id === lead.status)) {
      if (lead.status === 'New') lead.status = 'New Lead';
      else if (lead.status === 'Contacted') lead.status = 'Initial Contact';
      else if (lead.status === 'Follow Up') lead.status = 'Follow Up Pending';
      else if (lead.status === 'Interested') lead.status = 'Requirement Analysis';
      else if (lead.status === 'Converted') lead.status = 'Registration';
      else lead.status = 'New Lead'; // default
    }
  });

  function renderBoard() {
    board.innerHTML = '';
    const userLeads = filterLeadsForActiveUser(leads);

    STAGES.forEach(stage => {
      const stageLeads = userLeads.filter(l => l.status === stage.id);

      const colDiv = document.createElement('div');
      colDiv.className = 'pipeline-col';
      colDiv.dataset.stage = stage.id;
      
      colDiv.innerHTML = `
        <div class="pipeline-col-header">
          <span>${stage.name}</span>
          <span class="pipeline-col-count">${stageLeads.length}</span>
        </div>
        <div class="pipeline-col-cards" data-stage="${stage.id}">
          ${stageLeads.map(lead => generateCardHTML(lead)).join('')}
        </div>
      `;
      
      board.appendChild(colDiv);
    });

    attachEventListeners();
  }

  function generateCardHTML(lead) {
    let propId = lead.propertyId || lead.propertyMatch || '';
    if (!propId) {
      const rawTimelineStr = typeof lead.timeline === 'string' ? lead.timeline : JSON.stringify(lead.timeline || []);
      const rawNotesStr = typeof lead.notes === 'string' ? lead.notes : JSON.stringify(lead.notes || []);
      const match = rawTimelineStr.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/i) || rawNotesStr.match(/(?:ID:\s*|property\s*|ID\s+)([A-Z]{2}-?\d+)/i);
      if (match) propId = match[1].toUpperCase();
    }

    let budgetStr = '—';
    if (lead.budgetMax || lead.budget) {
      budgetStr = formatCurrency(lead.budgetMax || lead.budget, propId);
    } else if (lead.budgetMin) {
      budgetStr = `Min ${formatCurrency(lead.budgetMin, propId)}`;
    } else if (propId) {
      budgetStr = formatCurrency(null, propId);
    }

    const priorityClass = (lead.priority || 'Medium').toLowerCase() === 'high' ? 'high' : '';
    const priorityText = lead.priority ? lead.priority.toUpperCase() : 'MEDIUM';

    let rawSource = (lead.source || 'MANUAL').toUpperCase();
    let sourceText = 'CONTACT ENQUIRY';
    if (propId || rawSource.includes('PROPERTY') || rawSource.includes('VISIT')) {
      sourceText = 'PROPERTY INQUIRY';
    } else {
      sourceText = 'CONTACT ENQUIRY';
    }

    let propBadgeHtml = '';
    if (propId) {
      propBadgeHtml = `
        <div style="margin-top: 8px;">
          <span class="prop-id-badge" data-propid="${propId}" style="background: #ea580c; color: #ffffff; padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 5px; box-shadow: 0 1px 3px rgba(0,0,0,0.15);" title="Click to view Property ${propId}">
            <i class="ri-building-fill"></i> Property ${propId}
          </span>
        </div>
      `;
    }

    let info = [];
    if (lead.type && lead.type !== 'Any') info.push(lead.type);
    if (lead.bedrooms) info.push(lead.bedrooms + 'BR');
    if (lead.area) info.push(lead.area);
    const infoText = info.length > 0 ? info.join(' · ') : '—';

    // Dropdown options
    const optionsHTML = STAGES.map(s => {
      const label = s.id + (s.emailIcon ? ' <i class="ri-mail-line" style="margin-left:4px; font-size:0.8rem;"></i>' : '');
      const isSelected = s.id === lead.status;
      return `<div class="custom-option ${isSelected ? 'selected' : ''}" data-val="${s.id}">${label}</div>`;
    }).join('');

    const currentStage = STAGES.find(s => s.id === lead.status) || STAGES[0];
    const currentLabel = currentStage.id + (currentStage.emailIcon ? ' <i class="ri-mail-line" style="margin-left:4px; font-size:0.8rem;"></i>' : '');

    return `
      <div class="pipeline-card" draggable="true" data-id="${lead.id}" data-priority="${priorityClass || 'medium'}">
        <div class="pipeline-card-header">
          <div class="pipeline-card-title">${lead.name}</div>
          <div class="pipeline-card-priority ${priorityClass}">${priorityText}</div>
        </div>
        <div class="pipeline-card-details">${infoText}</div>
        <div class="pipeline-card-budget">${budgetStr}</div>
        <div class="pipeline-card-meta">
          <div class="pipeline-card-assigned">${lead.assignTo || 'Unassigned'}</div>
          <div class="pipeline-card-source">${sourceText}</div>
        </div>
        ${propBadgeHtml}
        <div class="pipeline-card-action">
          <div class="custom-dropdown-wrap" data-lead="${lead.id}">
            <div class="custom-dropdown-selected" tabindex="0">
              <span style="display:flex; align-items:center;">${currentLabel}</span> <i class="ri-arrow-down-s-line"></i>
            </div>
            <div class="custom-dropdown-options">
              ${optionsHTML}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function attachEventListeners() {
    // 1. Custom Dropdown logic
    const dropdownWraps = board.querySelectorAll('.custom-dropdown-wrap');
    
    dropdownWraps.forEach(wrap => {
      const selectedEl = wrap.querySelector('.custom-dropdown-selected');
      const options = wrap.querySelectorAll('.custom-option');
      const leadIdStr = wrap.dataset.lead;

      selectedEl.addEventListener('mousedown', (e) => {
        e.stopPropagation(); // Prevent dragstart on the card when clicking dropdown
      });

      selectedEl.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close all other open dropdowns first
        document.querySelectorAll('.custom-dropdown-wrap.open').forEach(w => {
          if (w !== wrap) {
            w.classList.remove('open');
          }
        });
        
        // Return any body-appended options back to their original wraps
        document.querySelectorAll('body > .custom-dropdown-options').forEach(optDiv => {
          const originalWrap = document.querySelector(`.custom-dropdown-wrap[data-lead="${optDiv.dataset.wrapId}"]`);
          if (originalWrap && originalWrap !== wrap) {
            originalWrap.appendChild(optDiv);
            optDiv.style.position = '';
            optDiv.style.display = '';
          }
        });
        
        const isOpen = wrap.classList.contains('open');
        if (!isOpen) {
          wrap.classList.add('open');
          const optionsDiv = wrap.querySelector('.custom-dropdown-options');
          
          document.body.appendChild(optionsDiv);
          
          const rect = wrap.getBoundingClientRect();
          optionsDiv.style.position = 'fixed';
          optionsDiv.style.display = 'block';
          
          const spaceBelow = window.innerHeight - rect.bottom;
          const dropdownHeight = 280;
          
          if (spaceBelow < dropdownHeight && rect.top > dropdownHeight) {
            optionsDiv.style.top = 'auto';
            optionsDiv.style.bottom = (window.innerHeight - rect.top + 4) + 'px';
          } else {
            optionsDiv.style.bottom = 'auto';
            optionsDiv.style.top = (rect.bottom + 4) + 'px';
          }
          
          optionsDiv.style.left = rect.left + 'px';
          optionsDiv.style.width = rect.width + 'px';
          optionsDiv.style.zIndex = '999999';
          
          optionsDiv.dataset.wrapId = leadIdStr;
        } else {
          wrap.classList.remove('open');
          const optionsDiv = document.querySelector(`body > .custom-dropdown-options[data-wrap-id="${leadIdStr}"]`);
          if (optionsDiv) {
             wrap.appendChild(optionsDiv);
             optionsDiv.style.position = '';
             optionsDiv.style.display = '';
          }
        }
      });
      
      document.addEventListener('click', (e) => {
        if (e.target.closest('.custom-option')) {
          const optionEl = e.target.closest('.custom-option');
          const optionsDiv = optionEl.closest('.custom-dropdown-options');
          
          if (optionsDiv && optionsDiv.dataset.wrapId === leadIdStr) {
            const newStageId = optionEl.dataset.val;
            
            wrap.appendChild(optionsDiv);
            optionsDiv.style.position = '';
            optionsDiv.style.display = '';
            wrap.classList.remove('open');
            
            updateLeadStatus(leadIdStr, newStageId);
          }
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.custom-dropdown-wrap') && !e.target.closest('.custom-dropdown-options')) {
        document.querySelectorAll('.custom-dropdown-wrap.open').forEach(wrap => {
          wrap.classList.remove('open');
        });
        document.querySelectorAll('body > .custom-dropdown-options').forEach(optDiv => {
          const originalWrap = document.querySelector(`.custom-dropdown-wrap[data-lead="${optDiv.dataset.wrapId}"]`);
          if (originalWrap) {
            originalWrap.appendChild(optDiv);
            optDiv.style.position = '';
            optDiv.style.display = '';
          } else {
            optDiv.remove();
          }
        });
      }
    });

    // 2. Drag and Drop
    const cards = board.querySelectorAll('.pipeline-card');
    const cols = board.querySelectorAll('.pipeline-col-cards');

    cards.forEach(card => {
      card.addEventListener('dragstart', (e) => {
        card.classList.add('dragging');
        e.dataTransfer.setData('text/plain', card.dataset.id);
        e.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('dragend', () => {
        card.classList.remove('dragging');
        cols.forEach(col => col.parentElement.classList.remove('drag-over'));
      });
    });

    cols.forEach(col => {
      col.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        col.parentElement.classList.add('drag-over');
      });

      col.addEventListener('dragleave', () => {
        col.parentElement.classList.remove('drag-over');
      });

      col.addEventListener('drop', (e) => {
        e.preventDefault();
        col.parentElement.classList.remove('drag-over');
        const leadId = e.dataTransfer.getData('text/plain');
        const newStatus = col.dataset.stage;
        if (leadId && newStatus) {
          updateLeadStatus(leadId, newStatus);
        }
      });
    });
  }

  function openPipelineWhatsAppModal(leadObj, newStatus, onConfirm, onSkip, onCancel) {
    // Remove existing modal if any
    const existing = document.getElementById('pipeline-wa-modal-wrap');
    if (existing) existing.remove();

    const clientName = leadObj.name || 'Client';
    const rawProp = leadObj.requirement || leadObj.propertyType || leadObj.propertyTitle || '';
    const isGenericProp = !rawProp || ['any', 'all', 'none', '—', '-'].includes(rawProp.trim().toLowerCase());
    const initialPropTitle = isGenericProp ? 'DTCP Plots / Luxury Villa' : rawProp;

    let defaultLoc = leadObj.location || leadObj.preferredLocation || leadObj.city || 'Medical College Road, Thanjavur';

    const allProperties = (typeof getProperties === 'function' ? getProperties() : []) || [];
    const matchedProp = allProperties.find(p => p.title.trim().toLowerCase() === initialPropTitle.trim().toLowerCase());

    const buildPropSelectorHtml = (label = 'Property / Requirement') => `
      <div class="os-form-group" style="margin-bottom: 14px;">
        <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">${label}</label>
        <select id="pwa-prop-select" class="os-input" style="width: 100%; margin-bottom: 6px; cursor: pointer; background: #ffffff;">
          <option value="">-- Choose from Verified Properties (${allProperties.length} listings) --</option>
          ${allProperties.map(p => {
            const isSelected = matchedProp && matchedProp.id === p.id;
            return `<option value="${p.title}" data-loc="${p.location || 'Thanjavur'}" ${isSelected ? 'selected' : ''}>${p.title} (${p.location || 'Thanjavur'})</option>`;
          }).join('')}
          <option value="__custom__" ${!matchedProp ? 'selected' : ''}>✍️ Custom Property / Requirement...</option>
        </select>
        <input type="text" id="pwa-prop" value="${initialPropTitle}" class="os-input" style="width: 100%; display: ${matchedProp ? 'none' : 'block'};" placeholder="Type property title or requirement..." />
      </div>
    `;

    let fieldsHtml = '';
    let getParamsFn = () => [];
    let getPreviewFn = () => '';
    let campaignName = 'general_property_update';

    if (newStatus === 'Initial Contact') {
      campaignName = 'general_property_update';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property / Requirement Title')}
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Custom Message Text</label>
          <textarea id="pwa-msg" class="os-input" style="width: 100%; height: 70px; resize: vertical;">Thank you for contacting Thanjai Property! Our property specialist will guide you with verified options shortly.</textarea>
        </div>
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle,
        document.getElementById('pwa-msg')?.value || 'Thank you for contacting Thanjai Property!'
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hello ${p[0]} 👋\n\nUpdate on your property file (${p[1]}):\n📌 ${p[2]}\n\nFeel free to reply if you have any questions!\n\nWarm regards,\n*Thanjai Property Team*`;
      };
    } else if (newStatus === 'Follow Up Pending') {
      campaignName = 'property_follow_up';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property Title')}
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Location</label>
          <input type="text" id="pwa-loc" value="${defaultLoc}" class="os-input" style="width: 100%;" />
        </div>
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle,
        document.getElementById('pwa-loc')?.value || defaultLoc
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hello ${p[0]} 👋\n\nJust checking in about ${p[1]} in ${p[2]}. The owner is open to reasonable price discussions for genuine buyers.\n\nWould you like to sit together and finalize the deal?\n\nWarm regards,\n*Thanjai Property Team*`;
      };
    } else if (newStatus === 'Site Visit Scheduled') {
      campaignName = 'site_visit_confirmation';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property Title for Site Visit')}
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Visit Date & Time</label>
          <input type="text" id="pwa-time" value="Tomorrow at 10:30 AM" class="os-input" style="width: 100%;" />
        </div>
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Location / Landmark</label>
          <input type="text" id="pwa-loc" value="${defaultLoc}" class="os-input" style="width: 100%;" />
        </div>
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Google Maps Link</label>
          <input type="text" id="pwa-map" value="https://maps.google.com/?q=Thanjavur" class="os-input" style="width: 100%;" />
        </div>
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle,
        document.getElementById('pwa-time')?.value || 'Tomorrow at 10:30 AM',
        document.getElementById('pwa-loc')?.value || defaultLoc,
        document.getElementById('pwa-map')?.value || 'https://maps.google.com/?q=Thanjavur'
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hello ${p[0]} 👋\n\nYour site visit for ${p[1]} is confirmed!\n\n📅 Date & Time: ${p[2]}\n📍 Location: ${p[3]}\n🗺️ Map: ${p[4]}\n\nOur executive will meet you at the site. Please reply OK to confirm.\n\nBest regards,\n*Thanjai Property Team*`;
      };
    } else if (newStatus === 'Site Visit Completed') {
      campaignName = 'site_visit_feedback';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property Visited')}
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hello ${p[0]} 😊\n\nThank you for visiting ${p[1]} with us today!\n\nHow did you feel about the property and location?\n\nWarm regards,\n*Thanjai Property Team*`;
      };
    } else if (newStatus === 'Negotiation') {
      campaignName = 'negotiation_check_in';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property Name')}
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Proposed Meeting Time</label>
          <input type="text" id="pwa-time" value="This Week at Our Office" class="os-input" style="width: 100%;" />
        </div>
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle,
        document.getElementById('pwa-time')?.value || 'This Week'
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hello ${p[0]} 🤝\n\nGood news! The owner of ${p[1]} responded positively to your offer.\n\nCan we meet at our office on ${p[2]} to finalize the agreement?\n\nBest regards,\n*Thanjai Property Team*`;
      };
    } else if (newStatus === 'Bank Loan') {
      campaignName = 'bank_loan_assistance';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property Name')}
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hello ${p[0]} 🏛️\n\nNeed bank loan assistance for ${p[1]}?\n\nOur representative will contact you shortly to discuss the loan process further.\n\nBest regards,\n*Thanjai Property Team*`;
      };
    } else if (newStatus === 'Registration') {
      campaignName = 'registration_testimonial_referral';
      fieldsHtml = `
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Customer Name</label>
          <input type="text" id="pwa-name" value="${clientName}" class="os-input" style="width: 100%;" />
        </div>
        ${buildPropSelectorHtml('Property Registered')}
        <div class="os-form-group" style="margin-bottom: 14px;">
          <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; display: block;">Google Review Link</label>
          <input type="text" id="pwa-rev" value="https://g.page/r/thanjai-property/review" class="os-input" style="width: 100%;" />
        </div>
      `;
      getParamsFn = () => [
        document.getElementById('pwa-name')?.value || clientName,
        document.getElementById('pwa-prop')?.value || initialPropTitle,
        document.getElementById('pwa-rev')?.value || 'https://g.page/r/thanjai-property/review'
      ];
      getPreviewFn = () => {
        const p = getParamsFn();
        return `Hearty Congratulations, ${p[0]}! 🎉\n\nCongratulations on the successful registration of your ${p[1]}!\n\nReview Link: ${p[2]}\n\nBest regards,\n*Thanjai Property Team*`;
      };
    }

    const modalWrap = document.createElement('div');
    modalWrap.id = 'pipeline-wa-modal-wrap';
    modalWrap.style.cssText = `
      position: fixed; inset: 0; z-index: 10000; background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 24px; box-sizing: border-box; overflow-y: auto;
    `;

    modalWrap.innerHTML = `
      <div style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 530px; max-height: min(88vh, 660px); margin: auto; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.35); overflow: hidden; display: flex; flex-direction: column; animation: popIn 0.25s ease-out; font-family: 'Manrope', sans-serif;">
        <!-- Modal Header -->
        <div style="background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); padding: 16px 20px; color: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 36px; height: 36px; background: rgba(37,211,102,0.15); border: 1px solid rgba(37,211,102,0.3); border-radius: 10px; display: flex; align-items: center; justify-content: center; color: #25d366; font-size: 1.2rem;">
              <i class="ri-whatsapp-fill"></i>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 1.05rem; font-weight: 800; color: #ffffff;">WhatsApp Stage Trigger</h3>
              <p style="margin: 2px 0 0; font-size: 0.78rem; color: #94a3b8;">Moving to: <strong style="color: #eb5e28;">${newStatus}</strong></p>
            </div>
          </div>
          <button id="pwa-close-btn" style="background: transparent; border: none; color: #94a3b8; font-size: 1.3rem; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>

        <!-- Modal Body -->
        <div style="padding: 18px 20px; overflow-y: auto; flex: 1; min-height: 0;">
          <p style="margin: 0 0 14px; font-size: 0.83rem; color: #64748b;">
            Verify and customize the parameters below before dispatching the automated WhatsApp message to <strong style="color: #0f172a;">${clientName}</strong>:
          </p>

          <div id="pwa-fields-container">${fieldsHtml}</div>

          <!-- Live WhatsApp Preview Box -->
          <div style="margin-top: 14px; background: #eef8f2; border: 1px solid #c6ebd4; border-radius: 12px; padding: 12px; position: relative;">
            <div style="font-size: 0.72rem; font-weight: 800; text-transform: uppercase; color: #15803d; margin-bottom: 6px; display: flex; align-items: center; gap: 6px;">
              <i class="ri-eye-line"></i> Live Message Preview (SmartPing: <code>${campaignName}</code>)
            </div>
            <pre id="pwa-live-preview" style="margin: 0; font-family: inherit; font-size: 0.82rem; color: #1e293b; white-space: pre-wrap; line-height: 1.45;"></pre>
          </div>
        </div>

        <!-- Modal Footer Actions -->
        <div style="padding: 14px 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; justify-content: flex-end; align-items: center; flex-wrap: wrap; flex-shrink: 0;">
          <button id="pwa-cancel-btn" class="os-btn-secondary" style="font-size: 0.82rem; padding: 8px 12px; border: 1px solid #cbd5e1; background: #ffffff; color: #64748b;">Cancel</button>
          <button id="pwa-skip-btn" class="os-btn-secondary" style="font-size: 0.82rem; padding: 8px 12px; border: 1px solid #cbd5e1; background: #ffffff; color: #0f172a; font-weight: 700;">Move Without WhatsApp</button>
          <button id="pwa-confirm-btn" class="os-btn-primary" style="font-size: 0.82rem; padding: 8px 16px; background: #25d366; border-color: #25d366; color: #ffffff; font-weight: 800; display: flex; align-items: center; gap: 6px;">
            <i class="ri-send-plane-fill"></i> Send WhatsApp & Move
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modalWrap);

    // Live preview updater
    const updatePreview = () => {
      const previewEl = document.getElementById('pwa-live-preview');
      if (previewEl) previewEl.textContent = getPreviewFn();
    };
    updatePreview();

    // Property dropdown selector change listener
    const propSelect = document.getElementById('pwa-prop-select');
    const propInput = document.getElementById('pwa-prop');
    const locInput = document.getElementById('pwa-loc');

    if (propSelect && propInput) {
      propSelect.addEventListener('change', function() {
        if (this.value === '__custom__') {
          propInput.style.display = 'block';
          propInput.focus();
        } else if (this.value) {
          propInput.value = this.value;
          propInput.style.display = 'none';
          const selOpt = this.options[this.selectedIndex];
          if (selOpt && selOpt.dataset.loc && locInput) {
            locInput.value = selOpt.dataset.loc;
          }
        }
        updatePreview();
      });
    }

    // Attach input listeners for instant live preview updates
    modalWrap.querySelectorAll('input, textarea, select').forEach(input => {
      input.addEventListener('input', updatePreview);
      input.addEventListener('change', updatePreview);
    });

    // Close / Cancel action
    const close = () => {
      modalWrap.remove();
    };

    document.getElementById('pwa-close-btn')?.addEventListener('click', () => {
      close();
      if (onCancel) onCancel();
    });
    document.getElementById('pwa-cancel-btn')?.addEventListener('click', () => {
      close();
      if (onCancel) onCancel();
    });

    // Move without WhatsApp
    document.getElementById('pwa-skip-btn')?.addEventListener('click', () => {
      close();
      if (onSkip) onSkip();
    });

    // Send WhatsApp & Move
    document.getElementById('pwa-confirm-btn')?.addEventListener('click', () => {
      const finalParams = getParamsFn();
      const finalPreview = getPreviewFn();
      close();
      if (onConfirm) onConfirm(campaignName, finalParams, finalPreview);
    });
  }

  function updateLeadStatus(leadIdStr, newStatus) {
    const idx = leads.findIndex(l => String(l.id) === String(leadIdStr));
    if (idx !== -1) {
      if (leads[idx].status === newStatus) return;
      
      const oldStatus = leads[idx].status || 'New Lead';
      const leadObj = leads[idx];
      const destPhone = leadObj.whatsapp || leadObj.mobile || leadObj.phone;

      // Check if this stage has a WhatsApp trigger
      const hasWaTrigger = [
        'Initial Contact',
        'Follow Up Pending',
        'Site Visit Scheduled',
        'Site Visit Completed',
        'Negotiation',
        'Bank Loan',
        'Registration'
      ].includes(newStatus);

      const commitMove = (sendWa = false, campaignName = '', params = [], msgText = '') => {
        leadObj.status = newStatus;
        if (!leadObj.timeline) leadObj.timeline = [];
        
        leadObj.timeline.unshift({
          type: 'pipeline',
          message: `Moved from ${oldStatus.toUpperCase().replace(/\s+/g, '_')} to ${newStatus.toUpperCase().replace(/\s+/g, '_')}`,
          author: localStorage.getItem('thanjai_active_user') || 'Admin Staff',
          date: new Date().toISOString()
        });

        if (sendWa && destPhone) {
          sendWhatsAppMessage({
            campaignName: campaignName,
            destination: destPhone,
            userName: leadObj.name || 'Client',
            templateParams: params,
            messageText: msgText,
            leadId: leadObj.id
          }).then(sent => {
            showToast(`Automated WhatsApp sent to ${leadObj.name || 'Client'} (${campaignName})`, 'success');
          }).catch(err => {
            showToast(`Stage updated to ${newStatus}`, 'info');
          });

          leadObj.timeline.unshift({
            type: 'whatsapp',
            message: `Automated WhatsApp sent to ${leadObj.name || 'Client'} (${destPhone}): [${campaignName}]`,
            author: 'System Auto Dispatch',
            date: new Date().toISOString()
          });
        } else {
          showToast(`Lead moved to ${newStatus}`, 'info');
        }

        // INSTANTLY SYNC STATUS UPDATE TO LIVE MYSQL DATABASE
        try {
          fetchFromAPI('/leads?id=' + encodeURIComponent(leadObj.id), {
            method: 'PUT',
            body: JSON.stringify({
              id: leadObj.id,
              name: leadObj.name,
              phone: leadObj.phone || leadObj.mobile,
              status: newStatus,
              assignedTo: leadObj.assignTo || leadObj.assignedTo,
              timeline: leadObj.timeline
            })
          }).catch(err => console.warn('MySQL Lead status sync notice:', err));
        } catch (err) {}

        saveLeads(leads);
        renderBoard();
      };

      if (hasWaTrigger && destPhone) {
        openPipelineWhatsAppModal(
          leadObj,
          newStatus,
          (campName, finalParams, finalPreview) => commitMove(true, campName, finalParams, finalPreview),
          () => commitMove(false),
          () => renderBoard() // Revert card if cancelled
        );
      } else {
        commitMove(false);
      }
    }
  }

  renderBoard();
}
