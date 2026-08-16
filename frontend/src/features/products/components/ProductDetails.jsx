import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchProductByIdAsync, selectProductFetchStatus, selectSelectedProduct } from '../ProductSlice'
import { addToCartAsync, selectCartItemAddStatus } from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { fetchReviewsByProductIdAsync, selectReviewFetchStatus, selectReviews } from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems } from '../../wishlist/WishlistSlice'
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'
import 'swiper/css'
import { useTranslation } from 'react-i18next';

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
);

const ReadOnlyRating = ({ value }) => (
    <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                className={`w-5 h-5 ${star <= value ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
    </div>
)

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const { t } = useTranslation();
    const [quantities, setQuantities] = useState({})

    const reviews = useSelector(selectReviews)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    
    const is1420 = useMediaQuery('(max-width: 1420px)')
    const is990 = useMediaQuery('(max-width: 990px)')
    const is840 = useMediaQuery('(max-width: 840px)')
    const is500 = useMediaQuery('(max-width: 500px)')
    const is480 = useMediaQuery('(max-width: 480px)')
    const is340 = useMediaQuery('(max-width: 340px)')

    const wishlistItems = useSelector(selectWishlistItems)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product?._id === id)
    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 ? Math.ceil(totalReviewRating / totalReviews) : 0;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    
    // SINGLE fetch effect — no clearSelectedProduct on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    }, [id, dispatch])

    useEffect(() => {
        if (product?.tiers?.length > 0) {
            const init = {}
            product.tiers.forEach(tier => { init[tier.type] = 0 })
            setQuantities(init)
        } else if (product) {
            setQuantities({ single: 0, pack: 0, carton: 0 })
        }
    }, [product])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success(t('productDetails.itemsAddedToCart'))
        } else if (cartItemAddStatus === 'rejected') {
            toast.error(t('productDetails.errorAddingToCart'))
        }
    }, [cartItemAddStatus, dispatch, t])

    const handleAddWholeSaleToCart = () => {
        if (!product) return; 

        const selectedTiers = Object.entries(quantities).filter(([_, qty]) => qty > 0);
        
        if (selectedTiers.length === 0) {
            toast.info(t('productDetails.selectAtLeastOneTier'));
            return;
        }
        
        selectedTiers.forEach(([tierType, qty]) => {
            const tier = product?.tiers?.find(t => t.type === tierType)  
            
            const fallbackLabel = tierType === 'single' ? t('productDetails.singleUnit') 
                                : tierType === 'pack' ? t('productDetails.packOf', { qty: 10 }) 
                                : t('productDetails.cartonOf', { qty: 50 })
            
            const fallbackPrice = tierType === 'pack' ? (product?.price || 0) * 10 * 0.95
                                : tierType === 'carton' ? (product?.price || 0) * 50 * 0.90
                                : (product?.price || 0)

            const wholesaleItem = {
                user: loggedInUser?._id,        
                product: product,                
                quantity: qty,
                packagingTier: tierType,
                variantLabel: tier?.label || fallbackLabel,
                variantPrice: tier ? tier.price : fallbackPrice
            };
            dispatch(addToCartAsync(wholesaleItem));
        });

        const resetQty = {}
        Object.keys(quantities).forEach(k => resetQty[k] = 0)
        setQuantities(resetQty);
    }
    
    const handleUpdateTierQty = (tier, operation) => {
        setQuantities(prev => {
            const currentQty = prev[tier] || 0;
            if (operation === 'dec' && currentQty > 0) {
                return { ...prev, [tier]: currentQty - 1 };
            }
            if (operation === 'inc' && currentQty < 50) {
                return { ...prev, [tier]: currentQty + 1 };
            }
            return prev;
        });
    }

    const handleAddRemoveFromWishlist = (e) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: id }
            dispatch(createWishlistItemAsync(data))
        } else if (!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === id)
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    }

    const [activeStep, setActiveStep] = useState(0);
    const swiperRef = useRef(null);
    const maxSteps = product?.images ? product.images.length : 0;
    
    const handleNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext();
    };
    
    const handleBack = () => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    };

    const getTierDisplay = (tierType) => {
        if (product?.tiers?.length > 0) {
            const tier = product.tiers.find(t => t.type === tierType)
            if (tier) {
                return {
                    label: tier.label,
                    price: tier.price,
                    stock: tier.stockQuantity,
                    discount: tier.discountPercentage,
                    qty: tier.quantity
                }
            }
        }
        const basePrice = product?.price || 0
        if (tierType === 'pack') return { 
            label: t('productDetails.packOf', { qty: 10 }), 
            price: (basePrice * 10 * 0.95).toFixed(2),
            stock: product?.stockQuantity || 0,
            discount: 5,
            qty: 10
        }
        if (tierType === 'carton') return { 
            label: t('productDetails.cartonOf', { qty: 50 }), 
            price: (basePrice * 50 * 0.90).toFixed(2),
            stock: product?.stockQuantity || 0,
            discount: 10,
            qty: 50
        }
        return { 
            label: t('productDetails.singleUnit'), 
            price: basePrice,
            stock: product?.stockQuantity || 0,
            discount: 0,
            qty: 1
        }
    }

    const tierTypes = product?.tiers?.length > 0 
        ? product.tiers.map(t => t.type) 
        : ['single', 'pack', 'carton']

    return (
        <>
        {!(productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') && (
            <div className="flex flex-col justify-center items-center mb-8 gap-8">
            {
                (productFetchStatus === 'pending' || reviewFetchStatus === 'pending') ?
                <div className={`flex justify-center items-center ${is500 ? "w-[35vh]" : 'w-96'} h-[calc(100vh-4rem)]`}>
                    <Lottie animationData={loadingAnimation} />
                </div>
                :
                <div className="flex flex-col">
                    <div className={`flex ${is840 ? "flex-col h-auto" : "flex-row h-[50rem]"} ${is480 ? "p-2" : "p-0"} ${is840 ? "mt-0" : "mt-20"} justify-center mb-20 gap-y-20 ${is990 ? "gap-x-8" : "gap-x-20"} ${is1420 || is480 ? "w-auto" : 'w-[88rem]'}`}>
                        
                        {/* Left Side: Images */}
                        <div className="flex flex-row gap-x-10 self-start h-full">
                            {!is1420 && (
                                <div className="flex flex-col gap-y-6 h-full overflow-y-auto">
                                    {product && product.images.map((image, index) => (
                                        <motion.div 
                                            key={index} 
                                            whileHover={{ scale: 1.1 }} 
                                            whileTap={{ scale: 1 }} 
                                            className="w-[200px] cursor-pointer"
                                            onClick={() => setSelectedImageIndex(index)}
                                        >
                                            <img 
                                                src={image} 
                                                alt={t('productDetails.thumbnailAlt', { number: index + 1 })}
                                                className="w-full aspect-square object-contain"
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            
                            <div className={is480 ? "mt-0" : "mt-20"}>
                                {is1420 ? (
                                    <div className={`${is480 ? "w-full" : is990 ? 'w-[400px]' : "w-[500px]"}`}>
                                        <Swiper
                                            modules={[Autoplay]}
                                            autoplay={{
                                                delay: 3000,
                                                disableOnInteraction: false,
                                            }}
                                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                                            onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
                                            slidesPerView={1}
                                            spaceBetween={0}
                                        >
                                            {product?.images.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <img 
                                                        className="w-full object-contain overflow-hidden aspect-square" 
                                                        src={image} 
                                                        alt={product?.title} 
                                                    />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        
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
                                    </div>
                                ) : (
                                    <div className="w-full">
                                        {product?.images && (
                                            <img 
                                                src={product.images[selectedImageIndex]} 
                                                alt={product?.title}
                                                className="w-full object-contain aspect-square"
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Side: Product Details & Wholesale Purchase Card */}
                        <div className="space-y-3">
                            {!loggedInUser?.isAdmin && (
                                <div className="p-6 rounded-lg border border-gray-200 bg-[#f9f9f9]">
                                    <h2 className="text-lg font-semibold mb-4">{t('productDetails.selectWholesaleOptions')}</h2>

                                    {/* If product exists but has no pricing data yet, show mini-loader */}
                                    {product && !product.tiers?.length && !product.price ? (
                                        <div className="py-4 text-sm text-gray-500">
                                            Loading pricing information...
                                        </div>
                                    ) : (
                                        <div className="flex flex-col gap-5">
                                            {tierTypes.map((tierType) => {
                                                const display = getTierDisplay(tierType)
                                                return (
                                                    <div key={tierType} className="flex flex-row justify-between items-center">
                                                        <div>
                                                            <div className="flex items-center gap-2">
                                                                <span className={`inline-block px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                                                                    tierType === 'single' ? 'bg-gray-100 text-gray-800' :
                                                                    tierType === 'pack' ? 'bg-[#0055A4] text-white' :
                                                                    'bg-[#111827] text-white'
                                                                }`}>
                                                                    QTY {display.qty}
                                                                </span>
                                                                <p className="text-base font-medium">
                                                                    {display.label}
                                                                </p>
                                                            </div>
                                                            <p className="text-sm font-semibold text-blue-600 mt-0.5">
                                                                ₹{display.price}
                                                                {display.discount > 0 && (
                                                                    <span className="ml-2 text-xs text-[#E31837]">
                                                                        {display.discount}% off
                                                                    </span>
                                                                )}
                                                            </p>
                                                            <p className={`text-xs mt-0.5 ${
                                                                display.stock > 10 ? 'text-green-600' : display.stock === 0 ? 'text-red-500' : 'text-orange-600'
                                                            }`}>
                                                                {display.stock === 0 
                                                                    ? 'Out of stock' 
                                                                    : display.stock <= 10 
                                                                        ? t('productDetails.onlyXLeft', { count: display.stock })
                                                                        : t('productDetails.inBulkStock')
                                                                }
                                                            </p>
                                                        </div>

                                                        <div className="flex flex-row items-center">
                                                            <button 
                                                                onClick={() => handleUpdateTierQty(tierType, 'dec')}
                                                                className="min-w-[35px] px-2 py-1 border border-gray-300 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="mx-3 min-w-[20px] text-center font-medium text-sm">
                                                                {quantities[tierType] || 0}
                                                            </span>
                                                            <button 
                                                                onClick={() => handleUpdateTierQty(tierType, 'inc')}
                                                                className="min-w-[35px] px-2 py-1 border border-gray-300 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    )}

                                    <hr className="my-6 border-gray-200" />

                                    <div className="flex flex-row gap-4 items-center">
                                        <button 
                                            onClick={handleAddWholeSaleToCart}
                                            className="flex-1 bg-black text-white py-3 rounded-lg hover:bg-[#222] transition-colors text-sm font-medium"
                                        >
                                            {t('productDetails.addWholesaleToCart')}
                                        </button>
                                        
                                        <div className="border border-gray-300 rounded-lg p-1 flex items-center justify-center">
                                            <HeartCheckbox 
                                                checked={isProductAlreadyinWishlist} 
                                                onChange={handleAddRemoveFromWishlist} 
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={`${is1420 ? "w-auto" : 'w-[88rem]'} ${is480 ? "p-2" : "p-0"}`}>
                        <Reviews productId={id} averageRating={averageRating} />
                    </div>
                </div>
            }
            </div>
        )}
        </>
    )
}