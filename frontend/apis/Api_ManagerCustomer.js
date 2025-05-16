import { ApiManager } from './ApiManager';

export const Api_ManagerCustomer = {
    //  getProducts: async () => ApiManager.get('api/product'),
    getAllCustomers: async () =>
        ApiManager.get('/profile/customers', {
            // params: { id: 123 },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }),
};
