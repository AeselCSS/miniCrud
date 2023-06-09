import { deleteMovie } from "./rest-api.js";
import { updateGrid } from "./grid-module.js";
import { displayErrorDialog } from "./helpers-module.js";

//---------- Delete movie functions ---------- / /
async function deleteMovieDialog(movie) {
	const dialog = document.querySelector("#dialog-modal");
	const dialogContent = document.querySelector("#dialog-modal-content");
	// console.log(movie.id);

	// HTML to insert
	const html = /*html*/ `
    <h2>Do you want to delete</h2>
    <h1 id="dialog-delete-movie-title">${movie.title}</h1>

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

export { deleteMovieDialog };
