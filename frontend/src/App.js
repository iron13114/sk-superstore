import { useSelector } from 'react-redux';
import { Navigate,Route, RouterProvider, createBrowserRouter, createRoutesFromElements} from "react-router-dom";
import { selectIsAuthChecked, selectLoggedInUser } from './features/auth/AuthSlice';
import { Logout } from './features/auth/components/Logout';
import { Protected } from './features/auth/components/Protected';
import { useAuthCheck } from "./hooks/useAuth/useAuthCheck";
import { useFetchLoggedInUserDetails } from "./hooks/useAuth/useFetchLoggedInUserDetails";
import { AddProductPage, AdminOrdersPage, CartPage, CheckoutPage, ForgotPasswordPage, HomePage, LoginPage, OrderSuccessPage, OtpVerificationPage, ProductDetailsPage, ProductUpdatePage, ResetPasswordPage, SignupPage, UserOrdersPage, UserProfilePage, WishlistPage } from './pages';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { VerifyEmail } from './features/auth/components/VerifyEmail';
import { NotFoundPage } from './pages/NotFoundPage';
import { CircularProgress, Stack, Typography } from '@mui/material'; 
import { TrackOrder } from './features/order/components/TrackOrder'; 
import { useEffect, useState } from 'react';
import { Homepage } from './features/homepage/components/Homepage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage'
import { TermsOfUsePage } from './pages/TermsOfUsePage'
import { FaqPage } from './pages/FaqPage'

function App() {

  const isAuthChecked=useSelector(selectIsAuthChecked)
  const loggedInUser=useSelector(selectLoggedInUser)

  useAuthCheck();
  useFetchLoggedInUserDetails(loggedInUser);

  const [authTimeout, setAuthTimeout] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAuthTimeout(true), 8000); 
    return () => clearTimeout(timer);
  }, []);
  
  const ready = isAuthChecked || authTimeout;

  const routes = createBrowserRouter(
    createRoutesFromElements(
      <>

        {
          loggedInUser?.isAdmin?(
            // admin routes
          <>
            <Route path='/signup' element={<SignupPage/>}/>
            <Route path='/login' element={<LoginPage/>}/>
            <Route path='/verify-otp' element={<OtpVerificationPage/>}/>
            <Route path='/forgot-password' element={<ForgotPasswordPage/>}/>
            <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPasswordPage/>}/>
            <Route exact path='/logout' element={<Protected><Logout/></Protected>}/>
            <Route exact path='/product-details/:id' element={<Protected><ProductDetailsPage/></Protected>}/>

            <Route path='/admin/dashboard' element={<Protected><AdminDashboardPage/></Protected>}/>
            <Route path='/admin/product-update/:id' element={<Protected><ProductUpdatePage/></Protected>}/>
            <Route path='/admin/add-product' element={<Protected><AddProductPage/></Protected>}/>
            <Route path='/admin/orders'  element={<Protected><AdminOrdersPage/></Protected>}/>
            <Route path='*' element={<Navigate to={'/admin/dashboard'}/>}/>
            </>
          ):(
            // user routes
          <>
            {/* Public routes - Guest users can freely browse, add to cart, and reach checkout */}
            <Route path='/' element={<HomePage />} />
            <Route path="/" element={<Homepage />} />
            <Route path='/product-details/:id' element={<ProductDetailsPage />} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/wishlist' element={<WishlistPage/>} />
            <Route path='/cart' element={<CartPage />} />
            <Route path='/checkout' element={<CheckoutPage />} />
            <Route path='/track-order/:id?' element={<TrackOrder />} />
            <Route path='/wishlist' element={<WishlistPage/>} />

            {/* Auth pages */}
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/verify-otp' element={<OtpVerificationPage />} />
            <Route path='/forgot-password' element={<ForgotPasswordPage />} />
            <Route path='/reset-password/:userId/:passwordResetToken' element={<ResetPasswordPage />} />
            <Route exact path='/logout' element={<Protected><Logout /></Protected>} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            
            {/* User account routes (strictly protected) */}
            <Route path='/profile' element={<Protected><UserProfilePage /></Protected>} />
            <Route path='/order-success/:id' element={<Protected><OrderSuccessPage /></Protected>} />
            <Route path='/orders' element={<Protected><UserOrdersPage /></Protected>} />

            {/* Footer pages */}
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/faq" element={<FaqPage />} />
          </>
          )
        }

        <Route path='*' element={<NotFoundPage/>} />

      </>
    )
  )
    return ready ? <RouterProvider router={routes} /> : (
    <Stack height="100vh" justifyContent="center" alignItems="center">
      <CircularProgress />
      <Typography mt={2} color="text.secondary">Waking up server...</Typography>
    </Stack>
  );
}

export default App;
