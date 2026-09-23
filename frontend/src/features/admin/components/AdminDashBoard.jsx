import React, { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  IndianRupee, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  RotateCcw, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Boxes,
  X,
  Check,
  Edit3
} from 'lucide-react'
import { selectCategories } from '../../categories/CategoriesSlice'
import { 
  deleteProductByIdAsync, 
  fetchProductsAsync, 
  selectProductTotalResults, 
  selectProducts, 
  undeleteProductByIdAsync,
  updateProductByIdAsync 
} from '../../products/ProductSlice'
import { showToast } from '../../../utils/toast'

const ITEMS_PER_PAGE = 10

// ===== DELETE CONFIRMATION MODAL =====
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, product, isDeleting }) => {
  if (!isOpen || !product) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150">
        <div className="p-6">
          <div className="flex items-center gap-3.5 mb-4">
            <div className="w-11 h-11 bg-red-100 text-[#E31837] rounded-full flex items-center justify-center shrink-0">
              <Trash2 size={22} />
            </div>
            <div>
              <h3 className="text-base font-bold text-gray-900">Delete Product</h3>
              <p className="text-xs text-gray-500">This item will be marked as deleted and hidden from buyers.</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-3 border border-gray-200/80 flex items-center gap-3 mb-5">
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-12 h-12 rounded-lg object-contain bg-white border border-gray-200 shrink-0" 
            />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{product.title}</p>
              <p className="text-xs text-gray-500">
                {typeof product.brand === 'object' ? product.brand?.name : product.brand || 'No brand'} • ₹{product.price}
              </p>
            </div>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Are you sure you want to delete this product? You can restore it anytime using the undelete button.
          </p>
        </div>

        <div className="flex items-center justify-end gap-2.5 px-6 py-4 bg-gray-50/80 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#E31837] hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
          >
            <Trash2 size={14} />
            {isDeleting ? 'Deleting...' : 'Yes, Delete'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== STOCK ADJUSTMENT MODAL =====
const StockAdjustmentModal = ({ product, isOpen, onClose, onSave }) => {
  const [baseStock, setBaseStock] = useState(0)
  const [tiers, setTiers] = useState([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (product) {
      setBaseStock(Number(product.stockQuantity) || 0)
      setTiers(
        Array.isArray(product.tiers) 
          ? product.tiers.map(t => ({ ...t, stockQuantity: Number(t.stockQuantity) || 0 })) 
          : []
      )
    }
  }, [product])

  if (!isOpen || !product) return null

  const handleTierStockChange = (index, value) => {
    const updated = [...tiers]
    updated[index].stockQuantity = Math.max(0, parseInt(value, 10) || 0)
    setTiers(updated)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await onSave({
        _id: product._id,
        stockQuantity: Math.max(0, parseInt(baseStock, 10) || 0),
        tiers: tiers
      })
      onClose()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-gray-100 overflow-hidden flex flex-col">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-[#0055A4] rounded-lg">
              <Boxes size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-gray-900">Adjust Inventory Stock</h2>
              <p className="text-xs text-gray-500 truncate max-w-xs">{product.title}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="bg-gray-50/70 p-3.5 rounded-xl border border-gray-200/80">
            <label className="block text-xs font-bold uppercase text-gray-700 tracking-wider mb-1">
              Base Inventory Stock (Single Units)
            </label>
            <p className="text-[11px] text-gray-500 mb-2">Total individual loose units available in the warehouse.</p>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={baseStock}
                onChange={(e) => setBaseStock(e.target.value)}
                className="w-full px-3.5 py-2 text-sm font-semibold border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0055A4]/20 focus:border-[#0055A4]"
                required
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-gray-400">units</span>
            </div>
          </div>

          <div>
            <h3 className="text-xs font-bold uppercase text-gray-700 tracking-wider mb-2">
              Packaging Tier Stock Breakdown
            </h3>
            {tiers.length > 0 ? (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {tiers.map((tier, idx) => (
                  <div key={tier.type || idx} className="flex items-center justify-between gap-3 p-3 border border-gray-200 rounded-xl bg-white">
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-gray-900 capitalize">
                        {tier.label || tier.type}
                      </div>
                      <div className="text-xs text-gray-500">
                        {tier.quantity ? `${tier.quantity} units/pack` : 'Custom pack'} • ₹{tier.price}
                      </div>
                    </div>

                    <div className="w-32 relative shrink-0">
                      <input
                        type="number"
                        min="0"
                        value={tier.stockQuantity}
                        onChange={(e) => handleTierStockChange(idx, e.target.value)}
                        className="w-full px-3 py-1.5 text-sm text-right font-semibold border border-gray-300 rounded-lg focus:outline-none focus:border-[#0055A4]"
                      />
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-gray-400 pointer-events-none">
                        Qty:
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic py-2">
                No custom packaging tiers configured for this product.
              </p>
            )}
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0055A4] hover:bg-[#003d7a] rounded-lg transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <Check size={14} />
              {isSubmitting ? 'Saving...' : 'Update Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ===== MAIN ADMIN DASHBOARD =====
export const AdminDashBoard = () => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const categories = useSelector(selectCategories)
  const products = useSelector(selectProducts)
  const totalResults = useSelector(selectProductTotalResults)

  // Filter & Search State
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [stockFilter, setStockFilter] = useState('all') 
  const [sortBy, setSortBy] = useState('newest')
  const [page, setPage] = useState(1)

  // Stock Adjustment Modal State
  const [selectedStockProduct, setSelectedStockProduct] = useState(null)
  const [isStockModalOpen, setIsStockModalOpen] = useState(false)

  // Delete Modal State
  const [productToDelete, setProductToDelete] = useState(null)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch catalog once
  useEffect(() => {
    let sortObj = {}
    if (sortBy === 'price_asc') sortObj = { _sort: 'price', _order: 'asc' }
    else if (sortBy === 'price_desc') sortObj = { _sort: 'price', _order: 'desc' }
    else if (sortBy === 'stock_asc') sortObj = { _sort: 'stockQuantity', _order: 'asc' }
    else if (sortBy === 'stock_desc') sortObj = { _sort: 'stockQuantity', _order: 'desc' }

    const filters = {
      pagination: { page: 1, limit: 1000 },
      sort: sortObj,
      category: selectedCategory ? [selectedCategory] : []
    }

    dispatch(fetchProductsAsync(filters))
  }, [dispatch, selectedCategory, sortBy])

  // Reset to page 1 on filter changes
  useEffect(() => {
    setPage(1)
  }, [searchTerm, selectedCategory, stockFilter, sortBy])

  // Overview Analytics
  const stats = useMemo(() => {
    if (!products || !Array.isArray(products)) {
      return { total: 0, lowStock: 0, outOfStock: 0, totalValue: 0 }
    }

    let lowCount = 0
    let outCount = 0
    let value = 0

    products.forEach(p => {
      const stock = Number(p.stockQuantity) || 0
      const price = Number(p.price) || 0

      if (stock === 0) outCount++
      else if (stock <= 10) lowCount++

      value += stock * price
    })

    return {
      total: totalResults || products.length,
      lowStock: lowCount,
      outOfStock: outCount,
      totalValue: value
    }
  }, [products, totalResults])

  // Client Filter & Sort
  const filteredProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return []

    const list = products.filter(item => {
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        const titleMatch = item.title?.toLowerCase().includes(q)
        const brandMatch = (typeof item.brand === 'object' ? item.brand?.name : item.brand)?.toLowerCase().includes(q)
        if (!titleMatch && !brandMatch) return false
      }

      if (selectedCategory) {
        const catId = typeof item.category === 'object' ? item.category?._id : item.category
        if (catId !== selectedCategory) return false
      }

      const stock = Number(item.stockQuantity) || 0
      if (stockFilter === 'out_of_stock' && stock > 0) return false
      if (stockFilter === 'low_stock' && (stock <= 0 || stock > 10)) return false
      if (stockFilter === 'in_stock' && stock <= 10) return false

      return true
    })

    return list.sort((a, b) => {
      if (sortBy === 'price_asc') return (a.price || 0) - (b.price || 0)
      if (sortBy === 'price_desc') return (b.price || 0) - (a.price || 0)
      if (sortBy === 'stock_asc') return (a.stockQuantity || 0) - (b.stockQuantity || 0)
      if (sortBy === 'stock_desc') return (b.stockQuantity || 0) - (a.stockQuantity || 0)
      return 0
    })
  }, [products, searchTerm, selectedCategory, stockFilter, sortBy])

  // Pagination Slice
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / ITEMS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredProducts, currentPage])

  const fromResult = filteredProducts.length ? (currentPage - 1) * ITEMS_PER_PAGE + 1 : 0
  const toResult = Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)

  // Open Delete Modal
  const handleOpenDeleteModal = (product) => {
    setProductToDelete(product)
    setIsDeleteModalOpen(true)
  }

  // Confirm Delete Handler
  const handleConfirmDelete = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      const res = await dispatch(deleteProductByIdAsync(productToDelete._id))
      if (res?.meta?.requestStatus === 'fulfilled' || !res?.error) {
        showToast.success("Product deleted successfully")
      } else {
        showToast.error("Failed to delete product")
      }
    } finally {
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
      setProductToDelete(null)
    }
  }

  const handleProductUnDelete = (productId) => {
    dispatch(undeleteProductByIdAsync(productId))
    showToast.success("Product restored")
  }

  const handleOpenStockModal = (product) => {
    setSelectedStockProduct(product)
    setIsStockModalOpen(true)
  }

  const handleSaveStockAdjustment = async (updateData) => {
    const res = await dispatch(updateProductByIdAsync(updateData))
    if (res?.meta?.requestStatus === 'fulfilled' || !res?.error) {
      showToast.success("Stock levels updated successfully")
    } else {
      showToast.error("Failed to update stock quantity")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">Admin Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage wholesale inventory, stock levels, and product availability</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin/orders"
              className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors shadow-xs"
            >
              Manage Orders
            </Link>
            <Link
              to="/admin/add-product"
              className="flex items-center gap-2 px-4 py-2 bg-[#0055A4] text-white rounded-lg text-sm font-semibold hover:bg-[#003d7a] transition-colors shadow-xs"
            >
              <Plus size={18} />
              Add Product
            </Link>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-[#0055A4] rounded-lg shrink-0">
              <Package size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Total Products</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{stats.total}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg shrink-0">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Low Stock</p>
              <h3 className="text-2xl font-bold text-amber-600 mt-0.5">{stats.lowStock}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-red-50 text-[#E31837] rounded-lg shrink-0">
              <XCircle size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Out of Stock</p>
              <h3 className="text-2xl font-bold text-[#E31837] mt-0.5">{stats.outOfStock}</h3>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-xs flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg shrink-0">
              <IndianRupee size={24} />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Inventory Value</p>
              <h3 className="text-2xl font-bold text-gray-900 mt-0.5">₹{stats.totalValue.toLocaleString('en-IN')}</h3>
            </div>
          </div>
        </div>

        {/* Products Table Section */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row items-center justify-between gap-3">
            <div className="relative w-full md:w-80">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title or brand..."
                className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0055A4] focus:border-[#0055A4]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#0055A4]"
              >
                <option value="">All Categories</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>

              <select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#0055A4]"
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock (&gt; 10)</option>
                <option value="low_stock">Low Stock (1 - 10)</option>
                <option value="out_of_stock">Out of Stock (0)</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-[#0055A4]"
              >
                <option value="newest">Sort: Default</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="stock_asc">Stock: Low to High</option>
                <option value="stock_desc">Stock: High to Low</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Image</th>
                  <th className="py-3 px-4">Product / Brand</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Base Price</th>
                  <th className="py-3 px-4">Packaging Tiers</th>
                  <th className="py-3 px-4">Total Stock</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {paginatedProducts.length > 0 ? (
                  paginatedProducts.map((p) => {
                    const stock = Number(p.stockQuantity) || 0
                    const isDeleted = p.isDeleted === true
                    const tiers = p.tiers || []

                    return (
                      <tr 
                        key={p._id} 
                        className={`hover:bg-gray-50/80 transition-colors ${isDeleted ? 'bg-red-50/30 opacity-75' : ''}`}
                      >
                        <td className="py-3 px-4">
                          <img
                            src={p.thumbnail}
                            alt={p.title}
                            className="w-11 h-11 object-contain rounded-md border border-gray-200 bg-white"
                          />
                        </td>

                        <td className="py-3 px-4">
                          <div className="font-semibold text-gray-900 max-w-xs truncate">{p.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5">
                            {typeof p.brand === 'object' ? p.brand?.name : p.brand || 'No Brand'}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-gray-600">
                          {typeof p.category === 'object' ? p.category?.name : 'General'}
                        </td>

                        <td className="py-3 px-4 font-bold text-gray-900">
                          ₹{p.price}
                        </td>

                        <td className="py-3 px-4">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {tiers.length > 0 ? (
                              tiers.map(t => (
                                <span 
                                  key={t.type} 
                                  className="px-1.5 py-0.5 text-[10px] font-semibold bg-gray-100 text-gray-700 rounded border border-gray-200"
                                >
                                  {t.type} (₹{t.price})
                                </span>
                              ))
                            ) : (
                              <span className="text-xs text-gray-400">Single</span>
                            )}
                          </div>
                        </td>

                        {/* Interactive Stock Popover Trigger */}
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => handleOpenStockModal(p)}
                            title="Click to adjust stock & tiers"
                            className="group flex items-center gap-1.5 px-2.5 py-1 -ml-2.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer text-left"
                          >
                            <span className="font-bold text-gray-900 group-hover:text-[#0055A4] transition-colors">
                              {stock} units
                            </span>
                            <Edit3 
                              size={13} 
                              className="text-gray-400 opacity-0 group-hover:opacity-100 group-hover:text-[#0055A4] transition-all" 
                            />
                          </button>
                        </td>

                        <td className="py-3 px-4">
                          {isDeleted ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                              ● Deleted
                            </span>
                          ) : stock === 0 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-700 rounded-full">
                              ● Out of stock
                            </span>
                          ) : stock <= 10 ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-amber-100 text-amber-800 rounded-full">
                              ● Low stock
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                              ● In stock
                            </span>
                          )}
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <Link
                              to={`/product-details/${p._id}`}
                              target="_blank"
                              rel="noreferrer"
                              title="View Details"
                              className="p-1.5 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors"
                            >
                              <ExternalLink size={16} />
                            </Link>

                            <Link
                              to={`/admin/product-update/${p._id}`}
                              title="Edit Product"
                              className="p-1.5 text-[#0055A4] hover:bg-blue-50 rounded transition-colors"
                            >
                              <Edit size={16} />
                            </Link>

                            {isDeleted ? (
                              <button
                                type="button"
                                onClick={() => handleProductUnDelete(p._id)}
                                title="Restore Product"
                                className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors cursor-pointer"
                              >
                                <RotateCcw size={16} />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleOpenDeleteModal(p)}
                                title="Delete Product"
                                className="p-1.5 text-[#E31837] hover:bg-red-50 rounded transition-colors cursor-pointer"
                              >
                                <Trash2 size={16} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })
                ) : (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-gray-500">
                      No products found matching the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Table Pagination */}
          <div className="p-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
            <div>
              Showing <span className="font-semibold text-gray-900">{fromResult}</span> to{' '}
              <span className="font-semibold text-gray-900">{toResult}</span> of{' '}
              <span className="font-semibold text-gray-900">{filteredProducts.length}</span> products
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={currentPage === 1}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronLeft size={16} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded text-xs font-semibold cursor-pointer ${
                    currentPage === p
                      ? 'bg-[#0055A4] text-white'
                      : 'border border-gray-300 hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                type="button"
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Stock Adjustment Modal */}
      <StockAdjustmentModal
        product={selectedStockProduct}
        isOpen={isStockModalOpen}
        onClose={() => {
          setIsStockModalOpen(false)
          setSelectedStockProduct(null)
        }}
        onSave={handleSaveStockAdjustment}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        product={productToDelete}
        isDeleting={isDeleting}
        onClose={() => {
          setIsDeleteModalOpen(false)
          setProductToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  )
}

export default AdminDashBoard