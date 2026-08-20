import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { fetchAllCategoriesAsync, selectCategories } from '../../categories/CategoriesSlice'
import { fetchProductsAsync, selectProducts } from '../../products/ProductSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems, loadGuestWishlist, addGuestItem, removeGuestItem } from '../../wishlist/WishlistSlice'
import { ProductList } from '../../products/components/ProductList'

const categoryIcons = {
    'Snacks': '🍿',
    'Biscuits': '🍪',
    'Beverages': '🥤',
    'Personal Care': '🧴',
    'Household': '🏠',
    'Grocery': '🌾',
}

const TrustBadge = ({ number, label }) => (
    <div className="text-center px-2 sm:px-4">
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0055A4]">{number}</div>
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1 uppercase tracking-wide">{label}</div>
    </div>
);

const StepCard = ({ step, title, desc }) => (
    <div className="flex flex-col items-center text-center">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#E31837] text-white flex items-center justify-center text-base sm:text-lg font-bold mb-2 sm:mb-3">
            {step}
        </div>
        <h4 className="text-sm sm:text-base font-semibold text-gray-900">{title}</h4>
        <p className="text-xs sm:text-sm text-gray-500 mt-1">{desc}</p>
    </div>
);

export const Homepage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
    const categories = useSelector(selectCategories)
    const products = useSelector(selectProducts)
    const wishlistItems = useSelector(selectWishlistItems)
    const loggedInUser = useSelector(selectLoggedInUser)
    const productListRef = useRef(null)

    useEffect(() => {
        dispatch(fetchAllCategoriesAsync())
        dispatch(fetchProductsAsync({ pagination: { page: 1, limit: 8 } }))
        if (!loggedInUser) dispatch(loadGuestWishlist())
    }, [dispatch, loggedInUser])

    useEffect(() => {
        const categoryQuery = searchParams.get('category')
        if (categoryQuery && productListRef.current) {
            setTimeout(() => {
                productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [searchParams])

    const handleCategoryClick = (categoryId) => {
        navigate(`/?category=${categoryId}`)
    }

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
                    dispatch(addGuestItem({ _id: 'guest_' + Date.now(), product, note: '' }))
                }
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) dispatch(removeGuestItem(wishlistItems[index]._id))
            }
        }
    }

    const featuredProducts = products?.slice(0, 4) || []

    return (
        <div className="flex flex-col w-full bg-white">

            {/* ===== HERO SECTION ===== */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 md:py-20">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <span className="inline-block px-2 sm:px-3 py-1 bg-[#E31837] text-white text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
                                {t('homepage.heroBadge')}
                            </span>
                            <h1 className="text-2xl sm:text-3xl md:text-5xl font-bold leading-tight mb-3 sm:mb-4 text-gray-900">
                                {t('homepage.heroTitle')}
                            </h1>
                            <p className="text-gray-600 text-sm sm:text-base md:text-lg mb-5 sm:mb-8 max-w-lg">
                                {t('homepage.heroSubtitle')}
                            </p>
                            <div className="flex flex-col gap-2 sm:gap-3">
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <button
                                        onClick={() => productListRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-4 sm:px-6 py-2 sm:py-3 bg-[#E31837] hover:bg-red-700 text-white font-semibold text-xs sm:text-sm transition-colors"
                                    >
                                        {t('homepage.heroCtaPrimary')}
                                    </button>
                                    <a
                                        href="https://wa.me/919386042504"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-[#34a400] text-[#0b0b0b] hover:bg-[#00a403] hover:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2"
                                    >
                                        <span></span> {t('homepage.heroCtaSecondary')}
                                    </a>
                                </div>
                                <div className="flex flex-wrap gap-2 sm:gap-3">
                                    <a
                                        href="https://www.google.com/maps/place/SK+General+Stores+Station+Road+Sakri/@26.2097846,86.079415,17z/data=!4m6!3m5!1s0x39edcf8ac7311eb7:0x6a769e37c40868b1!8m2!3d26.2096491!4d86.0784015!16s%2Fg%2F11h04fglsj?entry=ttu&g_ep=EgoyMDI2MDgxMi4wIKXMDSoASAFQAw%3D%3D"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 sm:px-6 py-2 sm:py-3 border-2 border-gray-300 text-gray-700 hover:border-[#0055A4] hover:text-[#0055A4] font-medium text-xs sm:text-sm transition-colors flex items-center gap-2"
                                     >
                                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        {t('homepage.shopLocation')}
                                    </a>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ===== TRUST BAR ===== */}
            <section className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
                    <div className="flex flex-wrap justify-center md:justify-between items-center gap-3 sm:gap-6">
                        <TrustBadge number="500+" label={t('homepage.trustRetailers')} />
                        <div className="hidden md:block w-px h-10 bg-gray-300" />
                        <TrustBadge number="50+" label={t('homepage.trustBrands')} />
                        <div className="hidden md:block w-px h-10 bg-gray-300" />
                        <TrustBadge number={t('homepage.trustDeliveryValue')} label={t('homepage.trustDelivery')} />
                        <div className="hidden md:block w-px h-10 bg-gray-300" />
                        <TrustBadge number="10-50%" label={t('homepage.trustSavings')} />
                    </div>
                </div>
            </section>

            {/* ===== CATEGORY GRID ===== */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 w-full">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{t('homepage.categoriesTitle')}</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
                    {categories?.map((cat) => (
                        <motion.button
                            key={cat._id}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategoryClick(cat._id)}
                            className="flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-6 bg-white border border-gray-200 hover:border-[#E31837] hover:shadow-sm transition-all"
                        >
                            <span className="text-2xl sm:text-3xl">{categoryIcons[cat.name] || '📦'}</span>
                            <span className="text-xs sm:text-sm font-medium text-gray-900">
                                {t(`categories.${cat.name}`, cat.name)}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </section>

            {/* ===== FEATURED PRODUCTS ===== */}
            {featuredProducts.length > 0 && (
                <section className="bg-gray-50 py-6 sm:py-12 w-full border-t border-gray-200">
                    <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-4 sm:mb-6">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{t('homepage.featuredTitle')}</h2>
                            <button
                                onClick={() => productListRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                className="text-xs sm:text-sm font-medium text-[#0055A4] hover:text-[#003d7a] transition-colors"
                            >
                                {t('homepage.viewAll')} →
                            </button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    id={product._id}
                                    title={product.title}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand?.name || product.brand}
                                    price={product.price}
                                    stockQuantity={product.stockQuantity}
                                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== HOW WHOLESALE WORKS ===== */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 w-full border-t border-gray-200">
                <div className="text-center mb-6 sm:mb-10">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">{t('homepage.howItWorksTitle')}</h2>
                    <p className="text-gray-500 text-xs sm:text-sm">{t('homepage.howItWorksSubtitle')}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
                    <StepCard step="1" title={t('homepage.step1Title')} desc={t('homepage.step1Desc')} />
                    <StepCard step="2" title={t('homepage.step2Title')} desc={t('homepage.step2Desc')} />
                    <StepCard step="3" title={t('homepage.step3Title')} desc={t('homepage.step3Desc')} />
                </div>
            </section>

            {/* ===== BULK SAVINGS BANNER ===== */}
            <section className="bg-[#0055A4] text-white py-8 sm:py-12 w-full">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div>
                        <h3 className="text-base sm:text-xl md:text-2xl font-bold mb-1 sm:mb-2">{t('homepage.savingsTitle')}</h3>
                        <p className="text-blue-100 text-xs sm:text-sm">{t('homepage.savingsSubtitle')}</p>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                        <div className="bg-white/10 px-3 sm:px-5 py-2 sm:py-3 text-center">
                            <div className="text-lg sm:text-xl font-bold text-white">5%</div>
                            <div className="text-[10px] sm:text-xs text-blue-100">{t('homepage.savingsPack')}</div>
                        </div>
                        <div className="bg-white/10 px-3 sm:px-5 py-2 sm:py-3 text-center">
                            <div className="text-lg sm:text-xl font-bold text-white">10%</div>
                            <div className="text-[10px] sm:text-xs text-blue-100">{t('homepage.savingsCarton')}</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ===== WHATSAPP CTA ===== */}
            <section className="bg-[#E31837] py-6 sm:py-10 w-full">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <span className="text-2xl sm:text-4xl">💬</span>
                        <div>
                            <h3 className="text-white font-bold text-base sm:text-lg">{t('homepage.whatsappTitle')}</h3>
                            <p className="text-red-100 text-xs sm:text-sm">{t('homepage.whatsappSubtitle')}</p>
                        </div>
                    </div>
                    <a
                        href="https://wa.me/9386042504"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 sm:px-6 py-2 sm:py-3 bg-white text-[#E31837] font-semibold hover:bg-gray-100 transition-colors text-xs sm:text-sm"
                    >
                        {t('homepage.whatsappCta')}
                    </a>
                </div>
            </section>

            {/* ===== FULL PRODUCT GRID ===== */}
            <div ref={productListRef} id="products-section">
                <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 w-full border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                            {t('homepage.allProducts')}
                        </h2>
                    </div>
                    <ProductList />
                </section>
            </div>
        </div>
    )
}