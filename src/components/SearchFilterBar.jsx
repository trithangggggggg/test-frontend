import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient.js';

export default function SearchFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  selectedStatus,
  onStatusChange,
}) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    let active = true;
    api
      .get('/categories')
      .then((res) => {
        if (active && Array.isArray(res.data)) {
          setCategories(res.data);
        }
      })
      .catch((err) => {
        console.error('Không thể tải danh mục từ API:', err);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="filter-bar">
      {/* Ô tìm kiếm theo tên hoặc SKU (Mục 4.3.1) */}
      <div className="search-box">
        <input
          type="text"
          data-testid="search-input"
          className="search-input"
          placeholder="Tìm theo tên hoặc SKU..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
        {searchQuery && (
          <button
            type="button"
            className="btn-clear-search"
            onClick={() => onSearchChange('')}
            title="Xoá tìm kiếm"
          >
            ×
          </button>
        )}
      </div>

      <div className="filter-controls">
        {/* Ô lọc danh mục (Mục 4.3.1 - thẻ select) */}
        <select
          data-testid="category-filter"
          className="filter-select"
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
        >
          <option value="">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Ô lọc trạng thái (Mục 4.3.1 - thẻ select) */}
        <select
          data-testid="status-filter"
          className="filter-select"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="active">Đang bán</option>
          <option value="inactive">Ngừng bán</option>
        </select>
      </div>
    </div>
  );
}
