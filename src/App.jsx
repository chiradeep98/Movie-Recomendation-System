import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMBD_API_KEY;

const API_OPTIONS = {
    method: 'GET',
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errorMessage, setErrorMessage] = useState('')
    const [movieList, setMovieList] = useState([]);
    const [loadingState, setLoadingState] = useState(false);
    const [debounceSearchTerm, setDebounceSearchTerm ] = useState('');

    useDebounce(() => setDebounceSearchTerm(searchTerm), 500, [searchTerm])

    const fetchMovies = async(query = '')=> {
        setLoadingState(true);
        setErrorMessage('')
        try{
            const endpoint = query ?  `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
            :`${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
            const response = await fetch(endpoint, API_OPTIONS);

            

            if(!response.ok){
                throw new Error('Failed to Fetch Movies');
            }

            const data = await response.json();

            if(data.Response === 'false'){
                setErrorMessage(data.error || 'Failed to fetch movies');
                setMovieList([]);
                return;
            }

            setMovieList(data.results || [])

            console.log(data.results)
            console.log("Movies: ", movieList)
        }
        catch(e){
            console.error(`Error Fetching Movie ${e}`);
            setErrorMessage('Error Fettching Movie. PLease Try Again Later');
        }
        finally{
            setLoadingState(false)
        }
    }

    useEffect(() => {
        fetchMovies(debounceSearchTerm);
    },[debounceSearchTerm]);
    return (
        <main>
            <div className="pattern" />
            <div className="wrapper">
                <header>
                    <img src="./hero.png" alt="Hero Image" />
                    <h1>Find <span className="text-gradient">Movies</span> You'll Enjoy Without the Hassle </h1>
                    <Search searchTerm = {searchTerm} setSearchTerm = {setSearchTerm} />
                </header>

                <section className="all-movies mt-[40px]">
                    <h2>All Movies</h2>
                    {loadingState ? (
                        <Spinner/>
                    ): errorMessage ? (
                        <p className="text-red-500">{errorMessage}</p>
                    ): (<ul>
                        {movieList.map((movie) => {
                            return <MovieCard key={movie.id} movie={movie}/>
                        })}
                        </ul>)}
                </section>

            </div>
        </main>
    )
}

export default App;