import React, { useState } from 'react';
import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import ProductTable from './components/ProductTable.jsx';
import ProductFormModal from './components/ProductFormModal.jsx';
import DeleteConfirmModal from './components/DeleteConfirmModal.jsx';
import SearchFilterBar from './components/SearchFilterBar.jsx';
import Pagination from './components/Pagination.jsx';
import useProductSearch from './hooks/useProductSearch.js';

function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Đọc các tham số tìm kiếm, lọc và phân trang từ URL (Mục 4.3.1, 4.3.2, 4.3.3)
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const status = searchParams.get('status') || '';
  const page = Number(searchParams.get('page')) || 1;
  const limit = 10;

  // Custom hook tải danh sách sản phẩm qua API có AbortController (Mục 4.3.3, 4.3.4)
  const { data: products, total, loading, error, refetch } = useProductSearch({
    q,
    category,
    status,
    page,
    limit,
  });

  // Modal thêm/sửa sản phẩm
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  // Modal xoá sản phẩm
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Toast thông báo
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Cập nhật URLSearchParams đồng bộ với state (Mục 4.3.1)
  const updateQueryParams = (updates) => {
    const nextParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        nextParams.set(key, String(value));
      } else {
        nextParams.delete(key);
      }
    });
    setSearchParams(nextParams);
  };

  const handleSearchChange = (val) => {
    // Khi tìm kiếm: cập nhật q và reset trang về 1
    updateQueryParams({ q: val, page: 1 });
  };

  const handleCategoryChange = (val) => {
    // Khi lọc danh mục: cập nhật category và reset trang về 1
    updateQueryParams({ category: val, page: 1 });
  };

  const handleStatusChange = (val) => {
    // Khi lọc trạng thái: cập nhật status và reset trang về 1
    updateQueryParams({ status: val, page: 1 });
  };

  const handlePageChange = (newPage) => {
    // Khi chuyển trang: cập nhật page trên URL (Mục 4.3.2)
    updateQueryParams({ page: newPage });
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleOpenDelete = (product) => {
    setDeletingProduct(product);
    setIsDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    refetch();
    showToast(
      editingProduct
        ? 'Cập nhật sản phẩm thành công!'
        : 'Thêm sản phẩm mới thành công!'
    );
  };

  const handleDeleteSuccess = () => {
    refetch();
    showToast('Xoá sản phẩm thành công!');
  };

  return (
    <div className="app-layout">
      {/* Toast thông báo thành công */}
      {toastMessage && (
        <div className="toast-container">
          <div data-testid="toast" className="toast">
            {toastMessage}
          </div>
        </div>
      )}

      {/* Header trang */}
      <header className="App-header">
        <h2 className="App-brand">OfficeMart Admin</h2>
      </header>

      <main className="App-main">
        {/* Tiêu đề & Nút thêm sản phẩm */}
        <div className="App-header-body">
          <h1 className="App-title">Sản phẩm</h1>
          <button
            type="button"
            className="Add-button"
            data-testid="add-button"
            onClick={handleOpenAdd}
          >
            Thêm sản phẩm
          </button>
        </div>

        {/* Thanh tìm kiếm và bộ lọc (Mục 4.3.1) */}
        <SearchFilterBar
          searchQuery={q}
          onSearchChange={handleSearchChange}
          selectedCategory={category}
          onCategoryChange={handleCategoryChange}
          selectedStatus={status}
          onStatusChange={handleStatusChange}
        />

        {/* Khối lỗi và nút retry */}
        {error && (
          <div data-testid="error-message" className="error-banner">
            <span>⚠️ {error}</span>
            <button
              type="button"
              data-testid="retry-button"
              className="btn-retry"
              onClick={refetch}
            >
              Thử lại
            </button>
          </div>
        )}

        {/* Khối loading khi đang tải */}
        {loading ? (
          <div data-testid="loading" className="loading-container">
            <div className="spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : !error && products.length === 0 ? (
          /* Khối danh sách rỗng (empty-state) */
          <div data-testid="empty-state" className="empty-state">
            <p>Không có sản phẩm nào phù hợp.</p>
          </div>
        ) : (
          /* Bảng sản phẩm thực tế */
          <ProductTable
            products={products}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
          />
        )}

        {/* Điều hướng phân trang (Mục 4.3.2) */}
        {!loading && total > 0 && (
          <Pagination
            currentPage={page}
            totalItems={total}
            pageSize={limit}
            onPageChange={handlePageChange}
          />
        )}
      </main>

      {/* Modal Form Thêm / Sửa */}
      <ProductFormModal
        isOpen={isFormOpen}
        product={editingProduct}
        onClose={() => setIsFormOpen(false)}
        onSuccess={handleFormSuccess}
      />

      {/* Modal Xác nhận xoá */}
      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        product={deletingProduct}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products" replace />} />
      <Route path="/products" element={<ProductsPage />} />
    </Routes>
  );
}
