import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function MovieDetail() {
  const { id } = useParams();  // Ottieni l'ID del film dalla URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);  // Stato per gestire il caricamento
  const [error, setError] = useState(null);  // Stato per gestire gli errori

  useEffect(() => {
    const fetchMovieDetail = async () => {
      try {
        const response = await fetch(`https://www.omdbapi.com/?i=${id}&apikey=f1a2a313`);
        const data = await response.json();

        if (data.Response === "True") {
          setMovie(data);  // Aggiorna lo stato con i dettagli del film
          setLoading(false);  // Imposta lo stato di caricamento su false
        } else {
          setError(data.Error);  // Gestisci errori, come "Film non trovato"
          setLoading(false);  // Imposta lo stato di caricamento su false
        }
      } catch (error) {
        setError("Errore nella richiesta");  // Gestione errori in caso di problema con la richiesta
        setLoading(false);  // Imposta lo stato di caricamento su false
      }
    };

    fetchMovieDetail();  // Chiama l'API quando il componente è montato
  }, [id]);  // Riprova ogni volta che l'ID cambia

  if (loading) {
    return <div>Caricamento...</div>;  // Mostra un messaggio di caricamento mentre i dati vengono recuperati
  }

  if (error) {
    return <div>Errore: {error}</div>;  // Mostra un messaggio di errore se c'è un problema
  }

  return (
    <div className="movie-detail">
      <h2>{movie.Title}</h2>
      <img 
        src={movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/150x220?text=No+Image"} 
        alt={`${movie.Title} Poster`} 
      />
      <p><strong>Trama:</strong> {movie.Plot}</p>
      <p><strong>Anno:</strong> {movie.Year}</p>
      <p><strong>Genere:</strong> {movie.Genre}</p>
      <p><strong>Valutazione IMDb:</strong> {movie.imdbRating}</p>
      <p><strong>Durata:</strong> {movie.Runtime}</p>
      <p><strong>Incassi:</strong> {movie.BoxOffice}</p>
      <p><strong>Produzione:</strong> {movie.Production}</p>
      <p><strong>Età:</strong> {movie.Rated}</p>
      <p><strong>Tipo:</strong> {movie.Type}</p>
    </div>
  );
}

export default MovieDetail;
