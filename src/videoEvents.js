export const initializeVideoEvents = (socket) => {
	socket.on("playVideo", ({ id }, callback) => {
		// ensureSendMessage(id, { event: 'play'}, callback)
		ensureSendMessage(id, { event: "play" }, callback);
	});
	socket.on("fullscreenVideo", ({ id }, callback) => {
		ensureSendMessage(id, { event: "fullscreen"}, callback);
	});
	socket.on("scroll", (id, coordinates, callback) => {
		ensureSendMessage(id, {
			event: 'scroll',
			coordinates
		}, callback);
	});
	socket.on("searchSite", (info, callback) => {
		ensureSendMessage(info.id, {
			event: 'searchSite',
			value: info.value
		}, callback);
	});
};

function ensureSendMessage(tabId, message, callback){
  chrome.tabs.sendMessage(tabId, {ping: true}, function(response){
    if(response && response.pong) { // Content script ready
      chrome.tabs.sendMessage(tabId, message, callback);
    } else { // No listener on the other end
      chrome.tabs.executeScript(tabId, {file: "/public/contentScript.js"}, function(){
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
