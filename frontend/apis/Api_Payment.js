import { ApiManager } from "./ApiManager";

export const Api_Payment = {
    createPayment: async (invoiceDto) => {
        try {
            console.log('Creating payment with invoice data:', invoiceDto);
            const response = await ApiManager.post('/create_payment', invoiceDto);

            if (!response || !response.URL) {
                throw new Error('Invalid payment response received');
            }

            return response;
        } catch (error) {
            console.error('Error creating payment:', error);
            throw error;
        }
    },

    getPaymentInfo: async (params) => {
        try {
            console.log('Getting payment info with params:', params);
            const response = await ApiManager.get('/api/payment/payment_info', { params });
            console.log('Raw API Response:', response);
            return response;
        } catch (error) {
            console.error('Error getting payment info:', error);
            console.error('Error details:', error.response?.data);
            throw error;
        }
    },

    verifyPayment: async (paymentData) => {
        const response = await ApiManager.post('/api/payment/verify', paymentData);
        return response.data;
    },

    getOrderDetails: async () => {
        const response = await ApiManager.get('/api/order/order_details');
        return response.data;
    }
};
