import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {fetchProductByIdAsync,selectProductFetchStatus, selectSelectedProduct } from '../ProductSlice'
import { Box, Checkbox, Rating, Stack, Typography, useMediaQuery, Button, Paper, Divider } from '@mui/material'
import { addToCartAsync,selectCartItemAddStatus} from '../../cart/CartSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'
import { fetchReviewsByProductIdAsync,selectReviewFetchStatus, selectReviews, } from '../../review/ReviewSlice'
import { Reviews } from '../../review/components/Reviews'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite'
import { createWishlistItemAsync, deleteWishlistItemByIdAsync, selectWishlistItems } from '../../wishlist/WishlistSlice'
import { useTheme } from '@mui/material'
import MobileStepper from '@mui/material/MobileStepper';
import Lottie from 'lottie-react'
import { loadingAnimation } from '../../../assets'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay } from 'swiper/modules'

// Swiper CSS
import 'swiper/css'

export const ProductDetails = () => {
    const { id } = useParams()
    const product = useSelector(selectSelectedProduct)
    const loggedInUser = useSelector(selectLoggedInUser)
    const dispatch = useDispatch()
    const cartItemAddStatus = useSelector(selectCartItemAddStatus)
    
    // Wholesale packaging tier state tracking
    const [quantities, setQuantities] = useState({
        single: 0,
        pack: 0,
        carton: 0
    })

    const reviews = useSelector(selectReviews)
    const [setSelectedImageIndex] = useState(0)
    const theme = useTheme()
    const is1420 = useMediaQuery(theme.breakpoints.down(1420))
    const is990 = useMediaQuery(theme.breakpoints.down(990))
    const is840 = useMediaQuery(theme.breakpoints.down(840))
    const is500 = useMediaQuery(theme.breakpoints.down(500))
    const is480 = useMediaQuery(theme.breakpoints.down(480))
    const is340 = useMediaQuery(theme.breakpoints.down(340))

    const wishlistItems = useSelector(selectWishlistItems)
    const isProductAlreadyinWishlist = wishlistItems.some((item) => item.product._id === id)
    const productFetchStatus = useSelector(selectProductFetchStatus)
    const reviewFetchStatus = useSelector(selectReviewFetchStatus)

    const totalReviewRating = reviews.reduce((acc, review) => acc + review.rating, 0)
    const totalReviews = reviews.length
    const averageRating = parseInt(Math.ceil(totalReviewRating / totalReviews))

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "instant" })
    }, [])
    
    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
            dispatch(fetchReviewsByProductIdAsync(id))
        }
    })

    useEffect(() => {
        if (cartItemAddStatus === 'fulfilled') {
            toast.success("Items added to cart successfully")
        } else if (cartItemAddStatus === 'rejected') {
            toast.error('Error adding wholesale items to cart')
        }
    }, [cartItemAddStatus])

    // Dynamic Wholesale Multi-Add Action Handler
    const handleAddWholeSaleToCart = () => {
        const selectedTiers = Object.entries(quantities).filter(([_, qty]) => qty > 0);
        
        if (selectedTiers.length === 0) {
            toast.info("Please select a quantity for at least one tier option.");
            return;
        }

        // Loops through and dispatches all selected variations (single, pack, carton)
        selectedTiers.forEach(([tier, qty]) => {
            const wholesaleItem = {
                user: loggedInUser._id,
                product: id,
                quantity: qty,
                packagingTier: tier // Passes the item variation grouping metadata cleanly
            };
            dispatch(addToCartAsync(wholesaleItem));
        });

        // Reset inputs back down to zero safely
        setQuantities({ single: 0, pack: 0, carton: 0 });
    }

    const handleUpdateTierQty = (tier, operation) => {
        setQuantities(prev => {
            const currentQty = prev[tier];
            if (operation === 'dec' && currentQty > 0) {
                return { ...prev, [tier]: currentQty - 1 };
            }
            if (operation === 'inc' && currentQty < 50) {
                return { ...prev, [tier]: currentQty + 1 };
            }
            return prev;
        });
    }

    const handleAddRemoveFromWishlist = (e) => {
        if (e.target.checked) {
            const data = { user: loggedInUser?._id, product: id }
            dispatch(createWishlistItemAsync(data))
        } else if (!e.target.checked) {
            const index = wishlistItems.findIndex((item) => item.product._id === id)
            dispatch(deleteWishlistItemByIdAsync(wishlistItems[index]._id));
        }
    }

    // Swiper instance ref & Active Step state
    const [activeStep, setActiveStep] = useState(0);
    const swiperRef = useRef(null);
    const maxSteps = product?.images ? product.images.length : 0;
    
    const handleNext = () => {
        if (swiperRef.current) swiperRef.current.slideNext();
    };
    
    const handleBack = () => {
        if (swiperRef.current) swiperRef.current.slidePrev();
    };

    // Wholesale Price Multipliers
    const getTierPrice = (basePrice, tier) => {
        if (tier === 'pack') return (basePrice * 10 * 0.95).toFixed(2); // 5% discount for a pack of 10
        if (tier === 'carton') return (basePrice * 50 * 0.90).toFixed(2); // 10% discount for a bulk carton of 50
        return basePrice;
    }

    return (
        <>
        {!(productFetchStatus === 'rejected' && reviewFetchStatus === 'rejected') && <Stack sx={{ justifyContent: 'center', alignItems: 'center', mb: '2rem', rowGap: "2rem" }}>
            {
                (productFetchStatus || reviewFetchStatus) === 'pending' ?
                <Stack width={is500 ? "35vh" : '25rem'} height={'calc(100vh - 4rem)'} justifyContent={'center'} alignItems={'center'}>
                    <Lottie animationData={loadingAnimation} />
                </Stack>
                :
                <Stack>
                    <Stack width={is480 ? "auto" : is1420 ? "auto" : '88rem'} p={is480 ? 2 : 0} height={is840 ? "auto" : "50rem"} rowGap={5} mt={is840 ? 0 : 5} justifyContent={'center'} mb={5} flexDirection={is840 ? "column" : "row"} columnGap={is990 ? "2rem" : "5rem"}>

                        {/* Left Side: Images */}
                        <Stack sx={{ flexDirection: "row", columnGap: "2.5rem", alignSelf: "flex-start", height: "100%" }}>
                            {!is1420 && <Stack sx={{ display: "flex", rowGap: '1.5rem', height: "100%", overflowY: "scroll" }}>
                                {product && product.images.map((image, index) => (
                                    <motion.div key={index} whileHover={{ scale: 1.1 }} whileTap={{ scale: 1 }} style={{ width: "200px", cursor: "pointer" }} onClick={() => setSelectedImageIndex(index)}>
                                    </motion.div>
                                ))}
                            </Stack>}
                            
                            <Stack mt={is480 ? "0rem" : '5rem'}>
                                {is1420 ?
                                    <Stack width={is480 ? "100%" : is990 ? '400px' : "500px"}>
                                        <Swiper
                                            modules={[Autoplay]}
                                            autoplay={{
                                                delay: 3000,
                                                disableOnInteraction: false,
                                            }}
                                            onSwiper={(swiper) => (swiperRef.current = swiper)}
                                            onSlideChange={(swiper) => setActiveStep(swiper.activeIndex)}
                                            slidesPerView={1}
                                            spaceBetween={0}
                                        >
                                            {product?.images.map((image, index) => (
                                                <SwiperSlide key={index}>
                                                    <Box component="img" sx={{ width: '100%', objectFit: "contain", overflow: "hidden", aspectRatio: 1 / 1 }} src={image} alt={product?.title} />
                                                </SwiperSlide>
                                            ))}
                                        </Swiper>
                                        <MobileStepper steps={maxSteps} position="static" activeStep={activeStep} nextButton={<Button size="small" onClick={handleNext} disabled={activeStep === maxSteps - 1} >Next</Button>} backButton={<Button size="small" onClick={handleBack} disabled={activeStep === 0}>Back</Button>} />
                                    </Stack>
                                    :
                                    <div style={{ width: "100%" }}>
                                    </div>
                                }
                            </Stack>
                        </Stack>

                        {/* Right Side: Product Details & Wholesale Purchase Card */}
                        <Stack rowGap={"1.5rem"} width={is480 ? "100%" : '30rem'}>
                            <Stack rowGap={".5rem"}>
                                <Typography variant='h4' fontWeight={600}>{product?.title}</Typography>
                                <Stack sx={{ flexDirection: "row", columnGap: is340 ? ".5rem" : "1rem", alignItems: "center", flexWrap: 'wrap', rowGap: '1rem' }}>
                                    <Rating value={averageRating} readOnly />
                                    <Typography>( {totalReviews === 0 ? "No reviews" : totalReviews === 1 ? `${totalReviews} Review` : `${totalReviews} Reviews`} )</Typography>
                                    <Typography color={product?.stockQuantity <= 10 ? "error" : "green"}>{product?.stockQuantity <= 10 ? `Only ${product?.stockQuantity} left` : "In Bulk Stock"}</Typography>
                                </Stack>
                            </Stack>

                            <Stack rowGap={".8rem"}>
                                <Typography variant="body1" color="text.secondary">{product?.description}</Typography>
                                <Divider />
                            </Stack>

                            {!loggedInUser?.isAdmin && (
                                <Paper variant="outlined" sx={{ p: 3, borderRadius: '8px', bgcolor: '#f9f9f9' }}>
                                    <Typography variant="h6" fontWeight={600} mb={2}>Select Wholesale Supply Options:</Typography>

                                    {/* Wholesale Options Tiers Grid */}
                                    <Stack spacing={2.5}>
                                        {['single', 'pack', 'carton'].map((tier) => (
                                            <Stack key={tier} flexDirection="row" justifyContent="space-between" alignItems="center">
                                                <Box>
                                                    <Typography variant="subtitle1" fontWeight={500} sx={{ textTransform: 'capitalize' }}>
                                                        {tier === 'single' ? 'Single Unit' : tier === 'pack' ? 'Pack (10 Units)' : 'Carton (50 Units)'}
                                                    </Typography>
                                                    <Typography variant="body2" color="primary.main" fontWeight={600}>
                                                        ₹{getTierPrice(product?.price || 0, tier)}
                                                    </Typography>
                                                </Box>

                                                {/* Tier Quantity Counter Controls */}
                                                <Stack flexDirection="row" alignItems="center">
                                                    <Button 
                                                        variant="outlined" 
                                                        size="small"
                                                        onClick={() => handleUpdateTierQty(tier, 'dec')}
                                                        sx={{ minWidth: '35px', p: 0.5, fontWeight: 'bold' }}
                                                    >
                                                        -
                                                    </Button>
                                                    <Typography sx={{ mx: 2, minWidth: '20px', textAlign: 'center', fontWeight: 500 }}>
                                                        {quantities[tier]}
                                                    </Typography>
                                                    <Button 
                                                        variant="outlined" 
                                                        size="small"
                                                        onClick={() => handleUpdateTierQty(tier, 'inc')}
                                                        sx={{ minWidth: '35px', p: 0.5, fontWeight: 'bold' }}
                                                    >
                                                        +
                                                    </Button>
                                                </Stack>
                                            </Stack>
                                        ))}
                                    </Stack>

                                    <Divider sx={{ my: 3 }} />

                                    {/* Add to Cart Actions Footer Block */}
                                    <Stack flexDirection="row" columnGap={2} alignItems="center">
                                        <Button 
                                            fullWidth
                                            variant="contained" 
                                            onClick={handleAddWholeSaleToCart}
                                            sx={{ backgroundColor: "black", color: "white", py: 1.5, borderRadius: '8px', '&:hover': { backgroundColor: '#222' } }}
                                        >
                                            Add Wholesale Selection To Cart
                                        </Button>
                                        
                                        <Box sx={{ border: "1px solid #ccc", borderRadius: "8px", p: 0.5, display: "flex" }}>
                                            <Checkbox checked={isProductAlreadyinWishlist} onChange={handleAddRemoveFromWishlist} icon={<FavoriteBorder />} checkedIcon={<Favorite sx={{ color: 'red' }} />} />
                                        </Box>
                                    </Stack>
                                </Paper>
                            )}
                        </Stack>
                    </Stack>

                    <Stack width={is1420 ? "auto" : '88rem'} p={is480 ? 2 : 0}>
                        <Reviews productId={id} averageRating={averageRating} />
                    </Stack>
                </Stack>
            }
        </Stack>}
        </>
    )
}