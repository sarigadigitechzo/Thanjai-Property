import { addAuditLog } from './siteImagesStore.js';

const STORAGE_KEY = 'thanjai_blog_posts';

export const INITIAL_BLOG_POSTS = [
  {
    id: "cauvery-delta-farmlands",
    slug: "cauvery-delta-farmlands",
    title: "Agricultural Farmland Wealth: Cultivating Returns in Thanjavur Delta",
    category: "Agricultural",
    date: "28 Jul 2026",
    author: "S. Vijayaraghavan",
    authorRole: "Managing Director, Thanjai Property",
    authorBio: "Leading strategic land acquisitions, premium gated communities, and NRI property concierge services across Tamil Nadu since 2009.",
    authorSocial: "https://wa.me/919578311506",
    authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Why premium Cauvery riverbed agricultural land in Thanjavur represents resilient generational wealth and high-yield organic agro-farming opportunities.",
    metaTitle: "Agricultural Farmland Wealth in Thanjavur Delta | Thanjai Property",
    metaDescription: "Why premium Cauvery riverbed agricultural land in Thanjavur represents resilient generational wealth and high-yield agro-farming opportunities.",
    content: `<p class="blog-lead">The Cauvery delta region around Thanjavur, Kumbakonam, and Mannargudi has been revered for millennia as the rice bowl of Tamil Nadu, blessed with fertile alluvial soil and perennial river irrigation networks.</p>
<h2>1. Perennial Water Security & Soil Fertility</h2>
<p>Unlike seasonal rain-fed farm tracts, Cauvery delta agricultural parcels benefit from canal irrigation networks, ensuring multi-crop cycles annually (Kuruvai, Thaladi, and Samba).</p>
<h2>2. Tax-Free Agricultural Income & Land Wealth</h2>
<p>Agricultural revenue in India remains exempt from income tax, making managed farm estates an attractive legal tax-efficient investment vehicle for doctors, business leaders, and NRI investors.</p>`
  },
  {
    id: "contemporary-villas-architecture",
    slug: "contemporary-villas-architecture",
    title: "Modern Villa Architecture: Blending Dravidian Courtyards with Contemporary Luxury",
    category: "Architecture",
    date: "15 Jul 2026",
    author: "Aishwarya R.",
    authorRole: "Senior Legal & Patta Verification Specialist",
    authorBio: "Over 12 years of hands-on expertise in Tamil Nadu revenue administration, 30-year parent document tracing, and DTCP layout sanctions across Thanjavur & Trichy.",
    authorSocial: "https://wa.me/919578311506",
    authorAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Exploring modern luxury villas in Chennai and Thanjavur featuring open-air courtyards, VRV climate control, double-height ceilings, and lush tropical courtyards.",
    metaTitle: "Modern Villa Architecture & Dravidian Courtyards | Thanjai Property",
    metaDescription: "Exploring modern luxury villas in Chennai and Thanjavur featuring open-air courtyards, VRV climate control, and lush tropical courtyards.",
    content: `<p class="blog-lead">Traditional South Indian courtyard architecture (Thinnai & Mutram) is experiencing a revival in high-end villa designs across Chennai, Trichy, and Thanjavur.</p>
<h2>1. Climate-Responsive Passive Cooling</h2>
<p>Central open sky courtyards pull hot air upwards while allowing cool breezes to circulate through living quarters naturally, reducing air conditioning energy load by up to 30%.</p>
<h2>2. Floor-to-Ceiling Thermal Glass</h2>
<p>Pairing traditional timber columns with double-glazed low-E glass walls creates seamless indoor-outdoor living while maintaining indoor thermal comfort during peak summer months.</p>`
  },
  {
    id: "central-tn-commercial-hubs",
    slug: "central-tn-commercial-hubs",
    title: "Investing in Central Tamil Nadu: Trichy & Thanjavur Commercial Corridors",
    category: "Market Guide",
    date: "30 Jun 2026",
    author: "Kavitha S.",
    authorRole: "Senior Investment & Capital Growth Analyst",
    authorBio: "Specialist in central Tamil Nadu high-growth corridors, highway commercial plots, and real estate portfolio asset allocation.",
    authorSocial: "https://wa.me/919578311506",
    authorAvatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Commercial real estate growth analysis along Thanjavur New Bus Stand, Medical College Road, and Trichy Thillai Nagar high streets.",
    metaTitle: "Investing in Central Tamil Nadu Commercial Corridors | Thanjai Property",
    metaDescription: "Commercial real estate growth analysis along Thanjavur New Bus Stand, Medical College Road, and Trichy Thillai Nagar high streets.",
    content: `<p class="blog-lead">Central Tamil Nadu cities like Trichy and Thanjavur are benefiting from infrastructure expansions including airport upgrades and NH highway widening, fueling 12-15% annual commercial property appreciation.</p>
<h2>1. Retail Showrooms & High Street Demand</h2>
<p>Key arterial roads such as Medical College Road in Thanjavur and Cantonment in Trichy report near 100% occupancy for banking hubs, healthcare clinics, and retail brand outlets.</p>`
  },
  {
    id: "nri-property-buying-guide",
    slug: "nri-property-buying-guide",
    title: "NRI Real Estate Guide: Purchasing Property in Tamil Nadu Seamlessly",
    category: "NRI Guide",
    date: "12 Jun 2026",
    author: "S. Vijayaraghavan",
    authorRole: "Managing Director, Thanjai Property",
    authorBio: "Leading strategic land acquisitions, premium gated communities, and NRI property concierge services across Tamil Nadu since 2009.",
    authorSocial: "https://wa.me/919578311506",
    authorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Essential checklist for non-resident Indians acquiring luxury villas, farm plots, and commercial assets in Tamil Nadu with remote legal execution.",
    metaTitle: "NRI Real Estate Guide in Tamil Nadu | Thanjai Property",
    metaDescription: "Essential checklist for non-resident Indians acquiring luxury villas, farm plots, and commercial assets in Tamil Nadu with remote legal execution.",
    content: `<p class="blog-lead">Non-Resident Indians (NRIs) can freely acquire residential and commercial properties in India under RBI FEMA guidelines without requiring prior RBI permission.</p>
<h2>1. Power of Attorney (POA) Execution</h2>
<p>NRIs residing in US, UK, UAE, or Singapore can register a Specific Power of Attorney (POA) attested by the Indian Consulate to allow trusted family members to handle registration on their behalf.</p>`
  }
];

import { fetchFromAPI } from './api.js';

let blogPostsCache = null;
let isInitialized = false;

export async function initBlogStore() {
  try {
    const data = await fetchFromAPI('/blog');
    if (data && Array.isArray(data)) {
      blogPostsCache = data;
      saveBlogPostsToStorage(blogPostsCache);
      window.dispatchEvent(new CustomEvent('blogPostsUpdated'));
      isInitialized = true;
      return blogPostsCache;
    }
  } catch (error) {
    // Graceful fallback to local storage
  }

  if (blogPostsCache === null) {
    blogPostsCache = loadBlogPostsFromStorage();
  }
  isInitialized = true;
  return blogPostsCache;
}

export function getBlogPosts() {
  if (blogPostsCache === null) {
    blogPostsCache = loadBlogPostsFromStorage();
  }
  return blogPostsCache || [];
}

function loadBlogPostsFromStorage() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        return parsed; // returns array even if empty (0 items)
      }
    }
  } catch (e) {
    console.error("Error reading blog posts from localStorage", e);
  }

  // Only on very first fresh load
  saveBlogPostsToStorage(INITIAL_BLOG_POSTS);
  return INITIAL_BLOG_POSTS;
}

function saveBlogPostsToStorage(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    blogPostsCache = posts;
  } catch (e) {
    console.error("Error saving blog posts to localStorage", e);
  }
}

export function getBlogPostById(id) {
  const posts = getBlogPosts();
  return posts.find(p => p.id === id) || null;
}

export function getBlogPostByIdOrSlug(idOrSlug) {
  const posts = getBlogPosts();
  return posts.find(p => p.id === idOrSlug || p.slug === idOrSlug || String(p.id).toLowerCase() === String(idOrSlug).toLowerCase());
}

export async function addBlogPost(data) {
  const posts = getBlogPosts();
  const slug = (data.slug || data.title || `post-${Date.now()}`)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');

  const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const newPost = {
    id: data.id || `blog-${slug}-${Date.now().toString().slice(-4)}`,
    slug: slug,
    title: data.title || 'Untitled Article',
    category: data.category || 'Market Guide',
    date: data.date || nowStr,
    readTime: data.readTime || '5 min read',
    author: data.author || 'Thanjai Editorial Desk',
    authorRole: data.authorRole || '',
    authorBio: data.authorBio || '',
    authorSocial: data.authorSocial || '',
    authorAvatar: data.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.author || 'Thanjai Desk')}&background=2A1808&color=F8F4EC`,
    image: data.image || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80',
    excerpt: data.excerpt || 'Article published on Thanjai Property Journal.',
    metaTitle: data.metaTitle || (data.title ? `${data.title} | Thanjai Property` : 'Thanjai Property Legal Journal'),
    metaDescription: data.metaDescription || data.excerpt || 'Expert real estate guides and market insights from Thanjai Property.',
    content: data.content || `<p class="blog-lead">${data.excerpt || 'Welcome to this article.'}</p>`
  };

  // Save to local cache immediately to ensure reliable zero-data-loss storage
  posts.unshift(newPost);
  saveBlogPostsToStorage(posts);
  
  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
    action: `Published Blog Article (${newPost.id})`,
    module: 'Blog CMS',
    details: `Published article "${newPost.title}" under ${newPost.category}.`
  });

  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'add', post: newPost } }));

  // Background sync to remote API if available
  fetchFromAPI('/blog', {
    method: 'POST',
    body: JSON.stringify(newPost)
  }).catch(e => {
    console.warn("Background API sync for new blog post skipped/failed:", e.message);
  });

  return newPost;
}

export function updateBlogPost(id, updatedFields) {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p.id === id || p.slug === id);
  if (index === -1) return false;

  const current = posts[index];
  const merged = {
    ...current,
    ...updatedFields,
    id: current.id,
    slug: updatedFields.slug || current.slug || current.id
  };

  posts[index] = merged;
  saveBlogPostsToStorage(posts);
  
  // Async background sync
  fetchFromAPI(`/blog/${current.id}`, {
    method: 'PUT',
    body: JSON.stringify(merged)
  }).catch(e => console.error("Failed to sync updated blog post to API", e));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
    action: `Updated Blog Article (${current.id})`,
    module: 'Blog CMS',
    details: `Updated details for article "${merged.title}".`
  });

  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'update', post: merged } }));
  return merged;
}

export function deleteBlogPost(id) {
  const posts = getBlogPosts();
  const target = posts.find(p => String(p.id) === String(id));
  if (!target) return false;

  const filtered = posts.filter(p => String(p.id) !== String(id));
  saveBlogPostsToStorage(filtered);
  
  // Async background sync
  fetchFromAPI(`/blog/${id}`, {
    method: 'DELETE'
  }).catch(e => console.error("Failed to sync deleted blog post to API", e));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
    action: `Deleted Blog Article (${id})`,
    module: 'Blog CMS',
    details: `Deleted article "${target.title}".`
  });

  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'delete', id } }));
  return true;
}

export function resetBlogPostsToDefault() {
  saveBlogPostsToStorage(INITIAL_BLOG_POSTS);
  
  // Sync to database
  fetchFromAPI('/blog/reset', { method: 'DELETE' }).catch(() => {});
  for (const post of INITIAL_BLOG_POSTS) {
    fetchFromAPI('/blog', { method: 'POST', body: JSON.stringify(post) }).catch(() => {});
  }

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    action: 'Reset Blog CMS Catalog',
    module: 'Blog CMS',
    details: 'Restored factory seed blog articles in database and dashboard.'
  });
  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'reset' } }));
}
