"use strict";

window.addEventListener("load", start);
const endpoint =
  "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

async function start() {
  const moviesArray = await getMovies(endpoint);
  showMovies(moviesArray);

  document
    .querySelector("#btn-add-movie")
    .addEventListener("click", showAddMovieModal);
}

async function getMovies(url) {
  const response = await fetch(`${url}movies.json`);
  const data = await response.json();
  const preparedData = prepareData(data);
  return preparedData;
}

function prepareData(dataObject) {
  const movies = [];

  for (const key in dataObject) {
    const movie = dataObject[key];
    movie.id = key;
    movies.push(movie);
  }
  return movies;
}

function showMovies(movies) {
  for (const movie of movies) {
    showMovie(movie);
  }
}

function showMovie(movie) {
  const moviesContainer = document.querySelector("#movie-grid");
  const movieHTML = /*html*/ `
  
  <article class="grid-item" > 
  <img src="${movie.poster}" >
  </article>
  `;

  moviesContainer.insertAdjacentHTML("beforeend", movieHTML);
  document
    .querySelector("#movie-grid article:last-child")
    .addEventListener("click", movieClicked);

  function movieClicked(event) {
    showMovieDialog(movie);
  }
}

// Shows dialog for movie clicked
function showMovieDialog(movie) {
  document.querySelector("#dialog-modal").showModal();
}

// Shows dialog for Add Movie
function showAddMovieModal(event) {
  const html = /*html*/ `
  <h2>Create a New Movie</h2>
        <form id="form" class="dialog-create-movie">

          <label for="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Title of movie" required />

          <label for="runtime">Movie length:</label>
          <input
            type="number"
            id="runtime"
            name="runtime"
            placeholder="runtime in min"
            required
          />

          <label for="score">Score:</label>
          <input
            type="number"
            id="score"
            name="score"
            placeholder="Rating"
            min="1"
            max="10"
            step="1"
            required
          />

          <label for="director">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            placeholder="Director"
            required
          />

          <label for="actors">Star Actors:</label>
          <input
            type="text"
            id="actors"
            name="actorStars"
            placeholder="Name of star actors"
            required
          />

          <label for="year">Year of premiere:</label>
          <input
            type="number"
            id="year"
            name="year"
            placeholder="Year released"
            required
          />

          <label for="poster">Poster:</label>
          <input type="url" id="poster" name="poster" placeholder="URL link" />
          required

          <label for="trailer">Trailer:</label>
          <input
            type="url"
            id="trailer"
            name="trailer"
            placeholder="URL link"
            required
          />

          <label for="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genreTags"
            placeholder="write the genre(s)"
            required
          />

          <label for="description">Movie description:</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            required
          />

          <label for=""> is the movie in cinema:</label>
          <label for="in-cinema-yes">Yes <input
            type="radio"
            id="in-cinema-yes"
            name="inCinema"
            value="yes"
            required
            
           
          /></label>
          
           <label for="inCinema-no">No <input
            type="radio"
            id="in-cinema"
            name="inCinema"
            value="no"
            required
            
            
          /></label>
          

          <button>Add this movie</button>
        </form>
  `;

  document.querySelector("#dialog-modal").insertAdjacentHTML("beforeend", html);

  document
    .querySelector("#form")
    .addEventListener("submit", createMovieClicked);

  document.querySelector("#dialog-modal").showModal();
}

function createMovieClicked(event) {
  event.preventDefault();
  console.log(event);

  const form = event.target;
  console.log(form);

  const title = form.title.value;
  const runtime = form.runtime.value;
  const score = form.score.value;
  const director = form.director.value;
  const actorStars = form.actorStars.value;
  const year = form.year.value;
  const poster = form.poster.value;
  const trailer = form.trailer.value;
  const genreTags = form.genreTags.value;
  const description = form.description.value;
  let inCinema = form.inCinema.value;

  if (inCinema === "yes") {
    inCinema = true;
  } else if (inCinema === "no") {
    inCinema = false;
  }

  createMovie(
    title,
    runtime,
    score,
    director,
    actorStars,
    year,
    poster,
    trailer,
    genreTags,
    description,
    inCinema
  );
}

async function createMovie(
  title,
  runtime,
  score,
  director,
  actorStars,
  year,
  poster,
  trailer,
  genreTags,
  description,
  inCinema
) {
  const newMovie = {
    title,
    runtime,
    score,
    director,
    actorStars,
    year,
    poster,
    trailer,
    genreTags,
    description,
    inCinema,
  };
  console.log(newMovie);
  const json = JSON.stringify(newMovie);
  const response = await fetch(`${endpoint}movies.json`, {
    method: "POST",
    body: json,
  });

  if (response.ok) {
    console.log("Movie successfully posted");
    //Call updateGrid function fetch data again.
  }
}
