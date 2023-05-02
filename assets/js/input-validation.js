import { getMovies, endpoint } from "../../app.js";

// =================== FORM INPUT VALIDATION =====================
// validate form input and set a green border if input is valid and a red border if input is invalid
// also disable submit button if input is invalid and enable it if input is valid
// also display error message if input is invalid

// validate input for create movie form
async function validateInput(input) {
	const inputValue = input.value.trim();

	// check if field is empty
	checkEmptyField();
	// check if the combination of input from title, year and director already exists in the database
	await checkIfAlreadyInDatabase();
	// check if poster link is a image url
	checkIfPosterIsImageUrl();
	// check if trailer link is a supported youtube link
	checkIfTrailerIsSupportedLink();
	// check if poster link and trailer link begins with https:// or http://
	checkIfUrlIsValid();
	// disable submit button if any of the input fields are invalid
	disableOrEnableSubmit();

	function disableOrEnableSubmit() {
		const submitButton = document.querySelector("#submit-btn");
		if (document.querySelectorAll(".invalid").length > 0) {
			submitButton.disabled = true;
		} else {
			submitButton.disabled = false;
		}
	}

	function checkIfUrlIsValid() {
		if (input.id === "poster" || input.id === "trailer") {
			const link = input.value;
			if (!link.startsWith("https://") && !link.startsWith("http://")) {
				invalid("Please enter a link that begins with either http:// or https://.");
			} else {
				valid();
			}
		}
	}

	function checkIfTrailerIsSupportedLink() {
		if (input.id === "trailer") {
			const trailerLink = trailer.value;
			// supported YouTube formats are: standard video link, short link, embed link, timestamped link, channel link and playlist link
			const supportedLinks = [
				"youtu.be/",
				"watch?v=",
				"embed/",
				"t=",
				"channel/",
				"playlist?list=", // playlist link
			];
			// check if trailer link contains any of the supported links
			if (!supportedLinks.some((link) => trailerLink.includes(link))) {
				// some() returns true if at least one element in the array passes the test
				invalid("Please enter a valid youtube link.");
			} else {
				valid();
			}
		}
	}

	function checkIfPosterIsImageUrl() {
		if (input.id === "poster") {
			// get poster link
			const posterLink = poster.value;
			// split poster link into an array
			const posterLinkSplit = posterLink.split(".");
			// get the last element in the array which is the file extension
			const posterLinkExtension = posterLinkSplit[posterLinkSplit.length - 1];
			// create an array with valid image extensions
			const imageExtensions = ["jpg", "jpeg", "png", "gif", "svg", "webp", "bmp"];

			// check if the file extension is valid
			if (!imageExtensions.includes(posterLinkExtension)) {
				invalid("Please enter a valid image url.");
			} else {
				valid();
			}
		}
	}

	async function checkIfAlreadyInDatabase() {
		if (input.id === "title" || input.id === "year" || input.id === "director") {
			const movies = await getMovies(endpoint);
			const filteredMovies = movies.filter((movie) => {
				return movie.title === title.value && movie.year === year.value && movie.director === director.value;
			});
			if (filteredMovies.length > 0) {
				const inputFields = ["#title", "#year", "#director"];
				inputFields.forEach((inputField) => {
					const input = document.querySelector(inputField);
					console.log(input);
					input.classList.add("invalid");
					input.classList.remove("valid");
					input.setCustomValidity("Movie is already in the database.");
				});
			}
		}
	}

	function checkEmptyField() {
		if (!inputValue) {
			invalid("Please fill out this field.");
		} else {
			valid();
		}
	}

	function valid() {
		input.classList.add("valid");
		input.classList.remove("invalid");
		input.setCustomValidity("");
	}

	function invalid(message) {
		input.classList.add("invalid");
		input.classList.remove("valid");
		input.setCustomValidity(message);
	}
}

export { validateInput };
