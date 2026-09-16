import React, { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
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

import { HeroSection } from './HeroSection'
import { CategoryGroups } from './CategoryGroups'
import { FeaturedProducts } from './FeaturedProducts'
import { WholesaleSections } from './WholesaleSections'

export const Homepage = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { t } = useTranslation()
    
    const categoryTree = useSelector(selectCategoryTree)
    const products = useSelector(selectProducts)
    const wishlistItems = useSelector(selectWishlistItems)
    const loggedInUser = useSelector(selectLoggedInUser)
    const productListRef = useRef(null)

    useEffect(() => {
        dispatch(fetchCategoryTreeAsync())
        dispatch(fetchProductsAsync({ pagination: { page: 1, limit: 8 } }))
        if (!loggedInUser) dispatch(loadGuestWishlist())
    }, [dispatch, loggedInUser])

    useEffect(() => {
        const categoryQuery = searchParams.get('category')
        if (categoryQuery && productListRef.current) {
            setTimeout(() => {
                productListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }, 100)
        }
    }, [searchParams])

    const handleCategoryClick = (categoryId) => {
        navigate(`/?category=${categoryId}`)
    }

    const scrollToProducts = () => {
        productListRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    const handleAddRemoveFromWishlist = (e, productId) => {
        if (loggedInUser) {
            if (e.target.checked) {
                dispatch(createWishlistItemAsync({ user: loggedInUser._id, product: productId }))
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id))
            }
        } else {
            if (e.target.checked) {
                const product = products.find(p => p._id === productId)
                if (product) {
                    dispatch(addGuestItem({ _id: 'guest_' + Date.now(), product, note: '' }))
                }
            } else {
                const index = wishlistItems.findIndex((item) => item.product._id === productId)
                if (index !== -1) dispatch(removeGuestItem(wishlistItems[index]._id))
            }
        }
    }

    const productList = Array.isArray(products) ? products : []
    const featuredProducts = productList.slice(0, 4)

    return (
        <div className="flex flex-col w-full bg-white">
            <HeroSection 
                featuredProducts={featuredProducts} 
                onShopNowClick={scrollToProducts} 
            />

            <CategoryGroups 
                categoryTree={categoryTree} 
                onAddRemoveWishlist={handleAddRemoveFromWishlist} 
            />

            <FeaturedProducts 
                products={featuredProducts} 
                onViewAllClick={scrollToProducts} 
                onAddRemoveWishlist={handleAddRemoveFromWishlist} 
            />

            <WholesaleSections />

            {/* ===== FULL PRODUCT GRID ===== */}
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