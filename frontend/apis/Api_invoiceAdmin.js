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

    // Lấy tổng số đơn hàng
    getTotalOrders: async () => ApiManager.get('invoices/total'),

    // Lấy tổng số đơn hàng đang vận chuyển
    getTotalShipping: async () => ApiManager.get('invoices/shipping'),

    // Lấy tổng tiền của tất cả hóa đơn
    getTotalRevenue: async () => ApiManager.get('invoices/total-amount'),

    getInvoiceById: async (id) => ApiManager.get(`invoices/findById/${id}`),

    getInvoiceDetail: async (id) => ApiManager.get(`invoices/findDetailById/${id}`),

    createInvoice: async (data) => ApiManager.post(`invoices/add`, data),

    updateInvoice: async (data) => ApiManager.put(`invoices/updateInvoice`, data),

    // Tìm kiếm hóa đơn dựa trên ID, tên khách hàng, hoặc trạng thái đơn hàng
    searchInvoices: async (params) => {
        const queryString = new URLSearchParams(params).toString();
        return ApiManager.get(`invoices/search?${queryString}`);
    },

    delete: async (id) => ApiManager.delete(`invoiceDetail/delete/${id}`),

    updateQuantityAfterCheckout: async (data) => ApiManager.put(`api/product/updateQuantityAfterCheckout`, data),

    // Lấy danh sách sản phẩm đã mua của một customer
    getPurchasedProducts: async (customerId) => ApiManager.get(`/invoices/findByCustomerId/${customerId}`),
};