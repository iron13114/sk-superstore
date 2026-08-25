import React, { useEffect, useState } from 'react'
import { Cart } from '../../cart/components/Cart'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { addAddressAsync, selectAddressStatus, selectAddresses } from '../../address/AddressSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link, useNavigate } from 'react-router-dom'
import { createOrderAsync, selectCurrentOrder, selectOrderStatus, resetCurrentOrder } from '../../order/OrderSlice'
import { resetCartByUserIdAsync, selectCartItems } from '../../cart/CartSlice'
import { SHIPPING, TAXES } from '../../../constants'
import { motion } from 'framer-motion'
import { showToast } from '../../../utils/toast';
import { useTranslation } from 'react-i18next';
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
    const addressesRaw = useSelector(selectAddresses)
    const addresses = Array.isArray(addressesRaw) ? addressesRaw : [] 
    const [selectedAddress, setSelectedAddress] = useState(null)
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null)
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const dispatch = useDispatch()
    const { t } = useTranslation();
    const loggedInUser = useSelector(selectLoggedInUser)
    const [guestAddresses, setGuestAddresses] = useState([])
    const [guestEmail, setGuestEmail] = useState('')
    const [guestPhone, setGuestPhone] = useState('')
    const allAddresses = loggedInUser ? addresses : guestAddresses
    const addressStatus = useSelector(selectAddressStatus)
    const navigate = useNavigate()
    const cartItemsRaw = useSelector(selectCartItems)
    const cartItems = Array.isArray(cartItemsRaw) ? cartItemsRaw : []  
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
            showToast.error(t('checkout.addressError'))
        }
    }, [addressStatus, reset, t])

    useEffect(() => {
        if (currentOrder && currentOrder?._id) {
            const orderId = currentOrder._id;

            if (!loggedInUser) {
                localStorage.removeItem('guestCart')
                addGuestOrder(currentOrder)
                clearGuestCheckoutData()

                const existing = JSON.parse(localStorage.getItem('guestOrders') || '[]')
                const updated = [orderId, ...existing.filter(id => id !== orderId)].slice(0, 10)
                localStorage.setItem('guestOrders', JSON.stringify(updated))
            } else {
                dispatch(resetCartByUserIdAsync(loggedInUser?._id))
            }
            dispatch(resetCurrentOrder())
            navigate(`/track-order/${orderId}`, { replace: true })
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
            showToast.success(t('checkout.addressAdded'))
            return
        }
        const address = { ...data, user: loggedInUser._id }
        dispatch(addAddressAsync(address))
    }

    const handleCreateOrder = () => {
        if (!selectedPaymentMethod) {
            showToast.error(t('checkout.selectPayment'))
            return
        }
        if (!selectedAddress) {
            showToast.error(t('checkout.selectAddress'))
            return
        }
        if (!cartItems || cartItems.length === 0) {
            showToast.error(t('checkout.emptyCart'))
            return
        }
        if (!loggedInUser) {
            if (!guestEmail || !guestEmail.includes('@')) {
                showToast.error(t('checkout.invalidEmail'))
                return
            }
            if (!guestPhone || guestPhone.length < 10) {
                showToast.error(t('checkout.invalidPhone'))
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mb-20">

            {/* Heading */}
            <div className="flex items-center gap-2 mb-6">
                <motion.div whileHover={{ x: -5 }}>
                    <Link to="/cart" className="p-2 hover:bg-gray-100 rounded-full transition-colors inline-flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </Link>
                </motion.div>
                <h1 className="text-2xl font-semibold text-gray-900">{t('checkout.title')}</h1>
            </div>

            {/* Main Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_24rem] gap-8 items-start">

                {/* Left Column — Shipping */}
                <div className="flex flex-col gap-6 min-w-0 w-full">
                    {/* Address Form */}
                    <form className="flex flex-col gap-4" noValidate onSubmit={handleSubmit(handleAddAddress)}>
                        {/* Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.type')}</label>
                            <select
                                {...register('type', { required: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                            >
                                <option value="">{t('checkout.selectType')}</option>
                                <option value="Home">{t('checkout.home')}</option>
                                <option value="Shop">{t('checkout.shop')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.street')}</label>
                            <input
                                type="text"
                                {...register('street', { required: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.area')}</label>
                                <select
                                    {...register('city', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">{t('checkout.selectArea')}</option>
                                    <option value="Sakri bajaar">Sakri bajaar</option>
                                    <option value="Narpatinagar">Narpatinagar</option>
                                    <option value="Sagarpur">Sagarpur</option>
                                    <option value="Kanhouli">Kanhouli</option>
                                    <option value="Dahaura">Dahaura</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.state')}</label>
                                <select
                                    {...register('state', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">{t('checkout.selectState')}</option>
                                    <option value="Bihar">Bihar</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.postalCode')}</label>
                                <select
                                    {...register('postalCode', { required: true })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                                >
                                    <option value="">{t('checkout.selectPostal')}</option>
                                    <option value="847239">847239</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.country')}</label>
                            <select
                                {...register('country', { required: true })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm bg-white"
                            >
                                <option value="">{t('checkout.selectCountry')}</option>
                                <option value="India">India</option>
                            </select>
                        </div>

                        <div className="flex flex-row gap-2 self-end">
                            <button
                                type="submit"
                                className="px-4 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 transition-colors"
                            >
                                {t('checkout.add')}
                            </button>
                            <button
                                type="button"
                                onClick={() => reset()}
                                className="px-4 py-2 border border-red-500 text-red-500 rounded-md text-sm font-medium hover:bg-red-50 transition-colors"
                            >
                                {t('checkout.reset')}
                            </button>
                        </div>
                    </form>

                    {/* Existing Addresses */}
                    <div className="flex flex-col gap-3">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">{t('checkout.address')}</h2>
                            <p className="text-sm text-gray-500">{t('checkout.selectAddress')}</p>
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
                            <h2 className="text-lg font-semibold text-gray-900">{t('checkout.contactInfo')}</h2>
                            <p className="text-sm text-gray-500">{t('checkout.contactSubtitle')}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.email')}</label>
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('checkout.phone')}</label>
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
                            <h2 className="text-lg font-semibold text-gray-900">{t('checkout.paymentMethods')}</h2>
                            <p className="text-sm text-gray-500">{t('checkout.selectPaymentMethod')}</p>
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
                            <span className="text-sm text-gray-900">{t('checkout.cod')}</span>
                        </div>
                    </div>
                </div>

                {/* Right Column — Order Summary */}
                <div className="flex flex-col gap-4 min-w-0 w-full lg:sticky lg:top-24 bg-white p-5 border border-gray-200 rounded-xl shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">{t('checkout.orderSummary')}</h2>
                <div className="w-full min-w-0 overflow-hidden">
                        <Cart checkout={true} />
                </div>
                    <button
                        onClick={handleCreateOrder}
                        disabled={orderStatus === 'pending'}
                        className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm mt-2"
                    >
                        {orderStatus === 'pending' ? t('checkout.placingOrder') : t('checkout.placeOrder')}
                    </button>
                </div>
            </div>
        </div>
    )
}