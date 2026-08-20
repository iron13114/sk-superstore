import {FormHelperText, Stack, TextField, Typography, useTheme, useMediaQuery, Tabs, Tab, InputAdornment, IconButton} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser, signupAsync,selectSignupStatus, selectSignupError, clearSignupError, resetSignupStatus} from '../AuthSlice'
import { showToast } from '../../../utils/toast';
import { MotionConfig , motion} from 'framer-motion'

export const Signup = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectSignupStatus)
  const error=useSelector(selectSignupError)
  const [signupMode, setSignupMode] = useState('email');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const is900=useMediaQuery(theme.breakpoints.down(900))
  const is480=useMediaQuery(theme.breakpoints.down(480))

  // handles user redirection
  useEffect(()=>{
    if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
    else if(loggedInUser){
      navigate("/")
    }
  },[loggedInUser])


  // handles signup error and toast them
  useEffect(()=>{
    if(error){
      showToast.error(error.message)
    }
  },[error])

  
  useEffect(()=>{
    if(status==='fullfilled'){
      showToast.success("Welcome! Verify your email to start shopping on mern-ecommerce.")
      reset()
    }
    return ()=>{
      dispatch(clearSignupError())
      dispatch(resetSignupStatus())
    }
  },[status])

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
    <Stack width={'100vw'} height={'100vh'} flexDirection={'row'} sx={{overflowY:"hidden"}}>

        <Stack flex={1} justifyContent={'center'} alignItems={'center'}>

              <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>
                  <Stack rowGap={'.4rem'}>
                    <Typography variant='h2' sx={{wordBreak:"break-word"}} fontWeight={600}>SKSuperStore</Typography>
                    <Typography alignSelf={'flex-end'} color={'GrayText'} variant='body2'>- Shop Anything</Typography>
                  </Stack>

              </Stack>

                <Stack mt={4} spacing={2} width={is480?"95vw":'28rem'} component={'form'} noValidate onSubmit={handleSubmit(handleSignup)}>
                  <Tabs value={signupMode} onChange={(e, newMode) => { setSignupMode(newMode); reset(); }} variant="fullWidth" sx={{ mb: 1 }}>
                              <Tab label="Email Signup" value="email" />
                              <Tab label="Mobile Signup" value="mobile" />
                          </Tabs>

                    <MotionConfig whileHover={{y:-5}}>

                      <motion.div>
                        <TextField fullWidth {...register("name",{required:"Username is required"})} placeholder='Username'/>
                        {errors.name && <FormHelperText error>{errors.name.message}</FormHelperText>}
                      </motion.div>

                    {signupMode === 'email' ? (
                      /* ---------------- EMAIL FORM FIELDS ---------------- */
                      <>
                        <motion.div>
                          <TextField 
                            fullWidth 
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g,
                                message: "Enter a valid email"
                              }
                            })} 
                            placeholder='Email'
                          />
                          {errors.email && <FormHelperText error>{errors.email.message}</FormHelperText>}
                        </motion.div>
                      </>
                    ) : (
                      /* ---------------- MOBILE FORM FIELDS ---------------- */
                      <>
                        <motion.div>
                          <TextField 
                            fullWidth 
                            type='tel'
                            {...register("mobile", {
                              required: "Mobile number is required",
                              pattern: {
                                value: /^[0-9]{10}$/,
                                message: "Enter a valid 10-digit mobile number"
                              }
                            })} 
                            placeholder='Mobile Number'
                          />
                          {errors.mobile && <FormHelperText error>{errors.mobile.message}</FormHelperText>}
                        </motion.div>
                      </>
                    )}

                        <motion.div>
                          <TextField 
                            type={showPassword ? 'text' : 'password'} 
                            fullWidth 
                            {...register("password", {
                              required: "Password is required",
                              pattern: {
                                value: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm,
                                message: `at least 8 characters, must contain at least 1 uppercase letter, 1 lowercase letter, and 1 number, Can contain special characters`
                              }
                            })} 
                            placeholder='Password'
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              ),
                            }}
                          />
                          {errors.password && <FormHelperText error>{errors.password.message}</FormHelperText>}
                        </motion.div>
                      
                      <motion.div>
                        <TextField 
                          type={showConfirmPassword ? 'text' : 'password'} 
                          fullWidth 
                          {...register("confirmPassword", {
                            required: "Confirm Password is required",
                            validate: (value, fromValues) => value === fromValues.password || "Passwords doesn't match"
                          })} 
                          placeholder='Confirm Password'
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                              </InputAdornment>
                            ),
                          }}
                        />
                        {errors.confirmPassword && <FormHelperText error>{errors.confirmPassword.message}</FormHelperText>}
                      </motion.div>
                    </MotionConfig>

                    <motion.div whileHover={{scale:1.020}} whileTap={{scale:1}}>
                      <LoadingButton sx={{height:'2.5rem'}} fullWidth loading={status==='pending'} type='submit' variant='contained'>Signup</LoadingButton>
                    </motion.div>

                    <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'}>
                        <MotionConfig whileHover={{x:2}} whileTap={{scale:1.050}}>
                            <motion.div>
                                <Typography mr={'1.5rem'} sx={{textDecoration:"none",color:"text.primary"}} to={'/forgot-password'} component={Link}>Forgot password</Typography>
                            </motion.div>

                            <motion.div>
                                <Typography sx={{textDecoration:"none",color:"text.primary"}} to={'/login'} component={Link}>Already a member? <span style={{color:theme.palette.primary.dark}}>Login</span></Typography>
                            </motion.div>
                        </MotionConfig>
                    </Stack>

                </Stack>


        </Stack>
    </Stack>
  )
}