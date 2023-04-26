"use strict";

window.addEventListener("load", start);
const endpoint =
  "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

async function start() {
  const moviesArray = await getMovies(endpoint);
  showMovies(moviesArray);
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

function showMovieDialog(movie) {
  document.querySelector("#dialog-modal").showModal();
}
