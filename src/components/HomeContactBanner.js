export function renderHomeContactBanner(onNavigateToContact) {
  return `
    <section class="home-contact-banner-section" style="padding: 90px 0; background: linear-gradient(135deg, #1c1007 0%, #2a1808 60%, #150b04 100%); color: #ffffff;">
      <div class="container">
        <div style="
          background: rgba(255, 255, 255, 0.04); border: 1px solid rgba(255, 255, 255, 0.12);
          border-radius: 24px; padding: 48px; display: flex; justify-content: space-between;
          align-items: center; flex-wrap: wrap; gap: 30px; backdrop-filter: blur(10px);
        ">
          <div style="max-width: 680px;">
            <span class="eyebrow eyebrow-dark" style="margin-bottom: 12px; display: inline-block;">
              <i class="ri-search-eye-line" style="color: var(--color-orange, #eb5e28);"></i> YOUR PROPERTY SEARCH STARTS HERE
            </span>
            <h2 class="heading-display-light" style="font-size: clamp(1.8rem, 3.5vw, 2.6rem); margin-bottom: 14px; color: #ffffff;">
              Search With Purpose.<br>Explore With Confidence.
            </h2>
            <p style="color: rgba(255, 255, 255, 0.85); font-size: 1.02rem; line-height: 1.65; margin: 0;">
              Whether you are looking for your first home, a residential plot, agricultural land, an apartment, a villa, a commercial property or an investment opportunity, the right starting point is a property search built around your needs across Tamil Nadu.
            </p>
          </div>

          <div style="display: flex; gap: 16px; flex-wrap: wrap;">
            <button class="btn btn-primary" id="home-banner-contact-btn" style="padding: 16px 36px; font-size: 1rem; border-radius: 12px;">
              <span>Go to Contact Page</span>
              <i class="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initHomeContactBannerListeners(onNavigateToContact) {
  document.getElementById('home-banner-contact-btn')?.addEventListener('click', onNavigateToContact);
}
