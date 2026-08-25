import { getProperties } from '../utils/propertiesStore.js';
import { getRegisteredUsers } from '../utils/userAuthStore.js';

export function renderDashboardView() {
  const activePropertiesCount = getProperties().length;
  const users = getRegisteredUsers();
  const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
  const totalLeads = leads.length;
  
  // Calculate new leads today
  const today = new Date().toISOString().split('T')[0];
  const newToday = leads.filter(l => l.date === today && l.status === 'new').length;


  // Pipeline Distribution
  const newCount = leads.filter(l => l.status?.toLowerCase() === 'new').length;
  const followUpCount = leads.filter(l => ['contacted', 'property shared', 'follow up'].includes(l.status?.toLowerCase())).length;
  const siteVisitCount = leads.filter(l => ['interested'].includes(l.status?.toLowerCase())).length;
  const regCount = leads.filter(l => ['negotiation', 'converted'].includes(l.status?.toLowerCase())).length;
  const pipeTotal = newCount + followUpCount + siteVisitCount + regCount || 1; // avoid division by 0

  const newPct = Math.round((newCount / pipeTotal) * 100);
  const fupPct = Math.round((followUpCount / pipeTotal) * 100);
  const svPct = Math.round((siteVisitCount / pipeTotal) * 100);
  const regPct = Math.round((regCount / pipeTotal) * 100);

  const flexNew = Math.max(newPct, 10);
  const flexFup = Math.max(fupPct, 10);
  const flexSv = Math.max(svPct, 10);
  const flexReg = Math.max(regPct, 10);

  const activeUser = JSON.parse(localStorage.getItem('thanjai_active_user')) || { fullName: 'Admin' };
  const firstName = (activeUser.fullName || activeUser.name || 'Admin').split(' ')[0];

  return `
    <div class="view-enter">
      <!-- Luxury Hero -->
      <div class="os-hero">
        <div class="hero-text">
          <h1>Good Morning,<br/>${firstName}</h1>
          <p>Here's what's happening across your business today.</p>
        </div>
        
        <div class="hero-ai-summary">
          <div class="ai-summary-title">
            <i class="ri-sparkling-line"></i> AI Morning Brief
          </div>
          <ul class="ai-summary-list">
            <li><i class="ri-fire-fill"></i> ${followUpCount} high-priority follow-ups due</li>
            <li><i class="ri-time-line"></i> ${regCount} registrations pending signatures</li>
            <li><i class="ri-vip-crown-line"></i> ${siteVisitCount} hot lead ready for site visit</li>
          </ul>
        </div>
      </div>

      <!-- 8 KPI Grid (2x4) Matching Reference Design -->
      <div class="kpi-grid">
        <!-- 1. TOTAL LEADS -->
        <div class="kpi-card clickable-kpi" data-route="#leads" title="Open CRM Pipeline">
          <div class="kpi-header">
            <span class="kpi-title">TOTAL LEADS</span>
            <div class="kpi-icon" style="background: #ebf8ff; color: #3182ce;"><i class="ri-user-line"></i></div>
          </div>
          <div class="kpi-value count-up">${totalLeads}</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> Live count</div>
        </div>

        <!-- 2. NEW TODAY -->
        <div class="kpi-card clickable-kpi" data-route="#leads" title="Open CRM Pipeline">
          <div class="kpi-header">
            <span class="kpi-title">NEW TODAY</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #319795;"><i class="ri-sparkling-fill"></i></div>
          </div>
          <div class="kpi-value count-up">${newToday}</div>
          <div class="kpi-trend neutral"><i class="ri-subtract-line"></i> Just arrived</div>
        </div>

        <!-- 3. FOLLOW-UPS DUE -->
        <div class="kpi-card clickable-kpi" data-route="#visits" title="Open Site Visits & Appointments">
          <div class="kpi-header">
            <span class="kpi-title">FOLLOW-UPS DUE</span>
            <div class="kpi-icon" style="background: #feebc8; color: #dd6b20;"><i class="ri-calendar-event-line"></i></div>
          </div>
          <div class="kpi-value count-up">${followUpCount}</div>
          <div class="kpi-trend neutral"><i class="ri-time-line"></i> today</div>
        </div>

        <!-- 4. CONVERSION RATE -->
        <div class="kpi-card clickable-kpi" data-route="#reports" title="Open Reports & Analytics">
          <div class="kpi-header">
            <span class="kpi-title">CONVERSION RATE</span>
            <div class="kpi-icon" style="background: #faf5ff; color: #805ad5;"><i class="ri-pie-chart-line"></i></div>
          </div>
          <div class="kpi-value">${totalLeads > 0 ? Math.round((regCount / totalLeads) * 100) : 0}%</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> based on data</div>
        </div>

        <!-- 5. PROPERTIES AVAILABLE -->
        <div class="kpi-card clickable-kpi" data-route="#properties" title="Open Properties Inventory">
          <div class="kpi-header">
            <span class="kpi-title">PROPERTIES AVAILABLE</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #00a3c4;"><i class="ri-building-line"></i></div>
          </div>
          <div class="kpi-value count-up">${activePropertiesCount}</div>
          <div class="kpi-trend up"><i class="ri-checkbox-circle-line"></i> Active inventory</div>
        </div>

        <!-- 6. SHARED TODAY -->
        <div class="kpi-card clickable-kpi" data-route="#whatsapp" title="Open WhatsApp Log">
          <div class="kpi-header">
            <span class="kpi-title">SHARED TODAY</span>
            <div class="kpi-icon" style="background: #ebf8ff; color: #4299e1;"><i class="ri-send-plane-line"></i></div>
          </div>
          <div class="kpi-value count-up">0</div>
          <div class="kpi-trend neutral"><i class="ri-whatsapp-line"></i> via WhatsApp</div>
        </div>

        <!-- 7. WHATSAPP SENT TODAY -->
        <div class="kpi-card clickable-kpi" data-route="#whatsapp" title="Open WhatsApp Log">
          <div class="kpi-header">
            <span class="kpi-title">WHATSAPP SENT TODAY</span>
            <div class="kpi-icon" style="background: #f0fff4; color: #38a169;"><i class="ri-whatsapp-line"></i></div>
          </div>
          <div class="kpi-value count-up">0</div>
          <div class="kpi-trend neutral"><i class="ri-chat-3-line"></i> Client logs</div>
        </div>

        <!-- 8. PARTNER-SHARED LEADS -->
        <div class="kpi-card clickable-kpi" data-route="#partners" title="Open Partner Network">
          <div class="kpi-header">
            <span class="kpi-title">PARTNER-SHARED LEADS</span>
            <div class="kpi-icon" style="background: #fff5f5; color: #d53f8c;"><i class="ri-briefcase-4-line"></i></div>
          </div>
          <div class="kpi-value count-up">0</div>
          <div class="kpi-trend neutral"><i class="ri-user-shared-line"></i> Partner network</div>
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
              <div class="pg-stage" style="flex: ${flexNew};" data-tooltip="New Leads • ${newPct}%">
                <div class="pg-val count-up">${newCount}</div>
                <div class="pg-node" style="border-color: var(--os-charcoal);"><div class="pg-inner" style="background: var(--os-charcoal);"></div></div>
                <div class="pg-label">New</div>
              </div>

              <div class="pg-stage ${fupPct > 0 ? 'pulse-highest' : ''}" style="flex: ${flexFup};" data-tooltip="Follow Up Pending • ${fupPct}%">
                <div class="pg-val count-up">${followUpCount}</div>
                <div class="pg-node" style="border-color: var(--os-deep-brown);"><div class="pg-inner" style="background: var(--os-deep-brown);"></div></div>
                <div class="pg-label">Follow Up</div>
              </div>

              <div class="pg-stage" style="flex: ${flexSv};" data-tooltip="Site Visit Scheduled • ${svPct}%">
                <div class="pg-val count-up">${siteVisitCount}</div>
                <div class="pg-node" style="border-color: var(--os-luxury-orange);"><div class="pg-inner" style="background: var(--os-luxury-orange);"></div></div>
                <div class="pg-label">Site Visit</div>
              </div>

              <div class="pg-stage" style="flex: ${flexReg};" data-tooltip="Registration • ${regPct}%">
                <div class="pg-val count-up">${regCount}</div>
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

      <!-- Registered Portal Users & Client Logins Table -->
      <div class="os-chart-card" style="margin-top: 32px;">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center;">
          <span><i class="ri-user-shared-line"></i> Registered Portal Users & Active Logins (${users.length})</span>
          <span style="font-size: 0.78rem; background: rgba(235,94,40,0.15); color: #eb5e28; padding: 4px 12px; border-radius: 20px; font-weight: 800;">
            Client Portal Synchronized
          </span>
        </div>
        
        <div class="table-responsive" style="margin-top: 16px;">
          <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem;">
            <thead>
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.08); text-transform: uppercase; font-size: 0.75rem; color: var(--os-gray-400);">
                <th style="padding: 12px 16px;">User ID</th>
                <th style="padding: 12px 16px;">Full Name</th>
                <th style="padding: 12px 16px;">Email Address</th>
                <th style="padding: 12px 16px;">Mobile Phone</th>
                <th style="padding: 12px 16px;">Account Role</th>
                <th style="padding: 12px 16px;">Listed Props</th>
                <th style="padding: 12px 16px;">OTP Verification</th>
              </tr>
            </thead>
            <tbody>
              ${users.map(u => `
                <tr style="border-bottom: 1px solid rgba(0,0,0,0.04);">
                  <td style="padding: 12px 16px; font-weight: 700; color: var(--os-luxury-orange);">${u.id}</td>
                  <td style="padding: 12px 16px; font-weight: 700;">${u.fullName}</td>
                  <td style="padding: 12px 16px;">${u.email}</td>
                  <td style="padding: 12px 16px;">${u.phone || 'N/A'}</td>
                  <td style="padding: 12px 16px;"><span class="os-badge" style="background: rgba(49,130,206,0.12); color: #3182ce; font-weight: 700; padding: 2px 8px; border-radius: 6px;">${u.role}</span></td>
                  <td style="padding: 12px 16px; font-weight: 700;">${u.propertiesCount || 0}</td>
                  <td style="padding: 12px 16px;"><span style="color: #38a169; font-weight: 800;"><i class="ri-checkbox-circle-fill"></i> ${u.status || 'Active'}</span></td>
                </tr>
              `).join('')}
            </tbody>
          </table>
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

export function initDashboardListeners() {
  document.querySelectorAll('.clickable-kpi').forEach(card => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const route = card.dataset.route;
      if (route) {
        window.location.hash = route;
      }
    });
  });
}
