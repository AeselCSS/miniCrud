// import modules
import { getVideoId, createEmbedLink } from "./youtube-helpers.js";

// Show highlighted movie function
function showHighlightedMovie(movies) {
	// Get random number
	const randomNumber = Math.floor(Math.random() * movies.length);
	// Get video id and create embedable video
	const videoId = getVideoId(movies[randomNumber].trailer);
	const embedableVideo = createEmbedLink(videoId);
	// Show highlighted movie in top-movie section
	document.querySelector("#top-movie-iframe").src = embedableVideo;
	document.querySelector("#top-movie-img").src = movies[randomNumber].poster;
}

export { showHighlightedMovie };
