import { getFavorites } from '../utils/favorites.js';

export function renderMobileBottomNav() {
  const savedCount = getFavorites().length;

  return `
    <nav class="mobile-bottom-nav">
      <ul class="mobile-bottom-nav-items">
        <li>
          <a href="#hero" class="mobile-nav-btn active" id="mob-nav-home">
            <i class="ri-home-5-line"></i>
            <span>Home</span>
          </a>
        </li>
        <li>
          <a href="#discovery" class="mobile-nav-btn" id="mob-nav-search">
            <i class="ri-search-line"></i>
            <span>Search</span>
          </a>
        </li>
        <li>
          <button class="mobile-nav-btn" id="mob-nav-saved">
            <i class="ri-heart-3-line"></i>
            <span>Saved (${savedCount})</span>
          </button>
        </li>
        <li>
          <button class="mobile-nav-btn" id="mob-nav-post" style="color: var(--color-orange);">
            <i class="ri-add-circle-fill"></i>
            <span>Post</span>
          </button>
        </li>
        <li>
          <a href="#agents" class="mobile-nav-btn" id="mob-nav-contact">
            <i class="ri-phone-line"></i>
            <span>Contact</span>
          </a>
        </li>
      </ul>
    </nav>
  `;
}

export function initMobileBottomNavListeners(onPostClick, onSavedClick) {
  document.getElementById('mob-nav-post')?.addEventListener('click', onPostClick);
  document.getElementById('mob-nav-saved')?.addEventListener('click', onSavedClick);
}
