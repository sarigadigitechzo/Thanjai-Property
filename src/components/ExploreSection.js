import { getSiteImage } from '../utils/siteImagesStore.js';
import { getCurrentUser } from '../utils/userAuthStore.js';

export function renderExploreSection() {
  const postCtaBg = getSiteImage('post_cta_bg') || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80";
  const showcaseBg = getSiteImage('showcase_bg') || "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80";

  return `
    <section class="editorial-section" id="promote-land-section" style="padding: 90px 0; background: #faf8f5;">
      <div class="container" style="position: relative; z-index: 2;">
        
        <!-- 1. Editorial Header for Land Owners & Sellers -->
        <div class="editorial-intro-container" style="display: flex; flex-direction: column; align-items: center; text-align: center; max-width: 900px; margin: 0 auto 48px auto;">
          <!-- Top Eyebrow Bar -->
          <div class="editorial-top-eyebrow-bar" style="justify-content: center; margin-bottom: 24px;">
            <div class="editorial-eyebrow-wrap" style="gap: 8px;">
              <span class="eyebrow eyebrow-center" style="color: var(--color-orange); font-weight: 800; letter-spacing: 0.12em;">SELL YOUR PROPERTY TO THE RIGHT AUDIENCE</span>
            </div>
          </div>

          <!-- Main Centered Content -->
          <h2 class="heading-display-light editorial-main-title" style="margin-bottom: 12px; font-size: 3.5rem;">
            Sell Your Property Faster to Genuine Buyers
          </h2>
          <div style="font-size: 1.15rem; font-weight: 700; color: #eb5e28; margin-bottom: 24px;">List for Free & Connect with Thousands of Active Seekers</div>
          
          <p class="editorial-desc-text" style="font-size: 1.1rem; line-height: 1.7; color: #555; max-width: 800px; margin-bottom: 40px;">
            Looking to sell your house, plot, farmland, or commercial space? List your property on Thanjai Property for free. We showcase your property with clear details, verified Patta support, and zero listing fees to connect you directly with genuine local and NRI buyers across Tamil Nadu.
          </p>

          <!-- Integrated Horizontal Stats Bar -->
          <div class="editorial-integrated-stats-bar" style="width: 100%; border-top: 1px solid rgba(0,0,0,0.08); padding-top: 24px; justify-content: center; gap: 40px;">
            <div class="editorial-inline-stats" style="gap: 40px;">
              <div class="inline-stat-item" style="flex-direction: column; align-items: center; gap: 4px;">
                <div class="stat-num-wrap">
                  <span class="stat-num" style="font-size: 1.8rem;">100%</span>
                </div>
                <span class="stat-lbl" style="text-align: center;">Zero Listing Fees</span>
              </div>

              <div class="inline-stat-sep" style="height: 40px;"></div>

              <div class="inline-stat-item" style="flex-direction: column; align-items: center; gap: 4px;">
                <div class="stat-num-wrap">
                  <span class="stat-num" style="font-size: 1.8rem;">10k+</span>
                </div>
                <span class="stat-lbl" style="text-align: center;">Active Buyers & NRIs</span>
              </div>

              <div class="inline-stat-sep" style="height: 40px;"></div>

              <div class="inline-stat-item" style="flex-direction: column; align-items: center; gap: 4px;">
                <div class="stat-num-wrap">
                  <span class="stat-num" style="font-size: 1.8rem;">Since 2009</span>
                </div>
                <span class="stat-lbl" style="text-align: center;">Legal Patta Verification</span>
              </div>
            </div>
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
                <i class="ri-rocket-fill"></i> ALL PROPERTY SELLER DESK
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
                Do You Have a Property to Sell in Tamil Nadu?
              </h3>
              <p style="font-size: 0.92rem; color: #555; line-height: 1.5; margin-bottom: 20px;">
                Share your property details in just 60 seconds. Our expert team will verify the documents and present your listing to verified, ready-to-buy seekers.
              </p>

              <button class="btn btn-primary post-land-trigger-btn" style="padding: 14px 28px; font-size: 0.95rem; border-radius: 10px; width: 100%; justify-content: center;">
                <i class="ri-add-circle-line" style="font-size: 1.25rem;"></i>
                <span>Click here to Sell / Promote your Property Now</span>
              </button>
            </div>
          </div>



        </div>

      </div>
    </section>
  `;
}

export function initExploreSectionListeners() {
  document.querySelectorAll('.post-land-trigger-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const currentUser = getCurrentUser();
      if (currentUser) {
        window.location.href = '/user-dashboard.html';
      } else {
        window.location.href = '/login.html#register';
      }
    });
  });
}
