
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.ping) {
		sendResponse({ pong: true });
		return true;
	}
	/* Content script action */
	const message = request.event;
	if (message == "play") {
		const video = document.querySelector("video");
		if (!video) return sendResponse({});
		if (video.paused == true) {
			video.play();
		} else {
			video.pause();
		}
	} else if (message === "fullscreen") {
		const video = document.querySelector("video");
		if (!video) return sendResponse({});
		if (window.innerHeight == screen.height) {
			document.exitFullscreen();
		} else {
			video.requestFullscreen();
		}
	} else if (message === "searchSite") {
		var input =
			document.querySelector("input[type='search']") ||
			document.querySelector("input[type='text']");
		input.value = request.value;
		input.focus();
	} else if (message === "scroll") {
		const coordinates = request.coordinates;
		if (coordinates.length === 0) return;
		const coordinate = coordinates[coordinates.length - 1];
		window.scrollBy(-5 * coordinate.x, -5 * coordinate.y);
	}
	sendResponse({});
	return true;
});
