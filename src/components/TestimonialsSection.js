// src/components/TestimonialsSection.js - Luxury Google Reviews & Testimonials Marquee Component
import { getApprovedReviews, getGoogleSummary, addReview } from '../utils/reviewsStore.js';
import { showToast } from '../utils/toast.js';

function renderReviewCards(reviewsList) {
  return reviewsList.map(rev => {
    const firstLetter = (rev.name || rev.author_name || 'U').trim().charAt(0).toUpperCase();
    const displayName = rev.name || rev.author_name || 'Verified Client';
    const reviewQuote = rev.reviewText || rev.review_text || '';

    return `
      <div class="testimonial-card">
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <div style="color: #f59e0b; font-size: 1.05rem; display: flex; gap: 3px;">
              ${Array.from({ length: rev.rating || 5 }).map(() => '<i class="ri-star-fill"></i>').join('')}
            </div>
            <span style="
              display: inline-flex; align-items: center; gap: 6px;
              background: #f0fdf4; color: #166534; font-size: 0.76rem; font-weight: 800;
              padding: 4px 10px; border-radius: 12px; border: 1px solid #bbf7d0;
            ">
              <svg width="13" height="13" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google Review
            </span>
          </div>

          <p style="
            color: #334155; font-size: 0.94rem; line-height: 1.6; margin: 0;
            font-weight: 500; display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden;
          ">
            "${reviewQuote}"
          </p>
        </div>

        <div style="display: flex; align-items: center; gap: 12px; padding-top: 12px; border-top: 1px solid #f1f5f9; margin-top: 10px;">
          <div style="
            width: 40px; height: 40px; min-width: 40px; border-radius: 50%;
            background: ${rev.avatar_color || '#eb5e28'}; color: #ffffff;
            display: flex; align-items: center; justify-content: center;
            font-weight: 800; font-size: 1.05rem;
          ">
            ${firstLetter}
          </div>
          <div style="flex: 1; overflow: hidden;">
            <h4 style="margin: 0; font-size: 0.98rem; font-weight: 800; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
              ${displayName}
            </h4>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

export function renderTestimonialsSection() {
  const summary = getGoogleSummary();
  const reviews = getApprovedReviews();

  return `
    <section class="testimonials-section" id="google-reviews-section" style="
      padding: 90px 0 100px 0;
      background: linear-gradient(180deg, #faf8f5 0%, #ffffff 50%, #fdfbf7 100%);
      position: relative;
      overflow: hidden;
      border-top: 1px solid rgba(0,0,0,0.06);
      border-bottom: 1px solid rgba(0,0,0,0.06);
    ">
      
      <!-- Section Header -->
      <div class="container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px; text-align: center; margin-bottom: 48px;">
        <span class="badge badge-orange" style="font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 14px; display: inline-flex; align-items: center; gap: 6px;">
          <i class="ri-google-fill" style="color: #ea4335;"></i> GOOGLE VERIFIED CLIENT REVIEWS
        </span>
        <h2 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: clamp(2.2rem, 4vw, 3.2rem); color: #1a1a1a; margin-bottom: 16px; line-height: 1.2;">
          Real Customer Reviews from Google Maps
        </h2>
        <p style="font-size: 1.05rem; color: #555; max-width: 720px; margin: 0 auto 36px auto; line-height: 1.65;">
          Read genuine feedback from property buyers, plot purchasers, and villa investors who completed their transactions with Thanjai Property.
        </p>

        <!-- Google Business Rating Banner Card (Matching Google Profile) -->
        <div style="
          max-width: 680px; margin: 0 auto; background: #ffffff; padding: 28px 32px; border-radius: 22px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.05); border: 1px solid rgba(0,0,0,0.08);
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 20px; text-align: center;
        ">
          <div style="display: flex; align-items: center; justify-content: center; gap: 16px; flex-wrap: wrap;">
            <div style="
              width: 54px; height: 54px; border-radius: 14px; background: #f8fafc; border: 1px solid #e2e8f0;
              display: flex; align-items: center; justify-content: center; font-size: 1.8rem; box-shadow: 0 2px 8px rgba(0,0,0,0.04); flex-shrink: 0;
            ">
              <svg width="32" height="32" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
            </div>
            <div style="text-align: left;">
              <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 2rem; font-weight: 800; color: #1e293b; line-height: 1;">${summary.rating}</span>
                <div style="color: #f59e0b; font-size: 1.25rem; display: flex; gap: 2px;">
                  <i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i>
                </div>
              </div>
              <div style="font-size: 0.9rem; color: #64748b; font-weight: 600; margin-top: 3px;">
                Based on <strong style="color: #1e293b;">${summary.totalReviews}+ Verified Reviews</strong> on Google Business
              </div>
            </div>
          </div>

          <!-- Centered Action Buttons -->
          <div style="display: flex; justify-content: center; align-items: center; gap: 12px; flex-wrap: wrap; width: 100%;">
            <a href="${summary.googleReviewUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-primary" style="padding: 12px 24px; font-size: 0.92rem; border-radius: 12px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; background: var(--color-orange, #eb5e28); color: #fff; box-shadow: 0 4px 14px rgba(235,94,40,0.25);">
              <i class="ri-google-fill"></i>
              <span>Share a Google Review</span>
            </a>
            <button id="open-site-review-modal-btn" class="btn btn-outline-dark" style="padding: 12px 22px; font-size: 0.92rem; border-radius: 12px; display: inline-flex; align-items: center; gap: 8px; font-weight: 700; background: #fff; border: 1px solid #cbd5e1; color: #334155; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
              <i class="ri-edit-box-line"></i>
              <span>Write a Feedback</span>
            </button>
          </div>
        </div>
      </div>

      <!-- AUTO-SCROLLING MARQUEE TRACK (100% SEAMLESS INFINITE TICKER) -->
      <div class="testimonials-marquee-wrapper" style="width: 100%; position: relative; overflow: hidden; padding: 12px 0;">
        <div class="testimonials-marquee-track">
          <div class="testimonials-marquee-group">
            ${renderReviewCards(reviews)}
          </div>
          <div class="testimonials-marquee-group" aria-hidden="true">
            ${renderReviewCards(reviews)}
          </div>
        </div>
      </div>

      <!-- INLINE USER SUBMISSION MODAL (CLEAN 1-5 STARS, NAME & COMMENTS) -->
      <div id="site-review-modal-overlay" style="
        display: none; position: fixed; inset: 0; z-index: 9999999;
        background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px);
        align-items: center; justify-content: center; padding: 20px;
      ">
        <div style="
          background: #ffffff; width: 100%; max-width: 480px; border-radius: 22px;
          padding: 32px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.3); position: relative;
        ">
          <button id="close-site-review-modal-btn" style="
            position: absolute; top: 18px; right: 18px; background: #f1f5f9; border: none;
            width: 36px; height: 36px; border-radius: 50%; font-size: 1.2rem; cursor: pointer;
            display: flex; align-items: center; justify-content: center; color: #64748b;
          "><i class="ri-close-line"></i></button>

          <h3 style="font-family: var(--font-serif, 'DM Serif Display', serif); font-size: 1.5rem; color: #1e293b; margin-bottom: 6px;">
            Write Your Feedback
          </h3>
          <p style="font-size: 0.88rem; color: #64748b; margin-bottom: 22px;">
            Share your experience with Thanjai Property.
          </p>

          <form id="site-review-form" style="display: flex; flex-direction: column; gap: 18px;">
            
            <!-- 1 to 5 Clickable Stars Rating -->
            <div style="background: #fafaf9; padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; text-align: center;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Select Rating (1 to 5 Stars) *</label>
              <div id="site-form-stars-picker" style="display: inline-flex; gap: 8px; font-size: 1.9rem; color: #cbd5e1; cursor: pointer;">
                <i class="ri-star-fill site-star-item" data-value="1" style="color: #f59e0b;"></i>
                <i class="ri-star-fill site-star-item" data-value="2" style="color: #f59e0b;"></i>
                <i class="ri-star-fill site-star-item" data-value="3" style="color: #f59e0b;"></i>
                <i class="ri-star-fill site-star-item" data-value="4" style="color: #f59e0b;"></i>
                <i class="ri-star-fill site-star-item" data-value="5" style="color: #f59e0b;"></i>
              </div>
              <input type="hidden" id="rev-rating-input" value="5" />
            </div>

            <!-- Name Input -->
            <div>
              <label style="display: block; font-size: 0.84rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Your Name *</label>
              <input type="text" id="rev-name-input" required placeholder="e.g. Vicky Selvam" style="width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box; font-size: 0.95rem;" />
            </div>

            <!-- Review / Comments Textarea -->
            <div>
              <label style="display: block; font-size: 0.84rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Your Comments & Review *</label>
              <textarea id="rev-text-input" required rows="4" placeholder="Tell us about your experience with Thanjai Property..." style="width: 100%; padding: 11px 14px; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box; font-size: 0.95rem; resize: vertical;"></textarea>
            </div>

            <button type="submit" class="btn btn-primary" style="padding: 13px; font-size: 0.95rem; border-radius: 10px; margin-top: 4px; background: var(--color-orange, #eb5e28); color: #fff; border: none; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(235,94,40,0.25);">
              <span>Submit Feedback</span>
            </button>
          </form>
        </div>
      </div>

    </section>
  `;
}

export function initTestimonialsListeners() {
  const modalOverlay = document.getElementById('site-review-modal-overlay');
  const openModalBtn = document.getElementById('open-site-review-modal-btn');
  const closeModalBtn = document.getElementById('close-site-review-modal-btn');
  const reviewForm = document.getElementById('site-review-form');

  const starsPicker = document.getElementById('site-form-stars-picker');
  const ratingInput = document.getElementById('rev-rating-input');

  // Star selector helper
  function setStarRating(val) {
    if (ratingInput) ratingInput.value = val;
    if (starsPicker) {
      starsPicker.querySelectorAll('.site-star-item').forEach(star => {
        const starVal = parseInt(star.dataset.value, 10);
        if (starVal <= val) {
          star.style.color = '#f59e0b';
        } else {
          star.style.color = '#cbd5e1';
        }
      });
    }
  }

  starsPicker?.querySelectorAll('.site-star-item').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value, 10) || 5;
      setStarRating(val);
    });
  });

  if (openModalBtn && modalOverlay) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      setStarRating(5);
      modalOverlay.style.display = 'flex';
    });
  }

  if (closeModalBtn && modalOverlay) {
    closeModalBtn.addEventListener('click', () => {
      modalOverlay.style.display = 'none';
    });
  }

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    });
  }

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const author_name = document.getElementById('rev-name-input')?.value.trim();
      const rating = parseInt(document.getElementById('rev-rating-input')?.value || '5', 10);
      const review_text = document.getElementById('rev-text-input')?.value.trim();

      if (!author_name || !review_text) {
        showToast('Please enter your name and review message.', 'ri-error-warning-line');
        return;
      }

      await addReview({
        name: author_name,
        author_name,
        rating,
        reviewText: review_text,
        review_text: review_text,
        source: 'Website',
        verified_google: true,
        status: 'Approved',
        time_ago: 'Just now'
      });

      showToast('Thank you! Your feedback has been published.', 'ri-checkbox-circle-fill');
      if (modalOverlay) modalOverlay.style.display = 'none';
      reviewForm.reset();
      setStarRating(5);
    });
  }
}
