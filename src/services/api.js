import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
});

// Add a request interceptor to include the token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const getPlayers = async (page = 1, search = '') => {
    const response = await api.get(`/players?page=${page}&limit=12&search=${search}`);
    return response.data;
};

export const createPlayer = async (playerData) => {
    const response = await api.post('/players', playerData);
    return response.data;
};

export const updatePlayer = async (id, playerData) => {
    const response = await api.put(`/players/${id}`, playerData);
    return response.data;
};

export const deletePlayer = async (id) => {
    const response = await api.delete(`/players/${id}`);
    return response.data;
};

// Auth services could also be moved here
export default api;
