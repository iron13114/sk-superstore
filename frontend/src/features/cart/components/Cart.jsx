import React, { useEffect } from 'react'
import { CartItem } from './CartItem'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import { 
    resetCartItemRemoveStatus, 
    selectCartItemRemoveStatus, 
    selectCartItems 
} from '../CartSlice'
import { SHIPPING, TAXES } from '../../../constants'

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

export const Cart = ({ checkout }) => {
    const items = useSelector(selectCartItems)
    const subtotal = items.reduce((acc, item) => {
        const price = item.variantPrice || item.product?.price || 0;
        return acc + (price * (item.quantity || 0));
    }, 0)
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
    const navigate = useNavigate()
    const is900 = useMediaQuery('(max-width: 900px)')

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
            toast.success("Product removed from cart")
        } else if (cartItemRemoveStatus === 'rejected') {
            toast.error("Error removing product from cart, please try again later")
        }
    }, [cartItemRemoveStatus])

    useEffect(() => {
        return () => {
            dispatch(resetCartItemRemoveStatus())
        }
    }, [dispatch])

    return (
        <div className="flex flex-col items-center mb-20">
            <div className={`flex flex-col mt-12 gap-8 ${is900 ? 'w-full' : 'w-[50rem]'} ${checkout ? 'px-0' : 'px-4'}`}>
                
                {/* cart items */}
                <div className="flex flex-col gap-4">
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
                <div className="flex flex-row justify-between items-center">
                    {checkout ? (
                        <div className="flex flex-col gap-4 w-full">
                            <div className="flex flex-row justify-between">
                                <p className="text-base text-gray-900">Subtotal</p>
                                <p className="text-base text-gray-900">₹{subtotal}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-base text-gray-900">Shipping</p>
                                <p className="text-base text-gray-900">₹{SHIPPING}</p>
                            </div>
                            <div className="flex flex-row justify-between">
                                <p className="text-base text-gray-900">Taxes</p>
                                <p className="text-base text-gray-900">₹{TAXES}</p> 
                            </div>
                            <hr className="border-gray-200" />
                            <div className="flex flex-row justify-between">
                                <p className="text-base font-semibold text-gray-900">Total</p>
                                <p className="text-base font-semibold text-gray-900">₹{subtotal + SHIPPING + TAXES}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-1">
                                <p className="text-xl font-medium text-gray-900">Subtotal</p>
                                <p className="text-base text-gray-900">Total items in cart {totalItems}</p>
                                <p className="text-base text-gray-500">Shipping and taxes will be calculated at checkout.</p>
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
                            Checkout
                        </Link>
                        <motion.div 
                            className="self-center" 
                            whileHover={{ y: 2 }}
                        >
                            <Link 
                                to="/"
                                className="inline-block px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-gray-900 hover:text-gray-900 transition-colors cursor-pointer"
                            >
                                or continue shopping
                            </Link>
                        </motion.div>
                    </div>
                )}
            </div>
        </div>
    )
}