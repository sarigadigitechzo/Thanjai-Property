import { getAdminUsers, addAdminUser, updateAdminUser, toggleAdminUserStatus, deleteAdminUser } from '../utils/adminUsersStore.js';
import { showToast, showConfirmModal } from '../utils/toast.js';

let activeSearchQuery = '';
let activeRoleFilter = 'all';
let activeStatusFilter = 'all';

export function renderAdminUsersView() {
  const allStaff = getAdminUsers();
  
  // Filter staff based on controls
  const filteredStaff = allStaff.filter(u => {
    const matchesSearch = !activeSearchQuery || 
      u.fullName.toLowerCase().includes(activeSearchQuery.toLowerCase()) || 
      u.email.toLowerCase().includes(activeSearchQuery.toLowerCase()) || 
      u.phone.includes(activeSearchQuery) ||
      u.id.toLowerCase().includes(activeSearchQuery.toLowerCase());

    const matchesRole = activeRoleFilter === 'all' || u.role === activeRoleFilter;
    const matchesStatus = activeStatusFilter === 'all' || u.status === activeStatusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  const superAdminCount = allStaff.filter(u => u.role === 'Super Admin').length;
  const managerCount = allStaff.filter(u => u.role === 'Sales Manager').length;
  const execCount = allStaff.filter(u => u.role === 'Sales Executive' || u.role === 'Property Staff').length;

  return `
    <div class="view-enter admin-users-view">
      
      <!-- HEADER TITLE BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: var(--os-luxury-orange); letter-spacing: 0.12em; text-transform: uppercase;">
            SYSTEM SECURITY & PERMISSIONS
          </span>
          <h1 style="font-family: var(--font-sans); font-size: 1.8rem; font-weight: 800; color: var(--os-charcoal); margin-top: 4px;">
            Admin Staff & System Access
          </h1>
          <p style="font-size: 0.88rem; color: var(--os-gray-400);">
            Manage administrative staff credentials, system roles, CRM permissions, and OS access controls.
          </p>
        </div>

        <div style="display: flex; gap: 12px; flex-wrap: wrap;">
          <button id="add-admin-staff-btn" style="display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; background: linear-gradient(135deg, #eb5e28 0%, #d94e18 100%); color: #ffffff; font-weight: 800; font-size: 0.88rem; border: none; cursor: pointer; box-shadow: 0 4px 14px rgba(235,94,40,0.35); transition: transform 0.2s;">
            <i class="ri-user-add-line"></i> + Add New Admin Staff
          </button>
          
          <a href="/admin-login.html" target="_blank" style="display: flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 8px; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); color: #ffffff; font-weight: 700; font-size: 0.88rem; cursor: pointer; text-decoration: none; box-shadow: 0 4px 12px rgba(15,23,42,0.25);">
            <i class="ri-shield-keyhole-line" style="color: #eb5e28;"></i> Open Admin Login Portal
          </a>
        </div>
      </div>

      <!-- KPI SUMMARY CARDS -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); margin-bottom: 28px;">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL ADMIN STAFF</span>
            <div class="kpi-icon" style="background: #faf5ff; color: #805ad5;"><i class="ri-shield-user-line"></i></div>
          </div>
          <div class="kpi-value">${allStaff.length}</div>
          <div class="kpi-trend up"><i class="ri-check-double-line"></i> Full OS Access</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">SUPER ADMINS</span>
            <div class="kpi-icon" style="background: #feebc8; color: #dd6b20;"><i class="ri-star-line"></i></div>
          </div>
          <div class="kpi-value">${superAdminCount}</div>
          <div class="kpi-trend neutral"><i class="ri-user-star-line"></i> System Leaders</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">SALES MANAGERS</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #319795;"><i class="ri-briefcase-line"></i></div>
          </div>
          <div class="kpi-value">${managerCount}</div>
          <div class="kpi-trend neutral"><i class="ri-team-line"></i> Pipeline Desks</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">EXECUTIVES & STAFF</span>
            <div class="kpi-icon" style="background: #ebf8ff; color: #3182ce;"><i class="ri-user-voice-line"></i></div>
          </div>
          <div class="kpi-value">${execCount}</div>
          <div class="kpi-trend neutral"><i class="ri-phone-line"></i> Operations Team</div>
        </div>
      </div>

      <!-- MAIN ADMIN STAFF DIRECTORY TABLE -->
      <div class="os-chart-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          <div style="display: flex; align-items: center; gap: 16px;">
            <span><i class="ri-shield-user-line"></i> Administrative Staff Roster & System Accounts</span>
          </div>
          
          <div style="display: flex; gap: 14px; align-items: center; flex-wrap: wrap;">
            <!-- SEARCH INPUT -->
            <div style="position: relative;">
              <i class="ri-search-line" style="position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--os-gray-400);"></i>
              <input type="text" id="admin-staff-search" value="${activeSearchQuery}" placeholder="Search staff name, email, phone..." style="padding: 8px 14px 8px 36px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.85rem; outline: none; width: 240px; background: #fff;" />
            </div>

            <!-- ROLE FILTER -->
            <select id="admin-role-filter" style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--os-border); background: #fff; font-size: 0.85rem; font-weight: 600; color: var(--os-charcoal); outline: none; cursor: pointer;">
              <option value="all" ${activeRoleFilter === 'all' ? 'selected' : ''}>All Admin Roles</option>
              <option value="Super Admin" ${activeRoleFilter === 'Super Admin' ? 'selected' : ''}>Super Admin</option>
              <option value="Sales Manager" ${activeRoleFilter === 'Sales Manager' ? 'selected' : ''}>Sales Manager</option>
              <option value="Sales Executive" ${activeRoleFilter === 'Sales Executive' ? 'selected' : ''}>Sales Executive</option>
              <option value="Property Staff" ${activeRoleFilter === 'Property Staff' ? 'selected' : ''}>Property Staff</option>
            </select>

            <!-- STATUS FILTER -->
            <select id="admin-status-filter" style="padding: 8px 12px; border-radius: 8px; border: 1px solid var(--os-border); background: #fff; font-size: 0.85rem; font-weight: 600; color: var(--os-charcoal); outline: none; cursor: pointer;">
              <option value="all" ${activeStatusFilter === 'all' ? 'selected' : ''}>All Status</option>
              <option value="Active" ${activeStatusFilter === 'Active' ? 'selected' : ''}>Active</option>
              <option value="Inactive" ${activeStatusFilter === 'Inactive' ? 'selected' : ''}>Inactive</option>
            </select>
          </div>
        </div>

        <div class="table-responsive" style="margin-top: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.08); text-transform: uppercase; font-size: 0.75rem; color: var(--os-gray-400);">
                <th style="padding: 14px 16px;">Staff ID</th>
                <th style="padding: 14px 16px;">Full Name</th>
                <th style="padding: 14px 16px;">Email Address</th>
                <th style="padding: 14px 16px;">Phone</th>
                <th style="padding: 14px 16px;">Admin Role</th>
                <th style="padding: 14px 16px;">Last Active</th>
                <th style="padding: 14px 16px;">Status</th>
                <th style="padding: 14px 16px;">Actions</th>
              </tr>
            </thead>
            <tbody>
              ${filteredStaff.length === 0 ? `
                <tr>
                  <td colspan="8" style="padding: 36px; text-align: center; color: var(--os-gray-400);">
                    No admin staff members found matching filter criteria.
                  </td>
                </tr>
              ` : filteredStaff.map(st => `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
                  <td style="padding: 14px 16px; font-weight: 800; color: #805ad5;">${st.id}</td>
                  <td style="padding: 14px 16px; font-weight: 800; color: var(--os-charcoal);">${st.fullName}</td>
                  <td style="padding: 14px 16px; color: var(--os-gray-600);">${st.email}</td>
                  <td style="padding: 14px 16px; font-weight: 700; color: #3182ce;">${st.phone}</td>
                  <td style="padding: 14px 16px;">
                    <span style="background: ${getRoleBadgeBg(st.role)}; color: ${getRoleBadgeColor(st.role)}; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-block;">
                      ${st.role}
                    </span>
                  </td>
                  <td style="padding: 14px 16px; color: var(--os-gray-600); font-size: 0.82rem;">${st.lastLogin}</td>
                  <td style="padding: 14px 16px;">
                    <span class="status-toggle-btn" data-id="${st.id}" style="color: ${st.status === 'Active' ? '#38a169' : '#e53e3e'}; font-weight: 800; font-size: 0.82rem; cursor: pointer;" title="Click to toggle Active/Inactive status">
                      <i class="${st.status === 'Active' ? 'ri-checkbox-circle-fill' : 'ri-close-circle-fill'}"></i> ${st.status}
                    </span>
                  </td>
                  <td style="padding: 14px 16px;">
                    <div style="display: flex; gap: 8px;">
                      <button class="edit-staff-btn" data-id="${st.id}" style="padding: 4px 10px; border-radius: 6px; border: 1px solid var(--os-border); background: #f8fafc; font-size: 0.78rem; font-weight: 700; cursor: pointer; color: var(--os-charcoal);">
                        <i class="ri-edit-line"></i> Edit
                      </button>
                      ${st.role !== 'Super Admin' ? `
                        <button class="delete-staff-btn" data-id="${st.id}" data-name="${st.fullName}" style="padding: 4px 10px; border-radius: 6px; border: 1px solid rgba(229,62,62,0.3); background: rgba(229,62,62,0.08); font-size: 0.78rem; font-weight: 700; cursor: pointer; color: #e53e3e;">
                          <i class="ri-delete-bin-line"></i> Delete
                        </button>
                      ` : ''}
                    </div>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>

    <!-- ADD / EDIT ADMIN STAFF MODAL OVERLAY -->
    <div id="admin-staff-modal" style="display: none; position: fixed; inset: 0; background: rgba(15,23,42,0.7); backdrop-filter: blur(4px); z-index: 9999; align-items: center; justify-content: center; padding: 20px;">
      <div style="background: #ffffff; border-radius: 16px; width: 100%; max-width: 540px; max-height: 90vh; overflow-y: auto; padding: 28px; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.3); box-sizing: border-box;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
          <h3 id="modal-staff-title" style="margin: 0; font-size: 1.2rem; font-weight: 800; color: var(--os-charcoal);">Add New Admin Staff</h3>
          <button id="close-staff-modal-btn" style="background: none; border: none; font-size: 1.4rem; cursor: pointer; color: var(--os-gray-400);">&times;</button>
        </div>

        <form id="admin-staff-form">
          <input type="hidden" id="staff-edit-id" value="" />
          
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); margin-bottom: 6px;">FULL NAME</label>
            <input type="text" id="staff-fullname" required placeholder="e.g. Anand Kumar" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); margin-bottom: 6px;">EMAIL ADDRESS</label>
            <input type="email" id="staff-email" required placeholder="anand@realrest.example" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); margin-bottom: 6px;">MOBILE PHONE</label>
            <input type="text" id="staff-phone" required placeholder="10-digit number" maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); margin-bottom: 6px;">SYSTEM PASSWORD</label>
            <div style="position: relative;">
              <input type="password" id="staff-password" required placeholder="Enter system password" style="width: 100%; padding: 10px 42px 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.9rem; outline: none; box-sizing: border-box;" />
              <i class="ri-eye-line" id="toggle-staff-pass-btn" style="position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--os-gray-400); cursor: pointer; font-size: 1.1rem; padding: 4px;" title="Toggle Password Visibility"></i>
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); margin-bottom: 6px;">SYSTEM ROLE</label>
            <select id="staff-role" required style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.9rem; outline: none; background: #fff; box-sizing: border-box;">
              <option value="Super Admin">Super Admin</option>
              <option value="Sales Manager">Sales Manager</option>
              <option value="Sales Executive" selected>Sales Executive</option>
              <option value="Property Staff">Property Staff</option>
            </select>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); margin-bottom: 6px;">ACCOUNT STATUS</label>
            <select id="staff-status" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid var(--os-border); font-size: 0.9rem; outline: none; background: #fff; box-sizing: border-box;">
              <option value="Active" selected>Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <!-- MODULE ACCESS PERMISSIONS GRID -->
          <div style="margin-bottom: 24px; border-top: 1px solid var(--os-border); padding-top: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
              <label style="font-size: 0.78rem; font-weight: 800; color: var(--os-gray-600); letter-spacing: 0.05em;">MODULE ACCESS PERMISSIONS</label>
              <div style="display: flex; gap: 8px;">
                <button type="button" id="select-all-modules-btn" style="background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #eb5e28; cursor: pointer; padding: 0;">Select All</button>
                <span style="color: #cbd5e1;">|</span>
                <button type="button" id="deselect-all-modules-btn" style="background: none; border: none; font-size: 0.75rem; font-weight: 700; color: #64748b; cursor: pointer; padding: 0;">Clear All</button>
              </div>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap: 8px; max-height: 180px; overflow-y: auto; padding: 10px; background: #f8fafc; border: 1px solid var(--os-border); border-radius: 8px;">
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="dashboard" checked /> Dashboard Overview
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="leads" checked /> CRM Pipeline
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="properties" checked /> Properties Inventory
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="property-approvals" checked /> Property Approvals
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="visits" checked /> Site Visits & Appts
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="partners" checked /> Partner Network
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="ai" checked /> AI Operating Agent
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="whatsapp" checked /> WhatsApp Log
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="pipeline" checked /> Pipeline Board
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="reports" checked /> Reports
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="settings" checked /> Settings
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="users" checked /> Portal Users Overview
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="audit" checked /> Audit Log
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="blog-cms" checked /> Blog Posts CMS
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="images" checked /> Website Images
              </label>
              <label style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #334155; font-weight: 600; cursor: pointer;">
                <input type="checkbox" class="staff-module-chk" value="admin-users" checked /> Admin Staff & Access
              </label>
            </div>
          </div>

          <div style="display: flex; justify-content: flex-end; gap: 12px;">
            <button type="button" id="cancel-staff-btn" style="padding: 10px 18px; border-radius: 8px; border: 1px solid var(--os-border); background: #f8fafc; font-weight: 700; font-size: 0.88rem; cursor: pointer;">Cancel</button>
            <button type="submit" style="padding: 10px 20px; border-radius: 8px; border: none; background: linear-gradient(135deg, #eb5e28 0%, #d94e18 100%); color: #fff; font-weight: 800; font-size: 0.88rem; cursor: pointer;">Save Admin Staff</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function getRoleBadgeBg(role) {
  switch (role) {
    case 'Super Admin': return 'rgba(235,94,40,0.12)';
    case 'Sales Manager': return 'rgba(49,151,149,0.12)';
    case 'Sales Executive': return 'rgba(49,130,206,0.12)';
    default: return 'rgba(128,90,213,0.12)';
  }
}

function getRoleBadgeColor(role) {
  switch (role) {
    case 'Super Admin': return '#eb5e28';
    case 'Sales Manager': return '#319795';
    case 'Sales Executive': return '#3182ce';
    default: return '#805ad5';
  }
}

export function initAdminUsersView() {
  const searchInput = document.getElementById('admin-staff-search');
  const roleFilter = document.getElementById('admin-role-filter');
  const statusFilter = document.getElementById('admin-status-filter');
  const addBtn = document.getElementById('add-admin-staff-btn');
  const modal = document.getElementById('admin-staff-modal');
  const closeModalBtn = document.getElementById('close-staff-modal-btn');
  const cancelBtn = document.getElementById('cancel-staff-btn');
  const staffForm = document.getElementById('admin-staff-form');
  const passInput = document.getElementById('staff-password');
  const togglePassBtn = document.getElementById('toggle-staff-pass-btn');

  // Password visibility eye toggle handler
  togglePassBtn?.addEventListener('click', () => {
    if (!passInput) return;
    if (passInput.type === 'password') {
      passInput.type = 'text';
      togglePassBtn.className = 'ri-eye-off-line';
    } else {
      passInput.type = 'password';
      togglePassBtn.className = 'ri-eye-line';
    }
  });

  // Search input handler
  searchInput?.addEventListener('input', (e) => {
    activeSearchQuery = e.target.value;
    refreshAdminUsersView();
  });

  // Role filter handler
  roleFilter?.addEventListener('change', (e) => {
    activeRoleFilter = e.target.value;
    refreshAdminUsersView();
  });

  // Status filter handler
  statusFilter?.addEventListener('change', (e) => {
    activeStatusFilter = e.target.value;
    refreshAdminUsersView();
  });

  // Select All / Clear All modules handlers
  document.getElementById('select-all-modules-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.staff-module-chk').forEach(c => c.checked = true);
  });
  document.getElementById('deselect-all-modules-btn')?.addEventListener('click', () => {
    document.querySelectorAll('.staff-module-chk').forEach(c => c.checked = false);
  });

  // Modal open for ADD (100% fresh clean inputs)
  addBtn?.addEventListener('click', () => {
    if (!modal) return;
    document.getElementById('modal-staff-title').textContent = 'Add New Admin Staff';
    document.getElementById('staff-edit-id').value = '';
    document.getElementById('staff-fullname').value = '';
    document.getElementById('staff-email').value = '';
    document.getElementById('staff-phone').value = '';
    document.getElementById('staff-password').value = '';
    if (passInput) passInput.type = 'password';
    if (togglePassBtn) togglePassBtn.className = 'ri-eye-line';
    document.getElementById('staff-role').value = 'Sales Executive';
    document.getElementById('staff-status').value = 'Active';
    document.querySelectorAll('.staff-module-chk').forEach(c => c.checked = true);
    modal.style.display = 'flex';
  });

  // Modal close handlers
  const closeModal = () => {
    if (modal) modal.style.display = 'none';
  };
  closeModalBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);

  // Form submit handler (ADD or EDIT)
  staffForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const editId = document.getElementById('staff-edit-id').value;
    const fullName = document.getElementById('staff-fullname').value.trim();
    const email = document.getElementById('staff-email').value.trim();
    const phone = document.getElementById('staff-phone').value.trim();
    const password = document.getElementById('staff-password').value.trim() || 'Admin@1234';
    const role = document.getElementById('staff-role').value;
    const status = document.getElementById('staff-status').value;
    const allowedModules = Array.from(document.querySelectorAll('.staff-module-chk:checked')).map(c => c.value);

    if (editId) {
      updateAdminUser(editId, { fullName, email, phone, password, role, status, allowedModules });
      showToast('Admin staff updated successfully!', 'success');
    } else {
      addAdminUser({ fullName, email, phone, password, role, status, allowedModules });
      showToast('New admin staff added successfully!', 'success');
    }

    closeModal();
    refreshAdminUsersView();
  });

  // Action buttons: Toggle status, Edit, Delete
  document.querySelectorAll('.status-toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const updated = toggleAdminUserStatus(id);
      if (updated) {
        showToast(`Staff status updated to ${updated.status}`, 'info');
        refreshAdminUsersView();
      }
    });
  });

  document.querySelectorAll('.edit-staff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const users = getAdminUsers();
      const target = users.find(u => u.id === id);
      if (!target || !modal) return;

      document.getElementById('modal-staff-title').textContent = `Edit Admin Staff (${target.id})`;
      document.getElementById('staff-edit-id').value = target.id;
      document.getElementById('staff-fullname').value = target.fullName;
      document.getElementById('staff-email').value = target.email;
      document.getElementById('staff-phone').value = target.phone;
      document.getElementById('staff-password').value = target.password || 'Admin@1234';
      document.getElementById('staff-role').value = target.role;
      document.getElementById('staff-status').value = target.status;

      const allowed = Array.isArray(target.allowedModules) && target.allowedModules.length > 0 ? target.allowedModules : null;
      document.querySelectorAll('.staff-module-chk').forEach(c => {
        if (allowed === null) {
          c.checked = true;
        } else {
          c.checked = allowed.includes(c.value);
        }
      });

      modal.style.display = 'flex';
    });
  });

  document.querySelectorAll('.delete-staff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const name = btn.getAttribute('data-name');
      showConfirmModal({
        title: 'Delete Staff Member',
        message: `Are you sure you want to delete admin staff <strong>"${name}"</strong> (${id})? They will lose access to the CRM workspace immediately.`,
        confirmText: 'Delete Staff',
        cancelText: 'Keep Staff',
        confirmIcon: 'ri-delete-bin-line',
        isDanger: true,
        onConfirm: () => {
          deleteAdminUser(id);
          showToast(`Admin staff ${name} deleted successfully!`, 'ri-checkbox-circle-fill');
          refreshAdminUsersView();
        }
      });
    });
  });
}

function refreshAdminUsersView() {
  const contentArea = document.getElementById('os-content');
  if (contentArea) {
    contentArea.innerHTML = renderAdminUsersView();
    initAdminUsersView();
  }
}
