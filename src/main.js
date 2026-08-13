import './style.css';
import { PROPERTIES } from './data/properties.js';
import { renderNavbar, initNavbarListeners } from './components/Navbar.js';
import { renderHero, initHeroListeners } from './components/Hero.js';
import { renderExploreSection, initExploreSectionListeners } from './components/ExploreSection.js';
import { renderPropertyGrid, initPropertyGridListeners } from './components/PropertyGrid.js';
import { renderShowcaseBanner, initShowcaseListeners } from './components/ShowcaseBanner.js';
import { renderLocationExplorer, initLocationExplorerListeners } from './components/LocationExplorer.js';
import { renderCategoryCarousel, initCategoryCarouselListeners } from './components/CategoryCarousel.js';
import { renderLuxuryTransition } from './components/LuxuryTransition.js';
import { renderAgentShowcase, initAgentListeners } from './components/AgentShowcase.js';
import { renderPostPropertyCTA, initPostPropertyCTAListeners } from './components/PostPropertyCTA.js';
import { renderFooter } from './components/Footer.js';
import { renderMobileBottomNav, initMobileBottomNavListeners } from './components/MobileBottomNav.js';
import { renderPropertyDetailModal, initPropertyDetailModalListeners } from './components/PropertyDetailModal.js';
import { renderPostPropertyModal, initPostPropertyModalListeners } from './components/PostPropertyModal.js';
import { renderScheduleVisitModal, initScheduleVisitModalListeners } from './components/ScheduleVisitModal.js';
import { getFavorites } from './utils/favorites.js';
import { showToast } from './utils/toast.js';

// Application State
let appState = {
  activeFilter: 'all',
  locationFilter: 'all',
  purposeFilter: 'all',
  typeFilter: 'all',
  budgetFilter: 'all',
  selectedPropertyId: null,
  isPostModalOpen: false,
  scheduleModalData: null,
  isSavedOnlyView: false
};

function getFilteredProperties() {
  return PROPERTIES.filter(prop => {
    // Saved view filter
    if (appState.isSavedOnlyView) {
      const favorites = getFavorites();
      if (!favorites.includes(prop.id)) return false;
    }

    // Filter pills (category or purpose)
    if (appState.activeFilter !== 'all') {
      if (appState.activeFilter === 'buy' || appState.activeFilter === 'rent') {
        if (prop.purpose !== appState.activeFilter) return false;
      } else {
        if (prop.category !== appState.activeFilter) return false;
      }
    }

    // Purpose filter from hero
    if (appState.purposeFilter !== 'all' && appState.purposeFilter !== 'sell') {
      if (prop.purpose !== appState.purposeFilter) return false;
    }

    // Location filter
    if (appState.locationFilter !== 'all') {
      if (prop.district.toLowerCase() !== appState.locationFilter.toLowerCase() &&
          prop.location.toLowerCase() !== appState.locationFilter.toLowerCase()) {
        return false;
      }
    }

    // Type filter
    if (appState.typeFilter !== 'all') {
      if (prop.category !== appState.typeFilter) return false;
    }

    // Budget filter
    if (appState.budgetFilter !== 'all') {
      const p = prop.price;
      if (appState.budgetFilter === 'under-50l' && p >= 5000000) return false;
      if (appState.budgetFilter === '50l-1.5cr' && (p < 5000000 || p > 15000000)) return false;
      if (appState.budgetFilter === '1.5cr-3cr' && (p < 15000000 || p > 30000000)) return false;
      if (appState.budgetFilter === 'above-3cr' && p <= 30000000) return false;
    }

    return true;
  });
}

function renderApp() {
  const filteredProps = getFilteredProperties();
  const appContainer = document.getElementById('app');

  const selectedProperty = appState.selectedPropertyId 
    ? PROPERTIES.find(p => p.id === appState.selectedPropertyId) 
    : null;

  appContainer.innerHTML = `
    ${renderNavbar(openPostModal, openSavedView, handleFilterChange)}
    
    <main>
      ${renderHero()}
      ${renderExploreSection(PROPERTIES, openPropertyDetail)}
      ${renderPropertyGrid(filteredProps, appState.activeFilter)}
      ${renderShowcaseBanner(PROPERTIES[5], openPropertyDetail)}
      ${renderLocationExplorer()}
      ${renderCategoryCarousel()}
      ${renderLuxuryTransition()}
      ${renderAgentShowcase()}
      ${renderPostPropertyCTA(openPostModal)}
    </main>

    ${renderFooter()}
    ${renderMobileBottomNav()}

    <!-- Dynamic Overlay Modals -->
    <div id="modal-slot">
      ${selectedProperty ? renderPropertyDetailModal(selectedProperty) : ''}
      ${appState.isPostModalOpen ? renderPostPropertyModal() : ''}
      ${appState.scheduleModalData ? renderScheduleVisitModal(appState.scheduleModalData) : ''}
    </div>
  `;

  // Attach event listeners
  initNavbarListeners(openPostModal, openSavedView);
  initHeroListeners(handleHeroSearch);
  initExploreSectionListeners(openPropertyDetail);
  initPropertyGridListeners(handleFilterChange, openPropertyDetail);
  initShowcaseListeners(openPropertyDetail);
  initLocationExplorerListeners(handleLocationSelect);
  initCategoryCarouselListeners(handleCategorySelect);
  initAgentListeners();
  initPostPropertyCTAListeners(openPostModal);
  initMobileBottomNavListeners(openPostModal, openSavedView);

  // Attach modal listeners if open
  if (selectedProperty) {
    initPropertyDetailModalListeners(selectedProperty, closePropertyDetail);
  }
  if (appState.isPostModalOpen) {
    initPostPropertyModalListeners(closePostModal);
  }
  if (appState.scheduleModalData) {
    initScheduleVisitModalListeners(closeScheduleModal);
  }
}

// Handler Actions
function handleFilterChange(filter) {
  appState.activeFilter = filter;
  appState.isSavedOnlyView = false;
  renderApp();
  document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
}

function handleHeroSearch(searchParams) {
  appState.purposeFilter = searchParams.purpose;
  appState.locationFilter = searchParams.location;
  appState.typeFilter = searchParams.type;
  appState.budgetFilter = searchParams.budget;
  appState.activeFilter = 'all';
  appState.isSavedOnlyView = false;
  renderApp();
}

function handleLocationSelect(locationName) {
  appState.locationFilter = locationName;
  appState.activeFilter = 'all';
  appState.isSavedOnlyView = false;
  renderApp();
}

function handleCategorySelect(catId) {
  appState.activeFilter = catId;
  appState.isSavedOnlyView = false;
  renderApp();
}

function openPropertyDetail(id) {
  appState.selectedPropertyId = id;
  renderApp();
}

function closePropertyDetail() {
  appState.selectedPropertyId = null;
  renderApp();
}

function openPostModal() {
  appState.isPostModalOpen = true;
  renderApp();
}

function closePostModal() {
  appState.isPostModalOpen = false;
  renderApp();
}

function openScheduleModal(data = {}) {
  appState.scheduleModalData = data;
  renderApp();
}

function closeScheduleModal() {
  appState.scheduleModalData = null;
  renderApp();
}

function openSavedView() {
  appState.isSavedOnlyView = true;
  appState.activeFilter = 'all';
  renderApp();
  document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
  showToast(`Showing ${getFavorites().length} saved properties`, 'ri-heart-fill');
}

// Global Event Dispatcher Listeners
window.addEventListener('openPostPropertyModal', () => openPostModal());
window.addEventListener('openScheduleModal', (e) => openScheduleModal(e.detail));
window.addEventListener('openEnquiryModal', (e) => {
  showToast(`Direct message sent to ${e.detail?.agentName || 'Agent'}!`, 'ri-send-plane-fill');
});
window.addEventListener('favoritesUpdated', (e) => {
  const countBadge = document.getElementById('saved-count-badge');
  if (countBadge) countBadge.textContent = e.detail.count;
});

// Initial Render
renderApp();
