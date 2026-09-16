import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import TruckLoader from './TruckLoader'

describe('TruckLoader Component', () => {
  it('renders the loader without crashing', () => {
    const { container } = render(<TruckLoader className="test-loader" />)
    
    expect(container.querySelector('.loader')).toBeInTheDocument()
    expect(container.querySelector('.truckWrapper')).toBeInTheDocument()
    expect(container.querySelector('.truckBody')).toBeInTheDocument()
    expect(container.querySelector('.road')).toBeInTheDocument()
  })
})