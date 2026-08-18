import { getCurrentUser, logoutUser } from './utils/userAuthStore.js';
import { getProperties, addProperty, updateProperty, deleteProperty } from './utils/propertiesStore.js';
import { showToast } from './utils/toast.js';

let userUploadedImages = [];
let userUploadedVideoUrl = '';

export function renderUserDashboard() {
  const user = getCurrentUser() || {
    fullName: 'Kani Digitechzo',
    email: 'kanidigitechzo@gmail.com',
    phone: '9585777772',
    role: 'Individual Owner',
    propertiesCount: 3,
    visitorsCount: 142,
    buyersCount: 18
  };

  const allProps = getProperties();
  const userProps = allProps.filter(p => p.ownerName === user.fullName || p.ownerPhone === user.phone || p.listedBy === user.fullName);
  const pendingProps = userProps.filter(p => p.approvalStatus === 'Pending Approval' || p.status === 'Pending Approval');
  const approvedProps = userProps.filter(p => p.approvalStatus === 'Approved' || p.status === 'Available');

  return `
    <div class="user-db-wrapper">
      
      <!-- LEFT DARK SLATE SIDEBAR -->
      <aside class="user-sidebar">
        <div class="user-sidebar-header">
          <a href="/" class="user-brand-link">
            <img src="/thanjai-official-new.png" alt="Thanjai Property Logo" class="user-brand-logo" />
          </a>
        </div>

        <!-- USER PROFILE AVATAR CARD -->
        <div class="user-profile-card">
          <div class="avatar-frame">
            <i class="ri-user-3-line avatar-icon"></i>
          </div>
          <div class="user-info">
            <h3 class="user-name">Hi! ${user.fullName}</h3>
            <span class="user-role-badge">${user.role || 'Individual Owner'}</span>
          </div>
        </div>

        <!-- SIDEBAR NAVIGATION MENU -->
        <nav class="user-nav">
          <a href="/" class="user-nav-item">
            <i class="ri-home-4-line"></i>
            <span>Home</span>
          </a>
          <a href="#my-properties" class="user-nav-item active" data-tab="my-properties">
            <i class="ri-stack-line"></i>
            <span>My Properties (${userProps.length})</span>
          </a>
          <a href="#post-property" class="user-nav-item" data-tab="post-property" id="sidebar-post-btn">
            <i class="ri-add-circle-line"></i>
            <span>Post Property</span>
          </a>
          <a href="#buyers-list" class="user-nav-item" data-tab="buyers-list">
            <i class="ri-user-search-line"></i>
            <span>Buyers Inquiries</span>
          </a>
          <a href="#profile" class="user-nav-item" data-tab="profile">
            <i class="ri-lock-password-line"></i>
            <span>Profile & Password</span>
          </a>
          <button class="user-nav-item logout-btn" id="user-logout-btn">
            <i class="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <!-- MAIN CONTENT AREA -->
      <main class="user-main-area">
        
        <!-- TOP HEADER BAR -->
        <header class="user-top-bar">
          <div style="font-size: 0.9rem; color: #718096; font-weight: 600;">
            <a href="/" style="text-decoration: none; color: #718096;">Thanjai Property</a> &nbsp;/&nbsp; Client Portal Workspace
          </div>

          <div style="display: flex; gap: 12px; align-items: center;">
            <button class="post-prop-header-btn" id="top-post-btn">
              <i class="ri-add-line"></i> Post New Property
            </button>
          </div>
        </header>

        <div class="user-content-body">
          
          <!-- LIVE APPROVAL NOTIFICATION BANNER -->
          ${approvedProps.length > 0 ? `
            <div style="background: #E6FFFA; border: 1px solid #B2F5EA; color: #234E52; padding: 14px 20px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px;">
              <div style="display: flex; align-items: center; gap: 12px; font-weight: 700; font-size: 0.92rem;">
                <i class="ri-checkbox-circle-fill" style="color: #38A169; font-size: 1.3rem;"></i>
                <span>Notice: You have <strong>${approvedProps.length} property</strong> approved & live on public showcase!</span>
              </div>
              <span style="font-size: 0.8rem; background: #38A169; color: #fff; padding: 4px 10px; border-radius: 20px; font-weight: 800;">VERIFIED LIVE</span>
            </div>
          ` : ''}

          <!-- TOP KPI STAT CARDS -->
          <div class="user-kpi-grid">
            <div class="kpi-card">
              <div class="kpi-card-inner">
                <div class="kpi-icon-box orange">
                  <i class="ri-stack-line"></i>
                </div>
                <div>
                  <h4 class="kpi-title">Total Submitted</h4>
                  <div class="kpi-val">${userProps.length} Properties</div>
                </div>
              </div>
              <div class="kpi-footer-link" id="kpi-prop-link">
                Manage Properties <i class="ri-arrow-right-s-line"></i>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-card-inner">
                <div class="kpi-icon-box yellow" style="background: #FEEBC8; color: #DD6B20;">
                  <i class="ri-time-line"></i>
                </div>
                <div>
                  <h4 class="kpi-title">Awaiting Approval</h4>
                  <div class="kpi-val">${pendingProps.length} Pending</div>
                </div>
              </div>
              <div class="kpi-footer-link" id="kpi-pending-link">
                Pending Verification <i class="ri-arrow-right-s-line"></i>
              </div>
            </div>

            <div class="kpi-card">
              <div class="kpi-card-inner">
                <div class="kpi-icon-box green">
                  <i class="ri-group-line"></i>
                </div>
                <div>
                  <h4 class="kpi-title">Interested Buyers</h4>
                  <div class="kpi-val">${user.buyersCount || 18} Inquiries</div>
                </div>
              </div>
              <div class="kpi-footer-link" id="kpi-buyers-link">
                View Buyers <i class="ri-arrow-right-s-line"></i>
              </div>
            </div>
          </div>

          <!-- MAIN DATA PANEL -->
          <div class="user-data-panel" style="width: 100%; box-sizing: border-box;">
            <div class="panel-header">
              <h2 class="panel-title" id="panel-title-text">My Listed Properties</h2>
              <span class="panel-subtitle" id="panel-sub-text">Properties uploaded under your seller account with live approval status</span>
            </div>

            <div class="panel-body" id="panel-body-content" style="width: 100%; box-sizing: border-box;">
              ${renderMyPropertiesTableHtml(userProps)}
            </div>
          </div>

        </div>
      </main>

    </div>
  `;
}

function renderMyPropertiesTableHtml(userProps) {
  if (userProps.length === 0) {
    return `
      <div style="padding: 48px; text-align: center; color: #718096;">
        <i class="ri-building-line" style="font-size: 3rem; color: #eb5e28; margin-bottom: 12px; display: block;"></i>
        <h3 style="font-size: 1.1rem; color: #1A202C; margin-bottom: 6px;">No Properties Uploaded Yet</h3>
        <p style="font-size: 0.9rem; margin-bottom: 20px;">Upload your land or house to reach verified buyers across Tamil Nadu.</p>
        <button class="post-prop-header-btn" id="empty-post-btn">
          <i class="ri-add-line"></i> Post Your First Property
        </button>
      </div>
    `;
  }

  return `
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th>Property ID</th>
            <th>Title</th>
            <th>Type</th>
            <th>Location</th>
            <th>Expected Price</th>
            <th>Approval Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          ${userProps.map(p => {
            const isPending = p.approvalStatus === 'Pending Approval' || p.status === 'Pending Approval';
            const isApproved = p.approvalStatus === 'Approved' || p.status === 'Available';
            const isRejected = p.approvalStatus === 'Rejected';

            return `
              <tr>
                <td style="font-weight: 700; color: #eb5e28;">${p.id}</td>
                <td style="font-weight: 700;">${p.title}</td>
                <td>${p.type || 'Property'}</td>
                <td>${p.location || 'Thanjavur'}</td>
                <td style="font-weight: 700; color: #2b6cb0;">${p.priceFormatted || '₹ ' + (p.price || 0).toLocaleString('en-IN')}</td>
                <td>
                  ${isPending ? `
                    <span style="background: #FEEBC8; color: #C05621; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="ri-time-line"></i> Pending Admin Approval
                    </span>
                  ` : isApproved ? `
                    <span style="background: #E6FFFA; color: #234E52; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="ri-checkbox-circle-fill" style="color: #38A169;"></i> Approved & Published Live
                    </span>
                  ` : `
                    <span style="background: #FED7D7; color: #9B2C2C; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="ri-close-circle-fill"></i> ${isRejected ? 'Rejected' : p.status}
                    </span>
                  `}
                </td>
                <td>
                  <div style="display: flex; gap: 8px;">
                    <button class="user-edit-prop-btn" data-id="${p.id}" style="background: rgba(49,130,206,0.12); color: #3182ce; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="ri-pencil-line"></i> Edit
                    </button>

                    <button class="user-delete-prop-btn" data-id="${p.id}" style="background: rgba(229,46,61,0.12); color: #E52E3D; border: none; padding: 6px 12px; border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">
                      <i class="ri-delete-bin-line"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// FULL PROPERTY FORM PRE-FILLED FOR ADD OR EDIT
function renderPostPropertyFormHtml(propToEdit = null) {
  const isEdit = Boolean(propToEdit);
  userUploadedImages = propToEdit?.images ? [...propToEdit.images] : [];
  userUploadedVideoUrl = propToEdit?.videoUrl || '';

  const currentType = propToEdit?.type || '';
  const val = currentType.toLowerCase();
  const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room'];
  const isRes = resKeywords.some(k => val.includes(k)) || currentType === 'Villa';

  return `
    <div style="background: #FAF8F5; border: 1px solid #E7E0D8; border-radius: 16px; padding: 32px; width: 100%; max-width: 980px; margin: 0 auto; box-sizing: border-box;">
      <div style="margin-bottom: 28px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: #eb5e28; letter-spacing: 0.08em; text-transform: uppercase;">
            ${isEdit ? `EDITING PROPERTY ID: ${propToEdit.id}` : 'PROPERTIES INVENTORY SUBMISSION FORM'}
          </span>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: #1A202C; margin-top: 4px;">
            ${isEdit ? `Edit Property (${propToEdit.id})` : 'Post Property Listing'}
          </h3>
        </div>

        ${isEdit ? `
          <button id="cancel-edit-btn" style="background: #FFF; border: 1px solid #CBD5E0; color: #4A5568; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer;">
            <i class="ri-arrow-left-line"></i> Cancel Edit
          </button>
        ` : ''}
      </div>

      <form id="client-post-prop-form" style="display: flex; flex-direction: column; gap: 28px;">
        
        <!-- SECTION 1: BASICS -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            1. PROPERTY BASICS & LOCATION
          </h4>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
            <div style="grid-column: 1 / -1;">
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Title *</label>
              <input type="text" id="user-prop-title" required value="${propToEdit?.title || ''}" placeholder="e.g. 3BHK Luxury Villa with Garden & Car Parking" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Property Type (Text Input) *</label>
              <input type="text" id="user-prop-type" required value="${propToEdit?.type || ''}" placeholder="e.g. Villa, House, Apartment, Land, Plot..." style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Category / Purpose *</label>
              <select id="user-prop-category" required style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; background: #fff; box-sizing: border-box;">
                <option value="Sale" ${propToEdit?.categoryRaw === 'Sale' || propToEdit?.purpose === 'buy' ? 'selected' : ''}>Sale (Buy)</option>
                <option value="Rent" ${propToEdit?.categoryRaw === 'Rent' || propToEdit?.purpose === 'rent' ? 'selected' : ''}>Rent</option>
                <option value="Lease" ${propToEdit?.categoryRaw === 'Lease' ? 'selected' : ''}>Lease</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">City / District *</label>
              <input type="text" id="user-prop-district" required value="${propToEdit?.district || ''}" placeholder="e.g. Thanjavur" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Location / Area Name *</label>
              <input type="text" id="user-prop-location" required value="${propToEdit?.location || ''}" placeholder="e.g. Medical College Road, Thanjavur" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div style="grid-column: 1 / -1;">
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Street Address & Landmark</label>
              <input type="text" id="user-prop-address" value="${propToEdit?.address || ''}" placeholder="e.g. Door No. 42, 2nd Cross Street, Opposite New Bus Stand" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Area / Size (sqft or acres) *</label>
              <input type="text" id="user-prop-size" required value="${propToEdit?.size || ''}" placeholder="e.g. 2,600 sqft or 4.5 Acres" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>
          </div>
        </div>

        <!-- DYNAMIC RESIDENTIAL STRUCTURE DETAILS -->
        <div id="user-res-specs-box" style="background: #FFF; padding: 20px; border-radius: 12px; border: 1px dashed #CBD5E0; display: ${isRes ? 'block' : 'none'};">
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 14px;">
            RESIDENTIAL STRUCTURE & FLOOR DETAILS
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Bedrooms</label>
              <input type="number" id="user-prop-bedrooms" value="${propToEdit?.bedrooms || 3}" placeholder="e.g. 3" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Bathrooms</label>
              <input type="number" id="user-prop-bathrooms" value="${propToEdit?.bathrooms || 3}" placeholder="e.g. 3" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Floor Number (Optional)</label>
              <input type="text" id="user-prop-floor" value="${propToEdit?.floor || ''}" placeholder="e.g. 2nd Floor (Optional)" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Furnishing Status</label>
              <select id="user-prop-furnishing" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; background: #fff; box-sizing: border-box;">
                <option value="Fully Furnished" ${propToEdit?.furnishing === 'Fully Furnished' ? 'selected' : ''}>Fully Furnished</option>
                <option value="Semi-Furnished" ${propToEdit?.furnishing === 'Semi-Furnished' || !propToEdit ? 'selected' : ''}>Semi-Furnished</option>
                <option value="Unfurnished" ${propToEdit?.furnishing === 'Unfurnished' ? 'selected' : ''}>Unfurnished</option>
                <option value="Not specified" ${propToEdit?.furnishing === 'Not specified' ? 'selected' : ''}>Not specified</option>
              </select>
            </div>
          </div>
        </div>

        <!-- SECTION 2: FINANCIALS -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            2. EXPECTED PRICE
          </h4>
          <div style="max-width: 360px;">
            <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">EXPECTED PRICE IN INR (₹) *</label>
            <input type="number" id="user-prop-price" required value="${propToEdit?.price || ''}" placeholder="e.g. 7500000" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
          </div>
        </div>

        <!-- SECTION 3: PHOTOS & GALLERY -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            3. PROPERTY PHOTOS & GALLERY
          </h4>
          
          <div style="display: flex; flex-direction: column; gap: 14px;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Photo Image URL</label>
              <input type="url" id="user-prop-img-url" value="${propToEdit?.images && propToEdit.images[0] ? propToEdit.images[0] : ''}" placeholder="https://images.unsplash.com/photo-..." style="width: 100%; padding: 12px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Or Upload Photo Files</label>
              <input type="file" id="user-prop-img-files" accept="image/*" multiple style="width: 100%; padding: 10px 14px; font-size: 0.88rem; border-radius: 10px; border: 1px solid #CBD5E0; background: #fff; box-sizing: border-box;" />
            </div>

            <div id="user-uploaded-preview-grid" style="display: flex; gap: 12px; flex-wrap: wrap; margin-top: 10px;">
              ${userUploadedImages.map(img => `
                <div style="width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E0;">
                  <img src="${img}" style="width:100%; height:100%; object-fit:cover;" />
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- SECTION 4: VIDEO & LOCATION PINPOINT MAP -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            4. VIDEO & LOCATION PINPOINT MAP
          </h4>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">YouTube Video Link</label>
              <input type="url" id="user-prop-videolink" value="${propToEdit?.videoUrl || ''}" placeholder="https://youtube.com/watch?v=..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Upload Video File</label>
              <label style="display: flex; align-items: center; gap: 8px; padding: 10px 14px; border-radius: 10px; background: #FFF; border: 1px dashed #CBD5E0; color: #4A5568; font-weight: 600; font-size: 0.88rem; cursor: pointer;">
                <i class="ri-video-upload-line" style="color: #eb5e28; font-size: 1.2rem;"></i>
                <span id="user-video-label-text">${propToEdit?.videoUrl ? 'Video Attached' : 'Upload Video (.mp4)'}</span>
                <input type="file" id="user-prop-video-file-input" accept="video/*" style="display: none;" />
              </label>
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Latitude (GPS)</label>
              <input type="text" id="user-prop-latitude" value="${propToEdit?.latitude || ''}" placeholder="e.g. 10.786999" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Longitude (GPS)</label>
              <input type="text" id="user-prop-longitude" value="${propToEdit?.longitude || ''}" placeholder="e.g. 79.137827" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>
          </div>

          <!-- LOCATION MAP BUTTONS -->
          <div style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap;">
            <button type="button" id="user-geolocation-btn" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; background: #FFF; border: 1px solid #CBD5E0; color: #2D3748; font-weight: 600; font-size: 0.88rem; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <i class="ri-map-pin-user-fill" style="color: #eb5e28; font-size: 1.1rem;"></i>
              <span>Use my current location</span>
            </button>

            <button type="button" id="user-map-pinpoint-btn" style="display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; border-radius: 10px; background: #FFF; border: 1px solid #CBD5E0; color: #2D3748; font-weight: 600; font-size: 0.88rem; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.04);">
              <i class="ri-compass-3-fill" style="color: #3182CE; font-size: 1.1rem;"></i>
              <span>Select Location on Interactive Map</span>
            </button>
          </div>
        </div>

        <!-- SECTION 5: DESCRIPTION & FEATURES -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            5. DESCRIPTION & LEGAL AMENITIES
          </h4>
          
          <div style="margin-bottom: 18px;">
            <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Detailed Property Description</label>
            <textarea id="user-prop-desc" rows="4" placeholder="Describe architectural layout, Patta legal documents, surrounding landmarks, water source, and neighborhood highlights..." style="width: 100%; padding: 12px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;">${propToEdit?.description || ''}</textarea>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; background: #FFF; padding: 16px; border-radius: 10px; border: 1px solid #E2E8F0;">
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" class="user-feature-chk" value="Patta Title Verified" checked /> Patta Legal Title
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" class="user-feature-chk" value="DTCP Approved" checked /> DTCP Approved Layout
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" class="user-feature-chk" value="24/7 Security" checked /> 24/7 Security
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" class="user-feature-chk" value="Water Supply" checked /> Continuous Water Supply
            </label>
            <label style="display: flex; align-items: center; gap: 8px; font-size: 0.88rem; font-weight: 600; cursor: pointer;">
              <input type="checkbox" class="user-feature-chk" value="Car Parking" checked /> Car Parking Space
            </label>
          </div>
        </div>

        <!-- SUBMISSION SUBMIT BUTTON -->
        <div style="padding-top: 16px; border-top: 1px solid #E2E8F0;">
          <button type="submit" class="post-prop-header-btn" style="padding: 16px 36px; font-size: 1.05rem; border-radius: 12px;">
            <i class="ri-send-plane-fill"></i> ${isEdit ? 'Update & Submit Changes' : 'Submit Property for Admin Approval'}
          </button>
        </div>

      </form>
    </div>
  `;
}

function renderProfileSettingsFormHtml(user) {
  return `
    <div style="background: #FAF8F5; border: 1px solid #E7E0D8; border-radius: 16px; padding: 28px; width: 100%; max-width: 980px; margin: 0 auto; box-sizing: border-box;">
      <div style="margin-bottom: 24px;">
        <h3 style="font-size: 1.3rem; font-weight: 800; color: #1A202C;">Profile & Security Settings</h3>
        <p style="font-size: 0.88rem; color: #718096;">Update your portal account credentials, contact phone, and security password.</p>
      </div>

      <form id="profile-password-form" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px;">
        
        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">FULL NAME</label>
          <input type="text" id="prof-name" value="${user.fullName}" required style="width: 100%; padding: 12px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.95rem;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">EMAIL ADDRESS</label>
          <input type="email" id="prof-email" value="${user.email}" readonly style="width: 100%; padding: 12px 14px; border: 1px solid #E2E8F0; background: #EDF2F7; border-radius: 8px; font-size: 0.95rem; color: #718096;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">MOBILE PHONE</label>
          <input type="tel" id="prof-phone" value="${user.phone || '9585777772'}" required style="width: 100%; padding: 12px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.95rem;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">ACCOUNT ROLE</label>
          <input type="text" value="${user.role || 'Individual Owner'}" readonly style="width: 100%; padding: 12px 14px; border: 1px solid #E2E8F0; background: #EDF2F7; border-radius: 8px; font-size: 0.95rem; color: #718096;" />
        </div>

        <div style="grid-column: 1 / -1; margin-top: 12px; padding-top: 20px; border-top: 1px solid #E2E8F0;">
          <h4 style="font-size: 1.05rem; font-weight: 800; color: #1A202C; margin-bottom: 14px;">Change Security Password</h4>
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">CURRENT PASSWORD</label>
          <input type="password" id="pass-current" placeholder="••••••••" style="width: 100%; padding: 12px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.95rem;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">NEW PASSWORD</label>
          <input type="password" id="pass-new" placeholder="Enter new password" style="width: 100%; padding: 12px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.95rem;" />
        </div>

        <div>
          <label style="display: block; font-size: 0.82rem; font-weight: 800; color: #4A5568; margin-bottom: 6px;">CONFIRM NEW PASSWORD</label>
          <input type="password" id="pass-confirm" placeholder="Confirm new password" style="width: 100%; padding: 12px 14px; border: 1px solid #CBD5E0; border-radius: 8px; font-size: 0.95rem;" />
        </div>

        <div style="grid-column: 1 / -1;">
          <button type="submit" class="post-prop-header-btn" style="padding: 14px 32px; font-size: 1rem;">
            <i class="ri-shield-keyhole-line"></i> Save Profile & Password Changes
          </button>
        </div>

      </form>
    </div>
  `;
}

export function initUserDashboard() {
  const app = document.getElementById('user-db-app');
  if (!app) return;
  app.innerHTML = renderUserDashboard();

  const user = getCurrentUser() || { fullName: 'Kani Digitechzo', phone: '9585777772' };
  const navItems = document.querySelectorAll('.user-nav-item[data-tab]');
  const panelTitle = document.getElementById('panel-title-text');
  const panelSub = document.getElementById('panel-sub-text');
  const panelBody = document.getElementById('panel-body-content');

  function bindTabClick(tab) {
    if (tab === 'my-properties') {
      if (panelTitle) panelTitle.textContent = 'My Listed Properties';
      if (panelSub) panelSub.textContent = 'Properties uploaded under your seller account with live approval status';
      refreshMyProperties();
    } else if (tab === 'post-property') {
      if (panelTitle) panelTitle.textContent = 'Post Property for Approval';
      if (panelSub) panelSub.textContent = 'Submit your land or property details for fast Patta verification and admin approval';
      if (panelBody) {
        panelBody.innerHTML = renderPostPropertyFormHtml();
        attachPostFormListener();
      }
    } else if (tab === 'profile') {
      if (panelTitle) panelTitle.textContent = 'Profile & Password Settings';
      if (panelSub) panelSub.textContent = 'Manage your contact details and security login password';
      if (panelBody) {
        panelBody.innerHTML = renderProfileSettingsFormHtml(user);
        attachProfileFormListener();
      }
    } else if (tab === 'buyers-list') {
      location.reload();
    }
  }

  function refreshMyProperties() {
    const allProps = getProperties();
    const userProps = allProps.filter(p => p.ownerName === user.fullName || p.ownerPhone === user.phone || p.listedBy === user.fullName);
    if (panelBody) panelBody.innerHTML = renderMyPropertiesTableHtml(userProps);
    bindTableActions();
  }

  function bindTableActions() {
    document.getElementById('empty-post-btn')?.addEventListener('click', () => {
      document.querySelector('[data-tab="post-property"]')?.click();
    });

    // EDIT PROPERTY ACTION
    document.querySelectorAll('.user-edit-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const targetProp = getProperties().find(p => p.id === id);
        if (targetProp) {
          if (panelTitle) panelTitle.textContent = `Edit Property (${id})`;
          if (panelSub) panelSub.textContent = 'Modify your property specs, price, location, or uploaded photos';
          if (panelBody) {
            panelBody.innerHTML = renderPostPropertyFormHtml(targetProp);
            attachPostFormListener(targetProp);
          }
        }
      });
    });

    // DELETE PROPERTY ACTION
    document.querySelectorAll('.user-delete-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (confirm(`Are you sure you want to delete property listing ${id}?`)) {
          deleteProperty(id);
          showToast(`Property listing ${id} deleted successfully.`, 'ri-delete-bin-line');
          refreshMyProperties();
        }
      });
    });
  }

  bindTableActions();

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      bindTabClick(item.dataset.tab);
    });
  });

  function attachPostFormListener(propToEdit = null) {
    const isEdit = Boolean(propToEdit);
    const typeInput = document.getElementById('user-prop-type');
    const specsBox = document.getElementById('user-res-specs-box');
    const fileInput = document.getElementById('user-prop-img-files');
    const previewGrid = document.getElementById('user-uploaded-preview-grid');
    const videoFileInput = document.getElementById('user-prop-video-file-input');
    const videoLabelText = document.getElementById('user-video-label-text');
    const geoBtn = document.getElementById('user-geolocation-btn');
    const mapPinBtn = document.getElementById('user-map-pinpoint-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');

    cancelEditBtn?.addEventListener('click', () => {
      document.querySelector('[data-tab="my-properties"]')?.click();
    });

    // SMART REAL-TIME TYPING DETECTION FOR PROPERTY TYPE
    typeInput?.addEventListener('input', () => {
      const val = (typeInput.value || '').toLowerCase();
      const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room'];
      const landKeywords = ['land', 'plot', 'acre', 'agricultural', 'farm', 'site', 'commercial', 'office', 'warehouse'];

      const isRes = resKeywords.some(k => val.includes(k));
      const isLand = landKeywords.some(k => val.includes(k));

      if (isRes || (!isLand && val.length >= 2)) {
        if (specsBox) specsBox.style.display = 'block';
      } else if (isLand) {
        if (specsBox) specsBox.style.display = 'none';
      }
    });

    // PHOTO FILES READER
    fileInput?.addEventListener('change', (e) => {
      const files = Array.from(e.target.files);
      files.forEach(f => {
        const reader = new FileReader();
        reader.onload = (evt) => {
          const b64 = evt.target.result;
          userUploadedImages.push(b64);
          if (previewGrid) {
            const thumb = document.createElement('div');
            thumb.style.cssText = 'width: 80px; height: 80px; border-radius: 8px; overflow: hidden; border: 1px solid #CBD5E0;';
            thumb.innerHTML = `<img src="${b64}" style="width:100%; height:100%; object-fit:cover;" />`;
            previewGrid.appendChild(thumb);
          }
        };
        reader.readAsDataURL(f);
      });
    });

    // VIDEO FILE READER
    videoFileInput?.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          userUploadedVideoUrl = evt.target.result;
          if (videoLabelText) videoLabelText.textContent = `Video Uploaded (${file.name})`;
          showToast('Video file attached successfully!', 'ri-video-upload-line');
        };
        reader.readAsDataURL(file);
      }
    });

    // GEOLOCATION BUTTON
    geoBtn?.addEventListener('click', () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude.toFixed(6);
            const lng = pos.coords.longitude.toFixed(6);
            const latInp = document.getElementById('user-prop-latitude');
            const lngInp = document.getElementById('user-prop-longitude');
            if (latInp) latInp.value = lat;
            if (lngInp) lngInp.value = lng;
            showToast(`Location captured: Lat ${lat}, Lng ${lng}`, 'ri-map-pin-user-fill');
          },
          () => {
            showToast('Geolocation permission denied or unavailable.', 'ri-error-warning-line');
          }
        );
      }
    });

    // MAP PINPOINT BUTTON
    mapPinBtn?.addEventListener('click', () => {
      const latInp = document.getElementById('user-prop-latitude');
      const lngInp = document.getElementById('user-prop-longitude');
      if (latInp && !latInp.value) latInp.value = '10.786999';
      if (lngInp && !lngInp.value) lngInp.value = '79.137827';
      showToast('Map Pinpoint helper attached. Coordinates set to Thanjavur center.', 'ri-compass-3-fill');
    });

    // FORM SUBMISSION HANDLER
    const form = document.getElementById('client-post-prop-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('user-prop-title').value;
      const type = document.getElementById('user-prop-type').value;
      const categoryRaw = document.getElementById('user-prop-category').value;
      const district = document.getElementById('user-prop-district').value;
      const location = document.getElementById('user-prop-location').value;
      const address = document.getElementById('user-prop-address').value;
      const size = document.getElementById('user-prop-size').value;
      const bedrooms = parseInt(document.getElementById('user-prop-bedrooms')?.value || 0);
      const bathrooms = parseInt(document.getElementById('user-prop-bathrooms')?.value || 0);
      const floor = document.getElementById('user-prop-floor')?.value || '';
      const furnishing = document.getElementById('user-prop-furnishing')?.value || 'Not specified';
      const price = parseFloat(document.getElementById('user-prop-price').value) || 5000000;
      const imgUrl = document.getElementById('user-prop-img-url').value;
      const videoUrl = document.getElementById('user-prop-videolink')?.value || userUploadedVideoUrl;
      const latitude = document.getElementById('user-prop-latitude')?.value || '10.786999';
      const longitude = document.getElementById('user-prop-longitude')?.value || '79.137827';
      const desc = document.getElementById('user-prop-desc').value;

      const features = Array.from(document.querySelectorAll('.user-feature-chk:checked')).map(c => c.value);

      const images = [...userUploadedImages];
      if (imgUrl && !images.includes(imgUrl)) images.unshift(imgUrl);
      if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
      }

      const val = type.toLowerCase();
      const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room'];
      const isRes = resKeywords.some(k => val.includes(k));

      const payload = {
        title,
        type,
        purpose: categoryRaw === 'Rent' ? 'rent' : 'buy',
        category: categoryRaw === 'Rent' ? 'Rent' : 'Sale',
        categoryRaw,
        district,
        location,
        address,
        size,
        bedrooms: isRes ? bedrooms : null,
        bathrooms: isRes ? bathrooms : null,
        floor: floor || null,
        furnishing,
        price,
        images,
        videoUrl,
        latitude,
        longitude,
        description: desc || `${title} located at ${location}.`,
        features: features.length > 0 ? features : ['Patta Title Verified', '24/7 Security'],
        ownerName: user.fullName,
        ownerPhone: user.phone || '9585777772',
        listedBy: user.role || 'Individual Owner',
        approvalStatus: isEdit ? (propToEdit.approvalStatus || 'Pending Approval') : 'Pending Approval',
        status: isEdit ? (propToEdit.status || 'Pending Approval') : 'Pending Approval'
      };

      if (isEdit) {
        updateProperty(propToEdit.id, payload);
        showToast(`Property ${propToEdit.id} updated successfully!`, 'ri-checkbox-circle-fill');
      } else {
        const newP = addProperty(payload);
        showToast(`Property ${newP.id} submitted! Awaiting admin approval before live publishing.`, 'ri-time-line');
      }

      document.querySelector('[data-tab="my-properties"]')?.click();
    });
  }

  function attachProfileFormListener() {
    const form = document.getElementById('profile-password-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Profile & security password updated successfully!', 'ri-checkbox-circle-fill');
    });
  }

  // Logout Handler
  document.getElementById('user-logout-btn')?.addEventListener('click', () => {
    logoutUser();
    window.location.href = '/login.html';
  });

  document.getElementById('top-post-btn')?.addEventListener('click', () => {
    document.querySelector('[data-tab="post-property"]')?.click();
  });
  document.getElementById('kpi-prop-link')?.addEventListener('click', () => {
    document.querySelector('[data-tab="my-properties"]')?.click();
  });
}

document.addEventListener('DOMContentLoaded', initUserDashboard);
