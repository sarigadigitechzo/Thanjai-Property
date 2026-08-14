export function renderLeadsView() {
  return `
    <div class="view-enter">
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">CRM Pipeline</h1>
          <p class="view-subtitle">Drag and drop leads across stages to track conversion.</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary"><i class="ri-add-line"></i> New Lead</button>
          <button class="os-btn-secondary"><i class="ri-download-cloud-2-line"></i> Import CSV</button>
        </div>
      </div>

      <!-- Filters -->
      <div class="os-filter-bar">
        <div class="search-box">
          <i class="ri-search-line"></i>
          <input type="text" placeholder="Search leads by name, phone..." />
        </div>
        <div class="filter-dropdowns">
          <select><option>All Property Types</option></select>
          <select><option>All Executives</option></select>
          <label class="filter-toggle">
            <input type="checkbox" /> <span>High Priority</span>
          </label>
        </div>
      </div>

      <!-- Kanban Board -->
      <div class="kanban-board">
        
        <!-- Column 1 -->
        <div class="kanban-column">
          <div class="kanban-header">
            <div class="kanban-title">New Lead <span class="count">3</span></div>
          </div>
          <div class="kanban-cards">
            <!-- Card 1 -->
            <div class="kanban-card hover-lift">
              <div class="k-card-header">
                <div class="k-user">
                  <div class="k-avatar" style="background:#fce7f3; color:#ec4899;">RJ</div>
                  <div class="k-info">
                    <div class="k-name">Rajesh Annamalai</div>
                    <div class="k-budget">₹1.4 Cr</div>
                  </div>
                </div>
                <div class="k-menu"><i class="ri-more-fill"></i></div>
              </div>
              <div class="k-tags">
                <span class="k-tag"><i class="ri-home-4-line"></i> Townhouse</span>
                <span class="k-tag"><i class="ri-map-pin-line"></i> Saravanampatti</span>
              </div>
              <div class="k-footer">
                <div class="k-exec"><img src="https://ui-avatars.com/api/?name=Kavitha+Murugan&background=random" /> Kavitha M.</div>
                <div class="k-task urgent"><i class="ri-phone-line"></i> Call ASAP</div>
              </div>
            </div>
            <!-- Card 2 -->
             <div class="kanban-card hover-lift">
              <div class="k-card-header">
                <div class="k-user">
                  <div class="k-avatar" style="background:#e0e7ff; color:#6366f1;">SM</div>
                  <div class="k-info">
                    <div class="k-name">Suresh Menon</div>
                    <div class="k-budget">₹80L</div>
                  </div>
                </div>
                <div class="k-menu"><i class="ri-more-fill"></i></div>
              </div>
              <div class="k-tags">
                <span class="k-tag"><i class="ri-building-line"></i> Apartment</span>
              </div>
              <div class="k-footer">
                <div class="k-exec"><img src="https://ui-avatars.com/api/?name=Arun+Prakash&background=random" /> Arun P.</div>
                <div class="k-task"><i class="ri-mail-send-line"></i> Send intro</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 2 -->
        <div class="kanban-column">
          <div class="kanban-header">
            <div class="kanban-title">Contacted <span class="count">5</span></div>
          </div>
          <div class="kanban-cards">
             <!-- Card 1 -->
            <div class="kanban-card hover-lift">
              <div class="k-card-header">
                <div class="k-user">
                  <div class="k-avatar" style="background:#dcfce7; color:#22c55e;">VG</div>
                  <div class="k-info">
                    <div class="k-name">Karthikeyan V G</div>
                    <div class="k-budget">₹1.1L</div>
                  </div>
                </div>
                <div class="k-menu"><i class="ri-more-fill"></i></div>
              </div>
              <div class="k-tags">
                <span class="k-tag"><i class="ri-landscape-line"></i> Plot</span>
                <span class="k-tag"><i class="ri-map-pin-line"></i> Madurai</span>
              </div>
              <div class="k-footer">
                <div class="k-exec"><img src="https://ui-avatars.com/api/?name=Arun+Prakash&background=random" /> Arun P.</div>
                <div class="k-task"><i class="ri-whatsapp-line"></i> Waiting reply</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Column 3 -->
        <div class="kanban-column">
          <div class="kanban-header">
            <div class="kanban-title">Property Shared <span class="count">3</span></div>
          </div>
          <div class="kanban-cards">
            <!-- Empty state for demo -->
            <div class="k-empty">Drop leads here</div>
          </div>
        </div>

        <!-- Column 4 -->
        <div class="kanban-column">
          <div class="kanban-header">
            <div class="kanban-title">Site Visit <span class="count">4</span></div>
          </div>
          <div class="kanban-cards">
             <div class="k-empty">Drop leads here</div>
          </div>
        </div>
        
        <!-- Column 5 -->
        <div class="kanban-column">
          <div class="kanban-header">
            <div class="kanban-title">Negotiation <span class="count">1</span></div>
          </div>
          <div class="kanban-cards">
             <div class="k-empty">Drop leads here</div>
          </div>
        </div>
        
        <!-- Column 6 -->
        <div class="kanban-column">
          <div class="kanban-header">
            <div class="kanban-title">Registration <span class="count">2</span></div>
          </div>
          <div class="kanban-cards">
             <div class="k-empty">Drop leads here</div>
          </div>
        </div>

      </div>
    </div>
  `;
}
