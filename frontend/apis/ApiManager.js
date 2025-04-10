import axios from 'axios';

// http://192.168.1.100:6002
const BASE_URL = 'http://172.16.0.159:8080';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
    responseType: 'json',
});

const request = async (method, url, data = null, params = null) => {
    try {
        console.log(`Making ${method.toUpperCase()} request to ${url}`);
        if (data) console.log('Request data:', data);
        if (params) console.log('Request params:', params);

        const response = await axiosInstance({
            method,
            url,
            data,
            params,
        });

        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

export const ApiManager = {
    get: async (url, { params } = {}) => request('get', url, null, params),
    post: async (url, data) => request('post', url, data),
    put: async (url, data) => request('put', url, data),
    delete: async (url) => request('delete', url),
};
