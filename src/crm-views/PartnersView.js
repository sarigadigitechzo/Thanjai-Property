export function renderPartnersView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Partner Network</h1>
          <p class="view-subtitle">Manage shared leads and partner performance.</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary"><i class="ri-user-add-line"></i> Invite Partner</button>
        </div>
      </div>

      <div class="partner-grid">
        <!-- Partner 1 -->
        <div class="partner-lux-card hover-lift">
          <div class="p-card-header">
            <div class="p-brand">
              <div class="p-logo">CP</div>
              <div>
                <div class="p-company">Chennai Prime Realty</div>
                <div class="p-type">Premium Partner</div>
              </div>
            </div>
            <div class="p-menu"><i class="ri-more-2-fill"></i></div>
          </div>
          
          <div class="p-metrics">
            <div class="p-metric">
              <div class="p-val">12</div>
              <div class="p-lbl">Shared Leads</div>
            </div>
            <div class="p-metric">
              <div class="p-val">3</div>
              <div class="p-lbl">Converted</div>
            </div>
            <div class="p-metric">
              <div class="p-val" style="color:var(--os-luxury-orange);">₹1.2Cr</div>
              <div class="p-lbl">Revenue</div>
            </div>
          </div>

          <div class="p-recent">
            <div class="p-recent-title">Recent Shared Leads</div>
            <div class="p-lead-item">
              <div>
                <div class="p-lead-name">Karthikeyan V G</div>
                <div class="p-lead-meta">Plot &middot; Madurai</div>
              </div>
              <span class="status-tag available">Shared</span>
            </div>
            <div class="p-lead-item">
              <div>
                <div class="p-lead-name">Rajesh Annamalai</div>
                <div class="p-lead-meta">Townhouse &middot; Coimbatore</div>
              </div>
              <span class="status-tag booked" style="background: rgba(37, 99, 235, 0.9);">In Progress</span>
            </div>
          </div>

          <div class="p-contact">
            <div class="p-poc">
              <img src="https://ui-avatars.com/api/?name=Senthil+Kumar&background=random" />
              <span>Senthil Kumar</span>
            </div>
            <button class="p-btn"><i class="ri-mail-send-line"></i></button>
          </div>
        </div>

        <!-- Partner 2 -->
        <div class="partner-lux-card hover-lift">
          <div class="p-card-header">
            <div class="p-brand">
              <div class="p-logo" style="background:#f3e8ff; color:#a855f7;">MM</div>
              <div>
                <div class="p-company">Madurai Metro Homes</div>
                <div class="p-type">Standard Partner</div>
              </div>
            </div>
            <div class="p-menu"><i class="ri-more-2-fill"></i></div>
          </div>
          
          <div class="p-metrics">
            <div class="p-metric">
              <div class="p-val">5</div>
              <div class="p-lbl">Shared Leads</div>
            </div>
            <div class="p-metric">
              <div class="p-val">0</div>
              <div class="p-lbl">Converted</div>
            </div>
            <div class="p-metric">
              <div class="p-val" style="color:var(--os-luxury-orange);">₹0</div>
              <div class="p-lbl">Revenue</div>
            </div>
          </div>

          <div class="p-recent">
             <div class="k-empty" style="padding: 16px;">No recent activity</div>
          </div>

          <div class="p-contact">
            <div class="p-poc">
              <img src="https://ui-avatars.com/api/?name=Anita+Raj&background=random" />
              <span>Anita Raj</span>
            </div>
            <button class="p-btn"><i class="ri-mail-send-line"></i></button>
          </div>
        </div>

      </div>
    </div>
  `;
}
