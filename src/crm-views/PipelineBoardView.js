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

function formatCurrency(val) {
  if (!val) return '—';
  let num = parseInt(val.replace(/[^0-9]/g, ''));
  if (isNaN(num)) return '—';
  return '₹' + num.toLocaleString('en-IN');
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
    let budgetStr = '—';
    if (lead.budgetMax) {
      budgetStr = formatCurrency(lead.budgetMax);
    } else if (lead.budgetMin) {
      budgetStr = `Min ${formatCurrency(lead.budgetMin)}`;
    }

    const priorityClass = (lead.priority || 'Medium').toLowerCase() === 'high' ? 'high' : '';
    const priorityText = lead.priority ? lead.priority.toUpperCase() : 'MEDIUM';
    const sourceText = lead.source ? lead.source.toUpperCase() : 'MANUAL';
    
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
      <div class="pipeline-card" draggable="true" data-id="${lead.id}">
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
        const leadId = parseInt(e.dataTransfer.getData('text/plain'));
        const newStatus = col.dataset.stage;
        if (leadId && newStatus) {
          updateLeadStatus(leadId, newStatus);
        }
      });
    });
  }

  function updateLeadStatus(leadIdStr, newStatus) {
    const idx = leads.findIndex(l => String(l.id) === String(leadIdStr));
    if (idx !== -1) {
      // Avoid unnecessary re-renders
      if (leads[idx].status === newStatus) return;
      
      leads[idx].status = newStatus;
      saveLeads(leads);
      renderBoard(); // Re-render everything to update counts and move cards
    }
  }

  renderBoard();
}
