// src/utils/leadsDb.js
// High-capacity client-side IndexedDB persistence for 10,000+ CRM leads

const DB_NAME = 'ThanjaiCRM_DB';
const DB_VERSION = 1;
const STORE_NAME = 'leads';

function openDB() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      return resolve(null);
    }
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch (e) {
      resolve(null);
    }
  });
}

export async function getLeadsFromIDB() {
  try {
    const db = await openDB();
    if (!db) return [];
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = () => resolve([]);
      } catch (e) {
        resolve([]);
      }
    });
  } catch (err) {
    return [];
  }
}

export async function saveLeadsToIDB(leads) {
  if (!Array.isArray(leads) || leads.length === 0) return;
  try {
    const db = await openDB();
    if (!db) return;
    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.clear();
        for (let i = 0; i < leads.length; i++) {
          const l = leads[i];
          if (l && l.id) {
            store.put(l);
          }
        }
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch (e) {
        resolve(false);
      }
    });
  } catch (err) {
    // Graceful silent recovery
  }
}

export function getCachedStats() {
  try {
    const raw = localStorage.getItem('thanjai_dashboard_cached_stats');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

export function saveCachedStats(stats) {
  if (!stats || typeof stats !== 'object') return;
  try {
    localStorage.setItem('thanjai_dashboard_cached_stats', JSON.stringify(stats));
    if (stats.totalLeads) {
      localStorage.setItem('thanjai_total_leads_count', String(stats.totalLeads));
    }
  } catch (e) {}
}
