import { renderTestimonialsSection } from './TestimonialsSection.js';

export function renderLuxuryTransition() {
  return `
    <!-- Dark Luxury Statement & Metrics -->
    <section class="dark-luxury-section">
      <div class="container">
        <div class="dark-luxury-inner">
          <span class="eyebrow eyebrow-center eyebrow-dark">WHY THANJAI PROPERTY?</span>
          
          <h2 class="heading-display-light" style="margin-top: 16px;">
            Local Understanding.<br>Wider Property Access.
          </h2>

          <div class="orange-divider-line"></div>

          <p style="color: rgba(255, 255, 255, 0.85); font-size: 1.05rem; max-width: 780px; margin: 0 auto; line-height: 1.7;">
            Location drives property value. We combine on-the-ground local expertise with verified listings across Tamil Nadu, making it easy to find land and homes that fit your goals.
          </p>

          <!-- Key Metrics Counter Grid -->
          <div class="stats-grid" id="luxury-stats-grid">
            <div class="stat-box">
              <div class="stat-number" data-target="38" data-suffix="">38</div>
              <div class="stat-label">Districts Covered</div>
            </div>
            <div class="stat-box">
              <div class="stat-number" data-target="2500" data-suffix="+" data-format="comma">2,500+</div>
              <div class="stat-label">Verified Listings</div>
            </div>
            <div class="stat-box">
              <div class="stat-number" data-target="100" data-suffix="%">100%</div>
              <div class="stat-label">Transparent Process</div>
            </div>
            <div class="stat-box">
              <div class="stat-number" data-target="10000" data-suffix="+" data-format="k">10k+</div>
              <div class="stat-label">Satisfied Buyers & NRIs</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Google Verified Customer Reviews (Marquee Carousel) -->
    ${renderTestimonialsSection()}

    <!-- Trust Pillars Section -->
    <section class="trust-section" id="trust-section">
      <div class="container">

        <!-- Heading Block -->
        <div class="trust-heading-block" id="trust-heading-block">
          <div class="trust-eyebrow-row" style="justify-content: center; margin-bottom: 16px;">
            <span class="eyebrow eyebrow-center">OUR CORE VALUES</span>
          </div>
          <h2 class="heading-section trust-main-heading">
            Built Around the Real Needs of the Property Market
          </h2>
        </div>

        <!-- Cards Grid -->
        <div class="trust-pillars-grid" id="trust-pillars-grid">

          <!-- Card 01 -->
          <div class="trust-pillar-card trust-card-reveal" data-delay="0">
            <div class="pillar-bg-number" aria-hidden="true">01</div>
            <div class="pillar-icon-wrap">
              <i class="ri-map-pin-2-line pillar-icon"></i>
            </div>
            <div class="pillar-content">
              <h3 class="pillar-title">38-DISTRICT SEARCH</h3>
              <p class="pillar-desc">
                Explore property opportunities across all 38 districts of Tamil Nadu through location, taluk, and budget-based search.
              </p>
            </div>
            <div class="pillar-accent-line"></div>
          </div>

          <!-- Card 02 -->
          <div class="trust-pillar-card trust-card-reveal" data-delay="120">
            <div class="pillar-bg-number" aria-hidden="true">02</div>
            <div class="pillar-icon-wrap">
              <i class="ri-shield-check-line pillar-icon"></i>
            </div>
            <div class="pillar-content">
              <h3 class="pillar-title">VERIFIED LISTINGS & LEGAL</h3>
              <p class="pillar-desc">
                Listings reviewed for completeness and authenticity with legal partner support for sale deed drafting, EC verification, and SRO coordination.
              </p>
            </div>
            <div class="pillar-accent-line"></div>
          </div>

          <!-- Card 03 -->
          <div class="trust-pillar-card trust-card-reveal" data-delay="240">
            <div class="pillar-bg-number" aria-hidden="true">03</div>
            <div class="pillar-icon-wrap">
              <i class="ri-global-line pillar-icon"></i>
            </div>
            <div class="pillar-content">
              <h3 class="pillar-title">NRI ASSISTANCE & FAIRS</h3>
              <p class="pillar-desc">
                Dedicated overseas buyer assistance with virtual property viewing, documentation support, transaction coordination, and transparent pricing.
              </p>
            </div>
            <div class="pillar-accent-line"></div>
          </div>

        </div>

        <!-- FREQUENTLY ASKED QUESTIONS ACCORDION SECTION -->
        <div style="margin-top: 80px; background: #faf8f5; border-radius: 24px; padding: 40px; border: 1px solid rgba(0,0,0,0.06);">
          <div style="text-align: center; max-width: 640px; margin: 0 auto 36px auto;">
            <span class="eyebrow eyebrow-center" style="color: var(--color-orange); font-weight: 800; letter-spacing: 0.12em;">FREQUENTLY ASKED QUESTIONS</span>
            <h2 style="font-family: var(--font-serif); font-size: 2.1rem; font-weight: 800; color: #1a1a1a; margin-top: 8px;">
              Everything You Need to Know
            </h2>
            <p style="color: #666; font-size: 0.95rem; margin-top: 6px;">Click on any question below to expand and study the details.</p>
          </div>

          <div class="faq-accordion-container" style="max-width: 860px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px;">
            
            <!-- Question 1 -->
            <div class="faq-accordion-item active" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>1. What types of properties are available on Thanjai Property?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #eb5e28; color: #ffffff; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-subtract-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 20px 24px; max-height: 500px; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Thanjai Property lists residential houses, villas, apartments, plots, agricultural land, commercial spaces, industrial land, buildings, warehouses, commercial offices, showrooms and farm-related properties across Tamil Nadu.</p>
              </div>
            </div>

            <!-- Question 2 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>2. Can I search for properties by district?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Yes. Property seekers can browse properties by district, with the platform currently supporting searches across all 38 districts of Tamil Nadu.</p>
              </div>
            </div>

            <!-- Question 3 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>3. Can I search by budget?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Yes. The property search interface includes budget ranges, allowing users to narrow property results according to their preferred price range.</p>
              </div>
            </div>

            <!-- Question 4 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>4. Can I search by taluk?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Yes. The advanced property search includes both district and taluk filters, helping users narrow their search to a more specific location.</p>
              </div>
            </div>

            <!-- Question 5 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>5. Can I sell my property through Thanjai Property?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Yes. Property owners can post their properties by adding relevant information and images through the Post Property option. Basic property listing is currently offered free of charge.</p>
              </div>
            </div>

            <!-- Question 6 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>6. How are property listings reviewed?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">All property listings are reviewed for authenticity by our team, and seller details are verified before publication. We also provide legal assistance to help buyers verify Patta and title deeds.</p>
              </div>
            </div>

            <!-- Question 7 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>7. Does Thanjai Property assist NRI property buyers?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Yes. The platform provides dedicated NRI assistance covering areas such as legal documentation, virtual property viewing and transaction management.</p>
              </div>
            </div>

            <!-- Question 8 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>8. Is legal support available for property registration?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Thanjai Property states that its legal partners assist with sale deed drafting, EC verification and coordination of the registration process at the Sub-Registrar office.</p>
              </div>
            </div>

            <!-- Question 9 -->
            <div class="faq-accordion-item" style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.02); transition: all 0.3s ease;">
              <button class="faq-accordion-header" style="width: 100%; padding: 20px 24px; background: transparent; border: none; font-size: 1.05rem; font-weight: 700; color: #1a1a1a; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; gap: 16px;">
                <span>9. Can I find properties for rent?</span>
                <div class="faq-icon-wrap" style="width: 32px; height: 32px; border-radius: 50%; background: #f0f4f8; color: #2d3748; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; flex-shrink: 0;">
                  <i class="ri-add-line" style="font-size: 1.1rem;"></i>
                </div>
              </button>
              <div class="faq-accordion-body" style="padding: 0 24px 0 24px; max-height: 0; overflow: hidden; transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);">
                <p style="font-size: 0.95rem; color: #4a5568; line-height: 1.7; margin: 0;">Yes. Thanjai Property provides rental property search options across multiple Tamil Nadu districts.</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  `;
}

export function initLuxuryTransitionListeners() {
  // FAQ Accordion Toggle Event Listener
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-accordion-header');
    header?.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(other => {
        other.classList.remove('active');
        const b = other.querySelector('.faq-accordion-body');
        const icon = other.querySelector('.faq-icon-wrap i');
        const iconWrap = other.querySelector('.faq-icon-wrap');
        if (b) {
          b.style.maxHeight = '0';
          b.style.paddingBottom = '0';
        }
        if (icon) icon.className = 'ri-add-line';
        if (iconWrap) {
          iconWrap.style.background = '#f0f4f8';
          iconWrap.style.color = '#2d3748';
        }
      });

      if (!isActive) {
        item.classList.add('active');
        const body = item.querySelector('.faq-accordion-body');
        const icon = item.querySelector('.faq-icon-wrap i');
        const iconWrap = item.querySelector('.faq-icon-wrap');
        if (body) {
          body.style.maxHeight = body.scrollHeight + 40 + 'px';
          body.style.paddingBottom = '20px';
        }
        if (icon) icon.className = 'ri-subtract-line';
        if (iconWrap) {
          iconWrap.style.background = '#eb5e28';
          iconWrap.style.color = '#ffffff';
        }
      }
    });
  });
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
