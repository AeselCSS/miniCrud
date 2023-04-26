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

async function updateGrid() {
  const moviesArray = await getMovies(endpoint);
  showMovies(moviesArray);
}

function showMovies(movies) {
  document.querySelector("#movie-grid").innerHTML="";
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
  document.querySelector("#dialog-modal").innerHTML = "";

  const genreString = getGenreTagsAsString(movie.genreTags);

  const section = /*html*/ `
	<section class="movie-details-section">
        <article class="movie-details-functions">
            <button id="movie-update-btn">Update details</button>
            <button id="movie-remove-btn">Remove</button>
        </article>

        <article class="movie-details-header">
            <p>${movie.title}</p>
            <p>${movie.year}</p>
            <p>${movie.runtime} Minutes</p>
            <p>${movie.score}</p>
        </article>

        <article class="movie-details-main">
            <div>
                <img src="${movie.poster}">
            </div>

            <div>
                <iframe src="${movie.trailer}"></iframe>
            </div>
        </article>

        <article class="movie-details-other">
            <div>
                <p>${genreString}</p>
                <p>${movie.director}</p>
                <p>${movie.description}</p>
            </div>
            <div>
                <p>Actors:</p>
                <ul id="movie-actor-list">
                    
                </ul>
            </div>
        </article>
    </section>
    `;

  document
    .querySelector("#dialog-modal")
    .insertAdjacentHTML("beforeend", section);
  populateActorList(movie.actorStars);

  document
    .querySelector("#movie-update-btn")
    .addEventListener("click", updateClicked);
  document
    .querySelector("#movie-remove-btn")
    .addEventListener("click", removeClicked);

  function updateClicked() {
    document
      .querySelector("#movie-update-btn")
      .addEventListener("click", updateClicked);
    // kald på brains funktion med movie som argument mhp. updater
    updateMovieDialog(movie);
  }

  function removeClicked() {
    document
      .querySelector("#movie-remove-btn")
      .removeEventListener("click", removeClicked);
    // kald på brains funktion med movie som argument mhp. slet
    deleteMovieDialog(movie);
  }

  document.querySelector("#dialog-modal").showModal();
}

// Shows dialog for Add Movie
function showAddMovieModal(event) {
  document.querySelector("#dialog-modal").innerHTML = "";

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
          <input type="url" id="poster" name="poster" placeholder="URL link" required />

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

function getGenreTagsAsString(genreTags) {
  let genreString = "";

  for (let i = 0; i < genreTags.length; i++) {
    if (i === genreTags.length - 1) {
      genreString += genreTags[i];
    } else {
      genreString += `${genreTags[i]}, `;
    }
  }

  return genreString;
}

function populateActorList(actors) {
  for (const actor of actors) {
    const html = /*html*/ `
        <li>${actor}</li>
        `;
    document
      .querySelector("#movie-actor-list")
      .insertAdjacentHTML("beforeend", html);
  }
}

// ---------- Delete movie functions ---------- //

async function deleteMovieDialog(movie) {
  console.log(movie.id);
  document.querySelector("#dialog-modal").innerHTML = "";

  // HTML to insert
  const html = /*html*/ `
    <h2>Are you sure you want to delete</h2>
    <p id="dialog-delete-movie-title">${movie.title}</p>

    <form method="dialog" id="form-delete-movie">

    <button type="button" class="btn-cancel">NO</button>
    <button>YES</button>
    
    </form>
  `;

  // Insert HTML
  document.querySelector("#dialog-modal").innerHTML = html;

  // Event listener
  document
    .querySelector("#form-delete-movie")
    .addEventListener("submit", deleteYesClicked);

  document
    .querySelector(".btn-cancel")
    .addEventListener("click", deleteNoClicked);

  // Button functions
  async function deleteYesClicked(event) {
    event.preventDefault();
    deleteMovie(movie.id);

    document.querySelector("#dialog-modal").close();
  }

  function deleteNoClicked() {
    document.querySelector("#dialog-modal").close();
  }
}

async function deleteMovie(id) {
  const response = await fetch(`${endpoint}movies/${id}.json`, {
    method: "DELETE",
  });

  if (response.ok) {
    console.log("Movie was succesfully deleted from Firebase! 🔥");
    //Call updateGrid function fetch data again.
    updateGrid();
  } else {
    console.log("Something went wrong with DELETE request ☹");
  }
}

// ---------- Update movie functions ---------- //

function updateMovieDialog(movie) {
  console.log(movie);

  document.querySelector("#dialog-modal").innerHTML = "";

  const html = /*html*/ `
  <h2>Update Movie</h2>
        <form id="form" class="dialog-update-movie">

          <label for="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Title of movie" value='${movie.title}' required />

          <label for="runtime">Movie length:</label>
          <input
            type="number"
            id="runtime"
            name="runtime"
            placeholder="runtime in min"
            value='${movie.runtime}'
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
            step="0.1"
            value='${movie.score}'
            required
          />

          <label for="director">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            placeholder="Director"
            value='${movie.director}'
            required
          />

          <label for="actors">Star Actors:</label>
          <input
            type="text"
            id="actors"
            name="actorStars"
            placeholder="Name of star actors"
            value='${movie.actorStars}'
            required
          />

          <label for="year">Year of premiere:</label>
          <input
            type="number"
            id="year"
            name="year"
            placeholder="Year released"
            value='${movie.year}'
            required
          />

          <label for="poster">Poster:</label>
          <input type="url" id="poster" name="poster" placeholder="URL link" value='${movie.poster}'
          required/>

          <label for="trailer">Trailer:</label>
          <input
            type="url"
            id="trailer"
            name="trailer"
            placeholder="URL link"
            value='${movie.trailer}'
            required
          />

          <label for="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genreTags"
            placeholder="write the genre(s)"
            value='${movie.genreTags}'
            required
          />

          <label for="description">Movie description:</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value='${movie.description}'
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
          

          <button>Update this movie</button>
        </form>
  `;

  document.querySelector("#dialog-modal").insertAdjacentHTML("beforeend", html);

  document
    .querySelector("#form")
    .addEventListener("submit", updateMovieClicked);

  function updateMovieClicked(event) {
    event.preventDefault();

    document.querySelector("#dialog-modal").close();

    const form = event.target;

    const title = form.title.value;
    const runtime = form.runtime.value;
    const score = form.score.value;
    const director = form.director.value;
    const actorStars = form.actorStars.value.split(",");
    const year = form.year.value;
    const poster = form.poster.value;
    const trailer = form.trailer.value;
    const genreTags = form.genreTags.value.split(',');
    const description = form.description.value;
    let inCinema = form.inCinema.value;
    const id = movie.id;

    if (inCinema === "yes") {
      inCinema = true;
    } else if (inCinema === "no") {
      inCinema = false;
    }

    updateMovie(
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
      id
    );
  }
}

async function updateMovie(
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
  id
) {
  const updatedMovie = {
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

  const json = JSON.stringify(updatedMovie);

  const response = await fetch(`${endpoint}movies/${id}.json`, {
    method: "PUT",
    body: json,
  });

  if (response.ok) {
    console.log("Movie successfully updated in Firebase! 🔥");
    //Call updateGrid function fetch data again.
  } else {
    console.log("Something went wrong with PUT request ☹");
  }
}
