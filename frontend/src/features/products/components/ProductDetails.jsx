import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchProductByIdAsync, selectProductFetchStatus, selectSelectedProduct } from '../ProductSlice'
import { addToCartAsync, selectCartItemAddStatus } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { fetchReviewsByProductIdAsync, selectReviewFetchStatus, selectReviews } from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { showToast } from '../../../utils/toast'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems } from '../../wishlist/WishlistSlice'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { useTranslation } from 'react-i18next'
import TruckLoader from '../../../components/TruckLoader'

const TIER_BADGES = {
    single: 'bg-gray-100 text-gray-800',
    pack: 'bg-[#0055A4] text-white',
    box: 'bg-purple-700 text-white',
    jar: 'bg-amber-600 text-white',
    carton: 'bg-[#111827] text-white',
    bundle: 'bg-teal-700 text-white',
    dozen: 'bg-indigo-700 text-white',
    strip: 'bg-rose-700 text-white',
    bag: 'bg-emerald-700 text-white',
}

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false)
    useEffect(() => {
        const media = window.matchMedia(query)
        setMatches(media.matches)
        const listener = (e) => setMatches(e.matches)
        media.addEventListener('change', listener)
        return () => media.removeEventListener('change', listener)
    }, [query])
    return matches
}

const HeartCheckbox = ({ checked, onChange }) => (
    <label className="cursor-pointer relative inline-flex">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <svg 
            className={`w-6 h-6 transition-all duration-200 ${checked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
            fill={checked ? "currentColor" : "none"}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    </label>
)

const TierPriceDisplay = ({ basePrice, price, discount }) => {
    const hasDiscount = discount > 0 && basePrice > price
    return (
        <div className="flex items-baseline gap-1.5 flex-wrap mt-0.5">
            {hasDiscount && (
                <span className="text-xs text-gray-400 line-through">₹{basePrice}</span>
            )}
            <span className="text-sm font-semibold text-[#0055A4]">₹{price}</span>
            {hasDiscount && (
                <span className="text-[10px] text-green-600 font-medium">({discount}% off)</span>
            )}
        </div>
    )
}

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const { t } = useTranslation()
    const [quantities, setQuantities] = useState({})

    const reviews = useSelector(selectReviews)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)

    const is1420 = useMediaQuery('(max-width: 1420px)')
    const is990 = useMediaQuery('(max-width: 990px)')
    const is840 = useMediaQuery('(max-width: 840px)')
    const is480 = useMediaQuery('(max-width: 480px)')

    const wishlistItems = useSelector(selectWishlistItems)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product?._id === id)
    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 ? Math.ceil(totalReviewRating / totalReviews) : 0

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])

    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    }, [id, dispatch])

    // Initialize quantities for all tiers present on the product
    useEffect(() => {
        if (product?.tiers && product.tiers.length > 0) {
            const init = {}
            product.tiers.forEach(tier => { init[tier.type] = 0 })
            setQuantities(init)
        } else if (product) {
            setQuantities({ single: 0 })
        }
    }, [product])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            showToast.success(t('productDetails.itemsAddedToCart'))
        } else if (cartItemAddStatus === 'rejected') {
            showToast.error(t('productDetails.errorAddingToCart'))
        }
    }, [cartItemAddStatus, t])

    const handleAddWholeSaleToCart = () => {
        if (!product) return

        const selectedTiers = Object.entries(quantities).filter(([_, qty]) => qty > 0)

        if (selectedTiers.length === 0) {
            showToast.info(t('productDetails.selectAtLeastOneTier'))
            return
        }

        selectedTiers.forEach(([tierType, qty]) => {
            const tier = product?.tiers?.find(t => t.type === tierType)

            const fallbackPrice = product?.price || 0
            const fallbackLabel = tierType.toUpperCase()

            const wholesaleItem = {
                user: loggedInUser?._id,
                product: product,
                quantity: qty,
                packagingTier: tierType,
                variantLabel: tier?.label || fallbackLabel,
                variantPrice: tier ? tier.price : fallbackPrice
            }
            dispatch(addToCartAsync(wholesaleItem))
        })

        const resetQty = {}
        Object.keys(quantities).forEach(k => { resetQty[k] = 0 })
        setQuantities(resetQty)
    }

    const handleUpdateTierQty = (tierType, operation) => {
        setQuantities(prev => {
            const currentQty = prev[tierType] || 0
            if (operation === 'dec' && currentQty > 0) {
                return { ...prev, [tierType]: currentQty - 1 }
            }
            if (operation === 'inc' && currentQty < 100) {
                return { ...prev, [tierType]: currentQty + 1 }
            }
            return prev
        })
    }

    const handleAddRemoveFromWishlist = (e) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: id }
            dispatch(createWishlistItemAsync(data))
        } else {
            const index = wishlistItems.findIndex((item) => item.product._id === id)
            if (index !== -1) {
                dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
            }
        }
    }

    const [activeStep, setActiveStep] = useState(0)
    const swiperRef = useRef(null)
    const maxSteps = product?.images?.length || 0

    const handleNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext()
    }

    const handleBack = () => {
        if (swiperRef.current) swiperRef.current.slidePrev()
    }

    // Dynamic tiers fallback: use existing tiers or render single base price
    const availableTiers = product?.tiers && product.tiers.length > 0
        ? product.tiers
        : [
            {
                type: 'single',
                label: t('productDetails.singleUnit') || 'Single Unit',
                quantity: 1,
                price: product?.price || 0,
                basePrice: product?.price || 0,
                stockQuantity: product?.stockQuantity || 0,
                discountPercentage: product?.discountPercentage || 0
            }
        ]

    if (productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
                <h2 className="text-lg font-semibold text-gray-900 mb-2">{t('productDetails.errorLoading')}</h2>
                <p className="text-sm text-gray-500 mb-4">{t('productDetails.tryAgainLater')}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-[#0055A4] text-white text-sm rounded-lg hover:bg-[#004080]"
                >
                    {t('productDetails.retry')}
                </button>
            </div>
        )
    }

    const isLoading = productFetchStatus === 'pending' || reviewFetchStatus === 'pending'

    return (
        <div className="min-h-screen bg-white">
            {isLoading ? (
                <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                    <TruckLoader />
                </div>
            ) : (
                <div className="flex flex-col">
                    <div className={`
                        flex 
                        ${is840 ? "flex-col" : "flex-row"} 
                        ${is480 ? "p-3" : "p-0"} 
                        ${is840 ? "mt-0" : "mt-20"} 
                        justify-center 
                        mb-10 
                        ${is480 ? "gap-y-6" : "gap-y-20"} 
                        ${is990 ? "gap-x-8" : "gap-x-20"} 
                        ${is1420 || is480 ? "w-full max-w-full" : 'w-[88rem]'}
                        mx-auto
                    `}>

                        {/* Left Column: Product Images */}
                        <div className={`flex flex-row gap-x-6 self-start ${is480 ? "w-full" : ""}`}>
                            {!is1420 && product?.images?.length > 0 && (
                                <div className="flex flex-col gap-y-6 h-full overflow-y-auto">
                                    {product.images.map((image, index) => (
                                        <div 
                                            key={index} 
                                            className={`w-[200px] cursor-pointer border-2 rounded-lg overflow-hidden transition-transform duration-200 hover:scale-110 active:scale-100 ${selectedImageIndex === index ? 'border-black' : 'border-transparent'}`}
                                            onClick={() => setSelectedImageIndex(index)}
                                        >
                                            <img 
                                                src={image} 
                                                alt={t('productDetails.thumbnailAlt', { number: index + 1 })}
                                                className="w-full aspect-square object-contain p-2"
                                                onError={(e) => { e.target.src = '/placeholder-product.png' }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className={`${is480 ? "mt-0 w-full" : "mt-20"}`}>
                                {is1420 ? (
                                    <div className={`${is480 ? "w-full" : is990 ? 'w-[400px]' : "w-[500px]"}`}>
                                        {product?.images && product.images.length > 0 ? (
                                            <>
                                                <Swiper
                                                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                                                    onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
                                                    slidesPerView={1}
                                                    spaceBetween={0}
                                                >
                                                    {product.images.map((image, index) => (
                                                        <SwiperSlide key={index}>
                                                            <img 
                                                                src={image} 
                                                                alt={product?.title} 
                                                                className="w-full object-contain aspect-square"
                                                                onError={(e) => { e.target.src = '/placeholder-product.png' }}
                                                            />
                                                        </SwiperSlide>
                                                    ))}
                                                </Swiper>

                                                {maxSteps > 1 && (
                                                    <div className="flex items-center justify-between py-2 px-1">
                                                        <button 
                                                            onClick={handleBack} 
                                                            disabled={activeStep === 0}
                                                            className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {t('productDetails.back')}
                                                        </button>
                                                        <div className="flex items-center gap-1.5">
                                                            {Array.from({ length: maxSteps }, (_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`rounded-full transition-all duration-300 ${
                                                                        i === activeStep ? 'w-5 h-2 bg-black' : 'w-2 h-2 bg-gray-300'
                                                                    }`}
                                                                />
                                                            ))}
                                                        </div>
                                                        <button 
                                                            onClick={handleNext} 
                                                            disabled={activeStep === maxSteps - 1}
                                                            className="text-sm text-gray-700 hover:bg-gray-100 px-2 py-1 rounded disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                                                        >
                                                            {t('productDetails.next')}
                                                        </button>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                                                <span className="text-gray-400 text-sm">{t('productDetails.noImage')}</span>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        {product?.images && product.images.length > 0 ? (
                                            <img 
                                                className="w-full object-contain overflow-hidden aspect-square" 
                                                src={product.images[selectedImageIndex]} 
                                                alt={product?.title}
                                                onError={(e) => { e.target.src = '/placeholder-product.png' }}
                                            />
                                        ) : (
                                            <div className="w-full aspect-square bg-gray-100 flex items-center justify-center rounded-lg">
                                                <span className="text-gray-400 text-sm">{t('productDetails.noImage')}</span>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`${is1420 ? "w-full px-3" : 'w-[88rem]'} ${is480 ? "p-2" : "p-0"} mx-auto`}>
                        <Reviews productId={id} averageRating={averageRating} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProductDetails