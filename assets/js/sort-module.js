import { showMovies } from "./grid-module.js";
import { getMovies, endpoint } from "./rest-api.js";
import { filterMovies } from "./filter-and-search-module.js";


function sortBy(event) {
	const selectedSort = document.querySelector("#sort").value;
	console.log(selectedSort);
	sortMovies(selectedSort);
}

async function sortMovies(dropDownValue) {
	const movies = await getMovies(endpoint);
	const keywords = document.querySelector("#search-bar").value;
	const filter = document.querySelector("#filter").value;
	let result;

	if (dropDownValue === "year-old" || dropDownValue === "rating-asc") {
		result = sortLowToHigh(movies, dropDownValue);
		result = filterMovies(result, keywords, filter);
		showMovies(result);
	} else {
		result = sortHighToLow(movies, dropDownValue);
		result = filterMovies(result, keywords, filter);
		showMovies(result);
	}
}

function sortLowToHigh(movieArray, value) {
	return movieArray.sort((movie1, movie2) =>
		value === "year-old" ? movie1.year - movie2.year : movie1.score - movie2.score
	);
}

function sortHighToLow(movieArray, value) {
	return movieArray.sort((movie1, movie2) =>
		value === "year-new" ? movie2.year - movie1.year : movie2.score - movie1.score
	);
}

export { sortBy };