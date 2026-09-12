import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { fetchCategoryTreeAsync, selectCategoryTree } from '../../categories/CategoriesSlice'
import { fetchProductsAsync, selectProducts } from '../../products/ProductSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems, loadGuestWishlist, addGuestItem, removeGuestItem } from '../../wishlist/WishlistSlice'
import { ProductList } from '../../products/components/ProductList'
import { FaWhatsapp } from "react-icons/fa";
import { MdStorefront } from "react-icons/md";

const TrustBadge = ({ number, label }) => (
    <div className="text-center px-2 sm:px-4">
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0055A4]">{number}</div>
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1 uppercase tracking-wide">{label}</div>
    </div>
);

const StepCard = ({ step, imageSrc, title, desc, isLast }) => (
    <div className="flex flex-col items-center text-center relative group">
        {/* Step Number Badge */}
        <span className="text-[11px] sm:text-xs font-black tracking-widest text-[#0055A4] bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-full mb-3 shadow-xs">
            {step}
        </span>

        {/* Illustration Container */}
        <div className="w-full h-32 sm:h-36 flex items-center justify-center p-3 mb-3 bg-white rounded-xl border border-gray-100 shadow-sm group-hover:shadow-md transition-all duration-200 z-10">
            <img 
                src={imageSrc} 
                alt={title} 
                className="max-h-full max-w-full object-contain" 
            />
        </div>

        {/* Process Arrow between cards (Desktop only) */}
        {!isLast && (
            <div className="hidden md:flex absolute top-[52%] -right-4 -translate-y-1/2 translate-x-1/2 z-20 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-sm items-center justify-center text-gray-400 font-bold text-xs">
                →
            </div>
        )}

        {/* Title */}
        <h4 className="text-sm sm:text-base font-bold text-gray-900 tracking-wide uppercase">
            {title}
        </h4>

        {/* Description */}
        <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-[220px] leading-relaxed">
            {desc}
        </p>
    </div>
);

export const Homepage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
    
    const categoryTree = useSelector(selectCategoryTree)
    const products = useSelector(selectProducts)
    const wishlistItems = useSelector(selectWishlistItems)
    const loggedInUser = useSelector(selectLoggedInUser)
    const productListRef = useRef(null)
    const getCatKey = (name) =>
        name
            ?.toLowerCase()
            .replace(/&/g, 'and')
            .replace(/[^a-z0-9]+/g, '_')
            .replace(/^_+|_+$/g, '') || 'unknown'

    useEffect(() => {
        dispatch(fetchCategoryTreeAsync())
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

    const productList = Array.isArray(products) ? products : []
    const featuredProducts = productList.slice(0, 4)

    const safeTree = Array.isArray(categoryTree) ? categoryTree : []

    return (
        <div className="flex flex-col w-full bg-white">

            {/* ===== HERO SECTION ===== */}
            <section className="bg-white border-b border-gray-200 w-full overflow-hidden">
                <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[420px] lg:min-h-[460px]">                        
                        <div className="lg:col-span-7 flex flex-col items-start justify-center">
                            
                            {/* Wholesale Badge */}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-50 text-[#E31837] text-[11px] font-extrabold uppercase tracking-widest rounded-md mb-3 sm:mb-4 border border-red-100">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#E31837]" />
                                {t('homepage.heroBadge', 'Wholesale Only')}
                            </span>

                            {/* Headline tailored to shop owners */}
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black leading-[1.1] text-gray-900 tracking-tight mb-3 sm:mb-4">
                                <span>{t('homepage.heroTitleLine1', 'Wholesale Prices.')}</span>
                                <br />
                                <span className="text-[#0055A4]">{t('homepage.heroTitleLine2', 'Retailer Margins.')}</span>
                            </h1>

                            <p className="text-gray-600 text-sm sm:text-base md:text-lg max-w-lg mb-6 leading-relaxed">
                                {t('homepage.heroSubtitle', 'Stock up on groceries, snacks & household essentials at direct distributor rates.')}
                            </p>

                            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                                <button
                                    type="button"
                                    onClick={() => productListRef.current?.scrollIntoView({ behavior: 'smooth' })}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-[#E31837] hover:bg-red-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-sm transition-all duration-200 cursor-pointer"
                                >
                                    <MdStorefront size={16} />
                                    <span>{t('homepage.heroCtaPrimary', 'Shop Now')}</span>
                                </button>

                                <a
                                    href="https://wa.me/919386042504"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-5 py-3 border border-gray-300 hover:border-gray-900 bg-white text-gray-800 font-semibold text-xs sm:text-sm rounded-lg transition-colors cursor-pointer"
                                >
                                    <FaWhatsapp className="text-[#25D366] text-base" />
                                    <span>{t('homepage.heroCtaSecondary', 'Order on WhatsApp')}</span>
                                </a>

                                <a
                                    href="https://www.google.com/maps/place/SK+General+Stores+Station+Road+Sakri/@26.2097846,86.079415,17z/data=!4m6!3m5!1s0x39edcf8ac7311eb7:0x6a769e37c40868b1!8m2!3d26.2096491!4d86.0784015!16s%2Fg%2F11h04fglsj?entry=ttu"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-1.5 px-4 py-3 text-xs sm:text-sm font-medium text-gray-500 hover:text-[#0055A4] transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    <span>{t('homepage.shopLocation', 'Shop Location')}</span>
                                </a>
                            </div>

                        </div>

                        <div className="lg:col-span-5 relative flex items-center justify-center py-4 lg:py-0">
                            <div className="absolute w-72 h-72 bg-blue-100/60 rounded-full blur-3xl -z-10" />

                            <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[300px] sm:h-[340px] flex items-center justify-center">
                                <div className="absolute left-2 sm:left-4 bottom-10 w-36 sm:w-44 bg-white p-3 rounded-2xl border border-gray-200/80 shadow-md -rotate-6 transform hover:rotate-0 transition-transform duration-300">
                                    <div className="w-full h-32 sm:h-40 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden p-2">
                                        <img
                                            src={featuredProducts[1]?.thumbnail || '/kurkure-1000x1000.jpg'}
                                            alt="Bulk Snack Pack"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="mt-2 text-center">
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wide">Pack of 12</span>
                                    </div>
                                </div>

                                <div className="absolute right-2 sm:right-4 top-4 w-32 sm:w-36 bg-amber-50/90 border border-amber-200/80 p-2.5 rounded-xl shadow-xs rotate-6 transform hover:rotate-0 transition-transform duration-300">
                                    <div className="text-center">
                                        <span className="text-xl">📦</span>
                                        <p className="text-[10px] font-black text-amber-900 uppercase tracking-wider mt-1">Master Carton</p>
                                        <p className="text-[9px] text-amber-700 font-semibold">50 Units / Box</p>
                                    </div>
                                </div>

                                <div className="relative z-10 w-44 sm:w-52 bg-white p-3.5 rounded-2xl border border-gray-200 shadow-xl scale-105">
                                    <div className="w-full h-40 sm:h-48 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden p-2">
                                        <img
                                            src={featuredProducts[0]?.thumbnail || '/kurkure-1000x1000.jpg'}
                                            alt="Hero Wholesale Product"
                                            className="max-h-full max-w-full object-contain"
                                        />
                                    </div>
                                    <div className="mt-2 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] text-gray-400 font-medium">Bestseller</p>
                                            <p className="text-xs font-bold text-gray-900">Direct Distributor</p>
                                        </div>
                                        <span className="text-xs font-black text-[#0055A4]">Wholesale</span>
                                    </div>
                                </div>

                                <div className="absolute -bottom-3 right-0 sm:right-2 z-20 bg-[#E31837] text-white px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5">
                                    <span className="text-xs font-black tracking-wide uppercase">
                                        {t('homepage.bulkSavingsBadge', '10–50% Bulk Savings')}
                                    </span>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className="border-t border-gray-100 mt-8 sm:mt-10 pt-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                            <TrustBadge number="500+" label={t('homepage.trustRetailers', 'Retailers Supplied')} />
                            <TrustBadge number="50+" label={t('homepage.trustBrands', 'FMCG Brands')} />
                            <TrustBadge number={t('homepage.trustDeliveryValue', 'Same Day')} label={t('homepage.trustDelivery', 'Fast Delivery')} />
                            <TrustBadge number="10–50%" label={t('homepage.trustSavings', 'Bulk Margin')} />
                        </div>
                    </div>

                </div>
            </section>

            {/* ===== CATEGORY GROUPS ===== */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10 w-full">
                {safeTree.length > 0 ? (
                    safeTree.map((parent) => (
                        <div key={parent._id} className="mb-8 sm:mb-10">
                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-5">
                                {t(`categories.${getCatKey(parent.name)}`, parent.name)}
                            </h2>

                            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2 sm:gap-3 md:gap-4">
                                {(parent.children || []).map((child) => (
                                    <button
                                        key={child._id}
                                        onClick={() => handleCategoryClick(child._id)}
                                        className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-pointer"
                                    >
                                        {/* Icon/image tile */}
                                        <div className="w-full aspect-square rounded-xl bg-[#f4f6f8] overflow-hidden flex items-center justify-center p-2 sm:p-3 transition-shadow duration-200 group-hover:shadow-md">
                                            {child.image ? (
                                                <img
                                                    src={child.image}
                                                    alt={t(`categories.${getCatKey(child.name)}`, child.name)}
                                                    className="w-full h-full object-contain"
                                                    loading="lazy"
                                                />
                                            ) : (
                                                <span className="text-2xl sm:text-3xl md:text-4xl select-none">
                                                    {t(`categories.${getCatKey(child.name)}_icon`, child.icon || '📦')}
                                                </span>
                                            )}
                                        </div>

                                        <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-900 text-center leading-tight line-clamp-2">
                                            {t(`categories.${getCatKey(child.name)}`, child.name)}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400 text-sm py-8">
                        {t('categories.noCategoriesFound', 'No categories found')}
                    </p>
                )}
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
                        <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    id={product._id}
                                    title={product.title}
                                    thumbnail={product.thumbnail}
                                    brand={product.brand?.name || product.brand}
                                    price={product.price}
                                    stockQuantity={product.stockQuantity}
                                    reviews={product.reviews} 
                                    handleAddRemoveFromWishlist={handleAddRemoveFromWishlist}
                                />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ===== HOW WHOLESALE WORKS ===== */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-10 sm:py-16 w-full border-t border-gray-200">
                <div className="text-center mb-8 sm:mb-12">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2">
                        {t('homepage.howItWorksTitle') || 'How Wholesale Works'}
                    </h2>
                    <p className="text-gray-500 text-xs sm:text-sm">
                        {t('homepage.howItWorksSubtitle') || 'Three simple steps to stock your shop'}
                    </p>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Connecting gradient line */}
                    <div 
                        className="hidden md:block absolute top-[52%] -translate-y-1/2 left-[12%] right-[12%] h-[2px] bg-gradient-to-r from-[#E31837] via-[#0055A4] to-[#16a34a] z-0" 
                        aria-hidden="true"
                    />

                    {/* Step Cards Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-6 relative z-10">
                        <StepCard 
                            step="01" 
                            imageSrc="/undraw_add-to-cart_vx87.png" 
                            title={t('homepage.step1Title') || 'BROWSE'} 
                            desc={t('homepage.step1Desc') || '1000+ products across all major brands'} 
                            isLast={false} 
                        />
                        <StepCard 
                            step="02" 
                            imageSrc="/Checking boxes-amico.png" 
                            title={t('homepage.step2Title') || 'BULK ORDER'} 
                            desc={t('homepage.step2Desc') || 'Pack of 10 or Carton of 50'} 
                            isLast={false} 
                        />
                        <StepCard 
                            step="03" 
                            imageSrc="/undraw_delivery-truck_mjui.png" 
                            title={t('homepage.step3Title') || 'DELIVERED'} 
                            desc={t('homepage.step3Desc') || 'Same-day delivery in Sakri & nearby areas'} 
                            isLast={true} 
                        />
                    </div>
                </div>
            </section>

            {/* ===== BULK SAVINGS & TIER PRICING BANNER ===== */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 w-full">
                <div className="bg-[#0055A4] text-white rounded-2xl py-10 px-4 sm:py-14 sm:px-8 shadow-sm text-center relative overflow-hidden">
                    
                    {/* Badge */}
                    <span className="inline-block text-[11px] sm:text-xs uppercase font-bold tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full mb-3">
                        {t('homepage.wholesaleAdvantage', 'Wholesale Advantage')}
                    </span>

                    {/* Title & Subtitle */}
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-2">
                        {t('homepage.savingsTitle', 'Buy More, Save More')}
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-md mx-auto mb-8">
                        {t('homepage.savingsSubtitle', 'Exclusive tier pricing for every retailer')}
                    </p>

                    {/* Prominent Tier Cards */}
                    <div className="grid grid-cols-2 gap-4 sm:gap-6 max-w-md sm:max-w-lg mx-auto mb-6">
                        {/* 5% Tier */}
                        <div className="bg-white text-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border border-white/60 flex flex-col items-center justify-center transition-transform hover:-translate-y-1 duration-200">
                            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0055A4]">
                                5% <span className="text-xs sm:text-sm font-bold text-gray-500">{t('homepage.off', 'OFF')}</span>
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-gray-800 tracking-wider uppercase mt-1">
                                {t('homepage.savingsPack', 'Pack of 10')}
                            </span>
                        </div>

                        {/* 10% Tier */}
                        <div className="bg-white text-gray-900 rounded-2xl p-4 sm:p-6 shadow-sm border-2 border-amber-300 relative flex flex-col items-center justify-center transition-transform hover:-translate-y-1 duration-200">
                            <span className="absolute -top-2.5 px-2.5 py-0.5 bg-[#E31837] text-white text-[9px] sm:text-[10px] font-extrabold uppercase rounded-full tracking-wider shadow-xs">
                                {t('homepage.bestMargin', 'Best Margin')}
                            </span>
                            <span className="text-2xl sm:text-3xl md:text-4xl font-black text-[#0055A4]">
                                10% <span className="text-xs sm:text-sm font-bold text-gray-500">{t('homepage.off', 'OFF')}</span>
                            </span>
                            <span className="text-[11px] sm:text-xs font-bold text-gray-800 tracking-wider uppercase mt-1">
                                {t('homepage.savingsCarton', 'Carton of 50')}
                            </span>
                        </div>
                    </div>

                    {/* Margin Notice */}
                    <p className="text-blue-100 text-xs sm:text-sm font-medium tracking-wide">
                        {t('homepage.savingsMarginNote', 'More quantity = better margin for your shop')}
                    </p>
                </div>
            </section>

            {/* ===== CATEGORY RIBBON / DIVIDER ===== */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full py-1">
                <div className="relative border-y border-gray-200 py-3 overflow-hidden">

                    {/* Left & Right Edge Fades (Mobile only) */}
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 sm:hidden" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden" />

                    {/* 1. MOBILE ONLY: Continuous Auto-Scrolling Marquee */}
                    <div className="flex sm:hidden overflow-hidden select-none">
                        {/* Scoped CSS animation to guarantee smooth infinite scroll without tailwind.config changes */}
                        <style>{`
                            @keyframes ribbon-marquee {
                                0% { transform: translateX(0%); }
                                100% { transform: translateX(-100%); }
                            }
                            .animate-ribbon {
                                display: flex;
                                flex-shrink: 0;
                                align-items: center;
                                animation: ribbon-marquee 25s linear infinite;
                            }
                        `}</style>

                        {/* Track 1 */}
                        <div className="animate-ribbon gap-4 pr-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                            <span>{t('categories.chips', 'Chips')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.namkeen', 'Namkeen')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.biscuits', 'Biscuits')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.grocery', 'Grocery')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.snacks', 'Snacks')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.chips', 'Chips')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.namkeen', 'Namkeen')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.biscuits', 'Biscuits')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.grocery', 'Grocery')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.snacks', 'Snacks')}</span>
                            <span className="text-gray-300">•</span>
                        </div>

                        {/* Track 2 (Seamless loop clone) */}
                        <div aria-hidden="true" className="animate-ribbon gap-4 pr-4 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                            <span>{t('categories.chips', 'Chips')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.namkeen', 'Namkeen')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.biscuits', 'Biscuits')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.grocery', 'Grocery')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.snacks', 'Snacks')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.chips', 'Chips')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.namkeen', 'Namkeen')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.biscuits', 'Biscuits')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.grocery', 'Grocery')}</span>
                            <span className="text-gray-300">•</span>
                            <span>{t('categories.snacks', 'Snacks')}</span>
                            <span className="text-gray-300">•</span>
                        </div>
                    </div>

                    {/* 2. DESKTOP ONLY: Centered Static Strip */}
                    <div className="hidden sm:flex items-center justify-center gap-6 text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap select-none">
                        <span className="text-gray-400">←</span>
                        <span>{t('categories.chips', 'Chips')}</span>
                        <span className="text-gray-300">•</span>
                        <span>{t('categories.namkeen', 'Namkeen')}</span>
                        <span className="text-gray-300">•</span>
                        <span>{t('categories.biscuits', 'Biscuits')}</span>
                        <span className="text-gray-300">•</span>
                        <span>{t('categories.grocery', 'Grocery')}</span>
                        <span className="text-gray-300">•</span>
                        <span>{t('categories.snacks', 'Snacks')}</span>
                        <span className="text-gray-400">→</span>
                    </div>

                </div>
            </div>

            {/* ===== WHATSAPP RESTOCK CTA (CONTAINED CARD: RED RESERVED FOR CTA) ===== */}
            <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
                <div className="bg-white rounded-2xl border border-gray-200 p-5 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div className="flex items-center gap-4 text-center sm:text-left">
                        <span className="text-3xl sm:text-4xl shrink-0 p-2.5 bg-red-50 rounded-2xl">
                            💬
                        </span>
                        <div>
                            <h3 className="text-gray-900 font-bold text-base sm:text-xl">
                                {t('homepage.whatsappTitle') || 'Ready to restock?'}
                            </h3>
                            <p className="text-gray-500 text-xs sm:text-sm mt-0.5">
                                {t('homepage.whatsappSubtitle') || 'Order directly on WhatsApp'}
                            </p>
                        </div>
                    </div>

                    {/* Red Action Accent */}
                    <a
                        href="https://wa.me/9386042504"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#E31837] hover:bg-red-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-xs transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
                    >
                        <span>{t('homepage.whatsappCta') || 'Chat Now'}</span>
                        <span className="text-base leading-none">→</span>
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