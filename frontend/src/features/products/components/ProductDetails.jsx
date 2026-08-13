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
);

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const { t } = useTranslation();
    
    const [quantities, setQuantities] = useState({
        single: 0,
        pack: 0,
        carton: 0
    })

    const reviews = useSelector(selectReviews)
    const [selectedImageIndex, setSelectedImageIndex] = useState(0)
    
    const is1420 = useMediaQuery('(max-width: 1420px)')
    const is990 = useMediaQuery('(max-width: 990px)')
    const is840 = useMediaQuery('(max-width: 840px)')
    const is500 = useMediaQuery('(max-width: 500px)')
    const is480 = useMediaQuery('(max-width: 480px)')
    const is340 = useMediaQuery('(max-width: 340px)')

    const wishlistItems = useSelector(selectWishlistItems)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)
    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const totalReviews = reviews.length
    const averageRating = totalReviews > 0 ? Math.ceil(totalReviewRating / totalReviews) : 0;

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    }, [id, dispatch])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success(t('productDetails.itemsAddedToCart'))
        } else if (cartItemAddStatus === 'rejected') {
            toast.error(t('productDetails.errorAddingToCart'))
        }
    }, [cartItemAddStatus, t])

    const handleAddWholeSaleToCart = () => {
        const selectedTiers = Object.entries(quantities).filter(([_, qty]) => qty > 0);
        
        if (selectedTiers.length === 0) {
            toast.info(t('productDetails.selectAtLeastOneTier'));
            return;
        }
        
        const tierLabels = {
            single: t('productDetails.singleUnit'),
            pack: t('productDetails.packOf10'),
            carton: t('productDetails.cartonOf50')
        };
        
        selectedTiers.forEach(([tier, qty]) => {
            const wholesaleItem = {
                user: loggedInUser?._id,        
                product: product,                
                quantity: qty,
                packagingTier: tier,
                variantLabel: tierLabels[tier],
                variantPrice: parseFloat(getTierPrice(product?.price || 0, tier))
            };
            dispatch(addToCartAsync(wholesaleItem));
        });

        setQuantities({ single: 0, pack: 0, carton: 0 });
    }

    const handleUpdateTierQty = (tier, operation) => {
        setQuantities(prev => {
            const currentQty = prev[tier];
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

    const getTierPrice = (basePrice, tier) => {
        if (tier === 'pack') return (basePrice * 10 * 0.95).toFixed(2);
        if (tier === 'carton') return (basePrice * 50 * 0.90).toFixed(2);
        return basePrice;
    }

    const tierLabels = {
        single: t('productDetails.singleUnit'),
        pack: t('productDetails.packOf10'),
        carton: t('productDetails.cartonOf50')
    };

    return (
        <>
        {!(productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') && (
            <div className="flex flex-col justify-center items-center mb-8 gap-8">
            {
                (productFetchStatus || reviewFetchStatus) === 'pending' ?
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
                                        
                                        {/* Custom Stepper replacing MUI MobileStepper */}
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
                        <div className={`flex flex-col gap-y-6 ${is480 ? "w-full" : "w-[30rem]"}`}>
                            <div className="flex flex-col gap-2">
                                <h1 className="text-3xl font-semibold">{product?.title}</h1>
                                <div className={`flex items-center flex-wrap gap-y-4 ${is340 ? "gap-x-2" : "gap-x-4"}`}>
                                    <ReadOnlyRating value={averageRating} />
                                    <span className="text-gray-600 text-sm">
                                        ( {totalReviews === 0 ? t('productDetails.noReviews') : totalReviews === 1 ? t('productDetails.oneReview', {count: totalReviews}) : t('productDetails.manyReviews', {count: totalReviews})} )
                                    </span>
                                    <span className={`text-sm font-medium ${product?.stockQuantity <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                                        {product?.stockQuantity <= 10 ? t('productDetails.onlyXLeft', {count: product?.stockQuantity}) : t('productDetails.inBulkStock')}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3">
                                <p className="text-gray-600 text-base">{product?.description}</p>
                                <hr className="border-gray-200" />
                            </div>

                            {!loggedInUser?.isAdmin && (
                                <div className="p-6 rounded-lg border border-gray-200 bg-[#f9f9f9]">
                                    <h2 className="text-lg font-semibold mb-4">{t('productDetails.selectWholesaleOptions')}</h2>

                                    <div className="flex flex-col gap-5">
                                        {['single', 'pack', 'carton'].map((tier) => (
                                            <div key={tier} className="flex flex-row justify-between items-center">
                                                <div>
                                                    <p className="text-base font-medium capitalize">
                                                        {tierLabels[tier]}
                                                    </p>
                                                    <p className="text-sm font-semibold text-blue-600">
                                                        ₹{getTierPrice(product?.price || 0, tier)}
                                                    </p>
                                                </div>

                                                <div className="flex flex-row items-center">
                                                    <button 
                                                        onClick={() => handleUpdateTierQty(tier, 'dec')}
                                                        className="min-w-[35px] px-2 py-1 border border-gray-300 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                                                    >
                                                        -
                                                    </button>
                                                    <span className="mx-3 min-w-[20px] text-center font-medium text-sm">
                                                        {quantities[tier]}
                                                    </span>
                                                    <button 
                                                        onClick={() => handleUpdateTierQty(tier, 'inc')}
                                                        className="min-w-[35px] px-2 py-1 border border-gray-300 rounded text-sm font-bold hover:bg-gray-50 transition-colors"
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

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