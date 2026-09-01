import { fetchFromAPI } from './api.js';
import { addAuditLog } from './siteImagesStore.js';

const POPUPS_STORAGE_KEY = 'thanjai_popups_store';

export const DEFAULT_POPUPS = [
  {
    id: 'POP-1001',
    title: '🌾 Grand Festive Property Mela 2026',
    subtitle: 'Special limited-time booking discount on DTCP & RERA approved residential plots in Thanjavur & Trichy Road.',
    type: 'festival',
    badge: '🎉 FESTIVE OFFER',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Spot Patta Transfer & 0% Brokerage',
      'Ready for immediate villa construction with 40ft tar road',
      'Special ₹50,000 spot booking cashback voucher'
    ],
    ctaText: 'Claim Festive Offer on WhatsApp',
    ctaType: 'whatsapp',
    ctaValue: '+91 84899 96852',
    startDate: '',
    endDate: '',
    delaySeconds: 3,
    frequency: 'once_session',
    status: 'Active',
    createdAt: new Date().toISOString()
  },
  {
    id: 'POP-1002',
    title: '🔥 New Project Launch: Prime Corridor Plots',
    subtitle: 'Exclusive gated township plots near Medical College Road & Bypass with luxury amenities.',
    type: 'ad_offer',
    badge: '⚡ NEW LAUNCH DEAL',
    image: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80',
    highlights: [
      'Gated Community with 24/7 Security & Solar Lighting',
      'Bank Loan approved up to 80% with low interest rates',
      'Free Site Visit with Cab Pickup & Drop'
    ],
    ctaText: 'Book Free Site Visit',
    ctaType: 'site_visit',
    ctaValue: '',
    startDate: '',
    endDate: '',
    delaySeconds: 3,
    frequency: 'once_session',
    status: 'Active',
    createdAt: new Date().toISOString()
  }
];

let popupsCache = null;

export async function initPopupsStore() {
  try {
    const data = await fetchFromAPI('/popups');
    if (data && Array.isArray(data) && data.length > 0) {
      popupsCache = data.map(p => ({
        ...p,
        highlights: typeof p.highlights === 'string' ? JSON.parse(p.highlights || '[]') : (p.highlights || [])
      }));
      localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(popupsCache));
      window.dispatchEvent(new CustomEvent('popupsUpdated'));
      return popupsCache;
    }
  } catch (error) {
    console.warn('API error fetching popups, fallback to local storage', error);
  }

  const local = localStorage.getItem(POPUPS_STORAGE_KEY);
  if (local) {
    try {
      popupsCache = JSON.parse(local);
      return popupsCache;
    } catch (e) {}
  }

  popupsCache = [...DEFAULT_POPUPS];
  localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(popupsCache));
  return popupsCache;
}

export function getPopups() {
  if (popupsCache && popupsCache.length > 0) return popupsCache;
  const local = localStorage.getItem(POPUPS_STORAGE_KEY);
  if (local) {
    try {
      popupsCache = JSON.parse(local);
      return popupsCache;
    } catch (e) {}
  }
  popupsCache = [...DEFAULT_POPUPS];
  localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(popupsCache));
  return popupsCache;
}

export async function addPopup(popupData) {
  const current = getPopups();
  const newPopup = {
    id: 'POP-' + Date.now(),
    title: popupData.title || 'New Announcement',
    subtitle: popupData.subtitle || '',
    type: popupData.type || 'festival',
    badge: popupData.badge || 'PROMOTIONAL',
    image: popupData.image || '',
    highlights: Array.isArray(popupData.highlights) ? popupData.highlights : [],
    ctaText: popupData.ctaText || 'Claim Offer on WhatsApp',
    ctaType: popupData.ctaType || 'whatsapp',
    ctaValue: popupData.ctaValue || '+91 84899 96852',
    startDate: popupData.startDate || '',
    endDate: popupData.endDate || '',
    delaySeconds: parseInt(popupData.delaySeconds) || 3,
    frequency: popupData.frequency || 'once_session',
    status: popupData.status || 'Active',
    createdAt: new Date().toISOString()
  };

  current.unshift(newPopup);
  popupsCache = current;
  localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(current));

  try {
    await fetchFromAPI('/popups', {
      method: 'POST',
      body: JSON.stringify(newPopup)
    });
  } catch (err) {
    console.error('Failed to sync new popup to API:', err);
  }

  addAuditLog({
    action: `Created Promotion Popup (${newPopup.title})`,
    module: 'Marketing Popups',
    details: `Created new ${newPopup.type} banner popup titled "${newPopup.title}".`
  });

  window.dispatchEvent(new CustomEvent('popupsUpdated'));
  return newPopup;
}

export async function updatePopup(id, updatedFields) {
  const current = getPopups();
  const index = current.findIndex(p => p.id === id);
  if (index === -1) return null;

  current[index] = {
    ...current[index],
    ...updatedFields
  };

  popupsCache = current;
  localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(current));

  try {
    await fetchFromAPI('/popups', {
      method: 'POST',
      body: JSON.stringify(current[index])
    });
  } catch (err) {
    console.error('Failed to update popup in API:', err);
  }

  addAuditLog({
    action: `Updated Promotion Popup (${current[index].title})`,
    module: 'Marketing Popups',
    details: `Updated popup "${current[index].title}" (Status: ${current[index].status}).`
  });

  window.dispatchEvent(new CustomEvent('popupsUpdated'));
  return current[index];
}

export async function deletePopup(id) {
  let current = getPopups();
  const target = current.find(p => p.id === id);
  current = current.filter(p => p.id !== id);
  popupsCache = current;
  localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(current));

  try {
    await fetchFromAPI(`/popups/${id}`, {
      method: 'DELETE'
    });
  } catch (err) {
    console.error('Failed to delete popup from API:', err);
  }

  if (target) {
    addAuditLog({
      action: `Deleted Promotion Popup (${target.title})`,
      module: 'Marketing Popups',
      details: `Removed popup "${target.title}" (ID: ${id}).`
    });
  }

  window.dispatchEvent(new CustomEvent('popupsUpdated'));
  return true;
}

export function getActiveFrontEndPopups() {
 const popups = getPopups();
 const now = new Date();

 return popups.filter(p => {
 if (p.status !== 'Active') return false;

 if (p.startDate) {
 const start = new Date(p.startDate);
 if (now < start) return false;
 }

 if (p.endDate) {
 const end = new Date(p.endDate);
 end.setHours(23, 59, 59, 999);
 if (now > end) return false;
 }

 return true;
 });
}
