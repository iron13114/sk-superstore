import React, { useEffect, useState } from 'react'
import { showToast } from '../../../utils/toast';
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { clearForgotPasswordError, clearForgotPasswordSuccessMessage, forgotPasswordAsync, resetForgotPasswordStatus, selectForgotPasswordError, selectForgotPasswordStatus, selectForgotPasswordSuccessMessage } from '../AuthSlice'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export const ForgotPassword = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const [resetMode, setResetMode] = useState('email')
  const status = useSelector(selectForgotPasswordStatus)
  const error = useSelector(selectForgotPasswordError)
  const successMessage = useSelector(selectForgotPasswordSuccessMessage)

  useEffect(() => {
    if (error) {
      showToast.error(error?.message)
    }
    return () => {
      dispatch(clearForgotPasswordError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (status === 'fullfilled' || status === 'fulfilled') {
      showToast.success(successMessage?.message)
    }
    return () => {
      dispatch(clearForgotPasswordSuccessMessage())
    }
  }, [status, successMessage, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetForgotPasswordStatus())
    }
  }, [dispatch])

  const handleForgotPassword = async (data) => {
    dispatch(forgotPasswordAsync({ ...data, mode: resetMode }))
    reset()
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 p-4">
      <div className="flex w-full max-w-[400px] flex-col gap-4">
        <div className="w-full rounded-lg bg-white p-6 shadow-md border border-gray-100">
          <form onSubmit={handleSubmit(handleForgotPassword)} className="flex flex-col gap-4">
            
            {/* Custom Tab Selector */}
            <div className="grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-medium">
              <button
                type="button"
                onClick={() => setResetMode('email')}
                className={`py-2 text-center rounded-md transition-all ${
                  resetMode === 'email' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Via Email
              </button>
              <button
                type="button"
                onClick={() => setResetMode('mobile')}
                className={`py-2 text-center rounded-md transition-all ${
                  resetMode === 'mobile' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Via OTP (Mobile)
              </button>
            </div>

            {/* Dynamic Input Field */}
            <div>
              {resetMode === 'email' ? (
                <input
                  type="email"
                  {...register("email", { required: "Email is required" })}
                  placeholder="Enter registered email"
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              ) : (
                <input
                  type="tel"
                  {...register("mobile", { required: "Mobile number is required" })}
                  placeholder="Enter registered mobile"
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
              )}
              {errors[resetMode] && (
                <p className="mt-1 text-xs text-red-500">{errors[resetMode].message}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={status === 'pending'}
              className="flex h-10 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            >
              {status === 'pending' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                resetMode === 'email' ? 'Send Reset Link' : 'Send OTP'
              )}
            </button>
          </form>
        </div>

        {/* Back to login */}
        <motion.div whileHover={{ x: 2 }} whileTap={{ scale: 1.02 }} className="w-fit">
          <Link to="/login" className="text-sm text-gray-700 hover:text-gray-900">
            Go back to <span className="font-medium text-indigo-600">login</span>
          </Link>
        </motion.div>
      </div>
    </div>
  )
}