import { addAuditLog } from './siteImagesStore.js';

const STORAGE_KEY = 'thanjai_blog_posts';

export const INITIAL_BLOG_POSTS = [];

import { fetchFromAPI } from './api.js';

let blogPostsCache = loadBlogPostsFromStorage();
let isInitialized = false;

export async function initBlogStore() {
  try {
    const data = await fetchFromAPI('/blog');
    if (data && Array.isArray(data)) {
      blogPostsCache = data;
      saveBlogPostsToStorage(blogPostsCache);
    }
  } catch (error) {
    // Graceful fallback to local cache
  }
  isInitialized = true;
  return blogPostsCache;
}

export function getBlogPosts() {
  if (!blogPostsCache || blogPostsCache.length === 0) {
    blogPostsCache = loadBlogPostsFromStorage();
  }
  return blogPostsCache;
}

function loadBlogPostsFromStorage() {
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
    blogPostsCache = posts;
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

export async function addBlogPost(data) {
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

  try {
    await fetchFromAPI('/blog', {
      method: 'POST',
      body: JSON.stringify(newPost)
    });
    
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
  } catch (e) {
    console.error("Failed to sync new blog post to API", e);
    throw new Error("Failed to save to database. Image/content might be too large.");
  }
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
    user: 'Aishwarya R. (Super Admin)',
    action: `Updated Blog Article (${current.id})`,
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
  
  // Async background sync
  fetchFromAPI(`/blog/${id}`, {
    method: 'DELETE'
  }).catch(e => console.error("Failed to sync deleted blog post to API", e));

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
