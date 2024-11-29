import { ApiManager } from './ApiManager';

export const Api_InvoiceAdmin = {
    // Lấy danh sách 10 hóa đơn gần nhất
    getRecentInvoices: async () => ApiManager.get('api/invoices/recent'),

    // Lấy tổng số đơn hàng
    getTotalOrders: async () => ApiManager.get('api/invoices/total'),

    // Lấy tổng số đơn hàng đang vận chuyển
    getTotalShipping: async () => ApiManager.get('api/invoices/shipping'),

    // Lấy tổng tiền của tất cả hóa đơn
    getTotalRevenue: async () => ApiManager.get('api/invoices/total-amount'),

    getInvoiceById: async (id) => ApiManager.get(`api/invoices/findById/${id}`),

    getInvoiceDetail: async (id) => ApiManager.get(`api/invoices/findDetailById/${id}`),

    updateInvoice: async (data) => ApiManager.put(`api/invoices/updateInvoice`, data),

    delete: async (id) => ApiManager.delete(`api/invoiceDetail/delete/${id}`),

};
