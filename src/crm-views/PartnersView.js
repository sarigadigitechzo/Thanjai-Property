import { getRegisteredUsers, getCurrentUser } from '../utils/userAuthStore.js';

export function renderPartnersView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Partner Network</h1>
          <p class="view-subtitle">Manage partner companies and track shared referrals</p>
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
        <div class="pn-content">
          <div class="pn-content-header" id="pn-content-title">
            Select a partner
          </div>
          <div class="pn-leads-list" id="pn-leads-container">
            <!-- Populated by JS -->
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <div class="os-modal-overlay" id="add-partner-modal">
      <div class="os-modal-card" style="max-width: 700px;">
        <div class="os-modal-header">
          <h2>Add partner company</h2>
          <button class="os-modal-close" id="close-partner-modal"><i class="ri-close-line"></i></button>
        </div>
        <div class="os-modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>Company name *</label>
              <input type="text" id="ap-company" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label>Contact person</label>
              <input type="text" id="ap-contact" style="width: 100%;" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Phone</label>
              <input type="text" id="ap-phone" placeholder="10-digit number" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label>WhatsApp</label>
              <input type="text" id="ap-whatsapp" style="width: 100%;" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Email</label>
              <input type="email" id="ap-email" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label>City</label>
              <input type="text" id="ap-city" style="width: 100%;" />
            </div>
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>Country</label>
              <input type="text" id="ap-country" style="width: 100%;" />
            </div>
            <div class="form-group">
              <label>Status</label>
              <select id="ap-status" style="width: 100%; height: 42px; border: 1px solid rgba(42, 24, 8, 0.1); border-radius: 6px; padding: 0 16px; color: var(--os-deep-brown);">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom: 0;">
            <label>Notes</label>
            <textarea id="ap-notes" style="width: 100%; min-height: 80px; resize: vertical; border: 1px solid rgba(42, 24, 8, 0.1); border-radius: 6px; padding: 12px 16px;"></textarea>
          </div>
        </div>
        <div class="os-modal-footer">
          <button class="os-btn-secondary" id="cancel-partner-modal">Cancel</button>
          <button class="os-btn-primary" id="save-partner-modal" style="background: #e27c3e; border-color: #e27c3e;">Save</button>
        </div>
      </div>
    </div>
  `;
}

export function initPartnersView() {
  // Data Initialization
  let partners = JSON.parse(localStorage.getItem('thanjai_partners'));
  if (!partners || !Array.isArray(partners)) {
    partners = [
      { id: 1, company: 'Chennai Prime Realty', contact: 'Senthil Kumar', city: 'Chennai', leads: 2, status: 'Active' },
      { id: 2, company: 'digitechzo', contact: 'udhay', city: 'madurai', leads: 2, status: 'Active' },
      { id: 3, company: 'fvghg', contact: 'hghg', city: '', leads: 0, status: 'Active' },
      { id: 4, company: 'IUCS', contact: 'Ram', city: '', leads: 3, status: 'Active' },
      { id: 5, company: 'Kovai Homes & Plots', contact: 'Lakshmi Narayanan', city: 'Coimbatore', leads: 1, status: 'Active' }
    ];
  }

  // Sync registered client portal users to Partner Network
  const registeredUsers = getRegisteredUsers();
  const activeUser = getCurrentUser();
  const allUsersToSync = [...registeredUsers];
  if (activeUser && activeUser.email && !allUsersToSync.some(u => u.email === activeUser.email)) {
    allUsersToSync.push(activeUser);
  }

  allUsersToSync.forEach(u => {
    if (!u || (!u.fullName && !u.name)) return;
    const name = u.fullName || u.name;
    const email = u.email || '';
    const phone = u.phone || '';
    const company = u.company || name || 'Partner Member';

    const exists = partners.some(p => 
      (email && p.email && p.email.toLowerCase() === email.toLowerCase()) || 
      (phone && p.phone && p.phone === phone) || 
      (p.contact && p.contact.toLowerCase() === name.toLowerCase())
    );

    if (!exists) {
      partners.push({
        id: u.id || `partner-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        company: company,
        contact: name,
        city: u.city || u.district || 'Thanjavur',
        phone: phone,
        email: email,
        leads: 0,
        status: 'Active'
      });
    }
  });

  localStorage.setItem('thanjai_partners', JSON.stringify(partners));

  // Mock Shared Leads Data
  let allSharedLeads = JSON.parse(localStorage.getItem('thanjai_shared_leads'));
  if (!allSharedLeads) {
    allSharedLeads = {
      1: [ // Chennai Prime Realty
        {
          name: 'Karthikeyan V G',
          phone: '**********',
          location: 'MADURAI',
          propertyType: 'Plot',
          budget: 'up to ₹1,10,000',
          sharedBy: 'Arun Prakash',
          sharedDate: '11 Aug 2026, 11:13',
          status: 'Shared'
        },
        {
          name: 'Rajesh Annamalai',
          phone: '**********',
          location: 'Coimbatore',
          propertyType: 'Townhouse',
          budget: 'up to ₹1,40,00,000',
          sharedBy: 'Kavitha Murugan',
          sharedDate: '2 Jul 2026, 21:58',
          notes: 'Coimbatore client, prefers Saravanampatti but open to Vadavalli villas.',
          status: 'In Progress'
        }
      ]
    };
    localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));
  }

  let activePartnerId = 1;

  const sidebarList = document.getElementById('pn-sidebar-list');
  const contentTitle = document.getElementById('pn-content-title');
  const leadsContainer = document.getElementById('pn-leads-container');

  const renderSidebar = () => {
    if (!sidebarList) return;
    let html = '';
    partners.forEach(p => {
      const isActive = p.id === activePartnerId ? 'active' : '';
      const locationText = p.city ? ` · ${p.city}` : '';
      html += `
        <div class="pn-partner-item ${isActive}" data-id="${p.id}">
          <div class="pn-partner-header">
            <div class="pn-partner-name">${p.company}</div>
            <div class="pn-badge active">${p.status.toUpperCase()}</div>
          </div>
          <div class="pn-partner-meta">
            ${p.contact || 'No contact'}${locationText} · ${p.leads} leads
          </div>
          <div class="pn-actions">
            <button class="pn-edit-btn">Edit</button>
            <button class="pn-delete-btn">Delete</button>
          </div>
        </div>
      `;
    });
    sidebarList.innerHTML = html;

    sidebarList.querySelectorAll('.pn-partner-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.classList.contains('pn-edit-btn')) {
          e.stopPropagation();
          alert('Edit partner modal would open here.');
          return;
        }
        if (e.target.classList.contains('pn-delete-btn')) {
          e.stopPropagation();
          const partnerId = parseInt(item.dataset.id);
          if (confirm('Are you sure you want to delete this partner?')) {
            partners = partners.filter(p => p.id !== partnerId);
            localStorage.setItem('thanjai_partners', JSON.stringify(partners));
            if (activePartnerId === partnerId) {
              activePartnerId = partners.length > 0 ? partners[0].id : null;
            }
            renderSidebar();
            renderContent();
          }
          return;
        }
        activePartnerId = parseInt(item.dataset.id);
        renderSidebar();
        renderContent();
      });
    });
  };

  const renderContent = () => {
    if (!contentTitle || !leadsContainer) return;
    const partner = partners.find(p => p.id === activePartnerId);
    if (!partner) return;

    contentTitle.textContent = `${partner.company} — shared leads`;

    const leads = allSharedLeads[activePartnerId] || [];
    if (leads.length === 0) {
      leadsContainer.innerHTML = '<div style="color: var(--os-gray-500);">No shared leads for this partner.</div>';
      return;
    }

    let html = '';
    leads.forEach((lead, index) => {
      const statusClass = lead.status === 'Shared' ? 'shared' : 'in-progress';
      const notesHtml = lead.notes ? `<div style="font-size: 0.85rem; color: var(--os-gray-600); margin-top: 8px;">${lead.notes}</div>` : '';
      html += `
        <div class="pn-lead-card">
          <div class="pn-lead-info">
            <h3>${lead.name}</h3>
            <div class="pn-lead-details">
              ${lead.phone} · ${lead.location} · ${lead.propertyType} · ${lead.budget}
            </div>
            <div class="pn-lead-meta">
              Shared by ${lead.sharedBy} · ${lead.sharedDate}
            </div>
            ${notesHtml}
          </div>
          <div class="pn-lead-actions">
            <span class="pn-status-tag ${statusClass}">${lead.status.toUpperCase()}</span>
            <div class="custom-dropdown-wrap">
              <div class="custom-dropdown-selected" tabindex="0">
                ${lead.status} <i class="ri-arrow-down-s-fill"></i>
              </div>
              <div class="custom-dropdown-options">
                <div class="custom-option" data-val="Shared">Shared</div>
                <div class="custom-option" data-val="In Progress">In Progress</div>
                <div class="custom-option" data-val="Closed">Closed</div>
              </div>
            </div>
            <button class="os-btn-icon btn-delete-shared-lead" data-index="${index}" style="color: #ef4444; border: 1px solid #fee2e2; background: #fff;">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </div>
      `;
    });
    leadsContainer.innerHTML = html;

    // Attach custom dropdown logic
    leadsContainer.querySelectorAll('.custom-dropdown-wrap').forEach(wrap => {
      const selected = wrap.querySelector('.custom-dropdown-selected');
      const options = wrap.querySelectorAll('.custom-option');
      
      selected.addEventListener('click', (e) => {
        // close other open dropdowns
        document.querySelectorAll('.custom-dropdown-wrap').forEach(w => {
          if (w !== wrap) w.classList.remove('open');
        });
        wrap.classList.toggle('open');
        e.stopPropagation();
      });

      options.forEach(opt => {
        opt.addEventListener('click', (e) => {
          selected.innerHTML = `${opt.dataset.val} <i class="ri-arrow-down-s-fill"></i>`;
          wrap.classList.remove('open');
          e.stopPropagation();
        });
      });
    });

    // Delete Logic
    leadsContainer.querySelectorAll('.btn-delete-shared-lead').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this shared lead?')) {
          const index = parseInt(btn.dataset.index);
          allSharedLeads[activePartnerId].splice(index, 1);
          localStorage.setItem('thanjai_shared_leads', JSON.stringify(allSharedLeads));
          renderContent();
        }
      });
    });
  };

  renderSidebar();
  renderContent();

  // Modal Logic
  const addModal = document.getElementById('add-partner-modal');
  const btnAdd = document.getElementById('btn-add-partner');
  const closeBtn = document.getElementById('close-partner-modal');
  const cancelBtn = document.getElementById('cancel-partner-modal');
  const saveBtn = document.getElementById('save-partner-modal');

  const closeModal = () => { if (addModal) addModal.classList.remove('show'); };

  if (btnAdd) btnAdd.addEventListener('click', () => addModal.classList.add('show'));
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (cancelBtn) cancelBtn.addEventListener('click', closeModal);

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const company = document.getElementById('ap-company').value.trim();
      const contact = document.getElementById('ap-contact').value.trim();
      const city = document.getElementById('ap-city').value.trim();
      const status = document.getElementById('ap-status').value;

      if (!company) {
        alert("Company name is required.");
        return;
      }

      partners.push({
        id: Date.now(),
        company,
        contact,
        city,
        leads: 0,
        status
      });
      localStorage.setItem('thanjai_partners', JSON.stringify(partners));
      
      activePartnerId = partners[partners.length - 1].id;
      
      closeModal();
      renderSidebar();
      renderContent();
    });
  }

  // Global click to close custom dropdowns and modals
  window.addEventListener('click', (e) => {
    if (e.target === addModal) closeModal();
    if (!e.target.closest('.custom-dropdown-wrap')) {
      document.querySelectorAll('.custom-dropdown-wrap.open').forEach(w => w.classList.remove('open'));
    }
  });
}
