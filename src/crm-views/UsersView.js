import { getRegisteredUsers } from '../utils/userAuthStore.js';
import { getProperties } from '../utils/propertiesStore.js';

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

        <div style="display: flex; gap: 12px;">
          <a href="/login.html#register" target="_blank" style="display: flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 4px; border: 1px solid #805ad5; background: #faf5ff; color: #805ad5; font-weight: 600; font-size: 0.9rem; cursor: pointer; transition: all 0.2s; text-decoration: none;">
            <i class="ri-user-add-line" style="font-size: 1.1rem;"></i> Register New User
          </a>
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
          <div class="kpi-value">${users.filter(u => u.role.includes('Individual') || u.roleCode === 'individual' || u.roleCode === 'owner').length}</div>
          <div class="kpi-trend neutral"><i class="ri-shield-check-line"></i> Land owners</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">AGENTS & BROKERS</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #319795;"><i class="ri-briefcase-line"></i></div>
          </div>
          <div class="kpi-value">${users.filter(u => u.role.includes('Agent') || u.roleCode === 'agent').length}</div>
          <div class="kpi-trend neutral"><i class="ri-building-line"></i> Network pros</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">BUILDERS & DEVS</span>
            <div class="kpi-icon" style="background: #faf5ff; color: #805ad5;"><i class="ri-community-line"></i></div>
          </div>
          <div class="kpi-value">${users.filter(u => u.role.includes('Builder') || u.roleCode === 'builder').length}</div>
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
              <option value="Individual">Individual</option>
              <option value="Agent">Agent</option>
              <option value="Builder">Builder</option>
            </select>
          </div>
        </div>

        <div class="table-responsive" style="margin-top: 16px;">
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
                <th style="padding: 14px 16px;">Actions</th>
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
    const userPropsCount = u.propertiesCount || allProperties.filter(p => p.ownerName === u.fullName || p.ownerPhone === u.phone).length;
    
    return `
      <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
        <td style="padding: 14px 16px; font-weight: 700; color: var(--os-luxury-orange);">${u.id}</td>
        <td style="padding: 14px 16px; font-weight: 700;">${u.fullName}</td>
        <td style="padding: 14px 16px; color: var(--os-gray-600);">${u.email}</td>
        <td style="padding: 14px 16px;">
          <a href="tel:${u.phone}" style="color: #3182ce; font-weight: 700; text-decoration: none;">
            ${u.phone || 'N/A'}
          </a>
        </td>
        <td style="padding: 14px 16px;">
          <span style="background: rgba(49,130,206,0.12); color: #3182ce; font-weight: 700; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block; white-space: nowrap;">
            ${u.role}
          </span>
        </td>
        <td style="padding: 14px 16px; font-weight: 800; color: var(--os-charcoal);">
          ${userPropsCount} Properties
        </td>
        <td style="padding: 14px 16px;">
          <span style="color: #38a169; font-weight: 800; font-size: 0.82rem;">
            <i class="ri-checkbox-circle-fill"></i> ${u.status || 'Active'}
          </span>
        </td>
        <td style="padding: 14px 16px;">
          <button class="view-user-props-btn" data-user-name="${u.fullName}" data-user-email="${u.email}" style="display: inline-flex; align-items: center; gap: 6px; padding: 6px 12px; font-size: 0.82rem; font-weight: 600; color: #4a5568; background: #fff; border: 1px solid #e2e8f0; border-radius: 6px; cursor: pointer; transition: all 0.2s; box-shadow: 0 1px 2px rgba(0,0,0,0.05);" onmouseover="this.style.borderColor='#cbd5e0'; this.style.backgroundColor='#f7fafc';" onmouseout="this.style.borderColor='#e2e8f0'; this.style.backgroundColor='#fff';">
            <i class="ri-eye-line" style="color: #a0aec0;"></i> View Properties
          </button>
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
      const matchQuery = !query || 
        u.fullName.toLowerCase().includes(query) || 
        u.email.toLowerCase().includes(query) || 
        (u.phone && u.phone.includes(query));
      
      const matchRole = role === 'all' || u.role.toLowerCase().includes(role.toLowerCase());
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
        alert(`Viewing properties submitted by user: ${name}\nTo manage inventory, navigate to Properties Inventory.`);
      });
    });
  }

  searchInput?.addEventListener('input', filterUsers);
  roleFilter?.addEventListener('change', filterUsers);
  attachRowListeners();
}
