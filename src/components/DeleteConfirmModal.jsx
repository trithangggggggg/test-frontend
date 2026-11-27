import React, { useState } from 'react';
import api from '../api/axiosClient.js';

export default function DeleteConfirmModal({ product, isOpen, onClose, onSuccess }) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !product) return null;

  const handleDelete = async () => {
    setDeleting(true);
    setError('');
    try {
      await api.delete(`/products/${product.id}`);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Không thể xoá sản phẩm, vui lòng thử lại.'
      );
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-content modal-confirm"
        data-testid="confirm-dialog"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3>Xác nhận xoá sản phẩm</h3>
          <button type="button" className="btn-close-modal" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <p>
            Bạn có chắc chắn muốn xoá sản phẩm <strong>{product.name}</strong> (SKU:{' '}
            <code>{product.sku}</code>) không?
          </p>
          <p className="warning-text">Hành động này không thể hoàn tác.</p>
          {error && <div className="modal-error-banner">{error}</div>}
        </div>

        <div className="modal-actions">
          <button
            type="button"
            className="btn-modal btn-cancel"
            data-testid="confirm-no"
            onClick={onClose}
            disabled={deleting}
          >
            Huỷ
          </button>
          <button
            type="button"
            className="btn-modal btn-danger"
            data-testid="confirm-yes"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Đang xoá...' : 'Xác nhận xoá'}
          </button>
        </div>
      </div>
    </div>
  );
}

