import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { createReview, deleteReviewById, fetchReviewsByProductId, updateReviewById } from './ReviewApi'

const initialState = {
    status: "idle",
    reviewAddStatus: "idle",
    reviewDeleteStatus: "idle",
    reviewUpdateStatus: "idle",
    reviewFetchStatus: "idle",
    reviews: [],
    errors: null,
    successMessage: null
}

const normalize = (res) => res?.data || res || []

export const createReviewAsync = createAsyncThunk('review/createReviewAsync', async (review) => {
    const res = await createReview(review)
    return res?.data || res
})

export const fetchReviewsByProductIdAsync = createAsyncThunk('review/fetchReviewsByProductIdAsync', async (id) => {
    const res = await fetchReviewsByProductId(id)
    return normalize(res)
})

export const updateReviewByIdAsync = createAsyncThunk("review/updateReviewByIdAsync", async (update) => {
    const res = await updateReviewById(update)
    return res?.data || res
})

export const deleteReviewByIdAsync = createAsyncThunk('reviews/deleteReviewByIdAsync', async (id) => {
    const res = await deleteReviewById(id)
    return res?.data || res
})

const reviewSlice = createSlice({
    name: "ReviewSlice",
    initialState,
    reducers: {
        resetReviewAddStatus: (state) => { state.reviewAddStatus = 'idle' },
        resetReviewDeleteStatus: (state) => { state.reviewDeleteStatus = 'idle' },
        resetReviewUpdateStatus: (state) => { state.reviewUpdateStatus = 'idle' },
        resetReviewFetchStatus: (state) => { state.reviewFetchStatus = 'idle' }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createReviewAsync.pending, (state) => { state.reviewAddStatus = 'pending' })
            .addCase(createReviewAsync.fulfilled, (state, action) => {
                state.reviewAddStatus = 'fulfilled'
                state.reviews.push(action.payload)
            })
            .addCase(createReviewAsync.rejected, (state, action) => {
                state.reviewAddStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(fetchReviewsByProductIdAsync.pending, (state) => { state.reviewFetchStatus = 'pending' })
            .addCase(fetchReviewsByProductIdAsync.fulfilled, (state, action) => {
                state.reviewFetchStatus = 'fulfilled'
                state.reviews = action.payload
            })
            .addCase(fetchReviewsByProductIdAsync.rejected, (state, action) => {
                state.reviewFetchStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(updateReviewByIdAsync.pending, (state) => { state.reviewUpdateStatus = 'pending' })
            .addCase(updateReviewByIdAsync.fulfilled, (state, action) => {
                state.reviewUpdateStatus = 'fulfilled'
                const index = state.reviews.findIndex((review) => review._id === action.payload._id)
                if (index !== -1) state.reviews[index] = action.payload
            })
            .addCase(updateReviewByIdAsync.rejected, (state, action) => {
                state.reviewUpdateStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(deleteReviewByIdAsync.pending, (state) => { state.reviewDeleteStatus = 'pending' })
            .addCase(deleteReviewByIdAsync.fulfilled, (state, action) => {
                state.reviewDeleteStatus = 'fulfilled'
                state.reviews = state.reviews.filter((review) => review._id !== action.payload._id)
            })
            .addCase(deleteReviewByIdAsync.rejected, (state, action) => {
                state.reviewDeleteStatus = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectReviewStatus = createSelector([(state) => state.ReviewSlice?.status], (status) => status || 'idle')
export const selectReviews = createSelector([(state) => state.ReviewSlice?.reviews], (reviews) => Array.isArray(reviews) ? reviews : [])
export const selectReviewErrors = createSelector([(state) => state.ReviewSlice?.errors], (errors) => errors || null)
export const selectReviewSuccessMessage = createSelector([(state) => state.ReviewSlice?.successMessage], (msg) => msg || null)
export const selectReviewAddStatus = createSelector([(state) => state.ReviewSlice?.reviewAddStatus], (status) => status || 'idle')
export const selectReviewDeleteStatus = createSelector([(state) => state.ReviewSlice?.reviewDeleteStatus], (status) => status || 'idle')
export const selectReviewUpdateStatus = createSelector([(state) => state.ReviewSlice?.reviewUpdateStatus], (status) => status || 'idle')
export const selectReviewFetchStatus = createSelector([(state) => state.ReviewSlice?.reviewFetchStatus], (status) => status || 'idle')

const selectReviewsMemoized = createSelector(
    [(state) => state.ReviewSlice?.reviews, (state, productId) => productId],
    (reviews, productId) => {
        const safeReviews = Array.isArray(reviews) ? reviews : []
        return safeReviews.filter(r => r.product === productId)
    }
)

export const selectReviewsByProductId = (productId) => createSelector(
    [(state) => state.ReviewSlice?.reviews],
    (reviews) => {
        const safeReviews = Array.isArray(reviews) ? reviews : []
        return safeReviews.filter(r => r.product === productId)
    }
)

export const { resetReviewAddStatus, resetReviewDeleteStatus, resetReviewUpdateStatus, resetReviewFetchStatus } = reviewSlice.actions

export default reviewSlice.reducer