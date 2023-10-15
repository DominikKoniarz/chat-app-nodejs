import livereload from "livereload";
import connectLiveReload from "connect-livereload";
import path from "path";

const useLivereload = (app) => {
	const liveReloadServer = livereload.createServer({
		// extraExts: ["ejs"],
		delay: 20,
	});

	liveReloadServer.watch([path.join("..", "public")]);
	liveReloadServer.server.once("connection", () => {
		setTimeout(() => {
			liveReloadServer.refresh("/");
		}, 250);
	});

	app.use(connectLiveReload());
};

export default useLivereload;
