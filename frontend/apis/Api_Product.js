import { ApiManager } from './ApiManager';

export const Api_Product = {
    // get all product
    getProducts: async () => ApiManager.get('api/product'),
    createProduct: async (data) => ApiManager.post('api/product/add', data),

    // Lấy chi tiết sản phẩm theo ID
    getProductDetail: async (id) => ApiManager.get(`inventory/getAllProducts/${id}`),

    searchProduct: async (name) => ApiManager.get(`api/product/search?name=${encodeURIComponent(name)}`),
    getAllProducts: async () => ApiManager.get(`api/products/admin`),

    // Danh sách sản phẩm đã mua
    getPurchasedProducts: async (customerId) => ApiManager.get(`/api/invoices/${customerId}`),
};
