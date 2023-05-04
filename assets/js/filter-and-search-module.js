import {showMovies} from "./grid-module.js"
import { getMovies, endpoint } from "./rest-api.js";


/*=====================FILTER & SEARCH BAR========================*/

function searchBar(event) {
	const filter = document.querySelector("#filter").value;
	const searchBarValue = document.querySelector("#search-bar").value;

	searchMovies(searchBarValue, filter);
}

async function searchMovies(keywords, filter) {
	const movies = await getMovies(endpoint);
	const filteredMovies = filterMovies(movies, keywords, filter);

	showMovies(filteredMovies);
}

function filterMovies(movies, keywords, filter) {
	const filteredMovies = [];
	const keyword = keywords.toLowerCase();

	for (const movie of movies) {
		if (filter == "all") {
			loopAllPropertiesOfMovie(movie);
		} else if (filter == "actorStars") {
			loopActorsOfMovie(movie);
		} else {
			loopOtherPropertyOfMovie(movie);
		}
	}

	function loopAllPropertiesOfMovie(movie) {
		for (const property in movie) {
			if (movie[property].toString().toLowerCase().includes(keyword)) {
				filteredMovies.push(movie);
				break;
			}
		}
	}

	function loopOtherPropertyOfMovie(movie) {
		if (movie[filter].toLowerCase().includes(keyword)) {
			filteredMovies.push(movie);
		}
	}

	//Filtrer på movie.actorStars.some
	function loopActorsOfMovie(movie) {
		for (let i = 0; i < movie.actorStars.length; i++) {
			if (movie.actorStars[i].toLowerCase().includes(keyword)) {
				filteredMovies.push(movie);
				break;
			}
		}
	}

	return filteredMovies;
}

export {searchBar, filterMovies}