"use strict";
import { showAddMovieModal } from "./assets/js/create-movie-modal.js";
import { endpoint, deleteMovie, getMovies } from "./assets/js/rest-api.js";
import { updateMovieDialog } from "./assets/js/update-movie-modal.js";

let timeoutIds = [];

window.addEventListener("load", start);

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

	showRandomTopMovie(moviesArray);
}

export async function updateGrid() {
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
		const response = await deleteMovie(movie.id);

		if (response.ok) {
			console.log("Movie was succesfully deleted from Firebase! 🔥");
			//Call updateGrid function fetch data again.
			updateGrid();
		} else {
			console.error(`Something went wrong with DELETE request ☹: ${response.status}, ${response.statusText}`);
			const errorMessage = "The movie could not be deleted. Please try again later.";
			displayErrorDialog(errorMessage);
		}

		dialog.close();
	}

	function deleteNoClicked() {
		dialog.close();
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

// ======================= YOUTUBE ===========================

// youtube video id retriever
function getVideoId(link) {
	let videoId;
	if (link.includes("youtu.be/")) {
		// short link
		videoId = link.split("youtu.be/")[1].split("?")[0];
	} else if (link.includes("watch?v=")) {
		// standard link
		videoId = link.split("watch?v=")[1].split("&")[0];
	} else if (link.includes("t=")) {
		// timestamped link
		videoId = link.split("v=")[1].split("&")[0];
	} else if (link.includes("channel/")) {
		// channel link
		videoId = link.split("channel/")[1].split("?")[0];
	} else if (link.includes("playlist?list=")) {
		// playlist link
		videoId = link.split("playlist?list=")[1].split("&")[0];
	} else if (link.includes("embed/")) {
		// embed link
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
