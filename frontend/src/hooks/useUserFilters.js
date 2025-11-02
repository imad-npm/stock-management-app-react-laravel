import { useState, useCallback } from 'react';

export function useUserFilters(initial = {}) {
  const [filters, setFilters] = useState({
    search: '',
    role: '',
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
      role: '',
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
