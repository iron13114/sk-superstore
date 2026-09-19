import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaWhatsapp } from 'react-icons/fa'
import { MdStorefront } from 'react-icons/md'
import { motion } from 'framer-motion'

const TrustBadge = ({ number, label }) => (
    <div className="text-center px-2 sm:px-4">
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-[#0055A4]">{number}</div>
        <div className="text-[10px] sm:text-xs md:text-sm text-gray-600 font-medium mt-1 uppercase tracking-wide">{label}</div>
    </div>
)

export const HeroSection = ({ featuredProducts = [], onShopNowClick }) => {
    const { t } = useTranslation()

    // Smooth staggered container
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.12,
                delayChildren: 0.1,
            },
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
                        className="lg:col-span-5 relative flex items-center justify-center py-4 lg:py-0"
                    >
                        <div className="absolute w-72 h-72 bg-blue-100/60 rounded-full blur-3xl -z-10" />

                        <div className="relative w-full max-w-[340px] sm:max-w-[380px] h-[300px] sm:h-[340px] flex items-center justify-center">
                            {/* Pack Card */}
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

                            {/* Master Carton Badge */}
                            <div className="absolute right-2 sm:right-4 top-4 w-32 sm:w-36 bg-amber-50/90 border border-amber-200/80 p-2.5 rounded-xl shadow-xs rotate-6 transform hover:rotate-0 transition-transform duration-300">
                                <div className="text-center">
                                    <span className="text-xl">📦</span>
                                    <p className="text-[10px] font-black text-amber-900 uppercase tracking-wider mt-1">Master Carton</p>
                                    <p className="text-[9px] text-amber-700 font-semibold">50 Units / Box</p>
                                </div>
                            </div>

                            {/* Center Product Card */}
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

                            {/* Bulk Savings Pill */}
                            <div className="absolute -bottom-3 right-0 sm:right-2 z-20 bg-[#E31837] text-white px-3.5 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5">
                                <span className="text-xs font-black tracking-wide uppercase">
                                    {t('homepage.bulkSavingsBadge', '10–50% Bulk Savings')}
                                </span>
                            </div>
                        </div>
                    </motion.div>

                </div>

                {/* BOTTOM TRUST STATS BAR (Scroll fade) */}
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

            {/* FLOATING WHATSAPP BUTTON (With message pre-fill) */}
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