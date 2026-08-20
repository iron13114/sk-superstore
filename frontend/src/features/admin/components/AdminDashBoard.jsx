import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { ProductCard } from '../../products/components/ProductCard'
import { deleteProductByIdAsync, fetchProductsAsync, selectProductIsFilterOpen, selectProductTotalResults, selectProducts, toggleFilters, undeleteProductByIdAsync } from '../../products/ProductSlice'
import { ITEMS_PER_PAGE } from '../../../constants'

const sortOptions = [
  { name: "Price: low to high", sort: "price", order: "asc" },
  { name: "Price: high to low", sort: "price", order: "desc" },
]

const useMediaQuery = (query) => {
  const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const media = window.matchMedia(query)
    const listener = (e) => setMatches(e.matches)
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [query])
  return matches
}

export const AdminDashBoard = () => {
  const { t } = useTranslation()
  const [filters, setFilters] = useState({})
  const brands = useSelector(selectBrands)
  const categories = useSelector(selectCategories)
  const [sort, setSort] = useState(null)
  const [page, setPage] = useState(1)
  const products = useSelector(selectProducts)
  const dispatch = useDispatch()
  const is500 = useMediaQuery('(max-width: 500px)')
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen)
  const totalResults = useSelector(selectProductTotalResults)
  const is600 = useMediaQuery('(max-width: 600px)')
  const is488 = useMediaQuery('(max-width: 488px)')
  
  const [brandOpen, setBrandOpen] = useState(true)
  const [categoryOpen, setCategoryOpen] = useState(true)

  useEffect(() => {
    setPage(1)
  }, [totalResults])

  useEffect(() => {
    const finalFilters = { ...filters }
    finalFilters['pagination'] = { page: page, limit: ITEMS_PER_PAGE }
    finalFilters['sort'] = sort
    dispatch(fetchProductsAsync(finalFilters))
  }, [filters, page, sort, dispatch])

  const handleBrandFilters = (e) => {
    const filterSet = new Set(filters.brand)
    if (e.target.checked) { filterSet.add(e.target.value) }
    else { filterSet.delete(e.target.value) }
    const filterArray = Array.from(filterSet)
    setFilters({ ...filters, brand: filterArray })
  }

  const handleCategoryFilters = (e) => {
    const filterSet = new Set(filters.category)
    if (e.target.checked) { filterSet.add(e.target.value) }
    else { filterSet.delete(e.target.value) }
    const filterArray = Array.from(filterSet)
    setFilters({ ...filters, category: filterArray })
  }

  const handleProductDelete = (productId) => {
    dispatch(deleteProductByIdAsync(productId))
  }

  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync(productId))
  }

  const handleFilterClose = () => {
    dispatch(toggleFilters())
  }

  const totalPages = Math.ceil(totalResults / ITEMS_PER_PAGE)
  const fromResult = (page - 1) * ITEMS_PER_PAGE + 1
  const toResult = page * ITEMS_PER_PAGE > totalResults ? totalResults : page * ITEMS_PER_PAGE

  return (
    <>
      {/* Filter Sidebar */}
      <motion.div
        className="fixed top-0 h-screen bg-white z-[500] overflow-y-auto p-4 shadow-xl"
        style={{ width: is500 ? '100vw' : '30rem' }}
        initial={{ x: is500 ? '-100vw' : '-30rem' }}
        animate={{ x: isProductFilterOpen ? 0 : (is500 ? '-100vw' : '-30rem') }}
        transition={{ ease: "easeInOut", duration: 0.7, type: "spring" }}
      >
        <div className="mb-20">
          {/* Brand Filters */}
          <div className="mt-4 border border-gray-200">
            <button
              onClick={() => setBrandOpen(!brandOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">{t('productList.brands')}</span>
              <motion.svg 
                animate={{ rotate: brandOpen ? 45 : 0 }}
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {brandOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-2">
                    {brands?.map((brand) => (
                      <motion.label 
                        key={brand._id}
                        className="flex items-center gap-2 cursor-pointer w-fit"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <input
                          type="checkbox"
                          value={brand._id}
                          onChange={handleBrandFilters}
                          className="w-4 h-4 accent-[#0055A4] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{brand.name}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Category Filters */}
          <div className="mt-4 border border-gray-200">
            <button
              onClick={() => setCategoryOpen(!categoryOpen)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium">{t('productList.category')}</span>
              <motion.svg 
                animate={{ rotate: categoryOpen ? 45 : 0 }}
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </motion.svg>
            </button>
            <AnimatePresence>
              {categoryOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-3 space-y-2">
                    {categories?.map((category) => (
                      <motion.label 
                        key={category._id}
                        className="flex items-center gap-2 cursor-pointer w-fit"
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <input
                          type="checkbox"
                          value={category._id}
                          onChange={handleCategoryFilters}
                          className="w-4 h-4 accent-[#0055A4] cursor-pointer"
                        />
                        <span className="text-sm text-gray-700">{category.name}</span>
                      </motion.label>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className={`flex flex-col gap-5 ${is600 ? 'mt-2' : 'mt-5'} mb-12`}>
        
        {/* Sort Options */}
        <div className="flex justify-end items-center mr-8 gap-5">
          <div className="w-48">
            <label className="block text-xs text-gray-500 mb-1">{t('productList.sort')}</label>
            <select
              value={sort ? JSON.stringify(sort) : ''}
              onChange={(e) => setSort(e.target.value ? JSON.parse(e.target.value) : null)}
              className="w-full px-3 py-2 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#0055A4] focus:border-[#0055A4] bg-white"
            >
              <option value="">{t('productList.reset')}</option>
              {sortOptions.map((option) => (
                <option key={option.name} value={JSON.stringify(option)}>{option.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="flex flex-wrap justify-center gap-4 content-center">
          {products.map((product) => (
            <div key={product._id} className="flex flex-col">
              <div className={product.isDeleted ? 'opacity-70' : 'opacity-100'}>
                <ProductCard 
                  id={product._id} 
                  title={product.title} 
                  thumbnail={product.thumbnail} 
                  brand={product.brand?.name || product.brand} 
                  price={product.price} 
                  isAdminCard={true}
                />
              </div>
              <div className={`flex justify-end self-end px-2 mt-2 ${is488 ? 'gap-1' : 'gap-2'}`}>
                <Link
                  to={`/admin/product-update/${product._id}`}
                  className="px-4 py-1.5 bg-[#111827] text-white text-xs font-medium hover:bg-gray-800 transition-colors"
                >
                  {t('adminDashboard.update') || 'Update'}
                </Link>
                {product.isDeleted === true ? (
                  <button
                    onClick={() => handleProductUnDelete(product._id)}
                    className="px-4 py-1.5 border border-[#E31837] text-[#E31837] text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    {t('adminDashboard.undelete') || 'Un-delete'}
                  </button>
                ) : (
                  <button
                    onClick={() => handleProductDelete(product._id)}
                    className="px-4 py-1.5 border border-[#E31837] text-[#E31837] text-xs font-medium hover:bg-red-50 transition-colors"
                  >
                    {t('adminDashboard.delete') || 'Delete'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className={`flex flex-col gap-2 ${is488 ? 'self-center' : 'self-end mr-5'}`}>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('productList.prev') || 'Prev'}
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-sm border ${
                  page === p 
                    ? 'bg-[#111827] text-white border-[#111827]' 
                    : 'border-gray-300 hover:bg-gray-100'
                }`}
              >
                {p}
              </button>
            ))}
            
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || totalPages === 0}
              className="px-3 py-1 border border-gray-300 text-sm hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {t('productList.next') || 'Next'}
            </button>
          </div>
          <p className="text-center text-sm text-gray-600">
            {t('productList.showingResults', { from: fromResult, to: toResult, total: totalResults })}
          </p>
        </div>
      </div>
    </>
  )
}