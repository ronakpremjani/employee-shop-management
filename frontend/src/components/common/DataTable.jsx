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
    <div className="space-y-4 font-sans">
      {/* Search and Filters Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {searchKey && (
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/10 transition-all shadow-sm"
            />
          </div>
        )}

        <div className="flex items-center space-x-2 self-end md:self-auto">
          {filters.length > 0 && (
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className={`flex items-center px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                showFiltersPanel
                  ? 'bg-zinc-900 border-zinc-800 text-white shadow-sm'
                  : 'bg-zinc-950 border-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-800'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5 mr-2 text-zinc-500" />
              Filters
            </button>
          )}

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="bg-zinc-950 border border-zinc-900 text-zinc-400 hover:text-white text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-zinc-800 cursor-pointer shadow-sm"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 p-4 bg-zinc-950 border border-zinc-900 rounded-lg animate-fade-in">
          {filters.map((filter) => (
            <div key={filter.key} className="space-y-1.5">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                {filter.label}
              </label>
              <select
                value={selectedFilters[filter.key] || 'all'}
                onChange={(e) => handleFilterChange(filter.key, e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-blue-500/50 shadow-inner cursor-pointer"
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
      <div className="bg-zinc-950 rounded-lg border border-zinc-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 bg-zinc-900/10">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => col.sortable && handleSort(col.key)}
                    className={`px-5 py-3 text-[10px] font-bold uppercase tracking-wider text-zinc-500 ${
                      col.sortable ? 'cursor-pointer hover:text-white select-none transition-colors' : ''
                    }`}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{col.label}</span>
                      {col.sortable && sortColumn === col.key && (
                        sortDirection === 'asc' ? <ChevronUp className="w-3 h-3 text-zinc-400" /> : <ChevronDown className="w-3 h-3 text-zinc-400" />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: pageSize }).map((_, i) => (
                  <tr key={i} className="border-b border-zinc-900/60">
                    {columns.map((col) => (
                      <td key={col.key} className="px-5 py-3.5">
                        <Skeleton className="h-3.5 bg-zinc-900 rounded w-2/3" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((row, index) => (
                  <tr
                    key={row._id || index}
                    className="border-b border-zinc-900/60 hover:bg-zinc-900/20 transition-colors"
                  >
                    {columns.map((col) => {
                      const keys = col.key.split('.');
                      let val = row;
                      for (const k of keys) {
                        val = val ? val[k] : undefined;
                      }

                      return (
                        <td key={col.key} className="px-5 py-3.5 text-xs text-zinc-300 font-medium">
                          {col.render ? col.render(row) : val !== undefined && val !== null ? String(val) : '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-1">
                      <span className="text-xs font-semibold">{emptyMessage}</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        {totalItems > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-3 bg-zinc-900/10 border-t border-zinc-900/60 gap-3">
            <div className="text-[10px] font-medium text-zinc-500 select-none">
              Showing <span className="font-semibold text-zinc-300">{(currentPage - 1) * pageSize + 1}</span> to{' '}
              <span className="font-semibold text-zinc-300">{Math.min(currentPage * pageSize, totalItems)}</span> of{' '}
              <span className="font-semibold text-zinc-300">{totalItems}</span> entries
            </div>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronsLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>

              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
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
                    className={`px-2.5 py-1 text-[10px] font-bold rounded transition-all cursor-pointer ${
                      currentPage === pageNum
                        ? 'bg-zinc-800 text-white'
                        : 'bg-zinc-950 text-zinc-400 hover:bg-zinc-900 hover:text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 rounded hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronsRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataTable;
