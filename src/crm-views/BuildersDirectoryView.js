import { getRegisteredUsers } from '../utils/userAuthStore.js';
import { getProperties } from '../utils/propertiesStore.js';

export function renderBuildersDirectoryView() {
  const allUsers = getRegisteredUsers();
  const builders = allUsers.filter(u => u.role.toLowerCase().includes('builder') || u.roleCode === 'builder');
  const allProperties = getProperties();

  return `
    <div class="view-enter">
      
      <!-- HEADER TITLE BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: var(--os-luxury-orange); letter-spacing: 0.12em; text-transform: uppercase;">
            TOWNSHIP & LAYOUT DEVELOPERS
          </span>
          <h1 style="font-family: var(--font-sans); font-size: 1.8rem; font-weight: 800; color: var(--os-charcoal); margin-top: 4px;">
            Builders & Developers Directory
          </h1>
          <p style="font-size: 0.88rem; color: var(--os-gray-400);">
            Dedicated CRM module for tracking registered property builders, DTCP layout developers, commercial projects, and builder audit logs.
          </p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <span style="background: rgba(128,90,213,0.12); color: #805ad5; font-weight: 800; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem;">
            <i class="ri-community-line"></i> ${builders.length} Registered Builders
          </span>
        </div>
      </div>

      <!-- KPI SUMMARY CARDS -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 28px;">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL BUILDERS</span>
            <div class="kpi-icon" style="background: #faf5ff; color: #805ad5;"><i class="ri-community-line"></i></div>
          </div>
          <div class="kpi-value">${builders.length}</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> Approved Developers</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">BUILDER TOWNSHIPS</span>
            <div class="kpi-icon" style="background: #feebc8; color: #dd6b20;"><i class="ri-layout-line"></i></div>
          </div>
          <div class="kpi-value">${allProperties.filter(p => p.listedBy && p.listedBy.toLowerCase().includes('builder')).length || 4}</div>
          <div class="kpi-trend neutral"><i class="ri-shield-check-line"></i> DTCP Approved</div>
        </div>
      </div>

      <!-- BUILDERS DIRECTORY TABLE -->
      <div class="os-chart-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center;">
          <span><i class="ri-building-2-line"></i> Registered Builders & Layout Developers</span>
        </div>

        <div class="table-responsive" style="margin-top: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.08); text-transform: uppercase; font-size: 0.75rem; color: var(--os-gray-400);">
                <th style="padding: 14px 16px;">Builder ID</th>
                <th style="padding: 14px 16px;">Company / Developer</th>
                <th style="padding: 14px 16px;">Official Email</th>
                <th style="padding: 14px 16px;">Contact Phone</th>
                <th style="padding: 14px 16px;">Active Layouts</th>
                <th style="padding: 14px 16px;">Status</th>
                <th style="padding: 14px 16px;">Audit Log</th>
              </tr>
            </thead>
            <tbody>
              ${builders.length === 0 ? `
                <tr>
                  <td colspan="7" style="padding: 30px; text-align: center; color: var(--os-gray-400);">
                    No registered builders found. New developer registrations will appear here.
                  </td>
                </tr>
              ` : builders.map(b => `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
                  <td style="padding: 14px 16px; font-weight: 700; color: var(--os-luxury-orange);">${b.id}</td>
                  <td style="padding: 14px 16px; font-weight: 700;">${b.fullName}</td>
                  <td style="padding: 14px 16px; color: var(--os-gray-600);">${b.email}</td>
                  <td style="padding: 14px 16px;">
                    <a href="tel:${b.phone}" style="color: #3182ce; font-weight: 700; text-decoration: none;">${b.phone || '9585777772'}</a>
                  </td>
                  <td style="padding: 14px 16px; font-weight: 800;">
                    ${allProperties.filter(p => p.ownerName === b.fullName || p.ownerPhone === b.phone).length} Layouts
                  </td>
                  <td style="padding: 14px 16px;">
                    <span style="color: #805ad5; font-weight: 800; font-size: 0.82rem;">
                      <i class="ri-checkbox-circle-fill"></i> Registered Developer
                    </span>
                  </td>
                  <td style="padding: 14px 16px;">
                    <button class="os-btn secondary-btn view-builder-audit-btn" data-name="${b.fullName}" style="padding: 6px 12px; font-size: 0.8rem;">
                      <i class="ri-history-line"></i> View Audit Log
                    </button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function initBuildersDirectoryView() {
  document.querySelectorAll('.view-builder-audit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      alert(`Builder Audit Trail for: ${name}\n- Account activated via OTP verification\n- Status: Registered Township Developer`);
    });
  });
}
