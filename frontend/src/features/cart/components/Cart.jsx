import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { resetCartItemRemoveStatus, selectCartItemRemoveStatus, selectCartItems } from '../CartSlice'
import { SHIPPING, TAXES } from '../../../constants'
import { useTranslation } from 'react-i18next'

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

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
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
            toast.success(t('cart.productRemoved'))
        } else if (cartItemRemoveStatus === 'rejected') {
            toast.error(t('cart.removeError'))
        }
    }, [cartItemRemoveStatus, t])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [dispatch])

    return (
        <div className={`w-full ${checkout ? 'mb-0' : 'flex flex-col items-center mb-20'}`}>
            <div className={`flex flex-col ${checkout ? 'mt-0 w-full gap-4 px-0' : `${is900 ? 'w-full' : 'w-[50rem]'} mt-12 gap-8 px-4`}`}>
                
                {/* cart items */}
                <div className="flex flex-col gap-4 w-full min-w-0">
                    {items && items.map((item) => (
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
                </div>
                
                {/* subtotal */}
                <div className="flex flex-row justify-between items-center w-full">
                    {checkout ? (
                        <div className="flex flex-col gap-3 w-full text-sm">
                            <div className="flex flex-row justify-between text-gray-700">
                                <p>{t('cart.subtotal')}</p>
                                <p>₹{subtotal}</p>
                            </div>
                            <div className="flex flex-row justify-between text-gray-700">
                                <p>{t('cart.shipping')}</p>
                                <p>₹{SHIPPING}</p>
                            </div>
                            <div className="flex flex-row justify-between text-gray-700">
                                <p>{t('cart.taxes')}</p>
                                <p>₹{TAXES}</p> 
                            </div>
                            <hr className="border-gray-200 my-1" />
                            <div className="flex flex-row justify-between text-base font-semibold text-gray-900">
                                <p>{t('cart.total')}</p>
                                <p>₹{subtotal + SHIPPING + TAXES}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-1">
                                <p className="text-xl font-medium text-gray-900">{t('cart.subtotal')}</p>
                                <p className="text-base text-gray-900">{t('cart.totalItems', { count: totalItems })}</p>
                                <p className="text-base text-gray-500">{t('cart.shippingNote')}</p>
                            </div>
                            <div>
                                <p className="text-xl font-medium text-gray-900">₹{subtotal}</p>
                            </div>
                        </>
                    )}
                </div>
                
                {/* checkout or continue shopping */}
                {!checkout && (
                    <div className="flex flex-col gap-4">
                        <Link 
                            to="/checkout"
                            className="w-full bg-black text-white text-center py-3 rounded font-medium hover:bg-gray-800 transition-colors"
                        >
                            {t('cart.checkout')}
                        </Link>
                        <motion.div 
                            className="self-center" 
                            whileHover={{ y: 2 }}
                        >
                            <Link 
                                to="/"
                                className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
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