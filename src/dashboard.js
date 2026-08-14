import { renderDashboardView } from './crm-views/DashboardView.js';
import { renderLeadsView, initLeadsView } from './crm-views/LeadsView.js';
import { renderPropertiesView } from './crm-views/PropertiesView.js';
import { renderSiteVisitsView } from './crm-views/SiteVisitsView.js';
import { renderPartnersView } from './crm-views/PartnersView.js';
import { renderAIAgentView } from './crm-views/AIAgentView.js';
import { renderWhatsAppLogView } from './crm-views/WhatsAppLogView.js';

document.addEventListener('DOMContentLoaded', () => {
  const contentArea = document.getElementById('os-content');
  const navItems = document.querySelectorAll('.nav-item');

  function loadView(viewName) {
    let html = '';
    switch (viewName) {
      case 'dashboard':
        html = renderDashboardView();
        break;
      case 'leads':
        html = renderLeadsView();
        break;
      case 'properties':
        html = renderPropertiesView();
        break;
      case 'visits':
        html = renderSiteVisitsView();
        break;
      case 'partners':
        html = renderPartnersView();
        break;
      case 'ai':
        html = renderAIAgentView();
        break;
      case 'whatsapp':
        html = renderWhatsAppLogView();
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

  // Initialize
  handleHashChange();
});
