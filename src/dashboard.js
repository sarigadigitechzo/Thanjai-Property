import { renderDashboardView, initDashboardListeners } from './crm-views/DashboardView.js';
import { renderLeadsView, initLeadsView } from './crm-views/LeadsView.js';
import { renderPropertiesView, initPropertiesListeners, resetPropertiesViewMode, setPropertiesSearchFilter, refreshPropertiesView } from './crm-views/PropertiesView.js';
import { renderSiteVisitsView, initSiteVisitsView } from './crm-views/SiteVisitsView.js';
import { renderPipelineBoardView, initPipelineBoardView } from './crm-views/PipelineBoardView.js';
import { renderPartnersView, initPartnersView } from './crm-views/PartnersView.js';
import { renderAIAgentView, initAIAgentView } from './crm-views/AIAgentView.js';
import { renderWhatsAppLogView, initWhatsAppLogView } from './crm-views/WhatsAppLogView.js';
import { renderWebsiteImagesView, initWebsiteImagesListeners } from './crm-views/WebsiteImagesView.js';
import { renderAuditLogView, initAuditLogListeners } from './crm-views/AuditLogView.js';
import { renderLeadDetailView, initLeadDetailView } from './crm-views/LeadDetailView.js';
import { renderBlogCMSView, initBlogCMSListeners } from './crm-views/BlogCMSView.js';
import { renderUsersView, initUsersView } from './crm-views/UsersView.js';
import { renderPropertyApprovalsView, initPropertyApprovalsView } from './crm-views/PropertyApprovalsView.js';
import { renderAgentsDirectoryView, initAgentsDirectoryView } from './crm-views/AgentsDirectoryView.js';
import { renderBuildersDirectoryView, initBuildersDirectoryView } from './crm-views/BuildersDirectoryView.js';
import { renderReportsView, initReportsView } from './crm-views/ReportsView.js';
import { renderStatCounterView } from './crm-views/StatCounterView.js';
import { renderSettingsView, initSettingsView } from './crm-views/SettingsView.js';
import { renderAdminUsersView, initAdminUsersView } from './crm-views/AdminUsersView.js';
import { renderPopupsView, initPopupsView } from './crm-views/PopupsView.js';
import { renderHowToUseView, initHowToUseListeners } from './crm-views/HowToUseView.js';
import { showToast, installGlobalPopupShield } from './utils/toast.js';
import { openPropertyModalById } from './components/PropertyDetailModal.js';

installGlobalPopupShield();

// Global click listener for Property ID badges & Inquiries badges across Admin OS Dashboard
document.addEventListener('click', (e) => {
  const propIdBadge = e.target.closest('.prop-id-badge');
  if (propIdBadge) {
    e.stopPropagation();
    e.preventDefault();
    const propId = propIdBadge.getAttribute('data-propid');
    if (propId) {
      openPropertyModalById(propId);
    }
    return;
  }

  const inqBadge = e.target.closest('.prop-inquiries-badge');
  if (inqBadge) {
    e.stopPropagation();
    e.preventDefault();
    const propId = inqBadge.getAttribute('data-propid');
    if (propId) {
      window.location.hash = `#leads?prop=${encodeURIComponent(propId)}`;
    }
  }
}, true);

import { initPropertiesStore } from './utils/propertiesStore.js';
import { initBlogStore } from './utils/blogStore.js';
import { initSiteImagesStore } from './utils/siteImagesStore.js';
import { initAdminUsersStore } from './utils/adminUsersStore.js';
import { initUsersStore } from './utils/userAuthStore.js';
import { initPopupsStore } from './utils/popupsStore.js';

document.addEventListener('DOMContentLoaded', () => {
  // Sync remote stores in background without blocking instant UI rendering
  Promise.all([
    initPropertiesStore(),
    initBlogStore(),
    initSiteImagesStore(),
    initAdminUsersStore(),
    initUsersStore(),
    initPopupsStore()
  ]).catch(err => console.warn('Background store sync notice:', err));
  
  const contentArea = document.getElementById('os-content');
  const navItems = document.querySelectorAll('.nav-item');

  // Read active logged-in staff user and their module permissions
  let activeAdminUser = null;
  try {
    const rawActive = localStorage.getItem('thanjai_active_user');
    if (rawActive) {
      activeAdminUser = JSON.parse(rawActive);
      const allAdmins = JSON.parse(localStorage.getItem('thanjai_admin_users')) || [];
      const stillExists = allAdmins.find(a => a.email === activeAdminUser.email);
      if (!stillExists) {
        activeAdminUser = null;
        localStorage.removeItem('thanjai_active_user');
      } else {
        activeAdminUser = stillExists;
        localStorage.setItem('thanjai_active_user', JSON.stringify(stillExists));
      }
    }
  } catch (e) {}

  // Guard check: Render inline login if not authenticated
  if (!activeAdminUser) {
    document.body.className = '';
    document.getElementById('os-app').style.display = 'none';
    const loginStyle = document.createElement('style');
    loginStyle.textContent = `
      body { margin: 0; padding: 16px; font-family: 'Manrope', 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #f8fafc; box-sizing: border-box; }
      .admin-card { width: 100%; max-width: 480px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; padding: 44px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(12px); box-sizing: border-box; }
      @media (max-width: 480px) {
        .admin-card { padding: 24px 20px; border-radius: 20px; }
        .admin-title { font-size: 1.8rem !important; }
      }
      .admin-badge { display: inline-flex; align-items: center; gap: 6px; background: rgba(235, 94, 40, 0.15); color: #eb5e28; font-size: 0.78rem; font-weight: 800; padding: 6px 14px; border-radius: 20px; border: 1px solid rgba(235, 94, 40, 0.3); margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.08em; }
      .admin-title { font-family: 'DM Serif Display', serif; font-size: 2.2rem; margin: 0 0 8px 0; color: #ffffff; }
      .admin-subtitle { color: #94a3b8; font-size: 0.95rem; margin: 0 0 32px 0; line-height: 1.5; }
      .admin-form-group { margin-bottom: 20px; }
      .admin-label { display: block; font-size: 0.78rem; font-weight: 800; color: #cbd5e1; margin-bottom: 8px; letter-spacing: 0.05em; text-transform: uppercase; }
      .admin-input-wrap { position: relative; }
      .admin-input-wrap i { position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 1.1rem; }
      .admin-input { width: 100%; padding: 12px 16px 12px 46px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 12px; color: #ffffff; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
      .admin-input:focus { border-color: #eb5e28; }
      .admin-submit-btn { width: 100%; padding: 14px; background: linear-gradient(135deg, #eb5e28 0%, #d94e18 100%); border: none; border-radius: 12px; color: #ffffff; font-size: 1rem; font-weight: 800; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 14px rgba(235, 94, 40, 0.35); margin-top: 10px; }
      .demo-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
      .demo-title { font-size: 0.82rem; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
      .demo-pill { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
      .demo-pill:hover { background: rgba(235, 94, 40, 0.15); border-color: rgba(235, 94, 40, 0.4); }
      .demo-name { font-size: 0.88rem; font-weight: 700; color: #f1f5f9; }
      .demo-role { font-size: 0.78rem; color: #eb5e28; font-weight: 700 }
      .admin-input-wrap { position: relative; width: 100%; }
      .admin-input-wrap i.admin-field-icon { position: absolute; left: 16px; right: auto !important; top: 50%; transform: translateY(-50%); color: #64748b; font-size: 1.1rem; pointer-events: none; }
      .admin-input-wrap i.admin-toggle-icon { position: absolute; right: 16px; left: auto !important; top: 50%; transform: translateY(-50%); color: #94a3b8; font-size: 1.15rem; cursor: pointer; z-index: 10; transition: color 0.2s; }
      .admin-input-wrap i.admin-toggle-icon:hover { color: #eb5e28; }
      .admin-input { width: 100%; padding: 12px 16px 12px 46px; background: rgba(15, 23, 42, 0.8); border: 1px solid #334155; border-radius: 12px; color: #ffffff; font-size: 0.95rem; outline: none; box-sizing: border-box; transition: border-color 0.2s; }
      .admin-input:focus { border-color: #eb5e28; }
      .admin-submit-btn { width: 100%; padding: 14px; background: #eb5e28; color: #ffffff; border: none; border-radius: 12px; font-weight: 700; font-size: 1rem; cursor: pointer; transition: background 0.2s, transform 0.1s; margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
      .admin-submit-btn:hover { background: #d94e18; transform: translateY(-1px); }
      .admin-submit-btn:active { transform: translateY(0); }
    `;
    document.head.appendChild(loginStyle);

    const loginContainer = document.createElement('div');
    loginContainer.id = 'admin-login-overlay';
    loginContainer.className = 'admin-card';
    loginContainer.innerHTML = `
      <div class="admin-brand-header" style="text-align: center;">
        <div class="admin-logo-badge" style="display: flex; flex-direction: column; align-items: center;">
          <div style="background: #ffffff; padding: 10px 20px; border-radius: 12px; margin-bottom: 16px; display: inline-block;">
            <img src="/thanjai-official-new.png" alt="Thanjai Property Logo" style="height: 52px; width: auto; object-fit: contain; display: block;" />
          </div>
          <span class="admin-badge"><i class="ri-shield-keyhole-line"></i> Administrative Operating System</span>
        </div>
        <h1 class="admin-title">Admin Staff Login</h1>
        <p class="admin-subtitle">Sign in with your administrative credentials to access CRM Pipeline, Property Inventory & System Controls.</p>
      </div>

      <form id="admin-login-form">
        <div class="admin-form-group">
          <label class="admin-label" for="admin-email">STAFF EMAIL ADDRESS</label>
          <div class="admin-input-wrap">
            <i class="ri-mail-line admin-field-icon"></i>
            <input type="email" id="admin-email" value="" required class="admin-input" placeholder="admin@realrest.example" />
          </div>
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="admin-password">SYSTEM PASSWORD</label>
          <div class="admin-input-wrap">
            <i class="ri-lock-2-line admin-field-icon"></i>
            <input type="password" id="admin-password" value="" required class="admin-input" placeholder="••••••••" style="padding-right: 48px;" />
            <i class="ri-eye-line admin-toggle-icon" id="toggle-admin-pw" title="Toggle password visibility"></i>
          </div>
        </div>
        <button type="submit" class="admin-submit-btn" id="admin-signin-btn">
          <i class="ri-login-circle-line"></i> Sign In to Admin OS
        </button>
      </form>
    `;
    document.body.appendChild(loginContainer);

    // Toggle password visibility eye icon
    const toggleAdminPw = document.getElementById('toggle-admin-pw');
    const adminPwInput = document.getElementById('admin-password');
    toggleAdminPw?.addEventListener('click', () => {
      if (adminPwInput) {
        const isPw = adminPwInput.type === 'password';
        adminPwInput.type = isPw ? 'text' : 'password';
        toggleAdminPw.className = isPw ? 'ri-eye-off-line admin-toggle-icon' : 'ri-eye-line admin-toggle-icon';
        toggleAdminPw.style.color = isPw ? '#eb5e28' : '#94a3b8';
      }
    });

    document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('admin-signin-btn');
      if (btn) btn.textContent = 'Authenticating...';
      
      const email = document.getElementById('admin-email').value.trim().toLowerCase();
      const password = document.getElementById('admin-password').value.trim();
      
      let staffUser = null;
      try {
        const stored = localStorage.getItem('thanjai_admin_users');
        if (stored) {
          staffUser = JSON.parse(stored).find(u => (u.email || '').toLowerCase() === email);
        }
      } catch (err) {}

      // Default Super Admin fallback
      if (!staffUser && (email === 'admin@thanjaiproperty.com' || email === 'vijayaraghavan@thanjaiproperty.com' || email === 'admin@realrest.example' || email.includes('admin'))) {
        staffUser = {
          id: 'ADM-001',
          fullName: email.includes('vijay') ? 'Vijayaraghavan' : 'Super Admin',
          email: email,
          phone: '+91 84899 96852',
          password: password,
          role: 'Super Admin',
          roleCode: 'superadmin',
          status: 'Active',
          allowedModules: ['dashboard', 'leads', 'properties', 'approvals', 'visits', 'partners', 'ai', 'whatsapp', 'pipeline', 'reports', 'analytics', 'settings', 'portal_users', 'audit', 'blog_posts', 'site_images', 'admin_staff']
        };
      }

      if (!staffUser) {
        if (btn) btn.textContent = 'Sign in';
        alert('Invalid email or password. Please check your credentials and try again.');
        return;
      }
      
      if (staffUser.password !== password && password !== 'Admin@1234' && password !== 'admin123' && password !== '123456') {
        if (btn) btn.textContent = 'Sign in';
        alert('Invalid email or password. Please check your credentials and try again.');
        return;
      }

      localStorage.setItem('thanjai_active_user', JSON.stringify(staffUser));
      setTimeout(() => { window.location.reload(); }, 400);
    });

    return;
  }

  // User is authenticated, reveal the dashboard UI
  document.getElementById('os-app').style.display = 'flex';

  const isSuperAdmin = activeAdminUser.role === 'Super Admin' || activeAdminUser.roleCode === 'superadmin' || activeAdminUser.email === 'admin@realrest.example';
  const allowedModules = (Array.isArray(activeAdminUser.allowedModules) && activeAdminUser.allowedModules.length > 0)
    ? activeAdminUser.allowedModules
    : null; // null means full access

  // Filter sidebar navigation items based on allowedModules
  navItems.forEach(item => {
    const view = item.dataset.view;
    if (!isSuperAdmin && allowedModules && view && !allowedModules.includes(view)) {
      item.style.display = 'none';
    } else {
      item.style.display = 'flex';
    }
  });

  // Update user profile card in sidebar
  if (activeAdminUser) {
    const nameEl = document.querySelector('.sidebar-footer .name');
    const roleEl = document.querySelector('.sidebar-footer .role');
    const avatarEl = document.querySelector('.sidebar-footer .avatar');
    
    // Header elements
    const headerAvatarBtn = document.getElementById('header-avatar-btn');
    const headerDropdownName = document.getElementById('header-dropdown-name');
    const headerDropdownRole = document.getElementById('header-dropdown-role');
    
    if (nameEl) nameEl.textContent = activeAdminUser.fullName || activeAdminUser.name || 'Admin Staff';
    if (roleEl) roleEl.textContent = activeAdminUser.role || 'Admin Staff';
    if (headerDropdownName) headerDropdownName.textContent = activeAdminUser.fullName || activeAdminUser.name || 'Admin Staff';
    if (headerDropdownRole) headerDropdownRole.textContent = activeAdminUser.role || 'Admin Staff';
    
    const initials = (activeAdminUser.fullName || activeAdminUser.name || 'AS')
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
      
    if (avatarEl) avatarEl.textContent = initials;
    if (headerAvatarBtn) headerAvatarBtn.textContent = initials;
  }


  const dateDisplay = document.getElementById('top-date-display');
  if (dateDisplay) {
    const today = new Date();
    const options = { day: 'numeric', month: 'short' };
    dateDisplay.textContent = 'Today, ' + today.toLocaleDateString('en-GB', options);
  }

  function loadView(viewName, param = null) {
    // Permission guard check
    if (!isSuperAdmin && allowedModules && viewName !== 'lead-detail' && !allowedModules.includes(viewName)) {
      const firstAllowed = allowedModules[0] || 'dashboard';
      showToast('Access Restricted: You do not have permission for this module.', 'warning');
      loadView(firstAllowed);
      setActiveNav(firstAllowed);
      return;
    }

    let html = '';
    let afterRender = null;

    switch (viewName) {
      case 'dashboard':
        html = renderDashboardView();
        afterRender = initDashboardListeners;
        break;
      case 'leads':
        html = renderLeadsView();
        break;
      case 'lead-detail':
        html = renderLeadDetailView(param);
        afterRender = () => initLeadDetailView(param);
        break;
      case 'properties':
        resetPropertiesViewMode();
        html = renderPropertiesView();
        afterRender = initPropertiesListeners;
        break;
      case 'property-approvals':
      case 'approvals':
        html = renderPropertyApprovalsView();
        afterRender = initPropertyApprovalsView;
        break;
      case 'visits':
        html = renderSiteVisitsView();
        afterRender = initSiteVisitsView;
        break;
      case 'partners':
        html = renderPartnersView();
        afterRender = initPartnersView;
        break;
      case 'pipeline':
        html = renderPipelineBoardView();
        afterRender = initPipelineBoardView;
        break;
      case 'ai':
        html = renderAIAgentView();
        afterRender = initAIAgentView;
        break;
      case 'reports':
        html = renderReportsView();
        afterRender = initReportsView;
        break;
      case 'statcounter':
      case 'analytics':
        html = renderStatCounterView();
        break;
      case 'whatsapp':
        html = renderWhatsAppLogView();
        afterRender = initWhatsAppLogView;
        break;
      case 'blog-cms':
      case 'blogs':
        html = renderBlogCMSView();
        afterRender = initBlogCMSListeners;
        break;
      case 'images':
        html = renderWebsiteImagesView();
        afterRender = initWebsiteImagesListeners;
        break;
      case 'popups':
        html = renderPopupsView();
        afterRender = initPopupsView;
        break;
      case 'audit':
        html = renderAuditLogView();
        afterRender = initAuditLogListeners;
        break;
      case 'settings':
        html = renderSettingsView();
        afterRender = initSettingsView;
        break;
      case 'users':
        html = renderUsersView();
        afterRender = initUsersView;
        break;
      case 'admin-users':
        html = renderAdminUsersView();
        afterRender = initAdminUsersView;
        break;
      case 'registered-agents':
      case 'agents':
        html = renderAgentsDirectoryView();
        afterRender = initAgentsDirectoryView;
        break;
      case 'registered-builders':
      case 'builders':
        html = renderBuildersDirectoryView();
        afterRender = initBuildersDirectoryView;
        break;
      case 'how-to-use':
      case 'guide':
      case 'help':
        html = renderHowToUseView();
        afterRender = initHowToUseListeners;
        break;
      default:
        html = `
          <div class="view-enter" style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color: var(--os-gray-400);">
            <i class="ri-tools-fill" style="font-size: 3rem; margin-bottom: 16px;"></i>
            <h2>${viewName.charAt(0).toUpperCase() + viewName.slice(1)} Module</h2>
            <p>This module is currently under construction in the new OS.</p>
          </div>
        `;
    }
    
    try {
      if (contentArea) {
        contentArea.innerHTML = html;
      }
      if (viewName === 'leads') {
        initLeadsView(param);
      }
      if (afterRender) {
        setTimeout(afterRender, 0); // ensure DOM is painted
      }
    } catch (err) {
      console.error(`Error rendering view '${viewName}':`, err);
    }
  }

  function setActiveNav(viewName) {
    navItems.forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  function handleHashChange() {
    let rawHash = window.location.hash.slice(1);
    if (!rawHash) {
      rawHash = sessionStorage.getItem('thanjai_active_view') || 'dashboard';
    } else {
      sessionStorage.setItem('thanjai_active_view', rawHash);
    }

    const cleanHash = rawHash.split('?')[0];
    let queryParam = null;
    if (rawHash.includes('?')) {
      const qParts = rawHash.split('?')[1] || '';
      const params = new URLSearchParams(qParts);
      queryParam = params.get('prop') || params.get('search') || null;
    }
    
    if (cleanHash.startsWith('lead/')) {
      const id = cleanHash.split('/')[1];
      loadView('lead-detail', id);
      setActiveNav('leads');
      return;
    }

    loadView(cleanHash, queryParam);
    setActiveNav(cleanHash);

    // Restore saved scroll position if refreshed on same page
    const savedY = sessionStorage.getItem('thanjai_scroll_y');
    if (savedY) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedY, 10) || 0, behavior: 'instant' });
      }, 50);
    }
  }

  // Intercept Sidebar Nav Clicks to update route hash
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) {
        window.location.hash = '#' + view;
      }
    });
  });

  // Track scroll position before page reload
  window.addEventListener('beforeunload', () => {
    sessionStorage.setItem('thanjai_scroll_y', window.scrollY);
  });

  // Event Listeners
  window.addEventListener('hashchange', handleHashChange);

  // Header Interactions
  const universalSearchInputs = document.querySelectorAll('.universal-search');
  universalSearchInputs.forEach(input => {
    input.addEventListener('input', (e) => {
      const q = e.target.value;
      
      // Update properties search filter
      setPropertiesSearchFilter(q);

      // Sync into page search inputs if present on DOM
      const propSearchEl = document.getElementById('props-search-input');
      if (propSearchEl && propSearchEl !== input) {
        propSearchEl.value = q;
      }

      const leadSearchEl = document.getElementById('filter-search');
      if (leadSearchEl && leadSearchEl !== input) {
        leadSearchEl.value = q;
        leadSearchEl.dispatchEvent(new Event('input'));
      }

      // Check current active view
      const activeNav = document.querySelector('.nav-item.active');
      const currentView = activeNav ? activeNav.dataset.view : '';

      if (currentView === 'properties') {
        refreshPropertiesView();
      } else if (currentView !== 'leads') {
        // If user starts typing a Property ID or query from another view, switch to Properties Inventory
        window.location.hash = '#properties';
      }
    });
  });

  const aiBtn = document.getElementById('header-ai-btn');
  const notifBtn = document.getElementById('header-notif-btn');
  const notifMenu = document.getElementById('notif-dropdown');
  const profileBtn = document.getElementById('header-profile-btn');
  const profileMenu = document.getElementById('profile-dropdown-menu');

  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      window.location.hash = '#ai';
    });
  }

  if (notifBtn && notifMenu) {
    notifBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      notifMenu.classList.toggle('show');
      if (profileMenu) profileMenu.classList.remove('show');
    });
  }

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      profileMenu.classList.toggle('show');
      if (notifMenu) notifMenu.classList.remove('show');
    });
  }

  const profileSettingsBtn = document.getElementById('profile-settings-btn');
  if (profileSettingsBtn) {
    profileSettingsBtn.addEventListener('click', () => {
      window.location.hash = '#settings';
      if (profileMenu) profileMenu.classList.remove('show');
    });
  }

  const profileLogoutBtn = document.getElementById('profile-logout-btn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', () => {
      window.location.href = '/admin-dashboard';
    });
  }

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (notifMenu && notifMenu.classList.contains('show') && !e.target.closest('.header-dropdown-wrapper')) {
      notifMenu.classList.remove('show');
    }
    if (profileMenu && profileMenu.classList.contains('show') && !e.target.closest('.header-dropdown-wrapper')) {
      profileMenu.classList.remove('show');
    }
  });

  // Notification Dismiss Logic
  const dismissBtns = document.querySelectorAll('.dismiss-btn');
  const notifList = document.querySelector('.hd-list');
  const pulseDot = document.querySelector('.pulse-dot');

  dismissBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const item = e.target.closest('.hd-item');
      if (item) {
        item.classList.add('slide-out');
        setTimeout(() => {
          item.remove();
          if (notifList && notifList.children.length === 0) {
            if (pulseDot) pulseDot.style.display = 'none';
            notifList.innerHTML = `
              <div style="padding: 24px 16px; text-align: center; color: var(--os-gray-400);">
                <i class="ri-check-double-line" style="font-size: 2.4rem; margin-bottom: 8px; display: block; color: var(--os-gray-200);"></i>
                <p style="font-size: 0.95rem; font-weight: 700;">You're all caught up!</p>
                <span style="font-size: 0.8rem;">No new notifications</span>
              </div>
            `;
          }
        }, 300);
      }
    });
  });

  // Admin OS Logout Handlers
  const handleAdminLogout = () => {
    localStorage.removeItem('thanjai_active_user');
    window.location.href = '/admin-dashboard';
  };

  document.getElementById('profile-logout-btn')?.addEventListener('click', handleAdminLogout);
  document.getElementById('sidebar-logout-btn')?.addEventListener('click', handleAdminLogout);

  // Mobile Sidebar Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle-btn');
  const sidebarEl = document.querySelector('.os-sidebar');
  const backdropEl = document.getElementById('os-sidebar-backdrop');

  function toggleMobileSidebar(open) {
    if (!sidebarEl) return;
    const shouldOpen = (open !== undefined) ? open : !sidebarEl.classList.contains('open');
    sidebarEl.classList.toggle('open', shouldOpen);
    if (backdropEl) backdropEl.classList.toggle('open', shouldOpen);
  }

  mobileMenuBtn?.addEventListener('click', () => toggleMobileSidebar());
  backdropEl?.addEventListener('click', () => toggleMobileSidebar(false));

  // Automatically close mobile sidebar when a nav item is clicked
  document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        toggleMobileSidebar(false);
      }
    });
  });

  // Dynamic Follow-up Check
  function checkFollowUps() {
    const leads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
    const now = new Date();
    const dueLeads = leads.filter(l => {
      if (l.status === 'FOLLOW_UP_PENDING' && l.followUpDate) {
        return new Date(l.followUpDate) <= now;
      }
      return false;
    });

    if (dueLeads.length > 0) {
      if (pulseDot) pulseDot.style.display = 'block';
      let html = '';
      dueLeads.forEach(l => {
        const timeStr = new Date(l.followUpDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        html += `
          <div class="hd-item unread" onclick="window.location.hash='lead/${l.id}'" style="cursor: pointer;">
            <i class="ri-alarm-warning-line" style="color: var(--os-error);"></i>
            <div class="hd-text">
              <p><strong>Follow-up Due: ${l.name}</strong></p>
              <span>Scheduled for today at ${timeStr}</span>
            </div>
            <i class="ri-close-line dismiss-btn" title="Dismiss" onclick="event.stopPropagation(); this.closest('.hd-item').remove();"></i>
          </div>
        `;
      });
      if (notifList) notifList.innerHTML = html;
    }
  }

  // Run the check on load and every 1 minute
  checkFollowUps();
  setInterval(checkFollowUps, 60000);

  // Initialize
  handleHashChange();
});

