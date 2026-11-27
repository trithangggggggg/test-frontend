import React from 'react';

export default function Pagination({
  currentPage = 1,
  totalItems = 0,
  pageSize = 10,
  onPageChange,
}) {
  const totalPages = Math.ceil(totalItems / pageSize) || 1;

  return (
    <div data-testid="pagination" className="pagination-container">
      <div className="pagination-info">
        Hiển thị {totalItems === 0 ? 0 : Math.min((currentPage - 1) * pageSize + 1, totalItems)} -{' '}
        {Math.min(currentPage * pageSize, totalItems)} trong tổng số {totalItems} sản phẩm
      </div>

      <div className="pagination-buttons">
        {/* Nút chuyển trang trước (Mục 4.3.2) */}
        <button
          type="button"
          data-testid="page-prev"
          className="btn-page"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          « Trước
        </button>

        {/* Hiển thị số trang hiện tại (Mục 4.3.2) */}
        <span data-testid="page-current" className="page-current-badge">
          {currentPage}
        </span>

        {/* Nút chuyển trang sau (Mục 4.3.2) */}
        <button
          type="button"
          data-testid="page-next"
          className="btn-page"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Sau »
        </button>
      </div>
    </div>
  );
}
