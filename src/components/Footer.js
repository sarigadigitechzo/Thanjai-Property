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
            
            <a href="/" class="footer-logo nav-route-link" data-route="home" style="display: block; margin-bottom: 16px;">
              <img src="${brandLogo}" alt="Thanjai Property Logo" style="height: 50px; width: auto; background: #fff; border-radius: 8px; padding: 4px 8px;" />
            </a>

            <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9375rem; line-height: 1.8; margin-bottom: 16px;">
              Thanjai property Real Estate Land Promoters and Constructions in Thanjavur to buy sale and house land plot commercial industrial apartment
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
              <li><a href="/discover-properties" class="nav-route-link" data-route="discover">Discover Properties</a></li>
              <li><a href="/blog" class="nav-route-link" data-route="blog">Blog</a></li>
              <li><a href="/contact-us" class="nav-route-link" data-route="contact-us">Contact Us</a></li>
              <li><a href="/terms#term-privacy" class="nav-route-link" data-route="terms">Privacy Policy</a></li>
              <li><a href="/terms#term-agreement" class="nav-route-link" data-route="terms">Terms of Use</a></li>
            </ul>
          </div>

          <!-- Col 4: OUR SOCIAL MEDIA -->
          <div>
            <h4 class="footer-col-title">OUR SOCIAL MEDIA</h4>
            <ul class="footer-social-list">
              <li>
                <a href="#" class="social-link">
                  <i class="ri-facebook-fill"></i> Facebook
                </a>
              </li>
              <li>
                <a href="#" class="social-link">
                  <i class="ri-twitter-fill"></i> Twitter
                </a>
              </li>
              <li>
                <a href="#" class="social-link">
                  <i class="ri-google-fill"></i> Google Plus
                </a>
              </li>
              <li>
                <a href="#" class="social-link">
                  <i class="ri-youtube-fill"></i> Youtube
                </a>
              </li>
              <li>
                <a href="#" class="social-link">
                  <i class="ri-linkedin-fill"></i> Linkedin
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
