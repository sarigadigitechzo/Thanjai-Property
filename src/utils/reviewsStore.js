// src/utils/reviewsStore.js - Store interface for Google Reviews & Testimonials
import { INITIAL_TESTIMONIALS, GOOGLE_RATING_SUMMARY } from '../data/testimonials.js';
import { addAuditLog } from './siteImagesStore.js';
import { fetchFromAPI } from './api.js';

const STORAGE_KEY = 'thanjai_testimonials_v3';
const VERSION_KEY = 'thanjai_testimonials_version';
const CURRENT_VERSION = '2.3';
const DELETED_KEY = 'thanjai_deleted_reviews_v1';

function getDeletedReviewSignatures() {
  try {
    const raw = localStorage.getItem(DELETED_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set(parsed);
    }
  } catch (e) {}
  return new Set();
}

function addDeletedReviewSignature(sig) {
  if (!sig) return;
  const set = getDeletedReviewSignatures();
  set.add(String(sig));
  try {
    localStorage.setItem(DELETED_KEY, JSON.stringify(Array.from(set)));
  } catch (e) {}
}

function isReviewDeleted(review) {
  if (!review) return true;
  const set = getDeletedReviewSignatures();
  if (review.id && set.has(String(review.id))) return true;
  const sig = `${review.name || ''}||${review.reviewText || ''}`;
  if (sig !== '||' && set.has(sig)) return true;
  return false;
}

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
      const normalizedInit = INITIAL_TESTIMONIALS.map(normalizeReview).filter(r => !isReviewDeleted(r));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(normalizedInit));
      return normalizedInit;
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(normalizeReview).filter(r => !isReviewDeleted(r));
      }
    }
  } catch (e) {
    console.warn('[ReviewsStore] Error reading from storage:', e);
  }

  const defaultList = INITIAL_TESTIMONIALS.map(normalizeReview).filter(r => !isReviewDeleted(r));
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
      const combined = [];

      data.forEach(r => {
        const norm = normalizeReview(r);
        if (!isReviewDeleted(norm)) {
          combined.push(norm);
        }
      });

      existing.forEach(r => {
        if (!isReviewDeleted(r) && !combined.some(c => c.id === r.id || (c.name === r.name && c.reviewText === r.reviewText))) {
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
    const validReviews = (reviews || []).filter(r => !isReviewDeleted(r));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(validReviews));
  } catch (e) {
    console.warn('[ReviewsStore] Error saving to storage:', e);
  }
}

export function getReviews() {
  if (!reviewsCache || reviewsCache.length === 0) {
    reviewsCache = loadReviewsFromStorage();
  }
  return [...reviewsCache].filter(r => !isReviewDeleted(r));
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

  fetchFromAPI(`/reviews/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify(reviews[idx])
  }).catch(() => {});

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: { id, review: reviews[idx] } }));
  return reviews[idx];
}

export async function deleteReview(id) {
  const reviews = getReviews();
  const revToDelete = reviews.find(r => r.id === id);

  if (revToDelete) {
    addDeletedReviewSignature(revToDelete.id);
    if (revToDelete.name && revToDelete.reviewText) {
      addDeletedReviewSignature(`${revToDelete.name}||${revToDelete.reviewText}`);
    }
  } else if (id) {
    addDeletedReviewSignature(id);
  }

  const filtered = reviews.filter(r => r.id !== id && !isReviewDeleted(r));
  reviewsCache = filtered;
  saveReviewsToStorage(reviewsCache);

  try {
    await fetchFromAPI(`/reviews/${encodeURIComponent(id)}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.warn('[ReviewsStore] Error calling delete API:', err);
  }

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    action: `Deleted Review (${id})`,
    module: 'Reviews & Testimonials',
    details: `Permanently deleted review ${id}.`
  });

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

const GOOGLE_AUTH_STORAGE_KEY = 'thanjai_google_auth_state';

export function getGoogleAuthState() {
  try {
    const raw = localStorage.getItem(GOOGLE_AUTH_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return {
    isConnected: true,
    accountEmail: 'thanjaiproperty.desk@gmail.com',
    accountName: 'Thanjai Property Official',
    businessProfileName: 'ThanjaiProperty.com Real Estate in Thanjavur',
    locationId: 'locations/14111054332903748189',
    lastSyncTime: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
    scopes: ['https://www.googleapis.com/auth/business.manage'],
    status: 'Authorized & Active'
  };
}

export function saveGoogleAuthState(state) {
  try {
    localStorage.setItem(GOOGLE_AUTH_STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('googleAuthUpdated', { detail: state }));
  } catch (e) {}
}

export function disconnectGoogleAuth() {
  const disconnected = {
    isConnected: false,
    accountEmail: '',
    accountName: '',
    businessProfileName: '',
    locationId: '',
    lastSyncTime: 'Not Connected',
    scopes: [],
    status: 'Disconnected'
  };
  saveGoogleAuthState(disconnected);
  return disconnected;
}

