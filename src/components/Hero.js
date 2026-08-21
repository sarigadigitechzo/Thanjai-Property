import { getSiteImage } from '../utils/siteImagesStore.js';
import { getCurrentUser } from '../utils/userAuthStore.js';

export function renderHero() {
  const heroBg = getSiteImage('hero_bg');
  return `
    <section class="hero-section" id="hero">
      <!-- Hero Background Image & Gradient -->
      <div class="hero-bg-container">
        <img 
          src="${heroBg}" 
          alt="Thanjai Property Luxury Villa" 
          class="hero-bg-image" 
          id="hero-parallax-img"
        />
        <div class="hero-gradient-overlay"></div>
      </div>

      <!-- Hero Text Content -->
      <div class="container hero-content">
        <div class="hero-eyebrow-pill">
          <i class="ri-shield-star-line" style="color: var(--color-orange)"></i>
          <span>THANJAI PROPERTY • SINCE 2009</span>
        </div>
        
        <h1 class="heading-display-light hero-title">
          Find a Property That<br>Fits Your Future.
        </h1>

        <p class="hero-subtitle">
          Buy, Sell, Rent & Explore Properties Across Tamil Nadu. Discover homes, villas, apartments, residential plots, agricultural land, commercial spaces, and industrial real-estate opportunities built around your goals.
        </p>
      </div>

      <!-- 2. Floating Luxury Property Search Panel -->
      <div class="container search-panel-wrapper">
        <div class="floating-search-card">
          
          <!-- Top Bar: Tiny Eyebrow + Segmented Control Tabs -->
          <div class="search-panel-topbar">
            <div class="search-eyebrow-text">
              <i class="ri-sparkles-fill" style="color: var(--color-orange)"></i>
              <span>FIND YOUR PERFECT PROPERTY</span>
            </div>

            <!-- Segmented Control Tabs (BUY / RENT / SELL) -->
            <div class="segmented-tabs" id="hero-search-tabs">
              <button class="segmented-tab-btn active" data-purpose="buy">
                <i class="ri-home-heart-line"></i> BUY
              </button>
              <button class="segmented-tab-btn" data-purpose="rent">
                <i class="ri-key-2-line"></i> RENT
              </button>
              <button class="segmented-tab-btn" data-purpose="sell">
                <i class="ri-price-tag-3-line"></i> SELL
              </button>
            </div>
          </div>

          <!-- Single Unified Horizontal Search Bar -->
          <form id="hero-search-form" class="search-bar-unified" onsubmit="return false;">
            <input type="hidden" id="search-location" value="all" />
            <input type="hidden" id="search-type" value="all" />
            <input type="hidden" id="search-budget" value="all" />

            <!-- Field 1: LOCATION -->
            <div class="search-field-pill custom-dropdown" id="dropdown-location">
              <div class="search-field-inner custom-dropdown-trigger">
                <div class="field-icon-wrap">
                  <i class="ri-map-pin-2-fill"></i>
                </div>
                <div class="field-info">
                  <span class="field-label">LOCATION</span>
                  <span class="field-val selected-text">All Tamil Nadu Locations</span>
                </div>
                <i class="ri-arrow-down-s-line chevron-icon"></i>
              </div>

              <div class="custom-dropdown-menu">
                <div class="dropdown-item active" data-value="all" data-label="All Tamil Nadu Locations">
                  <span>All Tamil Nadu Locations</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="Thanjavur" data-label="Thanjavur">
                  <span>Thanjavur</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="Trichy" data-label="Trichy">
                  <span>Trichy</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="Madurai" data-label="Madurai">
                  <span>Madurai</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="Chennai" data-label="Chennai">
                  <span>Chennai</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="Coimbatore" data-label="Coimbatore">
                  <span>Coimbatore</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="Kumbakonam" data-label="Kumbakonam">
                  <span>Kumbakonam</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
              </div>
            </div>

            <div class="search-field-divider"></div>

            <!-- Field 2: PROPERTY TYPE -->
            <div class="search-field-pill custom-dropdown" id="dropdown-type">
              <div class="search-field-inner custom-dropdown-trigger">
                <div class="field-icon-wrap">
                  <i class="ri-building-4-fill"></i>
                </div>
                <div class="field-info">
                  <span class="field-label">PROPERTY TYPE</span>
                  <span class="field-val selected-text">All Property Types</span>
                </div>
                <i class="ri-arrow-down-s-line chevron-icon"></i>
              </div>

              <div class="custom-dropdown-menu">
                <div class="dropdown-item active" data-value="all" data-label="All Property Types">
                  <span>All Property Types</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="villas" data-label="Luxury Villas">
                  <span>Luxury Villas</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="houses" data-label="Independent Houses">
                  <span>Independent Houses</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="apartments" data-label="Modern Apartments">
                  <span>Modern Apartments</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="plots" data-label="Residential Plots">
                  <span>Residential Plots</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="agricultural" data-label="Agricultural Farmland">
                  <span>Agricultural Farmland</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="commercial" data-label="Commercial Spaces">
                  <span>Commercial Spaces</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
              </div>
            </div>

            <div class="search-field-divider"></div>

            <!-- Field 3: BUDGET -->
            <div class="search-field-pill custom-dropdown" id="dropdown-budget">
              <div class="search-field-inner custom-dropdown-trigger">
                <div class="field-icon-wrap">
                  <i class="ri-bank-card-fill"></i>
                </div>
                <div class="field-info">
                  <span class="field-label">BUDGET</span>
                  <span class="field-val selected-text">Any Price</span>
                </div>
                <i class="ri-arrow-down-s-line chevron-icon"></i>
              </div>

              <div class="custom-dropdown-menu">
                <div class="dropdown-item active" data-value="all" data-label="Any Price">
                  <span>Any Price</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="under-50l" data-label="Under ₹ 50 Lakhs">
                  <span>Under ₹ 50 Lakhs</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="50l-1.5cr" data-label="₹ 50 Lakhs – ₹ 1.5 Cr">
                  <span>₹ 50 Lakhs – ₹ 1.5 Cr</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="1.5cr-3cr" data-label="₹ 1.5 Cr – ₹ 3.0 Cr">
                  <span>₹ 1.5 Cr – ₹ 3.0 Cr</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
                <div class="dropdown-item" data-value="above-3cr" data-label="Above ₹ 3.0 Cr">
                  <span>Above ₹ 3.0 Cr</span>
                  <i class="ri-check-line check-icon"></i>
                </div>
              </div>
            </div>

            <!-- Search Submit Button -->
            <button type="submit" class="btn btn-primary search-submit-btn-unified" id="hero-search-submit">
              <i class="ri-search-2-line" style="font-size: 1.25rem;"></i>
              <span>Search Properties</span>
            </button>
          </form>
        </div>
      </div>
    </section>
  `;
}

export function initHeroListeners(onSearchSubmit) {
  // Parallax zoom effect on scroll
  const heroImg = document.getElementById('hero-parallax-img');
  window.addEventListener('scroll', () => {
    if (heroImg && window.scrollY < 1000) {
      const scrollPos = window.scrollY;
      heroImg.style.transform = `scale(${1.05 + scrollPos * 0.0003}) translateY(${scrollPos * 0.15}px)`;
    }
  });

  // Search Tabs switching
  const tabs = document.querySelectorAll('#hero-search-tabs .segmented-tab-btn');
  let currentPurpose = 'buy';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPurpose = tab.dataset.purpose || 'buy';

      if (currentPurpose === 'sell') {
        const user = getCurrentUser();
        if (user) {
          window.location.href = '/user-dashboard.html';
        } else {
          window.location.href = '/login.html#register';
        }
      }
    });
  });

  // Custom Dropdowns Interaction
  const dropdowns = document.querySelectorAll('.custom-dropdown');
  dropdowns.forEach(dd => {
    const trigger = dd.querySelector('.custom-dropdown-trigger');
    const hiddenInputId = dd.id.replace('dropdown-', 'search-');
    const hiddenInput = document.getElementById(hiddenInputId);
    const selectedText = dd.querySelector('.selected-text');
    const items = dd.querySelectorAll('.dropdown-item');

    // Toggle menu
    trigger?.addEventListener('click', (e) => {
      e.stopPropagation();
      // Close other dropdowns
      dropdowns.forEach(other => {
        if (other !== dd) other.classList.remove('open');
      });
      dd.classList.toggle('open');
    });

    // Option item select
    items.forEach(item => {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        items.forEach(i => i.classList.remove('active'));
        item.classList.add('active');

        const val = item.dataset.value;
        const label = item.dataset.label;

        if (hiddenInput) hiddenInput.value = val;
        if (selectedText) selectedText.textContent = label;

        dd.classList.remove('open');
      });
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', () => {
    dropdowns.forEach(dd => dd.classList.remove('open'));
  });

  // Search Form Submit
  const searchForm = document.getElementById('hero-search-form');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.getElementById('search-location')?.value || 'all';
    const type = document.getElementById('search-type')?.value || 'all';
    const budget = document.getElementById('search-budget')?.value || 'all';
    
    onSearchSubmit({ purpose: currentPurpose, location, type, budget });

    document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
  });
}
