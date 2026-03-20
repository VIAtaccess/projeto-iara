import axios from 'axios';

const api = axios.create({
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

// ========================================================
// 🛡️ DETECTOR DE SESSÃO EXPIRADA
// ========================================================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Se o servidor responder com 401, significa que o Token (a chave) expirou
        if (error.response && error.response.status === 401) {
            console.warn("Sessão expirada detectada pelo Carteiro.");
            
            // Removemos o token antigo do navegador pois ele não vale mais nada
            localStorage.removeItem('token');
            
            // Criamos um sinal de alerta (sessaoExpirada) para a tela do Chat saber o que houve
            error.sessaoExpirada = true;
        }
        return Promise.reject(error);
    }
);

export default api;
