import { showMovies } from "./grid-module.js";
import { getMovies, endpoint } from "./rest-api.js";


/*============================ SORT FUNCTIONS =================================*/

function sortBy(event) {
	const selectedSort = document.querySelector("#sort").value;
	console.log(selectedSort);
	sortMovies(selectedSort);
}

async function sortMovies(dropDownValue) {
	const movies = await getMovies(endpoint);

	let result;

	if (dropDownValue === "year-old" || dropDownValue === "rating-asc") {
		result = sortLowToHigh(movies, dropDownValue);
		showMovies(result);
	} else {
		result = sortHighToLow(movies, dropDownValue);
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