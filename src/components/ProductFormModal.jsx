import React, { useState, useEffect } from 'react';
import api from '../api/axiosClient.js';
import { categoryNames } from '../data/sample.js';

const SKU_REGEX = /^[A-Z]{3}-\d{4}$/;

export default function ProductFormModal({ product, isOpen, onClose, onSuccess }) {
  const isEditMode = Boolean(product && product.id);

  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'keyboard',
    price: '',
    stock: '',
    status: 'active',
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'keyboard',
        price: product.price ?? '',
        stock: product.stock ?? '',
        status: product.status || 'active',
      });
    } else {
      setFormData({
        name: '',
        sku: '',
        category: 'keyboard',
        price: '',
        stock: '',
        status: 'active',
      });
    }
    setErrors({});
    setServerError('');
  }, [product, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    const name = formData.name.trim();

    if (!name || name.length < 3 || name.length > 100) {
      errs.name = 'Tên sản phẩm từ 3 đến 100 ký tự';
    }

    if (!formData.sku || !SKU_REGEX.test(formData.sku.trim())) {
      errs.sku = 'SKU có dạng ABC-1234';
    }

    if (!formData.category) {
      errs.category = 'Danh mục không hợp lệ';
    }

    const priceNum = Number(formData.price);
    if (formData.price === '' || formData.price === null || isNaN(priceNum) || priceNum <= 0) {
      errs.price = 'Giá phải lớn hơn 0';
    }

    const stockNum = Number(formData.stock);
    if (
      formData.stock === '' ||
      formData.stock === null ||
      isNaN(stockNum) ||
      !Number.isInteger(stockNum) ||
      stockNum < 0
    ) {
      errs.stock = 'Tồn kho là số nguyên không âm';
    }

    if (!['active', 'inactive'].includes(formData.status)) {
      errs.status = 'Trạng thái không hợp lệ';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'sku' ? value.toUpperCase() : value,
    }));

    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setServerError('');

    const payload = {
      name: formData.name.trim(),
      sku: formData.sku.trim(),
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      status: formData.status || 'active',
    };

    try {
      if (isEditMode) {
        await api.put(`/products/${product.id}`, payload);
      } else {
        await api.post('/products', payload);
      }
      onSuccess?.();
      onClose();
    } catch (err) {
      const resp = err.response?.data;
      if (resp?.field) {
        setErrors((prev) => ({ ...prev, [resp.field]: resp.message }));
      } else {
        setServerError(resp?.message || err.message || 'Có lỗi xảy ra, vui lòng thử lại');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{isEditMode ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}</h3>
          <button
            type="button"
            className="btn-close-modal"
            data-testid="cancel-button"
            onClick={onClose}
          >
            ×
          </button>
        </div>

        {serverError && <div className="modal-error-banner">{serverError}</div>}

        <form data-testid="product-form" onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label htmlFor="name">
              Tên sản phẩm <span className="required">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              data-testid="input-name"
              className={`form-input ${errors.name ? 'input-error' : ''}`}
              placeholder="Nhập tên sản phẩm (3 - 100 ký tự)"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <span data-testid="field-error-name" className="field-error">
                {errors.name}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="sku">
              Mã SKU <span className="required">*</span>
            </label>
            <input
              id="sku"
              name="sku"
              type="text"
              data-testid="input-sku"
              className={`form-input ${errors.sku ? 'input-error' : ''}`}
              placeholder="VD: ABC-1234"
              value={formData.sku}
              onChange={handleChange}
            />
            {errors.sku && (
              <span data-testid="field-error-sku" className="field-error">
                {errors.sku}
              </span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="category">
              Danh mục <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              data-testid="input-category"
              className={`form-input ${errors.category ? 'input-error' : ''}`}
              value={formData.category}
              onChange={handleChange}
            >
              {Object.entries(categoryNames).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            {errors.category && (
              <span data-testid="field-error-category" className="field-error">
                {errors.category}
              </span>
            )}
          </div>

          <div className="form-row">
            <div className="form-group form-col">
              <label htmlFor="price">
                Giá (VNĐ) <span className="required">*</span>
              </label>
              <input
                id="price"
                name="price"
                type="number"
                data-testid="input-price"
                className={`form-input ${errors.price ? 'input-error' : ''}`}
                placeholder="VD: 500000"
                value={formData.price}
                onChange={handleChange}
              />
              {errors.price && (
                <span data-testid="field-error-price" className="field-error">
                  {errors.price}
                </span>
              )}
            </div>

            <div className="form-group form-col">
              <label htmlFor="stock">
                Tồn kho <span className="required">*</span>
              </label>
              <input
                id="stock"
                name="stock"
                type="number"
                data-testid="input-stock"
                className={`form-input ${errors.stock ? 'input-error' : ''}`}
                placeholder="VD: 10"
                value={formData.stock}
                onChange={handleChange}
              />
              {errors.stock && (
                <span data-testid="field-error-stock" className="field-error">
                  {errors.stock}
                </span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Trạng thái</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="active"
                  data-testid="input-status-active"
                  checked={formData.status === 'active'}
                  onChange={handleChange}
                />
                Đang bán
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  name="status"
                  value="inactive"
                  data-testid="input-status-inactive"
                  checked={formData.status === 'inactive'}
                  onChange={handleChange}
                />
                Ngừng bán
              </label>
            </div>
            {errors.status && (
              <span data-testid="field-error-status" className="field-error">
                {errors.status}
              </span>
            )}
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-modal btn-cancel"
              data-testid="cancel-button"
              onClick={onClose}
              disabled={submitting}
            >
              Huỷ
            </button>
            <button
              type="submit"
              className="btn-modal btn-submit"
              data-testid="submit-button"
              disabled={submitting}
            >
              {submitting ? 'Đang lưu...' : isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

