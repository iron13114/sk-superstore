import React from 'react'
import { Link } from 'react-router-dom'
import { notFoundPageAnimation } from '../assets'
import Lottie from 'lottie-react'

export const NotFoundPage = () => {
  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-50 px-4">
      <div className="flex flex-col items-center justify-center text-center">
        
        {/* Lottie Animation */}
        <div className="w-full max-w-[25rem]">
          <Lottie animationData={notFoundPageAnimation} />
        </div>

        {/* Text Content */}
        <div className="mt-4 flex flex-col items-center gap-2">
          <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
            404 Not Found
          </h1>
          <p className="text-sm sm:text-base font-light text-gray-600">
            Sorry, we couldn't find the page you were looking for
          </p>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="mt-6 inline-flex items-center justify-center rounded-md bg-black px-6 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-gray-800 focus:outline-none"
        >
          Go back to homePage
        </Link>

      </div>
    </div>
  )
}