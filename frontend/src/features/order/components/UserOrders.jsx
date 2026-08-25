import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderByUserIdAsync, resetOrderFetchStatus, selectOrderFetchStatus, selectOrders } from '../OrderSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { Link } from 'react-router-dom'
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'
import Lottie from 'lottie-react'
import { loadingAnimation, noOrdersAnimation } from '../../../assets'
import { showToast } from '../../../utils/toast'
import { motion } from 'framer-motion'

export const UserOrders = () => {
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const orders = useSelector(selectOrders)
    const cartItems = useSelector(selectCartItems)
    const orderFetchStatus = useSelector(selectOrderFetchStatus)
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "instant"
        })
    }, [])

    useEffect(() => {
        if (loggedInUser?._id) {
            dispatch(getOrderByUserIdAsync(loggedInUser._id))
        }
    }, [dispatch, loggedInUser])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            showToast.success("Product added to cart")
        } else if (cartItemAddStatus === 'rejected') {
            showToast.error('Error adding product to cart, please try again later')
        }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (orderFetchStatus === 'rejected') {
            showToast.error("Error fetching orders, please try again later")
        }
    }, [orderFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(resetOrderFetchStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [dispatch])

    const handleAddToCart = (product) => {
        const item = { user: loggedInUser._id, product: product._id, quantity: 1 }
        dispatch(addToCartAsync(item))
    }

    return (
        <div className="flex justify-center items-center w-full min-h-screen bg-gray-50 py-6">
            {orderFetchStatus === 'pending' ? (
                <div className="w-full max-w-[25rem] h-[calc(100vh-4rem)] flex justify-center items-center">
                    <Lottie animationData={loadingAnimation} />
                </div>
            ) : (
                <div className="w-full max-w-5xl px-4 sm:px-6 lg:px-8 mb-20">
                    
                    {/* Heading and Navigation */}
                    <div className="flex items-center gap-3 mb-8">
                        <motion.div whileHover={{ x: -5 }} className="hidden sm:block">
                            <Link 
                                to="/" 
                                className="p-2 rounded-full hover:bg-gray-200 transition-colors inline-flex items-center justify-center text-gray-700"
                                aria-label="Go Back"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                        </motion.div>

                        <div className="flex flex-col gap-1">
                            <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">Order history</h1>
                            <p className="text-sm text-gray-500 break-words">
                                Check the status of recent orders, manage returns, and discover similar products.
                            </p>
                        </div>
                    </div>

                    {/* Orders List */}
                    <div className="flex flex-col gap-6">
                        {orders && [...orders].reverse().map((order) => (
                            <div 
                                key={order._id} 
                                className="bg-white p-4 sm:p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col gap-5"
                            >
                                {/* Header Info Bar */}
                                <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
                                    <div className="flex flex-wrap gap-6 sm:gap-10">
                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Order Number</p>
                                            <p className="text-sm font-semibold text-gray-800 mt-0.5">{order._id}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Date Placed</p>
                                            <p className="text-sm text-gray-700 mt-0.5">{new Date(order.createdAt).toDateString()}</p>
                                        </div>

                                        <div>
                                            <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</p>
                                            <p className="text-sm font-semibold text-gray-900 mt-0.5">₹{order.total}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-xs sm:text-sm font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                                            Items: {order.item.length}
                                        </span>
                                    </div>
                                </div>

                                {/* Products in Order */}
                                <div className="flex flex-col divide-y divide-gray-100">
                                    {order.item.map((product) => (
                                        <div 
                                            key={product._id || product.product?._id} 
                                            className="flex flex-col md:flex-row items-start md:items-center gap-4 py-4"
                                        >
                                            <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                                                <img 
                                                    className="w-full h-full object-contain aspect-square" 
                                                    src={product.product?.images?.[0] || product.product?.thumbnail} 
                                                    alt={product.product?.title || "Product image"} 
                                                />
                                            </div>

                                            <div className="flex flex-col flex-1 min-w-0 gap-1 w-full">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="min-w-0">
                                                        <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                            {product.product?.title}
                                                        </h3>
                                                        <p className="text-xs sm:text-sm text-gray-500">
                                                            {product.product?.brand?.name || product.product?.brand || 'Brand'}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-0.5">Qty: {product.quantity}</p>
                                                    </div>
                                                    <span className="text-sm sm:text-base font-semibold text-gray-900">
                                                        ₹{product.product?.price}
                                                    </span>
                                                </div>

                                                <p className="text-xs text-gray-500 line-clamp-2 mt-1">
                                                    {product.product?.description}
                                                </p>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-3 mt-3 self-start sm:self-end">
                                                    <Link 
                                                        to={`/product-details/${product.product?._id}`} 
                                                        className="px-3 py-1.5 border border-gray-300 rounded text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                                                    >
                                                        View Product
                                                    </Link>

                                                    {cartItems.some((cartItem) => cartItem.product?._id === product.product?._id) ? (
                                                        <Link 
                                                            to="/cart" 
                                                            className="px-3 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                                                        >
                                                            Already in Cart
                                                        </Link>
                                                    ) : (
                                                        <button 
                                                            onClick={() => handleAddToCart(product.product)}
                                                            className="px-3 py-1.5 bg-black text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
                                                        >
                                                            Buy Again
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Status Footer */}
                                <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                                    <span className="text-gray-500">Status</span>
                                    <span className="font-semibold text-gray-900 bg-gray-100 px-3 py-1 rounded-full text-xs">
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}

                        {/* Empty State */}
                        {!orders.length && (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <div className="w-64 h-64 sm:w-80 sm:h-80">
                                    <Lottie animationData={noOrdersAnimation} />
                                </div>
                                <p className="text-base sm:text-lg font-medium text-gray-600 text-center">
                                    Looks like you haven't been shopping lately
                                </p>
                                <Link 
                                    to="/" 
                                    className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                                >
                                    Start Shopping
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}