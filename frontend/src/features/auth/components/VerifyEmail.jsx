import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { verifyEmail } from '../AuthApi';
import { showToast } from '../../../utils/toast';

export const VerifyEmail = () => {
    const { token } = useParams();
    const [status, setStatus] = useState('loading'); // loading | success | error
    const [message, setMessage] = useState('');

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await verifyEmail(token);
                setStatus('success');
                setMessage(res.message);
                showToast.success(res.message);
            } catch (err) {
                setStatus('error');
                setMessage(err.response?.data?.message || 'Verification failed');
                showToast.error(err.response?.data?.message || 'Verification failed');
            }
        };
        verify();
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <div className="w-full max-w-md text-center">
                {status === 'loading' && (
                    <>
                        <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
                        <h2 className="text-2xl font-medium text-gray-900">Verifying your email...</h2>
                    </>
                )}
                
                {status === 'success' && (
                    <>
                        <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">Email Verified!</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link to="/login" className="inline-block bg-black text-white px-6 py-3 rounded font-medium hover:bg-gray-800 transition-colors">
                            Go to Login
                        </Link>
                    </>
                )}
                
                {status === 'error' && (
                    <>
                        <svg className="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                        <h2 className="text-2xl font-medium text-gray-900 mb-2">Verification Failed</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <Link to="/signup" className="inline-block border border-gray-900 text-gray-900 px-6 py-3 rounded font-medium hover:bg-gray-50 transition-colors">
                            Back to Signup
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}