import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { fetchAllBrands } from './BrandApi'

const initialState = {
    status: "idle",
    brands: [],
    errors: null
}

export const fetchAllBrandsAsync = createAsyncThunk('brands/fetchAllBrandsAsync', async () => {
    const res = await fetchAllBrands()
    return res?.data || res || []  
})

const brandSlice = createSlice({
    name: "BrandSlice", 
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllBrandsAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(fetchAllBrandsAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.brands = action.payload
            })
            .addCase(fetchAllBrandsAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectBrandStatus = createSelector( [(state) => state.BrandSlice?.status], (status) => status || 'idle' )
export const selectBrands = createSelector(
    [(state) => state.BrandSlice?.brands],
    (brands) => Array.isArray(brands) ? [...brands] : []
)
export const selectBrandErrors = createSelector( [(state) => state.BrandSlice?.errors], (errors) => errors || null )

export default brandSlice.reducer