import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { fetchAllCategories, fetchCategoryTree } from './CategoriesApi'

const initialState = {
    status: "idle",
    categories: [],
    categoryTree: [],
    errors: null
}

export const fetchAllCategoriesAsync = createAsyncThunk(
    'categories/fetchAllCategoriesAsync',
    async () => {
        const res = await fetchAllCategories()
        return Array.isArray(res) ? res : res?.data || []
    }
)

export const fetchCategoryTreeAsync = createAsyncThunk(
    'categories/fetchCategoryTreeAsync',
    async () => {
        const res = await fetchCategoryTree()
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
            .addCase(fetchCategoryTreeAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(fetchCategoryTreeAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.categoryTree = action.payload
            })
            .addCase(fetchCategoryTreeAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectCategoryStatus = (state) => state.CategoriesSlice?.status || 'idle'
export const selectCategories = (state) => state.CategoriesSlice?.categories || []
export const selectCategoryTree = (state) => state.CategoriesSlice?.categoryTree || []
export const selectCategoryErrors = (state) => state.CategoriesSlice?.errors || null

export default categorySlice.reducer