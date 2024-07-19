import "./index.css";
import { useEffect, useState, useCallback } from "react";
import MovieCard from "../MovieCard";
import debounce from "lodash.debounce";

const apiConstraints = {
  initial: "initial",
  loading: "loading",
  success: "success",
  failure: "failure",
};

const Home = () => {
  const [movieList, setMovieList] = useState([]);
  const [movieName, setMovieName] = useState("");
  const [apiResponse, setApiResponse] = useState({
    status: apiConstraints.initial,
    data: null,
    error: null,
  });

  const fetchMovies = async (name) => {
    if (name.trim() === "") {
      setMovieList([]);
      setApiResponse({
        status: apiConstraints.initial,
        data: null,
        error: null,
      });
      return;
    }

    setApiResponse((prev) => ({ ...prev, status: apiConstraints.loading }));

    const url = `https://openlibrary.org/search.json?title=${name}`;
    const options = {
      method: "GET",
    };

    try {
      const response = await fetch(url, options);
      const responseData = await response.json();
      if (response.ok) {
        setMovieList(responseData.docs);
        setApiResponse((prev) => ({
          ...prev,
          status: apiConstraints.success,
          data: responseData.docs,
        }));
      } else {
        setApiResponse((prev) => ({
          ...prev,
          status: apiConstraints.failure,
          error: "Failed to fetch data",
        }));
      }
    } catch (error) {
      setApiResponse((prev) => ({
        ...prev,
        status: apiConstraints.failure,
        error: error.message,
      }));
    }
  };

  const debouncedFetchMovies = useCallback(debounce(fetchMovies, 500), []);

  useEffect(() => {
    debouncedFetchMovies(movieName);
  }, [movieName, debouncedFetchMovies]);

  const handleInputChange = (e) => {
    setMovieName(e.target.value);
  };

  const handleSearchClick = () => {
    fetchMovies(movieName);
  };

  const renderLoadingView = () => (
    <div className='terminal-loader'>
      <div className='terminal-header'>
        <div className='terminal-title'>Status</div>
        <div className='terminal-controls'>
          <div className='control close'></div>
          <div className='control minimize'></div>
          <div className='control maximize'></div>
        </div>
      </div>
      <div className='text'>Loading...</div>
    </div>
  );

  const renderSuccessView = () => (
    <div className='movies-ul'>
      {movieList.length > 0 ? (
        movieList.map((movie) => <MovieCard key={movie.key} movie={movie} />)
      ) : (
        <div>
          <p>
            <strong>0 Results for {movieName}</strong>
          </p>
          <img
            src='https://static.vecteezy.com/vite/assets/searching-man-DZslMvH-.svg'
            alt='notfound'
          />
        </div>
      )}
    </div>
  );

  const renderFailureView = () => (
    <div className='failure-view'>
      <p>Failed to fetch data</p>
      <img
        src='https://cdn.dribbble.com/users/1068771/screenshots/14287977/media/fa507c114d5ccf05aea295ce9f27405d.jpg?resize=1200x900&vertical=center'
        alt='failed'
        className='failed-view'
      />
      <button className='refresh-btn' onClick={handleSearchClick}>
        Refresh
      </button>
    </div>
  );

  const renderSearchResults = () => {
    const { status } = apiResponse;
    switch (status) {
      case apiConstraints.loading:
        return renderLoadingView();
      case apiConstraints.success:
        return renderSuccessView();
      case apiConstraints.failure:
        return renderFailureView();
      default:
        return null;
    }
  };

  return (
    <div className='home-container'>
      <h1 class='header-title'>Discover the Best Movies</h1>
      <p class='header-description'>
        Explore a vast collection of movies from various genres and find your
        next cinematic adventure.
      </p>

      <div className='input-container'>
        <input
          type='text'
          name='text'
          className='input'
          placeholder='search...'
          value={movieName}
          onChange={handleInputChange}
        />
        <span className='icon' onClick={handleSearchClick}>
          <svg
            width='19px'
            height='19px'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'>
            <g id='SVGRepo_bgCarrier' strokeWidth='0'></g>
            <g
              id='SVGRepo_tracerCarrier'
              strokeLinecap='round'
              strokeLinejoin='round'></g>
            <g id='SVGRepo_iconCarrier'>
              <path
                opacity='1'
                d='M14 5H20'
                stroke='#000'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'></path>
              <path
                opacity='1'
                d='M14 8H17'
                stroke='#000'
                strokeWidth='1.5'
                strokeLinecap='round'
                strokeLinejoin='round'></path>
              <path
                d='M21 11.5C21 16.75 16.75 21 11.5 21C6.25 21 2 16.75 2 11.5C2 6.25 6.25 2 11.5 2'
                stroke='#000'
                strokeWidth='2.5'
                strokeLinecap='round'
                strokeLinejoin='round'></path>
              <path
                opacity='1'
                d='M22 22L20 20'
                stroke='#000'
                strokeWidth='3.5'
                strokeLinecap='round'
                strokeLinejoin='round'></path>
            </g>
          </svg>
        </span>
      </div>
      <div className='movies-container'>{renderSearchResults()}</div>
    </div>
  );
};

export default Home;
