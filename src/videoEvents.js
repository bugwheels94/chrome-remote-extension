export const initializeVideoEvents = (socket) => {
	console.log("KK")
	socket.on("playVideo", ({ id }, callback) => {
		console.log("Play Pause Video in ", id)
		// ensureSendMessage(id, { event: 'play'}, callback)
		ensureSendMessage(id, { event: "play" }, callback);
	});
	socket.on("fullscreenVideo", ({ id }, callback) => {
		console.log("Fullscreen Video in ", id)
		ensureSendMessage(id, { event: "fullscreen"}, callback);
	});
	socket.on("scrollTab", (info, callback) => {
		console.log("Scroll Event ", info.id)
		ensureSendMessage(info.id, {
			event: 'scroll',
			...info
		}, callback);
	});
};

function ensureSendMessage(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
    if(response && response.pong) { // Content script ready
      chrome.tabs.sendMessage(tabId, message, callback);
    } else { // No listener on the other end
      chrome.tabs.executeScript(tabId, {file: "public/contentScript.js"}, function(){
        if(chrome.runtime.lastError) {
          console.error(chrome.runtime.lastError);
          throw Error("Unable to inject script into tab " + tabId);
        }
        // OK, now it's injected and ready
        chrome.tabs.sendMessage(tabId, message, callback);
      });
    }
  });
}
