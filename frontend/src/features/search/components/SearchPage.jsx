import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, Search, AlertCircle } from 'lucide-react'
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

const FilterSection = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-gray-100 last:border-0">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-3 text-sm font-semibold text-gray-900"
      >
        {title}
        <ChevronDown size={14} className={`transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
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

export const SearchPage = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { t } = useTranslation()
  
  const products = useSelector(selectProducts)
  const totalResults = useSelector(selectProductTotalResults)
  const categories = useSelector(selectCategories)
  const brands = useSelector(selectBrands)
  
  const [viewMode, setViewMode] = useState('grid') 
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  
  const query = searchParams.get('q') || ''
  const activeCategory = searchParams.get('category') || ''
  const activeBrand = searchParams.get('brand') || ''
  const activePack = searchParams.get('pack') || ''
  const activeStock = searchParams.get('stock') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  
  const [searchInput, setSearchInput] = useState(query)
  
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
    
    // Send 'search' because most existing API wrappers expect it
    if (query) filters.search = query
    if (activeCategory) filters.category = activeCategory
    if (activeBrand) filters.brand = activeBrand
    // Send 'pack' because the URL uses 'pack' and the API layer usually forwards it blindly
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
  
  const handleSearch = () => {
    updateFilter('q', searchInput.trim())
  }
  
  const clearFilters = () => {
    const params = new URLSearchParams()
    if (query) params.set('q', query)
    setSearchParams(params)
  }
  
  const hasActiveFilters = activeCategory || activeBrand || activePack || activeStock
  
  const FilterContent = () => (
    <div className="space-y-1">
      <FilterSection title={t('search.category')}>
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {categories.map(cat => (
            <FilterCheckbox
              key={cat._id}
              label={t(`categories.${getCatKey(cat.name)}`, cat.name)}
              checked={activeCategory === cat._id}
              onChange={() => updateFilter('category', activeCategory === cat._id ? '' : cat._id)}
            />
          ))}
        </div>
      </FilterSection>
      
      <FilterSection title={t('search.brand')}>
        <div className="space-y-0.5 max-h-48 overflow-y-auto">
          {brands.map(b => (
            <FilterCheckbox
              key={b._id}
              label={b.name}
              checked={activeBrand === b._id}
              onChange={() => updateFilter('brand', activeBrand === b._id ? '' : b._id)}
            />
          ))}
        </div>
      </FilterSection>
      
      <FilterSection title={t('search.packagingTitle')}>
        {packagingTiers.map(tier => (
          <FilterCheckbox
            key={tier}
            label={t(`search.packaging.${tier}`)}
            checked={activePack === tier}
            onChange={() => updateFilter('pack', activePack === tier ? '' : tier)}
          />
        ))}
      </FilterSection>
      
      <FilterSection title={t('search.availability')}>
        <FilterCheckbox
          label={t('search.inStockOnly')}
          checked={activeStock === 'true'}
          onChange={() => updateFilter('stock', activeStock === 'true' ? '' : 'true')}
        />
      </FilterSection>
      
      {hasActiveFilters && (
        <button 
          onClick={clearFilters}
          className="w-full mt-4 py-2 text-sm text-[#E31837] font-medium border border-[#E31837] hover:bg-red-50 transition-colors"
        >
          {t('search.clearAllFilters')}
        </button>
      )}
    </div>
  )
  
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={t('search.placeholder')}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#0055A4] focus:ring-1 focus:ring-[#0055A4]"
              />
            </div>
            
            <button 
              onClick={handleSearch}
              className="hidden sm:flex px-4 py-2.5 bg-[#0055A4] text-white text-sm font-medium rounded-lg hover:bg-[#004080] transition-colors items-center gap-2"
            >
              <Search size={16} />
              {t('search.searchBtn', 'Search')}
            </button>
            
            <button 
              onClick={handleSearch}
              className="sm:hidden p-2.5 bg-[#0055A4] text-white rounded-lg"
              aria-label={t('search.searchBtn', 'Search')}
            >
              <Search size={18} />
            </button>
            
            <button 
              onClick={() => setMobileFiltersOpen(true)}
              className="md:hidden p-2.5 border border-gray-200 rounded-lg"
              aria-label={t('search.filters')}
            >
              <SlidersHorizontal size={18} />
            </button>
          </div>
          
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
              <FilterContent />
            </div>
          </aside>
          
          <MobileFilterDrawer open={mobileFiltersOpen} onClose={() => setMobileFiltersOpen(false)}>
            <FilterContent />
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
                <div className={viewMode === 'grid' 
                  ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4" 
                  : "flex flex-col gap-3"
                }>
                  {products.map(product => {
                    // Compute tier price: if a pack is selected and the product has that tier price, use it
                    const effectivePrice = activePack && product.prices?.[activePack]
                      ? product.prices[activePack]
                      : product.price
                    
                    return (
                      <ProductCard 
                        key={product._id}
                        id={product._id}
                        title={product.title}
                        thumbnail={product.thumbnail}
                        brand={product.brand?.name || product.brand}
                        price={effectivePrice}
                        stockQuantity={product.stockQuantity}
                        reviews={product.reviews}
                        packagingTier={product.packagingTier}
                        viewMode={viewMode}
                      />
                    )
                  })}
                </div>
                
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