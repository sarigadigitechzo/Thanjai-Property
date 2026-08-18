import './style.css';
import { getProperties, getPublicProperties } from './utils/propertiesStore.js';

// Components
import { renderNavbar, initNavbarListeners } from './components/Navbar.js';
import { renderHero, initHeroListeners } from './components/Hero.js';
import { renderExploreSection, initExploreSectionListeners } from './components/ExploreSection.js';
import { renderHomePropertyShowcase, initHomePropertyShowcaseListeners } from './components/HomePropertyShowcase.js';
import { renderLocationExplorer, initLocationExplorerListeners } from './components/LocationExplorer.js';
import { renderCategoryCarousel, initCategoryCarouselListeners } from './components/CategoryCarousel.js';
import { renderLuxuryTransition, initLuxuryTransitionListeners } from './components/LuxuryTransition.js';
import { renderBlogSection, initBlogSectionListeners } from './components/BlogSection.js';
import { renderPostPropertyCTA, initPostPropertyCTAListeners } from './components/PostPropertyCTA.js';
import { renderHomeContactBanner, initHomeContactBannerListeners } from './components/HomeContactBanner.js';
import { renderFooter } from './components/Footer.js';
import { renderMobileBottomNav, initMobileBottomNavListeners } from './components/MobileBottomNav.js';
import { renderPropertyDetailModal, initPropertyDetailModalListeners } from './components/PropertyDetailModal.js';
import { renderPostPropertyModal, initPostPropertyModalListeners } from './components/PostPropertyModal.js';
import { renderScheduleVisitModal, initScheduleVisitModalListeners } from './components/ScheduleVisitModal.js';

// Views for Pages 2, 3, 4, 5
import { renderOurStoryView, initOurStoryListeners } from './views/OurStoryView.js';
import { renderDiscoverView, initDiscoverListeners } from './views/DiscoverView.js';
import { renderBlogView, initBlogListeners } from './views/BlogView.js';
import { renderContactView, initContactListeners } from './views/ContactView.js';
import { renderTermsView, initTermsListeners } from './views/TermsView.js';
import { renderPrivacyView, initPrivacyListeners } from './views/PrivacyView.js';

import { getFavorites } from './utils/favorites.js';
import { showToast } from './utils/toast.js';
import { getCurrentUser } from './utils/userAuthStore.js';

// Global Route & Application State
let currentRoute = parseCurrentRoute();

let discoverState = {
  keyword: '',
  type: 'all',
  location: 'all',
  purpose: 'all',
  budget: 'all',
  selectedPropertyId: null
};

let blogState = {
  category: 'all',
  keyword: '',
  selectedPostId: null
};

let appState = {
  selectedPropertyId: null,
  isPostModalOpen: false,
  scheduleModalData: null,
  isSavedOnlyView: false
};

// Route Parser
function parseCurrentRoute() {
  const path = window.location.pathname.toLowerCase().replace(/\/$/, '');
  const hash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

  if (path.includes('our-story') || hash === 'our-story') return 'our-story';
  if (path.includes('discover') || hash === 'discover') return 'discover';
  if (path.includes('blog') || path.includes('journal') || hash === 'blog' || hash === 'journal') return 'blog';
  if (path.includes('contact') || hash === 'contact') return 'contact';
  if (path.includes('terms') || hash === 'terms' || hash.startsWith('term-')) return 'terms';
  if (path.includes('privacy') || hash === 'privacy' || hash.startsWith('privacy-')) return 'privacy';

  return 'home';
}

function getRoutePath(route) {
  switch (route) {
    case 'our-story': return '/our-story';
    case 'discover': return '/discover';
    case 'blog': return '/blog';
    case 'contact': return '/contact';
    case 'terms': return '/terms';
    case 'privacy': return '/privacy';
    default: return '/';
  }
}

function updateSeoMetadata(route) {
  let title = "Thanjai Property — Where Tamil Nadu's Properties Meet Modern Luxury";
  let desc = "Discover Tamil Nadu's premier luxury villas, modern apartments, DTCP plots, and Kaveri farm estates. Thanjai Property - Since 2009.";

  switch (route) {
    case 'our-story':
      title = "Our Story — Thanjai Property | 15+ Years of Real Estate Trust";
      desc = "Learn about Thanjai Property's history since 2009, legal Patta title assurance, and district plots presence across Tamil Nadu.";
      break;
    case 'discover':
      title = "Discover Properties — Luxury Villas, Plots & Farmlands | Thanjai Property";
      desc = "Search and filter luxury villas, independent homes, DTCP layout plots, and Kaveri farm estates across Thanjavur, Trichy, Chennai, and Madurai.";
      break;
    case 'blog':
      title = "The Blog — Real Estate Guides & Insights | Thanjai Property";
      desc = "Expert real estate articles, DTCP/RERA approval checklists, Kaveri delta farmland guides, and architectural perspectives.";
      break;
    case 'contact':
      title = "Contact Us — Thanjai Property Advisory Desk";
      desc = "Connect with our senior property advisors at Thanjavur Raja Nagar office or submit your private property brief.";
      break;
    case 'privacy':
      title = "Privacy Policy — Thanjai Property";
      desc = "Privacy policy governing information collection, use of cookies, and limitations of liability on Thanjaiproperty.com";
      break;
  }

  document.title = title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', desc);
}

// Router Navigation Handler
function navigateToRoute(route, pushState = true) {
  currentRoute = route;
  if (route !== 'discover') {
    discoverState.selectedPropertyId = null;
  }
  if (pushState) {
    window.history.pushState({ route }, '', getRoutePath(route));
  }
  updateSeoMetadata(route);
  renderApp();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Primary Render Engine
function renderApp() {
  const appContainer = document.getElementById('app');
  const allProperties = getPublicProperties();
  const selectedModalProperty = appState.selectedPropertyId 
    ? allProperties.find(p => p.id === appState.selectedPropertyId) 
    : null;

  let mainContentHtml = '';

  switch (currentRoute) {
    case 'our-story':
      mainContentHtml = renderOurStoryView(() => navigateToRoute('discover'));
      break;

    case 'discover':
      mainContentHtml = renderDiscoverView(
        discoverState,
        (propId) => {
          discoverState.selectedPropertyId = propId;
          renderApp();
        },
        () => navigateToRoute('contact')
      );
      break;

    case 'blog':
      mainContentHtml = renderBlogView(
        blogState,
        (postId) => {
          blogState.selectedPostId = postId;
          renderApp();
        },
        () => navigateToRoute('contact')
      );
      break;

    case 'contact':
      mainContentHtml = renderContactView();
      break;

    case 'terms':
      mainContentHtml = renderTermsView();
      break;

    case 'privacy':
      mainContentHtml = renderPrivacyView();
      break;

    case 'home':
    default:
      mainContentHtml = `
        <main>
          ${renderHero()}
          ${renderHomePropertyShowcase(allProperties, openModalPropertyDetail, () => navigateToRoute('discover'))}
          ${renderExploreSection(openPostModal)}
          ${renderLocationExplorer()}
          ${renderCategoryCarousel()}
          ${renderLuxuryTransition()}
          ${renderBlogSection(() => navigateToRoute('blog'), (postId) => openBlogArticle(postId))}
          ${renderHomeContactBanner(() => navigateToRoute('contact'))}
        </main>
      `;
      break;
  }

  appContainer.innerHTML = `
    ${renderNavbar(currentRoute, navigateToRoute)}
    
    ${mainContentHtml}

    ${renderFooter()}
    ${renderMobileBottomNav()}

    <!-- Dynamic Overlay Modals -->
    <div id="modal-slot">
      ${selectedModalProperty ? renderPropertyDetailModal(selectedModalProperty) : ''}
      ${appState.isPostModalOpen ? renderPostPropertyModal() : ''}
      ${appState.scheduleModalData ? renderScheduleVisitModal(appState.scheduleModalData) : ''}
    </div>
  `;

  // Attach navbar & footer global link listeners
  initNavbarListeners(navigateToRoute, openSavedView);
  document.getElementById('nav-post-property-btn')?.addEventListener('click', openPostModal);

  // Attach Page-Specific Listeners
  switch (currentRoute) {
    case 'our-story':
      initOurStoryListeners(() => navigateToRoute('discover'));
      break;

    case 'discover':
      initDiscoverListeners(
        discoverState,
        (newState) => {
          discoverState = newState;
          renderApp();
        },
        (propId) => {
          discoverState.selectedPropertyId = propId;
          renderApp();
        },
        () => navigateToRoute('contact')
      );
      break;

    case 'blog':
      initBlogListeners(
        blogState,
        (newState) => {
          blogState = newState;
          renderApp();
        },
        (postId) => {
          blogState.selectedPostId = postId;
          renderApp();
        },
        () => navigateToRoute('contact')
      );
      break;

    case 'contact':
      initContactListeners();
      break;

    case 'terms':
      initTermsListeners();
      break;

    case 'privacy':
      initPrivacyListeners();
      break;

    case 'home':
    default:
      initHeroListeners(handleHeroSearch);
      initHomePropertyShowcaseListeners(openModalPropertyDetail, () => {
        discoverState.selectedPropertyId = null;
        navigateToRoute('discover');
      });
      initExploreSectionListeners(openPostModal);
      initLocationExplorerListeners(handleLocationSelect);
      initCategoryCarouselListeners(handleCategorySelect);
      initLuxuryTransitionListeners();
      initBlogSectionListeners(() => navigateToRoute('blog'), (postId) => openBlogArticle(postId));
      initHomeContactBannerListeners(() => navigateToRoute('contact'));
      break;
  }

  initMobileBottomNavListeners(openPostModal, openSavedView);

  // Modal listeners if active
  if (selectedModalProperty) {
    initPropertyDetailModalListeners(selectedModalProperty, closeModalPropertyDetail);
  }
  if (appState.isPostModalOpen) {
    initPostPropertyModalListeners(closePostModal);
  }
  if (appState.scheduleModalData) {
    initScheduleVisitModalListeners(closeScheduleModal);
  }
}

// Handlers
function openModalPropertyDetail(id) {
  discoverState.selectedPropertyId = id;
  navigateToRoute('discover');
}

function closeModalPropertyDetail() {
  appState.selectedPropertyId = null;
  renderApp();
}

function openBlogArticle(postId) {
  blogState.selectedPostId = postId;
  navigateToRoute('blog');
}

function openPostModal() {
  const currentUser = getCurrentUser();
  if (currentUser) {
    window.location.href = '/user-dashboard.html';
  } else {
    window.location.href = '/login.html#register';
  }
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
  discoverState.keyword = '';
  discoverState.type = 'all';
  discoverState.location = 'all';
  discoverState.purpose = 'all';
  discoverState.budget = 'all';
  navigateToRoute('discover');
  showToast(`Showing saved properties`, 'ri-heart-fill');
}

function handleHeroSearch(searchParams) {
  discoverState.purpose = searchParams.purpose;
  discoverState.location = searchParams.location;
  discoverState.type = searchParams.type;
  discoverState.budget = searchParams.budget;
  discoverState.selectedPropertyId = null;
  navigateToRoute('discover');
}

function handleLocationSelect(locationName) {
  discoverState.location = locationName;
  discoverState.selectedPropertyId = null;
  navigateToRoute('discover');
}

function handleCategorySelect(catId) {
  discoverState.type = catId;
  discoverState.selectedPropertyId = null;
  navigateToRoute('discover');
}

// Browser Navigation Events
window.addEventListener('popstate', () => {
  currentRoute = parseCurrentRoute();
  updateSeoMetadata(currentRoute);
  renderApp();
});

window.addEventListener('hashchange', () => {
  const newRoute = parseCurrentRoute();
  // Prevent full app re-render if it's just an internal terms section anchor
  if (newRoute === 'terms' && currentRoute === 'terms' && window.location.hash.startsWith('#term-')) {
    return;
  }
  currentRoute = newRoute;
  updateSeoMetadata(currentRoute);
  renderApp();
});

// Custom Events
window.addEventListener('openPostPropertyModal', () => openPostModal());
window.addEventListener('openScheduleModal', (e) => openScheduleModal(e.detail));
window.addEventListener('openEnquiryModal', (e) => {
  showToast(`Direct message sent to ${e.detail?.agentName || 'Agent'}!`, 'ri-send-plane-fill');
});
window.addEventListener('favoritesUpdated', (e) => {
  const countBadge = document.getElementById('saved-count-badge');
  if (countBadge) countBadge.textContent = e.detail.count;
});
window.addEventListener('propertiesUpdated', () => {
  renderApp();
});
window.addEventListener('blogPostsUpdated', () => {
  renderApp();
});
window.addEventListener('storage', (e) => {
  if (e.key === 'thanjai_properties' || e.key === 'thanjai_blog_posts') {
    renderApp();
  }
});

// Initial Load & Render
updateSeoMetadata(currentRoute);
renderApp();

