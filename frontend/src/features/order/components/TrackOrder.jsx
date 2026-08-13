import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { axiosi } from '../../../config/axios'
import { toast } from 'react-toastify'

const useMediaQuery = (query) => {
    const [matches, setMatches] = React.useState(() => window.matchMedia(query).matches);
    React.useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

const statusColors = {
    'Pending': 'bg-[#dfc9f7] text-[#7c59a4]',
    'Dispatched': 'bg-[#feed80] text-[#927b1e]',
    'Out for delivery': 'bg-[#AACCFF] text-[#4793AA]',
    'Delivered': 'bg-[#b3f5ca] text-[#548c6a]',
    'Cancelled': 'bg-[#fac0c0] text-[#cc6d72]'
};

export const TrackOrder = () => {
    const { id: urlId } = useParams();
    const navigate = useNavigate();
    const [orderId, setOrderId] = useState(urlId || '');
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const is480 = useMediaQuery('(max-width: 480px)');
    const is900 = useMediaQuery('(max-width: 900px)');

    const fetchOrder = async (e) => {
        e?.preventDefault();
        if (!orderId.trim()) {
            toast.error("Please enter an Order ID");
            return;
        }
        setLoading(true);
        setSearched(true);
        setOrder(null);
        try {
            const res = await axiosi.get(`/orders/${orderId.trim()}`);
            setOrder(res.data);
        } catch (err) {
            if (err.response?.status === 404) {
                toast.error("Order not found. Please check the Order ID.");
            } else {
                toast.error("Error fetching order. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        if (urlId) {
            fetchOrder();
        }
    }, [urlId]);

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className={`mx-auto ${is900 ? 'w-full' : 'w-[50rem]'}`}>

                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Track Your Order</h1>
                    <p className="text-gray-500">Enter your Order ID to check the status</p>
                </div>

                {/* Search Box */}
                <form onSubmit={fetchOrder} className="flex flex-col sm:flex-row gap-3 mb-10">
                    <input
                        type="text"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                        placeholder="Enter Order ID (e.g. 64f8a2b3...)"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-sm"
                    />
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        {loading ? 'Searching...' : 'Track Order'}
                    </button>
                </form>

                {/* Loading */}
                {loading && (
                    <div className="flex justify-center py-12">
                        <div className="w-8 h-8 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                    </div>
                )}

                {/* Not Found */}
                {!loading && searched && !order && (
                    <div className="text-center py-12 bg-white rounded-lg shadow-sm">
                        <div className="text-5xl mb-4">📦</div>
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Order Not Found</h3>
                        <p className="text-gray-500 text-sm">We couldn't find an order with that ID. Please double-check and try again.</p>
                    </div>
                )}

                {/* Order Details */}
                {!loading && order && (
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

                        {/* Order Header */}
                        <div className={`flex ${is480 ? 'flex-col gap-3' : 'flex-row justify-between items-center'} p-6 border-b border-gray-100`}>
                            <div>
                                <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
                                <p className="text-sm font-mono text-gray-900 break-all">{order._id}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[order.status] || 'bg-gray-200 text-gray-700'}`}>
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        {/* Items */}
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Items</h3>
                            <div className="flex flex-col gap-4">
                                {order.item.map((product, idx) => (
                                    <div key={idx} className="flex items-center gap-4">
                                        <img
                                            src={product.product?.thumbnail || product.thumbnail}
                                            alt={product.product?.title || product.title}
                                            className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                                        />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-gray-900">
                                                {product.product?.title || product.title}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-0.5">
                                                Qty: {product.quantity}
                                                {product.variantLabel && ` · ${product.variantLabel}`}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 mt-1">
                                                ₹{product.variantPrice || product.product?.price || product.price}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className={`grid ${is480 ? 'grid-cols-1' : 'grid-cols-2'} gap-6 p-6 border-b border-gray-100`}>

                            {/* Shipping Address */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Shipping Address</h3>
                                <div className="text-sm text-gray-600 space-y-1">
                                    <p className="font-medium text-gray-900">{order.address[0]?.type || 'Home'}</p>
                                    <p>{order.address[0]?.street}</p>
                                    <p>{order.address[0]?.city}, {order.address[0]?.state}</p>
                                    <p>{order.address[0]?.country} - {order.address[0]?.postalCode}</p>
                                </div>
                            </div>

                            {/* Order Info */}
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-3">Order Info</h3>
                                <div className="text-sm space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Payment Method</span>
                                        <span className="font-medium text-gray-900">{order.paymentMode}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Order Date</span>
                                        <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Order Time</span>
                                        <span className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                    </div>
                                    {order.guestEmail && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Guest Email</span>
                                            <span className="font-medium text-gray-900">{order.guestEmail}</span>
                                        </div>
                                    )}
                                    {order.guestPhone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-500">Guest Phone</span>
                                            <span className="font-medium text-gray-900">{order.guestPhone}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Total */}
                        <div className="p-6 bg-gray-50">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900">₹{order.total}</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}