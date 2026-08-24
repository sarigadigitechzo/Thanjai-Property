import { getRegisteredUsers, deleteRegisteredUser } from '../utils/userAuthStore.js';
import { getProperties } from '../utils/propertiesStore.js';
import { setPropertiesSearchFilter } from './PropertiesView.js';

export function renderUsersView() {
  const users = getRegisteredUsers();
  const allProperties = getProperties();

  return `
    <div class="view-enter">
      
      <!-- HEADER TITLE BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: var(--os-luxury-orange); letter-spacing: 0.12em; text-transform: uppercase;">
            PORTAL USERS & SELLER ACCOUNTS
          </span>
          <h1 style="font-family: var(--font-sans); font-size: 1.8rem; font-weight: 800; color: var(--os-charcoal); margin-top: 4px;">
            Registered Users Management
          </h1>
          <p style="font-size: 0.88rem; color: var(--os-gray-400);">
            Track client portal account registrations, user roles, OTP verification status, and listed properties across Tamil Nadu.
          </p>
        </div>
      </div>

      <!-- USER STATS SUMMARY CARDS -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 28px;">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL REGISTERED</span>
            <div class="kpi-icon" style="background: #ebf8ff; color: #3182ce;"><i class="ri-group-line"></i></div>
          </div>
          <div class="kpi-value">${users.length}</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> 100% verified</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">INDIVIDUAL OWNERS</span>
            <div class="kpi-icon" style="background: #feebc8; color: #dd6b20;"><i class="ri-user-3-line"></i></div>
          </div>
          <div class="kpi-value">${users.filter(u => getDisplayRole(u) === 'Individual Owner').length}</div>
          <div class="kpi-trend neutral"><i class="ri-shield-check-line"></i> Land owners</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">AGENTS & BROKERS</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #319795;"><i class="ri-briefcase-line"></i></div>
          </div>
          <div class="kpi-value">${users.filter(u => getDisplayRole(u) === 'Agent / Broker').length}</div>
          <div class="kpi-trend neutral"><i class="ri-building-line"></i> Network pros</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">BUILDERS & DEVS</span>
            <div class="kpi-icon" style="background: #faf5ff; color: #805ad5;"><i class="ri-community-line"></i></div>
          </div>
          <div class="kpi-value">${users.filter(u => getDisplayRole(u) === 'Builder / Developer').length}</div>
          <div class="kpi-trend neutral"><i class="ri-layout-line"></i> Layout developers</div>
        </div>
      </div>

      <!-- MAIN USERS DIRECTORY TABLE -->
      <div class="os-chart-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <span><i class="ri-user-shared-line"></i> Registered Portal Users Directory</span>
          </div>
          
          <div style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap;">
            <div style="position: relative;">
              <i class="ri-search-line" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--os-gray-400);"></i>
              <input type="text" id="user-search-input" placeholder="Search by name, email, phone..." style="padding: 8px 14px 8px 36px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.85rem; outline: none; width: 240px; background: #fff;" />
            </div>
            
            <select id="user-role-filter" style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--os-border); background: #fff; font-size: 0.85rem; font-weight: 600; color: var(--os-charcoal); outline: none; cursor: pointer;">
              <option value="all">All Roles</option>
              <option value="Individual Owner">Individual Owner</option>
              <option value="Agent / Broker">Agent / Broker</option>
              <option value="Builder / Developer">Builder / Developer</option>
            </select>
          </div>
        </div>

        <div class="table-responsive" style="margin-top: 16px; overflow-x: auto; width: 100%;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;" id="users-directory-table">
            <thead>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.08); text-transform: uppercase; font-size: 0.75rem; color: var(--os-gray-400);">
                <th style="padding: 14px 16px;">User ID</th>
                <th style="padding: 14px 16px;">Full Name</th>
                <th style="padding: 14px 16px;">Email Address</th>
                <th style="padding: 14px 16px;">Mobile Phone</th>
                <th style="padding: 14px 16px;">Role</th>
                <th style="padding: 14px 16px;">Listed Properties</th>
                <th style="padding: 14px 16px;">Status</th>
                <th style="padding: 14px 16px; text-align: right;">Actions</th>
              </tr>
            </thead>
            <tbody id="users-tbody">
              ${renderUsersRows(users, allProperties)}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

function getDisplayRole(u) {
  const r = (u.role || u.roleLabel || u.roleCode || '').toLowerCase();
  const email = (u.email || '').toLowerCase();
  if (r.includes('builder') || email.includes('builder')) return 'Builder / Developer';
  if (r.includes('agent') || r.includes('broker') || email.includes('agent')) return 'Agent / Broker';
  return 'Individual Owner';
}

function getRoleBadgeHtml(roleName) {
  if (roleName === 'Builder / Developer') {
    return `<span style="background: rgba(128,90,213,0.12); color: #805ad5; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block; white-space: nowrap;"><i class="ri-community-line" style="margin-right: 3px;"></i> Builder / Developer</span>`;
  }
  if (roleName === 'Agent / Broker') {
    return `<span style="background: rgba(49,151,149,0.12); color: #319795; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block; white-space: nowrap;"><i class="ri-briefcase-line" style="margin-right: 3px;"></i> Agent / Broker</span>`;
  }
  return `<span style="background: rgba(49,130,206,0.12); color: #3182ce; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block; white-space: nowrap;"><i class="ri-user-3-line" style="margin-right: 3px;"></i> Individual Owner</span>`;
}

function renderUsersRows(users, allProperties) {
  if (users.length === 0) {
    return `
      <tr>
        <td colspan="8" style="padding: 30px; text-align: center; color: var(--os-gray-400);">
          No registered users found matching filter parameters.
        </td>
      </tr>
    `;
  }

  return users.map(u => {
    const userRole = getDisplayRole(u);
    const userProps = allProperties.filter(p => 
      (p.userEmail && u.email && p.userEmail.toLowerCase() === u.email.toLowerCase()) || 
      (p.userId && u.id && p.userId === u.id) || 
      (p.ownerPhone && u.phone && String(p.ownerPhone).replace(/\D/g, '') === String(u.phone).replace(/\D/g, '')) || 
      (p.ownerName && u.fullName && (p.ownerName.toLowerCase().includes(u.fullName.toLowerCase()) || u.fullName.toLowerCase().includes(p.ownerName.toLowerCase()))) ||
      (p.listedBy && u.fullName && (p.listedBy.toLowerCase().includes(u.fullName.toLowerCase()) || u.fullName.toLowerCase().includes(p.listedBy.toLowerCase())))
    );
    const userPropsCount = userProps.length;
    
    return `
      <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
        <td style="padding: 14px 16px; font-weight: 700; color: var(--os-luxury-orange);">${u.id}</td>
        <td style="padding: 14px 16px; font-weight: 700;">${u.fullName}</td>
        <td style="padding: 14px 16px; color: var(--os-gray-600);">
          <div>${u.email}</div>
          <div style="margin-top: 4px;">
            ${u.isTemporaryPassword 
              ? `<span style="color: #DD6B20; font-size: 0.72rem; font-weight: 700; background: #FFFAF0; border: 1px solid #FEEBC8; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px;"><i class="ri-key-2-line"></i> Temp PW: <strong>${u.temporaryPassword || u.password}</strong></span>` 
              : `<span style="color: #38A169; font-size: 0.72rem; font-weight: 700; background: #F0FDF4; border: 1px solid #DCFCE7; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 3px;"><i class="ri-shield-check-line"></i> Custom Password</span>`
            }
          </div>
        </td>
        <td style="padding: 14px 16px;">
          <a href="tel:${u.phone}" style="color: #3182ce; font-weight: 700; text-decoration: none;">
            ${u.phone || 'N/A'}
          </a>
        </td>
        <td style="padding: 14px 16px;">
          ${getRoleBadgeHtml(userRole)}
        </td>
        <td style="padding: 14px 16px; font-weight: 800; color: var(--os-charcoal);">
          ${userPropsCount} Properties
        </td>
        <td style="padding: 14px 16px;">
          <span style="color: #38a169; font-weight: 800; font-size: 0.82rem;">
            <i class="ri-checkbox-circle-fill"></i> ${u.status || 'Active'}
          </span>
        </td>
        <td style="padding: 14px 16px; white-space: nowrap; text-align: right;">
          <div style="display: flex; justify-content: flex-end; align-items: center; gap: 8px;">
            <button class="view-user-props-btn" data-user-name="${u.fullName}" data-user-email="${u.email}" data-user-phone="${u.phone}" style="
              background: linear-gradient(135deg, #FFF5F2 0%, #FFEBE5 100%); color: #EB5E28;
              border: 1px solid #FFD0C2; font-weight: 700; border-radius: 8px; font-size: 0.82rem;
              padding: 6px 14px; box-shadow: 0 2px 6px rgba(235,94,40,0.12); cursor: pointer;
              display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;
            ">
              <i class="ri-building-4-line"></i> View Props
            </button>
            <button class="del-user-btn" data-user-id="${u.id}" style="
              background: linear-gradient(135deg, #FFF0F2 0%, #FFE5E8 100%); color: #E53E3E;
              border: 1px solid #FED7D7; font-weight: 700; border-radius: 8px; font-size: 0.82rem;
              padding: 6px 10px; box-shadow: 0 2px 6px rgba(229,62,62,0.12); cursor: pointer;
              display: inline-flex; align-items: center; transition: all 0.2s ease;
            " title="Delete User">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

export function initUsersView() {
  const searchInput = document.getElementById('user-search-input');
  const roleFilter = document.getElementById('user-role-filter');
  const tbody = document.getElementById('users-tbody');

  function filterUsers() {
    const query = (searchInput?.value || '').toLowerCase();
    const role = roleFilter?.value || 'all';

    let filtered = getRegisteredUsers().filter(u => {
      const uRole = getDisplayRole(u);
      const matchQuery = !query || 
        u.fullName.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) || 
        (u.phone && u.phone.includes(query));
      
      const matchRole = role === 'all' || uRole.toLowerCase().includes(role.toLowerCase()) || (u.role && u.role.toLowerCase().includes(role.toLowerCase()));
      return matchQuery && matchRole;
    });

    if (tbody) {
      tbody.innerHTML = renderUsersRows(filtered, getProperties());
      attachRowListeners();
    }
  }

  function attachRowListeners() {
    document.querySelectorAll('.view-user-props-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const name = btn.dataset.userName;
        const email = btn.dataset.userEmail;
        const phone = btn.dataset.userPhone;
        openUserPropsModalBox(name, email, phone);
      });
    });

    document.querySelectorAll('.del-user-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const userId = btn.dataset.userId;
        if (confirm(`Are you sure you want to delete user ${userId}? This action cannot be undone.`)) {
          deleteRegisteredUser(userId);
        }
      });
    });
  }

  searchInput?.addEventListener('input', filterUsers);
  roleFilter?.addEventListener('change', filterUsers);
  attachRowListeners();

  // Auto-refresh when user registers or updates in another view
  window.addEventListener('userAuthUpdated', filterUsers);
  window.addEventListener('propertiesUpdated', filterUsers);
  window.addEventListener('storage', filterUsers);
}

function openUserPropsModalBox(userName, userEmail, userPhone) {
  document.getElementById('user-props-modal-overlay')?.remove();

  const allProps = getProperties();
  const userProps = allProps.filter(p => 
    p.ownerName === userName || 
    p.ownerPhone === userPhone || 
    p.listedBy === userName || 
    (userName && p.ownerName?.toLowerCase().includes(userName.toLowerCase()))
  );

  const overlay = document.createElement('div');
  overlay.id = 'user-props-modal-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.75) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; width: 100%; max-width: 800px; max-height: 85vh; border-radius: 20px;
      display: flex; flex-direction: column; overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.3);
      border: 1px solid #E2E8F0; box-sizing: border-box; animation: pageFadeIn 0.25s ease;
    ">
      <!-- MODAL HEADER -->
      <div style="
        padding: 20px 28px; background: #2B3648; color: #ffffff; display: flex;
        align-items: center; justify-content: space-between; border-bottom: 1px solid rgba(255,255,255,0.1);
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div style="width: 42px; height: 42px; border-radius: 12px; background: rgba(235,94,40,0.2); color: #eb5e28; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
            <i class="ri-user-3-line"></i>
          </div>
          <div>
            <h3 style="font-size: 1.15rem; font-weight: 800; color: #ffffff; margin: 0;">${userName}'s Portfolio</h3>
            <span style="font-size: 0.8rem; color: rgba(255,255,255,0.7);">${userEmail || userPhone || 'Registered User'} • ${userProps.length} Properties Submitted</span>
          </div>
        </div>

        <button id="close-user-props-modal-btn" style="
          background: rgba(255,255,255,0.12); border: none; color: #ffffff; width: 34px; height: 34px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer;
        ">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- MODAL BODY -->
      <div style="padding: 24px 28px; overflow-y: auto; flex: 1; background: #F8FAFC;">
        ${userProps.length === 0 ? `
          <div style="padding: 48px; text-align: center; color: #718096;">
            <i class="ri-building-line" style="font-size: 3rem; color: #eb5e28; margin-bottom: 12px; display: block;"></i>
            <h4 style="font-size: 1.1rem; color: #1A202C; margin-bottom: 4px;">No Properties Uploaded Yet</h4>
            <p style="font-size: 0.88rem;">This user has not listed any property listings under their account yet.</p>
          </div>
        ` : `
          <div style="display: flex; flex-direction: column; gap: 16px;">
            ${userProps.map(p => {
              const isApproved = p.approvalStatus === 'Approved' || p.status === 'Available';

              return `
                <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 14px; padding: 16px; display: flex; gap: 16px; align-items: center; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
                  <img src="${(p.images && p.images[0]) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'}" style="width: 100px; height: 80px; border-radius: 10px; object-fit: cover;" />
                  
                  <div style="flex: 1;">
                    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
                      <span style="font-weight: 800; color: #eb5e28; font-size: 0.8rem;">${p.id}</span>
                      <h4 style="font-size: 1rem; font-weight: 700; color: #1A202C; margin: 0;">${p.title}</h4>
                    </div>

                    <div style="font-size: 0.82rem; color: #718096; display: flex; gap: 12px; margin-bottom: 6px; flex-wrap: wrap;">
                      <span><i class="ri-map-pin-line" style="color: #eb5e28;"></i> ${p.location}</span>
                      <span style="font-weight: 700; color: #2b6cb0;">${p.priceFormatted || '₹ ' + p.price}</span>
                      <span>Type: ${p.type}</span>
                    </div>

                    <div>
                      ${isApproved ? `
                        <span style="background: #E6FFFA; color: #234E52; border: 1px solid #B2F5EA; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                          <i class="ri-checkbox-circle-fill" style="color: #38A169;"></i> Approved & Published Live
                        </span>
                      ` : `
                        <span style="background: #FEFCBF; color: #744210; border: 1px solid #F6E05E; font-weight: 800; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; display: inline-flex; align-items: center; gap: 4px;">
                          <i class="ri-time-line" style="color: #D69E2E;"></i> Pending Admin Approval
                        </span>
                      `}
                    </div>
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();

  document.getElementById('close-user-props-modal-btn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  });
}
