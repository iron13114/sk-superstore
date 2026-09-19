import React, { useState, useRef, useEffect } from 'react';
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

  const handleSearch = (e) => {
    e?.preventDefault?.();          
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleResetSearch = () => {
    setSearchQuery('');
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
    height: isMobile ? '48px' : '64px',
    padding: isMobile ? '0 8px' : isTablet ? '0 16px' : '0 24px',
    gap: isMobile ? '6px' : '16px',
  });

  const getAvatarStyles = () => ({
    width: isMobile ? '28px' : '36px',
    height: isMobile ? '28px' : '36px',
    borderRadius: '50%',
    backgroundColor: '#e5e7eb',
    color: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 500,
    fontSize: isMobile ? '11px' : '14px',
    border: 'none',
    cursor: 'pointer',
  });

  const getGreetingStyles = () => ({
    fontSize: isMobile ? '11px' : '14px',
    fontWeight: 300,
    whiteSpace: 'nowrap',
    maxWidth: isMobile ? '60px' : '200px',
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
    padding: isMobile ? '4px 8px' : '6px 12px',
    fontSize: isMobile ? '12px' : '14px',
    border: '1px solid #d1d5db',
    textDecoration: 'none',
    color: '#FFFFFF',
    background: '#0055A4',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    borderRadius: '9999px',
  });

  const getAdminBadgeStyles = () => ({
    padding: isMobile ? '4px 8px' : '6px 12px',
    fontSize: isMobile ? '12px' : '14px',
    backgroundColor: '#000000',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  });

  const getIconBtnStyles = () => ({
    position: 'relative',
    padding: isMobile ? '4px' : '6px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    display: 'inline-flex',
  });

  const getBadgeStyles = () => ({
    position: 'absolute',
    top: '-3px',
    right: '-3px',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: 'bold',
    borderRadius: '50%',
    height: isMobile ? '15px' : '18px',
    width: isMobile ? '15px' : '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  });

  return (
    <>
      {/* Inline Scoped Styles */}
      <style>{`
        /* Animated Burger Toggle */
        .burger {
          position: relative;
          width: 32px;
          height: 24px;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          display: block;
          flex-shrink: 0;
        }

        .burger span {
          display: block;
          position: absolute;
          height: 3px;
          width: 100%;
          background: #111827;
          border-radius: 9px;
          opacity: 1;
          left: 0;
          transform: rotate(0deg);
          transition: .25s ease-in-out;
          pointer-events: none;
        }

        .burger span:nth-of-type(1) {
          top: 0px;
          transform-origin: left center;
        }

        .burger span:nth-of-type(2) {
          top: 50%;
          transform: translateY(-50%);
          transform-origin: left center;
        }

        .burger span:nth-of-type(3) {
          top: 100%;
          transform-origin: left center;
          transform: translateY(-100%);
        }

        .burger.open span:nth-of-type(1) {
          transform: rotate(45deg);
          top: 1px;
          left: 4px;
        }

        .burger.open span:nth-of-type(2) {
          width: 0%;
          opacity: 0;
        }

        .burger.open span:nth-of-type(3) {
          transform: rotate(-45deg);
          top: 23px;
          left: 4px;
        }

        /* Search Form Styles */
        .search-form {
          --timing: 0.3s;
          --height-of-input: 38px;
          --border-height: 2px;
          --input-bg: #f9fafb;
          --border-color: #0055A4;
          --border-radius: 30px;
          --after-border-radius: 6px;
          position: relative;
          width: 100%;
          height: var(--height-of-input);
          display: flex;
          align-items: center;
          padding-inline: 0.9em;
          border-radius: var(--border-radius);
          transition: border-radius 0.4s ease, background-color 0.2s ease;
          background: var(--input-bg, #fff);
          border: 1px solid #e5e7eb;
        }
        .search-form button {
          border: none;
          background: none;
          color: #6b7280;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0;
        }
        .search-form button:hover {
          color: #111827;
        }
        .search-input {
          font-size: 0.875rem;
          background-color: transparent;
          width: 100%;
          height: 100%;
          padding-inline: 0.6em;
          border: none;
          color: #111827;
        }
        .search-input:focus {
          outline: none;
        }
        .search-form:before {
          content: "";
          position: absolute;
          background: var(--border-color);
          transform: scaleX(0);
          transform-origin: center;
          width: 100%;
          height: var(--border-height);
          left: 0;
          bottom: 0;
          border-radius: 1px;
          transition: transform var(--timing) ease;
        }
        .search-form:focus-within {
          border-radius: var(--after-border-radius);
          background-color: #ffffff;
          border-color: #d1d5db;
        }
        .search-form:focus-within:before {
          transform: scaleX(1);
        }
        .search-reset {
          border: none;
          background: none;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.2s ease, visibility 0.2s ease;
        }
        .search-input:not(:placeholder-shown) ~ .search-reset {
          opacity: 1;
          visibility: visible;
        }
        .search-form svg {
          width: 17px;
          height: 17px;
        }
      `}</style>

      <header style={getNavStyles()}>
        {/* Top Navbar Row */}
        <nav style={getContainerStyles()}>
          {/* LEFT: Logo + Language Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
              <img 
                src="/logo.jpeg" 
                alt="SK Superstore" 
                style={{ height: isMobile ? '32px' : '40px', width: 'auto', objectFit: 'contain' }} 
              />
            </Link>
            <LanguageSwitcher />
          </div>

          {/* RIGHT: User, Cart, Wishlist */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: isMobile ? '6px' : '12px', flexShrink: 0 }}>
            {loggedInUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '4px' : '8px' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '6px' : '12px' }}>
              {cartItems?.length > 0 && (
                <button 
                  onClick={() => navigate("/cart")}
                  style={getIconBtnStyles()}
                >
                  <svg style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  <svg style={{ width: isMobile ? '20px' : '24px', height: isMobile ? '20px' : '24px', color: '#374151' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

        {/* Second Row: Burger Toggle + Search Bar */}
        <nav style={{ borderTop: '1px solid #f3f4f6', padding: '6px 0 8px 0' }}>
          <div style={{ ...getContainerStyles(), height: 'auto', gap: isMobile ? '10px' : '14px' }}>
            
            {/* Animated Burger Toggle */}
            {isProductList && (
              <button
                type="button"
                onClick={handleToggleFilters}
                className={`burger ${isProductFilterOpen ? 'open' : ''}`}
                title={isProductFilterOpen ? t('navbar.closeFilters', 'Close filters') : t('navbar.openFilters', 'Open filters')}
                aria-label="Toggle filters"
              >
                <span></span>
                <span></span>
                <span></span>
              </button>
            )}

            {/* Uiverse Search Bar */}
            <form onSubmit={handleSearch} className="search-form">
              <button type="submit" aria-label="Search">
                <svg width="17" height="16" fill="none" xmlns="http://www.w3.org/2000/svg" role="img">
                  <path d="M7.667 12.667A5.333 5.333 0 107.667 2a5.333 5.333 0 000 10.667zM14.334 14l-2.9-2.9" stroke="currentColor" strokeWidth="1.333" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              <input 
                className="search-input" 
                placeholder={t('navbar.search', 'Search SKSuperStore...')} 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />

              <button 
                className="search-reset" 
                type="button"
                onClick={handleResetSearch}
                aria-label="Clear search"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </form>

          </div>
        </nav>
      </header>
    </>
  );
};