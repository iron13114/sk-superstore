import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {useDispatch, useSelector} from 'react-redux'
import {selectLoggedInUser, signupAsync, selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus} from '../AuthSlice'
import { showToast } from '../../../utils/toast';
import { MotionConfig, motion} from 'framer-motion'

const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(false)
  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (e) => setMatches(e.matches)
    media.addEventListener('change', listener)
    setMatches(media.matches)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

const EyeIcon = ({ open, className = "w-5 h-5" }) => (
  open ? (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  )
)

const Spinner = () => (
  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
)

export const Signup = () => {
  const dispatch = useDispatch()
  const status = useSelector(selectSignupStatus)
  const error = useSelector(selectSignupError)
  const [signupMode, setSignupMode] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loggedInUser = useSelector(selectLoggedInUser)
  const {register, handleSubmit, reset, formState: { errors }} = useForm()
  const navigate = useNavigate()
  const is900 = useMediaQuery('(max-width: 900px)')
  const is480 = useMediaQuery('(max-width: 480px)')

  useEffect(() => {
    if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
    else if(loggedInUser){
      navigate("/")
    }
  }, [loggedInUser])

  useEffect(() => {
    if(error){
      showToast.error(error.message)
    }
  }, [error])

  useEffect(() => {
    if(status === 'fullfilled'){
      showToast.success("Welcome! Verify your email to start shopping on mern-ecommerce.")
      reset()
    }
    return () => {
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  }, [status])

  const handleSignup = (data) => {
    const cred = { ...data };
    if (signupMode === 'mobile') {
      delete cred.email;
    } else {
      delete cred.mobile;
    }
    dispatch(signupAsync(cred));
  };

  return (
    <div className="w-screen h-screen flex flex-row overflow-y-hidden">
        <div className="flex-1 flex flex-col justify-center items-center">

              <div className="flex flex-row justify-center items-center">
                  <div className="flex flex-col gap-1">
                    <h2 className="text-3xl sm:text-4xl font-semibold break-words">SKSuperStore</h2>
                    <p className="self-end text-gray-500 text-sm">- Shop Anything</p>
                  </div>
              </div>

                <div className={`mt-6 flex flex-col gap-3 ${is480 ? "w-[95vw]" : "w-[28rem]"}`}>
                  <form noValidate onSubmit={handleSubmit(handleSignup)} className="flex flex-col gap-3">

                    {/* Tabs */}
                    <div className="flex border-b border-gray-200 mb-1">
                      <button
                        type="button"
                        onClick={() => { setSignupMode('email'); reset(); }}
                        className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
                          signupMode === 'email' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Email Signup
                      </button>
                      <button
                        type="button"
                        onClick={() => { setSignupMode('mobile'); reset(); }}
                        className={`flex-1 py-2 text-sm font-medium text-center border-b-2 transition-colors ${
                          signupMode === 'mobile' ? 'border-black text-black' : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        Mobile Signup
                      </button>
                    </div>

                    <MotionConfig whileHover={{y:-5}}>

                      <motion.div>
                        <input 
                          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                          placeholder="Username"
                          {...register("name", {required: "Username is required"})}
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
                      </motion.div>

                    {signupMode === 'email' ? (
                      <motion.div>
                        <input 
                          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                          placeholder="Email"
                          {...register("email", {
                            required: "Email is required",
                            pattern: {
                              value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                              message: "Enter a valid email"
                            }
                          })}
                        />
                        {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                      </motion.div>
                    ) : (
                      <motion.div>
                        <input 
                          type="tel"
                          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black"
                          placeholder="Mobile Number"
                          {...register("mobile", {
                            required: "Mobile number is required",
                            pattern: {
                              value: /^[0-9]{10}$/,
                              message: "Enter a valid 10-digit mobile number"
                            }
                          })}
                        />
                        {errors.mobile && <p className="text-xs text-red-500 mt-1">{errors.mobile.message}</p>}
                      </motion.div>
                    )}

                      <motion.div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black pr-10"
                          placeholder="Password"
                          {...register("password", {
                            required: "Password is required",
                            pattern: {
                              value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                              message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`
                            }
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                        >
                          <EyeIcon open={showPassword} />
                        </button>
                        {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
                      </motion.div>
                      
                      <motion.div className="relative">
                        <input 
                          type={showConfirmPassword ? 'text' : 'password'}
                          className="w-full px-3 py-2.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-black pr-10"
                          placeholder="Confirm Password"
                          {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value, fromValues) => value === fromValues.password || "Passwords doesn't match"
                          })}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-500 hover:text-gray-700"
                        >
                          <EyeIcon open={showConfirmPassword} />
                        </button>
                        {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>}
                      </motion.div>
                    </MotionConfig>

                    <motion.div whileHover={{scale:1.020}} whileTap={{scale:1}}>
                      <button
                        type="submit"
                        disabled={status === 'pending'}
                        className="w-full h-10 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 disabled:opacity-60 flex items-center justify-center gap-2"
                      >
                        {status === 'pending' && <Spinner />}
                        Signup
                      </button>
                    </motion.div>

                    <div className="flex flex-row justify-between items-center flex-wrap-reverse gap-2 text-sm">
                        <MotionConfig whileHover={{x:2}} whileTap={{scale:1.050}}>
                            <motion.div>
                                <Link to="/forgot-password" className="text-gray-900 hover:underline">Forgot password</Link>
                            </motion.div>

                            <motion.div>
                                <Link to="/login" className="text-gray-900 hover:underline">
                                  Already a member? <span className="text-gray-700 font-medium">Login</span>
                                </Link>
                            </motion.div>
                        </MotionConfig>
                    </div>

                </form>
                </div>
        </div>
    </div>
  )
}