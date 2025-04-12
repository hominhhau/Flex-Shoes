// export const Api_Auth = {
//     login: async (username, password) => {
//         return ApiManager.post('/login', {
//             username,
//             password,
//         });
//     },
//     addCustomer: async (userInfor) => {
//         return ApiManager.post('/customers/add', userInfor);
//     },
//     registerAccount: async (loginDetails) => {
//         return ApiManager.post('/account/register', loginDetails);
//     },
//     logout: async (token) => {
//         return ApiManager.post('/auth/logout', token);
//     },
//     getMyInfor: async () => {
//         return ApiManager.get('/account/getMyInfor');
//     }
// };

import { ApiManager } from './ApiManager';

export const Api_Auth = {
    login: async (userName, password) => {
        return ApiManager.post('/users/sign-in', { userName, password });
    },
    registerAccount: async (loginDetails) => {
        return ApiManager.post('/users/sign-up', loginDetails);
    },
    refreshToken: async (token) => {
        return ApiManager.post('/users/refresh-token', { token });
    },
    introspect: async (token) => {
        return ApiManager.post('/users/introspect', { token });
    }
};

