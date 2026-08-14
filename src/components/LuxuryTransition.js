export function renderLuxuryTransition() {
  return `
    <!-- Dark Luxury Statement & Metrics -->
    <section class="dark-luxury-section">
      <div class="container">
        <div class="dark-luxury-inner">
          <span class="eyebrow eyebrow-dark">THANJAI PROPERTY PHILOSOPHY</span>
          
          <h2 class="heading-display-light" style="margin-top: 16px;">
            "More Than Property.<br>It's Where Life Happens."
          </h2>

          <div class="orange-divider-line"></div>

          <p style="color: rgba(255, 255, 255, 0.8); font-size: 1.125rem; max-width: 720px; margin: 0 auto; line-height: 1.7;">
            Since 2009, Thanjai Property has connected families, investors, and businesses with Tamil Nadu's finest residential and land opportunities through transparent, uncompromised real estate guidance.
          </p>

          <!-- Key Metrics Counter Grid -->
          <div class="stats-grid" id="luxury-stats-grid">
            <div class="stat-box">
              <div class="stat-number" data-target="15" data-suffix="+">15+</div>
              <div class="stat-label">Years Legacy (Since 2009)</div>
            </div>
            <div class="stat-box">
              <div class="stat-number" data-target="2500" data-suffix="+" data-format="comma">2,500+</div>
              <div class="stat-label">Properties Delivered</div>
            </div>
            <div class="stat-box">
              <div class="stat-number" data-target="100" data-suffix="%">100%</div>
              <div class="stat-label">DTCP & Clear Patta</div>
            </div>
            <div class="stat-box">
              <div class="stat-number" data-target="10000" data-suffix="+" data-format="k">10k+</div>
              <div class="stat-label">Satisfied Families</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 10. Trust Section (Editorial Numbered Pillars 01, 02, 03) -->
    <section class="trust-section" id="trust-section">
      <div class="container">

        <!-- Heading Block -->
        <div class="trust-heading-block" id="trust-heading-block">
          <div class="trust-eyebrow-row">
            <span class="trust-eyebrow-line"></span>
            <span class="eyebrow">OUR COMMITMENT</span>
            <span class="trust-eyebrow-line"></span>
          </div>
          <h2 class="heading-section trust-main-heading">
            The Pillars of Thanjai Trust
          </h2>
        </div>

        <!-- Watermark background word -->
        <div class="trust-watermark-bg" aria-hidden="true">TRUST</div>

        <!-- Cards Grid -->
        <div class="trust-pillars-grid" id="trust-pillars-grid">

          <!-- Card 01 -->
          <div class="trust-pillar-card trust-card-reveal" data-delay="0">
            <div class="pillar-bg-number" aria-hidden="true">01</div>
            <div class="pillar-icon-wrap">
              <i class="ri-map-pin-2-line pillar-icon"></i>
            </div>
            <div class="pillar-content">
              <h3 class="pillar-title">LOCAL EXPERTISE</h3>
              <p class="pillar-desc">
                Deep-rooted knowledge of Thanjavur, Kaveri Delta, and Tamil Nadu's high-growth residential corridors gained over 15+ years of active field experience.
              </p>
            </div>
            <div class="pillar-accent-line"></div>
          </div>

          <!-- Card 02 -->
          <div class="trust-pillar-card trust-card-reveal" data-delay="120">
            <div class="pillar-bg-number" aria-hidden="true">02</div>
            <div class="pillar-icon-wrap">
              <i class="ri-search-eye-line pillar-icon"></i>
            </div>
            <div class="pillar-content">
              <h3 class="pillar-title">PROPERTY DISCOVERY</h3>
              <p class="pillar-desc">
                Curated selection process verifying legal Patta titles, DTCP/RERA approvals, and environmental zoning before any property enters our portfolio.
              </p>
            </div>
            <div class="pillar-accent-line"></div>
          </div>

          <!-- Card 03 -->
          <div class="trust-pillar-card trust-card-reveal" data-delay="240">
            <div class="pillar-bg-number" aria-hidden="true">03</div>
            <div class="pillar-icon-wrap">
              <i class="ri-shake-hands-line pillar-icon"></i>
            </div>
            <div class="pillar-content">
              <h3 class="pillar-title">TRUSTED CONNECTIONS</h3>
              <p class="pillar-desc">
                Direct negotiation transparent access connecting genuine buyers with vetted property owners and reputable builders without hidden markups.
              </p>
            </div>
            <div class="pillar-accent-line"></div>
          </div>

        </div>
      </div>
    </section>
  `;
}

export function initLuxuryTransitionListeners() {
  const statsGrid = document.getElementById('luxury-stats-grid');
  if (!statsGrid) return;

  const statNumbers = statsGrid.querySelectorAll('.stat-number[data-target]');
  let hasAnimated = false;

  function formatNumber(value, format) {
    if (format === 'k') {
      return value >= 1000 ? Math.floor(value / 1000) + 'k' : value;
    }
    if (format === 'comma') {
      return value.toLocaleString('en-IN');
    }
    return value;
  }

  function animateStat(el) {
    const target = parseInt(el.dataset.target, 10);
    const suffix = el.dataset.suffix || '';
    const format = el.dataset.format || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);
      el.textContent = formatNumber(current, format) + suffix;
      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        el.textContent = formatNumber(target, format) + suffix;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasAnimated) {
        hasAnimated = true;
        statNumbers.forEach((el, i) => {
          setTimeout(() => animateStat(el), i * 150);
        });
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsGrid);

  // ── Trust Pillars Scroll-Reveal ──────────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const trustHeading = document.getElementById('trust-heading-block');
  const trustCards = document.querySelectorAll('.trust-card-reveal');

  if (prefersReduced) {
    // Simple instant reveal for reduced motion
    if (trustHeading) trustHeading.classList.add('trust-heading-visible');
    trustCards.forEach(c => c.classList.add('trust-card-visible'));
    return;
  }

  // Heading reveal
  if (trustHeading) {
    const headingObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          trustHeading.classList.add('trust-heading-visible');
          headingObserver.disconnect();
        }
      });
    }, { threshold: 0.2 });
    headingObserver.observe(trustHeading);
  }

  // Card stagger reveal
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        trustCards.forEach(card => {
          const delay = parseInt(card.dataset.delay || '0', 10);
          setTimeout(() => card.classList.add('trust-card-visible'), delay);
        });
        cardObserver.disconnect();
      }
    });
  }, { threshold: 0.15 });

  const trustGrid = document.getElementById('trust-pillars-grid');
  if (trustGrid) cardObserver.observe(trustGrid);
}
