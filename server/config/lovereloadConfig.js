const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const path = require("path");

const useLivereload = (app) => {
	const liveReloadServer = livereload.createServer({
		// extraExts: ["ejs"],
		delay: 20,
	});

	liveReloadServer.watch([path.join(__dirname, "..", "public")]);
	liveReloadServer.server.once("connection", () => {
		setTimeout(() => {
			liveReloadServer.refresh("/");
		}, 250);
	});

	app.use(connectLiveReload());
};

module.exports = useLivereload;
