import React, { useState, useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Search, SlidersHorizontal } from 'lucide-react';
import Skeleton from './Skeleton';

const DataTable = ({
  columns,
  data = [],
  searchPlaceholder = 'Search...',
  searchKey = '',
  filters = [], // Array of { key, label, options: [{ value, label }] }
  isLoading = false,
  emptyMessage = 'No records found',
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState(null); // 'asc' | 'desc'
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);

  // Reset pagination when search query or filters change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleFilterChange = (key, value) => {
    setSelectedFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  };

  const handleSort = (columnKey) => {
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortColumn(null);
        setSortDirection(null);
      }
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Process data (Filter -> Search -> Sort -> Paginate)
  const processedData = useMemo(() => {
    let result = [...data];

    // 1. Dropdown Filters
    Object.entries(selectedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') {
        result = result.filter(row => {
          // nested path support: e.g. 'user.role' or 'status'
          const keys = key.split('.');
          let val = row;
          for (const k of keys) {
            val = val ? val[k] : undefined;
          }
          return String(val).toLowerCase() === String(value).toLowerCase();
        });
      }
    });

    // 2. Search Filter
    if (searchQuery && searchKey) {
      result = result.filter(row => {
        const keys = searchKey.split('.');
        let val = row;
        for (const k of keys) {
          val = val ? val[k] : undefined;
        }
        return String(val || '').toLowerCase().includes(searchQuery.toLowerCase());
      });
    }

    // 3. Sorting
    if (sortColumn && sortDirection) {
      result.sort((a, b) => {
        const keys = sortColumn.split('.');
        
        let valA = a;
        for (const k of keys) {
          valA = valA ? valA[k] : undefined;
        }
        
        let valB = b;
        for (const k of keys) {
          valB = valB ? valB[k] : undefined;
        }

        if (valA === undefined || valA === null) return 1;
        if (valB === undefined || valB === null) return -1;

        if (typeof valA === 'number' && typeof valB === 'number') {
          return sortDirection === 'asc' ? valA - valB : valB - valA;
        }

        const strA = String(valA).toLowerCase();
        const strB = String(valB).toLowerCase();
        return sortDirection === 'asc'
          ? strA.localeCompare(strB)
          : strB.localeCompare(strA);
      });
    }

    return result;
  }, [data, searchQuery, searchKey, selectedFilters, sortColumn, sortDirection]);

  // Pagination calculation
  const totalItems = processedData.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, currentPage, pageSize]);

  return (
    <div className="space-y-4">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {searchKey && (
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-slate-900 border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50 transition-all shadow-inner"
            />
          </div>
        )}

        <div className="flex items-center space-x-3 self-end md:self-auto">
          {filters.length > 0 && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center px-4 py-2.5 text-sm font-medium rounded-xl border transition-all ${
                showFiltersPanel
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/10'
                  : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
            </button>
          )}

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-slate-900 border border-white/5 text-gray-300 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500/50 cursor-pointer shadow-inner"
          >
            <option value={5}>5 Rows</option>
            <option value={10}>10 Rows</option>
            <option value={20}>20 Rows</option>
            <option value={50}>50 Rows</option>
          </select>
        </div>
      </div>

      {/* Dynamic Filters Expanded Panel */}
      {showFiltersPanel && filters.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4 bg-slate-900/50 border border-white/5 rounded-2xl animate-fade-in">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                {filter.label}
              </label>
              <select
                value={selectedFilters[filter.key] || 'all'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full bg-slate-950 border border-white/5 text-gray-200 text-sm rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500/50 shadow-inner"
              >
                <option value="all">All</option>
                {filter.options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* Table Container */}
      <div className="glass rounded-2xl border border-white/5 overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-400 ${
                      col.sortable ? 'cursor-pointer hover:text-white select-none transition-colors' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1.5">
                      <span>{col.label}</span>
                      {col.sortable && sortColumn === col.key && (
                        sortDirection === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="border-b border-white/5">
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        <Skeleton className="h-4 bg-slate-800 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row._id || index}
                    className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                  >
                    {columns.map((col) => {
                      const keys = col.key.split('.');
                      let val = row;
                      for (const k of keys) {
                        val = val ? val[k] : undefined;
                      }

                      return (
                        <td key={col.key} className="px-6 py-4 text-sm text-gray-200 font-medium">
                          {col.render ? col.render(row) : val !== undefined && val !== null ? String(val) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <span className="text-lg font-medium">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-white/[0.01] border-t border-white/5 gap-4">
            <div className="text-xs text-gray-400">
              Showing <span className="font-semibold text-white">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-white">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
              <span className="font-semibold text-white">{totalItems}</span> entries
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // simple pagination sliding window logic
                let pageNum = i + 1;
                if (currentPage > 3 && totalPages > 5) {
                  pageNum = currentPage - 2 + i;
                  if (pageNum + (4 - i) > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      currentPage === pageNum
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/15'
                        : 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg hover:text-white transition-all disabled:opacity-30 disabled:pointer-events-none"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
