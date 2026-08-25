import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { fetchLoggedInUserById, updateUserById } from './UserApi'

const initialState = {
    status: "idle",
    userInfo: null,
    errors: null,
    successMessage: null
}

export const fetchLoggedInUserByIdAsync = createAsyncThunk('user/fetchLoggedInUserByIdAsync', async (id) => {
    const res = await fetchLoggedInUserById(id)
    return res?.data || res  
})

export const updateUserByIdAsync = createAsyncThunk('user/updateUserByIdAsync', async (update) => {
    const res = await updateUserById(update)
    return res?.data || res
})

const userSlice = createSlice({
    name: "UserSlice",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoggedInUserByIdAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(fetchLoggedInUserByIdAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.userInfo = action.payload
            })
            .addCase(fetchLoggedInUserByIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
            .addCase(updateUserByIdAsync.pending, (state) => {
                state.status = 'pending'
            })
            .addCase(updateUserByIdAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.userInfo = action.payload
            })
            .addCase(updateUserByIdAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
    }
})

export const selectUserStatus = (state) => state.UserSlice?.status || 'idle'
export const selectUserInfo = (state) => state.UserSlice?.userInfo || null
export const selectUserErrors = (state) => state.UserSlice?.errors || null
export const selectUserSuccessMessage = (state) => state.UserSlice?.successMessage || null

export default userSlice.reducer