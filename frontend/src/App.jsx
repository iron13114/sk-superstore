import React, { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Outlet,
  Route,
  RouterProvider,
  useLocation,
  useOutlet
} from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { VerifyEmail } from './features/auth/components/VerifyEmail';
import { TrackOrder } from './features/order/components/TrackOrder';
import { useAuthCheck } from './hooks/useAuth/useAuthCheck';
import { useFetchLoggedInUserDetails } from './hooks/useAuth/useFetchLoggedInUserDetails';
import { PageTransition } from './components/PageTransition';
import { ScrollToTop } from './components/ScrollToTop';

import {
  AddProductPage,
  AdminDashboardPage,
  AdminOrdersPage,
  CartPage,
  CheckoutPage,
  FaqPage,
  ForgotPasswordPage,
  HomePage,
  LoginPage,
  NotFoundPage,
  OrderSuccessPage,
  OtpVerificationPage,
  PrivacyPolicyPage,
  ProductDetailsPage,
  ProductUpdatePage,
  ResetPasswordPage,
  SearchPage,
  SignupPage,
  TermsOfUsePage,
  UserOrdersPage,
  UserProfilePage,
  WishlistPage,
} from './pages';

function AnimatedLayout() {
  const location = useLocation();
  const outlet = useOutlet();
return (
    <AnimatePresence mode="wait" initial={false}>
      {outlet && React.cloneElement(outlet, { key: location.pathname })}
    </AnimatePresence>
  );
}

export default function App() {
  const isAuthChecked = useSelector(selectIsAuthChecked);
  const loggedInUser = useSelector(selectLoggedInUser);

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthTimeout(true), 8000);
    return () => clearTimeout(timer);
  }, []);

  const ready = isAuthChecked || authTimeout;

  const router = useMemo(() => {
    return createBrowserRouter(
      createRoutesFromElements(
        <Route element={<AnimatedLayout />}>
          {loggedInUser?.isAdmin ? (
            <>
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-otp" element={<OtpVerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:userId/:passwordResetToken" element={<ResetPasswordPage />} />
              <Route exact path="/logout" element={<Protected><Logout /></Protected>} />
              <Route exact path="/product-details/:id" element={<Protected><ProductDetailsPage /></Protected>} />
              <Route path="/admin/dashboard" element={<Protected><AdminDashboardPage /></Protected>} />
              <Route path="/admin/product-update/:id" element={<Protected><ProductUpdatePage /></Protected>} />
              <Route path="/admin/add-product" element={<Protected><AddProductPage /></Protected>} />
              <Route path="/admin/orders" element={<Protected><AdminOrdersPage /></Protected>} />
              <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
            </>
          ) : (
            <>
              <Route path="/" element={<HomePage />} />
              <Route path="/product-details/:id" element={<ProductDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/track-order/:id?" element={<TrackOrder />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/verify-otp" element={<OtpVerificationPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/reset-password/:userId/:passwordResetToken" element={<ResetPasswordPage />} />
              <Route exact path="/logout" element={<Protected><Logout /></Protected>} />
              <Route path="/verify-email/:token" element={<VerifyEmail />} />
              <Route path="/profile" element={<Protected><UserProfilePage /></Protected>} />
              <Route path="/order-success/:id" element={<Protected><OrderSuccessPage /></Protected>} />
              <Route path="/orders" element={<Protected><UserOrdersPage /></Protected>} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-use" element={<TermsOfUsePage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </>
          )}
        </Route>
      )
    );
  }, [loggedInUser?.isAdmin]);

  return (
    <>
      {ready ? (
        <RouterProvider router={router} />
      ) : (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-white">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#E31837] rounded-full animate-spin mb-4" />
          <p className="text-sm text-gray-500">Waking up server...</p>
        </div>
      )}

      <ToastContainer
        position="top-center"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        limit={1}
        pauseOnHover
        theme="light"
        toastClassName={() =>
          "relative flex items-center p-4 min-h-[3.5rem] rounded-lg shadow-lg border-l-4 bg-white text-gray-900 text-sm font-medium cursor-pointer overflow-hidden"
        }
        bodyClassName={() => "flex items-center gap-2 flex-1"}
        progressClassName="h-1 bg-gradient-to-r from-[#E31837] to-[#0055A4]"
      />
    </>
  );
}