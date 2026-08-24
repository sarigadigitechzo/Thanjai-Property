import { getBlogPosts, getBlogPostByIdOrSlug } from '../utils/blogStore.js';
import { addAuditLog } from '../utils/siteImagesStore.js';
import { showToast } from '../utils/toast.js';

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

      <!-- SEARCH BAR -->
      <section style="padding: 24px 0; background: #faf8f5; border-bottom: 1px solid rgba(0,0,0,0.06);">
        <div class="container" style="display: flex; justify-content: flex-end; align-items: center;">
          <!-- Search Input -->
          <div style="position: relative; width: 100%; max-width: 380px;">
            <i class="ri-search-line" style="position: absolute; left: 16px; top: 50%; transform: translateY(-50%); color: #718096; font-size: 1.05rem;"></i>
            <input 
              type="text" 
              id="blog-search-input" 
              value="${blogState.keyword || ''}" 
              placeholder="Search articles or topics..." 
              style="
                width: 100%; padding: 11px 42px 11px 44px; font-size: 0.92rem; border-radius: 24px;
                border: 1px solid #cbd5e0; background: #ffffff; outline: none; transition: border-color 0.2s;
                box-shadow: 0 2px 6px rgba(0,0,0,0.03);
              "
            />
            ${blogState.keyword ? `
              <button id="clear-blog-search-btn" title="Clear search" style="position: absolute; right: 14px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; color: #a0aec0; font-size: 1.1rem; display: flex; align-items: center; padding: 0;">
                <i class="ri-close-circle-fill"></i>
              </button>
            ` : ''}
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
                <div style="position: relative; aspect-ratio: 16/9; background: #0f172a; overflow: hidden; align-self: center; border-radius: 16px; margin: 24px; width: calc(100% - 48px); box-shadow: 0 4px 20px rgba(0,0,0,0.08);">
                  <img src="${featuredPost.image}" alt="${featuredPost.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
                  <span class="badge badge-orange" style="position: absolute; top: 20px; left: 20px; font-weight: 800; letter-spacing: 0.05em;">
                    FEATURED • ${featuredPost.category}
                  </span>
                </div>

                <div style="padding: 24px 32px; display: flex; flex-direction: column; justify-content: center;">
                  <div style="display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #718096; font-weight: 700; margin-bottom: 16px;">
                    <i class="ri-calendar-line" style="color: #eb5e28;"></i>
                    <span>Published on ${featuredPost.date}</span>
                  </div>

                  <h2 style="font-family: var(--font-serif); font-size: clamp(1.5rem, 2.8vw, 2rem); font-weight: 800; color: #1A202C; line-height: 1.3; margin-bottom: 12px;">
                    ${featuredPost.title}
                  </h2>

                  <p style="font-size: 0.96rem; color: #4A5568; line-height: 1.6; margin-bottom: 16px; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;">
                    ${featuredPost.excerpt}
                  </p>

                  <div style="display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: 20px; border-top: 1px solid #EDF2F7;">
                    <div style="display: flex; align-items: center; gap: 12px;">
                      <img src="${featuredPost.authorAvatar}" alt="${featuredPost.author}" style="width: 40px; height: 40px; border-radius: 50%; border: 1px solid #E2E8F0;" />
                      <div>
                        <div style="font-size: 0.9rem; font-weight: 800; color: #1A202C; display: flex; align-items: center; gap: 4px;">
                          ${featuredPost.author}
                          <i class="ri-verified-badge-fill" style="color: #eb5e28; font-size: 0.95rem;"></i>
                        </div>
                        <div style="font-size: 0.78rem; color: #718096;">Verified Legal Specialist</div>
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
                    <div style="position: relative; width: 100%; aspect-ratio: 16/9; max-height: 220px; overflow: hidden; background: #0f172a;">
                      <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
                      <span class="badge badge-orange" style="position: absolute; top: 16px; left: 16px; font-size: 0.75rem; font-weight: 800;">
                        ${post.category}
                      </span>
                    </div>

                    <div style="padding: 24px; display: flex; flex-direction: column; flex: 1;">
                      <div style="display: flex; align-items: center; gap: 8px; font-size: 0.82rem; color: #718096; font-weight: 700; margin-bottom: 12px;">
                        <i class="ri-calendar-line" style="color: #eb5e28;"></i>
                        <span>Published on ${post.date}</span>
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

function getAuthorDetails(name) {
  const n = (name || '').toLowerCase();
  if (n.includes('aishwarya')) {
    return {
      role: 'Senior Legal & Patta Verification Specialist',
      bio: 'Over 12 years of hands-on expertise in Tamil Nadu revenue administration, 30-year parent document tracing, and DTCP layout sanctions across Thanjavur & Trichy.'
    };
  } else if (n.includes('kavitha')) {
    return {
      role: 'Senior Investment & Capital Growth Analyst',
      bio: 'Specialist in central Tamil Nadu high-growth corridors, highway commercial plots, and real estate portfolio asset allocation.'
    };
  } else if (n.includes('vijay') || n.includes('ragavan')) {
    return {
      role: 'Managing Director, Thanjai Property',
      bio: 'Leading strategic land acquisitions, premium gated communities, and NRI property concierge services across Tamil Nadu since 2009.'
    };
  }
  return {
    role: 'Editorial Contributor & Property Specialist',
    bio: 'Dedicated real estate analyst at Thanjai Property, providing verified market intelligence and statutory compliance guidance for buyers and investors.'
  };
}

// Render dynamic Article Detail Reader View
function renderArticleDetailView(post, onNavigateToContact, allPosts) {
  const relatedPosts = (allPosts || getBlogPosts()).filter(p => p.id !== post.id && p.slug !== post.slug).slice(0, 3);
  const fallbackAuthor = getAuthorDetails(post.author);
  const authorRole = post.authorRole || fallbackAuthor.role;
  const authorBio = post.authorBio || fallbackAuthor.bio;
  const authorSocial = post.authorSocial || '';

  // --- TOC Generation Logic (H2 Main Sections, H3-H6 Subheadings) ---
  let rawContent = post.content || `<p class="blog-lead">${post.excerpt}</p>`;
  let tocItems = [];
  const headingRegex = /<(h[2-6])([^>]*)>(.*?)<\/\1>/gi;
  let match;
  let headingCounter = 0;
  
  while ((match = headingRegex.exec(rawContent)) !== null) {
    const level = match[1].toLowerCase();
    const rawText = match[3].replace(/<[^>]+>/g, '').trim();
    if (!rawText) continue;
    headingCounter++;
    const slug = rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `section-${headingCounter}`;
    tocItems.push({ level, text: rawText, id: slug });
  }

  let finalContent = rawContent.replace(/<(h[2-6])([^>]*)>(.*?)<\/\1>/gi, (m, tag, attrs, text) => {
    const rawText = text.replace(/<[^>]+>/g, '').trim();
    const slug = rawText.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || `section`;
    return `<${tag} id="${slug}"${attrs} style="scroll-margin-top: 110px;">${text}</${tag}>`;
  });

  const renderTocList = () => {
    let mainH2Index = 0;
    return tocItems.map(item => {
      // Strip any existing leading numbers from heading text (e.g. "1. Understanding..." -> "Understanding...")
      const cleanText = item.text.replace(/^\d+[\.\)\-\s]+/, '').trim();

      if (item.level === 'h2') {
        mainH2Index++;
        return `
          <li style="margin-top: 14px; margin-bottom: 8px;">
            <a href="#${item.id}" class="toc-link toc-h2" style="color: #1a202c; text-decoration: none; font-weight: 800; font-size: 0.92rem; display: flex; align-items: flex-start; gap: 8px; transition: all 0.2s ease;">
              <span style="color: #eb5e28; font-weight: 800; min-width: 20px;">${mainH2Index}.</span>
              <span>${cleanText}</span>
            </a>
          </li>
        `;
      } else if (item.level === 'h3') {
        return `
          <li style="margin-bottom: 6px; padding-left: 28px; border-left: 2px solid #EDF2F7; margin-left: 8px;">
            <a href="#${item.id}" class="toc-link toc-h3" style="color: #4a5568; text-decoration: none; font-weight: 600; font-size: 0.85rem; display: inline-block; transition: all 0.2s ease;">
              <i class="ri-corner-down-right-line" style="color: #a0aec0; margin-right: 4px; font-size: 0.75rem;"></i>${cleanText}
            </a>
          </li>
        `;
      } else {
        const indentPx = item.level === 'h4' ? '38px' : '48px';
        return `
          <li style="margin-bottom: 4px; padding-left: ${indentPx}; border-left: 2px solid #F1F5F9; margin-left: 8px;">
            <a href="#${item.id}" class="toc-link toc-sub" style="color: #718096; text-decoration: none; font-weight: 500; font-size: 0.8rem; display: inline-block; transition: all 0.2s ease;">
              • ${cleanText}
            </a>
          </li>
        `;
      }
    }).join('');
  };

  const tocSidebarHtml = tocItems.length > 0 ? `
    <aside class="desktop-toc-sidebar" style="width: 280px; flex-shrink: 0;">
       <div style="position: sticky; top: 110px; background: #ffffff; padding: 22px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 12px 36px rgba(0,0,0,0.05); max-height: calc(100vh - 140px); overflow-y: auto;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding-bottom: 12px; border-bottom: 2px solid #eb5e28;">
            <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: #1a202c; font-weight: 800; margin: 0; display: flex; align-items: center; gap: 8px;">
              <i class="ri-list-check-2" style="color: #eb5e28;"></i> Table of Contents
            </h3>
            <span style="font-size: 0.75rem; font-weight: 800; color: #eb5e28; background: rgba(235,94,40,0.1); padding: 3px 8px; border-radius: 12px;">${tocItems.length} items</span>
          </div>
          <ul style="list-style: none; padding: 0; margin: 0; line-height: 1.5;">
            ${renderTocList()}
          </ul>
       </div>
    </aside>
  ` : '';

  // Mobile In-Article TOC Collapsible Card
  const mobileTocHtml = tocItems.length > 0 ? `
    <div class="mobile-toc-box" style="margin-bottom: 32px; background: #faf8f5; border: 1px solid #e2e8f0; border-radius: 14px; padding: 18px 20px;">
      <details>
        <summary style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 800; color: #1a202c; cursor: pointer; display: flex; align-items: center; justify-content: space-between; user-select: none;">
          <span style="display: flex; align-items: center; gap: 8px;"><i class="ri-list-check-2" style="color: #eb5e28;"></i> Table of Contents (${tocItems.length} sections)</span>
          <i class="ri-arrow-down-s-line" style="color: #eb5e28; font-size: 1.25rem;"></i>
        </summary>
        <ul style="list-style: none; padding: 14px 0 0 0; margin: 0; border-top: 1px solid #e2e8f0; margin-top: 12px;">
          ${renderTocList()}
        </ul>
      </details>
    </div>
  ` : '';

  return `
    <div class="page-view view-enter article-detail-page" style="padding-top: 110px; padding-bottom: 90px; background: #faf8f5;">
      <div class="container" style="max-width: 1420px; margin: 0 auto; padding: 0 20px;">
        
        <!-- Back Navigation Button -->
        <button class="os-btn-secondary" id="back-to-blog-btn" style="margin-bottom: 24px; font-size: 0.9rem; padding: 10px 20px; border-radius: 10px; font-weight: 700; background: #ffffff; border: 1px solid #E2E8F0; color: #4A5568; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.04);">
          <i class="ri-arrow-left-line" style="color: #eb5e28;"></i> Back to Blog & Legal Journal
        </button>

        <!-- 3-Column Layout: Advisory Pitch (Left) + Main Article (Center) + Table of Contents (Right) -->
        <div class="article-page-three-col" style="display: flex; gap: 28px; align-items: flex-start; position: relative;">
          
          <!-- LEFT COLUMN: Sticky Confidential Legal & Property Advisory Desk Form -->
          <aside class="desktop-advisory-sidebar" style="width: 290px; flex-shrink: 0;">
            <div style="position: sticky; top: 110px; background: #ffffff; padding: 22px; border-radius: 20px; border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 12px 36px rgba(0,0,0,0.05);">
              <div style="margin-bottom: 14px; padding-bottom: 12px; border-bottom: 2px solid #eb5e28;">
                <div style="display: flex; align-items: center; gap: 6px; font-size: 0.74rem; font-weight: 800; color: #eb5e28; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px;">
                  <i class="ri-shield-check-line"></i> Confidential Advisory
                </div>
                <h3 style="font-family: var(--font-serif); font-size: 1.15rem; color: #1a202c; font-weight: 800; margin: 0; line-height: 1.3;">
                  Direct Property & Legal Consultation
                </h3>
                <p style="font-size: 0.76rem; color: #718096; margin: 4px 0 0 0;">
                  Direct response from S. Vijayaraghavan (MD) & Senior Legal Desk
                </p>
              </div>

              <form id="blog-advisory-form" style="display: flex; flex-direction: column; gap: 11px;">
                <input type="hidden" id="baf-article-title" value="${post.title}" />
                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 4px;">Your Full Name *</label>
                  <input type="text" id="baf-name" required placeholder="e.g. Anand Kumar" style="width: 100%; padding: 8px 12px; font-size: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
                </div>

                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 4px;">Phone / WhatsApp *</label>
                  <input type="tel" id="baf-phone" required pattern="[0-9]{10}" maxlength="10" placeholder="10-digit mobile number" style="width: 100%; padding: 8px 12px; font-size: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e0;" oninput="this.value = this.value.replace(/[^0-9]/g, '')" />
                </div>

                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 4px;">Email Address</label>
                  <input type="email" id="baf-email" placeholder="you@example.com" style="width: 100%; padding: 8px 12px; font-size: 0.85rem; border-radius: 8px; border: 1px solid #cbd5e0;" />
                </div>

                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 4px;">Requirement Type</label>
                  <select id="baf-requirement" style="width: 100%; padding: 8px 10px; font-size: 0.82rem; border-radius: 8px; border: 1px solid #cbd5e0; background: #fff; font-weight: 600; color: #2d3748;">
                    <option value="Patta & Title Verification">Patta & Title Deed Verification</option>
                    <option value="DTCP / Layout Plots Buying">DTCP Approved Layout Plots</option>
                    <option value="Luxury Villa Consultation">Luxury Villa / House Consultation</option>
                    <option value="Agricultural Farmland">Cauvery Delta Farmland</option>
                    <option value="NRI Property Advisory">NRI Land & Power of Attorney</option>
                    <option value="General Property Brief">General Property Advisory</option>
                  </select>
                </div>

                <div>
                  <label style="font-size: 0.75rem; font-weight: 700; color: #4a5568; display: block; margin-bottom: 4px;">Specific Query (Optional)</label>
                  <textarea id="baf-message" rows="2" placeholder="Brief requirements or survey #..." style="width: 100%; padding: 8px 12px; font-size: 0.82rem; border-radius: 8px; border: 1px solid #cbd5e0; font-family: inherit;"></textarea>
                </div>

                <button type="submit" id="baf-submit-btn" style="background: #eb5e28; color: #ffffff; padding: 10px 16px; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 6px; box-shadow: 0 4px 12px rgba(235,94,40,0.25); transition: all 0.2s ease;">
                  <span>Request Consultation</span>
                  <i class="ri-arrow-right-line"></i>
                </button>

                <div id="baf-success-msg" style="display: none; background: #f0fff4; border: 1px solid #c6f6d5; border-radius: 8px; padding: 10px; text-align: center;">
                  <i class="ri-checkbox-circle-fill" style="color: #38a169; font-size: 1.2rem;"></i>
                  <div style="font-size: 0.82rem; font-weight: 800; color: #22543d; margin-top: 2px;">Consultation Requested!</div>
                  <div style="font-size: 0.74rem; color: #2f855a;">S. Vijayaraghavan & senior team will reach out directly.</div>
                </div>

                <div style="display: flex; align-items: center; justify-content: center; gap: 4px; font-size: 0.72rem; color: #a0aec0; margin-top: 2px;">
                  <i class="ri-lock-line"></i> 100% Confidential • vijayaraghavan@thanjaiproperty.com
                </div>
              </form>
            </div>
          </aside>

          <!-- CENTER COLUMN: Main White Blog Article Box -->
          <article style="
            flex: 1; min-width: 0;
            background: #ffffff; border-radius: 24px; overflow: hidden;
            border: 1px solid rgba(0,0,0,0.08); box-shadow: 0 16px 48px rgba(0,0,0,0.06);
          ">
            <!-- Article Header -->
            <div style="padding: 40px 44px 24px 44px;">
              <span class="badge badge-orange" style="font-size: 0.82rem; font-weight: 800; letter-spacing: 0.08em; margin-bottom: 16px; display: inline-block;">
                ${post.category}
              </span>

              <h1 style="font-family: var(--font-serif); font-size: clamp(1.85rem, 3.5vw, 2.6rem); font-weight: 800; color: #1A202C; line-height: 1.25; margin-bottom: 20px;">
                ${post.title}
              </h1>

              <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; padding-bottom: 20px; border-bottom: 1px solid #EDF2F7;">
                <div style="display: flex; align-items: center; gap: 14px;">
                  <img src="${post.authorAvatar}" alt="${post.author}" style="width: 46px; height: 46px; border-radius: 50%; border: 2px solid #eb5e28;" />
                  <div>
                    <div style="font-size: 0.96rem; font-weight: 800; color: #1A202C; display: flex; align-items: center; gap: 5px;">
                      ${post.author}
                      <i class="ri-verified-badge-fill" style="color: #eb5e28; font-size: 1.05rem;" title="Verified Legal & Property Contributor"></i>
                    </div>
                    <div style="font-size: 0.78rem; font-weight: 600; color: #718096;">
                      ${authorRole}
                    </div>
                  </div>
                </div>

                <div style="font-size: 0.85rem; color: #718096; font-weight: 700; display: flex; align-items: center; gap: 6px;">
                  <i class="ri-calendar-check-line" style="color: #eb5e28; font-size: 1rem;"></i>
                  <span>Published on ${post.date}</span>
                </div>
              </div>
            </div>

            <!-- Featured Image Banner (Consistent 16/9 Ratio without Distortion) -->
            <div style="width: calc(100% - 56px); aspect-ratio: 16/9; max-height: 440px; overflow: hidden; background: #0f172a; position: relative; margin: 16px auto 28px auto; border-radius: 18px; box-shadow: 0 10px 36px rgba(0,0,0,0.08);">
              <img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center; display: block;" />
            </div>

            <!-- Article Content Body -->
            <div style="padding: 0 44px 36px 44px;">
              <div class="article-body-text" style="font-size: 1.08rem; color: #2D3748; line-height: 1.85;">
                <style>
                  .article-body-text h1, .article-body-text h2, .article-body-text h3, .article-body-text h4, .article-body-text h5, .article-body-text h6 {
                    font-family: var(--font-serif, serif);
                    color: #1a202c;
                    margin-top: 1.5em;
                    margin-bottom: 0.5em;
                    line-height: 1.3;
                    font-weight: 800;
                  }
                  .article-body-text h1 { font-size: 2.1rem; }
                  .article-body-text h2 { font-size: 1.7rem; }
                  .article-body-text h3 { font-size: 1.4rem; }
                  .article-body-text h4 { font-size: 1.22rem; }
                  .article-body-text h5 { font-size: 1.12rem; }
                  .article-body-text h6 { font-size: 1.02rem; }
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
                  .article-body-text blockquote {
                    border-left: 4px solid #eb5e28;
                    padding: 14px 20px;
                    margin: 24px 0;
                    background: #faf8f5;
                    font-style: italic;
                    color: #4a5568;
                    border-radius: 0 10px 10px 0;
                  }
                </style>
                ${mobileTocHtml}
                ${finalContent}
              </div>

              <!-- Enhanced Author Bio & Credentials Profile Card -->
              <div style="margin-top: 48px; padding: 24px; background: #faf8f5; border: 1px solid #e2e8f0; border-radius: 16px; display: flex; gap: 20px; align-items: center; flex-wrap: wrap;">
                <img src="${post.authorAvatar}" alt="${post.author}" style="width: 64px; height: 64px; border-radius: 50%; border: 2px solid #eb5e28; flex-shrink: 0;" />
                <div style="flex: 1; min-width: 220px;">
                  <div style="font-size: 0.75rem; font-weight: 800; color: #eb5e28; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 2px;">
                    Written By • Verified Real Estate Specialist
                  </div>
                  <div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;">
                    <div style="font-size: 1.1rem; font-weight: 800; color: #1a202c; display: flex; align-items: center; gap: 6px;">
                      ${post.author}
                      <i class="ri-verified-badge-fill" style="color: #eb5e28; font-size: 1.1rem;"></i>
                    </div>
                    ${authorSocial ? `
                      <a href="${authorSocial.startsWith('http') || authorSocial.startsWith('+') ? (authorSocial.startsWith('+') ? `https://wa.me/${authorSocial.replace(/[^0-9]/g, '')}` : authorSocial) : `https://${authorSocial}`}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; gap: 5px; font-size: 0.8rem; font-weight: 700; color: #25D366; background: rgba(37,211,102,0.1); padding: 4px 12px; border-radius: 20px; text-decoration: none; border: 1px solid rgba(37,211,102,0.25);">
                        <i class="${authorSocial.includes('linkedin') ? 'ri-linkedin-box-fill' : (authorSocial.includes('wa.me') || authorSocial.startsWith('+') || /^[0-9\s\+]+$/.test(authorSocial) ? 'ri-whatsapp-line' : 'ri-links-line')}"></i>
                        <span>${authorSocial.includes('linkedin') ? 'LinkedIn' : (authorSocial.includes('wa.me') || authorSocial.startsWith('+') || /^[0-9\s\+]+$/.test(authorSocial) ? 'Direct WhatsApp' : 'Contact Author')}</span>
                      </a>
                    ` : ''}
                  </div>
                  <div style="font-size: 0.85rem; font-weight: 700; color: #4a5568; margin-bottom: 6px; margin-top: 2px;">
                    ${authorRole}
                  </div>
                  <p style="font-size: 0.86rem; color: #718096; margin: 0; line-height: 1.55;">
                    ${authorBio}
                  </p>
                </div>
              </div>
            </div>

            <!-- Bottom Senior Advisory CTA -->
            <div style="padding: 36px 44px; background: linear-gradient(135deg, #1C1007 0%, #2A1808 100%); color: #ffffff; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 24px; box-shadow: 0 12px 30px rgba(0,0,0,0.15);">
              <div>
                <h3 style="font-family: var(--font-serif); font-size: 1.55rem; color: #ffffff; margin-bottom: 6px; font-weight: 800;">
                  Need Legal Title Guidance or Private Consultation?
                </h3>
                <p style="color: rgba(255,255,255,0.85); font-size: 0.94rem; margin: 0;">
                  Speak directly with S. Vijayaraghavan (MD) & senior Patta legal verification specialists.
                </p>
              </div>
              <button class="btn btn-primary" id="article-contact-btn" style="padding: 12px 28px; font-size: 0.95rem; font-weight: 800;">
                <i class="ri-mail-send-line"></i> Contact Advisory Desk
              </button>
            </div>
          </article>

          <!-- RIGHT COLUMN: Sticky Table of Contents Sidebar -->
          ${tocSidebarHtml}
        </div>

        <style>
          .toc-link:hover {
            color: #eb5e28 !important;
            transform: translateX(4px);
          }
          @media (max-width: 1199px) {
            .desktop-advisory-sidebar, .desktop-toc-sidebar { display: none !important; }
            .article-page-three-col { display: block !important; }
          }
          @media (min-width: 1200px) {
            .mobile-toc-box { display: none !important; }
          }
        </style>

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
                  <div style="position: relative; width: 100%; aspect-ratio: 16/9; max-height: 200px; overflow: hidden; background: #0f172a;">
                    <img src="${rel.image}" alt="${rel.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: center;" />
                    <span class="badge badge-orange" style="position: absolute; top: 12px; left: 12px; font-size: 0.72rem; font-weight: 800;">
                      ${rel.category}
                    </span>
                  </div>
                  <div style="padding: 20px; display: flex; flex-direction: column; flex: 1;">
                    <div style="display: flex; align-items: center; gap: 6px; font-size: 0.78rem; color: #718096; margin-bottom: 8px;">
                      <i class="ri-calendar-line" style="color: #eb5e28;"></i>
                      <span>${rel.date}</span>
                    </div>
                    <h4 style="font-family: var(--font-serif); font-size: 1.15rem; font-weight: 800; color: #1A202C; margin-bottom: 10px; line-height: 1.35;">
                      ${rel.title}
                    </h4>
                    <span style="font-size: 0.85rem; color: #eb5e28; font-weight: 800; margin-top: auto; display: inline-flex; align-items: center; gap: 4px;">
                      Read Guide <i class="ri-arrow-right-line"></i>
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
  if (!state.keyword || state.keyword.trim() === '') {
    return posts;
  }
  const q = state.keyword.toLowerCase().trim();
  return posts.filter(post => {
    const matchTitle = (post.title || '').toLowerCase().includes(q);
    const matchExcerpt = (post.excerpt || '').toLowerCase().includes(q);
    const matchCat = (post.category || '').toLowerCase().includes(q);
    const matchAuthor = (post.author || '').toLowerCase().includes(q);
    const matchRole = (post.authorRole || '').toLowerCase().includes(q);
    const matchContent = (post.content || '').replace(/<[^>]+>/g, '').toLowerCase().includes(q);
    return matchTitle || matchExcerpt || matchCat || matchAuthor || matchRole || matchContent;
  });
}

export function initBlogListeners(blogState, onStateUpdate, onSelectPost, onNavigateToContact) {
  // Back button
  document.getElementById('back-to-blog-btn')?.addEventListener('click', () => {
    onSelectPost(null);
  });

  document.getElementById('article-contact-btn')?.addEventListener('click', onNavigateToContact);

  // Search input
  const searchInput = document.getElementById('blog-search-input');
  if (searchInput) {
    // Preserve focus and caret position during live typing search
    if (blogState.keyword) {
      searchInput.focus();
      const valLen = searchInput.value.length;
      searchInput.setSelectionRange(valLen, valLen);
    }

    searchInput.addEventListener('input', (e) => {
      blogState.keyword = e.target.value;
      onStateUpdate(blogState);
    });
  }

  // Clear search button
  document.getElementById('clear-blog-search-btn')?.addEventListener('click', () => {
    blogState.keyword = '';
    onStateUpdate(blogState);
  });

  document.getElementById('reset-blog-filter-btn')?.addEventListener('click', () => {
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

  // Confidential Legal Advisory Form Submit Listener
  const advisoryForm = document.getElementById('blog-advisory-form');
  advisoryForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('baf-name')?.value.trim();
    const phone = document.getElementById('baf-phone')?.value.trim();
    const email = document.getElementById('baf-email')?.value.trim();
    const requirement = document.getElementById('baf-requirement')?.value || 'General Property Brief';
    const message = document.getElementById('baf-message')?.value.trim() || '';
    const articleTitle = document.getElementById('baf-article-title')?.value || 'Blog Article';
    const submitBtn = document.getElementById('baf-submit-btn');
    const successMsg = document.getElementById('baf-success-msg');

    if (!name || !phone) {
      showToast('Please provide your name and 10-digit phone number.', 'ri-alert-line');
      return;
    }

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span>Submitting...</span> <i class="ri-loader-4-line"></i>`;
    }

    const newLead = {
      id: 'L-' + Math.floor(1000 + Math.random() * 9000),
      name: name,
      mobile: phone,
      email: email || '',
      type: requirement,
      source: 'Blog Legal Advisory Desk',
      date: new Date().toISOString().split('T')[0],
      status: 'new',
      owner: 'S. Vijayaraghavan (MD)',
      notes: `Direct Advisory Inquiry from blog: "${articleTitle}". Requirement: ${requirement}. Message: ${message || 'None'}. Routed to: vijayaraghavan@thanjaiproperty.com`,
      timestamp: Date.now()
    };

    try {
      let existingLeads = JSON.parse(localStorage.getItem('thanjai_leads')) || [];
      existingLeads.unshift(newLead);
      localStorage.setItem('thanjai_leads', JSON.stringify(existingLeads));

      addAuditLog({
        timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
        user: 'Website Visitor',
        action: `New Lead Captured (${newLead.id})`,
        module: 'Blog Advisory Desk',
        details: `Inquiry from ${name} (${phone}) on "${articleTitle}". Destination: vijayaraghavan@thanjaiproperty.com`
      });

      window.dispatchEvent(new CustomEvent('leadsUpdated', { detail: { lead: newLead } }));
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error('Error saving lead from blog:', err);
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = `<span>Request Consultation</span> <i class="ri-arrow-right-line"></i>`;
    }

    advisoryForm.reset();

    if (successMsg) {
      successMsg.style.display = 'block';
      setTimeout(() => {
        successMsg.style.display = 'none';
      }, 7000);
    }

    showToast('Consultation request sent to S. Vijayaraghavan Desk!', 'ri-checkbox-circle-fill');
  });
}
