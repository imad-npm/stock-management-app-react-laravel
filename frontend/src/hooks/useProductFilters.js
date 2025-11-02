import { useState, useCallback } from 'react';

export function useProductFilters(initial = {}) {
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    minPrice: '',
    maxPrice: '',
    minStock: '',
    maxStock: '',
    ...initial,
  });

  const setFilter = useCallback((key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

  const setSearch = useCallback((value) => {
    setFilter('search', value);
  }, [setFilter]);

  const resetFilters = useCallback(() => {
    setFilters({
      search: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      minStock: '',
      maxStock: '',
    });
  }, []);

  // Serialize into query string for backend request
  const queryString = new URLSearchParams(
    Object.entries(filters)
      .filter(([_, v]) => v !== '' && v != null)
      .map(([k, v]) => {
        const snakeCaseKey = k.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
        return [snakeCaseKey, v];
      })
  ).toString();

  return { filters, setFilter, resetFilters, setFilters, queryString, search: filters.search, setSearch };
}
