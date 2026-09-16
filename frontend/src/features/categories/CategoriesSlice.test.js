import { describe, it, expect } from 'vitest'
import reducer, {
  fetchCategoryTreeAsync,
  selectCategoryTree,
} from './CategoriesSlice'
import { vi } from 'vitest'
import * as api from './CategoriesApi'

// Rule #2 in action: selector must survive missing state
describe('selectCategoryTree', () => {
  it('returns empty array when state is missing', () => {
    expect(selectCategoryTree({})).toEqual([])
  })

  it('returns the tree when present', () => {
    const tree = [{ _id: '1', name: 'Snacks & Namkeen', children: [] }]
    expect(selectCategoryTree({ CategoriesSlice: { categoryTree: tree } })).toEqual(tree)
  })
})

describe('CategoriesSlice reducer', () => {
  it('handles pending → fulfilled flow', () => {
    const payload = [{ _id: 'p1', name: 'Snacks & Namkeen', children: [{ _id: 'c1', name: 'Lays' }] }]

    let state = reducer(undefined, fetchCategoryTreeAsync.pending())
    expect(state.status).toBe('pending')

    state = reducer(state, fetchCategoryTreeAsync.fulfilled(payload))
    expect(state.status).toBe('fulfilled')
    expect(state.categoryTree).toEqual(payload)
  })

  it('handles rejection without crashing', () => {
    const state = reducer(undefined, fetchCategoryTreeAsync.rejected(new Error('boom')))
    expect(state.status).toBe('rejected')
    expect(state.categoryTree).toEqual([])   // old data intact, no undefined
  })
})

vi.mock('./CategoriesApi')

it('fetchCategoryTreeAsync normalizes non-array responses', async () => {
  api.fetchCategoryTree.mockResolvedValue({ data: [{ _id: '1', name: 'X', children: [] }] })

  const dispatch = vi.fn()
  const thunk = fetchCategoryTreeAsync()
  await thunk(dispatch, () => ({}), undefined)

  const action = dispatch.mock.calls[1][0]   // second call = fulfilled
  expect(action.type).toContain('fulfilled')
  expect(Array.isArray(action.payload)).toBe(true)
})