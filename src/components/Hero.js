export function renderHero() {
  return `
    <section class="hero-section" id="hero">
      <!-- Hero Background Image & Gradient -->
      <div class="hero-bg-container">
        <img 
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90" 
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
          Discover a Place<br>Worth Calling Home.
        </h1>

        <p class="hero-subtitle">
          Tamil Nadu's premier luxury property discovery platform. Curated architectural villas, high-rise residences, DTCP plots, and Kaveri farm estates.
        </p>
      </div>

      <!-- 2. Floating Search Panel -->
      <div class="container search-panel-wrapper">
        <div class="floating-search-card">
          <!-- Search Tabs -->
          <div class="search-tabs" id="hero-search-tabs">
            <button class="search-tab-btn active" data-purpose="buy">
              <i class="ri-home-heart-line"></i> BUY
            </button>
            <button class="search-tab-btn" data-purpose="rent">
              <i class="ri-key-2-line"></i> RENT
            </button>
            <button class="search-tab-btn" data-purpose="sell">
              <i class="ri-price-tag-3-line"></i> SELL
            </button>
          </div>

          <!-- Search Form Inputs -->
          <form id="hero-search-form" class="search-form-grid" onsubmit="return false;">
            <!-- Location Dropdown -->
            <div class="search-field-group">
              <label class="search-field-label">
                <i class="ri-map-pin-2-line"></i> Where are you looking?
              </label>
              <select class="search-select" id="search-location">
                <option value="all">All Tamil Nadu Locations</option>
                <option value="Thanjavur">Thanjavur</option>
                <option value="Trichy">Trichy</option>
                <option value="Madurai">Madurai</option>
                <option value="Chennai">Chennai</option>
                <option value="Coimbatore">Coimbatore</option>
                <option value="Kumbakonam">Kumbakonam</option>
              </select>
            </div>

            <!-- Property Type Dropdown -->
            <div class="search-field-group">
              <label class="search-field-label">
                <i class="ri-building-line"></i> Property Type
              </label>
              <select class="search-select" id="search-type">
                <option value="all">All Property Types</option>
                <option value="villas">Luxury Villas</option>
                <option value="houses">Independent Houses</option>
                <option value="apartments">Modern Apartments</option>
                <option value="plots">Residential Plots</option>
                <option value="agricultural">Agricultural Land</option>
                <option value="commercial">Commercial Spaces</option>
              </select>
            </div>

            <!-- Budget Dropdown -->
            <div class="search-field-group">
              <label class="search-field-label">
                <i class="ri-bank-card-line"></i> Budget Range
              </label>
              <select class="search-select" id="search-budget">
                <option value="all">Any Price</option>
                <option value="under-50l">Under ₹ 50 Lakhs</option>
                <option value="50l-1.5cr">₹ 50 Lakhs – ₹ 1.5 Cr</option>
                <option value="1.5cr-3cr">₹ 1.5 Cr – ₹ 3.0 Cr</option>
                <option value="above-3cr">Above ₹ 3.0 Cr</option>
              </select>
            </div>

            <!-- Search Button -->
            <button type="submit" class="btn btn-primary search-submit-btn" id="hero-search-submit">
              <i class="ri-search-2-line" style="font-size: 1.2rem;"></i>
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
  const tabs = document.querySelectorAll('#hero-search-tabs .search-tab-btn');
  let currentPurpose = 'buy';

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentPurpose = tab.dataset.purpose || 'buy';

      if (currentPurpose === 'sell') {
        // Trigger post property modal directly if user selects SELL tab
        window.dispatchEvent(new CustomEvent('openPostPropertyModal'));
      }
    });
  });

  // Search Submit
  const searchForm = document.getElementById('hero-search-form');
  searchForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = document.getElementById('search-location')?.value || 'all';
    const type = document.getElementById('search-type')?.value || 'all';
    const budget = document.getElementById('search-budget')?.value || 'all';
    
    onSearchSubmit({ purpose: currentPurpose, location, type, budget });

    // Scroll smoothly to discovery section
    document.getElementById('discovery')?.scrollIntoView({ behavior: 'smooth' });
  });
}
