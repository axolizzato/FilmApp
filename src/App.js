import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import './App.css';
import MovieDetail from './components/MovieDetail';

function App() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const location = useLocation();
  const genres = ["Action", "Comedy", "Drama", "Fantasy", "Horror", "Romance", "Sci-Fi", "Thriller"];

  const handleSearch = (event) => {
    setQuery(event.target.value);
  };

  const searchMovies = async () => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${query}&apikey=f1a2a313`);
      const data = await response.json();
      console.log("API Response:", data); // Log di debug
      
      if (Array.isArray(data.Search)) {  // Controlla se `Search` è un array
        const sortedMovies = data.Search.sort((a, b) => a.Year - b.Year);
        setMovies(sortedMovies);
        setHasSearched(true);
        console.log("Movies Set:", sortedMovies); // Log dei film ordinati
      } else {
        console.error("No movies found or Search is not an array");
        setMovies([]); // Resetta l'elenco dei film se non è presente nulla
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Failed to fetch movies:", error);
    }
  };

  const searchByGenre = async (genre) => {
    try {
      const response = await fetch(`https://www.omdbapi.com/?s=${genre}&apikey=f1a2a313`);
      const data = await response.json();
      console.log("Genre API Response:", data); // Log di debug

      if (Array.isArray(data.Search)) {
        // Filtra i film per genere a livello client
        const filteredMovies = data.Search.filter((movie) => 
          movie.Genre && movie.Genre.toLowerCase().includes(genre.toLowerCase())
        );
        setMovies(filteredMovies);
        setHasSearched(true);
        console.log("Filtered Movies Set:", filteredMovies); // Log dei film filtrati per genere
      } else {
        console.error("No movies found for this genre");
        setMovies([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error("Failed to fetch movies by genre:", error);
    }
  };

  const isMovieDetailPage = location.pathname.includes("/movie/");

  return (
    <div className="App">
      <header className="App-header">
        <nav className="navbar">
          <Link to="/" className="navbar-title">Film Finder</Link>
        </nav>
        <div className="main-content">
          <aside className="sidebar">
            <div className="search-section">
              <h2>Cerca un film</h2>
              <input
                type="text"
                placeholder="Inserisci il titolo"
                value={query}
                onChange={handleSearch}
              />
              <button onClick={searchMovies} className="search-button">
                🔍
              </button>
            </div>
            <div className="genre-list">
              <h2>Filtra per genere</h2>
              {genres.map((genre) => (
                <button key={genre} onClick={() => searchByGenre(genre)} className="genre-button">
                  {genre}
                </button>
              ))}
            </div>
          </aside>
          <section className="movie-list">
            {movies.length > 0 ? (
              <div className="movie-grid">
                {movies.map((movie) => (
                  <div key={movie.imdbID} className="movie-item">
                    <Link to={`/movie/${movie.imdbID}`}>
                      <img
                        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x220?text=No+Image"}
                        alt={`${movie.Title} Poster`}
                        className="movie-poster"
                      />
                      <h3>{movie.Title}</h3>
                    </Link>
                    <p>{movie.Year}</p>
                  </div>
                ))}
              </div>
            ) : hasSearched && (
              <p>Nessun film trovato. Prova un'altra ricerca.</p>
            )}
          </section>
        </div>
      </header>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
