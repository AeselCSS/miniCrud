"use strict";
import { showAddMovieModal } from "./assets/js/create-movie-modal.js";
import { endpoint, getMovies } from "./assets/js/rest-api.js";
import { showMovieDialog } from "./assets/js/show-movie-modal.js";
import { showHighlightedMovie } from "./assets/js/top-movie.js";
import { searchBar } from "./assets/js/filter-and-search-module.js";
import { sortBy } from "./assets/js/sort-module.js";
import { closeDialogEventListener } from "./assets/js/helpers-module.js"

let timeoutIds = [];

window.addEventListener("load", start);

async function start() {
	const moviesArray = await getMovies(endpoint);

	showMovies(moviesArray);
	showHighlightedMovie(moviesArray);

	
	
	//Eventlisteners
	document.querySelector("#btn-add-movie").addEventListener("click", showAddMovieModal);
	document.querySelector("#search-bar").addEventListener("input", searchBar);
	document.querySelector("#filter").addEventListener("change", searchBar);
	document.querySelector("#sort").addEventListener("change", sortBy);
	closeDialogEventListener();
}

export async function updateGrid() {
	const moviesArray = await getMovies(endpoint);
	showMovies(moviesArray);
}

export function showMovies(movies) {
	document.querySelector("#movie-grid").innerHTML = "";

	// Clear any previous timeouts
	for (const i of timeoutIds) clearTimeout(i);

	// Loop through each movie,
	// Timeout to get fadeIn effect
	for (let i = 0; i < movies.length; i++) {
		const timeoutId = setTimeout(() => {
			showMovie(movies[i]);
		}, i * 100);

		timeoutIds.push(timeoutId);
	}

	// Old loop method
	// for (const movie of movies) {
	// 	showMovie(movie);
	// }
}

function showMovie(movie) {
	const moviesContainer = document.querySelector("#movie-grid");
	const movieHTML = /*html*/ `
  
  <article class="grid-item" > 
  <img src="${movie.poster}" >
  <div class="grid-item-text"><p>
	<b>${movie.title}</b> -
	<em>${movie.year}</em>
  </p>
  <p><b>Runtime </b>- ${movie.runtime} min.</p>
  <p><b>Rating </b>- ${movie.score} / 10</p>
  <p><b>Starring</b></p>
  <p>${movie.actorStars}</p></div>
  </article>
  `;

	moviesContainer.insertAdjacentHTML("beforeend", movieHTML);
	document.querySelector("#movie-grid article:last-child").addEventListener("click", movieClicked);

	function movieClicked(event) {
		showMovieDialog(movie);
	}
}







