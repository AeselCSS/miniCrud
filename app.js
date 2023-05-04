"use strict";
import { showAddMovieModal } from "./assets/js/create-movie-modal.js";
import { endpoint, getMovies } from "./assets/js/rest-api.js";
import { showHighlightedMovie } from "./assets/js/top-movie.js";
import { searchBar } from "./assets/js/filter-and-search-module.js";
import { sortBy } from "./assets/js/sort-module.js";
import { closeDialogEventListener } from "./assets/js/helpers-module.js"
import { showMovies } from "./assets/js/grid-module.js";

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