import { getSiteImage } from '../utils/siteImagesStore.js';

export function renderPostPropertyCTA(onPostPropertyClick) {
  const postCtaBg = getSiteImage('post_cta_bg');
  return `
    <section class="post-cta-section" id="post-cta">
      <div class="container">
        <div class="post-cta-card">
          <div class="post-cta-media">
            <img 
              src="${postCtaBg}" 
              alt="Sell Property with Thanjai Property" 
              class="post-cta-img"
            />
            <div style="position: absolute; inset: 0; background: linear-gradient(90deg, transparent 40%, rgba(52, 34, 14, 0.95) 100%);"></div>
          </div>

          <div class="post-cta-content">
            <span class="eyebrow eyebrow-dark" style="margin-bottom: 16px;">
              <i class="ri-rocket-line"></i> MAXIMIZE YOUR PROPERTY VALUE
            </span>

            <h2 class="heading-display-light" style="font-size: clamp(2rem, 3.5vw, 3.25rem); margin-bottom: 16px;">
              Have a Property<br>to Sell or Rent?
            </h2>

            <p style="color: rgba(255, 255, 255, 0.85); font-size: 1.05rem; margin-bottom: 32px; line-height: 1.6;">
              Reach thousands of qualified buyers, NRI investors, and high-net-worth clients looking for verified properties in Thanjavur, Trichy, Chennai, Madurai, and across Tamil Nadu.
            </p>

            <div style="display: flex; flex-direction: column; gap: 14px; margin-bottom: 40px;">
              <div style="display: flex; align-items: center; gap: 12px; font-size: 0.9375rem; font-weight: 600;">
                <i class="ri-checkbox-circle-fill" style="color: var(--color-orange); font-size: 1.25rem;"></i>
                <span>Zero listing fees for individual property owners</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; font-size: 0.9375rem; font-weight: 600;">
                <i class="ri-checkbox-circle-fill" style="color: var(--color-orange); font-size: 1.25rem;"></i>
                <span>Professional high-res media & legal title assistance</span>
              </div>
              <div style="display: flex; align-items: center; gap: 12px; font-size: 0.9375rem; font-weight: 600;">
                <i class="ri-checkbox-circle-fill" style="color: var(--color-orange); font-size: 1.25rem;"></i>
                <span>Direct WhatsApp & phone lead notifications</span>
              </div>
            </div>

            <div>
              <button class="btn btn-primary" id="post-cta-trigger-btn" style="padding: 16px 36px; font-size: 1rem;">
                <i class="ri-add-line" style="font-size: 1.25rem;"></i>
                <span>POST YOUR PROPERTY NOW</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}

export function initPostPropertyCTAListeners(onPostPropertyClick) {
  document.getElementById('post-cta-trigger-btn')?.addEventListener('click', onPostPropertyClick);
}
