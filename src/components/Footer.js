import { getSiteImage } from '../utils/siteImagesStore.js';

export function renderFooter() {
  const brandLogo = getSiteImage('brand_logo');
  return `
    <footer class="footer-section">
      <div class="container">
        <div class="footer-grid">
          
          <!-- Col 1: ABOUT THANJAI PROPERTY -->
          <div>
            <h4 class="footer-col-title">ABOUT THANJAI PROPERTY</h4>
            
            <a href="/" class="footer-logo nav-route-link" data-route="home" style="display: inline-block; margin-bottom: 18px;">
              <img src="${brandLogo}" alt="Thanjai Property Logo" style="height: 64px; max-width: 100%; width: auto; background: #ffffff; border-radius: 10px; padding: 6px 14px; display: block; box-shadow: 0 4px 12px rgba(0,0,0,0.15);" />
            </a>

            <p style="color: rgba(255, 255, 255, 0.78); font-size: 0.92rem; line-height: 1.75; margin-bottom: 16px;">
              Thanjai Property is a leading real estate consultancy and land promoter in Thanjavur, helping you buy, sell, and rent residential, agricultural, and commercial properties across Tamil Nadu. Explore handpicked properties across Tamil Nadu. Find houses, villas, plots, farmlands, and commercial spaces with verified prices, clear sizes, and exact locations.
            </p>

          </div>

          <!-- Col 2: OUR OFFICE -->
          <div>
            <h4 class="footer-col-title">OUR OFFICE</h4>
            
            <div style="color: var(--color-orange, #eb5e28); font-weight: 700; font-size: 0.95rem; margin-bottom: 12px; text-transform: uppercase;">
              THANJAI PROPERTY
            </div>

            <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.9375rem; color: rgba(255, 255, 255, 0.7); line-height: 1.6;">
              <span>Flat No B1, 2nd Floor, Sivasakthi Apartment,</span>
              <span>Raja Nagar, Behind HDFC Bank, Near New Bus Stand,</span>
              <span>Thanjavur - 613005</span>
            </div>
          </div>

          <!-- Col 3: OVERVIEW -->
          <div>
            <h4 class="footer-col-title">OVERVIEW</h4>
            <ul class="footer-links-list">
              <li><a href="/our-story" class="nav-route-link" data-route="our-story">Our Story</a></li>
              <li><a href="/find-your-property" class="nav-route-link" data-route="discover">Find Your Property</a></li>
              <li><a href="/blog" class="nav-route-link" data-route="blog">Blog</a></li>
              <li><a href="/contact-us" class="nav-route-link" data-route="contact-us">Contact Us</a></li>
              <li><a href="/privacy-policy" class="nav-route-link" data-route="privacy">Privacy Policy</a></li>
              <li><a href="/terms-of-use" class="nav-route-link" data-route="terms">Terms of Use</a></li>
            </ul>
          </div>

          <!-- Col 4: OUR SOCIAL MEDIA -->
          <div>
            <h4 class="footer-col-title">OUR SOCIAL MEDIA</h4>
            <ul class="footer-social-list">
              <li>
                <a href="https://www.facebook.com/profile.php?id=100063582174179" target="_blank" rel="noopener noreferrer" class="social-link" title="Follow Thanjai Property on Facebook">
                  <i class="ri-facebook-fill"></i> Facebook
                </a>
              </li>
              <li>
                <a href="https://x.com/thanjaiproperty" target="_blank" rel="noopener noreferrer" class="social-link" title="Follow Thanjai Property on X (Twitter)">
                  <i class="ri-twitter-x-fill"></i> Twitter (X)
                </a>
              </li>
              <li>
                <a href="https://www.youtube.com/channel/UCfAePuCC2OaNrgVT8Ix5xww?view_as=subscriber" target="_blank" rel="noopener noreferrer" class="social-link" title="Subscribe to Thanjai Property YouTube Channel">
                  <i class="ri-youtube-fill"></i> YouTube
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/thanjai-property-9812422b/" target="_blank" rel="noopener noreferrer" class="social-link" title="Connect with Thanjai Property on LinkedIn">
                  <i class="ri-linkedin-fill"></i> LinkedIn
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div class="footer-bottom">
          <div>© 2009–2026 Thanjai Property Real Estate. All rights reserved.</div>
        </div>
      </div>
    </footer>
  `;
}
