import { showMovieDialog } from "./show-movie-modal.js"
import { getMovies, endpoint } from "./rest-api.js";

let timeoutIds = [];

async function updateGrid() {
	const moviesArray = await getMovies(endpoint);
	showMovies(moviesArray);
}

function showMovies(movies) {
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

export { updateGrid, showMovies };