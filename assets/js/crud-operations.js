// imports
const { prepareData } = require("./crud-helpers.js");
const { updateGrid, displayErrorDialog } = require("./dom-manipulation.js");
// global variables
const endpoint = "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

//===== CRUD Operations =====
// Create Movie - HTTP POST
async function createMovie(newMovie) {
	// console.log(newMovie);
	const json = JSON.stringify(newMovie);
	const response = await fetch(`${endpoint}movies.json`, {
		method: "POST",
		body: json,
	});

	if (response.ok) {
		console.log("Movie successfully posted");
		updateGrid();
		//Call updateGrid function fetch data again.
	} else {
		console.log("Failed to create movie");
        const errorMessage = "The movie could not be created. Please try again later.";
		displayErrorDialog(errorMessage);
	}
}
// Read Movies - HTTP GET
async function getMovies(url) {
	const response = await fetch(`${url}movies.json`);
	const data = await response.json();
	const preparedData = prepareData(data);
	return preparedData;
}
// Update Movie - HTTP PUT
async function updateMovie(updatedMovie) {
    const id = updatedMovie.id;
	const json = JSON.stringify(updatedMovie);

	const response = await fetch(`${endpoint}movies/${id}.json`, {
		method: "PUT",
		body: json,
	});

	if (response.ok) {
		console.log("Movie successfully updated in Firebase! 🔥");
		updateGrid();
		//Call updateGrid function fetch data again.
	} else {
		console.log("Something went wrong with PUT request ☹");
		const errorMessage = "The movie could not be updated. Please try again later.";
		displayErrorDialog(errorMessage);
	}
}
// Delete Movie - HTTP DELETE
async function deleteMovie(id) {
	const response = await fetch(`${endpoint}movies/${id}.json`, {
		method: "DELETE",
	});

	if (response.ok) {
		console.log("Movie was succesfully deleted from Firebase! 🔥");
		//Call updateGrid function fetch data again.
		updateGrid();
	} else {
		console.log("Something went wrong with DELETE request ☹");
		const errorMessage = "The movie could not be deleted. Please try again later.";
		displayErrorDialog(errorMessage);
	}
}

export {
    createMovie, getMovies, updateMovie, deleteMovie
}