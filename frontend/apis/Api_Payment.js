import axios from 'axios';

const BASE_URL = 'https://api.flexshoes.io.vn/api/v1';

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
        } else {
            console.warn('Token is missing, please log in again.');
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

export const Api_Payment = {
    createPayment: async (payload) => {
        try {
            const response = await ApiManager.post('/payment/create_payment', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },
    getAllPayments: async () => {
        try {
            const response = await ApiManager.get('/payment/getAllPayments');
            return response.data;
        } catch (error) {
            console.error('Error fetching payments:', error);
            throw error;
        }
    },
    getPaymentById: async (paymentId) => {
        try {
            const response = await ApiManager.get(`/payment/getPaymentById/${paymentId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching payment by ID:', error);
            throw error;
        }
    },
    payment_return: async (params) => {
        try {
            const response = await ApiManager.get('/payment/payment-return', { params });
            return response.data;
        } catch (error) {
            console.error('Error processing payment return:', error);
            throw error;
        }
    },
};
