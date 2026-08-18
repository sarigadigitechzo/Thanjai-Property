import { addAuditLog } from './siteImagesStore.js';

const STORAGE_KEY = 'thanjai_blog_posts';

export const INITIAL_BLOG_POSTS = [
  {
    id: "dtcp-rera-buyer-guide",
    slug: "guide-to-buying-dtcp-rera-approved-layout-plots-in-thanjavur",
    title: "Guide to Buying DTCP & RERA Approved Layout Plots in Thanjavur",
    category: "Legal & Patta",
    date: "10 Aug 2026",
    readTime: "5 min read",
    author: "Thanjai Legal Advisory",
    authorAvatar: "https://ui-avatars.com/api/?name=Thanjai+Legal&background=2A1808&color=F8F4EC",
    image: "https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Essential checklist for verifying Patta title deeds, DTCP approval numbers, and revenue records before purchasing residential plots in Thanjavur and Kaveri Delta.",
    content: `<p class="blog-lead">Purchasing real estate in Tamil Nadu is one of the safest multi-generational investments when backed by verified legal Patta titles and DTCP/RERA approvals. Here is what every buyer must check before committing.</p>
<h3>1. Understanding DTCP Approval</h3>
<p>The Directorate of Town and Country Planning (DTCP) layout approval guarantees that the land plot has earmarked public roads, park reservations, drainage channels, and official zoning clearance. Purchasing non-approved unapproved layouts can lead to registration delays or legal complications.</p>
<h3>2. Verifying the Patta Title Deed</h3>
<p>The Patta is an official revenue document issued by the Tamil Nadu government establishing ownership of the land. Always verify that the Patta bears the seller's exact name, survey number, and exact land extent in cents or sq.ft.</p>
<blockquote>"At Thanjai Property, 100% of our layout plots and luxury residences undergo rigorous 3-tier legal verification before being listed for buyers."</blockquote>
<h3>3. Encumbrance Certificate (EC) Verification</h3>
<p>Obtain an Encumbrance Certificate for a minimum of 30 years from the Sub-Registrar Office (SRO) to ensure the property is free from prior mortgages, legal disputes, or unpaid bank liabilities.</p>`
  },
  {
    id: "kaveri-farmland-investment",
    slug: "the-rising-appreciation-of-kaveri-riverfront-agricultural-farmlands",
    title: "The Rising Appreciation of Kaveri Riverfront Agricultural Farmlands",
    category: "Investment",
    date: "28 Jul 2026",
    readTime: "6 min read",
    author: "Senior Land Specialist",
    authorAvatar: "https://ui-avatars.com/api/?name=Arun+Prakash&background=2A1808&color=F8F4EC",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Why fertile agricultural land in Kumbakonam, Papanasam, and Kaveri delta belt remains a high-yielding, multi-generational wealth asset for investors.",
    content: `<p class="blog-lead">Agricultural farmlands along the Kaveri river basin in Kumbakonam and Thanjavur continue to attract high-net-worth investors seeking passive yield, organic farming retreats, and long-term land value appreciation.</p>
<h3>1. Abundant Kaveri Water Resource</h3>
<p>The perennial Kaveri river delta provides fertile alluvial soil ideal for organic coconut groves, paddy fields, and teak plantations. Water table stability ensures sustained agricultural productivity year-round.</p>
<h3>2. Tax-Free Agricultural Income & Land Wealth</h3>
<p>Agricultural revenue in India remains exempt from income tax, making managed farm estates an attractive legal tax-efficient investment vehicle for doctors, business leaders, and NRI investors.</p>`
  },
  {
    id: "contemporary-villas-architecture",
    slug: "modern-villa-architecture-blending-dravidian-courtyards-with-contemporary-luxury",
    title: "Modern Villa Architecture: Blending Dravidian Courtyards with Contemporary Luxury",
    category: "Architecture",
    date: "15 Jul 2026",
    readTime: "4 min read",
    author: "Architectural Desk",
    authorAvatar: "https://ui-avatars.com/api/?name=Design+Desk&background=2A1808&color=F8F4EC",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Exploring modern luxury villas in Chennai and Thanjavur featuring open-air courtyards, VRV climate control, double-height ceilings, and lush tropical courtyards.",
    content: `<p class="blog-lead">Traditional South Indian courtyard architecture (Thinnai & Mutram) is experiencing a revival in high-end villa designs across Chennai, Trichy, and Thanjavur.</p>
<h3>1. Climate-Responsive Passive Cooling</h3>
<p>Central open sky courtyards pull hot air upwards while allowing cool breezes to circulate through living quarters naturally, reducing air conditioning energy load by up to 30%.</p>
<h3>2. Floor-to-Ceiling Thermal Glass</h3>
<p>Pairing traditional timber columns with double-glazed low-E glass walls creates seamless indoor-outdoor living while maintaining indoor thermal comfort during peak summer months.</p>`
  },
  {
    id: "central-tn-commercial-hubs",
    slug: "investing-in-central-tamil-nadu-trichy-thanjavur-commercial-corridors",
    title: "Investing in Central Tamil Nadu: Trichy & Thanjavur Commercial Corridors",
    category: "Market Guide",
    date: "30 Jun 2026",
    readTime: "5 min read",
    author: "Market Intelligence",
    authorAvatar: "https://ui-avatars.com/api/?name=Thanjai+Research&background=2A1808&color=F8F4EC",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Commercial real estate growth analysis along Thanjavur New Bus Stand, Medical College Road, and Trichy Thillai Nagar high streets.",
    content: `<p class="blog-lead">Central Tamil Nadu cities like Trichy and Thanjavur are benefiting from infrastructure expansions including airport upgrades and NH highway widening, fueling 12-15% annual commercial property appreciation.</p>
<h3>1. Retail Showrooms & High Street Demand</h3>
<p>Key arterial roads such as Medical College Road in Thanjavur and Cantonment in Trichy report near 100% occupancy for banking hubs, healthcare clinics, and retail brand outlets.</p>`
  },
  {
    id: "nri-property-buying-guide",
    slug: "nri-real-estate-guide-purchasing-property-in-tamil-nadu-seamlessly",
    title: "NRI Real Estate Guide: Purchasing Property in Tamil Nadu Seamlessly",
    category: "NRI Guide",
    date: "12 Jun 2026",
    readTime: "7 min read",
    author: "NRI Advisory Services",
    authorAvatar: "https://ui-avatars.com/api/?name=NRI+Desk&background=2A1808&color=F8F4EC",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    excerpt: "Essential checklist for non-resident Indians acquiring luxury villas, farm plots, and commercial assets in Tamil Nadu with remote legal execution.",
    content: `<p class="blog-lead">Non-Resident Indians (NRIs) can freely acquire residential and commercial properties in India under RBI FEMA guidelines without requiring prior RBI permission.</p>
<h3>1. Power of Attorney (POA) Execution</h3>
<p>NRIs residing in US, UK, UAE, or Singapore can register a Specific Power of Attorney (POA) attested by the Indian Consulate to allow trusted family members to handle registration on their behalf.</p>`
  }
];

export function getBlogPosts() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data !== null) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error("Error reading blog posts from localStorage", e);
  }

  saveBlogPostsToStorage(INITIAL_BLOG_POSTS);
  return INITIAL_BLOG_POSTS;
}

function saveBlogPostsToStorage(posts) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  } catch (e) {
    console.error("Error saving blog posts to localStorage", e);
  }
}

export function getBlogPostById(id) {
  const posts = getBlogPosts();
  return posts.find(p => p.id === id) || null;
}

export function getBlogPostByIdOrSlug(idOrSlug) {
  if (!idOrSlug) return null;
  const posts = getBlogPosts();
  const target = String(idOrSlug).toLowerCase().trim();
  return posts.find(p => p.id === idOrSlug || p.slug === target || p.id.toLowerCase() === target) || null;
}

export function addBlogPost(data) {
  const posts = getBlogPosts();
  const slug = (data.title || 'article')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
  const newId = `blog-${slug}-${Date.now().toString().slice(-4)}`;

  const nowStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  const newPost = {
    id: newId,
    slug: data.slug || slug,
    title: data.title || 'Untitled Article',
    category: data.category || 'Market Guide',
    date: data.date || nowStr,
    readTime: data.readTime || '5 min read',
    author: data.author || 'Thanjai Editorial Desk',
    authorAvatar: data.authorAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(data.author || 'Thanjai Desk')}&background=2A1808&color=F8F4EC`,
    image: data.image || 'https://images.unsplash.com/photo-1524813686514-a57563d77965?auto=format&fit=crop&w=1200&q=80',
    excerpt: data.excerpt || 'Article published on Thanjai Property Journal.',
    content: data.content || `<p class="blog-lead">${data.excerpt || 'Welcome to this article.'}</p>`
  };

  posts.unshift(newPost);
  saveBlogPostsToStorage(posts);

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Published Blog Article (${newPost.id})`,
    module: 'Blog CMS',
    details: `Published article "${newPost.title}" under ${newPost.category}.`
  });

  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'add', post: newPost } }));
  return newPost;
}

export function updateBlogPost(id, updatedFields) {
  const posts = getBlogPosts();
  const index = posts.findIndex(p => p.id === id);
  if (index === -1) return false;

  const current = posts[index];
  const merged = {
    ...current,
    ...updatedFields,
    id: current.id
  };

  posts[index] = merged;
  saveBlogPostsToStorage(posts);

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Updated Blog Article (${id})`,
    module: 'Blog CMS',
    details: `Updated details for article "${merged.title}".`
  });

  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'update', post: merged } }));
  return merged;
}

export function deleteBlogPost(id) {
  const posts = getBlogPosts();
  const target = posts.find(p => p.id === id);
  if (!target) return false;

  const filtered = posts.filter(p => p.id !== id);
  saveBlogPostsToStorage(filtered);

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Deleted Blog Article (${id})`,
    module: 'Blog CMS',
    details: `Deleted article "${target.title}".`
  });

  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'delete', id } }));
  return true;
}

export function resetBlogPostsToDefault() {
  saveBlogPostsToStorage(INITIAL_BLOG_POSTS);
  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: 'Reset Blog CMS Catalog',
    module: 'Blog CMS',
    details: 'Restored factory seed blog articles.'
  });
  window.dispatchEvent(new CustomEvent('blogPostsUpdated', { detail: { action: 'reset' } }));
}
