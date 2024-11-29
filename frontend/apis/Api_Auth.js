import { ApiManager } from "./ApiManager";

export const Api_Auth = {

    login: async (username, password) => {
        return ApiManager.post('api/auth/login', {
            username: username,
            password: password,
        });
    },
    addCustomer: async (userInfor) => {
        return ApiManager.post('api/customers/add', userInfor);
    },
    registerAccount: async (loginDetails) => {
        return ApiManager.post('api/account/register', loginDetails);
    },
    logout: async (token) => {
        return ApiManager.post('api/auth/logout', token);
    },


};
