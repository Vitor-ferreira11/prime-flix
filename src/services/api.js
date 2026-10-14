import axios from 'axios';
// Credenciais confidenciais exigem backend: a chave no navegador continua pública.
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    timeout: 15000,
    params: { api_key: import.meta.env.VITE_TMDB_API_KEY, language: 'pt-BR' }
});
export default api;
