import { ApiManager } from "./ApiManager";

export const Api_AddProduct = {
    createProduct: async (addProductDto) => {
        try {
            console.log('Creating product with product data:', addProductDto);

            // Gửi request đến API
            const response = await ApiManager.post('/api/product/create', addProductDto);
            console.log('Raw API Response:', response);

            // Kiểm tra phản hồi từ API (đảm bảo có `productId`)
            if (!response || !response.productId) {
                throw new Error('Invalid product response received');
            }

            // Trả về dữ liệu nhận được từ API
            return response;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },
    createQuantity: async (quantityDto) => {
        try {
            console.log('Creating quantity with quantity data:', quantityDto);

            // Gửi request đến API
            const response = await ApiManager.post('/api/product/createQuantity', quantityDto);
            console.log('Raw API Response:', response);

            // Kiểm tra phản hồi từ API (đảm bảo có `quantityId`)


            // Trả về dữ liệu nhận được từ API
            return response;
        } catch (error) {
            console.error('Error creating quantity:', error);
            throw error;
        }
    },
    getProductById: async (productId) => {
        return ApiManager.get(`/api/product/findById/${productId}`);
    },
    getBrand: async () => {
        return ApiManager.get('/api/product/getBrand');
    },
    getColor: async () => {
        return ApiManager.get('/api/product/getColor');
    },
    getCategory: async () => {
        return ApiManager.get('/api/product/getCategory');
    },
    updateProduct: async (product) => {
        return ApiManager.put('/api/product/update', product);
    },
    deleteProduct: async (productId) => {
        return ApiManager.delete(`/api/product/delete/${productId}`);
    },
    getQuantity: async (productId) => {
        return ApiManager.get(`/api/product/getQuantityByProductId/${productId}`);
    },
    updateQuantity: async (id, data) => {
        return ApiManager.put(`/api/product/updateQuantity/${id}`, data);
    },
    deleteQuantity: async (quantityId) => {
        return ApiManager.delete(`/api/product/deleteQuantity/${quantityId}`);
    },
}
