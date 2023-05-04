// import modules
import { updateMovie } from "./rest-api.js";
import { getVideoId, createEmbedLink } from "./youtube-helpers.js";
import { displayErrorDialog } from "./helpers-module.js";
import { updateGrid } from "./grid-module.js";

// update movie function
function updateMovieDialog(movie) {
  // Get dialog and dialog content
	const dialog = document.querySelector("#dialog-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");
  // get video id and create embedable videolink
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
  // insert html into dialog content
	dialogContent.innerHTML = html;

	// sets clicked in cinema radio button
	if (movie.inCinema) {
		document.querySelector("#in-cinema-yes").setAttribute("checked", true);
	} else {
		document.querySelector("#in-cinema-no").setAttribute("checked", true);
	}
  // add eventlistener to form submit
	document.querySelector("#form").addEventListener("submit", updateMovieFeedbackDialog);

	function updateMovieFeedbackDialog(event) {
		event.preventDefault();
		// get form data and create updated movie object
		const form = event.target;
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
			inCinema: form.inCinema.value,
			id: movie.id,
		};

		if (updatedMovie.inCinema === "yes") {
			updatedMovie.inCinema = true;
		} else if (updatedMovie.inCinema === "no") {
			updatedMovie.inCinema = false;
		}

		// HTML to insert into dialog content
		const html = /*html*/ `
		<div class="update-feedback-grid">
			
				<section class="update-feedback-top">
          <h2>Updated movie details</h2>
        </section>
			<section class="update-feedback-middle">
        <div>
          <p><b>Title:</b> ${updatedMovie.title}</p>
          <p><b>Runtime:</b> ${updatedMovie.runtime} minutes</p>
          <p><b>Year:</b> ${updatedMovie.year}</p>
          <p><b>Score:</b> ${updatedMovie.score}</p>
          <p><b>Currently in cinema:</b> ${updatedMovie.inCinema ? "Yes" : "No"}</p>
        </div>
        <div>
        <p><b>Director:</b> ${updatedMovie.director}</p>
        <p><b>Star actors:</b> ${updatedMovie.actorStars}</p>
        <p><b>Genres:</b> ${updatedMovie.genreTags}</p>
        </div>
      </section>
			<p><b>Description:</b> ${updatedMovie.description}</p>
			<section class="update-feedback-bottom">
        <div>
          <p><b>Poster:</b></p> <img src="${updatedMovie.poster}" alt="POSTER MISSING" />
        </div>
        <div class="iframe-wrapper">
          <p><b>Trailer:</b></p> <iframe src="${updatedMovie.trailer}"></iframe>
        </div>
      </section>
			<div class="btn-wrapper">
				<button id="update-confirm-btn">Confirm</button>
				<button id="update-back-btn">Back</button>
			</div>
		</div>
		`;
    // insert html into dialog content
		dialogContent.innerHTML = html;

		// Button event listeners
		document.querySelector("#update-confirm-btn").addEventListener("click", updateMovieFeedbackConfirm);
		document.querySelector("#update-back-btn").addEventListener("click", updateMovieFeedbackBack);

    // update movie in firebase and update grid if successful
		async function updateMovieFeedbackConfirm() {
			dialog.close();

			const response = await updateMovie(updatedMovie);

			if (response.ok) {
				console.log("Movie successfully updated in Firebase! 🔥");
				updateGrid();
			} else {
				console.error(`Something went wrong with PUT request😥: ${response.status}, ${response.statusText}`);
				const errorMessage = "The movie could not be updated. Please try again later.";
				displayErrorDialog(errorMessage);
			}
		}
    // shows movie dialog with original values
		function updateMovieFeedbackBack() {
			updateMovieDialog(movie);
		}
	}
}

export { updateMovieDialog };
