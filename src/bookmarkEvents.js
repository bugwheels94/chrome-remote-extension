export const initializeBookmarkEvents = (socket) => {
	socket.on("createBookmark", (bookmark, callback) => {
		console.log("Creating Bookmark", bookmark)
		chrome.bookmarks.create(bookmark, (bookmark) => {
			callback(bookmark);
		});
	});
	socket.on("removeBookmark", ({ id }, callback) => {
		chrome.bookmarks.remove(id, callback);
	});
	socket.on("readBookmarks", async (callback) => {
		console.log("Remote wants to read Bookmarks");
		const bookmarks = await getAllBookmarks();
		console.log("Emitting Bookmarks", bookmarks);
		callback(bookmarks);
	});

	chrome.bookmarks.onCreated.addListener((id, bookmark) => {
		console.log("Created", bookmark);
		socket.emit("createdBookmark", bookmark);
	});
	chrome.bookmarks.onRemoved.addListener((id) => {
		console.log("Removed", id);
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
      console.log(rootBookmark)
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
  console.log(bookmark.url, bookmark.children)
	if (bookmark.url) bag.push(bookmark);
}
