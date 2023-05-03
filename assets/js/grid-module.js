// Import modules
import { showMovieDialog } from "./show-movie-modal.js";
import { getMovies, endpoint } from "./rest-api.js";
import { showHighlightedMovie } from "./top-movie.js";

// Update grid function (called when page loads)
async function updateGrid() {
	// Get movies from API
	const moviesArray = await getMovies(endpoint);
	// Show movies
	showMovies(moviesArray);
	// Show highlighted movie
	showHighlightedMovie(moviesArray);
}

// Show movies function
function showMovies(movies) {
	// Array to store timeoutIds
	let timeoutIds = [];
	document.querySelector("#movie-grid").innerHTML = "";
	// Clear any previous timeouts
	for (const i of timeoutIds) clearTimeout(i);
	// Loop through each movie and set a timeout for each movie,
	// to create a staggered effect when showing movies
	for (let i = 0; i < movies.length; i++) {
		const timeoutId = setTimeout(() => {
			showMovie(movies[i]);
		}, i * 100);

		timeoutIds.push(timeoutId);
	}
}

// Show movie function
function showMovie(movie) {
	const moviesContainer = document.querySelector("#movie-grid");
	// Create HTML for movie
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
	// Insert movie HTML into movie-grid
	moviesContainer.insertAdjacentHTML("beforeend", movieHTML);
	// Add event listener to movie to show movie dialog
	document.querySelector("#movie-grid article:last-child").addEventListener("click", () => showMovieDialog(movie));
}

export { updateGrid, showMovies };
