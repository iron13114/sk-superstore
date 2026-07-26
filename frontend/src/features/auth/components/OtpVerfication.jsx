import { FormHelperText, Paper, Stack, TextField, Typography, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  clearOtpVerificationError, 
  clearResendOtpError, 
  clearResendOtpSuccessMessage, 
  resendOtpAsync, 
  resetOtpVerificationStatus, 
  resetResendOtpStatus, 
  selectLoggedInUser, 
  selectOtpVerificationError, 
  selectOtpVerificationStatus, 
  selectResendOtpError, 
  selectResendOtpStatus, 
  selectResendOtpSuccessMessage, 
  verifyOtpAsync,
  logoutAsync 
} from '../AuthSlice'
import { LoadingButton } from '@mui/lab'
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

    // Handles resend otp error
    useEffect(() => {
        if (resendOtpError) {
            toast.error(resendOtpError.message)
        }
        return () => {
            dispatch(clearResendOtpError())
        }
    }, [resendOtpError, dispatch])

    // Handles resend otp success message
    useEffect(() => {
        if (resendOtpSuccessMessage) {
            toast.success(resendOtpSuccessMessage.message)
        }
        return () => {
            dispatch(clearResendOtpSuccessMessage())
        }
    }, [resendOtpSuccessMessage, dispatch])

    // Handles error while verifying otp
    useEffect(() => {
        if (otpVerificationError) {
            toast.error(otpVerificationError.message)
        }
        return () => {
            dispatch(clearOtpVerificationError())
        }
    }, [otpVerificationError, dispatch])

    useEffect(() => {
        if (otpVerificationStatus === 'fulfilled' || otpVerificationStatus === 'fullfilled') {
            toast.success("Email verified! We are happy to have you here")
            dispatch(resetResendOtpStatus())
        }
        return () => {
            dispatch(resetOtpVerificationStatus())
        }
    }, [otpVerificationStatus, dispatch])

    return (
        <Stack width={'100vw'} height={'100vh'} flexDirection={'column'} rowGap={3} justifyContent="center" alignItems="center">
            <Stack component={Paper} elevation={1} position={'relative'} justifyContent={'center'} alignItems={'center'} p={'2rem'} rowGap={'2rem'} width={'26rem'}>
                
                <Typography mt={2} variant='h5' fontWeight={500}>Verify Your Email Address</Typography>

                {resendOtpStatus === 'fulfilled' || resendOtpStatus === 'fullfilled' ? (
                    <Stack width={'100%'} rowGap={'1rem'} component={'form'} noValidate onSubmit={handleSubmit(handleVerifyOtp)}>
                        <Stack rowGap={'1rem'}> 
                            <Stack>
                                <Typography color={'GrayText'}>Enter the 4 digit OTP sent on</Typography>
                                <Typography fontWeight={'600'} color={'GrayText'}>{loggedInUser?.email}</Typography>
                            </Stack>
                            <Stack>
                                <TextField {...register("otp", { required: "OTP is required", minLength: { value: 4, message: "Please enter a 4 digit OTP" } })} fullWidth type='number' />
                                {errors?.otp && <FormHelperText sx={{ color: "red" }}>{errors.otp.message}</FormHelperText>}
                            </Stack>
                        </Stack>
                        <LoadingButton loading={otpVerificationStatus === 'pending'} type='submit' fullWidth variant='contained'>Verify</LoadingButton>
                    </Stack>
                ) : (
                    <Stack width={'100%'} rowGap={'1.5rem'} alignItems={'center'}>
                        <Stack textAlign={'center'}>
                            <Typography color={'GrayText'}>We will send an OTP to</Typography>
                            <Typography fontWeight={'600'} color={'GrayText'}>{loggedInUser?.email || "your registered email"}</Typography>
                        </Stack>
                        <LoadingButton onClick={handleSendOtp} loading={resendOtpStatus === 'pending'} fullWidth variant='contained'>Get OTP</LoadingButton>
                    </Stack>
                )}

                <Button variant="text" size="small" onClick={handleBackToLogin} sx={{ mt: 1 }}>
                    ← Back to Login
                </Button>

            </Stack>
        </Stack>
    )
}