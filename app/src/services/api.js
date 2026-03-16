import axios from 'axios';

const api = axios.create({
    // baseURL: 'http://localhost:3000', <- O endereço antigo e fixo foi removido
    
    // O endereço inteligente: ele descobre sozinho se está no Railway ou no seu PC!
    baseURL: window.location.origin, 
});

api.interceptors.request.use(async (config) => {
    const token = localStorage.getItem('token'); 

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

export default api;
