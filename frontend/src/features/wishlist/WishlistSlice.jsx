import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { createWishlistItem, deleteWishlistItemById, fetchWishlistByUserId, updateWishlistItemById } from './WishlistApi'
import { getGuestWishlist, saveGuestWishlist, clearGuestWishlist } from './guestWishlist'

const initialState = {
    wishlistItemUpdateStatus: "idle",
    wishlistItemAddStatus: 'idle',
    wishlistItemDeleteStatus: "idle",
    wishlistFetchStatus: 'idle',
    items: [],
    totalResults: 0,
    errors: null,
    successMessage: null,
}

const normalize = (res) => res?.data || res || []

export const createWishlistItemAsync = createAsyncThunk('wishlist/createWishlistItemAsync', async (data) => {
    const res = await createWishlistItem(data)
    return res?.data || res
})

export const fetchWishlistByUserIdAsync = createAsyncThunk('wishlist/fetchWishlistByUserIdAsync', async (id) => {
    const res = await fetchWishlistByUserId(id)
    return normalize(res)
})

export const updateWishlistItemByIdAsync = createAsyncThunk('wishlist/updateWishlistItemByIdAsync', async (update) => {
    const res = await updateWishlistItemById(update)
    return res?.data || res
})

export const deleteWishlistItemByIdAsync = createAsyncThunk('wishlist/deleteWishlistItemByIdAsync', async (id) => {
    const res = await deleteWishlistItemById(id)
    return res?.data || res
})

const wishlistSlice = createSlice({
    name: "WishlistSlice",
    initialState,
    reducers: {
        resetWishlistItemUpdateStatus: (state) => { state.wishlistItemUpdateStatus = 'idle' },
        resetWishlistItemAddStatus: (state) => { state.wishlistItemAddStatus = 'idle' },
        resetWishlistItemDeleteStatus: (state) => { state.wishlistItemDeleteStatus = 'idle' },
        resetWishlistFetchStatus: (state) => { state.wishlistFetchStatus = 'idle' },
        loadGuestWishlist: (state) => {
            const items = getGuestWishlist();
            state.items = items;
            state.totalResults = items.length;
            state.wishlistFetchStatus = 'fulfilled';
        },
        addGuestItem: (state, action) => {
            const exists = state.items.find(item => item.product._id === action.payload.product._id);
            if (!exists) {
                state.items.push(action.payload);
                state.totalResults = state.items.length;
                saveGuestWishlist(state.items);
            }
        },
        removeGuestItem: (state, action) => {
            state.items = state.items.filter(item => item._id !== action.payload);
            state.totalResults = state.items.length;
            saveGuestWishlist(state.items);
        },
        updateGuestItem: (state, action) => {
            const index = state.items.findIndex(item => item._id === action.payload._id);
            if (index !== -1) {
                state.items[index] = { ...state.items[index], ...action.payload };
                saveGuestWishlist(state.items);
            }
        },
        clearGuestWishlistState: (state) => {
            state.items = [];
            state.totalResults = 0;
            clearGuestWishlist();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createWishlistItemAsync.pending, (state) => { state.wishlistItemAddStatus = 'pending' })
            .addCase(createWishlistItemAsync.fulfilled, (state, action) => {
                state.wishlistItemAddStatus = 'fulfilled'
                state.items.push(action.payload)
            })
            .addCase(createWishlistItemAsync.rejected, (state, action) => {
                state.wishlistItemAddStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(fetchWishlistByUserIdAsync.pending, (state) => { state.wishlistFetchStatus = 'pending' })
            .addCase(fetchWishlistByUserIdAsync.fulfilled, (state, action) => {
                state.wishlistFetchStatus = 'fulfilled'
                state.items = action.payload
                state.totalResults = action.payload.length
            })
            .addCase(fetchWishlistByUserIdAsync.rejected, (state, action) => {
                state.wishlistFetchStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(updateWishlistItemByIdAsync.pending, (state) => { state.wishlistItemUpdateStatus = 'pending' })
            .addCase(updateWishlistItemByIdAsync.fulfilled, (state, action) => {
                state.wishlistItemUpdateStatus = 'fulfilled'
                const index = state.items.findIndex((item) => item._id === action.payload._id)
                if (index !== -1) state.items[index] = action.payload
            })
            .addCase(updateWishlistItemByIdAsync.rejected, (state, action) => {
                state.wishlistItemUpdateStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(deleteWishlistItemByIdAsync.pending, (state) => { state.wishlistItemDeleteStatus = 'pending' })
            .addCase(deleteWishlistItemByIdAsync.fulfilled, (state, action) => {
                state.wishlistItemDeleteStatus = 'fulfilled'
                state.items = state.items.filter((item) => item._id !== action.payload._id)
                state.totalResults = state.items.length
            })
            .addCase(deleteWishlistItemByIdAsync.rejected, (state, action) => {
                state.wishlistItemDeleteStatus = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectWishlistItems = createSelector(
    [(state) => state.WishlistSlice?.items],
    (items) => Array.isArray(items) ? [...items] : []
)
export const selectWishlistFetchStatus = (state) => state.WishlistSlice?.wishlistFetchStatus || 'idle'
export const selectWishlistItemUpdateStatus = (state) => state.WishlistSlice?.wishlistItemUpdateStatus || 'idle'
export const selectWishlistItemAddStatus = (state) => state.WishlistSlice?.wishlistItemAddStatus || 'idle'
export const selectWishlistItemDeleteStatus = (state) => state.WishlistSlice?.wishlistItemDeleteStatus || 'idle'
export const selectWishlistErrors = (state) => state.WishlistSlice?.errors || null
export const selectWishlistSuccessMessage = (state) => state.WishlistSlice?.successMessage || null
export const selectWishlistTotalResults = (state) => state.WishlistSlice?.totalResults || 0

export const {
    resetWishlistFetchStatus,
    resetWishlistItemAddStatus,
    resetWishlistItemDeleteStatus,
    resetWishlistItemUpdateStatus,
    loadGuestWishlist,
    addGuestItem,
    removeGuestItem,
    updateGuestItem,
    clearGuestWishlistState
} = wishlistSlice.actions

export default wishlistSlice.reducer