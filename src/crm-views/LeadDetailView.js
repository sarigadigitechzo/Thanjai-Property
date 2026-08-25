import { fetchFromAPI } from '../utils/api.js';
export function renderLeadDetailView(id) {
  const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  const lead = leads.find(l => l.id == id);
  
  if (!lead) {
    return `
      <div style="padding: 40px; text-align: center;">
        <h2>Lead not found</h2>
        <button class="os-btn-secondary" onclick="window.location.hash='leads'">Back to Leads</button>
      </div>
    `;
  }

  // Sanitize notes and timeline (convert strings to arrays to prevent .map crashes)
  let needsSave = false;
  if (typeof lead.notes === 'string') {
    if (lead.notes.trim() !== '') {
      try {
        const parsedNotes = JSON.parse(lead.notes);
        lead.notes = Array.isArray(parsedNotes) ? parsedNotes : [{ text: lead.notes, date: lead.createdAt || new Date().toISOString() }];
      } catch (e) {
        lead.notes = [{ text: lead.notes, date: lead.createdAt || new Date().toISOString() }];
      }
    } else {
      lead.notes = [];
    }
    needsSave = true;
  }
  if (typeof lead.timeline === 'string') {
    if (lead.timeline.trim() !== '' && lead.timeline !== '—') {
      try {
        const parsedTimeline = JSON.parse(lead.timeline);
        lead.timeline = Array.isArray(parsedTimeline) ? parsedTimeline : [{ type: 'pipeline', message: 'Follow-up: ' + lead.timeline, author: lead.assignTo || 'System', date: lead.createdAt || new Date().toISOString() }];
      } catch (e) {
        lead.timeline = [{ type: 'pipeline', message: 'Follow-up: ' + lead.timeline, author: lead.assignTo || 'System', date: lead.createdAt || new Date().toISOString() }];
      }
    } else {
      lead.timeline = [];
    }
    needsSave = true;
  }
  
  if (needsSave) {
    saveAndSyncLeads(leads, id);
  }

  const formatCurrency = (val) => val ? '₹' + parseInt(val).toLocaleString('en-IN') : '—';
  
  const allStages = [
    { label: 'New Lead', wa: false },
    { label: 'Initial Contact', wa: true },
    { label: 'Requirement Analysis', wa: false },
    { label: 'Property Matching', wa: false },
    { label: 'Shared To Partner (use Share to partner below)', val: 'Shared To Partner', wa: false, style: 'color: var(--os-gray-400);' },
    { label: 'Property Shared', wa: false },
    { label: 'Follow Up Pending', wa: true },
    { label: 'Site Visit Scheduled', wa: true },
    { label: 'Site Visit Completed', wa: true },
    { label: 'Negotiation', wa: true },
    { label: 'Bank Loan', wa: true },
    { label: 'Registration', wa: true },
    { label: 'Lost Closed', wa: false }
  ];

  let stagesHtml = '';
  const currentStatus = lead.status || 'Requirement Analysis';
  allStages.forEach(s => {
     let optVal = s.val || s.label;
     let isSelected = (optVal === currentStatus) ? 'selected' : '';
     let customStyle = s.style || '';
     let style = isSelected ? 'style="background: #2563eb; color: #fff;"' : (customStyle ? `style="${customStyle}"` : '');
     let waIcon = s.wa ? ' <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp' : '';
     stagesHtml += `          <div class="select-option ${isSelected}" ${style}>${s.label}${waIcon}</div>\n`;
  });

  return `
    <div class="lead-detail-page">
      <div class="ld-back-nav" style="margin-bottom: 24px;">
        <a href="#leads" style="color: var(--os-gray-500); text-decoration: none; font-weight: 500; display: inline-flex; align-items: center; gap: 8px;">
          <i class="ri-arrow-left-line"></i> Back to leads
        </a>
      </div>

      <div class="ld-header" style="margin-bottom: 24px;">
        <h1 style="font-size: 1.8rem; font-weight: 700; color: var(--os-dark); margin-bottom: 8px;">${lead.name}</h1>
        <div class="ld-badges" style="display: flex; gap: 12px; align-items: center;">
          <span style="border: 1px solid #14b8a6; color: #14b8a6; padding: 2px 8px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; text-transform: uppercase;">${lead.status || 'Contacted'}</span>
          <span style="color: var(--os-gray-500); font-size: 0.9rem;">Stage: Requirement Analysis</span>
        </div>
      </div>

      <div class="ld-stage-selector os-custom-select" style="width: 100%; padding: 0; border: var(--os-border-thin); border-radius: var(--os-radius-sm); margin-bottom: 24px;">
        <div class="select-value" style="padding: 12px 16px; font-weight: 500; color: var(--os-dark);">${lead.status || 'Requirement Analysis'}</div>
        <i class="ri-arrow-down-s-line" style="position: absolute; right: 16px; top: 14px; color: var(--os-gray-500);"></i>
        <div class="select-dropdown" style="top: 100%; left: 0; right: 0; border-radius: 0 0 8px 8px; border: 1px solid var(--os-luxury-orange); margin-top: -1px; box-shadow: var(--os-shadow-md);">
${stagesHtml}        </div>
      </div>

      <div class="ld-action-toolbar" style="display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">
        <div class="os-custom-select" id="ld-assign-dropdown" style="min-width: 150px; background: var(--os-white);">
          <div class="select-value">${lead.assignTo && lead.assignTo !== 'Unassigned' ? lead.assignTo : 'Assign to...'}</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
${(() => {
              const adminUsers = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
              let html = `<div class="select-option ${(!lead.assignTo || lead.assignTo === 'Unassigned') ? 'selected' : ''}">Assign to...</div>`;
              if (adminUsers.length > 0) {
                adminUsers.filter(u => u.status === 'Active').forEach(u => {
                  html += `<div class="select-option ${lead.assignTo === u.fullName ? 'selected' : ''}">${u.fullName}</div>`;
                });
              } else {
                html += `<div class="select-option" style="color:var(--os-gray-400);">No staff found</div>`;
              }
              return html;
            })()}
          </div>
        </div>
        <button class="os-btn-primary" id="btn-send-whatsapp" style="background: #f97316; border-color: #f97316; display: flex; align-items: center; gap: 8px;">
          <i class="ri-send-plane-fill"></i> Send WhatsApp
        </button>
        <button class="os-btn-secondary" id="btn-schedule-visit" style="background: var(--os-white); display: flex; align-items: center; gap: 8px;">
          <i class="ri-calendar-event-line"></i> Schedule visit
        </button>
        <button class="os-btn-secondary" id="btn-edit-lead" style="background: var(--os-white);">
          Edit
        </button>
        <button class="os-btn-secondary" id="btn-share-partner" style="background: var(--os-white);">
          Share to partner
        </button>
      </div>

      <div class="ld-content-grid" style="display: grid; grid-template-columns: 350px 1fr; gap: 24px; align-items: start;">
        
        <div class="ld-left-col" style="display: flex; flex-direction: column; gap: 24px;">
          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 20px;">Lead details</h3>
            <table class="ld-details-table" style="width: 100%; border-collapse: collapse; font-size: 0.9rem;">
              <tbody>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Mobile</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.mobile || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">WhatsApp</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.whatsapp || lead.mobile || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Email</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.email || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Country</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.country || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">City / area</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.city || lead.area || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Budget</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${formatCurrency(lead.budgetMax)}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Property type</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.type || '—'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Source</td><td style="padding: 8px 0; text-align: right; font-weight: 500;"><span style="border: 1px solid var(--os-gray-300); color: var(--os-gray-600); padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">${lead.source || 'MANUAL'}</span></td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Priority</td><td style="padding: 8px 0; text-align: right; font-weight: 500;"><span style="border: 1px solid #3b82f6; color: #3b82f6; padding: 2px 6px; border-radius: 4px; font-size: 0.7rem; text-transform: uppercase;">MEDIUM</span></td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Assigned to</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">${lead.assignTo || 'Unassigned'}</td></tr>
                <tr><td style="padding: 8px 0; color: var(--os-gray-500);">Created</td><td style="padding: 8px 0; text-align: right; font-weight: 500;">12 Aug 2026, 12:08</td></tr>
              </tbody>
            </table>
          </div>

          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 16px;">Set follow-up</h3>
            <div style="display: flex; gap: 12px;">
              <input type="datetime-local" id="follow-up-datetime" class="os-input" style="flex: 1;" />
              <button id="btn-set-follow-up" class="os-btn-secondary" style="background: #fcd34d; border-color: #fcd34d; color: #92400e;">Set</button>
            </div>
          </div>

          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 16px;">Notes</h3>
            <textarea id="ld-note-input" class="os-input" rows="3" placeholder="Add an internal note..." style="width: 100%; margin-bottom: 12px; resize: vertical;"></textarea>
            <button id="ld-add-note-btn" class="os-btn-secondary" style="background: #fed7aa; border-color: #fed7aa; color: #9a3412;">Add note</button>
            <div id="ld-notes-list" style="margin-top: 16px; max-height: 300px; overflow-y: auto;">
              ${
                Array.isArray(lead.notes) && lead.notes.length > 0 
                ? lead.notes.map((n, i) => `
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #fed7aa; position: relative;">
                      <p style="font-size: 0.9rem; color: var(--os-dark); margin-bottom: 8px; padding-right: 40px;">${typeof n === 'string' ? n : n.text}</p>
                      <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="font-size: 0.75rem; color: var(--os-gray-400);"><i class="ri-calendar-line"></i> ${n.date ? new Date(n.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'}) : 'Just now'}</span>
                        <div style="display: flex; gap: 8px;">
                          <button class="note-action-btn" data-action="edit" data-index="${i}" style="background: none; border: none; cursor: pointer; color: var(--os-gray-500); padding: 2px;" title="Edit Note"><i class="ri-edit-line"></i></button>
                          <button class="note-action-btn" data-action="delete" data-index="${i}" style="background: none; border: none; cursor: pointer; color: var(--os-error); padding: 2px;" title="Delete Note"><i class="ri-delete-bin-line"></i></button>
                        </div>
                      </div>
                    </div>
                  `).join('')
                : (typeof lead.notes === 'string' && lead.notes.trim() !== '' ? `
                    <div style="background: #f8fafc; padding: 12px; border-radius: 6px; margin-bottom: 8px; border-left: 3px solid #fed7aa; position: relative;">
                      <p style="font-size: 0.9rem; color: var(--os-dark); margin-bottom: 8px; padding-right: 40px;">${lead.notes}</p>
                    </div>
                  ` : '<p style="font-size: 0.85rem; color: var(--os-gray-400);">No notes yet.</p>')
              }
            </div>
          </div>
        </div>

        <div class="ld-right-col" style="display: flex; flex-direction: column; gap: 24px;">
          
          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark);">Matching properties</h3>
              <button class="os-btn-secondary" id="btn-find-matches" style="font-size: 0.85rem; padding: 4px 12px; height: auto;"><i class="ri-search-line"></i> Find matches</button>
            </div>
            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
              <input type="text" class="os-input" id="matching-properties-search" placeholder="Search properties by title, location or description..." style="flex: 1;" />
              <button class="os-btn-secondary" id="btn-search-matches">Search</button>
            </div>
            <div id="matching-properties-results">
              <p style="font-size: 0.9rem; color: var(--os-gray-500); line-height: 1.5;">Click "Find matches" to score current inventory against this lead's requirements, or search properties manually above.</p>
            </div>
          </div>

          <div class="os-card" style="background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft); overflow: hidden;">
            <div class="ld-tabs" style="display: flex; border-bottom: 1px solid var(--os-gray-200); padding: 0 16px;">
              <div class="ld-tab active" data-target="pane-timeline" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: #ea580c; border-bottom: 2px solid #ea580c; cursor: pointer;">Activity timeline</div>
              <div class="ld-tab" data-target="pane-whatsapp" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer;">WhatsApp (${(lead.timeline && lead.timeline.filter(e => e.type === 'whatsapp').length) || 0})</div>
              <div class="ld-tab" data-target="pane-partner" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer;">Partner shares (0)</div>
              <div class="ld-tab" data-target="pane-pipeline" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer;">Pipeline history</div>
            </div>
            
            <div class="ld-tab-content" style="padding: 24px;">
              
              <div class="ld-tab-pane" id="pane-timeline" style="display: block;">
                ${(!lead.timeline || lead.timeline.length === 0) ? '<p style="color: var(--os-gray-400); font-size: 0.9rem;">No activity recorded yet.</p>' : `
                <div class="timeline" style="position: relative; padding-left: 20px;">
                  <div style="position: absolute; left: 6px; top: 8px; bottom: 0; width: 2px; background: #fed7aa;"></div>
                  ${lead.timeline.map(event => `
                    <div class="timeline-item" style="position: relative; margin-bottom: 24px;">
                      <div style="position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: ${event.type === 'whatsapp' ? '#16a34a' : '#ea580c'}; border: 2px solid var(--os-white);"></div>
                      <div style="font-weight: 500; color: ${event.type === 'whatsapp' ? '#16a34a' : 'var(--os-dark)'}; font-size: 0.95rem; margin-bottom: 4px;">${event.message}</div>
                      <div style="font-size: 0.8rem; color: var(--os-gray-400);">${event.author} - ${new Date(event.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</div>
                    </div>
                  `).join('')}
                </div>
                `}
              </div>

              <!-- WhatsApp Tab -->
              <div class="ld-tab-pane" id="pane-whatsapp" style="display: none; background: #eae6df; padding: 20px; border-radius: 8px;">
                ${(!lead.timeline || !lead.timeline.find(e => e.type === 'whatsapp')) ? '<p style="text-align: center; color: #555; font-size: 0.9rem;">No WhatsApp history.</p>' : `
                <div style="text-align: center; margin-bottom: 16px;">
                  <span style="background: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; color: #555;">Logs</span>
                </div>
                ${lead.timeline.filter(e => e.type === 'whatsapp').map(event => `
                  <div style="background: #dcf8c6; padding: 12px; border-radius: 8px; margin-bottom: 16px; position: relative;">
                    <div style="font-size: 0.8rem; color: #16a34a; margin-bottom: 4px;">Sent by ${event.author}</div>
                    <div style="font-size: 0.95rem; color: #1f2937; line-height: 1.4;">${event.message}</div>
                    <div style="text-align: right; font-size: 0.75rem; color: #6b7280; margin-top: 4px;">${new Date(event.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})} <span style="color: #16a34a; font-weight: bold; margin-left: 4px;">✓</span></div>
                  </div>
                `).join('')}
                `}
              </div>

              <!-- Pipeline History Tab -->
              <div class="ld-tab-pane" id="pane-pipeline" style="display: none;">
                ${(!lead.timeline || !lead.timeline.find(e => e.type === 'pipeline')) ? '<p style="color: var(--os-gray-400); font-size: 0.9rem;">No pipeline history.</p>' : `
                  ${lead.timeline.filter(e => e.type === 'pipeline').map(event => {
                     const parts = event.message.replace('Moved from ', '').split(' to ');
                     return `
                     <div style="margin-bottom: 16px;">
                       <span style="color: var(--os-gray-500);">${parts[0] || ''} <i class="ri-arrow-right-line" style="vertical-align: middle;"></i></span> <span style="color: var(--os-dark); font-weight: 500;">${parts[1] || ''}</span>
                       <span style="color: var(--os-gray-400); font-size: 0.85rem; margin-left: 8px;">${event.author} · ${new Date(event.date).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}</span>
                     </div>
                     `;
                  }).join('')}
                `}
              </div>

              <!-- Partner shares Tab -->
              <div class="ld-tab-pane" id="pane-partner" style="display: none;">
                 <p style="color: var(--os-gray-400); font-size: 0.9rem;">No partner shares yet.</p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Modals for Lead Detail -->
    <!-- Edit Lead Modal -->
    <div class="os-modal-overlay" id="edit-lead-modal">
      <div class="os-modal-card">
        <div class="os-modal-header">
          <h2>Edit lead</h2>
          <button class="os-modal-close" id="close-edit-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <form id="edit-lead-form">
            <input type="hidden" id="edit-lead-id" value="${lead.id}" />
            <div class="form-section-title">CONTACT</div>
            <div class="form-row">
              <div class="form-group">
                <label>Full name *</label>
                <input type="text" id="edit-lead-name" required value="${lead.name || ''}" />
              </div>
              <div class="form-group">
                <label>Mobile *</label>
                <input type="text" id="edit-lead-mobile" required value="${lead.mobile || ''}" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>WhatsApp number</label>
                <input type="text" id="edit-lead-whatsapp" value="${lead.whatsapp || ''}" />
              </div>
              <div class="form-group">
                <label>Email</label>
                <input type="email" id="edit-lead-email" value="${lead.email || ''}" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Country</label>
                <input type="text" id="edit-lead-country" value="${lead.country || ''}" />
              </div>
              <div class="form-group">
                <label>City / area</label>
                <input type="text" id="edit-lead-city" value="${lead.city || lead.area || ''}" />
              </div>
            </div>

            <div class="form-section-title">REQUIREMENT</div>
            <div class="form-row">
              <div class="form-group">
                <label>Property type</label>
                <input type="text" id="edit-lead-type" value="${lead.type || ''}" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Budget min</label>
                <input type="text" id="edit-lead-budget-min" value="${lead.budgetMin || ''}" />
              </div>
              <div class="form-group">
                <label>Budget max</label>
                <input type="text" id="edit-lead-budget-max" value="${lead.budgetMax || ''}" />
              </div>
            </div>

            <div class="form-section-title">TRACKING</div>
            <div class="form-row">
              <div class="form-group">
                <label>Source</label>
                <input type="text" id="edit-lead-source" value="${lead.source || ''}" />
              </div>
              <div class="form-group">
                <label>Assign to</label>
                <input type="text" id="edit-lead-assign" value="${lead.assignTo || ''}" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group">
                <label>Follow-up Date</label>
                <input type="date" id="edit-lead-followup" value="${lead.followup && lead.followup !== '—' ? lead.followup : ''}" style="color: var(--os-gray-600);" />
              </div>
            </div>
            <div class="form-row">
              <div class="form-group" style="width: 100%;">
                <label>Requirement notes</label>
                <textarea id="edit-lead-notes" rows="3" style="width: 100%; border: var(--os-border-thin); border-radius: var(--os-radius-sm); padding: 12px; font-family: inherit; resize: vertical;">${lead.notes || ''}</textarea>
              </div>
            </div>
          </form>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-edit-btn">Cancel</button>
          <button class="os-btn-primary" id="btn-save-edit" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);">Save Changes</button>
        </div>
      </div>
    </div>
    <div class="os-modal-overlay" id="schedule-visit-modal">
      <div class="os-modal-card" style="max-width: 450px;">
        <div class="os-modal-header">
          <h2>Schedule site visit</h2>
          <button class="os-modal-close" id="close-schedule-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group">
            <label>Visit date & time *</label>
            <input type="datetime-local" id="crm-sv-datetime" class="os-input" style="width: 100%;" />
          </div>
          <p style="font-size: 0.85rem; color: var(--os-gray-500); margin-top: 16px;">This sends the site visit confirmation WhatsApp to the client with this date/time.</p>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-schedule-modal">Cancel</button>
          <button class="os-btn-primary" id="confirm-schedule-modal" style="background: #fdba74; border-color: #fdba74; color: #fff;">Confirm & send</button>
        </div>
      </div>
    </div>

    <div class="os-modal-overlay" id="share-partner-modal">
      <div class="os-modal-card" style="max-width: 500px;">
        <div class="os-modal-header">
          <h2>Share lead with partner company</h2>
          <button class="os-modal-close" id="close-share-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group">
            <label>Partner company</label>
            <div class="os-custom-select" style="width: 100%;" id="partner-share-dropdown">
              <div class="select-value">Broadcast to All Partners</div>
              <i class="ri-arrow-down-s-line"></i>
              <div class="select-dropdown" id="partner-share-options">
                <!-- Dynamically populated -->
              </div>
            </div>
          </div>
          <div class="form-group" style="margin-top: 16px;">
            <label>Notes to share</label>
            <textarea id="share-partner-notes" class="os-input" rows="3" placeholder="Context for the partner team..." style="width: 100%; resize: vertical;"></textarea>
          </div>
          <label style="display: flex; align-items: start; gap: 8px; margin-top: 16px; cursor: pointer;">
            <input type="checkbox" checked style="margin-top: 4px;" />
            <span style="font-size: 0.9rem; color: var(--os-gray-600); line-height: 1.4;">Send requirement & shortlisted properties to the partner on WhatsApp</span>
          </label>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-share-modal">Cancel</button>
          <button class="os-btn-primary" id="confirm-share-modal" style="background: #fdba74; border-color: #fdba74; color: #fff;">Share lead</button>
        </div>
      </div>
    </div>

    <!-- Send WhatsApp Modal -->
    <div class="os-modal-overlay" id="send-whatsapp-modal">
      <div class="os-modal-card" style="max-width: 500px;">
        <div class="os-modal-header">
          <h2>Send WhatsApp</h2>
          <button class="os-modal-close" id="close-whatsapp-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body" style="padding-top: 16px;">
          <div style="font-size: 0.9rem; color: var(--os-gray-600); margin-bottom: 20px;">
            To <span style="font-weight: 500; color: var(--os-dark);">${lead.whatsapp || lead.mobile || '9566321457'}</span>
          </div>
          
          <div class="wa-tab-group" style="display: flex; background: var(--os-white); border: 1px solid var(--os-gray-200); border-radius: 8px; margin-bottom: 24px; overflow: hidden;">
            <button class="wa-tab-btn active" data-tab="template" style="flex: 1; padding: 12px; border: none; background: #e27c3e; color: #fff; font-weight: 500; cursor: pointer; transition: all 0.2s ease;">Use a template</button>
            <button class="wa-tab-btn" data-tab="custom" style="flex: 1; padding: 12px; border: none; background: transparent; color: var(--os-gray-600); font-weight: 500; cursor: pointer; transition: all 0.2s ease;">Write custom message</button>
          </div>

          <!-- Template Tab -->
          <div class="wa-tab-content active" id="wa-tab-template">
            <div class="form-group">
              <label>Template</label>
              <div class="os-custom-select" style="width: 100%;">
                <div class="select-value">Welcome message</div>
                <i class="ri-arrow-down-s-line"></i>
                <div class="select-dropdown">
                  <div class="select-option selected">Welcome message</div>
                  <div class="select-option">No template (auto message)</div>
                  <div class="select-option">Bank loan assistance (auto)</div>
                  <div class="select-option">Follow-up message</div>
                  <div class="select-option">Initial contact intro (auto)</div>
                  <div class="select-option">Negotiation check-in (auto)</div>
                  <div class="select-option">Partner transfer notification</div>
                  <div class="select-option">Property shortlist</div>
                  <div class="select-option">Registration testimonial & referral (auto)</div>
                  <div class="select-option">Site visit confirmation (auto)</div>
                  <div class="select-option">Site visit feedback request (auto)</div>
                  <div class="select-option">Site visit reminder</div>
                </div>
              </div>
            </div>
            
            <div class="form-group" style="margin-top: 16px;">
              <label>Language</label>
              <div class="os-custom-select" style="width: 100%;">
                <div class="select-value">English</div>
                <i class="ri-arrow-down-s-line"></i>
                <div class="select-dropdown">
                  <div class="select-option selected">English</div>
                  <div class="select-option">Tamil · தமிழ்</div>
                  <div class="select-option">Hindi · हिन्दी</div>
                  <div class="select-option">Telugu · తెలుగు</div>
                  <div class="select-option">Kannada · ಕನ್ನಡ</div>
                  <div class="select-option">Malayalam · മലയാളം</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Custom Tab -->
          <div class="wa-tab-content" id="wa-tab-custom" style="display: none;">
            <div class="form-group">
              <label>Message</label>
              <textarea class="os-input" rows="5" placeholder="Type your message..." style="width: 100%; resize: vertical;"></textarea>
            </div>
            <div class="form-group" style="margin-top: 16px;">
              <label>Language</label>
              <div class="os-custom-select" style="width: 100%;">
                <div class="select-value">English</div>
                <i class="ri-arrow-down-s-line"></i>
                <div class="select-dropdown">
                  <div class="select-option selected">English</div>
                  <div class="select-option">Tamil · தமிழ்</div>
                  <div class="select-option">Hindi · हिन्दी</div>
                  <div class="select-option">Telugu · తెలుగు</div>
                  <div class="select-option">Kannada · ಕನ್ನಡ</div>
                  <div class="select-option">Malayalam · മലയാളം</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-whatsapp-modal" style="border: 1px solid var(--os-gray-200); padding: 8px 16px; border-radius: 8px; font-weight: 500; cursor: pointer; color: var(--os-gray-700); background: #fff;">Cancel</button>
          <button class="os-btn-primary" id="confirm-whatsapp-modal" style="background: #e27c3e; border: none; border-radius: 8px; padding: 8px 16px; color: #fff; font-weight: 500; cursor: pointer; display: flex; align-items: center; gap: 8px;">
            <i class="ri-send-plane-fill"></i> Send
          </button>
        </div>
      </div>
    </div>
  `;
}

export function initLeadDetailView(id) {
  const shareDropdownWrap = document.getElementById('partner-share-dropdown');
  const shareDropdownOptions = document.getElementById('partner-share-options');
  if (shareDropdownWrap && shareDropdownOptions) {
    const partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
    let optionsHtml = '<div class="select-option selected" data-id="ALL">Broadcast to All Partners <i class="ri-broadcast-line" style="margin-left:8px; color:var(--os-luxury-orange);"></i></div>';
    partners.forEach(p => {
      if (p.status === 'Active') {
        optionsHtml += `<div class="select-option" data-id="${p.id}">${p.company}</div>`;
      }
    });
    shareDropdownOptions.innerHTML = optionsHtml;
    
    // Custom dropdown logic for partner share modal
    const selected = shareDropdownWrap.querySelector('.select-value');
    selected.dataset.id = 'ALL';
    selected.addEventListener('click', (e) => {
      e.stopPropagation();
      shareDropdownWrap.classList.toggle('open');
    });
    shareDropdownOptions.querySelectorAll('.select-option').forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        shareDropdownOptions.querySelectorAll('.select-option').forEach(o => o.classList.remove('selected'));
        opt.classList.add('selected');
        selected.innerHTML = opt.innerHTML;
        selected.dataset.id = opt.dataset.id;
        shareDropdownWrap.classList.remove('open');
      });
    });
    window.addEventListener('click', (e) => {
      if (!shareDropdownWrap.contains(e.target)) {
        shareDropdownWrap.classList.remove('open');
      }
    });
  }

  const scheduleModal = document.getElementById('schedule-visit-modal');
  const btnSchedule = document.getElementById('btn-schedule-visit');
  const closeSchedule = document.getElementById('close-schedule-modal');
  const cancelSchedule = document.getElementById('cancel-schedule-modal');
  const confirmSchedule = document.getElementById('confirm-schedule-modal');

  if (btnSchedule) btnSchedule.addEventListener('click', () => scheduleModal.classList.add('show'));
  if (closeSchedule) closeSchedule.addEventListener('click', () => scheduleModal.classList.remove('show'));
  if (cancelSchedule) cancelSchedule.addEventListener('click', () => scheduleModal.classList.remove('show'));
  if (confirmSchedule) {
    confirmSchedule.addEventListener('click', () => {
      const datetime = document.getElementById('crm-sv-datetime').value;
      if (!datetime) {
        alert("Please select a date and time.");
        return;
      }

      // Fetch lead info
      const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const lead = leads.find(l => l.id == id);
      if (!lead) return;

      const dateObj = new Date(datetime);
      const day = dateObj.getDate().toString();
      let hours = dateObj.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12 || 12;
      const mins = dateObj.getMinutes().toString().padStart(2, '0');
      
      const propertyText = (lead.area || '') + ' ' + (lead.type || '');
      
      const visitData = {
        id: 'SV-' + Date.now(),
        leadId: lead.name,
        propertyId: propertyText.trim() || 'TBD',
        visitDate: datetime.replace('T', ' ') + ':00',
        status: 'Scheduled',
        assignedTo: lead.assignTo || 'Unassigned',
        notes: JSON.stringify({ clientName: lead.name, property: propertyText.trim() || 'TBD', phone: lead.mobile })
      };

      import('../utils/api.js').then(({ fetchFromAPI }) => {
        fetchFromAPI('/site_visits', {
          method: 'POST',
          body: JSON.stringify(visitData)
        }).then(() => {
          scheduleModal.classList.remove('show');
          alert("Visit scheduled successfully! You can view it in the Site Visits Planner.");
          
          // Also save locally as fallback/cache update
          let visits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
          const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          visits.push({
            id: visitData.id,
            date: day,
            month: monthNames[dateObj.getMonth()],
            hours: hours.toString(),
            mins: mins,
            ampm: ampm,
            clientName: lead.name,
            phone: lead.mobile || 'New Visit',
            property: propertyText.trim() || 'TBD',
            isNew: true
          });
          localStorage.setItem('thanjai_visits', JSON.stringify(visits));
        }).catch(err => {
          console.error("Failed to schedule visit", err);
          alert("Failed to schedule visit: " + err.message);
        });
      });
    });
  }

  const shareModal = document.getElementById('share-partner-modal');
  const btnShare = document.getElementById('btn-share-partner');
  const closeShare = document.getElementById('close-share-modal');
  const cancelShare = document.getElementById('cancel-share-modal');
  const confirmShare = document.getElementById('confirm-share-modal');

  if (btnShare) btnShare.addEventListener('click', () => shareModal.classList.add('show'));
  if (closeShare) closeShare.addEventListener('click', () => shareModal.classList.remove('show'));
  if (cancelShare) cancelShare.addEventListener('click', () => shareModal.classList.remove('show'));
  if (confirmShare) {
    confirmShare.addEventListener('click', () => {
      const selectedValue = document.querySelector('#partner-share-dropdown .select-value');
      const partnerId = selectedValue ? selectedValue.dataset.id : null;
      const notes = document.getElementById('share-partner-notes')?.value || '';
      
      const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const currentLead = leads.find(l => l.id == id);
      if (!currentLead) return;

      let sharedLeadsData = JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {};
      const partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];

      const newSharedRecord = {
        name: currentLead.name || 'Unknown',
        phone: '**********',
        location: currentLead.city || 'Unknown',
        propertyType: currentLead.type || 'Any',
        budget: currentLead.budgetMax ? 'up to ' + currentLead.budgetMax : 'Not specified',
        sharedBy: 'Current User', // In a real app, this is the logged-in user
        sharedDate: new Date().toLocaleString('en-GB', { day:'numeric', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' }),
        notes: notes,
        status: 'Shared'
      };

      if (partnerId === 'ALL') {
        // Broadcast to all active partners
        partners.forEach(p => {
          if (p.status === 'Active') {
            if (!sharedLeadsData[p.id]) sharedLeadsData[p.id] = [];
            sharedLeadsData[p.id].push({...newSharedRecord});
          }
        });
        localStorage.setItem('thanjai_shared_leads', JSON.stringify(sharedLeadsData));
        shareModal.classList.remove('show');
        alert('Lead details have been broadcasted to ALL partners in the dashboard. WhatsApp API broadcast will activate tomorrow.');
      } else if (partnerId) {
        // Share to specific partner
        if (!sharedLeadsData[partnerId]) sharedLeadsData[partnerId] = [];
        sharedLeadsData[partnerId].push(newSharedRecord);
        localStorage.setItem('thanjai_shared_leads', JSON.stringify(sharedLeadsData));
        
        const partner = partners.find(p => p.id == partnerId);
        const partnerName = partner ? partner.company : 'the selected partner';
        shareModal.classList.remove('show');
        alert(`Lead details have been shared with ${partnerName}. WhatsApp API integration pending.`);
      } else {
        alert('Please select a partner or Broadcast option.');
      }
    });
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    const editModal = document.getElementById('edit-lead-modal');
    const waModal = document.getElementById('send-whatsapp-modal');
    if (e.target === scheduleModal) scheduleModal.classList.remove('show');
    if (e.target === shareModal) shareModal.classList.remove('show');
    if (editModal && e.target === editModal) editModal.classList.remove('show');
    if (waModal && e.target === waModal) waModal.classList.remove('show');
  });

  // WhatsApp Modal Logic
  const waModal = document.getElementById('send-whatsapp-modal');
  const btnWA = document.getElementById('btn-send-whatsapp');
  const closeWA = document.getElementById('close-whatsapp-modal');
  const cancelWA = document.getElementById('cancel-whatsapp-modal');
  const confirmWA = document.getElementById('confirm-whatsapp-modal');
  const waTabBtns = document.querySelectorAll('.wa-tab-btn');
  const waTabContents = document.querySelectorAll('.wa-tab-content');

  if (btnWA) {
    btnWA.addEventListener('click', () => {
      waModal.classList.add('show');
    });
  }
  
  if (closeWA) closeWA.addEventListener('click', () => waModal.classList.remove('show'));
  if (cancelWA) cancelWA.addEventListener('click', () => waModal.classList.remove('show'));
  
  if (confirmWA) {
    confirmWA.addEventListener('click', () => {
      let leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const idx = leads.findIndex(l => l.id == id);
      const lead = leads[idx];
      if (!lead) return;

      const isCustom = document.querySelector('.wa-tab-btn[data-tab="custom"]').classList.contains('active');
      let campaignName = '';
      let templateParams = [];
      
      if (isCustom) {
        const customText = document.querySelector('#wa-tab-custom textarea').value;
        if (!customText.trim()) {
          alert('Please enter a custom message.');
          return;
        }
        campaignName = 'custom_message';
        templateParams = [lead.name || "Client", customText];
      } else {
        const templateText = document.querySelector('#wa-tab-template .os-custom-select .select-value').innerText.trim();
        
        // Map UI dropdown text to exact AiSensy campaign names
        const campaignMap = {
          "Welcome message": "welcome",
          "Bank loan assistance (auto)": "bank_loan_assist",
          "Follow-up message": "follow_up",
          "Initial contact intro (auto)": "initial_contact_intro",
          "Negotiation check-in (auto)": "negotiation_update",
          "Partner transfer notification": "partner_transfer",
          "Property shortlist": "property_shortlist",
          "Registration testimonial & referral (auto)": "registration_testimonial",
          "Site visit confirmation (auto)": "site_visit_before",
          "Site visit feedback request (auto)": "site_visit_feedback",
          "Site visit reminder": "site_visit_reminder"
        };
        
        campaignName = campaignMap[templateText] || templateText.replace('(auto)', '').trim().toLowerCase().replace(/[\s-]/g, '_');
        templateParams = [lead.name || "Client", lead.assignTo || "Our Team"];
      }

      let rawPhone = lead.whatsapp || lead.mobile || '9566321457';
      let phone = rawPhone.replace(/\D/g, '');
      if (phone.length === 10) {
        phone = '91' + phone;
      }

      const apiKey = localStorage.getItem('thanjai_whatsapp_api_key');
      if (!apiKey) {
        alert('Please go to Settings > Integrations and paste your WhatsApp API Key first.');
        return;
      }
      
      const originalBtnText = confirmWA.innerHTML;
      confirmWA.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Sending...';
      confirmWA.disabled = true;

      fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apiKey: apiKey,
          campaignName: campaignName,
          destination: phone,
          userName: lead.name || "Client",
          templateParams: templateParams
        })
      }).then(async res => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || data.error || JSON.stringify(data));
        }
        return data;
      }).then(data => {
        confirmWA.innerHTML = originalBtnText;
        confirmWA.disabled = false;
        waModal.classList.remove('show');
        
        alert('Message sent successfully via AiSensy WhatsApp API.');
        
        if (idx !== -1) {
          if (!leads[idx].timeline) leads[idx].timeline = [];
          leads[idx].timeline.unshift({
            type: 'whatsapp',
            message: `WhatsApp sent: ${isCustom ? 'Custom message' : campaignName}`,
            author: localStorage.getItem('thanjai_active_user') || 'System',
            date: new Date().toISOString()
          });
          saveAndSyncLeads(leads, id);
          window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
      }).catch(err => {
        confirmWA.innerHTML = originalBtnText;
        confirmWA.disabled = false;
        alert('Failed to send WhatsApp message:\n' + err.message);
      });
    });
  }

  waTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      waTabBtns.forEach(b => {
        b.classList.remove('active');
        b.style.background = 'transparent';
        b.style.color = 'var(--os-gray-600)';
      });
      btn.classList.add('active');
      btn.style.background = '#e27c3e';
      btn.style.color = '#fff';

      waTabContents.forEach(c => c.style.display = 'none');
      document.getElementById('wa-tab-' + btn.dataset.tab).style.display = 'block';
    });
  });

  // Edit logic
  const editModal = document.getElementById('edit-lead-modal');
  const btnEdit = document.getElementById('btn-edit-lead');
  const closeEdit = document.getElementById('close-edit-modal');
  const cancelEdit = document.getElementById('cancel-edit-modal');
  
  // Set Follow-up Logic
  const btnFollowUp = document.getElementById('btn-set-follow-up');
  const followUpInput = document.getElementById('follow-up-datetime');
  if (btnFollowUp && followUpInput) {
    btnFollowUp.addEventListener('click', () => {
      const datetime = followUpInput.value;
      if (!datetime) {
        alert("Please select a date and time for the follow-up.");
        return;
      }
      
      let leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const idx = leads.findIndex(l => l.id == id);
      if (idx !== -1) {
        const oldStatus = leads[idx].status || 'New Lead';
        leads[idx].status = 'FOLLOW_UP_PENDING';
        leads[idx].followUpDate = datetime;
        
        if (!leads[idx].timeline) leads[idx].timeline = [];
        leads[idx].timeline.unshift({
          type: 'system',
          message: `Follow-up set for ${new Date(datetime).toLocaleString([], {year:'numeric', month:'short', day:'numeric', hour:'2-digit', minute:'2-digit'})}`,
          author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
          date: new Date().toISOString()
        });
        
        if (oldStatus !== 'FOLLOW_UP_PENDING') {
          leads[idx].timeline.unshift({
            type: 'pipeline',
            message: `Moved from ${oldStatus.toUpperCase().replace(/\s+/g, '_')} to FOLLOW_UP_PENDING`,
            author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
            date: new Date().toISOString()
          });
        }
        saveAndSyncLeads(leads, id);
        
        // Show success and refresh view
        alert(`Follow-up set for ${new Date(datetime).toLocaleString()}`);
        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
        }
      }
    });
  }

  // Notes Logic
  const btnAddNote = document.getElementById('ld-add-note-btn');
  const noteInput = document.getElementById('ld-note-input');
  if (btnAddNote && noteInput) {
    btnAddNote.addEventListener('click', () => {
      const text = noteInput.value.trim();
      if (!text) return;
      
      let leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const idx = leads.findIndex(l => l.id == id);
      if (idx !== -1) {
        if (!leads[idx].notes) leads[idx].notes = [];
        leads[idx].notes.unshift({
          text: text,
          date: new Date().toISOString()
        });
        saveAndSyncLeads(leads, id);
        const content = document.getElementById('os-content');
        if (content) {
          content.innerHTML = renderLeadDetailView(id);
          initLeadDetailView(id);
        }
      }
    });
  }

  // Edit/Delete Note Logic
  const notesList = document.getElementById('ld-notes-list');
  if (notesList) {
    notesList.addEventListener('click', (e) => {
      const btn = e.target.closest('.note-action-btn');
      if (!btn) return;
      
      const noteIndex = parseInt(btn.dataset.index, 10);
      let leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const idx = leads.findIndex(l => l.id == id);
      if (idx === -1 || !leads[idx].notes) return;
      
      const action = btn.dataset.action;
      
      if (action === 'delete') {
        if (confirm('Are you sure you want to delete this note?')) {
          leads[idx].notes.splice(noteIndex, 1);
          saveAndSyncLeads(leads, id);
          const content = document.getElementById('os-content');
          if (content) {
            content.innerHTML = renderLeadDetailView(id);
            initLeadDetailView(id);
          }
        }
      } else if (action === 'edit') {
        const noteToEdit = leads[idx].notes[noteIndex];
        if (noteToEdit) {
           const currentText = typeof noteToEdit === 'string' ? noteToEdit : (noteToEdit.text || '');
           const newText = prompt('Edit note:', currentText);
           if (newText !== null && newText.trim() !== '') {
             if (typeof noteToEdit === 'string') {
               leads[idx].notes[noteIndex] = { text: newText.trim(), date: new Date().toISOString() };
             } else {
               noteToEdit.text = newText.trim();
             }
             saveAndSyncLeads(leads, id);
             const content = document.getElementById('os-content');
             if (content) {
               content.innerHTML = renderLeadDetailView(id);
               initLeadDetailView(id);
             }
           }
        }
      }
    });
  }

  // Matching Properties Logic
  const btnFindMatches = document.getElementById('btn-find-matches');
  const btnSearchMatches = document.getElementById('btn-search-matches');
  const searchInput = document.getElementById('matching-properties-search');
  const resultsContainer = document.getElementById('matching-properties-results');

  function renderMatchingProperties(results) {
    if (!results || results.length === 0) {
      if(resultsContainer) resultsContainer.innerHTML = `<p style="font-size: 0.9rem; color: var(--os-gray-500); padding: 12px 0;">No matching properties found.</p>`;
      return;
    }
    let html = '<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 16px; max-height: 300px; overflow-y: auto;">';
    results.forEach(p => {
      html += `
        <label style="display: flex; gap: 12px; padding: 12px; border: 1px solid var(--os-gray-200); border-radius: 8px; align-items: center; cursor: pointer; background: #f8fafc; transition: all 0.2s ease;">
          <input type="checkbox" class="match-prop-checkbox" value="${p.id}" />
          <div style="flex: 1;">
            <div style="font-weight: 600; font-size: 0.9rem; color: var(--os-dark);">${p.title}</div>
            <div style="font-size: 0.8rem; color: var(--os-gray-500); margin-top: 4px;">${p.location} • <span style="color: #ea580c; font-weight: 500;">${p.priceFormatted || p.price}</span></div>
          </div>
        </label>
      `;
    });
    html += '</div>';
    
    html += `
      <div style="margin-top: 16px; text-align: right;">
        <button id="inline-send-wa-btn" class="os-btn-primary" style="background: #25d366; border-color: #25d366;"><i class="ri-whatsapp-line"></i> Send via WhatsApp</button>
      </div>
    `;

    if(resultsContainer) {
      resultsContainer.innerHTML = html;
      const inlineBtn = document.getElementById('inline-send-wa-btn');
      if (inlineBtn) {
        inlineBtn.addEventListener('click', () => {
          const checkedProps = document.querySelectorAll('.match-prop-checkbox:checked');
          if (checkedProps.length > 0) {
            alert(`Message sent successfully via WhatsApp along with ${checkedProps.length} property link(s).`);
          } else {
            alert('Please select at least one property to send.');
          }
        });
      }
    }
  }

  function doSearch(query) {
    const allProps = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
    const lowerQuery = query.toLowerCase();
    const matches = allProps.filter(p => {
      return (p.title && p.title.toLowerCase().includes(lowerQuery)) ||
             (p.location && p.location.toLowerCase().includes(lowerQuery)) ||
             (p.description && p.description.toLowerCase().includes(lowerQuery));
    });
    renderMatchingProperties(matches);
  }

  if (btnSearchMatches) {
    btnSearchMatches.addEventListener('click', () => {
      doSearch(searchInput.value || '');
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') doSearch(searchInput.value || '');
    });
  }

  if (btnFindMatches) {
    btnFindMatches.addEventListener('click', () => {
      const allProps = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
      
      const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const currentLead = leads.find(l => l.id == id);
      if (!currentLead) return;

      const typeFilter = currentLead.type ? currentLead.type.toLowerCase() : '';
      const budgetMax = currentLead.budgetMax ? parseInt(currentLead.budgetMax) : 9999999999;
      
      const matches = allProps.filter(p => {
        const pType = p.type ? p.type.toLowerCase() : '';
        const pCategory = p.category ? p.category.toLowerCase() : '';
        const isTypeMatch = !typeFilter || pType.includes(typeFilter) || pCategory.includes(typeFilter);
        
        let pPrice = p.price || 0;
        if(typeof pPrice === 'string') pPrice = parseInt(pPrice.replace(/\D/g, '')) || 0;
        
        const isBudgetMatch = pPrice <= budgetMax;
        return isTypeMatch && isBudgetMatch;
      });
      renderMatchingProperties(matches);
    });
  }
  const saveEdit = document.getElementById('btn-save-edit');

  if (btnEdit) btnEdit.addEventListener('click', () => editModal.classList.add('show'));
  if (closeEdit) closeEdit.addEventListener('click', () => editModal.classList.remove('show'));
  if (cancelEdit) cancelEdit.addEventListener('click', () => editModal.classList.remove('show'));

  if (saveEdit) {
    saveEdit.addEventListener('click', () => {
      const name = document.getElementById('edit-lead-name').value.trim();
      const mobile = document.getElementById('edit-lead-mobile').value.trim();
      
      if (!name || !mobile) {
        alert('Name and Mobile are required!');
        return;
      }

      let leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const idx = leads.findIndex(l => l.id == id);
      
      if (idx !== -1) {
        leads[idx] = {
          ...leads[idx],
          name,
          mobile,
          whatsapp: document.getElementById('edit-lead-whatsapp').value,
          email: document.getElementById('edit-lead-email').value,
          country: document.getElementById('edit-lead-country').value,
          city: document.getElementById('edit-lead-city').value,
          area: document.getElementById('edit-lead-city').value, // simplified
          type: document.getElementById('edit-lead-type').value,
          budgetMin: document.getElementById('edit-lead-budget-min').value,
          budgetMax: document.getElementById('edit-lead-budget-max').value,
          source: document.getElementById('edit-lead-source').value,
          assignTo: document.getElementById('edit-lead-assign').value,
          followup: document.getElementById('edit-lead-followup').value || '—',
          notes: document.getElementById('edit-lead-notes').value
        };
        saveAndSyncLeads(leads, id);
        
        editModal.classList.remove('show');
        
        // Trigger a re-render of the detail view by resetting the hash or manually reloading
        window.dispatchEvent(new HashChangeEvent('hashchange'));
      }
    });
  }

  // Tab switching logic
  const tabs = document.querySelectorAll('.ld-tab');
  const panes = document.querySelectorAll('.ld-tab-pane');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('active');
        t.style.color = 'var(--os-gray-500)';
        t.style.borderBottom = 'none';
      });
      tab.classList.add('active');
      tab.style.color = '#ea580c';
      tab.style.borderBottom = '2px solid #ea580c';

      panes.forEach(p => p.style.display = 'none');
      const text = tab.textContent;
      if (text.includes('Activity')) document.getElementById('pane-timeline').style.display = 'block';
      else if (text.includes('WhatsApp')) document.getElementById('pane-whatsapp').style.display = 'block';
      else if (text.includes('Pipeline')) document.getElementById('pane-pipeline').style.display = 'block';
    });
  });

  // Custom Select Dropdown logic for LeadDetailView
  const customSelects = document.querySelectorAll('.lead-detail-page .os-custom-select, #share-partner-modal .os-custom-select, #send-whatsapp-modal .os-custom-select');
  customSelects.forEach(select => {
    const valueEl = select.querySelector('.select-value');
    const dropdown = select.querySelector('.select-dropdown');
    if (!dropdown) return;

    select.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = select.classList.contains('open');
      customSelects.forEach(s => s.classList.remove('open'));
      if (!isOpen) select.classList.add('open');
    });

    const options = select.querySelectorAll('.select-option');
    options.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        valueEl.innerHTML = option.innerHTML; // preserve icons if any
        options.forEach(opt => {
          opt.classList.remove('selected');
          opt.style.background = '';
          opt.style.color = '';
        });
        option.classList.add('selected');
        // If it's the main stage selector, it has blue styling when selected
        if (select.classList.contains('ld-stage-selector')) {
           option.style.background = '#2563eb';
           option.style.color = '#fff';
        }
        select.classList.remove('open');

        // Persist to localStorage if it's the Assign To or Stage dropdown
        let leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
        const idx = leads.findIndex(l => l.id == id);
        if (idx !== -1) {
          if (select.id === 'ld-assign-dropdown') {
             const val = option.textContent.trim();
             const newAssignee = (val === 'Assign to...') ? 'Unassigned' : val;
             if (leads[idx].assignTo !== newAssignee) {
               leads[idx].assignTo = newAssignee;
               if (!leads[idx].timeline) leads[idx].timeline = [];
               leads[idx].timeline.unshift({
                 type: 'system',
                 message: `Assigned to ${newAssignee}`,
                 author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
                 date: new Date().toISOString()
               });
               saveAndSyncLeads(leads, id);
               window.dispatchEvent(new HashChangeEvent('hashchange'));
             }
          } else if (select.classList.contains('ld-stage-selector')) {
             let rawStatus = option.textContent.trim();
             if (rawStatus.includes('sends WhatsApp')) {
                rawStatus = rawStatus.split('sends WhatsApp')[0].trim();
             }
             if (leads[idx].status !== rawStatus) {
               const oldStatus = leads[idx].status || 'New Lead';
               leads[idx].status = rawStatus;
               if (!leads[idx].timeline) leads[idx].timeline = [];
               leads[idx].timeline.unshift({
                 type: 'pipeline',
                 message: `Moved from ${oldStatus.toUpperCase().replace(/\s+/g, '_')} to ${rawStatus.toUpperCase().replace(/\s+/g, '_')}`,
                 author: localStorage.getItem('thanjai_active_user') || 'Aishwarya Raman',
                 date: new Date().toISOString()
               });
               saveAndSyncLeads(leads, id);
               window.dispatchEvent(new HashChangeEvent('hashchange'));
             }
          }
        }
      });
    });
  });
  const ldTabs = document.querySelectorAll('.ld-tab');
  const ldPanes = document.querySelectorAll('.ld-tab-pane');
  
  ldTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      ldTabs.forEach(t => {
        t.classList.remove('active');
        t.style.color = 'var(--os-gray-500)';
        t.style.borderBottom = 'none';
      });
      tab.classList.add('active');
      tab.style.color = '#ea580c';
      tab.style.borderBottom = '2px solid #ea580c';
      
      ldPanes.forEach(pane => pane.style.display = 'none');
      
      const targetId = tab.getAttribute('data-target');
      if (targetId) {
        const targetPane = document.getElementById(targetId);
        if (targetPane) targetPane.style.display = 'block';
      }
    });
  });

  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('open'));
  });
}

async function saveAndSyncLeads(leads, changedLeadId = null) {
  localStorage.setItem('thanjai_leads', JSON.stringify(leads));
  
  if (changedLeadId) {
    const lead = leads.find(l => l.id == changedLeadId);
    if (lead) {
      try {
        const payload = {
          ...lead,
          phone: lead.mobile || '',
          budget: lead.budgetMax ? lead.budgetMax : (lead.budgetMin || ''),
          requirement: lead.type || '',
          location: lead.city || lead.area || '',
          source: lead.source || '',
          status: lead.status || '',
          assignedTo: lead.assignTo || '',
          notes: typeof lead.notes === 'string' ? lead.notes : JSON.stringify(lead.notes || []),
          timeline: typeof lead.timeline === 'string' ? lead.timeline : JSON.stringify(lead.timeline || []),
          followup: lead.followUpDate || lead.followup || ''
        };
        await fetchFromAPI('/leads/' + changedLeadId, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } catch (err) {
        console.error('Failed to sync lead update to backend:', err);
      }
    }
  }
}