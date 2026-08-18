import { getProperties, approveSubmission, rejectSubmission } from '../utils/propertiesStore.js';
import { showToast } from '../utils/toast.js';

export function renderPropertyApprovalsView() {
  const allProps = getProperties();
  // Submissions with approvalStatus === 'Pending Approval' or status === 'Pending Approval'
  const pendingProps = allProps.filter(p => p.approvalStatus === 'Pending Approval' || p.status === 'Pending Approval');
  const approvedProps = allProps.filter(p => p.approvalStatus === 'Approved');

  return `
    <div class="view-enter">
      
      <!-- HEADER TITLE BAR -->
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: var(--os-luxury-orange); letter-spacing: 0.12em; text-transform: uppercase;">
            VERIFICATION & APPROVAL DESK
          </span>
          <h1 style="font-family: var(--font-sans); font-size: 1.8rem; font-weight: 800; color: var(--os-charcoal); margin-top: 4px;">
            Property Submissions Approval Desk
          </h1>
          <p style="font-size: 0.88rem; color: var(--os-gray-400);">
            Inspect land & property listings submitted by registered portal users before publishing live to the public website showcase.
          </p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center;">
          <span style="background: rgba(229,46,61,0.12); color: #E52E3D; font-weight: 800; padding: 6px 14px; border-radius: 20px; font-size: 0.82rem;">
            <i class="ri-notification-3-fill"></i> ${pendingProps.length} Pending Approval
          </span>
        </div>
      </div>

      <!-- SUMMARY KPI CARDS -->
      <div class="kpi-grid" style="grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); margin-bottom: 28px;">
        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">PENDING APPROVAL</span>
            <div class="kpi-icon" style="background: #feebc8; color: #dd6b20;"><i class="ri-time-line"></i></div>
          </div>
          <div class="kpi-value">${pendingProps.length}</div>
          <div class="kpi-trend neutral"><i class="ri-shield-keyhole-line"></i> Needs verification</div>
        </div>

        <div class="kpi-card">
          <div class="kpi-header">
            <span class="kpi-title">APPROVED & PUBLISHED</span>
            <div class="kpi-icon" style="background: #e6fffa; color: #319795;"><i class="ri-checkbox-circle-line"></i></div>
          </div>
          <div class="kpi-value">${approvedProps.length}</div>
          <div class="kpi-trend up"><i class="ri-arrow-up-line"></i> Live on website</div>
        </div>
      </div>

      <!-- MAIN PENDING SUBMISSIONS LISTING CARDS -->
      <div class="os-chart-card">
        <div class="os-chart-header" style="display: flex; justify-content: space-between; align-items: center;">
          <span><i class="ri-time-line"></i> Submissions Awaiting Approval (${pendingProps.length})</span>
        </div>

        <div style="padding: 24px;">
          ${pendingProps.length === 0 ? `
            <div style="text-align: center; padding: 48px 24px; color: var(--os-gray-400);">
              <i class="ri-checkbox-circle-fill" style="font-size: 3rem; color: #38a169; margin-bottom: 12px; display: block;"></i>
              <h3 style="font-size: 1.1rem; color: var(--os-charcoal); margin-bottom: 4px;">All Catch Up! No Pending Submissions</h3>
              <p style="font-size: 0.88rem;">All user-submitted properties have been verified and approved.</p>
            </div>
          ` : `
            <div style="display: flex; flex-direction: column; gap: 24px;" id="pending-cards-container">
              ${pendingProps.map(p => renderPendingPropertyCard(p)).join('')}
            </div>
          `}
        </div>
      </div>

    </div>
  `;
}

function renderPendingPropertyCard(p) {
  const defaultImg = (p.images && p.images[0]) || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80';
  
  return `
    <div class="pending-prop-card" style="background: #FAF8F5; border: 1px solid #E7E0D8; border-radius: 16px; padding: 24px; display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start;">
      
      <!-- PROPERTY IMAGE PREVIEW -->
      <div style="width: 100%; height: 170px; border-radius: 12px; overflow: hidden; position: relative;">
        <img src="${defaultImg}" alt="${p.title}" style="width: 100%; height: 100%; object-fit: cover;" />
        <span style="position: absolute; top: 10px; left: 10px; background: rgba(229,46,61,0.9); color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 12px; text-transform: uppercase;">
          ${p.type || 'Property'}
        </span>
      </div>

      <!-- PROPERTY & POSTER DETAILS -->
      <div style="display: flex; flex-direction: column; justify-content: space-between; min-height: 170px;">
        <div>
          <!-- POSTER CREDENTIALS BADGE -->
          <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 10px; flex-wrap: wrap;">
            <span style="background: #2B3648; color: #fff; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 6px; display: inline-flex; align-items: center; gap: 6px;">
              <i class="ri-user-3-line" style="color: #eb5e28;"></i> Posted By: <strong>${p.ownerName || 'Portal User'}</strong>
            </span>
            <span style="background: rgba(49,130,206,0.12); color: #3182ce; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 6px;">
              Role: ${p.listedBy || 'Individual Owner'}
            </span>
            <span style="color: #718096; font-size: 0.78rem; font-weight: 600;">
              <i class="ri-phone-line"></i> ${p.ownerPhone || '9585777772'}
            </span>
          </div>

          <h3 style="font-family: var(--font-sans); font-size: 1.25rem; font-weight: 800; color: #1A202C; margin-bottom: 6px;">
            ${p.title}
          </h3>

          <div style="display: flex; gap: 16px; font-size: 0.88rem; color: #4A5568; margin-bottom: 12px; flex-wrap: wrap;">
            <span><i class="ri-map-pin-line" style="color: #eb5e28;"></i> ${p.location || 'Thanjavur, Tamil Nadu'}</span>
            <span style="font-weight: 800; color: #2b6cb0;">Price: ${p.priceFormatted || '₹ ' + (p.price || 0).toLocaleString('en-IN')}</span>
            <span>Purpose: ${p.purpose === 'rent' ? 'For Rent' : 'For Sale'}</span>
          </div>
        </div>

        <!-- ACTION BUTTONS -->
        <div style="display: flex; gap: 12px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06); flex-wrap: wrap;">
          <button class="preview-approval-btn" data-id="${p.id}" style="
            background: #EDF2F7; color: #2D3748; border: 1px solid #CBD5E0;
            padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem;
            cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.2s ease;
          ">
            <i class="ri-eye-line" style="font-size: 1.1rem; color: #eb5e28;"></i> View Details
          </button>

          <button class="approve-prop-btn" data-id="${p.id}" style="
            background: linear-gradient(135deg, #38A169 0%, #2F855A 100%); color: #ffffff;
            border: none; padding: 10px 22px; border-radius: 10px; font-weight: 700; font-size: 0.88rem;
            cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
            box-shadow: 0 4px 12px rgba(56,161,105,0.25); transition: all 0.2s ease;
          ">
            <i class="ri-checkbox-circle-fill" style="font-size: 1.1rem;"></i> Approve & Publish Live
          </button>
          
          <button class="reject-prop-btn" data-id="${p.id}" style="
            background: #FFF5F5; color: #E52E3D; border: 1px solid #FED7D7;
            padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.88rem;
            cursor: pointer; display: inline-flex; align-items: center; gap: 8px;
            transition: all 0.2s ease;
          ">
            <i class="ri-close-circle-line" style="font-size: 1.1rem;"></i> Reject Submission
          </button>
        </div>
      </div>

    </div>
  `;
}

export function initPropertyApprovalsView() {
  document.querySelectorAll('.preview-approval-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const prop = getProperties().find(p => p.id === id);
      if (prop) openSubmissionPreviewModal(prop);
    });
  });

  document.querySelectorAll('.approve-prop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const res = approveSubmission(id);
      if (res) {
        showToast(`Success! Property ${id} Approved & Published Live to website showcase!`, 'ri-checkbox-circle-fill');
        const container = document.getElementById('os-content');
        if (container) {
          container.innerHTML = renderPropertyApprovalsView();
          initPropertyApprovalsView();
        }
      }
    });
  });

  document.querySelectorAll('.reject-prop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const prop = getProperties().find(p => p.id === id);
      showCustomRejectionReasonModal(id, prop?.title || '', (reason) => {
        rejectSubmission(id, reason);
        showToast(`Property ${id} submission rejected.`, 'ri-close-circle-line');
        const container = document.getElementById('os-content');
        if (container) {
          container.innerHTML = renderPropertyApprovalsView();
          initPropertyApprovalsView();
        }
      });
    });
  });
}

function showCustomRejectionReasonModal(propId, propTitle, onConfirm) {
  document.getElementById('rejection-modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'rejection-modal-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.75) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; width: 100%; max-width: 480px; border-radius: 20px;
      overflow: hidden; box-shadow: 0 24px 48px rgba(0,0,0,0.3); border: 1px solid #E2E8F0;
      animation: pageFadeIn 0.25s ease; padding: 24px; box-sizing: border-box;
    ">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: #FFF5F5; color: #E52E3D; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;">
          <i class="ri-close-circle-fill"></i>
        </div>
        <div>
          <h3 style="font-size: 1.15rem; font-weight: 800; color: #1A202C; margin: 0;">Reject Submission</h3>
          <span style="font-size: 0.8rem; color: #718096;">Property ID: ${propId}</span>
        </div>
      </div>

      <p style="font-size: 0.88rem; color: #4A5568; margin-bottom: 16px;">
        Provide the rejection reason for <strong>${propTitle || propId}</strong>. This feedback will be sent directly to the seller's user dashboard.
      </p>

      <div style="margin-bottom: 20px;">
        <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Rejection Reason</label>
        <textarea id="rejection-reason-input" rows="3" style="
          width: 100%; padding: 10px; border-radius: 10px; border: 1px solid #CBD5E0;
          font-size: 0.88rem; outline: none; box-sizing: border-box; font-family: inherit;
        " placeholder="Enter reason (e.g. Did not meet Patta title legal verification guidelines)">Did not meet Patta title legal verification guidelines</textarea>
      </div>

      <div style="display: flex; justify-content: flex-end; gap: 12px;">
        <button id="cancel-rejection-btn" style="
          padding: 10px 18px; border-radius: 10px; border: 1px solid #CBD5E0; background: #ffffff;
          color: #4A5568; font-weight: 700; font-size: 0.88rem; cursor: pointer;
        ">Cancel</button>

        <button id="confirm-rejection-btn" style="
          padding: 10px 22px; border-radius: 10px; border: none; background: #E52E3D;
          color: #ffffff; font-weight: 700; font-size: 0.88rem; cursor: pointer;
          box-shadow: 0 4px 12px rgba(229,46,61,0.25);
        ">Confirm Rejection</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();
  document.getElementById('cancel-rejection-btn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  document.getElementById('confirm-rejection-btn')?.addEventListener('click', () => {
    const reason = document.getElementById('rejection-reason-input')?.value.trim() || 'Submission did not meet legal Patta verification guidelines.';
    closeModal();
    onConfirm(reason);
  });
}

function openSubmissionPreviewModal(prop) {
  document.getElementById('approval-preview-modal-overlay')?.remove();

  let activeMediaIndex = 0;
  const rawImgs = Array.isArray(prop.images) ? prop.images.filter(Boolean) : [];
  const uniqueImgs = [...new Set(rawImgs)];
  const images = uniqueImgs.length > 0 ? uniqueImgs : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
  const status = prop.status || prop.availability || 'Pending Approval';

  const overlay = document.createElement('div');
  overlay.id = 'approval-preview-modal-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.82) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  function renderModalContent() {
    const totalMedia = images.length;
    if (activeMediaIndex >= totalMedia) activeMediaIndex = 0;
    const currentImg = images[activeMediaIndex] || images[0];

    overlay.innerHTML = `
      <div style="
        background: #ffffff; width: 100%; max-width: 920px; max-height: 90vh; border-radius: 24px;
        overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.5); border: 1px solid #e2e8f0; display: flex; flex-direction: column; animation: pageFadeIn 0.25s ease;
      ">
        
        <!-- Modal Fixed Top Bar -->
        <div style="padding: 18px 28px; background: #faf8f5; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #eb5e28; letter-spacing: 0.08em; text-transform: uppercase;">
              ADMIN PROPERTY PREVIEW • ID: ${prop.id}
            </span>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #1a202c; margin: 2px 0 0 0;">${prop.title}</h3>
          </div>

          <button id="close-approval-preview-btn" type="button" style="background: #ffffff; border: 1px solid #cbd5e0; color: #4a5568; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer;">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div style="padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; flex: 1; background: #F8FAFC;">
          
          <!-- HERO MEDIA VIEWPORT WITH ARROWS (IMAGE 3 MATCH) -->
          <div style="width: 100%;">
            <div style="width: 100%; height: 380px; border-radius: 16px; overflow: hidden; background: #f0f4f8; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              <img src="${currentImg}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;" />

              <!-- Counter Badge -->
              <div style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.8rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; backdrop-filter: blur(4px); display: flex; align-items: center; gap: 6px; z-index: 10;">
                <i class="ri-image-line" style="color: #eb5e28;"></i>
                <span>Photo ${activeMediaIndex + 1} of ${totalMedia}</span>
              </div>

              <!-- Status Badge -->
              <span style="position: absolute; top: 16px; right: 16px; background: #eb5e28; color: #fff; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 20px; z-index: 10; box-shadow: 0 4px 12px rgba(0,0,0,0.25);">
                ${status.toUpperCase()}
              </span>

              <!-- Carousel Arrows -->
              ${totalMedia > 1 ? `
                <button id="prev-approval-media-btn" type="button" style="
                  position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.4rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px); z-index: 10;
                ">
                  <i class="ri-arrow-left-s-line"></i>
                </button>

                <button id="next-approval-media-btn" type="button" style="
                  position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.4rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px); z-index: 10;
                ">
                  <i class="ri-arrow-right-s-line"></i>
                </button>
              ` : ''}
            </div>

            <!-- Thumbnail Grid -->
            ${totalMedia > 1 ? `
              <div style="display: flex; gap: 12px; overflow-x: auto; padding: 14px 4px 6px 4px; margin-top: 12px;">
                ${images.map((img, idx) => `
                  <div class="approval-thumb-item" data-index="${idx}" style="
                    width: 90px; height: 65px; border-radius: 10px; overflow: hidden; flex-shrink: 0; cursor: pointer;
                    border: 2px solid ${idx === activeMediaIndex ? '#eb5e28' : 'transparent'};
                    opacity: ${idx === activeMediaIndex ? '1' : '0.65'}; transition: all 0.2s ease;
                  ">
                    <img src="${img}" style="width: 100%; height: 100%; object-fit: cover;" />
                  </div>
                `).join('')}
              </div>
            ` : ''}
          </div>

          <!-- DETAILS GRID -->
          <div style="background: #ffffff; padding: 20px; border-radius: 16px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
              <div>
                <span style="color: #718096; font-size: 0.88rem;"><i class="ri-map-pin-line" style="color: #eb5e28;"></i> ${prop.location || 'Thanjavur'}</span>
                <div style="font-size: 1.6rem; font-weight: 800; color: #eb5e28; margin-top: 4px;">${prop.priceFormatted || '₹ ' + (prop.price || 0).toLocaleString('en-IN')}</div>
              </div>
              <div style="font-size: 0.88rem; color: #4A5568; font-weight: 700; background: #EDF2F7; padding: 6px 14px; border-radius: 8px;">
                Type: ${prop.type || 'Property'} • Purpose: ${prop.purpose === 'rent' ? 'For Rent' : 'For Sale'}
              </div>
            </div>

            <!-- SPECS PILLS -->
            <div style="display: flex; gap: 12px; flex-wrap: wrap; font-size: 0.85rem; font-weight: 700; color: #2D3748;">
              ${prop.size ? `<span style="background: #F7FAFC; padding: 6px 12px; border-radius: 6px; border: 1px solid #E2E8F0;"><i class="ri-ruler-2-line" style="color: #eb5e28;"></i> ${prop.size}</span>` : ''}
              ${prop.bedrooms ? `<span style="background: #F7FAFC; padding: 6px 12px; border-radius: 6px; border: 1px solid #E2E8F0;"><i class="ri-hotel-bed-line" style="color: #eb5e28;"></i> ${prop.bedrooms} Bedrooms</span>` : ''}
              ${prop.bathrooms ? `<span style="background: #F7FAFC; padding: 6px 12px; border-radius: 6px; border: 1px solid #E2E8F0;"><i class="ri-drop-line" style="color: #eb5e28;"></i> ${prop.bathrooms} Bathrooms</span>` : ''}
              ${prop.furnishing ? `<span style="background: #F7FAFC; padding: 6px 12px; border-radius: 6px; border: 1px solid #E2E8F0;"><i class="ri-armchair-line" style="color: #eb5e28;"></i> ${prop.furnishing}</span>` : ''}
            </div>

            <div style="background: #F8FAFC; padding: 14px 16px; border-radius: 10px; border: 1px solid #E2E8F0;">
              <strong style="font-size: 0.8rem; color: #718096; text-transform: uppercase; display: block; margin-bottom: 4px;">Poster / Owner Details:</strong>
              <span style="font-weight: 700; color: #1A202C;">${prop.ownerName || 'Portal User'} (${prop.listedBy || 'Individual Owner'})</span> • 
              <a href="tel:${prop.ownerPhone}" style="color: #2b6cb0; text-decoration: none; font-weight: 700;">${prop.ownerPhone || 'N/A'}</a>
            </div>

            <div>
              <strong style="font-size: 0.8rem; color: #718096; text-transform: uppercase; display: block; margin-bottom: 4px;">Description:</strong>
              <p style="font-size: 0.9rem; color: #4A5568; line-height: 1.5; margin: 0;">${prop.description || 'No detailed description provided.'}</p>
            </div>

            ${prop.features && prop.features.length > 0 ? `
              <div>
                <strong style="font-size: 0.8rem; color: #718096; text-transform: uppercase; display: block; margin-bottom: 6px;">Features & Assurances:</strong>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${prop.features.map(f => `<span style="background: #E6FFFA; color: #234E52; font-size: 0.78rem; font-weight: 700; padding: 4px 10px; border-radius: 6px;"><i class="ri-checkbox-circle-fill" style="color: #38A169;"></i> ${f}</span>`).join('')}
                </div>
              </div>
            ` : ''}
          </div>
        </div>

        <!-- FOOTER BUTTONS -->
        <div style="padding: 16px 28px; background: #faf8f5; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px;">
          <button id="modal-approve-btn" type="button" style="
            background: linear-gradient(135deg, #38A169 0%, #2F855A 100%); color: #ffffff; border: none;
            padding: 10px 24px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer;
            box-shadow: 0 4px 12px rgba(56,161,105,0.25);
          ">
            <i class="ri-checkbox-circle-fill"></i> Approve & Publish Live
          </button>
          
          <button id="modal-close-preview-btn" type="button" style="
            background: #ffffff; color: #4A5568; border: 1px solid #CBD5E0;
            padding: 10px 20px; border-radius: 10px; font-weight: 700; font-size: 0.9rem; cursor: pointer;
          ">
            Close Preview
          </button>
        </div>
      </div>
    `;

    bindModalEvents();
  }

  function bindModalEvents() {
    const closeModal = () => overlay.remove();
    document.getElementById('close-approval-preview-btn')?.addEventListener('click', closeModal);
    document.getElementById('modal-close-preview-btn')?.addEventListener('click', closeModal);

    document.getElementById('prev-approval-media-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      activeMediaIndex = (activeMediaIndex - 1 + images.length) % images.length;
      renderModalContent();
    });

    document.getElementById('next-approval-media-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      activeMediaIndex = (activeMediaIndex + 1) % images.length;
      renderModalContent();
    });

    overlay.querySelectorAll('.approval-thumb-item').forEach(thumb => {
      thumb.addEventListener('click', (e) => {
        e.stopPropagation();
        const idx = parseInt(thumb.dataset.index, 10);
        if (!isNaN(idx)) {
          activeMediaIndex = idx;
          renderModalContent();
        }
      });
    });

    document.getElementById('modal-approve-btn')?.addEventListener('click', (e) => {
      e.stopPropagation();
      approveSubmission(prop.id);
      showToast(`Success! Property ${prop.id} Approved & Published Live!`, 'ri-checkbox-circle-fill');
      closeModal();
      const container = document.getElementById('os-content');
      if (container) {
        container.innerHTML = renderPropertyApprovalsView();
        initPropertyApprovalsView();
      }
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  renderModalContent();
  document.body.appendChild(overlay);
}
