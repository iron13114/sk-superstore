import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
    resetProductUpdateStatus,
    selectProductUpdateStatus,
    selectSelectedProduct,
    updateProductByIdAsync,
    fetchProductByIdAsync
} from '../../products/ProductSlice'
import { useForm, Controller, useWatch } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { showToast } from '../../../utils/toast';
import { useTranslation } from 'react-i18next'
import { ImageUploader } from '../../../components/ImageUploader'

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

    const { register, handleSubmit, control, reset, formState: { errors }, watch } = useForm()

    // Watch all tier fields for live preview
    const watchedSinglePrice = watch('singlePrice')
    const watchedSingleDiscount = watch('singleDiscount')
    const watchedPackPrice = watch('packPrice')
    const watchedPackDiscount = watch('packDiscount')
    const watchedCartonPrice = watch('cartonPrice')
    const watchedCartonDiscount = watch('cartonDiscount')

    // Fetch product on mount
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
        }
    }, [id, dispatch])

    // Prefill form when product loads
    useEffect(() => {
        if (selectedProduct) {
            const tiers = selectedProduct.tiers || []
            const singleTier = tiers.find(t => t.type === 'single') || {}
            const packTier = tiers.find(t => t.type === 'pack') || {}
            const cartonTier = tiers.find(t => t.type === 'carton') || {}

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
                // Single tier — use basePrice if available, fallback to price
                singlePrice: singleTier.basePrice ?? singleTier.price ?? '',
                singleDiscount: singleTier.discountPercentage ?? '',
                singleStock: singleTier.stockQuantity ?? '',
                // Pack tier
                packQuantity: packTier.quantity ?? 10,
                packPrice: packTier.basePrice ?? packTier.price ?? '',
                packDiscount: packTier.discountPercentage ?? '',
                packStock: packTier.stockQuantity ?? '',
                // Carton tier
                cartonQuantity: cartonTier.quantity ?? 50,
                cartonPrice: cartonTier.basePrice ?? cartonTier.price ?? '',
                cartonDiscount: cartonTier.discountPercentage ?? '',
                cartonStock: cartonTier.stockQuantity ?? '',
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

    const handleProductUpdate = (data) => {
        const rawImages = [data?.image0, data?.image1, data?.image2, data?.image3]
        const validImages = rawImages.filter((img) => img && img.trim() !== "")

        const singleQty = 1
        const packQty = Number(data.packQuantity) || 10
        const cartonQty = Number(data.cartonQuantity) || 50

        const singleBasePrice = Number(data.singlePrice) || 0
        const singleDiscount = Number(data.singleDiscount) || 0
        const singleSalePrice = computeSalePrice(singleBasePrice, singleDiscount)
        const singleStock = Number(data.singleStock) || 0

        const updatedProduct = {
            _id: id,
            title: data.title,
            brand: data.brand,
            category: data.category,
            description: data.description,
            type: data.type,
            thumbnail: data.thumbnail,
            images: validImages.length > 0 ? validImages : [data.thumbnail],
            // Root-level fields for backward compatibility
            price: singleSalePrice,
            stockQuantity: singleStock,
            tiers: [
                { 
                    type: 'single', 
                    label: t('productDetails.singleUnit'), 
                    quantity: singleQty, 
                    basePrice: singleBasePrice,
                    price: singleSalePrice, 
                    discountPercentage: singleDiscount,
                    stockQuantity: singleStock
                },
                { 
                    type: 'pack', 
                    label: t('productDetails.packOf', { qty: packQty }), 
                    quantity: packQty,
                    basePrice: Number(data.packPrice) || 0,
                    price: computeSalePrice(data.packPrice, data.packDiscount), 
                    discountPercentage: Number(data.packDiscount) || 0,
                    stockQuantity: Number(data.packStock) || 0
                },
                { 
                    type: 'carton', 
                    label: t('productDetails.cartonOf', { qty: cartonQty }), 
                    quantity: cartonQty,
                    basePrice: Number(data.cartonPrice) || 0,
                    price: computeSalePrice(data.cartonPrice, data.cartonDiscount), 
                    discountPercentage: Number(data.cartonDiscount) || 0,
                    stockQuantity: Number(data.cartonStock) || 0
                }
            ]
        }

        dispatch(updateProductByIdAsync(updatedProduct))
    }

    const handleFormError = () => {
        showToast.error(t('productForm.fillRequired'))
    }

    const inputBase = "w-full px-4 py-2.5 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#0055A4] focus:border-[#0055A4]"
    const inputError = "w-full px-4 py-2.5 border border-[#E31837] text-sm focus:outline-none focus:ring-1 focus:ring-[#E31837] focus:border-[#E31837]"
    const labelCls = "block text-sm font-medium text-[#111827] mb-1.5"

    const tierConfigs = [
        { 
            key: 'single', 
            label: t('productDetails.singleUnit'), 
            defaultQty: 1, 
            qtyReadOnly: true,
            color: 'bg-gray-100 text-gray-800' 
        },
        { 
            key: 'pack', 
            label: t('productDetails.packOf', { qty: 10 }), 
            defaultQty: 10, 
            qtyReadOnly: false,
            color: 'bg-[#0055A4] text-white' 
        },
        { 
            key: 'carton', 
            label: t('productDetails.cartonOf', { qty: 50 }), 
            defaultQty: 50, 
            qtyReadOnly: false,
            color: 'bg-[#111827] text-white' 
        },
    ]

    const tierWatchMap = {
        single: { price: watchedSinglePrice, discount: watchedSingleDiscount },
        pack: { price: watchedPackPrice, discount: watchedPackDiscount },
        carton: { price: watchedCartonPrice, discount: watchedCartonDiscount },
    }

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
                            rules={{ required: t('productForm.brandRequired') }}
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

                {/* Wholesale Tiers */}
                <div className="border border-gray-200 p-5 space-y-4 bg-gray-50">
                    <h3 className="text-base font-bold text-[#111827] uppercase tracking-wide border-b border-gray-300 pb-2">
                        {t('productForm.wholesaleTiers')}
                    </h3>

                    {tierConfigs.map((tier) => (
                        <div key={tier.key} className="bg-white border border-gray-200 p-4">
                            <div className="flex items-center gap-2 mb-3">
                                <span className={`inline-block px-2 py-0.5 text-xs font-bold ${tier.color}`}>
                                    {tier.qtyReadOnly ? `QTY ${tier.defaultQty}` : 'QTY CUSTOM'}
                                </span>
                                <span className="text-sm font-semibold text-[#111827]">
                                    {tier.key === 'single' ? tier.label : 
                                     tier.key === 'pack' ? t('productDetails.packOf', { qty: tier.defaultQty }) :
                                     t('productDetails.cartonOf', { qty: tier.defaultQty })}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                                {/* Quantity field for pack/carton */}
                                {!tier.qtyReadOnly && (
                                    <div>
                                        <label className={labelCls}>Quantity per {tier.key}</label>
                                        <input
                                            type="number"
                                            min={2}
                                            {...register(`${tier.key}Quantity`, { 
                                                required: `${tier.key} quantity is required`,
                                                min: { value: 2, message: 'Must be at least 2' }
                                            })}
                                            className={errors[`${tier.key}Quantity`] ? inputError : inputBase}
                                        />
                                        {errors[`${tier.key}Quantity`] && (
                                            <p className="mt-1 text-xs text-[#E31837]">{errors[`${tier.key}Quantity`].message}</p>
                                        )}
                                    </div>
                                )}
                                <div>
                                    <label className={labelCls}>Base Price / MRP (₹)</label>
                                    <input
                                        type="number"
                                        {...register(`${tier.key}Price`, { required: t('productForm.priceRequired') })}
                                        className={errors[`${tier.key}Price`] ? inputError : inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>{t('productForm.discount')} (%)</label>
                                    <input
                                        type="number"
                                        min={0}
                                        max={100}
                                        {...register(`${tier.key}Discount`, { required: t('productForm.discountRequired') })}
                                        className={errors[`${tier.key}Discount`] ? inputError : inputBase}
                                    />
                                </div>
                                <div>
                                    <label className={labelCls}>{t('productForm.stock')}</label>
                                    <input
                                        type="number"
                                        {...register(`${tier.key}Stock`, { required: t('productForm.stockRequired') })}
                                        className={errors[`${tier.key}Stock`] ? inputError : inputBase}
                                    />
                                </div>
                            </div>

                            {/* Live Sale Price Preview */}
                            <SalePricePreview 
                                basePrice={tierWatchMap[tier.key].price} 
                                discount={tierWatchMap[tier.key].discount} 
                            />
                        </div>
                    ))}
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