import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Lottie from 'lottie-react'
import { toast } from 'react-toastify'
import { useForm } from "react-hook-form"
import { useTranslation } from 'react-i18next';
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistFetchStatus, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, resetWishlistItemUpdateStatus, selectWishlistFetchStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItemUpdateStatus, selectWishlistItems, updateWishlistItemByIdAsync, loadGuestWishlist, removeGuestItem, updateGuestItem } from '../WishlistSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { emptyWishlistAnimation, loadingAnimation } from '../../../assets'
import { addToCartAsync, resetCartItemAddStatus, selectCartItemAddStatus, selectCartItems } from '../../cart/CartSlice'

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

export const Wishlist = () => {
    const dispatch = useDispatch()
    const wishlistItems = useSelector(selectWishlistItems)
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)
    const wishlistItemUpdateStatus = useSelector(selectWishlistItemUpdateStatus)
    const loggedInUser = useSelector(selectLoggedInUser)
    const cartItems = useSelector(selectCartItems)
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const wishlistFetchStatus = useSelector(selectWishlistFetchStatus)
    const { t } = useTranslation();

    const [editIndex, setEditIndex] = useState(-1)
    const [editValue, setEditValue] = useState('')
    const { formState: { errors } } = useForm()

    const is1130 = useMediaQuery('(max-width: 1130px)')
    const is642 = useMediaQuery('(max-width: 642px)')
    const is480 = useMediaQuery('(max-width: 480px)')

    useEffect(() => {
        if (!loggedInUser) {
            dispatch(loadGuestWishlist())
        }
    }, [loggedInUser, dispatch])

    const handleAddRemoveFromWishlist = (e, productId) => {
        if (loggedInUser) {
            if (e.target.checked) {
                const data = { user: loggedInUser._id, product: productId }
                dispatch(createWishlistItemAsync(data))
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
            }
        } else {
            if (!e.target.checked) {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) {
                    dispatch(removeGuestItem(wishlistItems[index]._id))
                    toast.success(t('wishlist.removedFromWishlist'))
                }
            }
        }
    }

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') toast.success(t('wishlist.addedToWishlist'))
        else if (wishlistItemAddStatus === 'rejected') toast.error(t('wishlist.errorAddingWishlist'))
    }, [wishlistItemAddStatus, t])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') toast.success(t('wishlist.removedFromWishlist'))
        else if (wishlistItemDeleteStatus === 'rejected') toast.error(t('wishlist.errorRemovingWishlist'))
    }, [wishlistItemDeleteStatus, t])

    useEffect(() => {
        if (wishlistItemUpdateStatus === 'fulfilled') {
            toast.success(t('wishlist.wishlistItemUpdated'))
        } else if (wishlistItemUpdateStatus === 'rejected') {
            toast.error(t('wishlist.errorUpdatingWishlist'))
        }
        setEditIndex(-1)
        setEditValue("")
    }, [wishlistItemUpdateStatus, t])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') toast.success(t('wishlist.addedToCart'))
        else if (cartItemAddStatus === 'rejected') toast.error(t('wishlist.errorAddingCart'))
    }, [cartItemAddStatus, t])

    useEffect(() => {
        if (wishlistFetchStatus === 'rejected') toast.error(t('wishlist.errorFetchingWishlist'))
    }, [wishlistFetchStatus, t])

    useEffect(() => {
        return () => {
            dispatch(resetWishlistFetchStatus())
            dispatch(resetCartItemAddStatus())
            dispatch(resetWishlistItemUpdateStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetWishlistItemAddStatus())
        }
    }, [dispatch])

    const handleNoteUpdate = (wishlistItemId) => {
        if (loggedInUser) {
            const update = { _id: wishlistItemId, note: editValue }
            dispatch(updateWishlistItemByIdAsync(update))
        } else {
            dispatch(updateGuestItem({ _id: wishlistItemId, note: editValue }))
            toast.success(t('wishlist.noteUpdated'))
            setEditIndex(-1)
            setEditValue("")
        }
    }

    const handleEdit = (index) => {
        setEditValue(wishlistItems[index].note || '')
        setEditIndex(index)
    }

    const handleAddToCart = (productId) => {
        if (loggedInUser) {
            const data = { user: loggedInUser._id, product: productId }
            dispatch(addToCartAsync(data))
        } else {
            dispatch(addToCartAsync({ product: productId }))
        }
    }

    return (
        <div className={`flex flex-col items-center ${is480 ? 'mt-3' : 'mt-5'} mb-56`}>
            {wishlistFetchStatus === 'pending' ? (
                <div className={`flex justify-center items-center h-[calc(100vh-4rem)] ${is480 ? 'w-auto' : 'w-96'}`}>
                    <Lottie animationData={loadingAnimation} />
                </div>
            ) : (
                <div className={`flex flex-col ${is1130 ? 'w-auto' : 'w-[70rem]'} ${is480 ? 'gap-2' : 'gap-4'}`}>
                    
                    {/* Header */}
                    <div className="flex items-center gap-1 self-start">
                        <motion.div whileHover={{ x: -5 }}>
                            <Link to="/" className="p-2 hover:bg-gray-100 rounded-full inline-flex transition-colors">
                                <svg className={`${is480 ? 'w-6 h-6' : 'w-8 h-8'} text-gray-700`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                            </Link>
                        </motion.div>
                        <h4 className={`font-medium text-gray-900 ${is480 ? 'text-xl' : 'text-3xl'}`}>{t('wishlist.title')}</h4>
                    </div>

                    {/* Content */}
                    <div>
                        {wishlistItems?.length === 0 ? (
                            <div className={`flex flex-col justify-center items-center min-h-[60vh] ${is642 ? 'w-auto' : 'w-[40rem]'} self-center`}>
                                <Lottie animationData={emptyWishlistAnimation} className="w-[250px]" />
                                <p className={`font-normal text-gray-900 mt-2 ${is480 ? 'text-lg' : 'text-2xl'}`}>{t('wishlist.emptyTitle')}</p>
                                <p className="font-light text-gray-500">{t('wishlist.emptySubtitle')}</p>
                            </div>
                        ) : (
                            <div className={`flex flex-wrap justify-center content-center ${is480 ? 'gap-2' : 'gap-4'}`}>
                                {wishlistItems.map((item, index) => (
                                    <div key={item._id} className={`bg-white ${is480 ? '' : 'shadow-md rounded-lg border border-gray-100'}`}>
                                        <ProductCard
                                            item
                                            key={item._id}
                                            brand={item.product.brand.name}
                                            id={item.product._id}
                                            price={item.product.price}
                                            stockQuantity={item.product.stockQuantity}
                                            thumbnail={item.product.thumbnail}
                                            title={item.product.title}
                                            handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                            isWishlistCard={true}
                                        />

                                        <div className="px-4 pb-4">
                                            <div className="flex items-center gap-1">
                                                <h6 className="text-lg font-normal text-gray-900">{t('wishlist.note')}</h6>
                                                <button
                                                    onClick={() => handleEdit(index)}
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                >
                                                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            </div>

                                            {editIndex === index ? (
                                                <div className="flex flex-col gap-2 mt-2">
                                                    <textarea
                                                        rows={4}
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                                                    />
                                                    <div className="flex gap-2 self-end">
                                                        <button
                                                            onClick={() => handleNoteUpdate(item._id)}
                                                            className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors"
                                                        >
                                                            {t('wishlist.update')}
                                                        </button>
                                                        <button
                                                            onClick={() => setEditIndex(-1)}
                                                            className="px-4 py-1.5 border border-red-500 text-red-500 text-sm font-medium rounded hover:bg-red-50 transition-colors"
                                                        >
                                                            {t('wishlist.cancel')}
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="mt-1">
                                                    <p className={`text-sm break-words ${item.note ? 'text-gray-900' : 'text-gray-400'}`}>
                                                        {item.note || t('wishlist.addNotePlaceholder')}
                                                    </p>
                                                </div>
                                            )}

                                            {cartItems.some((cartItem) => cartItem.product._id === item.product._id) ? (
                                                <Link
                                                    to="/cart"
                                                    className="mt-4 block w-full text-center px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    {t('wishlist.alreadyInCart')}
                                                </Link>
                                            ) : (
                                                <button
                                                    onClick={() => handleAddToCart(item.product._id)}
                                                    className="mt-4 w-full px-4 py-2 border border-gray-900 text-gray-900 text-sm font-medium rounded hover:bg-gray-50 transition-colors"
                                                >
                                                    {t('wishlist.addToCart')}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}