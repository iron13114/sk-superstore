import { FormHelperText, Paper, Stack, TextField, Typography, useMediaQuery, useTheme, Tabs, Tab} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from 'react-redux'
import { clearForgotPasswordError, clearForgotPasswordSuccessMessage, forgotPasswordAsync,resetForgotPasswordStatus,selectForgotPasswordError, selectForgotPasswordStatus, selectForgotPasswordSuccessMessage } from '../AuthSlice'
import { LoadingButton } from '@mui/lab'
import { Link } from 'react-router-dom'
import {motion} from 'framer-motion'

export const ForgotPassword = () => {
    const {register,handleSubmit,reset,formState: { errors }} = useForm()
    const dispatch=useDispatch()
    const [resetMode, setResetMode] = useState('email');
    const status=useSelector(selectForgotPasswordStatus)
    const error=useSelector(selectForgotPasswordError)
    const successMessage=useSelector(selectForgotPasswordSuccessMessage)
    const theme=useTheme()
    const is500=useMediaQuery(theme.breakpoints.down(500))

    useEffect(()=>{
        if(error){
            toast.error(error?.message)
        }
        return ()=>{
            dispatch(clearForgotPasswordError())
        }
    },[error])

    useEffect(()=>{
        if(status==='fullfilled'){
            toast.success(successMessage?.message)
        }
        return ()=>{
            dispatch(clearForgotPasswordSuccessMessage())
        }
    },[status])

    useEffect(()=>{
        return ()=>{
            dispatch(resetForgotPasswordStatus())
        }
    },[])

    const handleForgotPassword = async (data) => {
        // You can now dispatch different actions based on resetMode
        dispatch(forgotPasswordAsync({ ...data, mode: resetMode }));
        reset();
    };

  return (
    <Stack width={'100vw'} height={'100vh'} justifyContent={'center'} alignItems={'center'}>

        <Stack rowGap="1rem" width={{ xs: "90%", sm: "400px" }}>
            <Stack component={Paper} elevation={3}         
        sx={{
          width: "100%",
          p: 3,
          borderRadius: 2,
        }}>
                <Stack component={'form'} onSubmit={handleSubmit(handleForgotPassword)} spacing = {2}>
                    <Tabs value={resetMode} onChange={(e, newMode) => setResetMode(newMode)} variant="fullWidth" sx={{ mb: 2 }}>
                        <Tab label="Via Email" value="email" />
                        <Tab label="Via OTP (Mobile)" value="mobile" />
                    </Tabs>

                    {resetMode === 'email' ? (
                        <TextField {...register("email", { required: "Required" })} placeholder='Enter registered email' />
                    ) : (
                        <TextField {...register("mobile", { required: "Required" })} placeholder='Enter registered mobile' />
                    )}

                    <LoadingButton type='submit' variant='contained'>
                        {resetMode === 'email' ? 'Send Reset Link' : 'Send OTP'}
                    </LoadingButton>
                </Stack>
            </Stack>
            
            {/* back to login navigation */}
            <motion.div whileHover={{x:2}} whileTap={{scale:1.050}}>
                <Typography sx={{textDecoration:"none",color:"text.primary",width:"fit-content"}} mt={2} to={'/login'} variant='body2' component={Link}>Go back to <span style={{color:theme.palette.primary.dark}}>login</span></Typography>
            </motion.div>
        </Stack>
    </Stack>
  )
}
