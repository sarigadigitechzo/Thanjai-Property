import { getFavorites } from '../utils/favorites.js';
import { getSiteImage } from '../utils/siteImagesStore.js';

export function renderNavbar(currentRoute = 'home', onNavigate) {
  const favoritesCount = getFavorites().length;
  const brandLogo = getSiteImage('brand_logo');

  return `
    <header class="header-wrapper" id="main-header">
      <div class="container">
        <nav class="nav-container">
          <!-- Brand Logo -->
          <a href="/" class="brand-logo-link nav-route-link" data-route="home" id="nav-brand-logo">
            <img src="${brandLogo}" alt="Thanjai Property Real Estate Since 2009" class="brand-logo-img" style="height: 54px; width: auto; display: block;" />
          </a>

          <!-- Desktop Navigation Links (5 Core Pages) -->
          <ul class="nav-links">
            <li>
              <a href="/" class="nav-link nav-route-link ${currentRoute === 'home' ? 'active' : ''}" data-route="home">Home</a>
            </li>
            <li>
              <a href="/our-story" class="nav-link nav-route-link ${currentRoute === 'our-story' ? 'active' : ''}" data-route="our-story">Our Story</a>
            </li>
            <li>
              <a href="/discover" class="nav-link nav-route-link ${currentRoute === 'discover' ? 'active' : ''}" data-route="discover">Discover Properties</a>
            </li>
            <li>
              <a href="/blog" class="nav-link nav-route-link ${currentRoute === 'blog' ? 'active' : ''}" data-route="blog">Blog</a>
            </li>
            <li>
              <a href="/contact" class="nav-link nav-route-link ${currentRoute === 'contact' ? 'active' : ''}" data-route="contact">Contact</a>
            </li>
          </ul>

          <!-- Action Buttons -->
          <div class="nav-actions">
            <button class="saved-counter-btn" id="saved-properties-btn" title="View Saved Properties">
              <i class="ri-heart-3-line"></i>
              <span class="saved-badge-count" id="saved-count-badge">${favoritesCount}</span>
            </button>

            <button class="mobile-menu-toggle" id="mobile-menu-btn" aria-label="Toggle Menu">
              <i class="ri-menu-4-line"></i>
            </button>
          </div>
        </nav>
      </div>

      <!-- Mobile Navigation Drawer -->
      <div class="mobile-menu-overlay" id="mobile-menu-overlay" style="
        display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); z-index: 9998;
      "></div>
      
      <div class="mobile-menu-drawer" id="mobile-menu-drawer" style="
        position: fixed; top: 0; right: -300px; width: 280px; height: 100vh; background: #2A1808; color: #ffffff;
        z-index: 9999; padding: 30px 24px; display: flex; flex-direction: column; transition: right 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        box-shadow: -10px 0 30px rgba(0,0,0,0.3);
      ">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 36px;">
          <img src="${brandLogo}" style="height: 40px; background: #fff; padding: 4px 8px; border-radius: 6px;" />
          <button id="close-mobile-menu-btn" style="background: none; border: none; color: #fff; font-size: 1.5rem; cursor: pointer;">
            <i class="ri-close-line"></i>
          </button>
        </div>

        <ul style="list-style: none; display: flex; flex-direction: column; gap: 20px; font-size: 1.1rem; font-weight: 600;">
          <li><a href="/" class="mobile-nav-link nav-route-link ${currentRoute === 'home' ? 'active' : ''}" data-route="home" style="color: #fff; text-decoration: none;">Home</a></li>
          <li><a href="/our-story" class="mobile-nav-link nav-route-link ${currentRoute === 'our-story' ? 'active' : ''}" data-route="our-story" style="color: #fff; text-decoration: none;">Our Story</a></li>
          <li><a href="/discover" class="mobile-nav-link nav-route-link ${currentRoute === 'discover' ? 'active' : ''}" data-route="discover" style="color: #fff; text-decoration: none;">Discover Properties</a></li>
          <li><a href="/blog" class="mobile-nav-link nav-route-link ${currentRoute === 'blog' ? 'active' : ''}" data-route="blog" style="color: #fff; text-decoration: none;">Blog</a></li>
          <li><a href="/contact" class="mobile-nav-link nav-route-link ${currentRoute === 'contact' ? 'active' : ''}" data-route="contact" style="color: #fff; text-decoration: none;">Contact</a></li>
        </ul>

        <div style="margin-top: auto; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1); font-size: 0.85rem; color: rgba(255,255,255,0.7);">
          <div style="margin-bottom: 6px;"><i class="ri-phone-line" style="color: var(--color-orange, #eb5e28);"></i> +91 94431 25009</div>
          <div>Thanjavur, Tamil Nadu</div>
        </div>
      </div>
    </header>
  `;
}

export function initNavbarListeners(onNavigate, onSavedClick) {
  const header = document.getElementById('main-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  });

  document.getElementById('saved-properties-btn')?.addEventListener('click', onSavedClick);
  
  // Route Navigation Clicks
  document.querySelectorAll('.nav-route-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const route = link.dataset.route;
      if (route && onNavigate) {
        closeMobileMenu();
        onNavigate(route);
      }
    });
  });

  // Mobile Drawer Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const closeMobileMenuBtn = document.getElementById('close-mobile-menu-btn');
  const overlay = document.getElementById('mobile-menu-overlay');
  const drawer = document.getElementById('mobile-menu-drawer');

  function openMobileMenu() {
    if (overlay) overlay.style.display = 'block';
    if (drawer) drawer.style.right = '0px';
  }

  function closeMobileMenu() {
    if (overlay) overlay.style.display = 'none';
    if (drawer) drawer.style.right = '-300px';
  }

  mobileMenuBtn?.addEventListener('click', openMobileMenu);
  closeMobileMenuBtn?.addEventListener('click', closeMobileMenu);
  overlay?.addEventListener('click', closeMobileMenu);
}
