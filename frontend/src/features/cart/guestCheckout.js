const GUEST_CHECKOUT_ADDRESSES_KEY = 'guestCheckoutAddresses';
const GUEST_SELECTED_ADDRESS_KEY   = 'guestSelectedAddress';
const GUEST_PAYMENT_METHOD_KEY     = 'guestPaymentMethod';
const GUEST_ORDERS_KEY             = 'guestOrders';

// ── Addresses ──
export const getGuestCheckoutAddresses = () => 
    JSON.parse(localStorage.getItem(GUEST_CHECKOUT_ADDRESSES_KEY) || '[]');

export const saveGuestCheckoutAddresses = (addresses) => 
    localStorage.setItem(GUEST_CHECKOUT_ADDRESSES_KEY, JSON.stringify(addresses));

// ── Selected Address ──
export const getGuestSelectedAddress = () => 
    JSON.parse(localStorage.getItem(GUEST_SELECTED_ADDRESS_KEY) || 'null');

export const saveGuestSelectedAddress = (address) => 
    localStorage.setItem(GUEST_SELECTED_ADDRESS_KEY, JSON.stringify(address));

// ── Payment Method ──
export const getGuestPaymentMethod = () => 
    localStorage.getItem(GUEST_PAYMENT_METHOD_KEY) || null;

export const saveGuestPaymentMethod = (method) => 
    localStorage.setItem(GUEST_PAYMENT_METHOD_KEY, method);

// ── Orders ──
export const getGuestOrders = () => 
    JSON.parse(localStorage.getItem(GUEST_ORDERS_KEY) || '[]');

export const addGuestOrder = (order) => {
    const orders = getGuestOrders();
    orders.unshift(order);               // newest first
    localStorage.setItem(GUEST_ORDERS_KEY, JSON.stringify(orders));
};

// Clear transient checkout selections after order is placed
export const clearGuestCheckoutData = () => {
    localStorage.removeItem(GUEST_SELECTED_ADDRESS_KEY);
    localStorage.removeItem(GUEST_PAYMENT_METHOD_KEY);
};