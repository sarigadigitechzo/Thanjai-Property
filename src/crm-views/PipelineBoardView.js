import { getPropertyById } from '../utils/propertiesStore.js';
import { sendWhatsAppMessage } from '../utils/whatsapp.js';
import { showToast } from '../utils/toast.js';

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

  const leads = getLeads();

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

    STAGES.forEach(stage => {
      const stageLeads = leads.filter(l => l.status === stage.id);

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

  const WA_STAGE_TEMPLATES = {
    'Initial Contact': (name, req, loc) => `Hello ${name}! Thank you for contacting Thanjai Property. We received your inquiry for ${req || 'Property'} in ${loc || 'Thanjavur'}. Our property specialist will guide you shortly.`,
    'Follow Up Pending': (name, req, loc) => `Hello ${name}! Following up regarding your property requirement (${req || 'Property'}) in ${loc || 'Thanjavur'}. Let us know if you would like updated listings or site visits!`,
    'Site Visit Scheduled': (name, req, loc) => `Hello ${name}! Your site visit for ${req || 'Property'} in ${loc || 'Thanjavur'} has been scheduled. Our executive will reach out to coordinate the visit time.`,
    'Site Visit Completed': (name, req, loc) => `Hello ${name}! Thank you for attending the site visit for ${req || 'Property'} in ${loc || 'Thanjavur'}. Please let us know your feedback or if you need more options.`,
    'Negotiation': (name, req, loc) => `Hello ${name}! We are actively working to finalize the best deal for your preferred property in ${loc || 'Thanjavur'}. We will update you on the price agreement shortly.`,
    'Bank Loan': (name, req, loc) => `Hello ${name}! Our banking desk is processing the home loan & document verification for your property selection in ${loc || 'Thanjavur'}.`,
    'Registration': (name, req, loc) => `Congratulations ${name}! Your property registration process for ${req || 'Property'} in ${loc || 'Thanjavur'} is being prepared by Thanjai Property.`
  };

  function updateLeadStatus(leadIdStr, newStatus) {
    const idx = leads.findIndex(l => String(l.id) === String(leadIdStr));
    if (idx !== -1) {
      // Avoid unnecessary re-renders
      if (leads[idx].status === newStatus) return;
      
      const oldStatus = leads[idx].status || 'New Lead';
      const leadObj = leads[idx];
      leadObj.status = newStatus;
      
      if (!leadObj.timeline) leadObj.timeline = [];
      leadObj.timeline.unshift({
        type: 'pipeline',
        message: `Moved from ${oldStatus.toUpperCase().replace(/\s+/g, '_')} to ${newStatus.toUpperCase().replace(/\s+/g, '_')}`,
        author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
        date: new Date().toISOString()
      });

      // Automated WhatsApp message dispatch for 7 marked stages
      const templateFn = WA_STAGE_TEMPLATES[newStatus];
      const destPhone = leadObj.whatsapp || leadObj.mobile || leadObj.phone;
      if (templateFn && destPhone) {
        const msgText = templateFn(leadObj.name || 'Client', leadObj.requirement || leadObj.propertyType, leadObj.location || leadObj.city);
        
        sendWhatsAppMessage({
          campaignName: 'stage_update_auto',
          destination: destPhone,
          userName: leadObj.name || 'Client',
          messageText: msgText,
          leadId: leadObj.id
        }).then(sent => {
          showToast(`Automated WhatsApp sent to ${leadObj.name} for ${newStatus}`, 'success');
        }).catch(err => {
          showToast(`Stage updated to ${newStatus}`, 'info');
        });

        leadObj.timeline.unshift({
          type: 'whatsapp',
          message: `Automated WhatsApp sent to ${leadObj.name} (${destPhone}): "${msgText}"`,
          author: 'System Auto Dispatch',
          date: new Date().toISOString()
        });
      } else {
        showToast(`Lead moved to ${newStatus}`, 'info');
      }

      saveLeads(leads);
      renderBoard(); // Re-render everything to update counts and move cards
    }
  }

  renderBoard();
}
