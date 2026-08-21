import { getBlogPosts, getBlogPostByIdOrSlug } from '../utils/blogStore.js';

export function renderBlogView(blogState, onSelectPost, onNavigateToContact) {
  const allPosts = getBlogPosts();

  // If an article is selected, render the article detail reader view
  if (blogState.selectedPostId) {
    const post = getBlogPostByIdOrSlug(blogState.selectedPostId);
    if (post) {
      return renderArticleDetailView(post, onNavigateToContact, allPosts);
    }
  }

  // Otherwise render the Blog listing page
  const filteredPosts = filterBlogPosts(blogState, allPosts);
  const featuredPost = filteredPosts[0] || allPosts[0];
  const remainingPosts = filteredPosts.length > 1 ? filteredPosts.slice(1) : [];

  return `
    <div class="page-view view-enter blog-page">
      
      <!-- HERO -->
      <section style="
        padding: 120px 0 60px 0;
        background: linear-gradient(135deg, #1c1007 0%, #2a1808 60%, #150b04 100%);
        color: #ffffff; text-align: center; position: relative; overflow: hidden;
      ">
        <div class="container" style="max-width: 800px; position: relative; z-index: 2;">
          <span class="badge badge-orange" style="font-weight: 800; letter-spacing: 0.12em; margin-bottom: 16px;">
            REAL-ESTATE INSIGHTS
          </span>
          <h1 class="heading-display-light" style="font-size: clamp(2.2rem, 4.5vw, 3.8rem); color: #ffffff; margin-bottom: 12px;">
            Real-Estate Insights & Property Guides
          </h1>
          <div style="font-size: 1.05rem; font-weight: 700; color: rgba(255,255,255,0.9); margin-bottom: 14px;">Learn Before You Buy, Sell or Invest</div>
          <p style="font-size: 1.02rem; color: rgba(255, 255, 255, 0.85); line-height: 1.65; max-width: 720px; margin: 0 auto;">
            Read property guides, legal tips, local market insights and real-estate checklists to make informed property decisions across Tamil Nadu.
          </p>
        </div>
      </section>

      <!-- SEARCH BAR SECTION -->
      <section style="padding: 20px 0; background: #faf8f5; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <div class="container" style="display: flex; justify-content: flex-end; align-items: center;">
          <!-- Quick Search -->
          <div style="position: relative; width: 320px;">
            <i class="ri-search-line" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888;"></i>
            <input 
              type="text" 
              id="blog-search-input" 
              value="${blogState.keyword || ''}" 
              placeholder="Search articles or topics..." 
              style="
                width: 100%; padding: 10px 14px 10px 40px; font-size: 0.9rem; border-radius: 20px;
                border: 1px solid #cbd5e0; background: #ffffff; outline: none; transition: border-color 0.2s;
              "
            />
          </div>
        </div>
      </section>

      <!-- ARTICLES CATALOG CONTAINER -->
      <section style="padding: 60px 0 90px 0; background: #ffffff;">
        <div class="container" style="max-width: 1140px;">
          
          ${filteredPosts.length > 0 ? `
            
            <!-- FEATURED MAIN ARTICLE BANNER -->
            ${featuredPost ? `
              <article class="featured-blog-card hover-lift" data-id="${featuredPost.id}" data-slug="${featuredPost.slug || ''}" style="
                background: #ffffff; border-radius: 24px; overflow: hidden;
                border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 12px 36px rgba(0,0,0,0.06);
                display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                margin-bottom: 50px; cursor: pointer; transition: all 0.3s ease;
              ">
                <div style="position: relative; min-height: 360px; background: #0f172a; overflow: hidden;">
                  <img src="${featuredPost.image}" alt="${featuredPost.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                  <span class="badge badge-orange" style="position: absolute; top: 20px; left: 20px; font-weight: 800; letter-spacing: 0.05em;">
                    FEATURED • ${featuredPost.category}
                  </span>
                </div>

                <div style="padding: 44px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: #718096; font-weight: 700; margin-bottom: 16px;">
                    <span><i class="ri-calendar-line" style="color: #eb5e28;"></i> ${featuredPost.date}</span>
                    <span>•</span>
                    <span><i class="ri-time-line" style="color: #eb5e28;"></i> ${featuredPost.readTime}</span>
                  </div>

                  <h2 style="font-family: var(--font-serif); font-size: clamp(1.6rem, 3vw, 2.2rem); font-weight: 800; color: #1A202C; line-height: 1.3; margin-bottom: 16px;">
                    ${featuredPost.title}
                  </h2>

                  <p style="font-size: 1.02rem; color: #4A5568; line-height: 1.65; margin-bottom: 28px;">
                    ${featuredPost.excerpt}
                  </p>

                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 20px; border-top: 1px solid #EDF2F7;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <img src="${featuredPost.authorAvatar}" alt="${featuredPost.author}" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #E2E8F0;" />
                      <div>
                        <div style="font-size: 0.9rem; font-weight: 800; color: #1A202C;">${featuredPost.author}</div>
                        <div style="font-size: 0.78rem; color: #718096;">Editorial Contributor</div>
                      </div>
                    </div>

                    <div style="font-size: 0.88rem; color: #eb5e28; font-weight: 800; display: inline-flex; align-items: center; gap: 6px;">
                      Read Article <i class="ri-arrow-right-line"></i>
                    </div>
                  </div>
                </div>
              </article>
            ` : ''}

            <!-- PREMIER GRID FOR ALL REMAINING ARTICLES -->
            ${remainingPosts.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(330px, 1fr)); gap: 32px;">
                ${remainingPosts.map(post => `
                  <article class="blog-card hover-lift" data-id="${post.id}" data-slug="${post.slug || ''}" style="
                    background: #ffffff; border-radius: 20px; overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 6px 20px rgba(0,0,0,0.04);
                    display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease;
                  ">
                    <div style="position: relative; width: 100%; height: 230px; overflow: hidden; background: #0f172a;">
                      <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                      <span class="badge badge-orange" style="position: absolute; top: 16px; left: 16px; font-size: 0.75rem; font-weight: 800;">
                        ${post.category}
                      </span>
                    </div>

                    <div style="padding: 24px; display: flex; flex-direction: column; flex: 1;">
                      <div style="display: flex; align-items: center; gap: 12px; font-size: 0.82rem; color: #718096; font-weight: 700; margin-bottom: 12px;">
                        <span><i class="ri-calendar-line" style="color: #eb5e28;"></i> ${post.date}</span>
                        <span>•</span>
                        <span><i class="ri-time-line" style="color: #eb5e28;"></i> ${post.readTime}</span>
                      </div>

                      <h3 style="font-family: var(--font-serif); font-size: 1.3rem; font-weight: 800; color: #1A202C; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.title}
                      </h3>

                      <p style="font-size: 0.92rem; color: #4A5568; line-height: 1.6; margin-bottom: 24px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.excerpt}
                      </p>

                      <div style="margin-top: auto; display: flex; align-items: center; justify-content: space-between; padding-top: 16px; border-top: 1px solid #F1F5F9;">
                        <div style="display: flex; align-items: center; gap: 8px;">
                          <img src="${post.authorAvatar}" alt="${post.author}" style="width: 28px; height: 28px; border-radius: 50%;" />
                          <span style="font-size: 0.82rem; font-weight: 700; color: #4A5568;">${post.author}</span>
                        </div>

                        <div style="font-weight: 800; font-size: 0.88rem; color: #eb5e28; display: inline-flex; align-items: center; gap: 4px;">
                          Read Article <i class="ri-arrow-right-line"></i>
                        </div>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
            ` : ''}

          ` : `
            <!-- Empty State -->
            <div style="text-align: center; padding: 70px 20px; background: #faf8f5; border-radius: 20px; max-width: 500px; margin: 0 auto; border: 1px dashed #CBD5E0;">
              <i class="ri-file-search-line" style="font-size: 3.5rem; color: #a0aec0; margin-bottom: 14px; display: block;"></i>
              <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: #2d3748; margin-bottom: 8px;">No articles found</h3>
              <p style="color: #718096; font-size: 0.95rem; margin-bottom: 20px;">Try selecting another category filter or keyword query.</p>
              <button class="btn btn-primary" id="reset-blog-filter-btn" style="padding: 10px 24px; font-size: 0.88rem; font-weight: 800;">
                Show All Articles
              </button>
            </div>
          `}

        </div>
      </section>

    </div>
  `;
}

// Render dynamic Article Detail Reader View
function renderArticleDetailView(post, onNavigateToContact, allPosts) {
  const relatedPosts = (allPosts || getBlogPosts()).filter(p => p.id !== post.id && p.slug !== post.slug).slice(0, 3);

  return `
    <div class="page-view view-enter article-detail-page" style="padding-top: 110px; padding-bottom: 90px; background: #faf8f5;">
      <div class="container" style="max-width: 960px;">
        
        <!-- Back Navigation Button -->
        <button class="os-btn-secondary" id="back-to-blog-btn" style="margin-bottom: 28px; font-size: 0.9rem; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: #ffffff; border: 1px solid #E2E8F0; color: #4A5568; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <i class="ri-arrow-left-line" style="color: #eb5e28;"></i> Back to Blog & Legal Journal
        </button>

        <article style="
          background: #ffffff; border-radius: 24px; overflow: hidden;
          border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 16px 48px rgba(0,0,0,0.06);
        ">
          <!-- Article Header -->
          <div style="padding: 48px 48px 32px 48px;">
            <span class="badge badge-orange" style="font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 16px; display: inline-block;">
              ${post.category}
            </span>

            <h1 style="font-family: var(--font-serif); font-size: clamp(2rem, 4.5vw, 3.1rem); font-weight: 800; color: #1A202C; line-height: 1.25; margin-bottom: 24px;">
              ${post.title}
            </h1>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px; padding-bottom: 28px; border-bottom: 1px solid #EDF2F7;">
              <div style="display: flex; align-items: center; gap: 14px;">
                <img src="${post.authorAvatar}" alt="${post.author}" style="width: 48px; height: 48px; border-radius: 50%; border: 2px solid #E2E8F0;" />
                <div>
                  <div style="font-size: 1rem; font-weight: 800; color: #1A202C;">${post.author}</div>
                  <div style="font-size: 0.82rem; color: #718096;">Published on ${post.date}</div>
                </div>
              </div>

              <div style="font-size: 0.9rem; color: #4A5568; font-weight: 700; display: flex; align-items: center; gap: 8px; background: #F8FAFC; padding: 8px 16px; border-radius: 20px; border: 1px solid #E2E8F0;">
                <i class="ri-time-line" style="color: #eb5e28;"></i>
                <span>${post.readTime}</span>
              </div>
            </div>
          </div>

          <!-- Featured Image Banner -->
          <div style="width: 100%; height: 500px; overflow: hidden; background: #0f172a; position: relative;">
            <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <!-- Article Content Body -->
          <div class="article-body-text" style="padding: 48px; font-size: 1.12rem; color: #2D3748; line-height: 1.85;">
            <style>
              .article-body-text h1, .article-body-text h2, .article-body-text h3, .article-body-text h4, .article-body-text h5, .article-body-text h6 {
                font-family: var(--font-serif, serif);
                color: #1a202c;
                margin-top: 1.6em;
                margin-bottom: 0.6em;
                line-height: 1.3;
                font-weight: 800;
              }
              .article-body-text h1 { font-size: 2.2rem; }
              .article-body-text h2 { font-size: 1.8rem; }
              .article-body-text h3 { font-size: 1.5rem; }
              .article-body-text h4 { font-size: 1.3rem; }
              .article-body-text h5 { font-size: 1.15rem; }
              .article-body-text h6 { font-size: 1.05rem; }
              .article-body-text p { margin-bottom: 1.2em; line-height: 1.8; }
              .article-body-text a { color: #eb5e28; text-decoration: underline; font-weight: 700; word-break: break-word; }
              .article-body-text a:hover { color: #c84919; }
              .article-body-text table, .article-body-text .blog-table {
                width: 100%;
                border-collapse: collapse;
                margin: 24px 0;
                font-size: 0.95rem;
                border: 1px solid #cbd5e0;
                border-radius: 8px;
                overflow: hidden;
              }
              .article-body-text th {
                background: #f7fafc;
                border: 1px solid #cbd5e0;
                padding: 12px 16px;
                font-weight: 800;
                color: #1a202c;
                text-align: left;
              }
              .article-body-text td {
                border: 1px solid #cbd5e0;
                padding: 12px 16px;
                color: #2d3748;
              }
              .article-body-text tr:nth-child(even) {
                background: #faf8f5;
              }
              .article-body-text ul, .article-body-text ol {
                margin-bottom: 1.4em;
                padding-left: 24px;
              }
              .article-body-text li {
                margin-bottom: 0.4em;
                line-height: 1.7;
              }
            </style>
            ${post.content || `<p class="blog-lead">${post.excerpt}</p>`}
          </div>

          <!-- Bottom Senior Advisory CTA -->
          <div style="padding: 40px 48px; background: linear-gradient(135deg, #1C1007 0%, #2A1808 100%); color: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; box-shadow: 0 12px 30px rgba(0,0,0,0.15);">
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 1.65rem; color: #ffffff; margin-bottom: 6px; font-weight: 800;">
                Need Legal Title Guidance or Private Consultation?
              </h3>
              <p style="color: rgba(255,255,255,0.85); font-size: 0.96rem; margin: 0;">
                Speak directly with our senior Patta legal verification attorneys and investment specialists.
              </p>
            </div>
            <button class="btn btn-primary" id="article-contact-btn" style="padding: 14px 32px; font-size: 0.98rem; font-weight: 800;">
              <i class="ri-mail-send-line"></i> Contact Advisory Desk
            </button>
          </div>
        </article>

        <!-- Related Articles Grid -->
        ${relatedPosts.length > 0 ? `
          <div style="margin-top: 60px;">
            <h3 style="font-family: var(--font-serif); font-size: 1.6rem; font-weight: 800; margin-bottom: 24px; color: #1A202C;">
              Related Articles & Legal Guides
            </h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 28px;">
              ${relatedPosts.map(rel => `
                <article class="blog-card hover-lift" data-id="${rel.id}" data-slug="${rel.slug || ''}" style="
                  background: #ffffff; border-radius: 20px; overflow: hidden;
                  border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 18px rgba(0,0,0,0.04);
                  display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease;
                ">
                  <div style="position: relative; width: 100%; height: 180px; overflow: hidden; background: #0f172a;">
                    <img src="${rel.image}" alt="${rel.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                    <span class="badge badge-orange" style="position: absolute; top: 12px; left: 12px; font-size: 0.72rem; font-weight: 800;">
                      ${rel.category}
                    </span>
                  </div>
                  <div style="padding: 20px; display: flex; flex-direction: column; flex: 1;">
                    <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 800; color: #1A202C; margin-bottom: 10px; line-height: 1.35;">
                      ${rel.title}
                    </h4>
                    <span style="font-size: 0.85rem; color: #eb5e28; font-weight: 800; margin-top: auto; display: inline-flex; align-items: center; gap: 4px;">
                      Read Article <i class="ri-arrow-right-line"></i>
                    </span>
                  </div>
                </article>
              `).join('')}
            </div>
          </div>
        ` : ''}

      </div>
    </div>
  `;
}

function filterBlogPosts(state, allPosts) {
  const posts = allPosts || getBlogPosts();
  return posts.filter(post => {
    if (state.category && state.category !== 'all') {
      if (post.category !== state.category) return false;
    }
    if (state.keyword && state.keyword.trim() !== '') {
      const q = state.keyword.toLowerCase().trim();
      const matchTitle = (post.title || '').toLowerCase().includes(q);
      const matchExcerpt = (post.excerpt || '').toLowerCase().includes(q);
      const matchCat = (post.category || '').toLowerCase().includes(q);
      if (!matchTitle && !matchExcerpt && !matchCat) return false;
    }
    return true;
  });
}

export function initBlogListeners(blogState, onStateUpdate, onSelectPost, onNavigateToContact) {
  // Back button
  document.getElementById('back-to-blog-btn')?.addEventListener('click', () => {
    onSelectPost(null);
  });

  document.getElementById('article-contact-btn')?.addEventListener('click', onNavigateToContact);

  // Category filter pills
  document.querySelectorAll('#blog-category-pills .blog-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      blogState.category = btn.dataset.category || 'all';
      onStateUpdate(blogState);
    });
  });

  // Search input
  const searchInput = document.getElementById('blog-search-input');
  searchInput?.addEventListener('input', (e) => {
    blogState.keyword = e.target.value;
    onStateUpdate(blogState);
  });

  document.getElementById('reset-blog-filter-btn')?.addEventListener('click', () => {
    blogState.category = 'all';
    blogState.keyword = '';
    onStateUpdate(blogState);
  });

  // Blog cards click (matches by id or slug)
  document.querySelectorAll('.blog-card, .featured-blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const targetId = card.dataset.slug || card.dataset.id;
      if (targetId && onSelectPost) {
        onSelectPost(targetId);
      }
    });
  });
}
