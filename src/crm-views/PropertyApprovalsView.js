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
        <div style="display: flex; gap: 12px; padding-top: 14px; border-top: 1px solid rgba(0,0,0,0.06);">
          <button class="os-btn primary-btn approve-prop-btn" data-id="${p.id}" style="background: #38a169; border-color: #38a169;">
            <i class="ri-checkbox-circle-line"></i> Approve & Publish Live
          </button>
          
          <button class="os-btn secondary-btn reject-prop-btn" data-id="${p.id}" style="color: #E52E3D; border-color: #E52E3D;">
            <i class="ri-close-circle-line"></i> Reject Submission
          </button>
        </div>
      </div>

    </div>
  `;
}

export function initPropertyApprovalsView() {
  document.querySelectorAll('.approve-prop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const res = approveSubmission(id);
      if (res) {
        showToast(`Success! Property ${id} Approved & Published Live to website showcase!`, 'ri-checkbox-circle-fill');
        window.location.reload();
      }
    });
  });

  document.querySelectorAll('.reject-prop-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.dataset.id;
      const reason = prompt('Enter rejection reason for user:', 'Did not meet Patta title legal verification guidelines');
      if (reason) {
        rejectSubmission(id, reason);
        showToast(`Property ${id} submission rejected.`, 'ri-close-circle-line');
        window.location.reload();
      }
    });
  });
}
