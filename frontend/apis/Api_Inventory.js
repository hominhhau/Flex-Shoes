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
ApiManager.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

// Interceptor để bắt lỗi 401 và xử lý tự động
ApiManager.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn('Token hết hạn hoặc không hợp lệ!');
            localStorage.removeItem('token');
            window.location.href = '/login'; // hoặc navigate đến trang login
        }
        return Promise.reject(error);
    },
);

export const Api_Inventory = {
    createProduct: async (formData) => {
        try {
            console.log('Creating product with form data:', formData); // Log FormData (không thể log trực tiếp)

            // Gửi request đến API với FormData
            const response = await ApiManager.post('/inventory/createProduct', formData, {
                headers: {
                    // Không đặt 'Content-Type' ở đây, để axios tự xử lý với FormData
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log('Raw API Response:', response);

            if (!response) {
                console.error('Unexpected API response format:', response);
                throw new Error('Invalid product response received');
            }

            const createdProduct = response; // response đã là dữ liệu từ ApiManager
            return createdProduct.data;
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    },
    getAllProducts: async () => {
        try {
            const response = await ApiManager.get('/inventory/getAllProducts');
            return response.data;
        } catch (error) {
            console.error('Error fetching products:', error);
            throw error;
        }
    },

    attachInventoryToProduct: async (payload) => {
        try {
            const response = await ApiManager.patch('/inventory/attachInventoryToProduct', payload);
            return response.data;
        } catch (error) {
            console.error('Error attaching inventory:', error);
            throw error;
        }
    },
    updateProduct: async (product) => {
        try {
            const response = await ApiManager.post('/inventory/update', product);
            return response;
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    },

    getProductById: async (productId) => {
        return ApiManager.get(`/inventory/getAllProducts/${productId}`);
    },
    getBrand: async () => {
        return ApiManager.get('/inventory/getAllBrandTypes');
    },
    getColor: async () => {
        return ApiManager.get('/inventory/getAllColors');
    },
    getSize: async () => {
        return ApiManager.get('/inventory/getAllSizes');
    },
    getCategory: async () => {
        return ApiManager.get('/inventory/getAllProductTypes');
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
    purchase: async (data) => {
        console.log('Dữ liệu gửi đi từ frontend: ', data);
        return ApiManager.post('/inventory/purchase', data);
    },
};
