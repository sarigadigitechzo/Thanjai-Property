const FAVORITES_KEY = 'thanjai_property_favorites';

export function getFavorites() {
  try {
    const data = localStorage.getItem(FAVORITES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(propertyId) {
  const favorites = getFavorites();
  return favorites.includes(propertyId);
}

export function toggleFavorite(propertyId) {
  const favorites = getFavorites();
  let updated;
  let isSavedNow = false;

  if (favorites.includes(propertyId)) {
    updated = favorites.filter(id => id !== propertyId);
    isSavedNow = false;
  } else {
    updated = [...favorites, propertyId];
    isSavedNow = true;
  }

  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  } catch (e) {
    console.error(e);
  }

  // Dispatch custom event to notify components
  window.dispatchEvent(new CustomEvent('favoritesUpdated', { detail: { count: updated.length, propertyId, isSavedNow } }));
  
  return isSavedNow;
}
