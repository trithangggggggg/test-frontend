import React from 'react';
import { categoryNames } from '../data/sample.js';

export default function ProductTable({ products = [], onEdit, onDelete }) {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN').format(price) + ' đ';
  };

  if (!products || products.length === 0) {
    return (
      <div data-testid="empty-state" className="empty-state">
        <p>Không có sản phẩm nào phù hợp.</p>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="Product-table" data-testid="product-table">
        <thead className="Product-table-header">
          <tr>
            <th>Tên</th>
            <th>SKU</th>
            <th>Danh mục</th>
            <th>Giá</th>
            <th>Tồn kho</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody className="Product-table-body">
          {products.map((product) => {
            const isOutOfStock = product.stock === 0;
            const isActive = product.status === 'active';
            const categoryName = categoryNames[product.category] || product.category;

            return (
              <tr key={product.id || product.sku} data-testid="product-row">
                <td data-label="Tên" className="col-name">
                  <strong>{product.name}</strong>
                </td>
                <td data-label="SKU" className="col-sku">
                  {product.sku}
                </td>
                <td data-label="Danh mục" className="col-category">
                  {categoryName}
                </td>
                <td data-label="Giá" className="col-price">
                  {formatPrice(product.price)}
                </td>
                <td data-label="Tồn kho" className="col-stock">
                  {isOutOfStock ? (
                    <span className="stock-out">Hết hàng</span>
                  ) : (
                    product.stock
                  )}
                </td>
                <td data-label="Trạng thái" className="col-status">
                  <span
                    data-testid="product-status"
                    className={`Product-status ${isActive ? 'active' : 'inactive'}`}
                  >
                    {isActive ? 'Đang bán' : 'Ngừng bán'}
                  </span>
                </td>
                <td data-label="Thao tác" className="col-actions">
                  <div className="action-buttons">
                    <button
                      type="button"
                      className="Edit-button"
                      data-testid="edit-button"
                      onClick={() => onEdit?.(product)}
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      className="Delete-button"
                      data-testid="delete-button"
                      onClick={() => onDelete?.(product)}
                    >
                      Xoá
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
