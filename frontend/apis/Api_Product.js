import axios from 'axios';

const BASE_URL = 'http://localhost:8085';

export const ApiManager = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const Api_Product = {
    // Lấy tất cả sản phẩm (user view)
    getProducts: async () => ApiManager.get('/api/product'),

    // Tạo sản phẩm mới
    createProduct: async (data) => ApiManager.post('/api/product/add', data),

    // Lấy chi tiết sản phẩm theo ID (BE mẫu: http://localhost:8085/inventory/getAllProducts/67f4dc1caed1a8f2984039c9)
    getProductDetail: async (id) => ApiManager.get(`/inventory/getAllProducts/${id}`),

    // Tìm kiếm sản phẩm theo tên
    searchProduct: async (name) => ApiManager.get(`/api/product/search?name=${encodeURIComponent(name)}`),

    // Lấy tất cả sản phẩm cho admin
    getAllProducts: async () => ApiManager.get('/api/products/admin'),


};
