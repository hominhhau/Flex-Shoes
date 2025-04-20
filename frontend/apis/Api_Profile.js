import axios from 'axios';

const BASE_URL = 'http://localhost:8888/api/v1';

// Tạo một instance của axios
export const ApiManager = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor để tự động gắn token vào mỗi request
ApiManager.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor để bắt lỗi 401 và xử lý tự động
ApiManager.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 401) {
            console.warn('Token hết hạn hoặc không hợp lệ!');
            localStorage.removeItem('token');
            window.location.href = '/login'; // hoặc navigate đến trang login
        }
        return Promise.reject(error);
    }
);



export const Api_Profile = {
  getProfile: async (userID) => {
    return ApiManager.get(`/profile/user/${userID}`);
},
};

