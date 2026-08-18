import { getBlogPosts, addBlogPost, updateBlogPost, deleteBlogPost, resetBlogPostsToDefault } from '../utils/blogStore.js';

let cmsState = {
  isFormOpen: false,
  editingPostId: null,
  activeCategory: 'all',
  searchQuery: ''
};

export function renderBlogCMSView() {
  const allPosts = getBlogPosts();
  
  // Filter posts based on search & category
  const filteredPosts = allPosts.filter(post => {
    const matchesCat = cmsState.activeCategory === 'all' || post.category === cmsState.activeCategory;
    const q = cmsState.searchQuery.toLowerCase();
    const matchesSearch = !q || 
      post.title.toLowerCase().includes(q) || 
      post.category.toLowerCase().includes(q) || 
      post.author.toLowerCase().includes(q) ||
      (post.excerpt && post.excerpt.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  return `
    <div class="view-enter blog-cms-view">
      <style>
        .blog-filter-btn {
          padding: 6px 14px;
          border-radius: 20px;
          border: 1px solid #e2e8f0;
          background: #fff;
          color: #4a5568;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .blog-filter-btn:hover {
          background: #f7fafc;
          border-color: #cbd5e0;
        }
        .blog-filter-btn.active {
          background: #2d3748;
          color: #fff;
          border-color: #2d3748;
        }
      </style>
      <!-- Top Header -->
      <div style="display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px; margin-bottom: 24px;">
        <div>
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <span style="font-size: 0.75rem; font-weight: 700; color: var(--os-luxury-orange); letter-spacing: 1px; text-transform: uppercase;">
              <i class="ri-article-line" style="margin-right: 4px;"></i> CONTENT MANAGEMENT SYSTEM
            </span>
          </div>
          <h1 class="view-title" style="margin: 4px 0;">Blog Posts & Publishing CMS</h1>
          <p class="view-subtitle" style="margin: 0;">Write, edit, and manage articles, legal Patta guides, and market perspectives for the public website.</p>
        </div>

        <div style="display: flex; gap: 12px; align-items: center; flex-wrap: wrap;">
          <a href="/index.html#blog" target="_blank" class="os-btn-secondary" style="display: inline-flex; align-items: center; gap: 8px; text-decoration: none;">
            <i class="ri-external-link-line"></i> View Live Journal
          </a>
          <button class="os-btn-secondary" id="reset-blog-posts-btn" style="color: #e53e3e; border-color: rgba(229, 62, 62, 0.3);">
            <i class="ri-refresh-line"></i> Reset Articles
          </button>
          <button class="os-btn-primary" id="open-blog-form-btn">
            <i class="ri-add-line"></i> Write New Article
          </button>
        </div>
      </div>

      <!-- Article Creation / Edit Form Container -->
      <div id="blog-form-wrapper" style="display: ${cmsState.isFormOpen ? 'block' : 'none'}; margin-bottom: 32px;">
        ${renderBlogForm()}
      </div>

      <!-- KPI Summary Cards -->
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px;">
        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Total Published</span>
          <h3 style="font-size: 1.6rem; font-weight: 800; color: #1a1a1a; margin-top: 4px;">${allPosts.length}</h3>
        </div>
        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Legal & Patta Guides</span>
          <h3 style="font-size: 1.6rem; font-weight: 800; color: #eb5e28; margin-top: 4px;">${allPosts.filter(p => p.category === 'Legal & Patta').length}</h3>
        </div>
        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Investment & Market</span>
          <h3 style="font-size: 1.6rem; font-weight: 800; color: #1a1a1a; margin-top: 4px;">${allPosts.filter(p => p.category === 'Investment' || p.category === 'Market Guide').length}</h3>
        </div>
        <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.06); border-radius: 14px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02);">
          <span style="font-size: 0.78rem; text-transform: uppercase; color: #777; font-weight: 700;">Architecture & NRI</span>
          <h3 style="font-size: 1.6rem; font-weight: 800; color: #1a1a1a; margin-top: 4px;">${allPosts.filter(p => p.category === 'Architecture' || p.category === 'NRI Guide').length}</h3>
        </div>
      </div>

      <!-- Filter Controls Bar -->
      <div class="os-filter-bar" style="margin-bottom: 24px;">
        <div class="search-box" style="flex: 1; max-width: 380px;">
          <i class="ri-search-line"></i>
          <input type="text" id="blog-cms-search" value="${cmsState.searchQuery}" placeholder="Search article title, category, author..." />
        </div>
      </div>

      <!-- Articles Data Table -->
      <div style="background: #ffffff; border: 1px solid rgba(0,0,0,0.08); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.03);">
        <table style="width: 100%; border-collapse: collapse; text-align: left;">
          <thead>
            <tr style="background: #fdfbf7; border-bottom: 1px solid rgba(0,0,0,0.06); font-size: 0.78rem; text-transform: uppercase; color: #666; letter-spacing: 0.05em;">
              <th style="padding: 16px 20px;">Article Title</th>
              <th style="padding: 16px 20px;">Author</th>
              <th style="padding: 16px 20px;">Date & Read Time</th>
              <th style="padding: 16px 20px; text-align: right;">Actions</th>
            </tr>
          </thead>
          <tbody>
            ${filteredPosts.length === 0 ? `
              <tr>
                <td colspan="4" style="padding: 40px 20px; text-align: center; color: #888;">
                  <i class="ri-draft-line" style="font-size: 2.5rem; color: #ccc; display: block; margin-bottom: 8px;"></i>
                  <p style="font-weight: 600;">No articles match your query.</p>
                </td>
              </tr>
            ` : filteredPosts.map(post => `
              <tr style="border-bottom: 1px solid rgba(0,0,0,0.05); transition: background 0.2s;" onmouseenter="this.style.background='#faf7f2'" onmouseleave="this.style.background='transparent'">
                <td style="padding: 16px 20px;">
                  <div style="display: flex; align-items: center; gap: 14px;">
                    <img src="${post.image}" alt="${post.title}" style="width: 64px; height: 44px; border-radius: 8px; object-fit: cover; background: #eee;" onerror="this.src='https://via.placeholder.com/100x70';" />
                    <div>
                      <strong style="font-size: 0.95rem; color: #1a1a1a; display: block; line-height: 1.3;">${post.title}</strong>
                      <span style="font-size: 0.8rem; color: #777; line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; max-width: 380px;">${post.excerpt || ''}</span>
                    </div>
                  </div>
                </td>
                <td style="padding: 16px 20px; white-space: nowrap;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <img src="${post.authorAvatar || 'https://ui-avatars.com/api/?name=Author'}" alt="${post.author}" style="width: 24px; height: 24px; border-radius: 50%;" />
                    <span style="font-size: 0.88rem; color: #333; font-weight: 500;">${post.author}</span>
                  </div>
                </td>
                <td style="padding: 16px 20px;">
                  <span style="font-size: 0.85rem; color: #444; display: block;">${post.date}</span>
                  <span style="font-size: 0.75rem; color: #888;">${post.readTime || '5 min read'}</span>
                </td>
                <td style="padding: 16px 20px; text-align: right;">
                  <div style="display: flex; gap: 8px; justify-content: flex-end;">
                    <button class="os-btn-secondary edit-post-btn" data-id="${post.id}" style="padding: 6px 12px; font-size: 0.8rem;" title="Edit article">
                      <i class="ri-edit-line"></i> Edit
                    </button>
                    <button class="os-btn-secondary delete-post-btn" data-id="${post.id}" style="padding: 6px 12px; font-size: 0.8rem; color: #e53e3e; border-color: rgba(229,62,62,0.3);" title="Delete article">
                      <i class="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function renderBlogForm() {
  const isEdit = Boolean(cmsState.editingPostId);
  const post = isEdit ? getBlogPosts().find(p => p.id === cmsState.editingPostId) : null;

  return `
    <div style="background: #ffffff; border: 1px solid var(--color-orange, #eb5e28); border-radius: 16px; padding: 24px; box-shadow: 0 8px 24px rgba(235,94,40,0.08);">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 1px solid rgba(0,0,0,0.06); padding-bottom: 12px;">
        <h2 style="font-size: 1.2rem; font-weight: 700; color: #1a1a1a; display: flex; align-items: center; gap: 8px;">
          <i class="${isEdit ? 'ri-edit-line' : 'ri-file-add-line'}" style="color: #eb5e28;"></i>
          ${isEdit ? 'Edit Published Article' : 'Create & Publish New Article'}
        </h2>
        <button id="close-blog-form-btn" style="background: none; border: none; font-size: 1.4rem; color: #777; cursor: pointer;">
          <i class="ri-close-line"></i>
        </button>
      </div>

      <form id="blog-editor-form" style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Title & Category -->
        <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 16px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Article Title *</label>
            <input type="text" id="form-title" value="${post ? post.title : ''}" required placeholder="e.g. Essential Patta Title Verification Guide for Buyers" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Category *</label>
            <select id="form-category" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: white;">
              <option value="Legal & Patta" ${post?.category === 'Legal & Patta' ? 'selected' : ''}>Legal & Patta</option>
              <option value="Investment" ${post?.category === 'Investment' ? 'selected' : ''}>Investment</option>
              <option value="Architecture" ${post?.category === 'Architecture' ? 'selected' : ''}>Architecture</option>
              <option value="Market Guide" ${post?.category === 'Market Guide' || !post ? 'selected' : ''}>Market Guide</option>
              <option value="NRI Guide" ${post?.category === 'NRI Guide' ? 'selected' : ''}>NRI Guide</option>
            </select>
          </div>
        </div>

        <!-- Author & Read Time & Date -->
        <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Author Name</label>
            <input type="text" id="form-author" value="${post ? post.author : 'Thanjai Legal Advisory'}" placeholder="e.g. Senior Land Specialist" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Read Time</label>
            <input type="text" id="form-readtime" value="${post ? post.readTime : '5 min read'}" placeholder="e.g. 5 min read" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Publish Date</label>
            <input type="text" id="form-date" value="${post ? post.date : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
          </div>
        </div>

        <!-- Cover Image URL & File Upload -->
        <div>
          <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Cover Image URL / Upload File</label>
          <div style="display: flex; gap: 10px; align-items: center;">
            <input type="url" id="form-image" value="${post ? post.image : ''}" placeholder="https://images.unsplash.com/... or choose file" style="flex: 1; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
            <label style="cursor: pointer; padding: 10px 16px; border-radius: 8px; background: #f7fafc; border: 1px dashed #cbd5e0; font-size: 0.85rem; font-weight: 600; color: #444; display: inline-flex; align-items: center; gap: 6px;">
              <i class="ri-upload-cloud-line" style="color: #eb5e28;"></i> Upload Image
              <input type="file" id="form-file-input" accept="image/*" style="display: none;" />
            </label>
          </div>
        </div>

        <!-- Excerpt -->
        <div>
          <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Short Summary / Excerpt *</label>
          <textarea id="form-excerpt" rows="2" required placeholder="Provide a brief compelling summary displayed on article cards..." style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; font-family: inherit;">${post ? post.excerpt : ''}</textarea>
        </div>

        <!-- Full Content -->
        <div>
          <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Full Article Content (HTML / Text) *</label>
          <textarea id="form-content" rows="7" required placeholder="Write article content using <p>, <h3>, <blockquote> formatting..." style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; font-family: inherit;">${post ? post.content : ''}</textarea>
        </div>

        <!-- Submit & Cancel buttons -->
        <div style="display: flex; gap: 12px; justify-content: flex-end; margin-top: 8px;">
          <button type="button" class="os-btn-secondary" id="cancel-blog-form-btn">Cancel</button>
          <button type="submit" class="os-btn-primary" style="padding: 10px 24px;">
            <i class="ri-send-plane-line"></i> ${isEdit ? 'Save Changes' : 'Publish Article'}
          </button>
        </div>
      </form>
    </div>
  `;
}

export function initBlogCMSListeners() {
  // Search input filter
  const searchInput = document.getElementById('blog-cms-search');
  searchInput?.addEventListener('input', (e) => {
    cmsState.searchQuery = e.target.value.toLowerCase();
    
    const rows = document.querySelectorAll('.blog-cms-view tbody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
      // Don't filter the empty-state row if it exists
      if (row.querySelector('td[colspan]')) return;
      
      const text = row.textContent.toLowerCase();
      if (text.includes(cmsState.searchQuery)) {
        row.style.display = 'table-row';
        visibleCount++;
      } else {
        row.style.display = 'none';
      }
    });
  });

  // Category tab buttons
  document.querySelectorAll('#blog-cms-tabs .img-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      cmsState.activeCategory = btn.dataset.category || 'all';
      refreshView();
    });
  });

  // Open Form Button
  document.getElementById('open-blog-form-btn')?.addEventListener('click', () => {
    cmsState.isFormOpen = true;
    cmsState.editingPostId = null;
    refreshView();
  });

  // Close Form Buttons
  document.getElementById('close-blog-form-btn')?.addEventListener('click', () => {
    cmsState.isFormOpen = false;
    cmsState.editingPostId = null;
    refreshView();
  });
  document.getElementById('cancel-blog-form-btn')?.addEventListener('click', () => {
    cmsState.isFormOpen = false;
    cmsState.editingPostId = null;
    refreshView();
  });

  // Edit Post Buttons
  document.querySelectorAll('.edit-post-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id) {
        cmsState.isFormOpen = true;
        cmsState.editingPostId = id;
        refreshView();
        document.getElementById('blog-form-wrapper')?.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Delete Post Buttons
  document.querySelectorAll('.delete-post-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.id;
      if (id && confirm('Are you sure you want to delete this blog article from the public website?')) {
        deleteBlogPost(id);
        showToast('Article deleted successfully.', 'ri-delete-bin-line');
        refreshView();
      }
    });
  });

  // Reset Articles Button
  document.getElementById('reset-blog-posts-btn')?.addEventListener('click', () => {
    if (confirm('Restore default factory seed articles?')) {
      resetBlogPostsToDefault();
      showToast('Restored seed articles.', 'ri-refresh-line');
      refreshView();
    }
  });

  // File Upload Handler
  const fileInput = document.getElementById('form-file-input');
  fileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size exceeds 5MB limit.', 'ri-alert-line');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        const urlInput = document.getElementById('form-image');
        if (urlInput) urlInput.value = evt.target.result;
        showToast('Image loaded. Click Publish to save.', 'ri-check-line');
      };
      reader.readAsDataURL(file);
    }
  });

  // Form Submit Handler
  const form = document.getElementById('blog-editor-form');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('form-title').value.trim();
    const category = document.getElementById('form-category').value;
    const author = document.getElementById('form-author').value.trim();
    const readTime = document.getElementById('form-readtime').value.trim();
    const date = document.getElementById('form-date').value.trim();
    const image = document.getElementById('form-image').value.trim();
    const excerpt = document.getElementById('form-excerpt').value.trim();
    const content = document.getElementById('form-content').value.trim();

    if (!title || !excerpt || !content) {
      showToast('Please complete all required fields.', 'ri-alert-line');
      return;
    }

    const payload = {
      title,
      category,
      author: author || 'Thanjai Editorial Desk',
      readTime: readTime || '5 min read',
      date: date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: image || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80',
      excerpt,
      content
    };

    if (cmsState.editingPostId) {
      updateBlogPost(cmsState.editingPostId, payload);
      showToast('Article updated successfully!', 'ri-checkbox-circle-line');
    } else {
      addBlogPost(payload);
      showToast('Article published to public website!', 'ri-checkbox-circle-fill');
    }

    cmsState.isFormOpen = false;
    cmsState.editingPostId = null;
    refreshView();
  });
}

function refreshView() {
  const contentArea = document.getElementById('os-content');
  if (contentArea) {
    contentArea.innerHTML = renderBlogCMSView();
    initBlogCMSListeners();
  }
}

function showToast(msg, icon = 'ri-notification-line') {
  let toastContainer = document.getElementById('os-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'os-toast-container';
    toastContainer.style.cssText = `
      position: fixed; bottom: 24px; right: 24px; z-index: 9999;
      display: flex; flex-direction: column; gap: 10px; pointer-events: none;
    `;
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.style.cssText = `
    background: #1a1a1a; color: #ffffff; padding: 12px 20px; border-radius: 10px;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25); font-size: 0.9rem; font-weight: 500;
    display: flex; align-items: center; gap: 10px; pointer-events: auto;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  `;
  toast.innerHTML = `<i class="${icon}" style="color: var(--color-orange, #eb5e28); font-size: 1.15rem;"></i> <span>${msg}</span>`;

  toastContainer.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}
