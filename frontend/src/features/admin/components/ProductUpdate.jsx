import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    resetProductUpdateStatus,
    selectProductUpdateStatus,
    selectSelectedProduct,
    updateProductByIdAsync,
    fetchProductByIdAsync
} from '../../products/ProductSlice'
import { useForm, Controller } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { showToast } from '../../../utils/toast'
import { useTranslation } from 'react-i18next'
import { ImageUploader } from '../../../components/ImageUploader'

export const AVAILABLE_TIERS = [
    { type: 'single', label: 'Single Unit', defaultQty: 1, isFixedQty: true, badge: 'bg-gray-100 text-gray-800' },
    { type: 'pack', label: 'Pack', defaultQty: 10, minQty: 2, badge: 'bg-[#0055A4] text-white' },
    { type: 'box', label: 'Box', defaultQty: 20, minQty: 2, badge: 'bg-purple-700 text-white' },
    { type: 'jar', label: 'Jar', defaultQty: 30, minQty: 2, badge: 'bg-amber-600 text-white' },
    { type: 'carton', label: 'Carton', defaultQty: 50, minQty: 2, badge: 'bg-[#111827] text-white' },
    { type: 'bundle', label: 'Bundle', defaultQty: 5, minQty: 2, badge: 'bg-teal-700 text-white' },
    { type: 'dozen', label: 'Dozen', defaultQty: 12, isFixedQty: true, badge: 'bg-indigo-700 text-white' },
    { type: 'strip', label: 'Strip', defaultQty: 10, minQty: 2, badge: 'bg-rose-700 text-white' },
    { type: 'bag', label: 'Bag', defaultQty: 25, minQty: 2, badge: 'bg-emerald-700 text-white' },
]

const SalePricePreview = ({ basePrice, discount }) => {
    const bp = Number(basePrice) || 0
    const disc = Number(discount) || 0
    const salePrice = Math.round(bp * (1 - disc / 100))

    if (bp <= 0) return null

    return (
        <div className="mt-2 text-sm">
            {disc > 0 ? (
                <span>
                    <span className="text-gray-400 line-through mr-1">₹{bp}</span>
                    <span className="text-[#E31837] font-bold">₹{salePrice}</span>
                    <span className="text-xs text-green-600 ml-1">({disc}% off)</span>
                </span>
            ) : (
                <span className="text-[#111827] font-medium">₹{bp}</span>
            )}
        </div>
    )
}

export const ProductUpdate = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()

    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const productUpdateStatus = useSelector(selectProductUpdateStatus)
    const selectedProduct = useSelector(selectSelectedProduct)

    const { register, handleSubmit, control, reset, formState: { errors } } = useForm()

    const [tiers, setTiers] = useState([])
    const [selectedTierToAdd, setSelectedTierToAdd] = useState('')

    // Fetch product details on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
        }
    }, [id, dispatch])

    // Remember and pre-populate previous product values
    useEffect(() => {
        if (selectedProduct) {
            const rawTiers = selectedProduct.tiers || []

            if (rawTiers.length > 0) {
                setTiers(rawTiers.map(t => {
                    const fallbackQty = t.type === 'single' ? 1 : ''
                    const preservedQty = (t.quantity !== undefined && t.quantity !== null && t.quantity !== 0) 
                        ? t.quantity 
                        : fallbackQty

                    return {
                        type: t.type,
                        label: t.label || t.type,
                        quantity: preservedQty,
                        basePrice: t.basePrice ?? t.price ?? '',
                        discountPercentage: t.discountPercentage ?? 0,
                        stockQuantity: t.stockQuantity ?? ''
                    }
                }))
            } else {
                setTiers([
                    {
                        type: 'single',
                        label: 'Single Unit',
                        quantity: 1,
                        basePrice: selectedProduct.price ?? '',
                        discountPercentage: selectedProduct.discountPercentage ?? 0,
                        stockQuantity: selectedProduct.stockQuantity ?? ''
                    }
                ])
            }

            const images = selectedProduct.images || []
            reset({
                title: selectedProduct.title || '',
                brand: selectedProduct.brand?._id || selectedProduct.brand || '',
                category: selectedProduct.category?._id || selectedProduct.category || '',
                description: selectedProduct.description || '',
                type: selectedProduct.type || '',
                thumbnail: selectedProduct.thumbnail || '',
                image0: images[0] || '',
                image1: images[1] || '',
                image2: images[2] || '',
                image3: images[3] || '',
            })
        }
    }, [selectedProduct, reset])

    useEffect(() => {
        if (productUpdateStatus === 'fulfilled' || productUpdateStatus === 'fullfilled') {
            showToast.success(t('productForm.successUpdate'))
            navigate("/admin/dashboard")
        } else if (productUpdateStatus === 'rejected') {
            showToast.error(t('productForm.error'))
        }
    }, [productUpdateStatus, navigate, t])

    useEffect(() => {
        return () => {
            dispatch(resetProductUpdateStatus())
        }
    }, [dispatch])

    const computeSalePrice = (basePrice, discount) => {
        const bp = Number(basePrice) || 0
        const disc = Number(discount) || 0
        return Math.round(bp * (1 - disc / 100))
    }

    const handleAddTier = () => {
        if (!selectedTierToAdd) return
        const def = AVAILABLE_TIERS.find(t => t.type === selectedTierToAdd)
        if (!def) return

        if (tiers.some(t => t.type === selectedTierToAdd)) {
            showToast.warning(`${def.label} tier is already added`)
            return
        }

        setTiers(prev => [
            ...prev,
            {
                type: def.type,
                label: def.label,
                quantity: '',
                basePrice: '',
                discountPercentage: 0,
                stockQuantity: ''
            }
        ])
        setSelectedTierToAdd('')
    }

    const handleRemoveTier = (index) => {
        if (tiers.length <= 1) {
            showToast.warning('At least one pricing tier is required')
            return
        }
        setTiers(prev => prev.filter((_, i) => i !== index))
    }

    const handleTierChange = (index, field, value) => {
        setTiers(prev => {
            const updated = [...prev]
            const tier = { ...updated[index], [field]: value }

            // Auto-update label when quantity changes
            if (field === 'quantity') {
                const def = AVAILABLE_TIERS.find(t => t.type === tier.type)
                if (def && def.type !== 'single') {
                    if (value && Number(value) > 1) {
                        tier.label = `${def.label} of ${value}`
                    } else {
                        tier.label = def.label
                    }
                }
            }

            updated[index] = tier
            return updated
        })
    }

    const handleProductUpdate = (data) => {
        for (const tier of tiers) {
            if (!tier.basePrice || Number(tier.basePrice) <= 0) {
                showToast.error(`Please enter a valid price for ${tier.label}`)
                return
            }
            if (tier.stockQuantity === '' || Number(tier.stockQuantity) < 0) {
                showToast.error(`Please enter stock quantity for ${tier.label}`)
                return
            }
        }

        const rawImages = [data?.image0, data?.image1, data?.image2, data?.image3]
        const validImages = rawImages.filter((img) => img && img.trim() !== "")

        const formattedTiers = tiers.map(t => {
            const bp = Number(t.basePrice) || 0
            const disc = Number(t.discountPercentage) || 0
            const sp = computeSalePrice(bp, disc)
            const parsedQty = (t.quantity !== '' && t.quantity !== null && !isNaN(Number(t.quantity)) && Number(t.quantity) > 0)
                ? Number(t.quantity)
                : (t.type === 'single' ? 1 : null)

            return {
                type: t.type,
                label: t.label || t.type,
                quantity: parsedQty,
                basePrice: bp,
                price: sp,
                discountPercentage: disc,
                stockQuantity: Number(t.stockQuantity) || 0
            }
        })

        const singleTier = formattedTiers.find(t => t.type === 'single') || formattedTiers[0]

        const updatedProduct = {
            _id: id,
            title: data.title,
            brand: data.brand,
            category: data.category,
            description: data.description,
            type: data.type,
            thumbnail: data.thumbnail,
            images: validImages.length > 0 ? validImages : [data.thumbnail],
            price: singleTier.price,
            stockQuantity: singleTier.stockQuantity,
            tiers: formattedTiers
        }

        dispatch(updateProductByIdAsync(updatedProduct))
    }

    const handleFormError = () => {
        showToast.error(t('productForm.fillRequired'))
    }

    const inputBase = "w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#0055A4] focus:border-[#0055A4]"
    const inputError = "w-full px-4 py-2.5 border border-[#E31837] text-sm focus:outline-none focus:ring-1 focus:ring-[#E31837] focus:border-[#E31837]"
    const labelCls = "block text-sm font-medium text-[#111827] mb-1.5"

    const availableTiersToAdd = AVAILABLE_TIERS.filter(
        at => !tiers.some(t => t.type === at.type)
    )

    return (
        <div className="px-4 py-8 flex justify-center bg-white min-h-screen">
            <form
                noValidate
                onSubmit={handleSubmit(handleProductUpdate, handleFormError)}
                className="w-full max-w-4xl space-y-6"
            >
                {/* Title */}
                <div>
                    <label className={labelCls}>{t('productForm.title')}</label>
                    <input
                        {...register("title", { required: t('productForm.titleRequired') })}
                        className={errors.title ? inputError : inputBase}
                    />
                    {errors.title && <p className="mt-1 text-xs text-[#E31837]">{errors.title.message}</p>}
                </div>

                {/* Brand & Category */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className={labelCls}>{t('productForm.brand')}</label>
                        <Controller
                            name="brand"
                            control={control}
                            render={({ field }) => (
                                <select {...field} className={errors.brand ? inputError : inputBase}>
                                    <option value="">{t('productForm.selectBrand')}</option>
                                    {brands.map((b) => (
                                        <option key={b._id} value={b._id}>{b.name}</option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.brand && <p className="mt-1 text-xs text-[#E31837]">{errors.brand.message}</p>}
                    </div>

                    <div>
                        <label className={labelCls}>{t('productForm.category')}</label>
                        <Controller
                            name="category"
                            control={control}
                            rules={{ required: t('productForm.categoryRequired') }}
                            render={({ field }) => (
                                <select {...field} className={errors.category ? inputError : inputBase}>
                                    <option value="">{t('productForm.selectCategory')}</option>
                                    {categories.map((c) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            )}
                        />
                        {errors.category && <p className="mt-1 text-xs text-[#E31837]">{errors.category.message}</p>}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className={labelCls}>{t('productForm.description')}</label>
                    <textarea
                        rows={4}
                        {...register("description", { required: t('productForm.descriptionRequired') })}
                        className={errors.description ? inputError : inputBase}
                    />
                    {errors.description && <p className="mt-1 text-xs text-[#E31837]">{errors.description.message}</p>}
                </div>

                {/* Type */}
                <div>
                    <label className={labelCls}>{t('productForm.type')}</label>
                    <input
                        {...register("type", { required: t('productForm.typeRequired') })}
                        className={errors.type ? inputError : inputBase}
                    />
                    {errors.type && <p className="mt-1 text-xs text-[#E31837]">{errors.type.message}</p>}
                </div>

                {/* Wholesale Tiers Configuration */}
                <div className="border border-gray-200 p-5 space-y-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-300 pb-3">
                        <div>
                            <h3 className="text-base font-bold text-[#111827] uppercase tracking-wide">
                                Wholesale Tiers Manager
                            </h3>
                            <p className="text-xs text-gray-500">
                                Configure which packaging tiers are enabled for this product.
                            </p>
                        </div>

                        {availableTiersToAdd.length > 0 && (
                            <div className="flex items-center gap-2">
                                <select
                                    value={selectedTierToAdd}
                                    onChange={(e) => setSelectedTierToAdd(e.target.value)}
                                    className="px-3 py-1.5 border border-gray-300 bg-white text-xs rounded focus:outline-none focus:border-[#0055A4]"
                                >
                                    <option value="">+ Choose Tier to Add</option>
                                    {availableTiersToAdd.map(at => (
                                        <option key={at.type} value={at.type}>{at.label}</option>
                                    ))}
                                </select>
                                <button
                                    type="button"
                                    onClick={handleAddTier}
                                    disabled={!selectedTierToAdd}
                                    className="px-3 py-1.5 bg-[#0055A4] text-white text-xs font-semibold rounded hover:bg-[#003d7a] disabled:opacity-40 transition-colors"
                                >
                                    Add
                                </button>
                            </div>
                        )}
                    </div>

                    <div className="space-y-4">
                        {tiers.map((tier, index) => {
                            const def = AVAILABLE_TIERS.find(t => t.type === tier.type) || {}
                            const isSingle = tier.type === 'single'

                            return (
                                <div key={tier.type} className="bg-white border border-gray-200 p-4 rounded shadow-xs relative">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 text-xs font-bold uppercase rounded ${def.badge || 'bg-gray-800 text-white'}`}>
                                                {def.label || tier.type}
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTier(index)}
                                            className="text-xs text-red-600 hover:text-red-800 font-medium px-2 py-1 hover:bg-red-50 rounded transition-colors"
                                        >
                                            Remove Tier
                                        </button>
                                    </div>

                                    <div className={`grid grid-cols-1 sm:grid-cols-2 ${isSingle ? 'md:grid-cols-3' : 'md:grid-cols-4'} gap-4`}>
                                        {/* Quantity input only rendered for non-single tiers */}
                                        {!isSingle && (
                                            <div>
                                                <label className={labelCls}>
                                                    Units per {def.label || 'Tier'} <span className="text-gray-400 font-normal text-xs">(Optional)</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={tier.quantity ?? ''}
                                                    onChange={(e) => handleTierChange(index, 'quantity', e.target.value)}
                                                    placeholder="Optional"
                                                    className={inputBase}
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label className={labelCls}>Base Price / MRP (₹)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={tier.basePrice}
                                                onChange={(e) => handleTierChange(index, 'basePrice', e.target.value)}
                                                className={inputBase}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelCls}>Discount (%)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                max={100}
                                                value={tier.discountPercentage}
                                                onChange={(e) => handleTierChange(index, 'discountPercentage', e.target.value)}
                                                className={inputBase}
                                            />
                                        </div>

                                        <div>
                                            <label className={labelCls}>Stock (Units)</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={tier.stockQuantity}
                                                onChange={(e) => handleTierChange(index, 'stockQuantity', e.target.value)}
                                                className={inputBase}
                                            />
                                        </div>
                                    </div>

                                    <SalePricePreview
                                        basePrice={tier.basePrice}
                                        discount={tier.discountPercentage}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Thumbnail */}
                <div>
                    <Controller
                        name="thumbnail"
                        control={control}
                        rules={{ required: t('productForm.thumbnailRequired') }}
                        render={({ field }) => (
                            <ImageUploader
                                label={t('productForm.thumbnail')}
                                value={field.value}
                                onChange={field.onChange}
                            />
                        )}
                    />
                    {errors.thumbnail && <p className="mt-1 text-xs text-[#E31837]">{errors.thumbnail.message}</p>}
                </div>

                {/* Product Images */}
                <div className="space-y-3">
                    <label className={labelCls}>{t('productForm.productImages')}</label>
                    <Controller
                        name="image0"
                        control={control}
                        rules={{ required: t('productForm.image1Required') }}
                        render={({ field }) => (
                            <ImageUploader value={field.value} onChange={field.onChange} placeholder={t('productForm.image1')} />
                        )}
                    />
                    {errors.image0 && <p className="mt-1 text-xs text-[#E31837]">{errors.image0.message}</p>}

                    <Controller name="image1" control={control} render={({ field }) => (
                        <ImageUploader value={field.value} onChange={field.onChange} placeholder={t('productForm.image2')} />
                    )} />
                    <Controller name="image2" control={control} render={({ field }) => (
                        <ImageUploader value={field.value} onChange={field.onChange} placeholder={t('productForm.image3')} />
                    )} />
                    <Controller name="image3" control={control} render={({ field }) => (
                        <ImageUploader value={field.value} onChange={field.onChange} placeholder={t('productForm.image4')} />
                    )} />
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                    <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#111827] text-white text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        {t('productForm.updateProduct')}
                    </button>
                    <Link
                        to="/admin/dashboard"
                        className="px-6 py-2.5 border border-[#E31837] text-[#E31837] text-sm font-medium hover:bg-red-50 transition-colors"
                    >
                        {t('productForm.cancel')}
                    </Link>
                </div>
            </form>
        </div>
    )
}

export default ProductUpdate