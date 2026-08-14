export function renderFooter() {
  return `
    <footer class="footer-section">
      <div class="container">
        <div class="footer-grid">
          <!-- Col 1: Brand & Philosophy -->
          <div class="footer-brand">
            <a href="#" class="footer-logo">
              <img src="/thanjai-official-new.png" alt="Thanjai Property Real Estate Since 2009" style="height: 60px; width: auto; background: #fff; border-radius: 8px; padding: 4px 8px; display: block;" />
            </a>

            <p style="color: rgba(255, 255, 255, 0.7); font-size: 0.9375rem; line-height: 1.6; max-width: 340px; margin-bottom: 24px;">
              Tamil Nadu's premier luxury property discovery platform. Connecting families and investors with verified homes, villa plots, and Kaveri farm estates.
            </p>

            <div style="display: flex; gap: 12px;">
              <a href="#" style="width: 38px; height: 38px; border-radius: 50%; background: var(--color-dark-surface); border: 1px solid var(--color-border-dark); display: flex; align-items: center; justify-content: center; color: var(--color-white);"><i class="ri-facebook-fill"></i></a>
              <a href="#" style="width: 38px; height: 38px; border-radius: 50%; background: var(--color-dark-surface); border: 1px solid var(--color-border-dark); display: flex; align-items: center; justify-content: center; color: var(--color-white);"><i class="ri-instagram-line"></i></a>
              <a href="#" style="width: 38px; height: 38px; border-radius: 50%; background: var(--color-dark-surface); border: 1px solid var(--color-border-dark); display: flex; align-items: center; justify-content: center; color: var(--color-white);"><i class="ri-youtube-fill"></i></a>
              <a href="#" style="width: 38px; height: 38px; border-radius: 50%; background: var(--color-dark-surface); border: 1px solid var(--color-border-dark); display: flex; align-items: center; justify-content: center; color: var(--color-white);"><i class="ri-whatsapp-line"></i></a>
            </div>
          </div>

          <!-- Col 2: Quick Links -->
          <div>
            <h4 class="font-serif" style="font-size: 1.25rem; color: var(--color-white); margin-bottom: 20px;">Quick Links</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9375rem; color: rgba(255,255,255,0.7);">
              <li><a href="#hero" style="transition: color 0.2s;">Home Experience</a></li>
              <li><a href="#explore" style="transition: color 0.2s;">Featured Properties</a></li>
              <li><a href="#discovery" style="transition: color 0.2s;">Property Discovery</a></li>
              <li><a href="#locations" style="transition: color 0.2s;">Tamil Nadu Locations</a></li>
              <li><a href="#agents" style="transition: color 0.2s;">Real Estate Advisors</a></li>
              <li><a href="#post-cta" style="transition: color 0.2s;">Post Your Property</a></li>
            </ul>
          </div>

          <!-- Col 3: Categories -->
          <div>
            <h4 class="font-serif" style="font-size: 1.25rem; color: var(--color-white); margin-bottom: 20px;">Asset Classes</h4>
            <ul style="list-style: none; display: flex; flex-direction: column; gap: 12px; font-size: 0.9375rem; color: rgba(255,255,255,0.7);">
              <li><a href="#discovery">Luxury Villas</a></li>
              <li><a href="#discovery">Independent Houses</a></li>
              <li><a href="#discovery">Modern Apartments</a></li>
              <li><a href="#discovery">DTCP Villa Plots</a></li>
              <li><a href="#discovery">Kaveri Farmlands</a></li>
              <li><a href="#discovery">Commercial Spaces</a></li>
            </ul>
          </div>

          <!-- Col 4: Head Office Info -->
          <div>
            <h4 class="font-serif" style="font-size: 1.25rem; color: var(--color-white); margin-bottom: 20px;">Head Office</h4>
            <div style="display: flex; flex-direction: column; gap: 14px; font-size: 0.875rem; color: rgba(255,255,255,0.75);">
              <div style="display: flex; gap: 10px;">
                <i class="ri-map-pin-2-fill" style="color: var(--color-orange); font-size: 1.1rem;"></i>
                <span>Medical College Road, Opposite New Bus Stand, Thanjavur, Tamil Nadu 613007</span>
              </div>
              <div style="display: flex; gap: 10px;">
                <i class="ri-phone-fill" style="color: var(--color-orange); font-size: 1.1rem;"></i>
                <span>+91 94431 25009 / +91 94431 89000</span>
              </div>
              <div style="display: flex; gap: 10px;">
                <i class="ri-mail-fill" style="color: var(--color-orange); font-size: 1.1rem;"></i>
                <span>info@thanjaiproperty.com</span>
              </div>
              <div style="display: flex; gap: 10px;">
                <i class="ri-time-fill" style="color: var(--color-orange); font-size: 1.1rem;"></i>
                <span>Mon – Sat: 9:00 AM – 8:00 PM</span>
              </div>
            </div>
          </div>
        </div>

        <div class="footer-bottom">
          <div>© 2009–2026 Thanjai Property Real Estate. All rights reserved.</div>
          <div style="display: flex; gap: 20px;">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">RERA Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  `;
}
