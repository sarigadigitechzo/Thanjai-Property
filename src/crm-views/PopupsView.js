import { getPopups, addPopup, updatePopup, deletePopup, initPopupsStore } from '../utils/popupsStore.js';
import { showToast, showAlertModal, showConfirmModal } from '../utils/toast.js';

export function renderPopupsView() {
  const popups = getPopups();
  const activeCount = popups.filter(p => p.status === 'Active').length;
  const festivalCount = popups.filter(p => p.type === 'festival').length;
  const adCount = popups.filter(p => p.type === 'ad_offer' || p.type === 'project_launch').length;

  return `
    <div class="view-enter">
      <!-- Header -->
      <div class="view-header-flex">
        <div>
          <h1 class="view-title">Ad & Seasonal Festival Popups</h1>
          <p class="view-subtitle">Create and schedule festival deals, promotional announcement banners, and lead generation popups for your website.</p>
        </div>
        <div class="header-actions-right">
          <button class="os-btn-primary" id="btn-create-popup">
            <i class="ri-add-line"></i> Create New Popup
          </button>
        </div>
      </div>

      <!-- KPI Summary Cards -->
      <div class="os-kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div class="os-kpi-card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--os-border-color, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Total Popups</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #fff7ed; color: #ea580c; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-advertisement-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 10px;" id="kpi-total-popups">${popups.length}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Created banners in library</span>
        </div>

        <div class="os-kpi-card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--os-border-color, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Active on Website</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-checkbox-circle-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; margin-top: 10px;" id="kpi-active-popups">${activeCount}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Currently live to visitors</span>
        </div>

        <div class="os-kpi-card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--os-border-color, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Festival & Seasonal</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #fdf4ff; color: #c026d3; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-sparkling-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 10px;">${festivalCount}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Pongal, Diwali & Special Days</span>
        </div>

        <div class="os-kpi-card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--os-border-color, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Ad & Property Deals</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-fire-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 10px;">${adCount}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Project launches & flash deals</span>
        </div>
      </div>

      <!-- Filter Tabs & Controls -->
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="popup-filter-tabs">
          <button class="os-tab-btn active" data-filter="all" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #eb5e28; color: #fff; border: none;">All Popups (${popups.length})</button>
          <button class="os-tab-btn" data-filter="active" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">Active Only (${activeCount})</button>
          <button class="os-tab-btn" data-filter="festival" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">Festival & Seasonal</button>
          <button class="os-tab-btn" data-filter="ad_offer" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">Ad Offers</button>
        </div>

        <div style="display: flex; align-items: center; gap: 8px; background: #fff; padding: 6px 14px; border-radius: 8px; border: 1px solid #cbd5e1;">
          <i class="ri-search-line" style="color: #94a3b8;"></i>
          <input type="text" id="popup-search-input" placeholder="Search popups..." style="border: none; outline: none; font-size: 0.88rem; width: 200px;" />
        </div>
      </div>

      <!-- Popups Grid -->
      <div id="popups-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 20px;">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- Create / Edit Popup Modal -->
    <div class="os-modal-overlay" id="popup-editor-modal" style="display: none; align-items: center; justify-content: center; z-index: 9999; background: rgba(15, 23, 42, 0.7); backdrop-filter: blur(4px);">
      <div class="os-modal-card" style="max-width: 900px; width: 95%; max-height: 90vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 16px; background: #ffffff; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
        
        <div class="os-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #e2e8f0;">
          <div>
            <h2 id="popup-modal-heading" style="font-size: 1.25rem; font-weight: 800; color: #0f172a; margin: 0;">Create Promotional Popup</h2>
            <p style="font-size: 0.8rem; color: #64748b; margin: 2px 0 0 0;">Customize the banner visuals, highlights, scheduling, and WhatsApp CTA button.</p>
          </div>
          <button class="os-modal-close" id="close-popup-modal-btn" style="background: none; border: none; font-size: 1.4rem; color: #64748b; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>

        <div class="os-modal-body" style="padding: 24px; overflow-y: auto; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 24px;">
          <!-- Left Column: Form Inputs -->
          <div style="display: flex; flex-direction: column; gap: 16px;">
            <input type="hidden" id="edit-popup-id" value="" />

            <div class="form-group">
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Popup Title *</label>
              <input type="text" id="popup-input-title" class="os-input" placeholder="e.g. 🌾 Grand Pongal Property Mela 2026" style="width: 100%;" required />
            </div>

            <div class="form-group">
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Subtitle / Description</label>
              <textarea id="popup-input-subtitle" class="os-input" rows="2" placeholder="Brief 1-2 line description of this offer or announcement..." style="width: 100%; resize: vertical;"></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Category / Type</label>
                <select id="popup-input-type" class="os-input" style="width: 100%; cursor: pointer;">
                  <option value="festival">🌾 Festival & Seasonal</option>
                  <option value="ad_offer">⚡ Property Ad / Flash Deal</option>
                  <option value="project_launch">🏗️ New Project Launch</option>
                  <option value="announcement">📢 General Announcement</option>
                </select>
              </div>

              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Badge Tag Text</label>
                <input type="text" id="popup-input-badge" class="os-input" placeholder="e.g. 🎉 FESTIVE OFFER" value="🎉 FESTIVE OFFER" style="width: 100%;" />
              </div>
            </div>

            <div class="form-group">
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Banner Poster Image URL</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="popup-input-image" class="os-input" placeholder="https://..." style="flex: 1;" />
                <label style="padding: 9px 14px; background: #f1f5f9; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 4px;">
                  <i class="ri-upload-2-line"></i> Upload
                  <input type="file" id="popup-image-file-input" accept="image/*" style="display: none;" />
                </label>
              </div>
            </div>

            <div class="form-group">
              <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Key Highlights (1 point per line)</label>
              <textarea id="popup-input-highlights" class="os-input" rows="3" placeholder="Spot Patta Transfer & 0% Brokerage&#10;Ready for immediate villa construction&#10;Special ₹50,000 spot booking cashback" style="width: 100%; font-family: monospace; font-size: 0.85rem;"></textarea>
            </div>

            <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">CTA Button Text</label>
                <input type="text" id="popup-input-cta-text" class="os-input" value="Claim Festive Offer on WhatsApp" style="width: 100%;" />
              </div>

              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">CTA Action</label>
                <select id="popup-input-cta-type" class="os-input" style="width: 100%;">
                  <option value="whatsapp">💬 Open WhatsApp</option>
                  <option value="site_visit">📅 Book Site Visit</option>
                  <option value="call">📞 Phone Call</option>
                  <option value="link">🔗 Open Custom Link</option>
                </select>
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Start Date (Optional)</label>
                <input type="date" id="popup-input-start-date" class="os-input" style="width: 100%;" />
              </div>

              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">End Date (Optional)</label>
                <input type="date" id="popup-input-end-date" class="os-input" style="width: 100%;" />
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Display Delay</label>
                <select id="popup-input-delay" class="os-input" style="width: 100%;">
                  <option value="2">2 seconds after page load</option>
                  <option value="3" selected>3 seconds (Recommended)</option>
                  <option value="5">5 seconds after page load</option>
                  <option value="8">8 seconds</option>
                </select>
              </div>

              <div class="form-group">
                <label style="font-size: 0.82rem; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Status</label>
                <select id="popup-input-status" class="os-input" style="width: 100%;">
                  <option value="Active">🟢 Active (Live)</option>
                  <option value="Inactive">⚪ Inactive (Draft / Paused)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Right Column: Realtime Visual Live Preview -->
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; display: flex; flex-direction: column; align-items: center;">
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 0.78rem; font-weight: 800; color: #64748b; text-transform: uppercase;">Live Realtime Preview</span>
              <span style="font-size: 0.74rem; background: #e0f2fe; color: #0284c7; padding: 2px 8px; border-radius: 6px; font-weight: 700;">Front-End View</span>
            </div>

            <!-- The Preview Card -->
            <div id="popup-live-preview-box" style="width: 100%; max-width: 360px; background: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; position: relative;">
              <!-- Image Banner with Badge -->
              <div style="position: relative; height: 160px; background: #1e293b; overflow: hidden;">
                <img id="preview-img" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
                <span id="preview-badge" style="position: absolute; top: 12px; left: 12px; background: #eb5e28; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; box-shadow: 0 2px 6px rgba(235,94,40,0.4); text-transform: uppercase;">
                  🎉 FESTIVE OFFER
                </span>
                <span style="position: absolute; top: 10px; right: 10px; width: 26px; height: 26px; border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.9rem;">
                  ✕
                </span>
              </div>

              <!-- Card Content -->
              <div style="padding: 18px 20px;">
                <h3 id="preview-title" style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.3;">🌾 Grand Festive Property Mela 2026</h3>
                <p id="preview-subtitle" style="font-size: 0.8rem; color: #64748b; margin: 0 0 12px 0; line-height: 1.4;">Special limited-time booking discount on DTCP & RERA approved residential plots in Thanjavur & Trichy Road.</p>
                
                <div id="preview-highlights-list" style="display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px;">
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #334155;">
                    <i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> <span>Spot Patta Transfer & 0% Brokerage</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #334155;">
                    <i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> <span>Ready for immediate villa construction</span>
                  </div>
                </div>

                <button id="preview-cta-btn" style="width: 100%; background: #eb5e28; color: #fff; border: none; padding: 10px 16px; border-radius: 10px; font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 6px; cursor: pointer; box-shadow: 0 4px 12px rgba(235,94,40,0.3);">
                  <i class="ri-whatsapp-fill"></i> <span id="preview-cta-text">Claim Festive Offer on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="os-modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; padding: 16px 24px; border-top: 1px solid #e2e8f0; background: #f8fafc;">
          <button class="os-btn-secondary" id="cancel-popup-modal-btn">Cancel</button>
          <button class="os-btn-primary" id="save-popup-modal-btn" style="background: #eb5e28; border-color: #eb5e28; color: #fff;">
            <i class="ri-save-line"></i> Save & Publish Popup
          </button>
        </div>

      </div>
    </div>
  `;
}

export function initPopupsView() {
  const container = document.getElementById('popups-grid-container');
  const searchInput = document.getElementById('popup-search-input');
  const filterTabs = document.querySelectorAll('#popup-filter-tabs .os-tab-btn');
  let currentFilter = 'all';

  const renderGrid = () => {
    if (!container) return;
    const popups = getPopups();
    const query = (searchInput?.value || '').toLowerCase().trim();

    let filtered = popups.filter(p => {
      if (currentFilter === 'active' && p.status !== 'Active') return false;
      if (currentFilter === 'festival' && p.type !== 'festival') return false;
      if (currentFilter === 'ad_offer' && p.type !== 'ad_offer' && p.type !== 'project_launch') return false;

      if (query) {
        return (p.title || '').toLowerCase().includes(query) ||
               (p.subtitle || '').toLowerCase().includes(query) ||
               (p.badge || '').toLowerCase().includes(query);
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: #fff; border-radius: 12px; border: 1px dashed #cbd5e1;">
          <i class="ri-advertisement-line" style="font-size: 3rem; color: #94a3b8; display: block; margin-bottom: 12px;"></i>
          <h3 style="font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 6px 0;">No popups found</h3>
          <p style="font-size: 0.85rem; color: #64748b; margin: 0 0 16px 0;">Create a festive offer or property deal popup to engage website visitors.</p>
          <button class="os-btn-primary" id="empty-create-popup-btn"><i class="ri-add-line"></i> Create First Popup</button>
        </div>
      `;
      document.getElementById('empty-create-popup-btn')?.addEventListener('click', openCreateModal);
      return;
    }

    container.innerHTML = filtered.map(p => {
      const isActive = p.status === 'Active';
      const highlights = Array.isArray(p.highlights) ? p.highlights : [];
      const imageSrc = p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

      return `
        <div class="popup-card hover-lift" style="background: #ffffff; border-radius: 14px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
          
          <!-- Card Thumbnail -->
          <div style="position: relative; height: 160px; background: #0f172a; overflow: hidden;">
            <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 12px; left: 12px; background: #eb5e28; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.2);">
              ${p.badge || 'OFFER'}
            </span>
            <div style="position: absolute; top: 12px; right: 12px; background: ${isActive ? '#10b981' : '#64748b'}; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">
              ${isActive ? '🟢 LIVE' : '⚪ PAUSED'}
            </div>
          </div>

          <!-- Card Body -->
          <div style="padding: 18px; flex: 1; display: flex; flex-direction: column;">
            <h3 style="font-size: 1.05rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.3;">${p.title}</h3>
            <p style="font-size: 0.82rem; color: #64748b; margin: 0 0 12px 0; line-height: 1.4; flex: 1;">${p.subtitle || 'No description'}</p>

            <!-- Highlights -->
            ${highlights.length > 0 ? `
              <div style="background: #f8fafc; border-radius: 8px; padding: 10px; margin-bottom: 14px; font-size: 0.78rem; color: #334155; display: flex; flex-direction: column; gap: 4px;">
                ${highlights.slice(0, 2).map(h => `<div style="display: flex; align-items: center; gap: 6px;"><i class="ri-check-line" style="color: #10b981; font-weight: bold;"></i> <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${h}</span></div>`).join('')}
              </div>
            ` : ''}

            <!-- Meta info -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.75rem; color: #64748b; margin-bottom: 14px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
              <span><i class="ri-timer-line"></i> Delay: ${p.delaySeconds || 3}s</span>
              <span><i class="ri-repeat-line"></i> ${p.frequency === 'once_session' ? 'Once per session' : 'Every page'}</span>
            </div>

            <!-- Actions Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <button class="btn-toggle-status" data-id="${p.id}" data-status="${p.status}" style="padding: 6px 12px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; cursor: pointer; border: 1px solid ${isActive ? '#fecaca' : '#bbf7d0'}; background: ${isActive ? '#fef2f2' : '#f0fdf4'}; color: ${isActive ? '#dc2626' : '#16a34a'};">
                ${isActive ? '<i class="ri-pause-circle-line"></i> Pause' : '<i class="ri-play-circle-line"></i> Activate'}
              </button>

              <div style="display: flex; gap: 6px;">
                <button class="btn-edit-popup" data-id="${p.id}" style="padding: 6px 12px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; cursor: pointer;">
                  <i class="ri-edit-line"></i> Edit
                </button>
                <button class="btn-delete-popup" data-id="${p.id}" style="padding: 6px 10px; border-radius: 8px; font-size: 0.78rem; font-weight: 700; background: #fff; border: 1px solid #fee2e2; color: #dc2626; cursor: pointer;">
                  <i class="ri-delete-bin-line"></i>
                </button>
              </div>
            </div>

          </div>
        </div>
      `;
    }).join('');

    // Rebind action buttons
    container.querySelectorAll('.btn-toggle-status').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const id = e.currentTarget.dataset.id;
        const current = e.currentTarget.dataset.status;
        const newStatus = current === 'Active' ? 'Inactive' : 'Active';
        await updatePopup(id, { status: newStatus });
        showToast(`Popup status changed to ${newStatus}!`, 'ri-checkbox-circle-fill');
        renderGrid();
      });
    });

    container.querySelectorAll('.btn-edit-popup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        const p = getPopups().find(item => item.id === id);
        if (p) openEditModal(p);
      });
    });

    container.querySelectorAll('.btn-delete-popup').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        showConfirmModal({
          title: 'Delete Popup?',
          message: 'Are you sure you want to remove this promotion popup banner?',
          onConfirm: async () => {
            await deletePopup(id);
            showToast('Popup removed successfully!', 'ri-checkbox-circle-fill');
            renderGrid();
          }
        });
      });
    });
  };

  // Filter tabs
  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      filterTabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = '#f1f5f9';
        t.style.color = '#475569';
        t.style.border = '1px solid #cbd5e1';
      });
      tab.classList.add('active');
      tab.style.background = '#eb5e28';
      tab.style.color = '#fff';
      tab.style.border = 'none';
      currentFilter = tab.dataset.filter;
      renderGrid();
    });
  });

  searchInput?.addEventListener('input', renderGrid);

  // Modal references
  const modal = document.getElementById('popup-editor-modal');
  const closeBtn = document.getElementById('close-popup-modal-btn');
  const cancelBtn = document.getElementById('cancel-popup-modal-btn');
  const saveBtn = document.getElementById('save-popup-modal-btn');
  const createBtn = document.getElementById('btn-create-popup');

  // Input bindings for realtime preview
  const inputTitle = document.getElementById('popup-input-title');
  const inputSubtitle = document.getElementById('popup-input-subtitle');
  const inputBadge = document.getElementById('popup-input-badge');
  const inputImage = document.getElementById('popup-input-image');
  const inputHighlights = document.getElementById('popup-input-highlights');
  const inputCtaText = document.getElementById('popup-input-cta-text');
  const inputImageFile = document.getElementById('popup-image-file-input');

  const updateLivePreview = () => {
    const titleEl = document.getElementById('preview-title');
    const subtitleEl = document.getElementById('preview-subtitle');
    const badgeEl = document.getElementById('preview-badge');
    const imgEl = document.getElementById('preview-img');
    const ctaTextEl = document.getElementById('preview-cta-text');
    const highlightsListEl = document.getElementById('preview-highlights-list');

    if (titleEl) titleEl.textContent = inputTitle.value.trim() || '🌾 Your Offer Title Here';
    if (subtitleEl) subtitleEl.textContent = inputSubtitle.value.trim() || 'Short attractive description of your special discount or project launch.';
    if (badgeEl) badgeEl.textContent = inputBadge.value.trim() || 'OFFER';
    if (imgEl && inputImage.value.trim()) imgEl.src = inputImage.value.trim();
    if (ctaTextEl) ctaTextEl.textContent = inputCtaText.value.trim() || 'Claim Offer on WhatsApp';

    if (highlightsListEl) {
      const lines = (inputHighlights.value || '').split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        highlightsListEl.innerHTML = lines.map(line => `
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #334155;">
            <i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> <span>${line}</span>
          </div>
        `).join('');
      } else {
        highlightsListEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #334155;">
            <i class="ri-checkbox-circle-fill" style="color: #10b981;"></i> <span>Spot Patta Transfer & 0% Brokerage</span>
          </div>
        `;
      }
    }
  };

  [inputTitle, inputSubtitle, inputBadge, inputImage, inputHighlights, inputCtaText].forEach(input => {
    input?.addEventListener('input', updateLivePreview);
  });

  inputImageFile?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (re) => {
        if (inputImage) inputImage.value = re.target.result;
        updateLivePreview();
      };
      reader.readAsDataURL(file);
    }
  });

  function openCreateModal() {
    document.getElementById('popup-modal-heading').textContent = 'Create Promotional Popup';
    document.getElementById('edit-popup-id').value = '';
    inputTitle.value = '';
    inputSubtitle.value = '';
    document.getElementById('popup-input-type').value = 'festival';
    inputBadge.value = '🎉 FESTIVE OFFER';
    inputImage.value = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    inputHighlights.value = 'Spot Patta Transfer & 0% Brokerage\nReady for immediate villa construction\nSpecial ₹50,000 spot booking cashback';
    inputCtaText.value = 'Claim Festive Offer on WhatsApp';
    document.getElementById('popup-input-cta-type').value = 'whatsapp';
    document.getElementById('popup-input-start-date').value = '';
    document.getElementById('popup-input-end-date').value = '';
    document.getElementById('popup-input-delay').value = '3';
    document.getElementById('popup-input-status').value = 'Active';

    updateLivePreview();
    modal.style.display = 'flex';
  }

  function openEditModal(p) {
    document.getElementById('popup-modal-heading').textContent = 'Edit Promotional Popup';
    document.getElementById('edit-popup-id').value = p.id;
    inputTitle.value = p.title || '';
    inputSubtitle.value = p.subtitle || '';
    document.getElementById('popup-input-type').value = p.type || 'festival';
    inputBadge.value = p.badge || 'PROMOTION';
    inputImage.value = p.image || '';
    inputHighlights.value = Array.isArray(p.highlights) ? p.highlights.join('\n') : '';
    inputCtaText.value = p.ctaText || 'Claim Festive Offer on WhatsApp';
    document.getElementById('popup-input-cta-type').value = p.ctaType || 'whatsapp';
    document.getElementById('popup-input-start-date').value = p.startDate || '';
    document.getElementById('popup-input-end-date').value = p.endDate || '';
    document.getElementById('popup-input-delay').value = p.delaySeconds ? p.delaySeconds.toString() : '3';
    document.getElementById('popup-input-status').value = p.status || 'Active';

    updateLivePreview();
    modal.style.display = 'flex';
  }

  const closeModal = () => { if (modal) modal.style.display = 'none'; };
  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  createBtn?.addEventListener('click', openCreateModal);

  saveBtn?.addEventListener('click', async () => {
    const title = inputTitle.value.trim();
    if (!title) {
      showAlertModal({ title: 'Missing Title', message: 'Please enter a title for this popup.' });
      return;
    }

    const editId = document.getElementById('edit-popup-id').value;
    const highlights = inputHighlights.value.split('\n').map(l => l.trim()).filter(l => l);

    const payload = {
      title: title,
      subtitle: inputSubtitle.value.trim(),
      type: document.getElementById('popup-input-type').value,
      badge: inputBadge.value.trim() || 'OFFER',
      image: inputImage.value.trim(),
      highlights: highlights,
      ctaText: inputCtaText.value.trim() || 'Claim Offer on WhatsApp',
      ctaType: document.getElementById('popup-input-cta-type').value,
      startDate: document.getElementById('popup-input-start-date').value,
      endDate: document.getElementById('popup-input-end-date').value,
      delaySeconds: parseInt(document.getElementById('popup-input-delay').value) || 3,
      status: document.getElementById('popup-input-status').value
    };

    if (editId) {
      await updatePopup(editId, payload);
      showToast('Popup updated successfully!', 'ri-checkbox-circle-fill');
    } else {
      await addPopup(payload);
      showToast('New popup created and published!', 'ri-checkbox-circle-fill');
    }

    closeModal();
    renderGrid();
  });

  // Initial render
  renderGrid();
}
