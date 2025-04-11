import axios from 'axios';


const BASE_URL = 'http://192.168.1.2:8085';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true,
    responseType: 'json',
    // Bỏ 'Content-Type' mặc định ở đây để linh hoạt hơn
});

const request = async (method, url, data = null, params = null, customHeaders = {}) => {
    try {
        console.log(`Making ${method.toUpperCase()} request to ${url}`);
        if (data) {
            if (data instanceof FormData) {
                console.log('Request is FormData');
                // Không log trực tiếp FormData, log các entries
                for (let [key, value] of data.entries()) {
                    console.log(`FormData - ${key}:`, value);
                }
            } else {
                console.log('Request data:', data);
            }
        }
        if (params) console.log('Request params:', params);

        const response = await axiosInstance({
            method,
            url,
            data,
            params,
            headers: {
                ...(data instanceof FormData ? {} : { 'Content-Type': 'application/json' }), // Chỉ đặt Content-Type cho JSON
                ...customHeaders, // Cho phép override header nếu cần
            },
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
    post: async (url, data, headers = {}) => request('post', url, data, null, headers),
    put: async (url, data) => request('put', url, data),
    delete: async (url) => request('delete', url),
};