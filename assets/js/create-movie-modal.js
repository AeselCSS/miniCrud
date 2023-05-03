import { validateInput } from "./input-validation.js";
import { createMovie } from "./rest-api.js";
import { updateGrid } from "../../app.js";
import { displayErrorDialog } from "./helpers-module.js";

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

	const form = dialogContent.querySelector("#form");
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

async function createMovieClicked(event) {
	event.preventDefault();

	document.querySelector("#dialog-modal").close();

	const form = event.target;

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
		inCinema: form.inCinema.value,
	};

	if (newMovie.inCinema === "yes") {
		newMovie.inCinema = true;
	} else if (newMovie.inCinema === "no") {
		newMovie.inCinema = false;
	}

	const response = await createMovie(newMovie);

	if (response.ok) {
		console.log("Movie successfully posted");
		updateGrid();
		//Call updateGrid function fetch data again.
	} else {
		console.error(`Failed to create movie: ${response.status}, ${response.statusText}`);
		const errorMessage = "The movie could not be created. Please try again later.";
		displayErrorDialog(errorMessage);
	}
}

export { showAddMovieModal };
