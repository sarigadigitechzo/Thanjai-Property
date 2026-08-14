import { BLOG_POSTS } from '../data/blog.js';

export function renderBlogSection(onNavigateToBlog, onSelectPost) {
  const recentPosts = BLOG_POSTS.slice(0, 3);

  return `
    <section class="blog-home-section" id="home-blog-section" style="padding: 90px 0; background: #faf8f5; border-top: 1px solid rgba(0,0,0,0.05);">
      <div class="container">
        
        <!-- Section Header -->
        <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 44px; flex-wrap: wrap; gap: 20px;">
          <div>
            <span class="eyebrow" style="color: var(--color-orange, #eb5e28); font-weight: 800; letter-spacing: 0.12em;">INSIGHTS & MARKET GUIDES</span>
            <h2 class="heading-section" style="margin-top: 10px;">
              From Our Blog
            </h2>
          </div>

          <button class="btn btn-outline-dark explore-blog-nav-btn" id="home-explore-blog-btn" style="display: inline-flex; align-items: center; gap: 8px;">
            <span>Explore All Articles</span>
            <i class="ri-arrow-right-line"></i>
          </button>
        </div>

        <!-- 3 Cards Grid -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 28px;">
          ${recentPosts.map(post => `
            <article class="blog-card hover-lift" data-id="${post.id}" style="
              background: #ffffff;
              border-radius: 16px;
              overflow: hidden;
              border: 1px solid rgba(0,0,0,0.07);
              box-shadow: 0 4px 18px rgba(0,0,0,0.03);
              display: flex;
              flex-direction: column;
              cursor: pointer;
              transition: transform 0.3s ease, box-shadow 0.3s ease;
            ">
              <div style="position: relative; width: 100%; height: 210px; overflow: hidden; background: #1a1a1a;">
                <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease;" />
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
                  <i class="ri-arrow-right-line" style="transition: transform 0.2s;"></i>
                </div>
              </div>
            </article>
          `).join('')}
        </div>

      </div>
    </section>
  `;
}

export function initBlogSectionListeners(onNavigateToBlog, onSelectPost) {
  document.getElementById('home-explore-blog-btn')?.addEventListener('click', onNavigateToBlog);

  document.querySelectorAll('.blog-card').forEach(card => {
    card.addEventListener('click', () => {
      const id = card.dataset.id;
      if (id && onSelectPost) {
        onSelectPost(id);
      }
    });
  });
}
