import { fetchFromAPI } from '../utils/api.js';
import { consolidateLeadsByBuyer } from './LeadsView.js';
import { getAdminUsers } from '../utils/adminUsersStore.js';

export function normalizeLeadSource(srcStr) {
  if (!srcStr || typeof srcStr !== 'string') return 'Direct Website Submission';
  const clean = srcStr.trim().toLowerCase();
  
  if (clean.includes('whatsapp')) return 'WhatsApp Inquiry';
  if (clean.includes('phone') || clean.includes('call')) return 'Phone Call Inquiry';
  if (clean.includes('walk-in') || clean.includes('walkin') || clean.includes('office')) return 'Walk-in Client';
  if (clean.includes('facebook') || clean.includes('instagram') || clean.includes('fb') || clean.includes('insta') || clean.includes('meta') || clean.includes('social')) return 'Facebook / Instagram Ads';
  if (clean.includes('google') || clean.includes('search') || clean.includes('seo') || clean.includes('gads')) return 'Google Search / Ads';
  if (clean.includes('referral') || clean.includes('broker') || clean.includes('partner') || clean.includes('agent')) return 'Referral / Broker Network';
  if (clean.includes('popup') || clean.includes('promo') || clean.includes('banner') || clean.includes('offer')) return 'Website Popups & Banners';
  if (clean.includes('direct') || clean.includes('website') || clean.includes('web') || clean.includes('online')) return 'Direct Website Submission';
  
  return 'Manual Entry / Direct';
}

export function parseFlexibleDate(dateStr) {
  if (!dateStr) return new Date('2026-01-01T00:00:00');
  if (dateStr instanceof Date) return isNaN(dateStr.getTime()) ? new Date('2026-01-01T00:00:00') : dateStr;
  
  const str = String(dateStr).trim();
  if (!str) return new Date('2026-01-01T00:00:00');

  const parts = str.split(/[\sT/\-.:]+/);
  if (parts.length >= 3) {
    let year, month, day, hour = 0, min = 0, sec = 0;
    if (parts[0].length === 4) {
      year = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      day = parseInt(parts[2], 10);
    } else {
      day = parseInt(parts[0], 10);
      month = parseInt(parts[1], 10) - 1;
      year = parseInt(parts[2], 10);
    }
    if (parts.length >= 6) {
      hour = parseInt(parts[3], 10) || 0;
      min = parseInt(parts[4], 10) || 0;
      sec = parseInt(parts[5], 10) || 0;
    }
    const d = new Date(year, month, day, hour, min, sec);
    if (!isNaN(d.getTime())) return d;
  }

  let d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  return new Date('2026-01-01T00:00:00');
}

export function mergeLocalLeads(targetList) {
  if (!Array.isArray(targetList)) targetList = [];
  try {
    const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    localLeads.forEach(locL => {
      if (!locL || !locL.id) return;
      const dbL = targetList.find(d => d && String(d.id) === String(locL.id));
      if (dbL) {
        const locStaff = (locL.assignTo || locL.assignedTo || locL.assign_to || locL.assigned_to || locL.staff || locL.assignedStaff || '').trim();
        const dbStaff = (dbL.assignTo || dbL.assignedTo || dbL.assign_to || dbL.assigned_to || dbL.staff || dbL.assignedStaff || '').trim();
        if (locStaff && locStaff !== 'Unassigned' && locStaff !== '-' && locStaff !== '—' && (!dbStaff || dbStaff === 'Unassigned' || dbStaff === '-' || dbStaff === '—')) {
          dbL.assignTo = locStaff;
          dbL.assignedTo = locStaff;
        }
        if (!dbL.createdAt && locL.createdAt) {
          dbL.createdAt = locL.createdAt;
        }
      } else {
        targetList.push({ ...locL });
      }
    });
  } catch (e) {}
  return targetList;
}

export function renderReportsView(fromDateStr, toDateStr) {
  // Determine dates using local time boundaries
  let fromDate = fromDateStr ? parseFlexibleDate(fromDateStr + 'T00:00:00') : new Date(new Date().getFullYear(), 0, 1, 0, 0, 0);
  let toDate = toDateStr ? parseFlexibleDate(toDateStr + 'T23:59:59.999') : new Date(new Date().getFullYear(), 11, 31, 23, 59, 59);
  
  const fromValue = fromDateStr || `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}`;
  const toValue = toDateStr || `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`;
  
  const toDateEnd = new Date(toDate);
  
  let rawLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  rawLeads = mergeLocalLeads(rawLeads);
  let allLeads = consolidateLeadsByBuyer(rawLeads);
  let partners = JSON.parse(localStorage.getItem('thanjai_partners')) || [];
  if (!Array.isArray(partners) || partners.length === 0) {
    partners = [
      { id: 'P-101', company: 'Chennai Prime Realty', name: 'Senthil Kumar', phone: '9840123456', city: 'Chennai' },
      { id: 'P-102', company: 'Madurai Farmlands Co.', name: 'Muruganandam', phone: '9842234567', city: 'Madurai' },
      { id: 'P-103', company: 'Trichy Housing & Lands', name: 'Karthik Raja', phone: '9443123456', city: 'Trichy' },
      { id: 'P-104', company: 'Kumbakonam Heritage Properties', name: 'Ramasamy', phone: '9843345678', city: 'Kumbakonam' }
    ];
    try { localStorage.setItem('thanjai_partners', JSON.stringify(partners)); } catch(e) {}
  }
  let properties = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
  let adminUsers = getAdminUsers();
  
  // Strict Date Range Filtered Leads
  const filteredLeads = allLeads.filter(l => {
     if (!l) return false;
     const leadTime = parseFlexibleDate(l.createdAt);
     return leadTime >= fromDate && leadTime <= toDateEnd;
  });

  // 1. Leads by Source & Status
  const sourceMap = {};
  const statusMap = {};
  filteredLeads.forEach(l => {
    const src = normalizeLeadSource(l.source);
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
  const officialStaffNames = Array.from(new Set(
    Array.isArray(adminUsers) && adminUsers.length > 0
      ? adminUsers.map(u => (u.fullName || '').trim()).filter(Boolean)
      : ['Vijayaraghavan', 'Maheshwari', 'Esther', 'Vinoth', 'Venkat', 'Vignesh', 'Radha Krishnan', 'Vijay', 'Vetri Thunaivan']
  ));

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
      targetKey = match ? match : 'Unassigned';
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
          const match = officialStaffNames.find(s => s.toLowerCase().includes(cleanName.toLowerCase()) || cleanName.toLowerCase().includes(s.toLowerCase()));
          const targetKey = match ? match : 'Unassigned';
          if (!staffPerfMap[targetKey]) staffPerfMap[targetKey] = { total: 0, converted: 0, visits: 0 };
          staffPerfMap[targetKey].visits += 1;
        }
      }
    });
  } catch(err) {}

  // Filter staff table
  const staffHTML = Object.entries(staffPerfMap)
    .filter(([name, data]) => officialStaffNames.includes(name) || name === 'Unassigned')
    .sort((a, b) => b[1].total - a[1].total)
    .map(([stName, data]) => {
      const rate = data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0;
      return `
      <tr>
        <td style="font-weight: 700;">
          <a href="#" class="btn-view-staff-detail" data-staff="${stName}" title="Click to view detailed staff lead audit" style="color: var(--os-luxury-orange); text-decoration: none; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: opacity 0.2s ease;">
            <i class="ri-user-search-line"></i> ${stName}
          </a>
        </td>
        <td class="right-align" style="font-weight: 700;">${data.total.toLocaleString()}</td>
        <td class="right-align">${data.converted.toLocaleString()}</td>
        <td class="right-align" style="font-weight: 700; color: #3182ce;">${rate}%</td>
        <td class="right-align">-</td>
        <td class="right-align">-</td>
        <td class="right-align" style="font-weight: 700; color: var(--os-luxury-orange);">${data.visits > 0 ? data.visits : '-'}</td>
        <td class="center-align" style="text-align: center;">
          <button class="btn-download-staff-csv" data-staff="${stName}" style="background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;">
            <i class="ri-download-2-line"></i> Download CSV
          </button>
        </td>
      </tr>
    `;
    }).join('');

  // 3. Monthly / Period Chart (Dynamic Month-wise Lead Counts & Range Highlighting)
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const monthlyMap = Array.from({ length: 12 }, () => ({ total: 0, converted: 0 }));

  const selFromMonth = fromDate.getMonth();
  const selToMonth = toDateEnd.getMonth();

  allLeads.forEach(l => {
    if (!l) return;
    const leadDate = l.createdAt ? parseFlexibleDate(l.createdAt) : null;
    if (leadDate && !isNaN(leadDate.getTime())) {
      const mIdx = leadDate.getMonth();
      if (mIdx >= 0 && mIdx < 12) {
        monthlyMap[mIdx].total += 1;
        const st = (l.status || '').toLowerCase();
        if (st.includes('convert') || st.includes('register') || st.includes('negotiat')) {
          monthlyMap[mIdx].converted += 1;
        }
      }
    }
  });

  let maxMonthVal = 1;
  monthlyMap.forEach(m => { if (m.total > maxMonthVal) maxMonthVal = m.total; });

  const chartHTML = monthNames.map((mName, mIdx) => {
    const data = monthlyMap[mIdx];
    const totalH = data.total > 0 ? Math.max(8, Math.round((data.total / maxMonthVal) * 100)) : 5;
    const convH = data.converted > 0 ? Math.max(5, Math.round((data.converted / maxMonthVal) * 100)) : 2;
    const isSelectedMonth = (mIdx >= selFromMonth && mIdx <= selToMonth);
    const labelStyle = isSelectedMonth ? 'font-weight: 700; color: #ea580c;' : '';

    return `
      <div class="os-bar-group">
        <div class="os-bar-tooltip">${data.total.toLocaleString()} Leads, ${data.converted.toLocaleString()} Converted (${mName})</div>
        <div class="os-bars">
          <div class="os-bar total" style="height: ${totalH}%;"></div>
          <div class="os-bar converted" style="height: ${convH}%;"></div>
        </div>
        <span class="os-bar-label" style="${labelStyle}">${mName}</span>
      </div>
    `;
  }).join('');

  // 4. Partner Company Performance
  let sharedLeadsMap = {};
  try {
    const sharedLeadsData = JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {};
    if (Array.isArray(sharedLeadsData)) {
      sharedLeadsData.forEach(item => {
        if (!item) return;
        const pKey = String(item.partnerId || item.partner_id || item.company || item.partner || '').toLowerCase().trim();
        if (pKey) {
          const t = item.sharedAt || item.createdAt ? parseFlexibleDate(item.sharedAt || item.createdAt) : null;
          if (!t || (t >= fromDate && t <= toDateEnd)) {
            sharedLeadsMap[pKey] = (sharedLeadsMap[pKey] || 0) + 1;
          }
        }
      });
    } else if (typeof sharedLeadsData === 'object' && sharedLeadsData !== null) {
      Object.entries(sharedLeadsData).forEach(([pId, arr]) => {
        const cleanKey = String(pId).toLowerCase().trim();
        if (Array.isArray(arr)) {
          const inDateRange = arr.filter(item => {
            const t = item.sharedAt || item.createdAt ? parseFlexibleDate(item.sharedAt || item.createdAt) : null;
            return t ? (t >= fromDate && t <= toDateEnd) : true;
          }).length;
          sharedLeadsMap[cleanKey] = inDateRange;
        } else if (typeof arr === 'number') {
          sharedLeadsMap[cleanKey] = arr;
        }
      });
    }
  } catch(e) {}

  const partnerHTML = partners.length > 0 ? partners.map((p, i) => {
    const pKeyId = String(p.id || '').toLowerCase().trim();
    const pKeyComp = String(p.company || '').toLowerCase().trim();
    const pKeyName = String(p.name || '').toLowerCase().trim();
    const leadsRec = sharedLeadsMap[pKeyId] || sharedLeadsMap[pKeyComp] || sharedLeadsMap[pKeyName] || 0;
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

  // 6. Property Engagement — Sorted Descending by Highest Views & Shortlists
  const allPropStats = properties.map(p => {
    const propLeads = filteredLeads.filter(l => l.propertyId === p.id || (l.title && l.title === p.title) || (l.requirement && p.title && l.requirement.includes(p.title))).length;
    const views = propLeads > 0 ? propLeads * 3 : (filteredLeads.length > 0 ? 1 : 0);
    const shortlisted = propLeads;
    const locText = p.location || p.district || 'Unknown';
    const linkOrText = locText.length > 35 ? `<span style="font-size:0.8rem; color:var(--os-gray-500);">${locText.substring(0,35)}...</span>` : locText;
    return { property: p, propLeads, views, shortlisted, locText, linkOrText };
  });

  allPropStats.sort((a, b) => (b.views - a.views) || (b.shortlisted - a.shortlisted));

  const topProperties = allPropStats.slice(0, 6).map(item => {
    const p = item.property;
    return `
      <tr>
        <td style="font-weight: 500;">${p.title}</td>
        <td class="sub-text">${item.linkOrText}</td>
        <td class="sub-text">${p.status || 'Available'}</td>
        <td class="right-align">${item.views}</td>
        <td class="right-align">${item.shortlisted}</td>
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
                <th class="center-align" style="text-align: center;">ACTION</th>
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

  const fromDate = fromVal ? parseFlexibleDate(fromVal + 'T00:00:00') : new Date('2026-01-01T00:00:00');
  const toDateEnd = toVal ? parseFlexibleDate(toVal + 'T23:59:59.999') : new Date();

  // Fetch Live MySQL Database Reports API with Date Filter parameters
  const reportsEndpoint = '/leads' + (fromVal ? `?from=${encodeURIComponent(fromVal)}` : '');

  Promise.all([
    fetchFromAPI(reportsEndpoint).catch(() => []),
    fetchFromAPI('/partners').catch(() => []),
    fetchFromAPI('/shared_leads').catch(() => [])
  ]).then(([apiLeads, apiPartners, apiSharedLeads]) => {
      if (!apiLeads || !Array.isArray(apiLeads)) apiLeads = [];

      if (apiPartners && Array.isArray(apiPartners) && apiPartners.length > 0) {
        try { localStorage.setItem('thanjai_partners', JSON.stringify(apiPartners)); } catch(e) {}
      }

      if (apiSharedLeads && (Array.isArray(apiSharedLeads) || typeof apiSharedLeads === 'object')) {
        try { localStorage.setItem('thanjai_shared_leads', JSON.stringify(apiSharedLeads)); } catch(e) {}
      }

      const mergedLeads = mergeLocalLeads([...apiLeads]);
      const consolidated = consolidateLeadsByBuyer(mergedLeads);
      const filteredLeads = consolidated.filter(l => {
        if (!l) return false;
        const leadTime = parseFlexibleDate(l.createdAt);
        return leadTime >= fromDate && leadTime <= toDateEnd;
      });

      // 1. Refresh Source Breakdown
      const srcMap = {};
      const stMap = {};
      filteredLeads.forEach(l => {
        const src = normalizeLeadSource(l.source);
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
      const officialStaffNames = Array.from(new Set(
        Array.isArray(adminUsers) && adminUsers.length > 0
          ? adminUsers.map(u => (u.fullName || '').trim()).filter(Boolean)
          : ['Vijayaraghavan', 'Maheshwari', 'Esther', 'Vinoth', 'Venkat', 'Vignesh', 'Radha Krishnan', 'Vijay', 'Vetri Thunaivan']
      ));

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
          targetKey = match ? match : 'Unassigned';
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
          .filter(([name, data]) => officialStaffNames.includes(name) || name === 'Unassigned')
          .sort((a, b) => b[1].total - a[1].total)
          .map(([stName, data]) => {
            const rate = data.total > 0 ? Math.round((data.converted / data.total) * 100) : 0;
            return `
              <tr>
                <td style="font-weight: 700;">
                  <a href="#" class="btn-view-staff-detail" data-staff="${stName}" title="Click to view detailed staff lead audit" style="color: var(--os-luxury-orange); text-decoration: none; font-weight: 800; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: opacity 0.2s ease;">
                    <i class="ri-user-search-line"></i> ${stName}
                  </a>
                </td>
                <td class="right-align" style="font-weight: 700;">${data.total.toLocaleString()}</td>
                <td class="right-align">${data.converted.toLocaleString()}</td>
                <td class="right-align" style="font-weight: 700; color: #3182ce;">${rate}%</td>
                <td class="right-align">-</td>
                <td class="right-align">-</td>
                <td class="right-align" style="font-weight: 700; color: var(--os-luxury-orange);">${data.visits > 0 ? data.visits : '-'}</td>
                <td class="center-align" style="text-align: center;">
                  <button class="btn-download-staff-csv" data-staff="${stName}" style="background: #fff7ed; color: #ea580c; border: 1px solid #ffedd5; padding: 4px 10px; border-radius: 6px; font-size: 0.78rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.2s ease;">
                    <i class="ri-download-2-line"></i> Download CSV
                  </button>
                </td>
              </tr>
            `;
          }).join('');
      }

      // 4. Refresh Partner Company Performance Table
      const partnerTbody = document.getElementById('reports-partner-tbody');
      if (partnerTbody) {
        let partners = (apiPartners && Array.isArray(apiPartners) && apiPartners.length > 0)
          ? apiPartners
          : (JSON.parse(localStorage.getItem('thanjai_partners')) || []);
        
        if (!Array.isArray(partners) || partners.length === 0) {
          partners = [
            { id: 'P-101', company: 'Chennai Prime Realty', name: 'Senthil Kumar', phone: '9840123456', city: 'Chennai' },
            { id: 'P-102', company: 'Madurai Farmlands Co.', name: 'Muruganandam', phone: '9842234567', city: 'Madurai' },
            { id: 'P-103', company: 'Trichy Housing & Lands', name: 'Karthik Raja', phone: '9443123456', city: 'Trichy' },
            { id: 'P-104', company: 'Kumbakonam Heritage Properties', name: 'Ramasamy', phone: '9843345678', city: 'Kumbakonam' }
          ];
        }

        let sharedLeadsMap = {};
        try {
          const sharedData = (apiSharedLeads && (Array.isArray(apiSharedLeads) || typeof apiSharedLeads === 'object'))
            ? apiSharedLeads
            : (JSON.parse(localStorage.getItem('thanjai_shared_leads')) || {});
          
          if (Array.isArray(sharedData)) {
            sharedData.forEach(item => {
              if (!item) return;
              const pKey = String(item.partnerId || item.partner_id || item.company || item.partner || '').toLowerCase().trim();
              if (pKey) {
                const t = item.sharedAt || item.createdAt ? parseFlexibleDate(item.sharedAt || item.createdAt) : null;
                if (!t || (t >= fromDate && t <= toDateEnd)) {
                  sharedLeadsMap[pKey] = (sharedLeadsMap[pKey] || 0) + 1;
                }
              }
            });
          } else if (typeof sharedData === 'object' && sharedData !== null) {
            Object.entries(sharedData).forEach(([key, arr]) => {
              const cleanKey = String(key).toLowerCase().trim();
              if (Array.isArray(arr)) {
                const inDateRange = arr.filter(item => {
                  const t = item.sharedAt || item.createdAt ? parseFlexibleDate(item.sharedAt || item.createdAt) : null;
                  return t ? (t >= fromDate && t <= toDateEnd) : true;
                }).length;
                sharedLeadsMap[cleanKey] = inDateRange;
              } else if (typeof arr === 'number') {
                sharedLeadsMap[cleanKey] = arr;
              }
            });
          }
        } catch(e) {}

        partnerTbody.innerHTML = partners.map(p => {
          const pKeyId = String(p.id || '').toLowerCase().trim();
          const pKeyComp = String(p.company || '').toLowerCase().trim();
          const pKeyName = String(p.name || '').toLowerCase().trim();
          const leadsRec = sharedLeadsMap[pKeyId] || sharedLeadsMap[pKeyComp] || sharedLeadsMap[pKeyName] || 0;
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
        }).join('');
      }

      // 5. Dynamic Monthly Trend Bar Chart Live Update
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthlyMap = Array.from({ length: 12 }, () => ({ total: 0, converted: 0 }));

      const selFromMonth = fromDate.getMonth();
      const selToMonth = toDateEnd.getMonth();

      consolidated.forEach(l => {
        if (!l) return;
        const leadDate = l.createdAt ? parseFlexibleDate(l.createdAt) : null;
        if (leadDate && !isNaN(leadDate.getTime())) {
          const mIdx = leadDate.getMonth();
          if (mIdx >= 0 && mIdx < 12) {
            monthlyMap[mIdx].total += 1;
            const st = (l.status || '').toLowerCase();
            if (st.includes('convert') || st.includes('register') || st.includes('negotiat')) {
              monthlyMap[mIdx].converted += 1;
            }
          }
        }
      });

      let maxMonthVal = 1;
      monthlyMap.forEach(m => { if (m.total > maxMonthVal) maxMonthVal = m.total; });

      const chartArea = document.getElementById('reports-chart-bars');
      if (chartArea) {
        const gridHtml = `
          <div class="report-chart-grid">
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
            <div class="report-chart-grid-line"></div>
          </div>
        `;
        const barsHtml = monthNames.map((mName, mIdx) => {
          const data = monthlyMap[mIdx];
          const totalH = data.total > 0 ? Math.max(8, Math.round((data.total / maxMonthVal) * 100)) : 5;
          const convH = data.converted > 0 ? Math.max(5, Math.round((data.converted / maxMonthVal) * 100)) : 2;
          const isSelectedMonth = (mIdx >= selFromMonth && mIdx <= selToMonth);
          const labelStyle = isSelectedMonth ? 'font-weight: 700; color: #ea580c;' : '';

          return `
            <div class="os-bar-group">
              <div class="os-bar-tooltip">${data.total.toLocaleString()} Leads, ${data.converted.toLocaleString()} Converted (${mName})</div>
              <div class="os-bars">
                <div class="os-bar total" style="height: ${totalH}%;"></div>
                <div class="os-bar converted" style="height: ${convH}%;"></div>
              </div>
              <span class="os-bar-label" style="${labelStyle}">${mName}</span>
            </div>
          `;
        }).join('');
        chartArea.innerHTML = gridHtml + barsHtml;
      }

      // 6. Refresh Property Engagement Table (Sorted Descending by Highest Views & Shortlists)
      const propTbody = document.getElementById('reports-properties-tbody');
      if (propTbody) {
        let properties = JSON.parse(localStorage.getItem('thanjai_properties')) || [];
        const allPropStats = properties.map(p => {
          const propLeads = filteredLeads.filter(l => l.propertyId === p.id || (l.title && l.title === p.title) || (l.requirement && p.title && l.requirement.includes(p.title))).length;
          const views = propLeads > 0 ? propLeads * 3 : (filteredLeads.length > 0 ? 1 : 0);
          const shortlisted = propLeads;
          const locText = p.location || p.district || 'Unknown';
          const linkOrText = locText.length > 35 ? `<span style="font-size:0.8rem; color:var(--os-gray-500);">${locText.substring(0,35)}...</span>` : locText;
          return { property: p, propLeads, views, shortlisted, locText, linkOrText };
        });

        allPropStats.sort((a, b) => (b.views - a.views) || (b.shortlisted - a.shortlisted));

        propTbody.innerHTML = allPropStats.slice(0, 6).map(item => {
          const p = item.property;
          return `
            <tr>
              <td style="font-weight: 500;">${p.title}</td>
              <td class="sub-text">${item.linkOrText}</td>
              <td class="sub-text">${p.status || 'Available'}</td>
              <td class="right-align">${item.views}</td>
              <td class="right-align">${item.shortlisted}</td>
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
        const mergedAllLeads = mergeLocalLeads([...allRawLeads]);
        const consolidated = consolidateLeadsByBuyer(mergedAllLeads);
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

        triggerCSVDownload(`Thanjai_Comprehensive_CRM_Report_${fromVal || 'All'}_to_${toVal || 'Today'}.csv`, csvLines);
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

  // Individual Staff Report Modal & CSV Download Delegation
  const staffTbody = document.getElementById('reports-staff-tbody');
  if (staffTbody && !staffTbody.hasAttribute('data-download-listener')) {
    staffTbody.setAttribute('data-download-listener', 'true');
    staffTbody.addEventListener('click', (e) => {
      const detailBtn = e.target.closest('.btn-view-staff-detail');
      if (detailBtn) {
        e.preventDefault();
        const staffName = detailBtn.getAttribute('data-staff');
        if (staffName) {
          fetchFromAPI('/leads')
            .then(apiLeads => openStaffDetailModal(staffName, apiLeads))
            .catch(() => {
              const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
              openStaffDetailModal(staffName, localLeads);
            });
        }
        return;
      }

      const btn = e.target.closest('.btn-download-staff-csv');
      if (!btn) return;
      
      const staffName = btn.getAttribute('data-staff');
      if (!staffName) return;

      const origHTML = btn.innerHTML;
      btn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Exporting...`;
      btn.disabled = true;

      fetchFromAPI('/leads')
        .then(apiLeads => exportIndividualStaffCSV(staffName, apiLeads))
        .catch(() => {
          const localLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
          exportIndividualStaffCSV(staffName, localLeads);
        })
        .finally(() => {
          setTimeout(() => {
            btn.innerHTML = `<i class="ri-check-line"></i> Done!`;
            setTimeout(() => {
              btn.innerHTML = origHTML;
              btn.disabled = false;
            }, 1200);
          }, 300);
        });
    });
  }
}

function exportIndividualStaffCSV(staffName, rawLeads, preFilteredLeads = null, preFilteredVisits = null) {
  if (!Array.isArray(rawLeads)) rawLeads = [];

  const fromVal = document.getElementById('reports-date-from')?.value || '';
  const toVal = document.getElementById('reports-date-to')?.value || '';

  const fromDate = fromVal ? parseFlexibleDate(fromVal + 'T00:00:00') : new Date('2026-01-01T00:00:00');
  const toDateEnd = toVal ? parseFlexibleDate(toVal + 'T23:59:59.999') : new Date();

  let staffLeads = [];
  if (Array.isArray(preFilteredLeads)) {
    staffLeads = preFilteredLeads;
  } else {
    const mergedRawLeads = mergeLocalLeads([...rawLeads]);
    const adminUsers = getAdminUsers();
    const officialStaffNames = Array.from(new Set(
      Array.isArray(adminUsers) && adminUsers.length > 0
        ? adminUsers.map(u => (u.fullName || '').trim()).filter(Boolean)
        : ['Vijayaraghavan', 'Maheshwari', 'Esther', 'Vinoth', 'Venkat', 'Vignesh', 'Radha Krishnan', 'Vijay', 'Vetri Thunaivan']
    ));

    const targetUser = Array.isArray(adminUsers) 
      ? adminUsers.find(u => u && u.fullName && (u.fullName.toLowerCase().trim().includes(staffName.toLowerCase().trim()) || staffName.toLowerCase().trim().includes(u.fullName.toLowerCase().trim())))
      : null;

    const resolveStaffKey = (l) => {
      if (!l) return 'Unassigned';
      const rawStaff = String(l.assignTo || l.assignedTo || l.assign_to || l.assigned_to || l.staff || l.assignedStaff || 'Unassigned').trim();
      if (!rawStaff || rawStaff === 'Unassigned' || rawStaff === '-' || rawStaff === '—' || rawStaff === 'null' || rawStaff === 'undefined') {
        return 'Unassigned';
      }
      const match = officialStaffNames.find(s => s.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(s.toLowerCase()));
      if (match) return match;

      if (targetUser && targetUser.fullName) {
        const uName = targetUser.fullName.trim();
        if (uName.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(uName.toLowerCase())) {
          return staffName;
        }
      }
      return rawStaff;
    };

    mergedRawLeads.forEach(l => {
      if (l) {
        const resolved = resolveStaffKey(l);
        if (resolved && resolved !== 'Unassigned') {
          l.assignTo = resolved;
          l.assignedTo = resolved;
        }
      }
    });

    const consolidated = consolidateLeadsByBuyer(mergedRawLeads);

    const allAssignedLeadsForStaff = consolidated.filter(l => {
      if (!l) return false;
      const key = resolveStaffKey(l);
      if (staffName === 'Unassigned') {
        return key === 'Unassigned';
      }
      const keyLower = key.toLowerCase().trim();
      const targetLower = staffName.toLowerCase().trim();
      return keyLower === targetLower || keyLower.includes(targetLower) || targetLower.includes(keyLower);
    });

    staffLeads = allAssignedLeadsForStaff.filter(l => {
      const leadTime = parseFlexibleDate(l.createdAt);
      return leadTime >= fromDate && leadTime <= toDateEnd;
    });
  }

  let dateFilterNote = "";

  let staffVisits = [];
  if (Array.isArray(preFilteredVisits)) {
    staffVisits = preFilteredVisits;
  } else {
    try {
      const localVisits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
      const targetLower = staffName.toLowerCase().trim();
      staffVisits = localVisits.filter(v => {
        const visitTime = v.date || v.createdAt ? parseFlexibleDate(v.date || v.createdAt) : null;
        if (visitTime && (visitTime < fromDate || visitTime > toDateEnd)) return false;
        const st = (v.assignedTo || '').trim();
        if (!st) return false;
        const cleanName = st.split('(')[0].trim().toLowerCase();
        return cleanName.includes(targetLower) || targetLower.includes(cleanName);
      });
    } catch(e) {}
  }

  const convertedCount = staffLeads.filter(l => {
    const st = (l.status || '').toLowerCase();
    return st.includes('convert') || st.includes('register') || st.includes('negotiat');
  }).length;
  const convRate = staffLeads.length > 0 ? Math.round((convertedCount / staffLeads.length) * 100) : 0;

  let csvLines = [];
  csvLines.push("==================================================");
  csvLines.push(`INDIVIDUAL STAFF PERFORMANCE REPORT - ${staffName.toUpperCase()}`);
  csvLines.push(`Date Range: ${fromVal || 'All Time'} to ${toVal || 'Today'}`);
  if (dateFilterNote) {
    csvLines.push(dateFilterNote);
  }
  csvLines.push(`Export Generated: ${new Date().toLocaleString('en-IN')}`);
  csvLines.push("==================================================");
  csvLines.push("");
  csvLines.push("SUMMARY METRICS");
  csvLines.push(`"Staff Name","${staffName}"`);
  csvLines.push(`"Total Assigned Leads",${staffLeads.length}`);
  csvLines.push(`"Converted Leads",${convertedCount}`);
  csvLines.push(`"Conversion Rate",${convRate}%`);
  csvLines.push(`"Completed Site Visits",${staffVisits.length}`);
  csvLines.push("");
  csvLines.push("ASSIGNED LEADS AUDIT TRAIL");
  csvLines.push("Lead ID,Date,Client Name,Mobile,Property Type/Requirement,Budget,Source,Status,Notes");
  staffLeads.forEach(l => {
    const d = parseFlexibleDate(l.createdAt);
    const dateStr = d ? d.toLocaleDateString('en-IN') : '01/01/2026';
    const rawNotes = Array.isArray(l.notes) ? l.notes.join('; ') : String(l.notes || '');
    const name = `"${String(l.name || '').replace(/"/g, '""')}"`;
    const mobile = `"${String(l.phone || l.mobile || '').replace(/"/g, '""')}"`;
    const req = `"${String(l.requirement || l.type || '').replace(/"/g, '""')}"`;
    const budget = `"${String(l.budget || l.budgetMax || '').replace(/"/g, '""')}"`;
    const src = `"${String(l.source || '').replace(/"/g, '""')}"`;
    const st = `"${String(l.status || '').replace(/"/g, '""')}"`;
    const notes = `"${rawNotes.replace(/"/g, '""')}"`;
    csvLines.push(`${l.id || ''},${dateStr},${name},${mobile},${req},${budget},${src},${st},${notes}`);
  });
  csvLines.push("");
  csvLines.push("COMPLETED SITE VISITS");
  csvLines.push("Visit ID,Date,Client Name,Property,Status");
  staffVisits.forEach(v => {
    const vDate = v.date ? new Date(v.date).toLocaleDateString('en-IN') : 'N/A';
    const client = String(v.clientName || v.name || '').replace(/"/g, '""');
    const prop = String(v.propertyTitle || v.property || '').replace(/"/g, '""');
    const st = String(v.status || 'Scheduled').replace(/"/g, '""');
    csvLines.push(`${v.id || ''},${vDate},"${client}","${prop}","${st}"`);
  });

  triggerCSVDownload(`Staff_Report_${staffName.replace(/\s+/g, '_')}_${fromVal || 'All'}_to_${toVal || 'Today'}.csv`, csvLines);
}

function triggerCSVDownload(filename, csvLines) {
  try {
    const csvString = "\uFEFF" + csvLines.join("\r\n");
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    
    if (window.navigator && window.navigator.msSaveOrOpenBlob) {
      window.navigator.msSaveOrOpenBlob(blob, filename);
      return;
    }
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    
    setTimeout(() => {
      if (link && link.parentNode) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(url);
    }, 300);
  } catch(e) {
    console.error("CSV Download Error:", e);
  }
}

export function openStaffDetailModal(staffName, rawLeads) {
  if (!Array.isArray(rawLeads)) rawLeads = [];
  const mergedRawLeads = mergeLocalLeads([...rawLeads]);

  const fromVal = document.getElementById('reports-date-from')?.value || '';
  const toVal = document.getElementById('reports-date-to')?.value || '';

  const fromDate = fromVal ? parseFlexibleDate(fromVal + 'T00:00:00') : new Date('2026-01-01T00:00:00');
  const toDateEnd = toVal ? parseFlexibleDate(toVal + 'T23:59:59.999') : new Date();

  const adminUsers = getAdminUsers();
  const officialStaffNames = Array.from(new Set(
    Array.isArray(adminUsers) && adminUsers.length > 0
      ? adminUsers.map(u => (u.fullName || '').trim()).filter(Boolean)
      : ['Vijayaraghavan', 'Maheshwari', 'Esther', 'Vinoth', 'Venkat', 'Vignesh', 'Radha Krishnan', 'Vijay', 'Vetri Thunaivan']
  ));

  const targetUser = Array.isArray(adminUsers) 
    ? adminUsers.find(u => u && u.fullName && (u.fullName.toLowerCase().trim().includes(staffName.toLowerCase().trim()) || staffName.toLowerCase().trim().includes(u.fullName.toLowerCase().trim())))
    : null;

  const resolveStaffKey = (l) => {
    if (!l) return 'Unassigned';
    const rawStaff = String(l.assignTo || l.assignedTo || l.assign_to || l.assigned_to || l.staff || l.assignedStaff || 'Unassigned').trim();
    if (!rawStaff || rawStaff === 'Unassigned' || rawStaff === '-' || rawStaff === '—' || rawStaff === 'null' || rawStaff === 'undefined') {
      return 'Unassigned';
    }
    const match = officialStaffNames.find(s => s.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(s.toLowerCase()));
    if (match) return match;

    if (targetUser && targetUser.fullName) {
      const uName = targetUser.fullName.trim();
      if (uName.toLowerCase().includes(rawStaff.toLowerCase()) || rawStaff.toLowerCase().includes(uName.toLowerCase())) {
        return staffName;
      }
    }
    return rawStaff;
  };

  mergedRawLeads.forEach(l => {
    if (l) {
      const resolved = resolveStaffKey(l);
      if (resolved && resolved !== 'Unassigned') {
        l.assignTo = resolved;
        l.assignedTo = resolved;
      }
    }
  });

  const consolidated = consolidateLeadsByBuyer(mergedRawLeads);

  const allAssignedLeadsForStaff = consolidated.filter(l => {
    if (!l) return false;
    const key = resolveStaffKey(l);
    if (staffName === 'Unassigned') {
      return key === 'Unassigned';
    }
    const keyLower = key.toLowerCase().trim();
    const targetLower = staffName.toLowerCase().trim();
    return keyLower === targetLower || keyLower.includes(targetLower) || targetLower.includes(keyLower);
  });

  let staffLeads = allAssignedLeadsForStaff.filter(l => {
    const leadTime = parseFlexibleDate(l.createdAt);
    return leadTime >= fromDate && leadTime <= toDateEnd;
  });

  let staffVisits = [];
  try {
    const localVisits = JSON.parse(localStorage.getItem('thanjai_visits')) || [];
    const targetLower = staffName.toLowerCase().trim();
    staffVisits = localVisits.filter(v => {
      const visitTime = v.date || v.createdAt ? parseFlexibleDate(v.date || v.createdAt) : null;
      if (visitTime && (visitTime < fromDate || visitTime > toDateEnd)) return false;
      const st = (v.assignedTo || '').trim();
      if (!st) return false;
      const cleanName = st.split('(')[0].trim().toLowerCase();
      return cleanName.includes(targetLower) || targetLower.includes(cleanName);
    });
  } catch(e) {}

  const convertedCount = staffLeads.filter(l => {
    const st = (l.status || '').toLowerCase();
    return st.includes('convert') || st.includes('register') || st.includes('negotiat');
  }).length;
  const convRate = staffLeads.length > 0 ? Math.round((convertedCount / staffLeads.length) * 100) : 0;

  const getPriorityInfo = (l) => {
    const pStr = String(l.priority || l.leadPriority || l.lead_priority || '').trim().toLowerCase();
    const stLower = String(l.status || '').toLowerCase();
    const bgtNum = parseFloat(String(l.budget || l.budgetMax || 0).replace(/[^\d.]/g, ''));

    if (pStr.includes('high') || pStr.includes('hot') || stLower.includes('site') || stLower.includes('negotiat') || bgtNum >= 5000000) {
      return { label: 'High', bg: '#fee2e2', color: '#991b1b', border: '#fca5a5', icon: 'ri-fire-fill' };
    } else if (pStr.includes('low') || pStr.includes('cold') || stLower.includes('lost') || stLower.includes('drop')) {
      return { label: 'Low', bg: '#f1f5f9', color: '#475569', border: '#cbd5e1', icon: 'ri-subtract-line' };
    } else {
      return { label: 'Medium', bg: '#ffedd5', color: '#9a3412', border: '#fed7aa', icon: 'ri-flashlight-line' };
    }
  };

  let highCount = 0, medCount = 0, lowCount = 0;
  staffLeads.forEach(l => {
    const info = getPriorityInfo(l);
    if (info.label === 'High') highCount++;
    else if (info.label === 'Low') lowCount++;
    else medCount++;
  });

  const existingModal = document.getElementById('staff-detail-modal-overlay');
  if (existingModal) existingModal.remove();

  const modalHTML = `
    <div id="staff-detail-modal-overlay" style="position: fixed; inset: 0; background: rgba(15, 23, 42, 0.65); backdrop-filter: blur(6px); z-index: 9999; display: flex; align-items: center; justify-content: center; padding: 20px; animation: fadeIn 0.2s ease;">
      <div style="background: #ffffff; border-radius: 20px; width: 100%; max-width: 980px; max-height: 90vh; display: flex; flex-direction: column; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); overflow: hidden; border: 1px solid rgba(226, 232, 240, 0.8);">
        
        <!-- Modal Header -->
        <div style="padding: 20px 28px; background: #fafaf9; border-bottom: 1px solid #e7e5e4; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;">
          <div style="display: flex; align-items: center; gap: 14px;">
            <div style="width: 44px; height: 44px; border-radius: 12px; background: #ffedd5; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.4rem; font-weight: 800;">
              <i class="ri-user-star-line"></i>
            </div>
            <div>
              <span style="font-size: 0.72rem; font-weight: 800; color: #ea580c; text-transform: uppercase; letter-spacing: 0.1em;">Staff Performance & Lead Audit</span>
              <h2 style="font-size: 1.35rem; font-weight: 800; color: #1c1917; margin: 2px 0 0 0;">${staffName}</h2>
            </div>
          </div>

          <div style="display: flex; align-items: center; gap: 10px;">
            <button id="modal-download-staff-csv" style="background: #ea580c; color: #ffffff; border: none; padding: 8px 16px; border-radius: 10px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.2s ease;">
              <i class="ri-download-2-line"></i> Download Staff CSV
            </button>
            <button id="modal-close-staff-detail" style="background: #f5f5f4; color: #78716c; border: 1px solid #e7e5e4; width: 36px; height: 36px; border-radius: 10px; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease;">
              <i class="ri-close-line"></i>
            </button>
          </div>
        </div>

        <!-- Modal Content Body -->
        <div style="padding: 24px 28px; overflow-y: auto; flex-grow: 1;">
          
          <!-- Summary Metrics Cards -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; margin-bottom: 24px;">
            <div style="background: #fcfbf9; border: 1px solid #e7e5e4; border-radius: 14px; padding: 16px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #78716c; text-transform: uppercase;">Total Assigned Leads</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #1c1917; margin-top: 4px;">${staffLeads.length.toLocaleString()}</div>
            </div>

            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 14px; padding: 16px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #166534; text-transform: uppercase;">Converted Leads</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #15803d; margin-top: 4px;">${convertedCount.toLocaleString()} (${convRate}%)</div>
            </div>

            <div style="background: #fff7ed; border: 1px solid #ffedd5; border-radius: 14px; padding: 16px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #9a3412; text-transform: uppercase;">Site Visits Done</div>
              <div style="font-size: 1.6rem; font-weight: 800; color: #ea580c; margin-top: 4px;">${staffVisits.length}</div>
            </div>

            <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 16px; display: flex; flex-direction: column; justify-content: center; gap: 6px;">
              <div style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 2px;">Priority Breakdown</div>
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <span style="background: #fee2e2; color: #991b1b; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #fca5a5;">🔴 High: ${highCount}</span>
                <span style="background: #ffedd5; color: #9a3412; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #fed7aa;">🟠 Medium: ${medCount}</span>
                <span style="background: #f1f5f9; color: #475569; font-size: 0.72rem; font-weight: 800; padding: 2px 8px; border-radius: 6px; border: 1px solid #cbd5e1;">🔵 Low: ${lowCount}</span>
              </div>
            </div>
          </div>

          <!-- Section Title: Leads List -->
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
            <h3 style="font-size: 1rem; font-weight: 800; color: #1c1917; margin: 0; display: flex; align-items: center; gap: 6px;">
              <i class="ri-file-list-3-line" style="color: #ea580c;"></i> Assigned Leads Audit Trail (${staffLeads.length})
            </h3>
            <span style="font-size: 0.78rem; color: #78716c;">Date Range: ${fromVal || 'All Time'} to ${toVal || 'Today'}</span>
          </div>

          <!-- Leads Table -->
          <div style="border: 1px solid #e7e5e4; border-radius: 14px; overflow: hidden; margin-bottom: 24px;">
            <div style="max-height: 340px; overflow-y: auto;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead style="position: sticky; top: 0; background: #fafaf9; border-bottom: 1px solid #e7e5e4; z-index: 10;">
                  <tr>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">ID / Date</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Client Name</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Mobile</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Requirement</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Budget</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Priority</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Status</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Source</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffLeads.length === 0 ? `
                    <tr><td colspan="8" style="text-align: center; padding: 24px; color: #a8a29e;">No leads assigned to this staff member in selected range</td></tr>
                  ` : staffLeads.map(l => {
                    const pInfo = getPriorityInfo(l);
                    const d = parseFlexibleDate(l.createdAt);
                    const dateStr = d ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '01 Jan';
                    return `
                      <tr style="border-bottom: 1px solid #f5f5f4;">
                        <td style="padding: 10px 14px;">
                          <div style="font-weight: 700; color: #1c1917;">${l.id || 'LD-NEW'}</div>
                          <div style="font-size: 0.75rem; color: #78716c;">${dateStr}</div>
                        </td>
                        <td style="padding: 10px 14px; font-weight: 700; color: #1c1917;">${l.name || 'Anonymous'}</td>
                        <td style="padding: 10px 14px; font-family: monospace; color: #44403c;">${l.phone || l.mobile || '—'}</td>
                        <td style="padding: 10px 14px; color: #57534e;">${l.requirement || l.type || 'General'}</td>
                        <td style="padding: 10px 14px; font-weight: 600; color: #166534;">${l.budget || l.budgetMax || 'On Request'}</td>
                        <td style="padding: 10px 14px;">
                          <span style="background: ${pInfo.bg}; color: ${pInfo.color}; border: 1px solid ${pInfo.border}; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 800; display: inline-flex; align-items: center; gap: 4px;">
                            <i class="${pInfo.icon}"></i> ${pInfo.label}
                          </span>
                        </td>
                        <td style="padding: 10px 14px;">
                          <span style="background: #f5f5f4; color: #44403c; padding: 3px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; border: 1px solid #e7e5e4;">
                            ${l.status || 'New Lead'}
                          </span>
                        </td>
                        <td style="padding: 10px 14px; font-size: 0.78rem; color: #78716c;">${l.source || 'Direct'}</td>
                      </tr>
                    `;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <!-- Section Title: Site Visits -->
          ${staffVisits.length > 0 ? `
            <h3 style="font-size: 1rem; font-weight: 800; color: #1c1917; margin: 0 0 12px 0; display: flex; align-items: center; gap: 6px;">
              <i class="ri-calendar-check-line" style="color: #ea580c;"></i> Completed Site Visits (${staffVisits.length})
            </h3>
            <div style="border: 1px solid #e7e5e4; border-radius: 14px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead style="background: #fafaf9; border-bottom: 1px solid #e7e5e4;">
                  <tr>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Visit Date</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Client Name</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Property Title</th>
                    <th style="padding: 10px 14px; font-weight: 700; color: #57534e;">Status</th>
                  </tr>
                </thead>
                <tbody>
                  ${staffVisits.map(v => `
                    <tr style="border-bottom: 1px solid #f5f5f4;">
                      <td style="padding: 10px 14px; font-weight: 600; color: #1c1917;">${v.date ? new Date(v.date).toLocaleDateString('en-IN') : 'N/A'}</td>
                      <td style="padding: 10px 14px; font-weight: 700; color: #1c1917;">${v.clientName || v.name || 'Client'}</td>
                      <td style="padding: 10px 14px; color: #57534e;">${v.propertyTitle || v.property || 'Property Inquiry'}</td>
                      <td style="padding: 10px 14px;">
                        <span style="background: #dcfce7; color: #15803d; border: 1px solid #bbf7d0; padding: 2px 8px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;">
                          ${v.status || 'Scheduled'}
                        </span>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          ` : ''}

        </div>
      </div>
    </div>
  `;

  const container = document.createElement('div');
  container.innerHTML = modalHTML;
  document.body.appendChild(container.firstElementChild);

  const modalOverlay = document.getElementById('staff-detail-modal-overlay');
  const closeBtn = document.getElementById('modal-close-staff-detail');
  const csvBtn = document.getElementById('modal-download-staff-csv');

  const closeModal = () => {
    if (modalOverlay) {
      modalOverlay.style.opacity = '0';
      setTimeout(() => modalOverlay.remove(), 150);
    }
  };

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeModal();
    });
  }

  if (csvBtn) {
    csvBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const origHTML = csvBtn.innerHTML;
      csvBtn.innerHTML = `<i class="ri-loader-4-line ri-spin"></i> Exporting...`;
      csvBtn.disabled = true;

      try {
        exportIndividualStaffCSV(staffName, rawLeads, staffLeads, staffVisits);
      } catch (err) {
        console.error("Export Error:", err);
      } finally {
        setTimeout(() => {
          csvBtn.innerHTML = `<i class="ri-check-line"></i> Done!`;
          setTimeout(() => {
            csvBtn.innerHTML = origHTML;
            csvBtn.disabled = false;
          }, 1200);
        }, 300);
      }
    });
  }
}
