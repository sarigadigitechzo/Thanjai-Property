export function renderContactSection() {
  return `
    <section class="contact-section" id="contact">

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- SECTION 1 — DARK HERO SPLIT                                    -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div class="contact-hero">
        <div class="contact-hero-inner container">

          <!-- Left copy -->
          <div class="contact-hero-left" id="contact-hero-left">
            <span class="contact-hero-eyebrow">
              <span class="contact-hero-eyebrow-dot"></span>
              PRIVATE PROPERTY CONSULTATION
            </span>
            <h2 class="contact-hero-heading">
              <span class="contact-hero-line">Let's Find</span>
              <span class="contact-hero-line">Your Perfect</span>
              <span class="contact-hero-line contact-hero-line-accent">Property.</span>
            </h2>
            <p class="contact-hero-body">
              Tell us what you're looking for. Our local property specialists will help you discover the right opportunity.
            </p>
            <a href="#contact-form-area" class="contact-hero-cta" id="contact-hero-cta">
              Start Your Search
              <i class="ri-arrow-down-line contact-hero-cta-arrow"></i>
            </a>
          </div>

          <!-- Right image -->
          <div class="contact-hero-right" id="contact-hero-right">
            <div class="contact-hero-img-wrap">
              <img
                src="https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?auto=format&fit=crop&w=900&q=80"
                alt="Luxury Property Thanjavur"
                class="contact-hero-img"
                id="contact-hero-img"
              />
              <div class="contact-hero-img-overlay"></div>
            </div>
            <!-- Floating trust badge -->
            <div class="contact-hero-badge" id="contact-hero-badge">
              <div class="contact-hero-badge-icon">
                <i class="ri-award-fill"></i>
              </div>
              <div>
                <div class="contact-hero-badge-num">15+</div>
                <div class="contact-hero-badge-label">YEARS OF TRUST</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ═══════════════════════════════════════════════════════════════ -->
      <!-- SECTION 2 — EDITORIAL FORM + DARK CONTACT PANEL               -->
      <!-- ═══════════════════════════════════════════════════════════════ -->
      <div class="contact-body" id="contact-form-area">
        <div class="container">
          <div class="contact-body-grid">

            <!-- LEFT: Editorial Form -->
            <div class="contact-form-col" id="contact-form-col">

              <div class="contact-form-editorial-header">
                <span class="contact-form-step-label">01 — YOUR PROPERTY BRIEF</span>
                <h3 class="contact-form-heading">Tell us what you're looking for.</h3>
                <p class="contact-form-subtext">Share a few details and we'll match you with suitable properties.</p>
              </div>

              <form class="contact-form" id="contact-form" novalidate>

                <!-- Row 1 -->
                <div class="cf-row">
                  <div class="cf-field">
                    <label class="cf-label" for="cf-name">Full Name</label>
                    <div class="cf-input-wrap">
                      <i class="ri-user-3-line cf-icon"></i>
                      <input type="text" id="cf-name" name="name" class="cf-input" placeholder="Your full name" required autocomplete="name" />
                    </div>
                  </div>
                  <div class="cf-field">
                    <label class="cf-label" for="cf-phone">Phone / WhatsApp</label>
                    <div class="cf-input-wrap">
                      <i class="ri-phone-line cf-icon"></i>
                      <input type="tel" id="cf-phone" name="phone" class="cf-input" placeholder="9800000000" required autocomplete="tel" maxlength="10" pattern="[0-9]{10}" title="Please enter a 10-digit phone number" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                    </div>
                  </div>
                </div>

                <!-- Row 2 -->
                <div class="cf-row">
                  <div class="cf-field">
                    <label class="cf-label" for="cf-email">Email Address</label>
                    <div class="cf-input-wrap">
                      <i class="ri-mail-line cf-icon"></i>
                      <input type="email" id="cf-email" name="email" class="cf-input" placeholder="you@email.com" autocomplete="email" />
                    </div>
                  </div>
                  <div class="cf-field">
                    <label class="cf-label" for="cf-interest">Property Type</label>
                    <div class="custom-select-wrapper" id="custom-property-type">
                      <input type="hidden" name="interest" id="cf-interest" value="">
                      <div class="cf-input cf-input-wrap custom-select-trigger" id="custom-select-trigger">
                        <i class="ri-home-4-line cf-icon"></i>
                        <div class="custom-select-text" id="custom-select-text">Select type</div>
                        <i class="ri-arrow-down-s-line cf-select-arrow"></i>
                      </div>
                      <div class="custom-select-options">
                        <div class="custom-option" data-value="villa">Luxury Villa</div>
                        <div class="custom-option" data-value="apartment">Apartment / Flat</div>
                        <div class="custom-option" data-value="plot">Residential Plot</div>
                        <div class="custom-option" data-value="farm">Farm / Agriculture Land</div>
                        <div class="custom-option" data-value="commercial">Commercial Property</div>
                        <div class="custom-option" data-value="sell">I Want to Sell / Rent</div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Location -->
                <div class="cf-field">
                  <label class="cf-label" for="cf-location">Preferred Location</label>
                  <div class="cf-input-wrap">
                    <i class="ri-map-pin-2-line cf-icon"></i>
                    <input type="text" id="cf-location" name="location" class="cf-input" placeholder="e.g. Thanjavur, Kumbakonam, Trichy…" />
                  </div>
                </div>

                <!-- Message -->
                <div class="cf-field">
                  <label class="cf-label" for="cf-message">Your Message</label>
                  <div class="cf-input-wrap cf-textarea-wrap">
                    <i class="ri-chat-3-line cf-icon" style="top:18px; align-self:flex-start;"></i>
                    <textarea id="cf-message" name="message" class="cf-input cf-textarea" placeholder="Tell us about your requirements, budget, timeline…" rows="6"></textarea>
                  </div>
                </div>

                <!-- Budget pills -->
                <div class="cf-field">
                  <label class="cf-label">Budget Range</label>
                  <div class="cf-budget-pills" id="cf-budget-pills">
                    <button type="button" class="cf-budget-pill" data-value="under-50l">Under ₹50L</button>
                    <button type="button" class="cf-budget-pill" data-value="50l-1cr">₹50L – ₹1Cr</button>
                    <button type="button" class="cf-budget-pill" data-value="1cr-3cr">₹1Cr – ₹3Cr</button>
                    <button type="button" class="cf-budget-pill" data-value="above-3cr">Above ₹3Cr</button>
                  </div>
                  <input type="hidden" id="cf-budget" name="budget" value="" />
                </div>

                <!-- CTA -->
                <button type="submit" class="cf-submit" id="cf-submit-btn">
                  <span class="cf-submit-text">Send Property Brief</span>
                  <i class="ri-arrow-right-line cf-submit-arrow"></i>
                </button>

                <!-- Success -->
                <div class="cf-success" id="cf-success" style="display:none;">
                  <i class="ri-checkbox-circle-fill" style="color:var(--color-orange); font-size:1.4rem; flex-shrink:0;"></i>
                  <div>
                    <strong>Thank you! We'll be in touch soon.</strong>
                    <p>Our advisor will contact you within 24 hours.</p>
                  </div>
                </div>

              </form>
            </div>

            <!-- RIGHT: Dark Contact Panel -->
            <div class="contact-panel-col" id="contact-panel-col">
              <div class="contact-dark-panel">

                <h3 class="contact-panel-heading">Speak With Our<br>Property Team</h3>
                <p class="contact-panel-subtext">Connect with a specialist who knows the region.</p>

                <div class="contact-panel-divider"></div>

                <!-- Call -->
                <div class="contact-panel-row">
                  <div class="contact-panel-row-icon">
                    <i class="ri-phone-fill"></i>
                  </div>
                  <div>
                    <div class="contact-panel-row-label">CALL US</div>
                    <a href="tel:+919443125009" class="contact-panel-row-value">+91 94431 25009</a>
                  </div>
                </div>

                <div class="contact-panel-divider"></div>

                <!-- Office -->
                <div class="contact-panel-row">
                  <div class="contact-panel-row-icon">
                    <i class="ri-map-pin-2-fill"></i>
                  </div>
                  <div>
                    <div class="contact-panel-row-label">OFFICE</div>
                    <div class="contact-panel-row-value" style="cursor:default; font-size: 0.95rem;">
                      Flat No B1, 2nd Floor, Sivasakthi Apartment,<br>
                      Raja Nagar, Behind HDFC Bank,<br>
                      Near New Bus Stand,<br>
                      <span style="font-size:0.85rem; opacity:0.75;">Thanjavur - 613005</span>
                    </div>
                  </div>
                </div>

                <div class="contact-panel-divider"></div>

                <!-- Hours -->
                <div class="contact-panel-row">
                  <div class="contact-panel-row-icon">
                    <i class="ri-time-fill"></i>
                  </div>
                  <div>
                    <div class="contact-panel-row-label">WORKING HOURS</div>
                    <div class="contact-panel-row-value" style="cursor:default; font-size:0.9rem;">
                      Mon – Sat: 9 AM – 7 PM<br>Sunday: By Appointment
                    </div>
                  </div>
                </div>

                <div class="contact-panel-divider"></div>

                <!-- Inline Map Area inside Panel -->
                <div class="contact-inline-map" id="contact-inline-map" style="margin-top: 16px; margin-bottom: 24px; flex-grow: 1; position: relative; min-height: 0;">
                  <div class="contact-map-wrap" id="contact-map-wrap" style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); overflow: hidden;">
                    <iframe
                      class="contact-map-iframe"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.140224163589!2d79.13038621480287!3d10.74100919234857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baabf9f5b66d489%3A0xc68297b69c4c7304!2sNew%20Bus%20Stand%2C%20Thanjavur!5e0!3m2!1sen!2sin!4v1691234567890"
                      allowfullscreen=""
                      loading="lazy"
                      referrerpolicy="no-referrer-when-downgrade"
                      title="Thanjavur Property Advisory Desk"
                    ></iframe>
                    <div class="contact-loc-badge" id="contact-loc-badge" style="top: auto; bottom: 12px; left: 12px; right: 12px; padding: 10px 14px;">
                      <div class="contact-loc-pulse"></div>
                      <div>
                        <div class="contact-loc-title" style="font-size: 0.75rem;">Thanjavur Advisory Desk</div>
                        <div class="contact-loc-sub" style="font-size: 0.65rem;">Raja Nagar, Thanjavur</div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

    </section>
  `;
}

export function initContactSectionListeners() {
  // ── Budget pill toggle ──────────────────────────────────────────────
  const pills = document.querySelectorAll('.cf-budget-pill');
  const budgetInput = document.getElementById('cf-budget');
  pills.forEach(pill => {
    pill.addEventListener('click', () => {
      pills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (budgetInput) budgetInput.value = pill.dataset.value;
    });
  });

  // ── Custom Dropdown ─────────────────────────────────────────────────
  const dropdownWrapper = document.getElementById('custom-property-type');
  const dropdownTrigger = document.getElementById('custom-select-trigger');
  const dropdownOptions = document.querySelectorAll('.custom-option');
  const hiddenInput = document.getElementById('cf-interest');
  const selectText = document.getElementById('custom-select-text');

  if (dropdownWrapper && dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      dropdownWrapper.classList.toggle('open');
    });

    dropdownOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdownOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        const value = option.getAttribute('data-value');
        const text = option.textContent;
        
        hiddenInput.value = value;
        selectText.textContent = text;
        selectText.classList.add('has-value');
        
        dropdownWrapper.classList.remove('open');
      });
    });

    document.addEventListener('click', (e) => {
      if (!dropdownWrapper.contains(e.target)) {
        dropdownWrapper.classList.remove('open');
      }
    });
  }

  // ── Form submit ─────────────────────────────────────────────────────
  const form = document.getElementById('contact-form');
  const submitBtn = document.getElementById('cf-submit-btn');
  const successMsg = document.getElementById('cf-success');

  form?.addEventListener('submit', e => {
    e.preventDefault();
    const name = document.getElementById('cf-name')?.value.trim();
    const phone = document.getElementById('cf-phone')?.value.trim();
    if (!name || !phone) { document.getElementById('cf-name')?.focus(); return; }

    submitBtn.disabled = true;
    submitBtn.querySelector('.cf-submit-text').textContent = 'Sending…';

    setTimeout(() => {
      form.reset();
      pills.forEach(p => p.classList.remove('active'));
      if (budgetInput) budgetInput.value = '';
      submitBtn.disabled = false;
      submitBtn.querySelector('.cf-submit-text').textContent = 'Send Property Brief';
      if (successMsg) {
        successMsg.style.display = 'flex';
        setTimeout(() => { successMsg.style.display = 'none'; }, 5000);
      }
    }, 1000);
  });

  // ── Scroll-reveal IntersectionObserver ─────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const revealOnce = (el, cls = 'ct-visible', delay = 0, threshold = 0.12) => {
    if (!el) return;
    if (prefersReduced) { el.classList.add(cls); return; }
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          setTimeout(() => el.classList.add(cls), delay);
          obs.disconnect();
        }
      });
    }, { threshold });
    obs.observe(el);
  };

  // Hero
  revealOnce(document.getElementById('contact-hero-left'), 'ct-visible');
  revealOnce(document.getElementById('contact-hero-right'), 'ct-visible', 120);
  revealOnce(document.getElementById('contact-hero-badge'), 'ct-visible', 500);

  // Form column
  revealOnce(document.getElementById('contact-form-col'), 'ct-visible', 0);

  // Contact dark panel
  revealOnce(document.getElementById('contact-panel-col'), 'ct-visible', 150);

  // Map section
  revealOnce(document.getElementById('contact-inline-map'), 'ct-visible', 300);
  revealOnce(document.getElementById('contact-loc-badge'), 'ct-badge-visible', 450);

  // Hero CTA smooth scroll
  document.getElementById('contact-hero-cta')?.addEventListener('click', e => {
    e.preventDefault();
    document.getElementById('contact-form-area')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}
