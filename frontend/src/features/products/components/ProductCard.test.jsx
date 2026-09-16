import { describe, it, expect } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '../../../utils/test-utils'
import { ProductCard } from './ProductCard'

describe('ProductCard Component', () => {
  const mockProduct = {
    id: 'prod_123',
    title: 'Kurkure Masala Munch',
    thumbnail: 'https://example.com/kurkure.png',
    brand: 'Kurkure',
    price: 20,
    stockQuantity: 50,
  }

  it('renders product title and price correctly', () => {
    renderWithProviders(<ProductCard {...mockProduct} />)

    expect(screen.getByText('Kurkure Masala Munch')).toBeInTheDocument()
    expect(screen.getByText(/20/)).toBeInTheDocument()
  })
})