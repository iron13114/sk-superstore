import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

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

export const ProductCard = ({id, title, price, thumbnail, brand, stockQuantity, handleAddRemoveFromWishlist, isWishlistCard, isAdminCard}) => {
    const navigate = useNavigate()
    const wishlistItems = useSelector(selectWishlistItems)
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()
    const { t } = useTranslation();

    const isInWishlist = wishlistItems.some((item) => item.product?._id === id)
    const isProductAlreadyInCart = cartItems.some((item) => item.product?._id === id)

    const handleAddToCart = async (e) => {
        e.stopPropagation();
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
        dispatch(addToCartAsync(data));
    }

    const brandName = typeof brand === 'string' ? brand : brand?.name || '';

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
            <div className="flex-1 flex flex-col justify-end gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">

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