import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { selectLoggedInUser, loginAsync, selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus, googleLoginAsync } from '../AuthSlice'
import { toast } from 'react-toastify'
import { GoogleLogin } from '@react-oauth/google'

export const Login = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectLoginStatus)
  const [loginMode, setLoginMode] = useState('email')
  const [showPassword, setShowPassword] = useState(false)
  const error = useSelector(selectLoginError)
  const loggedInUser = useSelector(selectLoggedInUser)
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  useEffect(() => {
    if (loggedInUser && loggedInUser?.isVerified === true) {
      navigate(redirect)          
    } else if (loggedInUser && loggedInUser?.isVerified === false) {
      navigate("/verify-otp")
    }
  }, [loggedInUser, navigate, redirect])

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Invalid Credentials")
    }
  }, [error])

  useEffect(() => {
    if (status === 'fulfilled' && loggedInUser?.isVerified === true) {
      toast.success(`Login successful`)
      reset()
    }
    return () => {
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  }, [status, loggedInUser, dispatch, reset])

  const handleLogin = (data) => {
    const cred = { ...data }
    delete cred.confirmPassword

    if (loginMode === 'mobile') {
      delete cred.email
      delete cred.password
    } else {
      delete cred.mobile
      delete cred.otp
    }

    dispatch(loginAsync(cred))
  }

  const handleGoogleSuccess = (credentialResponse) => {
    dispatch(googleLoginAsync(credentialResponse.credential))
      .unwrap()
      .then(() => {
        toast.success('Logged in with Google!')
      })
      .catch(() => {
        toast.error('Google login failed')
      })
  }

  const handleGoogleError = () => {
    toast.error('Google login failed')
  }

  return (
    <div className="min-h-screen w-full flex flex-col justify-center items-center bg-white px-4 py-8">
      
      {/* Brand Header */}
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-black">
          SKSuperStore
        </h1>
        <span className="self-end text-xs sm:text-sm text-gray-500 mt-1 mr-1">
          - Shop Anything
        </span>
      </div>

      {/* Form Container */}
      <form 
        noValidate 
        onSubmit={handleSubmit(handleLogin)} 
        className="w-full max-w-[24rem] flex flex-col gap-4"
      >
        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-2">
          <button
            type="button"
            onClick={() => { setLoginMode('email'); reset(); }}
            className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              loginMode === 'email'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Email Login
          </button>
          <button
            type="button"
            onClick={() => { setLoginMode('mobile'); reset(); }}
            className={`flex-1 pb-2.5 text-xs font-semibold uppercase tracking-wider transition-colors border-b-2 ${
              loginMode === 'mobile'
                ? 'border-black text-black'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            Mobile Login
          </button>
        </div>

        {loginMode === 'email' ? (
          <>
            {/* Email Input */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full px-3.5 py-2.5 text-sm bg-white text-black placeholder-gray-400 border rounded-sm outline-none transition-colors ${
                  errors.email 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-black'
                }`}
                {...register("email", { 
                  required: "Email is required", 
                  pattern: { 
                    value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g, 
                    message: "Enter a valid email" 
                  } 
                })}
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input with SVG Eye Toggle */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={`w-full px-3.5 py-2.5 text-sm bg-white text-black placeholder-gray-400 border rounded-sm outline-none transition-colors pr-10 ${
                    errors.password 
                      ? 'border-red-500 focus:border-red-500' 
                      : 'border-gray-300 focus:border-black'
                  }`}
                  {...register("password", { required: "Password is required" })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                      <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                      <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                      <line x1="2" y1="2" x2="22" y2="22"/>
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Mobile Input */}
            <div>
              <input
                type="tel"
                placeholder="Mobile Number"
                className={`w-full px-3.5 py-2.5 text-sm bg-white text-black placeholder-gray-400 border rounded-sm outline-none transition-colors ${
                  errors.mobile 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-black'
                }`}
                {...register("mobile", { 
                  required: "Mobile number is required", 
                  pattern: { 
                    value: /^[0-9]{10}$/, 
                    message: "Enter a valid 10-digit mobile number" 
                  } 
                })}
              />
              {errors.mobile && (
                <p className="mt-1 text-xs text-red-500">{errors.mobile.message}</p>
              )}
            </div>
            
            {/* OTP Input */}
            <div>
              <input
                type="number"
                placeholder="Enter 4-Digit OTP"
                className={`w-full px-3.5 py-2.5 text-sm bg-white text-black placeholder-gray-400 border rounded-sm outline-none transition-colors ${
                  errors.otp 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 focus:border-black'
                }`}
                {...register("otp", { required: "OTP is required" })}
              />
              {errors.otp && (
                <p className="mt-1 text-xs text-red-500">{errors.otp.message}</p>
              )}
            </div>
          </>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={status === 'pending'}
          className="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 active:bg-neutral-900 disabled:opacity-50 text-white text-xs font-semibold uppercase tracking-wider rounded-sm flex items-center justify-center transition-colors cursor-pointer"
        >
          {status === 'pending' ? (
            <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : (
            loginMode === 'email' ? 'LOGIN' : 'VERIFY & LOGIN'
          )}
        </button>

        {/* Google Sign-In */}
        <div className="flex justify-center w-full mt-1">
          <GoogleLogin 
            onSuccess={handleGoogleSuccess} 
            onError={handleGoogleError}
            shape="rectangular"
            theme="outline"
            size="large"
            width="384"
          />
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-row justify-between items-center text-xs text-black mt-2">
          <Link to="/forgot-password" className="hover:underline">
            Forgot password
          </Link>
          <Link to="/signup" className="hover:underline">
            Don't have an account? <span className="font-semibold">Register</span>
          </Link>
        </div>
      </form>
    </div>
  )
}