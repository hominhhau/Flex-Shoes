import { ApiManager } from './ApiManager';

export const Api_ManagerCustomer = {
    //  getProducts: async () => ApiManager.get('api/product'),
     getAllCustomers: async () =>  ApiManager.get('/api/customers/getAll'),
};