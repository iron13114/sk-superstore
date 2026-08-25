import { createAsyncThunk, createSlice, createSelector } from "@reduxjs/toolkit";
import { addProduct, deleteProductById, fetchProductById, fetchProducts, undeleteProductById, updateProductById } from "./ProductApi";

const initialState = {
    status: "idle",
    productUpdateStatus: 'idle',
    productAddStatus: "idle",
    productFetchStatus: "idle",
    products: [],
    totalResults: 0,
    isFilterOpen: false,
    selectedProduct: null,
    errors: null,
    successMessage: null
}

export const addProductAsync = createAsyncThunk("products/addProductAsync", async (data) => {
    const addedProduct = await addProduct(data)
    return addedProduct
})

export const fetchProductsAsync = createAsyncThunk("products/fetchProductsAsync", async (filters) => {
    const res = await fetchProducts(filters)
    if (Array.isArray(res)) {
        return { data: res, totalResults: res.length }
    }
    return {
        data: res?.data || [],
        totalResults: res?.totalResults || res?.data?.length || 0
    }
})

export const fetchProductByIdAsync = createAsyncThunk("products/fetchProductByIdAsync", async (id) => {
    const selectedProduct = await fetchProductById(id)
    return selectedProduct
})

export const updateProductByIdAsync = createAsyncThunk("products/updateProductByIdAsync", async (update) => {
    const updatedProduct = await updateProductById(update)
    return updatedProduct
})

export const undeleteProductByIdAsync = createAsyncThunk("products/undeleteProductByIdAsync", async (id) => {
    const unDeletedProduct = await undeleteProductById(id)
    return unDeletedProduct
})

export const deleteProductByIdAsync = createAsyncThunk("products/deleteProductByIdAsync", async (id) => {
    const deletedProduct = await deleteProductById(id)
    return deletedProduct
})

const productSlice = createSlice({
    name: "ProductSlice",  
    initialState,
    reducers: {
        clearProductErrors: (state) => { state.errors = null },
        clearProductSuccessMessage: (state) => { state.successMessage = null },
        resetProductStatus: (state) => { state.status = 'idle' },
        clearSelectedProduct: (state) => { state.selectedProduct = null },
        resetProductUpdateStatus: (state) => { state.productUpdateStatus = 'idle' },
        resetProductAddStatus: (state) => { state.productAddStatus = 'idle' },
        toggleFilters: (state) => { state.isFilterOpen = !state.isFilterOpen },
        resetProductFetchStatus: (state) => { state.productFetchStatus = 'idle' }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addProductAsync.pending, (state) => {
                state.productAddStatus = 'pending'
            })
            .addCase(addProductAsync.fulfilled, (state, action) => {
                state.productAddStatus = 'fullfilled'
                state.products.push(action.payload)
            })
            .addCase(addProductAsync.rejected, (state, action) => {
                state.productAddStatus = 'rejected'
                state.errors = action.error
            })

            .addCase(fetchProductsAsync.pending, (state) => {
                state.productFetchStatus = 'pending'
            })
            .addCase(fetchProductsAsync.fulfilled, (state, action) => {
                state.productFetchStatus = 'fullfilled'
                state.products = action.payload.data || []
                state.totalResults = action.payload.totalResults || 0
            })
            .addCase(fetchProductsAsync.rejected, (state, action) => {
                state.productFetchStatus = 'rejected'
                state.errors = action.error
            })

            .addCase(fetchProductByIdAsync.pending, (state) => {
                state.productFetchStatus = 'pending'
            })
            .addCase(fetchProductByIdAsync.fulfilled, (state, action) => {
                state.productFetchStatus = 'fullfilled'
                state.selectedProduct = action.payload
            })
            .addCase(fetchProductByIdAsync.rejected, (state, action) => {
                state.productFetchStatus = 'rejected'
                state.errors = action.error
            })

            .addCase(updateProductByIdAsync.pending, (state) => {
                state.productUpdateStatus = 'pending'
            })
            .addCase(updateProductByIdAsync.fulfilled, (state, action) => {
                state.productUpdateStatus = 'fullfilled'
                const index = state.products.findIndex((product) => product._id === action.payload._id)
                if (index !== -1) state.products[index] = action.payload
            })
            .addCase(updateProductByIdAsync.rejected, (state, action) => {
                state.productUpdateStatus = 'rejected'
                state.errors = action.error
            })

            .addCase(undeleteProductByIdAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(undeleteProductByIdAsync.fulfilled, (state, action) => {
                state.status = 'fullfilled'
                const index = state.products.findIndex((product) => product._id === action.payload._id)
                if (index !== -1) state.products[index] = action.payload
            })
            .addCase(undeleteProductByIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })

            .addCase(deleteProductByIdAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(deleteProductByIdAsync.fulfilled, (state, action) => {
                state.status = 'fullfilled'
                const index = state.products.findIndex((product) => product._id === action.payload._id)
                if (index !== -1) state.products[index] = action.payload
            })
            .addCase(deleteProductByIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectProducts = createSelector( [(state) => state.ProductSlice?.products], (products) => Array.isArray(products) ? [...products] : [] )
export const selectProductStatus = (state) => state.ProductSlice?.status || 'idle'
export const selectProductTotalResults = (state) => state.ProductSlice?.totalResults || 0
export const selectSelectedProduct = (state) => state.ProductSlice?.selectedProduct || null
export const selectProductErrors = (state) => state.ProductSlice?.errors || null
export const selectProductSuccessMessage = (state) => state.ProductSlice?.successMessage || null
export const selectProductUpdateStatus = (state) => state.ProductSlice?.productUpdateStatus || 'idle'
export const selectProductAddStatus = (state) => state.ProductSlice?.productAddStatus || 'idle'
export const selectProductIsFilterOpen = (state) => state.ProductSlice?.isFilterOpen ?? false
export const selectProductFetchStatus = (state) => state.ProductSlice?.productFetchStatus || 'idle'

export const {
    clearProductSuccessMessage,
    clearProductErrors,
    clearSelectedProduct,
    resetProductStatus,
    resetProductUpdateStatus,
    resetProductAddStatus,
    toggleFilters,
    resetProductFetchStatus
} = productSlice.actions

export default productSlice.reducer