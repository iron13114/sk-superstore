import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'
import { FaWhatsapp } from 'react-icons/fa'
import { MdStorefront } from 'react-icons/md'
import { motion, AnimatePresence } from 'framer-motion'
import { selectProducts } from '../../products/ProductSlice'

const TrustBadge = ({ number, label }) => (
    <div className="text-center px-2 sm:px-4">
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0055A4]">{number}</div>
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1 uppercase tracking-wide">{label}</div>
    </div>
)

export const HeroSection = ({ featuredProducts = [], onShopNowClick }) => {
    const { t } = useTranslation()
    const navigate = useNavigate()

    // ─── CONNECT TO FULL DATABASE PRODUCT LIST ───
    const storeProducts = useSelector(selectProducts)
    
    // Use the full DB product catalog; fallback to prop if store is empty
    const allProducts = Array.isArray(storeProducts) && storeProducts.length > 0 
        ? storeProducts 
        : (Array.isArray(featuredProducts) ? featuredProducts : [])

    const total = allProducts.length

    // ─── CARD DECK STATE ───
    const [currentIndex, setCurrentIndex] = useState(0)
    const [exitDirection, setExitDirection] = useState(1)
    const hasDragged = useRef(false)

    // Circular rotation over the entire DB catalog
    const currentProduct = total > 0 ? allProducts[currentIndex % total] : null
    const nextProduct = total > 1 ? allProducts[(currentIndex + 1) % total] : null

    // ─── SWIPE THRESHOLDS ───
    const SWIPE_OFFSET = 80
    const SWIPE_VELOCITY = 500

    const handleCardClick = () => {
        if (hasDragged.current) return
        if (currentProduct?._id) navigate(`/product-details/${currentProduct._id}`)
    }

    const handleDragEnd = (_, info) => {
        const dir = info.offset.x >= 0 ? 1 : -1
        const shouldDismiss =
            Math.abs(info.offset.x) > SWIPE_OFFSET ||
            Math.abs(info.velocity.x) > SWIPE_VELOCITY

        if (shouldDismiss && total > 1) {
            setExitDirection(dir)
            setCurrentIndex((prev) => prev + 1)
        }

        setTimeout(() => { hasDragged.current = false }, 80)
    }

    const cardVariants = {
        hidden: (dir) => ({
            opacity: 0,
            scale: 0.92,
            x: dir === 0 ? 0 : -dir * 40,
            y: 12,
        }),
        visible: {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            rotate: 0,
            transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
        },
        exit: (dir) => ({
            x: dir * 350,
            rotate: dir * 16,
            opacity: 0,
            scale: 0.95,
            transition: { duration: 0.28, ease: 'easeIn' },
        }),
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.12, delayChildren: 0.1 },
        },
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
        },
    }

    return (
        <section className="bg-white border-b border-gray-200 w-full overflow-hidden">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center min-h-[420px] lg:min-h-[460px]">
                    
                    {/* LEFT COLUMN: Headings & Primary Actions */}
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="lg:col-span-7 flex flex-col items-start justify-center"
                    >
                        <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-black text-gray-900 tracking-tight mb-3 sm:mb-4 flex flex-col gap-2 leading-[1.1]">
                            <span>
                                {t('homepage.heroTitleLine1', 'Wholesale Prices.')}
                            </span>
                            <span className="text-[#0055A4]">
                                {t('homepage.heroTitleLine2', 'Retailer Margins.')}
                            </span>
                        </motion.h1>

                        <motion.p variants={itemVariants} className="text-gray-600 text-sm sm:text-base md:text-lg max-w-lg mb-6 leading-relaxed">
                            {t('homepage.heroSubtitle', 'Stock up on groceries, snacks & household essentials at direct distributor rates.')}
                        </motion.p>

                        <motion.div variants={itemVariants} className="flex flex-row items-center gap-2 sm:gap-3 w-auto flex-nowrap">
                            <button
                                type="button"
                                onClick={onShopNowClick}
                                className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#E31837] hover:bg-red-700 text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <MdStorefront className="text-sm sm:text-base shrink-0" />
                                <span>{t('homepage.heroCtaPrimary', 'Shop Now')}</span>
                            </button>

                            <a
                                href="https://www.google.com/maps/place/SK+General+Stores+Station+Road+Sakri/@26.2097846,86.079415,17z/data=!4m6!3m5!1s0x39edcf8ac7311eb7:0x6a769e37c40868b1!8m2!3d26.2096491!4d86.0784015!16s%2Fg%2F11h04fglsj?entry=ttu"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-[#0055A4] hover:bg-[#003d7a] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer whitespace-nowrap shrink-0 hover:-translate-y-0.5 active:translate-y-0"
                            >
                                <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                                <span>{t('homepage.shopLocation', 'Shop Location')}</span>
                            </a>
                        </motion.div>
                    </motion.div>

                    {/* RIGHT COLUMN: Visual Showcase Cards */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        className="lg:col-span-5 relative flex items-center justify-center py-6 lg:py-0"
                    >
                        <div className="absolute w-72 h-72 bg-blue-100/60 rounded-full blur-3xl -z-10" />

                        {/* Centered Anchor Container */}
                        <div className="relative w-[320px] sm:w-[360px] h-[340px] sm:h-[370px] flex items-center justify-center">
                            
                            {/* Pack Card (Left Background — Fixed Template) */}
                            <div className="absolute left-2 sm:left-4 bottom-8 w-36 sm:w-42 h-[220px] sm:h-[240px] bg-white p-2.5 sm:p-3 rounded-2xl border border-gray-200/80 shadow-md -rotate-8 transform transition-transform duration-300 pointer-events-none z-0 flex flex-col justify-between">
                                <div className="w-full h-32 sm:h-38 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden p-2">
                                    <img
                                        src={nextProduct?.thumbnail || '/kurkure-1000x1000.jpg'}
                                        alt={nextProduct?.title || 'Next product'}
                                        className="max-h-full max-w-full object-contain mix-blend-multiply"
                                    />
                                </div>
                                <div className="text-center mt-1">
                                    <span className="text-[9px] font-extrabold text-[#0055A4] uppercase tracking-widest block">
                                        {t('homepage.upNext', 'UP NEXT')}
                                    </span>
                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wide truncate">
                                        {nextProduct?.title || t('homepage.packOf12', 'Pack of 12')}
                                    </p>
                                </div>
                            </div>

                            {/* Master Carton Badge (Top Right Background — Fixed Template) */}
                            <div className="absolute right-2 sm:right-4 top-2 w-32 sm:w-36 bg-[#FFFBEB] border border-amber-200/90 p-2.5 rounded-2xl shadow-xs rotate-8 transform transition-transform duration-300 pointer-events-none z-0">
                                <div className="text-center">
                                    <span className="text-xl">📦</span>
                                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-wider mt-1">MASTER CARTON</p>
                                    <p className="text-[9px] text-amber-700 font-semibold">50 Units / Box</p>
                                </div>
                            </div>

                            {/* ─── CENTER PRODUCT CARD: Locked Dimensions & PopLayout (Never distorts) ─── */}
                            <AnimatePresence mode="popLayout" custom={exitDirection}>
                                {currentProduct && (
                                    <motion.div
                                        key={`${currentProduct._id || 'card'}-${currentIndex}`}
                                        custom={exitDirection}
                                        variants={cardVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        drag={total > 1 ? 'x' : false}
                                        dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                        dragElastic={0.65}
                                        dragMomentum={false}
                                        whileDrag={{ scale: 1.04 }}
                                        whileHover={{ scale: 1.02 }}
                                        onDragStart={() => { hasDragged.current = true }}
                                        onDragEnd={handleDragEnd}
                                        onClick={handleCardClick}
                                        style={{ touchAction: 'pan-y' }}
                                        className="absolute z-10 w-48 sm:w-54 h-[270px] sm:h-[300px] shrink-0 bg-white p-3 sm:p-3.5 rounded-2xl border border-gray-200 shadow-xl cursor-grab active:cursor-grabbing select-none flex flex-col justify-between"
                                    >
                                        {/* Product Image Area with Uniform Box */}
                                        <div className="w-full h-40 sm:h-46 bg-gray-50 rounded-xl flex items-center justify-center overflow-hidden p-2.5">
                                            <img
                                                src={currentProduct.thumbnail || '/kurkure-1000x1000.jpg'}
                                                alt={currentProduct.title || 'Wholesale Product'}
                                                className="max-h-full max-w-full object-contain pointer-events-none mix-blend-multiply"
                                                draggable={false}
                                            />
                                        </div>

                                        {/* Card Text & Wholesale Badge */}
                                        <div className="mt-2 flex items-center justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider truncate">
                                                    {currentProduct.title || t('homepage.new_arrivals')}
                                                </p>
                                                <p className="text-xs sm:text-sm font-bold text-gray-900 truncate">
                                                    {t('homepage.direct_distributor', 'प्रत्यक्ष वितरक')}
                                                </p>
                                            </div>
                                            <span className="text-xs sm:text-sm font-black text-[#0055A4] shrink-0">
                                                {t('homepage.wholesale', 'थोक')}
                                            </span>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Bulk Savings Pill */}
                            <div className="absolute -bottom-3 right-0 sm:right-2 z-20 bg-[#E31837] text-white px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 pointer-events-none">
                                <span className="text-xs font-black tracking-wide uppercase">
                                    {t('homepage.bulkSavingsBadge', '10–50% थोक बचत')}
                                </span>
                            </div>

                            {/* Swipe Hint */}
                            {total > 1 && (
                                <p className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 font-medium tracking-wide whitespace-nowrap pointer-events-none">
                                    {t('homepage.swipeHint', '← hold & swipe →')}
                                </p>
                            )}
                        </div>
                    </motion.div>

                </div>

                {/* BOTTOM TRUST STATS BAR */}
                <motion.div 
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.4 }}
                    className="border-t border-gray-100 mt-8 sm:mt-10 pt-6"
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
                        <TrustBadge number="500+" label={t('homepage.trustRetailers', 'Retailers Supplied')} />
                        <TrustBadge number="50+" label={t('homepage.trustBrands', 'FMCG Brands')} />
                        <TrustBadge number={t('homepage.trustDeliveryValue', 'Same Day')} label={t('homepage.trustDelivery', 'Fast Delivery')} />
                        <TrustBadge number="10–50%" label={t('homepage.trustSavings', 'Bulk Margin')} />
                    </div>
                </motion.div>
            </div>

            {/* FLOATING WHATSAPP BUTTON */}
            <a
                href="https://wa.me/919386042504?text=Namaste%2C%20mujhe%20SK%20Superstore%20se%20kuch%20samaan%20order%20karna%20hai"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Contact support on WhatsApp"
                className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white px-4 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group cursor-pointer border border-white/20"
            >
                <FaWhatsapp className="text-xl sm:text-2xl shrink-0" />
                <span className="text-xs sm:text-sm font-bold tracking-wide">
                    {t('homepage.whatsappHelp', 'Need help? Contact us')}
                </span>
            </a>
        </section>
    )
}

export default HeroSection