import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import { SHIPPING, TAXES } from '../../../constants'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getGuestCheckoutAddresses, saveGuestCheckoutAddresses, getGuestSelectedAddress, saveGuestSelectedAddress, getGuestPaymentMethod, saveGuestPaymentMethod, addGuestOrder, clearGuestCheckoutData } from '../../cart/guestCheckout'

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches)
    useEffect(() => {
        const media = window.matchMedia(query)
        const listener = (e) => setMatches(e.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [query])
    return matches
}

export const Checkout = () => {
    const addresses = useSelector(selectAddresses)
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const [guestAddresses, setGuestAddresses] = useState([])
    const [guestEmail, setGuestEmail] = useState('')
    const [guestPhone, setGuestPhone] = useState('')
    const allAddresses = loggedInUser ? addresses : guestAddresses
    const addressStatus = useSelector(selectAddressStatus)
    const navigate = useNavigate()
    const cartItems = useSelector(selectCartItems)
    const orderStatus = useSelector(selectOrderStatus)
    const currentOrder = useSelector(selectCurrentOrder)

    const orderTotal = cartItems.reduce((acc, item) => {
        const price = item.variantPrice || item.product?.price || 0
        return acc + (price * (item.quantity || 0))
    }, 0)

    const is900 = useMediaQuery('(max-width: 900px)')
    const is480 = useMediaQuery('(max-width: 480px)')

    useEffect(() => {
        if (!loggedInUser) {
            const savedAddresses = getGuestCheckoutAddresses()
            const savedSelected = getGuestSelectedAddress()
            const savedPayment = getGuestPaymentMethod()
            const savedEmail = localStorage.getItem('guestEmail')
            const savedPhone = localStorage.getItem('guestPhone')
            setGuestAddresses(savedAddresses)
            if (savedSelected) setSelectedAddress(savedSelected)
            if (savedPayment) setSelectedPaymentMethod(savedPayment)
            if (savedEmail) setGuestEmail(savedEmail)
            if (savedPhone) setGuestPhone(savedPhone)
        }
    }, [loggedInUser])

    useEffect(() => {
        if (!loggedInUser) saveGuestCheckoutAddresses(guestAddresses)
    }, [guestAddresses, loggedInUser])

    useEffect(() => {
        if (!loggedInUser && selectedAddress) saveGuestSelectedAddress(selectedAddress)
    }, [selectedAddress, loggedInUser])

    useEffect(() => {
        if (!loggedInUser && selectedPaymentMethod) saveGuestPaymentMethod(selectedPaymentMethod)
    }, [selectedPaymentMethod, loggedInUser])

    useEffect(() => {
        if (addressStatus === 'fulfilled') {
            reset()
        } else if (addressStatus === 'rejected') {
            toast.error('Error adding your address')
        }
    }, [addressStatus, reset])

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            if (!loggedInUser) {
                localStorage.removeItem('guestCart')
                addGuestOrder(currentOrder)
                clearGuestCheckoutData()
            } else {
                dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            }
            navigate(`/track-order/${currentOrder?._id}`)
        }
    }, [currentOrder, loggedInUser, dispatch, navigate])

    useEffect(() => {
        if (allAddresses.length > 0 && !selectedAddress) {
            setSelectedAddress(allAddresses[0])
        }
    }, [allAddresses])

    const handleAddAddress = (data) => {
        if (!loggedInUser) {
            const newAddress = {
                ...data,
                _id: 'guest_' + Date.now(),
                type: data.type || 'Home'
            }
            setGuestAddresses(prev => [...prev, newAddress])
            setSelectedAddress(newAddress)
            reset()
            toast.success('Address added for checkout')
            return
        }
        const address = { ...data, user: loggedInUser._id }
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder = () => {
        if (!selectedPaymentMethod) {
            toast.error('Please select a payment method')
            return
        }
        if (!selectedAddress) {
            toast.error('Please select a delivery address')
            return
        }
        if (!cartItems || cartItems.length === 0) {
            toast.error('Your cart is empty')
            return
        }
        if (!loggedInUser) {
            if (!guestEmail || !guestEmail.includes('@')) {
                toast.error('Please enter a valid email')
                return
            }
            if (!guestPhone || guestPhone.length < 10) {
                toast.error('Please enter a valid phone number')
                return
            }
        }

        const order = {
            item: cartItems,
            address: [selectedAddress],
            paymentMode: selectedPaymentMethod, 
            status: 'Pending',
            total: Number(orderTotal) + Number(SHIPPING) + Number(TAXES)
        }

        if (loggedInUser?._id) {
            order.user = loggedInUser._id
        } else {
            order.guestEmail = guestEmail
            order.guestPhone = guestPhone
        }

        dispatch(createOrderAsync(order))
    }

    return (
        <div className={`flex flex-row flex-wrap justify-center items-start gap-8 p-4 mt-2 mb-20 ${is900 ? '' : ''}`}>
            {/* Left Column */}
            <div className="flex flex-col gap-6 max-w-2xl w-full">
                {/* Heading */}
                <div className="flex flex-row items-center gap-2">
                    <motion.div whileHover={{ x: -5 }}>
                        <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                        </Link>
                    </motion.div>
                    <h1 className="text-2xl font-semibold text-gray-900">Shipping Information</h1>
                </div>

                {/* Address Form */}
                    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit(handleAddAddress)}>
                        {/* Type - Home or Shop */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                            <select
                                {...register('type', { required: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                            >
                                <option value="">Select type</option>
                                <option value="Home">Home</option>
                                <option value="Shop">Shop</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Street</label>
                            <input
                                type="text"
                                {...register('street', { required: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* City Dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Area</label>
                                <select
                                    {...register('city', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">Select area</option>
                                    <option value="Sakri bajaar">Sakri bajaar</option>
                                    <option value="Narpatinagar">Narpatinagar</option>
                                    <option value="Sagarpur">Sagarpur</option>
                                    <option value="Kanhouli">Kanhouli</option>
                                    <option value="Dahaura">Dahaura</option>
                                </select>
                            </div>

                            {/* State Dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                                <select
                                    {...register('state', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">Select state</option>
                                    <option value="Bihar">Bihar</option>
                                </select>
                            </div>

                            {/* Postal Code Dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
                                <select
                                    {...register('postalCode', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">Select postal code</option>
                                    <option value="847239">847239</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {/* Country Dropdown */}
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                                <select
                                    {...register('country', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">Select country</option>
                                    <option value="India">India</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex flex-row gap-2 self-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                Add
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                            >
                                Reset
                            </button>
                        </div>
                    </form>
                {/* Existing Addresses */}
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Address</h2>
                        <p className="text-sm text-gray-500">Choose from existing addresses</p>
                    </div>

                    <div className={`grid gap-3 ${is480 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                        {allAddresses.map((address, index) => (
                            <div
                                key={address._id || index}
                                onClick={() => setSelectedAddress(address)}
                                className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedAddress?._id === address._id
                                    ? 'border-black bg-gray-50'
                                    : 'border-gray-200 hover:border-gray-400'
                                    }`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="radio"
                                        checked={selectedAddress?._id === address._id}
                                        onChange={() => setSelectedAddress(address)}
                                        className="w-4 h-4 accent-black"
                                    />
                                    <span className="font-medium text-sm text-gray-900">{address.type}</span>
                                </div>
                                <div className="text-sm text-gray-600 space-y-0.5 pl-6">
                                    <p>{address.street}</p>
                                    <p>{address.city}, {address.state}</p>
                                    <p>{address.country} - {address.postalCode}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Guest Contact Info */}
                {!loggedInUser && (
                    <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Contact Information</h2>
                        <p className="text-sm text-gray-500">We'll send your order confirmation here</p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    value={guestEmail}
                                    onChange={(e) => {
                                        setGuestEmail(e.target.value)
                                        localStorage.setItem('guestEmail', e.target.value)
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                                <input
                                    type="tel"
                                    required
                                    value={guestPhone}
                                    onChange={(e) => {
                                        setGuestPhone(e.target.value)
                                        localStorage.setItem('guestPhone', e.target.value)
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {/* Payment Methods */}
                <div className="flex flex-col gap-3">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-900">Payment Methods</h2>
                        <p className="text-sm text-gray-500">Please select a payment method</p>
                    </div>
                    <div
                        onClick={() => setSelectedPaymentMethod('COD')}
                        className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'COD'
                            ? 'border-black bg-gray-50'
                            : 'border-gray-200 hover:border-gray-400'
                            }`}
                    >
                        <input
                            type="radio"
                            checked={selectedPaymentMethod === 'COD'}
                            onChange={() => setSelectedPaymentMethod('COD')}
                            className="w-4 h-4 accent-black"
                        />
                        <span className="text-sm text-gray-900">COD (Cash on Delivery)</span>
                    </div>
                </div>
            </div>

            {/* Right Column - Order Summary */}
            <div className={`flex flex-col gap-4 ${is900 ? 'w-full' : 'w-[24rem]'}`}>
                <h2 className="text-2xl font-semibold text-gray-900">Order Summary</h2>
                <Cart checkout={true} />
                <button
                    onClick={handleCreateOrder}
                    disabled={orderStatus === 'pending'}
                    className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                >
                    {orderStatus === 'pending' ? 'Placing Order...' : 'Place Order'}
                </button>
            </div>
        </div>
    )
}