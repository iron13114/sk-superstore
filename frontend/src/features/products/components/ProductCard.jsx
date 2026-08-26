import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';
import { selectReviewsByProductId } from '../../review/ReviewSlice';

const HeartCheckbox = ({ checked, onChange }) => (
    <label className="cursor-pointer relative inline-flex">
        <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
        <svg 
            className={`w-5 h-5 sm:w-6 sm:h-6 transition-all duration-200 ${checked ? 'text-red-500' : 'text-gray-400 hover:text-gray-600'}`}
            viewBox="0 0 24 24" 
            stroke="currentColor" 
            strokeWidth="2"
            fill={checked ? "currentColor" : "none"}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    </label>
);

const StarRating = ({ rating, count }) => {
    if (!rating && !count) return null;
    const fullStars = Math.floor(rating || 0);
    const hasHalf = (rating || 0) - fullStars >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    return (
        <div className="flex items-center gap-1 mt-0.5">
            <div className="flex items-center">
                {/* Full stars */}
                {Array.from({ length: fullStars }).map((_, i) => (
                    <svg key={`f${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
                {/* Half star */}
                {hasHalf && (
                    <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-yellow-400" viewBox="0 0 24 24">
                        <defs>
                            <linearGradient id="half">
                                <stop offset="50%" stopColor="currentColor" />
                                <stop offset="50%" stopColor="#e5e7eb" />
                            </linearGradient>
                        </defs>
                        <path fill="url(#half)" d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                )}
                {/* Empty stars */}
                {Array.from({ length: emptyStars }).map((_, i) => (
                    <svg key={`e${i}`} className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-gray-300" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                ))}
            </div>
            {count > 0 && (
                <span className="text-[10px] sm:text-xs text-gray-400">
                    ({count})
                </span>
            )}
        </div>
    );
};

export const ProductCard = ({
    id, 
    title, 
    price, 
    thumbnail, 
    brand, 
    stockQuantity, 
    reviews,
    handleAddRemoveFromWishlist, 
    isWishlistCard,
    viewMode,
    packagingTier,
    variantPrice, 
    isAdminCard
}) => {

    const navigate = useNavigate()
    const wishlistItems = useSelector(selectWishlistItems)
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()
    const { t } = useTranslation()

    const isInWishlist = wishlistItems.some((item) => item.product?._id === id)
    const isProductAlreadyInCart = cartItems.some((item) => item.product?._id === id)

    const reviewList = Array.isArray(reviews) ? reviews : []
    const reviewCount = reviewList.length
    const avgRating = reviewCount > 0 
        ? reviewList.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount 
        : 0

    const handleAddToCart = async (e) => {
        e.stopPropagation()
        const data = {
            product: {
                _id: id,
                title,
                price,
                thumbnail,
                brand: typeof brand === 'string' ? { name: brand } : brand,
                category: { name: 'General' } 
            },
            quantity: 1
        }
        dispatch(addToCartAsync(data))
    }

    const brandName = typeof brand === 'string' ? brand : brand?.name || ''

    // ─── LIST VIEW LAYOUT ───
    if (viewMode === 'list') {
        return (
            <div 
                className="flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-gray-200 hover:border-[#E31837] transition-colors cursor-pointer"
                onClick={() => navigate(`/product-details/${id}`)}
            >
                {/* Thumbnail */}
                <div className="w-20 h-20 sm:w-28 sm:h-28 bg-gray-50 flex-shrink-0 rounded overflow-hidden">
                    <img src={thumbnail} alt={title} className="w-full h-full object-contain" />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                        <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                                <p className="text-[10px] sm:text-xs text-[#0055A4] font-semibold uppercase tracking-wide">{brandName}</p>
                                <h3 className="text-sm sm:text-base font-medium text-gray-900 mt-0.5 line-clamp-2">{title}</h3>
                            </div>
                            {packagingTier && (
                                <span className="flex-shrink-0 px-2 py-0.5 bg-red-50 text-[#E31837] text-[10px] font-bold uppercase rounded">
                                    {packagingTier}
                                </span>
                            )}
                        </div>
                        
                        <StarRating rating={avgRating} count={reviewCount} />
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-2">
                            <span className="text-base sm:text-lg font-bold text-gray-900">₹{variantPrice || price}</span>
                            {variantPrice && <span className="text-xs text-gray-400 line-through">₹{price}</span>}
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <span className={`text-xs ${stockQuantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {stockQuantity > 0 
                                    ? t('productCard.inStock', { count: stockQuantity }) 
                                    : t('productCard.outOfStock')}
                            </span>
                            {!isAdminCard && !isWishlistCard && (
                                isProductAlreadyInCart ? (
                                    <span className="text-xs text-green-600 font-medium">{t('productCard.added')}</span>
                                ) : (
                                    <button
                                        onClick={(e) => handleAddToCart(e)}
                                        className="px-3 py-1.5 bg-[#E31837] text-white text-xs font-medium hover:bg-red-700 transition-colors"
                                    >
                                        {t('productCard.add')}
                                    </button>
                                )
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
  
    // ─── GRID VIEW ───
    return (
        <div 
            className={`flex flex-col cursor-pointer w-full ${isAdminCard || isWishlistCard ? '' : 'bg-white shadow-sm rounded-lg'} p-2 sm:p-3 lg:p-4`}
            onClick={() => navigate(`/product-details/${id}`)}
        >
            {/* image display */}
            <div className="w-full">
                <img 
                    className="w-full aspect-square object-contain" 
                    src={thumbnail} 
                    alt={t('productCard.altText', { title })} 
                />
            </div>

            {/* lower section */}
            <div className="flex-1 flex flex-col justify-end gap-1 sm:gap-1.5 mt-1.5 sm:mt-2">

                {/* title + wishlist */}
                <div>
                    <div className="flex items-center justify-between gap-1 sm:gap-2">
                        <h6 className="text-sm sm:text-base font-normal leading-tight line-clamp-2">{title}</h6>
                        {!isAdminCard && (
                            <motion.div 
                                whileHover={{ scale: 1.2 }} 
                                whileTap={{ scale: 1 }} 
                                transition={{ duration: .2, type: "spring" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <HeartCheckbox 
                                    checked={isInWishlist} 
                                    onChange={(e) => handleAddRemoveFromWishlist(e, id)} 
                                />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                        {t(`brands.${brandName}`, brandName)}
                    </p>
                    {/* Reviews */}
                    <StarRating rating={avgRating} count={reviewCount} />
                </div>

                {/* price + cart */}
                <div className="flex flex-row justify-between items-center gap-1 sm:gap-2">
                    <p className="font-medium text-sm sm:text-base">₹{price}</p>

                    {!isWishlistCard && (
                        isProductAlreadyInCart ? (
                            <span className="text-xs sm:text-sm text-green-600 font-medium whitespace-nowrap">
                                {t('productCard.addedToCart')}
                            </span>
                        ) : (
                            !isAdminCard && (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 1 }}
                                    onClick={(e) => handleAddToCart(e)}
                                    className="px-2 sm:px-3 py-1.5 sm:py-2 rounded bg-black text-white text-xs sm:text-sm font-medium whitespace-nowrap"
                                >
                                    {t('productCard.addToCart')}
                                </motion.button>
                            )
                        )
                    )}
                </div>

                {/* stock warning */}
                {stockQuantity <= 20 && (
                    <p className="text-xs sm:text-sm text-red-600 font-medium">
                        {stockQuantity === 1 
                            ? t('productCard.onlyOneLeft') 
                            : t('productCard.onlyFewLeft')
                        }
                    </p>
                )}
            </div>
        </div>
    )
}