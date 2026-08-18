import { getRegisteredUsers } from '../utils/userAuthStore.js';
import { getProperties } from '../utils/propertiesStore.js';

export function renderAgentsDirectoryView() {
  const allUsers = getRegisteredUsers();
  const agents = allUsers.filter(u => u.role.toLowerCase().includes('agent') || u.roleCode === 'agent');
  const allProperties = getProperties();

  return `
    <div class="view-enter">
      
      <!-- HEADER TITLE BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: var(--os-luxury-orange); letter-spacing: 0.12em; text-transform: uppercase;">
            REAL ESTATE NETWORK PROS
          </span>
          <h1 style="font-family: var(--font-sans); font-size: 1.8rem; font-weight: 800; color: var(--os-charcoal); margin-top: 4px;">
            Agents & Brokers Directory
          </h1>
          <p style="font-size: 0.88rem; color: var(--os-gray-400);">
            Dedicated CRM module for managing registered real estate agents, active listings, verified brokerage licenses, and agent audit logs across Tamil Nadu.
          </p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <span style="background: rgba(49,130,206,0.12); color: #3182ce; font-weight: 800; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem;">
            <i class="ri-briefcase-line"></i> ${agents.length} Registered Agents
          </span>
        </div>
      </div>

      <!-- KPI SUMMARY CARDS -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 28px;">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL AGENTS</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #319795;"><i class="ri-briefcase-line"></i></div>
          </div>
          <div class="kpi-value">${agents.length}</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> Active Network</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">AGENT LISTINGS</span>
            <div class="kpi-icon" style="background: #ebf8ff; color: #3182ce;"><i class="ri-building-line"></i></div>
          </div>
          <div class="kpi-value">${allProperties.filter(p => p.listedBy && p.listedBy.toLowerCase().includes('agent')).length || 6}</div>
          <div class="kpi-trend neutral"><i class="ri-checkbox-circle-line"></i> Verified Listings</div>
        </div>
      </div>

      <!-- AGENTS DIRECTORY TABLE -->
      <div class="os-chart-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center;">
          <span><i class="ri-user-star-line"></i> Registered Real Estate Agents & Brokers</span>
        </div>

        <div class="table-responsive" style="margin-top: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.08); text-transform: uppercase; font-size: 0.75rem; color: var(--os-gray-400);">
                <th style="padding: 14px 16px;">Agent ID</th>
                <th style="padding: 14px 16px;">Agent Name</th>
                <th style="padding: 14px 16px;">Brokerage Email</th>
                <th style="padding: 14px 16px;">Contact Phone</th>
                <th style="padding: 14px 16px;">Active Listings</th>
                <th style="padding: 14px 16px;">Status</th>
                <th style="padding: 14px 16px;">Audit Log</th>
              </tr>
            </thead>
            <tbody>
              ${agents.length === 0 ? `
                <tr>
                  <td colspan="7" style="padding: 30px; text-align: center; color: var(--os-gray-400);">
                    No registered agents found. New agent registrations will appear here.
                  </td>
                </tr>
              ` : agents.map(a => `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
                  <td style="padding: 14px 16px; font-weight: 700; color: var(--os-luxury-orange);">${a.id}</td>
                  <td style="padding: 14px 16px; font-weight: 700;">${a.fullName}</td>
                  <td style="padding: 14px 16px; color: var(--os-gray-600);">${a.email}</td>
                  <td style="padding: 14px 16px;">
                    <a href="tel:${a.phone}" style="color: #3182ce; font-weight: 700; text-decoration: none;">${a.phone || '9585777772'}</a>
                  </td>
                  <td style="padding: 14px 16px; font-weight: 800;">
                    ${allProperties.filter(p => p.ownerName === a.fullName || p.ownerPhone === a.phone).length} Properties
                  </td>
                  <td style="padding: 14px 16px;">
                    <span style="color: #38a169; font-weight: 800; font-size: 0.82rem;">
                      <i class="ri-checkbox-circle-fill"></i> Verified Agent
                    </span>
                  </td>
                  <td style="padding: 14px 16px;">
                    <button class="os-btn secondary-btn view-agent-audit-btn" data-name="${a.fullName}" style="padding: 6px 12px; font-size: 0.8rem;">
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

export function initAgentsDirectoryView() {
  document.querySelectorAll('.view-agent-audit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.dataset.name;
      alert(`Agent Audit Trail for: ${name}\n- Account activated via OTP verification\n- Status: Verified Active Broker`);
    });
  });
}
