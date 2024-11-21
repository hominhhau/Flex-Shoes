import { ApiManager } from './ApiManager';
<<<<<<< HEAD

=======
>>>>>>> feature/headernew

export const Api_Product = {
    // get all product
    getProducts: async () => ApiManager.get('api/product'),
    createProduct: async (data) => ApiManager.post('api/product/add', data),
<<<<<<< HEAD
    // Lấy chi tiết sản phẩm theo ID
    getProductDetail: async (id) => ApiManager.get(`api/product-detail/${id}`),
=======
    searchProduct: async (name) => ApiManager.get(`api/product/search?name=${encodeURIComponent(name)}`),
>>>>>>> feature/headernew
};
