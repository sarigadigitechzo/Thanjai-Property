import { BLOG_POSTS } from '../data/blog.js';

export function renderBlogView(blogState, onSelectPost, onNavigateToContact) {
  // If an article is selected, render the article detail reader view
  if (blogState.selectedPostId) {
    const post = BLOG_POSTS.find(p => p.id === blogState.selectedPostId);
    if (post) {
      return renderArticleDetailView(post, onNavigateToContact);
    }
  }

  // Otherwise render the Blog listing page
  const filteredPosts = filterBlogPosts(blogState);
  const featuredPost = filteredPosts[0] || BLOG_POSTS[0];
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
            INSIGHTS & MARKET PERSPECTIVES
          </span>
          <h1 class="heading-display-light" style="font-size: clamp(2.2rem, 4.5vw, 3.8rem); color: #ffffff; margin-bottom: 16px;">
            The Blog
          </h1>
          <p style="font-size: 1.1rem; color: rgba(255, 255, 255, 0.85); line-height: 1.6; max-width: 680px; margin: 0 auto;">
            Expert real estate guides, Patta legal verification checklists, architectural stories, and Kaveri delta property trends.
          </p>
        </div>
      </section>

      <!-- CATEGORY FILTERS & SEARCH -->
      <section style="padding: 30px 0; background: #faf8f5; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <div class="container" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
          
          <!-- Category Filter Pills -->
          <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="blog-category-pills">
            <button class="blog-pill-btn ${blogState.category === 'all' ? 'active' : ''}" data-category="all">
              All Articles (${BLOG_POSTS.length})
            </button>
            <button class="blog-pill-btn ${blogState.category === 'Legal & Patta' ? 'active' : ''}" data-category="Legal & Patta">
              Legal & Patta
            </button>
            <button class="blog-pill-btn ${blogState.category === 'Investment' ? 'active' : ''}" data-category="Investment">
              Investment
            </button>
            <button class="blog-pill-btn ${blogState.category === 'Architecture' ? 'active' : ''}" data-category="Architecture">
              Architecture
            </button>
            <button class="blog-pill-btn ${blogState.category === 'Market Guide' ? 'active' : ''}" data-category="Market Guide">
              Market Guide
            </button>
            <button class="blog-pill-btn ${blogState.category === 'NRI Guide' ? 'active' : ''}" data-category="NRI Guide">
              NRI Guide
            </button>
          </div>

          <!-- Quick Search -->
          <div style="position: relative; width: 260px;">
            <i class="ri-search-line" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: #888;"></i>
            <input 
              type="text" 
              id="blog-search-input" 
              value="${blogState.keyword || ''}" 
              placeholder="Search articles..." 
              style="
                width: 100%; padding: 8px 14px 8px 40px; font-size: 0.88rem; border-radius: 20px;
                border: 1px solid #cbd5e0; background: #ffffff; outline: none;
              "
            />
          </div>

        </div>
      </section>

      <!-- ARTICLES CONTAINER -->
      <section style="padding: 60px 0 90px 0; background: #ffffff;">
        <div class="container">
          
          ${filteredPosts.length > 0 ? `
            
            <!-- Featured Main Article Banner -->
            ${featuredPost ? `
              <article class="featured-blog-card hover-lift" data-id="${featuredPost.id}" style="
                background: #ffffff; border-radius: 24px; overflow: hidden;
                border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
                margin-bottom: 50px; cursor: pointer;
              ">
                <div style="position: relative; min-height: 320px; background: #111; overflow: hidden;">
                  <img src="${featuredPost.image}" alt="${featuredPost.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                  <span class="badge badge-orange" style="position: absolute; top: 20px; left: 20px; font-weight: 700;">
                    FEATURED • ${featuredPost.category}
                  </span>
                </div>

                <div style="padding: 40px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="display: flex; align-items: center; gap: 12px; font-size: 0.85rem; color: #777; margin-bottom: 16px;">
                    <span><i class="ri-calendar-line"></i> ${featuredPost.date}</span>
                    <span>•</span>
                    <span><i class="ri-time-line"></i> ${featuredPost.readTime}</span>
                  </div>

                  <h2 style="font-family: var(--font-serif); font-size: clamp(1.5rem, 3vw, 2.1rem); font-weight: 700; color: #1a1a1a; line-height: 1.3; margin-bottom: 16px;">
                    ${featuredPost.title}
                  </h2>

                  <p style="font-size: 1rem; color: #555; line-height: 1.65; margin-bottom: 24px;">
                    ${featuredPost.excerpt}
                  </p>

                  <div style="display: flex; align-items: center; gap: 12px; margin-top: auto;">
                    <img src="${featuredPost.authorAvatar}" alt="${featuredPost.author}" style="width: 36px; height: 36px; border-radius: 50%;" />
                    <div>
                      <div style="font-size: 0.88rem; font-weight: 700; color: #222;">${featuredPost.author}</div>
                      <div style="font-size: 0.78rem; color: var(--color-orange, #eb5e28); font-weight: 700; display: flex; align-items: center; gap: 4px;">
                        Read Full Article <i class="ri-arrow-right-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ` : ''}

            <!-- Secondary Grid for Remaining Articles -->
            ${remainingPosts.length > 0 ? `
              <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 32px;">
                ${remainingPosts.map(post => `
                  <article class="blog-card hover-lift" data-id="${post.id}" style="
                    background: #ffffff; border-radius: 20px; overflow: hidden;
                    border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 18px rgba(0,0,0,0.04);
                    display: flex; flex-direction: column; cursor: pointer; transition: all 0.3s ease;
                  ">
                    <div style="position: relative; width: 100%; height: 210px; overflow: hidden; background: #111;">
                      <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                      <span class="badge badge-orange" style="position: absolute; top: 16px; left: 16px; font-size: 0.75rem;">
                        ${post.category}
                      </span>
                    </div>

                    <div style="padding: 24px; display: flex; flex-direction: column; flex: 1;">
                      <div style="display: flex; align-items: center; gap: 12px; font-size: 0.82rem; color: #777; margin-bottom: 12px;">
                        <span><i class="ri-calendar-line"></i> ${post.date}</span>
                        <span>•</span>
                        <span><i class="ri-time-line"></i> ${post.readTime}</span>
                      </div>

                      <h3 style="font-family: var(--font-serif); font-size: 1.25rem; font-weight: 700; color: #1a1a1a; line-height: 1.4; margin-bottom: 12px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.title}
                      </h3>

                      <p style="font-size: 0.9rem; color: #666; line-height: 1.6; margin-bottom: 20px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                        ${post.excerpt}
                      </p>

                      <div style="margin-top: auto; display: flex; align-items: center; gap: 6px; font-weight: 700; font-size: 0.88rem; color: var(--color-orange, #eb5e28);">
                        <span>Read Article</span>
                        <i class="ri-arrow-right-line"></i>
                      </div>
                    </div>
                  </article>
                `).join('')}
              </div>
            ` : ''}

          ` : `
            <!-- Empty State -->
            <div style="text-align: center; padding: 70px 20px; background: #faf8f5; border-radius: 20px; max-width: 500px; margin: 0 auto;">
              <i class="ri-file-search-line" style="font-size: 3rem; color: #a0aec0; margin-bottom: 12px; display: block;"></i>
              <h3 style="font-family: var(--font-serif); font-size: 1.4rem; color: #2d3748; margin-bottom: 8px;">No articles found</h3>
              <p style="color: #718096; font-size: 0.9rem; margin-bottom: 20px;">Try selecting another category filter or search query.</p>
              <button class="btn btn-primary" id="reset-blog-filter-btn" style="padding: 10px 24px; font-size: 0.88rem;">
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
function renderArticleDetailView(post, onNavigateToContact) {
  const relatedPosts = BLOG_POSTS.filter(p => p.id !== post.id).slice(0, 2);

  return `
    <div class="page-view view-enter article-detail-page" style="padding-top: 100px; padding-bottom: 90px; background: #faf8f5;">
      <div class="container" style="max-width: 900px;">
        
        <!-- Back Navigation Button -->
        <button class="os-btn-secondary" id="back-to-blog-btn" style="margin-bottom: 28px; font-size: 0.9rem;">
          <i class="ri-arrow-left-line"></i> Back to Blog Articles
        </button>

        <article style="
          background: #ffffff; border-radius: 24px; overflow: hidden;
          border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 10px 40px rgba(0,0,0,0.06);
        ">
          <!-- Article Header -->
          <div style="padding: 44px 44px 28px 44px;">
            <span class="badge badge-orange" style="font-size: 0.8rem; margin-bottom: 16px; display: inline-block;">
              ${post.category}
            </span>

            <h1 style="font-family: var(--font-serif); font-size: clamp(2rem, 4vw, 3rem); font-weight: 700; color: #1a1a1a; line-height: 1.25; margin-bottom: 20px;">
              ${post.title}
            </h1>

            <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding-bottom: 24px; border-bottom: 1px solid rgba(0,0,0,0.08);">
              <div style="display: flex; align-items: center; gap: 12px;">
                <img src="${post.authorAvatar}" alt="${post.author}" style="width: 44px; height: 44px; border-radius: 50%;" />
                <div>
                  <div style="font-size: 0.95rem; font-weight: 700; color: #222;">${post.author}</div>
                  <div style="font-size: 0.82rem; color: #777;">Published on ${post.date}</div>
                </div>
              </div>

              <div style="font-size: 0.88rem; color: #666; display: flex; align-items: center; gap: 6px;">
                <i class="ri-time-line" style="color: var(--color-orange, #eb5e28);"></i>
                <span>${post.readTime}</span>
              </div>
            </div>
          </div>

          <!-- Featured Image -->
          <div style="width: 100%; max-height: 440px; overflow: hidden; background: #111;">
            <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;" />
          </div>

          <!-- Article Content Body -->
          <div class="article-body-text" style="padding: 44px; font-size: 1.1rem; color: #333; line-height: 1.8;">
            ${post.content}
          </div>

          <!-- Bottom Contact CTA -->
          <div style="padding: 36px 44px; background: #2A1808; color: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 20px;">
            <div>
              <h3 style="font-family: var(--font-serif); font-size: 1.5rem; color: #ffffff; margin-bottom: 4px;">
                Need Expert Real Estate Guidance?
              </h3>
              <p style="color: rgba(255,255,255,0.8); font-size: 0.95rem; margin: 0;">
                Speak with our senior legal advisors and property specialists today.
              </p>
            </div>
            <button class="btn btn-primary" id="article-contact-btn" style="padding: 12px 28px; font-size: 0.95rem;">
              <i class="ri-mail-send-line"></i> Contact Advisory Desk
            </button>
          </div>
        </article>

        <!-- Related Articles Grid -->
        ${relatedPosts.length > 0 ? `
          <div style="margin-top: 60px;">
            <h3 style="font-family: var(--font-serif); font-size: 1.5rem; margin-bottom: 24px; color: #1a1a1a;">Related Articles</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
              ${relatedPosts.map(rel => `
                <article class="blog-card hover-lift" data-id="${rel.id}" style="
                  background: #ffffff; border-radius: 20px; overflow: hidden;
                  border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 4px 18px rgba(0,0,0,0.04);
                  display: flex; flex-direction: column; cursor: pointer;
                ">
                  <div style="position: relative; width: 100%; height: 180px; overflow: hidden;">
                    <img src="${rel.image}" alt="${rel.title}" style="width: 100%; height: 100%; object-fit: cover;" />
                    <span class="badge badge-orange" style="position: absolute; top: 12px; left: 12px; font-size: 0.72rem;">
                      ${rel.category}
                    </span>
                  </div>
                  <div style="padding: 20px; display: flex; flex-direction: column; flex: 1;">
                    <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 700; color: #1a1a1a; margin-bottom: 8px;">
                      ${rel.title}
                    </h4>
                    <span style="font-size: 0.82rem; color: var(--color-orange, #eb5e28); font-weight: 700; margin-top: auto;">Read Article →</span>
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

function filterBlogPosts(state) {
  return BLOG_POSTS.filter(post => {
    if (state.category && state.category !== 'all') {
      if (post.category !== state.category) return false;
    }
    if (state.keyword && state.keyword.trim() !== '') {
      const q = state.keyword.toLowerCase().trim();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchExcerpt = post.excerpt.toLowerCase().includes(q);
      const matchCat = post.category.toLowerCase().includes(q);
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

  // Blog cards click
  document.querySelectorAll('.blog-card, .featured-blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id && onSelectPost) {
        onSelectPost(id);
      }
    });
  });
}
