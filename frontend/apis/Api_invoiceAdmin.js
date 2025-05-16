import axios from 'axios';

const BASE_URL = 'http://localhost:8888/api/v1';

// Tạo một instance của axios
export const ApiManager = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động gắn token vào mỗi request
ApiManager.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor để bắt lỗi 401 và xử lý tự động
ApiManager.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.warn('Token hết hạn hoặc không hợp lệ!');
            localStorage.removeItem('token');
            window.location.href = '/login'; // hoặc navigate đến trang login
        }
        return Promise.reject(error);
    }
);



export const Api_InvoiceAdmin = {
    // Lấy danh sách 10 hóa đơn gần nhất
    getRecentInvoices: async () => ApiManager.get('invoices/recent'),

    /**
     * Lấy tổng số đơn hàng, có thể lọc theo khoảng thời gian
     * @param {Object} params - Tham số lọc { startDate: 'yyyy-MM-dd', endDate: 'yyyy-MM-dd' }
     * @returns {Promise} Trả về tổng số đơn hàng
     */
    getTotalOrders: async (params = {}) => {
        return ApiManager.get('/invoices/total', { params });
    },

    /**
     * Lấy tổng số đơn hàng đang vận chuyển, có thể lọc theo khoảng thời gian
     * @param {Object} params - Tham số lọc { startDate: 'yyyy-MM-dd', endDate: 'yyyy-MM-dd' }
     * @returns {Promise} Trả về tổng số đơn hàng đang vận chuyển
     */
    getTotalShipping: async (params = {}) => {
        return ApiManager.get('/invoices/shipping', { params });
    },

    /**
     * Lấy tổng doanh thu của tất cả hóa đơn, có thể lọc theo khoảng thời gian
     * @param {Object} params - Tham số lọc { startDate: 'yyyy-MM-dd', endDate: 'yyyy-MM-dd' }
     * @returns {Promise} Trả về tổng doanh thu
     */
    getTotalRevenue: async (params = {}) => {
        return ApiManager.get('/invoices/total-amount', { params });
    },

    getInvoiceById: async (id) => ApiManager.get(`invoices/findById/${id}`),

    getInvoiceDetail: async (id) => ApiManager.get(`invoices/findDetailById/${id}`),

    createInvoice: async (data) => ApiManager.post(`invoices/add`, data),

    updateInvoice: async (data) => ApiManager.put(`invoices/updateInvoice`, data),

    updateOrderStatus: async (invoiceId, orderStatus) => {
        console.log('Sending updateOrderStatus request:', { invoiceId, orderStatus });
        return ApiManager.put(`/invoices/update/${invoiceId}/status`, orderStatus);
    },

    // Tìm kiếm hóa đơn dựa trên ID, tên khách hàng, hoặc trạng thái đơn hàng

    searchInvoices: async (filters) => {
        const params = {};
        // Chỉ gửi một tham số lọc tại một thời điểm
        if (filters.id) {
            params.id = filters.id;
        } else if (filters.customerName) {
            params.customerName = filters.customerName;
        } else if (filters.orderStatus) {
            params.orderStatus = filters.orderStatus;
        }

        const queryString = new URLSearchParams(params).toString();
        return ApiManager.get(`invoices/search?${queryString}`);
    },

    delete: async (id) => ApiManager.delete(`invoiceDetail/delete/${id}`),

    updateQuantityAfterCheckout: async (data) => ApiManager.put(`/inventory/purchase`, data),

    // Lấy danh sách sản phẩm đã mua của một customer
    getPurchasedProducts: async (customerId) => ApiManager.get(`/invoices/findByCustomerId/${customerId}`),
    /**
         * Lấy số lượng đơn hàng theo tháng trong một năm, có thể lọc theo khoảng thời gian
         * @param {number} year - Năm cần thống kê
         * @param {Object} params - Tham số lọc { startDate: 'yyyy-MM-dd', endDate: 'yyyy-MM-dd' }
         * @returns {Promise} Trả về danh sách số lượng đơn hàng theo tháng
         */
    getOrderCountByMonthsInYear: async (year, params = {}) => {
        return ApiManager.get(`/invoices/stats/orders-by-month/${year}`, { params });
    },

    /**
     * Lấy doanh thu theo tháng trong một năm, có thể lọc theo khoảng thời gian
     * @param {number} year - Năm cần thống kê
     * @param {Object} params - Tham số lọc { startDate: 'yyyy-MM-dd', endDate: 'yyyy-MM-dd' }
     * @returns {Promise} Trả về danh sách doanh thu theo tháng
     */
    getRevenueByMonthsInYear: async (year, params = {}) => {
        return ApiManager.get(`/invoices/stats/revenue-by-month/${year}`, { params });
    },


    getOrderCountByYears: async (params) => {
        return axios.get(`/invoices/stats/orders-by-year`, { params });
    },
    getRevenueByYears: async (params) => {
        return axios.get(`/invoices/stats/revenue-by-year`, { params });
    },

    // /stats/orders-by-day

   getRevenueByDays: async (params) => {
        return await axios.get(`/invoices/stats/revenue-by-day`, { params });
    },
    getOrderCountByDays: async (params) => {
        return await axios.get(`/invoices/stats/orders-by-day`, { params });
    }
};