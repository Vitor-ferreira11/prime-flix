import axios from 'axios';
// Credenciais confidenciais exigem backend: a chave no navegador continua pública.
const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/',
    timeout: 15000,
    params: { api_key: process.env.REACT_APP_TMDB_API_KEY, language: 'pt-BR' }
});
export default api;
