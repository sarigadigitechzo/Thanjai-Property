import { renderDashboardView, initDashboardListeners } from './crm-views/DashboardView.js';
import { renderLeadsView, initLeadsView } from './crm-views/LeadsView.js';
import { renderPropertiesView, initPropertiesListeners } from './crm-views/PropertiesView.js';
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

document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('os-content');
  const navItems = document.querySelectorAll('.nav-item');

  function loadView(viewName, param = null) {
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
      case 'users':
        html = renderUsersView();
        afterRender = initUsersView;
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
    
    contentArea.innerHTML = html;
    if (viewName === 'leads') {
      initLeadsView();
    }
    if (afterRender) {
      setTimeout(afterRender, 0); // ensure DOM is painted
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
    const hash = window.location.hash.slice(1) || 'dashboard';
    
    if (hash.startsWith('lead/')) {
      const id = hash.split('/')[1];
      loadView('lead-detail', id);
      setActiveNav('leads');
      return;
    }

    loadView(hash);
    setActiveNav(hash);
  }

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
      window.location.hash = 'ai';
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
      window.location.hash = 'settings';
      if (profileMenu) profileMenu.classList.remove('show');
    });
  }

  const profileLogoutBtn = document.getElementById('profile-logout-btn');
  if (profileLogoutBtn) {
    profileLogoutBtn.addEventListener('click', () => {
      window.location.href = '/login.html';
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

  // Properties Updated Reactive Listener
  // Guard: skip re-routing when already on #properties — PropertiesView.js manages its own refresh.
  window.addEventListener('propertiesUpdated', () => {
    const currentHash = window.location.hash.slice(1) || 'dashboard';
    if (currentHash !== 'properties') {
      handleHashChange();
    }
  });

  window.addEventListener('storage', (e) => {
    if (e.key === 'thanjai_properties') {
      handleHashChange();
    }
  });

  // Initialize
  handleHashChange();
});

