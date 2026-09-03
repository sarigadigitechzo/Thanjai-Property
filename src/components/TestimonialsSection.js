import { getApprovedReviews } from '../utils/reviewsStore.js';

export function renderTestimonialsSection() {
  const reviews = getApprovedReviews();
  if (!reviews || reviews.length === 0) return '';

  // Duplicate the reviews array to ensure seamless infinite looping marquee
  const displayReviews = [...reviews, ...reviews, ...reviews];

  return `
    <section class="testimonials-section" style="
      padding: 90px 24px; background: linear-gradient(180deg, #fdfbf7 0%, #f7f4ed 100%);
      position: relative; overflow: hidden; border-top: 1px solid #ebe5d8; border-bottom: 1px solid #ebe5d8;
    ">
      
      <!-- Background Ambient Glow -->
      <div style="
        position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 800px; height: 350px;
        background: radial-gradient(circle, rgba(235,94,40,0.06) 0%, rgba(255,255,255,0) 70%);
        pointer-events: none; z-index: 0;
      "></div>

      <div style="max-width: 1280px; margin: 0 auto; position: relative; z-index: 1;">
        
        <!-- Header & Google Rating Summary -->
        <div style="text-align: center; max-width: 760px; margin: 0 auto 50px auto;">
          
          <!-- Google Badge Pill -->
          <div style="
            display: inline-flex; align-items: center; gap: 8px; padding: 8px 18px; border-radius: 50px;
            background: #ffffff; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04);
            margin-bottom: 18px;
          ">
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span style="font-size: 0.88rem; font-weight: 700; color: #1a202c;">Google Customer Reviews</span>
            <div style="display: flex; gap: 2px; color: #f6ad55; font-size: 0.95rem;">
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
              <i class="ri-star-fill"></i>
            </div>
            <span style="font-size: 0.85rem; font-weight: 800; color: #2d3748;">4.9 / 5.0</span>
          </div>

          <h2 style="
            font-family: var(--font-display, 'DM Serif Display', Georgia, serif);
            font-size: clamp(2rem, 3.5vw, 2.6rem); font-weight: 400; color: #1a202c; line-height: 1.2; margin: 0 0 14px 0;
          ">
            Trusted by 500+ Property Buyers & Families
          </h2>
          <p style="font-size: 1.02rem; color: #718096; line-height: 1.6; margin: 0;">
            Discover genuine experiences from property buyers, NRI investors, and homeowners across Thanjavur and Tamil Nadu.
          </p>

          <!-- Action Triggers: Write a Review & Review on Google -->
          <div style="display: flex; align-items: center; justify-content: center; gap: 14px; margin-top: 24px; flex-wrap: wrap;">
            <button id="open-write-review-modal-btn" style="
              display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 50px;
              background: var(--color-orange, #eb5e28); color: #ffffff; border: none; font-weight: 700;
              font-size: 0.92rem; cursor: pointer; box-shadow: 0 6px 18px rgba(235,94,40,0.28);
              transition: all 0.25s ease;
            " onmouseover="this.style.transform='translateY(-2px)'" onmouseout="this.style.transform='translateY(0)'">
              <i class="ri-edit-line"></i>
              <span>Write a Review</span>
            </button>

            <a href="https://maps.google.com/?q=Thanjavur+Property" target="_blank" rel="noopener noreferrer" style="
              display: inline-flex; align-items: center; gap: 8px; padding: 11px 22px; border-radius: 50px;
              background: #ffffff; color: #2d3748; border: 1px solid #cbd5e0; font-weight: 700;
              font-size: 0.92rem; text-decoration: none; cursor: pointer; box-shadow: 0 3px 10px rgba(0,0,0,0.03);
              transition: all 0.25s ease;
            " onmouseover="this.style.borderColor='#4285F4'; this.style.color='#4285F4';" onmouseout="this.style.borderColor='#cbd5e0'; this.style.color='#2d3748';">
              <i class="ri-google-fill" style="color: #4285F4;"></i>
              <span>Review on Google</span>
            </a>
          </div>
        </div>

      </div>

      <!-- AUTO-SCROLLING MARQUEE TRACK -->
      <div class="testimonials-marquee-wrapper" style="width: 100%; overflow: hidden; position: relative; padding: 10px 0;">
        
        <!-- Left & Right Gradient Shadows for seamless fade -->
        <div style="position: absolute; left: 0; top: 0; bottom: 0; width: 100px; background: linear-gradient(90deg, #fdfbf7 0%, transparent 100%); z-index: 2; pointer-events: none;"></div>
        <div style="position: absolute; right: 0; top: 0; bottom: 0; width: 100px; background: linear-gradient(270deg, #fdfbf7 0%, transparent 100%); z-index: 2; pointer-events: none;"></div>

        <div class="testimonials-marquee-track">
          ${displayReviews.map((rev, idx) => `
            <div class="testimonial-card" style="
              width: 360px; min-width: 360px; background: #ffffff; border-radius: 18px; padding: 26px;
              border: 1px solid #ebe5d8; box-shadow: 0 8px 24px rgba(0,0,0,0.04); display: flex; flex-direction: column;
              justify-content: space-between; position: relative; transition: all 0.3s ease; flex-shrink: 0;
            ">
              <!-- Top Row: User Avatar, Name & Google Logo -->
              <div>
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    ${rev.avatar ? `
                      <img src="${rev.avatar}" alt="${rev.name}" style="width: 46px; height: 46px; border-radius: 50%; object-fit: cover; border: 2px solid #fff; box-shadow: 0 2px 8px rgba(0,0,0,0.1);" />
                    ` : `
                      <div style="
                        width: 46px; height: 46px; border-radius: 50%; background: #eb5e28; color: #fff;
                        display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem;
                      ">
                        ${rev.name.charAt(0).toUpperCase()}
                      </div>
                    `}
                    <div>
                      <div style="font-weight: 700; color: #1a202c; font-size: 0.96rem; line-height: 1.2;">${rev.name}</div>
                      <div style="font-size: 0.78rem; color: #718096; display: flex; align-items: center; gap: 4px; margin-top: 2px;">
                        <i class="ri-checkbox-circle-fill" style="color: #38a169; font-size: 0.85rem;"></i>
                        <span>Verified Client</span>
                      </div>
                    </div>
                  </div>

                  <!-- Google / Source Badge -->
                  <div style="
                    width: 30px; height: 30px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center;
                  " title="Verified review on ${rev.source}">
                    ${rev.source === 'Google' ? `
                      <svg width="16" height="16" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                      </svg>
                    ` : `
                      <i class="ri-shield-check-fill" style="color: #eb5e28; font-size: 1rem;"></i>
                    `}
                  </div>
                </div>

                <!-- Stars Rating -->
                <div style="display: flex; gap: 3px; color: #f6ad55; font-size: 1rem; margin-bottom: 12px;">
                  ${Array(rev.rating || 5).fill('<i class="ri-star-fill"></i>').join('')}
                </div>

                <!-- Review Content -->
                <p style="
                  font-size: 0.92rem; color: #4a5568; line-height: 1.6; margin: 0 0 16px 0;
                  font-style: normal; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
                ">
                  "${rev.reviewText}"
                </p>
              </div>

              <!-- Bottom Row: Property / Location Tag & Date -->
              <div style="border-top: 1px solid #f1f5f9; padding-top: 12px; display: flex; align-items: center; justify-content: space-between; font-size: 0.78rem; color: #94a3b8;">
                <span style="font-weight: 600; color: #64748b; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                  ${rev.propertyType || rev.location || 'Thanjavur Property'}
                </span>
                <span>${rev.createdAt ? rev.createdAt.split(' ')[0] : 'Recent'}</span>
              </div>
            </div>
          `).join('')}
        </div>
      </div>

    </section>
  `;
}
