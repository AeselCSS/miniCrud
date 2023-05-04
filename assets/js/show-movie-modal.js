// Import modules
import { updateMovieDialog } from "./update-movie-modal.js";
import { deleteMovieDialog } from "./delete-movie-modal.js";
import { getVideoId, createEmbedLink } from "./youtube-helpers.js";

// Shows dialog for movie details when a movie is clicked
function showMovieDialog(movie) {
	const dialogContent = document.querySelector("#dialog-modal-content");
	dialogContent.innerHTML = "";
	const genreString = getGenreTagsAsString(movie.genreTags);
	const videoId = getVideoId(movie.trailer);
	const embedableVideo = createEmbedLink(videoId);
	const html = /*html*/ `
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
        	<p><b>In cinemas: </b>${movie.inCinema ? "Yes" : "No"}</p>
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

            <div class="iframe-wrapper">
                <iframe src="${embedableVideo}"></iframe>
        </div>

        <div class="movie-details-bottom">
            
                <p><b>Description:</b> ${movie.description}</p>
            
        </div>
    </article>
    `;
	// Insert movie HTML into movie-grid
	dialogContent.insertAdjacentHTML("beforeend", html);
	populateActorList(movie.actorStars);
	// Add event listeners to buttons
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

export { showMovieDialog };
