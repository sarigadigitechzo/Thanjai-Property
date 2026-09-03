import { addAuditLog } from './siteImagesStore.js';

const STORAGE_KEY = 'thanjai_reviews';

const DEFAULT_REVIEWS = [
  {
    id: 'REV-1001',
    name: 'Dr. K. Senthil Kumar',
    rating: 5,
    source: 'Google',
    propertyType: 'Luxury Villa Purchase',
    location: 'Medical College Road, Thanjavur',
    reviewText: 'Exceptional service by Thanjai Property team. They verified all Patta documents, DTCP approvals, and arranged smooth registration within 2 weeks. Very transparent dealing!',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    phone: '9840123456',
    email: 'senthil.k@example.com',
    status: 'Approved',
    isFeatured: 1,
    createdAt: '2026-08-15 11:30:00'
  },
  {
    id: 'REV-1002',
    name: 'Mrs. Radhika Natarajan',
    rating: 5,
    source: 'Google',
    propertyType: 'Independent House',
    location: 'Nanjikottai Road, Thanjavur',
    reviewText: 'We found our dream home in Thanjavur through Thanjai Property. The team was extremely polite and showed us verified properties that matched our exact budget and Vastu preferences.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    phone: '9443198765',
    email: 'radhika.n@example.com',
    status: 'Approved',
    isFeatured: 1,
    createdAt: '2026-08-20 14:15:00'
  },
  {
    id: 'REV-1003',
    name: 'R. Vijayaraghavan',
    rating: 5,
    source: 'Google',
    propertyType: 'Residential DTCP Plot',
    location: 'Trichy Main Road, Thanjavur',
    reviewText: 'Best real estate advisory desk in Central Tamil Nadu. Clear title deed verification and prompt customer support. High return potential plots with genuine pricing.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    phone: '9789012345',
    email: 'vijay.raghavan@example.com',
    status: 'Approved',
    isFeatured: 1,
    createdAt: '2026-08-28 16:45:00'
  },
  {
    id: 'REV-1004',
    name: 'S. Aravindhan (NRI Buyer, Singapore)',
    rating: 5,
    source: 'Website',
    propertyType: 'Farmland & Farmhouse',
    location: 'Papanasam / Kumbakonam',
    reviewText: 'Being an NRI, I was worried about legal checks and site inspection. Thanjai Property shared drone 4K videos, live video walkthroughs, and handled the complete legal clearance smoothly.',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    phone: '+65 9123 4567',
    email: 'aravind.sg@example.com',
    status: 'Approved',
    isFeatured: 1,
    createdAt: '2026-09-01 09:20:00'
  },
  {
    id: 'REV-1005',
    name: 'Priya Sundararaman',
    rating: 5,
    source: 'Google',
    propertyType: 'Commercial Space',
    location: 'Sundaram Nagar, Thanjavur',
    reviewText: 'Professional team with deep market knowledge. Helped our family acquire prime commercial frontage property at fair market valuation. Highly recommended!',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    phone: '9884567890',
    email: 'priya.sundar@example.com',
    status: 'Approved',
    isFeatured: 1,
    createdAt: '2026-09-02 10:10:00'
  }
];

let reviewsCache = null;

function loadReviewsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('[ReviewsStore] Failed reading from localStorage', e);
  }
  return [...DEFAULT_REVIEWS];
}

function saveReviewsToStorage(reviews) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
  } catch (e) {
    console.warn('[ReviewsStore] Failed saving to localStorage', e);
  }
}

async function syncWithRemoteAPI() {
  try {
    const res = await fetch('/api.php/reviews');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        reviewsCache = data;
        saveReviewsToStorage(reviewsCache);
        window.dispatchEvent(new CustomEvent('reviewsUpdated'));
        return;
      }
    }
  } catch (err) {
    console.warn('[ReviewsStore] API sync skipped or offline:', err);
  }

  // If remote is empty, seed defaults to MySQL
  if (reviewsCache && reviewsCache.length > 0) {
    reviewsCache.forEach(rev => {
      fetch('/api.php/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rev)
      }).catch(() => {});
    });
  }
}

// Initial Cache Hydration
reviewsCache = loadReviewsFromStorage();
if (typeof window !== 'undefined') {
  syncWithRemoteAPI();
}

export function getReviews() {
  if (!reviewsCache) {
    reviewsCache = loadReviewsFromStorage();
  }
  return [...reviewsCache];
}

export function getApprovedReviews() {
  return getReviews().filter(r => r.status === 'Approved');
}

export function addReview(reviewData) {
  const reviews = getReviews();
  const newRev = {
    id: reviewData.id || `REV-${Date.now().toString().slice(-4)}`,
    name: reviewData.name?.trim() || 'Verified Client',
    rating: parseInt(reviewData.rating, 10) || 5,
    source: reviewData.source || 'Website',
    propertyType: reviewData.propertyType?.trim() || '',
    location: reviewData.location?.trim() || 'Thanjavur',
    reviewText: reviewData.reviewText?.trim() || '',
    avatar: reviewData.avatar || null,
    phone: reviewData.phone?.trim() || null,
    email: reviewData.email?.trim() || null,
    status: reviewData.status || 'Approved',
    isFeatured: reviewData.isFeatured !== undefined ? (reviewData.isFeatured ? 1 : 0) : 1,
    createdAt: reviewData.createdAt || new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  reviews.unshift(newRev);
  reviewsCache = reviews;
  saveReviewsToStorage(reviewsCache);

  // Sync to remote MySQL
  fetch('/api.php/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newRev)
  }).catch(err => console.warn('[ReviewsStore] API Save Error:', err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    action: `Added Review (${newRev.name})`,
    module: 'Reviews & Testimonials',
    details: `Added ${newRev.rating}-star review by ${newRev.name} via ${newRev.source}.`
  });

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: { action: 'add', review: newRev } }));
  return newRev;
}

export function updateReview(id, updatedFields) {
  const reviews = getReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return null;

  reviews[idx] = { ...reviews[idx], ...updatedFields };
  reviewsCache = reviews;
  saveReviewsToStorage(reviewsCache);

  fetch(`/api.php/reviews/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviews[idx])
  }).catch(err => console.warn('[ReviewsStore] API Update Error:', err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    action: `Updated Review (${id})`,
    module: 'Reviews & Testimonials',
    details: `Updated review details for ${reviews[idx].name}.`
  });

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: { action: 'update', id } }));
  return reviews[idx];
}

export function deleteReview(id) {
  const reviews = getReviews();
  const filtered = reviews.filter(r => r.id !== id);
  reviewsCache = filtered;
  saveReviewsToStorage(reviewsCache);

  fetch(`/api.php/reviews/${id}`, {
    method: 'DELETE'
  }).catch(err => console.warn('[ReviewsStore] API Delete Error:', err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    action: `Deleted Review (${id})`,
    module: 'Reviews & Testimonials',
    details: `Deleted review ID ${id}.`
  });

  window.dispatchEvent(new CustomEvent('reviewsUpdated', { detail: { action: 'delete', id } }));
  return true;
}

export function toggleReviewStatus(id) {
  const reviews = getReviews();
  const rev = reviews.find(r => r.id === id);
  if (!rev) return null;
  const newStatus = rev.status === 'Approved' ? 'Hidden' : 'Approved';
  return updateReview(id, { status: newStatus });
}
