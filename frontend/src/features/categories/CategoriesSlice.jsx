import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { fetchAllCategories } from './CategoriesApi'

const initialState = {
    status: "idle",
    categories: [],
    errors: null
}

export const fetchAllCategoriesAsync = createAsyncThunk(
    'categories/fetchAllCategoriesAsync',
    async () => {
        const res = await fetchAllCategories()
        return Array.isArray(res) ? res : res?.data || []
    }
)

const categorySlice = createSlice({
    name: "CategoriesSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCategoriesAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(fetchAllCategoriesAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.categories = action.payload
            })
            .addCase(fetchAllCategoriesAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectCategoryStatus = createSelector(
    [(state) => state.CategoriesSlice?.status],
    (status) => status || 'idle'
)
export const selectCategories = createSelector(
    [(state) => state.CategoriesSlice?.categories],
    (categories) => Array.isArray(categories) ? [...categories] : []
)
export const selectCategoryErrors = createSelector(
    [(state) => state.CategoriesSlice?.errors],
    (errors) => errors || null
)

export default categorySlice.reducer