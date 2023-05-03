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

export { getVideoId, createEmbedLink };
