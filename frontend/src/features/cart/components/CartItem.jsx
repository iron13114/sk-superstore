import React from 'react'
import { useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Stack, Paper, Typography, Button, IconButton, Chip } from '@mui/material'
import RemoveIcon from '@mui/icons-material/Remove'
import AddIcon from '@mui/icons-material/Add'
import { useTheme, useMediaQuery } from '@mui/material'
import { deleteCartItemByIdAsync, updateCartItemByIdAsync } from '../../cart/CartSlice'

export const CartItem = ({ 
    id, 
    title, 
    brand, 
    price, 
    quantity, 
    thumbnail, 
    productId, 
    packagingTier,
    variantLabel
}) => {
    const dispatch = useDispatch()
    const theme = useTheme()
    const is900 = useMediaQuery(theme.breakpoints.down(900))
    const is552 = useMediaQuery(theme.breakpoints.down(552))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    const handleProductRemove = () => {
        dispatch(deleteCartItemByIdAsync(id))
    }

    const handleAddQty = () => {
        dispatch(updateCartItemByIdAsync({ _id: id, quantity: quantity + 1 }))
    }

    const handleRemoveQty = () => {
        if (quantity <= 1) {
            dispatch(deleteCartItemByIdAsync(id))
        } else {
            dispatch(updateCartItemByIdAsync({ _id: id, quantity: quantity - 1 }))
        }
    }

    return (
        <Stack bgcolor={'white'} component={is900 ? '' : Paper} p={is900 ? 0 : 2} elevation={1} flexDirection={'row'} justifyContent={'space-between'} alignItems={'center'}>
            
            {/* image and details */}
            <Stack flexDirection={'row'} rowGap={'1rem'} alignItems={'center'} columnGap={2} flexWrap={'wrap'}>

                <Stack width={is552 ? "auto" : '200px'} height={is552 ? "auto" : '200px'} component={Link} to={`/product-details/${productId}`}>
                    <img style={{ width: "100%", height: is552 ? "auto" : "100%", aspectRatio: is552 ? 1 / 1 : '', objectFit: 'contain' }} src={thumbnail} alt={`${title} image unavailable`} />
                </Stack>

                <Stack>
                    <Typography component={Link} to={`/product-details/${productId}`} sx={{ textDecoration: "none", color: theme.palette.primary.main }} variant='h6' fontWeight={500}>{title}</Typography>
                    
                    <Typography variant='body2' color={'text.secondary'}>{brand}</Typography>
                    
                    {(variantLabel || (packagingTier && packagingTier !== 'single')) && (
                        <Chip 
                            size="small" 
                            label={variantLabel || (packagingTier === 'pack' ? 'Pack (10 Units)' : packagingTier === 'carton' ? 'Carton (50 Units)' : '')}
                            sx={{ mt: 0.5, mb: 0.5, width: 'fit-content', bgcolor: '#f3f4f6', color: '#374151', fontWeight: 500, fontSize: '0.75rem' }}
                        />
                    )}

                    <Typography mt={1}>Quantity</Typography>
                    <Stack flexDirection={'row'} alignItems={'center'}>
                        <IconButton onClick={handleRemoveQty}><RemoveIcon fontSize='small' /></IconButton>
                        <Typography>{quantity}</Typography>
                        <IconButton onClick={handleAddQty}><AddIcon fontSize='small' /></IconButton>
                    </Stack>
                </Stack>
            </Stack>

            {/* price and remove button */}
            <Stack justifyContent={'space-evenly'} alignSelf={is552 ? 'flex-end' : ''} height={'100%'} rowGap={'1rem'} alignItems={'flex-end'}>
                <Typography variant='body2'>₹{price}</Typography>
                <Button size={is480 ? "small" : ""} onClick={handleProductRemove} variant='contained'>Remove</Button>
            </Stack>
        </Stack>
    )
}