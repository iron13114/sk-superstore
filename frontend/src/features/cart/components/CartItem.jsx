import React from 'react'
import { useDispatch } from 'react-redux'
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../CartSlice'

export const CartItem = ({
    id,
    title,
    brand,
    price,
    quantity,
    thumbnail,
    stockQuantity,
    packagingTier,
    variantLabel,
}) => {
    const dispatch = useDispatch()
    const currentQty = Number(quantity) || 1

    const handleAddQty = () => {
        // Only block if stockQuantity is explicitly defined and reached
        if (stockQuantity && currentQty >= Number(stockQuantity)) {
            return
        }
        dispatch(updateCartItemByIdAsync({ _id: id, id, quantity: currentQty + 1 }))
    }

    const handleRemoveQty = () => {
        if (currentQty <= 1) {
            dispatch(deleteCartItemByIdAsync(id))
        } else {
            dispatch(updateCartItemByIdAsync({ _id: id, id, quantity: currentQty - 1 }))
        }
    }

    const handleRemove = () => {
        dispatch(deleteCartItemByIdAsync(id))
    }

    return (
        <div className="flex flex-row items-center sm:items-stretch p-3 sm:p-5 border border-gray-200 rounded-xl bg-white w-full gap-3 sm:gap-6 overflow-hidden">
            
            {/* 1. LEFT: Product Image */}
            <div className="w-16 h-16 sm:w-28 sm:h-28 shrink-0 flex items-center justify-center bg-gray-50 rounded-lg p-1">
                <img
                    src={thumbnail}
                    alt={title}
                    className="w-full h-full object-contain"
                />
            </div>

            {/* 2. MIDDLE: Info, Variant & Quantity */}
            <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                    {/* Title & Mobile Price */}
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-semibold text-indigo-600 text-sm sm:text-base truncate">
                                {title}
                            </h3>
                            <p className="text-xs sm:text-sm text-gray-500">
                                {brand}
                            </p>
                        </div>

                        {/* Mobile Price (Hidden on Desktop) */}
                        <span className="sm:hidden font-bold text-gray-900 text-sm shrink-0">
                            ₹{price}
                        </span>
                    </div>

                    {/* Packaging Tier / Variant Badge */}
                    {(variantLabel || packagingTier) && (
                        <span className="inline-block text-[10px] sm:text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded font-medium mt-1">
                            {variantLabel || packagingTier}
                        </span>
                    )}
                </div>

                {/* Quantity Controls */}
                <div className="mt-2 flex items-center gap-2">
                    <span className="text-[11px] sm:text-xs text-gray-600 font-medium">Qty:</span>
                    <div className="flex items-center border border-gray-200 rounded bg-gray-50 px-1 py-0.5">
                        <button
                            type="button"
                            onClick={handleRemoveQty}
                            className="px-2 py-0.5 text-gray-600 hover:text-black font-bold text-sm leading-none transition-colors cursor-pointer"
                        >
                            −
                        </button>
                        <span className="text-xs sm:text-sm font-semibold px-1 min-w-[16px] text-center select-none">
                            {currentQty}
                        </span>
                        <button
                            type="button"
                            onClick={handleAddQty}
                            className="px-2 py-0.5 text-gray-600 hover:text-black font-bold text-sm leading-none transition-colors cursor-pointer"
                        >
                            +
                        </button>
                    </div>
                </div>
            </div>

            {/* 3. RIGHT: Desktop Price & Remove Button (Hidden on Mobile) */}
            <div className="hidden sm:flex flex-col justify-between items-end shrink-0 py-0.5">
                <span className="font-semibold text-gray-900 text-base">
                    ₹{price}
                </span>

                <button
                    type="button"
                    onClick={handleRemove}
                    className="bg-black hover:bg-gray-800 text-white text-xs sm:text-sm px-4 py-1.5 rounded-md font-medium transition-colors cursor-pointer"
                >
                    Remove
                </button>
            </div>

        </div>
    )
}