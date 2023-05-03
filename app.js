"use strict";
// Import modules
import { showAddMovieModal } from "./assets/js/create-movie-modal.js";
import { searchBar } from "./assets/js/filter-and-search-module.js";
import { sortBy } from "./assets/js/sort-module.js";
import { closeDialogEventListener } from "./assets/js/helpers-module.js"
import { updateGrid } from "./assets/js/grid-module.js";

// Eventlistener for loading the page
window.addEventListener("load", start);

// Start function
async function start() {
	updateGrid();

	//Eventlisteners
	document.querySelector("#btn-add-movie").addEventListener("click", showAddMovieModal);
	document.querySelector("#search-bar").addEventListener("input", searchBar);
	document.querySelector("#filter").addEventListener("change", searchBar);
	document.querySelector("#sort").addEventListener("change", sortBy);
	closeDialogEventListener();
}