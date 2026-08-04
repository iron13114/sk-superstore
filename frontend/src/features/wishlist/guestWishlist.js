const WISHLIST_KEY = 'sk_wishlist_guest';

export const getGuestWishlist = () => {
  try {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const saveGuestWishlist = (items) => {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(items));
};

export const clearGuestWishlist = () => {
  localStorage.removeItem(WISHLIST_KEY);
};