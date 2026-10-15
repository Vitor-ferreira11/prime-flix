import { useEffect, useState } from 'react'
import './favoritos.css'
import { Link } from 'react-router-dom'
import {toast} from 'react-toastify'
import { lerFilmesSalvos, gravarFilmesSalvos } from '../../services/favorites';

function Favoritos(){
    const [filmes, setFilmes] = useState([])

    useEffect(()=>{
        setFilmes(lerFilmesSalvos())
    }, [])

    function excluirFilme(id){
        let filtroFilmes = filmes.filter((item)=>{
            return(item.id !== id)
        })
    
        if (!gravarFilmesSalvos(filtroFilmes)) {
            toast.error('Não foi possível atualizar seus favoritos neste navegador.');
            return;
        }
        setFilmes(filtroFilmes);
        toast.success("Filme removido com sucesso")
    }

    return(
        <div className='meus-filmes'>
            <h1>Meus filmes</h1>
            {filmes.length === 0 && <span>Você não possui nenhum filme salvo</span>}

            <ul>
                {filmes.map((item)=>{
                    return(
                        <li key={item.id}>
                            <span>{item.title}</span>
                            <div>
                                <Link to={`/filme/${item.id}`}>Ver detalhes</Link>
                                <button onClick={ ()=>excluirFilme(item.id) }>Excluir</button>
                            </div>
                        </li>
                    )
                })}
            </ul>


        </div>
    )
}

export default Favoritos;
