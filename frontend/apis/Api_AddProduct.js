import { ApiManager } from "./ApiManager";

export const Api_AddProduct = {
    createProduct: async (addProductDto) => {
        try {
            console.log('Creating product with product data:', addProductDto);

            // Gửi request đến API
            //const response = await ApiManager.post('/api/product/create', addProductDto);
            const response = await ApiManager.post('/inventory/createProduct', addProductDto);
            console.log('Raw API Response:', response);

           // Sửa chỗ này: kiểm tra tồn tại của response.product thay vì productId
        if (!response || !response.product) {
            console.error("Unexpected API response format:", response);
            throw new Error('Invalid product response received');
        }

        const createdProduct = response.data;
            // Trả về dữ liệu nhận được từ API
            return createdProduct;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },
    createQuantity: async (quantityDto) => {
        try {
            console.log('Creating quantity with quantity data:', quantityDto);

            // Gửi request đến API
            const response = await ApiManager.post('/inventory/createQuantity', quantityDto);
            console.log('Raw API Response:', response);

            // Kiểm tra phản hồi từ API (đảm bảo có `quantityId`)


            // Trả về dữ liệu nhận được từ API
            //return response;
            return response.data.numberOfProduct;
        } catch (error) {
            console.error('Error creating quantity:', error);
            throw error;
        }
    },
    attachInventoryToProduct: async (payload) => {
        try {
            const response = await ApiManager.patch('/inventory/attachInventoryToProduct', payload);
            return response.data;
        } catch (error) {
            console.error("Error attaching inventory:", error);
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
        return ApiManager.get('/inventory/getAllColors');
    },
    getSize: async () => {
        return ApiManager.get('/inventory/getAllSizes');
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
