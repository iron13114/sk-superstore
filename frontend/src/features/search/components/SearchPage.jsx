import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, AlertCircle, Home } from 'lucide-react'
import { selectProducts, selectProductTotalResults, fetchProductsAsync } from '../../products/ProductSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { selectBrands } from '../../brands/BrandSlice'
import { ProductCard } from '../../products/components/ProductCard'

const getCatKey = (name) => name?.replace(/\s+/g, '_')?.replace(/[^a-zA-Z0-9_]/g, '') || 'unknown'

const QuickFilterChip = ({ label, active, onClick, count }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1.5 text-xs font-medium rounded-full border transition-all ${
      active 
        ? 'bg-[#E31837] text-white border-[#E31837]' 
        : 'bg-white text-gray-700 border-gray-200 hover:border-[#E31837] hover:text-[#E31837]'
    }`}
  >
    {label} {count !== undefined && <span className="opacity-70">({count})</span>}
  </button>
)

const FilterSection = ({
  title,
  children,
  open,
  onToggle,
}) => {
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-900"
      >
        {title}

        <ChevronDown
          size={14}
          className={`transition-transform ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden pb-3"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const FilterCheckbox = ({ label, count, checked, onChange }) => (
  <label className="flex items-center gap-2 py-1.5 cursor-pointer group">
    <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
      checked ? 'bg-[#0055A4] border-[#0055A4]' : 'border-gray-300 group-hover:border-[#0055A4]'
    }`}>
      {checked && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5"/></svg>}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
    <span className="text-sm text-gray-700 flex-1">{label}</span>
    {count !== undefined && <span className="text-xs text-gray-400">{count}</span>}
  </label>
)

const MobileFilterDrawer = ({ open, onClose, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose} className="fixed inset-0 bg-black/40 z-[400] md:hidden"
        />
        <motion.div
          initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="fixed right-0 top-0 h-full w-[85vw] max-w-sm bg-white z-[500] md:hidden overflow-y-auto"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-900">{children?.props?.title || 'Filters'}</h3>
            <button onClick={onClose}><X size={20} /></button>
          </div>
          <div className="p-4">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
)

const FilterContent = ({
  t,
  categories,
  brands,
  activeCategory,
  activeBrand,
  activePack,
  activeStock,
  packagingTiers,
  updateFilter,
  clearFilters,
  hasActiveFilters,
  openSections,
  toggleSection,
}) => (
  <div className="space-y-1">
    <FilterSection
      title={t('search.category')}
      open={openSections.category}
      onToggle={() => toggleSection('category')}
    >
      <div className="space-y-0.5 max-h-48 overflow-y-auto">
        {categories.map(cat => (
          <FilterCheckbox
            key={cat._id}
            label={t(`categories.${getCatKey(cat.name)}`, cat.name)}
            checked={activeCategory === cat._id}
            onChange={() =>
              updateFilter(
                'category',
                activeCategory === cat._id ? '' : cat._id
              )
            }
          />
        ))}
      </div>
    </FilterSection>

    <FilterSection
      title={t('search.brand')}
      open={openSections.brand}
      onToggle={() => toggleSection('brand')}
    >
      <div className="space-y-0.5 max-h-48 overflow-y-auto">
        {brands.map(b => (
          <FilterCheckbox
            key={b._id}
            label={b.name}
            checked={activeBrand === b._id}
            onChange={() =>
              updateFilter(
                'brand',
                activeBrand === b._id ? '' : b._id
              )
            }
          />
        ))}
      </div>
    </FilterSection>

    <FilterSection
      title={t('search.packagingTitle')}
      open={openSections.packaging}
      onToggle={() => toggleSection('packaging')}
    >
      {packagingTiers.map(tier => (
        <FilterCheckbox
          key={tier}
          label={t(`search.packaging.${tier}`)}
          checked={activePack === tier}
          onChange={() =>
            updateFilter(
              'pack',
              activePack === tier ? '' : tier
            )
          }
        />
      ))}
    </FilterSection>

    <FilterSection
      title={t('search.availability')}
      open={openSections.availability}
      onToggle={() => toggleSection('availability')}
    >
      <FilterCheckbox
        label={t('search.inStockOnly')}
        checked={activeStock === 'true'}
        onChange={() =>
          updateFilter(
            'stock',
            activeStock === 'true' ? '' : 'true'
          )
        }
      />
    </FilterSection>

    {hasActiveFilters && (
      <button
        onClick={clearFilters}
        className="w-full mt-4 py-2 text-sm text-[#E31837] font-medium border border-[#E31837]"
      >
        {t('search.clearAllFilters')}
      </button>
    )}
  </div>
)

export const SearchPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()

  const query = searchParams.get('q') || ''
  const activeCategory = searchParams.get('category') || ''
  const activeBrand = searchParams.get('brand') || ''
  const activePack = searchParams.get('pack') || ''
  const activeStock = searchParams.get('stock') || ''
  const sortBy = searchParams.get('sort') || 'relevance'
  const page = parseInt(searchParams.get('page') || '1', 10)

  const products = useSelector(selectProducts)
  const totalResults = useSelector(selectProductTotalResults)
  const categories = useSelector(selectCategories)
  const brands = useSelector(selectBrands)

  const [viewMode, setViewMode] = useState('grid') 
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(query)
  const [openSections, setOpenSections] = useState({
    category: true,
    brand: true,
    packaging: true,
    availability: true,
  })

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  useEffect(() => {
    setSearchInput(query)
  }, [query])

  const packagingTiers = ['single', 'pack', 'carton']

  const sortOptions = [
    { value: 'relevance', labelKey: 'search.sort.relevance' },
    { value: 'price-low', labelKey: 'search.sort.priceLow' },
    { value: 'price-high', labelKey: 'search.sort.priceHigh' },
    { value: 'stock', labelKey: 'search.sort.stock' }
  ]

  useEffect(() => {
    const filters = {}

    if (query) filters.search = query
    if (activeCategory) filters.category = activeCategory
    if (activeBrand) filters.brand = activeBrand
    if (activePack) filters.pack = activePack
    if (activeStock === 'true') filters.inStock = true

    filters.pagination = { page, limit: 12 }
    filters.sort = sortBy

    dispatch(fetchProductsAsync(filters))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [dispatch, query, activeCategory, activeBrand, activePack, activeStock, sortBy, page])

  const updateFilter = (key, value) => {
    const params = new URLSearchParams(searchParams)
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.set('page', '1') 
    setSearchParams(params)
  }

  const handleSearch = (e) => {
    e?.preventDefault?.()
    updateFilter('q', searchInput.trim())
  }

  const handleResetSearch = () => {
    setSearchInput('')
    updateFilter('q', '')
  }

  const clearFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    setSearchParams(params)
  }

  const hasActiveFilters = activeCategory || activeBrand || activePack || activeStock

  return (
    <div className="min-h-screen bg-white">
      {/* Search Bar Scoped CSS */}
      <style>{`
        .search-form {
          --timing: 0.3s;
          --height-of-input: 40px;
          --border-height: 2px;
          --input-bg: #f9fafb;
          --border-color: #0055A4;
          --border-radius: 30px;
          --after-border-radius: 6px;
          position: relative;
          width: 100%;
          height: var(--height-of-input);
          display: flex;
          align-items: center;
          padding-inline: 0.9em;
          border-radius: var(--border-radius);
          transition: border-radius 0.4s ease, background-color 0.2s ease;
          background: var(--input-bg, #fff);
          border: 1px solid #e5e7eb;
        }
        .search-form button {
          border: none;
          background: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .search-form button:hover {
          color: #111827;
        }
        .search-input {
          font-size: 0.875rem;
          background-color: transparent;
          width: 100%;
          height: 100%;
          padding-inline: 0.6em;
          border: none;
          color: #111827;
        }
        .search-input:focus {
          outline: none;
        }
        .search-form:before {
          content: "";
          position: absolute;
          background: var(--border-color);
          transform: scaleX(0);
          transform-origin: center;
          width: 100%;
          height: var(--border-height);
          left: 0;
          bottom: 0;
          border-radius: 1px;
          transition: transform var(--timing) ease;
        }
        .search-form:focus-within {
          border-radius: var(--after-border-radius);
          background-color: #ffffff;
          border-color: #d1d5db;
        }
        .search-form:focus-within:before {
          transform: scaleX(1);
        }
        .search-reset {
          border: none;
          background: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
        }
        .search-input:not(:placeholder-shown) ~ .search-reset {
          opacity: 1;
          visibility: visible;
        }
        .search-form svg {
          width: 17px;
          height: 17px;
        }
      `}</style>

      {/* Sticky Top Header */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            {/* Home Button */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
              title={t('nav.home', 'Home')}
              aria-label={t('nav.home', 'Home')}
            >
              <Home className="w-5 h-5 text-gray-700" />
            </button>

            {/* Integrated Animated Search Bar */}
            <div className="flex-1 min-w-0">
              <form onSubmit={handleSearch} className="search-form">
                {/* Search Submit Icon */}
                <button type="submit" aria-label="Search">
                  <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                    <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                {/* Search Input */}
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder={t('search.placeholder', 'Search SKSuperStore...')}
                  className="search-input"
                />

                {/* Clear / Reset Button */}
                <button 
                  className="search-reset" 
                  type="button"
                  onClick={handleResetSearch}
                  aria-label="Clear search"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Mobile Filters Toggle */}
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden p-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shrink-0"
              aria-label={t('search.filters')}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>

          {/* Quick Filter Chips */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
            <QuickFilterChip 
              label={t('search.all')} 
              active={!activePack} 
              onClick={() => updateFilter('pack', '')} 
            />
            {packagingTiers.map(tier => (
              <QuickFilterChip
                key={tier}
                label={t(`search.packaging.${tier}`)}
                active={activePack === tier}
                onClick={() => updateFilter('pack', activePack === tier ? '' : tier)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              {query ? t('search.resultsFor', { query }) : t('search.allProducts')}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {t('search.productsFound', { count: totalResults })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-lg pl-3 pr-8 py-2 text-sm focus:outline-none focus:border-[#0055A4]"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{t(opt.labelKey)}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="Grid view"
              >
                <Grid3X3 size={18} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <SlidersHorizontal size={16} /> {t('search.filters')}
              </h3>
              <FilterContent
                t={t}
                categories={categories}
                brands={brands}
                activeCategory={activeCategory}
                activeBrand={activeBrand}
                activePack={activePack}
                activeStock={activeStock}
                packagingTiers={packagingTiers}
                updateFilter={updateFilter}
                clearFilters={clearFilters}
                hasActiveFilters={hasActiveFilters}
                openSections={openSections}
                toggleSection={toggleSection}
              />            
            </div>
          </aside>

          <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
            <FilterContent
              t={t}
              categories={categories}
              brands={brands}
              activeCategory={activeCategory}
              activeBrand={activeBrand}
              activePack={activePack}
              activeStock={activeStock}
              packagingTiers={packagingTiers}
              updateFilter={updateFilter}
              clearFilters={clearFilters}
              hasActiveFilters={hasActiveFilters}
              openSections={openSections}
              toggleSection={toggleSection}
            />
          </MobileFilterDrawer>

          <main className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={28} className="text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{t('search.noProductsFound')}</h3>
                <p className="text-sm text-gray-500 mb-6 max-w-xs">
                  {t('search.noProductsDescription')}
                </p>
                {hasActiveFilters && (
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2 bg-[#E31837] text-white text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    {t('search.clearFilters')}
                  </button>
                )}
              </div>
            ) : (
              <>
                <motion.div 
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: { opacity: 1, transition: { staggerChildren: 0.06 } }
                  }}
                  className={viewMode === 'grid' 
                    ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" 
                    : "flex flex-col gap-3"
                  }
                >
                  {products.map((product) => {
                    const selectedTier = activePack
                      ? product.tiers?.find(t => t.type === activePack)
                      : null

                    const effectivePrice = selectedTier ? selectedTier.price : product.price
                    const effectiveStock = selectedTier ? selectedTier.stockQuantity : product.stockQuantity
                    const effectiveDiscount = selectedTier ? selectedTier.discountPercentage : product.discountPercentage
                    const tierLabel = selectedTier?.label || ''

                    return (
                      <motion.div
                        key={product._id}
                        variants={{
                          hidden: { opacity: 0, y: 20 },
                          visible: { opacity: 1, y: 0 }
                        }}
                      >
                        <ProductCard 
                          id={product._id}
                          title={product.title}
                          thumbnail={product.thumbnail}
                          brand={product.brand?.name || product.brand}
                          price={effectivePrice}
                          basePrice={product.price}           
                          stockQuantity={effectiveStock}
                          discountPercentage={effectiveDiscount}
                          reviews={product.reviews}
                          packagingTier={tierLabel}
                          viewMode={viewMode}
                        />
                      </motion.div>
                    )
                  })}
                </motion.div>
                {totalResults > 12 && (
                  <div className="flex items-center justify-center gap-2 mt-10">
                    <button
                      disabled={page === 1}
                      onClick={() => updateFilter('page', String(page - 1))}
                      className="px-4 py-2 border border-gray-200 text-sm disabled:opacity-40 hover:border-[#0055A4] hover:text-[#0055A4] transition-colors"
                    >
                      {t('search.previous')}
                    </button>
                    <span className="px-4 py-2 bg-[#0055A4] text-white text-sm font-medium">
                      {page}
                    </span>
                    <button
                      disabled={page * 12 >= totalResults}
                      onClick={() => updateFilter('page', String(page + 1))}
                      className="px-4 py-2 border border-gray-200 text-sm disabled:opacity-40 hover:border-[#0055A4] hover:text-[#0055A4] transition-colors"
                    >
                      {t('search.next')}
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}