import{ useEffect, useState} from 'react';
import api from '../../services/api';
import {Link} from 'react-router-dom'
import './home.css';


function Home(){
    const [filmes, setFilmes ] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(()=>{
        const controller = new AbortController();

        async function loadFilmes(){
            try {
            const response = await api.get('movie/now_playing', {
                signal: controller.signal,
                params:{
                    language:"pt-br",
                    page: 1,
                }
            })

            //console.log(response.data.results.slice(0,10));
            if (!controller.signal.aborted) setFilmes(response.data.results.slice(0,10))
            } catch {
                if (!controller.signal.aborted) setError(true);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }

        loadFilmes();
        return () => controller.abort();

    }, [])


    if(error) return <p role="alert">Não foi possível carregar os filmes. Verifique a conexão e a configuração da API e recarregue a página.</p>;
    if(loading){
       return(
         <div className="loading">
            <h2>Carregando filmes...</h2>
        </div>
       )
    }


    return(
        <div className="container">
            <div className="lista-filmes">
                {filmes.map((filme)=>{
                    return(
                        <article key={filme.id}>
                            <strong>{filme.title}</strong>
                            <img src={`https://image.tmdb.org/t/p/original/${filme.poster_path}`} alt={filme.title}/>
                            <Link to={`/filme/${filme.id}`}>Acessar</Link>
                        </article>
                    )
                })}
            </div>
        </div>
    )
}

export default Home;
