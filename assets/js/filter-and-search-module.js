// Import modules
import { showMovies } from "./grid-module.js";
import { getMovies, endpoint } from "./rest-api.js";

// Search bar
function searchBar(event) {
	const filter = document.querySelector("#filter").value;
	const searchBarValue = document.querySelector("#search-bar").value;
	searchMovies(searchBarValue, filter);
}
// Search movies function
async function searchMovies(keywords, filter) {
	// Get movies from API
	const movies = await getMovies(endpoint);
	// Filter movies based on keywords and filter
	const filteredMovies = filterMovies(movies, keywords, filter);
	// Show movies
	showMovies(filteredMovies);
}

// Filter movies function
function filterMovies(movies, keywords, filter) {
	const filteredMovies = [];
	const keyword = keywords.toLowerCase();
	// Loop through movies and check if keyword is in movie
	for (const movie of movies) {
		// If filter is all, loop through all properties of movie
		if (filter == "all") {
			loopAllPropertiesOfMovie(movie);
			// If filter is actorStars, loop through actorStars of movie
		} else if (filter == "actorStars") {
			loopActorsOfMovie(movie);
			// Else loop through other properties of movie (filter is title or director)
		} else {
			loopOtherPropertyOfMovie(movie);
		}
	}
	// Loop through all properties of movie
	function loopAllPropertiesOfMovie(movie) {
		// Loop through all properties of movie
		for (const property in movie) {
			// Check if property includes keyword
			if (movie[property].toString().toLowerCase().includes(keyword)) {
				// If it does, push movie to filteredMovies and break loop
				filteredMovies.push(movie);
				break;
			}
		}
	}
	// Loop through other properties of movie (filter is title or director)
	function loopOtherPropertyOfMovie(movie) {
		// Check if property includes keyword and push movie to filteredMovies if it does
		if (movie[filter].toLowerCase().includes(keyword)) {
			filteredMovies.push(movie);
		}
	}

	// Loop through actorStars of movie (filter is actorStars)
	function loopActorsOfMovie(movie) {
		for (let i = 0; i < movie.actorStars.length; i++) {
			// Check if actorStars includes keyword and push movie to filteredMovies if it does
			if (movie.actorStars[i].toLowerCase().includes(keyword)) {
				filteredMovies.push(movie);
				break;
			}
		}
	}
	return filteredMovies;
}

export { searchBar };
