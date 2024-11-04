import { ApiManager } from "./ApiManager";

// register
export const Api_Product = {

    // get all product
    getProducts: async () => ApiManager.get('api/product'),
    createProduct: async (data) => ApiManager.post('api/product/add', data),
}