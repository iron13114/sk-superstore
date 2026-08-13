import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { selectUserInfo } from '../../user/UserSlice';
import { selectCartItems } from '../../cart/CartSlice';
import { selectLoggedInUser } from '../../auth/AuthSlice';
import { selectWishlistItems } from '../../wishlist/WishlistSlice';
import { selectProductIsFilterOpen, toggleFilters } from '../../products/ProductSlice';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '../../../components/LanguageSwitcher';

const useResponsive = () => {
  const [breakpoint, setBreakpoint] = useState(() => {
    const width = window.innerWidth;
    if (width < 480) return 'xs';
    if (width < 640) return 'sm';
    if (width < 768) return 'md';
    if (width < 1024) return 'lg';
    return 'xl';
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 480) setBreakpoint('xs');
      else if (width < 640) setBreakpoint('sm');
      else if (width < 768) setBreakpoint('md');
      else if (width < 1024) setBreakpoint('lg');
      else setBreakpoint('xl');
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
};

const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    return () => document.removeEventListener('mousedown', listener);
  }, [ref, handler]);
};

export const Navbar = ({ isProductList = false }) => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchCategory, setSearchCategory] = useState('all');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  
  const userInfo = useSelector(selectUserInfo);
  const cartItems = useSelector(selectCartItems);
  const loggedInUser = useSelector(selectLoggedInUser);
  const wishlistItems = useSelector(selectWishlistItems);
  const isProductFilterOpen = useSelector(selectProductIsFilterOpen);
  
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const menuRef = useRef(null);
  const breakpoint = useResponsive();
  const { t } = useTranslation();

  const isMobile = breakpoint === 'xs' || breakpoint === 'sm';
  const isTablet = breakpoint === 'md';
  const isDesktop = breakpoint === 'lg' || breakpoint === 'xl';

  useClickOutside(menuRef, () => setAnchorElUser(null));

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };

  const handleSearch = useCallback(() => {
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`);
      setMobileSearchOpen(false);
    }
  }, [searchQuery, navigate]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const settings = [
    { name: t('navbar.home'), to: "/" },
    { name: t('navbar.profile'), to: loggedInUser?.isAdmin ? "/admin/profile" : "/profile" },
    { name: loggedInUser?.isAdmin ? t('navbar.orders') : t('navbar.myOrders'), to: loggedInUser?.isAdmin ? "/admin/orders" : "/orders" },
    { name: t('navbar.logout'), to: "/logout" },
  ];

  const getNavStyles = () => ({
    position: 'sticky',
    top: 0,
    zIndex: 50,
    backgroundColor: '#ffffff',
    color: '#111827',
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    borderBottom: '1px solid #f3f4f6',
  });

  const getContainerStyles = () => ({
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: isMobile ? '56px' : '64px',
    padding: isMobile ? '0 12px' : isTablet ? '0 16px' : '0 24px',
    gap: isMobile ? '8px' : '16px',
  });

  const getLeftSectionStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flexShrink: 0,
  });

  const getFilterBtnStyles = () => ({
    padding: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderRadius: '50%',
    transition: 'background-color 0.2s',
  });

  const getLogoStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    flexShrink: 0,
  });

  const getSearchContainerStyles = () => ({
    display: isMobile && !mobileSearchOpen ? 'none' : 'flex',
    flex: 1,
    maxWidth: isMobile ? '100%' : '600px',
    minWidth: 0,
    alignItems: 'center',
    margin: isMobile ? '0' : '0 16px',
    position: isMobile ? 'absolute' : 'relative',
    top: isMobile ? '56px' : 'auto',
    left: isMobile ? 0 : 'auto',
    right: isMobile ? 0 : 'auto',
    padding: isMobile ? '8px 12px' : '0',
    backgroundColor: isMobile ? '#ffffff' : 'transparent',
    borderBottom: isMobile ? '1px solid #e5e7eb' : 'none',
    boxShadow: isMobile ? '0 4px 6px -1px rgba(0, 0, 0, 0.1)' : 'none',
  });

  const getSelectStyles = () => ({
    height: '36px',
    padding: '0 8px',
    fontSize: '14px',
    backgroundColor: '#f3f3f3',
    border: '1px solid #cdcdcd',
    borderRight: 'none',
    borderRadius: '4px 0 0 4px',
    cursor: 'pointer',
    outline: 'none',
    whiteSpace: 'nowrap',
  });

  const getInputStyles = () => ({
    flex: 1,
    height: '36px',
    padding: '0 12px',
    fontSize: '14px',
    backgroundColor: '#ffffff',
    border: '1px solid #cdcdcd',
    borderLeft: 'none',
    borderRight: 'none',
    outline: 'none',
    minWidth: 0,
  });

  const getSearchBtnStyles = () => ({
    height: '36px',
    width: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#febd69',
    border: 'none',
    borderRadius: '0 4px 4px 0',
    cursor: 'pointer',
    flexShrink: 0,
  });

  const getRightSectionStyles = () => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: isMobile ? '8px' : '12px',
    flexShrink: 0,
  });

  const getAvatarStyles = () => ({
    width: isMobile ? '32px' : '36px',
    height: isMobile ? '32px' : '36px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: '14px',
    border: 'none',
    cursor: 'pointer',
  });

  const getGreetingStyles = () => ({
    fontSize: isMobile ? '12px' : '14px',
    fontWeight: 300,
    whiteSpace: 'nowrap',
    maxWidth: isMobile ? '80px' : '200px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  });

  const getDropdownStyles = () => ({
    position: 'absolute',
    right: 0,
    top: '100%',
    marginTop: '8px',
    width: '192px',
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    padding: '4px 0',
    zIndex: 50,
    border: '1px solid #e5e7eb',
  });

  const getLinkStyles = () => ({
    display: 'block',
    padding: '8px 16px',
    fontSize: '14px',
    color: '#374151',
    textDecoration: 'none',
    transition: 'background-color 0.15s',
  });

  const getLoginBtnStyles = () => ({
    padding: '6px 12px',
    fontSize: '14px',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    textDecoration: 'none',
    color: '#111827',
    fontWeight: 500,
    whiteSpace: 'nowrap',
  });

  const getAdminBadgeStyles = () => ({
    padding: '6px 12px',
    fontSize: '14px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const getIconBtnStyles = () => ({
    position: 'relative',
    padding: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'inline-flex',
  });

  const getBadgeStyles = () => ({
    position: 'absolute',
    top: '-4px',
    right: '-4px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: 'bold',
    borderRadius: '50%',
    height: '18px',
    width: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  const getMobileSearchToggleStyles = () => ({
    padding: '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: isDesktop ? 'none' : 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <>
      <header style={getNavStyles()}>
        <nav style={getContainerStyles()}>
          
          {/* LEFT: Filter + Logo */}
          <div style={getLeftSectionStyles()}>
            {isProductList && (
              <button 
                onClick={handleToggleFilters}
                style={getFilterBtnStyles()}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <svg 
                  style={{ 
                    width: '20px', 
                    height: '20px', 
                    color: isProductFilterOpen ? '#000000' : '#4b5563' 
                  }} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </button>
            )}
            
            <Link to="/" style={getLogoStyles()}>
              <img src="/logo.jpeg" alt="SK Superstore" style={{ height: '40px', width: 'auto', maxHeight: '40px', objectFit: 'contain' }} />
            </Link>
          </div>

          {/* CENTER: Search Bar */}
          <div style={getSearchContainerStyles()}>
            <select
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              style={getSelectStyles()}
            >
              <option value="all">{t('navbar.all')}</option>
              <option value="products">{t('navbar.products')}</option>
              <option value="brands">{t('navbar.brands')}</option>
            </select>
            
            <input
              type="text"
              placeholder={t('navbar.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              style={getInputStyles()}
            />
            
            <button onClick={handleSearch} style={getSearchBtnStyles()}>
              <svg style={{ width: '20px', height: '20px', color: '#131921' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>

          {/* RIGHT: Language Switcher, Profile, Greetings, Cart, Wishlist */}
          <div style={getRightSectionStyles()}>
            
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* Mobile search toggle */}
            <button 
              style={getMobileSearchToggleStyles()}
              onClick={() => setMobileSearchOpen(!mobileSearchOpen)}
            >
              <svg style={{ width: '20px', height: '20px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {loggedInUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ position: 'relative' }} ref={menuRef}>
                  <button 
                    onClick={handleOpenUserMenu} 
                    style={getAvatarStyles()}
                    title="Open settings"
                  >
                    {userInfo?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </button>
                  
                  {anchorElUser && (
                    <div style={getDropdownStyles()}>
                      {loggedInUser?.isAdmin && (
                        <Link 
                          to="/admin/add-product" 
                          onClick={handleCloseUserMenu}
                          style={getLinkStyles()}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {t('navbar.addNewProduct')}
                        </Link>
                      )}
                      {settings.map((setting) => (
                        <Link
                          key={setting.name}
                          to={setting.to}
                          onClick={handleCloseUserMenu}
                          style={getLinkStyles()}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {setting.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
                
                <span style={getGreetingStyles()}>
                  {isMobile ? `${userInfo?.name?.toString().split(" ")[0]}` : t('navbar.greeting', { name: userInfo?.name })}
                </span>
              </div>
            ) : (
              <Link to="/login" style={getLoginBtnStyles()}>
                {t('navbar.login')}
              </Link>
            )}
            
            {loggedInUser?.isAdmin && (
              <button style={getAdminBadgeStyles()}>
                {t('navbar.admin')}
              </button>
            )}
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {cartItems?.length > 0 && (
                <button 
                  onClick={() => navigate("/cart")}
                  style={getIconBtnStyles()}
                >
                  <svg style={{ width: '24px', height: '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <span style={getBadgeStyles()}>
                    {cartItems.length}
                  </span>
                </button>
              )}
              
              {!loggedInUser?.isAdmin && (
                <Link 
                  to="/wishlist" 
                  style={getIconBtnStyles()}
                >
                  <svg style={{ width: '24px', height: '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  {wishlistItems?.length > 0 && (
                    <span style={getBadgeStyles()}>
                      {wishlistItems.length}
                    </span>
                  )}
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      
      {/* Mobile search spacer */}
      {isMobile && mobileSearchOpen && <div style={{ height: '52px' }} />}
    </>
  );
};