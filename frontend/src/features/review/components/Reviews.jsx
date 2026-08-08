import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { motion, MotionConfig } from 'framer-motion'
import { toast } from 'react-toastify'
import {
    createReviewAsync, resetReviewAddStatus, resetReviewDeleteStatus,
    resetReviewUpdateStatus, selectReviewAddStatus, selectReviewDeleteStatus,
    selectReviewStatus, selectReviewUpdateStatus, selectReviews
} from '../ReviewSlice'
import { ReviewItem } from './ReviewItem'
import { selectLoggedInUser } from '../../auth/AuthSlice'

const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
    useEffect(() => {
        const media = window.matchMedia(query);
        const listener = (e) => setMatches(e.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [query]);
    return matches;
};

const StarRating = ({ value, onChange, size = 'md', readOnly = false }) => {
    const stars = [1, 2, 3, 4, 5];
    const sizeClass = size === 'large' ? 'w-8 h-8' : size === 'md' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex gap-1">
            {stars.map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readOnly}
                    onClick={() => onChange && onChange(star)}
                    className={`${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
                >
                    <svg
                        className={`${sizeClass} ${star <= value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 fill-gray-300'}`}
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                </button>
            ))}
        </div>
    );
};

export const Reviews = ({ productId, averageRating }) => {
    const dispatch = useDispatch()
    const reviews = useSelector(selectReviews)
    const [value, setValue] = useState(1)
    const { register, handleSubmit, reset } = useForm()
    const loggedInUser = useSelector(selectLoggedInUser)
    const reviewStatus = useSelector(selectReviewStatus)

    const reviewAddStatus = useSelector(selectReviewAddStatus)
    const reviewDeleteStatus = useSelector(selectReviewDeleteStatus)
    const reviewUpdateStatus = useSelector(selectReviewUpdateStatus)

    const [writeReview, setWriteReview] = useState(false)

    const is840 = useMediaQuery('(max-width: 840px)')
    const is480 = useMediaQuery('(max-width: 480px)')

    useEffect(() => {
        if (reviewAddStatus === 'fulfilled') {
            toast.success("Review added")
        } else if (reviewAddStatus === 'rejected') {
            toast.error("Error posting review, please try again later")
        }
        reset()
        setValue(1)
    }, [reviewAddStatus, reset])

    useEffect(() => {
        if (reviewDeleteStatus === 'fulfilled') toast.success("Review deleted")
        else if (reviewDeleteStatus === 'rejected') toast.error("Error deleting review, please try again later")
    }, [reviewDeleteStatus])

    useEffect(() => {
        if (reviewUpdateStatus === 'fulfilled') toast.success("Review updated")
        else if (reviewUpdateStatus === 'rejected') toast.error("Error updating review, please try again later")
    }, [reviewUpdateStatus])

    useEffect(() => {
        return () => {
            dispatch(resetReviewAddStatus())
            dispatch(resetReviewDeleteStatus())
            dispatch(resetReviewUpdateStatus())
        }
    }, [dispatch])

    const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((review) => {
        ratingCounts[review.rating] = ratingCounts[review.rating] + 1
    })

    // LOGIN GUARD - prevents crash and shows toast
    const handleAddReview = (data) => {
        if (!loggedInUser) {
            toast.error("Please login in order to write review")
            setWriteReview(false)
            return
        }
        const review = { ...data, rating: value, user: loggedInUser._id, product: productId }
        dispatch(createReviewAsync(review))
        setWriteReview(false)
    }

    const handleWriteReviewClick = () => {
        if (!loggedInUser) {
            toast.error("Please login in order to write review")
            return
        }
        setWriteReview(true)
    }

    return (
        <div className={`flex flex-col gap-10 self-start ${is480 ? 'w-[90vw]' : is840 ? 'w-[25rem]' : 'w-[40rem]'}`}>
            
            {/* Header + Rating Summary */}
            <div className="flex flex-col gap-4">
                <h4 className="text-3xl font-normal text-gray-900 mb-2">Reviews</h4>
                
                {reviews?.length > 0 ? (
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <p className="text-5xl font-extrabold text-gray-900">{averageRating}.0</p>
                            <StarRating value={averageRating} readOnly />
                            <p className="text-xl text-gray-500">Based on {reviews.length} {reviews.length === 1 ? "Review" : "Reviews"}</p>
                        </div>

                        <div className="flex flex-col gap-3">
                            {[5, 4, 3, 2, 1].map((number) => (
                                <div key={number} className="flex flex-row justify-between items-center gap-3">
                                    <span className="text-sm text-gray-700 whitespace-nowrap">{number} star</span>
                                    <div className="w-full h-4 bg-gray-200 rounded overflow-hidden">
                                        <div
                                            className="h-full bg-black rounded transition-all duration-300"
                                            style={{ width: `${(ratingCounts[number] / reviews.length) * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm text-gray-700 w-10 text-right">
                                        {parseInt((ratingCounts[number] / reviews.length) * 100)}%
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <p className="text-xl text-gray-500 font-normal">
                        {loggedInUser?.isAdmin ? "There are no reviews currently" : "Be the one to post review first"}
                    </p>
                )}
            </div>

            {/* Reviews List */}
            <div className="flex flex-col gap-4">
                {reviews?.map((review) => (
                    <ReviewItem
                        key={review._id}
                        id={review._id}
                        userid={review.user._id}
                        comment={review.comment}
                        createdAt={review.createdAt}
                        rating={review.rating}
                        username={review.user.name}
                    />
                ))}
            </div>

            {/* Add Review Form */}
            {writeReview ? (
                <form
                    noValidate
                    onSubmit={handleSubmit(handleAddReview)}
                    className="flex flex-col gap-6 relative"
                >
                    <textarea
                        {...register("comment", { required: false })}
                        rows={6}
                        placeholder="Write a review..."
                        className={`w-full mt-4 p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black text-sm ${is840 ? 'w-full' : 'w-[40rem]'}`}
                    />

                    <div>
                        <p className="text-sm text-gray-700 mb-2">How much did you like the product?</p>
                        <motion.div className="w-fit" whileHover={{ scale: 1.05, x: 2 }} whileTap={{ scale: 1 }}>
                            <StarRating size="large" value={value} onChange={(val) => setValue(val)} />
                        </motion.div>
                    </div>

                    <div className="flex flex-row self-end items-center gap-2">
                        <MotionConfig whileTap={{ scale: 1 }} whileHover={{ scale: 1.05 }}>
                            <motion.div>
                                <button
                                    type="submit"
                                    disabled={reviewStatus === 'pending'}
                                    className={`bg-black text-white rounded px-4 py-2 font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 ${is480 ? 'text-sm' : 'text-base'}`}
                                >
                                    {reviewStatus === 'pending' ? 'Adding...' : 'Add review'}
                                </button>
                            </motion.div>
                            <motion.div>
                                <button
                                    type="button"
                                    onClick={() => setWriteReview(false)}
                                    className={`border border-red-500 text-red-500 rounded px-4 py-2 font-medium hover:bg-red-50 transition-colors ${is480 ? 'text-sm' : 'text-base'}`}
                                >
                                    Cancel
                                </button>
                            </motion.div>
                        </MotionConfig>
                    </div>
                </form>
            ) : (
                !loggedInUser?.isAdmin && (
                    <motion.div
                        onClick={handleWriteReviewClick}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 1 }}
                        className="w-fit cursor-pointer"
                    >
                        <button className={`flex items-center gap-2 bg-black text-white rounded-md font-normal hover:bg-gray-800 transition-colors ${is480 ? 'px-4 py-2 text-base' : 'px-6 py-3 text-lg'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                            Write a review
                        </button>
                    </motion.div>
                )
            )}
        </div>
    )
}