// Default image catalog for website static assets
export const DEFAULT_SITE_IMAGES = {
  hero_bg: {
    id: "hero_bg",
    title: "Hero Main Background Banner",
    category: "Home",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    aspectRatio: "16:9",
    format: "JPG / WebP",
    maxSize: "< 2 MB",
    defaultUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=2000&q=90",
    description: "Main full-width background banner displayed at the top of the homepage."
  },
  showcase_bg: {
    id: "showcase_bg",
    title: "Exclusive Architectural Showcase Banner",
    category: "Home",
    recommendedWidth: 1920,
    recommendedHeight: 900,
    aspectRatio: "16:9",
    format: "JPG / WebP",
    maxSize: "< 2 MB",
    defaultUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=2000&q=90",
    description: "Featured luxury villa showcase banner background on the homepage."
  },
  post_cta_bg: {
    id: "post_cta_bg",
    title: "Post Property CTA Section Image",
    category: "SELL & PROMOTE YOUR LAND",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatio: "3:2",
    format: "JPG / WebP",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    description: "Promotional card image for 'Have a Property to Sell or Rent' call to action."
  },
  contact_bg: {
    id: "contact_bg",
    title: "Contact Section Background Image",
    category: "Home",
    recommendedWidth: 1920,
    recommendedHeight: 800,
    aspectRatio: "16:9",
    format: "JPG / WebP",
    maxSize: "< 2 MB",
    defaultUrl: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?auto=format&fit=crop&w=2000&q=90",
    description: "Background banner image for the Contact Advisory section."
  },
  our_story_hero_bg: {
    id: "our_story_hero_bg",
    title: "Our Story Hero Background",
    category: "our story home image",
    recommendedWidth: 1920,
    recommendedHeight: 1080,
    aspectRatio: "16:9",
    format: "JPG / WebP",
    maxSize: "< 2 MB",
    defaultUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=90",
    description: "Main full-width background banner displayed at the top of the Our Story page."
  },
  our_philosophy_img: {
    id: "our_philosophy_img",
    title: "Our Philosophy Image",
    category: "OUR PHILOSOPHY",
    recommendedWidth: 1200,
    recommendedHeight: 800,
    aspectRatio: "3:2",
    format: "JPG / WebP",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80",
    description: "Image displayed in the Our Philosophy section on the Our Story page."
  },
  leader_founder: {
    id: "leader_founder",
    title: "S. Vijayaraghavan (Managing Director Portrait)",
    category: "Meet Our Leadership",
    recommendedWidth: 600,
    recommendedHeight: 800,
    aspectRatio: "3:4",
    format: "JPG / WebP / PNG",
    maxSize: "< 1 MB",
    defaultUrl: "/images/vijayaraghavan.jpg",
    description: "Managing Director portrait image displayed in Our Story executive leadership section."
  },
  leader_partner: {
    id: "leader_partner",
    title: "Radhakrishnan (Co-Partner Portrait)",
    category: "Meet Our Leadership",
    recommendedWidth: 600,
    recommendedHeight: 800,
    aspectRatio: "3:4",
    format: "JPG / WebP / PNG",
    maxSize: "< 1 MB",
    defaultUrl: "/images/radhakrishnan.jpg",
    description: "Co-Partner portrait image displayed in Our Story executive leadership section."
  },
  brand_logo: {
    id: "brand_logo",
    title: "Website Main Header & Footer Logo",
    category: "Brand Assets",
    recommendedWidth: 400,
    recommendedHeight: 120,
    aspectRatio: "10:3",
    format: "PNG (Transparent)",
    maxSize: "< 500 KB",
    defaultUrl: "/thanjai-official-new.png",
    description: "Official Thanjai Property brand logo used in top header & footer."
  },

  // Regional Destinations
  loc_thanjavur: {
    id: "loc_thanjavur",
    title: "Thanjavur Location Card",
    category: "REGIONAL DESTINATIONS",
    recommendedWidth: 1000,
    recommendedHeight: 750,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 1 MB",
    defaultUrl: "/images/tn_loc_thanjavur.jpg",
    description: "Visual tile for Thanjavur destination in Regional Destinations section."
  },
  loc_trichy: {
    id: "loc_trichy",
    title: "Trichy Location Card",
    category: "REGIONAL DESTINATIONS",
    recommendedWidth: 1000,
    recommendedHeight: 750,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 1 MB",
    defaultUrl: "/images/tn_loc_trichy.jpg",
    description: "Visual tile for Trichy destination in Regional Destinations section."
  },
  loc_madurai: {
    id: "loc_madurai",
    title: "Madurai Location Card",
    category: "REGIONAL DESTINATIONS",
    recommendedWidth: 1000,
    recommendedHeight: 750,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 1 MB",
    defaultUrl: "/images/tn_loc_madurai.jpg",
    description: "Visual tile for Madurai destination in Regional Destinations section."
  },
  loc_chennai: {
    id: "loc_chennai",
    title: "Chennai Location Card",
    category: "REGIONAL DESTINATIONS",
    recommendedWidth: 1000,
    recommendedHeight: 750,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 1 MB",
    defaultUrl: "/images/tn_loc_chennai.jpg",
    description: "Visual tile for Chennai destination in Regional Destinations section."
  },
  loc_coimbatore: {
    id: "loc_coimbatore",
    title: "Coimbatore Location Card",
    category: "REGIONAL DESTINATIONS",
    recommendedWidth: 1000,
    recommendedHeight: 750,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 1 MB",
    defaultUrl: "/images/tn_loc_coimbatore.jpg",
    description: "Visual tile for Coimbatore destination in Regional Destinations section."
  },
  loc_kumbakonam: {
    id: "loc_kumbakonam",
    title: "Kumbakonam Location Card",
    category: "REGIONAL DESTINATIONS",
    recommendedWidth: 1000,
    recommendedHeight: 750,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 1 MB",
    defaultUrl: "/images/tn_loc_kumbakonam.jpg",
    description: "Visual tile for Kumbakonam destination in Regional Destinations section."
  },

  // Property Asset Categories
  cat_villas: {
    id: "cat_villas",
    title: "Luxury Villas Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    defaultUrl: "/images/tn_villas.jpg",
    description: "Marquee tile for Luxury Villas asset class."
  },
  cat_houses: {
    id: "cat_houses",
    title: "Independent Houses Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    defaultUrl: "/images/tn_houses.jpg",
    description: "Marquee tile for Independent Houses asset class."
  },
  cat_apartments: {
    id: "cat_apartments",
    title: "Modern Apartments Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    defaultUrl: "/images/tn_apartments.jpg",
    description: "Marquee tile for Modern Apartments asset class."
  },
  cat_plots: {
    id: "cat_plots",
    title: "Residential Plots Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    defaultUrl: "/images/tn_plots.jpg",
    description: "Marquee tile for Residential Plots asset class."
  },
  cat_agricultural: {
    id: "cat_agricultural",
    title: "Agricultural Farmland Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    defaultUrl: "/images/tn_agricultural.jpg",
    description: "Marquee tile for Agricultural Farmland asset class."
  },
  cat_commercial: {
    id: "cat_commercial",
    title: "Commercial Spaces Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    defaultUrl: "/images/tn_commercial.jpg",
    description: "Marquee tile for Commercial Spaces asset class."
  },
  cat_industrial: {
    id: "cat_industrial",
    title: "Industrial Land Category Tile",
    category: "PROPERTY ASSET CLASSES",
    recommendedWidth: 800,
    recommendedHeight: 600,
    aspectRatio: "4:3",
    format: "JPG / WebP",
    maxSize: "< 800 KB",
    description: "Marquee tile for Industrial Land asset class."
  },

  // 11 Thanjavur Location Explorer Corridors
  loc_corridor_medical_college_road: {
    id: "loc_corridor_medical_college_road",
    title: "1. Medical College Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Medical College Road in the Homepage Interactive Location Explorer."
  },
  loc_corridor_trichy_road: {
    id: "loc_corridor_trichy_road",
    title: "2. Trichy Road (NH 83) Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Trichy Road (NH 83) in the Homepage Interactive Location Explorer."
  },
  loc_corridor_pudukkottai_road: {
    id: "loc_corridor_pudukkottai_road",
    title: "3. Pudukkottai Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Pudukkottai Road (Tamil University corridor) in the Homepage Interactive Location Explorer."
  },
  loc_corridor_madhakottai_road: {
    id: "loc_corridor_madhakottai_road",
    title: "4. Madhakottai Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Madhakottai Road in the Homepage Interactive Location Explorer."
  },
  loc_corridor_nanjikottai_road: {
    id: "loc_corridor_nanjikottai_road",
    title: "5. Nanjikottai Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Nanjikottai Road in the Homepage Interactive Location Explorer."
  },
  loc_corridor_villar_road: {
    id: "loc_corridor_villar_road",
    title: "6. Villar Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Villar Road in the Homepage Interactive Location Explorer."
  },
  loc_corridor_pattukottai_bypass: {
    id: "loc_corridor_pattukottai_bypass",
    title: "7. Pattukottai Bypass Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Pattukottai Bypass in the Homepage Interactive Location Explorer."
  },
  loc_corridor_mariyamman_kovil_road: {
    id: "loc_corridor_mariyamman_kovil_road",
    title: "8. Mariyamman Kovil Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1602621585695-a25e8d81f7e1?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Mariyamman Kovil Road (Punnainallur) in the Homepage Interactive Location Explorer."
  },
  loc_corridor_srinivasapuram: {
    id: "loc_corridor_srinivasapuram",
    title: "9. Srinivasapuram Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Srinivasapuram in the Homepage Interactive Location Explorer."
  },
  loc_corridor_reddipalayam_road: {
    id: "loc_corridor_reddipalayam_road",
    title: "10. Reddipalayam Road Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Reddipalayam Road in the Homepage Interactive Location Explorer."
  },
  loc_corridor_kumbakonam_bypass: {
    id: "loc_corridor_kumbakonam_bypass",
    title: "11. Kumbakonam Bypass Location Image",
    category: "LOCATION CORRIDORS (THANJAVUR)",
    recommendedWidth: 1200,
    recommendedHeight: 750,
    aspectRatio: "16:10",
    format: "JPG / WebP / PNG",
    maxSize: "< 1.5 MB",
    defaultUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=80",
    description: "Featured photo banner for Kumbakonam Bypass in the Homepage Interactive Location Explorer."
  }
};

import { fetchFromAPI } from './api.js';

const STORAGE_KEY = 'thanjai_site_images';
const AUDIT_LOG_KEY = 'thanjai_audit_logs';

let siteImagesCache = null;
let auditLogsCache = null;

export async function initSiteImagesStore() {
  try {
    const imagesData = await fetchFromAPI('/site_images');
    if (imagesData && Array.isArray(imagesData) && imagesData.length > 0) {
      siteImagesCache = {};
      imagesData.forEach(img => {
        siteImagesCache[img.id] = img.currentUrl;
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(siteImagesCache));
      window.dispatchEvent(new CustomEvent('siteImagesUpdated'));
    }
  } catch (error) {}

  try {
    const auditData = await fetchFromAPI('/audit_logs');
    if (auditData && Array.isArray(auditData) && auditData.length > 0) {
      auditLogsCache = auditData;
      localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(auditLogsCache));
    }
  } catch (error) {}
}

function getSavedSiteImages() {
  if (siteImagesCache) return siteImagesCache;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      siteImagesCache = JSON.parse(saved);
      return siteImagesCache;
    }
  } catch (e) {
    console.error("Error parsing saved site images", e);
  }
  siteImagesCache = {};
  return siteImagesCache;
}

// Get full image metadata with active image URL (custom or default)
export function getAllSiteImages() {
  const savedMap = getSavedSiteImages();
  const result = {};

  Object.keys(DEFAULT_SITE_IMAGES).forEach(key => {
    const meta = DEFAULT_SITE_IMAGES[key];
    const customUrl = savedMap[key];
    result[key] = {
      ...meta,
      currentUrl: customUrl || meta.defaultUrl,
      isCustom: Boolean(customUrl && customUrl !== meta.defaultUrl)
    };
  });

  return result;
}

// Get URL for a specific image key
export function getSiteImage(key) {
  const savedMap = getSavedSiteImages();
  if (savedMap[key]) {
    return savedMap[key];
  }
  return DEFAULT_SITE_IMAGES[key]?.defaultUrl || '';
}

// Update specific site image URL
export function updateSiteImage(key, newUrl) {
  if (!DEFAULT_SITE_IMAGES[key]) {
    console.warn(`Unknown image key: ${key}`);
    return false;
  }

  const savedMap = getSavedSiteImages();
  const oldUrl = savedMap[key] || DEFAULT_SITE_IMAGES[key].defaultUrl;
  savedMap[key] = newUrl;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap));

  // Log to Audit Trail
  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: `Updated ${DEFAULT_SITE_IMAGES[key].title}`,
    module: 'Website Images',
    details: `Image asset "${DEFAULT_SITE_IMAGES[key].title}" was updated by admin.`,
    targetKey: key,
    newUrl: newUrl
  });

  // Notify listeners
  window.dispatchEvent(new CustomEvent('siteImagesUpdated', { detail: { key, newUrl } }));
  
  // Async background sync
  fetchFromAPI(`/site_images`, {
    method: 'POST',
    body: JSON.stringify({ id: `img-${key}`, image_key: key, url: newUrl })
  }).catch(e => console.error("API sync error", e));
  
  return true;
}

// Reset single site image to default
export function resetSiteImage(key) {
  if (!DEFAULT_SITE_IMAGES[key]) return false;

  const savedMap = getSavedSiteImages();
  if (savedMap[key]) {
    delete savedMap[key];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedMap));

    addAuditLog({
      timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      user: 'Aishwarya R. (Super Admin)',
      action: `Reset ${DEFAULT_SITE_IMAGES[key].title}`,
      module: 'Website Images',
      details: `Restored default factory image for "${DEFAULT_SITE_IMAGES[key].title}".`,
      targetKey: key
    });

    window.dispatchEvent(new CustomEvent('siteImagesUpdated', { detail: { key, newUrl: DEFAULT_SITE_IMAGES[key].defaultUrl } }));
  }
  return true;
}

// Reset all site images to default
export function resetAllSiteImages() {
  localStorage.removeItem(STORAGE_KEY);
  addAuditLog({
    timestamp: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: 'Aishwarya R. (Super Admin)',
    action: 'Reset All Website Images',
    module: 'Website Images',
    details: 'Restored factory default images for all website sections.'
  });
  window.dispatchEvent(new CustomEvent('siteImagesUpdated', { detail: { all: true } }));
}

// Audit Log Helpers
export function getAuditLogs() {
  if (auditLogsCache) return auditLogsCache;
  try {
    const logs = localStorage.getItem(AUDIT_LOG_KEY);
    if (logs) {
      auditLogsCache = JSON.parse(logs);
      return auditLogsCache;
    }
  } catch (e) {
    console.error("Error reading audit logs", e);
  }

  // Initial seed audit logs
  return [
    {
      id: "log-101",
      timestamp: "14 Aug 2026, 11:45 AM",
      user: "Aishwarya R. (Super Admin)",
      action: "Image Dimensions Guidelines Configured",
      module: "Website Images",
      details: "Configured pixel specs & aspect ratio requirements for website assets."
    },
    {
      id: "log-102",
      timestamp: "14 Aug 2026, 11:30 AM",
      user: "Aishwarya R. (Super Admin)",
      action: "Updated Property Listing TP-2006",
      module: "Properties Inventory",
      details: "Updated price & showcase banner status for Oceanfront Villa."
    },
    {
      id: "log-103",
      timestamp: "14 Aug 2026, 10:15 AM",
      user: "Arun Prakash (Senior Lead)",
      action: "CRM Pipeline Lead Assignment",
      module: "CRM Pipeline",
      details: "Assigned lead #LD-8890 to site visit queue."
    }
  ];
}

export function addAuditLog(entry) {
  const logs = getAuditLogs();
  const newEntry = {
    id: `log-${Date.now()}`,
    timestamp: entry.timestamp || new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
    user: entry.user || 'Aishwarya R. (Super Admin)',
    action: entry.action,
    module: entry.module || 'Website Images',
    details: entry.details
  };
  logs.unshift(newEntry);
  auditLogsCache = logs.slice(0, 100);
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(auditLogsCache)); // keep latest 100
  
  // Async background sync
  fetchFromAPI(`/audit_logs`, {
    method: 'POST',
    body: JSON.stringify(newEntry)
  }).catch(e => console.error("API sync error", e));
}

export function clearAuditLogs() {
  auditLogsCache = [];
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(auditLogsCache));
  
  // Sync clear with database
  fetchFromAPI(`/audit_logs/clear`, { method: 'DELETE' }).catch(e => console.error("API sync error", e));
}
