// end point for firebase
const endpoint = "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

// CRUD functions
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
// Read
async function getMovies(url) {
	const response = await fetch(`${url}movies.json`);
	const data = await response.json();
	const preparedData = prepareData(data);
	return preparedData;
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
	return response;
}

// Helper function to rest-api
function prepareData(dataObject) {
	const movies = [];
	for (const key in dataObject) {
		const movie = dataObject[key];
		//Continues if movie is null
		if (!movie) {
			continue;
		}
		movie.id = key;
		movies.push(movie);
	}
	return movies;
}

export { endpoint, createMovie, updateMovie, deleteMovie, getMovies };
