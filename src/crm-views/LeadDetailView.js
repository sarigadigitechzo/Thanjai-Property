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

  const formatCurrency = (val) => val ? '₹' + parseInt(val).toLocaleString('en-IN') : '—';
  
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
          <div class="select-option">New Lead</div>
          <div class="select-option">Initial Contact <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option selected" style="background: #2563eb; color: #fff;">Requirement Analysis</div>
          <div class="select-option">Property Matching</div>
          <div class="select-option" style="color: var(--os-gray-400);">Shared To Partner (use Share to partner below)</div>
          <div class="select-option">Property Shared</div>
          <div class="select-option">Follow Up Pending <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option">Site Visit Scheduled <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option">Site Visit Completed <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option">Negotiation <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option">Bank Loan <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option">Registration <i class="ri-mail-line" style="font-size: 0.8rem; vertical-align: middle;"></i> sends WhatsApp</div>
          <div class="select-option">Lost Closed</div>
        </div>
      </div>

      <div class="ld-action-toolbar" style="display: flex; gap: 12px; margin-bottom: 32px; flex-wrap: wrap;">
        <div class="os-custom-select" id="ld-assign-dropdown" style="min-width: 150px; background: var(--os-white);">
          <div class="select-value">${lead.assignTo && lead.assignTo !== 'Unassigned' ? lead.assignTo : 'Assign to...'}</div>
          <i class="ri-arrow-down-s-line"></i>
          <div class="select-dropdown">
            <div class="select-option ${(!lead.assignTo || lead.assignTo === 'Unassigned') ? 'selected' : ''}">Assign to...</div>
            <div class="select-option">Kavitha Murugan</div>
            <div class="select-option">Udhay</div>
            <div class="select-option">Vikram Subramanian</div>
          </div>
        </div>
        <button class="os-btn-primary" style="background: #f97316; border-color: #f97316; display: flex; align-items: center; gap: 8px;">
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
              <input type="datetime-local" class="os-input" style="flex: 1;" />
              <button class="os-btn-secondary" style="background: #fcd34d; border-color: #fcd34d; color: #92400e;">Set</button>
            </div>
          </div>

          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark); margin-bottom: 16px;">Notes</h3>
            <textarea class="os-input" rows="3" placeholder="Add an internal note..." style="width: 100%; margin-bottom: 12px; resize: vertical;"></textarea>
            <button class="os-btn-secondary" style="background: #fed7aa; border-color: #fed7aa; color: #9a3412;">Add note</button>
            <p style="margin-top: 16px; font-size: 0.85rem; color: var(--os-gray-400);">No notes yet.</p>
          </div>
        </div>

        <div class="ld-right-col" style="display: flex; flex-direction: column; gap: 24px;">
          
          <div class="os-card" style="padding: 24px; background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
              <h3 style="font-size: 1rem; font-weight: 600; color: var(--os-dark);">Matching properties</h3>
              <button class="os-btn-secondary" style="font-size: 0.85rem; padding: 4px 12px; height: auto;"><i class="ri-search-line"></i> Find matches</button>
            </div>
            <div style="display: flex; gap: 12px; margin-bottom: 16px;">
              <input type="text" class="os-input" placeholder="Search properties by title, location or description..." style="flex: 1;" />
              <button class="os-btn-secondary">Search</button>
            </div>
            <p style="font-size: 0.9rem; color: var(--os-gray-500); line-height: 1.5;">Click "Find matches" to score current inventory against this lead's requirements, or search properties manually above.</p>
          </div>

          <div class="os-card" style="background: var(--os-white); border-radius: var(--os-radius-xl); box-shadow: var(--os-shadow-soft); overflow: hidden;">
            <div class="ld-tabs" style="display: flex; border-bottom: 1px solid var(--os-gray-200); padding: 0 16px;">
              <div class="ld-tab active" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: #ea580c; border-bottom: 2px solid #ea580c; cursor: pointer;">Activity timeline</div>
              <div class="ld-tab" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer;">WhatsApp (1)</div>
              <div class="ld-tab" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer;">Partner shares (0)</div>
              <div class="ld-tab" style="padding: 16px; font-size: 0.9rem; font-weight: 500; color: var(--os-gray-500); cursor: pointer;">Pipeline history</div>
            </div>
            
            <div class="ld-tab-content" style="padding: 24px;">
              
              <div class="ld-tab-pane" id="pane-timeline" style="display: block;">
                <div class="timeline" style="position: relative; padding-left: 20px;">
                  <div style="position: absolute; left: 6px; top: 8px; bottom: 0; width: 2px; background: #fed7aa;"></div>
                  
                  <div class="timeline-item" style="position: relative; margin-bottom: 24px;">
                    <div style="position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #ea580c; border: 2px solid var(--os-white);"></div>
                    <div style="font-weight: 500; color: var(--os-dark); font-size: 0.95rem; margin-bottom: 4px;">Moved from FOLLOW_UP_PENDING to REQUIREMENT_ANALYSIS</div>
                    <div style="font-size: 0.8rem; color: var(--os-gray-400);">Aishwarya Raman - 14 Aug 2026, 11:25</div>
                  </div>

                  <div class="timeline-item" style="position: relative; margin-bottom: 24px;">
                    <div style="position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #ef4444; border: 2px solid var(--os-white);"></div>
                    <div style="font-weight: 500; color: #ef4444; font-size: 0.95rem; margin-bottom: 4px;">Automated WhatsApp "Follow-up message" failed to send</div>
                    <div style="font-size: 0.8rem; color: var(--os-gray-400);">System - 14 Aug 2026, 11:25</div>
                  </div>

                  <div class="timeline-item" style="position: relative; margin-bottom: 24px;">
                    <div style="position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #ea580c; border: 2px solid var(--os-white);"></div>
                    <div style="font-weight: 500; color: var(--os-dark); font-size: 0.95rem; margin-bottom: 4px;">Moved from NEW_LEAD to FOLLOW_UP_PENDING</div>
                    <div style="font-size: 0.8rem; color: var(--os-gray-400);">Aishwarya Raman - 14 Aug 2026, 11:25</div>
                  </div>

                  <div class="timeline-item" style="position: relative;">
                    <div style="position: absolute; left: -20px; top: 4px; width: 10px; height: 10px; border-radius: 50%; background: #ea580c; border: 2px solid var(--os-white);"></div>
                    <div style="font-weight: 500; color: var(--os-dark); font-size: 0.95rem; margin-bottom: 4px;">Lead created manually</div>
                    <div style="font-size: 0.8rem; color: var(--os-gray-400);">Aishwarya Raman - 12 Aug 2026, 12:08</div>
                  </div>
                </div>
              </div>

              <!-- WhatsApp Tab -->
              <div class="ld-tab-pane" id="pane-whatsapp" style="display: none; background: #eae6df; padding: 20px; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 16px;">
                  <span style="background: #fff; padding: 4px 12px; border-radius: 12px; font-size: 0.8rem; color: #555;">Today</span>
                </div>

                <div style="background: #dcf8c6; padding: 12px; border-radius: 8px; margin-bottom: 16px; position: relative;">
                  <div style="font-size: 0.8rem; color: #16a34a; margin-bottom: 4px;">template: Follow-up message</div>
                  <div style="font-size: 0.95rem; color: #1f2937; line-height: 1.4;">Hi mm, just following up on the properties I shared earlier. Did any of them catch your eye? Happy to arrange a viewing. — Aishwarya Raman</div>
                  <div style="text-align: right; font-size: 0.75rem; color: #6b7280; margin-top: 4px;">11:25 <span style="color: #ef4444; font-weight: bold; margin-left: 4px;">!</span></div>
                </div>

                <div style="background: #dcf8c6; padding: 12px; border-radius: 8px; margin-bottom: 24px; position: relative;">
                  <div style="font-size: 0.8rem; color: #16a34a; margin-bottom: 4px;">template: Site visit confirmation (auto)</div>
                  <div style="font-size: 0.95rem; color: #1f2937; line-height: 1.4;">Hi mm! 👋 Confirming your site visit scheduled for 22 Aug, 08:30 pm. Aishwarya Raman will meet you there — see you soon!</div>
                  <div style="text-align: right; font-size: 0.75rem; color: #6b7280; margin-top: 4px;">15:26 <span style="color: #ef4444; font-weight: bold; margin-left: 4px;">!</span></div>
                </div>

                <div style="display: flex; gap: 12px;">
                  <input type="text" class="os-input" placeholder="Type a reply..." style="flex: 1; border: none; padding: 12px; border-radius: 8px;" />
                  <button class="os-btn-primary" style="background: #d6b49a; border-color: #d6b49a; color: #fff;"><i class="ri-send-plane-fill"></i> Send</button>
                </div>
              </div>

              <!-- Pipeline History Tab -->
              <div class="ld-tab-pane" id="pane-pipeline" style="display: none;">
                <div style="margin-bottom: 16px;">
                  <span style="color: var(--os-gray-500);">Requirement Analysis <i class="ri-arrow-right-line" style="vertical-align: middle;"></i></span> <span style="color: var(--os-dark); font-weight: 500;">Site Visit Scheduled</span>
                  <span style="color: var(--os-gray-400); font-size: 0.85rem; margin-left: 8px;">Aishwarya Raman · 14 Aug 2026, 15:26</span>
                </div>
                <div style="margin-bottom: 16px;">
                  <span style="color: var(--os-gray-500);">Follow Up Pending <i class="ri-arrow-right-line" style="vertical-align: middle;"></i></span> <span style="color: var(--os-dark); font-weight: 500;">Requirement Analysis</span>
                  <span style="color: var(--os-gray-400); font-size: 0.85rem; margin-left: 8px;">Aishwarya Raman · 14 Aug 2026, 11:25</span>
                </div>
                <div>
                  <span style="color: var(--os-gray-500);">New Lead <i class="ri-arrow-right-line" style="vertical-align: middle;"></i></span> <span style="color: var(--os-dark); font-weight: 500;">Follow Up Pending</span>
                  <span style="color: var(--os-gray-400); font-size: 0.85rem; margin-left: 8px;">Aishwarya Raman · 14 Aug 2026, 11:25</span>
                </div>
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
                <input type="text" id="edit-lead-mobile" required value="${lead.mobile || ''}" />
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
    
    // Attach custom dropdown logic
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

      let visits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
      visits.push({
        id: Date.now(),
        date: day,
        month: 'Aug',
        hours: hours.toString(),
        mins: mins,
        ampm: ampm,
        clientName: lead.name,
        phone: lead.mobile || 'New Visit',
        property: propertyText.trim() || 'TBD',
        isNew: true
      });
      localStorage.setItem('thanjai_visits', JSON.stringify(visits));

      // Close modal
      scheduleModal.classList.remove('show');
      alert("Visit scheduled successfully! You can view it in the Site Visits Planner.");
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
    if (e.target === scheduleModal) scheduleModal.classList.remove('show');
    if (e.target === shareModal) shareModal.classList.remove('show');
    if (editModal && e.target === editModal) editModal.classList.remove('show');
  });

  // Edit logic
  const editModal = document.getElementById('edit-lead-modal');
  const btnEdit = document.getElementById('btn-edit-lead');
  const closeEdit = document.getElementById('close-edit-modal');
  const cancelEdit = document.getElementById('cancel-edit-btn');
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
        localStorage.setItem('thanjai_leads', JSON.stringify(leads));
        
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
  const customSelects = document.querySelectorAll('.lead-detail-page .os-custom-select, #share-partner-modal .os-custom-select');
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
             leads[idx].assignTo = (val === 'Assign to...') ? 'Unassigned' : val;
             localStorage.setItem('thanjai_leads', JSON.stringify(leads));
             window.dispatchEvent(new HashChangeEvent('hashchange'));
          } else if (select.classList.contains('ld-stage-selector')) {
             let rawStatus = option.textContent.trim();
             if (rawStatus.includes('sends WhatsApp')) {
                rawStatus = rawStatus.split('sends WhatsApp')[0].trim();
             }
             leads[idx].status = rawStatus;
             localStorage.setItem('thanjai_leads', JSON.stringify(leads));
             window.dispatchEvent(new HashChangeEvent('hashchange'));
          }
        }
      });
    });
  });

  document.addEventListener('click', () => {
    customSelects.forEach(select => select.classList.remove('open'));
  });
}
