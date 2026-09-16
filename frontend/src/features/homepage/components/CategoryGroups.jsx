import React, { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { ProductCard } from '../../products/components/ProductCard'
import TruckLoader from '../../../components/TruckLoader'

export const CategoryGroups = ({ categoryTree = [], onAddRemoveWishlist }) => {
    const { t } = useTranslation()

    const [activeParentId, setActiveParentId] = useState(null)
    const [activeChildId, setActiveChildId] = useState(null)
    const [activeChildName, setActiveChildName] = useState('')
    const [categoryProducts, setCategoryProducts] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    // Scroll state tracking
    const [isDocked, setIsDocked] = useState(true)
    const [isOffscreen, setIsOffscreen] = useState(false)

    const scrollContainerRefs = useRef({})
    const activeTabRef = useRef(null)

    const getCatKey = (name) =>
        name
            ?.toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '') || 'unknown'

    const safeTree = Array.isArray(categoryTree) ? categoryTree : []

    // Check if the active tab is still aligned with the drawer or scrolled away
    const checkTabAlignment = useCallback(() => {
        if (!activeChildId || !activeTabRef.current || !activeParentId) return
        const container = scrollContainerRefs.current[activeParentId]
        const tab = activeTabRef.current
        if (!container || !tab) return

        const containerRect = container.getBoundingClientRect()
        const tabRect = tab.getBoundingClientRect()

        // Tab is docked if its left edge is near the container's left padding (~24px)
        const offsetFromLeft = tabRect.left - containerRect.left
        const currentlyDocked = offsetFromLeft >= 10 && offsetFromLeft <= 40

        // Tab is offscreen if it leaves the horizontal container's view
        const currentlyOffscreen = tabRect.right < containerRect.left || tabRect.left > containerRect.right

        setIsDocked(currentlyDocked)
        setIsOffscreen(currentlyOffscreen)
    }, [activeChildId, activeParentId])

    const scrollToActiveTab = () => {
        if (activeTabRef.current) {
            activeTabRef.current.scrollIntoView({
                behavior: 'smooth',
                inline: 'start',
                block: 'nearest',
            })
        }
    }

    const handleSubCategoryClick = async (parentId, child, element) => {
        if (activeChildId === child._id) {
            setActiveParentId(null)
            setActiveChildId(null)
            setActiveChildName('')
            setCategoryProducts([])
            return
        }

        setActiveParentId(parentId)
        setActiveChildId(child._id)
        setActiveChildName(child.name)
        setIsLoading(true)
        setCategoryProducts([])
        setIsDocked(true)
        setIsOffscreen(false)

        if (element) {
            setTimeout(() => {
                element.scrollIntoView({
                    behavior: 'smooth',
                    inline: 'start',
                    block: 'nearest',
                })
            }, 50)
        }

        try {
            const API_BASE = import.meta.env.VITE_API_URL || ''
            const res = await axios.get(`${API_BASE}/products?category=${child._id}`)
            const data = Array.isArray(res.data) ? res.data : (res.data?.products || [])
            setCategoryProducts(data)
        } catch (error) {
            console.error('Failed to fetch category products:', error)
            setCategoryProducts([])
        } finally {
            setIsLoading(false)
        }
    }

    const handleCloseDrawer = () => {
        setActiveParentId(null)
        setActiveChildId(null)
        setActiveChildName('')
        setCategoryProducts([])
    }

    return (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
            {safeTree.length > 0 ? (
                safeTree.map((parent) => {
                    const isParentActive = activeParentId === parent._id

                    return (
                        <div key={parent._id} className="mb-10 sm:mb-14">
                            {/* Group Title */}
                            <h2 className="text-xl sm:text-2xl font-black text-gray-900 mb-4 sm:mb-6 tracking-tight">
                                {t(`categories.${getCatKey(parent.name)}`, parent.name)}
                            </h2>

                            {/* Horizontal Tabs Scroller */}
                            <div
                                ref={(el) => (scrollContainerRefs.current[parent._id] = el)}
                                onScroll={checkTabAlignment}
                                className="relative flex items-end gap-2.5 sm:gap-3.5 overflow-x-auto no-scrollbar scroll-smooth pt-3 pl-6 sm:pl-8 pr-6 scroll-pl-6 sm:scroll-pl-8"
                            >
                                {(parent.children || []).map((child) => {
                                    const isSelected = activeChildId === child._id

                                    return (
                                        <div
                                            key={child._id}
                                            ref={isSelected ? activeTabRef : null}
                                            className="relative shrink-0 flex flex-col items-center"
                                        >
                                            {/* Sliding Active Tab Background */}
                                            {isSelected && (
                                                <motion.div
                                                    layoutId={`active-tab-highlight-${parent._id}`}
                                                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                                                    className="absolute inset-0 z-20 pointer-events-none"
                                                >
                                                    {/* Scoop Wings (Only visible when docked in resting position) */}
                                                    <AnimatePresence>
                                                        {isDocked && (
                                                            <motion.div
                                                                initial={{ opacity: 0, scale: 0.8 }}
                                                                animate={{ opacity: 1, scale: 1 }}
                                                                exit={{ opacity: 0, scale: 0.8 }}
                                                                transition={{ duration: 0.2 }}
                                                            >
                                                                {/* Left Wing */}
                                                                <span className="absolute -left-[13px] -bottom-[1px] w-[14px] h-[14px] z-30">
                                                                    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full overflow-visible">
                                                                        <path d="M 14 0 Q 14 14 0 14 L 14 14 Z" fill="#ffffff" />
                                                                        <rect x="12" y="0" width="2.5" height="14" fill="#ffffff" />
                                                                        <path d="M 14 0 Q 14 14 0 14" stroke="#e5e7eb" strokeWidth="1.5" />
                                                                    </svg>
                                                                </span>

                                                                {/* Right Wing */}
                                                                <span className="absolute -right-[13px] -bottom-[1px] w-[14px] h-[14px] z-30">
                                                                    <svg viewBox="0 0 14 14" fill="none" className="w-full h-full overflow-visible">
                                                                        <path d="M 0 0 Q 0 14 14 14 L 0 14 Z" fill="#ffffff" />
                                                                        <rect x="-0.5" y="0" width="2.5" height="14" fill="#ffffff" />
                                                                        <path d="M 0 0 Q 0 14 14 14" stroke="#e5e7eb" strokeWidth="1.5" />
                                                                    </svg>
                                                                </span>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>

                                                    {/* Card Body: morphs bottom corners when scrolled away */}
                                                    <div
                                                        className={`w-full h-full bg-white border border-gray-200 transition-all duration-300 shadow-sm ${
                                                            isDocked
                                                                ? 'rounded-t-2xl border-b-transparent -mb-[1px]'
                                                                : 'rounded-2xl border-b-gray-200 shadow-md ring-2 ring-[#0055A4]/20'
                                                        }`}
                                                    />
                                                </motion.div>
                                            )}

                                            {/* Tab Button */}
                                            <button
                                                onClick={(e) => handleSubCategoryClick(parent._id, child, e.currentTarget)}
                                                className={`relative z-30 flex flex-col items-center justify-between w-[86px] sm:w-[100px] md:w-[112px] cursor-pointer transition-colors ${
                                                    isSelected
                                                        ? 'pt-3 pb-3 px-2 sm:px-3'
                                                        : 'bg-[#f4f6f8] hover:bg-gray-100 py-2.5 px-2 sm:px-3 rounded-2xl mb-1'
                                                }`}
                                            >
                                                <div className={`w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center transition-transform duration-200 ${
                                                    isSelected ? 'scale-110 -translate-y-0.5' : 'opacity-85'
                                                }`}>
                                                    {child.image ? (
                                                        <img
                                                            src={child.image}
                                                            alt={t(`categories.${getCatKey(child.name)}`, child.name)}
                                                            className="w-full h-full object-contain"
                                                            loading="lazy"
                                                        />
                                                    ) : (
                                                        <span className="text-2xl sm:text-3xl select-none">
                                                            {t(`categories.${getCatKey(child.name)}_icon`, child.icon || '📦')}
                                                        </span>
                                                    )}
                                                </div>

                                                <span className={`text-[11px] sm:text-xs text-center leading-tight mt-1 line-clamp-2 min-h-[2rem] flex items-center justify-center w-full px-0.5 ${
                                                    isSelected
                                                        ? 'font-bold text-gray-900'
                                                        : 'font-semibold text-gray-600'
                                                }`}>
                                                    {t(`categories.${getCatKey(child.name)}`, child.name)}
                                                </span>
                                            </button>
                                        </div>
                                    )
                                })}
                            </div>

                            {/* Connected Product Panel */}
                            <AnimatePresence>
                                {isParentActive && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                                        className={`relative z-10 -mt-[1px] bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 shadow-sm overflow-hidden transition-all duration-300 ${
                                            !isDocked ? 'border-t-gray-200 shadow-md mt-2' : ''
                                        }`}
                                    >
                                        {/* Sub-header with Return Chip if scrolled away */}
                                        <div className="flex items-center justify-between pb-3 mb-5 border-b border-gray-100">
                                            <div className="flex items-center gap-2 sm:gap-3">
                                                <span className="w-2.5 h-2.5 rounded-full bg-[#0055A4]" />
                                                <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-wide">
                                                    {t(`categories.${getCatKey(activeChildName)}`, activeChildName)}
                                                </h3>

                                                {!isLoading && (
                                                    <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                                                        {categoryProducts.length} {categoryProducts.length === 1 ? 'Product' : 'Products'}
                                                    </span>
                                                )}

                                                {/* Animated Jump-back Chip when scrolled off-screen */}
                                                <AnimatePresence>
                                                    {isOffscreen && (
                                                        <motion.button
                                                            initial={{ opacity: 0, x: -10 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -10 }}
                                                            onClick={scrollToActiveTab}
                                                            className="flex items-center gap-1 text-[11px] font-bold text-[#0055A4] bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2.5 py-0.5 rounded-full transition-colors cursor-pointer"
                                                        >
                                                            <span>‹</span>
                                                            <span>Show Tab</span>
                                                        </motion.button>
                                                    )}
                                                </AnimatePresence>
                                            </div>

                                            <button
                                                onClick={handleCloseDrawer}
                                                className="text-gray-400 hover:text-gray-700 p-1.5 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
                                                title="Close"
                                            >
                                                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>

                                        {/* Product Grid Transition */}
                                        <AnimatePresence mode="wait">
                                            {isLoading ? (
                                                <motion.div
                                                    key="loader"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex flex-col items-center justify-center py-12"
                                                >
                                                    <TruckLoader />
                                                    <p className="text-xs text-gray-500 font-medium mt-3 animate-pulse">
                                                        Fetching {activeChildName} products...
                                                    </p>
                                                </motion.div>
                                            ) : categoryProducts.length > 0 ? (
                                                <motion.div
                                                    key={`products-${activeChildId}`}
                                                    initial={{ opacity: 0, y: 8 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -8 }}
                                                    transition={{ duration: 0.22, ease: 'easeOut' }}
                                                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
                                                >
                                                    {categoryProducts.map((product) => (
                                                        <ProductCard
                                                            key={product._id}
                                                            id={product._id}
                                                            title={product.title}
                                                            thumbnail={product.thumbnail}
                                                            brand={product.brand?.name || product.brand}
                                                            price={product.price}
                                                            stockQuantity={product.stockQuantity}
                                                            reviews={product.reviews}
                                                            handleAddRemoveFromWishlist={onAddRemoveWishlist}
                                                        />
                                                    ))}
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    key="empty"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    transition={{ duration: 0.15 }}
                                                    className="flex flex-col items-center justify-center py-12 text-center"
                                                >
                                                    <span className="text-4xl mb-2">📦</span>
                                                    <h4 className="text-sm font-bold text-gray-800">
                                                        No products found
                                                    </h4>
                                                    <p className="text-xs text-gray-400 mt-1 max-w-xs">
                                                        There are currently no wholesale items in stock for this category.
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })
            ) : (
                <p className="text-center text-gray-400 text-sm py-8">
                    {t('categories.noCategoriesFound', 'No categories found')}
                </p>
            )}
        </section>
    )
}

export default CategoryGroups