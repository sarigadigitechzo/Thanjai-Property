import { getAuditLogs } from '../utils/siteImagesStore.js';

export function renderAuditLogView() {
  const logs = getAuditLogs();

  return `
    <div class="view-enter audit-log-view">
      <style>
        .audit-filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #4a5568;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .audit-filter-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }
        .audit-filter-btn.active {
          background: #2d3748;
          color: #fff;
          border-color: #2d3748;
        }
      </style>
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span class="badge badge-dark" style="font-size: 0.75rem;">
              <i class="ri-history-line"></i> SECURITY & SYSTEM AUDIT TRAIL
            </span>
          </div>
          <h1 class="view-title" style="margin: 4px 0;">Audit Log</h1>
          <p class="view-subtitle" style="margin: 0;">Track administrative activities, image asset changes, listings updates, and access logs.</p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button class="os-btn-secondary" id="export-audit-btn" style="display: inline-flex; align-items: center; gap: 6px;">
            <i class="ri-download-2-line"></i> Export Audit Log
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div class="search-box" style="flex: 1; min-width: 280px; max-width: 400px; display: flex; align-items: center; gap: 8px; background: #fff; padding: 8px 14px; border: 1px solid var(--os-border); border-radius: 8px;">
          <i class="ri-search-line" style="color: var(--os-gray-400);"></i>
          <input type="text" id="audit-search-input" placeholder="Search logs by action, user, or module..." style="border: none; outline: none; width: 100%; font-size: 0.85rem;" />
        </div>
        
        <div style="display: flex; gap: 8px; flex-wrap: wrap;">
          <button class="audit-filter-btn active" data-module="all">All Modules</button>
          <button class="audit-filter-btn" data-module="Website Images">Website Images</button>
          <button class="audit-filter-btn" data-module="Properties Inventory">Properties</button>
          <button class="audit-filter-btn" data-module="CRM Pipeline">CRM Pipeline</button>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div style="
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid rgba(0,0,0,0.08);
        overflow: hidden;
        box-shadow: 0 4px 16px rgba(0,0,0,0.03);
      ">
        <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.9rem;">
          <thead>
            <tr style="background: #fdfbf7; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 0.8rem; text-transform: uppercase; color: #666; letter-spacing: 0.05em;">
              <th style="padding: 16px 20px;">Timestamp</th>
              <th style="padding: 16px 20px;">Admin User</th>
              <th style="padding: 16px 20px;">Action</th>
              <th style="padding: 16px 20px;">Module</th>
              <th style="padding: 16px 20px;">Details & Changes</th>
            </tr>
          </thead>
          <tbody id="audit-log-rows">
            ${logs.map(log => `
              <tr class="audit-row" data-module="${log.module}" style="border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.15s;">
                <td style="padding: 16px 20px; white-space: nowrap; color: #555; font-size: 0.85rem; font-weight: 500;">
                  <i class="ri-time-line" style="color: #999; margin-right: 4px;"></i>
                  ${log.timestamp}
                </td>
                <td style="padding: 16px 20px; font-weight: 600; color: #222; white-space: nowrap;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <div style="
                      width: 28px; height: 28px; border-radius: 50%; background: #2A1808; color: #F8F4EC;
                      font-size: 0.72rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                    ">${log.user.slice(0,2).toUpperCase()}</div>
                    <span>${log.user}</span>
                  </div>
                </td>
                <td style="padding: 16px 20px; font-weight: 600; color: #1a1a1a;">
                  ${log.action}
                </td>
                <td style="padding: 16px 20px;">
                  <span style="
                    font-size: 0.75rem; font-weight: 600; padding: 4px 10px; border-radius: 12px;
                    display: inline-block; white-space: nowrap;
                    background: ${log.module === 'Website Images' ? 'rgba(235, 94, 40, 0.1)' : '#edf2f7'};
                    color: ${log.module === 'Website Images' ? 'var(--color-orange, #eb5e28)' : '#4a5568'};
                  ">${log.module}</span>
                </td>
                <td style="padding: 16px 20px; color: #555; font-size: 0.88rem; max-width: 320px;">
                  ${log.details}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

export function initAuditLogListeners() {
  const searchInput = document.getElementById('audit-search-input');
  searchInput?.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll('.audit-row');

    rows.forEach(row => {
      if (row.textContent.toLowerCase().includes(query)) {
        row.style.display = '';
      } else {
        row.style.display = 'none';
      }
    });
  });

  const filterBtns = document.querySelectorAll('.audit-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const mod = btn.dataset.module;
      const rows = document.querySelectorAll('.audit-row');

      rows.forEach(row => {
        if (mod === 'all' || row.dataset.module === mod) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}
