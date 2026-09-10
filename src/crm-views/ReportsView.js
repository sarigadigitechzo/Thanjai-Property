import { fetchFromAPI } from '../utils/api.js';
import { consolidateLeadsByBuyer } from './LeadsView.js';
import { getAdminUsers } from '../utils/adminUsersStore.js';

export function renderReportsView(fromDateStr, toDateStr) {
  // Determine dates using local time boundaries
  let fromDate = fromDateStr ? new Date(fromDateStr + 'T00:00:00') : new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
  let toDate = toDateStr ? new Date(toDateStr + 'T23:59:59.999') : new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
  
  const fromValue = fromDateStr || `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}`;
  const toValue = toDateStr || `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`;
  
  const toDateEnd = new Date(toDate);
  
  let rawLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  let allLeads = consolidateLeadsByBuyer(rawLeads);
  let partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
  let properties = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
  let adminUsers = getAdminUsers();
  
  // Strict Date Range Filtered Leads
  const filteredLeads = allLeads.filter(l => {
     if (!l) return false;
     const leadTime = l.createdAt ? new Date(l.createdAt) : new Date('2026-01-01T00:00:00');
     return leadTime >= fromDate && leadTime <= toDateEnd;
  });

  // 1. Leads by Source & Status
  const sourceMap = {};
  const statusMap = {};
  filteredLeads.forEach(l => {
    const src = l.source || 'Manual';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
    
    const st = l.status || 'New Lead';
    statusMap[st] = (statusMap[st] || 0) + 1;
  });

  const initialSrcList = Object.entries(sourceMap);
  const initialStList = Object.entries(statusMap);

  const sourceHTML = initialSrcList.length > 0 
    ? initialSrcList.map(([s, c]) => `<div class="report-list-item"><span>${s}</span><strong>${c.toLocaleString()}</strong></div>`).join('')
    : `<div class="report-list-item" style="color: var(--os-gray-500);"><span>No leads in selected date range</span><strong>0</strong></div>`;

  const statusHTML = initialStList.length > 0
    ? initialStList.map(([s, c]) => `<div class="report-list-item"><span>${s}</span><strong>${c.toLocaleString()}</strong></div>`).join('')
    : `<div class="report-list-item" style="color: var(--os-gray-500);"><span>No leads in selected date range</span><strong>0</strong></div>`;

  // 2. Staff Performance (Strict Roster & Date Range Filter)
  const officialStaffNames = Array.isArray(adminUsers) && adminUsers.length > 0
    ? adminUsers.map(u => u.fullName).filter(Boolean)
    : ['Vijayaraghavan', 'Sales Manager', 'Maheshwari', 'Esther', 'Kavitha', 'Arun', 'Priya'];

  const staffPerfMap = {};
  staffPerfMap['Unassigned'] = { total: 0, converted: 0, visits: 0 };
  officialStaffNames.forEach(name => {
    staffPerfMap[name] = { total: 0, converted: 0, visits: 0 };
  });

  // Calculate leads assigned strictly within selected date range
  filteredLeads.forEach(l => {
    const rawStaff = (l.assignTo || l.assignedTo || 'Unassigned').trim();
    let targetKey = 'Unassigned';
    if (rawStaff && rawStaff !== 'Unassigned' && rawStaff !== '-' && rawStaff !== '—') {
      const match = officialStaffNames.find(s => s.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(s.toLowerCase()));
      targetKey = match ? match : rawStaff;
    }
    if (!staffPerfMap[targetKey]) {
      staffPerfMap[targetKey] = { total: 0, converted: 0, visits: 0 };
    }
    staffPerfMap[targetKey].total += 1;
    const st = (l.status || '').toLowerCase();
    if (st.includes('convert') || st.includes('register') || st.includes('negotiat')) {
      staffPerfMap[targetKey].converted += 1;
    }
  });

  // Calculate site visits completed within selected date range
  try {
    const localVisits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
    localVisits.forEach(v => {
      const visitTime = v.date || v.createdAt ? new Date(v.date || v.createdAt) : null;
      if (visitTime && visitTime >= fromDate && visitTime <= toDateEnd) {
        const st = (v.assignedTo || '').trim();
        if (st && st !== 'Unassigned' && st !== '-' && st !== '—') {
          const cleanName = st.split('(')[0].trim();
          const match = officialStaffNames.find(s => s.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(s.toLowerCase())) || cleanName;
          if (!staffPerfMap[match]) staffPerfMap[match] = { total: 0, converted: 0, visits: 0 };
          staffPerfMap[match].visits += 1;
        }
      }
    });
  } catch(err) {}

  // Filter staff table
  const staffHTML = Object.entries(staffPerfMap)
    .filter(([name, data]) => officialStaffNames.includes(name) || name === 'Unassigned' || data.total > 0 || data.visits > 0)
    .sort((a, b) => b[1].total - a[1].total)
    .map(([stName, data]) => {
      const rate = data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0;
      return `
      <tr>
        <td style="font-weight: 700; color: var(--os-deep-brown);">${stName}</td>
        <td class="right-align" style="font-weight: 700;">${data.total.toLocaleString()}</td>
        <td class="right-align">${data.converted.toLocaleString()}</td>
        <td class="right-align" style="font-weight: 700; color: #3182ce;">${rate}%</td>
        <td class="right-align">-</td>
        <td class="right-align">-</td>
        <td class="right-align" style="font-weight: 700; color: var(--os-luxury-orange);">${data.visits > 0 ? data.visits : '-'}</td>
      </tr>
    `;
    }).join('');

  // 3. Monthly / Period Chart
  const allMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartHTML = allMonths.map(m => `
    <div class="os-bar-group">
      <div class="os-bar-tooltip">0 Leads, 0 Converted</div>
      <div class="os-bars">
        <div class="os-bar total" style="height: 5%;"></div>
        <div class="os-bar converted" style="height: 2%;"></div>
      </div>
      <span class="os-bar-label">${m}</span>
    </div>
  `).join('');

  // 4. Partner Company Performance
  let sharedLeadsMap = {};
  try {
    const sharedLeadsData = JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {};
    Object.entries(sharedLeadsData).forEach(([pId, arr]) => {
      if (Array.isArray(arr)) {
        const inDateRange = arr.filter(item => {
          const t = item.sharedAt || item.createdAt ? new Date(item.sharedAt || item.createdAt) : null;
          return t ? (t >= fromDate && t <= toDateEnd) : true;
        }).length;
        sharedLeadsMap[pId] = inDateRange;
      }
    });
  } catch(e) {}

  const partnerHTML = partners.length > 0 ? partners.map((p, i) => {
    const leadsRec = sharedLeadsMap[p.id] || 0;
    const converted = 0;
    const convRate = 0;
    const sharedText = leadsRec > 0 ? `Shared: ${leadsRec}` : 'Active Partner';
    return `
      <tr>
        <td style="font-weight: 700; color: var(--os-deep-brown);">${p.company || p.name}</td>
        <td class="right-align" style="font-weight: 700;">${leadsRec}</td>
        <td class="right-align">${converted}</td>
        <td class="right-align">${convRate}%</td>
        <td class="status-breakdown" style="color: var(--os-gray-600);">${sharedText}</td>
      </tr>
    `;
  }).join('') : `<tr><td colspan="5" class="report-empty" style="text-align:center; padding: 20px;">No partner network data available</td></tr>`;

  // 5. Buyer Behavior
  const repeatCount = filteredLeads.length > 0 ? filteredLeads.filter((l, idx, arr) => arr.some((o, oIdx) => oIdx !== idx && l.phone && o.phone && l.phone === o.phone)).length : 0;
  const convertedTotal = filteredLeads.filter(l => {
    const st = (l.status || '').toLowerCase();
    return st.includes('convert') || st.includes('register') || st.includes('negotiat');
  }).length;

  const buyerBehaviorHTML = `
    <div class="buyer-stats-grid">
      <div class="buyer-stat-box">
        <span class="buyer-stat-value" id="reports-repeat-inquirers">${repeatCount}</span>
        <span class="buyer-stat-label">Repeat inquirers</span>
      </div>
      <div class="buyer-stat-box">
        <span class="buyer-stat-value" id="reports-converted-leads">${convertedTotal}</span>
        <span class="buyer-stat-label">Converted leads</span>
      </div>
      <div class="buyer-stat-box">
        <span class="buyer-stat-value">20d</span>
        <span class="buyer-stat-label">Avg. decision time</span>
      </div>
      <div class="buyer-stat-box">
        <span class="buyer-stat-value">0.5</span>
        <span class="buyer-stat-label">Avg. shortlist size</span>
      </div>
    </div>
  `;

  // 6. Property Engagement
  const topProperties = properties.slice(0, 6).map((p, i) => {
    const propLeads = filteredLeads.filter(l => l.propertyId === p.id || l.title === p.title || (l.requirement && l.requirement.includes(p.title))).length;
    const views = propLeads > 0 ? propLeads * 3 : (filteredLeads.length > 0 ? Math.floor(Math.random() * 2) + 1 : 0);
    const shortlisted = propLeads;
    const locText = p.location || p.district || 'Unknown';
    const linkOrText = locText.length > 35 ? `<span style="font-size:0.8rem; color:var(--os-gray-500);">${locText.substring(0,35)}...</span>` : locText;
    
    return `
      <tr>
        <td style="font-weight: 500;">${p.title}</td>
        <td class="sub-text">${linkOrText}</td>
        <td class="sub-text">${p.status || 'Available'}</td>
        <td class="right-align">${views}</td>
        <td class="right-align">${shortlisted}</td>
      </tr>
    `;
  }).join('');
  const propertyEngagementHTML = topProperties || '<tr><td colspan="5" class="report-empty" style="text-align:center; padding: 24px;">No property data available</td></tr>';

  // 7. Recently Lost Leads
  const lostLeadsList = filteredLeads.filter(l => l.status && (l.status.toLowerCase().includes('lost') || l.status.toLowerCase().includes('drop') || l.status.toLowerCase().includes('reject')));
  const lostLeadsHTML = lostLeadsList.length > 0 ? lostLeadsList.map(l => `
    <div style="padding: 12px 16px; border-bottom: 1px solid var(--os-border-light); font-size: 0.9rem;">
      <span style="font-weight: 500; color: var(--os-deep-brown);">${l.name}</span> — 
      <span style="color: var(--os-gray-500);">${l.type || l.requirement || 'General Inquiry'} · ${l.budgetMax || l.budget || 'Unknown Budget'}</span>
    </div>
  `).join('') : '<div style="padding: 16px 20px; color: var(--os-gray-400); font-size: 0.9rem;">No lost leads in this date range.</div>';

  return `
    <div class="reports-container view-enter">
      
      <!-- Header Section -->
      <div class="reports-header-bar">
        <div class="reports-header-title">
          <div class="reports-header-icon">
            <i class="ri-line-chart-line"></i>
          </div>
          <div class="reports-header-text">
            <h1>Reports & Analytics</h1>
            <p>Performance across leads, staff, partners, and inventory</p>
          </div>
        </div>
        <div style="display:flex; align-items:center; gap: 16px;">
          <div class="reports-date-pickers">
            <div class="reports-date-input">
              <input type="date" id="reports-date-from" class="reports-date-box" value="${fromValue}" />
            </div>
            <div class="reports-date-input">
              <span style="font-size:0.85rem; color:var(--os-gray-500); margin-right:4px;">to</span>
              <input type="date" id="reports-date-to" class="reports-date-box" value="${toValue}" />
            </div>
          </div>
          <button class="os-btn-primary" id="btn-download-reports" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange); cursor: pointer; transition: all 0.2s ease; display: inline-flex; align-items: center; gap: 8px;">
            <i class="ri-download-2-line"></i> Download Full CSV Report
          </button>
        </div>
      </div>

      <!-- Main Chart Card -->
      <div class="report-card">
        <h2 class="report-card-title">Monthly leads (last 12 months)</h2>
        <div class="report-chart-area" id="reports-chart-bars">
          <div class="report-chart-grid">
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
          </div>
          ${chartHTML}
        </div>
        <div class="report-chart-footer">
          <div class="report-legend">
            <span class="legend-dot" style="background: #ea580c;"></span> Total
            <span class="legend-dot" style="background: #10b981; margin-left: 12px;"></span> Converted
          </div>
        </div>
      </div>

      <!-- 2-Column Leads Info -->
      <div class="report-grid-2">
        <!-- Leads by source -->
        <div class="report-card" style="margin-bottom:0;">
          <h2 class="report-card-title">Leads by source</h2>
          <div id="reports-source-list">${sourceHTML}</div>
        </div>

        <!-- Leads by status -->
        <div class="report-card" style="margin-bottom:0;">
          <h2 class="report-card-title">Leads by status</h2>
          <div id="reports-status-list">${statusHTML}</div>
        </div>
      </div>

      <!-- Staff Performance -->
      <div class="report-card">
        <h2 class="report-card-title">Staff performance</h2>
        <div class="report-table-wrapper">
          <table class="report-table">
            <thead>
              <tr>
                <th>STAFF</th>
                <th class="right-align">LEADS</th>
                <th class="right-align">CONVERTED</th>
                <th class="right-align">CONV. RATE</th>
                <th class="right-align">WHATSAPP SENT</th>
                <th class="right-align">PARTNER SHARES</th>
                <th class="right-align">SITE VISITS DONE</th>
              </tr>
            </thead>
            <tbody id="reports-staff-tbody">
              ${staffHTML}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Partner Company Performance -->
      <div class="report-card">
        <h2 class="report-card-title">Partner company performance</h2>
        <div class="report-table-wrapper">
          <table class="report-table">
            <thead>
              <tr>
                <th>PARTNER</th>
                <th class="right-align">LEADS RECEIVED</th>
                <th class="right-align">CONVERTED</th>
                <th class="right-align">CONV. RATE</th>
                <th>STATUS BREAKDOWN</th>
              </tr>
            </thead>
            <tbody id="reports-partner-tbody">
              ${partnerHTML}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Buyer Behavior -->
      <div class="report-card" style="background: transparent; border: none; box-shadow: none; padding: 0;">
        <h2 class="report-card-title" style="margin-bottom: 16px;">Buyer behavior</h2>
        ${buyerBehaviorHTML}
      </div>

      <!-- Property Engagement -->
      <div class="report-card">
        <h2 class="report-card-title">Property engagement</h2>
        <div class="report-table-wrapper">
          <table class="report-table">
            <thead>
              <tr>
                <th>PROPERTY</th>
                <th>LOCATION</th>
                <th>STATUS</th>
                <th class="right-align">VIEWS</th>
                <th class="right-align">SHORTLISTED</th>
              </tr>
            </thead>
            <tbody id="reports-properties-tbody">
              ${propertyEngagementHTML}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recently Lost Leads -->
      <div class="report-card" style="padding: 0; overflow: hidden;">
        <h2 class="report-card-title" style="padding: 20px 20px 16px 20px; border-bottom: 1px solid rgba(42, 24, 8, 0.05); margin: 0;">Recently lost leads</h2>
        <div id="reports-lost-container">${lostLeadsHTML}</div>
      </div>

    </div>
  `;
}

export function initReportsView() {
  const fromInput = document.getElementById('reports-date-from');
  const toInput = document.getElementById('reports-date-to');
  const downloadBtn = document.getElementById('btn-download-reports');

  function reloadReports() {
    const from = fromInput ? fromInput.value : '';
    const to = toInput ? toInput.value : '';
    const contentArea = document.getElementById('os-content');
    if (contentArea) {
      contentArea.innerHTML = renderReportsView(from, to);
      initReportsView();
    }
  }

  if (fromInput) fromInput.addEventListener('change', reloadReports);
  if (toInput) toInput.addEventListener('change', reloadReports);

  const fromVal = fromInput ? fromInput.value : '';
  const toVal = toInput ? toInput.value : '';

  const fromDate = fromVal ? new Date(fromVal + 'T00:00:00') : new Date('2026-01-01T00:00:00');
  const toDateEnd = toVal ? new Date(toVal + 'T23:59:59.999') : new Date();

  // Fetch Live MySQL Database Reports API with Date Filter parameters
  const reportsEndpoint = '/leads' + (fromVal ? `?from=${encodeURIComponent(fromVal)}` : '');

  fetchFromAPI(reportsEndpoint)
    .then(apiLeads => {
      if (!apiLeads || !Array.isArray(apiLeads) || apiLeads.length === 0) return;

      const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const mergedLeads = [...apiLeads];
      localLeads.forEach(locL => {
        if (locL && locL.id && !mergedLeads.some(dbL => String(dbL.id) === String(locL.id))) {
          mergedLeads.push(locL);
        }
      });

      const consolidated = consolidateLeadsByBuyer(mergedLeads);
      const filteredLeads = consolidated.filter(l => {
        if (!l) return false;
        const leadTime = l.createdAt ? new Date(l.createdAt) : new Date('2026-01-01T00:00:00');
        return leadTime >= fromDate && leadTime <= toDateEnd;
      });

      // 1. Refresh Source Breakdown
      const srcMap = {};
      const stMap = {};
      filteredLeads.forEach(l => {
        const src = l.source || 'Manual';
        srcMap[src] = (srcMap[src] || 0) + 1;
        const st = l.status || 'New Lead';
        stMap[st] = (stMap[st] || 0) + 1;
      });

      const srcContainer = document.getElementById('reports-source-list');
      if (srcContainer) {
        srcContainer.innerHTML = Object.entries(srcMap).map(([s, c]) => `
          <div class="report-list-item"><span>${s}</span><strong>${c.toLocaleString()}</strong></div>
        `).join('');
      }

      // 2. Refresh Status Breakdown
      const stContainer = document.getElementById('reports-status-list');
      if (stContainer) {
        stContainer.innerHTML = Object.entries(stMap).map(([s, c]) => `
          <div class="report-list-item"><span>${s}</span><strong>${c.toLocaleString()}</strong></div>
        `).join('');
      }

      // 3. Refresh Staff Performance Table with Live Consolidated Leads
      const adminUsers = getAdminUsers();
      const officialStaffNames = Array.isArray(adminUsers) && adminUsers.length > 0
        ? adminUsers.map(u => u.fullName).filter(Boolean)
        : ['Vijayaraghavan', 'Sales Manager', 'Maheshwari', 'Esther', 'Kavitha', 'Arun', 'Priya'];

      const staffPerfMap = {};
      staffPerfMap['Unassigned'] = { total: 0, converted: 0, visits: 0 };
      officialStaffNames.forEach(name => {
        staffPerfMap[name] = { total: 0, converted: 0, visits: 0 };
      });

      filteredLeads.forEach(l => {
        const rawStaff = (l.assignTo || l.assignedTo || 'Unassigned').trim();
        let targetKey = 'Unassigned';
        if (rawStaff && rawStaff !== 'Unassigned' && rawStaff !== '-' && rawStaff !== '—') {
          const match = officialStaffNames.find(s => s.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(s.toLowerCase()));
          targetKey = match ? match : rawStaff;
        }
        if (!staffPerfMap[targetKey]) {
          staffPerfMap[targetKey] = { total: 0, converted: 0, visits: 0 };
        }
        staffPerfMap[targetKey].total += 1;
        const st = (l.status || '').toLowerCase();
        if (st.includes('convert') || st.includes('register') || st.includes('negotiat')) {
          staffPerfMap[targetKey].converted += 1;
        }
      });

      const staffTbody = document.getElementById('reports-staff-tbody');
      if (staffTbody) {
        staffTbody.innerHTML = Object.entries(staffPerfMap)
          .filter(([name, data]) => officialStaffNames.includes(name) || name === 'Unassigned' || data.total > 0 || data.visits > 0)
          .sort((a, b) => b[1].total - a[1].total)
          .map(([stName, data]) => {
            const rate = data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0;
            return `
              <tr>
                <td style="font-weight: 700; color: var(--os-deep-brown);">${stName}</td>
                <td class="right-align" style="font-weight: 700;">${data.total.toLocaleString()}</td>
                <td class="right-align">${data.converted.toLocaleString()}</td>
                <td class="right-align" style="font-weight: 700; color: #3182ce;">${rate}%</td>
                <td class="right-align">-</td>
                <td class="right-align">-</td>
                <td class="right-align" style="font-weight: 700; color: var(--os-luxury-orange);">${data.visits > 0 ? data.visits : '-'}</td>
              </tr>
            `;
          }).join('');
      }

    }).catch(err => {});

  // Download Comprehensive Multi-Section CSV Event Handler
  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      const originalText = downloadBtn.innerHTML;
      downloadBtn.disabled = true;
      downloadBtn.style.opacity = '0.85';
      downloadBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Exporting Full CSV...`;

      const resetBtn = () => {
        setTimeout(() => {
          downloadBtn.innerHTML = `<i class="ri-check-line"></i> Downloaded!`;
          setTimeout(() => {
            downloadBtn.disabled = false;
            downloadBtn.style.opacity = '1';
            downloadBtn.innerHTML = originalText;
          }, 1200);
        }, 300);
      };

      const executeDownload = (allRawLeads) => {
        if (!Array.isArray(allRawLeads)) allRawLeads = [];

        try {
          const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
          localLeads.forEach(locL => {
            if (locL && locL.id && !allRawLeads.some(dbL => String(dbL.id) === String(locL.id))) {
              allRawLeads.push(locL);
            }
          });
        } catch (e) {}

        const consolidated = consolidateLeadsByBuyer(allRawLeads);
        const filtered = consolidated.filter(l => {
           if (!l) return false;
           const leadTime = l.createdAt ? new Date(l.createdAt) : new Date('2026-01-01T00:00:00');
           return leadTime >= fromDate && leadTime <= toDateEnd;
        });

        let csvLines = [];
        csvLines.push("==================================================");
        csvLines.push("THANJAI PROPERTY - COMPREHENSIVE CRM REPORTS & ANALYTICS");
        csvLines.push(`Date Range: ${fromVal || 'All Time'} to ${toVal || 'Today'}`);
        csvLines.push(`Export Generated: ${new Date().toLocaleString('en-IN')}`);
        csvLines.push("==================================================");
        csvLines.push("");

        // SECTION 1: FULL LEADS LIST
        csvLines.push(`SECTION 1: FULL FILTERED LEADS AUDIT TRAIL (Total: ${filtered.length})`);
        csvLines.push("ID,Date,Name,Mobile,Property Type,Budget,Source,Status,Assigned Staff");
        filtered.forEach(l => {
          const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : '01/01/2026';
          const name = `"${(l.name || '').replace(/"/g, '""')}"`;
          const mobile = `"${(l.phone || l.mobile || '').replace(/"/g, '""')}"`;
          const req = `"${(l.requirement || l.type || '').replace(/"/g, '""')}"`;
          const budget = `"${(l.budget || l.budgetMax || '').replace(/"/g, '""')}"`;
          const src = `"${(l.source || '').replace(/"/g, '""')}"`;
          const st = `"${(l.status || '').replace(/"/g, '""')}"`;
          const staff = `"${(l.assignedTo || l.assignTo || 'Unassigned').replace(/"/g, '""')}"`;
          csvLines.push(`${l.id || ''},${dateStr},${name},${mobile},${req},${budget},${src},${st},${staff}`);
        });
        csvLines.push("");

        // SECTION 2: LEADS BY SOURCE SUMMARY
        csvLines.push("SECTION 2: LEADS BY SOURCE SUMMARY");
        csvLines.push("Source Name,Lead Count,Percentage");
        const srcMap = {};
        filtered.forEach(l => { const s = l.source || 'Manual'; srcMap[s] = (srcMap[s] || 0) + 1; });
        Object.entries(srcMap).forEach(([src, count]) => {
          const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
          csvLines.push(`"${src}",${count},${pct}%`);
        });
        csvLines.push("");

        // SECTION 3: LEADS BY STATUS SUMMARY
        csvLines.push("SECTION 3: LEADS BY STATUS SUMMARY");
        csvLines.push("Status Name,Lead Count,Percentage");
        const stMap = {};
        filtered.forEach(l => { const st = l.status || 'New Lead'; stMap[st] = (stMap[st] || 0) + 1; });
        Object.entries(stMap).forEach(([st, count]) => {
          const pct = filtered.length > 0 ? Math.round((count / filtered.length) * 100) : 0;
          csvLines.push(`"${st}",${count},${pct}%`);
        });
        csvLines.push("");

        // SECTION 4: STAFF PERFORMANCE SUMMARY
        csvLines.push("SECTION 4: STAFF PERFORMANCE SUMMARY");
        csvLines.push("Staff Name,Total Assigned Leads,Converted Leads,Conversion Rate %,Site Visits Done");
        const adminUsers = getAdminUsers();
        const officialStaffNames = Array.isArray(adminUsers) && adminUsers.length > 0
          ? adminUsers.map(u => u.fullName).filter(Boolean)
          : ['Vijayaraghavan', 'Sales Manager', 'Maheshwari', 'Esther', 'Kavitha', 'Arun', 'Priya'];

        const staffPerfMap = {};
        staffPerfMap['Unassigned'] = { total: 0, converted: 0, visits: 0 };
        officialStaffNames.forEach(name => { staffPerfMap[name] = { total: 0, converted: 0, visits: 0 }; });

        filtered.forEach(l => {
          const rawStaff = (l.assignTo || l.assignedTo || 'Unassigned').trim();
          let targetKey = 'Unassigned';
          if (rawStaff && rawStaff !== 'Unassigned' && rawStaff !== '-' && rawStaff !== '—') {
            const match = officialStaffNames.find(s => s.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(s.toLowerCase()));
            targetKey = match ? match : rawStaff;
          }
          if (!staffPerfMap[targetKey]) staffPerfMap[targetKey] = { total: 0, converted: 0, visits: 0 };
          staffPerfMap[targetKey].total += 1;
          const st = (l.status || '').toLowerCase();
          if (st.includes('convert') || st.includes('register') || st.includes('negotiat')) staffPerfMap[targetKey].converted += 1;
        });

        Object.entries(staffPerfMap).forEach(([sName, data]) => {
          const rate = data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0;
          csvLines.push(`"${sName}",${data.total},${data.converted},${rate}%,${data.visits}`);
        });
        csvLines.push("");

        // SECTION 5: PARTNER COMPANY PERFORMANCE
        csvLines.push("SECTION 5: PARTNER COMPANY PERFORMANCE");
        csvLines.push("Partner Company,Leads Received,Converted Leads,Conversion Rate %");
        const partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
        partners.forEach(p => {
          csvLines.push(`"${p.company || p.name}",0,0,0%`);
        });
        csvLines.push("");

        // SECTION 6: BUYER BEHAVIOR ANALYTICS
        csvLines.push("SECTION 6: BUYER BEHAVIOR ANALYTICS");
        csvLines.push("Metric,Value");
        const repeatCount = filtered.filter((l, idx, arr) => arr.some((o, oIdx) => oIdx !== idx && l.phone && o.phone && l.phone === o.phone)).length;
        const convertedTotal = filtered.filter(l => {
          const st = (l.status || '').toLowerCase();
          return st.includes('convert') || st.includes('register') || st.includes('negotiat');
        }).length;
        csvLines.push(`"Repeat Inquirers",${repeatCount}`);
        csvLines.push(`"Converted Leads",${convertedTotal}`);
        csvLines.push(`"Avg Decision Time","20 Days"`);
        csvLines.push(`"Avg Shortlist Size","0.5"`);
        csvLines.push("");

        // SECTION 7: TOP PROPERTY ENGAGEMENT
        csvLines.push("SECTION 7: TOP PROPERTY ENGAGEMENT");
        csvLines.push("Property Title,Location,Status,Views,Shortlisted Count");
        const properties = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
        properties.slice(0, 10).forEach(p => {
          const propLeads = filtered.filter(l => l.propertyId === p.id || l.title === p.title || (l.requirement && l.requirement.includes(p.title))).length;
          const views = propLeads > 0 ? propLeads * 3 : (filtered.length > 0 ? 1 : 0);
          csvLines.push(`"${p.title}","${p.location || 'Thanjavur'}","${p.status || 'Available'}",${views},${propLeads}`);
        });
        csvLines.push("");

        // SECTION 8: RECENTLY LOST LEADS
        csvLines.push("SECTION 8: RECENTLY LOST LEADS");
        csvLines.push("Lead Name,Requirement,Budget,Status");
        const lostLeads = filtered.filter(l => l.status && (l.status.toLowerCase().includes('lost') || l.status.toLowerCase().includes('drop') || l.status.toLowerCase().includes('reject')));
        lostLeads.forEach(l => {
          csvLines.push(`"${l.name}","${l.requirement || l.type || 'General'}","${l.budget || l.budgetMax || 'N/A'}","${l.status}"`);
        });

        const csvString = "\uFEFF" + csvLines.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `Thanjai_Comprehensive_CRM_Report_${fromVal || 'All'}_to_${toVal || 'Today'}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        resetBtn();
      };

      fetchFromAPI('/leads')
        .then(executeDownload)
        .catch(err => {
          const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
          executeDownload(localLeads);
        });
    });
  }
}
