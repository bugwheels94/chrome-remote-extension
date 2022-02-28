const path = require("path");

module.exports = {
	entry: {
		background: "./src/index.js",
		contentScript: "./src/contentScript.js",
	},
	// mode: 'development',
	mode: "production",
	watch: process.ENV === "DEVELOPMENT" ? true : false,
	output: {
		filename: "[name].js",
		path: path.resolve(__dirname, "dist"),
	},
};
