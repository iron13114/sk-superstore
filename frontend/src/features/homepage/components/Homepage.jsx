import React, { useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { fetchCategoryTreeAsync, selectCategoryTree } from '../../categories/CategoriesSlice'
import { fetchProductsAsync, selectProducts } from '../../products/ProductSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { 
    createWishlistItemAsync, 
    deleteWishlistItemByIdAsync, 
    selectWishlistItems, 
    loadGuestWishlist, 
    addGuestItem, 
    removeGuestItem 
} from '../../wishlist/WishlistSlice'

import { ProductList } from '../../products/components/ProductList'
import { ScrollReveal } from '../../../components/ScrollReveal'

import { HeroSection } from './HeroSection'
import { CategoryGroups } from './CategoryGroups'
import { FeaturedProducts } from './FeaturedProducts'
import { WholesaleSections } from './WholesaleSections'
import { BrandsSection } from './BrandsSection'
export const Homepage = () => {
    const dispatch = useDispatch()
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
    
    // Selectors
    const categoryTree = useSelector(selectCategoryTree)
    const products = useSelector(selectProducts)
    const wishlistItems = useSelector(selectWishlistItems)
    const loggedInUser = useSelector(selectLoggedInUser)
    const productListRef = useRef(null)

    // Initial data fetch
    useEffect(() => {
        dispatch(fetchCategoryTreeAsync())
        dispatch(fetchProductsAsync({ pagination: { page: 1, limit: 15 } }))
        if (!loggedInUser) dispatch(loadGuestWishlist())
    }, [dispatch, loggedInUser])

    useEffect(() => {
        const categoryQuery = searchParams.get('category')
        if (categoryQuery && productListRef.current) {
            const timer = setTimeout(() => {
                productListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
            return () => clearTimeout(timer)
        }
    }, [searchParams])

    const scrollToProducts = useCallback(() => {
        productListRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [])

    const handleAddRemoveFromWishlist = useCallback((e, productId) => {
        if (loggedInUser) {
            if (e.target.checked) {
                dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: productId }))
            } else {
                const index = wishlistItems.findIndex((item) => item.product?._id === productId)
                if (index !== -1) dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
            }
        } else {
            if (e.target.checked) {
                const product = products.find(p => p._id === productId)
                if (product) {
                    dispatch(addGuestItem({ _id: 'guest_' + Date.now(), product, note: '' }))
                }
            } else {
                const index = wishlistItems.findIndex((item) => item.product?._id === productId)
                if (index !== -1) dispatch(removeGuestItem(wishlistItems[index]._id))
            }
        }
    }, [dispatch, loggedInUser, wishlistItems, products])

    const productList = Array.isArray(products) ? products : []
    const featuredProducts = productList.slice(0, 4)

    return (
        <div className="flex flex-col w-full bg-white">
            {/* 1. Hero Section (Self-animating) */}
            <HeroSection 
                featuredProducts={featuredProducts} 
                onShopNowClick={scrollToProducts} 
            />

            {/* 2. Parent Category Groups */}
            <ScrollReveal y={36}>
                <CategoryGroups 
                    categoryTree={categoryTree} 
                    onAddRemoveWishlist={handleAddRemoveFromWishlist} 
                />
            </ScrollReveal>

            {/* ===== BRANDS WE STOCK ===== */}
            <ScrollReveal y={24}>
                <BrandsSection />
            </ScrollReveal>

            {/* 3. Featured Products Grid */}
            {featuredProducts.length > 0 && (
                <ScrollReveal y={36} delay={0.08}>
                    <FeaturedProducts 
                        products={featuredProducts} 
                        onViewAllClick={scrollToProducts} 
                        onAddRemoveWishlist={handleAddRemoveFromWishlist} 
                    />
                </ScrollReveal>
            )}

            {/* 4. Wholesale Perks & Value Props */}
            <ScrollReveal y={36}>
                <WholesaleSections />
            </ScrollReveal>

            {/* 5. Main Product Catalog Section */}
            <div ref={productListRef} id="products-section">
                <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-12 w-full border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4 sm:mb-6">
                        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">
                            {t('homepage.allProducts')}
                        </h2>
                    </div>
                    <ProductList />
                </section>
            </div>
        </div>
    )
}

export default Homepage