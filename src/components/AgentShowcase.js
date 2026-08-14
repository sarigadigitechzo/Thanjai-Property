import { AGENTS, BUILDERS } from '../data/agents.js';

export function renderAgentShowcase() {
  return `
    <section class="agents-section" id="agents">
      <div class="container" style="position:relative; z-index:2;">

        <!-- Watermark bg -->
        <div class="advisors-watermark-bg" aria-hidden="true">ADVISORS</div>

        <!-- Section Header -->
        <div class="advisors-header-grid" id="advisors-header">
          <div class="advisors-header-left">
            <div class="advisors-eyebrow-row">
              <span class="advisors-eyebrow-line"></span>
              <span class="eyebrow" style="color: var(--color-orange); font-weight:800; letter-spacing:0.12em;">OUR PROPERTY SPECIALISTS</span>
            </div>
            <h2 class="advisors-main-heading">
              Trusted Real Estate<br>Advisors
            </h2>
          </div>
          <div class="advisors-header-right">
            <p class="advisors-header-desc">
              Consult directly with dedicated local experts specializing in luxury villas, residential plots, commercial space, and Kaveri farm estates.
            </p>
          </div>
        </div>

        <!-- Agents Grid -->
        <div class="advisors-grid" id="advisors-grid">
          ${AGENTS.map((agent, i) => `
            <div class="advisor-card advisor-card-reveal" data-delay="${i * 120}" id="advisor-card-${agent.id}">

              <!-- Decorative background number -->
              <div class="advisor-bg-number" aria-hidden="true">0${i + 1}</div>

              <!-- Portrait -->
              <div class="advisor-portrait-wrap">
                <div class="advisor-portrait-ring">
                  <img src="${agent.image}" alt="${agent.name}" class="advisor-portrait-img" />
                </div>
              </div>

              <!-- Card Body -->
              <div class="advisor-card-body">

                <!-- Name + role -->
                <div class="advisor-identity">
                  <h3 class="advisor-name">${agent.name}</h3>
                  <div class="advisor-role-label">${agent.role}</div>
                </div>

                <!-- Location -->
                <div class="advisor-location-row">
                  <i class="ri-map-pin-2-fill advisor-pin-icon"></i>
                  <span class="advisor-location-text">${agent.location}</span>
                </div>

                <!-- Specialty -->
                <div class="advisor-specialty-tag">
                  <i class="ri-award-line" style="font-size:0.75rem; color:var(--color-orange);"></i>
                  <span>${agent.specialty}</span>
                </div>

                <!-- Experience + listings row -->
                <div class="advisor-meta-row">
                  <div class="advisor-meta-pill">
                    <span class="advisor-meta-num">${agent.activeListings}</span>
                    <span class="advisor-meta-label">Active Listings</span>
                  </div>
                  <div class="advisor-meta-pill">
                    <span class="advisor-meta-num" style="font-size:0.875rem;">${agent.experience}</span>
                  </div>
                </div>

                <!-- Contact actions -->
                <div class="advisor-actions">
                  <a href="tel:${agent.phone}"
                     class="advisor-btn-circle advisor-btn-phone"
                     title="Call ${agent.name}">
                    <i class="ri-phone-line"></i>
                  </a>
                  <a href="https://wa.me/${agent.whatsapp}"
                     target="_blank" rel="noopener"
                     class="advisor-btn-circle advisor-btn-whatsapp"
                     title="WhatsApp ${agent.name}">
                    <i class="ri-whatsapp-line"></i>
                  </a>
                  <button class="advisor-btn-enquire direct-enquire-agent-btn"
                          data-agent="${agent.name}">
                    Enquire <i class="ri-arrow-right-line advisor-enquire-arrow"></i>
                  </button>
                </div>
              </div>

              <!-- Bottom accent line -->
              <div class="advisor-accent-line"></div>
            </div>
          `).join('')}
        </div>

        <!-- Vetted Builders Banner -->
        <div style="margin-top: 80px; padding: 40px; background: var(--color-white); border-radius: var(--radius-lg); border: 1px solid var(--color-border);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; flex-wrap: wrap; gap: 16px;">
            <div>
              <span class="eyebrow">DEVELOPER PARTNERS</span>
              <h3 class="font-serif" style="font-size: 1.75rem; color: var(--color-brown); margin-top: 4px;">Verified Tamil Nadu Builders</h3>
            </div>
            <span style="font-size: 0.875rem; color: var(--color-text-muted);">Strictly vetted DTCP &amp; RERA Compliant Partners</span>
          </div>
          <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
            ${BUILDERS.map(bld => `
              <div style="display: flex; align-items: center; gap: 16px; padding: 20px; background: var(--color-cream-light); border-radius: var(--radius-md); border: 1px solid var(--color-border);">
                <img src="${bld.logo}" alt="${bld.name}" style="width: 56px; height: 56px; border-radius: var(--radius-sm); object-fit: cover;" />
                <div>
                  <span class="badge badge-orange" style="font-size: 0.65rem; padding: 2px 8px;">${bld.badge}</span>
                  <h4 style="font-size: 1rem; font-weight: 800; color: var(--color-brown); margin: 4px 0 2px;">${bld.name}</h4>
                  <div style="font-size: 0.8125rem; color: var(--color-text-muted);">${bld.projects} • ${bld.location}</div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

      </div>
    </section>
  `;
}

export function initAgentListeners() {
  // Enquire buttons
  document.querySelectorAll('.direct-enquire-agent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const agentName = btn.dataset.agent;
      window.dispatchEvent(new CustomEvent('openEnquiryModal', { detail: { agentName } }));
    });
  });

  // ── Scroll-reveal for header ────────────────────────────────────────────
  const header = document.getElementById('advisors-header');
  if (header) {
    const hObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          header.classList.add('advisors-header-visible');
          hObs.disconnect();
        }
      });
    }, { threshold: 0.2 });
    hObs.observe(header);
  }

  // ── Stagger card reveal ─────────────────────────────────────────────────
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cards = document.querySelectorAll('.advisor-card-reveal');

  if (prefersReduced) {
    if (header) header.classList.add('advisors-header-visible');
    cards.forEach(c => c.classList.add('advisor-card-visible'));
  } else {
    const grid = document.getElementById('advisors-grid');
    if (grid) {
      const cObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            cards.forEach(card => {
              const delay = parseInt(card.dataset.delay || '0', 10);
              setTimeout(() => card.classList.add('advisor-card-visible'), delay);
            });
            cObs.disconnect();
          }
        });
      }, { threshold: 0.1 });
      cObs.observe(grid);
    }
  }

  // ── Dimming effect: hover one card dims others ──────────────────────────
  const allCards = document.querySelectorAll('.advisor-card');
  allCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      allCards.forEach(c => {
        if (c !== card) c.classList.add('advisor-card-dimmed');
      });
    });
    card.addEventListener('mouseleave', () => {
      allCards.forEach(c => c.classList.remove('advisor-card-dimmed'));
    });
  });
}
