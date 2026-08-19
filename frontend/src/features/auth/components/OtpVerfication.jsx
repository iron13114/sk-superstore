import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { clearOtpVerificationError, clearResendOtpError, clearResendOtpSuccessMessage, resendOtpAsync, resetOtpVerificationStatus, resetResendOtpStatus, selectLoggedInUser, selectOtpVerificationError, selectOtpVerificationStatus, selectResendOtpError, selectResendOtpStatus, selectResendOtpSuccessMessage, verifyOtpAsync, logoutAsync } from '../AuthSlice'
import { useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { toast } from 'react-toastify'

export const OtpVerfication = () => {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const loggedInUser = useSelector(selectLoggedInUser)
  const navigate = useNavigate()
  const resendOtpStatus = useSelector(selectResendOtpStatus)
  const resendOtpError = useSelector(selectResendOtpError)
  const resendOtpSuccessMessage = useSelector(selectResendOtpSuccessMessage)
  const otpVerificationStatus = useSelector(selectOtpVerificationStatus)
  const otpVerificationError = useSelector(selectOtpVerificationError)

  useEffect(() => {
    if (!loggedInUser) {
      navigate('/login')
    } else if (loggedInUser && loggedInUser?.isVerified) {
      navigate("/")
    }
  }, [loggedInUser, navigate])

  const handleSendOtp = () => {
    const data = { user: loggedInUser?._id }
    dispatch(resendOtpAsync(data))
  }
  
  const handleVerifyOtp = (data) => {
    const cred = { ...data, userId: loggedInUser?._id }
    dispatch(verifyOtpAsync(cred))
  }

  const handleBackToLogin = () => {
    dispatch(logoutAsync())
    navigate('/login')
  }

  useEffect(() => {
    if (resendOtpError) toast.error(resendOtpError.message)
    return () => { dispatch(clearResendOtpError()) }
  }, [resendOtpError, dispatch])

  useEffect(() => {
    if (resendOtpSuccessMessage) toast.success(resendOtpSuccessMessage.message)
    return () => { dispatch(clearResendOtpSuccessMessage()) }
  }, [resendOtpSuccessMessage, dispatch])

  useEffect(() => {
    if (otpVerificationError) toast.error(otpVerificationError.message)
    return () => { dispatch(clearOtpVerificationError()) }
  }, [otpVerificationError, dispatch])

  useEffect(() => {
    if (otpVerificationStatus === 'fulfilled' || otpVerificationStatus === 'fullfilled') {
      toast.success("Email verified! We are happy to have you here")
      dispatch(resetResendOtpStatus())
    }
    return () => { dispatch(resetOtpVerificationStatus()) }
  }, [otpVerificationStatus, dispatch])

  const isOtpSent = resendOtpStatus === 'fulfilled' || resendOtpStatus === 'fullfilled'

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-[26rem] flex-col items-center gap-8 rounded-lg bg-white p-8 shadow-md border border-gray-100">
        
        <h2 className="text-xl font-semibold text-gray-900">Verify Your Email Address</h2>

        {isOtpSent ? (
          <form noValidate onSubmit={handleSubmit(handleVerifyOtp)} className="flex w-full flex-col gap-4">
            <div className="flex flex-col gap-4"> 
              <div>
                <p className="text-sm text-gray-500">Enter the 4 digit OTP sent on</p>
                <p className="text-sm font-semibold text-gray-700">{loggedInUser?.email}</p>
              </div>
              <div>
                <input
                  type="number"
                  {...register("otp", { 
                    required: "OTP is required", 
                    minLength: { value: 4, message: "Please enter a 4 digit OTP" } 
                  })}
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {errors?.otp && <p className="mt-1 text-xs text-red-500">{errors.otp.message}</p>}
              </div>
            </div>
            
            <button
              type="submit"
              disabled={otpVerificationStatus === 'pending'}
              className="flex h-10 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            >
              {otpVerificationStatus === 'pending' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Verify'
              )}
            </button>
          </form>
        ) : (
          <div className="flex w-full flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">We will send an OTP to</p>
              <p className="text-sm font-semibold text-gray-700">{loggedInUser?.email || "your registered email"}</p>
            </div>
            <button
              type="button"
              onClick={handleSendOtp}
              disabled={resendOtpStatus === 'pending'}
              className="flex h-10 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            >
              {resendOtpStatus === 'pending' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Get OTP'
              )}
            </button>
          </div>
        )}

        <button 
          type="button"
          onClick={handleBackToLogin} 
          className="text-xs text-gray-500 hover:text-gray-800 transition-colors"
        >
          ← Back to Login
        </button>

      </div>
    </div>
  )
}