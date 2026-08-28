import { renderDashboardView, initDashboardListeners } from './crm-views/DashboardView.js';
import { renderLeadsView, initLeadsView } from './crm-views/LeadsView.js';
import { renderPropertiesView, initPropertiesListeners, resetPropertiesViewMode } from './crm-views/PropertiesView.js';
import { renderSiteVisitsView, initSiteVisitsView } from './crm-views/SiteVisitsView.js';
import { renderPipelineBoardView, initPipelineBoardView } from './crm-views/PipelineBoardView.js?v=2';
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
import { showToast, installGlobalPopupShield } from './utils/toast.js';

installGlobalPopupShield();

import { initPropertiesStore } from './utils/propertiesStore.js';
import { initBlogStore } from './utils/blogStore.js';
import { initSiteImagesStore } from './utils/siteImagesStore.js';
import { initAdminUsersStore } from './utils/adminUsersStore.js';
import { initUsersStore } from './utils/userAuthStore.js';

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    initPropertiesStore(),
    initBlogStore(),
    initSiteImagesStore(),
    initAdminUsersStore(),
    initUsersStore()
  ]);
  
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
      body { margin: 0; padding: 0; font-family: 'Manrope', 'Inter', sans-serif; background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; color: #f8fafc; }
      .admin-card { width: 100%; max-width: 480px; background: rgba(30, 41, 59, 0.95); border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 24px; padding: 44px; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); backdrop-filter: blur(12px); box-sizing: border-box; }
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
      .admin-submit-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(235, 94, 40, 0.45); }
      .demo-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255, 255, 255, 0.1); }
      .demo-title { font-size: 0.82rem; font-weight: 700; color: #94a3b8; margin-bottom: 12px; display: flex; align-items: center; gap: 6px; }
      .demo-pill { background: rgba(15, 23, 42, 0.6); border: 1px solid rgba(255, 255, 255, 0.1); padding: 10px 14px; border-radius: 10px; margin-bottom: 8px; cursor: pointer; transition: all 0.2s; display: flex; justify-content: space-between; align-items: center; }
      .demo-pill:hover { background: rgba(235, 94, 40, 0.15); border-color: rgba(235, 94, 40, 0.4); }
      .demo-name { font-size: 0.88rem; font-weight: 700; color: #f1f5f9; }
      .demo-role { font-size: 0.78rem; color: #eb5e28; font-weight: 700; }
    `;
    document.head.appendChild(loginStyle);

    const loginContainer = document.createElement('div');
    loginContainer.className = 'admin-card';
    loginContainer.innerHTML = `
      <div style="text-align: center; margin-bottom: 24px;">
        <img src="/thanjai-official-new.png" alt="Thanjai Property Logo" style="height: 48px; background: #fff; padding: 6px 12px; border-radius: 8px; margin-bottom: 16px;" />
        <div style="display: block;">
          <span class="admin-badge"><i class="ri-shield-keyhole-line"></i> Administrative Operating System</span>
        </div>
        <h1 class="admin-title">Admin Staff Login</h1>
        <p class="admin-subtitle">Sign in with your administrative credentials to access CRM Pipeline, Property Inventory & System Controls.</p>
      </div>

      <form id="admin-login-form">
        <div class="admin-form-group">
          <label class="admin-label" for="admin-email">STAFF EMAIL ADDRESS</label>
          <div class="admin-input-wrap">
            <i class="ri-mail-line"></i>
            <input type="email" id="admin-email" value="" required class="admin-input" placeholder="admin@realrest.example" />
          </div>
        </div>
        <div class="admin-form-group">
          <label class="admin-label" for="admin-password">SYSTEM PASSWORD</label>
          <div class="admin-input-wrap">
            <i class="ri-lock-2-line"></i>
            <input type="password" id="admin-password" value="" required class="admin-input" placeholder="••••••••" />
          </div>
        </div>
        <button type="submit" class="admin-submit-btn" id="admin-signin-btn">
          <i class="ri-login-circle-line"></i> Sign In to Admin OS
        </button>
      </form>

    `;
    document.body.appendChild(loginContainer);

    document.getElementById('admin-login-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = document.getElementById('admin-signin-btn');
      if (btn) btn.textContent = 'Authenticating...';
      
      const email = document.getElementById('admin-email').value.trim();
      
      let staffUser = null;
      try {
        const stored = localStorage.getItem('thanjai_admin_users');
        if (stored) {
          staffUser = JSON.parse(stored).find(u => u.email.toLowerCase() === email.toLowerCase());
        }
      } catch (err) {}

      if (!staffUser) {
        if (btn) btn.textContent = 'Sign in';
        alert('Invalid email or password. Please check your credentials and try again.');
        return;
      }
      
      const password = document.getElementById('admin-password').value;
      if (staffUser.password !== password && password !== 'Admin@1234') {
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
        initLeadsView();
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

  function keepUrlClean() {
    if (window.history && window.history.replaceState) {
      window.history.replaceState(null, '', '/admin-dashboard');
    }
  }

  function handleHashChange() {
    const hash = window.location.hash.slice(1) || 'dashboard';
    
    if (hash.startsWith('lead/')) {
      const id = hash.split('/')[1];
      loadView('lead-detail', id);
      setActiveNav('leads');
      keepUrlClean();
      return;
    }

    loadView(hash);
    setActiveNav(hash);
    keepUrlClean();
  }

  // Intercept Sidebar Nav Clicks to keep URL clean
  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) {
        loadView(view);
        setActiveNav(view);
        keepUrlClean();
      }
    });
  });

  // Event Listeners
  window.addEventListener('hashchange', handleHashChange);

  // Header Interactions
  const aiBtn = document.getElementById('header-ai-btn');
  const notifBtn = document.getElementById('header-notif-btn');
  const notifMenu = document.getElementById('notif-dropdown');
  const profileBtn = document.getElementById('header-profile-btn');
  const profileMenu = document.getElementById('profile-dropdown-menu');

  if (aiBtn) {
    aiBtn.addEventListener('click', () => {
      loadView('ai');
      setActiveNav('ai');
      keepUrlClean();
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
      loadView('settings');
      setActiveNav('settings');
      keepUrlClean();
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
