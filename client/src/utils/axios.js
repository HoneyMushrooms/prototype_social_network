import axios from 'axios';
import { refreshRoute } from './router';
import generateFingerprint from './fingerprint';

const api = axios.create({
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    return config;
});

api.interceptors.response.use((config) => {
    return config;
}, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true;
        try {
            console.log('перехватчик')
            const { data } = await axios.post(refreshRoute, {fingerprint: generateFingerprint()}, {withCredentials: true});
            localStorage.setItem('token', data.accessToken);
            return api.request(originalRequest);
        } catch (err) {
            console.log('не авторизован')
            window.location.href = '/login';
        }
    }
    throw error;
});



export default api;