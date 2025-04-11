import axios from 'axios';

const BASE_URL = 'http://localhost:8083';

// Lấy token từ localStorage (hoặc nơi bạn lưu trữ nó)
const authToken = localStorage.getItem('token');

export const ApiManager = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Authorization': authToken ? `Bearer ${authToken}` : undefined, // Thêm token vào header Authorization
    },
});


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