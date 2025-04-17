import axios from "axios";

// base da url: https://api.themoviedb.org/3/
// url da api: /movie/now_playing?api_key=479f7b4b395919038e96907a929948ec&language=pt-BR

const api = axios.create({
    baseURL: 'https://api.themoviedb.org/3/'
});

export default api;