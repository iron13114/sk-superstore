import { axiosi } from "../../config/axios";

export const addProduct=async(data)=>{
    try {
        const res=await axiosi.post('/products',data)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const fetchProducts = async (filters = {}) => {
    let queryString = '';

    // 1. Redux drops the search term
    let searchTerm = filters.search || filters.q || filters.filter?.search || filters.filter?.q;
    
    if (!searchTerm && typeof window !== 'undefined') {
        const urlParams = new URLSearchParams(window.location.search);
        searchTerm = urlParams.get('q') || urlParams.get('search');
    }

    if (searchTerm) {
        queryString += `search=${encodeURIComponent(searchTerm)}&q=${encodeURIComponent(searchTerm)}&`;
    }

    // 2. Brands
    let brands = filters.brand || filters.filter?.brand;
    if (brands) {
        const brandArray = Array.isArray(brands) ? brands : brands.split(',');
        brandArray.forEach(b => { if(b) queryString += `brand=${b}&` });
    }

    // 3. Categories
    let categories = filters.category || filters.filter?.category;
    if (categories) {
        const catArray = Array.isArray(categories) ? categories : categories.split(',');
        catArray.forEach(c => { if(c) queryString += `category=${c}&` });
    }

    // 4. Pagination
    const page = filters.pagination?.page || filters._page || 1;
    const limit = filters.pagination?.limit || filters._limit || 24;
    queryString += `page=${page}&limit=${limit}&`;

    // 5. Sort
    if (filters.sort) {
        const sortField = filters.sort.sort || filters.sort._sort;
        const sortOrder = filters.sort.order || filters.sort._order || 'asc';
        if (sortField) queryString += `sort=${sortField}&order=${sortOrder}&`;
    }

    if (queryString.endsWith('&')) {
        queryString = queryString.slice(0, -1);
    }

    try {        
        const res = await axiosi.get(`/products?${queryString}`);
        const totalResults = res.headers["x-total-count"] || res.headers.get?.("X-Total-Count") || 0;
        
        return { data: res.data, totalResults };
    } catch (error) {
        throw error.response?.data || error;
    }
}

export const fetchProductById=async(id)=>{
    try {
        const res=await axiosi.get(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const updateProductById=async(update)=>{
    try {
        const res=await axiosi.patch(`/products/${update._id}`,update)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const undeleteProductById=async(id)=>{
    try {
        const res=await axiosi.patch(`/products/undelete/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
export const deleteProductById=async(id)=>{
    try {
        const res=await axiosi.delete(`/products/${id}`)
        return res.data
    } catch (error) {
        throw error.response.data
    }
}
