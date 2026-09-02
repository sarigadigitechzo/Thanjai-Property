import { fetchFromAPI } from './api.js';
import { addAuditLog } from './siteImagesStore.js';

const POPUPS_STORAGE_KEY = 'thanjai_popups_store';

export const DEFAULT_POPUPS = [];

let popupsCache = null;

export async function initPopupsStore() {
  try {
    const data = await fetchFromAPI('/popups');
    if (data && Array.isArray(data)) {
      popupsCache = data.map(p => ({
        ...p,
        highlights: typeof p.highlights === 'string' ? JSON.parse(p.highlights || '[]') : (p.highlights || [])
      }));
      localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(popupsCache));
      window.dispatchEvent(new CustomEvent('popupsUpdated'));
      return popupsCache;
    }
  } catch (error) {
    console.warn('API error fetching popups, fallback to local cache', error);
  }

  const local = localStorage.getItem(POPUPS_STORAGE_KEY);
  if (local) {
    try {
      popupsCache = JSON.parse(local);
      return popupsCache;
    } catch (e) {}
  }

  popupsCache = [];
  localStorage.setItem(POPUPS_STORAGE_KEY, JSON.stringify(popupsCache));
  return popupsCache;
}

export function getPopups() {
  if (Array.isArray(popupsCache)) return popupsCache;
  const local = localStorage.getItem(POPUPS_STORAGE_KEY);
  if (local) {
    try {
      popupsCache = JSON.parse(local);
      return popupsCache;
    } catch (e) {}
  }
  popupsCache = [];
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
