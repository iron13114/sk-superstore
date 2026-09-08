import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { showToast } from '../../../utils/toast'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { SHIPPING, TAXES } from '../../../constants'
import { useTranslation } from 'react-i18next'

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(false)
    useEffect(() => {
        const media = window.matchMedia(query)
        setMatches(media.matches)
        const listener = (e) => setMatches(e.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [query])
    return matches
}

export const Cart = ({ checkout }) => {
    const itemsRaw = useSelector(selectCartItems)
    const items = Array.isArray(itemsRaw) ? itemsRaw : [] 
    
    const subtotal = items.reduce((acc, item) => {
        const price = item.variantPrice || item.product?.price || 0
        return acc + (price * (item.quantity || 0))
    }, 0)
    
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const navigate = useNavigate()
    const is900 = useMediaQuery('(max-width: 900px)')
    const { t } = useTranslation()

    const cartItemRemoveStatus = useSelector(selectCartItemRemoveStatus)
    const dispatch = useDispatch()

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])

    useEffect(() => {
        if (items.length === 0) {
            navigate("/")
        }
    }, [items, navigate])

    useEffect(() => {
        if (cartItemRemoveStatus === 'fulfilled') {
            showToast.success(t('cart.productRemoved'))
        } else if (cartItemRemoveStatus === 'rejected') {
            showToast.error(t('cart.removeError'))
        }
    }, [cartItemRemoveStatus, t])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [dispatch])

    return (
        <div className={`w-full ${checkout ? 'mb-0' : 'flex flex-col items-center mb-16 sm:mb-20'}`}>
            <div className={`flex flex-col ${checkout ? 'mt-0 w-full gap-4 px-0' : `${is900 ? 'w-full' : 'w-[50rem]'} mt-6 sm:mt-12 gap-6 sm:gap-8 px-4`}`}>
                
                {/* Cart Items */}
                <div className="flex flex-col gap-3 sm:gap-4 w-full min-w-0">
                    {items.map((item) => (
                        <CartItem 
                            key={item._id} 
                            id={item._id} 
                            title={item.product?.title} 
                            brand={item.product?.brand?.name} 
                            price={item.variantPrice || item.product?.price} 
                            quantity={item.quantity} 
                            thumbnail={item.product?.thumbnail} 
                            stockQuantity={item.product?.stockQuantity} 
                            productId={item.product?._id}
                            packagingTier={item.packagingTier}
                            variantLabel={item.variantLabel}
                        />
                    ))}
                    {items.length === 0 && (
                        <p className="text-center text-xs sm:text-sm text-gray-500 py-8">Your cart is empty</p>
                    )}
                </div>
                
                {/* Subtotal Section */}
                <div className="w-full pt-2 border-t border-gray-100 sm:border-0">
                    {checkout ? (
                        <div className="flex flex-col gap-2.5 w-full text-xs sm:text-sm">
                            <div className="flex flex-row justify-between text-gray-600">
                                <p>{t('cart.subtotal')}</p>
                                <p className="font-medium text-gray-900">₹{subtotal}</p>
                            </div>
                            <div className="flex flex-row justify-between text-gray-600">
                                <p>{t('cart.shipping')}</p>
                                <p className="font-medium text-gray-900">₹{SHIPPING}</p>
                            </div>
                            <div className="flex flex-row justify-between text-gray-600">
                                <p>{t('cart.taxes')}</p>
                                <p className="font-medium text-gray-900">₹{TAXES}</p> 
                            </div>
                            <hr className="border-gray-200 my-1" />
                            <div className="flex flex-row justify-between text-sm sm:text-base font-semibold text-gray-900">
                                <p>{t('cart.total')}</p>
                                <p>₹{subtotal + SHIPPING + TAXES}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5 w-full">
                            {/* Main Subtotal + Price Row */}
                            <div className="flex flex-row justify-between items-baseline w-full">
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    {t('cart.subtotal')}
                                </p>
                                <p className="text-sm sm:text-base font-semibold text-gray-900">
                                    ₹{subtotal}
                                </p>
                            </div>
                            
                            {/* Subtext info */}
                            <p className="text-xs sm:text-sm text-gray-600">
                                {t('cart.totalItems', { count: totalItems })}
                            </p>
                            <p className="text-[11px] sm:text-xs text-gray-500 leading-normal">
                                {t('cart.shippingNote')}
                            </p>
                        </div>
                    )}
                </div>
                
                {/* Checkout & Continue Shopping */}
                {!checkout && (
                    <div className="flex flex-col items-center gap-3 sm:gap-4 w-full pt-2">
                        <Link 
                            to="/checkout"
                            className="w-full sm:w-64 py-2.5 sm:py-3 bg-black text-white text-center text-xs sm:text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
                        >
                            {t('cart.checkout')}
                        </Link>
                        
                        <motion.div 
                            className="self-center" 
                            whileHover={{ y: 1 }}
                        >
                            <Link 
                                to="/"
                                className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-xs sm:text-sm text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-colors"
                            >
                                {t('cart.continueShopping')}
                            </Link>
                        </motion.div>
                    </div>
                )}

            </div>
        </div>
    )
}