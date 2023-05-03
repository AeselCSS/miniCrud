import { prepareData } from "../../app.js";


// End point

const endpoint = "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

// Get

async function getMovies(url) {
	const response = await fetch(`${url}movies.json`);
	const data = await response.json();
	const preparedData = prepareData(data);
	return preparedData;
}


// Create

async function createMovie(newMovie) {
	console.log(newMovie);
	const json = JSON.stringify(newMovie);
	const response = await fetch(`${endpoint}movies.json`, {
		method: "POST",
		body: json,
	});

	return response;
}

// Update
async function updateMovie(updatedMovie) {
	// Parses into json
	const json = JSON.stringify(updatedMovie);

	// Updates/replaces object in database
	const response = await fetch(`${endpoint}movies/${updatedMovie.id}.json`, {
		method: "PUT",
		body: json,
	});

	return response;
}

// Delete

async function deleteMovie(id) {
	const response = await fetch(`${endpoint}movies/${id}.json`, {
		method: "DELETE",
	});

	return response
}


export { endpoint, createMovie, updateMovie, deleteMovie, getMovies};
