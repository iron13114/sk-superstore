import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { 
    fetchOrderByIdAsync, 
    selectCurrentOrder, 
    selectOrderFetchStatus,
    resetCurrentOrder,
    resetOrderFetchStatus,
    selectOrders,
    getOrderByUserIdAsync
} from '../OrderSlice'
import { selectLoggedInUser } from '../../auth/AuthSlice'

export const TrackOrder = () => {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { t } = useTranslation()
    const currentOrder = useSelector(selectCurrentOrder)
    const orderFetchStatus = useSelector(selectOrderFetchStatus)
    const loggedInUser = useSelector(selectLoggedInUser)
    const userOrders = useSelector(selectOrders)
    
    const [searchId, setSearchId] = useState('')
    const [guestOrders, setGuestOrders] = useState([])
    const [loadingGuest, setLoadingGuest] = useState(false)
    
    const isLoading = orderFetchStatus === 'pending' || loadingGuest

    useEffect(() => {
        if (id) {
            dispatch(resetCurrentOrder())
            dispatch(resetOrderFetchStatus())
            dispatch(fetchOrderByIdAsync(id))
        }
    }, [id, dispatch])

    useEffect(() => {
        if (!id && loggedInUser?._id) {
            dispatch(getOrderByUserIdAsync(loggedInUser._id))
        }
    }, [id, loggedInUser, dispatch])

    useEffect(() => {
        if (!id && !loggedInUser) {
            const stored = JSON.parse(localStorage.getItem('guestOrders') || '[]')
            if (stored.length > 0) {
                setLoadingGuest(true)
                Promise.all(
                    stored.map(orderId => 
                        dispatch(fetchOrderByIdAsync(orderId))
                            .unwrap()
                            .then(res => res)
                            .catch(() => null)
                    )
                ).then(results => {
                    setGuestOrders(results.filter(Boolean))
                    setLoadingGuest(false)
                })
            }
        }
    }, [id, loggedInUser, dispatch])

    const handleSearch = (e) => {
        e.preventDefault()
        if (!searchId.trim()) {
            toast.error(t('trackOrder.enterOrderId'))
            return
        }
        navigate(`/track-order/${searchId.trim()}`)
    }

    const getStatusColor = (status) => {
        const map = {
            'Pending': 'bg-[#dfc9f7] text-[#7c59a4]',
            'Dispatched': 'bg-[#feed80] text-[#927b1e]',
            'Out for delivery': 'bg-[#AACCFF] text-[#4793AA]',
            'Delivered': 'bg-[#b3f5ca] text-[#548c6a]',
            'Cancelled': 'bg-[#fac0c0] text-[#cc6d72]'
        }
        return map[status] || 'bg-gray-200 text-gray-700'
    }

    let displayOrders = []
    if (id && currentOrder) {
        displayOrders = [currentOrder]
    } else if (!id && loggedInUser) {
        displayOrders = userOrders || []
    } else if (!id && !loggedInUser) {
        displayOrders = guestOrders
    }

    return (
        <div className="px-4 py-8 flex flex-col items-center min-h-screen bg-white">
            
            {/* Header */}
            <div className="w-full max-w-3xl flex justify-between items-center mb-8">
                <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('trackOrder.back')}
                </button>
                <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 underline">
                    {t('trackOrder.goHome')}
                </Link>
            </div>

            <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-[#111827]">{t('trackOrder.title')}</h1>
                <p className="text-gray-500 mt-1">{t('trackOrder.subtitle')}</p>
            </div>

            {/* Search */}
            <form onSubmit={handleSearch} className="w-full max-w-3xl flex gap-3 mb-10">
                <input
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    placeholder={t('trackOrder.placeholder')}
                    className="flex-1 px-4 py-3 border border-gray-300 text-sm focus:outline-none focus:ring-1 focus:ring-[#0055A4] focus:border-[#0055A4]"
                />
                <button type="submit" className="px-6 py-3 bg-[#111827] text-white text-sm font-medium hover:bg-gray-800 transition-colors">
                    {t('trackOrder.trackOrder')}
                </button>
            </form>

            {/* Loading */}
            {isLoading && (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111827]"></div>
                </div>
            )}

            {/* Orders List */}
            {!isLoading && displayOrders.length > 0 && (
                <div className="w-full max-w-3xl space-y-6">
                    {displayOrders.map((order) => (
                        <div key={order._id} className="border border-gray-200 bg-white overflow-hidden">
                            
                            {/* Header */}
                            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">{t('trackOrder.orderId')}</p>
                                    <p className="text-sm font-mono text-[#111827]">{order._id}</p>
                                </div>
                                <span className={`px-3 py-1 text-xs font-medium ${getStatusColor(order.status)}`}>
                                    {t(`trackOrder.status.${order.status}`) || order.status}
                                </span>
                            </div>

                            {/* Items */}
                            <div className="px-6 py-4 border-b border-gray-100">
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-3">{t('trackOrder.items')}</p>
                                <div className="space-y-3">
                                    {(order.item || []).map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <img 
                                                src={item.product?.thumbnail || item.product?.images?.[0]} 
                                                alt="" 
                                                className="w-12 h-12 object-contain border border-gray-100"
                                                onError={(e) => { e.target.style.display = 'none' }}
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-[#111827]">
                                                    {item.product?.title || 'Product'}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {t('trackOrder.qty')}: {item.quantity} {item.packagingTier ? `• ${item.variantLabel || item.packagingTier}` : ''}
                                                </p>
                                            </div>
                                            <p className="text-sm font-semibold text-[#111827]">
                                                ₹{item.variantPrice || item.product?.price || 0}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-6 py-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t('trackOrder.shippingAddress')}</p>
                                    <div className="text-sm text-[#111827] space-y-0.5">
                                        <p className="font-medium">{order.address?.[0]?.type || 'Home'}</p>
                                        <p>{order.address?.[0]?.street}</p>
                                        <p>{order.address?.[0]?.city}, {order.address?.[0]?.state}</p>
                                        <p>{order.address?.[0]?.country} – {order.address?.[0]?.postalCode}</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">{t('trackOrder.orderInfo')}</p>
                                    <div className="text-sm space-y-2">
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t('trackOrder.paymentMethod')}</span>
                                            <span className="text-[#111827] font-medium">{order.paymentMode}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t('trackOrder.orderDate')}</span>
                                            <span className="text-[#111827]">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">{t('trackOrder.orderTime')}</span>
                                            <span className="text-[#111827]">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                        </div>
                                        {!order.user && (
                                            <>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">{t('trackOrder.guestEmail')}</span>
                                                    <span className="text-[#111827]">{order.guestEmail || 'N/A'}</span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className="text-gray-500">{t('trackOrder.guestPhone')}</span>
                                                    <span className="text-[#111827]">{order.guestPhone || 'N/A'}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Total */}
                            <div className="flex justify-between items-center px-6 py-4 bg-gray-50 border-t border-gray-100">
                                <span className="text-sm text-gray-500">{t('trackOrder.totalAmount')}</span>
                                <span className="text-xl font-bold text-[#111827]">₹{order.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Empty / Not Found */}
            {!isLoading && displayOrders.length === 0 && (
                <div className="text-center py-12">
                    {id ? (
                        <>
                            <p className="text-lg font-medium text-[#111827]">{t('trackOrder.orderNotFound')}</p>
                            <p className="text-gray-500 mt-1">{t('trackOrder.orderNotFoundDesc')}</p>
                        </>
                    ) : (
                        <p className="text-gray-500">
                            {loggedInUser 
                                ? 'No orders found.' 
                                : 'No orders found. Place an order or enter an Order ID above.'}
                        </p>
                    )}
                </div>
            )}
        </div>
    )
}