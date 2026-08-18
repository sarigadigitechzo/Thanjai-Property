export function renderReportsView() {
  const chartData = [
    { label: 'Sep', total: 40, converted: 12 },
    { label: 'Oct', total: 45, converted: 15 },
    { label: 'Nov', total: 55, converted: 18 },
    { label: 'Dec', total: 42, converted: 10 },
    { label: 'Jan', total: 60, converted: 22 },
    { label: 'Feb', total: 75, converted: 28 },
    { label: 'Mar', total: 85, converted: 35 },
    { label: 'Apr', total: 70, converted: 25 },
    { label: 'May', total: 90, converted: 40 },
    { label: 'Jun', total: 110, converted: 45 },
    { label: 'Jul', total: 95, converted: 38 },
    { label: 'Aug', total: 125, converted: 55 },
  ];

  const maxTotal = 150; // To scale heights
  const chartHTML = chartData.map((data, index) => {
    const totalHeight = (data.total / maxTotal) * 100;
    const convertedHeight = (data.converted / maxTotal) * 100;
    // Add staggered delay for animation
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
        <div class="reports-date-pickers">
          <div class="reports-date-input">
            <div class="reports-date-box">
              <span>dd-mm-yyyy</span>
              <i class="ri-calendar-line"></i>
            </div>
          </div>
          <div class="reports-date-input">
            <span style="font-size:0.85rem; color:var(--os-gray-500); margin-right:4px;">to</span>
            <div class="reports-date-box">
              <span>dd-mm-yyyy</span>
              <i class="ri-calendar-line"></i>
            </div>
          </div>
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
            Pipeline value (this period's budgets): <strong>10,71,35,000</strong>
          </div>
        </div>
      </div>

      <!-- 2-Column Leads Info -->
      <div class="report-grid-2">
        <!-- Leads by source -->
        <div class="report-card" style="margin-bottom:0;">
          <h2 class="report-card-title">Leads by source</h2>
          <div class="report-list-item">
            <span>Referral</span>
            <strong>1</strong>
          </div>
          <div class="report-list-item">
            <span>Whatsapp</span>
            <strong>3</strong>
          </div>
          <div class="report-list-item">
            <span>Manual</span>
            <strong>11</strong>
          </div>
          <div class="report-list-item">
            <span>Website Form</span>
            <strong>3</strong>
          </div>
        </div>

        <!-- Leads by status -->
        <div class="report-card" style="margin-bottom:0;">
          <h2 class="report-card-title">Leads by status</h2>
          <div class="report-list-item">
            <span>Contacted</span>
            <strong>1</strong>
          </div>
          <div class="report-list-item">
            <span>New</span>
            <strong>1</strong>
          </div>
          <div class="report-list-item">
            <span>Property Shared</span>
            <strong>3</strong>
          </div>
          <div class="report-list-item">
            <span>Converted</span>
            <strong>2</strong>
          </div>
          <div class="report-list-item">
            <span>Follow Up</span>
            <strong>5</strong>
          </div>
          <div class="report-list-item">
            <span>Negotiation</span>
            <strong>1</strong>
          </div>
          <div class="report-list-item">
            <span>Interested</span>
            <strong>5</strong>
          </div>
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
              <tr>
                <td>Kavitha Murugan</td>
                <td class="right-align">5</td>
                <td class="right-align">1</td>
                <td class="right-align">20%</td>
                <td class="right-align">0</td>
                <td class="right-align">1</td>
                <td class="right-align">0</td>
              </tr>
              <tr>
                <td>Vikram Subramanian</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
              </tr>
              <tr>
                <td>Udhay</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Partner company performance -->
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
            <tbody>
              <tr>
                <td>IUCS</td>
                <td class="right-align">3</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="status-breakdown">Shared: 3</td>
              </tr>
              <tr>
                <td>Chennai Prime Realty</td>
                <td class="right-align">2</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="status-breakdown">Shared: 1 · In Progress: 1</td>
              </tr>
              <tr>
                <td>digitechzo</td>
                <td class="right-align">2</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="status-breakdown">Shared: 2</td>
              </tr>
              <tr>
                <td>Kovai Homes & Plots</td>
                <td class="right-align">1</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="status-breakdown">Shared: 1</td>
              </tr>
              <tr>
                <td>fvghg</td>
                <td class="right-align">0</td>
                <td class="right-align">0</td>
                <td class="right-align">0%</td>
                <td class="status-breakdown">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Buyer behavior -->
      <div class="report-card">
        <h2 class="report-card-title">Buyer behavior</h2>
        <div class="buyer-stats-grid">
          <div class="buyer-stat-box">
            <div class="buyer-stat-value">1</div>
            <div class="buyer-stat-label">Repeat inquirers</div>
          </div>
          <div class="buyer-stat-box">
            <div class="buyer-stat-value">2</div>
            <div class="buyer-stat-label">Converted leads</div>
          </div>
          <div class="buyer-stat-box">
            <div class="buyer-stat-value">20d</div>
            <div class="buyer-stat-label">Avg. decision time</div>
          </div>
          <div class="buyer-stat-box">
            <div class="buyer-stat-value">0.5</div>
            <div class="buyer-stat-label">Avg. shortlist size</div>
          </div>
        </div>
      </div>

      <!-- Property engagement -->
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
            <tbody>
              <tr>
                <td>Plot for sale in Thanjavur</td>
                <td class="sub-text">Nanjikottai road</td>
                <td class="sub-text">Available</td>
                <td class="right-align">20</td>
                <td class="right-align">3</td>
              </tr>
              <tr>
                <td>Thanjavur plot for sale in pudhukottai road<br>chaithanya school near thantraj nagar</td>
                <td class="sub-text">https://maps.app.goo.gl/9jef6YBCXrd4y798</td>
                <td class="sub-text">Available</td>
                <td class="right-align">17</td>
                <td class="right-align">0</td>
              </tr>
              <tr>
                <td>JC Appartment</td>
                <td class="sub-text">Chennai</td>
                <td class="sub-text">Booked</td>
                <td class="right-align">10</td>
                <td class="right-align">1</td>
              </tr>
              <tr>
                <td>4BHK Independent Villa, ECR — Sea Breeze</td>
                <td class="sub-text">ECR, Chennai</td>
                <td class="sub-text">Available</td>
                <td class="right-align">4</td>
                <td class="right-align">1</td>
              </tr>
              <tr>
                <td>Studio Apartment, OMR Sholinganallur —<br>Furnished</td>
                <td class="sub-text">Sholinganallur, Chennai</td>
                <td class="sub-text">Available</td>
                <td class="right-align">3</td>
                <td class="right-align">1</td>
              </tr>
              <tr>
                <td>2BHK Apartment, Velachery — Near IT Corridor</td>
                <td class="sub-text">Velachery, Chennai</td>
                <td class="sub-text">Available</td>
                <td class="right-align">2</td>
                <td class="right-align">0</td>
              </tr>
              <tr>
                <td>3BHK Villa, Coimbatore Saravanampatti — Gated<br>Community</td>
                <td class="sub-text">Saravanampatti, Coimbatore</td>
                <td class="sub-text">Available</td>
                <td class="right-align">2</td>
                <td class="right-align">1</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Recently lost leads -->
      <div class="report-card">
        <h2 class="report-card-title">Recently lost leads</h2>
        <div class="report-empty">
          No lost leads in this range.
        </div>
      </div>

    </div>
  `;
}

export function initReportsView() {
  // Any initialization logic can go here (e.g. binding date pickers)
}
