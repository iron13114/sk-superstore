import { configureStore } from '@reduxjs/toolkit'
import brandReducer from '../features/brands/BrandSlice'
import categoryReducer from '../features/categories/CategoriesSlice'
import productReducer from '../features/products/ProductSlice'
import authReducer from '../features/auth/AuthSlice'
import cartReducer from '../features/cart/CartSlice'
import orderReducer from '../features/order/OrderSlice'
import reviewReducer from '../features/review/ReviewSlice'
import userReducer from '../features/user/UserSlice'
import wishlistReducer from '../features/wishlist/WishlistSlice'
import addressReducer from '../features/address/AddressSlice'

export const store = configureStore({
    reducer: {
        BrandSlice: brandReducer,
        CategoriesSlice: categoryReducer,
        ProductSlice: productReducer,
        AuthSlice: authReducer,
        CartSlice: cartReducer,
        OrderSlice: orderReducer,
        ReviewSlice: reviewReducer,
        UserSlice: userReducer,
        WishlistSlice: wishlistReducer,
        AddressSlice: addressReducer,
    }
})