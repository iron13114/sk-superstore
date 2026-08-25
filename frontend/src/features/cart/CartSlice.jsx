import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { addToCart, fetchCartByUserId, updateCartItemById, deleteCartItemById, resetCartByUserId } from './CartApi'

const getGuestCart = () => JSON.parse(localStorage.getItem('guestCart') || '[]');

const initialState = {
    status: "idle",
    items: [],
    cartItemAddStatus: "idle",
    cartItemRemoveStatus: "idle",
    errors: null,
    successMessage: null
}

const normalize = (res) => res?.data || res || []

export const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async (item, { getState }) => {
    const loggedInUser = getState().AuthSlice?.loggedInUser;
    if (!loggedInUser) {
        const guestCart = getGuestCart();
        const existingIndex = guestCart.findIndex(c =>
            (c.product?._id || c.product) === (item.product?._id || item.product) &&
            (c.packagingTier || 'single') === (item.packagingTier || 'single')
        );
        if (existingIndex >= 0) {
            guestCart[existingIndex].quantity += (item.quantity || 1);
        } else {
            guestCart.push({
                _id: 'guest_' + Date.now(),
                product: typeof item.product === 'object' ? item.product : { _id: item.product },
                quantity: item.quantity || 1,
                packagingTier: item.packagingTier || 'single',
                variantLabel: item.variantLabel || 'Single Unit',
                variantPrice: item.variantPrice || item.product?.price || 0
            });
        }
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return guestCart;
    }
    const res = await addToCart(item);
    return normalize(res);
});

export const fetchCartByUserIdAsync = createAsyncThunk('cart/fetchCartItemsAsync', async (_, { getState }) => {
    const loggedInUser = getState().AuthSlice?.loggedInUser;
    if (!loggedInUser) return getGuestCart();
    const res = await fetchCartByUserId(loggedInUser._id);
    return normalize(res);
});

export const updateCartItemByIdAsync = createAsyncThunk('cart/updateCartItemByIdAsync', async (update, { getState }) => {
    const loggedInUser = getState().AuthSlice?.loggedInUser;
    if (!loggedInUser) {
        const guestCart = getGuestCart();
        const index = guestCart.findIndex(item => item._id === update._id);
        if (index >= 0) guestCart[index].quantity = update.quantity;
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return guestCart;
    }
    const res = await updateCartItemById(update);
    return normalize(res);
});

export const deleteCartItemByIdAsync = createAsyncThunk('cart/deleteCartItemByIdAsync', async (id, { getState }) => {
    const loggedInUser = getState().AuthSlice?.loggedInUser;
    if (!loggedInUser) {
        const guestCart = getGuestCart().filter(item => item._id !== id);
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return guestCart;
    }
    const res = await deleteCartItemById(id);
    return normalize(res);
});

export const resetCartByUserIdAsync = createAsyncThunk('cart/resetCartByUserIdAsync', async (userId, { getState }) => {
    if (!userId) {
        localStorage.removeItem('guestCart');
        return [];
    }
    const res = await resetCartByUserId(userId);
    return normalize(res);
});

const cartSlice = createSlice({
    name: "CartSlice",
    initialState,
    reducers: {
        resetCartItemAddStatus: (state) => { state.cartItemAddStatus = 'idle' },
        resetCartItemRemoveStatus: (state) => { state.cartItemRemoveStatus = 'idle' }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addToCartAsync.pending, (state) => { state.cartItemAddStatus = 'pending' })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.cartItemAddStatus = 'fulfilled';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    const index = state.items.findIndex((item) =>
                        item._id === action.payload._id ||
                        ((item.product?._id || item.product) === (action.payload.product?._id || action.payload.product) &&
                        (item.packagingTier || 'single') === (action.payload.packagingTier || 'single'))
                    );
                    if (index >= 0) state.items[index] = action.payload;
                    else state.items.push(action.payload);
                }
            })
            .addCase(addToCartAsync.rejected, (state, action) => {
                state.cartItemAddStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(fetchCartByUserIdAsync.pending, (state) => { state.status = 'pending' })
            .addCase(fetchCartByUserIdAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.items = action.payload
            })
            .addCase(fetchCartByUserIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
            .addCase(updateCartItemByIdAsync.pending, (state) => { state.status = 'pending' })
            .addCase(updateCartItemByIdAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    const index = state.items.findIndex((item) => item._id === action.payload._id);
                    if (index >= 0) state.items[index] = action.payload;
                }
            })
            .addCase(updateCartItemByIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
            .addCase(deleteCartItemByIdAsync.pending, (state) => { state.cartItemRemoveStatus = 'pending' })
            .addCase(deleteCartItemByIdAsync.fulfilled, (state, action) => {
                state.cartItemRemoveStatus = 'fulfilled';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    state.items = state.items.filter((item) => item._id !== action.payload._id);
                }
            })
            .addCase(deleteCartItemByIdAsync.rejected, (state, action) => {
                state.cartItemRemoveStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(resetCartByUserIdAsync.pending, (state) => { state.status = 'pending' })
            .addCase(resetCartByUserIdAsync.fulfilled, (state) => {
                state.status = 'fulfilled'
                state.items = []
            })
            .addCase(resetCartByUserIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectCartStatus = createSelector([(state) => state.CartSlice?.status], (status) => status || 'idle')
export const selectCartItems = createSelector(
    [(state) => state.CartSlice?.items],
    (items) => Array.isArray(items) ? [...items] : []
)
export const selectCartErrors = createSelector([(state) => state.CartSlice?.errors], (errors) => errors || null)
export const selectCartSuccessMessage = createSelector([(state) => state.CartSlice?.successMessage], (msg) => msg || null)
export const selectCartItemAddStatus = createSelector([(state) => state.CartSlice?.cartItemAddStatus], (status) => status || 'idle')
export const selectCartItemRemoveStatus = createSelector([(state) => state.CartSlice?.cartItemRemoveStatus], (status) => status || 'idle')

export const { resetCartItemAddStatus, resetCartItemRemoveStatus } = cartSlice.actions

export default cartSlice.reducer