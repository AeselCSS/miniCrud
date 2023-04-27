// imports
import { updateMovie } from "./crud-operations.js";
import { createMovie } from "./crud-operations.js";
//===== CRUD Helpers =====
// Prepare data for rendering - convert object to array and add id
function prepareData(dataObject) {
	const movies = [];
    // loop through the object
	for (const key in dataObject) {
		const movie = dataObject[key];

		//Workaround for bug #2
		if (!movie) {
			continue;
		}
        // add id to the object
		movie.id = key;
        // push the object to the array
		movies.push(movie);
	}
	return movies;
}
    // User clicked the update button
	function updateMovieClicked(event) {
		event.preventDefault();
        // close the dialog
		document.querySelector("#dialog-modal").close();
        // get the form
		const form = event.target;
        
		let inCinema = form.inCinema.value;
		if (inCinema === "yes") {
			inCinema = true;
		} else if (inCinema === "no") {
			inCinema = false;
		}
        const updatedMovie = {
            title: form.title.value,
            runtime: form.runtime.value,
            score: form.score.value,
            director: form.director.value,
            actorStars: form.actorStars.value.split(","),
            year: form.year.value,
            poster: form.poster.value,
            trailer: form.trailer.value,
            genreTags: form.genreTags.value.split(","),
            description: form.description.value,
            inCinema: inCinema,
            id: form.id,
        };
	    updateMovie(updatedMovie);
	}
    // User clicked the add movie button
    function createMovieClicked(event) {
		event.preventDefault();
		// console.log(event);
        // get the form
		const form = event.target;
		// console.log(form);

        // define whether the movie is in cinema or not
        let inCinema = form.inCinema.value;
		if (inCinema === "yes") {
			inCinema = true;
		} else if (inCinema === "no") {
			inCinema = false;
		}
        // create a new movie object from the form
        const newMovie = {
		title: form.title.value,
		runtime: form.runtime.value,
		score: form.score.value,
		director: form.director.value,
		actorStars: form.actorStars.value.split(","),
		year: form.year.value,
		poster: form.poster.value,
		trailer: form.trailer.value,
		genreTags: form.genreTags.value.split(","),
		description: form.description.value,
        inCinema: inCinema,
        };
        // call the createMovie function with the new movie object
        createMovie(newMovie);
        document.querySelector("#dialog-modal").close();
	}

export { prepareData, updateMovieClicked, createMovieClicked };