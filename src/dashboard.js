import { renderDashboardView, initDashboardListeners } from './crm-views/DashboardView.js';
import { renderLeadsView, initLeadsView } from './crm-views/LeadsView.js';
import { renderPropertiesView, initPropertiesListeners, resetPropertiesViewMode } from './crm-views/PropertiesView.js';
import { renderSiteVisitsView, initSiteVisitsView } from './crm-views/SiteVisitsView.js';
import { renderPipelineBoardView, initPipelineBoardView } from './crm-views/PipelineBoardView.js?v=2';
import { renderPartnersView, initPartnersView } from './crm-views/PartnersView.js';
import { renderAIAgentView, initAIAgentView } from './crm-views/AIAgentView.js';
import { renderWhatsAppLogView } from './crm-views/WhatsAppLogView.js';
import { renderWebsiteImagesView, initWebsiteImagesListeners } from './crm-views/WebsiteImagesView.js';
import { renderAuditLogView, initAuditLogListeners } from './crm-views/AuditLogView.js';
import { renderLeadDetailView, initLeadDetailView } from './crm-views/LeadDetailView.js';
import { renderBlogCMSView, initBlogCMSListeners } from './crm-views/BlogCMSView.js';
import { renderUsersView, initUsersView } from './crm-views/UsersView.js';
import { renderPropertyApprovalsView, initPropertyApprovalsView } from './crm-views/PropertyApprovalsView.js';
import { renderAgentsDirectoryView, initAgentsDirectoryView } from './crm-views/AgentsDirectoryView.js';
import { renderBuildersDirectoryView, initBuildersDirectoryView } from './crm-views/BuildersDirectoryView.js';
import { renderReportsView, initReportsView } from './crm-views/ReportsView.js';
import { renderSettingsView, initSettingsView } from './crm-views/SettingsView.js';
import { renderAdminUsersView, initAdminUsersView } from './crm-views/AdminUsersView.js';
import { showToast } from './utils/toast.js';

document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('os-content');
  const navItems = document.querySelectorAll('.nav-item');

  // Read active logged-in staff user and their module permissions
  let activeAdminUser = null;
  try {
    const rawActive = localStorage.getItem('thanjai_active_user');
    if (rawActive) activeAdminUser = JSON.parse(rawActive);
  } catch (e) {}

  const isSuperAdmin = !activeAdminUser || activeAdminUser.role === 'Super Admin' || activeAdminUser.roleCode === 'superadmin' || activeAdminUser.email === 'admin@realrest.example';
  const allowedModules = (activeAdminUser && Array.isArray(activeAdminUser.allowedModules) && activeAdminUser.allowedModules.length > 0)
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
    if (nameEl) nameEl.textContent = activeAdminUser.fullName || activeAdminUser.name || 'Admin Staff';
    if (roleEl) roleEl.textContent = activeAdminUser.role || 'Admin Staff';
    if (avatarEl) {
      const initials = (activeAdminUser.fullName || activeAdminUser.name || 'AS')
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
      avatarEl.textContent = initials;
    }
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
      case 'whatsapp':
        html = renderWhatsAppLogView();
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
      window.location.href = '/admin-login';
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
    window.location.href = '/admin-login';
  };

  document.getElementById('profile-logout-btn')?.addEventListener('click', handleAdminLogout);
  document.getElementById('sidebar-logout-btn')?.addEventListener('click', handleAdminLogout);

  // Initialize
  handleHashChange();
});

