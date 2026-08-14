import React, { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from "react-hook-form"
import { motion } from 'framer-motion'
import { useTranslation } from 'react-i18next';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { deleteReviewByIdAsync, selectReviewStatus, updateReviewByIdAsync } from '../ReviewSlice'

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

const StarRating = ({ value, onChange, size = 'sm', readOnly = false }) => {
    const stars = [1, 2, 3, 4, 5];
    const sizeClass = size === 'large' ? 'w-8 h-8' : size === 'medium' ? 'w-6 h-6' : 'w-4 h-4';
    return (
        <div className="flex gap-0.5">
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

export const ReviewItem = ({ id, username, userid, comment, rating, createdAt }) => {
    const dispatch = useDispatch()
    const loggedInUser = useSelector(selectLoggedInUser)
    const reviewStatus = useSelector(selectReviewStatus)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const [edit, setEdit] = useState(false)
    const [editRating, setEditRating] = useState(rating)
    const { t, i18n } = useTranslation();

    const is480 = useMediaQuery('(max-width: 480px)')

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Close menu on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        if (menuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuOpen]);

    const deleteReview = () => {
        dispatch(deleteReviewByIdAsync(id))
        setMenuOpen(false)
    }

    const handleUpdateReview = (data) => {
        const update = { ...data, _id: id, rating: editRating }
        dispatch(updateReviewByIdAsync(update))
        setEdit(false)
    }

    const isOwnReview = userid === loggedInUser?._id

    const formattedDate = new Date(createdAt).toLocaleDateString(
        i18n.language === 'hi' ? 'hi-IN' : 'en-IN',
        { year: 'numeric', month: 'short', day: 'numeric' }
    );

    return (
        <div className="relative flex flex-col gap-4 p-4 w-full bg-white shadow rounded-lg">
            
            {/* user, rating and created at */}
            <div className="flex flex-row justify-between items-center gap-4">
                <div className="flex flex-row gap-4 items-start">
                    <div className="flex flex-col gap-1">
                        <h6 className="text-base font-medium text-gray-900">{username}</h6>
                        <motion.div>
                            <StarRating 
                                size={edit ? (is480 ? 'medium' : 'large') : 'sm'} 
                                readOnly={!edit} 
                                onChange={(val) => setEditRating(val)} 
                                value={edit ? editRating : rating} 
                            />
                        </motion.div>
                    </div>
                </div>

                {isOwnReview && (
                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            aria-label={t('reviews.moreOptions')}
                        >
                            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
                            </svg>
                        </button>

                        {menuOpen && (
                            <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-32 z-10">
                                <button
                                    onClick={() => { setEdit(true); setMenuOpen(false); }}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    {t('reviews.edit')}
                                </button>
                                <button
                                    onClick={deleteReview}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    {t('reviews.delete')}
                                </button>
                            </div>
                        )}
                    </div>
                )}

                <span className="text-gray-500 text-sm font-normal self-end">
                    {formattedDate}
                </span>
            </div>

            {/* review comment */}
            <div>
                {edit ? (
                    <form noValidate onSubmit={handleSubmit(handleUpdateReview)} className="flex flex-col gap-3">
                        <textarea
                            rows={4}
                            {...register("comment", { required: true, value: comment })}
                            className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black resize-none"
                        />
                        <div className="flex flex-row self-end gap-2 items-center">
                            <button
                                type="submit"
                                disabled={reviewStatus === 'pending'}
                                className="px-4 py-1.5 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                {reviewStatus === 'pending' ? t('reviews.updating') : t('reviews.update')}
                            </button>
                            <button
                                type="button"
                                onClick={() => setEdit(false)}
                                className="px-4 py-1.5 border border-red-500 text-red-500 text-sm font-medium rounded hover:bg-red-50 transition-colors"
                            >
                                {t('reviews.cancel')}
                            </button>
                        </div>
                    </form>
                ) : (
                    <p className="text-gray-500 text-sm leading-relaxed">{comment}</p>
                )}
            </div>
        </div>
    )
}