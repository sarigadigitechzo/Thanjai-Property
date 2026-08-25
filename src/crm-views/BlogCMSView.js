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
        <!-- Title, Category / Keyword & URL Slug -->
        <div style="display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 16px;">
          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Article Title *</label>
            <input type="text" id="form-title" value="${post ? post.title : ''}" required placeholder="e.g. Essential Patta Title Verification Guide for Buyers" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Category / Keyword *</label>
            <input type="text" id="form-category" value="${post ? post.category : ''}" required placeholder="e.g. Legal & Patta, Market Guide" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: white;" />
          </div>

          <div>
            <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">URL Slug *</label>
            <input type="text" id="form-slug" value="${post ? (post.slug || post.id) : ''}" required placeholder="e.g. market-guide-patta-verification" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: white;" />
          </div>
        </div>
        <!-- Publish Date -->
        <div>
          <label style="font-size: 0.8rem; font-weight: 700; color: #444; display: block; margin-bottom: 6px;">Publish Date</label>
          <input type="text" id="form-date" value="${post ? post.date : new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #ffffff;" />
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

        <!-- SEO Metadata Settings (Meta Title & Meta Description) -->
        <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px; margin-top: 4px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; flex-wrap: wrap; gap: 8px;">
            <span style="font-size: 0.85rem; font-weight: 800; color: #1a202c; display: flex; align-items: center; gap: 6px;">
              <i class="ri-search-eye-line" style="color: #eb5e28;"></i> Search Engine Optimization (SEO Metadata)
            </span>
            <span style="font-size: 0.75rem; color: #718096; font-style: italic;">Defaults will auto-fill from Title & Excerpt if left empty</span>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 14px;">
            <div>
              <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">SEO Meta Title</label>
              <input type="text" id="form-meta-title" value="${post ? (post.metaTitle || '') : ''}" placeholder="Default: ${post ? post.title : 'Article Title'} | Thanjai Property" style="width: 100%; padding: 10px 14px; font-size: 0.9rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #ffffff;" />
              <span style="font-size: 0.74rem; color: #718096; margin-top: 4px; display: block;">Recommended: 50–60 characters</span>
            </div>

            <div>
              <label style="font-size: 0.8rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 6px;">SEO Meta Description</label>
              <textarea id="form-meta-desc" rows="2" placeholder="Default: Auto-populates from Short Summary / Excerpt..." style="width: 100%; padding: 10px 14px; font-size: 0.88rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #ffffff; font-family: inherit;">${post ? (post.metaDescription || '') : ''}</textarea>
              <span style="font-size: 0.74rem; color: #718096; margin-top: 4px; display: block;">Recommended: 150–160 characters</span>
            </div>
          </div>

          <!-- Google Search Engine Snippet Live Preview -->
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px 18px; box-shadow: 0 2px 6px rgba(0,0,0,0.02);">
            <div style="font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #a0aec0; margin-bottom: 6px; letter-spacing: 0.05em;">
              Google Search Snippet Preview
            </div>
            <div id="seo-preview-title" style="font-size: 1.08rem; color: #1a0dab; font-weight: 600; text-decoration: none; margin-bottom: 2px; line-height: 1.3;">
              ${post && post.metaTitle ? post.metaTitle : (post ? `${post.title} | Thanjai Property` : 'Article Title | Thanjai Property')}
            </div>
            <div id="seo-preview-url" style="font-size: 0.8rem; color: #006621; margin-bottom: 4px;">
              https://www.thanjaiproperty.com/blog/${post ? (post.slug || 'article-slug') : 'article-slug'}
            </div>
            <div id="seo-preview-desc" style="font-size: 0.84rem; color: #545454; line-height: 1.45;">
              ${post && post.metaDescription ? post.metaDescription : (post && post.excerpt ? post.excerpt : 'Compelling article summary and legal land verification guide on Thanjai Property.')}
            </div>
          </div>
        </div>

        <!-- Full Article Body Content (Rich Text Toolbar matching Image 3) -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label style="font-size: 0.8rem; font-weight: 700; color: #444;">Article Body Content *</label>
            <div style="display: flex; gap: 8px; align-items: center;">
              <button type="button" id="editor-add-media-btn" style="padding: 5px 12px; font-size: 0.82rem; font-weight: 600; background: #ffffff; border: 1px solid #cbd5e0; border-radius: 6px; cursor: pointer; color: #2d3748; display: inline-flex; align-items: center; gap: 6px;">
                <i class="ri-image-add-line" style="color: #eb5e28;"></i> Add Media
              </button>
              <div style="display: inline-flex; border: 1px solid #cbd5e0; border-radius: 6px; overflow: hidden; background: #edf2f7;">
                <button type="button" id="editor-mode-text-btn" class="editor-mode-tab active" style="padding: 5px 12px; font-size: 0.8rem; font-weight: 700; border: none; background: #2d3748; color: #ffffff; cursor: pointer;">Text</button>
                <button type="button" id="editor-mode-html-btn" class="editor-mode-tab" style="padding: 5px 12px; font-size: 0.8rem; font-weight: 700; border: none; background: transparent; color: #4a5568; cursor: pointer;">HTML</button>
              </div>
            </div>
          </div>

          <!-- Formatting Toolbar -->
          <div id="wysiwyg-toolbar" style="display: flex; flex-wrap: wrap; gap: 6px; align-items: center; padding: 8px 12px; background: #f8fafc; border: 1px solid #cbd5e0; border-bottom: none; border-top-left-radius: 8px; border-top-right-radius: 8px; user-select: none;">
            <!-- Undo / Redo -->
            <button type="button" class="toolbar-btn" data-cmd="undo" title="Undo (Ctrl+Z)" style="padding: 5px 9px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer; color: #2d3748;"><i class="ri-arrow-go-back-line"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="redo" title="Redo (Ctrl+Y)" style="padding: 5px 9px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer; color: #2d3748;"><i class="ri-arrow-go-forward-line"></i></button>

            <div style="width: 1px; height: 20px; background: #cbd5e0; margin: 0 4px;"></div>

            <!-- Block Format Dropdown (Paragraph, H1-H6, Blockquote, Code) -->
            <select id="toolbar-format-select" style="padding: 5px 8px; font-size: 0.82rem; border-radius: 4px; border: 1px solid #cbd5e0; background: white; font-weight: 700; color: #2d3748; cursor: pointer;">
              <option value="p">¶ Paragraph</option>
              <option value="h1">H1 Heading 1</option>
              <option value="h2">H2 Heading 2</option>
              <option value="h3">H3 Heading 3</option>
              <option value="h4">H4 Heading 4</option>
              <option value="h5">H5 Heading 5</option>
              <option value="h6">H6 Heading 6</option>
              <option value="blockquote">❝ Blockquote</option>
              <option value="pre">&lt;/&gt; Code Block</option>
            </select>

            <div style="width: 1px; height: 20px; background: #cbd5e0; margin: 0 4px;"></div>

            <!-- Text Formatting (B, I, U, S) -->
            <button type="button" class="toolbar-btn" data-cmd="bold" title="Bold (Ctrl+B)" style="padding: 5px 10px; font-size: 0.95rem; font-weight: 800; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;">B</button>
            <button type="button" class="toolbar-btn" data-cmd="italic" title="Italic (Ctrl+I)" style="padding: 5px 10px; font-size: 0.95rem; font-style: italic; font-weight: 700; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;">I</button>
            <button type="button" class="toolbar-btn" data-cmd="underline" title="Underline (Ctrl+U)" style="padding: 5px 10px; font-size: 0.95rem; text-decoration: underline; font-weight: 700; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;">U</button>
            <button type="button" class="toolbar-btn" data-cmd="strikeThrough" title="Strikethrough" style="padding: 5px 10px; font-size: 0.95rem; text-decoration: line-through; font-weight: 700; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;">S</button>

            <div style="width: 1px; height: 20px; background: #cbd5e0; margin: 0 4px;"></div>

            <!-- Lists & Blockquote -->
            <button type="button" class="toolbar-btn" data-cmd="insertUnorderedList" title="Bulleted List" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-list-unordered"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="insertOrderedList" title="Numbered List" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-list-ordered-2"></i></button>
            <button type="button" class="toolbar-btn" id="toolbar-quote-btn" title="Insert Blockquote" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-double-quotes-l"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="insertHorizontalRule" title="Horizontal Divider" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-separator"></i></button>

            <div style="width: 1px; height: 20px; background: #cbd5e0; margin: 0 4px;"></div>

            <!-- Alignments -->
            <button type="button" class="toolbar-btn" data-cmd="justifyLeft" title="Align Left" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-align-left"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="justifyCenter" title="Align Center" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-align-center"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="justifyRight" title="Align Right" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-align-right"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="justifyFull" title="Justify Full" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-align-justify"></i></button>

            <div style="width: 1px; height: 20px; background: #cbd5e0; margin: 0 4px;"></div>

            <!-- Table, Link, Clear Format -->
            <button type="button" class="toolbar-btn" id="toolbar-table-btn" title="Insert Table" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-table-line"></i></button>
            <button type="button" class="toolbar-btn" id="toolbar-link-btn" title="Insert Link" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-link"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="unlink" title="Remove Link" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer;"><i class="ri-link-unlink"></i></button>
            <button type="button" class="toolbar-btn" data-cmd="removeFormat" title="Clear Formatting" style="padding: 5px 8px; font-size: 0.95rem; border: 1px solid #cbd5e0; border-radius: 4px; background: white; cursor: pointer; color: #e53e3e;"><i class="ri-format-clear"></i></button>
          </div>

          <!-- Link Manager Dialog Popover -->
          <div id="editor-link-popover" style="display: none; background: #ffffff; border: 2px solid #eb5e28; border-radius: 10px; box-shadow: 0 12px 30px rgba(0,0,0,0.15); padding: 16px; margin-bottom: 12px; position: relative; z-index: 100;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
              <span style="font-size: 0.9rem; font-weight: 800; color: #1a202c; display: flex; align-items: center; gap: 8px;">
                <i class="ri-link" style="color: #eb5e28; font-size: 1.1rem;"></i> Hyperlink Manager
              </span>
              <button type="button" id="link-popover-close-btn" style="background: none; border: none; font-size: 1.2rem; color: #718096; cursor: pointer; padding: 2px 6px; line-height: 1;">&times;</button>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 12px; margin-bottom: 14px;">
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 4px;">Text to Display *</label>
                <input type="text" id="link-popover-text" placeholder="e.g. thanjai property" style="width: 100%; padding: 8px 12px; font-size: 0.9rem; border: 1px solid #cbd5e0; border-radius: 6px; outline: none;" />
              </div>
              <div>
                <label style="display: block; font-size: 0.8rem; font-weight: 700; color: #4a5568; margin-bottom: 4px;">Destination URL *</label>
                <input type="text" id="link-popover-url" placeholder="https://www.thanjaiproperty.com/" style="width: 100%; padding: 8px 12px; font-size: 0.9rem; border: 1px solid #cbd5e0; border-radius: 6px; outline: none;" />
              </div>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <label style="display: flex; align-items: center; gap: 6px; font-size: 0.82rem; font-weight: 600; color: #4a5568; cursor: pointer;">
                <input type="checkbox" id="link-popover-newtab" checked style="accent-color: #eb5e28;" /> Open link in new tab
              </label>
              <div style="display: flex; gap: 8px;">
                <button type="button" id="link-popover-remove-btn" style="display: none; padding: 7px 14px; font-size: 0.82rem; font-weight: 700; color: #e53e3e; background: #fff5f5; border: 1px solid #feb2b2; border-radius: 6px; cursor: pointer;">
                  <i class="ri-link-unlink"></i> Remove Link
                </button>
                <button type="button" id="link-popover-apply-btn" style="padding: 7px 18px; font-size: 0.85rem; font-weight: 800; color: #ffffff; background: #eb5e28; border: none; border-radius: 6px; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                  <i class="ri-check-line"></i> Apply Link
                </button>
              </div>
            </div>
          </div>

          <!-- Content Editable & Raw HTML Area -->
          <div style="position: relative;">
            <style>
              #editor-visual-body a, .editor-article-link {
                color: #eb5e28 !important;
                text-decoration: underline !important;
                font-weight: 700 !important;
                cursor: pointer !important;
                background: rgba(235,94,40,0.1) !important;
                padding: 1px 6px !important;
                border-radius: 4px !important;
                border: 1px solid rgba(235,94,40,0.3) !important;
                display: inline-block !important;
                transition: all 0.2s ease;
              }
              #editor-visual-body a:hover, .editor-article-link:hover {
                color: #c84919 !important;
                background: rgba(235,94,40,0.2) !important;
                border-color: #eb5e28 !important;
              }
              #editor-visual-body a::before {
                content: "🔗 ";
                font-size: 0.75rem;
                opacity: 0.85;
              }
              #editor-visual-body h1, #editor-visual-body h2, #editor-visual-body h3, #editor-visual-body h4, #editor-visual-body h5, #editor-visual-body h6 {
                font-family: var(--font-serif, serif);
                color: #1a202c;
                margin-top: 1.2em;
                margin-bottom: 0.5em;
                font-weight: 800;
              }
              #editor-visual-body h1 { font-size: 2rem; }
              #editor-visual-body h2 { font-size: 1.65rem; }
              #editor-visual-body h3 { font-size: 1.4rem; }
              #editor-visual-body h4 { font-size: 1.2rem; }
              #editor-visual-body p { margin-bottom: 1em; line-height: 1.7; }
              #editor-visual-body blockquote {
                border-left: 4px solid #eb5e28;
                padding: 10px 18px;
                margin: 16px 0;
                background: #faf8f5;
                font-style: italic;
                color: #4a5568;
                border-radius: 0 8px 8px 0;
              }
              .link-quick-action-pill {
                position: absolute;
                display: none;
                z-index: 120;
                background: #1a202c;
                color: #ffffff;
                border-radius: 8px;
                padding: 6px 12px;
                font-size: 0.8rem;
                box-shadow: 0 8px 24px rgba(0,0,0,0.25);
                align-items: center;
                gap: 8px;
                white-space: nowrap;
              }
            </style>
            
            <!-- Floating Quick Action Pill for Links in Editor -->
            <div id="link-quick-action-pill" class="link-quick-action-pill">
              <span id="pill-url-preview" style="max-width: 180px; overflow: hidden; text-overflow: ellipsis; color: #fed7aa; font-weight: 600;"></span>
              <button type="button" id="pill-open-btn" style="background: none; border: none; color: #90cdf4; cursor: pointer; font-size: 0.78rem; font-weight: 700; padding: 2px 4px;" title="Open link in new tab">↗ Open</button>
              <button type="button" id="pill-edit-btn" style="background: none; border: none; color: #ffffff; cursor: pointer; font-size: 0.78rem; font-weight: 700; padding: 2px 4px;" title="Edit this link">✏ Edit</button>
              <button type="button" id="pill-unlink-btn" style="background: none; border: none; color: #feb2b2; cursor: pointer; font-size: 0.78rem; font-weight: 700; padding: 2px 4px;" title="Remove link">✕ Remove</button>
            </div>

            <div 
              id="editor-visual-body" 
              contenteditable="true" 
              style="min-height: 220px; max-height: 480px; overflow-y: auto; padding: 16px; background: #ffffff; border: 1px solid #cbd5e0; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; font-size: 0.95rem; line-height: 1.6; outline: none;"
            >${post ? post.content : ''}</div>
            
            <textarea 
              id="form-content" 
              rows="8"
              style="display: none; width: 100%; min-height: 220px; padding: 16px; font-size: 0.9rem; font-family: monospace; border: 1px solid #cbd5e0; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;"
            >${post ? post.content : ''}</textarea>
            
            <input type="file" id="media-file-input" accept="image/*" style="display: none;" />
          </div>
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

  // Auto Slug Generator from Category / Keyword & Title
  const titleInput = document.getElementById('form-title');
  const categoryInput = document.getElementById('form-category');
  const slugInput = document.getElementById('form-slug');

  let isSlugManuallyEdited = false;
  slugInput?.addEventListener('input', () => { isSlugManuallyEdited = true; });

  const updateAutoSlug = () => {
    if (isSlugManuallyEdited) return;
    const catVal = categoryInput ? categoryInput.value.trim() : '';
    const titleVal = titleInput ? titleInput.value.trim() : '';
    const baseText = catVal || titleVal || '';
    const generatedSlug = baseText
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
    if (slugInput && generatedSlug) slugInput.value = generatedSlug;
  };

  categoryInput?.addEventListener('input', updateAutoSlug);
  titleInput?.addEventListener('input', updateAutoSlug);

  // Live Google Search Snippet Preview Synchronizer
  const metaTitleInp = document.getElementById('form-meta-title');
  const metaDescInp = document.getElementById('form-meta-desc');
  const excerptInp = document.getElementById('form-excerpt');
  const seoPreviewTitle = document.getElementById('seo-preview-title');
  const seoPreviewUrl = document.getElementById('seo-preview-url');
  const seoPreviewDesc = document.getElementById('seo-preview-desc');

  function updateSeoPreview() {
    const titleVal = titleInput ? titleInput.value.trim() : '';
    const slugVal = slugInput ? slugInput.value.trim() : '';
    const metaTitleVal = metaTitleInp ? metaTitleInp.value.trim() : '';
    const excerptVal = excerptInp ? excerptInp.value.trim() : '';
    const metaDescVal = metaDescInp ? metaDescInp.value.trim() : '';

    if (seoPreviewTitle) {
      seoPreviewTitle.textContent = metaTitleVal || (titleVal ? `${titleVal} | Thanjai Property` : 'Article Title | Thanjai Property');
    }
    if (seoPreviewUrl) {
      seoPreviewUrl.textContent = `https://www.thanjaiproperty.com/blog/${slugVal || 'article-slug'}`;
    }
    if (seoPreviewDesc) {
      seoPreviewDesc.textContent = metaDescVal || (excerptVal || 'Compelling article summary and legal land verification guide on Thanjai Property.');
    }
  }

  metaTitleInp?.addEventListener('input', updateSeoPreview);
  metaDescInp?.addEventListener('input', updateSeoPreview);
  excerptInp?.addEventListener('input', updateSeoPreview);
  titleInput?.addEventListener('input', updateSeoPreview);
  slugInput?.addEventListener('input', updateSeoPreview);

  // WYSIWYG Editor Toolbar Listeners & State Manager
  const visualEditor = document.getElementById('editor-visual-body');
  const textareaContent = document.getElementById('form-content');
  const toolbar = document.getElementById('wysiwyg-toolbar');
  const formatSelect = document.getElementById('toolbar-format-select');
  const fontSizeSelect = document.getElementById('toolbar-fontsize-select');

  let savedRange = null;

  function saveSelection() {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && visualEditor && visualEditor.contains(sel.anchorNode)) {
      savedRange = sel.getRangeAt(0).cloneRange();
    }
  }

  function restoreSelection() {
    if (savedRange && visualEditor) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedRange);
    }
  }

  function syncEditorContent() {
    if (visualEditor && textareaContent && visualEditor.style.display !== 'none') {
      textareaContent.value = visualEditor.innerHTML;
    }
  }

  function updateToolbarState() {
    if (!visualEditor || visualEditor.style.display === 'none') return;
    saveSelection();

    // Check surrounding block tag for formatSelect
    const sel = window.getSelection();
    if (sel && sel.anchorNode && visualEditor.contains(sel.anchorNode)) {
      let node = sel.anchorNode;
      if (node.nodeType === 3) node = node.parentNode; // text node -> parent element

      let blockTag = 'p';
      let curr = node;
      while (curr && curr !== visualEditor) {
        const tagName = curr.tagName ? curr.tagName.toLowerCase() : '';
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'pre', 'p'].includes(tagName)) {
          blockTag = tagName;
          break;
        }
        curr = curr.parentNode;
      }
      if (formatSelect) formatSelect.value = blockTag;
    }

    // Update active state on formatting buttons
    document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
      const cmd = btn.dataset.cmd;
      try {
        if (['bold', 'italic', 'underline', 'strikeThrough', 'insertUnorderedList', 'insertOrderedList', 'justifyLeft', 'justifyCenter', 'justifyRight', 'justifyFull'].includes(cmd)) {
          const isActive = document.queryCommandState(cmd);
          if (isActive) {
            btn.style.background = '#edf2f7';
            btn.style.color = '#eb5e28';
            btn.style.borderColor = '#cbd5e0';
          } else {
            btn.style.background = '#ffffff';
            btn.style.color = '#2d3748';
            btn.style.borderColor = '#cbd5e0';
          }
        }
      } catch (err) {}
    });
  }

  visualEditor?.addEventListener('keyup', () => { saveSelection(); syncEditorContent(); updateToolbarState(); });
  visualEditor?.addEventListener('mouseup', () => { saveSelection(); updateToolbarState(); });
  visualEditor?.addEventListener('input', () => { syncEditorContent(); updateToolbarState(); });
  visualEditor?.addEventListener('focus', () => { saveSelection(); updateToolbarState(); });

  // Smart URL Paste Handler (Auto-wraps highlighted text or auto-formats pasted URLs)
  visualEditor?.addEventListener('paste', (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    if (!clipboardData) return;

    const pastedText = clipboardData.getData('text/plain').trim();
    const isUrl = /^https?:\/\/[^\s]+$/i.test(pastedText) || /^www\.[^\s]+$/i.test(pastedText);

    if (isUrl) {
      const sel = window.getSelection();
      const cleanUrl = pastedText.startsWith('www.') ? `https://${pastedText}` : pastedText;

      if (sel && sel.rangeCount > 0 && visualEditor.contains(sel.anchorNode)) {
        const range = sel.getRangeAt(0);
        const selectedText = range.toString().trim();

        if (!range.collapsed && selectedText.length > 0) {
          // Highlighted text exists: wrap the highlighted words into a clean link!
          e.preventDefault();
          const a = document.createElement('a');
          a.href = cleanUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'editor-article-link';
          a.textContent = range.toString();

          range.deleteContents();
          range.insertNode(a);

          const newRange = document.createRange();
          newRange.setStartAfter(a);
          newRange.setEndAfter(a);
          sel.removeAllRanges();
          sel.addRange(newRange);
          savedRange = newRange.cloneRange();

          syncEditorContent();
          updateToolbarState();
          showToast(`Wrapped "${selectedText}" with link!`, 'ri-link');
          return;
        } else {
          // No text highlighted: paste the URL as an active, styled link badge!
          e.preventDefault();
          const a = document.createElement('a');
          a.href = cleanUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'editor-article-link';
          a.textContent = cleanUrl;

          range.deleteContents();
          range.insertNode(a);

          const space = document.createTextNode('\u00A0');
          a.parentNode.insertBefore(space, a.nextSibling);

          const newRange = document.createRange();
          newRange.setStartAfter(space);
          newRange.setEndAfter(space);
          sel.removeAllRanges();
          sel.addRange(newRange);
          savedRange = newRange.cloneRange();

          syncEditorContent();
          updateToolbarState();
          showToast('Pasted as active link!', 'ri-link');
          return;
        }
      }
    }
  });

  // Auto-link on typing Space or Enter after typing a URL
  visualEditor?.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      const sel = window.getSelection();
      if (!sel || !sel.anchorNode || sel.anchorNode.nodeType !== 3) return;

      const text = sel.anchorNode.textContent;
      const offset = sel.anchorOffset;
      const beforeCursor = text.slice(0, offset);
      const words = beforeCursor.split(/\s+/);
      const lastWord = words[words.length - 1];

      if (/^https?:\/\/[^\s]+$/i.test(lastWord) || /^www\.[^\s]+$/i.test(lastWord)) {
        if (!sel.anchorNode.parentNode.closest('a')) {
          const cleanUrl = lastWord.startsWith('www.') ? `https://${lastWord}` : lastWord;
          const startIndex = offset - lastWord.length;
          
          const range = document.createRange();
          range.setStart(sel.anchorNode, startIndex);
          range.setEnd(sel.anchorNode, offset);
          
          const a = document.createElement('a');
          a.href = cleanUrl;
          a.target = '_blank';
          a.rel = 'noopener noreferrer';
          a.className = 'editor-article-link';
          a.textContent = lastWord;

          range.deleteContents();
          range.insertNode(a);

          const space = document.createTextNode('\u00A0');
          a.parentNode.insertBefore(space, a.nextSibling);

          const newRange = document.createRange();
          newRange.setStartAfter(space);
          newRange.setEndAfter(space);
          sel.removeAllRanges();
          sel.addRange(newRange);
          savedRange = newRange.cloneRange();

          syncEditorContent();
          updateToolbarState();
        }
      }
    }
  });

  // Prevent mousedown on toolbar buttons from losing selection
  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
    });
  });

  // Standard Command Execution
  document.querySelectorAll('.toolbar-btn[data-cmd]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const cmd = btn.dataset.cmd;
      if (!visualEditor) return;
      visualEditor.focus();
      restoreSelection();
      document.execCommand(cmd, false, null);
      saveSelection();
      syncEditorContent();
      updateToolbarState();
    });
  });

  // Block Formatting (H1-H6, P, Blockquote, Pre)
  function applyBlockFormat(tag) {
    if (!visualEditor) return;
    visualEditor.focus();
    restoreSelection();
    const lowerTag = tag.toLowerCase();

    let formatted = false;
    try {
      formatted = document.execCommand('formatBlock', false, `<${lowerTag}>`);
    } catch (e) {}

    if (!formatted) {
      try {
        document.execCommand('formatBlock', false, lowerTag);
      } catch (e) {}
    }

    saveSelection();
    syncEditorContent();
    updateToolbarState();
  }

  formatSelect?.addEventListener('change', (e) => {
    applyBlockFormat(e.target.value);
  });

  // Blockquote Dedicated Button
  document.getElementById('toolbar-quote-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    applyBlockFormat('blockquote');
  });

  // Table Insertion Button
  document.getElementById('toolbar-table-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const rowsInput = prompt('Enter number of rows:', '3');
    const colsInput = prompt('Enter number of columns:', '3');
    const rows = parseInt(rowsInput, 10) || 3;
    const cols = parseInt(colsInput, 10) || 3;

    let tableHtml = `<table class="blog-table" style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 0.92rem; border: 1px solid #cbd5e0;"><thead><tr style="background: #f7fafc;">`;
    for (let j = 1; j <= cols; j++) {
      tableHtml += `<th style="border: 1px solid #cbd5e0; padding: 10px 14px; font-weight: 700; color: #1a202c; text-align: left;">Header ${j}</th>`;
    }
    tableHtml += `</tr></thead><tbody>`;
    for (let i = 1; i <= Math.max(1, rows - 1); i++) {
      tableHtml += `<tr>`;
      for (let j = 1; j <= cols; j++) {
        tableHtml += `<td style="border: 1px solid #cbd5e0; padding: 10px 14px; color: #2d3748;">Data ${i}.${j}</td>`;
      }
      tableHtml += `</tr>`;
    }
    tableHtml += `</tbody></table><p></p>`;

    if (visualEditor && visualEditor.style.display !== 'none') {
      visualEditor.focus();
      restoreSelection();
      document.execCommand('insertHTML', false, tableHtml);
      syncEditorContent();
    } else if (textareaContent) {
      textareaContent.value += `\n${tableHtml}\n`;
    }
    showToast('Table inserted into article!', 'ri-table-line');
  });

  // Interactive Link Popover & Floating Quick Pill Engine
  let activeEditingLink = null;
  let currentPillLink = null;
  const linkPopover = document.getElementById('editor-link-popover');
  const linkTextInp = document.getElementById('link-popover-text');
  const linkUrlInp = document.getElementById('link-popover-url');
  const linkNewTabInp = document.getElementById('link-popover-newtab');
  const linkApplyBtn = document.getElementById('link-popover-apply-btn');
  const linkRemoveBtn = document.getElementById('link-popover-remove-btn');
  const linkCloseBtn = document.getElementById('link-popover-close-btn');
  const linkQuickPill = document.getElementById('link-quick-action-pill');
  const pillUrlPreview = document.getElementById('pill-url-preview');
  const pillOpenBtn = document.getElementById('pill-open-btn');
  const pillEditBtn = document.getElementById('pill-edit-btn');
  const pillUnlinkBtn = document.getElementById('pill-unlink-btn');

  function openLinkPopover(linkEl = null) {
    if (!linkPopover) return;
    activeEditingLink = linkEl;
    saveSelection();

    if (linkEl) {
      if (linkTextInp) linkTextInp.value = linkEl.textContent.replace(/^🔗\s*/, '').trim();
      if (linkUrlInp) linkUrlInp.value = linkEl.getAttribute('href') || '';
      if (linkNewTabInp) linkNewTabInp.checked = linkEl.getAttribute('target') === '_blank';
      if (linkRemoveBtn) linkRemoveBtn.style.display = 'inline-flex';
    } else {
      let selectedText = '';
      if (savedRange) {
        selectedText = savedRange.toString().trim();
      }
      if (linkTextInp) linkTextInp.value = selectedText;
      if (selectedText.startsWith('http://') || selectedText.startsWith('https://') || selectedText.startsWith('www.')) {
        if (linkUrlInp) linkUrlInp.value = selectedText.startsWith('www.') ? `https://${selectedText}` : selectedText;
      } else {
        if (linkUrlInp) linkUrlInp.value = 'https://';
      }
      if (linkNewTabInp) linkNewTabInp.checked = true;
      if (linkRemoveBtn) linkRemoveBtn.style.display = 'none';
    }

    linkPopover.style.display = 'block';
    hideLinkQuickPill();
    setTimeout(() => {
      if (linkUrlInp) {
        linkUrlInp.focus();
        if (linkUrlInp.value === 'https://') {
          linkUrlInp.setSelectionRange(8, 8);
        } else {
          linkUrlInp.select();
        }
      }
    }, 50);
  }

  function closeLinkPopover() {
    if (linkPopover) linkPopover.style.display = 'none';
    activeEditingLink = null;
  }

  function showLinkQuickPill(linkEl) {
    if (!linkQuickPill || !visualEditor) return;
    currentPillLink = linkEl;
    if (pillUrlPreview) pillUrlPreview.textContent = linkEl.getAttribute('href') || '';

    linkQuickPill.style.top = `${linkEl.offsetTop + linkEl.offsetHeight + 6}px`;
    linkQuickPill.style.left = `${Math.max(12, linkEl.offsetLeft)}px`;
    linkQuickPill.style.display = 'flex';
  }

  function hideLinkQuickPill() {
    if (linkQuickPill) linkQuickPill.style.display = 'none';
    currentPillLink = null;
  }

  linkApplyBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    const rawUrl = linkUrlInp ? linkUrlInp.value.trim() : '';
    let text = linkTextInp ? linkTextInp.value.trim() : '';

    if (!rawUrl || rawUrl === 'https://' || rawUrl === 'http://') {
      showToast('Please enter a valid destination URL.', 'ri-alert-line');
      linkUrlInp?.focus();
      return;
    }

    const cleanUrl = rawUrl.startsWith('http://') || rawUrl.startsWith('https://') || rawUrl.startsWith('/') || rawUrl.startsWith('tel:') || rawUrl.startsWith('mailto:') 
      ? rawUrl 
      : `https://${rawUrl}`;

    if (!text) text = cleanUrl;
    const isNewTab = linkNewTabInp ? linkNewTabInp.checked : true;

    if (activeEditingLink) {
      activeEditingLink.href = cleanUrl;
      activeEditingLink.textContent = text;
      if (isNewTab) {
        activeEditingLink.setAttribute('target', '_blank');
        activeEditingLink.setAttribute('rel', 'noopener noreferrer');
      } else {
        activeEditingLink.removeAttribute('target');
        activeEditingLink.removeAttribute('rel');
      }
    } else {
      if (visualEditor) visualEditor.focus();
      restoreSelection();

      const sel = window.getSelection();
      let range = (sel && sel.rangeCount > 0 && visualEditor.contains(sel.anchorNode)) ? sel.getRangeAt(0) : savedRange;

      const a = document.createElement('a');
      a.href = cleanUrl;
      if (isNewTab) {
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener noreferrer');
      }
      a.className = 'editor-article-link';
      a.textContent = text;

      if (range && !range.collapsed) {
        range.deleteContents();
        range.insertNode(a);
      } else if (range) {
        range.insertNode(a);
      } else if (visualEditor) {
        visualEditor.appendChild(a);
      }
    }

    closeLinkPopover();
    syncEditorContent();
    updateToolbarState();
    showToast('Hyperlink applied successfully!', 'ri-link');
  });

  linkRemoveBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (activeEditingLink) {
      const textNode = document.createTextNode(activeEditingLink.textContent);
      activeEditingLink.parentNode.replaceChild(textNode, activeEditingLink);
      closeLinkPopover();
      syncEditorContent();
      updateToolbarState();
      showToast('Link removed.', 'ri-link-unlink');
    }
  });

  linkCloseBtn?.addEventListener('click', closeLinkPopover);

  pillOpenBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPillLink && currentPillLink.href) {
      window.open(currentPillLink.href, '_blank');
    }
  });

  pillEditBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPillLink) {
      openLinkPopover(currentPillLink);
    }
  });

  pillUnlinkBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPillLink) {
      const textNode = document.createTextNode(currentPillLink.textContent);
      currentPillLink.parentNode.replaceChild(textNode, currentPillLink);
      hideLinkQuickPill();
      syncEditorContent();
      updateToolbarState();
      showToast('Link removed.', 'ri-link-unlink');
    }
  });

  visualEditor?.addEventListener('click', (e) => {
    const linkEl = e.target.closest('a');
    if (linkEl && visualEditor.contains(linkEl)) {
      e.preventDefault();
      showLinkQuickPill(linkEl);
    } else {
      hideLinkQuickPill();
    }
  });

  document.getElementById('toolbar-link-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    openLinkPopover();
  });

  // Text / HTML Mode Toggle Tabs
  const textModeBtn = document.getElementById('editor-mode-text-btn');
  const htmlModeBtn = document.getElementById('editor-mode-html-btn');

  textModeBtn?.addEventListener('click', () => {
    if (textareaContent && visualEditor) {
      visualEditor.innerHTML = textareaContent.value;
      visualEditor.style.display = 'block';
      if (toolbar) toolbar.style.display = 'flex';
      textareaContent.style.display = 'none';

      textModeBtn.style.background = '#2d3748';
      textModeBtn.style.color = '#ffffff';
      htmlModeBtn.style.background = 'transparent';
      htmlModeBtn.style.color = '#4a5568';
      updateToolbarState();
    }
  });

  htmlModeBtn?.addEventListener('click', () => {
    if (textareaContent && visualEditor) {
      textareaContent.value = visualEditor.innerHTML;
      textareaContent.style.display = 'block';
      visualEditor.style.display = 'none';
      if (toolbar) toolbar.style.display = 'none';

      htmlModeBtn.style.background = '#2d3748';
      htmlModeBtn.style.color = '#ffffff';
      textModeBtn.style.background = 'transparent';
      textModeBtn.style.color = '#4a5568';
    }
  });

  // Add Media Button for Editor
  const mediaFileInput = document.getElementById('media-file-input');
  document.getElementById('editor-add-media-btn')?.addEventListener('click', () => {
    mediaFileInput?.click();
  });

  mediaFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Media file size exceeds 5MB limit.', 'ri-alert-line');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        const imgHtml = `<img src="${evt.target.result}" alt="Article Image" style="max-width: 100%; border-radius: 12px; margin: 16px 0; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" /><p></p>`;
        if (visualEditor && visualEditor.style.display !== 'none') {
          visualEditor.focus();
          restoreSelection();
          document.execCommand('insertHTML', false, imgHtml);
          syncEditorContent();
        } else if (textareaContent) {
          textareaContent.value += `\n${imgHtml}\n`;
        }
        showToast('Image inserted into article body!', 'ri-image-add-line');
      };
      reader.readAsDataURL(file);
    }
  });

  // Cover Image File Upload Handler
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
        showToast('Cover image loaded. Click Publish to save.', 'ri-check-line');
      };
      reader.readAsDataURL(file);
    }
  });

  // Author Avatar File Upload & URL Live Preview Handler
  const authorAvatarInput = document.getElementById('form-author-avatar');
  const authorAvatarPreview = document.getElementById('form-author-avatar-preview');
  const authorFileInput = document.getElementById('form-author-file-input');

  authorAvatarInput?.addEventListener('input', (e) => {
    if (authorAvatarPreview) {
      authorAvatarPreview.src = e.target.value || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80';
    }
  });

  authorFileInput?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Author image exceeds 5MB limit.', 'ri-alert-line');
        return;
      }
      const reader = new FileReader();
      reader.onload = function(evt) {
        if (authorAvatarInput) authorAvatarInput.value = evt.target.result;
        if (authorAvatarPreview) authorAvatarPreview.src = evt.target.result;
        showToast('Author photo uploaded!', 'ri-check-line');
      };
      reader.readAsDataURL(file);
    }
  });

  // Form Submit Handler
  const form = document.getElementById('blog-editor-form');
  form?.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Sync content from visual editor to textarea if visual mode is active
    if (visualEditor && visualEditor.style.display !== 'none' && textareaContent) {
      textareaContent.value = visualEditor.innerHTML;
    }

    const title = document.getElementById('form-title').value.trim();
    const category = document.getElementById('form-category').value.trim();
    const slug = document.getElementById('form-slug').value.trim();
    const author = document.getElementById('form-author')?.value.trim() || 'Admin';
    const authorRole = '';
    const authorBio = '';
    const authorSocial = '';
    const authorAvatar = '';
    const date = document.getElementById('form-date').value.trim();
    const image = document.getElementById('form-image').value.trim();
    const excerpt = document.getElementById('form-excerpt').value.trim();
    const metaTitle = (document.getElementById('form-meta-title')?.value.trim()) || (title ? `${title} | Thanjai Property` : '');
    const metaDescription = (document.getElementById('form-meta-desc')?.value.trim()) || excerpt || '';
    const content = document.getElementById('form-content').value.trim();

    if (!title || !category || !content) {
      showToast('Please complete all required fields.', 'ri-alert-line');
      return;
    }

    const post = cmsState.editingPostId ? getBlogPosts().find(p => p.id === cmsState.editingPostId) : null;

    const payload = {
      title,
      category: category || 'Market Guide',
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
      author: author || 'Thanjai Editorial Desk',
      authorRole: authorRole || '',
      authorBio: authorBio || '',
      authorSocial: authorSocial || '',
      authorAvatar: authorAvatar || (post && post.authorAvatar ? post.authorAvatar : `https://ui-avatars.com/api/?name=${encodeURIComponent(author || 'Thanjai Desk')}&background=2A1808&color=F8F4EC`),
      date: date || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      image: image || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80',
      excerpt: excerpt || title,
      metaTitle: metaTitle || `${title} | Thanjai Property`,
      metaDescription: metaDescription || excerpt || 'Expert real estate guides and market insights from Thanjai Property.',
      content
    };

    try {
      if (cmsState.editingPostId) {
        // Assume update is still fire-and-forget for now, or we can make it async too later.
        updateBlogPost(cmsState.editingPostId, payload);
        showToast('Article updated successfully!', 'ri-checkbox-circle-line');
      } else {
        showToast('Publishing to database...', 'ri-loader-4-line');
        await addBlogPost(payload);
        showToast('Article published to public website!', 'ri-checkbox-circle-fill');
      }

      cmsState.isFormOpen = false;
      cmsState.editingPostId = null;
      refreshView();
    } catch (err) {
      showToast('Database Error: Image or content might be too large.', 'ri-error-warning-line');
    }
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
