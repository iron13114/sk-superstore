import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { checkAuth, forgotPassword, login, logout, resendOtp, resetPassword, signup, verifyOtp } from './AuthApi'
import { googleLogin as googleLoginApi } from './AuthApi'

const initialState = {
    status: "idle",
    errors: null,
    resendOtpStatus: "idle",
    resendOtpSuccessMessage: null,
    resendOtpError: null,
    signupStatus: "idle",
    signupError: null,
    loginStatus: "idle",
    loginError: null,
    loggedInUser: null,
    otpVerificationStatus: "idle",
    otpVerificationError: null,
    forgotPasswordStatus: "idle",
    forgotPasswordSuccessMessage: null,
    forgotPasswordError: null,
    resetPasswordStatus: "idle",
    resetPasswordSuccessMessage: null,
    resetPasswordError: null,
    successMessage: null,
    isAuthChecked: false
}

const normalize = (res) => res?.data || res

export const signupAsync = createAsyncThunk('auth/signupAsync', async (cred) => normalize(await signup(cred)))
export const loginAsync = createAsyncThunk('auth/loginAsync', async (cred) => normalize(await login(cred)))
export const verifyOtpAsync = createAsyncThunk('auth/verifyOtpAsync', async (cred) => normalize(await verifyOtp(cred)))
export const resendOtpAsync = createAsyncThunk("auth/resendOtpAsync", async (cred) => normalize(await resendOtp(cred)))
export const forgotPasswordAsync = createAsyncThunk('auth/forgotPasswordAsync', async (cred) => normalize(await forgotPassword(cred)))
export const resetPasswordAsync = createAsyncThunk('auth/resetPasswordAsync', async (cred) => normalize(await resetPassword(cred)))
export const checkAuthAsync = createAsyncThunk('auth/checkAuthAsync', async () => normalize(await checkAuth()))
export const logoutAsync = createAsyncThunk("auth/logoutAsync", async () => normalize(await logout()))

export const googleLoginAsync = createAsyncThunk('auth/googleLoginAsync', async (cred) => {
    const data = await googleLoginApi(cred);
    localStorage.setItem('token', data.token);
    return normalize(data.user);
})

const authSlice = createSlice({
    name: "AuthSlice",
    initialState,
    reducers: {
        clearAuthSuccessMessage: (state) => { state.successMessage = null },
        clearAuthErrors: (state) => { state.errors = null },
        resetAuthStatus: (state) => { state.status = 'idle' },
        resetSignupStatus: (state) => { state.signupStatus = 'idle' },
        clearSignupError: (state) => { state.signupError = null },
        resetLoginStatus: (state) => { state.loginStatus = 'idle' },
        clearLoginError: (state) => { state.loginError = null },
        resetOtpVerificationStatus: (state) => { state.otpVerificationStatus = 'idle' },
        clearOtpVerificationError: (state) => { state.otpVerificationError = null },
        resetResendOtpStatus: (state) => { state.resendOtpStatus = 'idle' },
        clearResendOtpError: (state) => { state.resendOtpError = null },
        clearResendOtpSuccessMessage: (state) => { state.resendOtpSuccessMessage = null },
        resetForgotPasswordStatus: (state) => { state.forgotPasswordStatus = 'idle' },
        clearForgotPasswordSuccessMessage: (state) => { state.forgotPasswordSuccessMessage = null },
        clearForgotPasswordError: (state) => { state.forgotPasswordError = null },
        resetResetPasswordStatus: (state) => { state.resetPasswordStatus = 'idle' },
        clearResetPasswordSuccessMessage: (state) => { state.resetPasswordSuccessMessage = null },
        clearResetPasswordError: (state) => { state.resetPasswordError = null }
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupAsync.pending, (state) => { state.signupStatus = 'pending' })
            .addCase(signupAsync.fulfilled, (state, action) => {
                state.signupStatus = 'fullfilled'
                state.loggedInUser = action.payload
            })
            .addCase(signupAsync.rejected, (state, action) => {
                state.signupStatus = 'rejected'
                state.signupError = action.error
            })
            .addCase(loginAsync.pending, (state) => { state.loginStatus = 'pending' })
            .addCase(loginAsync.fulfilled, (state, action) => {
                state.loginStatus = 'fullfilled'
                state.loggedInUser = action.payload
            })
            .addCase(loginAsync.rejected, (state, action) => {
                state.loginStatus = 'rejected'
                state.loginError = action.error
            })
            .addCase(verifyOtpAsync.pending, (state) => { state.otpVerificationStatus = 'pending' })
            .addCase(verifyOtpAsync.fulfilled, (state, action) => {
                state.otpVerificationStatus = 'fullfilled'
                state.loggedInUser = action.payload
            })
            .addCase(verifyOtpAsync.rejected, (state, action) => {
                state.otpVerificationStatus = 'rejected'
                state.otpVerificationError = action.error
            })
            .addCase(resendOtpAsync.pending, (state) => { state.resendOtpStatus = 'pending' })
            .addCase(resendOtpAsync.fulfilled, (state, action) => {
                state.resendOtpStatus = 'fullfilled'
                state.resendOtpSuccessMessage = action.payload
            })
            .addCase(resendOtpAsync.rejected, (state, action) => {
                state.resendOtpStatus = 'rejected'
                state.resendOtpError = action.error
            })
            .addCase(forgotPasswordAsync.pending, (state) => { state.forgotPasswordStatus = 'pending' })
            .addCase(forgotPasswordAsync.fulfilled, (state, action) => {
                state.forgotPasswordStatus = 'fullfilled'
                state.forgotPasswordSuccessMessage = action.payload
            })
            .addCase(forgotPasswordAsync.rejected, (state, action) => {
                state.forgotPasswordStatus = 'rejected'
                state.forgotPasswordError = action.error
            })
            .addCase(resetPasswordAsync.pending, (state) => { state.resetPasswordStatus = 'pending' })
            .addCase(resetPasswordAsync.fulfilled, (state, action) => {
                state.resetPasswordStatus = 'fullfilled'
                state.resetPasswordSuccessMessage = action.payload
            })
            .addCase(resetPasswordAsync.rejected, (state, action) => {
                state.resetPasswordStatus = 'rejected'
                state.resetPasswordError = action.error
            })
            .addCase(logoutAsync.pending, (state) => { state.status = 'pending' })
            .addCase(logoutAsync.fulfilled, (state) => {
                state.status = 'fullfilled'
                state.loggedInUser = null
            })
            .addCase(logoutAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
            .addCase(checkAuthAsync.pending, (state) => { state.status = 'pending' })
            .addCase(checkAuthAsync.fulfilled, (state, action) => {
                state.isAuthChecked = true;
                state.loggedInUser = action.payload;
            })
            .addCase(checkAuthAsync.rejected, (state) => {
                state.isAuthChecked = true;
                state.loggedInUser = null;
            })
            .addCase(googleLoginAsync.fulfilled, (state, action) => {
                state.loggedInUser = action.payload;
                state.status = 'fulfilled';
            })
            .addCase(googleLoginAsync.rejected, (state, action) => {
                state.status = 'rejected';
                state.errors = action.error;
            })
    }
})

export const selectAuthStatus = (state) => state.AuthSlice?.status || 'idle'
export const selectAuthErrors = (state) => state.AuthSlice?.errors || null
export const selectLoggedInUser = (state) => state.AuthSlice?.loggedInUser || null
export const selectAuthSuccessMessage = (state) => state.AuthSlice?.successMessage || null
export const selectIsAuthChecked = (state) => state.AuthSlice?.isAuthChecked ?? false
export const selectResendOtpStatus = (state) => state.AuthSlice?.resendOtpStatus || 'idle'
export const selectResendOtpSuccessMessage = (state) => state.AuthSlice?.resendOtpSuccessMessage || null
export const selectResendOtpError = (state) => state.AuthSlice?.resendOtpError || null
export const selectSignupStatus = (state) => state.AuthSlice?.signupStatus || 'idle'
export const selectSignupError = (state) => state.AuthSlice?.signupError || null
export const selectLoginStatus = (state) => state.AuthSlice?.loginStatus || 'idle'
export const selectLoginError = (state) => state.AuthSlice?.loginError || null
export const selectOtpVerificationStatus = (state) => state.AuthSlice?.otpVerificationStatus || 'idle'
export const selectOtpVerificationError = (state) => state.AuthSlice?.otpVerificationError || null
export const selectForgotPasswordStatus = (state) => state.AuthSlice?.forgotPasswordStatus || 'idle'
export const selectForgotPasswordSuccessMessage = (state) => state.AuthSlice?.forgotPasswordSuccessMessage || null
export const selectForgotPasswordError = (state) => state.AuthSlice?.forgotPasswordError || null
export const selectResetPasswordStatus = (state) => state.AuthSlice?.resetPasswordStatus || 'idle'
export const selectResetPasswordSuccessMessage = (state) => state.AuthSlice?.resetPasswordSuccessMessage || null
export const selectResetPasswordError = (state) => state.AuthSlice?.resetPasswordError || null

export const {
    clearAuthSuccessMessage, clearAuthErrors, resetAuthStatus, clearSignupError,
    resetSignupStatus, clearLoginError, resetLoginStatus, clearOtpVerificationError,
    resetOtpVerificationStatus, clearResendOtpError, clearResendOtpSuccessMessage,
    resetResendOtpStatus, clearForgotPasswordError, clearForgotPasswordSuccessMessage,
    resetForgotPasswordStatus, clearResetPasswordError, clearResetPasswordSuccessMessage,
    resetResetPasswordStatus
} = authSlice.actions

export default authSlice.reducer
export const signOutAsync = logoutAsync;