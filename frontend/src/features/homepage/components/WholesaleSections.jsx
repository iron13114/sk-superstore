import React from 'react'
import { useTranslation } from 'react-i18next'

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
)

export const WholesaleSections = () => {
    const { t } = useTranslation()

    return (
        <>
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
                    <span className="inline-block text-[11px] sm:text-xs uppercase font-bold tracking-widest text-blue-200 bg-white/10 px-3 py-1 rounded-full mb-3">
                        {t('homepage.wholesaleAdvantage', 'Wholesale Advantage')}
                    </span>

                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold uppercase tracking-tight mb-2">
                        {t('homepage.savingsTitle', 'Buy More, Save More')}
                    </h3>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base max-w-md mx-auto mb-8">
                        {t('homepage.savingsSubtitle', 'Exclusive tier pricing for every retailer')}
                    </p>

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

                    <p className="text-blue-100 text-xs sm:text-sm font-medium tracking-wide">
                        {t('homepage.savingsMarginNote', 'More quantity = better margin for your shop')}
                    </p>
                </div>
            </section>

            {/* ===== CATEGORY RIBBON / MARQUEE ===== */}
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 w-full py-1">
                <div className="relative border-y border-gray-200 py-3 overflow-hidden">
                    <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white to-transparent z-10 sm:hidden" />
                    <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white to-transparent z-10 sm:hidden" />

                    {/* Mobile: Infinite scrolling marquee */}
                    <div className="flex sm:hidden overflow-hidden select-none">
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

                    {/* Desktop: Centered strip */}
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

            {/* ===== WHATSAPP RESTOCK CTA ===== */}
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
        </>
    )
}

export default WholesaleSections