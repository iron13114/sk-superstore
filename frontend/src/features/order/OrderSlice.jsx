import { createAsyncThunk, createSlice, createSelector } from '@reduxjs/toolkit'
import { createOrder, getAllOrders, getOrderByUserId, updateOrderById, getOrderById } from './OrderApi'

const initialState = {
    status: "idle",
    orderUpdateStatus: "idle",
    orderFetchStatus: "idle",
    orders: [],
    currentOrder: null,
    errors: null,
    successMessage: null
}

const normalize = (res) => res?.data || res || []

export const createOrderAsync = createAsyncThunk("orders/createOrderAsync", async (order) => {
    const res = await createOrder(order)
    return res?.data || res
})

export const getAllOrdersAsync = createAsyncThunk("orders/getAllOrdersAsync", async () => {
    const res = await getAllOrders()
    return normalize(res)
})

export const getOrderByUserIdAsync = createAsyncThunk("orders/getOrderByUserIdAsync", async (id) => {
    const res = await getOrderByUserId(id)
    return normalize(res)
})

export const updateOrderByIdAsync = createAsyncThunk("orders/updateOrderByIdAsync", async (update) => {
    const res = await updateOrderById(update)
    return res?.data || res
})

export const fetchOrderByIdAsync = createAsyncThunk("orders/fetchOrderByIdAsync", async (orderId) => {
    const res = await getOrderById(orderId)
    return res?.data || res
})

const orderSlice = createSlice({
    name: 'OrderSlice',
    initialState,
    reducers: {
        resetCurrentOrder: (state) => { state.currentOrder = null },
        resetOrderUpdateStatus: (state) => { state.orderUpdateStatus = 'idle' },
        resetOrderFetchStatus: (state) => { state.orderFetchStatus = 'idle' }
    },
    extraReducers: (builder) => {
        builder
            .addCase(createOrderAsync.pending, (state) => { state.status = 'pending' })
            .addCase(createOrderAsync.fulfilled, (state, action) => {
                state.status = 'fulfilled'
                state.orders.push(action.payload)
                state.currentOrder = action.payload
            })
            .addCase(createOrderAsync.rejected, (state, action) => {
                state.status = 'rejected'
                state.errors = action.error
            })
            .addCase(getAllOrdersAsync.pending, (state) => { state.orderFetchStatus = 'pending' })
            .addCase(getAllOrdersAsync.fulfilled, (state, action) => {
                state.orderFetchStatus = 'fulfilled'
                state.orders = action.payload
            })
            .addCase(getAllOrdersAsync.rejected, (state, action) => {
                state.orderFetchStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(getOrderByUserIdAsync.pending, (state) => { state.orderFetchStatus = 'pending' })
            .addCase(getOrderByUserIdAsync.fulfilled, (state, action) => {
                state.orderFetchStatus = 'fulfilled'
                state.orders = action.payload
            })
            .addCase(getOrderByUserIdAsync.rejected, (state, action) => {
                state.orderFetchStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(updateOrderByIdAsync.pending, (state) => { state.orderUpdateStatus = 'pending' })
            .addCase(updateOrderByIdAsync.fulfilled, (state, action) => {
                state.orderUpdateStatus = 'fulfilled'
                const index = state.orders.findIndex((order) => order._id === action.payload._id)
                if (index !== -1) state.orders[index] = action.payload
            })
            .addCase(updateOrderByIdAsync.rejected, (state, action) => {
                state.orderUpdateStatus = 'rejected'
                state.errors = action.error
            })
            .addCase(fetchOrderByIdAsync.pending, (state) => { state.orderFetchStatus = 'pending' })
            .addCase(fetchOrderByIdAsync.fulfilled, (state, action) => {
                state.orderFetchStatus = 'fulfilled'
                state.currentOrder = action.payload
            })
            .addCase(fetchOrderByIdAsync.rejected, (state) => { state.orderFetchStatus = 'rejected' })
    }
})

export const { resetCurrentOrder, resetOrderUpdateStatus, resetOrderFetchStatus } = orderSlice.actions

export const selectOrderStatus = createSelector([(state) => state.OrderSlice?.status], (status) => status || 'idle')
export const selectOrders = createSelector(
    [(state) => state.OrderSlice?.orders],
    (orders) => Array.isArray(orders) ? [...orders] : []
)
export const selectOrdersErrors = createSelector([(state) => state.OrderSlice?.errors], (errors) => errors || null)
export const selectOrdersSuccessMessage = createSelector([(state) => state.OrderSlice?.successMessage], (msg) => msg || null)
export const selectCurrentOrder = createSelector([(state) => state.OrderSlice?.currentOrder], (order) => order || null)
export const selectOrderUpdateStatus = createSelector([(state) => state.OrderSlice?.orderUpdateStatus], (status) => status || 'idle')
export const selectOrderFetchStatus = createSelector([(state) => state.OrderSlice?.orderFetchStatus], (status) => status || 'idle')

export default orderSlice.reducer