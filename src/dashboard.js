import { renderDashboardView } from './crm-views/DashboardView.js';
import { renderLeadsView } from './crm-views/LeadsView.js';
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

  // Initialize
  handleHashChange();
});
