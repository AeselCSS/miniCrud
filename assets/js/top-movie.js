import { getVideoId, createEmbedLink } from "./youtube-helpers.js";

/* ============== TOP MOVIE GENERATOR ====================*/

function showHighlightedMovie(movies) {
	const randomNumber = Math.floor(Math.random() * movies.length);
	const videoId = getVideoId(movies[randomNumber].trailer);
	const embedableVideo = createEmbedLink(videoId);

	document.querySelector("#top-movie-iframe").src = embedableVideo;
	document.querySelector("#top-movie-img").src = movies[randomNumber].poster;
}

export { showHighlightedMovie };
