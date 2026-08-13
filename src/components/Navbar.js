import { getFavorites } from '../utils/favorites.js';

export function renderNavbar(onPostPropertyClick, onSavedPropertiesClick, onFilterChange) {
  const favoritesCount = getFavorites().length;

  return `
    <header class="header-wrapper" id="main-header">
      <div class="container">
        <nav class="nav-container">
          <!-- Brand Logo -->
          <a href="#" class="brand-logo-link" id="nav-brand-logo">
            <img src="/logo.svg" alt="Thanjai Property Real Estate Since 2009" class="brand-logo-img" style="height: 48px; width: auto;" />
          </a>

          <!-- Navigation Links -->
          <ul class="nav-links">
            <li><a href="#hero" class="nav-link active">Home</a></li>
            <li><a href="#explore" class="nav-link">Featured</a></li>
            <li><a href="#discovery" class="nav-link">Discover</a></li>
            <li><a href="#locations" class="nav-link">Tamil Nadu</a></li>
            <li><a href="#categories" class="nav-link">Categories</a></li>
            <li><a href="#agents" class="nav-link">Advisors</a></li>
          </ul>

          <!-- Action Buttons -->
          <div class="nav-actions">
            <button class="saved-counter-btn" id="saved-properties-btn" title="View Saved Properties">
              <i class="ri-heart-3-line"></i>
              <span class="saved-badge-count" id="saved-count-badge">${favoritesCount}</span>
            </button>

            <button class="btn btn-primary" id="nav-post-property-btn">
              <i class="ri-add-circle-line"></i>
              <span>Post Property</span>
            </button>

            <button class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Toggle Menu">
              <i class="ri-menu-4-line"></i>
            </button>
          </div>
        </nav>
      </div>
    </header>
  `;
}

export function initNavbarListeners(onPostPropertyClick, onSavedClick) {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  document.getElementById('nav-post-property-btn')?.addEventListener('click', onPostPropertyClick);
  document.getElementById('saved-properties-btn')?.addEventListener('click', onSavedClick);
  
  // Smooth scroll links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}
