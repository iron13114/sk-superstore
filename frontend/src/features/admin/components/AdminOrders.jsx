import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersAsync, resetOrderUpdateStatus, selectOrderUpdateStatus, selectOrders, updateOrderByIdAsync } from '../../order/OrderSlice'
import { useForm } from "react-hook-form"
import { noOrdersAnimation } from '../../../assets/index'
import Lottie from 'lottie-react'
import { showToast } from '../../../utils/toast';

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

export const AdminOrders = () => {

    const dispatch = useDispatch()
    const orders = useSelector(selectOrders)
    const [editIndex, setEditIndex] = useState(-1)
    const orderUpdateStatus = useSelector(selectOrderUpdateStatus)
    const is1620 = useMediaQuery('(max-width: 1620px)')
    const is480 = useMediaQuery('(max-width: 480px)')

    const { register, handleSubmit } = useForm()

    useEffect(() => {
        dispatch(getAllOrdersAsync())
    }, [dispatch])

    useEffect(() => {
        if (orderUpdateStatus === 'fulfilled') {
            showToast.success("Status updated")
        }
        else if (orderUpdateStatus === 'rejected') {
            showToast.error("Error updating order status")
        }
    }, [orderUpdateStatus])

    useEffect(() => {
        return () => {
            dispatch(resetOrderUpdateStatus())
        }
    })

    const handleUpdateOrder = (data) => {
        const update = { ...data, _id: orders[editIndex]._id }
        setEditIndex(-1)
        dispatch(updateOrderByIdAsync(update))
    }

    const editOptions = ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled']

    const getStatusColor = (status) => {
        if (status === 'Pending') {
            return 'bg-[#dfc9f7] text-[#7c59a4]'
        }
        else if (status === 'Dispatched') {
            return 'bg-[#feed80] text-[#927b1e]'
        }
        else if (status === 'Out for delivery') {
            return 'bg-[#AACCFF] text-[#4793AA]'
        }
        else if (status === 'Delivered') {
            return 'bg-[#b3f5ca] text-[#548c6a]'
        }
        else if (status === 'Cancelled') {
            return 'bg-[#fac0c0] text-[#cc6d72]'
        }
        return 'bg-gray-200 text-gray-700'
    }

    return (
        <div className="flex justify-center items-center">
            <div className={`mt-12 mb-8 ${is1620 ? 'w-[95vw]' : 'w-auto'}`}>

                {orders.length ? (
                    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
                        <form onSubmit={handleSubmit(handleUpdateOrder)}>
                            <table className="min-w-full text-sm text-left">
                                <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                                    <tr className="border-b">
                                        <th className="px-6 py-3">Order</th>
                                        <th className="px-6 py-3">Id</th>
                                        <th className="px-6 py-3">Item</th>
                                        <th className="px-6 py-3 text-right">Total Amount</th>
                                        <th className="px-6 py-3 text-right">Shipping Address</th>
                                        <th className="px-6 py-3 text-right">Payment Method</th>
                                        <th className="px-6 py-3 text-right">Order Date</th>
                                        <th className="px-6 py-3 text-left">Customer</th>
                                        <th className="px-6 py-3 text-right">Status</th>
                                        <th className="px-6 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {orders.length && orders.map((order, index) => (
                                        <tr key={order._id} className="border-b hover:bg-gray-50">
                                            <td className="px-6 py-4">{index}</td>
                                            <td className="px-6 py-4">{order._id}</td>
                                            <td className="px-6 py-4">
                                                {order.item.map((product, idx) => (
                                                    <div key={idx} className="mt-2 flex flex-row items-center gap-2">
                                                        <img
                                                            src={product.product.thumbnail}
                                                            alt=""
                                                            className="w-10 h-10 rounded-full object-cover"
                                                        />
                                                        <p>{product.product.title}</p>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className="px-6 py-4 text-right">₹{order.total}</td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex flex-col">
                                                    <p>{order.address[0]?.street}</p>
                                                    <p>{order.address[0]?.city}</p>
                                                    <p>{order.address[0]?.state}</p>
                                                    <p>{order.address[0]?.postalCode}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">{order.paymentMode}</td>
                                            <td className="px-6 py-4 text-right">{new Date(order.createdAt).toDateString()}</td>

                                            {/* Customer column - Guest or Registered */}
                                            <td className="px-6 py-4">
                                                {order.user ? (
                                                    <span className="text-sm text-gray-700">Registered User</span>
                                                ) : (
                                                    <span className="text-sm text-orange-600">
                                                        <span className="font-medium">Guest</span><br />
                                                        <span className="text-xs">📧 {order.guestEmail || 'N/A'}</span><br />
                                                        <span className="text-xs">📞 {order.guestPhone || 'N/A'}</span>
                                                    </span>
                                                )}
                                            </td>

                                            {/* Status */}
                                            <td className="px-6 py-4 text-right">
                                                {editIndex === index ? (
                                                    <select
                                                        defaultValue={order.status}
                                                        {...register('status', { required: 'Status is required' })}
                                                        className="w-32 border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                    >
                                                        {editOptions.map((option) => (
                                                            <option key={option} value={option}>{option}</option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                )}
                                            </td>

                                            {/* Actions */}
                                            <td className="px-6 py-4 text-right">
                                                {editIndex === index ? (
                                                    <button type="submit" className="p-1 hover:bg-gray-200 rounded transition-colors">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                        </svg>
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => setEditIndex(index)}
                                                        className="p-1 hover:bg-gray-200 rounded transition-colors"
                                                    >
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                        </svg>
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </form>
                    </div>
                ) : (
                    <div className={`${is480 ? 'w-auto' : 'w-[30rem]'} flex justify-center`}>
                        <div className="flex flex-col gap-4">
                            <Lottie animationData={noOrdersAnimation} />
                            <p className="text-center text-lg font-normal text-gray-700">There are no orders currently</p>
                        </div>
                    </div>
                )}

            </div>
        </div>
    )
}