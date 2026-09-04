// src/utils/reviewsStore.js - Store interface for Google Reviews & Testimonials
import { INITIAL_TESTIMONIALS, GOOGLE_RATING_SUMMARY } from '../data/testimonials.js';
import { addAuditLog } from './siteImagesStore.js';
import { fetchFromAPI } from './api.js';

const STORAGE_KEY = 'thanjai_testimonials_v3';
const VERSION_KEY = 'thanjai_testimonials_version';
const CURRENT_VERSION = '2.3';

function normalizeReview(r) {
  return {
    id: r.id || `REV-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: r.name || r.author_name || 'Verified Client',
    author_name: r.author_name || r.name || 'Verified Client',
    author_role: r.author_role || r.propertyType || 'Property Buyer',
    propertyType: r.propertyType || r.author_role || 'Property Buyer',
    rating: parseInt(r.rating || 5, 10),
    reviewText: r.reviewText || r.review_text || '',
    review_text: r.review_text || r.reviewText || '',
    location: r.location || 'Thanjavur',
    source: r.source || 'Google',
    verified_google: r.verified_google !== false,
    time_ago: r.time_ago || 'Recent',
    avatar: r.avatar || null,
    avatar_color: r.avatar_color || '#eb5e28',
    phone: r.phone || null,
    email: r.email || null,
    status: r.status || 'Approved',
    isFeatured: r.isFeatured !== undefined ? (r.isFeatured ? 1 : 0) : 1,
    owner_reply: r.owner_reply || null,
    createdAt: r.createdAt || new Date().toISOString()
  };
}

function loadReviewsFromStorage() {
  try {
    const version = localStorage.getItem(VERSION_KEY);
    if (version !== CURRENT_VERSION) {
      localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
      const normalizedInit = INITIAL_TESTIMONIALS.map(normalizeReview);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInit));
      return normalizedInit;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeReview);
      }
    }
  } catch (e) {
    console.warn('[ReviewsStore] Error reading from storage:', e);
  }

  const defaultList = INITIAL_TESTIMONIALS.map(normalizeReview);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultList));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
  } catch (e) {}
  return defaultList;
}

let reviewsCache = loadReviewsFromStorage();

async function syncWithRemoteAPI() {
  try {
    const data = await fetchFromAPI('/reviews');
    if (Array.isArray(data) && data.length > 0) {
      const existing = getReviews();
      const combined = [...data.map(normalizeReview)];
      existing.forEach(r => {
        if (!combined.some(c => c.id === r.id || (c.name === r.name && c.reviewText === r.reviewText))) {
          combined.push(r);
        }
      });
      reviewsCache = combined;
      saveReviewsToStorage(reviewsCache);
      window.dispatchEvent(new CustomEvent('reviewsUpdated'));
      return;
    }
  } catch (err) {
    console.warn('[ReviewsStore] Background sync notice:', err);
  }
}

if (typeof window !== 'undefined') {
  syncWithRemoteAPI();
}

function saveReviewsToStorage(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn('[ReviewsStore] Error saving to storage:', e);
  }
}

export function getReviews() {
  if (!reviewsCache || reviewsCache.length === 0) {
    reviewsCache = loadReviewsFromStorage();
  }
  return [...reviewsCache];
}

export function getApprovedReviews() {
  return getReviews().filter(r => r.status === 'Approved');
}

export function getGoogleSummary() {
  const reviews = getApprovedReviews();
  const total = Math.max(reviews.length, GOOGLE_RATING_SUMMARY.totalReviews);
  return {
    ...GOOGLE_RATING_SUMMARY,
    totalReviews: total
  };
}

export function addReview(reviewData) {
  const normalized = normalizeReview(reviewData);
  const reviews = getReviews();
  reviews.unshift(normalized);
  reviewsCache = reviews;
  saveReviewsToStorage(reviewsCache);

  fetchFromAPI('/reviews', {
    method: 'POST',
    body: JSON.stringify(normalized)
  }).catch(() => {});

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    action: `Added Review (${normalized.name})`,
    module: 'Reviews & Testimonials',
    details: `Added ${normalized.rating}-star review by ${normalized.name} via ${normalized.source}.`
  });

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: normalized }));
  return normalized;
}

export function updateReview(id, updatedFields) {
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return null;

  reviews[idx] = normalizeReview({ ...reviews[idx], ...updatedFields });
  reviewsCache = reviews;
  saveReviewsToStorage(reviewsCache);

  fetch(`/api.php/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviews[idx])
  }).catch(() => {});

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: { id, review: reviews[idx] } }));
  return reviews[idx];
}

export function deleteReview(id) {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  reviewsCache = filtered;
  saveReviewsToStorage(reviewsCache);

  fetch(`/api.php/reviews/${id}`, {
    method: 'DELETE'
  }).catch(() => {});

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: { id, action: 'delete' } }));
  return true;
}

export function toggleReviewStatus(id) {
  const reviews = getReviews();
  const rev = reviews.find(r => r.id === id);
  if (!rev) return null;
  const newStatus = rev.status === 'Approved' ? 'Hidden' : 'Approved';
  return updateReview(id, { status: newStatus });
}
