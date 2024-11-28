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
}
