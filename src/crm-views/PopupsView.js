import { getPopups, addPopup, updatePopup, deletePopup, initPopupsStore } from '../utils/popupsStore.js';
import { showToast, showAlertModal, showConfirmModal } from '../utils/toast.js';

function getPopupScheduleState(p) {
  if (p.status !== 'Active') {
    return { label: '⚪ PAUSED', text: 'Paused / Inactive', color: '#64748b', bg: '#f1f5f9', state: 'paused' };
  }
  const now = new Date();
  if (p.startDate) {
    const start = new Date(p.startDate);
    start.setHours(0, 0, 0, 0);
    if (now < start) {
      return { label: `🟡 SCHEDULED`, text: `Starts ${p.startDate}`, color: '#d97706', bg: '#fef3c7', state: 'scheduled' };
    }
  }
  if (p.endDate) {
    const end = new Date(p.endDate);
    end.setHours(23, 59, 59, 999);
    if (now > end) {
      return { label: `🔴 EXPIRED`, text: `Ended ${p.endDate}`, color: '#dc2626', bg: '#fee2e2', state: 'expired' };
    }
  }
  return { label: '🟢 LIVE NOW', text: 'Active & Displaying', color: '#16a34a', bg: '#dcfce7', state: 'live' };
}

export function renderPopupsView() {
  const popups = getPopups();
  const liveCount = popups.filter(p => getPopupScheduleState(p).state === 'live').length;
  const scheduledCount = popups.filter(p => getPopupScheduleState(p).state === 'scheduled').length;
  const pausedCount = popups.filter(p => getPopupScheduleState(p).state === 'paused' || getPopupScheduleState(p).state === 'expired').length;

  return `
    <div class="view-enter">
      <style>
        .popup-select-input {
          height: 42px;
          padding: 8px 36px 8px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background-color: #ffffff;
          color: #0f172a;
          font-size: 0.88rem;
          font-weight: 600;
          cursor: pointer;
          outline: none;
          -webkit-appearance: none;
          -moz-appearance: none;
          appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='16' height='16' fill='%2364748b'%3E%3Cpath d='M12 16L6 10H18L12 16Z'%3E%3C/path%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          width: 100%;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .popup-select-input:focus {
          border-color: #eb5e28;
          box-shadow: 0 0 0 3px rgba(235,94,40,0.15);
        }
        .popup-text-input {
          height: 42px;
          padding: 8px 14px;
          border: 1px solid #cbd5e1;
          border-radius: 8px;
          background: #ffffff;
          color: #0f172a;
          font-size: 0.88rem;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          width: 100%;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .popup-text-input:focus {
          border-color: #eb5e28;
          box-shadow: 0 0 0 3px rgba(235,94,40,0.15);
        }
        @media (max-width: 900px) {
          #popup-editor-modal .os-modal-body {
            grid-template-columns: 1fr !important;
            padding: 16px !important;
            gap: 20px !important;
          }
          #popup-editor-modal .os-modal-card {
            width: 96% !important;
            max-height: 95vh !important;
          }
          #popup-live-preview-box {
            position: static !important;
            max-width: 100% !important;
          }
          .popups-responsive-controls {
            flex-direction: column !important;
            align-items: stretch !important;
            gap: 12px !important;
          }
          #popup-search-input-box {
            width: 100% !important;
          }
        }
      </style>

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
      <div class="os-kpi-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
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
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Live On Website</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #ecfdf5; color: #10b981; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-checkbox-circle-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #10b981; margin-top: 10px;" id="kpi-active-popups">${liveCount}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Currently active to visitors</span>
        </div>

        <div class="os-kpi-card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--os-border-color, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Scheduled Deals</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #fef3c7; color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-calendar-event-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #d97706; margin-top: 10px;">${scheduledCount}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Starts on scheduled dates</span>
        </div>

        <div class="os-kpi-card" style="background: #ffffff; padding: 18px 20px; border-radius: 12px; border: 1px solid var(--os-border-color, #e2e8f0); box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 0.82rem; font-weight: 700; color: #64748b; text-transform: uppercase;">Paused / Ended</span>
            <div style="width: 36px; height: 36px; border-radius: 8px; background: #f1f5f9; color: #64748b; display: flex; align-items: center; justify-content: center; font-size: 1.2rem;">
              <i class="ri-pause-circle-line"></i>
            </div>
          </div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #0f172a; margin-top: 10px;">${pausedCount}</div>
          <span style="font-size: 0.78rem; color: #64748b;">Drafts or past campaigns</span>
        </div>
      </div>

      <!-- Filter Tabs & Controls -->
      <div class="popups-responsive-controls" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; margin-bottom: 20px;">
        <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="popup-filter-tabs">
          <button class="os-tab-btn active" data-filter="all" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #eb5e28; color: #fff; border: none;">All Popups (${popups.length})</button>
          <button class="os-tab-btn" data-filter="live" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">Live Now (${liveCount})</button>
          <button class="os-tab-btn" data-filter="scheduled" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">Scheduled (${scheduledCount})</button>
          <button class="os-tab-btn" data-filter="paused" style="padding: 8px 16px; border-radius: 8px; font-size: 0.85rem; font-weight: 700; cursor: pointer; background: #f1f5f9; color: #475569; border: 1px solid #cbd5e1;">Paused / Expired</button>
        </div>

        <div id="popup-search-input-box" style="display: flex; align-items: center; gap: 8px; background: #fff; padding: 6px 14px; border-radius: 8px; border: 1px solid #cbd5e1;">
          <i class="ri-search-line" style="color: #94a3b8;"></i>
          <input type="text" id="popup-search-input" placeholder="Search popups by keyword..." style="border: none; outline: none; font-size: 0.88rem; width: 100%; min-width: 180px;" />
        </div>
      </div>

      <!-- Popups Grid -->
      <div id="popups-grid-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px;">
        <!-- Rendered by JS -->
      </div>
    </div>

    <!-- Create / Edit Popup Modal -->
    <div class="os-modal-overlay" id="popup-editor-modal" style="display: none; align-items: center; justify-content: center; z-index: 99999; background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(5px);">
      <div class="os-modal-card" style="max-width: 980px; width: 95%; max-height: 92vh; display: flex; flex-direction: column; overflow: hidden; border-radius: 18px; background: #ffffff; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.35); border: 1px solid #e2e8f0;">
        
        <div class="os-modal-header" style="display: flex; justify-content: space-between; align-items: center; padding: 20px 28px; border-bottom: 1px solid #e2e8f0; background: #ffffff;">
          <div>
            <h2 id="popup-modal-heading" style="font-size: 1.3rem; font-weight: 800; color: #0f172a; margin: 0;">Create Promotional Popup</h2>
            <p style="font-size: 0.84rem; color: #64748b; margin: 3px 0 0 0;">Customize banner visual poster, custom category, action buttons, and active dates.</p>
          </div>
          <button class="os-modal-close" id="close-popup-modal-btn" style="background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; color: #64748b; cursor: pointer;"><i class="ri-close-line"></i></button>
        </div>

        <div class="os-modal-body" style="padding: 24px 28px; overflow-y: auto; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 28px; background: #fafafa;">
          <!-- Left Column: Clean Professional Form Fields -->
          <div style="background: #ffffff; padding: 22px; border-radius: 14px; border: 1px solid #e2e8f0; display: flex; flex-direction: column; gap: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.03);">
            <input type="hidden" id="edit-popup-id" value="" />

            <div class="form-group">
              <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Popup Title *</label>
              <input type="text" id="popup-input-title" class="popup-text-input" placeholder="e.g. 🌾 Grand Pongal Property Mela 2026" required />
            </div>

            <div class="form-group">
              <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Subtitle / Description</label>
              <textarea id="popup-input-subtitle" class="popup-text-input" rows="2" placeholder="Brief 1-2 line description of this offer or announcement..." style="height: auto; min-height: 60px; resize: vertical;"></textarea>
            </div>

            <!-- Custom Category Type Input & Badge Text -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Category / Campaign Type</label>
                <input type="text" id="popup-input-type" class="popup-text-input" placeholder="e.g. Festival, Deal, Launch" list="popup-category-datalist" />
                <datalist id="popup-category-datalist">
                  <option value="Festival & Seasonal">
                  <option value="Special Ad Offer">
                  <option value="New Project Launch">
                  <option value="Flash Discount">
                  <option value="Farmland / Agri Deal">
                  <option value="General Announcement">
                </datalist>
              </div>

              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Badge Tag Text</label>
                <input type="text" id="popup-input-badge" class="popup-text-input" placeholder="e.g. 🎉 FESTIVE OFFER" value="🎉 FESTIVE OFFER" />
              </div>
            </div>

            <div class="form-group">
              <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Banner Poster Image</label>
              <div style="display: flex; gap: 8px;">
                <input type="text" id="popup-input-image" class="popup-text-input" placeholder="Paste image URL or upload below..." style="flex: 1;" />
                <label style="padding: 0 16px; height: 42px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 8px; font-size: 0.84rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; gap: 6px; color: #334155; white-space: nowrap;">
                  <i class="ri-upload-2-line"></i> Upload
                  <input type="file" id="popup-image-file-input" accept="image/*" style="display: none;" />
                </label>
              </div>
            </div>

            <div class="form-group">
              <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Key Highlights (1 point per line)</label>
              <textarea id="popup-input-highlights" class="popup-text-input" rows="3" placeholder="Spot Patta Transfer & 0% Brokerage&#10;Ready for immediate villa construction&#10;Special ₹50,000 spot booking cashback" style="height: auto; min-height: 75px; font-family: monospace; font-size: 0.85rem;"></textarea>
            </div>

            <!-- CTA Action Row & Dynamic Target Input -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">CTA Button Text</label>
                <input type="text" id="popup-input-cta-text" class="popup-text-input" value="Claim Festive Offer on WhatsApp" />
              </div>

              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">CTA Button Action</label>
                <select id="popup-input-cta-type" class="popup-select-input">
                  <option value="whatsapp">💬 Open WhatsApp</option>
                  <option value="call">📞 Phone Direct Call</option>
                  <option value="site_visit">📅 Book Site Visit</option>
                  <option value="link">🔗 Open Custom Link / URL</option>
                </select>
              </div>
            </div>

            <!-- Dynamic CTA Value / Target Input Box -->
            <div class="form-group" id="cta-target-container">
              <label id="cta-target-label" style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">WhatsApp Phone Number</label>
              <input type="text" id="popup-input-cta-value" class="popup-text-input" placeholder="+91 84899 96852" value="+91 84899 96852" />
              <small id="cta-target-hint" style="font-size: 0.76rem; color: #64748b; margin-top: 4px; display: block;">Default: +91 84899 96852 (Thanjai Property Official Support)</small>
            </div>

            <!-- Schedule Dates -->
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Start Date (Optional)</label>
                <input type="date" id="popup-input-start-date" class="popup-text-input" />
              </div>

              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">End Date (Optional)</label>
                <input type="date" id="popup-input-end-date" class="popup-text-input" />
              </div>
            </div>

            <!-- Delay, Frequency, and Status Row -->
            <div style="display: grid; grid-template-columns: 1fr 1.2fr 1fr; gap: 12px;">
              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Display Delay</label>
                <select id="popup-input-delay" class="popup-select-input">
                  <option value="2">2 seconds</option>
                  <option value="3" selected>3s (Default)</option>
                  <option value="5">5 seconds</option>
                  <option value="8">8 seconds</option>
                </select>
              </div>

              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Show Frequency</label>
                <select id="popup-input-frequency" class="popup-select-input">
                  <option value="every_load">🔄 Every Time Page Loads</option>
                  <option value="once_session" selected>⏱️ Once per Browser Session</option>
                  <option value="once_day">📅 Once per Day (24h)</option>
                </select>
              </div>

              <div class="form-group">
                <label style="font-size: 0.84rem; font-weight: 700; color: #1e293b; display: block; margin-bottom: 6px;">Status</label>
                <select id="popup-input-status" class="popup-select-input">
                  <option value="Active">🟢 Active (Live)</option>
                  <option value="Inactive">⚪ Inactive (Paused)</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Right Column: Clean Visual Live Preview -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <div style="width: 100%; display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
              <span style="font-size: 0.82rem; font-weight: 800; color: #475569; text-transform: uppercase; letter-spacing: 0.5px;">Live Realtime Preview</span>
              <span style="font-size: 0.74rem; background: #e0f2fe; color: #0284c7; padding: 3px 10px; border-radius: 20px; font-weight: 700;">Front-End View</span>
            </div>

            <!-- The Clean Preview Card -->
            <div id="popup-live-preview-box" style="width: 100%; max-width: 380px; background: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04); border: 1px solid #e2e8f0; position: sticky; top: 10px;">
              <!-- Image Banner with Badge -->
              <div style="position: relative; height: 170px; background: #0f172a; overflow: hidden;">
                <img id="preview-img" src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80" style="width: 100%; height: 100%; object-fit: cover;" />
                <span id="preview-badge" style="position: absolute; top: 12px; left: 12px; background: #eb5e28; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.25); text-transform: uppercase;">
                  🎉 FESTIVE OFFER
                </span>
                <span style="position: absolute; top: 12px; right: 12px; width: 28px; height: 28px; border-radius: 50%; background: rgba(0,0,0,0.5); color: #fff; display: flex; align-items: center; justify-content: center; font-size: 0.95rem;">
                  ✕
                </span>
              </div>

              <!-- Content Body with Title at Top of Content -->
              <div style="padding: 18px 20px 22px 20px;">
                <h3 id="preview-title" style="font-size: 1.15rem; font-weight: 800; color: #0f172a; margin: 0 0 8px 0; line-height: 1.35; font-family: 'DM Serif Display', Georgia, serif;">🌾 Grand Festive Property Mela 2026</h3>
                <p id="preview-subtitle" style="font-size: 0.84rem; color: #64748b; margin: 0 0 14px 0; line-height: 1.45;">Special limited-time booking discount on DTCP & RERA approved residential plots in Thanjavur & Trichy Road.</p>
                
                <div id="preview-highlights-list" style="display: flex; flex-direction: column; gap: 7px; margin-bottom: 18px;">
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #334155;">
                    <i class="ri-checkbox-circle-fill" style="color: #10b981; font-size: 0.95rem;"></i> <span>Spot Patta Transfer & 0% Brokerage</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #334155;">
                    <i class="ri-checkbox-circle-fill" style="color: #10b981; font-size: 0.95rem;"></i> <span>Ready for immediate villa construction</span>
                  </div>
                </div>

                <button id="preview-cta-btn" style="width: 100%; background: #eb5e28; color: #fff; border: none; padding: 11px 16px; border-radius: 10px; font-size: 0.88rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 8px; cursor: pointer; box-shadow: 0 6px 16px rgba(235,94,40,0.3);">
                  <i id="preview-cta-icon" class="ri-whatsapp-fill"></i> <span id="preview-cta-text">Claim Festive Offer on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="os-modal-footer" style="display: flex; justify-content: flex-end; gap: 12px; padding: 18px 28px; border-top: 1px solid #e2e8f0; background: #ffffff;">
          <button class="os-btn-secondary" id="cancel-popup-modal-btn">Cancel</button>
          <button class="os-btn-primary" id="save-popup-modal-btn" style="background: #eb5e28; border-color: #eb5e28; color: #fff; padding: 10px 22px; font-weight: 700;">
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
      const stateObj = getPopupScheduleState(p);

      if (currentFilter === 'live' && stateObj.state !== 'live') return false;
      if (currentFilter === 'scheduled' && stateObj.state !== 'scheduled') return false;
      if (currentFilter === 'paused' && (stateObj.state !== 'paused' && stateObj.state !== 'expired')) return false;

      if (query) {
        return (p.title || '').toLowerCase().includes(query) ||
               (p.subtitle || '').toLowerCase().includes(query) ||
               (p.badge || '').toLowerCase().includes(query) ||
               (p.type || '').toLowerCase().includes(query);
      }
      return true;
    });

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; padding: 48px 24px; text-align: center; background: #fff; border-radius: 14px; border: 1px dashed #cbd5e1;">
          <i class="ri-advertisement-line" style="font-size: 3.2rem; color: #94a3b8; display: block; margin-bottom: 12px;"></i>
          <h3 style="font-size: 1.15rem; font-weight: 700; color: #1e293b; margin: 0 0 6px 0;">No popups found</h3>
          <p style="font-size: 0.88rem; color: #64748b; margin: 0 0 18px 0;">Create a festive offer or property deal popup to engage website visitors.</p>
          <button class="os-btn-primary" id="empty-create-popup-btn"><i class="ri-add-line"></i> Create First Popup</button>
        </div>
      `;
      document.getElementById('empty-create-popup-btn')?.addEventListener('click', openCreateModal);
      return;
    }

    container.innerHTML = filtered.map(p => {
      const stateObj = getPopupScheduleState(p);
      const highlights = Array.isArray(p.highlights) ? p.highlights : [];
      const imageSrc = p.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';

      return `
        <div class="popup-card hover-lift" style="background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.04); display: flex; flex-direction: column;">
          
          <!-- Card Thumbnail -->
          <div style="position: relative; height: 160px; background: #0f172a; overflow: hidden;">
            <img src="${imageSrc}" style="width: 100%; height: 100%; object-fit: cover;" />
            <span style="position: absolute; top: 12px; left: 12px; background: #eb5e28; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.25);">
              ${p.badge || 'OFFER'}
            </span>
            <div style="position: absolute; top: 12px; right: 12px; background: ${stateObj.bg}; color: ${stateObj.color}; font-size: 0.74rem; font-weight: 800; padding: 4px 12px; border-radius: 20px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              ${stateObj.label}
            </div>
          </div>

          <!-- Card Body -->
          <div style="padding: 20px; flex: 1; display: flex; flex-direction: column;">
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
              <span style="font-size: 0.75rem; font-weight: 700; color: #64748b; text-transform: uppercase; background: #f1f5f9; padding: 2px 8px; border-radius: 6px;">${p.type || 'Custom Deal'}</span>
              ${p.startDate ? `<span style="font-size: 0.74rem; color: #94a3b8;"><i class="ri-calendar-line"></i> ${p.startDate} ${p.endDate ? 'to ' + p.endDate : ''}</span>` : ''}
            </div>

            <h3 style="font-size: 1.1rem; font-weight: 800; color: #0f172a; margin: 0 0 6px 0; line-height: 1.35; font-family: 'DM Serif Display', Georgia, serif;">${p.title}</h3>
            <p style="font-size: 0.84rem; color: #64748b; margin: 0 0 14px 0; line-height: 1.45; flex: 1;">${p.subtitle || 'No description provided'}</p>

            <!-- Highlights -->
            ${highlights.length > 0 ? `
              <div style="background: #f8fafc; border-radius: 10px; padding: 10px 12px; margin-bottom: 14px; font-size: 0.8rem; color: #334155; display: flex; flex-direction: column; gap: 5px;">
                ${highlights.slice(0, 2).map(h => `<div style="display: flex; align-items: center; gap: 6px;"><i class="ri-check-line" style="color: #10b981; font-weight: bold;"></i> <span style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${h}</span></div>`).join('')}
              </div>
            ` : ''}

            <!-- Meta info -->
            <div style="display: flex; justify-content: space-between; align-items: center; font-size: 0.76rem; color: #64748b; margin-bottom: 14px; border-top: 1px solid #f1f5f9; padding-top: 10px;">
              <span><i class="ri-timer-line"></i> Delay: ${p.delaySeconds || 3}s</span>
              <span><i class="ri-link"></i> ${p.ctaType === 'whatsapp' ? 'WhatsApp' : (p.ctaType === 'call' ? 'Phone Call' : (p.ctaType === 'site_visit' ? 'Site Visit' : 'Custom Link'))}</span>
            </div>

            <!-- Actions Bar -->
            <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px;">
              <button class="btn-toggle-status" data-id="${p.id}" data-status="${p.status}" style="padding: 7px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; cursor: pointer; border: 1px solid ${p.status === 'Active' ? '#fecaca' : '#bbf7d0'}; background: ${p.status === 'Active' ? '#fef2f2' : '#f0fdf4'}; color: ${p.status === 'Active' ? '#dc2626' : '#16a34a'};">
                ${p.status === 'Active' ? '<i class="ri-pause-circle-line"></i> Pause' : '<i class="ri-play-circle-line"></i> Activate'}
              </button>

              <div style="display: flex; gap: 6px;">
                <button class="btn-edit-popup" data-id="${p.id}" style="padding: 7px 14px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; background: #f8fafc; border: 1px solid #cbd5e1; color: #0f172a; cursor: pointer;">
                  <i class="ri-edit-line"></i> Edit
                </button>
                <button class="btn-delete-popup" data-id="${p.id}" style="padding: 7px 12px; border-radius: 8px; font-size: 0.8rem; font-weight: 700; background: #fff; border: 1px solid #fee2e2; color: #dc2626; cursor: pointer;">
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
  if (modal) {
    document.querySelectorAll('body > #popup-editor-modal').forEach(m => {
      if (m !== modal) m.remove();
    });
    if (modal.parentNode !== document.body) {
      document.body.appendChild(modal);
    }
  }

  const closeBtn = document.getElementById('close-popup-modal-btn');
  const cancelBtn = document.getElementById('cancel-popup-modal-btn');
  const saveBtn = document.getElementById('save-popup-modal-btn');
  const createBtn = document.getElementById('btn-create-popup');

  // Input bindings
  const inputTitle = document.getElementById('popup-input-title');
  const inputSubtitle = document.getElementById('popup-input-subtitle');
  const inputType = document.getElementById('popup-input-type');
  const inputBadge = document.getElementById('popup-input-badge');
  const inputImage = document.getElementById('popup-input-image');
  const inputHighlights = document.getElementById('popup-input-highlights');
  const inputCtaText = document.getElementById('popup-input-cta-text');
  const inputCtaType = document.getElementById('popup-input-cta-type');
  const inputCtaValue = document.getElementById('popup-input-cta-value');
  const ctaTargetLabel = document.getElementById('cta-target-label');
  const ctaTargetHint = document.getElementById('cta-target-hint');
  const inputImageFile = document.getElementById('popup-image-file-input');

  const updateCtaFields = () => {
    const action = inputCtaType?.value || 'whatsapp';
    if (!ctaTargetLabel || !inputCtaValue || !ctaTargetHint) return;

    if (action === 'whatsapp') {
      ctaTargetLabel.textContent = 'WhatsApp Phone Number (with Country Code)';
      inputCtaValue.placeholder = '+91 84899 96852';
      ctaTargetHint.textContent = 'Default: +91 84899 96852. Enter customer support or manager WhatsApp number.';
      if (!inputCtaValue.value.trim() || inputCtaValue.value.startsWith('http')) {
        inputCtaValue.value = '+91 84899 96852';
      }
    } else if (action === 'call') {
      ctaTargetLabel.textContent = 'Phone Number for Direct Phone Call';
      inputCtaValue.placeholder = '+91 84899 96852';
      ctaTargetHint.textContent = 'Default: +91 84899 96852. Clicking will immediately trigger the phone dialer.';
      if (!inputCtaValue.value.trim() || inputCtaValue.value.startsWith('http')) {
        inputCtaValue.value = '+91 84899 96852';
      }
    } else if (action === 'site_visit') {
      ctaTargetLabel.textContent = 'Site Visit Booking Action';
      inputCtaValue.placeholder = 'Pre-filled Property Location / Code';
      ctaTargetHint.textContent = 'Opens the built-in "Schedule Free Site Visit" modal dialog on the website for instant appointment booking.';
    } else if (action === 'link') {
      ctaTargetLabel.textContent = 'Destination Webpage Link / URL *';
      inputCtaValue.placeholder = 'https://thanjaiproperty.com/#discover';
      ctaTargetHint.textContent = 'Enter any internal page route (#discover, #our-story) or external project link.';
      if (inputCtaValue.value.includes('84899') || inputCtaValue.value.startsWith('+91')) {
        inputCtaValue.value = 'https://thanjaiproperty.com/#discover';
      }
    }
  };

  inputCtaType?.addEventListener('change', () => {
    updateCtaFields();
    updateLivePreview();
  });

  const updateLivePreview = () => {
    const titleEl = document.getElementById('preview-title');
    const subtitleEl = document.getElementById('preview-subtitle');
    const badgeEl = document.getElementById('preview-badge');
    const imgEl = document.getElementById('preview-img');
    const ctaTextEl = document.getElementById('preview-cta-text');
    const ctaIconEl = document.getElementById('preview-cta-icon');
    const highlightsListEl = document.getElementById('preview-highlights-list');

    if (titleEl) titleEl.textContent = inputTitle.value.trim() || '🌾 Your Offer Title Here';
    if (subtitleEl) subtitleEl.textContent = inputSubtitle.value.trim() || 'Short attractive description of your special discount or project launch.';
    if (badgeEl) badgeEl.textContent = inputBadge.value.trim() || 'OFFER';
    if (imgEl && inputImage.value.trim()) imgEl.src = inputImage.value.trim();
    if (ctaTextEl) ctaTextEl.textContent = inputCtaText.value.trim() || 'Claim Offer on WhatsApp';

    if (ctaIconEl && inputCtaType) {
      if (inputCtaType.value === 'whatsapp') ctaIconEl.className = 'ri-whatsapp-fill';
      else if (inputCtaType.value === 'call') ctaIconEl.className = 'ri-phone-fill';
      else if (inputCtaType.value === 'site_visit') ctaIconEl.className = 'ri-calendar-check-fill';
      else ctaIconEl.className = 'ri-arrow-right-up-line';
    }

    if (highlightsListEl) {
      const lines = (inputHighlights.value || '').split('\n').map(l => l.trim()).filter(l => l);
      if (lines.length > 0) {
        highlightsListEl.innerHTML = lines.map(line => `
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #334155;">
            <i class="ri-checkbox-circle-fill" style="color: #10b981; font-size: 0.95rem;"></i> <span>${line}</span>
          </div>
        `).join('');
      } else {
        highlightsListEl.innerHTML = `
          <div style="display: flex; align-items: center; gap: 8px; font-size: 0.8rem; color: #334155;">
            <i class="ri-checkbox-circle-fill" style="color: #10b981; font-size: 0.95rem;"></i> <span>Spot Patta Transfer & 0% Brokerage</span>
          </div>
        `;
      }
    }
  };

  [inputTitle, inputSubtitle, inputBadge, inputImage, inputHighlights, inputCtaText, inputType].forEach(input => {
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
    if (!modal) return;
    document.getElementById('popup-modal-heading').textContent = 'Create Promotional Popup';
    document.getElementById('edit-popup-id').value = '';
    inputTitle.value = '';
    inputSubtitle.value = '';
    inputType.value = 'Festival & Seasonal';
    inputBadge.value = '🎉 FESTIVE OFFER';
    inputImage.value = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
    inputHighlights.value = 'Spot Patta Transfer & 0% Brokerage\nReady for immediate villa construction\nSpecial ₹50,000 spot booking cashback';
    inputCtaText.value = 'Claim Festive Offer on WhatsApp';
    inputCtaType.value = 'whatsapp';
    inputCtaValue.value = '+91 84899 96852';
    document.getElementById('popup-input-start-date').value = '';
    document.getElementById('popup-input-end-date').value = '';
    document.getElementById('popup-input-delay').value = '3';
    document.getElementById('popup-input-frequency').value = 'once_session';
    document.getElementById('popup-input-status').value = 'Active';

    updateCtaFields();
    updateLivePreview();
    modal.style.display = 'flex';
    modal.classList.add('show');
  }

  function openEditModal(p) {
    if (!modal) return;
    document.getElementById('popup-modal-heading').textContent = 'Edit Promotional Popup';
    document.getElementById('edit-popup-id').value = p.id;
    inputTitle.value = p.title || '';
    inputSubtitle.value = p.subtitle || '';
    inputType.value = p.type || 'Festival & Seasonal';
    inputBadge.value = p.badge || 'PROMOTION';
    inputImage.value = p.image || '';
    inputHighlights.value = Array.isArray(p.highlights) ? p.highlights.join('\n') : '';
    inputCtaText.value = p.ctaText || 'Claim Festive Offer on WhatsApp';
    inputCtaType.value = p.ctaType || 'whatsapp';
    inputCtaValue.value = p.ctaValue || '+91 84899 96852';
    document.getElementById('popup-input-start-date').value = p.startDate || '';
    document.getElementById('popup-input-end-date').value = p.endDate || '';
    document.getElementById('popup-input-delay').value = p.delaySeconds ? p.delaySeconds.toString() : '3';
    document.getElementById('popup-input-frequency').value = p.frequency || 'once_session';
    document.getElementById('popup-input-status').value = p.status || 'Active';

    updateCtaFields();
    updateLivePreview();
    modal.style.display = 'flex';
    modal.classList.add('show');
  }

  const closeModal = () => { 
    if (modal) {
      modal.style.display = 'none';
      modal.classList.remove('show');
    }
  };

  closeBtn?.addEventListener('click', closeModal);
  cancelBtn?.addEventListener('click', closeModal);
  createBtn?.addEventListener('click', openCreateModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

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
      type: inputType.value.trim() || 'Custom Deal',
      badge: inputBadge.value.trim() || 'OFFER',
      image: inputImage.value.trim(),
      highlights: highlights,
      ctaText: inputCtaText.value.trim() || 'Claim Offer on WhatsApp',
      ctaType: inputCtaType.value,
      ctaValue: inputCtaValue.value.trim() || '+91 84899 96852',
      startDate: document.getElementById('popup-input-start-date').value,
      endDate: document.getElementById('popup-input-end-date').value,
      delaySeconds: parseInt(document.getElementById('popup-input-delay').value) || 3,
      frequency: document.getElementById('popup-input-frequency').value || 'once_session',
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
