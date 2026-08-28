import { getAuditLogs, clearAuditLogs } from '../utils/siteImagesStore.js';
import { showToast, showConfirmModal } from '../utils/toast.js';

export function renderAuditLogView() {
  const logs = getAuditLogs();

  const getModuleBadge = (mod) => {
    const m = (mod || '').toLowerCase();
    if (m.includes('image')) {
      return { bg: 'rgba(235, 94, 40, 0.1)', color: '#eb5e28', icon: 'ri-image-line' };
    } else if (m.includes('prop')) {
      return { bg: '#FEF3C7', color: '#B45309', icon: 'ri-building-line' };
    } else if (m.includes('crm') || m.includes('lead') || m.includes('pipeline')) {
      return { bg: '#DBEAFE', color: '#1D4ED8', icon: 'ri-user-shared-line' };
    } else if (m.includes('blog') || m.includes('cms')) {
      return { bg: '#F3E8FF', color: '#7E22CE', icon: 'ri-article-line' };
    } else if (m.includes('whatsapp') || m.includes('chat')) {
      return { bg: '#DCFCE7', color: '#15803D', icon: 'ri-whatsapp-line' };
    } else if (m.includes('visit')) {
      return { bg: '#CFFAFE', color: '#0E7490', icon: 'ri-calendar-check-line' };
    } else if (m.includes('partner')) {
      return { bg: '#E0E7FF', color: '#4338CA', icon: 'ri-team-line' };
    } else if (m.includes('user') || m.includes('staff') || m.includes('admin')) {
      return { bg: '#FFE4E6', color: '#BE123C', icon: 'ri-shield-user-line' };
    }
    return { bg: '#F1F5F9', color: '#475569', icon: 'ri-settings-4-line' };
  };

  return `
    <div class="view-enter audit-log-view">
      <style>
        .audit-filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #4a5568;
          font-size: 0.82rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .audit-filter-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }
        .audit-filter-btn.active {
          background: #1a202c;
          color: #fff;
          border-color: #1a202c;
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
          <p class="view-subtitle" style="margin: 0;">Track all administrative activities, CRM lead actions, WhatsApp dispatches, property updates, and system changes.</p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <button class="os-btn-secondary" id="clear-audit-btn" style="display: inline-flex; align-items: center; gap: 6px; color: #E53E3E; border-color: #FED7D7; background: #FFF5F5;">
            <i class="ri-delete-bin-line"></i> Clear Logs
          </button>
          <button class="os-btn-secondary" id="export-audit-btn" style="display: inline-flex; align-items: center; gap: 6px;">
            <i class="ri-download-2-line"></i> Export Audit Log
          </button>
        </div>
      </div>

      <!-- Filter Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div class="search-box" style="flex: 1; min-width: 280px; max-width: 380px; display: flex; align-items: center; gap: 8px; background: #fff; padding: 8px 14px; border: 1px solid var(--os-border); border-radius: 8px;">
          <i class="ri-search-line" style="color: var(--os-gray-400);"></i>
          <input type="text" id="audit-search-input" placeholder="Search logs by action, user, or module..." style="border: none; outline: none; width: 100%; font-size: 0.85rem;" />
        </div>
        
        <div style="display: flex; gap: 6px; flex-wrap: wrap;">
          <button class="audit-filter-btn active" data-module="all">All Modules (${logs.length})</button>
          <button class="audit-filter-btn" data-module="CRM Pipeline">CRM Pipeline</button>
          <button class="audit-filter-btn" data-module="WhatsApp Log">WhatsApp</button>
          <button class="audit-filter-btn" data-module="Properties Inventory">Properties</button>
          <button class="audit-filter-btn" data-module="Blog CMS">Blog CMS</button>
          <button class="audit-filter-btn" data-module="Site Visits">Site Visits</button>
          <button class="audit-filter-btn" data-module="Partners Network">Partners</button>
          <button class="audit-filter-btn" data-module="Portal Users">Users & Access</button>
          <button class="audit-filter-btn" data-module="Website Images">Website Images</button>
        </div>
      </div>

      <!-- Audit Logs Table -->
      <div style="
        background: #ffffff;
        border-radius: 16px;
        border: 1px solid rgba(0,0,0,0.08);
        overflow-x: auto;
        overflow-y: hidden;
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
            ${logs.length === 0 ? `
              <tr>
                <td colspan="5" style="padding: 40px 20px; text-align: center; color: #888;">
                  <i class="ri-history-line" style="font-size: 2.5rem; color: #ccc; display: block; margin-bottom: 8px;"></i>
                  <p style="font-weight: 600;">No audit logs recorded yet.</p>
                </td>
              </tr>
            ` : logs.map(log => {
              const badge = getModuleBadge(log.module);
              return `
                <tr class="audit-row" data-module="${log.module || ''}" style="border-bottom: 1px solid rgba(0,0,0,0.04); transition: background 0.15s;">
                  <td style="padding: 16px 20px; white-space: nowrap; color: #555; font-size: 0.85rem; font-weight: 500;">
                    <i class="ri-time-line" style="color: #999; margin-right: 4px;"></i>
                    ${log.timestamp || 'Just now'}
                  </td>
                  <td style="padding: 16px 20px; font-weight: 600; color: #222; white-space: nowrap;">
                    <div style="display: flex; align-items: center; gap: 8px;">
                      <div style="
                        width: 28px; height: 28px; border-radius: 50%; background: #2A1808; color: #F8F4EC;
                        font-size: 0.72rem; font-weight: 700; display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                      ">${(log.user || 'AD').slice(0,2).toUpperCase()}</div>
                      <span>${log.user || 'Admin'}</span>
                    </div>
                  </td>
                  <td style="padding: 16px 20px; font-weight: 700; color: #1a1a1a;">
                    ${log.action || 'System Action'}
                  </td>
                  <td style="padding: 16px 20px;">
                    <span style="
                      font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 12px;
                      display: inline-flex; align-items: center; gap: 4px; white-space: nowrap;
                      background: ${badge.bg};
                      color: ${badge.color};
                    "><i class="${badge.icon}"></i> ${log.module || 'System'}</span>
                  </td>
                  <td style="padding: 16px 20px; color: #555; font-size: 0.88rem; max-width: 380px;">
                    ${log.details || ''}
                  </td>
                </tr>
              `;
            }).join('')}
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

      const targetMod = (btn.dataset.module || 'all').toLowerCase();
      const rows = document.querySelectorAll('.audit-row');

      rows.forEach(row => {
        const rowMod = (row.dataset.module || '').toLowerCase();
        if (targetMod === 'all' || rowMod.includes(targetMod) || (targetMod === 'portal users' && (rowMod.includes('user') || rowMod.includes('staff')))) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });

  // Export Audit Log CSV
  document.getElementById('export-audit-btn')?.addEventListener('click', () => {
    const logs = getAuditLogs();
    if (!logs || logs.length === 0) {
      showToast('No audit logs available to export.', 'ri-information-line');
      return;
    }

    let csv = "Timestamp,User,Action,Module,Details\n";
    logs.forEach(l => {
      const ts = `"${(l.timestamp || '').replace(/"/g, '""')}"`;
      const user = `"${(l.user || '').replace(/"/g, '""')}"`;
      const action = `"${(l.action || '').replace(/"/g, '""')}"`;
      const module = `"${(l.module || '').replace(/"/g, '""')}"`;
      const details = `"${(l.details || '').replace(/"/g, '""')}"`;
      csv += `${ts},${user},${action},${module},${details}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Thanjai_Property_Audit_Log_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('Audit Log CSV exported successfully!', 'ri-download-2-line');
  });

  const clearBtn = document.getElementById('clear-audit-btn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      showConfirmModal({
        title: 'Clear All Audit Logs',
        message: 'Are you sure you want to delete <strong>all administrative audit logs</strong>? This action cannot be undone.',
        confirmText: 'Clear All Logs',
        isDestructive: true,
        onConfirm: () => {
          clearAuditLogs();
          showToast('Audit logs cleared', 'ri-checkbox-circle-fill');
          const rowsContainer = document.getElementById('audit-log-rows');
          if (rowsContainer) {
            rowsContainer.innerHTML = `
              <tr>
                <td colspan="5" style="padding: 40px 20px; text-align: center; color: #888;">
                  <i class="ri-history-line" style="font-size: 2.5rem; color: #ccc; display: block; margin-bottom: 8px;"></i>
                  <p style="font-weight: 600;">No audit logs recorded yet.</p>
                </td>
              </tr>
            `;
          }
        }
      });
    });
  }
}
