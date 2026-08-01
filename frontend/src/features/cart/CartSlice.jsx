import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'
import {addToCart,fetchCartByUserId,updateCartItemById,deleteCartItemById, resetCartByUserId} from './CartApi'

const getGuestCart = () => 
    JSON.parse(localStorage.getItem('guestCart') || '[]');
const initialState={
    status:"idle",
    items:[],
    cartItemAddStatus:"idle",
    cartItemRemoveStatus:"idle",
    errors:null,
    successMessage:null
}

export const addToCartAsync = createAsyncThunk('cart/addToCartAsync', async(item, { getState }) => {
    const loggedInUser = getState().AuthSlice.loggedInUser;
    
    if (!loggedInUser) {
        const guestCart = getGuestCart();
        // Try to find existing item by product ID
        const existingIndex = guestCart.findIndex(c => 
            (c.product?._id || c.product) === (item.product?._id || item.product)
        );
        
        if (existingIndex >= 0) {
            guestCart[existingIndex].quantity += (item.quantity || 1);
        } else {
            // For product details page, item.product might be full object or just ID
            guestCart.push({
                _id: 'guest_' + Date.now(),
                product: typeof item.product === 'object' ? item.product : { _id: item.product },
                quantity: item.quantity || 1
            });
        }
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return guestCart;
    }
    
    const res = await addToCart(item);
    return res;
});

// Replace fetchCartItemsAsync (or add if it doesn't exist)
export const fetchCartByUserIdAsync = createAsyncThunk('cart/fetchCartItemsAsync', async(_, { getState }) => {
    const loggedInUser = getState().AuthSlice.loggedInUser;
    
    if (!loggedInUser) {
        return getGuestCart();
    }
    
    const res = await fetchCartByUserId(loggedInUser._id);
    return res;
});

// Replace updateCartItemByIdAsync
export const updateCartItemByIdAsync = createAsyncThunk('cart/updateCartItemByIdAsync', async(update, { getState }) => {
    const loggedInUser = getState().AuthSlice.loggedInUser;
    
    if (!loggedInUser) {
        const guestCart = getGuestCart();
        const index = guestCart.findIndex(item => item._id === update._id);
        if (index >= 0) guestCart[index].quantity = update.quantity;
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return guestCart;
    }
    
    const res = await updateCartItemById(update);
    return res;
});

// Replace deleteCartItemByIdAsync
export const deleteCartItemByIdAsync = createAsyncThunk('cart/deleteCartItemByIdAsync', async(id, { getState }) => {
    const loggedInUser = getState().AuthSlice.loggedInUser;
    
    if (!loggedInUser) {
        const guestCart = getGuestCart().filter(item => item._id !== id);
        localStorage.setItem('guestCart', JSON.stringify(guestCart));
        return guestCart;
    }
    
    const res = await deleteCartItemById(id);
    return res;
});

// Replace resetCartByUserIdAsync
export const resetCartByUserIdAsync = createAsyncThunk('cart/resetCartByUserIdAsync', async(userId, { getState }) => {
    if (!userId) {
        localStorage.removeItem('guestCart');
        return [];
    }
    const res = await resetCartByUserId(userId);
    return res;
});
const cartSlice=createSlice({
    name:"cartSlice",
    initialState:initialState,
    reducers:{
        resetCartItemAddStatus:(state)=>{
            state.cartItemAddStatus='idle'
        },
        resetCartItemRemoveStatus:(state)=>{
            state.cartItemRemoveStatus='idle'
        }
    },
    extraReducers:(builder)=>{
        builder
            .addCase(addToCartAsync.pending,(state)=>{
                state.cartItemAddStatus='pending'
            })
            .addCase(addToCartAsync.fulfilled, (state, action) => {
                state.cartItemAddStatus = 'fulfilled';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    state.items.push(action.payload);
                }
            })
            .addCase(addToCartAsync.rejected,(state,action)=>{
                state.cartItemAddStatus='rejected'
                state.errors=action.error
            })

            .addCase(fetchCartByUserIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(fetchCartByUserIdAsync.fulfilled,(state,action)=>{
                state.status='fulfilled'
                state.items=action.payload
            })
            .addCase(fetchCartByUserIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })

            .addCase(updateCartItemByIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(updateCartItemByIdAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    const index = state.items.findIndex((item) => item._id === action.payload._id);
                    if (index >= 0) state.items[index] = action.payload;
                }
            })
            .addCase(updateCartItemByIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })

            .addCase(deleteCartItemByIdAsync.pending,(state)=>{
                state.cartItemRemoveStatus='pending'
            })
            .addCase(deleteCartItemByIdAsync.fulfilled, (state, action) => {
                state.cartItemRemoveStatus = 'fulfilled';
                if (Array.isArray(action.payload)) {
                    state.items = action.payload;
                } else {
                    state.items = state.items.filter((item) => item._id !== action.payload._id);
                }
            })
            .addCase(deleteCartItemByIdAsync.rejected,(state,action)=>{
                state.cartItemRemoveStatus='rejected'
                state.errors=action.error
            })

            .addCase(resetCartByUserIdAsync.pending,(state)=>{
                state.status='pending'
            })
            .addCase(resetCartByUserIdAsync.fulfilled,(state)=>{
                state.status='fulfilled'
                state.items=[]
            })
            .addCase(resetCartByUserIdAsync.rejected,(state,action)=>{
                state.status='rejected'
                state.errors=action.error
            })
    }
})

// exporting selectors
export const selectCartStatus=(state)=>state.CartSlice.status
export const selectCartItems=(state)=>state.CartSlice.items
export const selectCartErrors=(state)=>state.CartSlice.errors
export const selectCartSuccessMessage=(state)=>state.CartSlice.successMessage
export const selectCartItemAddStatus=(state)=>state.CartSlice.cartItemAddStatus
export const selectCartItemRemoveStatus=(state)=>state.CartSlice.cartItemRemoveStatus

// exporting reducers
export const {resetCartItemAddStatus,resetCartItemRemoveStatus}=cartSlice.actions

export default cartSlice.reducer