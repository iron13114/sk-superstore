import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { clearSelectedProduct, fetchProductByIdAsync, resetProductUpdateStatus, selectProductUpdateStatus, selectSelectedProduct, updateProductByIdAsync } from '../../products/ProductSlice'
import { Button, FormControl, InputLabel, MenuItem, Select, Stack, TextField, Typography, useMediaQuery, useTheme } from '@mui/material'
import { useForm, Controller } from "react-hook-form"
import { selectBrands } from '../../brands/BrandSlice'
import { selectCategories } from '../../categories/CategoriesSlice'
import { toast } from 'react-toastify'

export const ProductUpdate = () => {

    const { id } = useParams()
    const dispatch = useDispatch()
    const selectedProduct = useSelector(selectSelectedProduct)
    const brands = useSelector(selectBrands)
    const categories = useSelector(selectCategories)
    const productUpdateStatus = useSelector(selectProductUpdateStatus)
    const navigate = useNavigate()
    const theme = useTheme()
    const is1100 = useMediaQuery(theme.breakpoints.down(1100))
    const is480 = useMediaQuery(theme.breakpoints.down(480))

    // Pass `values` directly so React Hook Form updates automatically when `selectedProduct` is fetched
    const { register, handleSubmit, control, formState: { errors } } = useForm({
        values: selectedProduct ? {
            title: selectedProduct.title || '',
            brand: selectedProduct.brand?._id || selectedProduct.brand || '',
            category: selectedProduct.category?._id || selectedProduct.category || '',
            description: selectedProduct.description || '',
            price: selectedProduct.price || '',
            discountPercentage: selectedProduct.discountPercentage || '',
            stockQuantity: selectedProduct.stockQuantity || '',
            thumbnail: selectedProduct.thumbnail || '',
            image0: selectedProduct.images?.[0] || '',
            image1: selectedProduct.images?.[1] || '',
            image2: selectedProduct.images?.[2] || '',
            image3: selectedProduct.images?.[3] || '',
        } : {}
    })

    useEffect(() => {
        if (id) {
            dispatch(fetchProductByIdAsync(id))
        }
    }, [id, dispatch])

useEffect(() => {
    console.log("Current productUpdateStatus:", productUpdateStatus);
    
    if (productUpdateStatus === 'fulfilled' || productUpdateStatus === 'fullfilled') {
        toast.success("Product Updated");
        navigate("/admin/dashboard");
    } else if (productUpdateStatus === 'rejected') {
        toast.error("Error updating product, please try again later");
    }
}, [productUpdateStatus, navigate]);

    useEffect(() => {
        return () => {
            dispatch(clearSelectedProduct())
            dispatch(resetProductUpdateStatus())
        }
    }, [dispatch])

const handleProductUpdate = (data) => {
    const rawImages = [data?.image0, data?.image1, data?.image2, data?.image3];
    const validImages = rawImages.filter((img) => img && img.trim() !== "");

    const productUpdate = {
        ...data,
        price: Number(data.price),
        discountPercentage: Number(data.discountPercentage),
        stockQuantity: Number(data.stockQuantity),
        _id: selectedProduct._id,
        images: validImages.length > 0 ? validImages : [data.thumbnail]
    };

    delete productUpdate.image0;
    delete productUpdate.image1;
    delete productUpdate.image2;
    delete productUpdate.image3;

    console.log("Sending payload to Redux:", productUpdate);
    dispatch(updateProductByIdAsync(productUpdate));
}

    // Diagnostics: Logs form errors if submission is blocked
    const handleFormError = (errors) => {
        console.error("Form Validation Errors:", errors);
        toast.error("Please fill in all required fields!");
    }

    return (
        <Stack p={'0 16px'} justifyContent={'center'} alignItems={'center'} flexDirection={'row'}>
            {selectedProduct &&
                <Stack 
                    width={is1100 ? "100%" : "60rem"} 
                    rowGap={4} 
                    mt={is480 ? 4 : 6} 
                    mb={6} 
                    component={'form'} 
                    noValidate 
                    onSubmit={handleSubmit(handleProductUpdate, handleFormError)}
                >
                    {/* field area */}
                    <Stack rowGap={3}>
                        <Stack>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Title</Typography>
                            <TextField 
                                {...register("title", { required: 'Title is required' })} 
                                error={!!errors.title}
                                helperText={errors.title?.message}
                            />
                        </Stack>

                        <Stack flexDirection={'row'} columnGap={2}>
                            <FormControl fullWidth error={!!errors.brand}>
                                <InputLabel id="brand-selection">Brand</InputLabel>
                                <Controller
                                    name="brand"
                                    control={control}
                                    rules={{ required: "Brand is required" }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select {...field} labelId="brand-selection" label="Brand">
                                            {brands.map((brand) => (
                                                <MenuItem key={brand._id} value={brand._id}>{brand.name}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>

                            <FormControl fullWidth error={!!errors.category}>
                                <InputLabel id="category-selection">Category</InputLabel>
                                <Controller
                                    name="category"
                                    control={control}
                                    rules={{ required: "Category is required" }}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <Select {...field} labelId="category-selection" label="Category">
                                            {categories.map((category) => (
                                                <MenuItem key={category._id} value={category._id}>{category.name}</MenuItem>
                                            ))}
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Stack>

                        <Stack>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Description</Typography>
                            <TextField 
                                multiline rows={4} 
                                {...register("description", { required: "Description is required" })} 
                                error={!!errors.description}
                                helperText={errors.description?.message}
                            />
                        </Stack>

                        <Stack flexDirection={'row'} columnGap={2}>
                            <Stack flex={1}>
                                <Typography variant='h6' fontWeight={400} gutterBottom>Price</Typography>
                                <TextField 
                                    type='number' 
                                    {...register("price", { required: "Price is required" })} 
                                    error={!!errors.price}
                                    helperText={errors.price?.message}
                                />
                            </Stack>
                            <Stack flex={1}>
                                <Typography variant='h6' fontWeight={400} gutterBottom>Discount {is480 ? "%" : "Percentage"}</Typography>
                                <TextField 
                                    type='number' 
                                    {...register("discountPercentage", { required: "Discount percentage is required" })} 
                                    error={!!errors.discountPercentage}
                                    helperText={errors.discountPercentage?.message}
                                />
                            </Stack>
                        </Stack>

                        <Stack>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Stock Quantity</Typography>
                            <TextField 
                                type='number' 
                                {...register("stockQuantity", { required: "Stock Quantity is required" })} 
                                error={!!errors.stockQuantity}
                                helperText={errors.stockQuantity?.message}
                            />
                        </Stack>
                        <Stack>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Type</Typography>
                            <TextField 
                                {...register("type", {
                                    required: "Type is required",
                                    value: selectedProduct?.type
                                })}
                            />
                        </Stack>
                        <Stack>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Thumbnail</Typography>
                            <TextField 
                                {...register("thumbnail", { required: "Thumbnail is required" })} 
                                error={!!errors.thumbnail}
                                helperText={errors.thumbnail?.message}
                            />
                        </Stack>

                        <Stack>
                            <Typography variant='h6' fontWeight={400} gutterBottom>Product Images</Typography>
                            <Stack rowGap={2}>
                                <TextField 
                                    label="Image 1 (Main)" 
                                    {...register("image0", { required: "Image 1 is required" })} 
                                    error={!!errors.image0}
                                    helperText={errors.image0?.message}
                                />
                                <TextField label="Image 2 (Optional)" {...register("image1")} />
                                <TextField label="Image 3 (Optional)" {...register("image2")} />
                                <TextField label="Image 4 (Optional)" {...register("image3")} />
                            </Stack>
                        </Stack>
                    </Stack>

                    {/* action area */}
                    <Stack flexDirection={'row'} alignSelf={'flex-end'} columnGap={is480 ? 1 : 2}>
                        <Button size={is480 ? 'medium' : 'large'} variant='contained' type='submit'>Update</Button>
                        <Button size={is480 ? 'medium' : 'large'} variant='outlined' color='error' component={Link} to={'/admin/dashboard'}>Cancel</Button>
                    </Stack>
                </Stack>
            }
        </Stack>
    )
}