import { PROPERTIES as INITIAL_PROPERTIES } from '../data/properties.js';
import { LEGACY_PROPERTIES } from '../data/legacy_properties.js';
import { addAuditLog } from './siteImagesStore.js';
import { fetchFromAPI } from './api.js';

const PROPERTIES_STORAGE_KEY = 'thanjai_properties';

function loadPropertiesFromStorage() {
  try {
    const stored = localStorage.getItem(PROPERTIES_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        const existing = parsed.map(p => normalizePropertyRecord(p)).filter(Boolean);
        // Safe merge: append any legacy properties whose IDs don't already exist
        const existingIds = new Set(existing.map(p => p.id));
        const newFromLegacy = LEGACY_PROPERTIES
          .filter(p => p.id && !existingIds.has(p.id))
          .map(p => normalizePropertyRecord(p))
          .filter(Boolean);
        if (newFromLegacy.length > 0) {
          const merged = [...existing, ...newFromLegacy];
          try { localStorage.setItem(PROPERTIES_STORAGE_KEY, JSON.stringify(merged)); } catch(e) {}
          console.log(`[LegacyMerge] Appended ${newFromLegacy.length} legacy properties.`);
          return merged;
        }
        return existing;
      }
    }
  } catch (e) {
    console.error("Failed reading properties from localStorage", e);
  }
  
  // Seed fallback: combine initial + legacy, deduped by ID
  const combined = [...INITIAL_PROPERTIES, ...LEGACY_PROPERTIES];
  const seenIds = new Set();
  const deduped = combined.filter(p => { if (!p.id || seenIds.has(p.id)) return false; seenIds.add(p.id); return true; });
  const defaults = deduped.map(p => normalizePropertyRecord(p)).filter(Boolean);
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
      const remoteNormalized = data.map(remoteP => {
        const resolvedAdType = (remoteP.adType || remoteP.ad_type || 'free');
        const resolvedOwnerName = (remoteP.ownerName || remoteP.owner_name || (resolvedAdType === 'paid' ? 'Verified Owner' : 'Thanjai Property'));
        const resolvedOwnerPhone = (remoteP.ownerPhone || remoteP.owner_phone || (resolvedAdType === 'paid' ? '8489996852' : '8489996852'));
        
        // Preserve local approval, features, and images if remote API data has empty/null values
        const localMatch = propertiesCache.find(lp => lp && lp.id === remoteP.id);
        const resolvedApproval = (remoteP.approval && String(remoteP.approval).trim()) 
          ? String(remoteP.approval).trim() 
          : (localMatch && localMatch.approval ? localMatch.approval : '');

        let resolvedFeatures = remoteP.features;
        if ((!resolvedFeatures || (Array.isArray(resolvedFeatures) && resolvedFeatures.length === 0)) && localMatch && Array.isArray(localMatch.features) && localMatch.features.length > 0) {
          resolvedFeatures = localMatch.features;
        }

        let resolvedImages = remoteP.images;
        if ((!resolvedImages || (Array.isArray(resolvedImages) && resolvedImages.length === 0)) && localMatch && Array.isArray(localMatch.images) && localMatch.images.length > 0) {
          resolvedImages = localMatch.images;
        }

        return normalizePropertyRecord({
          ...remoteP,
          approval: resolvedApproval,
          features: resolvedFeatures,
          images: resolvedImages,
          adType: resolvedAdType,
          ownerName: resolvedOwnerName,
          ownerPhone: resolvedOwnerPhone
        });
      }).filter(Boolean);

      // Safe merge: always include legacy properties that aren't in remote data
      const remoteIds = new Set(remoteNormalized.map(p => p.id));
      const legacyToAdd = LEGACY_PROPERTIES
        .filter(p => p.id && !remoteIds.has(p.id))
        .map(p => normalizePropertyRecord(p))
        .filter(Boolean);

      propertiesCache = [...remoteNormalized, ...legacyToAdd];
      savePropertiesToStorage(propertiesCache);
      if (legacyToAdd.length > 0) {
        console.log(`[LegacyMerge] Re-merged ${legacyToAdd.length} legacy properties after API sync.`);
      }
      window.dispatchEvent(new CustomEvent('propertiesUpdated'));
    }
  } catch (error) {
    // Graceful fallback: continue with local storage / seed data
    console.error("Failed to fetch properties from DB, falling back to local cache", error);
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

  fetchFromAPI(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(props[idx])
  }).catch(err => console.error("API Error approving property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
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

  fetchFromAPI(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(props[idx])
  }).catch(err => console.error("API Error rejecting property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
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

export function formatPropertySize(size) {
  if (!size) return '';
  const str = String(size).trim();
  if (!str) return '';
  // Handles "2600", "2600sqft", "2600 sqft", "2,600 sq.ft", "2600 sq ft"
  const sqftMatch = str.match(/^([\d,]+(?:\.\d+)?)\s*(?:sq\.?\s*ft\.?|sqft|square\s*feet)?$/i);
  if (sqftMatch) {
    const cleanNum = parseFloat(sqftMatch[1].replace(/,/g, ''));
    if (!isNaN(cleanNum)) {
      return `${cleanNum.toLocaleString('en-IN')} Sq.Ft`;
    }
  }
  return str;
}

export function formatLocationDisplay(location, district) {
  if (!location && !district) return 'Thanjavur, Tamil Nadu';
  const locParts = (location || '').split(',').map(p => p.trim()).filter(Boolean);
  const distParts = (district || '').split(',').map(p => p.trim()).filter(Boolean);
  
  const combined = [];
  for (const part of [...locParts, ...distParts]) {
    const lower = part.toLowerCase();
    if (!combined.some(c => c.toLowerCase() === lower)) {
      combined.push(part);
    }
  }
  
  if (combined.length === 0) return 'Thanjavur, Tamil Nadu';
  return `${combined.join(', ')}, Tamil Nadu`;
}

export function parsePropertyVideos(videoUrl) {
  if (!videoUrl) return [];
  if (Array.isArray(videoUrl)) return videoUrl.map(v => typeof v === 'string' ? v.trim() : '').filter(Boolean);
  if (typeof videoUrl === 'string') {
    const trimmed = videoUrl.trim();
    if (!trimmed) return [];
    if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
      try {
        const parsed = JSON.parse(trimmed);
        if (Array.isArray(parsed)) return parsed.map(v => typeof v === 'string' ? v.trim() : '').filter(Boolean);
      } catch (e) {}
    }
    if (trimmed.includes('||||')) {
      return trimmed.split('||||').map(s => s.trim()).filter(Boolean);
    }
    if (trimmed.includes('\n')) {
      return trimmed.split('\n').map(s => s.trim()).filter(Boolean);
    }
    return [trimmed];
  }
  return [];
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
    size: data.size ? formatPropertySize(data.size) : '',
    bedrooms: data.bedrooms ? parseInt(data.bedrooms, 10) : null,
    bathrooms: data.bathrooms ? parseInt(data.bathrooms, 10) : null,
    floor: data.floor || null,
    furnishing: data.furnishing && data.furnishing !== 'Not specified' ? data.furnishing : '',
    facing: data.facing || '',
    approval: data.approval || '',
    status: availability,
    availability: availability,
    latitude: data.latitude || '',
    longitude: data.longitude || '',
    videoUrl: data.videoUrl || '',
    ownerName: data.ownerName || '',
    ownerPhone: data.ownerPhone || '',
    userId: data.userId || null,
    userEmail: data.userEmail || null,
    images: data.images && data.images.length > 0 ? data.images : ['/default-property.jpg'],
    description: data.description || '',
    features: Array.isArray(data.features) ? data.features : [],
    listedBy: data.listedBy || 'Aishwarya Raman',
    createdAt: new Date().toISOString()
  };

  const newProp = normalizePropertyRecord(rawProp);
  propertiesCache.unshift(newProp);
  savePropertiesToStorage(propertiesCache);
  
  fetchFromAPI('/properties', {
    method: 'POST',
    body: JSON.stringify(newProp)
  }).catch(err => console.error("API Error adding property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
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
  savePropertiesToStorage(propertiesCache);
  
  fetchFromAPI(`/properties/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updatedProp)
  }).catch(err => console.error("API Error updating property:", err));

  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    
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
  const knownDistricts = ['Thanjavur', 'Trichy', 'Tiruchirappalli', 'Madurai', 'Chennai', 'Coimbatore', 'Kumbakonam', 'Pudukkottai', 'Tiruvarur', 'Nagapattinam', 'Salem', 'Dindigul', 'Karur', 'Perambalur', 'Ariyalur', 'Mayiladuthurai'];
  
  if (!dist || dist === loc) {
    if (loc.includes(',')) {
      const parts = loc.split(',').map(s => s.trim());
      const matched = knownDistricts.find(d => parts.some(part => part.toLowerCase() === d.toLowerCase()));
      dist = matched || parts[parts.length - 1] || 'Thanjavur';
    } else {
      const matched = knownDistricts.find(d => loc.toLowerCase().includes(d.toLowerCase()));
      dist = matched || 'Thanjavur';
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
    address: p.address || '',
    facing: p.facing || '',
    size: p.size ? formatPropertySize(p.size) : '',
    bedrooms: p.bedrooms ? parseInt(p.bedrooms, 10) : null,
    bathrooms: p.bathrooms ? parseInt(p.bathrooms, 10) : null,
    floor: p.floor || null,
    furnishing: p.furnishing && p.furnishing !== 'Not specified' ? p.furnishing : '',
    images: (() => {
      let raw = p.images;
      if (typeof raw === 'string' && raw.trim()) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) raw = parsed;
        } catch (e) {
          if (raw.includes('||||')) {
            raw = raw.split('||||').map(s => s.trim()).filter(Boolean);
          } else if (raw.includes(',')) {
            raw = raw.split(',').map(s => s.trim()).filter(Boolean);
          } else {
            raw = [raw.trim()];
          }
        }
      }
      const rawImgs = Array.isArray(raw) ? raw.filter(Boolean) : [];
      const uniqueImgs = [...new Set(rawImgs)];
      return uniqueImgs.length > 0 ? uniqueImgs : ['/default-property.jpg'];
    })(),
    adType: String(p.adType || p.ad_type || p.adTier || p.listingPlan || 'free').toLowerCase().trim(),
    ownerName: p.ownerName || p.owner_name || (String(p.adType || '').toLowerCase().trim() === 'paid' ? 'Verified Owner' : 'Thanjai Property'),
    ownerPhone: p.ownerPhone || p.owner_phone || (String(p.adType || '').toLowerCase().trim() === 'paid' ? '8489996852' : '8489996852'),
    description: p.description || '',
    approval: p.approval || '',
    facing: p.facing || '',
    features: (() => {
      let raw = p.features;
      if (typeof raw === 'string' && raw.trim()) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) raw = parsed;
        } catch (e) {
          if (raw.includes(',')) {
            raw = raw.split(',').map(s => s.trim()).filter(Boolean);
          } else {
            raw = [raw.trim()];
          }
        }
      }
      if (Array.isArray(raw)) return raw.filter(Boolean);
      return [];
    })()
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
