"use strict";

import { validateInput } from "./assets/js/input-validation.js";

let timeoutIds = [];

window.addEventListener("load", start);
export const endpoint = "https://byca-crud-default-rtdb.europe-west1.firebasedatabase.app/";

async function start() {
	const moviesArray = await getMovies(endpoint);

	showMovies(moviesArray);

	document.querySelector("#btn-add-movie").addEventListener("click", showAddMovieModal);

	document.querySelector("#search-bar").addEventListener("input", searchThis);
	document.querySelector("#filter").addEventListener("change", searchThis);

	function searchThis(event) {
		const filter = document.querySelector("#filter").value;
		const searchBarValue = document.querySelector("#search-bar").value;

		searchMovies(searchBarValue, filter);
	}

	closeDialogEventListener();

	document.querySelector("#sort").addEventListener("change", sortBy);

	function sortBy(event) {
		const selectedSort = document.querySelector("#sort").value;
		console.log(selectedSort);
		sortMovies(selectedSort);
	}

	showRandomTopMovie(moviesArray)
}

export async function getMovies(url) {
	const response = await fetch(`${url}movies.json`);
	const data = await response.json();
	const preparedData = prepareData(data);
	return preparedData;
}

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

// Shows dialog for movie clicked
function showMovieDialog(movie) {
	const dialogContent = document.querySelector("#dialog-modal-content");
	dialogContent.innerHTML = "";

	const genreString = getGenreTagsAsString(movie.genreTags);
	const videoId = getVideoId(movie.trailer);
	const embedableVideo = createEmbedLink(videoId);

	const section = /*html*/ `
	<article>
        <div>
			<button id="movie-remove-btn"><i class="fa-solid fa-trash-can"></i></button>
            <button id="movie-update-btn"><i class="fa-solid fa-pen-to-square"></i></button>
        </div>

        <div class="movie-details-header">
            <h2>${movie.title}</h2>
        </div>

		<div class="movie-details-top">
		<div class="left">
			<p><b>Year of release:</b> ${movie.year}</p>
        	<p><b>Runtime:</b> ${movie.runtime} Minutes</p>
        	<p><b>Rating:</b> ${movie.score}</p>
		</div>

		<div class="middle">
        	<p><b>Genre:</b> ${genreString}</p>
        	<p><b>Director:</b> ${movie.director}</p>
		</div>

		<div class="right">
            <p><b>Actors:</b></p>
            <ul id="movie-actor-list"></ul>
        </div>

		</div>

        <div class="movie-details-middle">
            <div>
                <img src="${movie.poster}">
            </div>

            <div>
                <iframe src="${embedableVideo}"></iframe>
            </div>
        </div>

        <div class="movie-details-bottom">
            
                <p><b>Description:</b> ${movie.description}</p>
            
        </div>
    </article>
    `;

	dialogContent.insertAdjacentHTML("beforeend", section);
	populateActorList(movie.actorStars);

	document.querySelector("#movie-update-btn").addEventListener("click", () => updateMovieDialog(movie));
	document.querySelector("#movie-remove-btn").addEventListener("click", () => deleteMovieDialog(movie));
	document.querySelector("#dialog-modal").showModal();
}

// Shows dialog for Add Movie
function showAddMovieModal() {
	const dialog = document.querySelector("#dialog-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");

	dialogContent.innerHTML = "";

	const html = /*html*/ `
  <h2>Create a New Movie</h2>
        <form id="form" class="dialog-create-movie">

          <label for="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Title of movie" required />

          <label for="runtime">Movie length:</label>
          <input
            type="number" id="runtime" name="runtime" placeholder="Runtime in minutes" required
          />

          <label for="score">Score:</label>
          <input
            type="number" id="score" name="score" placeholder="Rate between 0,0-10" min="0" max="10" step="0.1" required
          />

          <label for="director">Director:</label>
          <input type="text" id="director" name="director" placeholder="Director" required
          />

          <label for="actors">Star Actors:</label>
          <input type="text" id="actors" name="actorStars" placeholder="Name of star actors (actor1, actor2, ...)" required
          />

          <label for="year">Year of premiere:</label>
          <input type="number" id="year" name="year" placeholder="Year of release" required
          />

          <label for="poster">Poster:</label>
          <input type="url" id="poster" name="poster" placeholder="URL link" required />

          <label for="trailer">Trailer:</label>
          <input type="url" id="trailer" name="trailer" placeholder="URL link" required
          />

          <label for="genre">Genre:</label>
          <input type="text" id="genre" name="genreTags" placeholder="Write the genre (genre1, genre2, ...)" required
          />

          <label for="description">Movie description:</label>
          <input type="text" id="description" name="description" placeholder="Description" required
          />

          <label for=""> Currently in cinema?</label>
          <label for="in-cinema-yes">Yes 
		  <input type="radio" id="in-cinema-yes" name="inCinema" value="yes" required
          />
		  </label>
          
           <label for="inCinema-no">No 
		   <input type="radio" id="in-cinema" name="inCinema" value="no" required  
          />
		  </label>
        
          <div class="btn-wrapper"><button id="submit-btn">Add this movie</button></div>
        </form>
  `;
	dialogContent.insertAdjacentHTML("beforeend", html);

	const form = dialogContent.querySelector("#form")
	const fieldsToValidate = form.querySelectorAll(
		"#title, #runtime, #score, #director, #actors, #year, #poster, #trailer, #genre, #description"
	);
	fieldsToValidate.forEach((field) => {
		field.addEventListener("input", () => {
			validateInput(field);
		});
	});

	document.querySelector("#form").addEventListener("submit", createMovieClicked);
	dialog.showModal();
}

function createMovieClicked(event) {
	event.preventDefault();
	console.log(event);

	document.querySelector("#dialog-modal").close();

	const form = event.target;
	console.log(form);

	const title = form.title.value;
	const runtime = form.runtime.value;
	const score = form.score.value;
	const director = form.director.value;
	const actorStars = form.actorStars.value.split(",");
	const year = form.year.value;
	const poster = form.poster.value;
	const trailer = form.trailer.value;
	const genreTags = form.genreTags.value.split(",");
	const description = form.description.value;
	let inCinema = form.inCinema.value;

	if (inCinema === "yes") {
		inCinema = true;
	} else if (inCinema === "no") {
		inCinema = false;
	}

	createMovie(title, runtime, score, director, actorStars, year, poster, trailer, genreTags, description, inCinema);
}

async function createMovie(
	title,
	runtime,
	score,
	director,
	actorStars,
	year,
	poster,
	trailer,
	genreTags,
	description,
	inCinema
) {
	const newMovie = {
		title,
		runtime,
		score,
		director,
		actorStars,
		year,
		poster,
		trailer,
		genreTags,
		description,
		inCinema,
	};
	console.log(newMovie);
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

function getGenreTagsAsString(genreTags) {
	return genreTags.join(",");
}

function populateActorList(actors) {
	for (const actor of actors) {
		const html = /*html*/ `
        <li>${actor}</li>
        `;
		document.querySelector("#movie-actor-list").insertAdjacentHTML("beforeend", html);
	}
}

// ---------- Delete movie functions ---------- //

async function deleteMovieDialog(movie) {
	const dialog = document.querySelector("#dialog-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");
	// console.log(movie.id);

	// HTML to insert
	const html = /*html*/ `
    <h2>Are you sure you want to delete</h2>
    <p id="dialog-delete-movie-title">${movie.title}</p>

    <form method="dialog" id="form-delete-movie">

    <button type="button" class="btn-cancel">NO</button>
    <button>YES</button>
    
    </form>
  `;

	// Insert HTML
	dialogContent.innerHTML = html;

	// Event listener
	document.querySelector("#form-delete-movie").addEventListener("submit", deleteYesClicked);

	document.querySelector(".btn-cancel").addEventListener("click", deleteNoClicked);

	// Button functions
	async function deleteYesClicked(event) {
		event.preventDefault();
		deleteMovie(movie.id);

		dialog.close();
	}

	function deleteNoClicked() {
		dialog.close();
	}
}

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

// ---------- Update movie functions ---------- //

function updateMovieDialog(movie) {
	// console.log(movie);
	const dialog = document.querySelector("#dialog-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");

	const videoId = getVideoId(movie.trailer);
	const embedableVideo = createEmbedLink(videoId);

	// HTML to insert
	const html = /*html*/ `
  <h2>Update Movie</h2>
        <form id="form" class="dialog-update-movie">

          <label for="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Title of movie" value='${movie.title}' required />

          <label for="runtime">Movie length:</label>
          <input
            type="number"
            id="runtime"
            name="runtime"
            placeholder="Runtime in minutes"
            value='${movie.runtime}'
            required
          />

          <label for="score">Score:</label>
          <input
            type="number"
            id="score"
            name="score"
            placeholder="Rate between 0,0-10"
            min="1"
            max="10"
            step="0.1"
            value='${movie.score}'
            required
          />

          <label for="director">Director:</label>
          <input
            type="text"
            id="director"
            name="director"
            placeholder="Director"
            value='${movie.director}'
            required
          />

          <label for="actors">Star Actors:</label>
          <input
            type="text"
            id="actors"
            name="actorStars"
            placeholder="Name of star actors (actor1, actor2, ...)"
            value='${movie.actorStars}'
            required
          />

          <label for="year">Year of premiere:</label>
          <input
            type="number"
            id="year"
            name="year"
            placeholder="Year of release"
            value='${movie.year}'
            required
          />

          <label for="poster">Poster:</label>
          <input type="url" id="poster" name="poster" placeholder="URL link" value='${movie.poster}'
          required/>

          <label for="trailer">Trailer:</label>
          <input
            type="url"
            id="trailer"
            name="trailer"
            placeholder="URL link"
            value='${embedableVideo}'
            required
          />

          <label for="genre">Genre:</label>
          <input
            type="text"
            id="genre"
            name="genreTags"
            placeholder="Write the genre (genre1, genre2, ...)"
            value='${movie.genreTags}'
            required
          />

          <label for="description">Movie description:</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="Description"
            value='${movie.description}'
            required
          />

          <label for=""> is the movie currently in cinema:</label>
          <label for="in-cinema-yes">Yes <input
            type="radio"
            id="in-cinema-yes"
            name="inCinema"
            value="yes"
            required
          
           
          /></label>
          
           <label for="inCinema-no">No <input
            type="radio"
            id="in-cinema-no"
            name="inCinema"
            value="no"
            required
            
            
          /></label>
          

          <div class="btn-wrapper"><button>Update this movie</button></div>
        </form>
  `;

	dialogContent.innerHTML = html;

	// Sets clicked in cinema radio button
	if (movie.inCinema) {
		document.querySelector("#in-cinema-yes").setAttribute("checked", true);
	} else {
		document.querySelector("#in-cinema-no").setAttribute("checked", true);
	}

	document.querySelector("#form").addEventListener("submit", updateMovieFeedbackDialog);

	function updateMovieFeedbackDialog(event) {
		event.preventDefault();

		// Form values to variables
		const form = event.target;

		const title = form.title.value;
		const runtime = form.runtime.value;
		const score = form.score.value;
		const director = form.director.value;
		const actorStars = form.actorStars.value.split(",");
		const year = form.year.value;
		const poster = form.poster.value;
		const trailer = form.trailer.value;
		const genreTags = form.genreTags.value.split(",");
		const description = form.description.value;
		let inCinema = form.inCinema.value;
		const id = movie.id;

		if (inCinema === "yes") {
			inCinema = true;
		} else if (inCinema === "no") {
			inCinema = false;
		}

		// HTML to insert
		const html = /*html*/ `
		<div class="update-feedback-body">
			<p>
				<h2>Updated movie details</h2>
			</p>
			<p><b>Title:</b> ${title}</p>
			<p><b>Runtime:</b> ${runtime} minutes</p>
			<p><b>Year:</b> ${year}</p>
			<p><b>Director:</b> ${director}</p>
			<p><b>Star actors:</b> ${actorStars}</p>
			<p><b>Genres:</b> ${genreTags}</p>
			<p><b>Score:</b> ${score}</p>
			<p><b>Description:</b> ${description}</p>
			<p><b>Currently in cinema:</b> ${inCinema ? "Yes" : "No"}</p>
			<p><b>Poster:</b></p> <p><img src="${poster}" alt="POSTER MISSING" /></p>
			<p><b>Trailer:</b></p><p> <iframe src="${trailer}"></iframe></p>
			<div class="btn-wrapper">
				<button id="update-confirm-btn">Confirm</button>
				<button id="update-back-btn">Back</button>
			</div>
		</div>
		`;

		dialogContent.innerHTML = html;

		// Button event listeners
		document.querySelector("#update-confirm-btn").addEventListener("click", updateMovieFeedbackConfirm);

		document.querySelector("#update-back-btn").addEventListener("click", updateMovieFeedbackBack);

		function updateMovieFeedbackConfirm() {
			dialog.close();

			updateMovie(
				title,
				runtime,
				score,
				director,
				actorStars,
				year,
				poster,
				trailer,
				genreTags,
				description,
				inCinema,
				id
			);
		}

		function updateMovieFeedbackBack() {
			// Shows movie dialog with original values
			updateMovieDialog(movie);
		}
	}
}

async function updateMovie(
	title,
	runtime,
	score,
	director,
	actorStars,
	year,
	poster,
	trailer,
	genreTags,
	description,
	inCinema,
	id
) {
	const updatedMovie = {
		title,
		runtime,
		score,
		director,
		actorStars,
		year,
		poster,
		trailer,
		genreTags,
		description,
		inCinema,
	};

	// Parses into json
	const json = JSON.stringify(updatedMovie);

	// Updates/replaces object in database
	const response = await fetch(`${endpoint}movies/${id}.json`, {
		method: "PUT",
		body: json,
	});

	if (response.ok) {
		console.log("Movie successfully updated in Firebase! 🔥");
		updateGrid();
	} else {
		console.log("Something went wrong with PUT request ☹");
		const errorMessage = "The movie could not be updated. Please try again later.";
		displayErrorDialog(errorMessage);
	}
}

// Error handling - display error message in a dialog
function displayErrorDialog(message) {
	const dialog = document.querySelector("#dialog-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");
	const html = /*html*/ `
    <h2>Something went wrong</h2>
    <p>${message}</p>
    `;
	dialogContent.innerHTML = html;
	dialog.showModal();
}

// Close dialog
function closeDialogEventListener() {
	const closeDialogButton = document.querySelector("#btn-close-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");
	const dialogModal = document.querySelector("#dialog-modal");
	closeDialogButton.addEventListener("click", () => {
		dialogContent.innerHTML = "";
		dialogModal.close();
	});
}

/*=====================FILTER & SEARCH BAR========================*/
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
/*=====================FILTER & SEARCH BAR SLUT========================*/

/*============================ SORT FUNCTIONS =================================*/

async function sortMovies(dropDownValue) {
	const movies = await getMovies(endpoint);

	if (dropDownValue === "year-new") {
		const sortedByNewestYear = movies.sort(sortYearNew);
		showMovies(sortedByNewestYear);
	} else if (dropDownValue === "year-old") {
		const sortedByOldestYear = movies.sort(sortYearOld);
		showMovies(sortedByOldestYear);
	} else if (dropDownValue === "rating-des") {
		const sortedHighestRate = movies.sort(sortHighestRating);
		console.log(sortedHighestRate);
		showMovies(sortedHighestRate);
	} else if (dropDownValue === "rating-asc") {
		const sortedLowestRating = movies.sort(sortLowestRating);
		showMovies(sortedLowestRating);
	}
}

function sortYearNew(movie1, movie2) {
	return movie2.year - movie1.year;
}

function sortYearOld(movie1, movie2) {
	return movie1.year - movie2.year;
}

function sortHighestRating(movie1, movie2) {
	return movie2.score - movie1.score;
}

function sortLowestRating(movie1, movie2) {
	return movie1.score - movie2.score;
}

// ======================= YOUTUBE ===========================

// youtube video id retriever
function getVideoId(link) {
	let videoId;
	if (link.includes("youtu.be/")) { // short link
		videoId = link.split("youtu.be/")[1].split("?")[0];
	} else if (link.includes("watch?v=")) { // standard link
		videoId = link.split("watch?v=")[1].split("&")[0];
	} else if (link.includes("t=")) { // timestamped link
		videoId = link.split("v=")[1].split("&")[0];
	} else if (link.includes("channel/")) { // channel link
		videoId = link.split("channel/")[1].split("?")[0];
	} else if (link.includes("playlist?list=")) { // playlist link
		videoId = link.split("playlist?list=")[1].split("&")[0];
	} else if (link.includes("embed/")) { // embed link
		videoId = link.split("embed/")[1].split("?")[0];
	}
	return videoId;
}

// create youtube embed link
function createEmbedLink(videoId) {
	const embedLink = `https://www.youtube.com/embed/${videoId}`;
	return embedLink;
}


/* ============== TOP MOVIE GENERATOR ====================*/

function showRandomTopMovie(movies) { 

	const randomNumber = Math.floor(Math.random() * movies.length);
	const videoId = getVideoId(movies[randomNumber].trailer);
	const embedableVideo = createEmbedLink(videoId);

	document.querySelector("#top-movie-iframe").src = embedableVideo;
	document.querySelector("#top-movie-img").src = movies[randomNumber].poster;

	
}
