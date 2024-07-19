import React, { useEffect, useState } from "react";
import "./index.css";

const MovieCard = ({ movie }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchDogImage = async () => {
      try {
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        setImageUrl(data.message);
      } catch (error) {
        console.error("Error fetching dog image:", error);
      }
    };

    fetchDogImage();
  }, []);

  return (
    <div className='movie-card'>
      <img
        src={imageUrl || "/placeholder.svg"}
        alt='Movie Poster'
        className='movie-card-image'
      />
      <div className='movie-card-content'>
        <h3>{movie.title}</h3>
        <p>
          <strong>Author:</strong> {movie.author_name}
        </p>
      </div>
    </div>
  );
};

export default MovieCard;
