import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BRAND_ROW_1 = [
  { name: "Parle", category: "Biscuits & Confectionery" },
  { name: "Britannia", category: "Biscuits & Dairy" },
  { name: "Lay's", category: "Snacks & Chips" },
  { name: "Kurkure", category: "Namkeen & Snacks" },
  { name: "ITC", category: "Atta & Tobacco" },
  { name: "Haldiram's", category: "Namkeen & Sweets" },
  { name: "Cadbury", category: "Chocolates" },
  { name: "Nestlé", category: "Dairy & Noodles" },
]

const BRAND_ROW_2 = [
  { name: "Hindustan Unilever", category: "Soaps & Detergents" },
  { name: "Surf Excel", category: "Detergents" },
  { name: "Tata Tea", category: "Beverages & Salt" },
  { name: "Colgate", category: "Oral Care" },
  { name: "Dabur", category: "Health & Personal Care" },
  { name: "Dettol", category: "Hygiene & Antiseptic" },
  { name: "Vim", category: "Dishwash" },
  { name: "Fortune", category: "Edible Oil & Grains" },
]

const BrandCard = ({ brand, onClick }) => (
  <button
    type="button"
    onClick={() => onClick(brand.name)}
    className="group flex flex-col items-center justify-center min-w-[125px] sm:min-w-[145px] h-[64px] sm:h-[72px] px-3 py-2 bg-white rounded-xl border border-gray-200/90 shadow-xs hover:border-[#0055A4] hover:shadow-sm transition-all duration-200 shrink-0 cursor-pointer text-left"
  >
    <span className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-wider group-hover:text-[#0055A4] transition-colors truncate max-w-full">
      {brand.name}
    </span>
    <span className="text-[10px] text-gray-600 font-semibold tracking-wide uppercase truncate max-w-full mt-0.5">
      {brand.category}
    </span>
  </button>
)

export const BrandsSection = () => {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const handleBrandClick = (brandName) => {
    navigate(`/search?q=${encodeURIComponent(brandName)}`)
  }

  const loopRow1 = [...BRAND_ROW_1, ...BRAND_ROW_1]
  const loopRow2 = [...BRAND_ROW_2, ...BRAND_ROW_2]

  return (
    <section className="w-full bg-gray-50/70 border-y border-gray-200 py-8 sm:py-12 overflow-hidden select-none">
      <style>{`
        @keyframes brand-marquee-left {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        @keyframes brand-marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0%); }
        }
        .animate-brand-left {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: brand-marquee-left 32s linear infinite;
        }
        .animate-brand-right {
          display: flex;
          gap: 12px;
          width: max-content;
          animation: brand-marquee-right 34s linear infinite;
        }
        .animate-brand-left:hover,
        .animate-brand-right:hover {
          animation-play-state: paused;
        }
      `}</style>

      {/* Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-6 sm:mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h3 className="text-xl sm:text-2xl md:text-3xl font-black text-[#0055A4] mt-2 tracking-tight">
            {t('homepage.brandsTitle', 'Brands We Stock')}
          </h3>
          <p className="text-xs sm:text-sm text-gray-700 mt-1 font-medium">
            {t('homepage.brandsSubtitle', 'Popular FMCG brands available for your shop at wholesale prices')}
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/search')}
          className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#0055A4] hover:text-[#003d7a] transition-colors"
        >
          <span>{t('homepage.viewAllBrands', 'Explore Catalog')}</span>
          <span>→</span>
        </button>
      </div>

      {/* Edge Blur Gradients */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        {/* Row 1: Leftward Scroll */}
        <div className="flex overflow-hidden mb-3">
          <div className="animate-brand-left">
            {loopRow1.map((brand, idx) => (
              <BrandCard
                key={`row1-${brand.name}-${idx}`}
                brand={brand}
                onClick={handleBrandClick}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Scroll */}
        <div className="flex overflow-hidden">
          <div className="animate-brand-right">
            {loopRow2.map((brand, idx) => (
              <BrandCard
                key={`row2-${brand.name}-${idx}`}
                brand={brand}
                onClick={handleBrandClick}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default BrandsSection