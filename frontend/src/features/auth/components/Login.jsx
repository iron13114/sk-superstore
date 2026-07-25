import {FormHelperText, Stack, TextField, Typography, useMediaQuery, useTheme, Tabs, Tab} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from "react-hook-form"
import {useDispatch,useSelector} from 'react-redux'
import { LoadingButton } from '@mui/lab';
import {selectLoggedInUser,loginAsync,selectLoginStatus, selectLoginError, clearLoginError, resetLoginStatus} from '../AuthSlice'
import { toast } from 'react-toastify'
import {MotionConfig, motion} from 'framer-motion'

export const Login = () => {
  const dispatch=useDispatch()
  const status=useSelector(selectLoginStatus)
  const [loginMode, setLoginMode] = useState('email'); 
  const error=useSelector(selectLoginError)
  const loggedInUser=useSelector(selectLoggedInUser)
  const {register,handleSubmit,reset,formState: { errors }} = useForm()
  const navigate=useNavigate()
  const theme=useTheme()
  const is480=useMediaQuery(theme.breakpoints.down(480))
  
  // handles user redirection
  useEffect(()=>{
    if(loggedInUser && loggedInUser?.isVerified){
      navigate("/")
    }
    else if(loggedInUser && !loggedInUser?.isVerified){
      navigate("/verify-otp")
    }
  })

  // handles login error and toast them
  useEffect(()=>{
    if(error){
      toast.error(error.message)
    }
  },[error])

  // handles login status and dispatches reset actions to relevant states in cleanup
  useEffect(()=>{
    if(status==='fullfilled' && loggedInUser?.isVerified===true){
      toast.success(`Login successful`)
      reset()
    }
    return ()=>{
      dispatch(clearLoginError())
      dispatch(resetLoginStatus())
    }
  })

  const handleLogin=(data)=>{
    const cred={...data}
    delete cred.confirmPassword
    dispatch(loginAsync(cred))
  
    if (loginMode === 'mobile') {
        delete cred.email;
        delete cred.password;
    } else {
        delete cred.mobile;
    }
    dispatch(loginAsync(cred))
}
  return (
    <Stack width={'100vw'} height={'100vh'} flexDirection={'row'} sx={{overflowY:"hidden"}}>

        <Stack flex={1} justifyContent={'center'} alignItems={'center'}>

              <Stack flexDirection={'row'} justifyContent={'center'} alignItems={'center'}>

                <Stack rowGap={'.4rem'}>
                  <Typography variant='h2' sx={{wordBreak:"break-word"}} fontWeight={600}>SKSuperStore</Typography>
                  <Typography alignSelf={'flex-end'} color={'GrayText'} variant='body2'>- Shop Anything</Typography>
                </Stack>

              </Stack>

          <Stack mt={4} spacing={2} width={is480 ? "95vw" : '28rem'} component={'form'} noValidate onSubmit={handleSubmit(handleLogin)}>

              {/* Toggle Switcher */}
              <Tabs 
                value={loginMode} 
                onChange={(e, newMode) => { setLoginMode(newMode); reset(); }} 
                variant="fullWidth" 
                sx={{ mb: 1, borderBottom: 1, borderColor: 'divider' }}
              >
                <Tab label="Email Address" value="email" />
                <Tab label="Mobile & OTP" value="mobile" />
              </Tabs>

              {loginMode === 'email' ? (
                <>
                  {/* Standard Email View */}
                  <motion.div whileHover={{ y: -5 }}>
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
                    {errors.email && <FormHelperText sx={{ mt: 1 }} error>{errors.email.message}</FormHelperText>}
                  </motion.div>

                  <motion.div whileHover={{ y: -5 }}>
                    <TextField 
                      type='password' 
                      fullWidth 
                      {...register("password", { required: "Password is required" })} 
                      placeholder='Password' 
                    />
                    {errors.password && <FormHelperText sx={{ mt: 1 }} error>{errors.password.message}</FormHelperText>}
                  </motion.div>
                </>
              ) : (
                <>
                  {/* Mobile Verification View */}
                  <motion.div whileHover={{ y: -5 }}>
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
                    {errors.mobile && <FormHelperText sx={{ mt: 1 }} error>{errors.mobile.message}</FormHelperText>}
                  </motion.div>
                  
                  {/* If your backend immediately requires an OTP input box along with the mobile number */}
                  <motion.div whileHover={{ y: -5 }}>
                    <TextField 
                      type='number' 
                      fullWidth 
                      {...register("otp", { required: "OTP is required" })} 
                      placeholder='Enter 4-Digit OTP' 
                    />
                    {errors.otp && <FormHelperText sx={{ mt: 1 }} error>{errors.otp.message}</FormHelperText>}
                  </motion.div>
                </>
              )}
              
              <motion.div whileHover={{ scale: 1.020 }} whileTap={{ scale: 1 }}>
                <LoadingButton fullWidth sx={{ height: '2.5rem' }} loading={status === 'pending'} type='submit' variant='contained'>
                  {loginMode === 'email' ? 'Login' : 'Verify & Login'}
                </LoadingButton>
              </motion.div>

              <Stack flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'} flexWrap={'wrap-reverse'} >
                <MotionConfig whileHover={{ x: 2 }} whileTap={{ scale: 1.050 }}>
                    <motion.div>
                        <Typography mr={'1.5rem'} sx={{ textDecoration: "none", color: "text.primary" }} to={'/forgot-password'} component={Link}>Forgot password</Typography>
                    </motion.div>

                    <motion.div>
                      <Typography sx={{ textDecoration: "none", color: "text.primary" }} to={'/signup'} component={Link}>Don't have an account? <span style={{ color: theme.palette.primary.dark }}>Register</span></Typography>
                    </motion.div>
                </MotionConfig>    

              </Stack>

          </Stack>
        </Stack>
    </Stack>

  )
}
