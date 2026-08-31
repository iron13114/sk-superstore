import React from 'react'
import { SearchPage as SearchFeature } from '../features/search/components/SearchPage'
import { PageTransition } from '../components/PageTransition';

export function SearchPage() {
  return (
  <PageTransition>
  
  <SearchFeature />
  </PageTransition>
  )
}