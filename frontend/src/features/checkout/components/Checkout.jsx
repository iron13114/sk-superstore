import { Stack, TextField, Typography, Button, Grid, FormControl, Radio, IconButton, useTheme, useMediaQuery } from '@mui/material'
import { LoadingButton } from '@mui/lab'
import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { SHIPPING, TAXES } from '../../../constants'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export const Checkout = () => {

    const status = ''
    const addresses = useSelector(selectAddresses)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const [guestAddresses, setGuestAddresses] = useState([]);
    const allAddresses = loggedInUser ? addresses : guestAddresses;
    const addressStatus = useSelector(selectAddressStatus)
    const navigate = useNavigate()
    const cartItems = useSelector(selectCartItems)
    const orderStatus = useSelector(selectOrderStatus)
    const currentOrder = useSelector(selectCurrentOrder)
    const orderTotal = cartItems.reduce((acc, item) => (item.product.price * item.quantity) + acc, 0)
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    
    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            reset()
        } else if (addressStatus === 'rejected') {
            alert('Error adding your address')
        }
    }, [addressStatus])

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            navigate(`/order-success/${currentOrder?._id}`)
        }
    }, [currentOrder])
    // Auto selects Address
    useEffect(() => {
    if (allAddresses.length > 0 && !selectedAddress) {
        setSelectedAddress(allAddresses[0]);
    }
    }, [allAddresses]);

    const handleAddAddress = (data) => {
        if (!loggedInUser) {
            const newAddress = { 
                ...data, 
                _id: 'guest_' + Date.now(),
                type: data.type || 'Home'
            };
            setGuestAddresses(prev => [...prev, newAddress]);
            setSelectedAddress(newAddress); // Auto-select the newly added address
            reset();
            toast.success("Address added for checkout");
            return;
        }
        
        const address = { ...data, user: loggedInUser._id };
        dispatch(addAddressAsync(address));
    }

    const handleCreateOrder = () => {
        // 1. Check payment method selection
        if (!selectedPaymentMethod) {
            toast.error("Please select a payment method");
            return;
        }

        // 2. Check address selection
        if (!selectedAddress) {
            toast.error("Please select a delivery address");
            return;
        }

        // 3. Check cart items
        if (!cartItems || cartItems.length === 0) {
            toast.error("Your cart is empty");
            return;
        }

        // 4. CHECK AUTHENTICATION: Redirect to login if user is not authenticated
        if (!loggedInUser || !loggedInUser?._id) {
            toast.info("Please log in to place your order");
            // Redirect to login and append checkout redirect query parameter
            navigate('/login?redirect=/checkout');
            return;
        }

        // 5. User is logged in -> proceed to create order
        const order = {
            user: loggedInUser._id,
            item: cartItems,
            address: selectedAddress,
            paymentMode: selectedPaymentMethod === 'COD' ? 'COD' : 'CARD',
            status: "Pending",
            total: Number(orderTotal) + Number(SHIPPING) + Number(TAXES)
        };
            dispatch(createOrderAsync(order));
    };

    return (
        <Stack flexDirection={'row'} p={2} rowGap={10} justifyContent={'center'} flexWrap={'wrap'} mb={'5rem'} mt={2} columnGap={4} alignItems={'flex-start'}>

            {/* Left box */}
            <Stack rowGap={4}>

                {/* Heading */}
                <Stack flexDirection={'row'} columnGap={is480 ? 0.3 : 1} alignItems={'center'}>
                    <motion.div whileHover={{ x: -5 }}>
                        <IconButton component={Link} to={"/cart"}><ArrowBackIcon fontSize={is480 ? "medium" : 'large'} /></IconButton>
                    </motion.div>
                    <Typography variant='h4'>Shipping Information</Typography>
                </Stack>

                {/* Address Form */}
                <Stack component={'form'} noValidate rowGap={2} onSubmit={handleSubmit(handleAddAddress)}>
                    <Stack>
                        <Typography gutterBottom>Type</Typography>
                        <TextField placeholder='Eg. Home, Business' {...register("type", { required: true })} />
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Street</Typography>
                        <TextField {...register("street", { required: true })} />
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Country</Typography>
                        <TextField {...register("country", { required: true })} />
                    </Stack>

                    <Stack>
                        <Typography gutterBottom>Phone Number</Typography>
                        <TextField type='number' {...register("phoneNumber", { required: true })} />
                    </Stack>

                    <Stack flexDirection={'row'}>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>City</Typography>
                            <TextField {...register("city", { required: true })} />
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>State</Typography>
                            <TextField {...register("state", { required: true })} />
                        </Stack>
                        <Stack width={'100%'}>
                            <Typography gutterBottom>Postal Code</Typography>
                            <TextField type='number' {...register("postalCode", { required: true })} />
                        </Stack>
                    </Stack>

                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={1}>
                        <LoadingButton loading={status === 'pending'} type='submit' variant='contained'>add</LoadingButton>
                        <Button color='error' variant='outlined' onClick={() => reset()}>Reset</Button>
                    </Stack>
                </Stack>

                {/* Existing Address */}
                <Stack rowGap={3}>
                    <Stack>
                        <Typography variant='h6'>Address</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Choose from existing Addresses</Typography>
                    </Stack>

                    <Grid container gap={2} width={is900 ? "auto" : '50rem'} justifyContent={'flex-start'} alignContent={'flex-start'}>
                        {allAddresses.map((address, index) => (
                            <FormControl item key={address._id || index}>
                                <Stack p={is480 ? 2 : 2} width={is480 ? '100%' : '20rem'}>
                                    <Stack flexDirection={'row'} alignItems={'center'}>
                                        <Radio 
                                            checked={selectedAddress?._id === address._id} 
                                            name='addressRadioGroup' 
                                            onChange={() => setSelectedAddress(address)}
                                        />
                                        <Typography>{address.type}</Typography>
                                    </Stack>
                                    {/* details */}
                                    <Stack>
                                        <Typography>{address.street}</Typography>
                                        <Typography>{address.state}, {address.city}, {address.country}, {address.postalCode}</Typography>
                                        <Typography>{address.phoneNumber}</Typography>
                                    </Stack>
                                </Stack>
                            </FormControl>
                        ))}
                    </Grid>
                </Stack>
                
                {/* Payment Methods */}
                <Stack rowGap={3}>
                    <Stack>
                        <Typography variant='h6'>Payment Methods</Typography>
                        <Typography variant='body2' color={'text.secondary'}>Please select a payment method</Typography>
                    </Stack>
                    
                    <Stack rowGap={2}>
                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio 
                                checked={selectedPaymentMethod === 'COD'} 
                                onChange={() => setSelectedPaymentMethod('COD')}
                            />
                            <Typography>Cash</Typography>
                        </Stack>

                        <Stack flexDirection={'row'} justifyContent={'flex-start'} alignItems={'center'}>
                            <Radio 
                                checked={selectedPaymentMethod === 'CARD'} 
                                onChange={() => setSelectedPaymentMethod('CARD')}
                            />
                            <Typography>Card</Typography>
                        </Stack>
                    </Stack>
                </Stack>
            </Stack>

            {/* Right box */}
            <Stack width={is900 ? '100%' : 'auto'} alignItems={is900 ? 'flex-start' : ''}>
                <Typography variant='h4'>Order summary</Typography>
                <Cart checkout={true} />
                <LoadingButton fullWidth loading={orderStatus === 'pending'} variant='contained' onClick={handleCreateOrder} size='large'>
                    Pay and order
                </LoadingButton>
            </Stack>

        </Stack>
    )
}