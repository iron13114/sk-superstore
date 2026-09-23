import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { useForm } from "react-hook-form"
import { ArrowLeft, Check, Edit2, Package, Truck } from 'lucide-react'
import { 
  getAllOrdersAsync, 
  resetOrderUpdateStatus, 
  selectOrderUpdateStatus, 
  selectOrders, 
  updateOrderByIdAsync 
} from '../../order/OrderSlice'
import { showToast } from '../../../utils/toast'

export const AdminOrders = () => {
  const dispatch = useDispatch()
  const orders = useSelector(selectOrders)
  const orderUpdateStatus = useSelector(selectOrderUpdateStatus)

  const [editIndex, setEditIndex] = useState(-1)
  const { register, handleSubmit } = useForm()

  useEffect(() => {
    dispatch(getAllOrdersAsync())
  }, [dispatch])

  useEffect(() => {
    if (orderUpdateStatus === 'fulfilled') {
      showToast.success("Order status updated")
      dispatch(resetOrderUpdateStatus())
    } else if (orderUpdateStatus === 'rejected') {
      showToast.error("Failed to update status")
      dispatch(resetOrderUpdateStatus())
    }
  }, [orderUpdateStatus, dispatch])

  const handleUpdateOrder = (data) => {
    if (editIndex === -1) return
    const update = { ...data, _id: orders[editIndex]._id }
    dispatch(updateOrderByIdAsync(update))
    setEditIndex(-1)
  }

  const editOptions = ['Pending', 'Dispatched', 'Out for delivery', 'Delivered', 'Cancelled']

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-amber-50 text-amber-700 border-amber-200'
      case 'Dispatched':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'Out for delivery':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200'
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              to="/admin/dashboard"
              className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors shadow-xs"
              title="Back to Dashboard"
            >
              <ArrowLeft size={18} className="text-gray-700" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Wholesale Orders</h1>
              <p className="text-sm text-gray-500">Track fulfillments, customer deliveries, and payment modes</p>
            </div>
          </div>
          <div className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 shadow-xs">
            {orders.length} Total Orders
          </div>
        </div>

        {/* Orders Table */}
        {orders.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 shadow-xs overflow-hidden">
            <form onSubmit={handleSubmit(handleUpdateOrder)}>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Order ID</th>
                      <th className="py-3.5 px-4">Ordered Items</th>
                      <th className="py-3.5 px-4 text-right">Amount</th>
                      <th className="py-3.5 px-4">Payment</th>
                      <th className="py-3.5 px-4">Customer Details</th>
                      <th className="py-3.5 px-4">Shipping City</th>
                      <th className="py-3.5 px-4">Date</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {orders.map((order, index) => {
                      const isEditing = editIndex === index
                      return (
                        <tr key={order._id} className="hover:bg-gray-50/70 transition-colors">
                          {/* Order ID */}
                          <td className="py-3 px-4 font-mono text-xs text-gray-500">
                            #{order._id.slice(-6).toUpperCase()}
                          </td>

                          {/* Items Summary */}
                          <td className="py-3 px-4">
                            <div className="flex flex-col gap-1 max-w-xs">
                              {order.item?.map((prod, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                  <img
                                    src={prod.product?.thumbnail}
                                    alt=""
                                    className="w-7 h-7 rounded border border-gray-200 object-contain bg-white"
                                  />
                                  <span className="text-xs text-gray-800 truncate">
                                    {prod.product?.title} (x{prod.quantity})
                                  </span>
                                </div>
                              ))}
                            </div>
                          </td>

                          {/* Total */}
                          <td className="py-3 px-4 text-right font-bold text-gray-900">
                            ₹{order.total}
                          </td>

                          {/* Payment */}
                          <td className="py-3 px-4">
                            <span className="text-xs uppercase font-medium px-2 py-0.5 bg-gray-100 rounded text-gray-700">
                              {order.paymentMode || 'COD'}
                            </span>
                          </td>

                          {/* Customer */}
                          <td className="py-3 px-4">
                            {order.user ? (
                              <span className="text-xs font-semibold text-gray-800">Registered</span>
                            ) : (
                              <div className="text-xs">
                                <span className="font-semibold text-amber-700">Guest</span>
                                <p className="text-gray-500">{order.guestPhone || order.guestEmail || 'No contact'}</p>
                              </div>
                            )}
                          </td>

                          {/* Shipping City */}
                          <td className="py-3 px-4 text-xs text-gray-600">
                            {order.address?.[0]?.city || 'N/A'}, {order.address?.[0]?.state || ''}
                          </td>

                          {/* Order Date */}
                          <td className="py-3 px-4 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric'
                            })}
                          </td>

                          {/* Status */}
                          <td className="py-3 px-4">
                            {isEditing ? (
                              <select
                                defaultValue={order.status}
                                {...register('status', { required: true })}
                                className="px-2 py-1 text-xs border border-[#0055A4] rounded bg-white focus:outline-none"
                              >
                                {editOptions.map(opt => (
                                  <option key={opt} value={opt}>{opt}</option>
                                ))}
                              </select>
                            ) : (
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getStatusBadge(order.status)}`}>
                                {order.status}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3 px-4 text-right">
                            {isEditing ? (
                              <div className="flex items-center justify-end gap-1">
                                <button
                                  type="submit"
                                  className="p-1.5 bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                                  title="Save"
                                >
                                  <Check size={14} />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setEditIndex(-1)}
                                  className="p-1.5 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
                                  title="Cancel"
                                >
                                  ✕
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setEditIndex(index)}
                                className="p-1.5 text-gray-500 hover:text-[#0055A4] hover:bg-blue-50 rounded transition-colors"
                                title="Edit Status"
                              >
                                <Edit2 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </form>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-16 text-center shadow-xs">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <h3 className="text-base font-semibold text-gray-800">No Orders Found</h3>
            <p className="text-xs text-gray-500 mt-1">Orders placed by shop owners will appear here automatically.</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default AdminOrders