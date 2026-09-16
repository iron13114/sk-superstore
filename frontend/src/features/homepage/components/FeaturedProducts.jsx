import React from 'react'
import { useTranslation } from 'react-i18next'
import { ProductCard } from '../../products/components/ProductCard'

export const FeaturedProducts = ({ products = [], onViewAllClick, onAddRemoveWishlist }) => {
    const { t } = useTranslation()

    if (!products || products.length === 0) return null

    return (
        <section className="bg-gray-50 py-6 sm:py-12 w-full border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                        {t('homepage.featuredTitle')}
                    </h2>
                    <button
                        onClick={onViewAllClick}
                        className="text-xs sm:text-sm font-medium text-[#0055A4] hover:text-[#003d7a] transition-colors cursor-pointer"
                    >
                        {t('homepage.viewAll')} →
                    </button>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-1.5 sm:gap-4">
                    {products.map((product) => (
                        <ProductCard
                            key={product._id}
                            id={product._id}
                            title={product.title}
                            thumbnail={product.thumbnail}
                            brand={product.brand?.name || product.brand}
                            price={product.price}
                            stockQuantity={product.stockQuantity}
                            reviews={product.reviews} 
                            handleAddRemoveFromWishlist={onAddRemoveWishlist}
                        />
                    ))}
                </div>
            </div>
        </section>
    )
}