import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'

// Import your actual slice reducers
import ProductSlice from '../features/products/ProductSlice'
import AuthSlice from '../features/auth/AuthSlice'
import CartSlice from '../features/cart/CartSlice'
import WishlistSlice from '../features/wishlist/WishlistSlice'

export const renderWithProviders = (
  ui,
  {
    preloadedState = {},
    store = configureStore({
      reducer: {
        ProductSlice,
        AuthSlice,
        CartSlice,
        WishlistSlice,
      },
      preloadedState,
    }),
    route = '/',
    ...renderOptions
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Provider store={store}>
      <MemoryRouter initialEntries={[route]}>
        {children}
      </MemoryRouter>
    </Provider>
  )

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}

// Re-export everything from RTL
export * from '@testing-library/react'