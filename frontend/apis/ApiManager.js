import axios from 'axios';


// http://192.168.1.100:6002
const BASE_URL = 'http://172.16.0.255:8080';

// Tạo một instance Axios với cấu hình mặc định
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    withCredentials: true, // Bật cookie để gửi với mỗi yêu cầu
    headers: {
        'Content-Type': 'application/json', // Tiêu đề mặc định
    },
    responseType: 'json', // Kiểu dữ liệu trả về mặc định


});

// Hàm request để thực hiện các yêu cầu
const request = async (method, url, data) => {
    try {
        console.log(`Making ${method.toUpperCase()} request to ${url} with data:`, data);
        const response = await axiosInstance({ method, url, data });
        console.log('Response:', response.data);
        return response.data;
    } catch (error) {
        console.error('API call error:', error);
        throw error;
    }
};

// API Manager với các phương thức HTTP
export const ApiManager = {
    get: async (url) => request('get', url),
    post: async (url, data) => request('post', url, data),
    put: async (url, data) => request('put', url, data),
    delete: async (url) => request('delete', url),
};


// test xem có connect được với server không

