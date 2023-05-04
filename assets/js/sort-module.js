// import modules
import { showMovies } from "./grid-module.js";
import { getMovies, endpoint } from "./rest-api.js";

// Sort by function
function sortBy(event) {
	// Get selected sort value
	const selectedSort = document.querySelector("#sort").value;
	// Sort movies by selected sort value
	sortMovies(selectedSort);
}

// Sort movies function
async function sortMovies(dropDownValue) {
	// Get movies from API
	const movies = await getMovies(endpoint);
	let result;
	// Sort movies by selected sort value and show movies
	if (dropDownValue === "year-old" || dropDownValue === "rating-asc") {
		result = sortLowToHigh(movies, dropDownValue);
		showMovies(result);
	} else {
		result = sortHighToLow(movies, dropDownValue);
		showMovies(result);
	}
}

// Sort low to high function
function sortLowToHigh(movieArray, value) {
	return movieArray.sort((movie1, movie2) =>
		value === "year-old" ? movie1.year - movie2.year : movie1.score - movie2.score
	);
}
// Sort high to low function
function sortHighToLow(movieArray, value) {
	return movieArray.sort((movie1, movie2) =>
		value === "year-new" ? movie2.year - movie1.year : movie2.score - movie1.score
	);
}

export { sortBy };