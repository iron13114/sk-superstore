import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { addToCartAsync, selectCartItems } from '../../cart/CartSlice';
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
    React.useEffect(() => {
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

export const ProductCard = ({id, title, price, thumbnail, brand, stockQuantity, handleAddRemoveFromWishlist, isWishlistCard, isAdminCard}) => {
    const navigate = useNavigate()
    const wishlistItems = useSelector(selectWishlistItems)
    const cartItems = useSelector(selectCartItems)
    const dispatch = useDispatch()
    const { t } = useTranslation();

    const is1410 = useMediaQuery('(max-width: 1410px)')
    const is932 = useMediaQuery('(max-width: 932px)')
    const is752 = useMediaQuery('(max-width: 752px)')
    const is608 = useMediaQuery('(max-width: 608px)')
    const is500 = useMediaQuery('(max-width: 500px)')
    const is488 = useMediaQuery('(max-width: 488px)')
    const is408 = useMediaQuery('(max-width: 408px)')

    const isInWishlist = wishlistItems.some((item) => item.product?._id === id)
    const isProductAlreadyInCart = cartItems.some((item) => item.product?._id === id)

    const getWidth = () => {
        if (is408) return 'auto';
        if (is488) return '200px';
        if (is608) return '240px';
        if (is752) return '300px';
        if (is932) return '240px';
        if (is1410) return '300px';
        return '340px';
    };

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

    const cardWidth = getWidth();
    const btnFontSize = is408 ? '.9rem' : is488 ? '.7rem' : is500 ? '.8rem' : '.9rem';
    const brandName = typeof brand === 'string' ? brand : brand?.name || '';

    return (
        <div 
            className={`flex flex-col cursor-pointer ${isAdminCard || isWishlistCard || is408 ? '' : 'bg-white shadow-md rounded-lg'} p-4 ${is408 ? 'mt-2' : 'mt-0'}`}
            style={{ width: cardWidth }}
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
            <div className="flex-1 flex flex-col justify-end gap-3 mt-2">
                
                {/* title + wishlist */}
                <div>
                    <div className="flex items-center justify-between gap-2">
                        <h6 className="text-base font-normal leading-tight">{title}</h6>
                        {!isAdminCard && (
                            <motion.div 
                                whileHover={{ scale: 1.3, y: -10, zIndex: 100 }} 
                                whileTap={{ scale: 1 }} 
                                transition={{ duration: .4, type: "spring" }}
                                onClick={(e) => e.stopPropagation()}
                            >
                                <HeartCheckbox 
                                    checked={isInWishlist} 
                                    onChange={(e) => handleAddRemoveFromWishlist(e, id)} 
                                />
                            </motion.div>
                        )}
                    </div>
                    <p className="text-gray-500 text-sm mt-1">
                        {t(`brands.${brandName}`, brandName)}
                    </p>
                </div>

                {/* price + cart */}
                <div className="flex flex-row justify-between items-center gap-2">
                    <p className="font-medium text-base">₹{price}</p>
                    
                    {!isWishlistCard && (
                        isProductAlreadyInCart ? (
                            <span className="text-sm text-green-600 font-medium whitespace-nowrap">
                                {t('productCard.addedToCart')}
                            </span>
                        ) : (
                            !isAdminCard && (
                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 1 }}
                                    onClick={(e) => handleAddToCart(e)}
                                    className="px-3 py-2 rounded bg-black text-white text-sm font-medium whitespace-nowrap"
                                    style={{ fontSize: btnFontSize }}
                                >
                                    {t('productCard.addToCart')}
                                </motion.button>
                            )
                        )
                    )}
                </div>

                {/* stock warning */}
                {stockQuantity <= 20 && (
                    <p className="text-sm text-red-600 font-medium">
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