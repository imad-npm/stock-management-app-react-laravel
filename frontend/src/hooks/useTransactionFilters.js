import { useState, useCallback } from 'react';

export function useTransactionFilters(initial = {}) {
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    from_date: '',
    to_date: '',
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
      type: '',
      from_date: '',
      to_date: '',
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
