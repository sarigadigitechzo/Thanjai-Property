export function renderReportsView(fromDateStr, toDateStr) {
  // Determine dates
  let fromDate = fromDateStr ? new Date(fromDateStr) : new Date(new Date().getFullYear(), 0, 1);
  let toDate = toDateStr ? new Date(toDateStr) : new Date(new Date().getFullYear(), 11, 31);
  
  const fromValue = `${fromDate.getFullYear()}-${String(fromDate.getMonth() + 1).padStart(2, '0')}-${String(fromDate.getDate()).padStart(2, '0')}`;
  const toValue = `${toDate.getFullYear()}-${String(toDate.getMonth() + 1).padStart(2, '0')}-${String(toDate.getDate()).padStart(2, '0')}`;
  
  const toDateEnd = new Date(toDate);
  toDateEnd.setHours(23, 59, 59, 999);
  
  let allLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  
  const filteredLeads = allLeads.filter(l => {
     const leadTime = l.createdAt ? new Date(l.createdAt) : new Date('2026-01-01T00:00:00');
     return leadTime >= fromDate && leadTime <= toDateEnd;
  });

  // Analytics
  const sourceMap = {};
  const statusMap = {};
  const staffMap = {};
  let pipelineValue = 0;

  filteredLeads.forEach(l => {
    const src = l.source || 'Manual';
    sourceMap[src] = (sourceMap[src] || 0) + 1;
    
    const st = l.status || 'New';
    statusMap[st] = (statusMap[st] || 0) + 1;
    
    const staff = l.assignTo || 'Unassigned';
    if (!staffMap[staff]) staffMap[staff] = { total: 0, converted: 0 };
    staffMap[staff].total += 1;
    if (st === 'Registration' || st === 'Converted') staffMap[staff].converted += 1;
    
    if (l.budgetMax) {
       pipelineValue += parseInt(l.budgetMax.replace(/[^0-9]/g, '')) || 0;
    }
  });

  const sourceHTML = Object.entries(sourceMap)
    .sort((a,b) => b[1] - a[1])
    .map(([k, v]) => `<div class="report-list-item"><span>${k}</span><strong>${v}</strong></div>`)
    .join('') || '<div class="report-empty">No leads in this range</div>';

  const statusHTML = Object.entries(statusMap)
    .sort((a,b) => b[1] - a[1])
    .map(([k, v]) => `<div class="report-list-item"><span>${k}</span><strong>${v}</strong></div>`)
    .join('') || '<div class="report-empty">No leads in this range</div>';

  const staffHTML = Object.entries(staffMap)
    .sort((a,b) => b[1].total - a[1].total)
    .map(([k, v]) => {
      const convRate = v.total > 0 ? Math.round((v.converted / v.total) * 100) : 0;
      return `
        <tr>
          <td>${k}</td>
          <td class="right-align">${v.total}</td>
          <td class="right-align">${v.converted}</td>
          <td class="right-align">${convRate}%</td>
          <td class="right-align">-</td>
          <td class="right-align">-</td>
          <td class="right-align">-</td>
        </tr>
      `;
    }).join('') || '<tr><td colspan="7" class="report-empty" style="text-align:center; padding: 24px;">No leads found in this range</td></tr>';

  const formattedPipeline = '₹' + pipelineValue.toLocaleString('en-IN');

  const chartData = [
    { label: 'Jan', total: 60, converted: 22 },
    { label: 'Feb', total: 75, converted: 28 },
    { label: 'Mar', total: 85, converted: 35 },
    { label: 'Apr', total: 70, converted: 25 },
    { label: 'May', total: 90, converted: 40 },
    { label: 'Jun', total: 110, converted: 45 },
    { label: 'Jul', total: 95, converted: 38 },
    { label: 'Aug', total: 125, converted: 55 },
    { label: 'Sep', total: 40, converted: 12 },
    { label: 'Oct', total: 45, converted: 15 },
    { label: 'Nov', total: 55, converted: 18 },
    { label: 'Dec', total: 42, converted: 10 },
  ];
  const maxTotal = 150;
  const chartHTML = chartData.map((data, index) => {
    const totalHeight = (data.total / maxTotal) * 100;
    const convertedHeight = (data.converted / maxTotal) * 100;
    const delay = index * 0.05;
    return `
      <div class="os-bar-group">
        <div class="os-bar-tooltip">${data.total} Leads, ${data.converted} Converted</div>
        <div class="os-bars">
          <div class="os-bar total" style="height: ${totalHeight}%; animation-delay: ${delay}s;"></div>
          <div class="os-bar converted" style="height: ${convertedHeight}%; animation-delay: ${delay}s;"></div>
        </div>
        <span class="os-bar-label">${data.label}</span>
      </div>
    `;
  }).join('');

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
          <button class="os-btn-primary" id="btn-download-reports" style="background: var(--os-luxury-orange); border-color: var(--os-luxury-orange);">
            <i class="ri-download-2-line"></i> Download CSV
          </button>
        </div>
      </div>

      <!-- Main Chart Card -->
      <div class="report-card">
        <h2 class="report-card-title">Monthly leads (last 12 months)</h2>
        <div class="report-chart-area">
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
            <div class="legend-item"><div class="legend-dot total"></div> Total</div>
            <div class="legend-item"><div class="legend-dot converted"></div> Converted</div>
          </div>
          <div class="report-pipeline-value">
            Pipeline value (this period): <strong>${formattedPipeline}</strong>
          </div>
        </div>
      </div>

      <!-- 2-Column Leads Info -->
      <div class="report-grid-2">
        <!-- Leads by source -->
        <div class="report-card" style="margin-bottom:0;">
          <h2 class="report-card-title">Leads by source</h2>
          ${sourceHTML}
        </div>

        <!-- Leads by status -->
        <div class="report-card" style="margin-bottom:0;">
          <h2 class="report-card-title">Leads by status</h2>
          ${statusHTML}
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
            <tbody>
              ${staffHTML}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `;
}

export function initReportsView() {
  const fromInput = document.getElementById('reports-date-from');
  const toInput = document.getElementById('reports-date-to');
  const downloadBtn = document.getElementById('btn-download-reports');

  function reloadReports() {
    const from = fromInput.value;
    const to = toInput.value;
    const contentArea = document.getElementById('os-content');
    contentArea.innerHTML = renderReportsView(from, to);
    initReportsView(); // re-bind listeners
  }

  if (fromInput) fromInput.addEventListener('change', reloadReports);
  if (toInput) toInput.addEventListener('change', reloadReports);

  if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
      // Build a simple CSV based on current data
      let allLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      const fromDate = new Date(fromInput.value);
      const toDateEnd = new Date(toInput.value);
      toDateEnd.setHours(23, 59, 59, 999);

      const filtered = allLeads.filter(l => {
         const leadTime = l.createdAt ? new Date(l.createdAt) : new Date('2026-01-01T00:00:00');
         return leadTime >= fromDate && leadTime <= toDateEnd;
      });

      // CSV Header
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "ID,Date,Name,Mobile,Type,Budget,Source,Status,Assigned To\n";

      filtered.forEach(l => {
        const dateStr = l.createdAt ? new Date(l.createdAt).toLocaleDateString('en-IN') : '01/01/2026';
        // Escape fields to prevent comma issues
        const name = `"${l.name || ''}"`;
        const mobile = `"${l.mobile || ''}"`;
        const budget = `"${l.budgetMax || l.budgetMin || ''}"`;
        
        csvContent += `${l.id},${dateStr},${name},${mobile},${l.type || ''},${budget},${l.source || ''},${l.status || ''},${l.assignTo || ''}\n`;
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Thanjai_CRM_Report_${fromInput.value}_to_${toInput.value}.csv`);
      document.body.appendChild(link); // Required for FF
      link.click();
      document.body.removeChild(link);
    });
  }
}
