import { useEffect, useState} from "react"; 
import { useParams, useNavigate } from "react-router-dom"; 
import './filme-info.css';

import api from "../../services/api";
import { lerFilmesSalvos, gravarFilmesSalvos } from '../../services/favorites';

import {toast} from 'react-toastify'


function Filme(){

    const {id} = useParams();
    const navigate = useNavigate();
    const [filme, setFilme] = useState({});
    const [loading,setLoading] = useState(true);

    useEffect(()=>{
        const controller = new AbortController();
        async function loadFilme(){
            setLoading(true);
            await api.get(`/movie/${id}`,{
                signal: controller.signal,
                params:{
                    language:"pt-br",
                }
            })
            .then((response)=>{
                if (controller.signal.aborted) return;
                setFilme(response.data);
                setLoading(false);
            })
            .catch(()=>{
                if (controller.signal.aborted) return;
                navigate("/", {replace: true})
                return;
            })
        }

        loadFilme();

        return() => {
            controller.abort();
        }
    },[navigate, id])

    function salvarFilme(){
        const filmesSalvos = lerFilmesSalvos();
        const hasFilme = filmesSalvos.some((filmeSalvo)=> filmeSalvo.id=== filme.id);

        if(hasFilme){
            toast.warn("Esse filme já está na sua lista!")
            return;
        }

        filmesSalvos.push(filme);
        if (!gravarFilmesSalvos(filmesSalvos)) {
            toast.error('Não foi possível salvar o filme neste navegador.');
            return;
        }
        toast.success("FILME SALVO COM SUCESSO!");


    }
    
    if(loading){
        return(
            <div className="filme-info">
                <h1>Carregando detalhes...</h1>
            </div>
        )
    }

    return(
        <div className="filme-info">
            <h1>{filme.title}</h1>
            <img src={`https://image.tmdb.org/t/p/original/${filme.backdrop_path}`} alt={filme.title}/>

            <h3>Sinopse</h3>
            <span>{filme.overview}</span>
            <strong>Avaliação: {filme.vote_average} / 10</strong>

            <div className="area-buttons">
                <button onClick={salvarFilme}>Salvar</button>
                <a className="trailer-link" target="_blank" rel="noopener noreferrer" href={`https://www.youtube.com/results?search_query=${encodeURIComponent(filme.title + ' trailer')}`}>
                    Trailer
                </a>
            </div>


        </div>
    )
}

export default Filme;
