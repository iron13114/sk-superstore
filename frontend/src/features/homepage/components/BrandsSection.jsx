import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const BRAND_ROW_1 = [
  { name: "Parle", category: "Biscuits & Confectionery", image: "https://images.seeklogo.com/logo-png/19/1/parle-products-logo-png_seeklogo-190622.png" },
  { name: "Britannia", category: "Biscuits & Dairy", image: "https://images.seeklogo.com/logo-png/38/1/britannia-industries-logo-png_seeklogo-386970.png" },
  { name: "Lay's", category: "Snacks & Chips", image: "https://images.seeklogo.com/logo-png/36/1/lays-logo-png_seeklogo-361761.png" },
  { name: "Anmol", category: "Snacks & Cake", image: "https://www.anmolindustries.com/wp-content/uploads/2024/08/202408_Anmol_Logo__175.png" },
  { name: "ITC", category: "Atta & Tobacco", image: "https://images.seeklogo.com/logo-png/7/1/itc-limited-logo-png_seeklogo-74137.png" },
  { name: "Haldiram's", category: "Namkeen & Sweets", image: "https://images.seeklogo.com/logo-png/62/1/haldiram-products-logo-png_seeklogo-624692.png" },
  { name: "Cadbury", category: "Chocolates", image: "https://images.seeklogo.com/logo-png/2/1/cadbury-logo-png_seeklogo-24483.png" },
  { name: "Nestlé", category: "Dairy & Noodles", image: "https://images.seeklogo.com/logo-png/9/1/nestle-logo-png_seeklogo-98328.png" },
]

const BRAND_ROW_2 = [
  { name: "Hindustan Unilever", category: "HUL", image: "https://images.seeklogo.com/logo-png/30/1/hindustan-uniliver-limited-logo-png_seeklogo-304694.png" },
  { name: "Surf Excel", category: "Detergents", image: "https://images.seeklogo.com/logo-png/18/1/surf-excel-logo-png_seeklogo-183137.png" },
  { name: "Patanjali", category: "Patanjali", image: "https://images.seeklogo.com/logo-png/27/1/patanjali-logo-png_seeklogo-271537.png" },
  { name: "Colgate", category: "Oral Care", image: "https://images.seeklogo.com/logo-png/49/1/colgate-logo-png_seeklogo-499100.png" },
  { name: "Dabur", category: "Health & Personal Care", image: "https://images.seeklogo.com/logo-png/24/1/dabur-logo-png_seeklogo-247892.png" },
  { name: "Dettol", category: "Hygiene & Antiseptic", image: "https://images.seeklogo.com/logo-png/60/1/dettol-hygiene-soap-wipes-uganda-logo-png_seeklogo-609995.png" },
  { name: "Boss", category: "Boss", image: "https://cdn.shopify.com/s/files/1/0684/1411/1922/files/bossfood-logo_bdc8d734-9d0a-4830-b174-5629d660cc89.png?width=300" },
  { name: "Bikaji", category: "Snacks", image: "https://images.seeklogo.com/logo-png/30/1/bikaji-logo-png_seeklogo-304700.png" },
  { name: "Parfetti", category: "Snacks", image: "https://thumb.wikimedia.org/wikipedia/commons/thumb/6/60/Perfetti_Van_Melle_logo.svg/1280px-Perfetti_Van_Melle_logo.svg.png?utm_source=en.wikipedia.org&utm_campaign=index&utm_content=thumbnail" },
]

const BrandCard = ({ brand, onClick }) => {
  const [imageFailed, setImageFailed] = useState(false)
  const hasImage = Boolean(brand.image && !imageFailed)

  return (
    <button
      type="button"
      onClick={() => onClick(brand.name)}
      className="group flex flex-col items-center justify-center min-w-[130px] sm:min-w-[150px] h-[64px] sm:h-[72px] px-3 py-2 bg-white rounded-xl border border-gray-200/90 shadow-xs hover:border-[#0055A4] hover:shadow-sm transition-all duration-200 shrink-0 cursor-pointer text-center overflow-hidden"
    >
      {hasImage ? (
        <img
          src={brand.image}
          alt={brand.name}
          onError={() => setImageFailed(true)}
          className="max-h-[46px] sm:max-h-[52px] max-w-[105px] sm:max-w-[125px] w-auto h-auto object-contain group-hover:scale-105 transition-transform duration-200 pointer-events-none"
          loading="lazy"
        />
      ) : (
        <>
          <span className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-wider group-hover:text-[#0055A4] transition-colors truncate max-w-full">
            {brand.name}
          </span>
          <span className="text-[10px] text-gray-600 font-semibold tracking-wide uppercase truncate max-w-full mt-0.5">
            {brand.category}
          </span>
        </>
      )}
    </button>
  )
}

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

      {/* Section Header */}
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

      {/* Marquee Carousel with Fade Edges */}
      <div className="relative w-full">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-r from-gray-50 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 sm:w-28 bg-gradient-to-l from-gray-50 to-transparent z-10" />

        {/* Row 1: Leftward Infinite Scroll */}
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

        {/* Row 2: Rightward Infinite Scroll */}
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