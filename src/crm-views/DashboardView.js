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
        
        <!-- Pipeline Flow (Connected Capsules) -->
        <div class="os-chart-card">
          <div class="os-chart-header">
            <i class="ri-node-tree"></i> Pipeline Distribution
          </div>
          <p class="chart-subtext">Total active leads across all stages.</p>
          
          <div class="pipeline-flow-container">
            <div class="pipeline-laser"></div>
            
            <div class="pipeline-capsule" data-stage="new" data-tooltip="New Leads (3) • 21%">
              <div class="cap-bg" style="width: 21.4%;"></div>
              <div class="cap-content">
                <span class="cap-dot"></span>
                <span class="cap-title">New</span>
                <span class="cap-val">3</span>
              </div>
            </div>

            <div class="pipeline-capsule pulse-highest" data-stage="followup" data-tooltip="Follow Up (5) • 36%">
              <div class="cap-bg" style="width: 35.7%;"></div>
              <div class="cap-content">
                <span class="cap-dot"></span>
                <span class="cap-title">Follow Up</span>
                <span class="cap-val">5</span>
              </div>
            </div>

            <div class="pipeline-capsule" data-stage="visit" data-tooltip="Site Visit (4) • 29%">
              <div class="cap-bg" style="width: 28.6%;"></div>
              <div class="cap-content">
                <span class="cap-dot"></span>
                <span class="cap-title">Site Visit</span>
                <span class="cap-val">4</span>
              </div>
            </div>

            <div class="pipeline-capsule" data-stage="registration" data-tooltip="Registration (2) • 14%">
              <div class="cap-bg" style="width: 14.3%;"></div>
              <div class="cap-content">
                <span class="cap-dot"></span>
                <span class="cap-title">Register</span>
                <span class="cap-val">2</span>
              </div>
            </div>
          </div>
        </div>

        <!-- AI Insight -->
        <div class="ai-insight-card magnetic-hover">
          <div class="ai-amber-glow"></div>
          <h3 class="floating-text"><i class="ri-brain-line"></i> AI Business Intelligence</h3>
          <p class="fade-quote">"3 leads are showing high buying signals and are likely to convert this week. Suggest scheduling site visits immediately."</p>
          <button class="magnetic-btn">Take Action</button>
        </div>
      </div>
      
      <!-- Bottom Section: 3D Donut Chart -->
      <div class="os-chart-card">
        <div class="os-chart-header">
          <i class="ri-pie-chart-2-fill"></i> Leads by Source (Acquisition)
        </div>
        
        <div class="premium-donut-layout">
          <div class="donut-svg-wrapper">
            <!-- 3D effect shadow -->
            <div class="donut-shadow"></div>
            <svg viewBox="0 0 100 100" class="premium-donut">
              <!-- Empty Track -->
              <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" stroke-width="12"></circle>
              
              <!-- Manual Entry: 11 (61%) | Dasharray: ~153. Dashoffset: 251.2 - 153 = 98.2 -->
              <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-deep-brown)" stroke-width="12" 
                      stroke-dasharray="153.2 251.2" stroke-dashoffset="0" data-source="manual">
              </circle>
              
              <!-- WhatsApp: 3 (17%) | Dasharray: ~42.7. Offset: start at 153.2 -->
              <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-luxury-orange)" stroke-width="12" 
                      stroke-dasharray="42.7 251.2" stroke-dashoffset="-153.2" data-source="whatsapp">
              </circle>
              
              <!-- Website Form: 3 (17%) | Dasharray: ~42.7. Offset: start at 195.9 -->
              <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-charcoal)" stroke-width="12" 
                      stroke-dasharray="42.7 251.2" stroke-dashoffset="-195.9" data-source="website">
              </circle>

              <!-- Referral: 1 (5%) | Dasharray: ~12.6. Offset: start at 238.6 -->
              <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-rich-red)" stroke-width="12" 
                      stroke-dasharray="12.6 251.2" stroke-dashoffset="-238.6" data-source="referral">
              </circle>
            </svg>
            <div class="donut-center-info">
              <span class="dc-total count-up">18</span>
              <span class="dc-lbl">Total</span>
            </div>
          </div>

          <div class="donut-pill-legend">
            <div class="legend-pill" data-target="manual">
              <div class="lp-left">
                <span class="lp-dot" style="background: var(--os-deep-brown); box-shadow: 0 0 10px var(--os-deep-brown);"></span>
                <span class="lp-name">Manual Entry</span>
              </div>
              <div class="lp-right">
                <span class="lp-perc">61%</span>
                <span class="lp-badge count-up">11</span>
              </div>
            </div>
            
            <div class="legend-pill" data-target="whatsapp">
              <div class="lp-left">
                <span class="lp-dot" style="background: var(--os-luxury-orange); box-shadow: 0 0 10px var(--os-luxury-orange);"></span>
                <span class="lp-name">WhatsApp</span>
              </div>
              <div class="lp-right">
                <span class="lp-perc">17%</span>
                <span class="lp-badge count-up">3</span>
              </div>
            </div>

            <div class="legend-pill" data-target="website">
              <div class="lp-left">
                <span class="lp-dot" style="background: var(--os-charcoal); box-shadow: 0 0 10px var(--os-charcoal);"></span>
                <span class="lp-name">Website Form</span>
              </div>
              <div class="lp-right">
                <span class="lp-perc">17%</span>
                <span class="lp-badge count-up">3</span>
              </div>
            </div>

            <div class="legend-pill" data-target="referral">
              <div class="lp-left">
                <span class="lp-dot" style="background: var(--os-rich-red); box-shadow: 0 0 10px var(--os-rich-red);"></span>
                <span class="lp-name">Referral</span>
              </div>
              <div class="lp-right">
                <span class="lp-perc">5%</span>
                <span class="lp-badge count-up">1</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <script>
        setTimeout(() => {
          // Number Counter Animation
          document.querySelectorAll('.count-up').forEach(el => {
            const target = parseInt(el.innerText, 10);
            let count = 0;
            const speed = target / 30; // 30 frames
            const update = () => {
              count += speed;
              if(count < target) {
                el.innerText = Math.ceil(count);
                requestAnimationFrame(update);
              } else {
                el.innerText = target;
              }
            };
            update();
          });

          // SVG Donut Hover - Bring to Front
          document.querySelectorAll('.donut-slice').forEach(slice => {
            slice.addEventListener('mouseenter', function() {
              // Appending an existing child moves it to the end of the DOM order, bringing it to the front in SVG
              this.parentNode.appendChild(this);
            });
          });
        }, 500);
      </script>
    </div>
  `;
}
