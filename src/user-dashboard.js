import { getCurrentUser, logoutUser, setCurrentUser, getRegisteredUsers, updateUserPassword } from './utils/userAuthStore.js';
import { getProperties, addProperty, updateProperty, deleteProperty } from './utils/propertiesStore.js';
import { showToast } from './utils/toast.js';

let userUploadedImages = [];
let userUploadedVideoUrl = '';
let userActivePreviewId = null;
let userActiveMediaIndex = 0;
let currentSelectedAdType = 'free';

const defaultBuyersInquiries = [
  {
    id: 'INQ-101',
    buyerName: 'Senthil Kumar',
    buyerRole: 'Verified Buyer',
    phone: '+91 98421 88921',
    email: 'senthil.k@gmail.com',
    propertyTitle: '3BHK Luxury Villa with Garden & Car Parking',
    propId: 'TP-2001',
    offeredPrice: '₹ 1.30 Crore',
    visitDate: '20 Aug 2026 at 10:30 AM',
    status: 'Site Visit Requested',
    message: 'Interested in visiting the property on Sunday morning with family.'
  },
  {
    id: 'INQ-102',
    buyerName: 'Dr. Rajan Saravanan',
    buyerRole: 'NRI Investor',
    phone: '+91 94431 22841',
    email: 'dr.rajan.nri@yahoo.com',
    propertyTitle: 'Kaveri Riverfront Agricultural Farmland',
    propId: 'TP-2003',
    offeredPrice: '₹ 45.00 Lakhs',
    visitDate: '22 Aug 2026 at 04:00 PM',
    status: 'Offer Received',
    message: 'Looking for Kaveri water source land for organic farming project.'
  },
  {
    id: 'INQ-103',
    buyerName: 'Priya Mahalingam',
    buyerRole: 'Individual Buyer',
    phone: '+91 95857 33412',
    email: 'priya.m@outlook.com',
    propertyTitle: 'DTCP Approved Residential Plot in New Bus Stand',
    propId: 'TP-2002',
    offeredPrice: '₹ 18.50 Lakhs',
    visitDate: '21 Aug 2026 at 11:00 AM',
    status: 'New Inquiry',
    message: 'Requesting original Patta title copy and layout plan map.'
  }
];

function compressImageFile(file, maxWidth = 1000, maxHeight = 800, quality = 0.75) {
  return new Promise((resolve) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve(null);
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      };
      img.onerror = () => resolve(e.target.result);
      img.src = e.target.result;
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

export function renderUserDashboard() {
  const container = document.getElementById('user-dashboard-app') || document.getElementById('user-db-app');
  if (!container) return;

  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  // Prevent admin and staff from accessing the client user dashboard
  if (user.roleCode && (user.roleCode.includes('admin') || user.roleCode.includes('manager') || user.roleCode.includes('executive') || user.roleCode.includes('staff'))) {
    window.location.href = 'dashboard.html';
    return;
  }

  const userName = user.fullName || user.name || (user.email ? user.email.split('@')[0] : 'Property Owner');

  const allProps = getProperties();
  const userProps = allProps.filter(p => {
    if (p.userId && user.id && p.userId === user.id) return true;
    if (p.userEmail && user.email && p.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
    if (!p.userId && !p.userEmail) {
      return p.ownerPhone === user.phone && (p.listedBy === userName || p.ownerName === userName);
    }
    return false;
  });

  const submittedCount = userProps.length;
  const pendingCount = userProps.filter(p => p.approvalStatus === 'Pending Approval' || p.status === 'Pending Approval').length;
  const approvedCount = userProps.filter(p => p.approvalStatus === 'Approved' || p.status === 'Available').length;

  container.innerHTML = `
    <div class="user-db-wrapper">
      
      <!-- SIDEBAR NAVIGATION -->
      <aside class="user-sidebar">
        <div class="user-sidebar-header">
          <div class="user-brand-pill">
            <img src="/thanjai-official-new.png" alt="Thanjai Property Logo" class="user-brand-logo" onerror="this.src='https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=200&q=80'" />
          </div>
        </div>

        <div class="user-profile-card">
          <div class="avatar-frame">
            <i class="ri-user-3-line avatar-icon"></i>
          </div>
          <h4 class="user-name">Hi! ${userName}</h4>
          <span class="user-role-badge">${user.role || 'Individual Owner'}</span>
        </div>

        <nav class="user-nav">
          <a href="index.html" class="user-nav-item nav-item" data-tab="home">
            <i class="ri-home-5-line"></i>
            <span>Home</span>
          </a>
          <a href="#" class="user-nav-item nav-item active" data-tab="my-properties">
            <i class="ri-building-4-line"></i>
            <span>My Properties (${submittedCount})</span>
          </a>
          <a href="#" class="user-nav-item nav-item" data-tab="post-property">
            <i class="ri-add-circle-line"></i>
            <span>Add New Property</span>
          </a>
          <a href="#" class="user-nav-item nav-item" data-tab="profile">
            <i class="ri-user-settings-line"></i>
            <span>Profile & Password</span>
          </a>

          <button id="user-logout-btn" class="user-nav-item logout-btn" style="margin-top: auto;">
            <i class="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </button>
        </nav>
      </aside>

      <!-- MAIN CONTENT WORKSPACE -->
      <main class="user-main-area">
        
        <!-- HEADER TOPBAR -->
        <header class="user-top-bar">
          <div style="font-size: 0.88rem; color: #718096; font-weight: 600;">
            <span style="color: #1A202C; font-weight: 800;">Thanjai Property</span> / Client Portal Workspace
          </div>

          <div>
            <button class="post-prop-header-btn" id="header-post-property-btn">
              <i class="ri-add-line"></i> Add New Property
            </button>
          </div>
        </header>

        <!-- DYNAMIC CONTENT PANEL CONTAINER -->
        <div class="user-content-body" id="user-workspace-body">
          
          <!-- SUMMARY KPI CARDS -->
          <div class="user-kpi-grid">
            <div class="kpi-card" id="kpi-submitted-card" style="cursor: pointer;">
              <div class="kpi-card-inner">
                <div class="kpi-icon-box orange"><i class="ri-stack-line"></i></div>
                <div>
                  <h5 class="kpi-title">Total Submitted</h5>
                  <div class="kpi-val">${submittedCount} Properties</div>
                </div>
              </div>
              <div class="kpi-footer-link">Manage Properties &rsaquo;</div>
            </div>

            <div class="kpi-card">
              <div class="kpi-card-inner">
                <div class="kpi-icon-box blue"><i class="ri-time-line"></i></div>
                <div>
                  <h5 class="kpi-title">Awaiting Approval</h5>
                  <div class="kpi-val">${pendingCount} Pending</div>
                </div>
              </div>
              <div class="kpi-footer-link">Pending Verification &rsaquo;</div>
            </div>
          </div>

          <!-- PROPERTIES INVENTORY TABLE PANEL -->
          <div class="user-data-panel">
            <div class="panel-header">
              <div>
                <h2 class="panel-title" id="panel-title-text">My Listed Properties</h2>
                <p class="panel-subtitle" id="panel-sub-text">Properties uploaded under your seller account with live approval status</p>
              </div>
            </div>

            <div class="panel-body" id="panel-body-content" style="width: 100%; box-sizing: border-box;">
              ${renderMyPropertiesTableHtml(userProps)}
            </div>
          </div>

        </div>
      </main>

    </div>
  `;

  // NOTICE BANNER AUTO-DISMISS & MANUAL CLOSE HANDLER
  const noticeBanner = document.getElementById('user-notice-banner');
  const closeNoticeBtn = document.getElementById('close-notice-btn');

  const dismissNoticeBanner = () => {
    if (noticeBanner && !noticeBanner.classList.contains('fade-out')) {
      noticeBanner.classList.add('fade-out');
      setTimeout(() => noticeBanner.remove(), 450);
    }
  };

  closeNoticeBtn?.addEventListener('click', dismissNoticeBanner);
  setTimeout(dismissNoticeBanner, 5000);

  // EVENT LISTENERS
  document.getElementById('user-logout-btn')?.addEventListener('click', () => {
    logoutUser();
    showToast('Logged out successfully', 'ri-logout-box-r-line');
    window.location.href = 'login.html';
  });

  function openPostPropertyWithAdType(propToEdit = null, adType = 'free') {
    const effectiveAdType = propToEdit?.adType || adType || 'free';
    currentSelectedAdType = effectiveAdType;
    const panelTitle = document.getElementById('panel-title-text');
    const panelSub = document.getElementById('panel-sub-text');
    const panelBody = document.getElementById('panel-body-content');

    navItems.forEach(n => n.classList.remove('active'));
    document.querySelector('[data-tab="post-property"]')?.classList.add('active');

    if (panelTitle) panelTitle.textContent = propToEdit ? `Edit Property (${propToEdit.id})` : 'Add New Property';
    if (panelSub) panelSub.textContent = propToEdit 
      ? 'Modify your property specs, price, location, or uploaded photos' 
      : 'Upload land, house, villa, or commercial property for review and publication';
    if (panelBody) {
      panelBody.innerHTML = renderPostPropertyFormHtml(propToEdit, effectiveAdType);
      attachPostFormListener(propToEdit, effectiveAdType);
    }
  }

  document.getElementById('header-post-property-btn')?.addEventListener('click', () => {
    showAdTypeSelectionModal((chosenType) => {
      openPostPropertyWithAdType(null, chosenType);
    });
  });

  document.getElementById('kpi-submitted-card')?.addEventListener('click', () => {
    document.querySelector('[data-tab="my-properties"]')?.click();
  });

  document.getElementById('kpi-buyers-link')?.addEventListener('click', () => {
    document.querySelector('[data-tab="buyers-list"]')?.click();
  });

  const navItems = document.querySelectorAll('.user-nav .nav-item');

  function refreshMyProperties() {
    const currentAll = getProperties();
    const updatedUserProps = currentAll.filter(p => {
      if (p.userId && user.id && p.userId === user.id) return true;
      if (p.userEmail && user.email && p.userEmail.toLowerCase() === user.email.toLowerCase()) return true;
      if (!p.userId && !p.userEmail) {
        return p.ownerPhone === user.phone && (p.listedBy === userName || p.ownerName === userName);
      }
      return false;
    });
    
    const panelTitle = document.getElementById('panel-title-text');
    const panelSub = document.getElementById('panel-sub-text');
    const panelBody = document.getElementById('panel-body-content');

    if (panelTitle) panelTitle.textContent = 'My Listed Properties';
    if (panelSub) panelSub.textContent = 'Properties uploaded under your seller account with live approval status';
    if (panelBody) {
      panelBody.innerHTML = renderMyPropertiesTableHtml(updatedUserProps);
      bindTableActions();
    }
  }

  function bindTableActions() {
    // EMPTY STATE CENTER POST PROPERTY BUTTON ACTION
    document.getElementById('empty-post-btn')?.addEventListener('click', () => {
      showAdTypeSelectionModal((chosenType) => {
        openPostPropertyWithAdType(null, chosenType);
      });
    });

    // PREVIEW PROPERTY DETAILS INLINE MODAL
    document.querySelectorAll('.user-preview-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        if (id) {
          userActivePreviewId = id;
          userActiveMediaIndex = 0;
          openUserPropertyPreviewModal(id);
        }
      });
    });

    // EDIT PROPERTY ACTION
    document.querySelectorAll('.user-edit-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const targetProp = getProperties().find(p => p.id === id);
        if (targetProp) {
          const panelTitle = document.getElementById('panel-title-text');
          const panelSub = document.getElementById('panel-sub-text');
          const panelBody = document.getElementById('panel-body-content');
          if (panelTitle) panelTitle.textContent = `Edit Property (${id})`;
          if (panelSub) panelSub.textContent = 'Modify your property specs, price, location, or uploaded photos';
          if (panelBody) {
            panelBody.innerHTML = renderPostPropertyFormHtml(targetProp, targetProp.adType || 'free');
            attachPostFormListener(targetProp, targetProp.adType || 'free');
          }
        }
      });
    });

    // DELETE PROPERTY ACTION (CUSTOM PROFESSIONAL CONFIRMATION MODAL)
    document.querySelectorAll('.user-delete-prop-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const targetProp = getProperties().find(p => p.id === id);
        showUserDeleteConfirmModal(id, targetProp?.title || '', () => {
          deleteProperty(id);
          showToast(`Property listing ${id} deleted successfully.`, 'ri-delete-bin-line');
          refreshMyProperties();
        });
      });
    });
  }

  bindTableActions();

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      const tab = item.dataset.tab;
      if (tab === 'home' || item.getAttribute('href') === 'index.html') {
        window.location.href = 'index.html';
        return;
      }
      e.preventDefault();
      navItems.forEach(n => n.classList.remove('active'));
      item.classList.add('active');
      bindTabClick(tab);
    });
  });

  function bindTabClick(tab) {
    const panelTitle = document.getElementById('panel-title-text');
    const panelSub = document.getElementById('panel-sub-text');
    const panelBody = document.getElementById('panel-body-content');

    if (tab === 'home') {
      refreshMyProperties();
    } else if (tab === 'my-properties') {
      refreshMyProperties();
    } else if (tab === 'post-property') {
      showAdTypeSelectionModal((chosenType) => {
        currentSelectedAdType = chosenType;
        openPostPropertyWithAdType(null, chosenType);
      });
    } else if (tab === 'buyers-list') {
      if (panelTitle) panelTitle.textContent = 'Buyers Inquiries & Lead Desk';
      if (panelSub) panelSub.textContent = 'Direct buyer leads, site visit requests, and offers submitted for your listings';
      if (panelBody) {
        panelBody.innerHTML = renderBuyersInquiriesTableHtml(defaultBuyersInquiries);
      }
    } else if (tab === 'profile') {
      if (panelTitle) panelTitle.textContent = 'Owner Profile & Password Settings';
      if (panelSub) panelSub.textContent = 'Manage your seller account details and login password';
      if (panelBody) {
        panelBody.innerHTML = `
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 24px; padding: 10px 0;">
            <!-- LEFT: Profile Details Form -->
            <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #1A202C; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                <i class="ri-user-settings-line" style="color: #eb5e28;"></i> Personal Profile
              </h3>
              <p style="font-size: 0.85rem; color: #718096; margin-bottom: 20px;">Update your displayed name and contact phone number</p>

              <form id="owner-profile-form" onsubmit="return false;">
                <div style="margin-bottom: 16px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">FULL NAME</label>
                  <input type="text" id="profile-fullname-input" value="${userName}" required style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E0; background: #ffffff; font-size: 0.9rem; outline: none;" />
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">EMAIL ADDRESS (USERNAME)</label>
                  <input type="email" value="${user.email || ''}" readonly style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E0; background: #EDF2F7; font-size: 0.9rem; color: #718096;" />
                </div>

                <div style="margin-bottom: 16px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">PHONE NUMBER</label>
                  <input type="tel" id="profile-phone-input" value="${user.phone || ''}" required maxlength="10" pattern="[0-9]{10}" oninput="this.value = this.value.replace(/[^0-9]/g, '')" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E0; background: #ffffff; font-size: 0.9rem; outline: none;" />
                </div>

                <div style="margin-bottom: 24px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">ACCOUNT ROLE</label>
                  <input type="text" value="${user.role || 'Individual Owner'}" readonly style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E0; background: #EDF2F7; font-size: 0.9rem; color: #718096;" />
                </div>

                <button type="submit" id="save-profile-btn" style="background: #eb5e28; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(235,94,40,0.25);">
                  <i class="ri-save-line"></i> Save Profile Details
                </button>
              </form>
            </div>

            <!-- RIGHT: Change / Set Password Form -->
            <div style="background: #ffffff; border: 1px solid #E2E8F0; border-radius: 16px; padding: 24px; box-shadow: 0 2px 10px rgba(0,0,0,0.02);">
              <h3 style="font-size: 1.1rem; font-weight: 800; color: #1A202C; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                <i class="ri-lock-password-line" style="color: #3182CE;"></i> Change Password
              </h3>
              <p style="font-size: 0.85rem; color: #718096; margin-bottom: 20px;">
                ${user.isTemporaryPassword ? '⚠️ You are currently using a temporary password. Please set a permanent password.' : 'Update your personal account login password'}
              </p>

              <form id="owner-password-form" onsubmit="return false;">
                <div style="margin-bottom: 16px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">NEW PASSWORD</label>
                  <input type="password" id="profile-new-password" required minlength="6" placeholder="Enter new password (min 6 chars)" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E0; background: #ffffff; font-size: 0.9rem; outline: none;" />
                </div>

                <div style="margin-bottom: 24px;">
                  <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">CONFIRM NEW PASSWORD</label>
                  <input type="password" id="profile-confirm-password" required minlength="6" placeholder="Confirm new password" style="width: 100%; padding: 10px 14px; border-radius: 8px; border: 1px solid #CBD5E0; background: #ffffff; font-size: 0.9rem; outline: none;" />
                </div>

                <button type="submit" id="save-password-btn" style="background: #3182CE; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 700; font-size: 0.9rem; cursor: pointer; box-shadow: 0 4px 12px rgba(49,130,206,0.25);">
                  <i class="ri-shield-keyhole-line"></i> Update Password
                </button>
              </form>
            </div>
          </div>
        `;

        document.getElementById('owner-profile-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const newName = document.getElementById('profile-fullname-input')?.value.trim();
          const newPhone = document.getElementById('profile-phone-input')?.value.trim();

          if (!newName || !newPhone) {
            showToast('Please provide both Full Name and Phone Number.', 'ri-error-warning-line');
            return;
          }

          const updatedUser = {
            ...user,
            fullName: newName,
            name: newName,
            phone: newPhone
          };

          setCurrentUser(updatedUser);

          const users = getRegisteredUsers();
          const idx = users.findIndex(u => u.email?.toLowerCase() === user.email?.toLowerCase() || u.id === user.id);
          if (idx >= 0) {
            users[idx] = { ...users[idx], ...updatedUser };
            localStorage.setItem('thanjai_registered_users', JSON.stringify(users));
          }

          showToast('Profile details updated successfully!', 'ri-checkbox-circle-fill');
          setTimeout(() => {
            renderUserDashboard();
          }, 300);
        });

        document.getElementById('owner-password-form')?.addEventListener('submit', (e) => {
          e.preventDefault();
          const newPass = document.getElementById('profile-new-password')?.value.trim();
          const confPass = document.getElementById('profile-confirm-password')?.value.trim();

          if (!newPass || newPass.length < 6) {
            showToast('Password must be at least 6 characters.', 'ri-error-warning-line');
            return;
          }

          if (newPass !== confPass) {
            showToast('New Password and Confirm Password do not match.', 'ri-error-warning-line');
            return;
          }

          const res = updateUserPassword(user.email || user.id, newPass);
          if (res.success) {
            showToast('Password updated successfully! You can now log in with your new password.', 'ri-checkbox-circle-fill');
            setTimeout(() => {
              renderUserDashboard();
            }, 300);
          } else {
            showToast(res.message || 'Failed to update password.', 'ri-error-warning-line');
          }
        });
      }
    }
  }

  function attachPostFormListener(propToEdit = null) {
    const isEdit = Boolean(propToEdit);
    const typeInput = document.getElementById('user-prop-type');
    const specsBox = document.getElementById('user-res-specs-box');
    const imgUrlInput = document.getElementById('user-prop-img-url');
    const fileInput = document.getElementById('user-prop-img-files');
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
      const val = (typeInput.value || '').toLowerCase().trim();
      const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room', 'bhk', 'residence', 'cottage', 'bungalow', 'rowhouse', 'manor', 'studio'];
      const isRes = resKeywords.some(k => val.includes(k));

      if (specsBox) {
        specsBox.style.display = isRes ? 'block' : 'none';
      }
    });

    // PRIMARY IMAGE URL LIVE SYNC
    imgUrlInput?.addEventListener('input', () => {
      const url = imgUrlInput.value.trim();
      if (url && !userUploadedImages.includes(url)) {
        userUploadedImages.unshift(url);
        userUploadedImages = [...new Set(userUploadedImages)];
        refreshUserUploadedPhotoGrid();
      }
    });

    // PHOTO FILES READER WITH CANVAS COMPRESSION
    fileInput?.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files);
      if (!files || files.length === 0) return;

      showToast(`Compressing ${files.length} photo(s)...`, 'ri-loader-4-line');

      for (const f of files) {
        if (!f.type.startsWith('image/')) continue;
        const b64 = await compressImageFile(f, 1000, 800, 0.75);
        if (b64) {
          userUploadedImages.push(b64);
        }
      }

      userUploadedImages = [...new Set(userUploadedImages)];
      refreshUserUploadedPhotoGrid();
      showToast(`${files.length} HD photo(s) added to property!`, 'ri-image-add-line');
    });

    bindUserPhotoDeleteButtons();

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

            const badge = document.getElementById('user-location-badge');
            const badgeText = document.getElementById('user-location-badge-text');
            if (badge) badge.style.display = 'inline-flex';
            if (badgeText) badgeText.textContent = `Location Pinpoint Captured: Lat ${lat}, Lng ${lng}`;

            showToast(`Location captured: Lat ${lat}, Lng ${lng}`, 'ri-map-pin-user-fill');
          },
          () => {
            showToast('Geolocation permission denied or unavailable.', 'ri-error-warning-line');
          }
        );
      }
    });

    // INTERACTIVE LEAFLET MAP PINPOINT BUTTON
    mapPinBtn?.addEventListener('click', () => {
      const latInp = document.getElementById('user-prop-latitude');
      const lngInp = document.getElementById('user-prop-longitude');
      const curLat = latInp?.value || '10.786999';
      const curLng = lngInp?.value || '79.137827';

      openUserLeafletMapModal(curLat, curLng, (newLat, newLng) => {
        if (latInp) latInp.value = newLat;
        if (lngInp) lngInp.value = newLng;

        const badge = document.getElementById('user-location-badge');
        const badgeText = document.getElementById('user-location-badge-text');
        if (badge) badge.style.display = 'inline-flex';
        if (badgeText) badgeText.textContent = `Location Pinpoint Captured: Lat ${newLat}, Lng ${newLng}`;

        showToast(`Map location saved: Lat ${newLat}, Lng ${newLng}`, 'ri-compass-3-fill');
      });
    });

    // CHANGE AD TYPE BUTTON HANDLER
    document.getElementById('change-adtype-btn')?.addEventListener('click', () => {
      showAdTypeSelectionModal((newType) => {
        openPostPropertyWithAdType(propToEdit, newType);
      });
    });

    // FORM SUBMISSION HANDLER
    const form = document.getElementById('client-post-prop-form');
    const submitBtn = document.getElementById('user-submit-prop-btn');
    
    submitBtn?.addEventListener('click', () => {
      if (form && !form.checkValidity()) {
        showToast('Please fill out all required fields marked with * (Scroll up to see)', 'ri-error-warning-line');
      }
    });

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
      const floor = document.getElementById('user-prop-floor')?.value.trim();
      const furnishing = document.getElementById('user-prop-furnishing')?.value;
      const price = parseFloat(document.getElementById('user-prop-price').value);
      const imgUrl = document.getElementById('user-prop-img-url').value;
      const videoUrl = document.getElementById('user-prop-videolink').value || userUploadedVideoUrl;
      const latitude = document.getElementById('user-prop-latitude')?.value || '10.786999';
      const longitude = document.getElementById('user-prop-longitude')?.value || '79.137827';
      const desc = document.getElementById('user-prop-desc').value;

      const features = Array.from(document.querySelectorAll('.user-feature-chk:checked')).map(c => c.value);

      const rawImages = [...userUploadedImages];
      if (imgUrl && !rawImages.includes(imgUrl)) rawImages.unshift(imgUrl);
      const images = [...new Set(rawImages.filter(Boolean))];
      if (images.length === 0) {
        images.push('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80');
      }

      const val = type.toLowerCase().trim();
      const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room', 'bhk', 'residence', 'cottage', 'bungalow', 'rowhouse', 'manor', 'studio'];
      const isRes = resKeywords.some(k => val.includes(k));

      const finalAdType = currentSelectedAdType || propToEdit?.adType || 'free';
      let finalOwnerName = userName;
      let finalOwnerPhone = user.phone;
      let finalListedBy = userName;

      if (finalAdType === 'free') {
        finalOwnerName = 'Thanjai Property';
        finalOwnerPhone = '+91 84899 96852';
        finalListedBy = 'Thanjai Property';
      }

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
        adType: finalAdType,
        actualOwnerName: userName,
        actualOwnerPhone: user.phone,
        ownerName: finalOwnerName,
        ownerPhone: finalOwnerPhone,
        listedBy: finalListedBy,
        userId: user.id,
        userEmail: user.email,
        approvalStatus: isEdit ? (propToEdit.approvalStatus || 'Pending Approval') : 'Pending Approval',
        status: isEdit ? (propToEdit.status || 'Pending Approval') : 'Pending Approval'
      };

      if (isEdit) {
        updateProperty(propToEdit.id, payload);
        showToast(`Property ${propToEdit.id} updated successfully!`, 'ri-checkbox-circle-fill');
        setTimeout(() => showUserNoticeBanner(`Property ${propToEdit.id} updated successfully!`), 100);
      } else {
        const created = addProperty(payload);
        showToast(`Property ${created.id} submitted for Admin Approval!`, 'ri-time-line');
        setTimeout(() => showUserNoticeBanner(`New property ${created.id} submitted! Sent to Admin for Approval.`), 100);
      }

      userUploadedImages = [];
      userUploadedVideoUrl = '';

      document.querySelector('[data-tab="my-properties"]')?.click();
    });
  }
}

function showUserNoticeBanner(message) {
  const container = document.getElementById('user-workspace-body');
  if (!container) return;

  document.getElementById('user-action-notice-banner')?.remove();

  const banner = document.createElement('div');
  banner.id = 'user-action-notice-banner';
  banner.className = 'notice-banner-box';
  banner.style.cssText = `
    background: #E6FFFA; border: 1px solid #B2F5EA; color: #234E52; border-radius: 12px;
    padding: 14px 20px; font-size: 0.9rem; font-weight: 700; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; gap: 12px;
  `;
  banner.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px;">
      <i class="ri-checkbox-circle-fill" style="color: #38A169; font-size: 1.2rem;"></i>
      <span>Notice: ${message}</span>
    </div>
    <div style="display: flex; align-items: center; gap: 8px;">
      <span style="background: #38A169; color: #fff; font-size: 0.72rem; font-weight: 800; padding: 4px 10px; border-radius: 12px;">VERIFIED LIVE</span>
      <button id="close-action-notice-btn" title="Dismiss notice" style="background: none; border: none; color: #234E52; font-size: 1.2rem; cursor: pointer; display: flex; align-items: center; justify-content: center; padding: 2px;">
        <i class="ri-close-line"></i>
      </button>
    </div>
  `;

  container.insertBefore(banner, container.firstElementChild);

  const dismiss = () => {
    if (banner && !banner.classList.contains('fade-out')) {
      banner.classList.add('fade-out');
      setTimeout(() => banner.remove(), 450);
    }
  };

  document.getElementById('close-action-notice-btn')?.addEventListener('click', dismiss);
  setTimeout(dismiss, 4000);
}

function showUserDeleteConfirmModal(propId, propTitle, onConfirm) {
  document.getElementById('user-custom-confirm-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'user-custom-confirm-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.75) !important; backdrop-filter: blur(6px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 20px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; width: 100%; max-width: 440px; border-radius: 20px;
      padding: 32px 28px 24px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); text-align: center;
      box-sizing: border-box; border: 1px solid #E2E8F0;
    ">
      <div style="
        width: 60px; height: 60px; border-radius: 50%; background: #FFF5F5;
        border: 2px solid #FED7D7; color: #E52E3D; display: flex; align-items: center;
        justify-content: center; font-size: 1.8rem; margin: 0 auto 20px;
      ">
        <i class="ri-delete-bin-line"></i>
      </div>

      <h3 style="font-size: 1.25rem; font-weight: 800; color: #1A202C; margin: 0 0 8px 0;">Delete Property Listing?</h3>
      
      <p style="font-size: 0.9rem; color: #718096; line-height: 1.5; margin: 0 0 20px 0;">
        Are you sure you want to permanently delete <strong style="color: #E52E3D;">${propId}</strong> (${propTitle || 'this listing'})? This action cannot be undone.
      </p>

      <div style="display: flex; gap: 12px; justify-content: center;">
        <button id="cancel-user-delete-btn" style="
          flex: 1; padding: 12px 18px; border-radius: 12px; border: 1px solid #CBD5E0;
          background: #EDF2F7; color: #4A5568; font-weight: 700; font-size: 0.9rem; cursor: pointer;
        ">Cancel</button>
        <button id="confirm-user-delete-btn" style="
          flex: 1; padding: 12px 18px; border-radius: 12px; border: none;
          background: #E52E3D; color: #ffffff; font-weight: 700; font-size: 0.9rem; cursor: pointer;
          box-shadow: 0 4px 12px rgba(229, 46, 61, 0.3);
        ">Yes, Delete</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeConfirm = () => overlay.remove();

  document.getElementById('cancel-user-delete-btn')?.addEventListener('click', closeConfirm);
  document.getElementById('confirm-user-delete-btn')?.addEventListener('click', () => {
    closeConfirm();
    onConfirm();
  });
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeConfirm();
  });
}

function renderMyPropertiesTableHtml(userProps) {
  if (userProps.length === 0) {
    return `
      <div style="padding: 48px; text-align: center; color: #718096;">
        <i class="ri-building-line" style="font-size: 3rem; color: #eb5e28; margin-bottom: 12px; display: block;"></i>
        <h3 style="font-size: 1.1rem; color: #1A202C; margin-bottom: 6px;">No Properties Uploaded Yet</h3>
        <p style="font-size: 0.9rem; margin-bottom: 20px;">Upload your land or house to reach verified buyers across Tamil Nadu.</p>
        <button class="post-prop-header-btn" id="empty-post-btn">
          <i class="ri-add-line"></i> Add New Property
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
                    <div style="display: flex; flex-direction: column; gap: 4px;">
                      <span style="background: #FED7D7; color: #9B2C2C; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                        <i class="ri-close-circle-fill"></i> ${isRejected ? 'Submission Rejected' : p.status}
                      </span>
                      ${p.rejectionReason ? `
                        <span style="font-size: 0.76rem; color: #E52E3D; font-weight: 600; line-height: 1.3;">
                          Reason: ${p.rejectionReason}
                        </span>
                      ` : ''}
                    </div>
                  `}
                </td>
                <td>
                  <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                    <button class="user-preview-prop-btn" data-id="${p.id}" title="Preview property details" style="
                      background: #F7FAFC; color: #4A5568; border: 1px solid #CBD5E0; padding: 6px 12px;
                      border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
                    ">
                      <i class="ri-eye-line" style="color: #eb5e28;"></i> Preview
                    </button>

                    <button class="user-edit-prop-btn" data-id="${p.id}" style="
                      background: rgba(49,130,206,0.12); color: #3182ce; border: none; padding: 6px 12px;
                      border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
                    ">
                      <i class="ri-pencil-line"></i> Edit
                    </button>

                    <button class="user-delete-prop-btn" data-id="${p.id}" style="
                      background: rgba(229,46,61,0.12); color: #E52E3D; border: none; padding: 6px 12px;
                      border-radius: 8px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
                    ">
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

function renderUserUploadedPhotoGridHtml() {
  if (!userUploadedImages || userUploadedImages.length === 0) return '';
  return userUploadedImages.map((img, idx) => `
    <div style="position: relative; width: 90px; height: 90px; border-radius: 10px; overflow: hidden; border: 1px solid #CBD5E0; flex-shrink: 0; background: #111;">
      <img src="${img}" style="width:100%; height:100%; object-fit:cover;" />
      <button type="button" class="delete-user-img-btn" data-index="${idx}" title="Remove photo" style="
        position: absolute; top: 4px; right: 4px; width: 24px; height: 24px; border-radius: 50%;
        background: rgba(229, 62, 62, 0.95); color: #ffffff; border: none; font-size: 0.85rem;
        display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      ">
        <i class="ri-close-line"></i>
      </button>
    </div>
  `).join('');
}

function refreshUserUploadedPhotoGrid() {
  const grid = document.getElementById('user-uploaded-preview-grid');
  if (grid) {
    grid.innerHTML = renderUserUploadedPhotoGridHtml();
    bindUserPhotoDeleteButtons();
  }
}

function bindUserPhotoDeleteButtons() {
  document.querySelectorAll('.delete-user-img-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const index = parseInt(btn.dataset.index, 10);
      if (!isNaN(index) && index >= 0 && index < userUploadedImages.length) {
        userUploadedImages.splice(index, 1);
        refreshUserUploadedPhotoGrid();
        showToast('Photo removed', 'ri-delete-bin-line');
      }
    });
  });
}

function openUserPropertyPreviewModal(id) {
  document.getElementById('user-prop-modal-overlay')?.remove();
  const targetProp = getProperties().find(p => p.id === id);
  if (!targetProp) return;

  const wrapperDiv = document.createElement('div');
  wrapperDiv.innerHTML = renderUserPropertyPreviewModal(targetProp);
  const modalEl = wrapperDiv.firstElementChild;
  if (modalEl) {
    document.body.appendChild(modalEl);
    bindUserPreviewModalEvents(id);
  }
}

function renderUserPropertyPreviewModal(prop) {
  if (!prop) return '';

  const rawImgs = Array.isArray(prop.images) ? prop.images.filter(Boolean) : [];
  const uniqueImgs = [...new Set(rawImgs)];
  const images = uniqueImgs.length > 0 ? uniqueImgs : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
  const status = prop.status || prop.availability || 'Available';

  const allMediaItems = [];

  if (prop.videoUrl) {
    let isEmbeddableVideo = false;
    let videoEmbedSrc = prop.videoUrl;
    if (prop.videoUrl.includes('youtube.com') || prop.videoUrl.includes('youtu.be')) {
      const match = prop.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (match && match[1]) {
        videoEmbedSrc = `https://www.youtube.com/embed/${match[1]}?autoplay=0`;
        isEmbeddableVideo = true;
      }
    }
    allMediaItems.push({
      type: 'video',
      url: videoEmbedSrc,
      rawUrl: prop.videoUrl,
      isEmbeddable: isEmbeddableVideo,
      title: 'Property Video Tour',
      thumb: images[0]
    });
  }

  images.forEach((img, idx) => {
    allMediaItems.push({
      type: 'image',
      url: img,
      title: `Photo ${idx + 1}`,
      thumb: img
    });
  });

  const totalMedia = allMediaItems.length;
  if (userActiveMediaIndex >= totalMedia) userActiveMediaIndex = 0;
  const activeItem = allMediaItems[userActiveMediaIndex] || allMediaItems[0];

  let heroContentHtml = '';
  if (activeItem.type === 'video') {
    if (activeItem.isEmbeddable) {
      heroContentHtml = `<iframe src="${activeItem.url}" style="width: 100%; height: 100%; border: none;" allowfullscreen></iframe>`;
    } else {
      heroContentHtml = `<video src="${activeItem.rawUrl}" controls autoplay style="width: 100%; height: 100%; object-fit: contain; background: #000;"></video>`;
    }
  } else {
    heroContentHtml = `<img src="${activeItem.url}" alt="${prop.title}" style="width: 100%; height: 100%; object-fit: cover;" />`;
  }

  return `
    <div id="user-prop-modal-overlay" style="
      position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
      width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
      background: rgba(15, 23, 42, 0.82) !important; backdrop-filter: blur(8px) !important;
      display: flex !important; align-items: center !important; justify-content: center !important;
      padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
    ">
      <div style="
        background: #ffffff; width: 100%; max-width: 920px; max-height: 90vh; border-radius: 24px;
        overflow: hidden; box-shadow: 0 25px 60px rgba(0,0,0,0.5); border: 1px solid #e2e8f0; display: flex; flex-direction: column;
      ">
        
        <!-- Modal Top Bar -->
        <div style="padding: 18px 28px; background: #faf8f5; border-bottom: 1px solid #e2e8f0; display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;">
          <div>
            <span style="font-size: 0.75rem; font-weight: 800; color: #eb5e28; letter-spacing: 0.08em; text-transform: uppercase;">
              PROPERTY PREVIEW • ID: ${prop.id}
            </span>
            <h3 style="font-size: 1.3rem; font-weight: 800; color: #1a202c; margin: 2px 0 0 0;">${prop.title}</h3>
          </div>

          <button id="close-user-prop-preview-btn" style="background: #ffffff; border: 1px solid #cbd5e0; color: #4a5568; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer;">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <!-- Scrollable Modal Body -->
        <div style="padding: 24px 28px; overflow-y: auto; display: flex; flex-direction: column; gap: 24px; flex: 1;">
          
          <!-- HERO MEDIA VIEWPORT -->
          <div style="width: 100%;">
            <div style="width: 100%; height: 380px; border-radius: 16px; overflow: hidden; background: #f0f4f8; position: relative; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
              ${heroContentHtml}

              <!-- Counter Badge -->
              <div style="position: absolute; top: 16px; left: 16px; background: rgba(0,0,0,0.75); color: #ffffff; font-size: 0.8rem; font-weight: 700; padding: 6px 14px; border-radius: 20px; backdrop-filter: blur(4px); display: flex; align-items: center; gap: 6px; z-index: 10;">
                <i class="${activeItem.type === 'video' ? 'ri-video-line' : 'ri-image-line'}" style="color: #eb5e28;"></i>
                <span>${activeItem.type === 'video' ? 'Video Tour' : `Photo ${userActiveMediaIndex + (prop.videoUrl ? 0 : 1)} of ${totalMedia - (prop.videoUrl ? 1 : 0)}`}</span>
              </div>

              <!-- Status Badge -->
              <span style="position: absolute; top: 16px; right: 16px; background: #eb5e28; color: #fff; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 20px; z-index: 10;">
                ${status.toUpperCase()}
              </span>

              <!-- Carousel Navigation Arrows -->
              ${totalMedia > 1 ? `
                <button id="user-prev-preview-media-btn" title="Previous photo" style="
                  position: absolute; left: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.4rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px); z-index: 10;
                ">
                  <i class="ri-arrow-left-s-line"></i>
                </button>

                <button id="user-next-preview-media-btn" title="Next photo" style="
                  position: absolute; right: 16px; top: 50%; transform: translateY(-50%); width: 44px; height: 44px; border-radius: 50%;
                  background: rgba(0,0,0,0.65); color: #ffffff; border: 1px solid rgba(255,255,255,0.3); font-size: 1.4rem;
                  display: flex; align-items: center; justify-content: center; cursor: pointer; backdrop-filter: blur(6px); z-index: 10;
                ">
                  <i class="ri-arrow-right-s-line"></i>
                </button>
              ` : ''}
            </div>

            <!-- Horizontal Thumbnail Carousel -->
            ${totalMedia > 1 ? `
              <div style="display: flex; gap: 12px; overflow-x: auto; padding: 14px 4px 6px 4px; margin-top: 12px; scrollbar-width: thin; scrollbar-color: #eb5e28 #edf2f7;">
                ${allMediaItems.map((item, idx) => {
                  const isActive = idx === userActiveMediaIndex;
                  return `
                    <div class="user-preview-thumb-card" data-index="${idx}" style="
                      position: relative; flex-shrink: 0; width: 110px; height: 74px; border-radius: 10px; overflow: hidden;
                      cursor: pointer; transition: all 0.25s ease; border: ${isActive ? '3px solid #eb5e28' : '2px solid #e2e8f0'};
                      box-shadow: ${isActive ? '0 4px 14px rgba(235,94,40,0.35)' : '0 2px 6px rgba(0,0,0,0.06)'};
                      opacity: ${isActive ? '1' : '0.75'}; transform: ${isActive ? 'scale(1.02)' : 'scale(1)'};
                    ">
                      <img src="${item.thumb}" style="width: 100%; height: 100%; object-fit: cover;" />
                      ${item.type === 'video' ? `
                        <div style="position: absolute; inset: 0; background: rgba(0,0,0,0.45); display: flex; align-items: center; justify-content: center; color: #fff; font-size: 1.5rem;">
                          <i class="ri-play-circle-fill" style="color: #eb5e28;"></i>
                        </div>
                      ` : ''}
                    </div>
                  `;
                }).join('')}
              </div>
            ` : ''}
          </div>

          <!-- Specs Grid -->
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; background: #faf8f5; padding: 20px; border-radius: 14px; border: 1px solid #e2e8f0;">
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">EXPECTED PRICE</span>
              <div style="font-size: 1.3rem; font-weight: 800; color: #eb5e28;">${prop.priceFormatted || '₹ ' + (prop.price || 0).toLocaleString('en-IN')}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">TYPE & PURPOSE</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.type || 'Property'} • ${prop.categoryRaw || 'Sale'}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">LOCATION</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.location || prop.district}</div>
            </div>
            <div>
              <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">AREA SIZE</span>
              <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.size || 'N/A'}</div>
            </div>
            ${prop.bedrooms ? `
              <div>
                <span style="font-size: 0.75rem; font-weight: 800; color: #718096; display: block;">BEDROOMS / BATHROOMS</span>
                <div style="font-size: 0.95rem; font-weight: 700; color: #1a202c;">${prop.bedrooms} Bed • ${prop.bathrooms || 0} Bath</div>
              </div>
            ` : ''}
          </div>

          <!-- Description -->
          <div>
            <h4 style="font-size: 0.85rem; font-weight: 800; color: #4A5568; text-transform: uppercase; margin-bottom: 8px;">PROPERTY DESCRIPTION</h4>
            <p style="font-size: 0.92rem; color: #4A5568; line-height: 1.6;">${prop.description || `${prop.title} located at ${prop.location}.`}</p>
          </div>

        </div>

        <!-- Modal Footer -->
        <div style="padding: 18px 28px; background: #faf8f5; border-top: 1px solid #e2e8f0; display: flex; justify-content: flex-end; gap: 12px; flex-shrink: 0;">
          <button id="modal-user-edit-btn" data-id="${prop.id}" style="background: #3182CE; color: #fff; border: none; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
            <i class="ri-pencil-line"></i> Edit Property Details
          </button>
          <button id="modal-user-close-btn" style="background: #ffffff; border: 1px solid #cbd5e0; color: #4a5568; padding: 10px 24px; border-radius: 10px; font-weight: 700; cursor: pointer;">
            Close Preview
          </button>
        </div>

      </div>
    </div>
  `;
}

function bindUserPreviewModalEvents(id) {
  const closeBtn = document.getElementById('close-user-prop-preview-btn');
  const footerCloseBtn = document.getElementById('modal-user-close-btn');
  const editBtn = document.getElementById('modal-user-edit-btn');
  const prevBtn = document.getElementById('user-prev-preview-media-btn');
  const nextBtn = document.getElementById('user-next-preview-media-btn');

  const handleClose = () => {
    document.getElementById('user-prop-modal-overlay')?.remove();
  };

  closeBtn?.addEventListener('click', handleClose);
  footerCloseBtn?.addEventListener('click', handleClose);

  editBtn?.addEventListener('click', () => {
    handleClose();
    const editPropBtn = document.querySelector(`.user-edit-prop-btn[data-id="${id}"]`);
    if (editPropBtn) editPropBtn.click();
  });

  prevBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const targetProp = getProperties().find(p => p.id === id);
    const mediaCount = (targetProp?.images?.length || 1) + (targetProp?.videoUrl ? 1 : 0);
    userActiveMediaIndex = (userActiveMediaIndex - 1 + mediaCount) % mediaCount;
    openUserPropertyPreviewModal(id);
  });

  nextBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    const targetProp = getProperties().find(p => p.id === id);
    const mediaCount = (targetProp?.images?.length || 1) + (targetProp?.videoUrl ? 1 : 0);
    userActiveMediaIndex = (userActiveMediaIndex + 1) % mediaCount;
    openUserPropertyPreviewModal(id);
  });

  document.querySelectorAll('.user-preview-thumb-card').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const idx = parseInt(thumb.dataset.index, 10);
      if (!isNaN(idx)) {
        userActiveMediaIndex = idx;
        openUserPropertyPreviewModal(id);
      }
    });
  });
}

// FULL PROPERTY FORM PRE-FILLED FOR ADD OR EDIT
function renderPostPropertyFormHtml(propToEdit = null, adType = 'free') {
  const isEdit = Boolean(propToEdit);
  const activeAdType = propToEdit?.adType || adType || 'free';
  userUploadedImages = propToEdit?.images ? [...propToEdit.images] : [];
  userUploadedVideoUrl = propToEdit?.videoUrl || '';

  const currentType = propToEdit?.type || '';
  const val = currentType.toLowerCase().trim();
  const resKeywords = ['house', 'villa', 'apartment', 'home', 'flat', 'duplex', 'townhouse', 'penthouse', 'building', 'room', 'bhk', 'residence', 'cottage', 'bungalow', 'rowhouse', 'manor', 'studio'];
  const isRes = resKeywords.some(k => val.includes(k));

  return `
    <div style="background: #FAF8F5; border: 1px solid #E7E0D8; border-radius: 16px; padding: 32px; width: 100%; max-width: 980px; margin: 0 auto; box-sizing: border-box;">
      <div style="margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span style="font-size: 0.78rem; font-weight: 800; color: #eb5e28; letter-spacing: 0.08em; text-transform: uppercase;">
            ${isEdit ? `EDITING PROPERTY ID: ${propToEdit.id}` : 'PROPERTIES INVENTORY SUBMISSION FORM'}
          </span>
          <h3 style="font-size: 1.5rem; font-weight: 800; color: #1A202C; margin-top: 4px;">
            ${isEdit ? `Edit Property (${propToEdit.id})` : 'Add New Property'}
          </h3>
        </div>

        ${isEdit ? `
          <button id="cancel-edit-btn" style="background: #FFF; border: 1px solid #CBD5E0; color: #4A5568; padding: 8px 16px; border-radius: 8px; font-weight: 700; cursor: pointer;">
            <i class="ri-arrow-left-line"></i> Cancel Edit
          </button>
        ` : ''}
      </div>

      <!-- AD TYPE ACTIVE BANNER -->
      ${activeAdType === 'free' ? `
        <div style="background: #EBF8FF; border: 1px solid #BEE3F8; border-left: 5px solid #3182CE; padding: 14px 18px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(49,130,206,0.15); color: #3182CE; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
              <i class="ri-checkbox-circle-fill"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <strong style="color: #1A202C; font-size: 0.95rem;">Selected Plan: FREE LISTING (Thanjai Property Managed)</strong>
                <span style="font-size: 0.72rem; font-weight: 800; background: rgba(49,130,206,0.15); color: #3182CE; padding: 2px 8px; border-radius: 6px;">FREE LISTING</span>
              </div>
              <span style="font-size: 0.82rem; color: #718096; display: block; margin-top: 2px;">
                All buyer inquiries are routed to Thanjai Property (<strong style="color: #3182CE;">+91 84899 96852</strong>) • Property commission / percentage is applicable on deal closure.
              </span>
            </div>
          </div>
          ${!isEdit ? `
            <button type="button" id="change-adtype-btn" style="background: #ffffff; border: 1px solid #CBD5E0; color: #4A5568; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="ri-refresh-line"></i> Change Plan
            </button>
          ` : ''}
        </div>
      ` : `
        <div style="background: #EBF8FF; border: 1px solid #BEE3F8; border-left: 5px solid #3182CE; padding: 14px 18px; border-radius: 12px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <div style="width: 38px; height: 38px; border-radius: 50%; background: rgba(49,130,206,0.15); color: #3182CE; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; flex-shrink: 0;">
              <i class="ri-checkbox-circle-fill"></i>
            </div>
            <div>
              <div style="display: flex; align-items: center; gap: 8px;">
                <strong style="color: #1A202C; font-size: 0.95rem;">Selected Plan: PAID LISTING (Direct Owner Listing)</strong>
                <span style="font-size: 0.72rem; font-weight: 800; background: rgba(49,130,206,0.15); color: #3182CE; padding: 2px 8px; border-radius: 6px;">PAID LISTING</span>
              </div>
              <span style="font-size: 0.82rem; color: #718096; display: block; margin-top: 2px;">
                Direct buyer inquiries will be sent to your Owner Dashboard & phone • <strong style="color: #3182CE;">0% Commission</strong> (Zero Brokerage).
              </span>
            </div>
          </div>
          ${!isEdit ? `
            <button type="button" id="change-adtype-btn" style="background: #ffffff; border: 1px solid #CBD5E0; color: #4A5568; padding: 8px 16px; border-radius: 8px; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="ri-refresh-line"></i> Change Plan
            </button>
          ` : ''}
        </div>
      `}

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
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Locality / Landmark *</label>
              <input type="text" id="user-prop-location" required value="${propToEdit?.location || ''}" placeholder="e.g. Medical College Road" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Street Address</label>
              <input type="text" id="user-prop-address" value="${propToEdit?.address || ''}" placeholder="e.g. Plot No 42, 2nd Cross Street" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>
          </div>
        </div>

        <!-- SECTION 2: SPECS & PRICING -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            2. SPECS, DIMENSIONS & PRICING
          </h4>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 18px;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Total Size / Area *</label>
              <input type="text" id="user-prop-size" required value="${propToEdit?.size || ''}" placeholder="e.g. 2,400 sq.ft or 4.5 Cents" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Expected Price (INR ₹) *</label>
              <input type="number" id="user-prop-price" required value="${propToEdit?.price || ''}" placeholder="e.g. 13500000" style="width: 100%; padding: 12px 14px; font-size: 0.95rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>
          </div>

          <!-- DYNAMIC RESIDENTIAL STRUCTURE SPECS -->
          <div id="user-res-specs-box" style="margin-top: 18px; display: ${isRes ? 'block' : 'none'}; background: #FFF; padding: 20px; border-radius: 12px; border: 1px dashed #CBD5E0;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px;">
              <div>
                <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Bedrooms</label>
                <input type="number" id="user-prop-bedrooms" value="${propToEdit?.bedrooms || ''}" placeholder="e.g. 3" style="width: 100%; padding: 10px 12px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Bathrooms</label>
                <input type="number" id="user-prop-bathrooms" value="${propToEdit?.bathrooms || ''}" placeholder="e.g. 3" style="width: 100%; padding: 10px 12px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Floor Number (Optional)</label>
                <input type="text" id="user-prop-floor" value="${propToEdit?.floor || ''}" placeholder="e.g. 2nd Floor (Optional)" style="width: 100%; padding: 10px 12px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
              </div>

              <div>
                <label style="font-size: 0.82rem; font-weight: 800; color: #4A5568; display: block; margin-bottom: 6px;">Furnishing Status</label>
                <select id="user-prop-furnishing" style="width: 100%; padding: 10px 12px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #CBD5E0; background: #fff; box-sizing: border-box;">
                  <option value="Not specified" ${propToEdit?.furnishing === 'Not specified' ? 'selected' : ''}>Not specified</option>
                  <option value="Fully Furnished" ${propToEdit?.furnishing === 'Fully Furnished' ? 'selected' : ''}>Fully Furnished</option>
                  <option value="Semi-Furnished" ${propToEdit?.furnishing === 'Semi-Furnished' ? 'selected' : ''}>Semi-Furnished</option>
                  <option value="Unfurnished" ${propToEdit?.furnishing === 'Unfurnished' ? 'selected' : ''}>Unfurnished</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- SECTION 3: PROPERTY PHOTOS & GALLERY -->
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
              ${renderUserUploadedPhotoGridHtml()}
            </div>
          </div>
        </div>

        <!-- SECTION 4: VIDEO & LOCATION PINPOINT MAP -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            4. VIDEO & LOCATION PINPOINT MAP
          </h4>

          <input type="hidden" id="user-prop-latitude" value="${propToEdit?.latitude || '10.786999'}" />
          <input type="hidden" id="user-prop-longitude" value="${propToEdit?.longitude || '79.137827'}" />

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 18px;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">YouTube Video Link</label>
              <input type="url" id="user-prop-videolink" value="${propToEdit?.videoUrl || ''}" placeholder="https://youtube.com/watch?v=..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Upload Video File</label>
              <label style="display: flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 10px; background: #fff; border: 1px dashed #CBD5E0; color: #4A5568; font-weight: 700; font-size: 0.88rem; cursor: pointer; height: 44px; box-sizing: border-box;">
                <i class="ri-video-upload-line" style="color: #eb5e28; font-size: 1.2rem;"></i>
                <span id="user-video-label-text">${propToEdit?.videoUrl ? 'Video Attached' : 'Upload Video (.mp4)'}</span>
                <input type="file" id="user-prop-video-file-input" accept="video/*" style="display: none;" />
              </label>
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-top: 16px; flex-wrap: wrap; align-items: center;">
            <button type="button" id="user-geolocation-btn" style="background: #fff; border: 1px solid #CBD5E0; color: #2D3748; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="ri-map-pin-user-fill" style="color: #eb5e28;"></i> Use my current location
            </button>

            <button type="button" id="user-map-pinpoint-btn" style="background: #fff; border: 1px solid #CBD5E0; color: #2D3748; padding: 10px 18px; border-radius: 10px; font-weight: 700; font-size: 0.88rem; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
              <i class="ri-compass-3-fill" style="color: #3182CE;"></i> Select Location on Interactive Map
            </button>
          </div>

          <div id="user-location-badge" style="margin-top: 12px; font-size: 0.85rem; font-weight: 700; color: #2B6CB0; display: ${propToEdit?.latitude ? 'inline-flex' : 'none'}; align-items: center; gap: 6px; background: #EBF8FF; padding: 8px 14px; border-radius: 8px; border: 1px solid #BEE3F8;">
            <i class="ri-map-pin-2-fill" style="color: #eb5e28;"></i>
            <span id="user-location-badge-text">Location Pinpoint Captured: Lat ${propToEdit?.latitude || '10.786999'}, Lng ${propToEdit?.longitude || '79.137827'}</span>
          </div>
        </div>

        <!-- SECTION 5: DESCRIPTION & LEGAL AMENITIES -->
        <div>
          <h4 style="font-size: 0.85rem; font-weight: 800; text-transform: uppercase; color: #4A5568; letter-spacing: 0.08em; margin-bottom: 16px;">
            5. DESCRIPTION & LEGAL AMENITIES
          </h4>

          <div style="display: flex; flex-direction: column; gap: 16px;">
            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 6px;">Detailed Property Description</label>
              <textarea id="user-prop-desc" rows="4" style="width: 100%; padding: 12px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #CBD5E0; box-sizing: border-box;" placeholder="Describe water availability, road width, legal Patta title status, nearby landmarks...">${propToEdit?.description || ''}</textarea>
            </div>

            <div>
              <label style="font-size: 0.82rem; font-weight: 700; color: #4A5568; display: block; margin-bottom: 8px;">Key Amenities & Legal Assurances</label>
              <div style="display: flex; gap: 14px; flex-wrap: wrap; font-size: 0.88rem; font-weight: 600; color: #4A5568;">
                <label><input type="checkbox" class="user-feature-chk" value="Clear Patta Title Verified" checked /> Clear Patta Title Verified</label>
                <label><input type="checkbox" class="user-feature-chk" value="24/7 Water Supply" checked /> 24/7 Water Supply</label>
                <label><input type="checkbox" class="user-feature-chk" value="Tar Road Frontage" /> Tar Road Frontage</label>
                <label><input type="checkbox" class="user-feature-chk" value="Gated Community" /> Gated Community</label>
                <label><input type="checkbox" class="user-feature-chk" value="Ready for Construction" /> Ready for Construction</label>
              </div>
            </div>
          </div>
        </div>

        <!-- SUBMIT ACTION BUTTON -->
        <div style="border-top: 1px solid #E2E8F0; padding-top: 24px; display: flex; justify-content: flex-end; gap: 12px;">
          <button type="submit" id="user-submit-prop-btn" style="background: #eb5e28; color: #fff; border: none; padding: 12px 32px; border-radius: 10px; font-weight: 800; font-size: 0.95rem; cursor: pointer; box-shadow: 0 4px 14px rgba(235,94,40,0.35);">
            <i class="ri-send-plane-fill"></i> ${isEdit ? 'Save & Update Property' : 'Submit & Publish Listing'}
          </button>
        </div>

      </form>
    </div>
  `;
}

function renderBuyersInquiriesTableHtml(inquiries) {
  return `
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr>
            <th>Inquiry ID</th>
            <th>Buyer Name & Role</th>
            <th>Property Interested</th>
            <th>Contact Info</th>
            <th>Offered Price / Visit</th>
            <th>Status</th>
            <th>Direct Actions</th>
          </tr>
        </thead>
        <tbody>
          ${inquiries.map(inq => `
            <tr>
              <td style="font-weight: 700; color: #eb5e28;">${inq.id}</td>
              <td>
                <div style="font-weight: 700; color: #1A202C;">${inq.buyerName}</div>
                <span style="font-size: 0.78rem; background: #EDF2F7; color: #4A5568; padding: 2px 8px; border-radius: 4px; font-weight: 600;">${inq.buyerRole}</span>
              </td>
              <td>
                <div style="font-weight: 700; color: #2B6CB0; font-size: 0.9rem;">${inq.propertyTitle}</div>
                <span style="font-size: 0.78rem; color: #718096;">ID: ${inq.propId}</span>
              </td>
              <td>
                <div style="font-size: 0.88rem; font-weight: 600;">${inq.phone}</div>
                <div style="font-size: 0.8rem; color: #718096;">${inq.email}</div>
              </td>
              <td>
                <div style="font-weight: 800; color: #eb5e28;">${inq.offeredPrice}</div>
                <div style="font-size: 0.78rem; color: #718096;"><i class="ri-calendar-line"></i> ${inq.visitDate}</div>
              </td>
              <td>
                <span style="background: #EBF8FF; color: #2B6CB0; font-weight: 800; padding: 4px 10px; border-radius: 6px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                  <i class="ri-checkbox-circle-line"></i> ${inq.status}
                </span>
              </td>
              <td>
                <div style="display: flex; gap: 6px; flex-wrap: wrap;">
                  <a href="https://wa.me/91${inq.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(inq.buyerName)},%20regarding%20your%20inquiry%20for%20${encodeURIComponent(inq.propertyTitle)}" target="_blank" style="background: #25D366; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                    <i class="ri-whatsapp-line"></i> Chat
                  </a>
                  <a href="tel:${inq.phone}" style="background: #3182CE; color: #fff; text-decoration: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 4px;">
                    <i class="ri-phone-line"></i> Call
                  </a>
                </div>
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openUserLeafletMapModal(initialLat, initialLng, onConfirm) {
  document.getElementById('user-leaflet-map-modal-overlay')?.remove();

  const startLat = parseFloat(initialLat) || 10.786999;
  const startLng = parseFloat(initialLng) || 79.137827;

  let currentLat = startLat;
  let currentLng = startLng;

  const overlay = document.createElement('div');
  overlay.id = 'user-leaflet-map-modal-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 9999999 !important;
    background: rgba(15, 23, 42, 0.8) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; width: 100%; max-width: 820px; border-radius: 20px;
      overflow: hidden; box-shadow: 0 24px 50px rgba(0,0,0,0.35); border: 1px solid #E2E8F0;
      display: flex; flex-direction: column; animation: pageFadeIn 0.25s ease;
    ">
      <!-- HEADER -->
      <div style="
        padding: 16px 24px; background: #2B3648; color: #ffffff; display: flex;
        align-items: center; justify-content: space-between;
      ">
        <div style="display: flex; align-items: center; gap: 10px;">
          <i class="ri-compass-3-fill" style="color: #eb5e28; font-size: 1.4rem;"></i>
          <div>
            <h3 style="font-size: 1.1rem; font-weight: 800; color: #ffffff; margin: 0;">Interactive Location Pinpoint</h3>
            <span style="font-size: 0.78rem; color: #A0AEC0;">Click anywhere on the map or drag the pin to set property GPS location</span>
          </div>
        </div>

        <button id="close-user-map-modal-btn" style="
          background: rgba(255,255,255,0.12); border: none; color: #ffffff; width: 34px; height: 34px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.2rem; cursor: pointer;
        ">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- MAP CONTAINER -->
      <div style="position: relative; width: 100%; height: 420px; background: #EDF2F7;">
        <div id="user-leaflet-map-canvas" style="width: 100%; height: 100%;"></div>
        <div style="
          position: absolute; bottom: 16px; left: 16px; background: rgba(255,255,255,0.92);
          padding: 8px 14px; border-radius: 20px; font-size: 0.8rem; font-weight: 700; color: #1A202C;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: flex; align-items: center; gap: 6px;
        ">
          <i class="ri-map-pin-2-fill" style="color: #eb5e28;"></i>
          <span id="user-modal-coords-text">Lat: ${currentLat.toFixed(6)}, Lng: ${currentLng.toFixed(6)}</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div style="padding: 16px 24px; background: #ffffff; border-top: 1px solid #E2E8F0; display: flex; justify-content: space-between; align-items: center;">
        <span style="font-size: 0.82rem; color: #718096; font-weight: 600;">
          <i class="ri-information-line"></i> Exact location helps buyers locate your property on map search.
        </span>

        <div style="display: flex; gap: 12px;">
          <button id="cancel-user-map-btn" style="
            padding: 10px 18px; border-radius: 10px; border: 1px solid #CBD5E0; background: #ffffff;
            color: #4A5568; font-weight: 700; font-size: 0.88rem; cursor: pointer;
          ">Cancel</button>

          <button id="confirm-user-map-btn" style="
            padding: 10px 22px; border-radius: 10px; border: none; background: #eb5e28;
            color: #ffffff; font-weight: 700; font-size: 0.88rem; cursor: pointer;
            box-shadow: 0 4px 12px rgba(235,94,40,0.25);
          ">Confirm Location</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();
  document.getElementById('close-user-map-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-user-map-btn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  setTimeout(() => {
    if (typeof L !== 'undefined') {
      const map = L.map('user-leaflet-map-canvas').setView([startLat, startLng], 14);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const marker = L.marker([startLat, startLng], { draggable: true }).addTo(map);

      function updateCoords(lat, lng) {
        currentLat = lat;
        currentLng = lng;
        const txt = document.getElementById('user-modal-coords-text');
        if (txt) txt.textContent = `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`;
      }

      marker.on('dragend', function (e) {
        const position = marker.getLatLng();
        updateCoords(position.lat, position.lng);
      });

      map.on('click', function (e) {
        marker.setLatLng(e.latlng);
        updateCoords(e.latlng.lat, e.latlng.lng);
      });

      document.getElementById('confirm-user-map-btn')?.addEventListener('click', () => {
        closeModal();
        onConfirm(currentLat.toFixed(6), currentLng.toFixed(6));
      });
    } else {
      document.getElementById('confirm-user-map-btn')?.addEventListener('click', () => {
        closeModal();
        onConfirm(currentLat.toFixed(6), currentLng.toFixed(6));
      });
    }
  }, 100);
}

function showAdTypeSelectionModal(onSelect) {
  document.getElementById('user-adtype-modal-overlay')?.remove();

  const overlay = document.createElement('div');
  overlay.id = 'user-adtype-modal-overlay';
  overlay.style.cssText = `
    position: fixed !important; top: 0 !important; left: 0 !important; right: 0 !important; bottom: 0 !important;
    width: 100vw !important; height: 100vh !important; z-index: 999999 !important;
    background: rgba(15, 23, 42, 0.8) !important; backdrop-filter: blur(8px) !important;
    display: flex !important; align-items: center !important; justify-content: center !important;
    padding: 24px !important; box-sizing: border-box !important; margin: 0 !important;
  `;

  overlay.innerHTML = `
    <div style="
      background: #ffffff; width: 100%; max-width: 800px; max-height: calc(100vh - 48px);
      border-radius: 20px; overflow-y: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.3);
      border: 1px solid #E2E8F0; display: flex; flex-direction: column; animation: pageFadeIn 0.25s ease;
      margin: auto;
    ">
      <!-- HEADER -->
      <div style="
        padding: 18px 24px 14px 24px; background: linear-gradient(135deg, #1A202C 0%, #2D3748 100%);
        color: #ffffff; display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
      ">
        <div>
          <span style="font-size: 0.74rem; font-weight: 800; color: #3182CE; letter-spacing: 0.1em; text-transform: uppercase;">STEP 1 OF 2 — CHOOSE LISTING PACKAGE</span>
          <h2 style="font-size: 1.3rem; font-weight: 800; color: #ffffff; margin: 3px 0 0 0;">Select Your Property Listing Package</h2>
        </div>

        <button id="close-adtype-modal-btn" style="
          background: rgba(255,255,255,0.12); border: none; color: #ffffff; width: 32px; height: 32px;
          border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.15rem; cursor: pointer;
        ">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <!-- CARDS COMPARISON GRID -->
      <div style="padding: 20px 24px; background: #FAF8F5; display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 18px;">
        
        <!-- CARD 1: FREE LISTING -->
        <div class="ad-type-choice-card" style="
          background: #ffffff; border-radius: 14px; padding: 20px 18px; border: 2px solid #3182CE;
          box-shadow: 0 8px 20px rgba(49,130,206,0.06); display: flex; flex-direction: column; justify-content: space-between;
          position: relative; transition: all 0.25s ease;
        ">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge" style="background: rgba(49,130,206,0.12); color: #3182CE; font-size: 0.74rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">
                FREE LISTING
              </span>
            </div>

            <h3 style="font-size: 1.2rem; font-weight: 800; color: #1A202C; margin: 0 0 6px 0;">Free Listing</h3>
            <p style="font-size: 0.82rem; color: #718096; line-height: 1.45; margin: 0 0 14px 0;">
              Zero upfront ad cost. Thanjai Property manages all buyer inquiries, property marketing, and client site visits for you.
            </p>

            <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 18px; font-size: 0.83rem; color: #4A5568;">
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Ad Cost:</strong> Free (₹0 Upfront Cost)</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Deal Commission:</strong> Commission percentage applicable on deal closure</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Inquiries:</strong> Handled directly by Thanjai Property advisory team</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Public Contact:</strong> Thanjai Property (<strong style="color: #3182CE;">+91 84899 96852</strong>)</span>
              </div>
            </div>
          </div>

          <button id="choose-free-ad-btn" style="
            width: 100%; padding: 11px; border-radius: 10px; border: 2px solid #3182CE;
            background: #ffffff; color: #3182CE; font-weight: 800; font-size: 0.9rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.2s;
          " onmouseover="this.style.background='#3182CE'; this.style.color='#ffffff';" onmouseout="this.style.background='#ffffff'; this.style.color='#3182CE';">
            <span>Proceed with Free Listing</span>
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>

        <!-- CARD 2: PAID LISTING -->
        <div class="ad-type-choice-card" style="
          background: #ffffff; border-radius: 14px; padding: 20px 18px; border: 2px solid #3182CE;
          box-shadow: 0 8px 20px rgba(49,130,206,0.06); display: flex; flex-direction: column; justify-content: space-between;
          position: relative; transition: all 0.25s ease;
        ">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span class="badge" style="background: rgba(49,130,206,0.12); color: #3182CE; font-size: 0.74rem; font-weight: 800; padding: 3px 10px; border-radius: 20px;">
                PAID LISTING
              </span>
            </div>

            <h3 style="font-size: 1.2rem; font-weight: 800; color: #1A202C; margin: 0 0 6px 0;">Paid Listing</h3>
            <p style="font-size: 0.82rem; color: #718096; line-height: 1.45; margin: 0 0 14px 0;">
              Direct buyer calls and messages sent straight to you with 0% deal commission and verified direct owner visibility.
            </p>

            <div style="display: flex; flex-direction: column; gap: 9px; margin-bottom: 18px; font-size: 0.83rem; color: #4A5568;">
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Ad Cost:</strong> Paid Listing Plan</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Deal Commission:</strong> <strong style="color: #3182CE;">0% Commission</strong> (Zero Brokerage)</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Inquiries:</strong> Direct buyer leads sent to your Dashboard & phone</span>
              </div>
              <div style="display: flex; align-items: flex-start; gap: 8px;">
                <i class="ri-checkbox-circle-fill" style="color: #3182CE; font-size: 1rem; flex-shrink: 0; margin-top: 1px;"></i>
                <span><strong>Public Contact:</strong> Direct Owner Name & Contact details</span>
              </div>
            </div>
          </div>

          <button id="choose-paid-ad-btn" style="
            width: 100%; padding: 11px; border-radius: 10px; border: 2px solid #3182CE;
            background: #3182CE; color: #ffffff; font-weight: 800; font-size: 0.9rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(49,130,206,0.25); transition: all 0.2s;
          " onmouseover="this.style.background='#2B6CB0'; this.style.borderColor='#2B6CB0';" onmouseout="this.style.background='#3182CE'; this.style.borderColor='#3182CE';">
            <span>Proceed with Paid Listing</span>
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>

      </div>

      <!-- FOOTER NOTE -->
      <div style="padding: 12px 24px; background: #ffffff; border-top: 1px solid #E2E8F0; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; flex-shrink: 0;">
        <span style="font-size: 0.78rem; color: #718096;">
          <i class="ri-shield-check-line" style="color: #3182CE;"></i> All listings are verified and approved by Thanjai Property administration before going live.
        </span>
        <button id="cancel-adtype-modal-btn" style="background: none; border: none; color: #718096; font-size: 0.82rem; font-weight: 700; cursor: pointer;">
          Cancel
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeModal = () => overlay.remove();
  document.getElementById('close-adtype-modal-btn')?.addEventListener('click', closeModal);
  document.getElementById('cancel-adtype-modal-btn')?.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  document.getElementById('choose-free-ad-btn')?.addEventListener('click', () => {
    closeModal();
    onSelect('free');
  });

  document.getElementById('choose-paid-ad-btn')?.addEventListener('click', () => {
    closeModal();
    onSelect('paid');
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', renderUserDashboard);
} else {
  renderUserDashboard();
}
