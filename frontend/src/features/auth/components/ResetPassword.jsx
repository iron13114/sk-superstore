import React, { useEffect } from 'react'
import { showToast } from '../../../utils/toast';
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { clearResetPasswordError, clearResetPasswordSuccessMessage, resetPasswordAsync, resetResetPasswordStatus, selectResetPasswordError, selectResetPasswordStatus, selectResetPasswordSuccessMessage } from '../AuthSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { MotionConfig, motion } from 'framer-motion'

export const ResetPassword = () => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm()
  const dispatch = useDispatch()
  const status = useSelector(selectResetPasswordStatus)
  const error = useSelector(selectResetPasswordError)
  const successMessage = useSelector(selectResetPasswordSuccessMessage)
  const { userId, passwordResetToken } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    if (error) {
      showToast.error(error.message)
    }
    return () => {
      dispatch(clearResetPasswordError())
    }
  }, [error, dispatch])

  useEffect(() => {
    if (status === 'fullfilled' || status === 'fulfilled') {
      showToast.success(successMessage?.message)
      navigate("/login")
    }
    return () => {
      dispatch(clearResetPasswordSuccessMessage())
    }
  }, [status, successMessage, navigate, dispatch])

  useEffect(() => {
    return () => {
      dispatch(resetResetPasswordStatus())
    }
  }, [dispatch])

  const handleResetPassword = async (data) => {
    const cred = { ...data, userId: userId, token: passwordResetToken }
    delete cred.confirmPassword
    dispatch(resetPasswordAsync(cred))
    reset()
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full sm:max-w-[30rem] rounded-lg bg-white p-6 shadow-md border border-gray-100">
        <form noValidate onSubmit={handleSubmit(handleResetPassword)} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl font-semibold text-gray-900">Reset Password</h1>
            <p className="text-sm text-gray-500">Please enter and confirm new password</p>
          </div>
          
          <div className="flex flex-col gap-3">
            <MotionConfig whileHover={{ y: -2 }}>
              
              <motion.div>
                <input
                  type="password"
                  placeholder="New Password"
                  {...register("password", {
                    required: "Please enter a password",
                    pattern: {
                      value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                      message: "At least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number",
                    }
                  })}
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
              </motion.div>
              
              <motion.div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  {...register("confirmPassword", {
                    required: "Please Confirm the password",
                    validate: (value, formValues) => value === formValues.password || "Passwords don't match"
                  })}
                  className="w-full rounded-md border border-gray-300 px-3.5 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword.message}</p>}
              </motion.div>

            </MotionConfig>
          </div>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 1 }}>
            <button
              type="submit"
              disabled={status === 'pending'}
              className="flex h-10 w-full items-center justify-center rounded-md bg-indigo-600 text-sm font-medium text-white transition-colors hover:bg-indigo-700 focus:outline-none disabled:bg-indigo-300"
            >
              {status === 'pending' ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                'Reset Password'
              )}
            </button>
          </motion.div>

        </form>
      </div>
    </div>
  )
}