import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../../cart/CartSlice'

export const CartItem = ({ 
    id, 
    title, 
    brand, 
    price, 
    quantity, 
    thumbnail, 
    productId, 
    packagingTier,
    variantLabel
}) => {
    const dispatch = useDispatch()

    const handleProductRemove = () => {
        dispatch(deleteCartItemByIdAsync(id))
    }

    const handleAddQty = () => {
        dispatch(updateCartItemByIdAsync({ _id: id, quantity: quantity + 1 }))
    }

    const handleRemoveQty = () => {
        if (quantity <= 1) {
            dispatch(deleteCartItemByIdAsync(id))
        } else {
            dispatch(updateCartItemByIdAsync({ _id: id, quantity: quantity - 1 }))
        }
    }

    return (
        <div className="flex flex-row justify-between items-center bg-white p-0 md:p-4 rounded-lg md:shadow-sm border border-transparent md:border-gray-100 w-full min-w-0">
            
            {/* Image and Details */}
            <div className="flex flex-row items-center gap-4 flex-wrap min-w-0">
                
                {/* Thumbnail */}
                <Link 
                    to={`/product-details/${productId}`}
                    className="w-full sm:w-[120px] md:w-[150px] lg:w-[180px] h-[120px] sm:h-[120px] md:h-[150px] lg:h-[180px] shrink-0 flex items-center justify-center overflow-hidden rounded bg-gray-50 border border-gray-100"
                >
                    <img 
                        className="w-full h-full object-contain aspect-square" 
                        src={thumbnail} 
                        alt={`${title} image unavailable`} 
                    />
                </Link>

                {/* Details */}
                <div className="flex flex-col min-w-0">
                    <Link 
                        to={`/product-details/${productId}`}
                        className="text-base sm:text-lg font-medium text-indigo-600 hover:text-indigo-800 transition-colors truncate max-w-[200px] sm:max-w-xs"
                    >
                        {title}
                    </Link>
                    
                    <p className="text-sm text-gray-500">{brand}</p>
                    
                    {(variantLabel || (packagingTier && packagingTier !== 'single')) && (
                        <span className="mt-1 mb-1 inline-block w-fit px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-xs font-medium">
                            {variantLabel || (packagingTier === 'pack' ? 'Pack (10 Units)' : packagingTier === 'carton' ? 'Carton (50 Units)' : '')}
                        </span>
                    )}

                    <span className="mt-2 text-xs sm:text-sm text-gray-700 font-medium">Quantity</span>
                    
                    {/* Quantity Selector */}
                    <div className="flex flex-row items-center gap-2 mt-1">
                        <button 
                            type="button"
                            onClick={handleRemoveQty}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 active:scale-95 transition-all focus:outline-none"
                            aria-label="Decrease quantity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                            </svg>
                        </button>
                        
                        <span className="text-sm font-medium text-gray-900 min-w-[20px] text-center">
                            {quantity}
                        </span>
                        
                        <button 
                            type="button"
                            onClick={handleAddQty}
                            className="p-1 rounded-full hover:bg-gray-100 text-gray-600 active:scale-95 transition-all focus:outline-none"
                            aria-label="Increase quantity"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Price and Remove Button */}
            <div className="flex flex-col justify-between items-end gap-4 self-end sm:self-center shrink-0 pl-2">
                <span className="text-sm sm:text-base font-semibold text-gray-900">₹{price}</span>
                <button 
                    type="button"
                    onClick={handleProductRemove} 
                    className="px-3 py-1.5 sm:px-4 sm:py-2 bg-black hover:bg-gray-800 text-white rounded text-xs sm:text-sm font-medium transition-colors shadow-sm focus:outline-none"
                >
                    Remove
                </button>
            </div>
        </div>
    )
}