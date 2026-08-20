import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
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
import { useTranslation } from 'react-i18next'

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
    const { t } = useTranslation();
    if (count <= 1) return null;
    const pages = Array.from({ length: count }, (_, i) => i + 1);
    return (
        <div className="flex items-center gap-1 flex-wrap justify-center">
            <button
                onClick={() => onChange(null, page - 1)}
                disabled={page === 1}
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
            >
                {t('productList.prev')}
            </button>
            {pages.map((p) => (
                <button
                    key={p}
                    onClick={() => onChange(null, p)}
                    className={`px-2 sm:px-3 py-1 border rounded text-xs sm:text-sm transition-colors ${
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
                className="px-2 sm:px-3 py-1 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed text-xs sm:text-sm transition-colors"
            >
                {t('productList.next')}
            </button>
        </div>
    );
};

export const ProductList = () => {
    const [filters, setFilters] = useState({})
    const [page, setPage] = useState(1)
    const [sort, setSort] = useState("")
    const [activePanel, setActivePanel] = useState(null)

    const is500 = useMediaQuery('(max-width: 500px)')
    const is488 = useMediaQuery('(max-width: 488px)')
    const dispatch = useDispatch()
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
    const navigate = useNavigate()
    const { t } = useTranslation()

    const sortOptions = [
        { name: t('productList.priceLowToHigh'), sort: "price", order: "asc" },
        { name: t('productList.priceHighToLow'), sort: "price", order: "desc" },
    ]

    const handleBrandFilters = (e) => {
        const filterSet = new Set(filters.brand)
        if (e.target.checked) { filterSet.add(e.target.value) }
        else { filterSet.delete(e.target.value) }
        setFilters({ ...filters, brand: Array.from(filterSet) })
    }

    const handleCategoryFilterText = (categoryId) => {
        setFilters({ ...filters, category: [categoryId] });
        dispatch(toggleFilters())
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
            setActivePanel(null);
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
    }, [filters, page, sort, searchQuery, loggedInUser?.isAdmin, dispatch])

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
                    toast.success(t('productList.addedToWishlist'))
                }
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) {
                    dispatch(removeGuestItem(wishlistItems[index]._id))
                    toast.success(t('productList.removedFromWishlist'))
                }
            }
        }
    }

    useEffect(() => {
        if (wishlistItemAddStatus === 'fulfilled') {
            toast.success(t('productList.addedToWishlist'))
            dispatch(resetWishlistItemAddStatus())
        } else if (wishlistItemAddStatus === 'rejected') {
            toast.error(t('productList.errorAddingWishlist'))
            dispatch(resetWishlistItemAddStatus())
        }
    }, [wishlistItemAddStatus, dispatch, t])

    useEffect(() => {
        if (wishlistItemDeleteStatus === 'fulfilled') {
            toast.success(t('productList.removedFromWishlist'))
            dispatch(resetWishlistItemDeleteStatus())
        } else if (wishlistItemDeleteStatus === 'rejected') {
            toast.error(t('productList.errorRemovingWishlist'))
            dispatch(resetWishlistItemDeleteStatus())
        }
    }, [wishlistItemDeleteStatus, dispatch, t])

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success(t('productList.addedToCart'))
            dispatch(resetCartItemAddStatus())
        } else if (cartItemAddStatus === 'rejected') {
            toast.error(t('productList.errorAddingCart'))
            dispatch(resetCartItemAddStatus())
        }
    }, [cartItemAddStatus, dispatch, t])

    useEffect(() => {
        if (productFetchStatus === 'rejected') {
            toast.error(t('productList.errorFetchingProducts'))
            dispatch(resetProductFetchStatus())
        }
    }, [productFetchStatus, dispatch, t])

    useEffect(() => {
        return () => {
            dispatch(resetProductFetchStatus())
            dispatch(resetWishlistItemAddStatus())
            dispatch(resetWishlistItemDeleteStatus())
            dispatch(resetCartItemAddStatus())
        }
    }, [dispatch])

    const categoryQuery = searchParams.get('category')

    useEffect(() => {
        if (categoryQuery) {
            setFilters(prev => {
                if (prev.category?.[0] === categoryQuery) return prev
                return { ...prev, category: [categoryQuery] }
            })
        }
    }, [categoryQuery])

    const handleFilterClose = () => { dispatch(toggleFilters()) }
    const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
    const panelTransition = { type: "spring", stiffness: 300, damping: 30 };

    return (
        <>
            {productFetchStatus === 'pending' ? (
                <div className={`flex justify-center mx-auto h-[calc(100vh-4rem)] ${is500 ? 'w-full' : 'w-[25rem]'}`}>
                    <Lottie animationData={loadingAnimation} />
                </div>
            ) : (
                <>
                    {isProductFilterOpen && (
                        <div
                            className="fixed inset-0 bg-black/50 z-[400]"
                            onClick={handleFilterClose}
                        />
                    )}

                    <motion.div
                        className={`fixed top-0 left-0 bg-white h-screen overflow-hidden shadow-xl z-[500] ${is500 ? 'w-full' : 'w-[30rem]'}`}
                        variants={{ show: { left: 0 }, hide: { left: -500 } }}
                        initial="hide"
                        transition={{ ease: "easeInOut", duration: 0.7, type: "spring" }}
                        animate={isProductFilterOpen === true ? "show" : "hide"}
                    >
                        <div className="relative h-full w-full">
                            <motion.div
                                className="absolute inset-0 p-4 overflow-y-auto"
                                animate={{ x: activePanel ? '-100%' : 0 }}
                                transition={panelTransition}
                            >
                                <div className="border-t border-gray-200 pt-4 space-y-2">
                                    <button
                                        onClick={() => setActivePanel('brands')}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[56px]"
                                    >
                                        <span className="font-medium text-gray-900 text-lg">{t('productList.brands')}</span>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => setActivePanel('category')}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[56px]"
                                    >
                                        <span className="font-medium text-gray-900 text-lg">{t('productList.category')}</span>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                    {/* My Orders Navigation */}
                                    <button
                                        onClick={() => {
                                            dispatch(toggleFilters());
                                            navigate('/track-order');
                                        }}
                                        className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors min-h-[56px]"
                                    >
                                        <span className="font-medium text-gray-900 text-lg">{t('productList.myOrders')}</span>
                                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                </div>
                            </motion.div>

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
                                    <h5 className="text-xl font-medium text-gray-900">{t('productList.brands')}</h5>
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
                                                {t(`brands.${brand.name}`, brand.name)}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

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
                                    <h5 className="text-xl font-medium text-gray-900">{t('productList.category')}</h5>
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
                                                {t(`categories.${category.name}`, category.name)}
                                            </label>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>

                        </div>
                    </motion.div>

                    <div className="mb-6 sm:mb-12">
                        <div className="flex flex-col gap-6 sm:gap-10 mt-0 max-sm:mt-2">

                            <div className="flex flex-row px-2 sm:px-4 lg:px-8 justify-center sm:justify-end items-center gap-3 sm:gap-5">
                                <div className="w-full sm:w-48">
                                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">{t('productList.sort')}</label>
                                    <select
                                        value={sort}
                                        onChange={(e) => setSort(e.target.value)}
                                        className="w-full border-b border-gray-300 bg-transparent py-1.5 sm:py-2 pr-8 text-xs sm:text-sm focus:outline-none focus:border-black transition-colors cursor-pointer"
                                    >
                                        <option value="">{t('productList.reset')}</option>
                                        {sortOptions.map((option) => (
                                            <option key={option.name} value={option.name}>{option.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {products && products.length > 0 ? (
                                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 px-1 sm:px-2 lg:px-4">
                                    {products.map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            id={product._id}
                                            title={product.title}
                                            thumbnail={product.thumbnail}
                                            brand={product.brand.name}
                                            stockQuantity={product.stockQuantity}
                                            price={product.price}
                                            reviews={product.reviews} 
                                            handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                        />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 sm:py-20 px-4">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <p className="text-lg sm:text-xl text-gray-500 font-medium">{t('productList.productNotAvailable')}</p>
                                    <p className="text-xs sm:text-sm text-gray-400 mt-1">{t('productList.adjustFilters')}</p>
                                </div>
                            )}

                            {products && products.length > 0 && (
                                <div className={`flex flex-col gap-3 sm:gap-4 p-0 ${is488 ? 'items-center self-center' : 'items-center self-end mr-2 sm:mr-5'}`}>
                                    <Pagination
                                        page={page}
                                        onChange={(e, page) => setPage(page)}
                                        count={totalPages}
                                    />
                                    <p className="text-center text-xs sm:text-sm text-gray-600">
                                        {t('productList.showingResults', {
                                            start: (page - 1) * ITEMS_PER_PAGE + 1,
                                            end: page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE,
                                            total: totalResults
                                        })}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    );
};