import { getSiteImage } from '../utils/siteImagesStore.js';

export function renderExploreSection(onPostPropertyClick) {
  const postCtaBg = getSiteImage('post_cta_bg') || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";
  const showcaseBg = getSiteImage('showcase_bg') || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80";

  return `
    <section class="editorial-section" id="promote-land-section" style="padding: 90px 0; background: #faf8f5;">
      <div class="container" style="position: relative; z-index: 2;">
        
        <!-- 1. Editorial Header for Land Owners & Sellers -->
        <div class="editorial-intro-container">
          <!-- Top Eyebrow Bar -->
          <div class="editorial-top-eyebrow-bar">
            <div class="editorial-eyebrow-wrap">
              <span class="editorial-vertical-line"></span>
              <span class="eyebrow" style="color: var(--color-orange); font-weight: 800; letter-spacing: 0.12em;">SELL & PROMOTE YOUR LAND</span>
            </div>
          </div>

          <!-- Main 2-Column Row (Title Left + Description Right) -->
          <div class="editorial-main-two-col">
            <div class="editorial-title-col">
              <h2 class="heading-display-light editorial-main-title">
                Sell or Promote Your<br>Land & Properties.
              </h2>
            </div>

            <div class="editorial-desc-col">
              <p class="editorial-desc-text">
                Reach thousands of genuine buyers, NRI investors, and high-net-worth clients looking for verified layout plots, agricultural farmlands, villas, and commercial spaces across Tamil Nadu.
              </p>
            </div>
          </div>

          <!-- Integrated Horizontal Stats Bar -->
          <div class="editorial-integrated-stats-bar">
            <div class="editorial-inline-stats">
              <div class="inline-stat-item">
                <div class="stat-num-wrap">
                  <span class="stat-num">100%</span>
                </div>
                <span class="stat-lbl">Zero Listing Fees</span>
              </div>

              <div class="inline-stat-sep"></div>

              <div class="inline-stat-item">
                <div class="stat-num-wrap">
                  <span class="stat-num">10k+</span>
                </div>
                <span class="stat-lbl">Active Buyers & NRIs</span>
              </div>

              <div class="inline-stat-sep"></div>

              <div class="inline-stat-item">
                <div class="stat-num-wrap">
                  <span class="stat-num">Since 2009</span>
                </div>
                <span class="stat-lbl">Legal Patta Verification</span>
              </div>
            </div>

            <button class="editorial-scroll-down-btn post-land-trigger-btn" style="border: none; background: none; cursor: pointer;">
              <span style="font-weight: 800; color: var(--color-orange);">PROMOTE YOUR LAND NOW</span>
              <i class="ri-arrow-right-line scroll-arrow-icon" style="color: var(--color-orange);"></i>
            </button>
          </div>
        </div>

        <!-- 2. Asymmetric Showcase: Left Seller Spotlight Card + Right Seller Benefits -->
        <div class="editorial-asymmetric-showcase">
          
          <!-- LEFT 65%: PROMOTIONAL LAND & PROPERTY SPOTLIGHT BANNER -->
          <div class="editorial-hero-slider-wrap" style="height: 100%; min-height: 400px; border-radius: 24px; overflow: hidden; position: relative;">
            <img src="${postCtaBg}" alt="Promote Land with Thanjai Property" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(42,24,8,0.85) 100%);"></div>

            <div style="position: absolute; top: 24px; left: 24px;">
              <span class="badge badge-orange" style="font-size: 0.8rem; font-weight: 800;">
                <i class="ri-rocket-fill"></i> LAND & PROPERTY SELLER DESK
              </span>
            </div>

            <!-- Floating White/Glass Action Box -->
            <div style="
              position: absolute; bottom: 24px; left: 24px; right: 24px;
              background: rgba(255, 255, 255, 0.95); backdrop-filter: blur(12px);
              border-radius: 20px; padding: 28px; border: 1px solid rgba(255,255,255,0.4);
              box-shadow: 0 10px 30px rgba(0,0,0,0.15);
            ">
              <h3 style="font-family: var(--font-serif); font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
                Have Land or Property to Sell in Tamil Nadu?
              </h3>
              <p style="font-size: 0.92rem; color: #555; line-height: 1.5; margin-bottom: 20px;">
                Submit your land or property details in 60 seconds. Our senior legal advisors will verify Patta title documents and showcase your listing to vetted buyers.
              </p>

              <button class="btn btn-primary post-land-trigger-btn" style="padding: 14px 28px; font-size: 0.95rem; border-radius: 10px; width: 100%; justify-content: center;">
                <i class="ri-add-circle-line" style="font-size: 1.25rem;"></i>
                <span>Click Here to Sell / Promote Your Land Now</span>
              </button>
            </div>
          </div>

          <!-- RIGHT 35%: SELLER ADVANTAGES LIST -->
          <div class="editorial-magazine-list" style="background: #ffffff; padding: 28px; border-radius: 24px; border: 1px solid rgba(0,0,0,0.07); box-shadow: 0 4px 18px rgba(0,0,0,0.03);">
            <h4 class="magazine-list-heading" style="color: var(--color-orange); margin-bottom: 20px;">WHY SELL WITH THANJAI</h4>

            <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 24px;">
              
              <!-- Advantage 1 -->
              <div style="display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(235,94,40,0.12); color: var(--color-orange); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                  <i class="ri-price-tag-3-line"></i>
                </div>
                <div>
                  <h5 style="font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2px;">Zero Listing Commission</h5>
                  <p style="font-size: 0.82rem; color: #666; margin: 0; line-height: 1.4;">Free property exposure for individual land owners & plot developers.</p>
                </div>
              </div>

              <!-- Advantage 2 -->
              <div style="display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(235,94,40,0.12); color: var(--color-orange); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                  <i class="ri-shield-check-line"></i>
                </div>
                <div>
                  <h5 style="font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2px;">Patta & Title Assistance</h5>
                  <p style="font-size: 0.82rem; color: #666; margin: 0; line-height: 1.4;">Revenue title verification to make your property 100% deal-ready.</p>
                </div>
              </div>

              <!-- Advantage 3 -->
              <div style="display: flex; gap: 14px; align-items: flex-start;">
                <div style="width: 40px; height: 40px; border-radius: 10px; background: rgba(235,94,40,0.12); color: var(--color-orange); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; flex-shrink: 0;">
                  <i class="ri-whatsapp-line"></i>
                </div>
                <div>
                  <h5 style="font-size: 0.95rem; font-weight: 700; color: #1a1a1a; margin-bottom: 2px;">Direct WhatsApp Leads</h5>
                  <p style="font-size: 0.82rem; color: #666; margin: 0; line-height: 1.4;">Instant notifications sent straight to your phone when buyers inquire.</p>
                </div>
              </div>

            </div>

            <button class="btn btn-outline-dark post-land-trigger-btn" style="width: 100%; border-radius: 10px; font-size: 0.88rem; justify-content: center;">
              <i class="ri-edit-2-line"></i> Fill Out Land Form
            </button>
          </div>

        </div>

      </div>
    </section>
  `;
}

export function initExploreSectionListeners(onPostPropertyClick) {
  document.querySelectorAll('.post-land-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      if (onPostPropertyClick) {
        onPostPropertyClick();
      } else {
        window.dispatchEvent(new CustomEvent('openPostPropertyModal'));
      }
    });
  });
}
