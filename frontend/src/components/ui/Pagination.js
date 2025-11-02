import React from "react";

export default function Pagination({ totalPages, currentPage, setCurrentPage }) {
  const baseClasses =
    "px-3 py-2 text-sm leading-tight border transition duration-150 ease-in-out cursor-pointer select-none rounded-md";
  const normalClasses =
    "text-text bg-background border-light-gray hover:bg-light-gray hover:text-text";
  const activeClasses =
    "bg-primary text-white border-primary hover:bg-primary/90 shadow";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevious = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  /**
   * 🧠 Improved window logic:
   * Show first, last, and a dynamic range (2 before & 2 after current)
   */
  const getPageNumbers = () => {
    const visibleRange = 2;
    const pages = [];

    // Always include the first page
    pages.push(1);

    // Show left dots
    if (currentPage - visibleRange > 2) pages.push("...");

    // Show middle window
    const start = Math.max(2, currentPage - visibleRange);
    const end = Math.min(totalPages - 1, currentPage + visibleRange);
    for (let i = start; i <= end; i++) pages.push(i);

    // Show right dots
    if (currentPage + visibleRange < totalPages - 1) pages.push("...");

    // Always include the last page
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <nav aria-label="Pagination" className="my-8">
      <ul className="flex justify-center items-center space-x-1 text-sm font-medium">
        {/* Previous */}
        <li
          className={`${baseClasses} ${normalClasses} ${
            currentPage === 1 ? disabledClasses : ""
          }`}
          onClick={handlePrevious}
        >
          ‹
        </li>

        {/* Pages */}
        {pages.map((page, idx) =>
          page === "..." ? (
            <li
              key={`dots-${idx}`}
              className="px-3 py-2 text-secondary select-none"
            >
              …
            </li>
          ) : (
            <li
              key={page}
              className={`${baseClasses} ${
                currentPage === page ? activeClasses : normalClasses
              }`}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </li>
          )
        )}

        {/* Next */}
        <li
          className={`${baseClasses} ${normalClasses} ${
            currentPage === totalPages ? disabledClasses : ""
          }`}
          onClick={handleNext}
        >
          ›
        </li>
      </ul>
    </nav>
  );
}
