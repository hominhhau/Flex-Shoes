// import { ApiManager } from './ApiManager';

// export const Api_Product = {
//     // get all product
//     getProducts: async () => ApiManager.get('api/product'),
//     createProduct: async (data) => ApiManager.post('api/product/add', data),

//     // Lấy chi tiết sản phẩm theo ID
//     getProductDetail: async (id) => ApiManager.get(`api/product-detail/${id}`),

//     searchProduct: async (name) => ApiManager.get(`api/product/search?name=${encodeURIComponent(name)}`),
//     getAllProducts: async () => ApiManager.get(`api/products/admin`),

//     // Danh sách sản phẩm đã mua
//     getPurchasedProducts: async (customerId) => ApiManager.get(`/api/invoices/${customerId}`),
// };


import { ApiManager } from './ApiManager';

export const Api_Product = {
    // Lấy tất cả sản phẩm (qua inventory_service)
    getProducts: async () => ApiManager.get('/inventory/getAllProducts'),

    // Tạo sản phẩm mới
    createProduct: async (data) => ApiManager.post('/inventory/product/add', data),

    // Lấy chi tiết sản phẩm theo ID
    getProductDetail: async (id) => ApiManager.get(`/inventory/product-detail/${id}`),

    // Tìm kiếm sản phẩm theo tên
    searchProduct: async (name) =>
        ApiManager.get(`/inventory/product/search?name=${encodeURIComponent(name)}`),

    // Lấy tất cả sản phẩm cho admin
    getAllProducts: async () => ApiManager.get('/inventory/products/admin'),

    // Danh sách sản phẩm đã mua (qua order_service)
    getPurchasedProducts: async (customerId) =>
        ApiManager.get(`/invoices/${customerId}`),
};
