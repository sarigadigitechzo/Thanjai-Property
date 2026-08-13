import { AGENTS, BUILDERS } from '../data/agents.js';

export function renderAgentShowcase() {
  return `
    <section class="agents-section" id="agents">
      <div class="container">
        <!-- Section Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; flex-wrap: wrap; gap: 20px;">
          <div>
            <span class="eyebrow">OUR PROPERTY SPECIALISTS</span>
            <h2 class="heading-section" style="margin-top: 12px;">
              Trusted Real Estate Advisors
            </h2>
          </div>
          <p style="color: var(--color-text-muted); max-width: 460px;">
            Consult directly with dedicated local experts specializing in luxury villas, residential plots, commercial space, and Kaveri farm estates.
          </p>
        </div>

        <!-- Agents Grid -->
        <div class="agents-grid">
          ${AGENTS.map(agent => `
            <div class="agent-card">
              <img src="${agent.image}" alt="${agent.name}" class="agent-avatar" />
              <h3 class="agent-name">${agent.name}</h3>
              <div class="agent-role">${agent.role}</div>
              <div style="font-size: 0.8125rem; color: var(--color-text-muted); margin-bottom: 8px;">
                <i class="ri-map-pin-line" style="color: var(--color-orange);"></i> ${agent.location}
              </div>
              <div style="font-size: 0.75rem; font-weight: 700; color: var(--color-brown); background: var(--color-cream); padding: 4px 12px; border-radius: var(--radius-full); display: inline-block; margin-bottom: 16px;">
                ${agent.activeListings} Active Listings
              </div>

              <div class="agent-contact-actions">
                <a href="tel:${agent.phone}" class="btn btn-outline-dark btn-icon" title="Call ${agent.name}">
                  <i class="ri-phone-line"></i>
                </a>
                <a href="https://wa.me/${agent.whatsapp}" target="_blank" rel="noopener" class="btn btn-primary btn-icon" title="WhatsApp ${agent.name}">
                  <i class="ri-whatsapp-line" style="font-size: 1.2rem;"></i>
                </a>
                <button class="btn btn-brown direct-enquire-agent-btn" data-agent="${agent.name}" style="padding: 0 16px; font-size: 0.8125rem;">
                  Enquire
                </button>
              </div>
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
            <span style="font-size: 0.875rem; color: var(--color-text-muted);">Strictly vetted DTCP & RERA Compliant Partners</span>
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
  document.querySelectorAll('.direct-enquire-agent-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const agentName = btn.dataset.agent;
      window.dispatchEvent(new CustomEvent('openEnquiryModal', { detail: { agentName } }));
    });
  });
}
