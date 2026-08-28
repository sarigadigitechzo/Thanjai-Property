import { getRegisteredUsers, getCurrentUser } from '../utils/userAuthStore.js';
import { fetchFromAPI } from '../utils/api.js';
import { showToast, showConfirmModal } from '../utils/toast.js';

export function renderPartnersView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Partner Network</h1>
          <p class="view-subtitle">Manage channel partners, real estate brokers, and track shared lead referrals</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary" id="btn-add-partner" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);">
            <i class="ri-add-line"></i> Add partner
          </button>
        </div>
      </div>

      <div class="pn-container">
        <!-- Left Sidebar: Partner List -->
        <div class="pn-sidebar" id="pn-sidebar-list">
          <!-- Populated by JS -->
        </div>

        <!-- Right Content: Shared Leads -->
        <div class="pn-content" style="display: flex; flex-direction: column;">
          <div class="pn-content-header" style="display: flex; justify-content: space-between; align-items: center; padding: 16px 20px; border-bottom: 1px solid var(--os-border-thin);">
            <div id="pn-content-title" style="font-size: 1.15rem; font-weight: 700; color: var(--os-dark);">
              Select a partner
            </div>
            <button class="os-btn-primary" id="btn-share-lead-modal" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange); display: none; padding: 6px 14px; font-size: 0.85rem;">
              <i class="ri-user-shared-line"></i> Share Lead
            </button>
          </div>

          <!-- Partner Info Card -->
          <div id="pn-partner-info-card" style="display: none; padding: 16px 20px; background: #fdfaf6; border-bottom: 1px solid var(--os-border-thin); font-size: 0.9rem;">
            <!-- Populated by JS -->
          </div>

          <!-- Shared Leads List -->
          <div class="pn-leads-list" id="pn-leads-container" style="flex: 1; padding: 20px; overflow-y: auto;">
            <!-- Populated by JS -->
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Partner Modal -->
    <div class="os-modal-overlay" id="add-partner-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div class="os-modal-card" style="max-width: 650px; width: 90%; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <div class="os-modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 id="partner-modal-title" style="margin: 0; font-size: 1.25rem; font-weight: 700; color: #1e293b;">Add partner company</h2>
          <button class="os-modal-close" id="close-partner-modal" style="background: none; border: none; font-size: 1.3rem; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body" style="max-height: 70vh; overflow-y: auto;">
          <input type="hidden" id="ap-edit-id" value="" />
          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Company name *</label>
              <input type="text" id="ap-company" placeholder="e.g. Digitechzo Realty" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Contact person</label>
              <input type="text" id="ap-contact" placeholder="e.g. Kaniga" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
          </div>
          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Phone</label>
              <input type="text" id="ap-phone" placeholder="10-digit mobile" maxlength="10" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">WhatsApp</label>
              <input type="text" id="ap-whatsapp" placeholder="WhatsApp number" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
          </div>
          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Email</label>
              <input type="email" id="ap-email" placeholder="partner@example.com" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">City</label>
              <input type="text" id="ap-city" placeholder="e.g. Madurai" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
          </div>
          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Country</label>
              <input type="text" id="ap-country" value="India" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Status</label>
              <select id="ap-status" style="width: 100%; height: 42px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0 12px; font-size: 0.9rem; color: #1e293b;">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Notes / Commission Terms</label>
            <textarea id="ap-notes" placeholder="e.g. 2% channel referral commission on plot sales." style="width: 100%; min-height: 80px; resize: vertical; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; font-size: 0.9rem;"></textarea>
          </div>
        </div>
        <div class="os-modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
          <button class="os-btn-secondary" id="cancel-partner-modal" style="padding: 8px 18px;">Cancel</button>
          <button class="os-btn-primary" id="save-partner-modal" style="background: #e27c3e; border-color: #e27c3e; padding: 8px 22px;">Save Partner</button>
        </div>
      </div>
    </div>

    <!-- Share Lead Modal -->
    <div class="os-modal-overlay" id="share-lead-modal" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); z-index: 99999; align-items: center; justify-content: center; backdrop-filter: blur(4px);">
      <div class="os-modal-card" style="max-width: 550px; width: 90%; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
        <div class="os-modal-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
          <h2 style="margin: 0; font-size: 1.2rem; font-weight: 700; color: #1e293b;"><i class="ri-user-shared-line" style="color: #e27c3e;"></i> Share Lead to Partner</h2>
          <button class="os-modal-close" id="close-share-lead-modal" style="background: none; border: none; font-size: 1.3rem; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-group" style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Select Lead from CRM</label>
            <select id="sl-lead-select" style="width: 100%; height: 42px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 0 12px; font-size: 0.9rem;">
              <option value="">-- Choose Existing Lead --</option>
            </select>
          </div>
          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Client Name *</label>
              <input type="text" id="sl-name" placeholder="Lead Name" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Phone *</label>
              <input type="text" id="sl-phone" placeholder="Phone Number" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
          </div>
          <div class="form-row" style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Location</label>
              <input type="text" id="sl-location" placeholder="e.g. Thanjavur / Madurai" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
            <div class="form-group">
              <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Property Type</label>
              <input type="text" id="sl-type" placeholder="e.g. Plot / Villa" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 14px;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Budget Range</label>
            <input type="text" id="sl-budget" placeholder="e.g. ₹ 25 - 50 Lakhs" style="width: 100%; padding: 10px 12px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 0.9rem;" />
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label style="display: block; font-size: 0.85rem; font-weight: 600; color: #475569; margin-bottom: 6px;">Handover Notes</label>
            <textarea id="sl-notes" placeholder="Requirement specifics, preferred timeline, or client instructions..." style="width: 100%; min-height: 70px; border: 1px solid #cbd5e1; border-radius: 6px; padding: 10px 12px; font-size: 0.9rem;"></textarea>
          </div>
        </div>
        <div class="os-modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; margin-top: 20px;">
          <button class="os-btn-secondary" id="cancel-share-lead-modal" style="padding: 8px 18px;">Cancel</button>
          <button class="os-btn-primary" id="save-share-lead-btn" style="background: #e27c3e; border-color: #e27c3e; padding: 8px 22px;">Share Lead</button>
        </div>
      </div>
    </div>
  `;
}

export function initPartnersView() {
  // 1. Data Initialization
  let partners = [];
  try {
    const stored = localStorage.getItem('thanjai_partners');
    if (stored && stored !== 'undefined') {
      partners = JSON.parse(stored);
    }
    if (!Array.isArray(partners)) partners = [];
  } catch (e) {
    console.warn("Failed to parse partners data:", e);
    partners = [];
  }

  // 2. Shared Leads Data
  let allSharedLeads = {};
  try {
    allSharedLeads = JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {
      '1': [
        {
          id: 'SL-101',
          name: 'Karthikeyan V G',
          phone: '9841298765',
          location: 'Madurai',
          propertyType: 'Plot',
          budget: '₹ 1.10 Crore',
          sharedBy: 'Arun Prakash',
          sharedDate: '11 Aug 2026, 11:13',
          status: 'Shared',
          notes: 'Looking for DTCP approved commercial plot near bypass.'
        },
        {
          id: 'SL-102',
          name: 'Rajesh Annamalai',
          phone: '9789012345',
          location: 'Coimbatore',
          propertyType: 'Townhouse',
          budget: '₹ 1.40 Crore',
          sharedBy: 'Kavitha Murugan',
          sharedDate: '2 Jul 2026, 21:58',
          status: 'In Progress',
          notes: 'Prefers Saravanampatti but open to Vadavalli villas.'
        }
      ],
      '2': [
        {
          id: 'SL-103',
          name: 'Muthukumar S',
          phone: '9443219876',
          location: 'Trichy Road',
          propertyType: 'Villa',
          budget: '₹ 85 Lakhs',
          sharedBy: 'Aishwarya Raman',
          sharedDate: '20 Aug 2026, 15:30',
          status: 'Shared',
          notes: 'Wants ready-to-occupy independent house with clear Patta.'
        }
      ]
    };
  } catch (e) {
    console.warn("Failed to parse shared leads", e);
    allSharedLeads = {};
  }

  // Ensure active partner is valid
  let activePartnerId = partners.length > 0 ? partners[0].id : null;

  const sidebarList = document.getElementById('pn-sidebar-list');
  const contentTitle = document.getElementById('pn-content-title');
  const partnerInfoCard = document.getElementById('pn-partner-info-card');
  const leadsContainer = document.getElementById('pn-leads-container');
  const btnShareLead = document.getElementById('btn-share-lead-modal');

  // Render Sidebar Partners List
  const renderSidebar = () => {
    if (!sidebarList) return;
    if (partners.length === 0) {
      sidebarList.innerHTML = '<div style="padding: 24px; text-align: center; color: var(--os-gray-500);">No partner companies found. Click "+ Add partner" above.</div>';
      return;
    }

    let html = '';
    partners.forEach(p => {
      const isActive = String(p.id) === String(activePartnerId) ? 'active' : '';
      const locationText = p.city ? ` · ${p.city}` : '';
      const leadCount = (allSharedLeads[p.id] || []).length;
      const statusBadge = (p.status || 'Active').toLowerCase() === 'active' ? 'active' : 'inactive';
      
      html += `
        <div class="pn-partner-item ${isActive}" data-id="${p.id}">
          <div class="pn-partner-header">
            <div class="pn-partner-name" style="font-weight: 700;">${p.company || p.name}</div>
            <div class="pn-badge ${statusBadge}">${(p.status || 'Active').toUpperCase()}</div>
          </div>
          <div class="pn-partner-meta">
            ${p.contact || p.contactPerson || 'Direct'} ${locationText} · <strong>${leadCount} leads</strong>
          </div>
          <div class="pn-actions" style="margin-top: 8px; display: flex; gap: 8px;">
            <button class="pn-edit-btn os-btn-secondary" style="padding: 4px 10px; font-size: 0.75rem;"><i class="ri-edit-line"></i> Edit</button>
            <button class="pn-delete-btn os-btn-secondary" style="padding: 4px 10px; font-size: 0.75rem; color: #ef4444;"><i class="ri-delete-bin-line"></i> Delete</button>
          </div>
        </div>
      `;
    });
    sidebarList.innerHTML = html;

    // Attach Listeners
    sidebarList.querySelectorAll('.pn-partner-item').forEach(item => {
      const pId = item.dataset.id;
      
      item.addEventListener('click', (e) => {
        // Edit Partner
        if (e.target.closest('.pn-edit-btn')) {
          e.stopPropagation();
          openEditPartnerModal(pId);
          return;
        }
        
        // Delete Partner
        if (e.target.closest('.pn-delete-btn')) {
          e.stopPropagation();
          const targetP = partners.find(p => String(p.id) === String(pId));
          const partnerName = targetP?.company || targetP?.name || 'Partner';
          showConfirmModal({
            title: 'Delete Partner',
            message: `Are you sure you want to delete channel partner <strong>${partnerName}</strong>? All shared lead referrals for this partner will be unlinked.`,
            confirmText: 'Delete Partner',
            cancelText: 'Keep Partner',
            confirmIcon: 'ri-delete-bin-line',
            isDanger: true,
            onConfirm: () => {
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
          return;
        }

        activePartnerId = pId;
        renderSidebar();
        renderContent();
      });
    });
  };

  const renderContent = () => {
    if (!contentTitle || !leadsContainer) return;
    
    if (!activePartnerId || partners.length === 0) {
      contentTitle.textContent = 'Select a partner';
      if (partnerInfoCard) partnerInfoCard.style.display = 'none';
      leadsContainer.innerHTML = '<div style="color: var(--os-gray-500); text-align: center; margin-top: 40px;">Select a partner from the sidebar to view shared leads and details.</div>';
      if (btnShareLead) btnShareLead.style.display = 'none';
      return;
    }

    const partner = partners.find(p => String(p.id) === String(activePartnerId));
    if (!partner) return;

    contentTitle.textContent = partner.company || partner.name || 'Partner Details';
    if (btnShareLead) btnShareLead.style.display = 'block';

    if (partnerInfoCard) {
      partnerInfoCard.style.display = 'block';
      partnerInfoCard.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div><strong>Contact:</strong> ${partner.contact || partner.contactPerson || '—'}</div>
          <div><strong>Phone:</strong> ${partner.phone || '—'}</div>
          <div><strong>WhatsApp:</strong> ${partner.whatsapp || partner.phone || '—'}</div>
          <div><strong>Email:</strong> ${partner.email || '—'}</div>
          <div><strong>Location:</strong> ${partner.city || '—'}, ${partner.country || 'India'}</div>
          <div style="grid-column: span 2;"><strong>Notes:</strong> ${partner.notes || '—'}</div>
        </div>
      `;
    }

    const leads = allSharedLeads[activePartnerId] || [];
    if (leads.length === 0) {
      leadsContainer.innerHTML = '<div style="color: var(--os-gray-500); text-align: center; margin-top: 40px;">No leads shared with this partner yet.</div>';
      return;
    }

    let html = '<div style="display: grid; gap: 16px;">';
    leads.forEach(lead => {
      const statusBadge = (lead.status || 'Shared').toLowerCase() === 'shared' ? 'background: #e0e7ff; color: #4338ca;' : 'background: #dcfce7; color: #15803d;';
      html += `
        <div style="padding: 16px; border: 1px solid var(--os-border-thin); border-radius: 8px; background: #fff;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
            <div style="font-weight: 700; font-size: 1.05rem;">${lead.name}</div>
            <div style="padding: 4px 10px; border-radius: 4px; font-size: 0.75rem; font-weight: 600; ${statusBadge}">${(lead.status || 'Shared').toUpperCase()}</div>
          </div>
          <div style="font-size: 0.85rem; color: var(--os-gray-600); margin-bottom: 12px;">
            <i class="ri-phone-line"></i> ${lead.phone} &nbsp;|&nbsp; 
            <i class="ri-map-pin-line"></i> ${lead.location} &nbsp;|&nbsp; 
            <i class="ri-home-4-line"></i> ${lead.propertyType}
          </div>
          <div style="font-size: 0.85rem; color: var(--os-gray-600); margin-bottom: 12px;">
            <strong>Budget:</strong> ${lead.budget || '—'} <br/>
            <strong>Shared by:</strong> ${lead.sharedBy} on ${lead.sharedDate}
          </div>
          <div style="font-size: 0.85rem; padding: 10px; background: #f8fafc; border-radius: 6px;">
            <strong>Handover Notes:</strong> ${lead.notes || 'No notes provided.'}
          </div>
        </div>
      `;
    });
    html += '</div>';
    leadsContainer.innerHTML = html;
  };

  // --- Add / Edit Partner Modal Logic ---
  const addPartnerModal = document.getElementById('add-partner-modal');
  const btnAddPartner = document.getElementById('btn-add-partner');
  const closePartnerModal = document.getElementById('close-partner-modal');
  const cancelPartnerModal = document.getElementById('cancel-partner-modal');
  const savePartnerBtn = document.getElementById('save-partner-modal');
  const partnerModalTitle = document.getElementById('partner-modal-title');

  const openAddPartnerModal = () => {
    document.getElementById('ap-edit-id').value = '';
    document.getElementById('ap-company').value = '';
    document.getElementById('ap-contact').value = '';
    document.getElementById('ap-phone').value = '';
    document.getElementById('ap-whatsapp').value = '';
    document.getElementById('ap-email').value = '';
    document.getElementById('ap-city').value = 'Thanjavur';
    document.getElementById('ap-country').value = 'India';
    document.getElementById('ap-status').value = 'Active';
    document.getElementById('ap-notes').value = '';
    if (partnerModalTitle) partnerModalTitle.textContent = 'Add partner company';
    if (savePartnerBtn) savePartnerBtn.textContent = 'Save Partner';
    if (addPartnerModal) addPartnerModal.style.display = 'flex';
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
    document.getElementById('ap-country').value = p.country || 'India';
    document.getElementById('ap-status').value = p.status || 'Active';
    document.getElementById('ap-notes').value = p.notes || '';
    
    if (partnerModalTitle) partnerModalTitle.textContent = 'Edit partner company';
    if (savePartnerBtn) savePartnerBtn.textContent = 'Update Partner';
    if (addPartnerModal) addPartnerModal.style.display = 'flex';
  };

  const closePartnerModalFn = () => {
    if (addPartnerModal) addPartnerModal.style.display = 'none';
  };

  // Use event delegation for the Add Partner button to guarantee it works even if DOM is modified
  if (!window.partnerListenersAttached) {
    document.body.addEventListener('click', (e) => {
      if (e.target.closest('#btn-add-partner')) {
        try {
          document.getElementById('ap-edit-id').value = '';
          document.getElementById('ap-company').value = '';
          document.getElementById('ap-contact').value = '';
          document.getElementById('ap-phone').value = '';
          document.getElementById('ap-whatsapp').value = '';
          document.getElementById('ap-email').value = '';
          document.getElementById('ap-city').value = 'Thanjavur';
          document.getElementById('ap-country').value = 'India';
          document.getElementById('ap-status').value = 'Active';
          document.getElementById('ap-notes').value = '';
          
          const title = document.getElementById('partner-modal-title');
          const saveBtn = document.getElementById('save-partner-modal');
          const modal = document.getElementById('add-partner-modal');
          
          if (title) title.textContent = 'Add partner company';
          if (saveBtn) saveBtn.textContent = 'Save Partner';
          if (modal) modal.style.display = 'flex';
          else alert("Error: Modal element not found in DOM");
        } catch (err) {
          console.error("Error opening add partner modal:", err);
          alert("Error opening modal: " + err.message);
        }
      }
    });
    window.partnerListenersAttached = true;
  }

  if (closePartnerModal) closePartnerModal.addEventListener('click', closePartnerModalFn);
  if (cancelPartnerModal) cancelPartnerModal.addEventListener('click', closePartnerModalFn);

  if (savePartnerBtn) {
    savePartnerBtn.addEventListener('click', async () => {
      const editId = document.getElementById('ap-edit-id')?.value.trim();
      const company = document.getElementById('ap-company')?.value.trim();
      const contact = document.getElementById('ap-contact')?.value.trim();
      const phone = document.getElementById('ap-phone')?.value.trim();
      const whatsapp = document.getElementById('ap-whatsapp')?.value.trim();
      const email = document.getElementById('ap-email')?.value.trim();
      const city = document.getElementById('ap-city')?.value.trim() || 'Thanjavur';
      const country = document.getElementById('ap-country')?.value.trim() || 'India';
      const status = document.getElementById('ap-status')?.value || 'Active';
      const notes = document.getElementById('ap-notes')?.value.trim();

      if (!company) {
        showAlertModal({
          title: 'Missing Company Name',
          message: 'Please enter a <strong>Company or Agency Name</strong> for this partner.',
          type: 'warning'
        });
        return;
      }

      if (editId) {
        // Update existing partner
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
            country: country,
            status: status,
            notes: notes
          };
          
          fetchFromAPI(`/partners/${editId}`, {
            method: 'PUT',
            body: JSON.stringify(partners[idx])
          }).catch(err => console.warn(err));
        }
      } else {
        // Create new partner
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
          country: country,
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
      closePartnerModalFn();
      renderSidebar();
      renderContent();
    });
  }

  // --- Share Lead Modal Logic ---
  const shareLeadModal = document.getElementById('share-lead-modal');
  const closeShareLeadModal = document.getElementById('close-share-lead-modal');
  const cancelShareLeadModal = document.getElementById('cancel-share-lead-modal');
  const saveShareLeadBtn = document.getElementById('save-share-lead-btn');
  const slLeadSelect = document.getElementById('sl-lead-select');

  const openShareLeadModal = () => {
    if (!activePartnerId) {
      showAlertModal({
        title: 'No Partner Selected',
        message: 'Please select a channel partner from the left sidebar first.',
        type: 'warning'
      });
      return;
    }

    // Populate existing CRM leads
    const crmLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    if (slLeadSelect) {
      let optHtml = '<option value="">-- Choose Existing Lead --</option>';
      crmLeads.forEach(l => {
        const p = l.phone || l.mobile || '';
        optHtml += `<option value="${l.id}" data-name="${l.name || ''}" data-phone="${p}" data-loc="${l.location || l.city || ''}" data-type="${l.requirement || l.type || ''}" data-budget="${l.budget || ''}">${l.name || 'Unnamed'} (${p || 'No Phone'})</option>`;
      });
      slLeadSelect.innerHTML = optHtml;
    }

    // Clear inputs
    document.getElementById('sl-name').value = '';
    document.getElementById('sl-phone').value = '';
    document.getElementById('sl-location').value = 'Thanjavur';
    document.getElementById('sl-type').value = 'Plot';
    document.getElementById('sl-budget').value = '₹ 25 - 50 Lakhs';
    document.getElementById('sl-notes').value = '';

    if (shareLeadModal) shareLeadModal.style.display = 'flex';
  };

  const closeShareLeadModalFn = () => {
    if (shareLeadModal) shareLeadModal.style.display = 'none';
  };

  if (btnShareLead) btnShareLead.addEventListener('click', openShareLeadModal);
  if (closeShareLeadModal) closeShareLeadModal.addEventListener('click', closeShareLeadModalFn);
  if (cancelShareLeadModal) cancelShareLeadModal.addEventListener('click', closeShareLeadModalFn);

  // Auto-fill when existing lead is selected from dropdown
  slLeadSelect?.addEventListener('change', (e) => {
    const selectedOpt = e.target.options[e.target.selectedIndex];
    if (selectedOpt && selectedOpt.value) {
      document.getElementById('sl-name').value = selectedOpt.dataset.name || '';
      document.getElementById('sl-phone').value = selectedOpt.dataset.phone || '';
      document.getElementById('sl-location').value = selectedOpt.dataset.loc || 'Thanjavur';
      document.getElementById('sl-type').value = selectedOpt.dataset.type || 'Plot';
      document.getElementById('sl-budget').value = selectedOpt.dataset.budget || 'Contact for Budget';
    }
  });

  if (saveShareLeadBtn) {
    saveShareLeadBtn.addEventListener('click', () => {
      const name = document.getElementById('sl-name')?.value.trim();
      const phone = document.getElementById('sl-phone')?.value.trim();
      const location = document.getElementById('sl-location')?.value.trim() || 'Thanjavur';
      const type = document.getElementById('sl-type')?.value.trim() || 'Plot';
      const budget = document.getElementById('sl-budget')?.value.trim() || 'Contact for Budget';
      const notes = document.getElementById('sl-notes')?.value.trim();

      if (!name || !phone) {
        showAlertModal({
          title: 'Missing Contact Details',
          message: 'Please enter both the <strong>Client Name</strong> and <strong>Phone Number</strong> to share this lead.',
          type: 'warning'
        });
        return;
      }

      if (!allSharedLeads[activePartnerId]) {
        allSharedLeads[activePartnerId] = [];
      }

      const activeUser = JSON.parse(localStorage.getItem('thanjai_active_user')) || { fullName: 'Aishwarya Raman' };
      const now = new Date();
      const dateStr = now.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) + ', ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const newSharedLead = {
        id: `SL-${Date.now()}`,
        name: name,
        phone: phone,
        location: location,
        propertyType: type,
        budget: budget,
        sharedBy: activeUser.fullName || 'Admin',
        sharedDate: dateStr,
        status: 'Shared',
        notes: notes
      };

      allSharedLeads[activePartnerId].unshift(newSharedLead);
      localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));

      // Update partner lead count
      const partnerIdx = partners.findIndex(p => String(p.id) === String(activePartnerId));
      if (partnerIdx !== -1) {
        partners[partnerIdx].leads = allSharedLeads[activePartnerId].length;
        localStorage.setItem('thanjai_partners', JSON.stringify(partners));
      }

      closeShareLeadModalFn();
      renderSidebar();
      renderContent();
    });
  }

  // Initial Render
  renderSidebar();
  renderContent();

  // Background API Sync
  fetchFromAPI('/partners').then(data => {
    if (data && Array.isArray(data)) {
      partners = data.map(p => {
        return {
          id: p.id,
          name: p.name || p.company || 'Partner Company',
          company: p.name || p.company || 'Partner Company',
          contact: p.contactPerson || p.type || p.contact || 'Contact Person',
          contactPerson: p.contactPerson || p.type || p.contact || 'Contact Person',
          city: p.city || 'Thanjavur',
          phone: p.phone || '',
          whatsapp: p.whatsapp || p.phone || '',
          email: p.email || '',
          country: p.country || 'India',
          notes: p.notes || '',
          leads: p.leads || 0,
          status: p.status || 'Active'
        };
      });
      localStorage.setItem('thanjai_partners', JSON.stringify(partners));
      activePartnerId = partners.length > 0 ? partners[0].id : null;
      renderSidebar();
      renderContent();
    }
  }).catch(error => {
    console.warn('API sync warning:', error);
  });
}
