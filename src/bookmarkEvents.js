export const initializeBookmarkEvents = (socket) => {
	socket.on("createBookmark", (bookmark, callback) => {
		chrome.bookmarks.create(bookmark, (bookmark) => {
			callback(bookmark);
		});
	});
	socket.on("removeBookmark", ({ id }, callback) => {
		chrome.bookmarks.remove(id, callback);
	});
	socket.on("readBookmarks", async (callback) => {
		const bookmarks = await getAllBookmarks();
		callback(bookmarks);
	});

	chrome.bookmarks.onCreated.addListener((id, bookmark) => {
		socket.emit("createdBookmark", bookmark);
	});
	chrome.bookmarks.onRemoved.addListener((id) => {
		socket.emit("removedBookmark", {
			id,
		});
	});
	socket.on("connect", async () => {
		const bookmarks = await getAllBookmarks();
		socket.emit("bookmarks", bookmarks);
	});
};
function getAllBookmarks() {
	return new Promise((resolve, reject) => {
		chrome.bookmarks.getTree((rootBookmark) => {
      const bag = []
      collectLinks(rootBookmark[0], bag)
      resolve(bag)
		});
	});
}
function collectLinks(bookmark, bag) {
	if (bookmark.children) {
		for (var i = 0; i < bookmark.children.length; i++) collectLinks(bookmark.children[i], bag);
  }
	if (bookmark.url) bag.push(bookmark);
}
