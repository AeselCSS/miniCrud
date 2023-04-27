// import
import { getMovies } from "./crud-operations.js";
import { updateMovieClicked, createMovieClicked } from "./crud-helpers.js";

// ===== DOM Manipulation - GRID =====
// Update grid with movies from database
async function updateGrid() {
	const moviesArray = await getMovies(endpoint);
	showMovies(moviesArray);
}
// Shows all movies in grid
function showMovies(movies) {
	// clear grid
	document.querySelector("#movie-grid").innerHTML = "";
	// loop through movies
	for (const movie of movies) {
		// call showMovie with movie as argument
		showMovie(movie);
	}
}
// Create a movie in the grid - called from showMovies
function showMovie(movie) {
	const moviesContainer = document.querySelector("#movie-grid");
	const movieHTML = /*html*/ `
  <article class="grid-item" > 
  <img src="${movie.poster}" >
  </article>
  `;
	moviesContainer.insertAdjacentHTML("beforeend", movieHTML);
	document.querySelector("#movie-grid article:last-child").addEventListener("click", () => {
		showMovieDialog(movie);
	});
}

// ===== DOM Manipulation - DIALOGS =====

// Show dialog when movie is clicked
function showMovieDialog(movie) {
	document.querySelector("#dialog-modal").innerHTML = "";

	const genreString = getGenreTagsAsString(movie.genreTags);

	const section = /*html*/ `
	<section class="movie-details-section">
        <article class="movie-details-functions">
            <button id="movie-update-btn">Update details</button>
            <button id="movie-remove-btn">Remove</button>
        </article>

        <article class="movie-details-header">
            <p>${movie.title}</p>
            <p>${movie.year}</p>
            <p>${movie.runtime} Minutes</p>
            <p>${movie.score}</p>
        </article>

        <article class="movie-details-main">
            <div><img src="${movie.poster}"></div>
            <div><iframe src="${movie.trailer}"></iframe></div>
        </article>

        <article class="movie-details-other">
            <div>
                <p>${genreString}</p>
                <p>${movie.director}</p>
                <p>${movie.description}</p>
            </div>
            <div>
                <p>Actors:</p>
                <ul id="movie-actor-list"></ul>
            </div>
        </article>
    </section>
    `;

	document.querySelector("#dialog-modal").insertAdjacentHTML("beforeend", section);
	populateActorList(movie.actorStars);

	// Add eventlisteners to buttons
	document.querySelector("#movie-update-btn").addEventListener("click", () => {
		updateMovieDialog(movie);
	});
	document.querySelector("#movie-remove-btn").addEventListener("click", () => {
		deleteMovieDialog(movie);
	});

	document.querySelector("#dialog-modal").showModal();
}

// Show dialog for creating a movie
// Shows dialog for Add Movie
function showAddMovieDialog() {
    // Clear dialog
	document.querySelector("#dialog-modal").innerHTML = "";

	const html = /*html*/ `
  <h2>Create a New Movie</h2>
        <form id="form" class="dialog-create-movie">

          <label for="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Title of movie" required />

          <label for="runtime">Movie length:</label>
          <input type="number" id="runtime" name="runtime" placeholder="runtime in min" required/>

          <label for="score">Score:</label>
          <input type="number" id="score" name="score" placeholder="Rating" min="0" max="10" step="0.1" required />

          <label for="director">Director:</label>
          <input type="text" id="director" name="director" placeholder="Director" required/>

          <label for="actors">Star Actors:</label>
          <input type="text" id="actors" name="actorStars" placeholder="Name of star actors" required/>

          <label for="year">Year of premiere:</label>
          <input type="number" id="year" name="year" placeholder="Year released" required/>

          <label for="poster">Poster:</label>
          <input type="url" id="poster" name="poster" placeholder="URL link" required />

          <label for="trailer">Trailer:</label>
          <input type="url" id="trailer" name="trailer" placeholder="URL link" required/>

          <label for="genre">Genre:</label>
          <input type="text" id="genre" name="genreTags" placeholder="write the genre(s)" required/>

          <label for="description">Movie description:</label>
          <input type="text" id="description" name="description" placeholder="Description" required/>

          <label for=""> is the movie in cinema:</label>
          <label for="in-cinema-yes">Yes
          <input type="radio" id="in-cinema-yes" name="inCinema" value="yes" required/>
          </label>
          
           <label for="inCinema-no">No
           <input type="radio" id="in-cinema" name="inCinema" value="no" required/>
           </label>
          <button>Add this movie</button>
        </form>
  `;

	document.querySelector("#dialog-modal").insertAdjacentHTML("beforeend", html);
	document.querySelector("#form").addEventListener("submit", createMovieClicked);
	document.querySelector("#dialog-modal").showModal();
}

// Show dialog for updating a movie
function updateMovieDialog(movie) {
	console.log(movie);
    const dialog = document.querySelector("#dialog-modal");

	dialog.innerHTML = "";

	const html = /*html*/ `
  <h2>Update Movie</h2>
        <form id="form" class="dialog-update-movie">

          <label for="title">Title:</label>
          <input type="text" id="title" name="title" placeholder="Title of movie" value='${movie.title}' required />

          <label for="runtime">Movie length:</label>
          <input type="number" id="runtime" name="runtime" placeholder="runtime in min" value='${movie.runtime}' required/>

          <label for="score">Score:</label>
          <input type="number" id="score" name="score" placeholder="Rating" min="1" max="10" step="0.1" value='${movie.score}' required/>

          <label for="director">Director:</label>
          <input type="text" id="director" name="director" placeholder="Director" value='${movie.director}' required/>

          <label for="actors">Star Actors:</label>
          <input type="text" id="actors" name="actorStars" placeholder="Name of star actors" value='${movie.actorStars}' required/>

          <label for="year">Year of premiere:</label>
          <input type="number" id="year" name="year" placeholder="Year released" value='${movie.year}' required/>

          <label for="poster">Poster:</label>
          <input type="url" id="poster" name="poster" placeholder="URL link" value='${movie.poster}'required/>

          <label for="trailer">Trailer:</label>
          <input
            type="url" id="trailer" name="trailer" placeholder="URL link" value='${movie.trailer}' required/>

          <label for="genre">Genre:</label>
          <input type="text" id="genre" name="genreTags" placeholder="write the genre(s)" value='${movie.genreTags}' required/>

          <label for="description">Movie description:</label>
          <input type="text" id="description" name="description" placeholder="Description" value='${movie.description}' required/>

          <label for=""> is the movie in cinema:</label>
          <label for="in-cinema-yes">Yes
          <input type="radio" id="in-cinema-yes" name="inCinema" value="yes" required/>
          </label>
          
           <label for="inCinema-no">No 
           <input type="radio" id="in-cinema-no" name="inCinema" value="no" required/>
           </label>

            <input type="hidden" id="id" name="id" value='${movie.id}' required/>

          <button>Update this movie</button>
        </form>
  `;

	dialog.insertAdjacentHTML("beforeend", html);

	if (movie.inCinema) {
		document.querySelector("#in-cinema-yes").setAttribute("checked", true);
	} else {
		document.querySelector("#in-cinema-no").setAttribute("checked", true);
	}

	document.querySelector("#form").addEventListener("submit", updateMovieClicked);

    dialog.showModal();
}

// Error handling - display error message in a dialog
function displayErrorDialog(message) {
	const dialog = document.querySelector("#dialog-modal");
	const html = /*html*/ `
    <h2>Something went wrong</h2>
    <p>${message}</p>
    <button id="close-dialog">Close</button>
    `;
	dialog.innerHTML = html;

	const closeDialogButton = document.querySelector("#close-dialog");
	closeDialogButton.addEventListener("click", () => {
		dialog.innerHTML = "";
		dialog.close();
	});
}

// ===== DOM Manipulation - HELPERS =====
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


// exports
export {
    updateGrid,
    updateMovieDialog,
    createMovieDialog,
    displayErrorDialog,
    showAddMovieDialog
}