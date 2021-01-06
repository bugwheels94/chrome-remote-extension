console.log("HI2");

// chrome.runtime.onMessage.addListener(function (message, sender, callback) {

// });
// console.log(chrome)
// chrome.runtime.onConnect.addListener(function(port) {
//   console.log("PORT", port);
// })
// var port = chrome.runtime.connect({name: "knockknock"});
// console.log(port)
// chrome.runtime.onConnect.addListener(function(port) {
//   port.onMessage.addListener(function(msg) {
//     console.log(msg)
//   });
// });
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if(request.ping) { sendResponse({pong: true}); return; }
  /* Content script action */
  const message = request.event
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
	} else if (message === "scroll") {
    const { deltaX, deltaY } = request
    let left, top;
    if (deltaX > 0) {
      left = 75     
    } else {
      left = -75
    }
    if (deltaY > 0) {
      top = 75      
    } else {
      top = -75
    }
    window.scrollBy({
      top, left
    })
  }
  sendResponse({})
  return true;
});