export function renderDashboardView() {
  return `
    <div class="view-enter">
      <!-- Luxury Hero -->
      <div class="os-hero">
        <div class="hero-text">
          <h1>Good Morning,<br/>Aishwarya</h1>
          <p>Here's what's happening across your business today.</p>
        </div>
        
        <div class="hero-ai-summary">
          <div class="ai-summary-title">
            <i class="ri-sparkling-line"></i> AI Morning Brief
          </div>
          <ul class="ai-summary-list">
            <li><i class="ri-fire-fill"></i> 3 high-priority follow-ups due</li>
            <li><i class="ri-time-line"></i> 2 registrations pending signatures</li>
            <li><i class="ri-vip-crown-line"></i> 1 hot lead ready for site visit</li>
          </ul>
        </div>
      </div>

      <!-- KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Total Leads</span>
            <div class="kpi-icon" style="background: rgba(247, 147, 26, 0.1); color: var(--os-luxury-orange);"><i class="ri-group-line"></i></div>
          </div>
          <div class="kpi-value">18</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> 12% this week</div>
        </div>
        
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Follow Ups</span>
            <div class="kpi-icon" style="background: rgba(216, 58, 46, 0.1); color: var(--os-rich-red);"><i class="ri-calendar-todo-line"></i></div>
          </div>
          <div class="kpi-value">11</div>
          <div class="kpi-trend neutral"><i class="ri-subtract-line"></i> Due today</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Conversion</span>
            <div class="kpi-icon" style="background: rgba(22, 163, 74, 0.1); color: #16A34A;"><i class="ri-line-chart-line"></i></div>
          </div>
          <div class="kpi-value">11.1%</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> 2.4% vs last mo</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">Shared Leads</span>
            <div class="kpi-icon" style="background: rgba(42, 24, 8, 0.05); color: var(--os-deep-brown);"><i class="ri-briefcase-4-line"></i></div>
          </div>
          <div class="kpi-value">8</div>
          <div class="kpi-trend neutral"><i class="ri-subtract-line"></i> Partner network</div>
        </div>
      </div>

      <!-- Mixed Layout: AI Insight + Charts -->
      <div class="dashboard-mixed-layout">
        <!-- Main Chart -->
        <div class="os-chart-card">
          <div class="os-chart-header">
            <i class="ri-filter-3-line"></i> Pipeline Funnel Overview
          </div>
          
          <div class="premium-bar-row">
            <div class="premium-bar-labels">
              <span>New Leads</span>
              <span>3</span>
            </div>
            <div class="premium-bar-track">
              <div class="premium-bar-fill" style="width: 100%;"></div>
            </div>
          </div>

          <div class="premium-bar-row">
            <div class="premium-bar-labels">
              <span>Follow Up Pending</span>
              <span>5</span>
            </div>
            <div class="premium-bar-track">
              <div class="premium-bar-fill" style="width: 80%;"></div>
            </div>
          </div>

          <div class="premium-bar-row">
            <div class="premium-bar-labels">
              <span>Site Visit Scheduled</span>
              <span>4</span>
            </div>
            <div class="premium-bar-track">
              <div class="premium-bar-fill" style="width: 60%;"></div>
            </div>
          </div>

          <div class="premium-bar-row">
            <div class="premium-bar-labels">
              <span>Registration</span>
              <span>2</span>
            </div>
            <div class="premium-bar-track">
              <div class="premium-bar-fill" style="width: 30%;"></div>
            </div>
          </div>
        </div>

        <!-- AI Insight -->
        <div class="ai-insight-card hover-lift">
          <h3><i class="ri-brain-line"></i> AI Business Intelligence</h3>
          <p>"3 leads are showing high buying signals and are likely to convert this week. Suggest scheduling site visits immediately."</p>
          <button>Take Action</button>
        </div>
      </div>
      
      <!-- Bottom Section -->
      <div class="os-chart-card">
        <div class="os-chart-header">
          <i class="ri-radar-line"></i> Leads by Source (Acquisition)
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 48px;">
          <div>
             <div class="premium-bar-row">
                <div class="premium-bar-labels">
                  <span>Manual Entry</span>
                  <span>11</span>
                </div>
                <div class="premium-bar-track">
                  <div class="premium-bar-fill" style="width: 100%;"></div>
                </div>
              </div>
              <div class="premium-bar-row">
                <div class="premium-bar-labels">
                  <span>WhatsApp</span>
                  <span>3</span>
                </div>
                <div class="premium-bar-track">
                  <div class="premium-bar-fill" style="width: 25%;"></div>
                </div>
              </div>
          </div>
          <div>
             <div class="premium-bar-row">
                <div class="premium-bar-labels">
                  <span>Website Form</span>
                  <span>3</span>
                </div>
                <div class="premium-bar-track">
                  <div class="premium-bar-fill" style="width: 25%;"></div>
                </div>
              </div>
              <div class="premium-bar-row">
                <div class="premium-bar-labels">
                  <span>Referral</span>
                  <span>1</span>
                </div>
                <div class="premium-bar-track">
                  <div class="premium-bar-fill" style="width: 8%;"></div>
                </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
