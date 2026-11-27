import { useEffect, useState, useCallback } from 'react';
import api from '../api/axiosClient.js';
import axios from 'axios';

/**
 * Custom hook tải danh sách sản phẩm theo từ khoá, danh mục, trạng thái và trang.
 * Xử lý triệt để race condition (bất đồng bộ) bằng AbortController và cờ active.
 */
export default function useProductSearch(params = {}) {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Kích hoạt làm mới khi refetch được gọi
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const refetch = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const { q = '', category = '', status = '', page = 1, limit = 10 } = params;

  useEffect(() => {
    let active = true;
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError(null);

      try {
        const queryParams = {};
        if (q && q.trim()) queryParams.q = q.trim();
        if (category) queryParams.category = category;
        if (status) queryParams.status = status;
        if (page) queryParams.page = page;
        if (limit) queryParams.limit = limit;

        const res = await api.get('/products', {
          params: queryParams,
          signal: controller.signal,
        });

        if (active) {
          setData(res.data?.data || []);
          setTotal(res.data?.total || 0);
          setLoading(false);
        }
      } catch (err) {
        // Bỏ qua lỗi huỷ request (khi có request mới ghi đè)
        if (axios.isCancel(err) || err.name === 'CanceledError') {
          return;
        }
        if (active) {
          const errMsg =
            err.response?.data?.message || err.message || 'Lỗi khi tải dữ liệu';
          setError(errMsg);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [q, category, status, page, limit, refreshTrigger]);

  return { data, total, loading, error, refetch };
}

