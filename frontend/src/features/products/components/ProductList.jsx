import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Lottie from 'lottie-react'
import { toast } from 'react-toastify'
import { fetchProductsAsync, resetProductFetchStatus, selectProductFetchStatus, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters } from '../ProductSlice'
import { ProductCard } from './ProductCard'
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { ITEMS_PER_PAGE } from '../../../constants'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, resetWishlistItemAddStatus, resetWishlistItemDeleteStatus, selectWishlistItemAddStatus, selectWishlistItemDeleteStatus, selectWishlistItems, loadGuestWishlist, addGuestItem, removeGuestItem } from '../../wishlist/WishlistSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { loadingAnimation } from '../../../assets'
import { resetCartItemAddStatus, selectCartItemAddStatus } from '../../cart/CartSlice'
import { fetchAllBrandsAsync } from '../../brands/BrandSlice'
import { fetchAllCategoriesAsync } from '../../categories/CategoriesSlice'
import { useTranslation } from 'react-i18next';

const sortOptions = [
    { name: "Price: low to high", sort: "price", order: "asc" },
    { name: "Price: high to low", sort: "price", order: "desc" },
]

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

const Pagination = ({ page, onChange, count }) => {
    if (count <= 1) return null;
    const pages = Array.from({ length: count }, (_, i) => i + 1);
    return (
        <div className="flex items-center gap-1 flex-wrap justify-center">
            <button
                onClick={() => onChange(null, page - 1)}
                disabled={page === 1}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
            >
                Prev
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(null, p)}
                    className={`px-3 py-1 border rounded text-sm transition-colors ${
                        p === page
                            ? 'bg-black text-white border-black'
                            : 'border-gray-300 hover:bg-gray-100'
                    }`}
                >
                    {p}
                </button>
            ))}
            <button
                onClick={() => onChange(null, page + 1)}
                disabled={page === count}
                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-sm transition-colors"
            >
                Next
            </button>
        </div>
    );
};

export const ProductList = () => {
    const [filters, setFilters] = useState({})
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState("")
    const [activePanel, setActivePanel] = useState(null) // null | 'brands' | 'category'

    const is500 = useMediaQuery('(max-width: 500px)')
    const is488 = useMediaQuery('(max-width: 488px)')

    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const products = useSelector(selectProducts)
    const totalResults = useSelector(selectProductTotalResults)
    const loggedInUser = useSelector(selectLoggedInUser)
    const productFetchStatus = useSelector(selectProductFetchStatus)

    const wishlistItems = useSelector(selectWishlistItems)
    const wishlistItemAddStatus = useSelector(selectWishlistItemAddStatus)
    const wishlistItemDeleteStatus = useSelector(selectWishlistItemDeleteStatus)
    const [searchParams] = useSearchParams()
    const searchQuery = searchParams.get('search')
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    const isProductFilterOpen = useSelector(selectProductIsFilterOpen)
    const { t } = useTranslation();

    const dispatch = useDispatch()

    const handleBrandFilters = (e) => {
        const filterSet = new Set(filters.brand)
        if (e.target.checked) { filterSet.add(e.target.value) }
        else { filterSet.delete(e.target.value) }
        setFilters({ ...filters, brand: Array.from(filterSet) })
    }

    const handleCategoryFilterText = (categoryId) => {
        setFilters({ ...filters, category: [categoryId] });
        dispatch(toggleFilters())
        console.log("Filtering products by category ID:", categoryId);
    };

    const handleCategoryFiltersCheckbox = (e) => {
        if (!e || !e.target) return;
        const targetValue = e.target.value;
        const isChecked = e.target.checked;
        const currentCategories = filters.category ? [...filters.category] : [];
        const filterSet = new Set(currentCategories);
        if (isChecked) { filterSet.add(targetValue); }
        else { filterSet.delete(targetValue); }
        setFilters({ ...filters, category: Array.from(filterSet) });
    };

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])

    useEffect(() => { setPage(1) }, [totalResults])

    useEffect(() => {
        dispatch(fetchAllBrandsAsync())
        dispatch(fetchAllCategoriesAsync())
    }, [dispatch])

    useEffect(() => {
    if (!loggedInUser) {
        dispatch(loadGuestWishlist())
    }
    }, [loggedInUser, dispatch])

    useEffect(() => {
        if (isProductFilterOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
            setActivePanel(null); // reset panel when sidebar closes
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isProductFilterOpen]);

    useEffect(() => {
        const finalFilters = { ...filters }
        finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE }
        finalFilters['sort'] = sort
        if (searchQuery) { finalFilters['search'] = searchQuery }
        if (!loggedInUser?.isAdmin) { finalFilters['user'] = true }
        dispatch(fetchProductsAsync(finalFilters))
    }, [filters, page, sort, searchQuery])

    const handleAddRemoveFromWishlist = (e, productId) => {
        if (loggedInUser) {
            if (e.target.checked) {
                dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: productId }))
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
            }
        } else {
            if (e.target.checked) {
                const product = products.find(p => p._id === productId)
                if (product) {
                    dispatch(addGuestItem({
                        _id: 'guest_' + Date.now(),
                        product,
                        note: ''
                    }))
                    toast.success("Product added to wishlist")
                }
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) {
                    dispatch(removeGuestItem(wishlistItems[index]._id))
                    toast.success("Product removed from wishlist")
                }
            }
        }
    }

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') { toast.success("Product added to wishlist") }
        else if (wishlistItemAddStatus === 'rejected') { toast.error("Error adding product to wishlist, please try again later") }
    }, [wishlistItemAddStatus])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') { toast.success("Product removed from wishlist") }
        else if (wishlistItemDeleteStatus === 'rejected') { toast.error("Error removing product from wishlist, please try again later") }
    }, [wishlistItemDeleteStatus])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') { toast.success("Product added to cart") }
        else if (cartItemAddStatus === 'rejected') { toast.error("Error adding product to cart, please try again later") }
    }, [cartItemAddStatus])

    useEffect(() => {
        if (productFetchStatus === 'rejected') { toast.error("Error fetching products, please try again later") }
    }, [productFetchStatus])

    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus())
            dispatch(resetWishlistItemAddStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [])

    const handleFilterClose = () => { dispatch(toggleFilters()) }

    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)

    // Panel slide transition settings
    const panelTransition = { type: "spring", stiffness: 300, damping: 30 };

    return (
        <>
            {productFetchStatus === 'pending' ? (
                <div className={`flex justify-center mx-auto h-[calc(100vh-4rem)] ${is500 ? 'w-full' : 'w-[25rem]'}`}>
                    <Lottie animationData={loadingAnimation} />
                </div>
            ) : (
                <>
                    {/* Backdrop */}
                    {isProductFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[400]"
                            onClick={handleFilterClose}
                        />
                    )}

                    {/* Filters Sidebar */}
                    <motion.div
                        className={`fixed top-0 left-0 bg-white h-screen overflow-hidden shadow-xl z-[500] ${is500 ? 'w-full' : 'w-[30rem]'}`}
                        variants={{ show: { left: 0 }, hide: { left: -500 } }}
                        initial="hide"
                        transition={{ ease: "easeInOut", duration: 0.7, type: "spring" }}
                        animate={isProductFilterOpen === true ? "show" : "hide"}
                    >
                        <div className="relative h-full w-full">
                            
                            {/* MAIN PANEL */}
                            <motion.div
                                className="absolute inset-0 p-4 overflow-y-auto"
                                animate={{ x: activePanel ? '-100%' : 0 }}
                                transition={panelTransition}
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="text-2xl font-medium text-gray-900">New Arrivals</h4>
                                    <button
                                        onClick={handleFilterClose}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Quick Categories */}
                                <div className="flex flex-col gap-3 mb-6">
                                    {categories && categories.length > 0 ? (
                                        categories.map((category) => (
                                            <p
                                                key={category._id}
                                                className="cursor-pointer text-base text-gray-700 hover:text-black transition-colors py-1"
                                                onClick={() => handleCategoryFilterText(category._id)}
                                            >
                                                {category.name}
                                            </p>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-500">No categories loaded</p>
                                    )}
                                </div>

                                {/* Menu Items with right arrows */}
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    {/* Brands Trigger */}
                                    <button
                                        onClick={() => setActivePanel('brands')}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[56px]"
                                    >
                                        <span className="font-medium text-gray-900 text-lg">Brands</span>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    {/* Category Trigger */}
                                    <button
                                        onClick={() => setActivePanel('category')}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[56px]"
                                    >
                                        <span className="font-medium text-gray-900 text-lg">Category</span>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>

                            {/* BRANDS PANEL (slides in from right) */}
                            <motion.div
                                className="absolute inset-0 bg-white p-4 overflow-y-auto"
                                initial={{ x: '100%' }}
                                animate={{ x: activePanel === 'brands' ? 0 : '100%' }}
                                transition={panelTransition}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={() => setActivePanel(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h5 className="text-xl font-medium text-gray-900">Brands</h5>
                                </div>

                                <div className="space-y-3">
                                    {brands?.map((brand) => (
                                        <motion.div
                                            key={brand._id}
                                            className="w-fit"
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <label className="flex items-center gap-3 cursor-pointer text-base text-gray-700 select-none">
                                                <input
                                                    type="checkbox"
                                                    value={brand._id}
                                                    checked={filters.brand?.includes(brand._id) || false}
                                                    onChange={handleBrandFilters}
                                                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                                />
                                                {brand.name}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                            {/* CATEGORY PANEL (slides in from right) */}
                            <motion.div
                                className="absolute inset-0 bg-white p-4 overflow-y-auto"
                                initial={{ x: '100%' }}
                                animate={{ x: activePanel === 'category' ? 0 : '100%' }}
                                transition={panelTransition}
                            >
                                <div className="flex items-center gap-3 mb-6">
                                    <button
                                        onClick={() => setActivePanel(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                    <h5 className="text-xl font-medium text-gray-900">Category</h5>
                                </div>

                                <div className="space-y-3">
                                    {categories?.map((category) => (
                                        <motion.div
                                            key={category._id}
                                            className="w-fit"
                                            whileHover={{ x: 5 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            <label className="flex items-center gap-3 cursor-pointer text-base text-gray-700 select-none">
                                                <input
                                                    type="checkbox"
                                                    value={category._id}
                                                    checked={filters.category?.includes(category._id) || false}
                                                    onChange={handleCategoryFiltersCheckbox}
                                                    className="w-5 h-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                                />
                                                {category.name}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="mb-12">
                        <div className="flex flex-col gap-10 mt-0 max-sm:mt-2">
                            
                            {/* Sort Options */}
                            <div className="flex flex-row px-4 sm:px-8 justify-center sm:justify-end items-center gap-5">
                                <div className="w-full sm:w-48">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Sort</label>
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="w-full border-b border-gray-300 bg-transparent py-2 pr-8 text-sm focus:outline-none focus:border-black transition-colors cursor-pointer"
                                    >
                                        <option value="">Reset</option>
                                        {sortOptions.map((option) => (
                                            <option key={option.name} value={option.name}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Product Grid */}
                            {products && products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            title={product.title}
                                            thumbnail={product.thumbnail}
                                            brand={product.brand.name}
                                            price={product.price}
                                            handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                        />
                                    ))}
                                </div>
                            ) : (
                                /* EMPTY STATE */
                                <div className="flex flex-col items-center justify-center py-20 px-4">
                                    <svg className="w-16 h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-xl text-gray-500 font-medium">Product is not available</p>
                                    <p className="text-sm text-gray-400 mt-1">Try adjusting your filters or search query</p>
                                </div>
                            )}

                            {/* Pagination */}
                            {products && products.length > 0 && (
                                <div className={`flex flex-col gap-4 p-0 ${is488 ? 'items-center self-center' : 'items-center self-end mr-5'}`}>
                                    <Pagination
                                        page={page}
                                        onChange={(e, page) => setPage(page)}
                                        count={totalPages}
                                    />
                                    <p className="text-center text-sm text-gray-600">
                                        Showing {(page - 1) * ITEMS_PER_PAGE + 1} to {page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE} of {totalResults} results
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}