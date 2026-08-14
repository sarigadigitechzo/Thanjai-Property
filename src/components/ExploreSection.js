export function renderExploreSection(properties, onPropertySelect) {
  // Select top 4 distinct featured properties for the left-side auto-slider
  const featuredSlides = properties.slice(0, 4);
  const magazineItems = properties.filter(p => !featuredSlides.map(f => f.id).includes(p.id)).slice(0, 3);

  return `
    <section class="editorial-section" id="explore">
      <div class="container" style="position: relative; z-index: 2;">
        
        <!-- 1. Redesigned Perfectly Balanced Editorial Intro Header -->
        <div class="editorial-intro-container">
          <!-- Top Eyebrow Bar -->
          <div class="editorial-top-eyebrow-bar">
            <div class="editorial-eyebrow-wrap">
              <span class="editorial-vertical-line"></span>
              <span class="eyebrow" style="color: var(--color-orange); font-weight: 800; letter-spacing: 0.12em;">CURATED PROPERTY DISCOVERY</span>
            </div>
          </div>

          <!-- Main 2-Column Row (Title Left + Description Right) -->
          <div class="editorial-main-two-col">
            <div class="editorial-title-col">
              <h2 class="heading-display-light editorial-main-title">
                Find a Property<br>That Fits Your Life.
              </h2>
            </div>

            <div class="editorial-desc-col">
              <p class="editorial-desc-text">
                Explore handpicked architectural residences, Kaveri farm estates, and prime investment land curated exclusively by Tamil Nadu’s most trusted real estate advisors.
              </p>
            </div>
          </div>

          <!-- Integrated Horizontal Stats & Scroll Bar -->
          <div class="editorial-integrated-stats-bar">
            <div class="editorial-inline-stats" id="editorial-inline-stats">
              <div class="inline-stat-item">
                <div class="stat-num-wrap">
                  <span class="stat-num" id="counter-props">0</span><span class="stat-plus">+</span>
                </div>
                <span class="stat-lbl">Curated Properties</span>
              </div>

              <div class="inline-stat-sep"></div>

              <div class="inline-stat-item">
                <div class="stat-num-wrap">
                  <span class="stat-num" id="counter-locs">0</span><span class="stat-plus">+</span>
                </div>
                <span class="stat-lbl">Tamil Nadu Locations</span>
              </div>

              <div class="inline-stat-sep"></div>

              <div class="inline-stat-item">
                <div class="stat-num-wrap">
                  <span class="stat-num">Since 2009</span>
                </div>
                <span class="stat-lbl">Trusted Excellence</span>
              </div>
            </div>

            <a href="#featured-hero-slider" class="editorial-scroll-down-btn" id="scroll-to-collection-btn">
              <span>EXPLORE COLLECTION</span>
              <i class="ri-arrow-down-line scroll-arrow-icon"></i>
            </a>
          </div>
        </div>

        <!-- 2. Asymmetric Showcase: Left Premium Auto-Slider + Right Static Listings -->
        <div class="editorial-asymmetric-showcase">
          
          <!-- LEFT 65%: AUTOMATIC FEATURED LUXURY PROPERTY SLIDER -->
          <div class="editorial-hero-slider-wrap" id="featured-hero-slider">
            <div class="hero-slides-container">
              ${featuredSlides.map((slide, index) => `
                <div class="hero-slide ${index === 0 ? 'active' : ''}" data-index="${index}" data-id="${slide.id}">
                  <img src="${slide.images[0]}" alt="${slide.title}" class="hero-slide-img" />
                  <div class="editorial-hero-gradient"></div>

                  <div class="editorial-hero-badge-top">
                    <span class="badge badge-orange">
                      <i class="ri-sparkles-fill"></i> ${slide.tag || slide.categoryLabel.toUpperCase()}
                    </span>
                  </div>

                  <!-- Floating White/Glass Information Panel overlapping bottom-right -->
                  <div class="editorial-floating-info-panel open-details-btn" data-id="${slide.id}">
                    <div class="floating-price-tag">${slide.priceFormatted}</div>
                    <h3 class="floating-title">${slide.title}</h3>
                    
                    <div class="floating-location">
                      <i class="ri-map-pin-2-line" style="color: var(--color-orange);"></i>
                      <span>${slide.location}, ${slide.district}</span>
                    </div>

                    <div class="floating-specs-bar">
                      <span><i class="ri-ruler-2-line"></i> ${slide.size}</span>
                      ${slide.bedrooms ? `<span><i class="ri-hotel-bed-line"></i> ${slide.bedrooms} BHK</span>` : `<span><i class="ri-shield-check-line"></i> ${slide.approval}</span>`}
                    </div>

                    <button class="editorial-cta-link open-details-btn" data-id="${slide.id}">
                      <span>Explore Property</span>
                      <i class="ri-arrow-right-line cta-arrow"></i>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- RIGHT 35%: STATIC PROMINENT LISTINGS -->
          <div class="editorial-magazine-list">
            <h4 class="magazine-list-heading">PROMINENT LISTINGS</h4>

            ${magazineItems.map(item => `
              <div class="magazine-listing-item open-details-btn" data-id="${item.id}">
                <div class="magazine-item-img-wrap">
                  <img src="${item.images[0]}" alt="${item.title}" class="magazine-item-img" />
                  <span class="badge badge-dark magazine-badge">${item.categoryLabel}</span>
                </div>

                <div class="magazine-item-info">
                  <div class="magazine-price">${item.priceFormatted}</div>
                  <h5 class="magazine-title">${item.title}</h5>
                  <div class="magazine-location">
                    <i class="ri-map-pin-line" style="color: var(--color-orange);"></i> ${item.location}, TN
                  </div>

                  <span class="magazine-explore-btn">
                    <span>Explore</span>
                    <i class="ri-arrow-right-line"></i>
                  </span>
                </div>
              </div>
            `).join('')}
          </div>

        </div>

      </div>
    </section>
  `;
}

export function initExploreSectionListeners(onPropertySelect) {
  // Left-side Pure Automatic Property Slider Logic
  const sliderContainer = document.getElementById('featured-hero-slider');
  const slides = document.querySelectorAll('.hero-slide');
  
  if (slides.length > 0 && sliderContainer) {
    let currentIndex = 0;
    let autoSlideTimer = null;
    let isPaused = false;
    const slideDuration = 4500; // 4.5 seconds

    function goToSlide(index) {
      slides.forEach((slide, idx) => {
        if (idx === index) {
          slide.classList.add('active');
        } else {
          slide.classList.remove('active');
        }
      });
      currentIndex = index;
    }

    function startAutoSlide() {
      if (autoSlideTimer) clearInterval(autoSlideTimer);
      autoSlideTimer = setInterval(() => {
        if (!isPaused) {
          const nextIdx = (currentIndex + 1) % slides.length;
          goToSlide(nextIdx);
        }
      }, slideDuration);
    }

    // Start auto slideshow
    startAutoSlide();

    // Pause on Hover
    sliderContainer.addEventListener('mouseenter', () => { isPaused = true; });
    sliderContainer.addEventListener('mouseleave', () => { isPaused = false; });

    // Touch Swipe Support on Mobile/Tablet
    let touchStartX = 0;
    let touchEndX = 0;

    sliderContainer.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderContainer.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      if (touchStartX - touchEndX > 50) {
        const nextIdx = (currentIndex + 1) % slides.length;
        goToSlide(nextIdx);
        startAutoSlide();
      } else if (touchEndX - touchStartX > 50) {
        const prevIdx = (currentIndex - 1 + slides.length) % slides.length;
        goToSlide(prevIdx);
        startAutoSlide();
      }
    }, { passive: true });
  }

  // Count-Up Animation for Numeric Stats (120+ and 18+)
  function animateValue(id, target) {
    const obj = document.getElementById(id);
    if (!obj) return;
    let current = 0;
    const step = Math.ceil(target / 40);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        obj.textContent = target;
        clearInterval(timer);
      } else {
        obj.textContent = current;
      }
    }, 25);
  }

  // Intersection Observer for Staggered Reveal Animations & Number Counting
  let hasAnimatedCounters = false;
  const observerOptions = { threshold: 0.15 };
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        
        if (!hasAnimatedCounters && (entry.target.classList.contains('editorial-intro-container') || entry.target.classList.contains('editorial-intro-grid'))) {
          hasAnimatedCounters = true;
          animateValue('counter-props', 120);
          animateValue('counter-locs', 18);
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  const introContainer = document.querySelector('.editorial-intro-container');
  const showcase = document.querySelector('.editorial-asymmetric-showcase');
  if (introContainer) observer.observe(introContainer);
  if (showcase) observer.observe(showcase);

  // Smooth scroll down to featured collection
  document.getElementById('scroll-to-collection-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('featured-hero-slider')?.scrollIntoView({ behavior: 'smooth' });
  });

  // Property details modal triggers
  document.querySelectorAll('.open-details-btn').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = el.dataset.id;
      if (id) onPropertySelect(id);
    });
  });
}
