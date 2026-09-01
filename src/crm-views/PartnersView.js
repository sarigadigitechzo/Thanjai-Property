import { getRegisteredUsers, getCurrentUser } from '../utils/userAuthStore.js';
import { fetchFromAPI } from '../utils/api.js';
import { showToast, showConfirmModal, showAlertModal } from '../utils/toast.js';
import { addAuditLog } from '../utils/siteImagesStore.js';

export function renderPartnersView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;">
        <div>
          <h1 class="view-title" style="font-size: 1.8rem; font-weight: 800; color: #1A202C; margin: 0 0 6px 0;">Partner Network</h1>
          <p class="view-subtitle" style="font-size: 0.92rem; color: #718096; margin: 0;">Manage channel partners, real estate brokers, and track shared lead referrals</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary" id="btn-add-partner" style="background: #eb5e28; border: none; color: #fff; padding: 10px 20px; border-radius: 10px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 4px 14px rgba(235,94,40,0.3);">
            <i class="ri-add-line" style="font-size: 1.1rem;"></i> + Add Partner
          </button>
        </div>
      </div>

      <div class="pn-container" style="display: grid; grid-template-columns: 360px 1fr; gap: 24px; min-height: 680px;">
        <!-- Left Sidebar: Partner List -->
        <div style="background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          <div style="padding: 16px 20px; border-bottom: 1px solid #EDF2F7; background: #FAFAFA; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #4A5568; text-transform: uppercase; letter-spacing: 0.05em;">Registered Partners</span>
            <span id="pn-partner-count" style="background: #EDF2F7; color: #4A5568; font-size: 0.75rem; font-weight: 800; padding: 2px 8px; border-radius: 12px;">0</span>
          </div>

          <div id="pn-sidebar-list" style="flex: 1; overflow-y: auto; padding: 12px;">
            <!-- Populated by JS -->
          </div>
        </div>

        <!-- Right Content: Partner Profile & Shared Leads -->
        <div style="background: #ffffff; border-radius: 16px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
          
          <!-- Content Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px 24px; border-bottom: 1px solid #EDF2F7;">
            <div>
              <h2 id="pn-content-title" style="font-size: 1.35rem; font-weight: 800; color: #1A202C; margin: 0 0 4px 0;">Select a partner</h2>
              <p id="pn-content-subtitle" style="font-size: 0.85rem; color: #718096; margin: 0;">View partner contact profile and manage shared client referrals</p>
            </div>
            <button class="os-btn-primary" id="btn-share-lead-modal" style="background: #eb5e28; border: none; color: #fff; padding: 9px 18px; border-radius: 10px; font-weight: 700; cursor: pointer; display: none; align-items: center; gap: 8px;">
              <i class="ri-user-shared-line"></i> Share Leads
            </button>
          </div>

          <!-- Partner Info Card -->
          <div id="pn-partner-info-card" style="display: none; padding: 20px 24px; background: #FAF8F5; border-bottom: 1px solid #E7E0D8;">
            <!-- Populated by JS -->
          </div>

          <!-- Shared Leads List Container -->
          <div style="flex: 1; padding: 24px; overflow-y: auto;">
            <div id="pn-leads-container">
              <!-- Populated by JS -->
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- ADD / EDIT PARTNER MODAL -->
    <div class="os-modal-overlay" id="add-partner-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="max-width: 600px; width: 92%; background: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #EDF2F7; padding-bottom: 16px; margin-bottom: 20px;">
          <h3 id="partner-modal-title" style="font-size: 1.3rem; font-weight: 800; color: #1A202C; margin: 0;">Register New Partner</h3>
          <button id="close-partner-modal" style="background: none; border: none; font-size: 1.5rem; color: #718096; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>

        <input type="hidden" id="ap-edit-id" value="" />

        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Company / Agency Name <span style="color: #e53e3e;">*</span></label>
            <input type="text" id="ap-company" placeholder="e.g. Royal Realtors / Digitechzo" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" required />
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Contact Person <span style="color: #e53e3e;">*</span></label>
              <input type="text" id="ap-contact" placeholder="e.g. Ramesh K." style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" required />
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Official Phone <span style="color: #e53e3e;">*</span></label>
              <input type="tel" id="ap-phone" placeholder="e.g. 9876543210" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" required />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">WhatsApp Number</label>
              <input type="tel" id="ap-whatsapp" placeholder="WhatsApp chat number" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Email Address</label>
              <input type="email" id="ap-email" placeholder="partner@example.com" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" />
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Operating City</label>
              <input type="text" id="ap-city" placeholder="e.g. Thanjavur, Trichy" value="Thanjavur" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Status</label>
              <select id="ap-status" style="width: 100%; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; background: #fff; box-sizing: border-box;">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 6px;">Partner Notes / Specialization</label>
            <textarea id="ap-notes" placeholder="e.g. Commercial plot specialist, farmlands, luxury homes..." style="width: 100%; min-height: 70px; padding: 10px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.9rem; box-sizing: border-box;"></textarea>
          </div>
        </div>

        <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 24px; border-top: 1px solid #EDF2F7; padding-top: 16px;">
          <button id="cancel-partner-modal" style="padding: 10px 20px; border: 1px solid #CBD5E0; background: #fff; color: #4A5568; border-radius: 8px; font-weight: 700; cursor: pointer;">Cancel</button>
          <button id="save-partner-modal" style="padding: 10px 24px; border: none; background: #eb5e28; color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer;">Save Partner</button>
        </div>
      </div>
    </div>

    <!-- SHARE LEADS MODAL (WITH MULTI-SELECT CRM LEADS SUPPORT) -->
    <div class="os-modal-overlay" id="share-lead-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 9999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div style="max-width: 680px; width: 94%; background: #ffffff; border-radius: 16px; padding: 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.2); max-height: 90vh; display: flex; flex-direction: column;">
        
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #EDF2F7; padding-bottom: 14px; margin-bottom: 16px;">
          <div>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #1A202C; margin: 0 0 2px 0;">Share Leads with Partner</h3>
            <p style="font-size: 0.82rem; color: #718096; margin: 0;">Select one or multiple leads from your CRM pipeline or add a manual lead</p>
          </div>
          <button id="close-share-lead-modal" style="background: none; border: none; font-size: 1.5rem; color: #718096; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>

        <!-- Mode Toggle Tabs -->
        <div style="display: flex; gap: 10px; margin-bottom: 18px; border-bottom: 2px solid #EDF2F7; padding-bottom: 10px;">
          <button id="tab-crm-leads" style="padding: 8px 16px; border: none; background: #FAF8F5; color: #eb5e28; border-radius: 8px; font-weight: 800; font-size: 0.88rem; cursor: pointer; border: 1px solid #eb5e28;">
            <i class="ri-checkbox-multiple-line"></i> Select from CRM Pipeline
          </button>
          <button id="tab-manual-lead" style="padding: 8px 16px; border: 1px solid #E2E8F0; background: #fff; color: #718096; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer;">
            <i class="ri-edit-line"></i> Manually Enter Lead
          </button>
        </div>

        <!-- TAB 1: MULTI-SELECT CRM LEADS -->
        <div id="section-crm-leads" style="display: flex; flex-direction: column; flex: 1; overflow: hidden;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; gap: 12px;">
            <input type="text" id="search-crm-leads-input" placeholder="Search leads by name, phone, or location..." style="flex: 1; padding: 8px 14px; font-size: 0.85rem; border: 1px solid #CBD5E0; border-radius: 8px;" />
            <button id="select-all-crm-leads-btn" style="padding: 6px 12px; font-size: 0.78rem; font-weight: 700; background: #EDF2F7; border: none; border-radius: 6px; cursor: pointer; color: #4A5568;">Select All</button>
          </div>

          <!-- Scrollable CRM Leads Checkbox List -->
          <div id="crm-leads-checkbox-list" style="flex: 1; max-height: 280px; overflow-y: auto; border: 1px solid #E2E8F0; border-radius: 10px; padding: 10px; display: flex; flex-direction: column; gap: 8px; background: #FAFAFA;">
            <!-- Rendered by JS -->
          </div>

          <div style="margin-top: 14px;">
            <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Handover Notes (Optional)</label>
            <input type="text" id="sl-bulk-notes" placeholder="e.g. Please follow up on urgent basis..." style="width: 100%; padding: 8px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.85rem; box-sizing: border-box;" />
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 18px; border-top: 1px solid #EDF2F7; padding-top: 14px;">
            <button id="cancel-share-lead-modal" style="padding: 9px 18px; border: 1px solid #CBD5E0; background: #fff; color: #4A5568; border-radius: 8px; font-weight: 700; cursor: pointer;">Cancel</button>
            <button id="save-share-crm-leads-btn" style="padding: 9px 24px; border: none; background: #eb5e28; color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer;">Share Selected Leads</button>
          </div>
        </div>

        <!-- TAB 2: MANUAL ENTRY -->
        <div id="section-manual-lead" style="display: none; flex-direction: column; gap: 14px; overflow-y: auto;">
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Client Name <span style="color: #e53e3e;">*</span></label>
            <input type="text" id="sl-manual-name" placeholder="e.g. Ramesh (Buyer)" style="width: 100%; padding: 9px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;" />
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Phone</label>
              <input type="tel" id="sl-manual-phone" placeholder="10-digit phone" style="width: 100%; padding: 9px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Property Type</label>
              <input type="text" id="sl-manual-type" placeholder="e.g. Plot / 3BHK Villa" style="width: 100%; padding: 9px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;" />
            </div>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Location</label>
              <input type="text" id="sl-manual-location" placeholder="e.g. Medical College Road" style="width: 100%; padding: 9px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;" />
            </div>
            <div>
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Budget Range</label>
              <input type="text" id="sl-manual-budget" placeholder="e.g. ₹ 30 - 50 Lakhs" style="width: 100%; padding: 9px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;" />
            </div>
          </div>
          <div>
            <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #4A5568; margin-bottom: 4px;">Handover Notes</label>
            <textarea id="sl-manual-notes" placeholder="Specific client requirements or timeline instructions..." style="width: 100%; min-height: 60px; padding: 9px 12px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.88rem; box-sizing: border-box;"></textarea>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 14px; border-top: 1px solid #EDF2F7; padding-top: 14px;">
            <button id="cancel-manual-share-btn" style="padding: 9px 18px; border: 1px solid #CBD5E0; background: #fff; color: #4A5568; border-radius: 8px; font-weight: 700; cursor: pointer;">Cancel</button>
            <button id="save-manual-share-btn" style="padding: 9px 24px; border: none; background: #eb5e28; color: #fff; border-radius: 8px; font-weight: 700; cursor: pointer;">Share Lead</button>
          </div>
        </div>

      </div>
    </div>
  `;
}

export async function initPartnersView() {
  let partners = [];
  try {
    const stored = localStorage.getItem('thanjai_partners');
    if (stored && stored !== 'undefined') {
      partners = JSON.parse(stored);
    }
    if (!Array.isArray(partners)) partners = [];
  } catch (e) {
    partners = [];
  }

  // Fetch partners from API if empty
  try {
    const apiPartners = await fetchFromAPI('/partners');
    if (apiPartners && Array.isArray(apiPartners) && apiPartners.length > 0) {
      partners = apiPartners;
      localStorage.setItem('thanjai_partners', JSON.stringify(partners));
    }
  } catch (e) {
    console.warn("API fetch partners fallback:", e);
  }

  // Fetch shared leads from API
  let allSharedLeads = {};
  try {
    const apiLeads = await fetchFromAPI('/shared_leads');
    if (apiLeads && Array.isArray(apiLeads)) {
      apiLeads.forEach(lead => {
        if (!allSharedLeads[lead.partnerId]) {
          allSharedLeads[lead.partnerId] = [];
        }
        allSharedLeads[lead.partnerId].push(lead);
      });
      localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));
    }
  } catch (e) {
    console.warn("API fetch shared leads fallback:", e);
    try {
      const storedLeads = localStorage.getItem('thanjai_shared_leads');
      if (storedLeads) allSharedLeads = JSON.parse(storedLeads) || {};
    } catch(err) {}
  }

  let activePartnerId = partners.length > 0 ? partners[0].id : null;

  const sidebarList = document.getElementById('pn-sidebar-list');
  const partnerCountEl = document.getElementById('pn-partner-count');
  const contentTitle = document.getElementById('pn-content-title');
  const contentSubtitle = document.getElementById('pn-content-subtitle');
  const partnerInfoCard = document.getElementById('pn-partner-info-card');
  const leadsContainer = document.getElementById('pn-leads-container');
  const btnShareLead = document.getElementById('btn-share-lead-modal');

  const renderSidebar = () => {
    if (!sidebarList) return;
    if (partnerCountEl) partnerCountEl.textContent = partners.length;

    if (partners.length === 0) {
      sidebarList.innerHTML = '<div style="padding: 30px 16px; text-align: center; color: #A0AEC0; font-size: 0.9rem;">No partners found.<br/>Click <strong>+ Add Partner</strong> above.</div>';
      return;
    }

    let html = '';
    partners.forEach(p => {
      const isActive = String(p.id) === String(activePartnerId);
      const leadCount = (allSharedLeads[p.id] || []).length;
      const statusBadge = (p.status || 'Active').toLowerCase() === 'active';

      html += `
        <div class="pn-partner-card" data-id="${p.id}" style="
          padding: 14px 16px; border-radius: 12px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s ease;
          background: ${isActive ? '#FAF8F5' : '#ffffff'};
          border: ${isActive ? '2px solid #eb5e28' : '1px solid #E2E8F0'};
          box-shadow: ${isActive ? '0 4px 12px rgba(235,94,40,0.15)' : 'none'};
        ">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 6px;">
            <div style="font-weight: 800; font-size: 1rem; color: #1A202C;">${p.company || p.name}</div>
            <span style="font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; text-transform: uppercase; background: ${statusBadge ? '#E6FFFA' : '#FFF5F5'}; color: ${statusBadge ? '#234E52' : '#9B2C2C'};">
              ${(p.status || 'Active').toUpperCase()}
            </span>
          </div>

          <div style="font-size: 0.8rem; color: #718096; margin-bottom: 10px;">
            ${p.contact || p.contactPerson || 'Direct'} • ${p.city || 'Thanjavur'} • <strong style="color: #eb5e28;">${leadCount} leads</strong>
          </div>

          <div style="display: flex; gap: 8px;">
            <button class="pn-edit-btn" data-id="${p.id}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 700; border: 1px solid #CBD5E0; background: #fff; border-radius: 6px; cursor: pointer; color: #4A5568;">
              <i class="ri-edit-line"></i> Edit
            </button>
            <button class="pn-delete-btn" data-id="${p.id}" style="padding: 4px 10px; font-size: 0.75rem; font-weight: 700; border: 1px solid #FEB2B2; background: #FFF5F5; border-radius: 6px; cursor: pointer; color: #E53E3E;">
              <i class="ri-delete-bin-line"></i> Delete
            </button>
          </div>
        </div>
      `;
    });
    sidebarList.innerHTML = html;

    sidebarList.querySelectorAll('.pn-partner-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.pn-edit-btn') || e.target.closest('.pn-delete-btn')) return;
        activePartnerId = card.dataset.id;
        renderSidebar();
        renderContent();
      });
    });

    sidebarList.querySelectorAll('.pn-edit-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditPartnerModal(btn.dataset.id);
      });
    });

    sidebarList.querySelectorAll('.pn-delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const pId = btn.dataset.id;
        const targetP = partners.find(p => String(p.id) === String(pId));
        const partnerName = targetP?.company || targetP?.name || 'Partner';
        
        showConfirmModal({
          title: 'Delete Partner',
          message: `Are you sure you want to delete partner <strong>${partnerName}</strong>? All shared lead history will be unlinked.`,
          confirmText: 'Delete Partner',
          cancelText: 'Keep Partner',
          confirmIcon: 'ri-delete-bin-line',
          isDanger: true,
          onConfirm: async () => {
            partners = partners.filter(p => String(p.id) !== String(pId));
            delete allSharedLeads[pId];
            localStorage.setItem('thanjai_partners', JSON.stringify(partners));
            localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));
            
            fetchFromAPI(`/partners/${pId}`, { method: 'DELETE' }).catch(err => console.warn(err));
            
            if (String(activePartnerId) === String(pId)) {
              activePartnerId = partners.length > 0 ? partners[0].id : null;
            }
            renderSidebar();
            renderContent();
            showToast(`Partner "${partnerName}" deleted`, 'ri-checkbox-circle-fill');
          }
        });
      });
    });
  };

  const renderContent = () => {
    if (!contentTitle || !leadsContainer) return;
    
    if (!activePartnerId || partners.length === 0) {
      contentTitle.textContent = 'Select a partner';
      if (contentSubtitle) contentSubtitle.textContent = 'Choose a partner company from the sidebar to view shared leads.';
      if (partnerInfoCard) partnerInfoCard.style.display = 'none';
      leadsContainer.innerHTML = '<div style="color: #A0AEC0; text-align: center; margin-top: 60px; font-size: 0.95rem;"><i class="ri-user-shared-line" style="font-size: 2.5rem; display: block; margin-bottom: 10px;"></i>Select a partner to view profile and shared leads.</div>';
      if (btnShareLead) btnShareLead.style.display = 'none';
      return;
    }

    const partner = partners.find(p => String(p.id) === String(activePartnerId));
    if (!partner) return;

    contentTitle.textContent = partner.company || partner.name || 'Partner Details';
    if (contentSubtitle) contentSubtitle.textContent = `Channel partner in ${partner.city || 'Thanjavur'} • Contact: ${partner.contact || partner.contactPerson || 'Direct'}`;
    if (btnShareLead) btnShareLead.style.display = 'inline-flex';

    if (partnerInfoCard) {
      partnerInfoCard.style.display = 'block';
      partnerInfoCard.innerHTML = `
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; font-size: 0.88rem;">
          <div><span style="color: #718096; font-weight: 700;">Contact Person:</span> <strong style="color: #1A202C;">${partner.contact || partner.contactPerson || '—'}</strong></div>
          <div><span style="color: #718096; font-weight: 700;">Official Phone:</span> <strong style="color: #1A202C;">${partner.phone || '—'}</strong></div>
          <div><span style="color: #718096; font-weight: 700;">WhatsApp:</span> <strong style="color: #25D366;">${partner.whatsapp || partner.phone || '—'}</strong></div>
          <div><span style="color: #718096; font-weight: 700;">Email:</span> <strong style="color: #1A202C;">${partner.email || '—'}</strong></div>
          <div><span style="color: #718096; font-weight: 700;">Operating City:</span> <strong style="color: #1A202C;">${partner.city || 'Thanjavur'}</strong></div>
          <div><span style="color: #718096; font-weight: 700;">Total Shared:</span> <strong style="color: #eb5e28;">${(allSharedLeads[activePartnerId] || []).length} leads</strong></div>
          ${partner.notes ? `<div style="grid-column: 1 / -1; margin-top: 4px;"><span style="color: #718096; font-weight: 700;">Notes:</span> <span style="color: #4A5568;">${partner.notes}</span></div>` : ''}
        </div>
      `;
    }

    const leads = allSharedLeads[activePartnerId] || [];
    if (leads.length === 0) {
      leadsContainer.innerHTML = `
        <div style="text-align: center; padding: 60px 20px; color: #A0AEC0;">
          <i class="ri-user-shared-2-line" style="font-size: 3rem; color: #CBD5E0; margin-bottom: 12px; display: block;"></i>
          <h4 style="color: #4A5568; font-size: 1.1rem; margin-bottom: 6px;">No Leads Shared With This Partner Yet</h4>
          <p style="font-size: 0.88rem; margin-bottom: 18px;">Click "Share Leads" above to send client requirements to ${partner.company || 'this partner'}.</p>
        </div>
      `;
      return;
    }

    let html = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px;">
        <h4 style="font-size: 1.05rem; font-weight: 800; color: #1A202C; margin: 0;">Shared Lead Referrals (${leads.length})</h4>
      </div>
      <div style="display: grid; gap: 14px;">
    `;

    leads.forEach(lead => {
      html += `
        <div style="padding: 18px 20px; border: 1px solid #E2E8F0; border-radius: 12px; background: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-weight: 800; font-size: 1.05rem; color: #1A202C;">${lead.name}</div>
            <span style="background: #EBF8FF; color: #2B6CB0; padding: 3px 10px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;">
              ${lead.status || 'SHARED'}
            </span>
          </div>

          <div style="display: flex; flex-wrap: wrap; gap: 16px; font-size: 0.85rem; color: #718096; margin-bottom: 10px;">
            ${lead.phone ? `<span><i class="ri-phone-line" style="color: #eb5e28;"></i> ${lead.phone}</span>` : ''}
            <span><i class="ri-map-pin-line" style="color: #eb5e28;"></i> ${lead.location || 'Thanjavur'}</span>
            <span><i class="ri-home-4-line" style="color: #eb5e28;"></i> ${lead.propertyType || 'Property'}</span>
            <span><i class="ri-money-rupee-circle-line" style="color: #38A169;"></i> Budget: <strong>${lead.budget || 'Contact'}</strong></span>
          </div>

          <div style="font-size: 0.8rem; color: #718096; margin-bottom: 8px;">
            Shared by <strong>${lead.sharedBy || 'Admin'}</strong> on ${lead.sharedDate || 'Recently'}
          </div>

          ${lead.notes ? `
            <div style="font-size: 0.82rem; padding: 10px 14px; background: #FAF8F5; border-radius: 8px; border: 1px solid #E7E0D8; color: #4A5568;">
              <strong>Handover Notes:</strong> ${lead.notes}
            </div>
          ` : ''}
        </div>
      `;
    });
    html += '</div>';
    leadsContainer.innerHTML = html;
  };

  // --- Add / Edit Partner Modal Handlers ---
  const modal = document.getElementById('add-partner-modal');
  const openAddPartnerModal = () => {
    document.getElementById('ap-edit-id').value = '';
    document.getElementById('ap-company').value = '';
    document.getElementById('ap-contact').value = '';
    document.getElementById('ap-phone').value = '';
    document.getElementById('ap-whatsapp').value = '';
    document.getElementById('ap-email').value = '';
    document.getElementById('ap-city').value = 'Thanjavur';
    document.getElementById('ap-status').value = 'Active';
    document.getElementById('ap-notes').value = '';
    document.getElementById('partner-modal-title').textContent = 'Register New Partner';
    document.getElementById('save-partner-modal').textContent = 'Save Partner';
    if (modal) modal.style.display = 'flex';
  };

  const openEditPartnerModal = (partnerId) => {
    const p = partners.find(item => String(item.id) === String(partnerId));
    if (!p) return;

    document.getElementById('ap-edit-id').value = p.id;
    document.getElementById('ap-company').value = p.company || p.name || '';
    document.getElementById('ap-contact').value = p.contact || p.contactPerson || '';
    document.getElementById('ap-phone').value = p.phone || '';
    document.getElementById('ap-whatsapp').value = p.whatsapp || p.phone || '';
    document.getElementById('ap-email').value = p.email || '';
    document.getElementById('ap-city').value = p.city || 'Thanjavur';
    document.getElementById('ap-status').value = p.status || 'Active';
    document.getElementById('ap-notes').value = p.notes || '';
    document.getElementById('partner-modal-title').textContent = 'Edit Partner Details';
    document.getElementById('save-partner-modal').textContent = 'Update Partner';
    if (modal) modal.style.display = 'flex';
  };

  const closePartnerModal = () => {
    if (modal) modal.style.display = 'none';
  };

  document.getElementById('btn-add-partner')?.addEventListener('click', openAddPartnerModal);
  document.getElementById('close-partner-modal')?.addEventListener('click', closePartnerModal);
  document.getElementById('cancel-partner-modal')?.addEventListener('click', closePartnerModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closePartnerModal();
  });

  document.getElementById('save-partner-modal')?.addEventListener('click', async () => {
    const editId = document.getElementById('ap-edit-id')?.value.trim();
    const company = document.getElementById('ap-company')?.value.trim();
    const contact = document.getElementById('ap-contact')?.value.trim();
    const phone = document.getElementById('ap-phone')?.value.trim();
    const whatsapp = document.getElementById('ap-whatsapp')?.value.trim();
    const email = document.getElementById('ap-email')?.value.trim();
    const city = document.getElementById('ap-city')?.value.trim() || 'Thanjavur';
    const status = document.getElementById('ap-status')?.value || 'Active';
    const notes = document.getElementById('ap-notes')?.value.trim();

    if (!company || !contact || !phone) {
      showToast('Please fill in Company, Contact Person, and Phone.', 'ri-error-warning-fill');
      return;
    }

    if (editId) {
      const idx = partners.findIndex(p => String(p.id) === String(editId));
      if (idx !== -1) {
        partners[idx] = {
          ...partners[idx],
          name: company,
          company: company,
          type: contact,
          contact: contact,
          contactPerson: contact,
          phone: phone,
          whatsapp: whatsapp || phone,
          email: email,
          city: city,
          status: status,
          notes: notes
        };
        fetchFromAPI(`/partners/${editId}`, {
          method: 'PUT',
          body: JSON.stringify(partners[idx])
        }).catch(err => console.warn(err));
      }
    } else {
      const newId = `PN-${Date.now()}`;
      const newPartner = {
        id: newId,
        name: company,
        company: company,
        type: contact,
        contact: contact,
        contactPerson: contact,
        phone: phone,
        whatsapp: whatsapp || phone,
        email: email,
        city: city,
        status: status,
        notes: notes,
        leads: 0
      };
      partners.unshift(newPartner);
      activePartnerId = newId;

      fetchFromAPI('/partners', {
        method: 'POST',
        body: JSON.stringify(newPartner)
      }).catch(err => console.warn(err));
    }

    localStorage.setItem('thanjai_partners', JSON.stringify(partners));
    closePartnerModal();
    renderSidebar();
    renderContent();
    showToast(editId ? 'Partner details updated!' : 'New partner registered successfully!', 'ri-checkbox-circle-fill');
  });

  // --- Share Leads Modal Handlers (Multi-Select CRM Leads) ---
  const shareModal = document.getElementById('share-lead-modal');
  const tabCrmLeads = document.getElementById('tab-crm-leads');
  const tabManualLead = document.getElementById('tab-manual-lead');
  const sectionCrmLeads = document.getElementById('section-crm-leads');
  const sectionManualLead = document.getElementById('section-manual-lead');
  const checkboxContainer = document.getElementById('crm-leads-checkbox-list');
  const searchCrmInput = document.getElementById('search-crm-leads-input');
  let crmLeadsList = [];

  const openShareLeadsModal = () => {
    if (!activePartnerId) return;

    // Fetch CRM pipeline leads
    try {
      crmLeadsList = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    } catch (e) {
      crmLeadsList = [];
    }

    // Default to Tab 1
    switchShareTab('crm');
    renderCrmLeadsCheckboxes('');
    document.getElementById('sl-bulk-notes').value = '';
    if (searchCrmInput) searchCrmInput.value = '';

    if (shareModal) shareModal.style.display = 'flex';
  };

  const closeShareModal = () => {
    if (shareModal) shareModal.style.display = 'none';
  };

  const switchShareTab = (tab) => {
    if (tab === 'crm') {
      sectionCrmLeads.style.display = 'flex';
      sectionManualLead.style.display = 'none';
      tabCrmLeads.style.background = '#FAF8F5';
      tabCrmLeads.style.color = '#eb5e28';
      tabCrmLeads.style.border = '1px solid #eb5e28';
      tabManualLead.style.background = '#fff';
      tabManualLead.style.color = '#718096';
      tabManualLead.style.border = '1px solid #E2E8F0';
    } else {
      sectionCrmLeads.style.display = 'none';
      sectionManualLead.style.display = 'flex';
      tabManualLead.style.background = '#FAF8F5';
      tabManualLead.style.color = '#eb5e28';
      tabManualLead.style.border = '1px solid #eb5e28';
      tabCrmLeads.style.background = '#fff';
      tabCrmLeads.style.color = '#718096';
      tabCrmLeads.style.border = '1px solid #E2E8F0';
    }
  };

  const renderCrmLeadsCheckboxes = (query = '') => {
    if (!checkboxContainer) return;
    const q = query.toLowerCase().trim();

    const filteredLeads = crmLeadsList.filter(l => {
      if (!l) return false;
      if (!q) return true;
      const name = (l.name || '').toLowerCase();
      const phone = (l.phone || l.mobile || '').toLowerCase();
      const loc = (l.location || l.city || '').toLowerCase();
      const req = (l.requirement || l.type || '').toLowerCase();
      return name.includes(q) || phone.includes(q) || loc.includes(q) || req.includes(q);
    });

    if (filteredLeads.length === 0) {
      checkboxContainer.innerHTML = '<div style="padding: 24px; text-align: center; color: #A0AEC0; font-size: 0.88rem;">No matching CRM leads found.</div>';
      return;
    }

    checkboxContainer.innerHTML = filteredLeads.map(l => {
      const p = l.phone || l.mobile || 'Protected';
      const loc = l.location || l.city || 'Thanjavur';
      const req = l.requirement || l.type || 'Property Requirement';
      const budget = l.budget || 'Contact';

      return `
        <label style="display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: #ffffff; border: 1px solid #E2E8F0; border-radius: 8px; cursor: pointer; transition: background 0.15s ease;">
          <input type="checkbox" class="crm-lead-checkbox" value="${l.id}" style="width: 18px; height: 18px; accent-color: #eb5e28; cursor: pointer;" />
          <div style="flex: 1;">
            <div style="font-weight: 700; font-size: 0.92rem; color: #1A202C;">${l.name || 'Unnamed Client'} <span style="font-size: 0.78rem; font-weight: 600; color: #718096;">(${p})</span></div>
            <div style="font-size: 0.78rem; color: #718096; margin-top: 2px;">
              ${req} • ${loc} • <strong style="color: #38A169;">Budget: ${budget}</strong>
            </div>
          </div>
        </label>
      `;
    }).join('');
  };

  btnShareLead?.addEventListener('click', openShareLeadsModal);
  document.getElementById('close-share-lead-modal')?.addEventListener('click', closeShareModal);
  document.getElementById('cancel-share-lead-modal')?.addEventListener('click', closeShareModal);
  document.getElementById('cancel-manual-share-btn')?.addEventListener('click', closeShareModal);
  shareModal?.addEventListener('click', (e) => {
    if (e.target === shareModal) closeShareModal();
  });

  tabCrmLeads?.addEventListener('click', () => switchShareTab('crm'));
  tabManualLead?.addEventListener('click', () => switchShareTab('manual'));

  searchCrmInput?.addEventListener('input', (e) => {
    renderCrmLeadsCheckboxes(e.target.value);
  });

  let allSelected = false;
  document.getElementById('select-all-crm-leads-btn')?.addEventListener('click', () => {
    allSelected = !allSelected;
    document.querySelectorAll('.crm-lead-checkbox').forEach(cb => {
      cb.checked = allSelected;
    });
    document.getElementById('select-all-crm-leads-btn').textContent = allSelected ? 'Deselect All' : 'Select All';
  });

  // Batch Save Selected CRM Leads
  document.getElementById('save-share-crm-leads-btn')?.addEventListener('click', async () => {
    if (!activePartnerId) return;

    const checkedBoxes = document.querySelectorAll('.crm-lead-checkbox:checked');
    if (checkedBoxes.length === 0) {
      showToast('Please check at least one lead to share.', 'ri-error-warning-fill');
      return;
    }

    const handoverNotes = document.getElementById('sl-bulk-notes')?.value.trim() || 'Shared from CRM Pipeline';
    const activeUser = JSON.parse(sessionStorage.getItem('thanjai_active_user')) || { fullName: 'Admin' };
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    let sharedCount = 0;
    for (const cb of checkedBoxes) {
      const leadId = cb.value;
      const crmLead = crmLeadsList.find(l => String(l.id) === String(leadId));
      if (!crmLead) continue;

      const newSharedLead = {
        id: `SL-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        partnerId: String(activePartnerId),
        leadId: String(crmLead.id || ''),
        name: crmLead.name || 'Client',
        phone: crmLead.phone || crmLead.whatsapp || 'Protected by Desk',
        location: crmLead.location || crmLead.city || 'Thanjavur',
        propertyType: crmLead.requirement || crmLead.type || 'Property',
        budget: crmLead.budget || 'Contact for Budget',
        sharedBy: activeUser.fullName || 'Admin',
        sharedDate: dateStr,
        status: 'Shared',
        notes: handoverNotes
      };

      try {
        fetchFromAPI('/shared_leads', {
          method: 'POST',
          body: JSON.stringify(newSharedLead)
        }).catch(err => console.warn(err));

        if (!allSharedLeads[activePartnerId]) allSharedLeads[activePartnerId] = [];
        allSharedLeads[activePartnerId].unshift(newSharedLead);
        sharedCount++;
      } catch (err) {
        console.error("Error sharing lead:", err);
      }
    }

    localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));

    // Update partner lead count
    const pIdx = partners.findIndex(p => String(p.id) === String(activePartnerId));
    if (pIdx !== -1) {
      partners[pIdx].leads = (allSharedLeads[activePartnerId] || []).length;
      localStorage.setItem('thanjai_partners', JSON.stringify(partners));
      fetchFromAPI(`/partners/${activePartnerId}`, {
        method: 'PUT',
        body: JSON.stringify(partners[pIdx])
      }).catch(err => console.warn(err));
    }

    closeShareModal();
    renderSidebar();
    renderContent();
    showToast(`Shared ${sharedCount} lead(s) with partner successfully!`, 'ri-checkbox-circle-fill');
  });

  // Save Single Manual Lead
  document.getElementById('save-manual-share-btn')?.addEventListener('click', async () => {
    if (!activePartnerId) return;

    const name = document.getElementById('sl-manual-name')?.value.trim();
    const phone = document.getElementById('sl-manual-phone')?.value.trim();
    const type = document.getElementById('sl-manual-type')?.value.trim() || 'Property';
    const location = document.getElementById('sl-manual-location')?.value.trim() || 'Thanjavur';
    const budget = document.getElementById('sl-manual-budget')?.value.trim() || 'Contact for Budget';
    const notes = document.getElementById('sl-manual-notes')?.value.trim() || 'Manually shared referral';

    if (!name) {
      showToast('Please enter client name.', 'ri-error-warning-fill');
      return;
    }

    const activeUser = JSON.parse(sessionStorage.getItem('thanjai_active_user')) || { fullName: 'Admin' };
    const dateStr = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newSharedLead = {
      id: `SL-${Date.now()}`,
      partnerId: String(activePartnerId),
      leadId: null,
      name: name,
      phone: phone || 'Protected by Desk',
      location: location,
      propertyType: type,
      budget: budget,
      sharedBy: activeUser.fullName || 'Admin',
      sharedDate: dateStr,
      status: 'Shared',
      notes: notes
    };

    try {
      fetchFromAPI('/shared_leads', {
        method: 'POST',
        body: JSON.stringify(newSharedLead)
      }).catch(err => console.warn(err));

      if (!allSharedLeads[activePartnerId]) allSharedLeads[activePartnerId] = [];
      allSharedLeads[activePartnerId].unshift(newSharedLead);
      localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));

      const pIdx = partners.findIndex(p => String(p.id) === String(activePartnerId));
      if (pIdx !== -1) {
        partners[pIdx].leads = (allSharedLeads[activePartnerId] || []).length;
        localStorage.setItem('thanjai_partners', JSON.stringify(partners));
        fetchFromAPI(`/partners/${activePartnerId}`, {
          method: 'PUT',
          body: JSON.stringify(partners[pIdx])
        }).catch(err => console.warn(err));
      }

      closeShareModal();
      renderSidebar();
      renderContent();
      showToast(`Lead "${name}" shared with partner successfully!`, 'ri-checkbox-circle-fill');
    } catch (err) {
      console.error(err);
    }
  });

  renderSidebar();
  renderContent();
}
