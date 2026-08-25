import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { resetCurrentOrder, selectCurrentOrder } from '../features/order/OrderSlice'
import { selectUserInfo } from '../features/user/UserSlice'
import { orderSuccessAnimation } from '../assets'
import Lottie from 'lottie-react'

export const OrderSuccessPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const currentOrder = useSelector(selectCurrentOrder)
  const userDetails = useSelector(selectUserInfo)

  useEffect(() => {
    if (!currentOrder) {
      navigate('/')
    }
  }, [currentOrder, navigate])

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex w-full max-w-md flex-col items-center justify-center gap-6 rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-center sm:p-10">
        
        {/* Success Animation */}
        <div className="h-28 w-40">
          <Lottie animationData={orderSuccessAnimation} />
        </div>

        {/* Order Details */}
        <div className="flex flex-col items-center gap-1.5">
          <h2 className="text-base font-normal text-gray-700">
            Hey {userDetails?.name}
          </h2>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
            Your Order #{currentOrder?._id} is confirmed
          </h1>
          <p className="text-sm text-gray-500">
            Thank you for shopping with us ❤️
          </p>
        </div>

        {/* Navigate to Orders Button */}
        <Link
          to="/orders"
          onClick={() => dispatch(resetCurrentOrder())}
          className="w-full sm:w-auto inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none"
        >
          Check order status in my orders
        </Link>

      </div>
    </div>
  )
}