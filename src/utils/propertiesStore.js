import { PROPERTIES as INITIAL_PROPERTIES } from '../data/properties.js';
import { addAuditLog } from './siteImagesStore.js';
import { fetchFromAPI } from './api.js';

const PROPERTIES_STORAGE_KEY = 'thanjai_properties';

function loadPropertiesFromStorage() {
  try {
    const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(p => normalizePropertyRecord(p)).filter(Boolean);
      }
    }
  } catch (e) {
    console.error("Failed reading properties from localStorage", e);
  }
  
  // Seed fallback
  const defaults = INITIAL_PROPERTIES.map(p => normalizePropertyRecord(p)).filter(Boolean);
  try {
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(defaults));
  } catch (e) {}
  return defaults;
}

function savePropertiesToStorage(props) {
  try {
    localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(props));
  } catch (e) {
    console.error("Failed saving properties to localStorage", e);
  }
}

// Synchronously populate propertiesCache on module load so UI gets data on very first render
let propertiesCache = loadPropertiesFromStorage();
let isInitialized = true;

// Optional async background sync with backend API
export async function initPropertiesStore() {
  try {
    const data = await fetchFromAPI('/properties');
    if (data && Array.isArray(data)) {
      propertiesCache = data.map(p => normalizePropertyRecord(p)).filter(Boolean);
      savePropertiesToStorage(propertiesCache);
      window.dispatchEvent(new CustomEvent('propertiesUpdated'));
    }
  } catch (error) {
    // Graceful fallback: continue with local storage / seed data
  }
  isInitialized = true;
  return propertiesCache;
}

// Synchronous getter for UI components
export function getProperties() {
  if (!propertiesCache || propertiesCache.length === 0) {
    propertiesCache = loadPropertiesFromStorage();
  }
  return propertiesCache;
}

export function getPublicProperties() {
  const all = getProperties();
  return all.filter(p => {
    if (p.approvalStatus === 'Pending Approval' || p.status === 'Pending Approval' || p.approvalStatus === 'Rejected') {
      return false;
    }
    return p.approvalStatus === 'Approved' || !p.approvalStatus || p.approvalStatus === 'Active' || p.status === 'Available' || !p.status || p.status === 'Available';
  });
}

export function getPendingSubmissions() {
  const all = getProperties();
  return all.filter(p => p.approvalStatus === 'Pending Approval');
}

export function approveSubmission(id) {
  const props = getProperties();
  const idx = props.findIndex(p => p.id === id);
  if (idx === -1) return false;

  props[idx].approvalStatus = 'Approved';
  props[idx].status = 'Available';
  props[idx].availability = 'Available';
  savePropertiesToStorage(props);

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Approved Property Submission (${id})`,
    module: 'Property Approvals',
    details: `Approved & Published user property "${props[idx].title}" submitted by ${props[idx].ownerName || 'User'}.`
  });

  window.dispatchEvent(new CustomEvent('propertiesUpdated', { detail: { action: 'approve', id } }));
  return props[idx];
}

export function rejectSubmission(id, reason = 'Did not meet Patta title guidelines') {
  const props = getProperties();
  const idx = props.findIndex(p => p.id === id);
  if (idx === -1) return false;

  props[idx].approvalStatus = 'Rejected';
  props[idx].status = 'Rejected';
  props[idx].rejectionReason = reason;
  savePropertiesToStorage(props);

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Rejected Property Submission (${id})`,
    module: 'Property Approvals',
    details: `Declined property submission "${props[idx].title}" by ${props[idx].ownerName || 'User'}. Reason: ${reason}`
  });

  window.dispatchEvent(new CustomEvent('propertiesUpdated', { detail: { action: 'reject', id } }));
  return props[idx];
}

export function getPropertyById(id) {
  const props = getProperties();
  return props.find(p => p.id === id) || null;
}

export function addProperty(data) {
  const props = getProperties();
  const newId = `TP-${Date.now().toString().slice(-4)}`;

  const numPrice = parseFloat(data.price) || 0;
  let formattedPrice = data.priceFormatted;
  if (!formattedPrice) {
    if (numPrice >= 10000000) {
      formattedPrice = `₹ ${(numPrice / 10000000).toFixed(2)} Crore`;
    } else if (numPrice >= 100000) {
      formattedPrice = `₹ ${(numPrice / 100000).toFixed(2)} Lakhs`;
    } else {
      formattedPrice = `₹ ${numPrice.toLocaleString('en-IN')}`;
    }
  }

  const type = data.type || 'Villa';
  const categoryRaw = data.category || 'Sale'; // Sale, Rent, Lease, Commercial, Residential
  const availability = data.availability || data.status || 'Available'; // Available, Booked, Sold, Rented, Inactive

  const frontEndCat = getFrontEndCategory(type, categoryRaw);
  const purpose = (categoryRaw.toLowerCase() === 'rent' || categoryRaw.toLowerCase() === 'lease') ? 'rent' : 'buy';

  const rawProp = {
    id: newId,
    title: data.title || 'Untitled Property',
    type: type,
    category: frontEndCat, // villas, houses, apartments, plots, agricultural, commercial
    categoryRaw: categoryRaw,
    categoryLabel: data.categoryLabel || getCategoryLabel(type),
    purpose: purpose,
    price: numPrice,
    priceFormatted: formattedPrice,
    location: data.location || 'Thanjavur',
    district: data.district || data.location?.split(',')[1]?.trim() || data.location?.split(',')[0]?.trim() || 'Thanjavur',
    address: data.address || '',
    size: data.size || '2,400 sq.ft',
    bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : null,
    bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : null,
    furnishing: data.furnishing || 'Not specified',
    facing: data.facing || 'East Facing',
    approval: data.approval || 'DTCP & RERA Approved',
    status: availability,
    availability: availability,
    latitude: data.latitude || '10.786999',
    longitude: data.longitude || '79.137827',
    videoUrl: data.videoUrl || '',
    ownerName: data.ownerName || '',
    ownerPhone: data.ownerPhone || '',
    userId: data.userId || null,
    userEmail: data.userEmail || null,
    images: data.images && data.images.length > 0 ? data.images : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'],
    description: data.description || 'Luxury property in prime growth corridor.',
    features: data.features && data.features.length > 0 ? data.features : ['Clear Patta Title', 'Gated Community'],
    listedBy: data.listedBy || 'Aishwarya Raman',
    createdAt: new Date().toISOString()
  };

  const newProp = normalizePropertyRecord(rawProp);
  propertiesCache.unshift(newProp);
  
  fetchFromAPI('/properties', {
    method: 'POST',
    body: JSON.stringify(newProp)
  }).catch(err => console.error("API Error adding property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Added Property Listing (${newProp.id})`,
    module: 'Properties Inventory',
    details: `Added new property listing "${newProp.title}" (${newProp.type}) in ${newProp.location} priced at ${newProp.priceFormatted}.`
  });

  window.dispatchEvent(new CustomEvent('propertiesUpdated', { detail: { action: 'add', property: newProp } }));
  return newProp;
}

export function updateProperty(id, updatedFields) {
  const props = getProperties();
  const index = props.findIndex(p => p.id === id);
  if (index === -1) return false;

  const current = props[index];
  
  if (updatedFields.price && parseFloat(updatedFields.price) !== current.price) {
    const numPrice = parseFloat(updatedFields.price);
    if (!updatedFields.priceFormatted) {
      if (numPrice >= 10000000) {
        updatedFields.priceFormatted = `₹ ${(numPrice / 10000000).toFixed(2)} Crore`;
      } else if (numPrice >= 100000) {
        updatedFields.priceFormatted = `₹ ${(numPrice / 100000).toFixed(2)} Lakhs`;
      } else {
        updatedFields.priceFormatted = `₹ ${numPrice.toLocaleString('en-IN')}`;
      }
    }
  }

  const merged = {
    ...current,
    ...updatedFields,
    id: current.id
  };

  if (updatedFields.type) {
    merged.categoryLabel = getCategoryLabel(updatedFields.type);
    merged.category = getFrontEndCategory(updatedFields.type, updatedFields.category || current.categoryRaw);
  }

  if (updatedFields.availability) {
    merged.status = updatedFields.availability;
  }

  const updatedProp = normalizePropertyRecord(merged);
  propertiesCache[index] = updatedProp;
  
  fetchFromAPI(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProp)
  }).catch(err => console.error("API Error updating property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Updated Property Listing (${id})`,
    module: 'Properties Inventory',
    details: `Updated property details for "${updatedProp.title}".`
  });

  window.dispatchEvent(new CustomEvent('propertiesUpdated', { detail: { action: 'update', property: updatedProp } }));
  return updatedProp;
}

export function deleteProperty(id) {
  const target = propertiesCache.find(p => p.id === id);
  if (!target) return false;

  propertiesCache = propertiesCache.filter(p => p.id !== id);
  savePropertiesToStorage(propertiesCache);
  
  fetchFromAPI(`/properties/${id}`, {
    method: 'DELETE'
  }).catch(err => console.error("API Error deleting property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Deleted Property Listing (${id})`,
    module: 'Properties Inventory',
    details: `Deleted property listing "${target.title}" from inventory.`
  });

  window.dispatchEvent(new CustomEvent('propertiesUpdated', { detail: { action: 'delete', id } }));
  return true;
}

export function resetPropertiesToDefault() {
  const normalizedDefaults = INITIAL_PROPERTIES.map(p => normalizePropertyRecord(p));
  savePropertiesToStorage(normalizedDefaults);
  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: 'Reset Properties Inventory',
    module: 'Properties Inventory',
    details: 'Restored initial default property portfolio.'
  });
  window.dispatchEvent(new CustomEvent('propertiesUpdated', { detail: { action: 'reset' } }));
}

function normalizePropertyRecord(p) {
  if (!p) return null;
  let type = p.type;
  if (!type) {
    const catLabel = (p.categoryLabel || p.category || '').toLowerCase();
    if (catLabel.includes('villa')) type = 'Villa';
    else if (catLabel.includes('apartment')) type = 'Apartment';
    else if (catLabel.includes('plot') || catLabel.includes('land')) type = 'Plot';
    else if (catLabel.includes('agricultural') || catLabel.includes('farm')) type = 'Plot';
    else if (catLabel.includes('commercial') || catLabel.includes('office')) type = 'Office';
    else type = 'Villa';
  }

  const categoryRaw = p.categoryRaw || (p.purpose === 'rent' ? 'Rent' : 'Sale');
  const frontEndCat = getFrontEndCategory(type, categoryRaw);
  const status = p.status || p.availability || 'Available';
  const purpose = p.purpose || ((categoryRaw.toLowerCase() === 'rent' || categoryRaw.toLowerCase() === 'lease') ? 'rent' : 'buy');

  const loc = p.location || 'Thanjavur';
  let dist = p.district;
  if (!dist) {
    if (loc.includes(',')) {
      const parts = loc.split(',');
      dist = parts[parts.length - 1].trim() || parts[0].trim();
    } else {
      dist = loc;
    }
  }

  const numPrice = typeof p.price === 'number' ? p.price : (parseFloat(p.price) || 0);
  let formattedPrice = p.priceFormatted;
  if (!formattedPrice) {
    if (numPrice >= 10000000) {
      formattedPrice = `₹ ${(numPrice / 10000000).toFixed(2)} Crore`;
    } else if (numPrice >= 100000) {
      formattedPrice = `₹ ${(numPrice / 100000).toFixed(2)} Lakhs`;
    } else {
      formattedPrice = `₹ ${numPrice.toLocaleString('en-IN')}`;
    }
  }

  return {
    ...p,
    id: p.id || `TP-${Date.now().toString().slice(-4)}`,
    title: p.title || 'Untitled Property',
    type: type,
    category: frontEndCat,
    categoryRaw: categoryRaw,
    categoryLabel: p.categoryLabel || getCategoryLabel(type),
    status: status,
    availability: status,
    purpose: purpose,
    userId: p.userId || null,
    userEmail: p.userEmail || null,
    price: numPrice,
    priceFormatted: formattedPrice,
    location: loc,
    district: dist || 'Thanjavur',
    images: (() => {
      const rawImgs = Array.isArray(p.images) ? p.images.filter(Boolean) : [];
      const uniqueImgs = [...new Set(rawImgs)];
      return uniqueImgs.length > 0 ? uniqueImgs : ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80'];
    })(),
    description: p.description || 'Luxury property in prime growth corridor.',
    features: Array.isArray(p.features) ? p.features : ['Clear Patta Title', 'Gated Community']
  };
}

function getFrontEndCategory(type, categoryRaw) {
  const t = (type || '').toLowerCase();
  const c = (categoryRaw || '').toLowerCase();

  const validCategories = ['villas', 'houses', 'apartments', 'plots', 'agricultural', 'commercial', 'industrial'];
  if (validCategories.includes(c)) return c;

  if (t.includes('villa')) return 'villas';
  if (t.includes('house') || t.includes('townhouse')) return 'houses';
  if (t.includes('apartment') || t.includes('penthouse') || t.includes('studio')) return 'apartments';
  if (t.includes('industrial')) return 'industrial';
  if (t.includes('plot') || t.includes('layout')) return 'plots';
  if (t.includes('agriculture') || t.includes('farmland') || t.includes('farm')) return 'agricultural';
  if (t.includes('office') || t.includes('retail') || t.includes('warehouse') || c.includes('commercial')) return 'commercial';
  return 'villas';
}

function getCategoryLabel(type) {
  switch (type) {
    case 'Apartment': return 'Modern Apartment';
    case 'Villa': return 'Luxury Villa';
    case 'Townhouse': return 'Modern Townhouse';
    case 'Penthouse': return 'Luxury Penthouse';
    case 'Studio': return 'Studio Apartment';
    case 'Plot': return 'Residential Plot';
    case 'Office': return 'Commercial Office';
    case 'Retail': return 'Retail Space';
    case 'Warehouse': return 'Industrial Warehouse';
    case 'Other': return 'Real Estate Property';
    default: return type || 'Real Estate Property';
  }
}
