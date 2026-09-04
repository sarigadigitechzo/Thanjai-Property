// src/crm-views/ReviewsView.js - Luxury Google Reviews & Testimonials CRM Module
import { getReviews, addReview, updateReview, deleteReview, toggleReviewStatus } from '../utils/reviewsStore.js';
import { showToast } from '../utils/toast.js';

let activeFilter = 'all';

export function renderReviewsView() {
  const allReviews = getReviews();
  
  const googleCount = allReviews.filter(r => r.source === 'Google' || r.source === 'Google / Website').length;
  const webCount = allReviews.filter(r => r.source === 'Website').length;
  const approvedCount = allReviews.filter(r => r.status === 'Approved').length;
  const avgRating = allReviews.length > 0 
    ? (allReviews.reduce((sum, r) => sum + (r.rating || 5), 0) / allReviews.length).toFixed(1)
    : '4.6';

  const filteredReviews = allReviews.filter(r => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'google') return r.source === 'Google' || r.source === 'Google / Website';
    if (activeFilter === 'website') return r.source === 'Website';
    if (activeFilter === 'whatsapp') return r.source === 'WhatsApp';
    if (activeFilter === 'hidden') return r.status === 'Hidden';
    return true;
  });

  return `
    <div class="view-enter reviews-management-container" style="padding-bottom: 60px;">
      
      <!-- Top Action & Title Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 4px;">
            <div style="
              width: 44px; height: 44px; border-radius: 12px; background: rgba(66, 133, 244, 0.12);
              color: #4285F4; display: flex; align-items: center; justify-content: center; font-size: 1.4rem;
            ">
              <i class="ri-google-fill"></i>
            </div>
            <div>
              <h1 style="font-size: 1.6rem; font-weight: 700; color: #1a202c; margin: 0;">Google Reviews & Testimonials</h1>
              <p style="font-size: 0.88rem; color: #718096; margin: 2px 0 0 0;">Manage customer ratings, add Google reviews manually, and moderate website testimonials</p>
            </div>
          </div>
        </div>

        <button id="open-add-review-admin-btn" type="button" onclick="if(window.openAdminAddReviewModal) window.openAdminAddReviewModal();" style="
          display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px;
          background: #4285F4; color: #ffffff; border: none; font-weight: 700; font-size: 0.95rem;
          cursor: pointer; box-shadow: 0 4px 14px rgba(66, 133, 244, 0.35); transition: all 0.2s;
        ">
          <i class="ri-add-line" style="font-size: 1.2rem;"></i>
          <span>Add Google / Client Review</span>
        </button>
      </div>

      <!-- KPI Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 28px;">
        <div style="background: #ffffff; padding: 18px 22px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="font-size: 0.78rem; font-weight: 700; color: #718096; text-transform: uppercase;">Average Rating</div>
          <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
            <span style="font-size: 1.8rem; font-weight: 800; color: #1a202c;">${avgRating}</span>
            <div style="color: #f59e0b; font-size: 1.1rem;"><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-fill"></i><i class="ri-star-half-fill"></i></div>
          </div>
        </div>

        <div style="background: #ffffff; padding: 18px 22px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="font-size: 0.78rem; font-weight: 700; color: #718096; text-transform: uppercase;">Total Testimonials</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #1a202c; margin-top: 4px;">${allReviews.length}</div>
        </div>

        <div style="background: #ffffff; padding: 18px 22px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="font-size: 0.78rem; font-weight: 700; color: #718096; text-transform: uppercase;">Google Verified</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #4285F4; margin-top: 4px;">${googleCount}</div>
        </div>

        <div style="background: #ffffff; padding: 18px 22px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
          <div style="font-size: 0.78rem; font-weight: 700; color: #718096; text-transform: uppercase;">Website Submissions</div>
          <div style="font-size: 1.8rem; font-weight: 800; color: #eb5e28; margin-top: 4px;">${webCount}</div>
        </div>
      </div>

      <!-- Filter Tabs -->
      <div style="display: flex; gap: 10px; margin-bottom: 20px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px; overflow-x: auto;">
        <button class="review-tab-btn ${activeFilter === 'all' ? 'active' : ''}" data-filter="all" style="
          padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: none;
          background: ${activeFilter === 'all' ? '#1a202c' : '#f1f5f9'}; color: ${activeFilter === 'all' ? '#ffffff' : '#64748b'};
        ">All Reviews (${allReviews.length})</button>

        <button class="review-tab-btn ${activeFilter === 'google' ? 'active' : ''}" data-filter="google" style="
          padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: none;
          background: ${activeFilter === 'google' ? '#4285F4' : '#f1f5f9'}; color: ${activeFilter === 'google' ? '#ffffff' : '#64748b'};
        ">Google Reviews (${googleCount})</button>

        <button class="review-tab-btn ${activeFilter === 'website' ? 'active' : ''}" data-filter="website" style="
          padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: none;
          background: ${activeFilter === 'website' ? '#eb5e28' : '#f1f5f9'}; color: ${activeFilter === 'website' ? '#ffffff' : '#64748b'};
        ">Website Forms (${webCount})</button>

        <button class="review-tab-btn ${activeFilter === 'hidden' ? 'active' : ''}" data-filter="hidden" style="
          padding: 8px 18px; border-radius: 8px; font-weight: 700; font-size: 0.88rem; cursor: pointer; border: none;
          background: ${activeFilter === 'hidden' ? '#64748b' : '#f1f5f9'}; color: ${activeFilter === 'hidden' ? '#ffffff' : '#64748b'};
        ">Hidden / Inactive</button>
      </div>

      <!-- Reviews Grid -->
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;">
        ${filteredReviews.map(rev => {
          const firstLetter = (rev.name || rev.author_name || 'U').trim().charAt(0).toUpperCase();
          const displayName = rev.name || rev.author_name || 'Verified Client';
          const reviewQuote = rev.reviewText || rev.review_text || '';

          return `
            <div style="
              background: #ffffff; border-radius: 18px; border: 1px solid #e2e8f0; padding: 22px;
              box-shadow: 0 4px 16px rgba(0,0,0,0.03); display: flex; flex-direction: column; justify-content: space-between;
            ">
              <div>
                <!-- Top Row: 1-Letter Avatar, Name, Source -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px;">
                  <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                      width: 44px; height: 44px; border-radius: 50%; background: ${rev.avatar_color || '#4285F4'}; color: #fff;
                      display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.15rem;
                    ">
                      ${firstLetter}
                    </div>
                    <div>
                      <div style="font-weight: 700; color: #1a202c; font-size: 1rem;">${displayName}</div>
                    </div>
                  </div>

                  <span style="
                    padding: 4px 10px; border-radius: 20px; font-size: 0.72rem; font-weight: 800; text-transform: uppercase;
                    background: ${rev.source === 'Google' || rev.source === 'Google / Website' ? 'rgba(66, 133, 244, 0.12)' : 'rgba(235, 94, 40, 0.12)'};
                    color: ${rev.source === 'Google' || rev.source === 'Google / Website' ? '#4285F4' : '#eb5e28'};
                  ">
                    ${rev.source || 'Google'}
                  </span>
                </div>

                <!-- Rating -->
                <div style="display: flex; gap: 2px; color: #f59e0b; font-size: 1rem; margin-bottom: 12px;">
                  ${Array(rev.rating || 5).fill('<i class="ri-star-fill"></i>').join('')}
                </div>

                <!-- Review Text -->
                <p style="font-size: 0.92rem; color: #4a5568; line-height: 1.6; margin: 0 0 16px 0;">
                  "${reviewQuote}"
                </p>
              </div>

              <!-- Footer: Status & Action Buttons -->
              <div style="border-top: 1px solid #f1f5f9; padding-top: 14px; display: flex; align-items: center; justify-content: space-between;">
                <span style="
                  padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 700;
                  background: ${rev.status === 'Approved' ? '#f0fdf4' : '#fef2f2'};
                  color: ${rev.status === 'Approved' ? '#16a34a' : '#ef4444'};
                ">
                  ${rev.status === 'Approved' ? '● Published Live' : '○ Hidden'}
                </span>

                <div style="display: flex; align-items: center; gap: 8px;">
                  <button class="edit-review-btn" data-id="${rev.id}" onclick="if(window.openAdminEditReviewModal) window.openAdminEditReviewModal('${rev.id}');" style="
                    padding: 6px 14px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff;
                    color: #2563eb; font-size: 0.82rem; font-weight: 700; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
                  ">
                    <i class="ri-edit-line"></i> Edit
                  </button>

                  <button class="toggle-status-review-btn" data-id="${rev.id}" style="
                    padding: 6px 12px; border-radius: 8px; border: 1px solid #cbd5e1; background: #fff;
                    color: #475569; font-size: 0.8rem; font-weight: 600; cursor: pointer;
                  ">
                    ${rev.status === 'Approved' ? 'Hide' : 'Publish'}
                  </button>

                  <button class="delete-review-btn" data-id="${rev.id}" style="
                    padding: 6px 10px; border-radius: 8px; border: 1px solid #fee2e2; background: #fff;
                    color: #ef4444; font-size: 0.85rem; cursor: pointer;
                  " title="Delete Review">
                    <i class="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- Add Manual Review Modal (Admin) -->
      <div id="admin-add-review-modal" style="
        position: fixed; inset: 0; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        z-index: 9999999; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;
      ">
        <div style="
          background: #ffffff; border-radius: 22px; max-width: 500px; width: 100%; max-height: 90vh;
          overflow-y: auto; padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); position: relative; box-sizing: border-box;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="font-size: 1.35rem; font-weight: 700; color: #1a202c; margin: 0;">Add Google / Client Review</h3>
            <button id="close-admin-review-modal-btn" type="button" onclick="if(window.closeAdminAddReviewModal) window.closeAdminAddReviewModal();" style="background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;">
              <i class="ri-close-line"></i>
            </button>
          </div>

          <form id="admin-add-review-form" style="display: flex; flex-direction: column; gap: 16px;">
            
            <!-- 1 to 5 Clickable Stars Rating -->
            <div style="background: #fafaf9; padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; text-align: center;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Select Rating (1 to 5 Stars) *</label>
              <div id="admin-add-stars-picker" style="display: inline-flex; gap: 8px; font-size: 1.9rem; color: #cbd5e1; cursor: pointer;">
                <i class="ri-star-fill admin-add-star" data-value="1" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-add-star" data-value="2" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-add-star" data-value="3" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-add-star" data-value="4" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-add-star" data-value="5" style="color: #f59e0b;"></i>
              </div>
              <input type="hidden" id="admin-rev-rating" value="5" />
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Client Name *</label>
              <input type="text" id="admin-rev-name" required placeholder="e.g. Ramesh Kumar" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Review Source</label>
              <select id="admin-rev-source" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; box-sizing: border-box;">
                <option value="Google" selected>Google Review</option>
                <option value="WhatsApp">WhatsApp Feedback</option>
                <option value="Website">Website Form</option>
                <option value="In-Person">In-Person Client</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Review Comments & Feedback *</label>
              <textarea id="admin-rev-text" required rows="4" placeholder="Paste the client review text here..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px;">
              <button type="button" id="cancel-admin-rev-btn" onclick="if(window.closeAdminAddReviewModal) window.closeAdminAddReviewModal();" style="padding: 11px 18px; border-radius: 10px; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-weight: 600; cursor: pointer;">Cancel</button>
              <button type="submit" style="padding: 11px 24px; border-radius: 10px; background: #4285F4; color: #fff; border: none; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(66, 133, 244, 0.3);">Save & Publish</button>
            </div>
          </form>
        </div>
      </div>

      <!-- Edit Review Modal (Admin) -->
      <div id="admin-edit-review-modal" style="
        position: fixed; inset: 0; top: 0; left: 0; width: 100vw; height: 100vh;
        background: rgba(15, 23, 42, 0.75); backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
        z-index: 9999999; display: none; align-items: center; justify-content: center; padding: 20px; box-sizing: border-box;
      ">
        <div style="
          background: #ffffff; border-radius: 22px; max-width: 500px; width: 100%; max-height: 90vh;
          overflow-y: auto; padding: 30px; box-shadow: 0 25px 50px rgba(0,0,0,0.3); position: relative; box-sizing: border-box;
        ">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px;">
            <h3 style="font-size: 1.35rem; font-weight: 700; color: #1a202c; margin: 0;">Edit Review Details</h3>
            <button id="close-admin-edit-review-modal-btn" type="button" onclick="if(window.closeAdminEditReviewModal) window.closeAdminEditReviewModal();" style="background: #f1f5f9; border: none; width: 34px; height: 34px; border-radius: 50%; font-size: 1.2rem; cursor: pointer; color: #64748b; display: flex; align-items: center; justify-content: center;">
              <i class="ri-close-line"></i>
            </button>
          </div>

          <form id="admin-edit-review-form" style="display: flex; flex-direction: column; gap: 16px;">
            <input type="hidden" id="admin-edit-rev-id" />
            
            <!-- 1 to 5 Clickable Stars Rating -->
            <div style="background: #fafaf9; padding: 14px 18px; border-radius: 14px; border: 1px solid #e2e8f0; text-align: center;">
              <label style="display: block; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 6px;">Select Rating (1 to 5 Stars) *</label>
              <div id="admin-edit-stars-picker" style="display: inline-flex; gap: 8px; font-size: 1.9rem; color: #cbd5e1; cursor: pointer;">
                <i class="ri-star-fill admin-edit-star" data-value="1" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-edit-star" data-value="2" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-edit-star" data-value="3" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-edit-star" data-value="4" style="color: #f59e0b;"></i>
                <i class="ri-star-fill admin-edit-star" data-value="5" style="color: #f59e0b;"></i>
              </div>
              <input type="hidden" id="admin-edit-rev-rating" value="5" />
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Client Name *</label>
              <input type="text" id="admin-edit-rev-name" required placeholder="e.g. Ramesh Kumar" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box;" />
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Review Source</label>
              <select id="admin-edit-rev-source" style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; background: #fff; box-sizing: border-box;">
                <option value="Google">Google Review</option>
                <option value="WhatsApp">WhatsApp Feedback</option>
                <option value="Website">Website Form</option>
                <option value="In-Person">In-Person Client</option>
              </select>
            </div>

            <div>
              <label style="font-size: 0.84rem; font-weight: 700; color: #475569; display: block; margin-bottom: 6px;">Review Comments & Feedback *</label>
              <textarea id="admin-edit-rev-text" required rows="4" placeholder="Paste the client review text here..." style="width: 100%; padding: 11px 14px; font-size: 0.92rem; border-radius: 10px; border: 1px solid #cbd5e1; box-sizing: border-box; resize: vertical;"></textarea>
            </div>

            <div style="display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px;">
              <button type="button" id="cancel-admin-edit-rev-btn" onclick="if(window.closeAdminEditReviewModal) window.closeAdminEditReviewModal();" style="padding: 11px 18px; border-radius: 10px; background: #f1f5f9; border: 1px solid #cbd5e1; color: #475569; font-weight: 600; cursor: pointer;">Cancel</button>
              <button type="submit" style="padding: 11px 24px; border-radius: 10px; background: #2563eb; color: #fff; border: none; font-weight: 700; cursor: pointer; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.3);">Update Review</button>
            </div>
          </form>
        </div>
      </div>

    </div>
  `;
}

// Global modal helpers attached to window
window.setAddStarRating = function(val) {
  const addRatingInput = document.getElementById('admin-rev-rating');
  const addStarsPicker = document.getElementById('admin-add-stars-picker');
  if (addRatingInput) addRatingInput.value = val;
  if (addStarsPicker) {
    addStarsPicker.querySelectorAll('.admin-add-star').forEach(star => {
      const starVal = parseInt(star.dataset.value, 10);
      star.style.color = starVal <= val ? '#f59e0b' : '#cbd5e1';
    });
  }
};

window.setEditStarRating = function(val) {
  const editRatingInput = document.getElementById('admin-edit-rev-rating');
  const editStarsPicker = document.getElementById('admin-edit-stars-picker');
  if (editRatingInput) editRatingInput.value = val;
  if (editStarsPicker) {
    editStarsPicker.querySelectorAll('.admin-edit-star').forEach(star => {
      const starVal = parseInt(star.dataset.value, 10);
      star.style.color = starVal <= val ? '#f59e0b' : '#cbd5e1';
    });
  }
};

window.openAdminAddReviewModal = function() {
  const modal = document.getElementById('admin-add-review-modal');
  if (modal) {
    window.setAddStarRating(5);
    const form = document.getElementById('admin-add-review-form');
    if (form) form.reset();
    modal.style.display = 'flex';
  }
};

window.closeAdminAddReviewModal = function() {
  const modal = document.getElementById('admin-add-review-modal');
  if (modal) modal.style.display = 'none';
};

window.openAdminEditReviewModal = function(id) {
  const allReviews = getReviews();
  const rev = allReviews.find(r => r.id === id);
  if (!rev) return;

  const idInput = document.getElementById('admin-edit-rev-id');
  const nameInput = document.getElementById('admin-edit-rev-name');
  const sourceSelect = document.getElementById('admin-edit-rev-source');
  const textInput = document.getElementById('admin-edit-rev-text');
  const editModal = document.getElementById('admin-edit-review-modal');

  if (idInput) idInput.value = rev.id;
  if (nameInput) nameInput.value = rev.name || rev.author_name || '';
  if (sourceSelect) sourceSelect.value = rev.source || 'Google';
  window.setEditStarRating(rev.rating || 5);
  if (textInput) textInput.value = rev.reviewText || rev.review_text || '';

  if (editModal) editModal.style.display = 'flex';
};

window.closeAdminEditReviewModal = function() {
  const modal = document.getElementById('admin-edit-review-modal');
  if (modal) modal.style.display = 'none';
};

export function initReviewsListeners() {
  // Tab Switching
  document.querySelectorAll('.review-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeFilter = btn.dataset.filter || 'all';
      if (typeof window.navigateToView === 'function') {
        window.navigateToView('reviews');
      }
    });
  });

  // Modal Handlers (Add Review)
  const addModal = document.getElementById('admin-add-review-modal');
  const openAddBtn = document.getElementById('open-add-review-admin-btn');
  const closeAddBtn = document.getElementById('close-admin-review-modal-btn');
  const cancelAddBtn = document.getElementById('cancel-admin-rev-btn');
  const addForm = document.getElementById('admin-add-review-form');
  const addStarsPicker = document.getElementById('admin-add-stars-picker');

  addStarsPicker?.querySelectorAll('.admin-add-star').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value, 10) || 5;
      window.setAddStarRating(val);
    });
  });

  openAddBtn?.addEventListener('click', window.openAdminAddReviewModal);
  closeAddBtn?.addEventListener('click', window.closeAdminAddReviewModal);
  cancelAddBtn?.addEventListener('click', window.closeAdminAddReviewModal);

  if (addModal) {
    addModal.addEventListener('click', (e) => {
      if (e.target === addModal) window.closeAdminAddReviewModal();
    });
  }

  addForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('admin-rev-name')?.value.trim();
    const source = document.getElementById('admin-rev-source')?.value || 'Google';
    const rating = parseInt(document.getElementById('admin-rev-rating')?.value, 10) || 5;
    const reviewText = document.getElementById('admin-rev-text')?.value.trim();

    if (!name || !reviewText) {
      showToast('Please fill in Name and Review Text', 'ri-error-warning-line');
      return;
    }

    addReview({
      name,
      author_name: name,
      source,
      rating,
      reviewText,
      review_text: reviewText,
      status: 'Approved',
      time_ago: 'Just now'
    });

    window.closeAdminAddReviewModal();
    showToast('Review published successfully!', 'ri-checkbox-circle-fill');
    if (typeof window.navigateToView === 'function') {
      window.navigateToView('reviews');
    }
  });

  // Modal Handlers (Edit Review)
  const editModal = document.getElementById('admin-edit-review-modal');
  const closeEditBtn = document.getElementById('close-admin-edit-review-modal-btn');
  const cancelEditBtn = document.getElementById('cancel-admin-edit-rev-btn');
  const editForm = document.getElementById('admin-edit-review-form');
  const editStarsPicker = document.getElementById('admin-edit-stars-picker');

  editStarsPicker?.querySelectorAll('.admin-edit-star').forEach(star => {
    star.addEventListener('click', () => {
      const val = parseInt(star.dataset.value, 10) || 5;
      window.setEditStarRating(val);
    });
  });

  closeEditBtn?.addEventListener('click', window.closeAdminEditReviewModal);
  cancelEditBtn?.addEventListener('click', window.closeAdminEditReviewModal);

  if (editModal) {
    editModal.addEventListener('click', (e) => {
      if (e.target === editModal) window.closeAdminEditReviewModal();
    });
  }

  document.querySelectorAll('.edit-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) window.openAdminEditReviewModal(id);
    });
  });

  editForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('admin-edit-rev-id')?.value;
    const name = document.getElementById('admin-edit-rev-name')?.value.trim();
    const source = document.getElementById('admin-edit-rev-source')?.value || 'Google';
    const rating = parseInt(document.getElementById('admin-edit-rev-rating')?.value, 10) || 5;
    const reviewText = document.getElementById('admin-edit-rev-text')?.value.trim();

    if (!id || !name || !reviewText) {
      showToast('Please fill in required review fields', 'ri-error-warning-line');
      return;
    }

    updateReview(id, {
      name,
      author_name: name,
      source,
      rating,
      reviewText,
      review_text: reviewText
    });

    window.closeAdminEditReviewModal();
    showToast('Review updated successfully!', 'ri-checkbox-circle-fill');
    if (typeof window.navigateToView === 'function') {
      window.navigateToView('reviews');
    }
  });

  // Toggle Status Buttons
  document.querySelectorAll('.toggle-status-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) {
        toggleReviewStatus(id);
        showToast('Review display status updated', 'ri-refresh-line');
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('reviews');
        }
      }
    });
  });

  // Delete Buttons
  document.querySelectorAll('.delete-review-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id && confirm('Are you sure you want to delete this review?')) {
        deleteReview(id);
        showToast('Review deleted', 'ri-delete-bin-line');
        if (typeof window.navigateToView === 'function') {
          window.navigateToView('reviews');
        }
      }
    });
  });
}
