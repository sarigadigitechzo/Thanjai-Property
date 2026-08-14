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
        
        <!-- Pipeline Graph Flow -->
        <div class="os-chart-card pipeline-card">
          <div class="os-chart-header">
            <i class="ri-node-tree"></i> Pipeline Distribution
          </div>
          <p class="chart-subtext">Total active leads across all stages.</p>
          
          <div class="pipeline-graph-wrapper">
            <div class="graph-grid"></div>
            
            <svg class="pipeline-connectors" preserveAspectRatio="none">
              <line x1="0" y1="50%" x2="100%" y2="50%" class="connector-base" />
              <line x1="0" y1="50%" x2="100%" y2="50%" class="connector-glow" />
            </svg>

            <div class="pipeline-stages">
              <div class="pg-stage" style="flex: 21.4;" data-tooltip="New Leads • 21%">
                <div class="pg-val count-up">3</div>
                <div class="pg-node" style="border-color: var(--os-charcoal);"><div class="pg-inner" style="background: var(--os-charcoal);"></div></div>
                <div class="pg-label">New</div>
              </div>

              <div class="pg-stage pulse-highest" style="flex: 35.7;" data-tooltip="Follow Up Pending • 36%">
                <div class="pg-val count-up">5</div>
                <div class="pg-node" style="border-color: var(--os-deep-brown);"><div class="pg-inner" style="background: var(--os-deep-brown);"></div></div>
                <div class="pg-label">Follow Up</div>
              </div>

              <div class="pg-stage" style="flex: 28.6;" data-tooltip="Site Visit Scheduled • 29%">
                <div class="pg-val count-up">4</div>
                <div class="pg-node" style="border-color: var(--os-luxury-orange);"><div class="pg-inner" style="background: var(--os-luxury-orange);"></div></div>
                <div class="pg-label">Site Visit</div>
              </div>

              <div class="pg-stage" style="flex: 14.3;" data-tooltip="Registration • 14%">
                <div class="pg-val count-up">2</div>
                <div class="pg-node" style="border-color: var(--os-rich-red);"><div class="pg-inner" style="background: var(--os-rich-red);"></div></div>
                <div class="pg-label">Register</div>
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
      
      <!-- Bottom Section: Leads by Source Split Layout -->
      <div class="os-chart-card">
        <div class="os-chart-header">
          <i class="ri-pie-chart-2-fill"></i> Leads by Source (Acquisition)
        </div>
        
        <div class="source-split-layout">
          <!-- LEFT: 3D Donut Chart -->
          <div class="source-left">
            <div class="donut-svg-wrapper">
              <div class="donut-shadow"></div>
              <svg viewBox="0 0 100 100" class="premium-donut">
                <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(0,0,0,0.03)" stroke-width="12"></circle>
                <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-deep-brown)" stroke-width="12" stroke-dasharray="153.2 251.2" stroke-dashoffset="0" data-tooltip="Manual: 11 (61%)" data-source="manual"></circle>
                <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-luxury-orange)" stroke-width="12" stroke-dasharray="42.7 251.2" stroke-dashoffset="-153.2" data-tooltip="WhatsApp: 3 (17%)" data-source="whatsapp"></circle>
                <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-gold)" stroke-width="12" stroke-dasharray="42.7 251.2" stroke-dashoffset="-195.9" data-tooltip="Website: 3 (17%)" data-source="website"></circle>
                <circle class="donut-slice" cx="50" cy="50" r="40" fill="none" stroke="var(--os-rich-red)" stroke-width="12" stroke-dasharray="12.6 251.2" stroke-dashoffset="-238.6" data-tooltip="Referral: 1 (5%)" data-source="referral"></circle>
              </svg>
              <div class="donut-center-info">
                <span class="dc-total count-up">18</span>
                <span class="dc-lbl">Total Leads</span>
              </div>
            </div>
          </div>

          <!-- RIGHT: Premium Glass Cards -->
          <div class="source-right">
            
            <div class="source-glass-card hover-lift" data-source="manual">
              <div class="sgc-header">
                <div class="sgc-title"><span class="sgc-dot" style="background: var(--os-deep-brown);"></span> Manual Entry</div>
                <div class="sgc-badge"><span class="count-up">11</span> Leads</div>
              </div>
              <div class="sgc-perc count-up">61%</div>
              <div class="sgc-track">
                <div class="sgc-fill" style="width: 61%; background: var(--os-deep-brown);"></div>
              </div>
            </div>

            <div class="source-glass-card hover-lift" data-source="whatsapp">
              <div class="sgc-header">
                <div class="sgc-title"><span class="sgc-dot" style="background: var(--os-luxury-orange);"></span> WhatsApp</div>
                <div class="sgc-badge"><span class="count-up">3</span> Leads</div>
              </div>
              <div class="sgc-perc count-up">17%</div>
              <div class="sgc-track">
                <div class="sgc-fill" style="width: 17%; background: var(--os-luxury-orange);"></div>
              </div>
            </div>

            <div class="source-glass-card hover-lift" data-source="website">
              <div class="sgc-header">
                <div class="sgc-title"><span class="sgc-dot" style="background: var(--os-gold);"></span> Website Form</div>
                <div class="sgc-badge"><span class="count-up">3</span> Leads</div>
              </div>
              <div class="sgc-perc count-up">17%</div>
              <div class="sgc-track">
                <div class="sgc-fill" style="width: 17%; background: var(--os-gold);"></div>
              </div>
            </div>

            <div class="source-glass-card hover-lift" data-source="referral">
              <div class="sgc-header">
                <div class="sgc-title"><span class="sgc-dot" style="background: var(--os-rich-red);"></span> Referral</div>
                <div class="sgc-badge"><span class="count-up">1</span> Leads</div>
              </div>
              <div class="sgc-perc count-up">5%</div>
              <div class="sgc-track">
                <div class="sgc-fill" style="width: 5%; background: var(--os-rich-red);"></div>
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

          // SVG Donut Hover - Bring to Front & Link Cards
          const donutWrapper = document.querySelector('.premium-donut');
          const slices = document.querySelectorAll('.donut-slice');
          const cards = document.querySelectorAll('.source-glass-card');
          
          slices.forEach(slice => {
            slice.addEventListener('mouseenter', function() {
              this.parentNode.appendChild(this);
              donutWrapper.classList.add('has-active');
              this.classList.add('is-active');
              const source = this.getAttribute('data-source');
              const card = document.querySelector('.source-glass-card[data-source="' + source + '"]');
              if (card) card.classList.add('is-active');
            });
            slice.addEventListener('mouseleave', function() {
              donutWrapper.classList.remove('has-active');
              this.classList.remove('is-active');
              const source = this.getAttribute('data-source');
              const card = document.querySelector('.source-glass-card[data-source="' + source + '"]');
              if (card) card.classList.remove('is-active');
            });
          });

          cards.forEach(card => {
            card.addEventListener('mouseenter', function() {
              const source = this.getAttribute('data-source');
              const slice = document.querySelector('.donut-slice[data-source="' + source + '"]');
              if (slice) {
                slice.parentNode.appendChild(slice);
                slice.classList.add('is-active');
                donutWrapper.classList.add('has-active');
              }
              this.classList.add('is-active');
            });
            card.addEventListener('mouseleave', function() {
              const source = this.getAttribute('data-source');
              const slice = document.querySelector('.donut-slice[data-source="' + source + '"]');
              if (slice) slice.classList.remove('is-active');
              donutWrapper.classList.remove('has-active');
              this.classList.remove('is-active');
            });
          });
        }, 500);
      </script>
    </div>
  `;
}
